import { SPECIALTIES } from "@/data/specialties";

export type TraitScores = Record<string, number>;

export interface SpecialtyMatchScore {
  specialty: string;
  score: number;
}

interface SpecialtyTraitProfile {
  name: string;
  traits: TraitScores;
}

const traitAliases: Record<string, string> = {
  communication: "communicationEmpathy",
  empathy: "communicationEmpathy",
  stressTolerance: "emotionalResilience",
  resilience: "emotionalResilience",
  teamwork: "teamwork",
  teamCollaboration: "teamwork",
  diagnosticReasoning: "diagnosticThinking",
  diagnosticThinking: "diagnosticThinking",
  researchCuriosity: "researchInterest",
  researchInterest: "researchInterest",
  workLifePriority: "workLifeBalancePriority",
  workLifeBalancePriority: "workLifeBalancePriority",
  trainingTolerance: "longTrainingTolerance",
  longTrainingTolerance: "longTrainingTolerance",
  schedulePredictability: "schedulePredictability",
  predictableSchedulePreference: "schedulePredictability"
};

export const specialtyProfiles: SpecialtyTraitProfile[] = SPECIALTIES.map((specialty) => ({
  name: specialty.name,
  traits: specialty.traitProfile
}));

function normalizeTraitKey(key: string) {
  return traitAliases[key] ?? key;
}

function normalizeTraitScores(traits: TraitScores) {
  return Object.entries(traits).reduce<TraitScores>((normalized, [key, value]) => {
    if (Number.isFinite(value)) {
      normalized[normalizeTraitKey(key)] = value;
    }

    return normalized;
  }, {});
}

function weightedCosineSimilarity(userTraits: TraitScores, specialtyTraits: TraitScores) {
  let dotProduct = 0;
  let userMagnitude = 0;
  let specialtyMagnitude = 0;

  for (const [trait, specialtyValue] of Object.entries(specialtyTraits)) {
    const userValue = userTraits[trait];

    if (userValue === undefined || !Number.isFinite(userValue) || !Number.isFinite(specialtyValue)) {
      continue;
    }

    const weight = Math.max(Math.abs(specialtyValue), 1);
    dotProduct += weight * userValue * specialtyValue;
    userMagnitude += weight * userValue ** 2;
    specialtyMagnitude += weight * specialtyValue ** 2;
  }

  if (userMagnitude === 0 || specialtyMagnitude === 0) {
    return 0;
  }

  const similarity = dotProduct / (Math.sqrt(userMagnitude) * Math.sqrt(specialtyMagnitude));
  return Math.max(0, Math.min(1, similarity));
}

export function matchSpecialties(traits: TraitScores, topN = 5): SpecialtyMatchScore[] {
  const normalizedTraits = normalizeTraitScores(traits);
  const resultCount = Math.max(0, Math.floor(topN));

  return specialtyProfiles
    .map((profile) => ({
      specialty: profile.name,
      score: Number(weightedCosineSimilarity(normalizedTraits, profile.traits).toFixed(4))
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.specialty.localeCompare(right.specialty);
    })
    .slice(0, resultCount);
}
