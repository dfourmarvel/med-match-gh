import { randomUUID } from "crypto";
import { z } from "zod";
import { fullAssessmentResultSchema } from "@/lib/api-validation";
import { rateLimit } from "@/lib/rate-limit";
import { specialtiesById } from "@/lib/specialties";
import { buildAssessmentResult } from "@/lib/scoring";
import { answersToRecord } from "@/lib/assessment";
import { getCurrentUser } from "@/lib/supabase/server";
import { serverSupabase } from "@/lib/supabase";
import { apiError, apiSuccess } from "@/lib/apiError";

const savedAnswerSchema = z.object({
  questionId: z.string().regex(/^q\d+$/),
  selectedOption: z.string().regex(/^[1-5]$/)
});

const quizResultPayloadSchema = z.object({
  answers: z.array(savedAnswerSchema).min(1).max(25),
  result: fullAssessmentResultSchema
});

function buildQuizResultRow(
  body: z.infer<typeof quizResultPayloadSchema>,
  userId: string | null,
  id = randomUUID()
) {
  // Always re-scored from the submitted answers, never taken from the client.
  //
  // A signed-out visitor's client holds a LOCKED result: three of five matches
  // and placeholder trait scores. Storing that would persist placeholder values
  // as the person's real profile and would make their /share/<id> link render
  // locked to everyone, forever.
  //
  // This re-scores unconditionally rather than only when `result.locked` is
  // set. This route is unauthenticated, so a client-supplied flag has no place
  // in the trust path: a caller could simply omit it and have a hand-written
  // payload stored verbatim and served publicly. The result is now the
  // server's own work in every case, and the client's `result` is used only
  // for the fields the scorer does not produce.
  const result = buildAssessmentResult(body.result.audience, answersToRecord(body.answers));

  const topMatch = result.topMatches[0];
  const topSpecialty = topMatch ? specialtiesById[topMatch.specialtyId] : null;
  const specialtyScores = Object.fromEntries(
    result.topMatches.map((match) => [
      specialtiesById[match.specialtyId]?.name ?? match.specialtyId,
      match.matchPercentage
    ])
  );

  return {
    id,
    // Owned from the start when there is a session, so pressing Save later can
    // publish this row without a separate claim. A guest's row stays unowned
    // and is claimed on sign-in, which verifies their answers.
    user_id: userId,
    // Deliberately not published. The share link only becomes readable when a
    // signed-in user asks for one.
    published_at: null,
    answers: body.answers,
    scores: {
      audience: result.audience,
      traitScores: result.traitScores,
      specialtyScores,
      fullResult: result
    },
    top_specialty: topSpecialty?.name ?? topMatch?.specialtyId ?? "Unknown"
  };
}

export async function POST(request: Request) {
  try {
    const limit = await rateLimit(request, { namespace: "quiz-results", limit: 20, windowMs: 60_000 });
    if (!limit.allowed) {
      return apiError(
        "Too many save requests. Please try again shortly.",
        429,
        undefined,
        { "Retry-After": String(limit.retryAfterSeconds) }
      );
    }

    if (!serverSupabase) {
      return apiError(
        "Supabase is not configured yet. Add your Supabase URL and anon key, then restart the dev server.",
        503
      );
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch (err: any) {
      console.error("Malformed JSON in /api/quiz-results", { error: err.message });
      return apiError("Invalid JSON request body.", 400);
    }

    const parsed = quizResultPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      const validationErrors = parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }));
      return apiError("Invalid request payload.", 400, validationErrors);
    }

    const user = await getCurrentUser();
    const row = buildQuizResultRow(parsed.data, user?.id ?? null);

    // The assessment stays open to guests, so this route is unauthenticated and
    // user_id is simply null when nobody is signed in. Written via the service
    // role, which bypasses RLS.
    try {
      const { error } = await serverSupabase.from("quiz_results").insert(row);
      if (error) {
        console.error("Supabase insert quiz_results failed", {
          route: "/api/quiz-results",
          message: error.message,
          code: error.code,
          details: error.details,
          payload: { id: row.id, top_specialty: row.top_specialty }
        });
        return apiError("Failed to save quiz results.", 500);
      }
    } catch (dbError: any) {
      console.error("Supabase query exception in /api/quiz-results", {
        route: "/api/quiz-results",
        message: dbError.message,
        stack: dbError.stack,
        payload: { id: row.id, top_specialty: row.top_specialty }
      });
      return apiError("Failed to save quiz results.", 500);
    }

    return apiSuccess({ id: row.id, url: `/share/${row.id}`, mode: "supabase" });
  } catch (globalError: any) {
    console.error("Unhandled exception in POST /api/quiz-results", {
      message: globalError?.message,
      stack: globalError?.stack
    });
    return apiError("Internal server error", 500);
  }
}
