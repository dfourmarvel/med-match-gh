/**
 * Seed Data and Mock Data for MedMatch Ghana
 * Realistic fake data for testing and development
 */

import { User, QuizResponse, AssessmentResult, SpecialtyMatchResult } from "@/data/types";
import { calculateTraitScores, scoreAllSpecialties, generatePersonalitySummary, generateSuggestedNextSteps, normalizeToHundredScale } from "@/lib/scoring-engine";

/**
 * 10 realistic mock users for testing
 */
export const MOCK_USERS: User[] = [
  {
    id: "user-001",
    email: "ama.mensah@student.ug.edu.gh",
    name: "Ama Mensah",
    institution: "University of Ghana School of Medicine",
    audience: "medical-student",
    yearOfStudy: 3,
    gpa: 3.7,
    location: "Greater Accra",
    createdAt: new Date("2024-01-15").toISOString()
  },
  {
    id: "user-002",
    email: "kwame.asante@student.knust.edu.gh",
    name: "Kwame Asante",
    institution: "KNUST School of Medical Sciences",
    audience: "medical-student",
    yearOfStudy: 2,
    gpa: 3.4,
    location: "Ashanti",
    createdAt: new Date("2024-02-01").toISOString()
  },
  {
    id: "user-003",
    email: "efua.osei@student.ug.edu.gh",
    name: "Efua Osei",
    institution: "University of Ghana School of Dentistry",
    audience: "dental-student",
    yearOfStudy: 1,
    gpa: 3.8,
    location: "Greater Accra",
    createdAt: new Date("2024-02-10").toISOString()
  },
  {
    id: "user-004",
    email: "benjamin.adjei@highschool.edu.gh",
    name: "Benjamin Adjei",
    institution: "Achimota School",
    audience: "high-school",
    yearOfStudy: undefined,
    gpa: undefined,
    location: "Greater Accra",
    createdAt: new Date("2024-02-15").toISOString()
  },
  {
    id: "user-005",
    email: "abena.kyei@student.ug.edu.gh",
    name: "Abena Kyei",
    institution: "University of Ghana School of Medicine",
    audience: "medical-student",
    yearOfStudy: 4,
    gpa: 3.9,
    location: "Greater Accra",
    createdAt: new Date("2024-03-01").toISOString()
  },
  {
    id: "user-006",
    email: "kofi.anane@student.knust.edu.gh",
    name: "Kofi Anane",
    institution: "KNUST School of Medical Sciences",
    audience: "medical-student",
    yearOfStudy: 1,
    gpa: 3.2,
    location: "Ashanti",
    createdAt: new Date("2024-03-10").toISOString()
  },
  {
    id: "user-007",
    email: "grace.boateng@student.ug.edu.gh",
    name: "Grace Boateng",
    institution: "University of Ghana School of Medicine",
    audience: "medical-student",
    yearOfStudy: 3,
    gpa: 3.5,
    location: "Western",
    createdAt: new Date("2024-03-15").toISOString()
  },
  {
    id: "user-008",
    email: "david.mensah@student.knust.edu.gh",
    name: "David Mensah",
    institution: "KNUST School of Medical Sciences",
    audience: "medical-student",
    yearOfStudy: 2,
    gpa: 3.6,
    location: "Ashanti",
    createdAt: new Date("2024-03-20").toISOString()
  },
  {
    id: "user-009",
    email: "sally.owusu@student.ug.edu.gh",
    name: "Sally Owusu",
    institution: "University of Ghana School of Dentistry",
    audience: "dental-student",
    yearOfStudy: 2,
    gpa: 3.7,
    location: "Greater Accra",
    createdAt: new Date("2024-03-25").toISOString()
  },
  {
    id: "user-010",
    email: "nana.ebo@highschool.edu.gh",
    name: "Nana Ebo",
    institution: "Wesley Girls High School",
    audience: "high-school",
    yearOfStudy: undefined,
    gpa: undefined,
    location: "Greater Accra",
    createdAt: new Date("2024-04-01").toISOString()
  }
];

/**
 * Generate realistic quiz responses for different profiles
 */
function generateQuizResponses(profile: "surgeon" | "psychiatrist" | "family-medicine" | "dentist" | "balanced"): QuizResponse[] {
  const profiles: Record<string, Record<number, number>> = {
    surgeon: {
      1: 5, 2: 5, 3: 5, 4: 1, 5: 5, 6: 1, 7: 5, 8: 4, 9: 4, 10: 4,
      11: 5, 12: 2, 13: 5, 14: 3, 15: 5, 16: 1, 17: 2, 18: 5, 19: 1, 20: 2,
      21: 3, 22: 1, 23: 5, 24: 3, 25: 2
    },
    psychiatrist: {
      1: 3, 2: 1, 3: 3, 4: 5, 5: 4, 6: 5, 7: 1, 8: 2, 9: 1, 10: 3,
      11: 2, 12: 5, 13: 1, 14: 5, 15: 3, 16: 5, 17: 4, 18: 2, 19: 5, 20: 5,
      21: 1, 22: 3, 23: 1, 24: 4, 25: 2
    },
    "family-medicine": {
      1: 4, 2: 2, 3: 3, 4: 5, 5: 3, 6: 5, 7: 2, 8: 3, 9: 2, 10: 3,
      11: 3, 12: 4, 13: 2, 14: 4, 15: 2, 16: 4, 17: 4, 18: 3, 19: 5, 20: 5,
      21: 2, 22: 4, 23: 2, 24: 4, 25: 3
    },
    dentist: {
      1: 3, 2: 5, 3: 3, 4: 3, 5: 3, 6: 5, 7: 2, 8: 3, 9: 3, 10: 4,
      11: 5, 12: 4, 13: 2, 14: 3, 15: 2, 16: 3, 17: 4, 18: 3, 19: 5, 20: 4,
      21: 3, 22: 2, 23: 1, 24: 3, 25: 2
    },
    balanced: {
      1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 3,
      11: 3, 12: 3, 13: 3, 14: 3, 15: 3, 16: 3, 17: 3, 18: 3, 19: 3, 20: 3,
      21: 3, 22: 3, 23: 3, 24: 3, 25: 3
    }
  };

  const responses = profiles[profile] || profiles.balanced;
  return Object.entries(responses).map(([id, answer]) => ({
    questionId: parseInt(id),
    answer,
    responseTime: Math.random() * 60000 + 5000 // 5-65 seconds per question
  }));
}

