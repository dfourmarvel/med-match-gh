import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({ className, role, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role={role}
      className={cn(
        "rounded-lg border border-border bg-card p-4 shadow-sm sm:p-5 md:p-6",
        className
      )}
      {...props}
    />
  );
}
