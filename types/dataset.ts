export type Audience = "medical-student" | "high-school" | "dental-student";

export type TraitId =
  | "patientInteraction"
  | "proceduralInterest"
  | "diagnosticThinking"
  | "fastPacedPreference"
  | "workLifeBalancePriority"
  | "emotionalResilience"
  | "teamwork"
  | "precisionOrientation"
  | "longTermRelationships"
  | "researchInterest"
  | "leadershipPreference"
  | "longTrainingTolerance"
  | "emergencyComfort"
  | "communicationEmpathy"
  | "schedulePredictability";

export type TraitScores = Record<TraitId, number>;

export type TraitCategory =
  | "interpersonal"
  | "procedural"
  | "cognitive"
  | "lifestyle"
  | "resilience"
  | "leadership";

export interface TraitDefinition {
  id: TraitId;
  name: string;
  shortName: string;
  description: string;
  chartLabel: string;
  icon: string;
  colorHex: string;
  category: TraitCategory;
  lowLabel: string;
  highLabel: string;
  min: 1;
  max: 10;
}

export type QuestionType = "likert" | "forced-choice" | "situational";
export type QuestionCategory = "personality" | "skills" | "values" | "preferences" | "coping" | "interaction";

export interface QuestionTraitMapping {
  trait: TraitId;
  weight: number;
  direction: "positive" | "negative";
  rationale: string;
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  category: QuestionCategory;
  type: QuestionType;
  description: string;
  traitMappings: QuestionTraitMapping[];
  weightings: Partial<Record<TraitId, number>>;
  answerScale: {
    min: 1;
    max: 5;
    labels: string[];
  };
  reverseScoring: boolean;
  followUpExplanation?: string;
}

export type SpecialtyCategory = "medical" | "dental";
export type RatingLevel = "Very Low" | "Low" | "Medium" | "High" | "Very High";
export type LifestyleRating = "1 - Very Poor" | "2 - Poor" | "3 - Fair" | "4 - Good" | "5 - Excellent";
export type Intensity = 1 | 2 | 3 | 4 | 5;

export interface SalaryEstimateGHS {
  publicSectorMonthly: [number, number];
  privateSectorMonthly: [number, number];
  seniorSpecialistMonthly: [number, number];
  currencyCode: "GHS";
  disclaimer: string;
}

export interface DayInLifeItem {
  time: string;
  activity: string;
  location: string;
}

export interface TrainingPathway {
  summary: string;
  typicalYears: [number, number];
  prerequisites: string[];
  milestones: string[];
}

export interface SpecialtyProfile {
  id: string;
  slug: string;
  name: string;
  category: SpecialtyCategory;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  colorTheme: { primary: string; secondary: string };
  trainingYears: [number, number];
  competitiveness: RatingLevel;
  burnoutRisk: RatingLevel;
  workload: RatingLevel;
  stress: RatingLevel;
  lifestyleRating: LifestyleRating;
  emergencyIntensity: Intensity;
  patientInteractionLevel: Intensity;
  procedureIntensity: Intensity;
  diagnosticIntensity: Intensity;
  averageSalaryGHS: SalaryEstimateGHS;
  privateSectorPotential: RatingLevel;
  globalMobility: RatingLevel;
  aiReplacementRisk: RatingLevel;
  futureDemand: RatingLevel;
  residencyDifficulty: RatingLevel;
  trainingPathway: TrainingPathway;
  residencyPathwayGhana: string;
  commonTrainingCenters: string[];
  relatedSpecialties: string[];
  personalityFitDescription: string;
  idealCandidateDescription: string;
  majorPros: string[];
  majorCons: string[];
  dayInLifeTimeline: DayInLifeItem[];
  typicalCases: string[];
  workEnvironments: string[];
  commonMisconceptions: string[];
  recommendedStudentActivities: string[];
  researchOpportunities: string[];
  subspecialties: string[];
  tags: string[];
  traitProfile: TraitScores;
}

export interface QuizResponse {
  questionId: number;
  answer: number;
  responseTimeMs?: number;
}

export interface TraitScoreBreakdown {
  trait: TraitId;
  score: number;
  contributingQuestions: number[];
}

export interface SpecialtyMatch {
  specialtyId: string;
  specialtyName: string;
  rank: number;
  rawScore: number;
  matchPercentage: number;
  confidence: "Low" | "Medium" | "High";
  strengths: string[];
  challenges: string[];
  reasoning: string;
  tieBreakerScore: number;
}

export interface AssessmentResult {
  id: string;
  userId?: string;
  audience: Audience;
  responses: QuizResponse[];
  traitScores: TraitScores;
  topMatches: SpecialtyMatch[];
  generatedAt: string;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  audience: Audience;
  institution: string;
  region: string;
  yearOfStudy?: number;
}
