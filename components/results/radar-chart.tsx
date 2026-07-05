"use client";

import { Radar, RadarChart, PolarAngleAxis, PolarGrid, ResponsiveContainer } from "recharts";
import { traitLabels } from "@/lib/assessment";
import { TraitKey, TraitVector } from "@/lib/types";

export function TraitRadarChart({ scores }: { scores: TraitVector }) {
  const data = Object.entries(scores).map(([trait, value]) => ({
    trait: traitLabels[trait as TraitKey],
    value
  }));

  const summaryText = data.map(d => `${d.trait}: ${d.value}`).join(", ");

  return (
    <div className="h-[320px] w-full" role="img" aria-label={`Radar chart of clinical trait scores. ${summaryText}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="hsl(var(--foreground) / 0.15)" />
          <PolarAngleAxis dataKey="trait" tick={{ fill: "currentColor", fontSize: 11 }} />
          <Radar dataKey="value" stroke="hsl(var(--gold))" fill="hsl(var(--gold))" fillOpacity={0.3} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
