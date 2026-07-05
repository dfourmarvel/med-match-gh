import { AssessmentClient } from "@/components/quiz/assessment-client";
import { KenteStrip } from "@/components/ui/kente-strip";

export default function AssessmentPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <KenteStrip className="h-1.5 w-14 rounded-full" />
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-foreground/60 sm:text-sm">Assessment</p>
        </div>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:mt-4 sm:text-3xl md:text-4xl">
          MedMatch specialty fit assessment
        </h1>
      </div>
      <AssessmentClient />
    </div>
  );
}
