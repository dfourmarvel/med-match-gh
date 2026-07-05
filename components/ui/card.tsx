import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({ className, role, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role={role}
      className={cn(
        "rounded-2xl border border-border/70 bg-card p-4 shadow-card transition-shadow duration-300 sm:p-5 md:p-6",
        className
      )}
      {...props}
    />
  );
}
