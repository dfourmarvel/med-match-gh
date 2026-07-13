"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SpecialtyProfile } from "@/lib/types";
import { SpecialtyCard } from "@/components/specialties/specialty-card";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

type CategoryFilter = "all" | "medical" | "dental";

const categories: { label: string; value: CategoryFilter }[] = [
  { label: "All", value: "all" },
  { label: "Medical", value: "medical" },
  { label: "Dental", value: "dental" }
];

export function SpecialtiesExplorer({ specialties }: { specialties: SpecialtyProfile[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return specialties.filter((specialty) => {
      const matchesCategory = category === "all" || specialty.category === category;
      const matchesQuery =
        q === "" ||
        specialty.name.toLowerCase().includes(q) ||
        specialty.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [specialties, query, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search specialties…"
            aria-label="Search specialties by name or description"
            className="w-full rounded-xl border border-border/60 bg-card/70 py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>
        <div className="flex gap-2" role="group" aria-label="Filter by category">
          {categories.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setCategory(option.value)}
              aria-pressed={category === option.value}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent ${
                category === option.value
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border/60 text-foreground/70 hover:border-accent/40 hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-foreground/55" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "specialty" : "specialties"}
        {category !== "all" ? ` in ${category}` : ""}
        {query.trim() ? ` matching “${query.trim()}”` : ""}
      </p>

      {filtered.length > 0 ? (
        <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="list" aria-label="Specialties">
          {filtered.map((specialty) => (
            <StaggerItem key={specialty.id} role="listitem" className="h-full">
              <SpecialtyCard specialty={specialty} />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <div
          className="rounded-xl border border-border/60 bg-card/60 p-8 text-center text-sm text-foreground/60"
          role="status"
        >
          No specialties match your search. Try a different term or category.
        </div>
      )}
    </div>
  );
}
