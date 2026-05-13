/**
 * Master type definitions for MedMatch Ghana dataset system
 * This file contains all interfaces used across the data layer
 */

// ============================================================================
// TRAIT SYSTEM
// ============================================================================

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

export interface TraitDefinition {
  id: TraitId;
  name: string;
  shortName: string;
  description: string;
  positiveIndicator: string;
  negativeIndicator: string;
  scale: {
    min: number;
    max: number;
    midpoint: number;
  };
  category: "interpersonal" | "procedural" | "cognitive" | "lifestyle" | "resilience";
  icon: string;
  colorHex: string;
}

export type TraitScores = Record<TraitId, number>;

export interface TraitVector extends TraitScores {
  // Ensures all 15 traits must be present
}

// ============================================================================
// QUIZ QUESTIONS
// ============================================================================

export type QuestionType = "likert" | "forced-choice" | "situational";
export type QuestionCategory =
  | "personality"
  | "skills"
  | "values"
  | "preferences"
  | "coping"
  | "interaction";

export interface QuestionTraitMapping {
  trait: TraitId;
  weight: number; // 0.5 to 2.0, affects how much this question impacts the trait
  direction: "positive" | "negative"; // positive = agreement increases trait, negative = agreement decreases trait
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  category: QuestionCategory;
  type: QuestionType;
  description: string;
  traitMappings: QuestionTraitMapping[];
  answerScale: {
    min: number;
    max: number;
    labels?: string[];
  };
  reverseScoring: boolean;
  followUpExplanation?: string;
  difficultyLevel: "easy" | "medium" | "hard";
  codingNotes: string;
}

// ============================================================================
// SPECIALTIES
// ============================================================================

export type SpecialtyCategory = "medical" | "dental";
export type CompetitivenessLevel = "Very Low" | "Low" | "Medium" | "High" | "Very High";
export type BurnoutRiskLevel = "Very Low" | "Low" | "Medium" | "High" | "Very High";
export type LifestyleRatingLevel = "1 - Very Poor" | "2 - Poor" | "3 - Fair" | "4 - Good" | "5 - Excellent";
export type IntensityLevel = 1 | 2 | 3 | 4 | 5;

export interface DayInLifeEntry {
  time: string;
  activity: string;
  intensity: IntensityLevel;
  location: string;
}

export interface SpecialtySubspecialty {
  name: string;
  description: string;
}

export interface SpecialtySalaryData {
  publicSectorEstimate: {
    min: number;
    max: number;
    level: string; // "Junior", "Mid-Level", "Senior"
  };
  privateSectorEstimate: {
    min: number;
    max: number;
    level: string;
  };
  currencyCode: "GHS";
  disclaimer: string;
  year: number;
}

export interface SpecialtyTrainingPathway {
  description: string;
  durationYears: number;
  requiredPrerequisites: string[];
  certifications: string[];
  keyMilestones: string[];
}

export interface GhanaTrainingData {
  residencyPathwayGhana: string;
  commonTrainingCenters: string[];
  collegeBodies: string[];
  residencyStructure: string;
  postSpecializationOptions: string[];
  internationalMobilityNotes: string;
}

export interface SpecialtyProfile {
  // Identifiers
  id: string;
  slug: string;
  name: string;
  category: SpecialtyCategory;

  // Descriptions
  shortDescription: string;
  fullDescription: string;
  personalityFitDescription: string;
  idealCandidateDescription: string;

  // Visual
  icon: string;
  colorTheme: {
    primary: string;
    secondary: string;
  };

  // Training & Difficulty
  trainingYearsMin: number;
  trainingYearsMax: number;
  competitiveness: CompetitivenessLevel;
  residencyDifficulty: CompetitivenessLevel;

  // Work characteristics
  burnoutRisk: BurnoutRiskLevel;
  lifestyleRating: LifestyleRatingLevel;
  emergencyIntensity: IntensityLevel;
  patientInteractionLevel: IntensityLevel;
  procedureIntensity: IntensityLevel;
  diagnosticIntensity: IntensityLevel;
  stressLevel: IntensityLevel;
  workloadLevel: IntensityLevel;

