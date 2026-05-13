import { TraitDefinition, TraitId, TraitScores, TraitCategory } from "@/types/dataset";

export const TRAIT_IDS: TraitId[] = [
  "patientInteraction",
  "proceduralInterest",
  "diagnosticThinking",
  "fastPacedPreference",
  "workLifeBalancePriority",
  "emotionalResilience",
  "teamwork",
  "precisionOrientation",
  "longTermRelationships",
  "researchInterest",
  "leadershipPreference",
  "longTrainingTolerance",
  "emergencyComfort",
  "communicationEmpathy",
  "schedulePredictability"
];

export const TRAITS: Record<TraitId, TraitDefinition> = {
  patientInteraction: {
    id: "patientInteraction",
    name: "Patient Interaction",
    shortName: "Patients",
    description: "Comfort and energy gained from direct patient contact, history-taking, counseling, and bedside care.",
    chartLabel: "Patient Contact",
    icon: "users",
    colorHex: "#10b981",
    category: "interpersonal",
    lowLabel: "Low direct contact",
    highLabel: "High direct contact",
    min: 1,
    max: 10
  },
  proceduralInterest: {
    id: "proceduralInterest",
    name: "Procedural Interest",
    shortName: "Procedures",
    description: "Interest in hands-on procedures, operative work, technical tasks, and visible intervention outcomes.",
    chartLabel: "Procedures",
    icon: "scalpel",
    colorHex: "#f97316",
    category: "procedural",
    lowLabel: "Mostly cognitive",
    highLabel: "Highly hands-on",
    min: 1,
    max: 10
  },
  diagnosticThinking: {
    id: "diagnosticThinking",
    name: "Diagnostic Thinking",
    shortName: "Diagnosis",
    description: "Enjoyment of complex reasoning, pattern recognition, physiology, uncertainty, and synthesizing incomplete evidence.",
    chartLabel: "Diagnosis",
    icon: "brain",
    colorHex: "#0ea5e9",
    category: "cognitive",
    lowLabel: "Clear protocols",
    highLabel: "Complex reasoning",
    min: 1,
    max: 10
  },
  fastPacedPreference: {
    id: "fastPacedPreference",
    name: "Fast-Paced Preference",
    shortName: "Pace",
    description: "Preference for energetic, variable, rapidly changing clinical environments.",
    chartLabel: "Pace",
    icon: "zap",
    colorHex: "#ef4444",
    category: "lifestyle",
    lowLabel: "Steady pace",
    highLabel: "Rapid pace",
    min: 1,
    max: 10
  },
  workLifeBalancePriority: {
    id: "workLifeBalancePriority",
    name: "Work-Life Balance Priority",
    shortName: "Balance",
    description: "Importance placed on predictable personal time, sustainable workload, and flexibility outside work.",
    chartLabel: "Balance",
    icon: "calendar-heart",
    colorHex: "#8b5cf6",
    category: "lifestyle",
    lowLabel: "Career intensity",
    highLabel: "Lifestyle priority",
    min: 1,
    max: 10
  },
  emotionalResilience: {
    id: "emotionalResilience",
    name: "Emotional Resilience",
    shortName: "Resilience",
    description: "Capacity to stay grounded around suffering, uncertainty, conflict, and clinical pressure.",
    chartLabel: "Resilience",
    icon: "shield-heart",
    colorHex: "#14b8a6",
    category: "resilience",
    lowLabel: "Needs recovery",
    highLabel: "Steady under strain",
    min: 1,
    max: 10
  },
  teamwork: {
    id: "teamwork",
    name: "Teamwork",
    shortName: "Teamwork",
    description: "Preference and effectiveness in multidisciplinary collaboration, handovers, team-based problem solving, and shared care.",
    chartLabel: "Teamwork",
    icon: "handshake",
    colorHex: "#22c55e",
    category: "interpersonal",
    lowLabel: "Independent work",
    highLabel: "Team-based work",
    min: 1,
    max: 10
  },
  precisionOrientation: {
    id: "precisionOrientation",
    name: "Precision Orientation",
    shortName: "Precision",
    description: "Need for accuracy, detail, fine motor control, documentation discipline, and careful review.",
    chartLabel: "Precision",
    icon: "crosshair",
    colorHex: "#6366f1",
    category: "procedural",
    lowLabel: "Big-picture",
    highLabel: "Detail-driven",
    min: 1,
    max: 10
  },
  longTermRelationships: {
    id: "longTermRelationships",
    name: "Long-Term Relationships",
    shortName: "Continuity",
    description: "Preference for continuity of care, repeated patient contact, and watching outcomes evolve over time.",
    chartLabel: "Continuity",
    icon: "repeat",
    colorHex: "#06b6d4",
    category: "interpersonal",
    lowLabel: "Brief encounters",
    highLabel: "Longitudinal care",
    min: 1,
    max: 10
  },
  researchInterest: {
    id: "researchInterest",
    name: "Research Interest",
    shortName: "Research",
    description: "Curiosity about evidence, discovery, academic medicine, audits, clinical trials, and medical innovation.",
    chartLabel: "Research",
    icon: "microscope",
    colorHex: "#a855f7",
    category: "cognitive",
    lowLabel: "Practice-focused",
    highLabel: "Research-curious",
    min: 1,
    max: 10
  },
  leadershipPreference: {
    id: "leadershipPreference",
    name: "Leadership Preference",
    shortName: "Leadership",
    description: "Interest in directing teams, making operational decisions, teaching, advocacy, and service design.",
    chartLabel: "Leadership",
    icon: "badge",
    colorHex: "#f59e0b",
    category: "leadership",
    lowLabel: "Contributor",
    highLabel: "Team lead",
    min: 1,
    max: 10
  },
  longTrainingTolerance: {
    id: "longTrainingTolerance",
    name: "Long Training Tolerance",
    shortName: "Training",
    description: "Willingness to accept long residency/fellowship routes, exams, logbooks, and delayed specialization rewards.",
    chartLabel: "Training",
    icon: "graduation-cap",
    colorHex: "#64748b",
    category: "resilience",
    lowLabel: "Shorter route",
    highLabel: "Long mastery route",
    min: 1,
    max: 10
  },
  emergencyComfort: {
    id: "emergencyComfort",
    name: "Emergency Comfort",
    shortName: "Emergency",
    description: "Comfort with urgent decisions, unstable patients, night calls, resuscitation, and high-stakes triage.",
    chartLabel: "Emergency",
    icon: "siren",
    colorHex: "#dc2626",
    category: "resilience",
    lowLabel: "Low acuity",
    highLabel: "High acuity",
    min: 1,
    max: 10
  },
  communicationEmpathy: {
    id: "communicationEmpathy",
    name: "Communication & Empathy",
    shortName: "Empathy",
    description: "Skill and motivation for listening, explaining, counseling, shared decisions, and emotionally intelligent care.",
    chartLabel: "Empathy",
    icon: "message-circle-heart",
    colorHex: "#ec4899",
    category: "interpersonal",
    lowLabel: "Task-focused",
    highLabel: "Counseling-focused",
    min: 1,
    max: 10
  },
  schedulePredictability: {
    id: "schedulePredictability",
    name: "Schedule Predictability",
    shortName: "Schedule",
    description: "Preference for stable clinics, planned lists, and controllable hours over unpredictable emergency demand.",
    chartLabel: "Schedule",
    icon: "calendar-check",
    colorHex: "#84cc16",
    category: "lifestyle",
    lowLabel: "Unpredictable",
    highLabel: "Predictable",
    min: 1,
    max: 10
  }
};

export function createNeutralTraitScores(value = 5.5): TraitScores {
  return Object.fromEntries(TRAIT_IDS.map((id) => [id, value])) as TraitScores;
}

export function getTrait(id: TraitId): TraitDefinition {
  return TRAITS[id];
}

export function getTraitsByCategory(category: TraitCategory): TraitDefinition[] {
  return TRAIT_IDS.map((id) => TRAITS[id]).filter((trait) => trait.category === category);
}

export function clampTraitScore(score: number): number {
  return Math.min(10, Math.max(1, Number(score.toFixed(2))));
}
