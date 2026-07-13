"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KenteStrip } from "@/components/ui/kente-strip";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error boundary caught:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl py-8 sm:py-12">
      <Card className="relative overflow-hidden border-transparent bg-[#12291f] p-0 text-[#f6f0e2]">
        <KenteStrip />
        <div className="pattern-weave p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400">Something went wrong</p>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            This page hit an unexpected error
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-[#f6f0e2]/72">
            You can try again, or head back home. If it keeps happening, please try again later.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="gold" onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
              Try again
            </Button>
            <Link href="/">
              <Button variant="outline" className="border-white/20 bg-transparent text-[#f6f0e2] hover:bg-white/10">
                <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                Back home
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
