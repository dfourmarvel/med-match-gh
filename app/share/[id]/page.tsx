import { ResultsClient } from "@/components/results/results-client";

async function getSharedResult(id: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const response = await fetch(`${base}/api/results/${id}`, { cache: "no-store" });
  if (!response.ok) return null;
  return response.json();
}

export default async function SharedResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sharedResult = await getSharedResult(id);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.26em] text-secondary">Shared Result</p>
        <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">Shared MedMatch Ghana report</h1>
      </div>
      <ResultsClient sharedResult={sharedResult} sharedResultId={id} />
    </div>
  );
}
