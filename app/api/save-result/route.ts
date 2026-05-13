import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase";
import { FullAssessmentResult } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as FullAssessmentResult;
  const id = randomUUID();

  if (!serverSupabase) {
    return NextResponse.json({
      id,
      url: `/share/${id}`,
      mode: "local-only",
      message: "Supabase is not configured yet. The share endpoint is scaffolded and ready once environment variables are added."
    });
  }

  const { error } = await serverSupabase.from("saved_results").insert({
    id,
    audience: body.audience,
    result_payload: body
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id, url: `/share/${id}`, mode: "supabase" });
}
