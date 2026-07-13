import { z } from "zod";
import { hasSupabaseServiceRole, serverSupabase } from "@/lib/supabase";
import { FullAssessmentResult } from "@/lib/types";

interface QuizResultRow {
  scores?: {
    fullResult?: unknown;
  };
}

export type ResultLookup =
  | { status: "ok"; result: FullAssessmentResult }
  | { status: "invalid-id" }
  | { status: "not-found" };

/**
 * Shared result lookup used by BOTH the API route (`/api/results/[id]`) and the
 * share page (`/share/[id]`), so a server component never has to HTTP-fetch its
 * own API (API-3). Validates the UUID and reads `quiz_results.scores.fullResult`.
 *
 * Callers map the discriminated result to the right response: the API returns
 * 400 / 404 / 200; the share page renders on "ok" and calls notFound() otherwise.
 */
export async function getResultById(id: string): Promise<ResultLookup> {
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) {
    return { status: "invalid-id" };
  }

  if (!serverSupabase) {
    return { status: "not-found" };
  }

  const { data, error } = hasSupabaseServiceRole
    ? await serverSupabase.from("quiz_results").select("scores").eq("id", parsedId.data).single()
    : await serverSupabase.rpc("get_quiz_result", { p_result_id: parsedId.data }).single();

  const row = data as QuizResultRow | null;

  if (error || !row || !row.scores?.fullResult) {
    if (error) {
      // SEC-4: log detail server-side, surface only a generic not-found to callers.
      console.error("Supabase select quiz_results failed", {
        source: "lib/results#getResultById",
        message: error.message,
        code: error.code,
        details: error.details,
        id: parsedId.data
      });
    }
    return { status: "not-found" };
  }

  return { status: "ok", result: row.scores.fullResult as FullAssessmentResult };
}
