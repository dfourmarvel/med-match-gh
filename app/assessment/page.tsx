import { AssessmentClient } from "@/components/quiz/assessment-client";

export default function AssessmentPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Assessment</p>
        <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold">MedMatch specialty fit assessment</h1>
      </div>
      <AssessmentClient />
    </div>
  );
}
