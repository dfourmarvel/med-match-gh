"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  ClipboardList,
  Compass,
  GraduationCap,
  HeartPulse,
  MapPin,
  Share2,
  Sparkles,
  Stethoscope
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { KenteStrip } from "@/components/ui/kente-strip";
import { MatchRing } from "@/components/ui/match-ring";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { specialties } from "@/lib/specialties";

const floatingChips = [
  { label: "Pediatrics", value: "88%", className: "-left-4 top-8 sm:-left-10" },
  { label: "Family Medicine", value: "90%", className: "-right-2 top-24 sm:-right-8" },
  { label: "Psychiatry", value: "85%", className: "-left-6 bottom-16 sm:-left-12" }
];

function HeroVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.21, 0.6, 0.35, 1] }}
        className="relative rounded-2xl border border-border/70 bg-card p-6 shadow-lift"
      >
        <KenteStrip className="absolute inset-x-0 top-0 rounded-t-2xl" />
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-foreground/55">Your top match</p>
        <p className="mt-2 font-display text-2xl font-semibold">Internal Medicine</p>
        <div className="mt-4 flex justify-center">
          <MatchRing target={92} />
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/70 px-4 py-3 text-sm">
          <span className="text-foreground/65">Diagnostic reasoning</span>
          <span className="font-semibold text-accent">Strong</span>
        </div>
      </motion.div>

      {floatingChips.map((chip, index) => (
        <motion.div
          key={chip.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 + index * 0.18, duration: 0.45, ease: "easeOut" }}
          className={`absolute ${chip.className}`}
        >
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 4.5 + index, repeat: Infinity, ease: "easeInOut", delay: index * 0.6 }}
            className="flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 shadow-card"
          >
            <span className="text-sm font-medium">{chip.label}</span>
            <span className="text-sm font-semibold text-accent">{chip.value}</span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

const steps = [
  {
    icon: ClipboardList,
    title: "Answer 25 signals",
    body: "Honest questions about how you think, work with patients, handle pressure, and want to live."
  },
  {
    icon: Brain,
    title: "We map your traits",
    body: "A weighted scoring engine builds your clinical trait profile across 15 dimensions — no black box."
  },
  {
    icon: Compass,
    title: "Explore your matches",
    body: "Top 5 specialties with Ghana-aware training pathways, salary context, and AI-personalized next steps."
  }
];

const discoveries = [
  { icon: HeartPulse, title: "Top 5 specialty matches", body: "Ranked compatibility with confidence levels, strengths, and stretch areas." },
  { icon: Brain, title: "Your clinical trait radar", body: "See your profile across 15 dimensions, from diagnostic reasoning to emergency comfort." },
  { icon: MapPin, title: "Ghana-aware pathways", body: "Residency routes, Korle Bu and Komfo Anokye realities, and local salary context." },
  { icon: Sparkles, title: "AI-personalized guidance", body: "A tailored explanation of why your matches surfaced, and what to test next." },
  { icon: GraduationCap, title: "Built for your stage", body: "Framing adapts for medical students, dental students, and high schoolers." },
  { icon: Share2, title: "Share and export", body: "A share link for mentors and a print-ready report for your records." }
];

