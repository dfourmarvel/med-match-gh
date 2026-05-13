import { QUIZ_QUESTIONS } from "@/data/questions/index";
import { TRAIT_IDS, clampTraitScore, createNeutralTraitScores } from "@/data/traits/index";
import { QuizResponse, TraitId, TraitScoreBreakdown, TraitScores } from "@/types/dataset";
import { normalizeAnswer } from "./normalizeTraits";

export function scoreQuiz(responses: QuizResponse[]): { traitScores: TraitScores; breakdown: TraitScoreBreakdown[] } {
  const scores = createNeutralTraitScores();
  const contributingQuestions = Object.fromEntries(TRAIT_IDS.map((id) => [id, [] as number[]])) as Record<TraitId, number[]>;
  const byQuestionId = new Map(responses.map((response) => [response.questionId, response.answer]));

  for (const question of QUIZ_QUESTIONS) {
    const rawAnswer = byQuestionId.get(question.id) ?? 3;
    const normalized = normalizeAnswer(question.reverseScoring ? 6 - rawAnswer : rawAnswer);

    for (const mapping of question.traitMappings) {
      const direction = mapping.direction === "positive" ? 1 : -1;
      const contribution = normalized * mapping.weight * direction;
      scores[mapping.trait] = clampTraitScore(scores[mapping.trait] + contribution);
      contributingQuestions[mapping.trait].push(question.id);
    }
  }

  return {
    traitScores: scores,
    breakdown: TRAIT_IDS.map((trait) => ({
      trait,
      score: scores[trait],
      contributingQuestions: contributingQuestions[trait]
    }))
  };
}
