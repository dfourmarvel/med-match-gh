import { NextResponse } from "next/server";
import { z } from "zod";
import { serverSupabase } from "@/lib/supabase";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsedId = z.string().uuid().safeParse(id);

  if (!parsedId.success) {
    return NextResponse.json({ error: "Invalid result id." }, { status: 400 });
  }

  if (!serverSupabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 404 });
  }

  const { data, error } = await serverSupabase
    .from("saved_results")
    .select("result_payload")
    .eq("id", parsedId.data)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Result not found." }, { status: 404 });
  }

  return NextResponse.json(data.result_payload);
}
