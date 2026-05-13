import { assessmentQuestions, emptyTraitVector, traitLabels } from "@/lib/assessment";
import { specialties } from "@/lib/specialties";
import { FullAssessmentResult, MatchResult, TraitKey, TraitVector } from "@/lib/types";
import { clamp } from "@/lib/utils";

const traitWeighting: Record<TraitKey, number> = {
  patientInteraction: 1,
  proceduralInterest: 1.1,
  diagnosticReasoning: 1.1,
  fastPacedPreference: 0.9,
  workLifePriority: 0.8,
  emotionalResilience: 1,
  teamCollaboration: 0.9,
  precisionOrientation: 1.05,
  longTermRelationships: 0.9,
  researchCuriosity: 0.8,
  leadershipPreference: 0.75,
  trainingTolerance: 0.8,
  emergencyComfort: 1,
  communicationEmpathy: 1,
  predictableSchedulePreference: 0.75
};

export function calculateTraitScores(answers: Record<number, number>): TraitVector {
  const scores = emptyTraitVector();

  for (const question of assessmentQuestions) {
    const answer = answers[question.id] ?? 3;
    const normalized = (answer - 3) * 12.5;
    for (const [trait, weight] of Object.entries(question.weights)) {
      const key = trait as TraitKey;
      scores[key] = clamp(scores[key] + normalized * (weight ?? 0));
    }
  }

  return scores;
}

function weightedDistance(a: TraitVector, b: TraitVector) {
  let total = 0;
  let denom = 0;

  for (const [trait, weight] of Object.entries(traitWeighting)) {
    const key = trait as TraitKey;
    total += weight * (a[key] - b[key]) ** 2;
    denom += weight * 100 ** 2;
  }

  return Math.sqrt(total / denom);
}

function strengthsAndChallenges(user: TraitVector, target: TraitVector) {
  const diffs = Object.entries(user).map(([trait, value]) => ({
    trait: trait as TraitKey,
    delta: value - target[trait as TraitKey],
    closeness: Math.abs(value - target[trait as TraitKey])
  }));

  const strengths = diffs
    .sort((a, b) => a.closeness - b.closeness)
    .slice(0, 3)
    .map((item) => traitLabels[item.trait]);

  const challenges = diffs
    .sort((a, b) => b.closeness - a.closeness)
    .slice(0, 2)
    .map((item) => traitLabels[item.trait]);

  return { strengths, challenges };
}

function createReasoning(matchPercentage: number, strengths: string[], challenges: string[]) {
  return `This specialty aligns strongly with your profile because your ${strengths.join(", ").toLowerCase()} closely match what the field tends to reward. A likely stretch area is ${challenges.join(" and ").toLowerCase()}, so shadowing and reflective mentorship would help test fit in real settings. Match confidence: ${matchPercentage}%.`;
}

function summarizePersonality(scores: TraitVector) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 4).map(([trait]) => traitLabels[trait as TraitKey]);
  return `You show a profile anchored by ${top[0]}, ${top[1]}, ${top[2]}, and ${top[3]}. You are likely to do best in career paths that let you combine those strengths with meaningful exposure, mentorship, and structured self-reflection.`;
}

export function scoreSpecialties(traitScores: TraitVector): MatchResult[] {
  return specialties
    .map((specialty) => {
      const distance = weightedDistance(traitScores, specialty.traitProfile);
      const score = 1 - distance;
      const matchPercentage = Math.round(clamp(score * 100, 1, 99));
      const { strengths, challenges } = strengthsAndChallenges(traitScores, specialty.traitProfile);
      return {
        specialtyId: specialty.id,
        score,
        matchPercentage,
        strengths,
        challenges,
        reasoning: createReasoning(matchPercentage, strengths, challenges)
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function buildAssessmentResult(
  audience: FullAssessmentResult["audience"],
  answers: Record<number, number>
): FullAssessmentResult {
  const traitScores = calculateTraitScores(answers);
  return {
    audience,
    traitScores,
    topMatches: scoreSpecialties(traitScores).slice(0, 5),
    personalitySummary: summarizePersonality(traitScores),
    suggestedNextSteps: [
      "Shadow one of your top matches at a teaching hospital or private clinic if possible.",
      "Compare the top 3 specialties and note which trade-offs energize you most.",
      "Speak with a mentor from University of Ghana Medical School, KNUST School of Medical Sciences, or a teaching hospital rotation about training realities in Ghana.",
      "Revisit your results after more clinical or dental exposure."
    ],
    generatedAt: new Date().toISOString()
  };
}
