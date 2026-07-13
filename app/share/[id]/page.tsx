import { notFound } from "next/navigation";
import { ResultsClient } from "@/components/results/results-client";
import { getResultById } from "@/lib/results";

export default async function SharedResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // API-3 / FE-2: call the shared lookup directly (no server-to-self HTTP fetch)
  // and return a real 404 for unknown or malformed ids.
  const lookup = await getResultById(id);

  if (lookup.status !== "ok") {
    notFound();
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.26em] text-secondary">Shared Result</p>
        <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">Shared MedMatch Ghana report</h1>
      </div>
      <ResultsClient sharedResult={lookup.result} sharedResultId={id} />
    </div>
  );
}
