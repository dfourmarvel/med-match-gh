"use client";

import dynamic from "next/dynamic";
import { TraitVector } from "@/lib/types";

// PERF-1: recharts is heavy, so load the chart implementation in its own async
// chunk (ssr: false) with a sized skeleton to avoid layout shift.
const TraitRadarChartImpl = dynamic(
  () => import("./radar-chart-impl").then((mod) => mod.TraitRadarChartImpl),
  {
    ssr: false,
    loading: () => <div className="h-[320px] w-full animate-pulse rounded-xl bg-muted" aria-hidden="true" />
  }
);

export function TraitRadarChart({ scores }: { scores: TraitVector }) {
  return <TraitRadarChartImpl scores={scores} />;
}
