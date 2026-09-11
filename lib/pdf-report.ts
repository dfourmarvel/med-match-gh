import type { jsPDF } from "jspdf";
import { traitLabels } from "@/lib/assessment";
import { specialtiesById } from "@/lib/specialties";
import { confidenceRationale } from "@/lib/scoring";
import { FullAssessmentResult, TraitKey } from "@/lib/types";

/**
 * Vector PDF export for the results report.
 *
 * The charts are drawn natively with jsPDF primitives rather than rasterised
 * from the on-screen recharts SVGs. That keeps the output crisp at any zoom,
 * keeps the file small, and makes the export independent of the live DOM and
 * of the active light/dark theme — the on-screen charts inherit CSS colours
 * that would otherwise bleed a dark theme into a printed report.
 */

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 44;
const CONTENT_W = PAGE_W - MARGIN * 2;

const INK = "#14231c";
const MUTED = "#5c6b63";
const GREEN = "#12291f";
const GOLD = "#c48b1f";
const CREAM = "#f6f0e2";
const RULE = "#ded6c4";

type Doc = jsPDF;

/** Cursor shared across the section writers so page breaks live in one place. */
interface Flow {
  y: number;
}

function ensureSpace(doc: Doc, flow: Flow, needed: number) {
  if (flow.y + needed <= PAGE_H - MARGIN - 18) return;
  doc.addPage();
  flow.y = MARGIN;
}

// `reserve` is the height of the block that follows, so a heading never strands
// itself at the foot of a page with its content pushed to the next one.
function sectionHeading(doc: Doc, flow: Flow, text: string, reserve = 21) {
  ensureSpace(doc, flow, 25 + reserve);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(GOLD);
  doc.text(text.toUpperCase(), MARGIN, flow.y, { charSpace: 1.1 });
  flow.y += 9;
  doc.setDrawColor(RULE);
  doc.setLineWidth(0.7);
  doc.line(MARGIN, flow.y, MARGIN + CONTENT_W, flow.y);
  flow.y += 16;
}

function paragraph(doc: Doc, flow: Flow, text: string, opts?: { size?: number; color?: string; lead?: number }) {
  const size = opts?.size ?? 9.5;
  const lead = opts?.lead ?? size * 1.55;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(size);
  doc.setTextColor(opts?.color ?? INK);
  const lines = doc.splitTextToSize(text, CONTENT_W) as string[];
  for (const line of lines) {
    ensureSpace(doc, flow, lead);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(opts?.color ?? INK);
    doc.text(line, MARGIN, flow.y);
    flow.y += lead;
  }
}

/** Thick arc approximated with short round-capped segments; jsPDF has no arc. */
function arc(
  doc: Doc,
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  sweepDeg: number,
  width: number,
  color: string
) {
  const steps = Math.max(8, Math.round(Math.abs(sweepDeg) / 3));
  doc.setDrawColor(color);
  doc.setLineWidth(width);
  doc.setLineCap("round");
  for (let i = 0; i < steps; i += 1) {
    const a0 = ((startDeg + (sweepDeg * i) / steps) * Math.PI) / 180;
    const a1 = ((startDeg + (sweepDeg * (i + 1)) / steps) * Math.PI) / 180;
    doc.line(cx + r * Math.cos(a0), cy + r * Math.sin(a0), cx + r * Math.cos(a1), cy + r * Math.sin(a1));
  }
  doc.setLineCap("butt");
}

