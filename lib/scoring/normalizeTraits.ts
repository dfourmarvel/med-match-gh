import { TraitId, TraitScores } from "@/types/dataset";
import { TRAIT_IDS, clampTraitScore, createNeutralTraitScores } from "@/data/traits/index";

export function normalizeAnswer(answer: number): number {
  return Math.max(-1, Math.min(1, (answer - 3) / 2));
}

export function normalizeTraits(scores: Partial<Record<TraitId, number>>): TraitScores {
  const normalized = createNeutralTraitScores();
  for (const id of TRAIT_IDS) {
    normalized[id] = clampTraitScore(scores[id] ?? normalized[id]);
  }
  return normalized;
}

export function traitDistance(a: TraitScores, b: TraitScores): number {
  const sumSquares = TRAIT_IDS.reduce((sum, id) => sum + (a[id] - b[id]) ** 2, 0);
  return Math.sqrt(sumSquares / TRAIT_IDS.length);
}

export function distanceToMatchPercentage(distance: number): number {
  const maxObservedDistance = 6.5;
  return Math.max(1, Math.min(99, Math.round(100 - (distance / maxObservedDistance) * 100)));
}
