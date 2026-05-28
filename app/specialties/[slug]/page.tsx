import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, Flame, Hospital, Wallet } from "lucide-react";
import { specialtiesById } from "@/lib/specialties";
import { formatCurrencyRange } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export default async function SpecialtyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const specialty = specialtiesById[slug];

  if (!specialty) notFound();

  return (
    <div className="space-y-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 rounded-sm" aria-label="Back to home page">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to home
      </Link>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]" aria-label={`${specialty.name} overview`}>
        <Card className="bg-slate-950 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">{specialty.category}</p>
          <h1 className="mt-4 text-4xl font-semibold">{specialty.name}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72">{specialty.description}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" role="group" aria-label="Key specialty metrics">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-white/60">Lifestyle</p>
              <p className="mt-3 text-2xl font-semibold" aria-label={`Lifestyle rating: ${specialty.lifestyleRating} out of 5`}>{specialty.lifestyleRating}/5</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-white/60">Burnout</p>
              <p className="mt-3 text-2xl font-semibold" aria-label={`Burnout risk: ${specialty.burnoutRisk} out of 5`}>{specialty.burnoutRisk}/5</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-white/60">Competitiveness</p>
              <p className="mt-3 text-2xl font-semibold" aria-label={`Competitiveness: ${specialty.competitiveness} out of 5`}>{specialty.competitiveness}/5</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-white/60">Training</p>
              <p className="mt-3 text-base font-semibold" aria-label={`Training length: ${specialty.trainingLength}`}>{specialty.trainingLength}</p>
            </div>
          </div>
        </Card>

        <Card role="region" aria-label="Specialty details">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Wallet className="mt-1 h-5 w-5 text-sky-500" aria-hidden="true" />
              <div>
                <h2 className="font-semibold">Salary estimate</h2>
                <p className="text-sm text-foreground/70">{formatCurrencyRange(specialty.salaryRangeGhs)}</p>
                <p className="mt-2 text-xs leading-6 text-foreground/55">{specialty.salaryDisclaimer}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Hospital className="mt-1 h-5 w-5 text-sky-500" aria-hidden="true" />
              <div>
                <h2 className="font-semibold">Ghana relevance</h2>
                <p className="text-sm text-foreground/70">{specialty.ghanaResidencyPathway}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock3 className="mt-1 h-5 w-5 text-orange-500" aria-hidden="true" />
              <div>
                <h2 className="font-semibold">Work environment</h2>
                <p className="text-sm text-foreground/70">{specialty.workEnvironment}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Flame className="mt-1 h-5 w-5 text-amber-500" aria-hidden="true" />
              <div>
                <h2 className="font-semibold">Pros and cons</h2>
                <p className="text-sm text-foreground/70">Pros: {specialty.pros.join(", ")}</p>
                <p className="mt-2 text-sm text-foreground/70">Cons: {specialty.cons.join(", ")}</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2" aria-label="Day in the life and personality fit">
        <Card role="region" aria-label="Day in the life schedule">
          <h2 className="text-lg font-semibold">Day in the life</h2>
          <div className="mt-6 space-y-4" role="list" aria-label="Daily schedule">
            {specialty.dayInLife.map((item) => (
              <div key={`${item.time}-${item.activity}`} className="rounded-2xl border border-border/50 p-4" role="listitem">
                <p className="text-sm font-semibold text-sky-600 dark:text-sky-300">{item.time}</p>
                <p className="mt-2 text-sm text-foreground/72">{item.activity}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card role="region" aria-label="Personality fit and future trends">
          <h2 className="text-lg font-semibold">Personality fit and future trends</h2>
          <div className="mt-6 space-y-5 text-sm leading-7 text-foreground/72">
            <p>
              Required traits: <span className="font-medium text-foreground">{specialty.requiredTraits.join(", ")}</span>
            </p>
            <p>
              Ghana-specific opportunities: <span className="font-medium text-foreground">{specialty.ghanaOpportunities.join("; ")}</span>
            </p>
            <p>
              Similar specialties: <span className="font-medium text-foreground">{specialty.relatedSpecialties.join(", ")}</span>
            </p>
            <p>
              Future trends: <span className="font-medium text-foreground">{specialty.futureTrends.join(", ")}</span>
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
