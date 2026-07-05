import Link from "next/link";
import { ArrowRight, HeartPulse } from "lucide-react";
import { SpecialtyProfile } from "@/lib/types";
import { Card } from "@/components/ui/card";

export function SpecialtyCard({ specialty, matchPercentage }: { specialty: SpecialtyProfile; matchPercentage?: number }) {
  return (
    <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lift" role="article" aria-label={`${specialty.name} specialty card`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
            {specialty.category}
          </p>
          <h3 className="font-display text-xl font-semibold">{specialty.name}</h3>
          <p className="mt-3 text-sm leading-6 text-foreground/70">{specialty.description}</p>
        </div>
        <div className="rounded-xl bg-accent/12 p-3 text-accent transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" aria-hidden="true">
          <HeartPulse className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-foreground/60">
          {matchPercentage ? (
            <span className="font-semibold text-accent" aria-label={`${matchPercentage} percent match`}>{matchPercentage}% match</span>
          ) : (
            <span aria-label={`Lifestyle rating ${specialty.lifestyleRating} out of 5`}>{specialty.lifestyleRating}/5 lifestyle</span>
          )}
        </div>
        <Link
          href={`/specialties/${specialty.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3 group-hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
          aria-label={`Explore ${specialty.name}`}
        >
          Explore
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}
