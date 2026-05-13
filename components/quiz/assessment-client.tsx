"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  Save,
  Share2,
  Stethoscope
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { assessmentQuestions } from "@/lib/assessment";
import { Audience } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const audienceOptions: { label: string; value: Audience; description: string }[] = [
  { label: "Medical student", value: "medical-student", description: "Clinical-stage or preclinical medical learners." },
  { label: "High school student", value: "high-school", description: "Students exploring whether medicine fits." },
  { label: "Dental student", value: "dental-student", description: "Dental trainees exploring generalist or specialist routes." }
];

export function AssessmentClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [audience, setAudience] = useState<Audience>("medical-student");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const totalSteps = assessmentQuestions.length;
  const isAudienceStep = step === 0;
  const currentQuestion = !isAudienceStep ? assessmentQuestions[step - 1] : null;
  const questionNumber = step;
  const progress = Math.round((step / totalSteps) * 100);
  const answeredCount = Object.keys(answers).length;
  const stageLabel =
    questionNumber < 9 ? "Interests and energy" : questionNumber < 18 ? "Clinical style" : "Lifestyle and training fit";

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

  const canAdvance = isAudienceStep || (currentQuestion && answers[currentQuestion.id] !== undefined);

  const submit = () => {
    setErrorMessage("");
    startTransition(async () => {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audience, answers })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setErrorMessage(data?.error ?? "Could not score your assessment. Please check your answers and try again.");
        return;
      }

      const data = await response.json();
      localStorage.setItem("medmatch-last-result", JSON.stringify(data));
      router.push("/results");
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
      <Card className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-400" />
        <div className="flex items-center gap-3 text-teal-200">
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
                  ? "border-teal-300 bg-teal-300/12 shadow-[inset_0_0_0_1px_rgba(94,234,212,0.12)]"
                  : "border-white/10 bg-white/[0.045] hover:border-white/24 hover:bg-white/[0.075]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">{option.label}</p>
                {audience === option.value ? <CheckCircle2 className="h-4 w-4 text-teal-200" /> : null}
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
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  <ClipboardList className="h-3.5 w-3.5" />
                  {currentQuestion.type}
                </span>
                <span className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-foreground/58 dark:bg-white/6">
                  Answer honestly; there are no right choices.
                </span>
              </div>
              <h3 className="max-w-3xl text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                {currentQuestion.prompt}
              </h3>
              <div className="mt-8 grid gap-3">
                {activeOptions.map((option) => (
                  <button
                    key={`${currentQuestion.id}-${option.value}`}
                    type="button"
                    aria-pressed={answers[currentQuestion.id] === option.value}
                    onClick={() => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option.value }))}
                    className={`group rounded-lg border p-4 text-left transition duration-200 sm:p-5 ${
                      answers[currentQuestion.id] === option.value
                        ? "border-primary/70 bg-primary/8 shadow-[0_18px_42px_-32px_hsl(var(--primary))]"
                        : "border-border/60 bg-card/70 hover:border-primary/35 hover:bg-primary/4"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-3 font-medium">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-md border text-xs ${
                            answers[currentQuestion.id] === option.value
                              ? "border-primary bg-primary text-white"
                              : "border-border text-foreground/45 group-hover:border-primary/40"
                          }`}
                        >
                          {option.value}
                        </span>
                        {option.label}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        {answers[currentQuestion.id] === option.value ? "Selected" : ""}
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
            {step < totalSteps - 1 ? (
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
