"use client";

import { Radar, RadarChart, PolarAngleAxis, PolarGrid, ResponsiveContainer } from "recharts";
import { traitLabels } from "@/lib/assessment";
import { TraitKey, TraitVector } from "@/lib/types";

export function TraitRadarChart({ scores }: { scores: TraitVector }) {
  const data = Object.entries(scores).map(([trait, value]) => ({
    trait: traitLabels[trait as TraitKey],
    value
  }));

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(148,163,184,0.25)" />
          <PolarAngleAxis dataKey="trait" tick={{ fill: "currentColor", fontSize: 11 }} />
          <Radar dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.35} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
