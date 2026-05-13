import { AssessmentQuestion, TraitKey, TraitVector } from "@/lib/types";

export const traitLabels: Record<TraitKey, string> = {
  patientInteraction: "Patient Interaction",
  proceduralInterest: "Procedural Interest",
  diagnosticReasoning: "Diagnostic Reasoning",
  fastPacedPreference: "Fast-Paced Preference",
  workLifePriority: "Work-Life Balance Priority",
  emotionalResilience: "Emotional Resilience",
  teamCollaboration: "Team Collaboration",
  precisionOrientation: "Precision & Detail",
  longTermRelationships: "Long-Term Relationships",
  researchCuriosity: "Research Curiosity",
  leadershipPreference: "Leadership Preference",
  trainingTolerance: "Tolerance for Long Training",
  emergencyComfort: "Comfort with Emergencies",
  communicationEmpathy: "Communication & Empathy",
  predictableSchedulePreference: "Preference for Predictable Schedules"
};

export const emptyTraitVector = (): TraitVector => ({
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
});

const weights = (...entries: [TraitKey, number][]) =>
  Object.fromEntries(entries) as Partial<Record<TraitKey, number>>;

export const assessmentQuestions: AssessmentQuestion[] = [
  { id: 1, type: "likert", prompt: "I enjoy solving complex problems with limited information.", weights: weights(["diagnosticReasoning", 1.3], ["emotionalResilience", 0.4], ["researchCuriosity", 0.5]) },
  { id: 2, type: "likert", prompt: "I would enjoy working with my hands during procedures.", weights: weights(["proceduralInterest", 1.4], ["precisionOrientation", 0.6]) },
  { id: 3, type: "likert", prompt: "I perform well under pressure.", weights: weights(["emotionalResilience", 1.1], ["emergencyComfort", 1], ["fastPacedPreference", 0.5]) },
  { id: 4, type: "likert", prompt: "I prefer long-term relationships with people over short interactions.", weights: weights(["longTermRelationships", 1.4], ["patientInteraction", 0.6], ["communicationEmpathy", 0.7]) },
  { id: 5, type: "likert", prompt: "I am emotionally resilient during stressful situations.", weights: weights(["emotionalResilience", 1.3], ["emergencyComfort", 0.7]) },
  { id: 6, type: "likert", prompt: "I value work-life balance highly.", weights: weights(["workLifePriority", 1.5], ["predictableSchedulePreference", 0.6]) },
  { id: 7, type: "likert", prompt: "I enjoy fast-paced environments.", weights: weights(["fastPacedPreference", 1.3], ["emergencyComfort", 0.7]) },
  { id: 8, type: "likert", prompt: "I am fascinated by human anatomy and disease mechanisms.", weights: weights(["diagnosticReasoning", 0.8], ["researchCuriosity", 0.8], ["proceduralInterest", 0.3]) },
  { id: 9, type: "forced-choice", prompt: "I prefer analytical work over social interaction.", options: [{ label: "Strongly disagree", value: 1 }, { label: "Neutral", value: 3 }, { label: "Strongly agree", value: 5 }], weights: weights(["diagnosticReasoning", 0.9], ["patientInteraction", -0.8], ["communicationEmpathy", -0.6]) },
  { id: 10, type: "likert", prompt: "I would enjoy leading a healthcare team.", weights: weights(["leadershipPreference", 1.3], ["teamCollaboration", 0.7]) },
  { id: 11, type: "likert", prompt: "I enjoy detailed and precise work.", weights: weights(["precisionOrientation", 1.5], ["proceduralInterest", 0.4], ["diagnosticReasoning", 0.4]) },
  { id: 12, type: "likert", prompt: "I am comfortable discussing emotionally difficult topics.", weights: weights(["communicationEmpathy", 1.2], ["emotionalResilience", 0.6], ["patientInteraction", 0.5]) },
  { id: 13, type: "situational", prompt: "I prefer variety rather than routine.", options: [{ label: "Routine", value: 1 }, { label: "Mix", value: 3 }, { label: "Variety", value: 5 }], weights: weights(["fastPacedPreference", 0.6], ["predictableSchedulePreference", -1], ["emergencyComfort", 0.4]) },
  { id: 14, type: "likert", prompt: "I enjoy mentoring or teaching others.", weights: weights(["communicationEmpathy", 0.8], ["leadershipPreference", 0.8], ["teamCollaboration", 0.6]) },
  { id: 15, type: "likert", prompt: "I am willing to spend many years in training for mastery.", weights: weights(["trainingTolerance", 1.5], ["leadershipPreference", 0.4]) },
  { id: 16, type: "forced-choice", prompt: "I would rather diagnose a disease than perform surgery.", options: [{ label: "Prefer surgery", value: 1 }, { label: "Either", value: 3 }, { label: "Prefer diagnosis", value: 5 }], weights: weights(["diagnosticReasoning", 1.2], ["proceduralInterest", -1.1]) },
  { id: 17, type: "forced-choice", prompt: "I enjoy interacting with children.", options: [{ label: "Not really", value: 1 }, { label: "Sometimes", value: 3 }, { label: "Definitely", value: 5 }], weights: weights(["patientInteraction", 0.7], ["communicationEmpathy", 0.8], ["longTermRelationships", 0.4]) },
  { id: 18, type: "likert", prompt: "I am comfortable making rapid decisions.", weights: weights(["emergencyComfort", 1.2], ["fastPacedPreference", 0.7], ["emotionalResilience", 0.5]) },
  { id: 19, type: "forced-choice", prompt: "I prefer structured schedules over unpredictable work.", options: [{ label: "Unpredictable", value: 1 }, { label: "Balanced", value: 3 }, { label: "Structured", value: 5 }], weights: weights(["predictableSchedulePreference", 1.4], ["workLifePriority", 0.6], ["fastPacedPreference", -0.5]) },
  { id: 20, type: "likert", prompt: "I enjoy communicating and counseling people.", weights: weights(["communicationEmpathy", 1.3], ["patientInteraction", 0.9], ["longTermRelationships", 0.4]) },
  { id: 21, type: "likert", prompt: "I am interested in technology and imaging tools.", weights: weights(["researchCuriosity", 0.7], ["diagnosticReasoning", 0.7], ["precisionOrientation", 0.5]) },
  { id: 22, type: "forced-choice", prompt: "I prefer community impact over individual patient care.", options: [{ label: "Individual care", value: 1 }, { label: "Both", value: 3 }, { label: "Community impact", value: 5 }], weights: weights(["patientInteraction", -0.5], ["leadershipPreference", 0.5], ["researchCuriosity", 0.5], ["teamCollaboration", 0.4]) },
  { id: 23, type: "likert", prompt: "I enjoy high-intensity environments.", weights: weights(["fastPacedPreference", 1.1], ["emergencyComfort", 1], ["emotionalResilience", 0.5]) },
  { id: 24, type: "likert", prompt: "I like balancing science with human interaction.", weights: weights(["diagnosticReasoning", 0.7], ["patientInteraction", 0.7], ["communicationEmpathy", 0.5]) },
  { id: 25, type: "likert", prompt: "I am curious about research and medical discoveries.", weights: weights(["researchCuriosity", 1.5], ["diagnosticReasoning", 0.5]) }
];
