import Link from "next/link";
import { Activity, BarChart3 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/55 bg-background/86 backdrop-blur-xl w-full overflow-x-hidden">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-4 md:px-6 lg:px-8 gap-2"
      >
        <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0" aria-label="MedMatch Ghana — Home">
          <div className="rounded-lg bg-slate-950 p-2 text-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.8)] dark:bg-white dark:text-slate-950 shrink-0">
            <Activity className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary truncate">MedMatch Ghana</p>
            <p className="hidden text-[10px] sm:text-xs text-foreground/60 sm:block truncate">Clinical career intelligence</p>
          </div>
        </Link>
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <Link href="/assessment">
            <Button className="hidden sm:inline-flex py-2 px-3 sm:py-3 sm:px-4 h-auto">Start Assessment</Button>
          </Link>
          <Link href="/results?demo=true">
            <Button variant="outline" className="hidden md:inline-flex py-2 px-3 sm:py-3 sm:px-4 h-auto">
              <BarChart3 className="mr-2 h-4 w-4" aria-hidden="true" />
              Demo Results
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
