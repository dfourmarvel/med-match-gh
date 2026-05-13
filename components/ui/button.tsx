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
        variant === "default" &&
          "bg-emerald-500 text-white shadow-glow hover:bg-emerald-400",
        variant === "outline" &&
          "border border-border/70 bg-white/70 text-foreground hover:bg-white dark:bg-white/5 dark:hover:bg-white/10",
        variant === "ghost" && "text-foreground/80 hover:bg-white/10",
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
