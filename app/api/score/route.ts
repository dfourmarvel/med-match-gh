import { NextResponse } from "next/server";
import { quizSubmissionSchema, validationErrorResponse } from "@/lib/api-validation";
import { rateLimit } from "@/lib/rate-limit";
import { buildAssessmentResult } from "@/lib/scoring";

export async function POST(request: Request) {
  const limit = rateLimit(request, { namespace: "score", limit: 30, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many scoring requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const parsed = quizSubmissionSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(validationErrorResponse(parsed.error), { status: 400 });
    }

    const result = buildAssessmentResult(parsed.data.audience, parsed.data.answers);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }
}
