"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";

export function Progress({ value }: { value: number }) {
  return (
    <ProgressPrimitive.Root className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
      <ProgressPrimitive.Indicator
        className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-orange-400 transition-all duration-500 ease-out"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
