import { matchSpecialties, specialtyProfiles } from "@/lib/specialtyMatcher";

describe("matchSpecialties", () => {
  it("ranks the closest specialty profile first", () => {
    const surgeryProfile = specialtyProfiles.find((profile) => profile.name === "General Surgery");

    expect(surgeryProfile).toBeDefined();

    const matches = matchSpecialties(surgeryProfile!.traits, 3);

    expect(matches[0]).toEqual({
      specialty: "General Surgery",
      score: 1
    });
    expect(matches).toHaveLength(3);
    expect(matches[0].score).toBeGreaterThanOrEqual(matches[1].score);
    expect(matches[1].score).toBeGreaterThanOrEqual(matches[2].score);
  });

  it("returns deterministic output for the same trait scores", () => {
    const traits = {
      empathy: 9,
      communication: 10,
      stressTolerance: 8,
      diagnosticThinking: 7,
      proceduralInterest: 2,
      schedulePredictability: 7
    };

    const firstRun = matchSpecialties(traits, 5);
    const secondRun = matchSpecialties(traits, 5);

    expect(firstRun).toEqual(secondRun);
  });

  it("honors topN and returns an empty list for zero results", () => {
    expect(matchSpecialties({ empathy: 8 }, 0)).toEqual([]);
    expect(matchSpecialties({ empathy: 8 }, 2)).toHaveLength(2);
  });

  it("returns zero scores deterministically when traits do not overlap", () => {
    const matches = matchSpecialties({ unrelatedTrait: 10 }, 2);

    expect(matches).toEqual([...matches].sort((left, right) => left.specialty.localeCompare(right.specialty)));
    expect(matches.every((match) => match.score === 0)).toBe(true);
  });
});
