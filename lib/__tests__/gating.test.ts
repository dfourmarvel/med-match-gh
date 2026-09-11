import { FREE_MATCH_COUNT, lockResult, placeholderTraits } from "@/lib/gating";
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

  it("keeps the hero copy, methodology and next steps so the page is still usable", () => {
    const locked = lockResult(full);
    expect(locked.personalitySummary).toBe(full.personalitySummary);
    expect(locked.methodologyNote).toBe(full.methodologyNote);
    expect(locked.suggestedNextSteps).toEqual(full.suggestedNextSteps);
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
