import { z } from "zod";
import { hasSupabaseServiceRole, serverSupabase } from "@/lib/supabase";
import { apiError, apiSuccess } from "@/lib/apiError";

interface QuizResultRow {
  scores?: {
    fullResult?: unknown;
  };
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsedId = z.string().uuid().safeParse(id);

  if (!parsedId.success) {
    return apiError("Invalid result id.", 400);
  }

  if (!serverSupabase) {
    return apiError("Supabase is not configured.", 404);
  }

  const { data, error } = hasSupabaseServiceRole
    ? await serverSupabase
        .from("quiz_results")
        .select("scores")
        .eq("id", parsedId.data)
        .single()
    : await serverSupabase
        .rpc("get_quiz_result", { p_result_id: parsedId.data })
        .single();

  const result = data as QuizResultRow | null;

  if (error || !result || !result.scores?.fullResult) {
    if (error) {
      // SEC-4: log detail server-side, return a generic 404 to the client.
      console.error("Supabase select quiz_results failed", {
        route: "/api/results/[id]",
        message: error.message,
        code: error.code,
        details: error.details,
        id: parsedId.data
      });
    }
    return apiError("Result not found.", 404);
  }

  return apiSuccess(result.scores.fullResult);
}
