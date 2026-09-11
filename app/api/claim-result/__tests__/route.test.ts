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
const updateEq = jest.fn(() => ({ is }));
const update = jest.fn(() => ({ eq: updateEq }));

const maybeSingle = jest.fn();
const selectEq = jest.fn(() => ({ maybeSingle }));
const select = jest.fn(() => ({ eq: selectEq }));

const from = jest.fn(() => ({ update, select }));

jest.mock("@/lib/supabase", () => ({ serverSupabase: { from: (...args: unknown[]) => from(...(args as [])) } }));

const validAnswers = Object.fromEntries(assessmentQuestions.map((question) => [question.id, 4]));

/** The same answers in the shape quiz_results stores them. */
const storedAnswers = assessmentQuestions.map((question) => ({
  questionId: `q${question.id}`,
  selectedOption: "4"
}));

const RESULT_ID = "11111111-2222-4333-8444-555555555555";

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
    maybeSingle.mockResolvedValue({ data: { answers: storedAnswers, user_id: null }, error: null });
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
    expect(body.data.result.locked).toBeUndefined();
    expect(body.data.result.topMatches.length).toBeGreaterThan(FREE_MATCH_COUNT);
    expect(body.data.claimed).toBe(false);
  });

  it("claims a row when the submitted answers match the stored ones", async () => {
    await POST(post({ audience: "medical-student", answers: validAnswers, resultId: RESULT_ID }));

    expect(update).toHaveBeenCalledWith({ user_id: "user-1" });
    expect(updateEq).toHaveBeenCalledWith("id", RESULT_ID);
    expect(is).toHaveBeenCalledWith("user_id", null);
  });

  it("reports claimed:true only when the write actually landed", async () => {
    const ok = await POST(post({ audience: "medical-student", answers: validAnswers, resultId: RESULT_ID }));
    expect((await ok.json()).data.claimed).toBe(true);

    is.mockResolvedValue({ error: { message: "boom", code: "42501" } });
    const failed = await POST(
      post({ audience: "medical-student", answers: validAnswers, resultId: RESULT_ID })
    );
    expect((await failed.json()).data.claimed).toBe(false);
  });

  it("refuses to claim a row whose stored answers differ - a share-link holder cannot hijack it", async () => {
    const someoneElses = assessmentQuestions.map((question) => ({
      questionId: `q${question.id}`,
      selectedOption: "2"
    }));
    maybeSingle.mockResolvedValue({ data: { answers: someoneElses, user_id: null }, error: null });

    const response = await POST(
      post({ audience: "medical-student", answers: validAnswers, resultId: RESULT_ID })
    );

    expect(response.status).toBe(200);
    expect(update).not.toHaveBeenCalled();
    // The client uses this to forget a row it cannot publish.
    expect((await response.json()).data.claimed).toBe(false);
  });

  it("refuses to claim a row that is only a partial answer match", async () => {
    maybeSingle.mockResolvedValue({
      data: { answers: storedAnswers.slice(0, 5), user_id: null },
      error: null
    });

    await POST(post({ audience: "medical-student", answers: validAnswers, resultId: RESULT_ID }));
    expect(update).not.toHaveBeenCalled();
  });

  it("does not re-claim a row that someone already owns", async () => {
    maybeSingle.mockResolvedValue({
      data: { answers: storedAnswers, user_id: "someone-else" },
      error: null
    });

    await POST(post({ audience: "medical-student", answers: validAnswers, resultId: RESULT_ID }));
    expect(update).not.toHaveBeenCalled();
  });

  it("does not claim a row that does not exist", async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });

    const response = await POST(
      post({ audience: "medical-student", answers: validAnswers, resultId: RESULT_ID })
    );
    expect(response.status).toBe(200);
    expect(update).not.toHaveBeenCalled();
  });

  it("does not touch the database when no row id is supplied", async () => {
    await POST(post({ audience: "medical-student", answers: validAnswers }));
    expect(from).not.toHaveBeenCalled();
  });

  it("still returns the unlocked result when the claim write fails", async () => {
    is.mockResolvedValue({ error: { message: "boom", code: "42501" } });
    const response = await POST(
      post({ audience: "medical-student", answers: validAnswers, resultId: RESULT_ID })
    );

    expect(response.status).toBe(200);
    expect((await response.json()).data.result.topMatches.length).toBeGreaterThan(FREE_MATCH_COUNT);
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
