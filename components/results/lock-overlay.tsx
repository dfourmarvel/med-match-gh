"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Wraps a locked region: the placeholder content underneath is blurred and
 * taken out of the tab order and the accessibility tree, with a sign-in card on
 * top. The blur is presentation only — what is underneath is placeholder data
 * the server sent in place of the real values, so there is nothing to recover
 * by removing the CSS.
 */
export function LockOverlay({
  title,
  body,
  children,
  className = ""
}: {
  title: string;
  body: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <div className="pointer-events-none select-none blur-[6px]" aria-hidden="true" inert>
        {children}
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-background/55 p-4 backdrop-blur-[2px]">
        <div className="max-w-sm rounded-2xl border border-border/70 bg-card/95 p-5 text-center shadow-card">
          <div className="mx-auto w-fit rounded-xl bg-accent/12 p-2.5 text-accent" aria-hidden="true">
            <Lock className="h-5 w-5" />
          </div>
          <p className="mt-3 font-display text-lg font-semibold">{title}</p>
          <p className="mt-2 text-sm leading-6 text-foreground/65">{body}</p>
          <Link href={{ pathname: "/signin", query: { next: "/results" } }} className="mt-4 inline-flex">
            <Button variant="gold">Sign in to unlock</Button>
          </Link>
          <p className="mt-3 text-xs text-foreground/50">Free. Takes about ten seconds with Google.</p>
        </div>
      </div>
    </div>
  );
}
