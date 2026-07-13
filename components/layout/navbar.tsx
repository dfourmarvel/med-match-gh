import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { KenteStrip } from "@/components/ui/kente-strip";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full overflow-x-hidden border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <KenteStrip />
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-4 md:px-6 lg:px-8"
      >
        <Link href="/" className="group flex min-w-0 items-center gap-2 sm:gap-3" aria-label="MedMatch Ghana — Home">
          <div className="shrink-0 rounded-xl bg-gradient-to-br from-forest to-forest/80 p-2 text-gold shadow-card transition-transform duration-300 group-hover:rotate-6 dark:from-gold dark:to-clay dark:text-background">
            <HeartPulse className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold leading-tight sm:text-lg">
              MedMatch <span className="text-accent">Ghana</span>
            </p>
            <p className="hidden truncate text-[10px] uppercase tracking-[0.22em] text-foreground/55 sm:block sm:text-[11px]">
              Find your specialty
            </p>
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <Link href="/specialties" className="hidden md:inline-flex">
            <Button variant="ghost" className="h-auto px-3 py-2 sm:px-4 sm:py-3">
              Specialties
            </Button>
          </Link>
          <Link href="/results?demo=true" className="hidden md:inline-flex">
            <Button variant="ghost" className="h-auto px-3 py-2 sm:px-4 sm:py-3">
              Sample Report
            </Button>
          </Link>
          <Link href="/assessment" className="hidden sm:inline-flex">
            <Button variant="gold" className="h-auto px-3 py-2 sm:px-5 sm:py-3">
              Start Assessment
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
