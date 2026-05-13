"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";

export function Progress({ value }: { value: number }) {
  return (
    <ProgressPrimitive.Root className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
      <ProgressPrimitive.Indicator
        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
