import { GHANA_CAREER_CONTEXT, GHANA_TRAINING_REFERENCES } from "@/data/ghana";
import { SpecialtyProfile, SpecialtyMatch, TraitScores } from "@/types/dataset";

const sourceList = GHANA_TRAINING_REFERENCES.map((source) => `${source.label}: ${source.url}`).join("\n");

export const AI_SYSTEM_PROMPT = `You are MedMatch Ghana's careful career guidance assistant. Give warm, practical, Ghana-aware educational guidance. Do not claim certainty, do not provide medical advice, and avoid fake precision about salary or admissions. Encourage shadowing, mentorship, and verification with official training bodies.`;

export function personalizedSpecialtyExplanationPrompt(input: {
  traitScores: TraitScores;
  topMatches: SpecialtyMatch[];
  specialties: SpecialtyProfile[];
}) {
  return `Create a concise personalized explanation for a Ghanaian student using this structured result.

Trait scores, 1-10:
${JSON.stringify(input.traitScores, null, 2)}

Top matches:
${JSON.stringify(input.topMatches, null, 2)}

Specialty context:
${JSON.stringify(input.specialties.map((specialty) => ({
  id: specialty.id,
  name: specialty.name,
  trainingYears: specialty.trainingYears,
  residencyPathwayGhana: specialty.residencyPathwayGhana,
  commonTrainingCenters: specialty.commonTrainingCenters,
  majorPros: specialty.majorPros,
  majorCons: specialty.majorCons
})), null, 2)}

Use Ghana context:
${GHANA_CAREER_CONTEXT.studentAdvice}

Official references to mention cautiously:
${sourceList}

Return JSON with keys: summary, whyTopMatchFits, cautions, shadowingPlan, questionsForMentor.`;
}

export function personalitySummaryPrompt(traitScores: TraitScores) {
  return `Summarize this student's clinical personality in 120 words or fewer. Use supportive language and avoid deterministic labels.

Trait scores:
${JSON.stringify(traitScores, null, 2)}`;
}

export function careerGuidancePrompt(topMatches: SpecialtyMatch[]) {
  return `Give Ghana-aware career guidance for these top specialty matches. Include shadowing, mentorship, rotations, and verification with official requirements.

Matches:
${JSON.stringify(topMatches, null, 2)}`;
}

export function whySpecialtyFitsPrompt(specialty: SpecialtyProfile, match: SpecialtyMatch, traitScores: TraitScores) {
  return `Explain why ${specialty.name} may fit this student. Keep it practical, cite strengths and stretch areas, and avoid overclaiming.

Specialty:
${JSON.stringify(specialty, null, 2)}

Match:
${JSON.stringify(match, null, 2)}

Trait scores:
${JSON.stringify(traitScores, null, 2)}`;
}

export function topThreeComparisonPrompt(matches: SpecialtyMatch[], specialties: SpecialtyProfile[]) {
  return `Compare the student's top three specialties in a concise table-like explanation covering daily work, lifestyle, training, Ghana pathway, and what to test during shadowing.

Matches:
${JSON.stringify(matches.slice(0, 3), null, 2)}

Specialties:
${JSON.stringify(specialties.slice(0, 3), null, 2)}`;
}

export function studyRecommendationsPrompt(specialty: SpecialtyProfile) {
  return `Recommend study activities, extracurriculars, clinical exposure, and research ideas for a Ghanaian student exploring ${specialty.name}.

Specialty data:
${JSON.stringify({
  recommendedStudentActivities: specialty.recommendedStudentActivities,
  researchOpportunities: specialty.researchOpportunities,
  typicalCases: specialty.typicalCases,
  commonTrainingCenters: specialty.commonTrainingCenters
}, null, 2)}`;
}

export function ghanaCareerPathwayPrompt(specialty: SpecialtyProfile) {
  return `Explain the likely Ghana career pathway for ${specialty.name}. Mention that official requirements and accredited centers must be verified.

Known app data:
${JSON.stringify({
  trainingPathway: specialty.trainingPathway,
  residencyPathwayGhana: specialty.residencyPathwayGhana,
  commonTrainingCenters: specialty.commonTrainingCenters
}, null, 2)}

Official reference URLs:
${sourceList}`;
}