function coverHeader(doc: Doc, result: FullAssessmentResult, flow: Flow) {
  const topMatch = result.topMatches[0];
  const topName = topMatch ? specialtiesById[topMatch.specialtyId]?.name ?? "Top specialty" : "Top specialty";
  const bandH = 196;

  doc.setFillColor(GREEN);
  doc.rect(0, 0, PAGE_W, bandH, "F");

  // Kente accent stripe, echoing the on-screen report header.
  const stripes = ["#c48b1f", "#1f7a4d", "#b4472c", "#e6c760"];
  const stripeW = PAGE_W / 28;
  for (let i = 0; i < 28; i += 1) {
    doc.setFillColor(stripes[i % stripes.length]);
    doc.rect(i * stripeW, 0, stripeW, 5, "F");
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor("#e6c760");
  doc.text("MEDMATCH GHANA  /  SPECIALTY INTELLIGENCE REPORT", MARGIN, 40, { charSpace: 1.4 });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(CREAM);
  const headline = doc.splitTextToSize(`${topName} is your strongest current signal.`, CONTENT_W - 150) as string[];
  let hy = 72;
  for (const line of headline.slice(0, 3)) {
    doc.text(line, MARGIN, hy);
    hy += 27;
  }

  if (topMatch) {
    const cx = PAGE_W - MARGIN - 62;
    const cy = 112;
    const r = 46;
    arc(doc, cx, cy, r, -90, 360, 7, "#345c4a");
    arc(doc, cx, cy, r, -90, (topMatch.matchPercentage / 100) * 360, 7, "#e6c760");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(23);
    doc.setTextColor(CREAM);
    doc.text(`${topMatch.matchPercentage}%`, cx, cy + 3, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor("#b9c7bf");
    doc.text("COMPATIBILITY", cx, cy + 16, { align: "center", charSpace: 0.9 });
  }

  const pills: [string, string][] = [
    ["CONFIDENCE", result.confidenceLevel],
    ["TOP MATCH", topName],
    ["REPORT DATE", new Date(result.generatedAt).toLocaleDateString()]
  ];
  const pillW = (CONTENT_W - 16) / 3;
  pills.forEach(([label, value], i) => {
    const x = MARGIN + i * (pillW + 8);
    doc.setFillColor("#1b3729");
    doc.roundedRect(x, bandH - 62, pillW, 44, 5, 5, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor("#9fb3a8");
    doc.text(label, x + 11, bandH - 44, { charSpace: 1 });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(CREAM);
    const fitted = (doc.splitTextToSize(value, pillW - 22) as string[])[0];
    doc.text(fitted, x + 11, bandH - 29);
  });

  flow.y = bandH + 28;
}

function matchesChart(doc: Doc, result: FullAssessmentResult, flow: Flow) {
  const rowH = 30;
  const labelW = 150;
  const barW = CONTENT_W - labelW - 46;
  sectionHeading(doc, flow, "Compatibility spread", rowH * result.topMatches.length + 10);

  result.topMatches.forEach((match, index) => {
    const specialty = specialtiesById[match.specialtyId];
    const y = flow.y + index * rowH;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(MUTED);
    doc.text(`#${index + 1}`, MARGIN, y);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(INK);
    doc.text((doc.splitTextToSize(specialty?.name ?? match.specialtyId, labelW - 24) as string[])[0], MARGIN + 20, y);

    doc.setFillColor("#eceadf");
    doc.roundedRect(MARGIN + labelW, y - 7.5, barW, 9, 4.5, 4.5, "F");
    doc.setFillColor(index === 0 ? GOLD : "#7a9e8b");
    const filled = Math.max(9, (barW * match.matchPercentage) / 100);
    doc.roundedRect(MARGIN + labelW, y - 7.5, filled, 9, 4.5, 4.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(INK);
    doc.text(`${match.matchPercentage}%`, MARGIN + CONTENT_W, y, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(MUTED);
    doc.text(`${match.confidenceLevel.toUpperCase()} CONFIDENCE`, MARGIN + labelW, y + 11, { charSpace: 0.6 });
  });

  flow.y += rowH * result.topMatches.length + 14;
}

function traitRadar(doc: Doc, result: FullAssessmentResult, flow: Flow) {
  const block = 232;
  sectionHeading(doc, flow, "Trait profile", block + 8);

  const cx = PAGE_W / 2;
  const cy = flow.y + block / 2;
  const r = 82;
  const keys = Object.keys(traitLabels) as TraitKey[];
  const step = (Math.PI * 2) / keys.length;

  // Concentric web at 25/50/75/100 plus the spokes.
  doc.setDrawColor(RULE);
  doc.setLineWidth(0.5);
  for (const ring of [0.25, 0.5, 0.75, 1]) {
    const pts = keys.map((_, i) => {
      const a = -Math.PI / 2 + i * step;
      return [cx + r * ring * Math.cos(a), cy + r * ring * Math.sin(a)] as const;
    });
    pts.forEach(([x, y], i) => {
      const [nx, ny] = pts[(i + 1) % pts.length];
      doc.line(x, y, nx, ny);
    });
  }
  keys.forEach((_, i) => {
    const a = -Math.PI / 2 + i * step;
    doc.line(cx, cy, cx + r * Math.cos(a), cy + r * Math.sin(a));
  });

  const poly = keys.map((key, i) => {
    const a = -Math.PI / 2 + i * step;
    const v = Math.max(0, Math.min(100, result.traitScores[key])) / 100;
    return [cx + r * v * Math.cos(a), cy + r * v * Math.sin(a)] as const;
  });

  // doc.lines() takes deltas between points, so the fill is built as a relative path.
  doc.setFillColor("#2f6b4f");
  doc.setGState(doc.GState({ opacity: 0.25 }));
  doc.lines(
    poly.slice(1).map(([x, y], i) => [x - poly[i][0], y - poly[i][1]] as [number, number]),
    poly[0][0],
    poly[0][1],
    [1, 1],
    "F",
    true
  );
  doc.setGState(doc.GState({ opacity: 1 }));

  doc.setDrawColor("#1f7a4d");
  doc.setLineWidth(1.3);
  poly.forEach(([x, y], i) => {
    const [nx, ny] = poly[(i + 1) % poly.length];
    doc.line(x, y, nx, ny);
  });

  // Axis labels carry the score too, so the chart reads without a legend.
  keys.forEach((key, i) => {
    const a = -Math.PI / 2 + i * step;
    const lx = cx + (r + 13) * Math.cos(a);
    const ly = cy + (r + 13) * Math.sin(a);
    const align = Math.cos(a) > 0.2 ? "left" : Math.cos(a) < -0.2 ? "right" : "center";
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(INK);
    doc.text(`${traitLabels[key]}  ${Math.round(result.traitScores[key])}`, lx, ly + 2, { align });
  });

  flow.y += block + 4;
}

function matchDetails(doc: Doc, result: FullAssessmentResult, flow: Flow) {
  sectionHeading(doc, flow, "Match detail", 78);

  result.topMatches.forEach((match, index) => {
    const specialty = specialtiesById[match.specialtyId];
    ensureSpace(doc, flow, 78);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(INK);
    doc.text(`${index + 1}. ${specialty?.name ?? match.specialtyId}`, MARGIN, flow.y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(GOLD);
    doc.text(`${match.matchPercentage}%`, MARGIN + CONTENT_W, flow.y, { align: "right" });
    flow.y += 14;

    paragraph(doc, flow, match.reasoning, { size: 8.6, color: MUTED, lead: 12.5 });
    flow.y += 3;

    if (match.strengths.length) {
      paragraph(doc, flow, `Strengths: ${match.strengths.join(", ")}`, { size: 8.6, lead: 12.5 });
    }
    if (match.challenges.length) {
      paragraph(doc, flow, `Test through shadowing: ${match.challenges.join(", ")}`, { size: 8.6, lead: 12.5 });
    }
    flow.y += 12;
  });
}

function closingSections(doc: Doc, result: FullAssessmentResult, aiSummary: string, flow: Flow) {
  if (aiSummary.trim()) {
    sectionHeading(doc, flow, "AI guidance");
    paragraph(doc, flow, aiSummary.trim());
    flow.y += 4;
    paragraph(
      doc,
      flow,
      "AI-generated summary. It can be wrong. Check it against a mentor or supervisor before acting on it.",
      { size: 8, color: MUTED, lead: 11 }
    );
    flow.y += 12;
  }

  if (result.suggestedNextSteps.length) {
    sectionHeading(doc, flow, "Suggested next steps");
    result.suggestedNextSteps.forEach((stepText) => {
      ensureSpace(doc, flow, 16);
      doc.setFillColor(GOLD);
      doc.circle(MARGIN + 3, flow.y - 3, 2, "F");
      const lines = doc.splitTextToSize(stepText, CONTENT_W - 16) as string[];
      lines.forEach((line, i) => {
        if (i > 0) ensureSpace(doc, flow, 14);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(INK);
        doc.text(line, MARGIN + 14, flow.y);
        flow.y += 14;
      });
      flow.y += 3;
    });
    flow.y += 10;
  }

  sectionHeading(doc, flow, "Methodology");
  paragraph(doc, flow, result.methodologyNote, { size: 8.6, color: MUTED, lead: 12.5 });
  flow.y += 6;
  paragraph(
    doc,
    flow,
    "Confidence reflects how far your top match sits ahead of the next one, not how good the match itself is. A high percentage with low confidence means several specialties fit you almost equally well, so treat the ranking as a shortlist to explore rather than a verdict.",
    { size: 8.6, color: MUTED, lead: 12.5 }
  );
}

function footers(doc: Doc) {
  const total = doc.getNumberOfPages();
  for (let page = 1; page <= total; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(RULE);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, PAGE_H - MARGIN + 6, MARGIN + CONTENT_W, PAGE_H - MARGIN + 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(MUTED);
    doc.text("MedMatch Ghana - exploratory guidance, not a career decision.", MARGIN, PAGE_H - MARGIN + 18);
    doc.text(`Page ${page} of ${total}`, MARGIN + CONTENT_W, PAGE_H - MARGIN + 18, { align: "right" });
  }
}

function fileName(result: FullAssessmentResult) {
  const top = result.topMatches[0];
  const slug = top
    ? (specialtiesById[top.specialtyId]?.name ?? "report").toLowerCase().replace(/[^a-z0-9]+/g, "-")
    : "report";
  const generated = new Date(result.generatedAt);
  const date = Number.isNaN(generated.getTime())
    ? new Date().toISOString().slice(0, 10)
    : generated.toISOString().slice(0, 10);
  return `medmatch-${slug}-${date}.pdf`;
}

/**
 * Builds the report document. jsPDF is imported dynamically so its bundle never
 * lands in the initial results chunk.
 */
export async function buildResultsPdf(result: FullAssessmentResult, aiSummary: string) {
  const { jsPDF: JsPDF } = await import("jspdf");
  const doc = new JsPDF({ unit: "pt", format: "a4", compress: true });

  doc.setProperties({
    title: "MedMatch Ghana - Specialty Intelligence Report",
    subject: "Specialty compatibility results",
    creator: "MedMatch Ghana"
  });

  const flow: Flow = { y: MARGIN };
  coverHeader(doc, result, flow);
  paragraph(doc, flow, result.personalitySummary);
  flow.y += 6;
  paragraph(doc, flow, `Confidence: ${result.confidenceLevel}. ${confidenceRationale(result.topMatches)}`, {
    size: 8.6,
    color: MUTED,
    lead: 12.5
  });
  flow.y += 16;

  matchesChart(doc, result, flow);
  traitRadar(doc, result, flow);
  matchDetails(doc, result, flow);
  closingSections(doc, result, aiSummary, flow);
  footers(doc);

  return { doc, fileName: fileName(result) };
}

/** Builds the report and hands the browser a direct file download. */
export async function downloadResultsPdf(result: FullAssessmentResult, aiSummary: string) {
  const { doc, fileName: name } = await buildResultsPdf(result, aiSummary);
  doc.save(name);
}
