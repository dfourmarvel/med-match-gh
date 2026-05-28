"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Award,
  Brain,
  Clock3,
  Download,
  LoaderCircle,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Wallet
} from "lucide-react";
import { fullAssessmentResultSchema } from "@/lib/api-validation";
import { FullAssessmentResult } from "@/lib/types";
import { specialtiesById, specialties } from "@/lib/specialties";
import { TraitRadarChart } from "@/components/results/radar-chart";
import { MatchesBarChart } from "@/components/results/bar-chart";
import { CompareTable } from "@/components/results/compare-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SpecialtyCard } from "@/components/specialties/specialty-card";

const demoResult = {
  audience: "medical-student",
  traitScores: {
    patientInteraction: 82,
    proceduralInterest: 58,
    diagnosticReasoning: 84,
    fastPacedPreference: 60,
    workLifePriority: 63,
    emotionalResilience: 78,
    teamCollaboration: 74,
    precisionOrientation: 79,
    longTermRelationships: 80,
    researchCuriosity: 72,
    leadershipPreference: 66,
    trainingTolerance: 74,
    emergencyComfort: 57,
    communicationEmpathy: 88,
    predictableSchedulePreference: 58
  },
  topMatches: [
    { specialtyId: "internal-medicine", score: 0.92, matchPercentage: 92, confidenceLevel: "Medium", strengths: ["Diagnostic Reasoning", "Patient Interaction", "Communication & Empathy"], challenges: ["Procedural Interest", "Predictable Schedule Preference"], explanationFactors: { alignedTraits: ["Diagnostic Reasoning", "Patient Interaction", "Communication & Empathy"], stretchTraits: ["Procedural Interest", "Predictable Schedule Preference"], scoreGapFromNext: 2 }, reasoning: "This is an exploratory 92% fit, not a deterministic career answer. Your strengths suggest a strong fit for broad diagnostic medicine with longitudinal patient care." },
    { specialtyId: "family-medicine", score: 0.9, matchPercentage: 90, confidenceLevel: "Medium", strengths: ["Long-Term Relationships", "Communication & Empathy", "Patient Interaction"], challenges: ["Procedural Interest", "Fast-Paced Preference"], explanationFactors: { alignedTraits: ["Long-Term Relationships", "Communication & Empathy", "Patient Interaction"], stretchTraits: ["Procedural Interest", "Fast-Paced Preference"], scoreGapFromNext: 2 }, reasoning: "This is an exploratory 90% fit, not a deterministic career answer. You appear well matched for continuity-driven, community-facing care." },
    { specialtyId: "pediatrics", score: 0.88, matchPercentage: 88, confidenceLevel: "Medium", strengths: ["Communication & Empathy", "Patient Interaction", "Team Collaboration"], challenges: ["Emergency Comfort", "Procedural Interest"], explanationFactors: { alignedTraits: ["Communication & Empathy", "Patient Interaction", "Team Collaboration"], stretchTraits: ["Emergency Comfort", "Procedural Interest"], scoreGapFromNext: 3 }, reasoning: "This is an exploratory 88% fit, not a deterministic career answer. You combine empathy with enough resilience for child and family-centered care." },
    { specialtyId: "psychiatry", score: 0.85, matchPercentage: 85, confidenceLevel: "Medium", strengths: ["Communication & Empathy", "Long-Term Relationships", "Emotional Resilience"], challenges: ["Procedural Interest", "Fast-Paced Preference"], explanationFactors: { alignedTraits: ["Communication & Empathy", "Long-Term Relationships", "Emotional Resilience"], stretchTraits: ["Procedural Interest", "Fast-Paced Preference"], scoreGapFromNext: 4 }, reasoning: "This is an exploratory 85% fit, not a deterministic career answer. You are well suited to reflective, relationship-rich mental health work." },
    { specialtyId: "cardiology", score: 0.81, matchPercentage: 81, confidenceLevel: "Low", strengths: ["Diagnostic Reasoning", "Research Curiosity", "Emotional Resilience"], challenges: ["Work-Life Balance Priority", "Predictable Schedule Preference"], explanationFactors: { alignedTraits: ["Diagnostic Reasoning", "Research Curiosity", "Emotional Resilience"], stretchTraits: ["Work-Life Balance Priority", "Predictable Schedule Preference"] }, reasoning: "This is an exploratory 81% fit, not a deterministic career answer. A strong analytical profile could support future internal medicine subspecialty ambitions." }
  ],
  confidenceLevel: "Medium",
  methodologyNote:
    "MedMatch compares your answer-derived trait profile with hand-reviewed specialty profiles. Results are exploratory and should be validated through shadowing, mentorship, rotations, and current Ghana training-body guidance.",
  personalitySummary:
    "You look like an empathic analytical clinician who balances strong reasoning with meaningful patient connection.",
  suggestedNextSteps: [
    "Shadow an internal medicine or family medicine clinic.",
    "Talk to a registrar or consultant at Korle Bu or Komfo Anokye about training realities.",
    "Compare your top 3 specialties for lifestyle, continuity, and emergency intensity.",
    "Review how your fit changes after more clinical exposure."
  ],
  generatedAt: new Date().toISOString()
} satisfies FullAssessmentResult;

