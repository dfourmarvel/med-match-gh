import { SpecialtyMatch } from "@/types/dataset";

export function rankSpecialtyMatches(matches: SpecialtyMatch[]): SpecialtyMatch[] {
  const sorted = [...matches].sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) return b.matchPercentage - a.matchPercentage;
    if (b.rawScore !== a.rawScore) return b.rawScore - a.rawScore;
    if (b.tieBreakerScore !== a.tieBreakerScore) return b.tieBreakerScore - a.tieBreakerScore;
    return a.specialtyName.localeCompare(b.specialtyName);
  });

  return sorted.map((match, index) => ({ ...match, rank: index + 1 }));
}

export function getTopMatches(matches: SpecialtyMatch[], count = 5): SpecialtyMatch[] {
  return rankSpecialtyMatches(matches).slice(0, count);
}
