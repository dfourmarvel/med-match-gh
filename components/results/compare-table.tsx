import Link from "next/link";
import { specialtiesById } from "@/lib/specialties";
import { MatchResult, SpecialtyProfile } from "@/lib/types";
import { formatCurrencyRange } from "@/lib/utils";

export function CompareTable({ matches }: { matches: MatchResult[] }) {
  const topThree = matches
    .slice(0, 3)
    .map((match) => specialtiesById[match.specialtyId])
    .filter(Boolean) as SpecialtyProfile[];
  const rows: Array<{ label: string; accessor: (specialty: SpecialtyProfile) => string }> = [
    { label: "Lifestyle", accessor: (specialty) => `${specialty.lifestyleRating}/5` },
    { label: "Competitiveness", accessor: (specialty) => `${specialty.competitiveness}/5` },
    { label: "Burnout Risk", accessor: (specialty) => `${specialty.burnoutRisk}/5` },
    { label: "Training", accessor: (specialty) => specialty.trainingLength },
    { label: "Salary", accessor: (specialty) => formatCurrencyRange(specialty.salaryRangeGhs) },
    { label: "Patient Interaction", accessor: (specialty) => `${specialty.patientInteractionLevel}/5` },
    { label: "Procedure Intensity", accessor: (specialty) => `${specialty.procedureIntensity}/5` },
    { label: "Emergency Intensity", accessor: (specialty) => `${specialty.emergencyIntensity}/5` }
  ];

  return (
    <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Specialty comparison table — scroll horizontally if needed">
      <table className="min-w-full text-left text-sm" aria-label="Top 3 specialty comparison">
        <caption className="sr-only">Comparison of your top 3 matched specialties across lifestyle, training, salary, and clinical metrics.</caption>
        <thead className="text-foreground/60">
          <tr>
            <th scope="col" className="pb-4 pr-4">Metric</th>
            {topThree.map((specialty) => (
              <th key={specialty.id} scope="col" className="pb-4 pr-6 font-semibold text-foreground">
                <Link href={`/specialties/${specialty.id}`} className="hover:text-sky-500 focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 rounded-sm">
                  {specialty.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className="py-4 pr-4 font-medium">{row.label}</th>
              {topThree.map((specialty) => (
                <td key={`${specialty.id}-${row.label}`} className="py-4 pr-6 text-foreground/75">
                  {row.accessor(specialty)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
