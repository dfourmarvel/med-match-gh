/**
 * 25-Question Quiz Dataset for MedMatch Ghana
 * Comprehensive assessment covering 5 key categories
 */

import { QuizQuestion, TraitId } from "@/data/types";

/**
 * Helper to create trait mappings concisely
 */
function traits(
  mappings: Array<[TraitId, number, "positive" | "negative"]>
) {
  return mappings.map(([trait, weight, direction]) => ({
    trait,
    weight,
    direction
  }));
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ========================================================================
  // CATEGORY 1: DIAGNOSTIC & ANALYTICAL THINKING (Q1-Q8)
  // ========================================================================
  {
    id: 1,
    questionText: "I enjoy solving complex problems with limited information.",
    category: "personality",
    type: "likert",
    description:
      "Assesses comfort with diagnostic uncertainty and complex reasoning",
    traitMappings: traits([
      ["diagnosticThinking", 1.4, "positive"],
      ["emotionalResilience", 0.5, "positive"],
      ["researchInterest", 0.6, "positive"]
    ]),
    answerScale: { min: 1, max: 5, labels: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
    reverseScoring: false,
    difficultyLevel: "easy",
    codingNotes:
      "Core diagnostic thinking trait. Higher scores = comfort with uncertainty."
  },

  {
    id: 2,
    questionText: "I would enjoy working with my hands during procedures.",
    category: "skills",
    type: "likert",
    description: "Evaluates procedural interest and tactile satisfaction",
    traitMappings: traits([
      ["proceduralInterest", 1.5, "positive"],
      ["precisionOrientation", 0.7, "positive"]
    ]),
    answerScale: { min: 1, max: 5 },
    reverseScoring: false,
    difficultyLevel: "easy",
    codingNotes: "Direct procedural interest measurement"
  },

  {
    id: 8,
    questionText: "I am fascinated by human anatomy and disease mechanisms.",
    category: "personality",
    type: "likert",
    description:
      "Measures scientific curiosity and foundational medical interest",
    traitMappings: traits([
      ["diagnosticThinking", 0.9, "positive"],
      ["researchInterest", 0.9, "positive"],
      ["proceduralInterest", 0.3, "positive"]
    ]),
    answerScale: { min: 1, max: 5 },
    reverseScoring: false,
    difficultyLevel: "easy",
    codingNotes:
      "Tests underlying science interest across all specialties"
  },

  {
    id: 16,
    questionText: "I would rather diagnose a disease than perform surgery.",
    category: "preferences",
    type: "forced-choice",
    description: "Diagnostic vs. procedural preference indicator",
    traitMappings: traits([
      ["diagnosticThinking", 1.3, "positive"],
      ["proceduralInterest", 1.2, "negative"]
    ]),
    answerScale: { min: 1, max: 5, labels: ["Prefer surgery", "Slightly surgery", "Either", "Slightly diagnosis", "Prefer diagnosis"] },
    reverseScoring: false,
    difficultyLevel: "medium",
    codingNotes:
      "Forced choice between diagnostic and procedural work"
  },

  {
    id: 21,
    questionText: "I am interested in technology and imaging tools.",
    category: "personality",
    type: "likert",
    description: "Technology comfort and innovation interest",
    traitMappings: traits([
      ["researchInterest", 0.8, "positive"],
      ["diagnosticThinking", 0.8, "positive"],
      ["precisionOrientation", 0.6, "positive"]
    ]),
    answerScale: { min: 1, max: 5 },
    reverseScoring: false,
    difficultyLevel: "medium",
    codingNotes:
      "Relevant for radiology, pathology, and tech-forward specialties"
  },

  {
    id: 24,
    questionText: "I like balancing science with human interaction.",
    category: "preferences",
    type: "likert",
    description:
      "Assesses desire for mixed cognitive/interpersonal engagement",
    traitMappings: traits([
      ["diagnosticThinking", 0.8, "positive"],
      ["patientInteraction", 0.8, "positive"],
      ["communicationEmpathy", 0.6, "positive"]
    ]),
    answerScale: { min: 1, max: 5 },
    reverseScoring: false,
    difficultyLevel: "medium",
    codingNotes: "Tests balance between analytical and relational work"
  },

  {
    id: 25,
    questionText: "I am curious about research and medical discoveries.",
    category: "personality",
    type: "likert",
    description: "Academic and research orientation",
    traitMappings: traits([
      ["researchInterest", 1.6, "positive"],
      ["diagnosticThinking", 0.6, "positive"]
    ]),
    answerScale: { min: 1, max: 5 },
    reverseScoring: false,
    difficultyLevel: "easy",
    codingNotes: "Indicates academic medicine vs clinical practice orientation"
  },

  {
    id: 9,
    questionText: "I prefer analytical work over social interaction.",
    category: "preferences",
    type: "forced-choice",
    description: "Analytical vs. social preference (reverse-coded)",
    traitMappings: traits([
      ["diagnosticThinking", 0.9, "positive"],
      ["patientInteraction", 0.8, "negative"],
      ["communicationEmpathy", 0.6, "negative"]
    ]),
    answerScale: { min: 1, max: 5, labels: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"] },
    reverseScoring: false,
    difficultyLevel: "medium",
    codingNotes: "Distinguishes analytical vs interpersonal specialists"
  },

  // ========================================================================
  // CATEGORY 2: PRESSURE, PACE & EMERGENCY (Q3, Q7, Q18, Q23, Q13)
  // ========================================================================
  {
    id: 3,
    questionText: "I perform well under pressure.",
    category: "coping",
    type: "likert",
    description: "Stress tolerance and performance under urgency",
    traitMappings: traits([
      ["emotionalResilience", 1.2, "positive"],
      ["emergencyComfort", 1.1, "positive"],
      ["fastPacedPreference", 0.6, "positive"]
    ]),
    answerScale: { min: 1, max: 5 },
    reverseScoring: false,
    difficultyLevel: "easy",
    codingNotes:
      "Core resilience measure. Essential for high-acuity specialties."
  },

  {
    id: 7,
    questionText: "I enjoy fast-paced environments.",
    category: "preferences",
    type: "likert",
    description: "Preference for rapid change and activity",
    traitMappings: traits([
      ["fastPacedPreference", 1.4, "positive"],
      ["emergencyComfort", 0.8, "positive"]
    ]),
    answerScale: { min: 1, max: 5 },
    reverseScoring: false,
    difficultyLevel: "easy",
    codingNotes:
      "Separates surgery/EM from radiology/pathology/psychiatry"
  },

  {
    id: 18,
    questionText: "I am comfortable making rapid decisions.",
    category: "coping",
    type: "likert",
    description: "Decision-making speed and comfort with urgency",
    traitMappings: traits([
      ["emergencyComfort", 1.3, "positive"],
      ["fastPacedPreference", 0.8, "positive"],
      ["emotionalResilience", 0.6, "positive"]
    ]),
    answerScale: { min: 1, max: 5 },
    reverseScoring: false,
    difficultyLevel: "medium",
    codingNotes:
      "Differentiates emergency/surgery specialists from deliberative fields"
  },

  {
    id: 23,
    questionText: "I enjoy high-intensity environments.",
    category: "preferences",
    type: "likert",
    description: "Attraction to high-stakes, high-energy work",
    traitMappings: traits([
      ["fastPacedPreference", 1.2, "positive"],
      ["emergencyComfort", 1.1, "positive"],
      ["emotionalResilience", 0.6, "positive"]
    ]),
    answerScale: { min: 1, max: 5 },
    reverseScoring: false,
    difficultyLevel: "medium",
    codingNotes:
      "Tests attraction to adrenaline-driven specialties (surgery, EM, OB)"
  },

  {
    id: 13,
    questionText: "I prefer variety rather than routine.",
    category: "preferences",
    type: "situational",
    description: "Variety seeking vs. routine preference",
    traitMappings: traits([
      ["fastPacedPreference", 0.7, "positive"],
      ["schedulePredictability", 1.1, "negative"]
    ]),
    answerScale: { min: 1, max: 5, labels: ["Prefer routine", "Slight routine", "Either", "Slight variety", "Prefer variety"] },
    reverseScoring: false,
    difficultyLevel: "medium",
    codingNotes: "Separates general practice from fast-paced specialties"
  },

  // ========================================================================
  // CATEGORY 3: INTERPERSONAL & PATIENT INTERACTION (Q4, Q12, Q20, Q17)
  // ========================================================================
  {
    id: 4,
    questionText: "I prefer long-term relationships with people over short interactions.",
    category: "interaction",
    type: "likert",
    description: "Continuity and longitudinal patient relationship preference",
    traitMappings: traits([
      ["longTermRelationships", 1.5, "positive"],
      ["patientInteraction", 0.7, "positive"],
      ["communicationEmpathy", 0.8, "positive"]
    ]),
    answerScale: { min: 1, max: 5 },
    reverseScoring: false,
    difficultyLevel: "easy",
    codingNotes:
      "Separates family medicine/psychiatry from episodic fields"
  },

  {
    id: 12,
    questionText: "I am comfortable discussing emotionally difficult topics.",
    category: "interaction",
    type: "likert",
    description:
      "Empathic engagement and emotional labor comfort",
    traitMappings: traits([
      ["communicationEmpathy", 1.3, "positive"],
      ["emotionalResilience", 0.7, "positive"],
      ["patientInteraction", 0.6, "positive"]
    ]),
    answerScale: { min: 1, max: 5 },
    reverseScoring: false,
    difficultyLevel: "medium",
    codingNotes:
      "Strong indicator for psychiatry, family medicine, oncology, palliative care"
  },

  {
    id: 20,
    questionText: "I enjoy communicating and counseling people.",
    category: "interaction",
    type: "likert",
    description: "Counseling and therapeutic communication interest",
    traitMappings: traits([
      ["communicationEmpathy", 1.4, "positive"],
      ["patientInteraction", 1.0, "positive"],
      ["longTermRelationships", 0.5, "positive"]
    ]),
    answerScale: { min: 1, max: 5 },
    reverseScoring: false,
    difficultyLevel: "easy",
    codingNotes:
      "Core for psychiatry, family medicine, pediatrics, OB-GYN"
  },

  {
    id: 17,
    questionText: "I enjoy interacting with children.",
    category: "interaction",
    type: "forced-choice",
    description: "Child-focused practice preference",
    traitMappings: traits([
      ["patientInteraction", 0.8, "positive"],
      ["communicationEmpathy", 0.9, "positive"],
      ["longTermRelationships", 0.5, "positive"]
    ]),
    answerScale: { min: 1, max: 5, labels: ["Not really", "Somewhat", "Neutral", "Quite a bit", "Definitely"] },
    reverseScoring: false,
    difficultyLevel: "easy",
    codingNotes: "Pediatrics, pediatric dentistry, family medicine indicator"
  },

  // ========================================================================
  // CATEGORY 4: TRAINING, COMMITMENT & LEADERSHIP (Q15, Q10, Q14, Q11)
  // ========================================================================
  {
    id: 15,
    questionText: "I am willing to spend many years in training for mastery.",
    category: "personality",
    type: "likert",
    description: "Long-term training commitment and delayed gratification",
    traitMappings: traits([
      ["longTrainingTolerance", 1.6, "positive"],
      ["leadershipPreference", 0.5, "positive"]
    ]),
    answerScale: { min: 1, max: 5 },
    reverseScoring: false,
    difficultyLevel: "medium",
    codingNotes:
      "Separates long-residency from short-residency specialties"
  },

  {
    id: 10,
    questionText: "I would enjoy leading a healthcare team.",
    category: "interaction",
    type: "likert",
    description: "Leadership and team direction comfort",
    traitMappings: traits([
      ["leadershipPreference", 1.4, "positive"],
      ["teamwork", 0.8, "positive"]
    ]),
    answerScale: { min: 1, max: 5 },
    reverseScoring: false,
    difficultyLevel: "easy",
    codingNotes:
      "Administrative, surgical, and senior clinic roles appeal to high scorers"
  },

  {
    id: 14,
    questionText: "I enjoy mentoring or teaching others.",
    category: "interaction",
    type: "likert",
    description: "Teaching and mentorship interest",
    traitMappings: traits([
      ["communicationEmpathy", 0.9, "positive"],
      ["leadershipPreference", 0.9, "positive"],
      ["teamwork", 0.7, "positive"]
    ]),
    answerScale: { min: 1, max: 5 },
    reverseScoring: false,
    difficultyLevel: "medium",
    codingNotes:
      "Predicts affinity for academic medicine and residency training"
  },

  {
    id: 11,
    questionText: "I enjoy detailed and precise work.",
    category: "skills",
    type: "likert",
    description: "Precision, attention to detail, and systematic accuracy",
    traitMappings: traits([
      ["precisionOrientation", 1.6, "positive"],
      ["proceduralInterest", 0.5, "positive"],
      ["diagnosticThinking", 0.5, "positive"]
    ]),
    answerScale: { min: 1, max: 5 },
    reverseScoring: false,
    difficultyLevel: "easy",
    codingNotes:
      "Strong indicator for surgery, anesthesia, radiology, pathology, dentistry"
  },

  // ========================================================================
  // CATEGORY 5: LIFESTYLE & WORK-LIFE BALANCE (Q6, Q19, Q22, Q5)
  // ========================================================================
  {
    id: 6,
    questionText: "I value work-life balance highly.",
    category: "values",
    type: "likert",
    description: "Work-life balance priority and personal time importance",
    traitMappings: traits([
      ["workLifeBalancePriority", 1.6, "positive"],
      ["schedulePredictability", 0.7, "positive"]
    ]),
    answerScale: { min: 1, max: 5 },
    reverseScoring: false,
    difficultyLevel: "easy",
    codingNotes:
      "Major differentiator for lifestyle-priority specialties (dermatology, radiology, psychiatry)"
  },

  {
    id: 19,
    questionText: "I prefer structured schedules over unpredictable work.",
    category: "preferences",
    type: "forced-choice",
    description: "Schedule predictability and structure preference",
    traitMappings: traits([
      ["schedulePredictability", 1.5, "positive"],
      ["workLifeBalancePriority", 0.7, "positive"],
      ["fastPacedPreference", 0.6, "negative"]
    ]),
    answerScale: { min: 1, max: 5, labels: ["Prefer unpredictable", "Slight unpredictable", "Either", "Slight structured", "Prefer structured"] },
    reverseScoring: false,
    difficultyLevel: "medium",
    codingNotes: "Core for family medicine, dermatology, radiology"
  },

  {
    id: 22,
    questionText: "I prefer community impact over individual patient care.",
    category: "values",
    type: "forced-choice",
    description: "Population health vs. individual care orientation",
    traitMappings: traits([
      ["patientInteraction", 0.6, "negative"],
      ["leadershipPreference", 0.6, "positive"],
      ["researchInterest", 0.6, "positive"]
    ]),
    answerScale: { min: 1, max: 5, labels: ["Individual care", "Slight individual", "Either", "Slight community", "Community impact"] },
    reverseScoring: false,
    difficultyLevel: "hard",
    codingNotes:
      "Indicates public health, preventive medicine, health policy interest"
  },

  {
    id: 5,
    questionText: "I am emotionally resilient during stressful situations.",
    category: "coping",
    type: "likert",
    description: "Emotional stability and stress recovery",
    traitMappings: traits([
      ["emotionalResilience", 1.4, "positive"],
      ["emergencyComfort", 0.8, "positive"]
    ]),
    answerScale: { min: 1, max: 5 },
    reverseScoring: false,
    difficultyLevel: "medium",
    codingNotes:
      "Redundant with Q3 but valuable for dual-measurement validation"
  }
];

/**
 * Utility: Get question by ID
 */
export function getQuestionById(id: number): QuizQuestion | undefined {
  return QUIZ_QUESTIONS.find((q) => q.id === id);
}

/**
 * Utility: Get questions by category
 */
export function getQuestionsByCategory(
  category: QuizQuestion["category"]
): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.category === category);
}

/**
 * Utility: Get all question IDs
 */
export function getAllQuestionIds(): number[] {
  return QUIZ_QUESTIONS.map((q) => q.id);
}

/**
 * Utility: Validate question structure
 */
export function validateQuestionStructure(question: QuizQuestion): string[] {
  const errors: string[] = [];

  if (!question.questionText) errors.push(`Q${question.id}: Missing questionText`);
  if (!question.category) errors.push(`Q${question.id}: Missing category`);
  if (!question.type) errors.push(`Q${question.id}: Missing type`);
  if (!question.traitMappings || question.traitMappings.length === 0) {
    errors.push(`Q${question.id}: No trait mappings`);
  }
  if (!question.answerScale) errors.push(`Q${question.id}: Missing answerScale`);

  return errors;
}

/**
 * Validate all questions
 */
export function validateAllQuestions(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const ids = new Set<number>();

  for (const question of QUIZ_QUESTIONS) {
    if (ids.has(question.id)) {
      errors.push(`Duplicate question ID: ${question.id}`);
    }
    ids.add(question.id);
    errors.push(...validateQuestionStructure(question));
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
