import traitsSeed from "@/data/seeds/traits.json";
import { traitLabels } from "@/lib/assessment";
import {
  canonicalToDataTrait,
  dataToCanonicalTrait,
  toCanonicalTraitScores
} from "@/lib/trait-mapping";

const canonicalKeys = new Set(Object.keys(traitLabels));
const seedTraitIds = (traitsSeed as { id: string }[]).map((trait) => trait.id);

describe("trait-mapping", () => {
  it("maps every dataset trait id to a known canonical trait key", () => {
    for (const traitId of seedTraitIds) {
      const canonical = dataToCanonicalTrait[traitId as keyof typeof dataToCanonicalTrait];
      expect(canonical).toBeDefined();
      expect(canonicalKeys.has(canonical)).toBe(true);
    }
  });

  it("covers exactly the dataset trait ids — no missing, no extra", () => {
    expect(new Set(Object.keys(dataToCanonicalTrait))).toEqual(new Set(seedTraitIds));
  });

  it("is a bijection (canonicalToDataTrait inverts dataToCanonicalTrait)", () => {
    for (const [dataId, canonical] of Object.entries(dataToCanonicalTrait)) {
      expect(canonicalToDataTrait[canonical]).toBe(dataId);
    }
    expect(Object.keys(canonicalToDataTrait)).toHaveLength(Object.keys(dataToCanonicalTrait).length);
  });

  it("scales DB scores to the 1-100 range and sets both naming domains", () => {
    const scores = toCanonicalTraitScores([{ trait_id: "diagnosticThinking", score: 8 }]);
    expect(scores.diagnosticThinking).toBe(80); // raw DB id preserved
    expect(scores.diagnosticReasoning).toBe(80); // canonical key set
  });

  it("passes through unknown trait ids unchanged", () => {
    const scores = toCanonicalTraitScores([{ trait_id: "unknownTrait", score: 5 }]);
    expect(scores.unknownTrait).toBe(50);
  });
});
