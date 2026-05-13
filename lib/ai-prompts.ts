/**
 * AI Prompt Templates for MedMatch Ghana
 * Structured prompts for generating personalized career guidance
 */

import { TraitId, TraitScores, SpecialtyMatchResult } from "@/data/types";
import { TRAIT_DEFINITIONS } from "@/data/traits";
import { MEDICAL_SPECIALTIES } from "@/data/specialties-medical";

/**
 * Generate comprehensive personalized explanation prompt
 */
export function generatePersonalizedExplanationPrompt(
  topMatches: SpecialtyMatchResult[],
  traitScores: TraitScores,
  personalitySummary: string
): string {
  const topSpecialties = topMatches.slice(0, 3).map((m) => m.specialtyName).join(", ");
  const traitSummary = (Object.entries(traitScores) as Array<[TraitId, number]>)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id, score]) => `${TRAIT_DEFINITIONS[id].name} (${Math.round(score)})`)
    .join(", ");

  return `You are a warm, practical medical career advisor focused on Ghana. Create a concise, personalized explanation for a medical student based on their assessment results.

User Profile:
- Personality: ${personalitySummary}
- Top trait scores: ${traitSummary}
- Top 3 specialty matches: ${topSpecialties}

Match Details:
${topMatches
  .slice(0, 3)
  .map(
    (m) =>
      `${m.specialtyName} (${m.matchPercentage}%): Strengths - ${m.strengths.join(", ")}. Challenges - ${m.challenges.join(", ")}`
  )
  .join("\n")}

Create a 2-3 paragraph explanation that:
1. Validates their strengths and fit
2. Addresses potential challenges with specific development suggestions
3. Recommends concrete next steps (shadowing, mentorship, etc.)
4. References Ghana-specific training realities where relevant

Keep it encouraging, practical, and specific to Ghana's medical education system.`;
}

/**
 * Generate personality type categorization prompt
 */
export function generatePersonalityTypePrompt(traitScores: TraitScores): string {
  const traitSummary = (Object.entries(traitScores) as Array<[TraitId, number]>)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([id, score]) => `${TRAIT_DEFINITIONS[id].name}: ${Math.round(score)}`)
    .join("\n");

  return `Based on the following trait scores (1-100 scale), assign this medical student to ONE of these personality archetypes:

- "The Healer" (high empathy, patient-focused, relationship-oriented)
- "The Thinker" (high analytical, diagnostic, research-focused)
- "The Doer" (high procedural, action-oriented, emergency-focused)
- "The Communicator" (high empathy, team-focused, leadership-oriented)
- "The Perfectionist" (high precision, detail-focused, quality-oriented)
- "The Balanced Professional" (moderate across all traits)

Trait scores:
${traitSummary}

Respond with ONLY the archetype name and a 1-sentence explanation of why.`;
}

/**
 * Generate study recommendations prompt
 */
export function generateStudyRecommendationsPrompt(topMatches: SpecialtyMatchResult[]): string {
  const specialties = topMatches.slice(0, 3).map((m) => m.specialtyName).join(", ");

  return `Generate 5 specific, actionable study recommendations for a Ghanaian medical student interested in: ${specialties}

Include:
1. Textbooks or resources specific to Ghana's medical curriculum
2. Clinical skills to prioritize in electives
3. Research topics to explore
4. Professional societies to join
5. Extracurricular activities (local and international opportunities)

Format as a numbered list with brief explanations.`;
}

/**
 * Generate Ghana-specific career pathway prompt
 */
export function generateGhanaCareerPathwayPrompt(
  specialtyName: string,
  matchPercentage: number
): string {
  return `You are an expert in Ghana's medical specialty training system. Provide a practical, Ghana-focused career pathway for someone considering ${specialtyName} as a specialty.

Include:
1. Training pathway after medical school in Ghana (housemanship, residency structure)
2. Key training institutions in Ghana (Korle Bu, Komfo Anokye, others)
3. Expected timeline to become a specialist (in Ghana)
4. Licensing and board certifications required
5. Private practice vs. public sector opportunities
6. International mobility options (UK, US, Middle East, etc.)
7. Realistic earning potential in Ghana (public and private)
8. Specific challenges or advantages for this specialty in Ghana

Keep information current and practical for someone starting medical school or early postgraduate training.`;
}

/**
 * Generate comparison explanation for top 3 matches
 */
