"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Award, Download, LoaderCircle, Search, Share2, Sparkles } from "lucide-react";
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

  if (!result) {
    return (
      <Card className="flex min-h-[320px] items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-emerald-500" />
      </Card>
    );
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="bg-slate-950 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">Your Career Signal</p>
          <h1 className="mt-4 text-4xl font-semibold">Top specialty matches for your current profile</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">{result.personalitySummary}</p>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
            Confidence: <span className="font-semibold text-emerald-300">{result.confidenceLevel}</span>. {result.methodologyNote}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {result.topMatches.map((match, index) => {
              const specialty = specialtiesById[match.specialtyId];
              return (
                <div key={match.specialtyId} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">#{index + 1} match</p>
                  <p className="mt-3 text-lg font-semibold">{specialty.name}</p>
                  <p className="mt-4 text-3xl font-semibold text-emerald-300">{match.matchPercentage}%</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/45">{match.confidenceLevel} confidence</p>
                  <p className="mt-3 text-sm text-white/65">{match.reasoning}</p>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-300">AI Guidance</p>
          <div className="mt-4 flex items-start gap-3">
            <Sparkles className="mt-1 h-5 w-5 text-emerald-500" />
            <p className="text-sm leading-7 text-foreground/75">
              {isPending ? "Generating your personalized explanation..." : aiSummary}
            </p>
          </div>
          <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100">
            Educational disclaimer: This tool is designed for educational and career exploration purposes only and should not replace professional academic or career counseling.
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={saveAndShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Save and Share
            </Button>
            <Link href="/assessment">
              <Button variant="outline">Retake Quiz</Button>
            </Link>
          </div>
          {(shareUrl || saveMessage) && (
            <div className="mt-4 rounded-2xl border border-border/60 p-4 text-sm text-foreground/75">
              <p>{saveMessage}</p>
              {shareUrl ? <p className="mt-2 break-all font-medium text-emerald-600 dark:text-emerald-300">{shareUrl}</p> : null}
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
          <p className="text-lg font-semibold">Trait Radar</p>
          <TraitRadarChart scores={result.traitScores} />
        </Card>
        <Card>
          <p className="text-lg font-semibold">Top 5 Match Distribution</p>
          <MatchesBarChart matches={result.topMatches} />
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <p className="text-lg font-semibold">Compare Your Top 3</p>
          <p className="mt-2 text-sm text-foreground/65">
            Compare lifestyle, training, patient interaction, and competitiveness side by side.
          </p>
          <div className="mt-6">
            <CompareTable matches={result.topMatches} />
          </div>
        </Card>
        <Card>
          <p className="text-lg font-semibold">Detected Strengths and Stretch Areas</p>
          <div className="mt-5 space-y-4">
            {result.topMatches.slice(0, 3).map((match) => (
              <div key={match.specialtyId} className="rounded-2xl border border-border/50 p-4">
                <p className="font-semibold">{specialtiesById[match.specialtyId].name}</p>
                <p className="mt-3 text-sm text-foreground/70">Strengths: {match.strengths.join(", ")}</p>
                <p className="mt-2 text-sm text-foreground/70">Potential challenges: {match.challenges.join(", ")}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <p className="text-lg font-semibold">Suggested Next Steps</p>
          <div className="mt-5 space-y-3">
            {result.suggestedNextSteps.map((step) => (
              <div key={step} className="rounded-2xl bg-slate-50 p-4 text-sm text-foreground/75 dark:bg-white/5">
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
            <div className="flex items-center gap-2 rounded-full border border-border/60 px-4 py-3">
              <Search className="h-4 w-4 text-foreground/45" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search specialties"
                className="bg-transparent text-sm outline-none"
              />
            </div>
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
            <p className="text-lg font-semibold">Achievement badges</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              "Diagnostic Thinker",
              "Patient Connector",
              "Ghana Health Explorer"
            ].map((badge) => (
              <div key={badge} className="rounded-2xl bg-amber-50 p-4 text-sm font-medium text-amber-900 dark:bg-amber-500/10 dark:text-amber-100">
                {badge}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-lg font-semibold">Suggested extracurriculars</p>
          <div className="mt-5 space-y-3">
            {[
              "Arrange a shadowing visit at Korle Bu Teaching Hospital or Komfo Anokye Teaching Hospital.",
              "Join a clinical skills, anatomy, or oral health outreach group on campus.",
              "Keep a reflection journal comparing what energizes you in clinic, theatre, and community work.",
              "Explore student research, public health projects, or case presentations tied to your top matches."
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm text-foreground/75 dark:bg-white/5">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
