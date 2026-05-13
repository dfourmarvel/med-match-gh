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
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="text-foreground/60">
          <tr>
            <th className="pb-4 pr-4">Metric</th>
            {topThree.map((specialty) => (
              <th key={specialty.id} className="pb-4 pr-6 font-semibold text-foreground">
                <Link href={`/specialties/${specialty.id}`} className="hover:text-emerald-500">
                  {specialty.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {rows.map((row) => (
            <tr key={row.label}>
              <td className="py-4 pr-4 font-medium">{row.label}</td>
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
