import { TraitId } from "@/data/types";
import { TraitKey } from "@/lib/types";

/**
 * MedMatch has two trait naming domains, and this module is the single source of
 * truth translating between them (API-4):
 *
 *  - DB / dataset trait ids (`TraitId`) — e.g. "diagnosticThinking", "teamwork",
 *    "longTrainingTolerance". Stored in Supabase (`trait_scores.trait_id`) and the
 *    dataset seeds (`data/seeds/traits.json`).
 *  - Canonical app trait keys (`TraitKey`) — e.g. "diagnosticReasoning",
 *    "teamCollaboration", "trainingTolerance". Consumed by the scorer
 *    (`lib/scoring.ts`) and specialty profiles.
 */
export const dataToCanonicalTrait: Record<TraitId, TraitKey> = {
  patientInteraction: "patientInteraction",
  proceduralInterest: "proceduralInterest",
  diagnosticThinking: "diagnosticReasoning",
  fastPacedPreference: "fastPacedPreference",
  workLifeBalancePriority: "workLifePriority",
  emotionalResilience: "emotionalResilience",
  teamwork: "teamCollaboration",
  precisionOrientation: "precisionOrientation",
  longTermRelationships: "longTermRelationships",
  researchInterest: "researchCuriosity",
  leadershipPreference: "leadershipPreference",
  longTrainingTolerance: "trainingTolerance",
  emergencyComfort: "emergencyComfort",
  communicationEmpathy: "communicationEmpathy",
  schedulePredictability: "predictableSchedulePreference"
};

export const canonicalToDataTrait = Object.fromEntries(
  Object.entries(dataToCanonicalTrait).map(([dataTrait, canonicalTrait]) => [canonicalTrait, dataTrait])
) as Record<TraitKey, TraitId>;

/** Translate a DB trait id to its canonical app key, falling back to the input. */
export function toCanonicalTraitKey(traitId: string): string {
  return dataToCanonicalTrait[traitId as TraitId] ?? traitId;
}

export interface TraitScoreRow {
  trait_id: string;
  score: number | string;
}

/**
 * Turn Supabase `trait_scores` rows into a score record for the matcher.
 * DB scores are on a 1-10 scale while specialty profiles use 1-100, so values
 * are multiplied by 10. Both the raw DB id and the canonical key are set so
 * downstream code can read either naming domain.
 */
export function toCanonicalTraitScores(rows: TraitScoreRow[]): Record<string, number> {
  const traitScores: Record<string, number> = {};
  for (const row of rows) {
    const value = Number(row.score) * 10;
    traitScores[row.trait_id] = value;
    traitScores[toCanonicalTraitKey(row.trait_id)] = value;
  }
  return traitScores;
}
