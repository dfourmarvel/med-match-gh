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
    <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-5xl items-center">
      <section className="w-full">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Med Specialty Match
          </p>
          <h1 className="mt-5 text-5xl font-semibold leading-tight tracking-tight text-balance sm:text-6xl">
            Find the specialty that fits how you think, work, and live.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-foreground/68">
            A guided specialty assessment for future clinicians, built around personality, lifestyle, strengths, and career goals.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/assessment">
              <Button className="px-6">
                Start Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/results?demo=true">
              <Button variant="outline">View Sample Results</Button>
            </Link>
          </div>
        </div>

        <Card className="mx-auto mt-10 max-w-4xl">
          <div className="grid gap-3 sm:grid-cols-4">
            {signals.map((signal) => {
              const Icon = signal.icon;
              return (
                <div key={signal.label} className="flex items-center gap-3 rounded-lg bg-muted/65 p-4">
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium">{signal.label}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </section>
    </div>
  );
}
