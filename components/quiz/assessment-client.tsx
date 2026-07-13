"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BrainCircuit, CheckCircle2, Save, Share2, Stethoscope, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
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

const IN_PROGRESS_KEY = "medmatch-in-progress";

const audienceOptions: { label: string; value: Audience; description: string }[] = [
  { label: "Medical student", value: "medical-student", description: "Clinical-stage or preclinical medical learners." },
  { label: "High school student", value: "high-school", description: "Students exploring whether medicine fits." },
  { label: "Dental student", value: "dental-student", description: "Dental trainees exploring generalist or specialist routes." }
];

const isValidAudience = (value: unknown): value is Audience =>
  audienceOptions.some((option) => option.value === value);

export function AssessmentClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [audience, setAudience] = useState<Audience>("medical-student");
  const [answers, setAnswers] = useState<StoredAnswer[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showResumeNote, setShowResumeNote] = useState(false);
  const [showReview, setShowReview] = useState(false);
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

  // ── UX-1: restore in-progress state on mount, persist it on change ──────────
  const skipNextPersist = useRef(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(IN_PROGRESS_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { step?: unknown; audience?: unknown; answers?: unknown };

      const savedStep = Number(saved.step);
      const validStep = Number.isInteger(savedStep) && savedStep >= 0 && savedStep <= totalSteps;
      const validAnswers = Array.isArray(saved.answers)
        ? (saved.answers as unknown[]).filter(
            (answer): answer is StoredAnswer =>
              typeof answer === "object" &&
              answer !== null &&
              typeof (answer as StoredAnswer).questionId === "string" &&
              typeof (answer as StoredAnswer).selectedOption === "string"
          )
        : [];

      if (isValidAudience(saved.audience)) setAudience(saved.audience);
      if (validAnswers.length > 0) setAnswers(validAnswers);
      if (validStep) setStep(savedStep);

      if ((validStep && savedStep > 0) || validAnswers.length > 0) {
        setShowResumeNote(true);
      }
    } catch {
      // Malformed JSON — discard it and start fresh.
      try {
        localStorage.removeItem(IN_PROGRESS_KEY);
      } catch {
        /* ignore */
      }
    }
    // Restore runs once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Skip the first invocation (initial mount) so we don't overwrite saved
    // progress before the restore effect has read it.
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    try {
      localStorage.setItem(IN_PROGRESS_KEY, JSON.stringify({ step, audience, answers }));
    } catch {
      /* storage unavailable — non-fatal */
    }
  }, [step, audience, answers]);

  // ── A11Y-2: move focus to the question heading after each step change ───────
  const shouldFocusHeading = useRef(false);
  const focusHeadingRef = useCallback((node: HTMLHeadingElement | null) => {
    // Callback ref fires when the entering step's heading mounts (after the
    // exit animation completes under AnimatePresence mode="wait"), so we focus
    // it without racing the transition or using a timeout.
    if (node && shouldFocusHeading.current) {
      node.focus();
      shouldFocusHeading.current = false;
    }
  }, []);

  const goToStep = (updater: (value: number) => number) => {
    shouldFocusHeading.current = true;
    setStep(updater);
  };
  const goNext = () => {
    if (canAdvance) goToStep((value) => Math.min(totalSteps, value + 1));
  };
  const goBack = () => goToStep((value) => Math.max(0, value - 1));

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

  // ── A11Y-1: roving-tabindex keyboard support for the two radio groups ───────
  const audienceRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const audienceIndex = audienceOptions.findIndex((option) => option.value === audience);
  const audienceRovingIndex = audienceIndex >= 0 ? audienceIndex : 0;
  const selectedOptionIndex = activeOptions.findIndex((option) => option.value === selectedValue);
  const optionRovingIndex = selectedOptionIndex >= 0 ? selectedOptionIndex : 0;

  const handleAudienceKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = audienceOptions.length;
    let nextIndex = index;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        nextIndex = (index + 1) % count;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        nextIndex = (index - 1 + count) % count;
        break;
      case " ":
      case "Enter":
        event.preventDefault();
        setAudience(audienceOptions[index].value);
        return;
      default:
        return;
    }
    event.preventDefault();
    setAudience(audienceOptions[nextIndex].value);
    audienceRefs.current[nextIndex]?.focus();
  };

  const handleOptionKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!currentQuestion) return;
    const count = activeOptions.length;
    let nextIndex = index;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        nextIndex = (index + 1) % count;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        nextIndex = (index - 1 + count) % count;
        break;
      case " ":
      case "Enter":
        event.preventDefault();
        recordAnswer(currentQuestion.id, activeOptions[index].value);
        return;
      default: {
        // Number-key shortcut (1–9): jump straight to that option.
        if (/^[1-9]$/.test(event.key)) {
          const numericIndex = activeOptions.findIndex((option) => option.value === Number(event.key));
          if (numericIndex >= 0) {
            event.preventDefault();
            recordAnswer(currentQuestion.id, activeOptions[numericIndex].value);
            optionRefs.current[numericIndex]?.focus();
          }
        }
        return;
      }
    }
    // Arrow keys move focus AND selection together (standard radio behavior).
    event.preventDefault();
    recordAnswer(currentQuestion.id, activeOptions[nextIndex].value);
    optionRefs.current[nextIndex]?.focus();
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
        // UX-1: the assessment is complete — clear the saved in-progress state.
        try {
          localStorage.removeItem(IN_PROGRESS_KEY);
        } catch {
          /* ignore */
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

          <fieldset
            className="mt-7 grid gap-3"
            role="radiogroup"
            aria-label="Select your education stage"
          >
            <legend className="sr-only">What is your education stage?</legend>
            {audienceOptions.map((option, index) => (
              <button
                key={option.value}
                ref={(element) => {
                  audienceRefs.current[index] = element;
                }}
                type="button"
                role="radio"
                aria-checked={audience === option.value}
                tabIndex={index === audienceRovingIndex ? 0 : -1}
                onClick={() => setAudience(option.value)}
                onKeyDown={(event) => handleAudienceKeyDown(event, index)}
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

        {showResumeNote ? (
          <div
            className="mx-5 mt-5 flex items-center justify-between gap-3 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-foreground/80 sm:mx-8"
            role="status"
            aria-live="polite"
          >
            <span>Resumed your saved progress. You can keep going where you left off.</span>
            <button
              type="button"
              onClick={() => setShowResumeNote(false)}
              className="rounded-md p-1 text-foreground/60 transition-colors hover:bg-accent/15 hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Dismiss resumed progress notice"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : null}

        {showReview ? (
          <div className="px-5 py-7 sm:px-8 sm:py-9" role="region" aria-label="Review your answers">
            <h3 tabIndex={-1} className="font-display text-2xl font-semibold leading-tight outline-none sm:text-3xl">
              Review your answers
            </h3>
            <p className="mt-2 text-sm leading-7 text-foreground/60">
              Check your responses below. Select any question to jump back and change it.
            </p>
            <ul className="mt-6 space-y-3" role="list">
              {assessmentQuestions.map((question, index) => {
                const value = answerRecord[question.id];
                return (
                  <li
                    key={question.id}
                    className="flex items-start justify-between gap-4 rounded-xl border border-border/50 bg-card/60 p-4"
                    role="listitem"
                  >
                    <div>
                      <p className="text-xs font-semibold text-foreground/45">Question {index + 1}</p>
                      <p className="mt-1 text-sm font-medium">{question.prompt}</p>
                      <p className="mt-1 text-sm text-foreground/60">
                        {value !== undefined ? `Answer: ${value} / 5` : "Not answered yet"}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowReview(false);
                        goToStep(() => index + 1);
                      }}
                      aria-label={`Edit question ${index + 1}`}
                    >
                      Edit
                    </Button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <Button variant="outline" onClick={() => setShowReview(false)} aria-label="Back to questions">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Back to questions
              </Button>
              <Button
                variant="gold"
                onClick={submit}
                disabled={answeredCount < totalSteps || isPending}
                aria-label={isPending ? "Scoring your assessment" : "See results"}
              >
                {isPending ? "Scoring..." : "See Results"}
              </Button>
            </div>
          </div>
        ) : (
          <>
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
              <h3
                ref={focusHeadingRef}
                tabIndex={-1}
                className="max-w-xl font-display text-3xl font-semibold leading-tight text-balance outline-none sm:text-4xl"
              >
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
                <h3
                  ref={focusHeadingRef}
                  tabIndex={-1}
                  className="max-w-3xl font-display text-3xl font-semibold leading-tight text-balance outline-none sm:text-4xl"
                  aria-describedby={`hint-q${currentQuestion.id}`}
                >
                  {currentQuestion.prompt}
                </h3>
                <div className="mt-8 grid gap-3" role="radiogroup" aria-label={`Options for: ${currentQuestion.prompt}`}>
                  {activeOptions.map((option, index) => (
                    <motion.button
                      key={`${currentQuestion.id}-${option.value}`}
                      ref={(element) => {
                        optionRefs.current[index] = element;
                      }}
                      type="button"
                      role="radio"
                      aria-checked={selectedValue === option.value}
                      aria-label={`${option.label}, option ${option.value}`}
                      tabIndex={index === optionRovingIndex ? 0 : -1}
                      onClick={() => recordAnswer(currentQuestion.id, option.value)}
                      onKeyDown={(event) => handleOptionKeyDown(event, index)}
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
          <Button variant="outline" onClick={goBack} disabled={step === 0} aria-label="Go to previous question">
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
              <Button variant="gold" onClick={goNext} disabled={!canAdvance} aria-label="Go to next question">
                Next
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button variant="gold" onClick={() => setShowReview(true)} disabled={!canAdvance} aria-label="Review your answers before submitting">
                Review answers
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
          </>
        )}

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
