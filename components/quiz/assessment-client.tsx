"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Save, Share2 } from "lucide-react";
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
  const [step, setStep] = useState(0); // 0 = audience selection, 1-25 = questions
  const [audience, setAudience] = useState<Audience>("medical-student");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  
  const totalSteps = 26; // 1 audience + 25 questions
  const isAudienceStep = step === 0;
  const currentQuestion = !isAudienceStep ? assessmentQuestions[step - 1] : null;
  const progress = Math.round((step / totalSteps) * 100);

  const activeOptions = useMemo(
    () =>
      currentQuestion?.options ?? [
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
        { label: "5", value: 5 }
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
    <div className="mx-auto max-w-2xl">
      <Card className="overflow-hidden">
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between text-sm text-foreground/60">
            <span>{isAudienceStep ? "Education Stage" : `Question ${step} of 25`}</span>
            <span>{progress}% complete</span>
          </div>
          <Progress value={progress} />
        </div>

        <AnimatePresence mode="wait">
          {isAudienceStep ? (
            <motion.div
              key="audience"
              initial={{ opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -22 }}
              transition={{ duration: 0.28 }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-300">
                Step 1 of 26
              </p>
              <h3 className="text-2xl font-semibold leading-tight sm:text-3xl">What is your education stage?</h3>
              <p className="mt-3 text-sm text-foreground/70">
                This helps us recommend specialties relevant to your training path. Medical students will see medical specialties, dental students will see dental specialties, and high school students will see all options.
              </p>
              <div className="mt-8 grid gap-3">
                {audienceOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAudience(option.value)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      audience === option.value
                        ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                        : "border-border/60 hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{option.label}</p>
                        <p className="mt-1 text-sm text-foreground/60">{option.description}</p>
                      </div>
                      <span className="text-xs uppercase tracking-[0.2em] text-foreground/45">
                        {audience === option.value ? "Selected" : ""}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : currentQuestion ? (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -22 }}
              transition={{ duration: 0.28 }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-300">
                {currentQuestion.type}
              </p>
              <h3 className="text-2xl font-semibold leading-tight sm:text-3xl">{currentQuestion.prompt}</h3>
              <div className="mt-8 grid gap-3">
                {activeOptions.map((option) => (
                  <button
                    key={`${currentQuestion.id}-${option.value}`}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option.value }))}
                    className={`rounded-2xl border p-4 text-left transition ${
                      answers[currentQuestion.id] === option.value
                        ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                        : "border-border/60 hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs uppercase tracking-[0.2em] text-foreground/45">
                        {answers[currentQuestion.id] === option.value ? "Selected" : ""}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <Button 
            variant="outline" 
            onClick={() => setStep((value) => Math.max(0, value - 1))} 
            disabled={step === 0}
          >
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
              <Button 
                onClick={() => canAdvance && setStep((value) => value + 1)} 
                disabled={!canAdvance}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={submit} 
                disabled={!canAdvance || isPending}
              >
                {isPending ? "Scoring..." : "See Results"}
              </Button>
            )}
          </div>
        </div>
        {errorMessage ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100">
            {errorMessage}
          </div>
        ) : null}
      </Card>

      <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm text-white/70 dark:border-white/10">
        <p className="font-semibold text-white/90">📋 About this assessment</p>
        <p className="mt-2">
          This 25-question assessment blends personality, stress style, procedural preference, and lifestyle priorities to estimate fit across medical and dental specialties relevant to Ghana. Educational disclaimer: This tool is designed for educational and career exploration purposes only and should not replace professional academic or career counseling.
        </p>
      </div>
    </div>
  );
}
