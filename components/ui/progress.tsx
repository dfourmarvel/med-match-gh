"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";

export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <ProgressPrimitive.Root
      className="relative h-2.5 w-full overflow-hidden rounded-full bg-foreground/10"
      value={value}
      aria-label={label ?? "Assessment progress"}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <ProgressPrimitive.Indicator
        className="h-full rounded-full bg-gradient-to-r from-forest via-gold to-clay transition-all duration-700 ease-out"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
