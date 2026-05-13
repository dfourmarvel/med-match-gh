import { ResultsClient } from "@/components/results/results-client";

export default function ResultsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-300">Results</p>
        <h1 className="mt-3 text-4xl font-semibold">Your MedMatch Ghana profile</h1>
      </div>
      <ResultsClient />
    </div>
  );
}
