import { FullAssessmentResult, TraitKey, TraitVector } from "@/lib/types";

/** How many matches a signed-out visitor gets to see for real. */
export const FREE_MATCH_COUNT = 3;

/**
 * Placeholder trait scores shipped in place of the real ones to a signed-out
 * visitor. The results page renders the radar from whatever it is given and
 * blurs it, so the shape on screen is decorative — it must not be the
 * visitor's own profile, or "locked" would mean nothing but a CSS filter.
 *
 * Deliberately unremarkable values: a blurred chart that happens to look
 * dramatic would misrepresent a result nobody has unlocked yet.
 */
const PLACEHOLDER_TRAITS: TraitVector = {
  patientInteraction: 62,
  proceduralInterest: 48,
  diagnosticReasoning: 66,
  fastPacedPreference: 54,
  workLifePriority: 58,
  emotionalResilience: 60,
  teamCollaboration: 64,
  precisionOrientation: 57,
  longTermRelationships: 61,
  researchCuriosity: 52,
  leadershipPreference: 50,
  trainingTolerance: 59,
  emergencyComfort: 46,
  communicationEmpathy: 68,
  predictableSchedulePreference: 53
};

export function placeholderTraits(): TraitVector {
  return { ...PLACEHOLDER_TRAITS };
}

/**
 * What a signed-out visitor is told instead of their real personality summary.
 * The real one names their top four traits in prose, which would have leaked
 * the very profile the blurred radar beside it is meant to be withholding.
 */
export const LOCKED_SUMMARY =
  "Your top three matches are below. The trait profile behind them, the reasoning for each match, and the side-by-side specialty comparisons unlock when you sign in.";

/**
 * Trims a full result down to what a signed-out visitor may receive.
 *
 * This runs on the server and the trimmed object is what crosses the wire, so
 * the locked content is not merely hidden — it is never sent. A blur that ships
 * the real data underneath is a marketing gate, not a gate.
 *
 * Kept: the three free matches by name, percentage and confidence level, the
 * methodology note, and the generic next steps.
 *
 * Removed: matches four and five, the real trait scores, the personality
 * summary, and every per-match field derived from the trait profile
 * (strengths, challenges, aligned/stretch traits, reasoning prose). Those feed
 * the locked "What it takes", "Compare your top 3" and "Why these matches
 * surfaced" panels, which render placeholder content under the blur.
 *
 * `scoreGapFromNext` on the top match survives because the hero's confidence
 * sentence is free and is written from it.
 */
export function lockResult(result: FullAssessmentResult): FullAssessmentResult {
  return {
    ...result,
    topMatches: result.topMatches.slice(0, FREE_MATCH_COUNT).map((match) => ({
      specialtyId: match.specialtyId,
      score: match.score,
      matchPercentage: match.matchPercentage,
      confidenceLevel: match.confidenceLevel,
      strengths: [],
      challenges: [],
      explanationFactors: {
        alignedTraits: [],
        stretchTraits: [],
        scoreGapFromNext: match.explanationFactors.scoreGapFromNext
      },
      reasoning: ""
    })),
    traitScores: placeholderTraits(),
    personalitySummary: LOCKED_SUMMARY,
    locked: true
  };
}

/** Trait keys in their canonical order, for rendering a placeholder radar. */
export const traitOrder = Object.keys(PLACEHOLDER_TRAITS) as TraitKey[];
