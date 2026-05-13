import { TRAITS, TRAIT_IDS } from "@/data/traits/index";
import { SpecialtyProfile, TraitScores } from "@/types/dataset";

export function getStrengthTraits(userTraits: TraitScores, specialtyTraits?: TraitScores, count = 3): string[] {
  const ranked = TRAIT_IDS.map((trait) => ({
    trait,
    score: userTraits[trait],
    delta: specialtyTraits ? userTraits[trait] - specialtyTraits[trait] : userTraits[trait]
  })).sort((a, b) => (specialtyTraits ? b.delta - a.delta : b.score - a.score));

  return ranked.slice(0, count).map((item) => TRAITS[item.trait].name);
}

export function getChallengeTraits(userTraits: TraitScores, specialtyTraits: TraitScores, count = 2): string[] {
  return TRAIT_IDS.map((trait) => ({
    trait,
    gap: specialtyTraits[trait] - userTraits[trait]
  }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, count)
    .map((item) => TRAITS[item.trait].name);
}

export function generateSpecialtyReasoning(
  specialty: SpecialtyProfile,
  userTraits: TraitScores,
  matchPercentage: number
): string {
  const strengths = getStrengthTraits(userTraits, specialty.traitProfile, 2);
  const challenges = getChallengeTraits(userTraits, specialty.traitProfile, 2);
  const intro =
    matchPercentage >= 85
      ? "This is a strong match"
      : matchPercentage >= 70
        ? "This is a promising match"
        : matchPercentage >= 55
          ? "This is a possible match"
          : "This may be a stretch match";

  return `${intro} because your ${strengths.join(" and ").toLowerCase()} align with ${specialty.name}'s daily work. The main growth areas to test through shadowing are ${challenges.join(" and ").toLowerCase()}.`;
}

export function generatePersonalitySummary(traitScores: TraitScores): string {
  const top = getStrengthTraits(traitScores, undefined, 4);
  return `Your profile is led by ${top.slice(0, 3).join(", ").toLowerCase()}, with ${top[3].toLowerCase()} also standing out. You may do best in training environments that let you use those strengths while testing fit through real clinical exposure.`;
}
