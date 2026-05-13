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
      aria-label={`${value}% specialty compatibility`}
    >
      <div className="absolute inset-3 rounded-full bg-slate-950" />
      <div className="relative text-center text-white">
        <p className="text-4xl font-semibold">{value}%</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/45">compatibility</p>
      </div>
    </div>
  );
}

function SignalPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/42">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

export function ResultsClient({ sharedResult }: { sharedResult?: FullAssessmentResult | null }) {
  const [result, setResult] = useState<FullAssessmentResult | null>(sharedResult ?? null);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [shareUrl, setShareUrl] = useState<string>("");
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (result || sharedResult) return;
    const stored = localStorage.getItem("medmatch-last-result");
    if (stored) {
      try {
        const parsed = fullAssessmentResultSchema.safeParse(JSON.parse(stored));
        if (parsed.success) {
          setResult(parsed.data);
          return;
        }
      } catch {
        // Fall through to demo result and clear the invalid local value.
      }
      localStorage.removeItem("medmatch-last-result");
      setErrorMessage("Your saved local result was outdated, so a demo report is shown instead.");
    }
    setResult(demoResult);
  }, [result, sharedResult]);

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
      setShareUrl(absoluteUrl);
      setSaveMessage(data.message ?? "Sharable result created.");
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(absoluteUrl);
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

  if (!result) {
    return (
      <Card className="flex min-h-[320px] items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-emerald-500" />
      </Card>
    );
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="relative overflow-hidden bg-slate-950 p-0 text-white">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-400" />
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-200">Your specialty intelligence report</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-balance sm:text-5xl">
                {topSpecialty?.name ?? "Top specialty"} is your strongest current signal.
              </h1>
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
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {result.topMatches.map((match, index) => {
                const specialty = specialtiesById[match.specialtyId];
                return (
                  <Link
                    href={`/specialties/${specialty.id}`}
                    key={match.specialtyId}
                    className="rounded-lg border border-white/10 bg-white/[0.055] p-4 transition hover:border-teal-200/45 hover:bg-white/[0.08]"
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/42">#{index + 1} match</p>
                    <p className="mt-3 min-h-12 text-base font-semibold leading-snug">{specialty.name}</p>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-teal-300" style={{ width: `${match.matchPercentage}%` }} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="font-semibold text-teal-200">{match.matchPercentage}%</span>
                      <span className="text-xs uppercase tracking-[0.14em] text-white/42">{match.confidenceLevel}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">AI Guidance</p>
              <p className="text-xs text-foreground/55">Personalized, Ghana-aware next steps</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-7 text-foreground/72">
            {isPending ? "Generating your personalized explanation..." : aiSummary}
          </p>
          <div className="mt-6 rounded-lg bg-primary/8 p-4 text-sm leading-6 text-foreground/72">
            {result.methodologyNote}
          </div>
          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            <Button onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={saveAndShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Link href="/assessment">
              <Button variant="outline">Retake</Button>
            </Link>
          </div>
          {(shareUrl || saveMessage) && (
            <div className="mt-4 rounded-lg border border-border/60 p-4 text-sm text-foreground/75">
              <p>{saveMessage}</p>
              {shareUrl ? <p className="mt-2 break-all font-medium text-primary">{shareUrl}</p> : null}
            </div>
          )}
        </Card>
      </section>

      {errorMessage ? (
        <Card className="border-amber-200 bg-amber-50 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
          {errorMessage}
        </Card>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold">Clinical trait profile</p>
              <p className="text-sm text-foreground/58">How your answers map across the specialty-fit dimensions.</p>
            </div>
          </div>
          <TraitRadarChart scores={result.traitScores} />
        </Card>
        <Card>
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-indigo-500/10 p-3 text-indigo-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold">Compatibility spread</p>
              <p className="text-sm text-foreground/58">Close scores mean you should compare tradeoffs before committing.</p>
            </div>
          </div>
          <MatchesBarChart matches={result.topMatches} />
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-sky-500/10 p-3 text-sky-600 dark:text-sky-300">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold">Compare your top 3</p>
              <p className="mt-1 text-sm text-foreground/65">
                Lifestyle, training, patient interaction, and competitiveness side by side.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <CompareTable matches={result.topMatches} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold">Why these matches surfaced</p>
              <p className="mt-1 text-sm text-foreground/58">Aligned traits and stretch areas to test in real clinical settings.</p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            {result.topMatches.slice(0, 3).map((match) => (
              <div key={match.specialtyId} className="rounded-lg border border-border/50 bg-muted/25 p-4">
                <p className="font-semibold">{specialtiesById[match.specialtyId].name}</p>
                <div className="mt-3 grid gap-2 text-sm text-foreground/70">
                  <p><span className="font-medium text-foreground">Aligned:</span> {match.strengths.join(", ")}</p>
                  <p><span className="font-medium text-foreground">Test next:</span> {match.challenges.join(", ")}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/10 p-3 text-amber-600">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold">Next best actions</p>
              <p className="mt-1 text-sm text-foreground/58">Turn the score into real-world specialty exploration.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {result.suggestedNextSteps.map((step, index) => (
              <div key={step} className="flex gap-3 rounded-lg bg-slate-50 p-4 text-sm text-foreground/75 dark:bg-white/5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-semibold text-white">
                  {index + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold">Specialty Explorer</p>
              <p className="mt-2 text-sm text-foreground/65">Search all included medical and dental specialties.</p>
            </div>
            <label className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/70 px-4 py-3">
              <Search className="h-4 w-4 text-foreground/45" />
              <span className="sr-only">Search specialties</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search specialties"
                className="bg-transparent text-sm outline-none"
              />
            </label>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {filteredSpecialties.slice(0, 6).map((specialty) => {
              const matched = result.topMatches.find((item) => item.specialtyId === specialty.id);
              return (
                <SpecialtyCard
                  key={specialty.id}
                  specialty={specialty}
                  matchPercentage={matched?.matchPercentage}
                />
              );
            })}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 text-amber-500" />
            <p className="text-lg font-semibold">Profile signals</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              "Diagnostic Thinker",
              "Patient Connector",
              "Ghana Health Explorer"
            ].map((badge) => (
              <div key={badge} className="rounded-lg bg-amber-50 p-4 text-sm font-medium text-amber-900 dark:bg-amber-500/10 dark:text-amber-100">
                {badge}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <Wallet className="h-5 w-5" />
            </div>
            <p className="text-lg font-semibold">Career-building activities</p>
          </div>
          <div className="mt-5 space-y-3">
            {[
              "Arrange a shadowing visit at Korle Bu Teaching Hospital or Komfo Anokye Teaching Hospital.",
              "Join a clinical skills, anatomy, or oral health outreach group on campus.",
              "Keep a reflection journal comparing what energizes you in clinic, theatre, and community work.",
              "Explore student research, public health projects, or case presentations tied to your top matches."
            ].map((item) => (
              <div key={item} className="rounded-lg bg-slate-50 p-4 text-sm text-foreground/75 dark:bg-white/5">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
