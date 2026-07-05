import { ResultsClient } from "@/components/results/results-client";
import { UserResultsClient } from "@/components/results/user-results-client";
import { serverSupabase } from "@/lib/supabase";
import { matchSpecialties } from "@/lib/specialtyMatcher";
import { specialtiesById } from "@/lib/specialties";
import { assessmentQuestions } from "@/lib/assessment";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import Link from "next/link";
import { z } from "zod";

export default async function ResultsPage({
  searchParams
}: {
  searchParams: Promise<{ demo?: string; userId?: string }>;
}) {
  const params = await searchParams;
  const userId = params.userId;

  if (userId) {
    // Validate UUID format
    const parsedId = z.string().uuid().safeParse(userId);
    if (!parsedId.success) {
      return (
        <div className="space-y-4 sm:space-y-6">
          <div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.26em] text-secondary">Results</p>
            <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">Your MedMatch Ghana profile</h1>
          </div>
          <Card className="min-h-[260px] border-orange-500/20 bg-orange-50/5">
            <h2 className="text-lg font-semibold text-orange-600 dark:text-orange-300">Invalid User ID</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/75">
              The provided User ID format is invalid. Please make sure you are using a correct, full UUID.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/assessment">
                <Button>Start Assessment</Button>
              </Link>
              <Link href="/results?demo=true">
                <Button variant="outline">View Sample Results</Button>
              </Link>
            </div>
          </Card>
        </div>
      );
    }

    if (!serverSupabase) {
      return (
        <div className="space-y-4 sm:space-y-6">
          <div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.26em] text-secondary">Results</p>
            <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">Your MedMatch Ghana profile</h1>
          </div>
          <Card className="min-h-[260px]">
            <h2 className="text-lg font-semibold">Supabase is not configured</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/75">
              Database storage and sharing functions are not available because your Supabase environment variables are missing.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/results?demo=true">
                <Button>View Sample Results</Button>
              </Link>
            </div>
          </Card>
        </div>
      );
    }

    try {
      // 1. Fetch latest completed quiz attempt for this user
      const { data: attempt, error: attemptError } = await serverSupabase
        .from("quiz_attempts")
        .select("id, audience")
        .eq("user_id", parsedId.data)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (attemptError) throw attemptError;

      if (!attempt) {
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.26em] text-secondary">Results</p>
              <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">Your MedMatch Ghana profile</h1>
            </div>
            <Card className="min-h-[260px] border-amber-500/20">
              <h2 className="text-lg font-semibold">No assessment result found</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/75">
                We couldn't find a completed quiz attempt for this User ID in our database. Ensure the assessment is complete.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/assessment">
                  <Button>Start Assessment</Button>
                </Link>
                <Link href="/results?demo=true">
                  <Button variant="outline">View Sample Results</Button>
                </Link>
              </div>
            </Card>
          </div>
        );
      }

      // 2. Fetch trait scores
      const { data: dbScores, error: scoresError } = await serverSupabase
        .from("trait_scores")
        .select("trait_id, score")
        .eq("quiz_attempt_id", attempt.id);

      if (scoresError) throw scoresError;

      // 3. Fetch quiz answers
      const { data: dbAnswers, error: answersError } = await serverSupabase
        .from("quiz_answers")
        .select("question_id, answer")
        .eq("quiz_attempt_id", attempt.id);

      if (answersError) throw answersError;

      // 4. Map trait scores
      const traitScores: Record<string, number> = {};
      const dataToCanonicalTrait: Record<string, string> = {
        patientInteraction: "patientInteraction",
        proceduralInterest: "proceduralInterest",
        diagnosticThinking: "diagnosticReasoning",
        fastPacedPreference: "fastPacedPreference",
        workLifeBalancePriority: "workLifePriority",
        emotionalResilience: "emotionalResilience",
        teamwork: "teamCollaboration",
        precisionOrientation: "precisionOrientation",
        longTermRelationships: "longTermRelationships",
        researchInterest: "researchCuriosity",
        leadershipPreference: "leadershipPreference",
        longTrainingTolerance: "trainingTolerance",
        emergencyComfort: "emergencyComfort",
        communicationEmpathy: "communicationEmpathy",
        schedulePredictability: "predictableSchedulePreference"
      };

      dbScores.forEach((row) => {
        // Multiply by 10 since DB scores are on a 1-10 scale and specialty profiles are on a 1-100 scale.
        const val = Number(row.score) * 10;
        traitScores[row.trait_id] = val;
        const canonicalKey = dataToCanonicalTrait[row.trait_id] ?? row.trait_id;
        traitScores[canonicalKey] = val;
      });

      // 5. Match specialties
      const matchScores = matchSpecialties(traitScores, 5);
      const matches = matchScores.map((ms) => {
        const id = slugify(ms.specialty);
        const profile = specialtiesById[id];
        return {
          specialtyId: id,
          specialtyName: ms.specialty,
          matchPercentage: Math.round(ms.score * 100),
          description: profile?.description ?? "Specialty profile match for your diagnostic traits.",
          category: profile?.category ?? "medical"
        };
      });

      // 6. Map answers with prompt questions
      const answers = dbAnswers.map((ans) => {
        const question = assessmentQuestions.find((q) => q.id === ans.question_id);
        return {
          questionId: ans.question_id,
          questionPrompt: question?.prompt ?? `Question ${ans.question_id}`,
          answer: ans.answer
        };
      });

      return (
        <div className="space-y-4 sm:space-y-6">
          <div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.26em] text-secondary">Results</p>
            <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">Your MedMatch Ghana profile</h1>
          </div>
          <UserResultsClient
            userId={parsedId.data}
            audience={attempt.audience}
            traitScores={traitScores}
            answers={answers}
            matches={matches}
          />
        </div>
      );
    } catch (err: any) {
      console.error("Supabase load failed:", err);
      return (
        <div className="space-y-4 sm:space-y-6">
          <div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.26em] text-secondary">Results</p>
            <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">Your MedMatch Ghana profile</h1>
          </div>
          <Card className="min-h-[260px] border-red-500/20 bg-red-50/5">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-300">Failed to load results</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/75">
              An error occurred while fetching your data from Supabase. Please check your connection and try again.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/results?demo=true">
                <Button>View Sample Results</Button>
              </Link>
            </div>
          </Card>
        </div>
      );
    }
  }

  // Fallback to normal local storage/demo quiz result mode
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.26em] text-secondary">Results</p>
        <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">Your MedMatch Ghana profile</h1>
      </div>
      <ResultsClient showDemo={params.demo === "true"} />
    </div>
  );
}
