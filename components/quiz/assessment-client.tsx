"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BrainCircuit, CheckCircle2, Save, Share2, Stethoscope } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { assessmentQuestions } from "@/lib/assessment";
import { supabase } from "@/lib/supabase";
import { specialtiesById } from "@/lib/specialties";
import { Audience, FullAssessmentResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type StoredAnswer = {
  questionId: string;
  selectedOption: string;
};

const audienceOptions: { label: string; value: Audience; description: string }[] = [
  { label: "Medical student", value: "medical-student", description: "Clinical-stage or preclinical medical learners." },
  { label: "High school student", value: "high-school", description: "Students exploring whether medicine fits." },
  { label: "Dental student", value: "dental-student", description: "Dental trainees exploring generalist or specialist routes." }
];

export function AssessmentClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [audience, setAudience] = useState<Audience>("medical-student");
  const [answers, setAnswers] = useState<StoredAnswer[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const totalSteps = assessmentQuestions.length;
  const isAudienceStep = step === 0;
  const currentQuestion = !isAudienceStep ? assessmentQuestions[step - 1] : null;
  const questionNumber = step;
  const progress = Math.round((step / totalSteps) * 100);
  const answeredCount = answers.length;
  const stageLabel =
    questionNumber < 9 ? "Interests and energy" : questionNumber < 18 ? "Clinical style" : "Lifestyle and training fit";
  const answerRecord = useMemo(
    () =>
      Object.fromEntries(
        answers.map((answer) => [
          Number(answer.questionId.replace("q", "")),
          Number(answer.selectedOption)
        ])
      ) as Record<number, number>,
    [answers]
  );
  const selectedValue = currentQuestion ? answerRecord[currentQuestion.id] : undefined;

  const activeOptions = useMemo(
    () =>
      currentQuestion?.options ?? [
        { label: "Strongly disagree", value: 1 },
        { label: "Disagree", value: 2 },
        { label: "Neutral", value: 3 },
        { label: "Agree", value: 4 },
        { label: "Strongly agree", value: 5 }
      ],
    [currentQuestion]
  );

  const canAdvance = isAudienceStep || Boolean(currentQuestion && selectedValue !== undefined);

  const recordAnswer = (questionId: number, selectedOption: number) => {
    const nextAnswer = { questionId: `q${questionId}`, selectedOption: String(selectedOption) };

    setAnswers((previous) => {
      const existingAnswer = previous.some((answer) => answer.questionId === nextAnswer.questionId);
      if (!existingAnswer) return [...previous, nextAnswer];

      return previous.map((answer) =>
        answer.questionId === nextAnswer.questionId ? nextAnswer : answer
      );
    });
  };

  const saveQuizResult = async (result: FullAssessmentResult) => {
    if (!supabase) {
      return "Result shown locally. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to save quiz rows in Supabase.";
    }

    const topMatch = result.topMatches[0];
    const topSpecialty = topMatch ? specialtiesById[topMatch.specialtyId] : null;
    const specialtyScores = Object.fromEntries(
      result.topMatches.map((match) => [
        specialtiesById[match.specialtyId]?.name ?? match.specialtyId,
        match.matchPercentage
      ])
    );

    const { error } = await supabase.from("quiz_results").insert([
      {
        answers,
        scores: {
          audience,
          traitScores: result.traitScores,
          specialtyScores
        },
        top_specialty: topSpecialty?.name ?? topMatch?.specialtyId ?? "Unknown"
      }
    ]);

    return error ? `Result shown locally, but Supabase save failed: ${error.message}` : "";
  };

  const submit = () => {
    setErrorMessage("");
    startTransition(async () => {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audience, answers: answerRecord })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setErrorMessage(data?.error ?? "Could not score your assessment. Please check your answers and try again.");
        return;
      }

      const data = await response.json();
      const saveWarning = await saveQuizResult(data);
      localStorage.setItem("medmatch-last-result", JSON.stringify(data));
      if (saveWarning) {
        localStorage.setItem("medmatch-save-warning", saveWarning);
      } else {
        localStorage.removeItem("medmatch-save-warning");
      }
      router.push("/results");
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
      <Card className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400" />
        <div className="flex items-center gap-3 text-cyan-200">
          <BrainCircuit className="h-5 w-5" />
          <p className="text-xs font-semibold uppercase tracking-[0.22em]">Clinical fit profile</p>
        </div>

        <h2 className="mt-5 text-3xl font-semibold leading-tight text-balance">Map how you think, work, and recover.</h2>
        <p className="mt-4 text-sm leading-7 text-white/68">
          A guided specialty assessment across clinical interests, decision style, patient interaction, training tolerance, and lifestyle priorities.
        </p>

        <div className="mt-7 grid grid-cols-3 gap-2 text-center">
          {[
            ["25", "signals"],
            [answeredCount.toString(), "answered"],
            [`${progress}%`, "complete"]
          ].map(([value, label]) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
              <p className="text-xl font-semibold text-white">{value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/42">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-7 grid gap-3">
          {audienceOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={audience === option.value}
              onClick={() => setAudience(option.value)}
              className={`rounded-lg border p-4 text-left transition duration-200 ${
                audience === option.value
                  ? "border-cyan-300 bg-cyan-300/12 shadow-[inset_0_0_0_1px_rgba(94,234,212,0.12)]"
                  : "border-white/10 bg-white/[0.045] hover:border-white/24 hover:bg-white/[0.075]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">{option.label}</p>
                {audience === option.value ? <CheckCircle2 className="h-4 w-4 text-cyan-200" /> : null}
              </div>
              <p className="mt-1 text-sm text-white/65">{option.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-7 rounded-lg border border-white/10 bg-white/[0.055] p-4 text-sm leading-6 text-white/72">
          Educational career guidance only. Use results to choose better shadowing questions, not as a final specialty decision.
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border/55 bg-muted/45 px-5 py-4 sm:px-8">
          <div className="mb-3 flex items-center justify-between gap-4 text-sm text-foreground/60">
            <span className="font-medium text-foreground">{isAudienceStep ? "Start profile" : stageLabel}</span>
            <span>{isAudienceStep ? "Education stage" : `Question ${questionNumber} of ${assessmentQuestions.length}`}</span>
          </div>
          <Progress value={progress} />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[33, 66, 100].map((milestone) => (
              <div
                key={milestone}
                className={`h-1 rounded-full transition ${progress >= milestone ? "bg-primary" : "bg-border/70"}`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isAudienceStep ? (
            <motion.div
              key="audience"
              initial={{ opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -22 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="flex min-h-[470px] flex-col justify-center px-5 py-8 sm:px-8 sm:py-10"
            >
              <div className="mb-6 w-fit rounded-lg bg-primary/10 p-4 text-primary">
                <Stethoscope className="h-8 w-8" />
              </div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Step 1 of {totalSteps + 1}</p>
              <h3 className="max-w-xl text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                What training context should shape your report?
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/62">
                Your education stage changes how the recommendation engine frames specialty pathways, training reality, and next steps.
              </p>
            </motion.div>
          ) : currentQuestion ? (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -22 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="px-5 py-7 sm:px-8 sm:py-9"
            >
              <p className="mb-5 text-sm font-medium text-foreground/58">
                Answer honestly; there are no right choices.
              </p>
              <h3 className="max-w-3xl text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                {currentQuestion.prompt}
              </h3>
              <div className="mt-8 grid gap-3">
                {activeOptions.map((option) => (
                  <button
                    key={`${currentQuestion.id}-${option.value}`}
                    type="button"
                    aria-pressed={selectedValue === option.value}
                    onClick={() => recordAnswer(currentQuestion.id, option.value)}
                    className={`group rounded-lg border p-4 text-left transition duration-200 sm:p-5 ${
                      selectedValue === option.value
                        ? "border-primary/70 bg-primary/8 shadow-[0_18px_42px_-32px_hsl(var(--primary))]"
                        : "border-border/60 bg-card/70 hover:border-primary/35 hover:bg-primary/4"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-3 font-medium">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-md border text-xs ${
                            selectedValue === option.value
                              ? "border-primary bg-primary text-white"
                              : "border-border text-foreground/45 group-hover:border-primary/40"
                          }`}
                        >
                          {option.value}
                        </span>
                        {option.label}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        {selectedValue === option.value ? "Selected" : ""}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/55 bg-muted/25 px-5 py-5 sm:px-8">
          <Button variant="outline" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" type="button">
              <Save className="mr-2 h-4 w-4" />
              Guest Mode On
            </Button>
            <Button variant="ghost" type="button" disabled title="Create a share link from the results page.">
              <Share2 className="mr-2 h-4 w-4" />
              Share From Results
            </Button>
            {step < totalSteps ? (
              <Button onClick={() => canAdvance && setStep((value) => value + 1)} disabled={!canAdvance}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={submit} disabled={!canAdvance || isPending}>
                {isPending ? "Scoring..." : "See Results"}
              </Button>
            )}
          </div>
        </div>

        {errorMessage ? (
          <div className="mx-5 mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100 sm:mx-8">
            {errorMessage}
          </div>
        ) : null}
      </Card>
    </div>
  );
}
