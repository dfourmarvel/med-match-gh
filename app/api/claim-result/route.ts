import { z } from "zod";
import { quizSubmissionSchema } from "@/lib/api-validation";
import { rateLimit } from "@/lib/rate-limit";
import { buildAssessmentResult } from "@/lib/scoring";
import { serverSupabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/supabase/server";
import { apiError, apiSuccess } from "@/lib/apiError";

const claimSchema = quizSubmissionSchema.extend({
  /** The anonymous row created when the assessment was submitted, if there was one. */
  resultId: z.string().uuid().optional()
});

/**
 * Turns a guest result into an owned one after sign-in, and returns the full
 * (unlocked) payload.
 *
 * Authorisation is possession of the ANSWERS, not of the row id. Only the
 * person who sat the assessment has them in their own localStorage, whereas a
 * row id also travels in every /share/<id> link — claiming by id alone would
 * let anyone handed a share link take ownership of someone else's result.
 */
export async function POST(request: Request) {
  try {
    const limit = await rateLimit(request, { namespace: "claim-result", limit: 10, windowMs: 60_000 });
    if (!limit.allowed) {
      return apiError("Too many requests. Please try again shortly.", 429, undefined, {
        "Retry-After": String(limit.retryAfterSeconds)
      });
    }

    const user = await getCurrentUser();
    if (!user) {
      return apiError("You must be signed in to unlock a result.", 401);
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return apiError("Invalid JSON request body.", 400);
    }

    const parsed = claimSchema.safeParse(payload);
    if (!parsed.success) {
      return apiError(
        "Invalid request body",
        400,
        parsed.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message }))
      );
    }

    // Re-scored from the answers rather than trusted from the client, so the
    // unlocked payload is the server's own work either way.
    const result = buildAssessmentResult(parsed.data.audience, parsed.data.answers);

    if (serverSupabase && parsed.data.resultId) {
      // Claim only a row that nobody owns yet. A second sign-in on the same
      // device is then a no-op rather than a silent transfer of ownership.
      const { error } = await serverSupabase
        .from("quiz_results")
        .update({ user_id: user.id })
        .eq("id", parsed.data.resultId)
        .is("user_id", null);

      if (error) {
        console.error("Claiming quiz_results row failed", {
          route: "/api/claim-result",
          message: error.message,
          code: error.code
        });
        // Not fatal: the visitor still gets their unlocked result.
      }
    }

    return apiSuccess(result);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Unhandled exception in POST /api/claim-result", {
      message: err.message,
      stack: err.stack
    });
    return apiError("Internal server error", 500);
  }
}
