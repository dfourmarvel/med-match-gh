"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, Sparkles, LoaderCircle, Stethoscope, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KenteStrip } from "@/components/ui/kente-strip";
import { MatchRing } from "@/components/ui/match-ring";

interface UserResultsClientProps {
  userId: string;
  audience: string;
  traitScores: Record<string, number>;
  answers: Array<{
    questionId: number;
    questionPrompt: string;
    answer: number;
  }>;
  matches: Array<{
    specialtyId: string;
    specialtyName: string;
    matchPercentage: number;
    description: string;
    category: string;
  }>;
}

export function UserResultsClient({
  userId,
  audience,
  traitScores,
  answers,
  matches
}: UserResultsClientProps) {
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [isLoadingExplanation, setIsLoadingExplanation] = useState<boolean>(true);
  const [explanationError, setExplanationError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        setIsLoadingExplanation(true);
        setExplanationError("");

        const response = await fetch("/api/ai-explanation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            answers: answers.map((ans) => ({
              questionId: ans.questionId,
              question: ans.questionPrompt,
              answer: ans.answer
            })),
            traitScores,
            topSpecialties: matches.map((m) => ({
              name: m.specialtyName,
              matchPercentage: m.matchPercentage
            }))
          })
        });

        if (!response.ok) {
          throw new Error("Could not retrieve personalized guidance.");
        }

        const data = await response.json();
        setAiExplanation(data.explanation || "");
      } catch (err: any) {
        console.error("Failed to fetch AI explanation:", err);
        setExplanationError(
          err.message || "Personalized AI guidance is temporarily unavailable. Use the match details below as a starting point."
        );
      } finally {
        setIsLoadingExplanation(false);
      }
    });
  }, [userId, answers, traitScores, matches]);

  const topMatch = matches[0];

  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-secondary transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
        aria-label="Back to home page"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to home
      </Link>

      {/* Top Match Hero Card */}
      {topMatch && (
        <Card className="relative overflow-hidden border-transparent bg-[#12291f] p-0 text-[#f6f0e2]" role="region" aria-label="Top Specialty Match">
          <KenteStrip />
          <div className="p-6 sm:p-8 lg:p-10">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400">
              Top Recommended Match
            </span>
            <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
                  {topMatch.specialtyName}
                </h2>
                <p className="mt-4 max-w-2xl text-sm sm:text-base leading-7 text-[#f6f0e2]/72">
                  {topMatch.description}
                </p>
              </div>
              <MatchRing target={topMatch.matchPercentage} size={160} onDark />
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-xs text-[#f6f0e2]/60">
              <span className="rounded-full bg-white/10 px-3 py-1.5 font-medium border border-white/5">
                Audience: {audience === "medical-student" ? "Medical Student" : audience === "dental-student" ? "Dental Student" : "High School Student"}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1.5 font-medium border border-white/5">
                User ID: {userId.substring(0, 8)}...
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* AI Guidance Section */}
      <section role="region" aria-label="AI career guidance">
        <Card className="relative border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold">Personalized AI career guidance</h3>
          </div>

          <div className="mt-4 min-h-[100px]" aria-live="polite">
            {isLoadingExplanation ? (
              <div className="flex items-center gap-3 py-4 text-sm text-foreground/60" role="status">
                <LoaderCircle className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
                <span>Generating personalized clinical compatibility analysis...</span>
              </div>
            ) : explanationError ? (
              <p className="text-sm leading-7 text-orange-600 dark:text-orange-300" role="alert">
                {explanationError}
              </p>
            ) : (
              <p className="text-sm sm:text-base leading-7 text-foreground/75 whitespace-pre-line">
                {aiExplanation}
              </p>
            )}
          </div>
        </Card>
      </section>

      {/* List of matches */}
      <section role="region" aria-label="All recommended matches">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Recommended specialties</h3>
          <span className="text-xs text-foreground/50 font-medium">Top {matches.length} matches shown</span>
        </div>

        <div className="mt-6 grid gap-4" role="list" aria-label="Matches ranking">
          {matches.map((match, index) => (
            <Card
              key={match.specialtyId}
              className={`group transition hover:shadow-md ${
                index === 0
                  ? "border-primary/40 bg-gradient-to-br from-primary/5 to-transparent"
                  : ""
              }`}
              role="listitem"
              aria-label={`Rank ${index + 1}: ${match.specialtyName}, ${match.matchPercentage}% fit`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <h4 className="text-lg font-semibold group-hover:text-primary transition">
                      {match.specialtyName}
                    </h4>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-foreground/40">
                      {match.category}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-foreground/65 max-w-3xl">
                    {match.description}
                  </p>
                </div>

                <div className="w-full sm:w-44 shrink-0 space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-foreground/50">Compatibility</span>
                    <span className="text-primary">{match.matchPercentage}%</span>
                  </div>
                  <div
                    className="h-2 overflow-hidden rounded-full bg-muted border border-border/10"
                    role="progressbar"
                    aria-valuenow={match.matchPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${match.specialtyName} fit progress`}
                  >
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${match.matchPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Link
                  href={`/specialties/${match.specialtyId}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent transition focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
                  aria-label={`Explore ${match.specialtyName} in detail`}
                >
                  Explore specialty
                  <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
