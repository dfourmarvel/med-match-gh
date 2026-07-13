import { assessmentQuestions, emptyTraitVector } from "@/lib/assessment";
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
