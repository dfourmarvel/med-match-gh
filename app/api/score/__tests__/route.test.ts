/**
 * @jest-environment node
 */

import { POST } from "@/app/api/score/route";
import { rateLimit } from "@/lib/rate-limit";
import { assessmentQuestions } from "@/lib/assessment";
import { getCurrentUser } from "@/lib/supabase/server";
import { FREE_MATCH_COUNT, placeholderTraits } from "@/lib/gating";

jest.mock("@/lib/rate-limit", () => ({ rateLimit: jest.fn() }));
const mockedRateLimit = jest.mocked(rateLimit);

jest.mock("@/lib/supabase/server", () => ({ getCurrentUser: jest.fn() }));
const mockedGetCurrentUser = jest.mocked(getCurrentUser);

function post(body: unknown) {
  return new Request("http://localhost/api/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

const validAnswers = Object.fromEntries(assessmentQuestions.map((question) => [question.id, 4]));

describe("POST /api/score", () => {
  beforeEach(() => {
    mockedRateLimit.mockResolvedValue({ allowed: true });
    // Signed in by default so the pre-existing assertions still see a full result.
    mockedGetCurrentUser.mockResolvedValue({ id: "user-1" } as never);
  });

  it("returns the full result to a signed-in caller", async () => {
    const response = await POST(post({ audience: "medical-student", answers: validAnswers }));
    const body = await response.json();

    expect(body.data.locked).toBeUndefined();
    expect(body.data.topMatches.length).toBeGreaterThan(FREE_MATCH_COUNT);
  });

  it("trims the payload for a signed-out caller instead of relying on the UI to hide it", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const response = await POST(post({ audience: "medical-student", answers: validAnswers }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.locked).toBe(true);
    expect(body.data.topMatches).toHaveLength(FREE_MATCH_COUNT);
    expect(body.data.traitScores).toEqual(placeholderTraits());
  });

  it("never puts a locked match id on the wire for a signed-out caller", async () => {
    mockedGetCurrentUser.mockResolvedValue({ id: "user-1" } as never);
    const fullBody = await (await POST(post({ audience: "medical-student", answers: validAnswers }))).json();
    const hidden = fullBody.data.topMatches.slice(FREE_MATCH_COUNT).map((m: { specialtyId: string }) => m.specialtyId);
    expect(hidden.length).toBeGreaterThan(0);

    mockedGetCurrentUser.mockResolvedValue(null);
    const lockedText = await (await POST(post({ audience: "medical-student", answers: validAnswers }))).text();
    for (const id of hidden) {
      expect(lockedText).not.toContain(id);
    }
  });

  it("scores a valid submission", async () => {
    const response = await POST(post({ audience: "medical-student", answers: validAnswers }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.audience).toBe("medical-student");
    expect(body.data.topMatches.length).toBeGreaterThan(0);
  });

  it("rejects a submission with missing answers", async () => {
    const response = await POST(post({ audience: "medical-student", answers: {} }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
  });

  it("returns 429 when rate limited", async () => {
    mockedRateLimit.mockResolvedValue({ allowed: false, retryAfterSeconds: 30 });

    const response = await POST(post({ audience: "medical-student", answers: validAnswers }));

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("30");
  });

  it("returns 400 for malformed JSON", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const response = await POST(
      new Request("http://localhost/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{"
      })
    );

    expect(response.status).toBe(400);
    consoleSpy.mockRestore();
  });
});
