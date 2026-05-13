import { AssessmentClient } from "@/components/quiz/assessment-client";

export default function AssessmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-300">Assessment</p>
        <h1 className="mt-3 text-4xl font-semibold">MedMatch specialty fit assessment</h1>
      </div>
      <AssessmentClient />
    </div>
  );
}
