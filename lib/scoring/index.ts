import { calculateMatches } from "./calculateMatches";
import { generatePersonalitySummary } from "./explanations";
import { getTopMatches, rankSpecialtyMatches } from "./specialtyRanking";
import { scoreQuiz } from "./scoreQuiz";
import { AssessmentResult, Audience, QuizResponse } from "@/types/dataset";

export function scoreAssessment(input: {
  id: string;
  userId?: string;
  audience: Audience;
  responses: QuizResponse[];
}): AssessmentResult {
  const { traitScores } = scoreQuiz(input.responses);
  const matches = rankSpecialtyMatches(calculateMatches(traitScores));
  return {
    id: input.id,
    userId: input.userId,
    audience: input.audience,
    responses: input.responses,
    traitScores,
    topMatches: getTopMatches(matches, 5),
    generatedAt: new Date().toISOString()
  };
}

export { calculateMatches, generatePersonalitySummary, getTopMatches, rankSpecialtyMatches, scoreQuiz };
