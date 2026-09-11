import { assessmentQuestions, emptyTraitVector, traitLabels } from "@/lib/assessment";
import { specialties, specialtiesById } from "@/lib/specialties";
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

  // Accumulate raw, then clamp once. Clamping inside the loop made the result
  // depend on question ORDER: once a trait hit 0 or 100 the excess was thrown
  // away, so a later answer pushing the other way started from the rail instead
  // of from the true running total. Two people giving the same answers to the
  // same questions in a different order could score differently, and ~10% of all
  // trait scores were landing on a rail where this bites.
  for (const question of assessmentQuestions) {
    const answer = answers[question.id] ?? 3;
    const normalized = (answer - 3) * 12.5;
    for (const [trait, weight] of Object.entries(question.weights)) {
      const key = trait as TraitKey;
      scores[key] = scores[key] + normalized * (weight ?? 0);
    }
  }

  for (const trait of Object.keys(scores) as TraitKey[]) {
    scores[trait] = clamp(scores[trait]);
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

  // Only a SHORTFALL is a challenge. This used to rank by |delta|, so scoring
  // far ABOVE what a specialty calls for was reported identically to falling
  // short — a candidate with unusually strong diagnostic reasoning was told to
  // "test it through shadowing" as though it were a weakness. Direction matters,
  // so filter to deltas below the profile and rank by how far below.
  //
  // The list can legitimately come back short, or empty, when a candidate meets
  // or exceeds the profile everywhere. That is a real result, not a gap to pad.
  const challenges = diffs
    .filter((item) => item.delta < 0)
    .sort((a, b) => a.delta - b.delta)
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

/**
 * Plain-English reason for the confidence level. Confidence measures SEPARATION
 * from the next match, not the size of the match percentage, so a high
 * percentage can legitimately carry low confidence. Shown next to the level
 * because the two numbers read as a contradiction without it.
 */
export function confidenceRationale(matches: MatchResult[]): string {
  const top = matches[0];
  if (!top) return "No matches were scored, so there is nothing to compare.";

  const gap = top.explanationFactors.scoreGapFromNext;
  const runnerUp = matches[1] ? specialtiesById[matches[1].specialtyId]?.name : undefined;

  if (gap === undefined || runnerUp === undefined) {
    return "Only one specialty was scored, so there is nothing to separate it from.";
  }

  if (top.confidenceLevel === "High") {
    return `It sits ${gap} points clear of ${runnerUp}, so the ranking is a genuine signal rather than a coin toss.`;
  }
  if (top.confidenceLevel === "Medium") {
    return `It leads ${runnerUp} by ${gap} points. That is a real lead, but close enough that both are worth exploring.`;
  }
  if (gap <= 1) {
    return `${runnerUp} scored within ${gap === 0 ? "the same range" : `${gap} point`}, so your top matches are effectively tied. Confidence is about separation, not fit — treat all five as a shortlist to explore, not a ranking.`;
  }
  return `The scores are bunched together (${gap} points to ${runnerUp}) and no specialty pulls clearly ahead. Confidence is about separation, not fit — treat all five as a shortlist to explore, not a ranking.`;
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
