import { ResultsClient } from "@/components/results/results-client";

export default async function ResultsPage({
  searchParams
}: {
  searchParams: Promise<{ demo?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.26em] text-secondary">Results</p>
        <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">Your MedMatch Ghana profile</h1>
        <p className="mt-2 text-xs text-foreground/50 sm:text-sm">
          MedMatch is a study and reflection tool, not career or medical advice.
        </p>
      </div>
      <ResultsClient showDemo={params.demo === "true"} />
    </div>
  );
}
