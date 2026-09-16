import { buildCompletionProperties, capture } from "@/lib/analytics";
import { buildAssessmentResult } from "@/lib/scoring";
import posthog from "posthog-js";

const answers = { 1: 5, 2: 1, 3: 4 };

function makeResult(locked: boolean) {
  const full = buildAssessmentResult("medical-student", answers);
  return { ...full, locked };
}

describe("buildCompletionProperties", () => {
  it("flattens matches, answers and traits into top-level properties", () => {
    const result = makeResult(false);
    const properties = buildCompletionProperties(result, answers, 125_400);

    expect(properties.audience).toBe("medical-student");
    expect(properties.duration_seconds).toBe(125);
    expect(properties.answered_count).toBe(3);
    expect(properties.top_specialty).toBe(result.topMatches[0].specialtyId);
    expect(properties.match_1_specialty).toBe(result.topMatches[0].specialtyId);
    expect(properties.match_1_pct).toBe(result.topMatches[0].matchPercentage);
    expect(properties.q1).toBe(5);
    expect(properties.q2).toBe(1);
    expect(properties.trait_patientInteraction).toBe(result.traitScores.patientInteraction);
  });

  it("leaves out placeholder traits from a locked result", () => {
    const properties = buildCompletionProperties(makeResult(true), answers, null);

    expect(properties.locked).toBe(true);
    expect(properties.duration_seconds).toBeNull();
    expect(Object.keys(properties).some((key) => key.startsWith("trait_"))).toBe(false);
  });
});

describe("capture", () => {
  it("does nothing when PostHog was never initialised", () => {
    capture("test_event");
    expect(posthog.capture).not.toHaveBeenCalled();
  });
});
