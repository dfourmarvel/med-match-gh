import { assessmentQuestions, emptyTraitVector, traitLabels } from "@/lib/assessment";
import { specialties } from "@/lib/specialties";
import { FullAssessmentResult, MatchResult, TraitKey, TraitVector, Audience } from "@/lib/types";
import { clamp } from "@/lib/utils";

/**
 * Filter specialties based on user audience type
 */
function getSpecialtiesByAudience(audience: Audience): typeof specialties {
  if (audience === "medical-student") {
    return specialties.filter((s) => s.category === "medical");
  } else if (audience === "dental-student") {
    return specialties.filter((s) => s.category === "dental");
  }
  // High school students see all specialties
  return specialties;
}

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
    .slice()
    .sort((a, b) => a.closeness - b.closeness)
    .slice(0, 3)
    .map((item) => traitLabels[item.trait]);

  const challenges = diffs
    .slice()
    .sort((a, b) => b.closeness - a.closeness)
    .slice(0, 2)
    .map((item) => traitLabels[item.trait]);

  return {
    strengths,
    challenges,
    alignedTraits: strengths,
    stretchTraits: challenges
  };
}

function confidenceFromGap(matchPercentage: number, gapFromNext?: number): "Low" | "Medium" | "High" {
  if (matchPercentage >= 82 && (gapFromNext ?? 0) >= 4) return "High";
  if (matchPercentage >= 68 && (gapFromNext ?? 0) >= 2) return "Medium";
  return "Low";
}

function createReasoning(
  matchPercentage: number,
  confidenceLevel: "Low" | "Medium" | "High",
  strengths: string[],
  challenges: string[]
) {
  return `This is an exploratory ${matchPercentage}% fit, not a deterministic career answer. The strongest alignment is around ${strengths.join(", ").toLowerCase()}. The main areas to test through shadowing are ${challenges.join(" and ").toLowerCase()}. Confidence is ${confidenceLevel.toLowerCase()} because it depends on how clearly this specialty separates from nearby matches.`;
}

function summarizePersonality(scores: TraitVector) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 4).map(([trait]) => traitLabels[trait as TraitKey]);
  return `You show a profile anchored by ${top[0]}, ${top[1]}, ${top[2]}, and ${top[3]}. You are likely to do best in career paths that let you combine those strengths with meaningful exposure, mentorship, and structured self-reflection.`;
}

export function scoreSpecialties(traitScores: TraitVector, audience: Audience = "medical-student"): MatchResult[] {
  const filtered = getSpecialtiesByAudience(audience);
  const ranked = filtered
    .map((specialty) => {
      const distance = weightedDistance(traitScores, specialty.traitProfile);
      const score = 1 - distance;
      const matchPercentage = Math.round(clamp(score * 100, 1, 99));
      const { strengths, challenges, alignedTraits, stretchTraits } = strengthsAndChallenges(
        traitScores,
        specialty.traitProfile
      );
      return {
        specialtyId: specialty.id,
        score,
        matchPercentage,
        confidenceLevel: "Low" as const,
        strengths,
        challenges,
        explanationFactors: {
          alignedTraits,
          stretchTraits
        },
        reasoning: ""
      };
    });

  return ranked
    .sort((a, b) => b.score - a.score)
    .map((match, index, matches) => {
      const scoreGapFromNext =
        matches[index + 1] !== undefined
          ? match.matchPercentage - matches[index + 1].matchPercentage
          : undefined;
      const confidenceLevel = confidenceFromGap(match.matchPercentage, scoreGapFromNext);

      return {
        ...match,
        confidenceLevel,
        explanationFactors: {
          ...match.explanationFactors,
          scoreGapFromNext
        },
        reasoning: createReasoning(
          match.matchPercentage,
          confidenceLevel,
          match.strengths,
          match.challenges
        )
      };
    });
}

function overallConfidence(matches: MatchResult[]): "Low" | "Medium" | "High" {
  const top = matches[0];
  if (!top) return "Low";
  return top.confidenceLevel;
}

export function buildAssessmentResult(
  audience: FullAssessmentResult["audience"],
  answers: Record<number, number>
): FullAssessmentResult {
  const traitScores = calculateTraitScores(answers);
  const matches = scoreSpecialties(traitScores, audience).slice(0, 5);
  return {
    audience,
    traitScores,
    topMatches: matches,
    confidenceLevel: overallConfidence(matches),
    methodologyNote:
      "MedMatch compares your answer-derived trait profile with hand-reviewed specialty profiles. Results are exploratory and should be validated through shadowing, mentorship, rotations, and current Ghana training-body guidance.",
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
