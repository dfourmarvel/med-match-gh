/**
 * Scoring Engine for MedMatch Ghana
 * Calculates trait scores, matches specialties, and generates confidence scores
 */

import { TraitScores, TraitId, QuizResponse, TraitVector, SpecialtyMatchResult } from "@/data/types";
import { TRAIT_DEFINITIONS } from "@/data/traits";
import { QUIZ_QUESTIONS } from "@/data/questions";
import { MEDICAL_SPECIALTIES } from "@/data/specialties-medical";
import { REMAINING_MEDICAL_SPECIALTIES, DENTAL_SPECIALTIES } from "@/data/specialties-extended";

const ALL_SPECIALTIES = [
  ...MEDICAL_SPECIALTIES,
  ...REMAINING_MEDICAL_SPECIALTIES,
  ...DENTAL_SPECIALTIES
];

/**
 * Calculate trait scores from quiz responses
 * Responses are mapped to trait contributions based on question weights
 */
export function calculateTraitScores(responses: QuizResponse[]): TraitScores {
  const scores: TraitScores = {} as TraitScores;

  // Initialize all traits to baseline (50)
  for (const traitId of Object.keys(TRAIT_DEFINITIONS) as TraitId[]) {
    scores[traitId] = 50;
  }

  // Process each response
  for (const response of responses) {
    const question = QUIZ_QUESTIONS.find((q) => q.id === response.questionId);
    if (!question) continue;

    // Normalize answer to -12.5 to +12.5 scale (where 3 = neutral)
    const normalized = (response.answer - 3) * 12.5;

    // Apply trait mappings
    for (const mapping of question.traitMappings) {
      const direction = mapping.direction === "positive" ? 1 : -1;
      const contribution = normalized * mapping.weight * direction;
      scores[mapping.trait] = Math.max(1, Math.min(100, scores[mapping.trait] + contribution * 0.5));
    }
  }

  return scores;
}

/**
 * Calculate Euclidean distance between trait vectors
 * Lower distance = better match
 */
function calculateTraitDistance(userTraits: TraitVector, specialtyTraits: TraitVector): number {
  let sumSquares = 0;
  const traitIds = Object.keys(TRAIT_DEFINITIONS) as TraitId[];

  for (const traitId of traitIds) {
    const userScore = userTraits[traitId];
    const specialtyScore = specialtyTraits[traitId];
    const diff = userScore - specialtyScore;
    sumSquares += diff * diff;
  }

  return Math.sqrt(sumSquares / traitIds.length);
}

/**
 * Calculate match percentage based on distance
 * Inverted and normalized to 0-100
 */
export function calculateMatchPercentage(distance: number): number {
  // Distance ranges from 0 (perfect) to ~70 (complete opposite)
  // Convert to percentage: 100 - (distance / maxDistance * 100)
  const maxDistance = 70;
  const percentage = Math.max(0, Math.min(100, 100 - (distance / maxDistance) * 100));
  return Math.round(percentage);
}

/**
 * Calculate confidence level based on how consistent user traits are
 */
function calculateConfidenceLevel(scores: TraitScores): "Low" | "Medium" | "High" {
  const values = Object.values(scores) as number[];
  const mean = values.reduce((a, b) => a + b) / values.length;
  const variance = values.reduce((sum, val) => sum + (val - mean) ** 2, 0) / values.length;
  const stdDev = Math.sqrt(variance);

  // High consistency (low std dev) = high confidence
  if (stdDev < 15) return "High";
  if (stdDev < 25) return "Medium";
  return "Low";
}

/**
 * Identify user's top and bottom traits
 */
export function getTopAndBottomTraits(scores: TraitScores, count = 3) {
  const entries = Object.entries(scores) as Array<[TraitId, number]>;
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  return {
    top: sorted.slice(0, count),
    bottom: sorted.slice(-count).reverse()
  };
}

/**
 * Find strengths: traits where user significantly exceeds specialty average
 */
function findStrengths(
  userScores: TraitScores,
  specialtyProfile: TraitVector,
  count = 3
): string[] {
  const differences = Object.entries(userScores).map(([trait, userScore]) => ({
    trait: trait as TraitId,
    diff: userScore - specialtyProfile[trait as TraitId],
    score: userScore
  }));

  return differences
    .filter((d) => d.diff > 5)
    .sort((a, b) => b.diff - a.diff)
    .slice(0, count)
    .map((d) => TRAIT_DEFINITIONS[d.trait].name);
}

/**
 * Find challenges: traits where user falls short of specialty average
 */
function findChallenges(
  userScores: TraitScores,
  specialtyProfile: TraitVector,
  count = 2
): string[] {
  const differences = Object.entries(userScores).map(([trait, userScore]) => ({
    trait: trait as TraitId,
    diff: userScore - specialtyProfile[trait as TraitId],
    score: userScore
  }));

  return differences
    .filter((d) => d.diff < -5)
    .sort((a, b) => a.diff - b.diff)
    .slice(0, count)
    .map((d) => TRAIT_DEFINITIONS[d.trait].name);
}

