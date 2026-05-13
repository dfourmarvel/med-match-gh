import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-white/75 p-6 shadow-xl shadow-slate-900/5 backdrop-blur dark:bg-slate-950/50",
        className
      )}
      {...props}
    />
  );
}
