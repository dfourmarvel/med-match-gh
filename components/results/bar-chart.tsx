"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { MatchResult } from "@/lib/types";

const colors = ["#10b981", "#0ea5e9", "#f59e0b", "#f472b6", "#8b5cf6"];

export function MatchesBarChart({ matches }: { matches: MatchResult[] }) {
  const data = matches.map((match, index) => ({
    name: match.specialtyId.split("-").slice(0, 2).join(" "),
    score: match.matchPercentage,
    fill: colors[index] ?? "#10b981"
  }));

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
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
