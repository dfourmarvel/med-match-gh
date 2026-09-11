/**
 * @jest-environment node
 */

let mockInsertResult: { error: unknown } = { error: null };
let mockServerSupabase: unknown = {
  from: () => ({ insert: () => Promise.resolve(mockInsertResult) })
};

jest.mock("@/lib/rate-limit", () => ({ rateLimit: jest.fn() }));
jest.mock("@/lib/supabase/server", () => ({ getCurrentUser: jest.fn() }));
jest.mock("@/lib/supabase", () => ({
  get serverSupabase() {
    return mockServerSupabase;
  },
  get hasSupabaseServiceRole() {
    return true;
  }
}));

import { POST } from "@/app/api/save-result/route";
import { rateLimit } from "@/lib/rate-limit";
import { buildAssessmentResult } from "@/lib/scoring";
import { assessmentQuestions } from "@/lib/assessment";
import { getCurrentUser } from "@/lib/supabase/server";
import { lockResult } from "@/lib/gating";

const mockedRateLimit = jest.mocked(rateLimit);
const mockedGetCurrentUser = jest.mocked(getCurrentUser);
const validResult = buildAssessmentResult(
  "medical-student",
  Object.fromEntries(assessmentQuestions.map((question) => [question.id, 5]))
);

function post(body: unknown) {
  return new Request("http://localhost/api/save-result", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

describe("POST /api/save-result", () => {
  beforeEach(() => {
    mockedRateLimit.mockResolvedValue({ allowed: true });
    mockInsertResult = { error: null };
    mockServerSupabase = { from: () => ({ insert: () => Promise.resolve(mockInsertResult) }) };
    // Signed in by default so the pre-existing assertions still exercise a save.
    mockedGetCurrentUser.mockResolvedValue({ id: "user-1" } as never);
  });

  it("saves and returns a Supabase share link", async () => {
    const response = await POST(post(validResult));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.mode).toBe("supabase");
    expect(body.data.url).toMatch(/^\/share\//);
  });

  it("falls back to local-only when Supabase is not configured", async () => {
    mockServerSupabase = null;

    const response = await POST(post(validResult));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.mode).toBe("local-only");
  });

  it("returns 500 when the insert fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    mockInsertResult = { error: { message: "insert boom", code: "23505" } };

    const response = await POST(post(validResult));
    expect(response.status).toBe(500);

    consoleSpy.mockRestore();
  });

  it("returns 400 for an invalid payload", async () => {
    const response = await POST(post({ nope: true }));
    expect(response.status).toBe(400);
  });

  it("returns 429 when rate limited", async () => {
    mockedRateLimit.mockResolvedValue({ allowed: false, retryAfterSeconds: 30 });

    const response = await POST(post(validResult));
    expect(response.status).toBe(429);
  });
});

describe("POST /api/save-result authorisation", () => {
  let inserted: Record<string, unknown> | null = null;

  beforeEach(() => {
    mockedRateLimit.mockResolvedValue({ allowed: true });
    mockedGetCurrentUser.mockResolvedValue({ id: "user-1" } as never);
    inserted = null;
    mockServerSupabase = {
      from: () => ({
        insert: (row: Record<string, unknown>) => {
          inserted = row;
          return Promise.resolve({ error: null });
        }
      })
    };
  });

  it("refuses a signed-out caller", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);
    const response = await POST(post(validResult));

    expect(response.status).toBe(401);
    expect(inserted).toBeNull();
  });

  // This route takes no answers, so it cannot re-score a locked payload the way
  // /api/quiz-results does. Storing one would write placeholder traits in as a
  // real profile and leave the share link locked to every viewer forever.
  it("refuses a locked payload even from a signed-in caller", async () => {
    const response = await POST(post(lockResult(validResult)));

    expect(response.status).toBe(400);
    expect(inserted).toBeNull();
  });

  it("stamps the row with the owner", async () => {
    const response = await POST(post(validResult));

    expect(response.status).toBe(200);
    expect((inserted as unknown as { user_id: string }).user_id).toBe("user-1");
  });
});

describe("POST /api/save-result publishing an existing row", () => {
  const RESULT_ID = "22222222-3333-4444-8555-666666666666";
  let updated: Record<string, unknown> | null = null;
  let ownerId: string | null = "user-1";
  const updateEqArgs: unknown[][] = [];

  beforeEach(() => {
    mockedRateLimit.mockResolvedValue({ allowed: true });
    mockedGetCurrentUser.mockResolvedValue({ id: "user-1" } as never);
    updated = null;
    ownerId = "user-1";
    updateEqArgs.length = 0;

    mockServerSupabase = {
      from: () => ({
        select: () => ({
          eq: () => ({ maybeSingle: () => Promise.resolve({ data: { user_id: ownerId }, error: null }) })
        }),
        update: (patch: Record<string, unknown>) => {
          updated = patch;
          return {
            eq: (...idArgs: unknown[]) => {
              updateEqArgs.push(idArgs);
              return {
                eq: (...ownerArgs: unknown[]) => {
                  updateEqArgs.push(ownerArgs);
                  return Promise.resolve({ error: null });
                }
              };
            }
          };
        },
        insert: () => Promise.resolve({ error: null })
      })
    };
  });

  it("publishes a row the caller owns and returns its share url", async () => {
    const response = await POST(post({ ...validResult, resultId: RESULT_ID }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.url).toBe(`/share/${RESULT_ID}`);
    expect(typeof (updated as unknown as { published_at: string }).published_at).toBe("string");
    // The update itself must stay scoped to the owner, not just the pre-check.
    expect(updateEqArgs).toEqual([
      ["id", RESULT_ID],
      ["user_id", "user-1"]
    ]);
  });

  // A row id travels in every share link, so publishing must not be reachable
  // for a row the caller does not own.
  it("refuses to publish a row owned by someone else", async () => {
    ownerId = "someone-else";
    const response = await POST(post({ ...validResult, resultId: RESULT_ID }));

    expect(response.status).toBe(403);
    expect(updated).toBeNull();
  });

  it("refuses to publish an unclaimed row", async () => {
    ownerId = null;
    const response = await POST(post({ ...validResult, resultId: RESULT_ID }));

    expect(response.status).toBe(403);
    expect(updated).toBeNull();
  });
});
