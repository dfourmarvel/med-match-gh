"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "gold";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex min-w-11 items-center justify-center gap-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97] disabled:pointer-events-none disabled:opacity-55",
        size === "sm" && "min-h-10 px-4 py-2",
        size === "md" && "min-h-11 px-6 py-2.5",
        size === "lg" && "min-h-12 px-7 py-3 text-base",
        variant === "default" &&
          "bg-primary text-primary-foreground shadow-card hover:shadow-lift hover:-translate-y-0.5",
        variant === "gold" &&
          "bg-accent text-accent-foreground shadow-card hover:shadow-glow-gold hover:-translate-y-0.5",
        variant === "secondary" &&
          "bg-secondary text-secondary-foreground shadow-card hover:shadow-lift hover:-translate-y-0.5",
        variant === "outline" &&
          "border-2 border-foreground/15 bg-card text-foreground hover:border-accent/70 hover:bg-muted/60 hover:-translate-y-0.5",
        variant === "ghost" && "text-foreground/75 hover:bg-muted hover:text-foreground",
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
