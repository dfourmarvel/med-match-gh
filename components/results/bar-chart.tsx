"use client";

import dynamic from "next/dynamic";
import { MatchResult } from "@/lib/types";

// PERF-1: load the recharts bar chart in its own async chunk (ssr: false) with a
// sized skeleton to avoid layout shift.
const MatchesBarChartImpl = dynamic(
  () => import("./bar-chart-impl").then((mod) => mod.MatchesBarChartImpl),
  {
    ssr: false,
    loading: () => <div className="h-[280px] w-full animate-pulse rounded-xl bg-muted" aria-hidden="true" />
  }
);

export function MatchesBarChart({ matches }: { matches: MatchResult[] }) {
  return <MatchesBarChartImpl matches={matches} />;
}
