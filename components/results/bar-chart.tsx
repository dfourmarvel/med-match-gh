"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { MatchResult } from "@/lib/types";

const colors = [
  "hsl(var(--forest))",
  "hsl(var(--gold))",
  "hsl(var(--clay))",
  "hsl(var(--forest) / 0.6)",
  "hsl(var(--gold) / 0.6)"
];

export function MatchesBarChart({ matches }: { matches: MatchResult[] }) {
  const data = matches.map((match, index) => ({
    name: match.specialtyId.split("-").slice(0, 2).join(" "),
    score: match.matchPercentage,
    fill: colors[index] ?? "hsl(var(--forest))"
  }));

  return (
    <div className="h-[280px] w-full" role="img" aria-label={`Bar chart showing match percentages: ${data.map(d => `${d.name} ${d.score}%`).join(", ")}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--foreground) / 0.12)" />
          <XAxis dataKey="name" tick={{ fill: "currentColor", fontSize: 12 }} />
          <YAxis tick={{ fill: "currentColor", fontSize: 12 }} domain={[0, 100]} />
          <Bar dataKey="score" radius={[12, 12, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`${entry.name}-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
