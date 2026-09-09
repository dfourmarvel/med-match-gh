import { ExternalLink } from "lucide-react";
import { GHANA_TRAINING_REFERENCES, GHANA_CAREER_CONTEXT } from "@/lib/ghana";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * The four official GCPS references, rendered as real outbound links.
 *
 * Everything MedMatch says about training in Ghana is prose written into
 * `lib/specialties.ts` with no citation behind it. This block is deliberately
 * NOT per-specialty — the source data carries no specialty-to-institution
 * mapping, and inventing one would be exactly the kind of confident-output-over-
 * invented-input the app's own disclaimers warn against. It says instead:
 * here is where to verify any of this.
 */
export function GhanaSources({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Card className={cn("border-border/60 bg-muted/30", className)}>
      <h2 className={cn("font-semibold tracking-tight", compact ? "text-base" : "text-lg")}>
        Verify this with the official source
      </h2>
      <p className="mt-2 text-sm leading-6 text-foreground/65">
        MedMatch is a conversation starter, not an authority. Training routes, accredited centres and
        eligibility rules change, and the Ghana College of Physicians and Surgeons is the body that
        actually sets them.
      </p>
      <ul className="mt-4 space-y-3">
        {GHANA_TRAINING_REFERENCES.map((ref) => (
          <li key={ref.url}>
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              // py-1 is load-bearing: without it these links are 20px tall,
              // under the 24px minimum target size in WCAG 2.2 AA (2.5.8).
              className="group inline-flex min-h-[24px] items-start gap-1.5 py-1 text-sm font-medium text-accent underline-offset-4 hover:underline"
            >
              <span>{ref.label}</span>
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            {!compact && <p className="mt-1 text-sm leading-6 text-foreground/60">{ref.note}</p>}
          </li>
        ))}
      </ul>
      {!compact && (
        <p className="mt-5 border-t border-border/60 pt-4 text-xs leading-6 text-foreground/55">
          {GHANA_CAREER_CONTEXT.trainingCenterCaution}
        </p>
      )}
    </Card>
  );
}
