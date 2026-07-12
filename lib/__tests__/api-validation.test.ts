import {
  fullAssessmentResultSchema,
  quizSubmissionSchema
} from "@/lib/api-validation";
import { assessmentQuestions } from "@/lib/assessment";

describe("api validation schemas", () => {
  it("accepts a complete quiz submission", () => {
    const answers = Object.fromEntries(assessmentQuestions.map((question) => [question.id, 3]));

    const result = quizSubmissionSchema.safeParse({
      audience: "medical-student",
      answers
    });

    expect(result.success).toBe(true);
  });

  it("rejects missing required quiz answers", () => {
    const result = quizSubmissionSchema.safeParse({
      audience: "medical-student",
      answers: {}
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const issues = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }));
      expect(issues[0]).toEqual(
        expect.objectContaining({
          message: expect.stringContaining("Question")
        })
      );
    }
  });

  it("rejects unknown specialty IDs in full assessment results", () => {
    const result = fullAssessmentResultSchema.safeParse({
      audience: "medical-student",
      traitScores: {
        patientInteraction: 50,
        proceduralInterest: 50,
        diagnosticReasoning: 50,
        fastPacedPreference: 50,
        workLifePriority: 50,
        emotionalResilience: 50,
        teamCollaboration: 50,
        precisionOrientation: 50,
        longTermRelationships: 50,
        researchCuriosity: 50,
        leadershipPreference: 50,
        trainingTolerance: 50,
        emergencyComfort: 50,
        communicationEmpathy: 50,
        predictableSchedulePreference: 50
      },
      topMatches: [
        {
          specialtyId: "unknown-specialty",
          score: 0.5,
          matchPercentage: 50,
          confidenceLevel: "Low",
          strengths: [],
          challenges: [],
          explanationFactors: {
            alignedTraits: [],
            stretchTraits: []
          },
          reasoning: "Exploratory result."
        }
      ],
      confidenceLevel: "Low",
      methodologyNote: "Methodology note.",
      personalitySummary: "Personality summary.",
      suggestedNextSteps: ["Shadow a clinician."],
      generatedAt: new Date().toISOString()
    });

    expect(result.success).toBe(false);
  });
});
