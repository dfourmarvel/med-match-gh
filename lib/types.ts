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
  strengths: string[];
  challenges: string[];
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
  personalitySummary: string;
  suggestedNextSteps: string[];
  generatedAt: string;
}
