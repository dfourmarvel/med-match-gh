"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BrainCircuit, Save, Share2 } from "lucide-react";
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
  const [current, setCurrent] = useState(0);
  const [audience, setAudience] = useState<Audience>("medical-student");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isPending, startTransition] = useTransition();
  const totalSteps = assessmentQuestions.length;
  const question = assessmentQuestions[current];
  const progress = Math.round(((current + 1) / totalSteps) * 100);

  const activeOptions = useMemo(
    () =>
      question.options ?? [
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
        { label: "5", value: 5 }
      ],
    [question]
  );

  const canAdvance = answers[question.id] !== undefined;

  const submit = () => {
    startTransition(async () => {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audience, answers })
      });
      const data = await response.json();
      localStorage.setItem("medmatch-last-result", JSON.stringify(data));
      router.push("/results");
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.25fr]">
      <Card className="bg-slate-950 text-white">
        <div className="flex items-center gap-3 text-emerald-300">
          <BrainCircuit className="h-5 w-5" />
          <p className="text-sm font-semibold uppercase tracking-[0.22em]">Assessment Setup</p>
        </div>
        <h2 className="mt-4 text-3xl font-semibold">Find your best-fit clinical path</h2>
        <p className="mt-4 text-sm leading-7 text-white/70">
          This 25-question assessment blends personality, stress style, procedural preference, and lifestyle priorities to estimate fit across medical and dental specialties relevant to Ghana.
        </p>
        <div className="mt-8 grid gap-3">
          {audienceOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setAudience(option.value)}
              className={`rounded-2xl border p-4 text-left transition ${
                audience === option.value
                  ? "border-emerald-400 bg-emerald-400/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <p className="font-semibold">{option.label}</p>
              <p className="mt-1 text-sm text-white/65">{option.description}</p>
            </button>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
          Educational disclaimer: This tool is designed for educational and career exploration purposes only and should not replace professional academic or career counseling.
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between text-sm text-foreground/60">
            <span>Question {current + 1} of 25</span>
            <span>{progress}% complete</span>
          </div>
          <Progress value={progress} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 22 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -22 }}
            transition={{ duration: 0.28 }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-300">
              {question.type}
            </p>
            <h3 className="text-2xl font-semibold leading-tight sm:text-3xl">{question.prompt}</h3>
            <div className="mt-8 grid gap-3">
              {activeOptions.map((option) => (
                <button
                  key={`${question.id}-${option.value}`}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option.value }))}
                  className={`rounded-2xl border p-4 text-left transition ${
                    answers[question.id] === option.value
                      ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                      : "border-border/60 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-foreground/45">Value {option.value}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <Button variant="outline" onClick={() => setCurrent((value) => Math.max(0, value - 1))} disabled={current === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" type="button">
              <Save className="mr-2 h-4 w-4" />
              Guest Mode
            </Button>
            <Button variant="ghost" type="button">
              <Share2 className="mr-2 h-4 w-4" />
              Share Later
            </Button>
            {current < totalSteps - 1 ? (
              <Button onClick={() => canAdvance && setCurrent((value) => value + 1)} disabled={!canAdvance}>
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
      </Card>
    </div>
  );
}
