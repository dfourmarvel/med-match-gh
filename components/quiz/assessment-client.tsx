"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BrainCircuit, CheckCircle2, Save, Share2, Stethoscope } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { assessmentQuestions } from "@/lib/assessment";
import { Audience } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { KenteStrip } from "@/components/ui/kente-strip";

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

  const submit = () => {
    setErrorMessage("");
    startTransition(async () => {
      try {
        const response = await fetch("/api/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audience, answers: answerRecord })
        });

        const scored = await response.json().catch(() => null);
        if (!response.ok || !scored?.success) {
          setErrorMessage(scored?.error?.message ?? "Could not score your assessment. Please check your answers and try again.");
          return;
        }

        const result = scored.data;
        const saveResponse = await fetch("/api/quiz-results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, result })
        });
        const saved = await saveResponse.json().catch(() => null);

        localStorage.setItem("medmatch-last-result", JSON.stringify(result));
        if (saveResponse.ok && saved?.success && saved.data?.id) {
          localStorage.setItem("medmatch-last-result-id", saved.data.id);
          localStorage.removeItem("medmatch-save-warning");
        } else {
          localStorage.removeItem("medmatch-last-result-id");
          localStorage.setItem(
            "medmatch-save-warning",
            saved?.error?.message
              ? `Result shown locally, but Supabase save failed: ${saved.error.message}`
              : "Result shown locally, but Supabase save failed."
          );
        }
        router.push("/results");
      } catch {
        setErrorMessage("Could not submit your assessment. Check your connection and try again.");
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]" role="region" aria-label="Specialty fit assessment">
      {/* Sidebar panel — fixed deep-green so it stays rich in both themes */}
      <Card className="relative overflow-hidden border-transparent bg-[#12291f] p-0 text-[#f6f0e2]" role="complementary" aria-label="Assessment overview">
        <KenteStrip />
        <div className="pattern-weave p-5 sm:p-6 md:p-7">
          <div className="flex items-center gap-3 text-amber-400">
            <BrainCircuit className="h-5 w-5" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em]">Clinical fit profile</p>
          </div>

          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-balance">
            Map how you think, work, and recover.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#f6f0e2]/70">
            A guided specialty assessment across clinical interests, decision style, patient interaction, training tolerance, and lifestyle priorities.
          </p>

          <div className="mt-7 grid grid-cols-3 gap-2 text-center" role="group" aria-label="Assessment statistics">
            {[
              ["25", "signals"],
              [answeredCount.toString(), "answered"],
              [`${progress}%`, "complete"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[0.06] p-3">
                <p className="font-display text-xl font-semibold text-amber-300" aria-label={`${value} ${label}`}>{value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#f6f0e2]/45" aria-hidden="true">{label}</p>
              </div>
            ))}
          </div>

          <fieldset className="mt-7 grid gap-3" aria-label="Select your education stage">
            <legend className="sr-only">What is your education stage?</legend>
            {audienceOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={audience === option.value}
                onClick={() => setAudience(option.value)}
                className={`rounded-xl border p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#12291f] ${
                  audience === option.value
                    ? "border-amber-400/80 bg-amber-400/10 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.18)]"
                    : "border-white/10 bg-white/[0.045] hover:border-white/25 hover:bg-white/[0.08]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold">{option.label}</p>
                  {audience === option.value ? <CheckCircle2 className="h-4 w-4 text-amber-300" aria-hidden="true" /> : null}
                </div>
                <p className="mt-1 text-sm text-[#f6f0e2]/65">{option.description}</p>
              </button>
            ))}
          </fieldset>

          <div className="mt-7 rounded-xl border border-white/10 bg-white/[0.055] p-4 text-sm leading-6 text-[#f6f0e2]/72" role="note">
            Educational career guidance only. Use results to choose better shadowing questions, not as a final specialty decision.
          </div>
        </div>
      </Card>

      {/* Main question panel */}
      <Card className="overflow-hidden p-0" role="region" aria-label="Assessment questions">
        <div className="border-b border-border/55 bg-muted/50 px-5 py-4 sm:px-8">
          <div className="mb-3 flex items-center justify-between gap-4 text-sm text-foreground/60">
            <span className="font-semibold text-foreground">{isAudienceStep ? "Start profile" : stageLabel}</span>
            <span aria-live="polite">{isAudienceStep ? "Education stage" : `Question ${questionNumber} of ${assessmentQuestions.length}`}</span>
          </div>
          <Progress value={progress} label={`Assessment progress: ${progress} percent complete`} />
          <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Stage milestones">
            {[33, 66, 100].map((milestone) => (
              <div
                key={milestone}
                className={`h-1 rounded-full transition-colors duration-500 ${progress >= milestone ? "bg-accent" : "bg-border/70"}`}
                role="presentation"
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isAudienceStep ? (
            <motion.div
              key="audience"
              initial={{ opacity: 0, x: 26 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -26 }}
              transition={{ duration: 0.32, ease: [0.21, 0.6, 0.35, 1] }}
              className="flex min-h-[470px] flex-col justify-center px-5 py-8 sm:px-8 sm:py-10"
            >
              <div className="mb-6 w-fit rounded-xl bg-accent/12 p-4 text-accent" aria-hidden="true">
                <Stethoscope className="h-8 w-8" />
              </div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Step 1 of {totalSteps + 1}</p>
              <h3 className="max-w-xl font-display text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                What training context should shape your report?
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/65">
                Your education stage changes how the recommendation engine frames specialty pathways, training reality, and next steps.
              </p>
            </motion.div>
          ) : currentQuestion ? (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 26 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -26 }}
              transition={{ duration: 0.32, ease: [0.21, 0.6, 0.35, 1] }}
              className="px-5 py-7 sm:px-8 sm:py-9"
            >
              <fieldset>
                <legend className="sr-only">{currentQuestion.prompt}</legend>
                <p className="mb-5 text-sm font-medium text-foreground/58" id={`hint-q${currentQuestion.id}`}>
                  Answer honestly; there are no right choices.
                </p>
                <h3 className="max-w-3xl font-display text-3xl font-semibold leading-tight text-balance sm:text-4xl" aria-describedby={`hint-q${currentQuestion.id}`}>
                  {currentQuestion.prompt}
                </h3>
                <div className="mt-8 grid gap-3" role="radiogroup" aria-label={`Options for: ${currentQuestion.prompt}`}>
                  {activeOptions.map((option) => (
                    <motion.button
                      key={`${currentQuestion.id}-${option.value}`}
                      type="button"
                      role="radio"
                      aria-checked={selectedValue === option.value}
                      aria-label={`${option.label}, option ${option.value}`}
                      onClick={() => recordAnswer(currentQuestion.id, option.value)}
                      whileTap={{ scale: 0.985 }}
                      className={`group rounded-xl border-2 p-4 text-left transition-all duration-200 sm:p-5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        selectedValue === option.value
                          ? "border-accent bg-accent/10 shadow-card"
                          : "border-border/60 bg-card/70 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-3 font-medium">
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-lg border text-xs font-semibold transition-colors duration-200 ${
                              selectedValue === option.value
                                ? "border-accent bg-accent text-accent-foreground"
                                : "border-border text-foreground/45 group-hover:border-accent/50"
                            }`}
                            aria-hidden="true"
                          >
                            {option.value}
                          </span>
                          {option.label}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent" aria-hidden="true">
                          {selectedValue === option.value ? "Selected" : ""}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </fieldset>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/55 bg-muted/30 px-5 py-5 sm:px-8" role="toolbar" aria-label="Assessment navigation">
          <Button variant="outline" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0} aria-label="Go to previous question">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back
          </Button>
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" type="button" aria-label="Guest mode is enabled">
              <Save className="mr-2 h-4 w-4" aria-hidden="true" />
              Guest Mode On
            </Button>
            <Button variant="ghost" type="button" disabled title="Create a share link from the results page." aria-label="Share from results — available after completing assessment">
              <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
              Share From Results
            </Button>
            {step < totalSteps ? (
              <Button variant="gold" onClick={() => canAdvance && setStep((value) => value + 1)} disabled={!canAdvance} aria-label="Go to next question">
                Next
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button variant="gold" onClick={submit} disabled={!canAdvance || isPending} aria-label={isPending ? "Scoring your assessment" : "Submit and see results"}>
                {isPending ? "Scoring..." : "See Results"}
              </Button>
            )}
          </div>
        </div>

        {errorMessage ? (
          <div
            className="mx-5 mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100 sm:mx-8"
            role="alert"
            aria-live="assertive"
          >
            {errorMessage}
          </div>
        ) : null}
      </Card>
    </div>
  );
}
