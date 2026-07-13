/**
 * @jest-environment node
 */

import { POST } from "@/app/api/score/route";
import { rateLimit } from "@/lib/rate-limit";
import { assessmentQuestions } from "@/lib/assessment";

jest.mock("@/lib/rate-limit", () => ({ rateLimit: jest.fn() }));
const mockedRateLimit = jest.mocked(rateLimit);

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
