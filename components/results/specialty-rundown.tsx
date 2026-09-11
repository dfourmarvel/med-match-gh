import { MatchResult, SpecialtyProfile } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DIFFICULTY_WORDS: Record<number, string> = {
  1: "Low",
  2: "Moderate",
  3: "Fairly high",
  4: "High",
  5: "Very high"
};

function difficultyWord(score: number) {
  return DIFFICULTY_WORDS[score] ?? "Unrated";
}

function formatSalaryRange([min, max]: [number, number]) {
  return `GH₵ ${min.toLocaleString("en-GH")} – ${max.toLocaleString("en-GH")} / month`;
}

function DotScale({ label, value, max = 5 }: { label: string; value: number; max?: number }) {
  return (
    <p className="flex items-center gap-2 text-foreground/80">
      <span>{label}:</span>
      <span className="flex gap-1" aria-hidden="true">
        {Array.from({ length: max }, (_, index) => (
          <span
            key={index}
            className={cn("h-1.5 w-1.5 rounded-full", index < value ? "bg-primary" : "bg-muted")}
          />
        ))}
      </span>
      {/* The dots carry their value in background colour alone, which browsers
          drop when printing. Print falls back to the number. */}
      <span className="sr-only print:not-sr-only print:static">{`${value} out of ${max}`}</span>
    </p>
  );
}

export function SpecialtyRundown({ match, specialty }: { match: MatchResult; specialty: SpecialtyProfile }) {
  return (
    <Card role="group" aria-label={`What it takes: ${specialty.name}`} className="h-full">
      <h3 className="font-display text-base font-semibold text-foreground">What it takes: {specialty.name}</h3>
      <p className="sr-only">{match.matchPercentage}% compatibility with your profile.</p>
      <dl className="mt-4 space-y-4 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/55">Training</dt>
          <dd className="mt-1 text-foreground/80">{specialty.trainingLength}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/55">Pathway in Ghana</dt>
          <dd className="mt-1 text-foreground/80">{specialty.ghanaResidencyPathway}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/55">Difficulty</dt>
          <dd className="mt-1 space-y-1.5">
            <p className="text-foreground/80">{difficultyWord(specialty.competitiveness)} competitiveness</p>
            <DotScale label="Burnout risk" value={specialty.burnoutRisk} />
            <DotScale label="Lifestyle" value={specialty.lifestyleRating} />
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/55">Expected pay in Ghana</dt>
          <dd className="mt-1 text-foreground/80">
            <p>{formatSalaryRange(specialty.salaryRangeGhs)}</p>
            <p className="mt-1 text-xs text-foreground/55">{specialty.salaryDisclaimer}</p>
          </dd>
        </div>
      </dl>
    </Card>
  );
}
