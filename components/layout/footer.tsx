import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { KenteStrip } from "@/components/ui/kente-strip";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/60 bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-forest to-forest/80 p-2 text-gold dark:from-gold dark:to-clay dark:text-background">
              <HeartPulse className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="font-display text-lg font-semibold">
              MedMatch <span className="text-accent">Ghana</span>
            </p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-foreground/65">
            A specialty-fit compass for Ghana&apos;s future clinicians. Exploratory guidance — validate with
            shadowing, mentorship, and rotations.
          </p>
        </div>
        <nav aria-label="Footer — explore">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/assessment" className="text-foreground/75 transition-colors hover:text-accent">
                Take the assessment
              </Link>
            </li>
            <li>
              <Link href="/specialties" className="text-foreground/75 transition-colors hover:text-accent">
                Browse specialties
              </Link>
            </li>
            <li>
              <Link href="/results?demo=true" className="text-foreground/75 transition-colors hover:text-accent">
                Sample report
              </Link>
            </li>
            <li>
              <Link href="/results" className="text-foreground/75 transition-colors hover:text-accent">
                My results
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">Good to know</p>
          <p className="mt-4 text-sm leading-6 text-foreground/65">
            Educational career guidance only — not a final specialty decision. Built with Ghana&apos;s training
            pathways in mind.
          </p>
        </div>
      </div>
      <KenteStrip className="opacity-80" />
    </footer>
  );
}
