"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-card p-2 text-foreground shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
    >
      {isDark ? (
        <SunMedium className="h-5 w-5" aria-hidden="true" />
      ) : (
        <MoonStar className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
