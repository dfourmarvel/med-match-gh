/**
 * Compatibility adapter for older seed/demo scripts.
 *
 * The canonical application scorer lives in `@/lib/scoring`. Keep this file
 * thin so the project does not maintain two independent recommendation models.
 *
 * @deprecated Use `@/lib/scoring` (`buildAssessmentResult`) for all new code.
 * This adapter exists only for `data/seed-data.ts` and legacy demo tooling.
 */

import {
  buildAssessmentResult,
  calculateTraitScores as calculateCanonicalTraitScores,
  scoreSpecialties
} from "@/lib/scoring";
import { specialtiesById } from "@/lib/specialties";
import { QuizResponse, SpecialtyMatchResult, TraitId, TraitScores } from "@/data/types";
import { traitLabels } from "@/lib/assessment";
import { TraitKey, TraitVector } from "@/lib/types";
import { canonicalToDataTrait, dataToCanonicalTrait } from "@/lib/trait-mapping";

function responsesToAnswerRecord(responses: QuizResponse[]) {
  return Object.fromEntries(responses.map((response) => [response.questionId, response.answer]));
}

function toDataTraitScores(scores: TraitVector): TraitScores {
  return Object.fromEntries(
    Object.entries(scores).map(([trait, value]) => [canonicalToDataTrait[trait as TraitKey], value])
  ) as TraitScores;
}

function toCanonicalTraitScores(scores: TraitScores): TraitVector {
  return Object.fromEntries(
    Object.entries(scores).map(([trait, value]) => [dataToCanonicalTrait[trait as TraitId], value])
  ) as TraitVector;
}

export function calculateTraitScores(responses: QuizResponse[]): TraitScores {
  return toDataTraitScores(calculateCanonicalTraitScores(responsesToAnswerRecord(responses)));
}

export function calculateMatchPercentage(distance: number): number {
  return Math.round(Math.max(0, Math.min(100, 100 - (distance / 70) * 100)));
}

export function getTopAndBottomTraits(scores: TraitScores, count = 3) {
  const entries = Object.entries(scores) as Array<[TraitId, number]>;
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  return {
    top: sorted.slice(0, count),
    bottom: sorted.slice(-count).reverse()
  };
}

export function scoreAllSpecialties(userScores: TraitScores): SpecialtyMatchResult[] {
  return scoreSpecialties(toCanonicalTraitScores(userScores)).map((match, index) => {
    const specialty = specialtiesById[match.specialtyId];

    return {
      specialtyId: match.specialtyId,
      specialtyName: specialty.name,
      matchScore: Math.round(match.score * 100),
      matchPercentage: match.matchPercentage,
      rank: index + 1,
      strengths: match.strengths,
      challenges: match.challenges,
      reasoning: match.reasoning,
      confidenceLevel: match.confidenceLevel
    };
  });
}

export function getTopMatches(matches: SpecialtyMatchResult[], count = 5): SpecialtyMatchResult[] {
  return matches.slice(0, count);
}

export function generatePersonalitySummary(scores: TraitScores): string {
  const canonical = toCanonicalTraitScores(scores);
  const top = Object.entries(canonical)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([trait]) => traitLabels[trait as TraitKey].toLowerCase());

  return `You appear strongest in ${top.join(", ")}. Treat this as an exploratory profile to test through shadowing, mentorship, and clinical exposure.`;
}

export function generateSuggestedNextSteps(topMatches: SpecialtyMatchResult[]): string[] {
  const topNames = topMatches.slice(0, 3).map((match) => match.specialtyName);

  return [
    `Shadow a clinician in ${topNames[0] ?? "your top specialty"} before treating the result as settled.`,
    `Compare your top matches (${topNames.join(", ")}) against lifestyle, training length, and daily work.`,
    "Discuss the result with a resident, consultant, or career mentor who understands Ghanaian training realities.",
    "Retake the assessment after more clinical or dental exposure."
  ];
}

export function validateResponsesComplete(
  responses: QuizResponse[],
  totalQuestions: number
): { valid: boolean; missingQuestions: number[] } {
  const answered = new Set(responses.map((response) => response.questionId));
  const missingQuestions = Array.from({ length: totalQuestions }, (_, index) => index + 1).filter(
    (id) => !answered.has(id)
  );

  return {
    valid: missingQuestions.length === 0,
    missingQuestions
  };
}

export function normalizeToHundredScale(scores: TraitScores): TraitScores {
  return Object.fromEntries(
    Object.entries(scores).map(([trait, score]) => [trait, Math.round(Math.max(1, Math.min(100, score)))])
  ) as TraitScores;
}

export function buildLegacyAssessmentResult(responses: QuizResponse[]) {
  return buildAssessmentResult("medical-student", responsesToAnswerRecord(responses));
}
