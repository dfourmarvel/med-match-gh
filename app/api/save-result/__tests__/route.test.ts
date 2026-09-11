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
