"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-60",
        "min-h-11 rounded-md tracking-[0.01em] focus:ring-primary/45",
        variant === "default" &&
          "bg-primary text-white shadow-[0_16px_34px_-22px_hsl(var(--primary))] hover:bg-primary/90",
        variant === "outline" &&
          "border border-border/80 bg-card/70 text-foreground hover:border-primary/45 hover:bg-primary/5 dark:bg-white/5 dark:hover:bg-white/10",
        variant === "ghost" && "text-foreground/78 hover:bg-primary/8",
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
