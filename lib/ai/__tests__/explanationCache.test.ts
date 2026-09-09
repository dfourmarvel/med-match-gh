/**
 * @jest-environment node
 */

import { explanationCacheKey } from "@/lib/ai/explanationCache";

describe("explanationCacheKey", () => {
  const input = {
    audience: "medical-student",
    traitScores: { diagnosticReasoning: 88, patientInteraction: 76 },
    matches: [{ specialtyId: "internal-medicine", matchPercentage: 79 }]
  };

  it("is stable across key order, so an equivalent payload hits the cache", () => {
    // JSON.stringify does not guarantee key order between objects built by
    // different code paths. An unstable key would not break anything visibly —
    // it would just silently never hit, which is the failure mode worth pinning.
    const reordered = {
      matches: [{ matchPercentage: 79, specialtyId: "internal-medicine" }],
      traitScores: { patientInteraction: 76, diagnosticReasoning: 88 },
      audience: "medical-student"
    };

    expect(explanationCacheKey(reordered)).toBe(explanationCacheKey(input));
  });

  it("changes when any input changes", () => {
    const base = explanationCacheKey(input);

    expect(
      explanationCacheKey({ ...input, audience: "dental-student" })
    ).not.toBe(base);

    expect(
      explanationCacheKey({
        ...input,
        traitScores: { ...input.traitScores, diagnosticReasoning: 89 }
      })
    ).not.toBe(base);

    expect(
      explanationCacheKey({
        ...input,
        matches: [{ specialtyId: "pediatrics", matchPercentage: 79 }]
      })
    ).not.toBe(base);
  });

  it("treats an explicit undefined the same as an absent field", () => {
    // topMatches carries optional strengths/challenges; a payload that sends
    // them as undefined must not miss against one that omits them.
    expect(
      explanationCacheKey({ ...input, strengths: undefined })
    ).toBe(explanationCacheKey(input));
  });

  it("namespaces and versions the key, so a prompt change can invalidate cleanly", () => {
    const key = explanationCacheKey(input);
    expect(key.startsWith("medmatch:ai-explanation:v1:")).toBe(true);
  });

  it("leaks nothing identifying into the key", () => {
    const key = explanationCacheKey(input);
    expect(key).not.toContain("internal-medicine");
    expect(key).not.toContain("medical-student");
    expect(key).toMatch(/^medmatch:ai-explanation:v1:[0-9a-f]{32}$/);
  });
});
