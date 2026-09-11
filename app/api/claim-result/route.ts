import { z } from "zod";
import { quizSubmissionSchema } from "@/lib/api-validation";
import { rateLimit } from "@/lib/rate-limit";
import { buildAssessmentResult } from "@/lib/scoring";
import { answersToRecord } from "@/lib/assessment";
import { serverSupabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/supabase/server";
import { apiError, apiSuccess } from "@/lib/apiError";

const claimSchema = quizSubmissionSchema.extend({
  /** The anonymous row created when the assessment was submitted, if there was one. */
  resultId: z.string().uuid().optional()
});

/**
 * True when the stored answers on a row are exactly the answers being
 * submitted. Compared as records so the two persisted shapes line up, and
 * length-checked first so a subset can never pass.
 */
function answersMatch(stored: unknown, submitted: Record<number, number>): boolean {
  if (!Array.isArray(stored)) return false;

  let storedRecord: Record<number, number>;
  try {
    storedRecord = answersToRecord(stored as { questionId: string; selectedOption: string }[]);
  } catch {
    return false;
  }

  const storedKeys = Object.keys(storedRecord);
  const submittedKeys = Object.keys(submitted);
  if (storedKeys.length === 0 || storedKeys.length !== submittedKeys.length) return false;

  return storedKeys.every((key) => storedRecord[Number(key)] === submitted[Number(key)]);
}

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

    let claimed = false;

    if (serverSupabase && parsed.data.resultId) {
      // The submitted answers must match the ones stored on the row. Without
      // this check the row id alone would be enough to claim it, and a row id
      // travels in every /share/<id> link — so anyone handed a share link could
      // take ownership of someone else's result and, via the owner RLS policy,
      // read it with their own token.
      const { data: row, error: readError } = await serverSupabase
        .from("quiz_results")
        .select("answers, user_id")
        .eq("id", parsed.data.resultId)
        .maybeSingle();

      if (readError) {
        console.error("Reading quiz_results row for claim failed", {
          route: "/api/claim-result",
          message: readError.message,
          code: readError.code
        });
      } else if (row && row.user_id === null && answersMatch(row.answers, parsed.data.answers)) {
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
        } else {
          claimed = true;
        }
      }
    }

    // `claimed` tells the client whether it still has a row it can publish. When
    // a claim does not land — the answers do not match, somebody already owns
    // the row, it is gone, or the write failed — the client must forget that
    // row id. Otherwise Save keeps sending it, /api/save-result answers 403
    // because the caller does not own it, and the visitor can never get a share
    // link short of retaking the assessment.
    return apiSuccess({ result, claimed: Boolean(parsed.data.resultId) && claimed });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Unhandled exception in POST /api/claim-result", {
      message: err.message,
      stack: err.stack
    });
    return apiError("Internal server error", 500);
  }
}
