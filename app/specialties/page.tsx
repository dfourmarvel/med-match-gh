import type { Metadata } from "next";
import { specialties } from "@/lib/specialties";
import { SpecialtiesExplorer } from "@/components/specialties/specialties-explorer";

export const metadata: Metadata = {
  title: "Specialties",
  description:
    "Browse and search medical and dental specialties with Ghana-aware training pathways, lifestyle, and day-in-the-life detail."
};

export default function SpecialtiesPage() {
  const sorted = [...specialties].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.26em] text-secondary">Explore</p>
        <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">Specialty explorer</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/65">
          Search medical and dental specialties, then open any of them for Ghana training pathways, lifestyle, day-in-the-life, and personality fit.
        </p>
      </div>
      <SpecialtiesExplorer specialties={sorted} />
    </div>
  );
}
