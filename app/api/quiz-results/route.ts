import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { fullAssessmentResultSchema, validationErrorResponse } from "@/lib/api-validation";
import { rateLimit } from "@/lib/rate-limit";
import { specialtiesById } from "@/lib/specialties";
import { serverSupabase } from "@/lib/supabase";

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
  const limit = rateLimit(request, { namespace: "quiz-results", limit: 20, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many save requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  if (!serverSupabase) {
    return NextResponse.json(
      { error: "Supabase is not configured yet. Add your Supabase URL and anon key, then restart the dev server." },
      { status: 503 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const parsed = quizResultPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 400 });
  }

  const row = buildQuizResultRow(parsed.data);
  const { error } = await serverSupabase.from("quiz_results").insert(row);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: row.id, url: `/share/${row.id}`, mode: "supabase" });
}