export function HomeLanding() {
  const previewSpecialties = specialties.slice(0, 6);

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* Hero */}
      <section aria-labelledby="hero-heading" className="relative">
        <div className="glow-warm pointer-events-none absolute -inset-x-8 -top-16 bottom-0" aria-hidden="true" />
        <div className="relative grid items-center gap-12 pt-6 sm:pt-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal mode="mount">
              <div className="flex items-center gap-3">
                <KenteStrip className="h-1.5 w-14 rounded-full" />
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-foreground/60 sm:text-sm">
                  Specialty-fit assessment
                </p>
              </div>
            </Reveal>
            <Reveal mode="mount" delay={0.1}>
              <h1
                id="hero-heading"
                className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-6xl"
              >
                Your calling in medicine, <span className="text-shimmer">matched</span> to how you actually think.
              </h1>
            </Reveal>
            <Reveal mode="mount" delay={0.2}>
              <p className="mt-6 max-w-xl text-base leading-7 text-foreground/70 sm:text-lg sm:leading-8">
                A guided assessment for Ghana&apos;s future clinicians — built around your personality, strengths,
                lifestyle goals, and the realities of training here.
              </p>
            </Reveal>
            <Reveal mode="mount" delay={0.3}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/assessment">
                  <Button variant="gold" size="lg" className="w-full sm:w-auto">
                    Start the assessment
                    <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/results?demo=true">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    See a sample report
                  </Button>
                </Link>
              </div>
            </Reveal>
            <Reveal mode="mount" delay={0.4}>
              <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
                {[
                  ["25", "questions"],
                  ["15", "trait dimensions"],
                  ["20+", "specialties"],
                  ["100%", "free"]
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="sr-only">{label}</dt>
                    <dd>
                      <span className="font-display text-2xl font-semibold text-accent">{value}</span>
                      <span className="ml-2 text-sm text-foreground/60">{label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-heading">
        <Reveal>
          <div className="flex items-center gap-3">
            <KenteStrip className="h-1.5 w-14 rounded-full" />
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-foreground/60">How it works</p>
          </div>
          <h2 id="how-heading" className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Three steps from &ldquo;not sure&rdquo; to a shortlist you can test.
          </h2>
        </Reveal>
        <Stagger className="mt-10 grid gap-5 md:grid-cols-3" role="list">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <StaggerItem
                key={step.title}
                role="listitem"
                className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-card transition-shadow duration-300 hover:shadow-lift"
              >
                <span className="absolute -right-3 -top-5 font-display text-8xl font-semibold text-foreground/[0.05] transition-colors duration-300 group-hover:text-accent/10" aria-hidden="true">
                  {index + 1}
                </span>
                <div className="w-fit rounded-xl bg-primary/10 p-3 text-primary transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-foreground/68">{step.body}</p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* What you'll discover */}
      <section aria-labelledby="discover-heading" className="relative">
        <Reveal>
          <div className="flex items-center gap-3">
            <KenteStrip className="h-1.5 w-14 rounded-full" />
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-foreground/60">Inside your report</p>
          </div>
          <h2 id="discover-heading" className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            More than a score — a map of who you are as a clinician.
          </h2>
        </Reveal>
        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {discoveries.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem
                key={item.title}
                role="listitem"
                className="group rounded-2xl border border-border/70 bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-accent/12 p-2.5 text-accent">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-foreground/68">{item.body}</p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* Specialty preview */}
      <section aria-labelledby="specialties-heading">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <KenteStrip className="h-1.5 w-14 rounded-full" />
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-foreground/60">The field</p>
              </div>
              <h2 id="specialties-heading" className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Specialties we profile, Ghana-first.
              </h2>
            </div>
          </div>
        </Reveal>
        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {previewSpecialties.map((specialty) => (
            <StaggerItem key={specialty.id} role="listitem">
              <Link
                href={`/specialties/${specialty.id}`}
                className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lift"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary">{specialty.category}</p>
                  <Stethoscope className="h-4 w-4 text-foreground/35 transition-colors group-hover:text-accent" aria-hidden="true" />
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold">{specialty.name}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-foreground/68">{specialty.description}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-primary transition-all group-hover:gap-3 group-hover:text-accent">
                  Explore
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Final CTA */}
      <section aria-labelledby="cta-heading">
        <Reveal>
          <div className="pattern-weave relative overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-lift">
            <KenteStrip className="absolute inset-x-0 top-0" />
            <div className="px-6 py-14 text-center sm:px-12 sm:py-16">
              <h2 id="cta-heading" className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Ten minutes now. A clearer direction for the next ten years.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 opacity-85 sm:text-base">
                Take the assessment, get your top matches, and bring better questions to your next shadowing visit.
              </p>
              <div className="mt-8 flex justify-center">
                <Link href="/assessment">
                  <Button variant="gold" size="lg">
                    Find your specialty
                    <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>
            <KenteStrip className="absolute inset-x-0 bottom-0" />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
