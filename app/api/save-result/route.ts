import { randomUUID } from "crypto";
import { fullAssessmentResultSchema } from "@/lib/api-validation";
import { rateLimit } from "@/lib/rate-limit";
import { specialtiesById } from "@/lib/specialties";
import { serverSupabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/supabase/server";
import { apiError, apiSuccess } from "@/lib/apiError";

export async function POST(request: Request) {
  try {
    const limit = await rateLimit(request, { namespace: "save-result", limit: 12, windowMs: 60_000 });
    if (!limit.allowed) {
      return apiError(
        "Too many share-link requests. Please try again shortly.",
        429,
        undefined,
        { "Retry-After": String(limit.retryAfterSeconds) }
      );
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch (err: any) {
      console.error("Malformed JSON in /api/save-result", { error: err?.message });
      return apiError("Invalid JSON request body.", 400);
    }

    const parsed = fullAssessmentResultSchema.safeParse(payload);
    if (!parsed.success) {
      const validationErrors = parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }));
      return apiError("Invalid request payload.", 400, validationErrors);
    }

    const body = parsed.data;

    // Share links are now created by signed-in users only.
    //
    // This route takes a result and no answers, so unlike /api/quiz-results it
    // cannot re-score a payload it is handed. A signed-out visitor's client
    // holds a LOCKED result, and storing that would write placeholder traits in
    // as someone's real profile and leave their /share/<id> link rendering
    // locked to every viewer, with `answers: []` making it unclaimable. Since
    // there is nothing sensible to store for a signed-out caller, require the
    // session instead — which also closes the older hole where this route was
    // an unauthenticated arbitrary-payload write into quiz_results.
    const user = await getCurrentUser();
    if (!user) {
      return apiError("Sign in to create a share link for your result.", 401);
    }

    // Belt and braces: a signed-in caller's client should never hold a locked
    // payload, but never persist one whatever the session says.
    if (body.locked) {
      return apiError("Cannot create a share link from a locked result.", 400);
    }

    const id = randomUUID();

    if (!serverSupabase) {
      return apiSuccess({
        id,
        url: `/share/${id}`,
        mode: "local-only",
        message:
          "Supabase is not configured yet. The share endpoint is scaffolded and ready once environment variables are added."
      });
    }

    const topMatch = body.topMatches[0];
    const topSpecialty = topMatch ? specialtiesById[topMatch.specialtyId] : null;
    const specialtyScores = Object.fromEntries(
      body.topMatches.map((match) => [
        specialtiesById[match.specialtyId]?.name ?? match.specialtyId,
        match.matchPercentage
      ])
    );

    try {
      // Written via the service role, which bypasses RLS. user_id is set now
      // that the route requires a session, so the row is owned from the moment
      // it exists and the owner policies in
      // supabase/migrations/20260911d_quiz_results_owner_policies.sql apply.
      const { error } = await serverSupabase.from("quiz_results").insert({
        id,
        user_id: user.id,
        answers: [],
        scores: {
          audience: body.audience,
          traitScores: body.traitScores,
          specialtyScores,
          fullResult: body
        },
        top_specialty: topSpecialty?.name ?? topMatch?.specialtyId ?? "Unknown"
      });

      if (error) {
        // SEC-4: log full detail server-side, return a generic message to the client.
        console.error("Supabase insert quiz_results failed", {
          route: "/api/save-result",
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          payload: { id }
        });
        return apiError("Could not create a share link right now.", 500);
      }
    } catch (dbError: any) {
      console.error("Supabase query exception in /api/save-result", {
        route: "/api/save-result",
        message: dbError?.message,
        stack: dbError?.stack,
        payload: { id }
      });
      return apiError("Could not create a share link right now.", 500);
    }

    return apiSuccess({ id, url: `/share/${id}`, mode: "supabase" });
  } catch (globalError: any) {
    console.error("Unhandled exception in POST /api/save-result", {
      message: globalError?.message,
      stack: globalError?.stack
    });
    return apiError("Internal server error", 500);
  }
}
