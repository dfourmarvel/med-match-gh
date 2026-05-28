import { NextResponse } from "next/server";
import { z } from "zod";
import { hasSupabaseServiceRole, serverSupabase } from "@/lib/supabase";

interface QuizResultRow {
  scores?: {
    fullResult?: unknown;
  };
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsedId = z.string().uuid().safeParse(id);

  if (!parsedId.success) {
    return NextResponse.json({ error: "Invalid result id." }, { status: 400 });
  }

  if (!serverSupabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 404 });
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
    return NextResponse.json({ error: "Result not found." }, { status: 404 });
  }

  return NextResponse.json(result.scores.fullResult);
}
