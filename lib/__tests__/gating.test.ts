import { FREE_MATCH_COUNT, LOCKED_SUMMARY, lockResult, placeholderTraits } from "@/lib/gating";
import { buildAssessmentResult } from "@/lib/scoring";
import { assessmentQuestions } from "@/lib/assessment";
import { fullAssessmentResultSchema } from "@/lib/api-validation";

const answers: Record<number, number> = Object.fromEntries(
  assessmentQuestions.map((question, index) => [question.id, ((index * 3) % 5) + 1])
);

const full = buildAssessmentResult("medical-student", answers);

describe("lockResult", () => {
  it("keeps only the free matches", () => {
    const locked = lockResult(full);
    expect(full.topMatches.length).toBeGreaterThan(FREE_MATCH_COUNT);
    expect(locked.topMatches).toHaveLength(FREE_MATCH_COUNT);
    expect(locked.topMatches.map((m) => m.specialtyId)).toEqual(
      full.topMatches.slice(0, FREE_MATCH_COUNT).map((m) => m.specialtyId)
    );
  });

  it("does not leak the locked matches anywhere in the serialised payload", () => {
    const locked = lockResult(full);
    const wire = JSON.stringify(locked);
    for (const match of full.topMatches.slice(FREE_MATCH_COUNT)) {
      expect(wire).not.toContain(match.specialtyId);
    }
  });

  it("replaces the real trait scores with placeholders", () => {
    const locked = lockResult(full);
    expect(locked.traitScores).toEqual(placeholderTraits());
    expect(locked.traitScores).not.toEqual(full.traitScores);
  });

  it("marks the payload as locked", () => {
    expect(lockResult(full).locked).toBe(true);
    expect(full.locked).toBeUndefined();
  });

  it("keeps the methodology and next steps so the page is still usable", () => {
    const locked = lockResult(full);
    expect(locked.methodologyNote).toBe(full.methodologyNote);
    expect(locked.suggestedNextSteps).toEqual(full.suggestedNextSteps);
  });

  it("replaces the personality summary, which names the real top traits in prose", () => {
    const locked = lockResult(full);
    expect(locked.personalitySummary).toBe(LOCKED_SUMMARY);
    expect(locked.personalitySummary).not.toBe(full.personalitySummary);
  });

  it("strips every trait-derived field from the free matches", () => {
    const locked = lockResult(full);
    for (const match of locked.topMatches) {
      expect(match.strengths).toEqual([]);
      expect(match.challenges).toEqual([]);
      expect(match.explanationFactors.alignedTraits).toEqual([]);
      expect(match.explanationFactors.stretchTraits).toEqual([]);
      expect(match.reasoning).toBe("");
    }
  });

  it("keeps the top match score gap, which the free confidence sentence is written from", () => {
    const locked = lockResult(full);
    expect(locked.topMatches[0].explanationFactors.scoreGapFromNext).toBe(
      full.topMatches[0].explanationFactors.scoreGapFromNext
    );
  });

  it("does not leak any trait label anywhere in the serialised payload", () => {
    const wire = JSON.stringify(lockResult(full));
    for (const label of full.topMatches[0].strengths.concat(full.topMatches[0].challenges)) {
      expect(wire).not.toContain(label);
    }
  });

  it("still validates against the wire schema", () => {
    expect(fullAssessmentResultSchema.safeParse(lockResult(full)).success).toBe(true);
  });

  it("does not mutate the result it was given", () => {
    const before = JSON.stringify(full);
    lockResult(full);
    expect(JSON.stringify(full)).toBe(before);
  });
});

describe("placeholderTraits", () => {
  it("returns a fresh copy each time, so a caller cannot poison the constant", () => {
    const first = placeholderTraits();
    first.patientInteraction = 999;
    expect(placeholderTraits().patientInteraction).not.toBe(999);
  });

  it("covers all fifteen traits in range", () => {
    const traits = placeholderTraits();
    expect(Object.keys(traits)).toHaveLength(15);
    for (const value of Object.values(traits)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
  });
});
