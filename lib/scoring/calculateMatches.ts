import { SPECIALTIES } from "@/data/specialties/index";
import { SpecialtyMatch, TraitScores } from "@/types/dataset";
import { distanceToMatchPercentage, traitDistance } from "./normalizeTraits";
import { generateSpecialtyReasoning, getChallengeTraits, getStrengthTraits } from "./explanations";

function confidenceFromTraits(traits: TraitScores): "Low" | "Medium" | "High" {
  const values = Object.values(traits);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  const standardDeviation = Math.sqrt(variance);
  if (standardDeviation >= 1.9) return "High";
  if (standardDeviation >= 1.1) return "Medium";
  return "Low";
}

export function calculateMatches(traitScores: TraitScores): SpecialtyMatch[] {
  const confidence = confidenceFromTraits(traitScores);
  return SPECIALTIES.map((specialty) => {
    const distance = traitDistance(traitScores, specialty.traitProfile);
    const matchPercentage = distanceToMatchPercentage(distance);
    const tieBreakerScore =
      specialty.futureDemand === "Very High" ? 2 : specialty.futureDemand === "High" ? 1 : 0;

    return {
      specialtyId: specialty.id,
      specialtyName: specialty.name,
      rank: 0,
      rawScore: Number((10 - distance).toFixed(4)),
      matchPercentage,
      confidence,
      strengths: getStrengthTraits(traitScores, specialty.traitProfile, 3),
      challenges: getChallengeTraits(traitScores, specialty.traitProfile, 2),
      reasoning: generateSpecialtyReasoning(specialty, traitScores, matchPercentage),
      tieBreakerScore
    };
  });
}
