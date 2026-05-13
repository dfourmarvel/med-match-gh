/**
 * Data Validation Utilities for MedMatch Ghana
 * Zod-based validation schemas and runtime type checking
 */

import { z } from "zod";
/**
 * Trait scores validation schema
 */
export const TraitScoresSchema = z.record(z.string(), z.number().min(1).max(100));

/**
 * Quiz response validation schema
 */
export const QuizResponseSchema = z.object({
  questionId: z.number().int().min(1).max(25),
  answer: z.number().int().min(1).max(5),
  responseTime: z.number().optional()
});

/**
 * Quiz question validation schema
 */
export const QuizQuestionSchema = z.object({
  id: z.number().int(),
  questionText: z.string().min(10),
  category: z.enum(["personality", "skills", "values", "preferences", "coping", "interaction"]),
  type: z.enum(["likert", "forced-choice", "situational"]),
  description: z.string(),
  traitMappings: z.array(
    z.object({
      trait: z.string(),
      weight: z.number().min(0.5).max(2.0),
      direction: z.enum(["positive", "negative"])
    })
  ),
  answerScale: z.object({
    min: z.number(),
    max: z.number(),
    labels: z.array(z.string()).optional()
  }),
  reverseScoring: z.boolean(),
  followUpExplanation: z.string().optional(),
  difficultyLevel: z.enum(["easy", "medium", "hard"]),
  codingNotes: z.string()
});

/**
 * Specialty profile validation schema
 */
