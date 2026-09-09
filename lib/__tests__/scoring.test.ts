import { assessmentQuestions, emptyTraitVector, traitLabels } from "@/lib/assessment";
import { buildAssessmentResult, calculateTraitScores, scoreSpecialties } from "@/lib/scoring";
import { specialtiesById } from "@/lib/specialties";
import { fullAssessmentResultSchema } from "@/lib/api-validation";

const answersAll = (value: number): Record<number, number> =>
  Object.fromEntries(assessmentQuestions.map((question) => [question.id, value]));

// A deterministic, non-uniform answer set.
const variedAnswers: Record<number, number> = Object.fromEntries(
  assessmentQuestions.map((question, index) => [question.id, ((index * 2) % 5) + 1])
);

describe("calculateTraitScores", () => {
  it("returns the neutral vector when every answer is neutral (3)", () => {
    expect(calculateTraitScores(answersAll(3))).toEqual(emptyTraitVector());
  });

  it("produces all 15 canonical traits within 0-100", () => {
    const scores = calculateTraitScores(variedAnswers);
    expect(Object.keys(scores)).toHaveLength(15);
    for (const value of Object.values(scores)) {
      expect(Number.isFinite(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
  });

  it("shifts scores away from neutral for strongly-agree answers", () => {
    expect(calculateTraitScores(answersAll(5))).not.toEqual(calculateTraitScores(answersAll(3)));
  });
});

describe("scoreSpecialties", () => {
  const traitScores = calculateTraitScores(variedAnswers);

  it("ranks matches by descending score with valid shapes", () => {
    const matches = scoreSpecialties(traitScores, "medical-student");
    expect(matches.length).toBeGreaterThan(0);

    for (let i = 1; i < matches.length; i++) {
      expect(matches[i - 1].score).toBeGreaterThanOrEqual(matches[i].score);
    }
    for (const match of matches) {
      expect(match.matchPercentage).toBeGreaterThanOrEqual(1);
      expect(match.matchPercentage).toBeLessThanOrEqual(99);
      expect(match.strengths).toHaveLength(3);
      expect(match.challenges).toHaveLength(2);
      expect(match.reasoning.length).toBeGreaterThan(0);
    }
  });

  it("filters specialties by audience", () => {
    const medical = scoreSpecialties(traitScores, "medical-student");
    expect(medical.every((m) => specialtiesById[m.specialtyId]?.category === "medical")).toBe(true);

    const dental = scoreSpecialties(traitScores, "dental-student");
    expect(dental.every((m) => specialtiesById[m.specialtyId]?.category === "dental")).toBe(true);

    const highSchool = scoreSpecialties(traitScores, "high-school");
    expect(highSchool.length).toBeGreaterThanOrEqual(medical.length);
  });
});

describe("buildAssessmentResult", () => {
  it("returns a result that satisfies the API schema contract", () => {
    const result = buildAssessmentResult("medical-student", answersAll(5));

    expect(result.audience).toBe("medical-student");
    expect(result.topMatches.length).toBeGreaterThan(0);
    expect(result.topMatches.length).toBeLessThanOrEqual(5);

    const parsed = fullAssessmentResultSchema.safeParse(result);
    expect(parsed.success).toBe(true);
  });
});


/**
 * Answers that drive one trait THROUGH a rail and then back down.
 *
 * The split matters. An even 50/50 push cancels out and never reaches 0 or 100,
 * so per-question clamping and clamp-once agree and the test proves nothing.
 * Sending most questions one way saturates the trait first; the remaining
 * questions then pull back from a value that in-loop clamping has already
 * truncated, which is exactly where the two implementations diverge.
 */
function railingAnswers(): { answers: Record<number, number>; trait: string } {
  const byTrait = new Map<string, number[]>();
  for (const question of assessmentQuestions) {
    for (const trait of Object.keys(question.weights)) {
      byTrait.set(trait, [...(byTrait.get(trait) ?? []), question.id]);
    }
  }
  // The trait with the most questions gives the most room to saturate.
  const [trait, ids] = [...byTrait.entries()].sort((a, b) => b[1].length - a[1].length)[0];
  const answers = answersAll(3);
  ids.forEach((id, index) => {
    answers[id] = index < ids.length - 2 ? 5 : 1;
  });
  return { answers, trait };
}

describe("calculateTraitScores — clamping is applied once, not per question", () => {
  it("gives the same scores regardless of the order questions were answered", () => {
    // Must use answers that actually drive a trait to a rail — clamping inside
    // the loop only diverges once the excess has somewhere to be discarded, so
    // a gentle fixture would pass either way and prove nothing.
    const { answers } = railingAnswers();

    const forwards = calculateTraitScores(answers);
    const backwards = calculateTraitScores(
      Object.fromEntries(Object.entries(answers).reverse())
    );

    expect(backwards).toEqual(forwards);
  });

  it("does not strand a trait at a rail when later answers push the other way", () => {
    const { answers, trait } = railingAnswers();
    const key = trait as keyof ReturnType<typeof emptyTraitVector>;

    const actual = calculateTraitScores(answers)[key];

    // Recompute what clamping inside the loop would have produced, so the
    // assertion is against the specific defect rather than a vague range.
    let stranded = 50;
    for (const question of assessmentQuestions) {
      const weight = (question.weights as Record<string, number | undefined>)[trait];
      if (weight === undefined) continue;
      const normalized = ((answers[question.id] ?? 3) - 3) * 12.5;
      stranded = Math.min(100, Math.max(0, stranded + normalized * weight));
    }

    expect(actual).not.toBe(stranded);
    expect(actual).toBeGreaterThan(stranded);
  });
});

describe("strengths and challenges point in the right direction", () => {
  it("reports no challenges at all when the candidate exceeds every profile", () => {
    // Feed the scorer a maxed trait vector directly. No specialty profile has a
    // trait at 100, so nothing can be a shortfall and the honest answer is an
    // empty list. The old |delta| ranking returned two entries here — the traits
    // furthest ABOVE the profile, presented as things to "test through
    // shadowing", which is precisely backwards.
    const maxed = Object.fromEntries(
      Object.keys(emptyTraitVector()).map((trait) => [trait, 100])
    ) as ReturnType<typeof emptyTraitVector>;

    const matches = scoreSpecialties(maxed, "medical-student");
    expect(matches.length).toBeGreaterThan(0);

    for (const match of matches) {
      expect(match.challenges).toEqual([]);
    }
  });

  it("names a real shortfall as the challenge when the candidate is at the floor", () => {
    const floored = Object.fromEntries(
      Object.keys(emptyTraitVector()).map((trait) => [trait, 0])
    ) as ReturnType<typeof emptyTraitVector>;

    for (const match of scoreSpecialties(floored, "medical-student")) {
      const specialty = specialtiesById[match.specialtyId];
      for (const label of match.challenges) {
        const entry = Object.entries(specialty.traitProfile).find(
          ([trait]) => traitLabels[trait as keyof typeof traitLabels] === label
        );
        expect(entry).toBeDefined();
        // Every named challenge must be a trait the profile actually wants more of.
        expect(entry![1]).toBeGreaterThan(0);
      }
    }
  });

  it("returns at most two challenges, and allows none when nothing falls short", () => {
    const result = buildAssessmentResult("medical-student", answersAll(5));
    for (const match of result.topMatches) {
      expect(match.challenges.length).toBeLessThanOrEqual(2);
    }
  });
});