/**
 * Generate realistic assessment results
 */
export function generateMockAssessmentResult(profile: "surgeon" | "psychiatrist" | "family-medicine" | "dentist" | "balanced"): Omit<AssessmentResult, "id" | "quizAttemptId" | "userId"> {
  const responses = generateQuizResponses(profile);
  const traitScores = calculateTraitScores(responses);
  const normalizedScores = normalizeToHundredScale(traitScores);
  const matches = scoreAllSpecialties(normalizedScores);
  const topMatches = matches.slice(0, 5);

  return {
    audience: "medical-student",
    traitScores: Object.entries(normalizedScores).map(([trait, score]) => ({
      trait: trait as any,
      score,
      percentile: Math.round((score / 100) * 100),
      category: "general",
      interpretation: score > 70 ? "High" : score > 40 ? "Moderate" : "Low"
    })),
    topMatches,
    personalitySummary: generatePersonalitySummary(normalizedScores),
    personalityType: 
      profile === "surgeon" ? "The Doer" :
      profile === "psychiatrist" ? "The Healer" :
      profile === "family-medicine" ? "The Communicator" :
      profile === "dentist" ? "The Perfectionist" :
      "The Balanced Professional",
    suggestedNextSteps: generateSuggestedNextSteps(topMatches),
    studyRecommendations: [
      "Focus on shadowing in your top specialty",
      "Engage with specialty-specific student organizations",
      "Pursue relevant electives and rotations"
    ],
    ghanaSpecificGuidance: [
      "Connect with mentors at Korle Bu or Komfo Anokye Teaching Hospitals",
      "Explore GCPS residency pathways for your matched specialty",
      "Consider both public and private practice settings"
    ],
    generatedAt: new Date().toISOString()
  };
}

/**
 * 5 complete mock assessments with different profiles
 */
export const MOCK_ASSESSMENT_RESULTS = [
  {
    profile: "surgeon" as const,
    user: MOCK_USERS[0],
    result: generateMockAssessmentResult("surgeon")
  },
  {
    profile: "psychiatrist" as const,
    user: MOCK_USERS[1],
    result: generateMockAssessmentResult("psychiatrist")
  },
  {
    profile: "family-medicine" as const,
    user: MOCK_USERS[2],
    result: generateMockAssessmentResult("family-medicine")
  },
  {
    profile: "dentist" as const,
    user: MOCK_USERS[3],
    result: generateMockAssessmentResult("dentist")
  },
  {
    profile: "balanced" as const,
    user: MOCK_USERS[4],
    result: generateMockAssessmentResult("balanced")
  }
];

/**
 * Seed functions for database population
 */
export async function seedUsers(db: any): Promise<void> {
  console.log("Seeding users...");
  for (const user of MOCK_USERS) {
    await db.insert("users").values(user);
  }
  console.log(`Seeded ${MOCK_USERS.length} users`);
}

export async function seedMockAssessments(db: any): Promise<void> {
  console.log("Seeding mock assessments...");
  for (const assessment of MOCK_ASSESSMENT_RESULTS) {
    // Insert assessment result
    const result = {
      ...assessment.result,
      user_id: assessment.user.id,
      trait_scores: JSON.stringify(
        Object.fromEntries(
          assessment.result.traitScores.map((ts) => [ts.trait, ts.score])
        )
      ),
      top_matches: JSON.stringify(assessment.result.topMatches)
    };
    await db.insert("assessment_results").values(result);
  }
  console.log(`Seeded ${MOCK_ASSESSMENT_RESULTS.length} assessments`);
}

/**
 * Generate CSV export of mock data (useful for analytics)
 */
export function exportMockDataAsCSV(): string {
  const header = "user_id,name,institution,audience,location,top_specialty,match_percentage\n";
  const rows = MOCK_ASSESSMENT_RESULTS.map(
    (a) =>
      `${a.user.id},${a.user.name},${a.user.institution},${a.user.audience},${a.user.location},${
        a.result.topMatches[0]?.specialtyName || "N/A"
      },${a.result.topMatches[0]?.matchPercentage || 0}`
  );
  return header + rows.join("\n");
}

/**
 * Get mock data statistics
 */
export function getMockDataStatistics() {
  return {
    totalMockUsers: MOCK_USERS.length,
    mockAssessments: MOCK_ASSESSMENT_RESULTS.length,
    medicalStudents: MOCK_USERS.filter((u) => u.audience === "medical-student").length,
    dentalStudents: MOCK_USERS.filter((u) => u.audience === "dental-student").length,
    highSchoolStudents: MOCK_USERS.filter((u) => u.audience === "high-school").length,
    averageGPA: (
      MOCK_USERS.filter((u) => u.gpa).reduce((sum, u) => sum + (u.gpa || 0), 0) /
      MOCK_USERS.filter((u) => u.gpa).length
    ).toFixed(2),
    topSpecialties: MOCK_ASSESSMENT_RESULTS.slice(0, 5).map(
      (a) => `${a.result.topMatches[0]?.specialtyName} (${a.result.topMatches[0]?.matchPercentage}%)`
    )
  };
}
