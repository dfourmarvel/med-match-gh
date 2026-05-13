import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { fullAssessmentResultSchema, validationErrorResponse } from "@/lib/api-validation";
import { rateLimit } from "@/lib/rate-limit";
import { serverSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const limit = rateLimit(request, { namespace: "save-result", limit: 12, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many share-link requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const parsed = fullAssessmentResultSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 400 });
  }

  const body = parsed.data;
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
