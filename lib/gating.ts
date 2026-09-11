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
 * Trims a full result down to what a signed-out visitor may receive.
 *
 * This runs on the server and the trimmed object is what crosses the wire, so
 * the locked matches and the real trait scores are not merely hidden — they are
 * never sent. A blur that ships the real data underneath is a marketing gate,
 * not a gate.
 *
 * Kept deliberately: the top-three matches with their full reasoning, the
 * personality summary (it is the hero copy, and an empty hero gives a visitor
 * no reason to sign in), the methodology note and the generic next steps.
 */
export function lockResult(result: FullAssessmentResult): FullAssessmentResult {
  return {
    ...result,
    topMatches: result.topMatches.slice(0, FREE_MATCH_COUNT),
    traitScores: placeholderTraits(),
    locked: true
  };
}

/** Trait keys in their canonical order, for rendering a placeholder radar. */
export const traitOrder = Object.keys(PLACEHOLDER_TRAITS) as TraitKey[];
