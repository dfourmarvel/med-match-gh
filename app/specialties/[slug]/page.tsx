import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, Flame, Hospital, Wallet } from "lucide-react";
import { specialties, specialtiesById } from "@/lib/specialties";
import { formatCurrencyRange } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { KenteStrip } from "@/components/ui/kente-strip";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

// SEO-2: statically generate every specialty page at build time.
export function generateStaticParams() {
  return specialties.map((specialty) => ({ slug: specialty.id }));
}

// SEO-2: per-specialty title/description; handle unknown slugs.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const specialty = specialtiesById[slug];

  if (!specialty) {
    return { title: "Specialty not found" };
  }

  return {
    title: specialty.name,
    description: specialty.description,
    alternates: { canonical: `/specialties/${specialty.id}` },
    openGraph: {
      title: `${specialty.name} | MedMatch Ghana`,
      description: specialty.description,
      url: `/specialties/${specialty.id}`
    }
  };
}

export default async function SpecialtyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const specialty = specialtiesById[slug];

  if (!specialty) notFound();

  return (
    <div className="space-y-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm" aria-label="Back to home page">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to home
      </Link>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]" aria-label={`${specialty.name} overview`}>
        <Reveal mode="mount">
          <Card className="relative h-full overflow-hidden border-transparent bg-[#12291f] p-0 text-[#f6f0e2]">
            <KenteStrip />
            <div className="pattern-weave p-5 sm:p-6 md:p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">{specialty.category}</p>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">{specialty.name}</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#f6f0e2]/72">{specialty.description}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" role="group" aria-label="Key specialty metrics">
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-sm text-[#f6f0e2]/60">Lifestyle</p>
                  <p className="mt-3 font-display text-2xl font-semibold text-amber-300" aria-label={`Lifestyle rating: ${specialty.lifestyleRating} out of 5`}>{specialty.lifestyleRating}/5</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-sm text-[#f6f0e2]/60">Burnout</p>
                  <p className="mt-3 font-display text-2xl font-semibold text-amber-300" aria-label={`Burnout risk: ${specialty.burnoutRisk} out of 5`}>{specialty.burnoutRisk}/5</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-sm text-[#f6f0e2]/60">Competitiveness</p>
                  <p className="mt-3 font-display text-2xl font-semibold text-amber-300" aria-label={`Competitiveness: ${specialty.competitiveness} out of 5`}>{specialty.competitiveness}/5</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-sm text-[#f6f0e2]/60">Training</p>
                  <p className="mt-3 text-base font-semibold" aria-label={`Training length: ${specialty.trainingLength}`}>{specialty.trainingLength}</p>
                </div>
              </div>
            </div>
          </Card>
        </Reveal>

        <Reveal mode="mount" delay={0.15}>
          <Card className="h-full" role="region" aria-label="Specialty details">
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-accent/12 p-2 text-accent" aria-hidden="true">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold">Salary estimate</h2>
                  <p className="text-sm text-foreground/70">{formatCurrencyRange(specialty.salaryRangeGhs)}</p>
                  <p className="mt-2 text-xs leading-6 text-foreground/55">{specialty.salaryDisclaimer}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-primary/10 p-2 text-primary" aria-hidden="true">
                  <Hospital className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold">Ghana relevance</h2>
                  <p className="text-sm text-foreground/70">{specialty.ghanaResidencyPathway}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-secondary/10 p-2 text-secondary" aria-hidden="true">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold">Work environment</h2>
                  <p className="text-sm text-foreground/70">{specialty.workEnvironment}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-clay/10 p-2 text-clay" aria-hidden="true">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold">Pros and cons</h2>
                  <p className="text-sm text-foreground/70"><span className="font-medium text-primary">Pros:</span> {specialty.pros.join(", ")}</p>
                  <p className="mt-2 text-sm text-foreground/70"><span className="font-medium text-secondary">Cons:</span> {specialty.cons.join(", ")}</p>
                </div>
              </div>
            </div>
          </Card>
        </Reveal>
      </section>

      <section className="grid gap-6 lg:grid-cols-2" aria-label="Day in the life and personality fit">
        <Reveal>
          <Card className="h-full" role="region" aria-label="Day in the life schedule">
            <h2 className="font-display text-lg font-semibold">Day in the life</h2>
            <Stagger className="mt-6 space-y-4" role="list" aria-label="Daily schedule">
              {specialty.dayInLife.map((item) => (
                <StaggerItem key={`${item.time}-${item.activity}`} className="relative rounded-2xl border border-border/50 p-4 pl-5" role="listitem">
                  <div className="absolute inset-y-3 left-0 w-1 rounded-full bg-gradient-to-b from-gold to-clay" aria-hidden="true" />
                  <p className="text-sm font-semibold text-accent">{item.time}</p>
                  <p className="mt-2 text-sm text-foreground/72">{item.activity}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </Card>
        </Reveal>
        <Reveal delay={0.1}>
          <Card className="h-full" role="region" aria-label="Personality fit and future trends">
            <h2 className="font-display text-lg font-semibold">Personality fit and future trends</h2>
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
        </Reveal>
      </section>
    </div>
  );
}
