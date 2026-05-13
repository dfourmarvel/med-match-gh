import { NextResponse } from "next/server";
import { buildAssessmentResult } from "@/lib/scoring";
import { QuizSubmission } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as QuizSubmission;
  const result = buildAssessmentResult(body.audience, body.answers);
  return NextResponse.json(result);
}
