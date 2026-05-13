import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/55 bg-card/92 p-6 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-card/88",
        className
      )}
      {...props}
    />
  );
}
