import Link from "next/link";
import { ArrowRight, HeartPulse } from "lucide-react";
import { SpecialtyProfile } from "@/lib/types";
import { Card } from "@/components/ui/card";

export function SpecialtyCard({ specialty, matchPercentage }: { specialty: SpecialtyProfile; matchPercentage?: number }) {
  return (
    <Card className="group h-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-300">
            {specialty.category}
          </p>
          <h3 className="text-xl font-semibold">{specialty.name}</h3>
          <p className="mt-3 text-sm leading-6 text-foreground/70">{specialty.description}</p>
        </div>
        <div className="rounded-lg bg-primary/10 p-3 text-primary">
          <HeartPulse className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-foreground/60">
          {matchPercentage ? `${matchPercentage}% match` : `${specialty.lifestyleRating}/5 lifestyle`}
        </div>
        <Link href={`/specialties/${specialty.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:gap-3">
          Explore
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}
