import { randomUUID } from "crypto";
import { z } from "zod";
import { fullAssessmentResultSchema } from "@/lib/api-validation";
import { rateLimit } from "@/lib/rate-limit";
import { specialtiesById } from "@/lib/specialties";
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

function buildQuizResultRow(body: z.infer<typeof quizResultPayloadSchema>, id = randomUUID()) {
  const topMatch = body.result.topMatches[0];
  const topSpecialty = topMatch ? specialtiesById[topMatch.specialtyId] : null;
  const specialtyScores = Object.fromEntries(
    body.result.topMatches.map((match) => [
      specialtiesById[match.specialtyId]?.name ?? match.specialtyId,
      match.matchPercentage
    ])
  );

  return {
    id,
    answers: body.answers,
    scores: {
      audience: body.result.audience,
      traitScores: body.result.traitScores,
      specialtyScores,
      fullResult: body.result
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

    const row = buildQuizResultRow(parsed.data);

    // API-1: quiz_results is anonymous-first. RLS (see
    // supabase/migrations/20260521_enable_rls_quiz_results.sql) permits inserts
    // only with user_id IS NULL and public read-by-id for share links. We write
    // via the service role (which bypasses RLS) and deliberately never set user_id.
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
