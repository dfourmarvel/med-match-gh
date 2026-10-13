/**
 * @jest-environment node
 */
import { assessmentQuestions } from "@/lib/assessment";
import { buildResultsPdf } from "@/lib/pdf-report";
import { buildAssessmentResult } from "@/lib/scoring";

// Smoke test only: layout is a visual check, but a jsPDF upgrade that breaks
// the drawing calls should fail here rather than in a user's browser.
describe("buildResultsPdf", () => {
  it("produces a multi-page PDF for a completed assessment", async () => {
    const answers = Object.fromEntries(assessmentQuestions.map((q, i) => [q.id, (i % 5) + 1]));
    const result = buildAssessmentResult("medical-student", answers);

    const { doc, fileName } = await buildResultsPdf(result, "A short AI summary.");
    const bytes = new Uint8Array(doc.output("arraybuffer"));

    expect(String.fromCharCode(...bytes.slice(0, 5))).toBe("%PDF-");
    expect(doc.getNumberOfPages()).toBeGreaterThan(1);
    expect(fileName).toMatch(/^medmatch-.+\.pdf$/);
  });
});
