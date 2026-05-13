import { z } from "zod";
import { QUIZ_QUESTIONS } from "@/data/questions/index";
import { SPECIALTIES } from "@/data/specialties/index";
import { TRAIT_IDS } from "@/data/traits/index";

export const traitScoreSchema = z.record(z.enum(TRAIT_IDS as [string, ...string[]]), z.number().min(1).max(10));

export const questionSchema = z.object({
  id: z.number().int().min(1).max(25),
  questionText: z.string().min(10),
  category: z.enum(["personality", "skills", "values", "preferences", "coping", "interaction"]),
  type: z.enum(["likert", "forced-choice", "situational"]),
  description: z.string().min(10),
  traitMappings: z.array(z.object({
    trait: z.enum(TRAIT_IDS as [string, ...string[]]),
    weight: z.number().min(0.1).max(2),
    direction: z.enum(["positive", "negative"]),
    rationale: z.string().min(8)
  })).min(1),
  answerScale: z.object({
    min: z.literal(1),
    max: z.literal(5),
    labels: z.array(z.string()).length(5)
  }),
  reverseScoring: z.boolean()
});

export const specialtySchema = z.object({
  id: z.string().min(3),
  slug: z.string().min(3),
  name: z.string().min(3),
  category: z.enum(["medical", "dental"]),
  shortDescription: z.string().min(25),
  fullDescription: z.string().min(80),
  traitProfile: traitScoreSchema,
  commonTrainingCenters: z.array(z.string()).min(1),
  dayInLifeTimeline: z.array(z.object({
    time: z.string(),
    activity: z.string().min(8),
    location: z.string().min(3)
  })).min(5),
  typicalCases: z.array(z.string()).min(1),
  tags: z.array(z.string()).min(1)
}).passthrough();

export function validateDataset() {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const question of QUIZ_QUESTIONS) {
    const result = questionSchema.safeParse(question);
    if (!result.success) errors.push(`Question ${question.id}: ${result.error.message}`);
  }

  for (const specialty of SPECIALTIES) {
    const result = specialtySchema.safeParse(specialty);
    if (!result.success) errors.push(`Specialty ${specialty.id}: ${result.error.message}`);
  }

  const questionIds = new Set(QUIZ_QUESTIONS.map((question) => question.id));
  for (let id = 1; id <= 25; id += 1) {
    if (!questionIds.has(id)) errors.push(`Missing question ${id}`);
  }

  const specialtyIds = new Set(SPECIALTIES.map((specialty) => specialty.id));
  for (const specialty of SPECIALTIES) {
    for (const related of specialty.relatedSpecialties) {
      if (!specialtyIds.has(related)) warnings.push(`${specialty.id} references related specialty ${related}, which is not in the catalog.`);
    }
  }

  return {
    valid: errors.length === 0,
    counts: {
      traits: TRAIT_IDS.length,
      questions: QUIZ_QUESTIONS.length,
      specialties: SPECIALTIES.length
    },
    errors,
    warnings
  };
}
