import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { fullAssessmentResultSchema, validationErrorResponse } from "@/lib/api-validation";
import { rateLimit } from "@/lib/rate-limit";
import { specialtiesById } from "@/lib/specialties";
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

  const topMatch = body.topMatches[0];
  const topSpecialty = topMatch ? specialtiesById[topMatch.specialtyId] : null;
  const specialtyScores = Object.fromEntries(
    body.topMatches.map((match) => [
      specialtiesById[match.specialtyId]?.name ?? match.specialtyId,
      match.matchPercentage
    ])
  );

  const { error } = await serverSupabase.from("quiz_results").insert({
    id,
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id, url: `/share/${id}`, mode: "supabase" });
}
