/**
 * @jest-environment node
 */

let mockInsertResult: { error: unknown } = { error: null };
let mockServerSupabase: unknown = {
  from: () => ({ insert: () => Promise.resolve(mockInsertResult) })
};

jest.mock("@/lib/rate-limit", () => ({ rateLimit: jest.fn() }));
jest.mock("@/lib/supabase", () => ({
  get serverSupabase() {
    return mockServerSupabase;
  },
  get hasSupabaseServiceRole() {
    return true;
  }
}));

import { POST } from "@/app/api/quiz-results/route";
import { rateLimit } from "@/lib/rate-limit";
import { buildAssessmentResult } from "@/lib/scoring";
import { assessmentQuestions } from "@/lib/assessment";

const mockedRateLimit = jest.mocked(rateLimit);
const validPayload = {
  answers: [{ questionId: "q1", selectedOption: "3" }],
  result: buildAssessmentResult(
    "medical-student",
    Object.fromEntries(assessmentQuestions.map((question) => [question.id, 5]))
  )
};

function post(body: unknown) {
  return new Request("http://localhost/api/quiz-results", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

describe("POST /api/quiz-results", () => {
  beforeEach(() => {
    mockedRateLimit.mockResolvedValue({ allowed: true });
    mockInsertResult = { error: null };
    mockServerSupabase = { from: () => ({ insert: () => Promise.resolve(mockInsertResult) }) };
  });

  it("saves answers + result and returns a share link", async () => {
    const response = await POST(post(validPayload));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.mode).toBe("supabase");
  });

  it("returns 503 when Supabase is not configured", async () => {
    mockServerSupabase = null;

    const response = await POST(post(validPayload));
    expect(response.status).toBe(503);
  });

  it("returns 400 for an invalid payload", async () => {
    const response = await POST(post({ answers: [], result: {} }));
    expect(response.status).toBe(400);
  });

  it("returns 500 when the insert fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    mockInsertResult = { error: { message: "insert boom", code: "23505" } };

    const response = await POST(post(validPayload));
    expect(response.status).toBe(500);

    consoleSpy.mockRestore();
  });

  it("returns 429 when rate limited", async () => {
    mockedRateLimit.mockResolvedValue({ allowed: false, retryAfterSeconds: 30 });

    const response = await POST(post(validPayload));
    expect(response.status).toBe(429);
  });
});