export const SpecialtyProfileSchema = z.object({
  id: z.string().min(3),
  slug: z.string().min(3),
  name: z.string().min(3),
  category: z.enum(["medical", "dental"]),
  shortDescription: z.string().min(20),
  fullDescription: z.string().min(50),
  personalityFitDescription: z.string(),
  idealCandidateDescription: z.string(),
  icon: z.string(),
  colorTheme: z.object({
    primary: z.string().regex(/^#[0-9a-f]{6}$/i),
    secondary: z.string().regex(/^#[0-9a-f]{6}$/i)
  }),
  trainingYearsMin: z.number().int().min(0).max(10),
  trainingYearsMax: z.number().int().min(0).max(10),
  competitiveness: z.enum(["Very Low", "Low", "Medium", "High", "Very High"]),
  residencyDifficulty: z.enum(["Very Low", "Low", "Medium", "High", "Very High"]),
  burnoutRisk: z.enum(["Very Low", "Low", "Medium", "High", "Very High"]),
  lifestyleRating: z.enum(["1 - Very Poor", "2 - Poor", "3 - Fair", "4 - Good", "5 - Excellent"]),
  emergencyIntensity: z.number().int().min(1).max(5),
  patientInteractionLevel: z.number().int().min(1).max(5),
  procedureIntensity: z.number().int().min(1).max(5),
  diagnosticIntensity: z.number().int().min(1).max(5),
  stressLevel: z.number().int().min(1).max(5),
  workloadLevel: z.number().int().min(1).max(5),
  averageSalaryGHS: z.object({
    publicSectorEstimate: z.object({
      min: z.number().min(1000),
      max: z.number(),
      level: z.string()
    }),
    privateSectorEstimate: z.object({
      min: z.number().min(1000),
      max: z.number(),
      level: z.string()
    }),
    currencyCode: z.literal("GHS"),
    disclaimer: z.string(),
    year: z.number().int()
  }),
  privateSectorPotential: z.enum(["Low", "Medium", "High", "Very High"]),
  globalMobility: z.enum(["Low", "Medium", "High", "Very High"]),
  aiReplacementRisk: z.enum(["Low", "Medium", "High"]),
  futureDemandGhana: z.enum(["Declining", "Stable", "Growing", "High Demand"]),
  traitProfile: z.record(z.string(), z.number().min(1).max(10)),
  trainingPathway: z.object({
    description: z.string(),
    durationYears: z.number().int(),
    requiredPrerequisites: z.array(z.string()),
    certifications: z.array(z.string()),
    keyMilestones: z.array(z.string())
  }),
  ghanaData: z.object({
    residencyPathwayGhana: z.string(),
    commonTrainingCenters: z.array(z.string()),
    collegeBodies: z.array(z.string()),
    residencyStructure: z.string(),
    postSpecializationOptions: z.array(z.string()),
    internationalMobilityNotes: z.string()
  }),
  subspecialties: z.array(
    z.object({
      name: z.string(),
      description: z.string()
    })
  ),
  relatedSpecialties: z.array(z.string()),
  typicalSchedule: z.string(),
  onCallFrequency: z.string(),
  workEnvironments: z.array(z.string()),
  dayInLife: z.object({
    typical: z.array(
      z.object({
        time: z.string(),
        activity: z.string(),
        intensity: z.number().int().min(1).max(5),
        location: z.string()
      })
    ),
    callDay: z.array(
      z.object({
        time: z.string(),
        activity: z.string(),
        intensity: z.number().int().min(1).max(5),
        location: z.string()
      })
    )
  }),
  typicalCases: z.array(z.string()),
  majorPros: z.array(z.string()),
  majorCons: z.array(z.string()),
  commonMisconceptions: z.array(z.string()),
  recommendedStudentActivities: z.array(z.string()),
  researchOpportunities: z.array(z.string()),
  tags: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

/**
 * Validate quiz responses
 */
export function validateQuizResponses(
  responses: unknown[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!Array.isArray(responses)) {
    return { valid: false, errors: ["Responses must be an array"] };
  }

  for (let i = 0; i < responses.length; i++) {
    try {
      QuizResponseSchema.parse(responses[i]);
    } catch (e: any) {
      errors.push(`Response ${i}: ${e.message}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate trait scores
 */
export function validateTraitScores(scores: unknown): { valid: boolean; errors: string[] } {
  try {
    TraitScoresSchema.parse(scores);
    return { valid: true, errors: [] };
  } catch (e: any) {
    return { valid: false, errors: [e.message] };
  }
}

/**
 * Validate specialty profile
 */
export function validateSpecialtyProfile(
  profile: unknown
): { valid: boolean; errors: string[] } {
  try {
    SpecialtyProfileSchema.parse(profile);
    return { valid: true, errors: [] };
  } catch (e: any) {
    return { valid: false, errors: [e.message] };
  }
}

/**
 * Validate quiz question
 */
export function validateQuizQuestion(question: unknown): { valid: boolean; errors: string[] } {
  try {
    QuizQuestionSchema.parse(question);
    return { valid: true, errors: [] };
  } catch (e: any) {
    return { valid: false, errors: [e.message] };
  }
}

/**
 * Comprehensive data integrity check
 */
export function validateDataIntegrity(allSpecialties: any[], allQuestions: any[]): {
  valid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check for duplicate specialty IDs
  const specialtyIds = allSpecialties.map((s) => s.id);
  const duplicateIds = specialtyIds.filter((id, index) => specialtyIds.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    errors.push(`Duplicate specialty IDs: ${duplicateIds.join(", ")}`);
  }

  // Check for duplicate question IDs
  const questionIds = allQuestions.map((q) => q.id);
  const duplicateQuestionIds = questionIds.filter((id, index) => questionIds.indexOf(id) !== index);
  if (duplicateQuestionIds.length > 0) {
    errors.push(`Duplicate question IDs: ${duplicateQuestionIds.join(", ")}`);
  }

  // Check for missing related specialties
  for (const specialty of allSpecialties) {
    for (const relatedId of specialty.relatedSpecialties || []) {
      if (!specialtyIds.includes(relatedId)) {
        warnings.push(`Specialty ${specialty.id} references non-existent related specialty ${relatedId}`);
      }
    }
  }

  // Check for questions with invalid trait mappings
  for (const question of allQuestions) {
    if (!question.traitMappings || question.traitMappings.length === 0) {
      errors.push(`Question ${question.id} has no trait mappings`);
    }
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors
  };
}

/**
 * Generate validation report
 */
export function generateValidationReport(
  specialties: any[],
  questions: any[]
): string {
  const integrity = validateDataIntegrity(specialties, questions);

  let report = "=== DATA VALIDATION REPORT ===\n\n";
  report += `Specialties: ${specialties.length}\n`;
  report += `Questions: ${questions.length}\n`;
  report += `Status: ${integrity.valid ? "✓ VALID" : "✗ INVALID"}\n\n`;

  if (integrity.errors.length > 0) {
    report += "ERRORS:\n";
    integrity.errors.forEach((e) => (report += `  - ${e}\n`));
    report += "\n";
  }

  if (integrity.warnings.length > 0) {
    report += "WARNINGS:\n";
    integrity.warnings.forEach((w) => (report += `  - ${w}\n`));
    report += "\n";
  }

  return report;
}
