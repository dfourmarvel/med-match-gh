import type { Metadata } from "next";
import { GHANA_INSTITUTIONS, GHANA_CAREER_CONTEXT } from "@/lib/ghana";
import { GhanaSources } from "@/components/ghana/ghana-sources";
import { Card } from "@/components/ui/card";
import { KenteStrip } from "@/components/ui/kente-strip";

export const metadata: Metadata = {
  title: "Training pathways in Ghana",
  description:
    "How postgraduate medical and dental specialist training works in Ghana — the GCPS routes, the accredited teaching and regional hospitals, and where to verify any of it."
};

/**
 * A general page, deliberately not a per-specialty one.
 *
 * `lib/ghana.ts` lists institutions with no specialty mapping. Rendering them
 * against a specialty would mean inventing which hospital trains which
 * discipline. So this page states what the data actually supports: these are
 * the recognised training environments, here is the admissions picture in
 * outline, and here is the official source for the specifics.
 */

const TYPE_LABELS: Record<string, string> = {
  "teaching-hospital": "Teaching hospitals",
  "military-teaching-hospital": "Military teaching hospitals",
  "specialist-hospital": "Specialist hospitals",
  "regional-hospital": "Regional hospitals",
  "medical-school": "Medical schools",
  "dental-school": "Dental schools"
};

// Ordered so the reader meets the major training centres first.
const TYPE_ORDER = [
  "teaching-hospital",
  "military-teaching-hospital",
  "specialist-hospital",
  "regional-hospital",
  "medical-school",
  "dental-school"
];

export default function PathwaysPage() {
  const grouped = TYPE_ORDER.map((type) => ({
    type,
    label: TYPE_LABELS[type] ?? type,
    items: GHANA_INSTITUTIONS.filter((institution) => institution.type === type)
  })).filter((group) => group.items.length > 0);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.26em] text-secondary">Ghana</p>
        <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
          Training pathways in Ghana
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/65">
          {GHANA_CAREER_CONTEXT.admissionsSummary}
        </p>
      </div>

      <section aria-labelledby="institutions-heading" className="space-y-4">
        <div>
          <h2 id="institutions-heading" className="text-xl font-semibold tracking-tight">
            Where training happens
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/65">
            Recognised training and teaching environments across Ghana. Which of them runs a given
            residency, and whether it is currently accredited for it, is decided by the GCPS &mdash; check
            their training centres listing rather than assuming from this page.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {grouped.map((group) => (
            <Card key={group.type} className="overflow-hidden p-0">
              <KenteStrip />
              <div className="p-4 sm:p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/70">
                  {group.label}
                </h3>
                <ul className="mt-3 space-y-2">
                  {group.items.map((institution) => (
                    <li key={institution.id} className="text-sm leading-6">
                      <span className="font-medium">{institution.name}</span>
                      <span className="text-foreground/55">
                        {" "}&middot; {institution.city}, {institution.region}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="pay-heading">
        <Card>
          <h2 id="pay-heading" className="text-lg font-semibold tracking-tight">
            On the salary figures you will see
          </h2>
          <p className="mt-2 text-sm leading-6 text-foreground/65">{GHANA_CAREER_CONTEXT.salaryCaution}</p>
        </Card>
      </section>

      <GhanaSources />

      <p className="text-sm leading-6 text-foreground/60">{GHANA_CAREER_CONTEXT.studentAdvice}</p>
    </div>
  );
}
