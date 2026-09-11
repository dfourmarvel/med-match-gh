export type TraitKey =
  | "patientInteraction"
  | "proceduralInterest"
  | "diagnosticReasoning"
  | "fastPacedPreference"
  | "workLifePriority"
  | "emotionalResilience"
  | "teamCollaboration"
  | "precisionOrientation"
  | "longTermRelationships"
  | "researchCuriosity"
  | "leadershipPreference"
  | "trainingTolerance"
  | "emergencyComfort"
  | "communicationEmpathy"
  | "predictableSchedulePreference";

export type Audience = "medical-student" | "high-school" | "dental-student";
export type QuestionType = "likert" | "situational" | "forced-choice";

export type TraitVector = Record<TraitKey, number>;

export interface AssessmentQuestion {
  id: number;
  type: QuestionType;
  prompt: string;
  scaleLabels?: [string, string];
  options?: { label: string; value: number }[];
  weights: Partial<Record<TraitKey, number>>;
}

export interface DayInLifeItem {
  time: string;
  activity: string;
}

export interface SpecialtyProfile {
  id: string;
  name: string;
  category: "medical" | "dental";
  description: string;
  traitProfile: TraitVector;
  requiredTraits: string[];
  workEnvironment: string;
  lifestyleRating: number;
  competitiveness: number;
  burnoutRisk: number;
  salaryRangeGhs: [number, number];
  salaryDisclaimer: string;
  trainingLength: string;
  emergencyIntensity: number;
  patientInteractionLevel: number;
  procedureIntensity: number;
  ghanaOpportunities: string[];
  ghanaResidencyPathway: string;
  relatedSpecialties: string[];
  dayInLife: DayInLifeItem[];
  pros: string[];
  cons: string[];
  futureTrends: string[];
}

export interface MatchResult {
  specialtyId: string;
  score: number;
  matchPercentage: number;
  confidenceLevel: "Low" | "Medium" | "High";
  strengths: string[];
  challenges: string[];
  explanationFactors: {
    alignedTraits: string[];
    stretchTraits: string[];
    scoreGapFromNext?: number;
  };
  reasoning: string;
}

export interface QuizSubmission {
  audience: Audience;
  answers: Record<number, number>;
}

export interface FullAssessmentResult {
  audience: Audience;
  traitScores: TraitVector;
  topMatches: MatchResult[];
  confidenceLevel: "Low" | "Medium" | "High";
  methodologyNote: string;
  personalitySummary: string;
  suggestedNextSteps: string[];
  generatedAt: string;
  /**
   * True when this payload has been trimmed for a signed-out visitor: only the
   * top three matches are real and `traitScores` holds placeholder values. Set
   * by the server; the client uses it to decide what to lock, never to decide
   * what to hide (the real values are simply absent).
   */
  locked?: boolean;
}
