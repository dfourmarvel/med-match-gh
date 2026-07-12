/**
 * @jest-environment node
 */

import { POST } from "@/app/api/ai-explanation/route";
import { generateAIResponse } from "@/lib/ai/generateAIResponse";
import { rateLimit } from "@/lib/rate-limit";

jest.mock("@/lib/ai/generateAIResponse", () => ({
  generateAIResponse: jest.fn()
}));

jest.mock("@/lib/rate-limit", () => ({
  rateLimit: jest.fn()
}));

const mockedGenerateAIResponse = jest.mocked(generateAIResponse);
const mockedRateLimit = jest.mocked(rateLimit);

function createPostRequest(body: unknown) {
  return new Request("http://localhost/api/ai-explanation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": `127.0.0.${Math.floor(Math.random() * 200) + 1}`
    },
    body: JSON.stringify(body)
  });
}

describe("POST /api/ai-explanation", () => {
  beforeEach(() => {
    mockedGenerateAIResponse.mockReset();
    mockedRateLimit.mockResolvedValue({ allowed: true });
  });

  it("returns 200 and an explanation for a valid request", async () => {
    mockedGenerateAIResponse.mockResolvedValue("Your profile suggests a thoughtful specialty fit.");

    const response = await POST(
      createPostRequest({
        userId: "user-123",
        answers: [{ questionId: "q1", answer: "I enjoy patient conversations" }],
        traitScores: {
          communicationEmpathy: 9,
          diagnosticThinking: 8,
          emotionalResilience: 7
        },
        topSpecialties: ["Psychiatry", { name: "Internal Medicine", matchPercentage: 88 }]
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      success: true,
      data: { explanation: "Your profile suggests a thoughtful specialty fit." }
    });
    expect(mockedGenerateAIResponse).toHaveBeenCalledTimes(1);
    expect(mockedGenerateAIResponse.mock.calls[0][0]).toContain("Do not diagnose");
  });

  it("returns 400 when required fields are missing", async () => {
    const response = await POST(
      createPostRequest({
        userId: "user-123",
        answers: [{ questionId: "q1", answer: "I enjoy patient conversations" }]
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error.message).toBe("Invalid request payload.");
    expect(body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "traitScores"
        }),
        expect.objectContaining({
          path: "topSpecialties"
        })
      ])
    );
    expect(mockedGenerateAIResponse).not.toHaveBeenCalled();
  });

  it("returns 400 when an answer omits both question and questionId", async () => {
    const response = await POST(
      createPostRequest({
        userId: "user-123",
        answers: [{ answer: "I enjoy patient conversations" }],
        traitScores: { communicationEmpathy: 9 },
        topSpecialties: ["Psychiatry"]
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "answers.0.question"
        })
      ])
    );
  });

  it("returns 400 for invalid JSON", async () => {
    const response = await POST(
      new Request("http://localhost/api/ai-explanation", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "127.0.0.250" },
        body: "{"
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: { message: "Invalid JSON request body." }
    });
  });

  it("returns 429 when the route is rate limited", async () => {
    mockedRateLimit.mockResolvedValue({ allowed: false, retryAfterSeconds: 30 });

    const response = await POST(
      createPostRequest({
        userId: "user-123",
        answers: [{ questionId: "q1", answer: true }],
        traitScores: { communicationEmpathy: 9 },
        topSpecialties: ["Psychiatry"]
      })
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("30");
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: { message: "Too many AI guidance requests. Please try again shortly." }
    });
  });

  it("returns a concise fallback explanation when AI generation fails", async () => {
    mockedGenerateAIResponse.mockRejectedValue(new Error("AI unavailable"));
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await POST(
      createPostRequest({
        userId: "user-123",
        answers: [{ question: "Preferred work", answer: 4 }],
        traitScores: {
          communicationEmpathy: 9,
          diagnosticThinking: 8,
          emotionalResilience: 7
        },
        topSpecialties: [
          { specialtyName: "Psychiatry" },
          { title: "Internal Medicine" },
          "Family Medicine"
        ]
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.explanation).toContain("Psychiatry, Internal Medicine, Family Medicine");
    expect(body.data.explanation).toContain("They are not a diagnosis");

    consoleErrorSpy.mockRestore();
  });

  it("limits long AI responses to 300 words", async () => {
    mockedGenerateAIResponse.mockResolvedValue(Array.from({ length: 320 }, (_, index) => `word${index}`).join(" "));

    const response = await POST(
      createPostRequest({
        userId: "user-123",
        answers: [{ questionId: "q1", answer: "I like structured analysis" }],
        traitScores: { diagnosticThinking: 9 },
        topSpecialties: [{ title: "Radiology" }]
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.explanation.split(/\s+/)).toHaveLength(300);
    expect(body.data.explanation).toMatch(/\.\.\.$/);
  });
});