  // Economics & Opportunities
  averageSalaryGHS: SpecialtySalaryData;
  privateSectorPotential: "Low" | "Medium" | "High" | "Very High";
  globalMobility: "Low" | "Medium" | "High" | "Very High";
  aiReplacementRisk: "Low" | "Medium" | "High";
  futureDemandGhana: "Declining" | "Stable" | "Growing" | "High Demand";

  // Trait fit
  traitProfile: TraitVector;

  // Career information
  trainingPathway: SpecialtyTrainingPathway;
  ghanaData: GhanaTrainingData;
  subspecialties: SpecialtySubspecialty[];
  relatedSpecialties: string[]; // IDs of related specialties

  // Lifestyle details
  typicalSchedule: string;
  onCallFrequency: string;
  workEnvironments: string[];

  // Day in life
  dayInLife: {
    typical: DayInLifeEntry[];
    callDay: DayInLifeEntry[];
  };

  // Case examples
  typicalCases: string[];

  // Assessment
  majorPros: string[];
  majorCons: string[];
  commonMisconceptions: string[];

  // Student guidance
  recommendedStudentActivities: string[];
  researchOpportunities: string[];
  requiredElectives?: string[];

  // Tags & metadata
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// QUIZ RESPONSES & SCORING
// ============================================================================

export interface QuizResponse {
  questionId: number;
  answer: number; // The selected scale value
  responseTime?: number; // milliseconds
}

export interface QuizAttempt {
  id: string;
  userId?: string;
  audience: "medical-student" | "high-school" | "dental-student";
  responses: QuizResponse[];
  completedAt: string;
  duration: number; // seconds
}

export interface TraitScoreResult {
  trait: TraitId;
  score: number; // 0-100
  percentile: number; // 0-100
  category: string;
  interpretation: string;
}

export interface SpecialtyMatchResult {
  specialtyId: string;
  specialtyName: string;
  matchScore: number; // 0-100
  matchPercentage: number;
  rank: number;
  strengths: string[];
  challenges: string[];
  reasoning: string;
  confidenceLevel: "Low" | "Medium" | "High";
}

export interface AssessmentResult {
  id: string;
  quizAttemptId: string;
  userId?: string;
  audience: string;
  traitScores: TraitScoreResult[];
  topMatches: SpecialtyMatchResult[];
  personalitySummary: string;
  personalityType?: string;
  suggestedNextSteps: string[];
  studyRecommendations: string[];
  ghanaSpecificGuidance: string[];
  generatedAt: string;
}

// ============================================================================
// USER DATA
// ============================================================================

export interface User {
  id: string;
  email?: string;
  name: string;
  institution: string;
  audience: "medical-student" | "high-school" | "dental-student";
  yearOfStudy?: number;
  gpa?: number;
  location: string; // Ghana region
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  assessmentAttempts: string[]; // Quiz attempt IDs
  lastAssessmentDate: string;
  favoriteSpecialties: string[]; // Specialty IDs
  savedResults: string[]; // Result IDs
}

// ============================================================================
// GHANA-SPECIFIC TYPES
// ============================================================================

export interface GhanaInstitution {
  id: string;
  name: string;
  shortName: string;
  location: string;
  region: string;
  type: "teaching-hospital" | "medical-school" | "dental-school" | "research-center";
  website: string;
  specialtiesOffered: string[];
}

export interface GhanaRegion {
  code: string;
  name: string;
  capital: string;
  medicalCenters: string[];
  trainingOpportunities: string;
}

// ============================================================================
// DATABASE SCHEMA TYPES (for Supabase)
// ============================================================================

export interface DatabaseUser {
  id: string;
  email: string;
  name: string;
  institution: string;
  audience: string;
  year_of_study?: number;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseQuizAttempt {
  id: string;
  user_id?: string;
  audience: string;
  responses: Record<number, number>;
  completed_at: string;
  duration_seconds: number;
  created_at: string;
}

export interface DatabaseAssessmentResult {
  id: string;
  quiz_attempt_id: string;
  user_id?: string;
  trait_scores: Record<string, number>;
  top_matches: SpecialtyMatchResult[];
  personality_summary: string;
  suggested_next_steps: string[];
  generated_at: string;
  created_at: string;
}

export interface DatabaseSavedReport {
  id: string;
  user_id?: string;
  result_id: string;
  assessment_result: DatabaseAssessmentResult;
  shareable_url: string;
  is_public: boolean;
  created_at: string;
  expires_at?: string;
}
