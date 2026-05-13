import { z } from "zod";
import { assessmentQuestions } from "@/lib/assessment";
import { specialtiesById } from "@/lib/specialties";
import { FullAssessmentResult, TraitKey } from "@/lib/types";

const traitKeys = [
  "patientInteraction",
  "proceduralInterest",
  "diagnosticReasoning",
  "fastPacedPreference",
  "workLifePriority",
  "emotionalResilience",
  "teamCollaboration",
  "precisionOrientation",
  "longTermRelationships",
  "researchCuriosity",
  "leadershipPreference",
  "trainingTolerance",
  "emergencyComfort",
  "communicationEmpathy",
  "predictableSchedulePreference"
] as const satisfies readonly TraitKey[];

const questionIds = assessmentQuestions.map((question) => question.id);

export const quizSubmissionSchema = z.object({
  audience: z.enum(["medical-student", "high-school", "dental-student"]),
  answers: z
    .record(z.coerce.number().int(), z.number().int().min(1).max(5))
    .superRefine((answers, context) => {
      for (const id of questionIds) {
        if (answers[id] === undefined) {
          context.addIssue({
            code: "custom",
            path: [id],
            message: `Question ${id} is required.`
          });
        }
      }
    })
});

const traitVectorSchema = z.object(
  Object.fromEntries(traitKeys.map((key) => [key, z.number().min(1).max(100)])) as Record<
    TraitKey,
    z.ZodNumber
  >
);

const matchResultSchema = z.object({
  specialtyId: z.string().refine((id) => Boolean(specialtiesById[id]), "Unknown specialty ID."),
  score: z.number().min(0).max(1),
  matchPercentage: z.number().int().min(1).max(99),
  confidenceLevel: z.enum(["Low", "Medium", "High"]),
  strengths: z.array(z.string()).max(6),
  challenges: z.array(z.string()).max(6),
  explanationFactors: z.object({
    alignedTraits: z.array(z.string()).max(6),
    stretchTraits: z.array(z.string()).max(6),
    scoreGapFromNext: z.number().optional()
  }),
  reasoning: z.string().max(900)
});

export const fullAssessmentResultSchema = z.object({
  audience: z.enum(["medical-student", "high-school", "dental-student"]),
  traitScores: traitVectorSchema,
  topMatches: z.array(matchResultSchema).min(1).max(5),
  confidenceLevel: z.enum(["Low", "Medium", "High"]),
  methodologyNote: z.string().max(1000),
  personalitySummary: z.string().max(1000),
  suggestedNextSteps: z.array(z.string().max(400)).min(1).max(8),
  generatedAt: z.string().datetime()
}) satisfies z.ZodType<FullAssessmentResult>;

export function validationErrorResponse(error: z.ZodError) {
  return {
    error: "Invalid request payload.",
    issues: error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message
    }))
  };
}
