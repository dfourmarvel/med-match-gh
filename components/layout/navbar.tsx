import Link from "next/link";
import { Activity, BarChart3 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 p-2 text-white shadow-glow">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-300">MedMatch Ghana</p>
            <p className="text-xs text-foreground/60">Career discovery for future clinicians</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/assessment">
            <Button className="hidden sm:inline-flex">Start Assessment</Button>
          </Link>
          <Link href="/results?demo=true">
            <Button variant="outline" className="hidden md:inline-flex">
              <BarChart3 className="mr-2 h-4 w-4" />
              Demo Results
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
