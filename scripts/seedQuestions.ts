import { QUIZ_QUESTIONS } from "@/data/questions/index";

export const seedQuestions = QUIZ_QUESTIONS.map((question) => ({
  id: question.id,
  question_text: question.questionText,
  category: question.category,
  type: question.type,
  description: question.description,
  trait_mappings: question.traitMappings,
  weightings: question.weightings,
  answer_scale: question.answerScale,
  reverse_scoring: question.reverseScoring,
  follow_up_explanation: question.followUpExplanation ?? null
}));

if (require.main === module) {
  console.log(JSON.stringify(seedQuestions, null, 2));
}
