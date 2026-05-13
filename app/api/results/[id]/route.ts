import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!serverSupabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 404 });
  }

  const { data, error } = await serverSupabase
    .from("saved_results")
    .select("result_payload")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Result not found." }, { status: 404 });
  }

  return NextResponse.json(data.result_payload);
}