export function generateComparisonPrompt(topMatches: SpecialtyMatchResult[]): string {
  const specialties = topMatches.slice(0, 3);

  const comparisonData = specialties
    .map(
      (m) =>
        `${m.specialtyName} (${m.matchPercentage}% fit):
    Strengths align: ${m.strengths.join(", ")}
    Challenges: ${m.challenges.join(", ")}`
    )
    .join("\n\n");

  return `Create a brief comparison table (narrative format) showing the key differences between these 3 specialties:

${comparisonData}

Compare them on:
1. Work-life balance and lifestyle
2. Training intensity and duration
3. Patient interaction frequency
4. Procedural vs. diagnostic emphasis
5. Income potential in Ghana
6. Long-term career satisfaction factors

Format as 3 bullet points per category, keeping each concise.`;
}

/**
 * Generate strength/challenge narrative
 */
export function generateStrengthChallengeNarrative(
  strengths: string[],
  challenges: string[],
  specialty: string
): string {
  return `Write a brief, encouraging 2-paragraph narrative (150 words) for a medical student about their fit for ${specialty}:

Paragraph 1: Explain how their strengths (${strengths.join(", ")}) position them well for success in this specialty. Be specific about how each strength applies.

Paragraph 2: Address their challenges (${challenges.join(", ")}) not as dealbreakers, but as areas for intentional development. Suggest specific ways to build these skills during training.

Tone: Encouraging, practical, specific to Ghana's context.`;
}

/**
 * Generate motivation/affirmation message for low-match specialty
 */
export function generateEncouragementPrompt(specialty: string, matchPercentage: number): string {
  return `Generate a respectful, honest 1-paragraph message (about 100 words) for a medical student who scored ${matchPercentage}% fit for ${specialty}.

The message should:
1. Acknowledge the lower match without discouraging them
2. Explain what personality traits this specialty actually needs
3. Suggest whether this specialty is still worth considering (or recommend more aligned alternatives)
4. Empower them to make their own informed choice
5. Reference that fit is not destiny—interest, mentorship, and exposure matter too

Tone: Supportive, honest, not patronizing.`;
}

/**
 * Generate all prompts for a complete assessment result
 */
export function generateAllExplanationPrompts(
  topMatches: SpecialtyMatchResult[],
  traitScores: TraitScores,
  personalitySummary: string
) {
  return {
    personalized: generatePersonalizedExplanationPrompt(
      topMatches,
      traitScores,
      personalitySummary
    ),
    personalityType: generatePersonalityTypePrompt(traitScores),
    studyRecommendations: generateStudyRecommendationsPrompt(topMatches),
    ghanaPathway: generateGhanaCareerPathwayPrompt(
      topMatches[0].specialtyName,
      topMatches[0].matchPercentage
    ),
    comparison: generateComparisonPrompt(topMatches),
    strengths: generateStrengthChallengeNarrative(
      topMatches[0].strengths,
      topMatches[0].challenges,
      topMatches[0].specialtyName
    )
  };
}

/**
 * System message for AI assistant
 */
export const SYSTEM_MESSAGE = `You are MedMatch Ghana's AI career advisor—warm, practical, and deeply knowledgeable about Ghanaian medical education and specialty training.

Your role:
- Validate user results and concerns
- Provide Ghana-specific, realistic guidance
- Acknowledge both opportunities and challenges in the Ghanaian healthcare context
- Encourage exploration and mentorship
- Never diagnose; always encourage professional guidance

Tone: Supportive, honest, practical. Use Ghanaian context and examples when relevant.

Remember:
- Medical training in Ghana is competitive
- Specialty availability and training quality varies by institution
- Private practice is an important option for many specialties
- International training is increasingly common
- Mentorship and real-world exposure are critical`;

/**
 * Fallback explanation (when API not available)
 */
export function generateFallbackExplanation(
  topMatches: SpecialtyMatchResult[],
  personalitySummary: string
): string {
  return `${personalitySummary}

Based on your assessment, your strongest specialty matches are:

${topMatches
  .slice(0, 3)
  .map(
    (m, i) =>
      `${i + 1}. ${m.specialtyName} (${m.matchPercentage}% fit) — Your strengths in ${m.strengths[0]?.toLowerCase() || "this area"} align well with what this specialty values. Consider exploring this through shadowing and mentorship.`
  )
  .join("\n\n")}

Next steps:
- Shadow specialists in your top 3 choices
- Seek mentorship from residents in these fields
- Attend departmental conferences and learning sessions
- Revisit this assessment as you gain more clinical exposure

Remember: Your results are a starting point for exploration, not a final verdict. Real-world experience, mentorship, and personal interest ultimately shape your specialty choice.`;
}
