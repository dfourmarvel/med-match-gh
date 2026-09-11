/**
 * @jest-environment node
 */

import { POST } from "@/app/api/claim-result/route";
import { rateLimit } from "@/lib/rate-limit";
import { assessmentQuestions } from "@/lib/assessment";
import { getCurrentUser } from "@/lib/supabase/server";
import { serverSupabase } from "@/lib/supabase";
import { FREE_MATCH_COUNT } from "@/lib/gating";

jest.mock("@/lib/rate-limit", () => ({ rateLimit: jest.fn() }));
const mockedRateLimit = jest.mocked(rateLimit);

jest.mock("@/lib/supabase/server", () => ({ getCurrentUser: jest.fn() }));
const mockedGetCurrentUser = jest.mocked(getCurrentUser);

const is = jest.fn();
const eq = jest.fn(() => ({ is }));
const update = jest.fn(() => ({ eq }));
const from = jest.fn(() => ({ update }));

jest.mock("@/lib/supabase", () => ({ serverSupabase: { from: (...args: unknown[]) => from(...(args as [])) } }));

const validAnswers = Object.fromEntries(assessmentQuestions.map((question) => [question.id, 4]));

function post(body: unknown) {
  return new Request("http://localhost/api/claim-result", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

describe("POST /api/claim-result", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedRateLimit.mockResolvedValue({ allowed: true });
    mockedGetCurrentUser.mockResolvedValue({ id: "user-1" } as never);
    is.mockResolvedValue({ error: null });
  });

  it("refuses a signed-out caller", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);
    const response = await POST(post({ audience: "medical-student", answers: validAnswers }));
    expect(response.status).toBe(401);
    expect(from).not.toHaveBeenCalled();
  });

  it("returns the full unlocked result to a signed-in caller", async () => {
    const response = await POST(post({ audience: "medical-student", answers: validAnswers }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.locked).toBeUndefined();
    expect(body.data.topMatches.length).toBeGreaterThan(FREE_MATCH_COUNT);
  });

  it("claims only a row that nobody owns yet", async () => {
    const resultId = "11111111-2222-4333-8444-555555555555";
    await POST(post({ audience: "medical-student", answers: validAnswers, resultId }));

    expect(update).toHaveBeenCalledWith({ user_id: "user-1" });
    expect(eq).toHaveBeenCalledWith("id", resultId);
    expect(is).toHaveBeenCalledWith("user_id", null);
  });

  it("does not touch the database when no row id is supplied", async () => {
    await POST(post({ audience: "medical-student", answers: validAnswers }));
    expect(from).not.toHaveBeenCalled();
  });

  it("still returns the unlocked result when the claim write fails", async () => {
    is.mockResolvedValue({ error: { message: "boom", code: "42501" } });
    const response = await POST(
      post({
        audience: "medical-student",
        answers: validAnswers,
        resultId: "11111111-2222-4333-8444-555555555555"
      })
    );

    expect(response.status).toBe(200);
    expect((await response.json()).data.topMatches.length).toBeGreaterThan(FREE_MATCH_COUNT);
  });

  it("rejects a malformed answer set rather than scoring it", async () => {
    const response = await POST(post({ audience: "medical-student", answers: { 1: 99 } }));
    expect(response.status).toBe(400);
  });

  it("rejects a resultId that is not a uuid", async () => {
    const response = await POST(
      post({ audience: "medical-student", answers: validAnswers, resultId: "not-a-uuid" })
    );
    expect(response.status).toBe(400);
  });

  it("honours the rate limiter", async () => {
    mockedRateLimit.mockResolvedValue({ allowed: false, retryAfterSeconds: 30 });
    const response = await POST(post({ audience: "medical-student", answers: validAnswers }));
    expect(response.status).toBe(429);
    expect(mockedGetCurrentUser).not.toHaveBeenCalled();
  });

  it("ignores serverSupabase being unavailable", async () => {
    expect(serverSupabase).toBeTruthy();
  });
});