/**
 * Generate match reasoning
 */
function generateReasoning(
  matchPercentage: number,
  strengths: string[],
  challenges: string[]
): string {
  if (matchPercentage >= 80) {
    return `Excellent alignment. Your ${strengths.slice(0, 2).join(" and ")} traits are exactly what this specialty values. Focus on developing depth in your ${challenges[0]?.toLowerCase() || "preferred areas"}.`;
  } else if (matchPercentage >= 60) {
    return `Good potential fit. Your strengths in ${strengths[0]?.toLowerCase()} align well, though you might need to build resilience in ${challenges.join(" and ").toLowerCase()}.`;
  } else if (matchPercentage >= 40) {
    return `Possible fit with intentional development. This specialty requires stronger ${challenges.join(" and ").toLowerCase()}, but your ${strengths[0]?.toLowerCase()} could be valuable.`;
  } else {
    return `Significant personality mismatch. This specialty prioritizes ${challenges.join(" and ").toLowerCase()}, which don't align with your current profile. Consider other options.`;
  }
}

/**
 * Calculate match results for all specialties
 */
export function scoreAllSpecialties(userScores: TraitScores): SpecialtyMatchResult[] {
  const matches = ALL_SPECIALTIES.map((specialty) => {
    const distance = calculateTraitDistance(userScores, specialty.traitProfile);
    const matchPercentage = calculateMatchPercentage(distance);
    const strengths = findStrengths(userScores, specialty.traitProfile);
    const challenges = findChallenges(userScores, specialty.traitProfile);
    const confidence = calculateConfidenceLevel(userScores);

    return {
      specialtyId: specialty.id,
      specialtyName: specialty.name,
      matchScore: 100 - Math.round(distance),
      matchPercentage,
      rank: 0, // Will be set after sorting
      strengths,
      challenges,
      reasoning: generateReasoning(matchPercentage, strengths, challenges),
      confidenceLevel: confidence
    };
  });

  // Sort by match percentage descending
  matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

  // Set ranks
  matches.forEach((match, index) => {
    match.rank = index + 1;
  });

  return matches;
}

/**
 * Get top N matches
 */
export function getTopMatches(matches: SpecialtyMatchResult[], count = 5): SpecialtyMatchResult[] {
  return matches.slice(0, count);
}

/**
 * Generate personality summary
 */
export function generatePersonalitySummary(scores: TraitScores): string {
  const { top, bottom } = getTopAndBottomTraits(scores, 3);

  const topTraitNames = top.map(([id]) => TRAIT_DEFINITIONS[id].name);
  const bottomTraitNames = bottom.map(([id]) => TRAIT_DEFINITIONS[id].name);

  return `You appear to be a ${topTraitNames[0]?.toLowerCase()} clinician who values ${topTraitNames[1]?.toLowerCase()} and ${topTraitNames[2]?.toLowerCase()}. Your profile suggests you work best in environments that emphasize ${topTraitNames.slice(0, 2).join(" and ").toLowerCase()}, though you may find ${bottomTraitNames[0]?.toLowerCase()} less natural.`;
}

/**
 * Generate suggested next steps
 */
export function generateSuggestedNextSteps(topMatches: SpecialtyMatchResult[]): string[] {
  const steps = [
    `Shadow a ${topMatches[0]?.specialtyName} specialist at a teaching hospital or private practice.`,
    `Compare your top 3 matches (${topMatches.slice(0, 3).map((m) => m.specialtyName).join(", ")}) through clinical exposure and mentorship.`,
    `Speak with residents and consultants about training pathways and day-to-day realities in your top choice.`,
    `Revisit this assessment after additional clinical rotations and real-world exposure.`
  ];

  return steps;
}

/**
 * Validate quiz responses completeness
 */
export function validateResponsesComplete(
  responses: QuizResponse[],
  totalQuestions: number
): { valid: boolean; missingQuestions: number[] } {
  const answered = responses.map((r) => r.questionId);
  const allQuestionIds = Array.from({ length: totalQuestions }, (_, i) => i + 1);
  const missing = allQuestionIds.filter((id) => !answered.includes(id));

  return {
    valid: missing.length === 0,
    missingQuestions: missing
  };
}

/**
 * Normalize scores to 0-100 scale
 */
export function normalizeToHundredScale(scores: TraitScores): TraitScores {
  const normalized = {} as TraitScores;
  for (const [trait, score] of Object.entries(scores) as Array<[TraitId, number]>) {
    // Score is already 1-100 from our calculation
    normalized[trait] = Math.round(score);
  }
  return normalized;
}
