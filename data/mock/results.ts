import { scoreAssessment } from "@/lib/scoring/index";
import { AssessmentResult, QuizResponse } from "@/types/dataset";
import { MOCK_USERS } from "./users";

const responseProfiles: QuizResponse[][] = [
  [5, 5, 5, 2, 5, 1, 5, 5, 4, 5, 5, 3, 5, 4, 5, 1, 2, 5, 1, 3, 4, 2, 5, 4, 4],
  [5, 2, 3, 5, 4, 5, 2, 4, 1, 3, 4, 5, 2, 4, 3, 5, 4, 3, 5, 5, 3, 3, 2, 5, 4],
  [4, 5, 3, 5, 3, 5, 3, 4, 2, 3, 5, 4, 2, 3, 4, 2, 5, 3, 5, 5, 4, 2, 3, 5, 3],
  [4, 2, 3, 4, 4, 4, 3, 4, 3, 5, 3, 4, 4, 5, 3, 4, 3, 3, 4, 4, 3, 5, 3, 5, 5],
  [5, 3, 5, 3, 5, 2, 5, 5, 4, 4, 5, 3, 5, 4, 5, 4, 2, 5, 2, 3, 5, 3, 5, 4, 5],
  [4, 2, 3, 5, 4, 5, 2, 4, 2, 4, 4, 5, 2, 4, 3, 5, 5, 3, 5, 5, 3, 4, 2, 5, 4],
  [3, 5, 3, 5, 3, 5, 2, 4, 2, 3, 5, 4, 2, 3, 4, 2, 5, 3, 5, 5, 4, 2, 2, 5, 3],
  [4, 2, 4, 4, 4, 4, 3, 4, 3, 5, 4, 4, 4, 5, 4, 4, 3, 4, 4, 4, 4, 5, 3, 5, 5],
  [5, 2, 4, 4, 4, 4, 3, 5, 4, 3, 5, 4, 3, 4, 5, 5, 3, 4, 4, 4, 5, 4, 3, 4, 5],
  [5, 4, 5, 4, 5, 2, 5, 5, 3, 5, 5, 4, 5, 5, 5, 3, 4, 5, 2, 5, 5, 4, 5, 5, 5]
].map((answers) => answers.map((answer, index) => ({ questionId: index + 1, answer })));

export const MOCK_RESULTS: AssessmentResult[] = MOCK_USERS.map((user, index) =>
  scoreAssessment({
    id: `mock-result-${String(index + 1).padStart(3, "0")}`,
    userId: user.id,
    audience: user.audience,
    responses: responseProfiles[index]
  })
);
