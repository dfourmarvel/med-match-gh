/**
 * Trait system definitions for MedMatch Ghana
 * 15 core personality and professional traits used for specialty matching
 */

import { TraitDefinition, TraitId } from "@/data/types";

export const TRAIT_DEFINITIONS: Record<TraitId, TraitDefinition> = {
  patientInteraction: {
    id: "patientInteraction",
    name: "Patient Interaction",
    shortName: "Patient Focus",
    description:
      "Comfort and fulfillment gained from direct patient engagement, communication, and building therapeutic relationships.",
    positiveIndicator:
      "You energize from patient conversations and feel fulfilled building relationships.",
    negativeIndicator: "You prefer analytical work or limited patient contact.",
    scale: { min: 1, max: 10, midpoint: 5 },
    category: "interpersonal",
    icon: "👥",
    colorHex: "#10b981"
  },

  proceduralInterest: {
    id: "proceduralInterest",
    name: "Procedural Interest",
    shortName: "Hands-On",
    description:
      "Enjoyment of performing technical procedures, surgeries, or hands-on clinical interventions.",
    positiveIndicator:
      "You enjoy working with your hands and find procedural work satisfying.",
    negativeIndicator:
      "You prefer diagnostic or consultative work over technical procedures.",
    scale: { min: 1, max: 10, midpoint: 5 },
    category: "procedural",
    icon: "🔧",
    colorHex: "#f59e0b"
  },

  diagnosticThinking: {
    id: "diagnosticThinking",
    name: "Diagnostic Thinking",
    shortName: "Analytical",
    description:
      "Strength in problem-solving, pattern recognition, and complex clinical reasoning with limited information.",
    positiveIndicator:
      "You enjoy solving puzzles and reasoning through complex clinical scenarios.",
    negativeIndicator:
      "You prefer straightforward, routine clinical work.",
    scale: { min: 1, max: 10, midpoint: 5 },
    category: "cognitive",
    icon: "🧠",
    colorHex: "#8b5cf6"
  },

  fastPacedPreference: {
    id: "fastPacedPreference",
    name: "Fast-Paced Preference",
    shortName: "Action-Oriented",
    description:
      "Comfort and satisfaction working in high-energy, rapidly changing environments with frequent decision-making.",
    positiveIndicator:
      "You thrive in busy, dynamic environments with constant activity.",
    negativeIndicator:
      "You prefer slower-paced, predictable work settings.",
    scale: { min: 1, max: 10, midpoint: 5 },
    category: "lifestyle",
    icon: "⚡",
    colorHex: "#ef4444"
  },

  workLifeBalancePriority: {
    id: "workLifeBalancePriority",
    name: "Work-Life Balance Priority",
    shortName: "Balance-Focused",
    description:
      "Importance placed on predictable schedules, limited on-call duties, and time for personal/family life.",
    positiveIndicator:
      "Work-life balance is essential to your career satisfaction.",
    negativeIndicator:
      "You're willing to sacrifice personal time for career advancement.",
    scale: { min: 1, max: 10, midpoint: 5 },
    category: "lifestyle",
    icon: "⚖️",
    colorHex: "#06b6d4"
  },

  emotionalResilience: {
    id: "emotionalResilience",
    name: "Emotional Resilience",
    shortName: "Stress Tolerance",
    description:
      "Ability to manage stress, handle emotional demands, and maintain well-being under pressure.",
    positiveIndicator:
      "You handle stressful situations calmly and recover quickly.",
    negativeIndicator:
      "High-stress environments significantly affect your well-being.",
    scale: { min: 1, max: 10, midpoint: 5 },
    category: "resilience",
    icon: "💪",
    colorHex: "#ec4899"
  },

  teamwork: {
    id: "teamwork",
    name: "Teamwork",
    shortName: "Collaborative",
    description:
      "Preference for collaborative practice, interdisciplinary team environments, and shared decision-making.",
    positiveIndicator:
      "You work best as part of a team and value collaborative input.",
    negativeIndicator:
      "You prefer independent practice and autonomous decision-making.",
    scale: { min: 1, max: 10, midpoint: 5 },
    category: "interpersonal",
    icon: "🤝",
    colorHex: "#14b8a6"
  },

  precisionOrientation: {
    id: "precisionOrientation",
    name: "Precision Orientation",
    shortName: "Detail-Focused",
    description:
      "Attention to detail, accuracy, and systematic precision in clinical work and documentation.",
    positiveIndicator:
      "You take pride in meticulous, accurate, detailed work.",
    negativeIndicator:
      "You prefer working at a broader, conceptual level.",
    scale: { min: 1, max: 10, midpoint: 5 },
    category: "procedural",
    icon: "🎯",
    colorHex: "#06b6d4"
  },

  longTermRelationships: {
    id: "longTermRelationships",
    name: "Long-Term Relationships",
    shortName: "Continuity-Focused",
    description:
      "Value in building longitudinal patient relationships and ongoing continuity of care over time.",
    positiveIndicator:
      "You're drawn to long-term patient relationships and continuity of care.",
    negativeIndicator:
      "You prefer shorter-term, episodic patient encounters.",
    scale: { min: 1, max: 10, midpoint: 5 },
    category: "interpersonal",
    icon: "🔗",
    colorHex: "#10b981"
  },

  researchInterest: {
    id: "researchInterest",
    name: "Research Interest",
    shortName: "Research-Minded",
    description:
      "Curiosity about medical discovery, evidence-based practice, and contribution to scientific knowledge.",
    positiveIndicator:
      "You're curious about research and contributing to medical knowledge.",
    negativeIndicator:
      "You prefer clinical practice over research and academic work.",
    scale: { min: 1, max: 10, midpoint: 5 },
    category: "cognitive",
    icon: "🔬",
    colorHex: "#8b5cf6"
  },

  leadershipPreference: {
    id: "leadershipPreference",
    name: "Leadership Preference",
    shortName: "Leadership-Oriented",
    description:
      "Comfort with leadership roles, team direction, administrative responsibility, and decision authority.",
    positiveIndicator:
      "You enjoy leadership roles and team direction.",
    negativeIndicator:
      "You prefer focusing on clinical care without administrative burden.",
    scale: { min: 1, max: 10, midpoint: 5 },
    category: "interpersonal",
    icon: "👑",
    colorHex: "#f59e0b"
  },

  longTrainingTolerance: {
    id: "longTrainingTolerance",
    name: "Long Training Tolerance",
    shortName: "Training Resilience",
    description:
      "Willingness to commit to extended training periods (5+ years residency) for subspecialization.",
    positiveIndicator:
      "You're willing to spend many years in intensive training.",
    negativeIndicator:
      "You prefer shorter training periods and earlier independence.",
    scale: { min: 1, max: 10, midpoint: 5 },
    category: "resilience",
    icon: "📚",
    colorHex: "#14b8a6"
  },

  emergencyComfort: {
    id: "emergencyComfort",
    name: "Emergency Comfort",
    shortName: "Crisis-Ready",
    description:
      "Comfort making rapid decisions and managing critical/emergency situations with life-or-death stakes.",
    positiveIndicator:
      "You're calm and decisive in emergency situations.",
    negativeIndicator:
      "You prefer planned, controlled clinical environments.",
    scale: { min: 1, max: 10, midpoint: 5 },
    category: "resilience",
    icon: "🚨",
    colorHex: "#ef4444"
  },

  communicationEmpathy: {
    id: "communicationEmpathy",
    name: "Communication & Empathy",
    shortName: "Empathetic",
    description:
      "Ability to listen, empathize, communicate compassionately, and provide emotional support.",
    positiveIndicator:
      "You communicate warmly and naturally empathize with others.",
    negativeIndicator:
      "You find emotionally focused communication draining.",
    scale: { min: 1, max: 10, midpoint: 5 },
    category: "interpersonal",
    icon: "❤️",
    colorHex: "#ec4899"
  },

  schedulePredictability: {
    id: "schedulePredictability",
    name: "Schedule Predictability",
    shortName: "Schedule Control",
    description:
      "Preference for regular working hours, predictable schedules, and minimal unexpected call requirements.",
    positiveIndicator:
      "You value predictable schedules and regular working hours.",
    negativeIndicator:
      "You're flexible with on-call duties and irregular schedules.",
    scale: { min: 1, max: 10, midpoint: 5 },
    category: "lifestyle",
    icon: "📅",
    colorHex: "#06b6d4"
  }
};

/**
 * Get a trait definition by ID
 */
export function getTraitDefinition(id: TraitId): TraitDefinition {
  return TRAIT_DEFINITIONS[id];
}

/**
 * Get all trait definitions
 */
export function getAllTraits(): TraitDefinition[] {
  return Object.values(TRAIT_DEFINITIONS);
}

/**
 * Get traits by category
 */
export function getTraitsByCategory(
  category: TraitDefinition["category"]
): TraitDefinition[] {
  return Object.values(TRAIT_DEFINITIONS).filter(
    (trait) => trait.category === category
  );
}

/**
 * Interpret a trait score (1-10 scale)
 */
export function interpretTraitScore(
  traitId: TraitId,
  score: number
): string {
  if (score <= 2) return "Very Low";
  if (score <= 4) return "Low";
  if (score <= 6) return "Moderate";
  if (score <= 8) return "High";
  return "Very High";
}

/**
 * Get trait summary categories
 */
export const TRAIT_CATEGORIES = {
  interpersonal: "Interpersonal & Communication",
  procedural: "Technical & Procedural",
  cognitive: "Analytical & Cognitive",
  lifestyle: "Lifestyle & Work Style",
  resilience: "Resilience & Stress Management"
} as const;
