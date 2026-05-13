import Link from "next/link";
import { ArrowRight, Brain, Building2, GraduationCap, Stethoscope } from "lucide-react";
import { specialties } from "@/lib/specialties";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SpecialtyCard } from "@/components/specialties/specialty-card";

const featureCards = [
  {
    title: "25-question assessment",
    text: "Psychologically smart prompts blend personality, stress tolerance, lifestyle goals, and cognitive style."
  },
  {
    title: "Top 5 specialty matches",
    text: "Weighted trait matching ranks specialties across medicine and dentistry with clear reasoning."
  },
  {
    title: "AI career guidance",
    text: "Personalized explanations and suggested next steps transform scores into a practical path forward."
  }
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-lg border border-border/55 bg-card/88 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.55)]">
        <div className="grid gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1.08fr_0.92fr] lg:px-12 lg:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Medical career intelligence for Ghana
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-balance sm:text-6xl">
              Discover the specialty where your clinical instincts make sense.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-foreground/72">
              MedMatch Ghana turns interests, temperament, lifestyle priorities, and training goals into an explainable specialty profile designed for local training realities.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/assessment">
                <Button className="px-6">
                  Start Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/results?demo=true">
                <Button variant="outline">Preview Results</Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-foreground/65">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-sky-500" />
                Medical students
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-sky-500" />
                High school explorers
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-orange-500" />
                Dental students
              </div>
            </div>
          </div>

          <Card className="grid gap-4 self-start bg-slate-950 text-white">
            <div className="rounded-lg bg-white/5 p-5">
              <p className="text-sm text-white/60">Built for Ghana-specific exploration</p>
              <p className="mt-3 text-2xl font-semibold">Teaching hospital, residency, and lifestyle context included</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                <Building2 className="h-5 w-5 text-cyan-300" />
                <p className="mt-4 font-semibold">Residency pathways</p>
                <p className="mt-2 text-sm text-white/65">Context for Korle Bu, Komfo Anokye, and broader postgraduate training routes.</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                <GraduationCap className="h-5 w-5 text-sky-300" />
                <p className="mt-4 font-semibold">Career reality</p>
                <p className="mt-2 text-sm text-white/65">Burnout, competitiveness, emergency load, salary ranges, and demand signals.</p>
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-cyan-400/10 p-5 text-sm text-white/80">
              This tool is designed for educational and career exploration purposes only and should not replace professional academic or career counseling.
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {featureCards.map((feature) => (
          <Card key={feature.title}>
            <p className="text-lg font-semibold">{feature.title}</p>
            <p className="mt-3 text-sm leading-7 text-foreground/70">{feature.text}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Why It Feels Different</p>
          <h2 className="mt-4 text-3xl font-semibold">Built like a polished exploration platform, not a static quiz.</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-foreground/72">
            <p>Every answer shifts multiple traits, then a vector-based scoring engine compares your profile to specialty profiles across medicine and dentistry.</p>
            <p>The result experience includes a radar chart, top 5 matches, side-by-side compare view, Ghana-focused career context, and AI-generated specialty guidance.</p>
            <p>Guest mode is supported, with Supabase-ready saved results and shareable result pages for full production deployment.</p>
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Institutions and context</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              "Korle Bu Teaching Hospital",
              "Komfo Anokye Teaching Hospital",
              "University of Ghana Medical School",
              "KNUST School of Medical Sciences"
            ].map((item) => (
              <div key={item} className="rounded-lg bg-slate-50 p-5 text-sm font-medium dark:bg-white/5">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Specialty Library</p>
            <h2 className="mt-3 text-3xl font-semibold">Explore the included specialties</h2>
          </div>
          <Link href="/assessment" className="text-sm font-semibold text-primary">
            Take the quiz first
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {specialties.slice(0, 9).map((specialty) => (
            <SpecialtyCard key={specialty.id} specialty={specialty} />
          ))}
        </div>
      </section>
    </div>
  );
}
