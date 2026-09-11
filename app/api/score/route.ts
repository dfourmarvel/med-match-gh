import { quizSubmissionSchema } from "@/lib/api-validation";
import { rateLimit } from "@/lib/rate-limit";
import { buildAssessmentResult } from "@/lib/scoring";
import { apiError, apiSuccess } from "@/lib/apiError";
import { lockResult } from "@/lib/gating";
import { getCurrentUser } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const limit = await rateLimit(request, { namespace: "score", limit: 30, windowMs: 60_000 });
    if (!limit.allowed) {
      return apiError(
        "Too many scoring requests. Please try again shortly.",
        429,
        undefined,
        { "Retry-After": String(limit.retryAfterSeconds) }
      );
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch (err: any) {
      console.error("Malformed JSON in /api/score", { error: err.message });
      return apiError("Invalid JSON request body.", 400);
    }

    const parsed = quizSubmissionSchema.safeParse(payload);
    if (!parsed.success) {
      const validationErrors = parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }));
      return apiError("Invalid request body", 400, validationErrors);
    }

    const result = buildAssessmentResult(parsed.data.audience, parsed.data.answers);

    // The gate lives here rather than in the UI: a signed-out caller is sent a
    // trimmed payload, so the locked matches and the real trait scores never
    // reach the browser at all.
    const user = await getCurrentUser();
    return apiSuccess(user ? result : lockResult(result));
  } catch (error: any) {
    console.error("Unhandled exception in POST /api/score", {
      message: error?.message,
      stack: error?.stack
    });
    return apiError("Internal server error", 500);
  }
}
