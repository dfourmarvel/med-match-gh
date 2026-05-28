import Link from "next/link";
import { ArrowRight, Brain, GraduationCap, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const signals = [
  { label: "25 questions", icon: Brain },
  { label: "Medical + dental", icon: Stethoscope },
  { label: "Ghana-aware", icon: GraduationCap },
  { label: "Explainable results", icon: ShieldCheck }
];

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl items-center px-0">
      <section aria-labelledby="hero-heading" className="w-full">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Med Specialty Match
          </p>
          <h1 id="hero-heading" className="mt-4 sm:mt-5 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight text-balance">
            Find the specialty that fits how you think, work, and live.
          </h1>
          <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base leading-6 sm:leading-8 text-foreground/68">
            A guided specialty assessment for future clinicians, built around personality, lifestyle, strengths, and career goals.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            <Link href="/assessment">
              <Button className="w-full sm:w-auto">
                Start Assessment
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/results?demo=true">
              <Button variant="outline" className="w-full sm:w-auto">View Sample Results</Button>
            </Link>
          </div>
        </div>

        <Card className="mx-auto mt-8 sm:mt-10 max-w-4xl" role="region" aria-label="Assessment features">
          <ul className="grid gap-3 grid-cols-2 sm:grid-cols-2 md:grid-cols-4" role="list">
            {signals.map((signal) => {
              const Icon = signal.icon;
              return (
                <li key={signal.label} className="flex items-center gap-2 sm:gap-3 rounded-lg bg-muted/65 p-3 sm:p-4">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" aria-hidden="true" />
                  <p className="text-xs sm:text-sm font-medium">{signal.label}</p>
                </li>
              );
            })}
          </ul>
        </Card>
      </section>
    </div>
  );
}