function CompatibilityRing({ value }: { value: number }) {
  return (
    <div
      className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(hsl(var(--primary)) ${value * 3.6}deg, rgba(148,163,184,0.18) 0deg)`
      }}
      role="img"
      aria-label={`${value}% specialty compatibility`}
    >
      <div className="absolute inset-3 rounded-full bg-slate-950" aria-hidden="true" />
      <div className="relative text-center text-white">
        <p className="text-4xl font-semibold" aria-hidden="true">{value}%</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/45" aria-hidden="true">compatibility</p>
      </div>
    </div>
  );
}

function SignalPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/42">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white" aria-label={`${label}: ${value}`}>{value}</p>
    </div>
  );
}

export function ResultsClient({
  sharedResult,
  sharedResultId,
  showDemo = false
}: {
  sharedResult?: FullAssessmentResult | null;
  sharedResultId?: string;
  showDemo?: boolean;
}) {
  const [result, setResult] = useState<FullAssessmentResult | null>(sharedResult ?? null);
  const [isLoadingResult, setIsLoadingResult] = useState(!sharedResult && !showDemo);
  const [savedResultId, setSavedResultId] = useState(sharedResultId ?? "");
  const [aiSummary, setAiSummary] = useState<string>("");
  const [shareUrl, setShareUrl] = useState<string>("");
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (sharedResult) {
      setResult(sharedResult);
      setSavedResultId(sharedResultId ?? "");
      setIsLoadingResult(false);
      return;
    }

    if (result) {
      setIsLoadingResult(false);
      return;
    }

    const stored = localStorage.getItem("medmatch-last-result");
    if (stored) {
      try {
        const parsed = fullAssessmentResultSchema.safeParse(JSON.parse(stored));
        if (parsed.success) {
          setResult(parsed.data);
          setSavedResultId(localStorage.getItem("medmatch-last-result-id") ?? "");
          const saveWarning = localStorage.getItem("medmatch-save-warning");
          if (saveWarning) {
            setErrorMessage(saveWarning);
            localStorage.removeItem("medmatch-save-warning");
          }
          setIsLoadingResult(false);
          return;
        }
      } catch {
        // Fall through to demo result and clear the invalid local value.
      }
      localStorage.removeItem("medmatch-last-result");
      setErrorMessage("Your saved local result was outdated, so a demo report is shown instead.");
    }

    if (showDemo) {
      setResult(demoResult);
    } else {
      setResult(null);
    }
    setIsLoadingResult(false);
  }, [result, sharedResult, sharedResultId, showDemo]);

  useEffect(() => {
    if (!result) return;
    startTransition(async () => {
      const response = await fetch("/api/ai-explanation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result)
      });
      if (!response.ok) {
        setAiSummary("Personalized AI guidance is temporarily unavailable. Use the match details below as a starting point for shadowing and mentorship.");
        return;
      }
      const data = await response.json();
      setAiSummary(data.explanation);
    });
  }, [result]);

  const saveAndShare = () => {
    if (!result) return;
    startTransition(async () => {
      try {
        if (savedResultId) {
          const absoluteUrl = `${window.location.origin}/share/${savedResultId}`;
          setShareUrl(absoluteUrl);
          setSaveMessage("Sharable result ready.");
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(absoluteUrl);
          }
          return;
        }

        const response = await fetch("/api/save-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result)
        });
        const data = await response.json();
        if (!response.ok) {
          setSaveMessage(data.error ?? "Could not create a share link right now.");
          return;
        }
        const absoluteUrl = `${window.location.origin}${data.url}`;
        setSavedResultId(data.id ?? "");
        localStorage.setItem("medmatch-last-result-id", data.id ?? "");
        setShareUrl(absoluteUrl);
        setSaveMessage(data.message ?? "Sharable result created.");
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(absoluteUrl);
        }
      } catch {
        setSaveMessage("Could not create a share link right now. Check your connection and try again.");
      }
    });
  };

  const filteredSpecialties = useMemo(
    () =>
      specialties.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );
  const topMatch = result?.topMatches[0] ?? null;
  const topSpecialty = topMatch ? specialtiesById[topMatch.specialtyId] : null;

  if (isLoadingResult) {
    return (
      <Card className="flex min-h-[320px] items-center justify-center" role="status" aria-busy="true" aria-live="polite">
        <LoaderCircle className="h-8 w-8 animate-spin text-sky-500" aria-hidden="true" />
        <span className="sr-only">Loading your results…</span>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="min-h-[260px]">
        <p className="text-lg font-semibold">
          {sharedResultId ? "Shared result not found" : "No assessment result yet"}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/65">
          {sharedResultId
            ? "This share link could not be loaded. It may have been removed, or the Supabase share lookup is not configured."
            : "Take the assessment first, or open the sample report from the home page."}
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
    );
  }

  return (
    <div className="space-y-10">
      {/* Hero section: top specialty + AI guidance */}
      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]" aria-label="Top match overview">
        <Card className="relative overflow-hidden bg-slate-950 p-0 text-white">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400" aria-hidden="true" />
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Your specialty intelligence report</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-balance sm:text-5xl">
                {topSpecialty?.name ?? "Top specialty"} is your strongest current signal.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/68">{result.personalitySummary}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <SignalPill label="Confidence" value={result.confidenceLevel} />
                <SignalPill label="Top match" value={topSpecialty?.name ?? "Pending"} />
                <SignalPill label="Report date" value={new Date(result.generatedAt).toLocaleDateString()} />
              </div>
            </div>
            {topMatch ? <CompatibilityRing value={topMatch.matchPercentage} /> : null}
          </div>
          <div className="border-t border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <h3 className="sr-only">Top 5 specialty matches</h3>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5" role="list" aria-label="Top 5 matched specialties">
              {result.topMatches.map((match, index) => {
                const specialty = specialtiesById[match.specialtyId];
                return (
                  <Link
                    href={`/specialties/${specialty.id}`}
                    key={match.specialtyId}
                    className="rounded-lg border border-white/10 bg-white/[0.055] p-4 transition hover:border-cyan-200/45 hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    role="listitem"
                    aria-label={`#${index + 1} match: ${specialty.name}, ${match.matchPercentage}% compatibility, ${match.confidenceLevel} confidence`}
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/42" aria-hidden="true">#{index + 1} match</p>
                    <p className="mt-3 min-h-12 text-base font-semibold leading-snug">{specialty.name}</p>
                    <div
                      className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"
                      role="progressbar"
                      aria-valuenow={match.matchPercentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${specialty.name} match: ${match.matchPercentage}%`}
                    >
                      <div className="h-full rounded-full bg-cyan-300" style={{ width: `${match.matchPercentage}%` }} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="font-semibold text-cyan-200" aria-hidden="true">{match.matchPercentage}%</span>
                      <span className="text-xs uppercase tracking-[0.14em] text-white/42" aria-hidden="true">{match.confidenceLevel}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </Card>

        {/* AI Guidance */}
        <Card className="flex flex-col" role="region" aria-label="AI guidance">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-primary" aria-hidden="true">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">AI Guidance</h2>
              <p className="text-xs text-foreground/55">Personalized, Ghana-aware next steps</p>
            </div>
          </div>
          <div aria-live="polite" aria-busy={isPending} className="mt-5 text-sm leading-7 text-foreground/72">
            {isPending ? "Generating your personalized explanation…" : aiSummary}
          </div>
          <div className="mt-6 rounded-lg bg-primary/8 p-4 text-sm leading-6 text-foreground/72" role="note">
            {result.methodologyNote}
          </div>
          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            <Button onClick={() => window.print()} aria-label="Export results as PDF">
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={saveAndShare} aria-label="Save and share your results">
              <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
              Save
            </Button>
            <Link href="/assessment">
              <Button variant="outline">Retake</Button>
            </Link>
          </div>
          {(shareUrl || saveMessage) && (
            <div className="mt-4 rounded-lg border border-border/60 p-4 text-sm text-foreground/75" role="status" aria-live="polite">
              <p>{saveMessage}</p>
              {shareUrl ? <p className="mt-2 break-all font-medium text-primary">{shareUrl}</p> : null}
            </div>
          )}
        </Card>
      </section>

      {errorMessage ? (
        <Card className="border-amber-200 bg-amber-50 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100" role="alert" aria-live="polite">
          {errorMessage}
        </Card>
      ) : null}

      {/* Trait profile + Compatibility spread */}
      <section className="grid gap-6 lg:grid-cols-2" aria-label="Clinical analysis">
        <Card role="region" aria-label="Clinical trait profile">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-primary" aria-hidden="true">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Clinical trait profile</h2>
              <p className="text-sm text-foreground/58">How your answers map across the specialty-fit dimensions.</p>
            </div>
          </div>
          <TraitRadarChart scores={result.traitScores} />
        </Card>
        <Card role="region" aria-label="Compatibility spread">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-3 text-blue-500" aria-hidden="true">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Compatibility spread</h2>
              <p className="text-sm text-foreground/58">Close scores mean you should compare tradeoffs before committing.</p>
            </div>
          </div>
          <MatchesBarChart matches={result.topMatches} />
        </Card>
      </section>

      {/* Compare table + Why these matches */}
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]" aria-label="Detailed comparison">
        <Card role="region" aria-label="Compare your top 3 specialties">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-sky-500/10 p-3 text-sky-600 dark:text-sky-300" aria-hidden="true">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Compare your top 3</h2>
              <p className="mt-1 text-sm text-foreground/65">
                Lifestyle, training, patient interaction, and competitiveness side by side.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <CompareTable matches={result.topMatches} />
          </div>
        </Card>
        <Card role="region" aria-label="Match explanations">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-primary" aria-hidden="true">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Why these matches surfaced</h2>
              <p className="mt-1 text-sm text-foreground/58">Aligned traits and stretch areas to test in real clinical settings.</p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            {result.topMatches.slice(0, 3).map((match) => (
              <article key={match.specialtyId} className="rounded-lg border border-border/50 bg-muted/25 p-4" aria-label={`${specialtiesById[match.specialtyId].name} match explanation`}>
                <h3 className="font-semibold">{specialtiesById[match.specialtyId].name}</h3>
                <div className="mt-3 grid gap-2 text-sm text-foreground/70">
                  <p><span className="font-medium text-foreground">Aligned:</span> {match.strengths.join(", ")}</p>
                  <p><span className="font-medium text-foreground">Test next:</span> {match.challenges.join(", ")}</p>
                </div>
              </article>
            ))}
          </div>
        </Card>
      </section>

      {/* Next actions + Specialty explorer */}
      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]" aria-label="Actions and exploration">
        <Card role="region" aria-label="Next best actions">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/10 p-3 text-amber-600" aria-hidden="true">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Next best actions</h2>
              <p className="mt-1 text-sm text-foreground/58">Turn the score into real-world specialty exploration.</p>
            </div>
          </div>
          <ol className="mt-5 space-y-3" aria-label="Recommended next steps">
            {result.suggestedNextSteps.map((step, index) => (
              <li key={step} className="flex gap-3 rounded-lg bg-slate-50 p-4 text-sm text-foreground/75 dark:bg-white/5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-semibold text-white" aria-hidden="true">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Card>
        <Card role="region" aria-label="Specialty explorer">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Specialty Explorer</h2>
              <p className="mt-2 text-sm text-foreground/65">Search all included medical and dental specialties.</p>
            </div>
            <label className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/70 px-4 py-3 focus-within:ring-2 focus-within:ring-primary/70 focus-within:ring-offset-2 focus-within:ring-offset-background">
              <Search className="h-4 w-4 text-foreground/45" aria-hidden="true" />
              <span className="sr-only">Search specialties</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search specialties"
                aria-label="Search specialties"
                className="bg-transparent text-sm outline-none"
              />
            </label>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2" role="list" aria-label="Specialty cards">
            {filteredSpecialties.slice(0, 6).map((specialty) => {
              const matched = result.topMatches.find((item) => item.specialtyId === specialty.id);
              return (
                <div key={specialty.id} role="listitem">
                  <SpecialtyCard
                    specialty={specialty}
                    matchPercentage={matched?.matchPercentage}
                  />
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* Profile signals + Career activities */}
      <section className="grid gap-6 lg:grid-cols-2" aria-label="Profile signals and career building">
        <Card role="region" aria-label="Profile signals">
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 text-amber-500" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Profile signals</h2>
          </div>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3" aria-label="Earned profile badges">
            {[
              "Diagnostic Thinker",
              "Patient Connector",
              "Ghana Health Explorer"
            ].map((badge) => (
              <li key={badge} className="rounded-lg bg-amber-50 p-4 text-sm font-medium text-amber-900 dark:bg-amber-500/10 dark:text-amber-100">
                {badge}
              </li>
            ))}
          </ul>
        </Card>
        <Card role="region" aria-label="Career-building activities">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-primary" aria-hidden="true">
              <Wallet className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">Career-building activities</h2>
          </div>
          <ul className="mt-5 space-y-3" aria-label="Suggested career activities">
            {[
              "Arrange a shadowing visit at Korle Bu Teaching Hospital or Komfo Anokye Teaching Hospital.",
              "Join a clinical skills, anatomy, or oral health outreach group on campus.",
              "Keep a reflection journal comparing what energizes you in clinic, theatre, and community work.",
              "Explore student research, public health projects, or case presentations tied to your top matches."
            ].map((item) => (
              <li key={item} className="rounded-lg bg-slate-50 p-4 text-sm text-foreground/75 dark:bg-white/5">
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
