"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex min-w-11 items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-55",
        size === "sm" && "min-h-10 px-3 py-2",
        size === "md" && "min-h-11 px-4 py-2.5",
        size === "lg" && "min-h-12 px-5 py-3",
        variant === "default" &&
          "bg-primary text-white shadow-sm hover:bg-primary/90 dark:text-slate-950",
        variant === "secondary" &&
          "bg-secondary text-white shadow-sm hover:bg-secondary/90 dark:text-slate-950",
        variant === "outline" &&
          "border border-border bg-card text-foreground shadow-sm hover:border-primary/45 hover:bg-muted",
        variant === "ghost" && "text-foreground/80 hover:bg-muted hover:text-foreground",
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
