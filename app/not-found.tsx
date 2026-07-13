import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KenteStrip } from "@/components/ui/kente-strip";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl py-8 sm:py-12">
      <Card className="relative overflow-hidden border-transparent bg-[#12291f] p-0 text-[#f6f0e2]">
        <KenteStrip />
        <div className="pattern-weave p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400">404 — Not found</p>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            We couldn&apos;t find that page
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-[#f6f0e2]/72">
            The link may be broken or the page may have moved. Let&apos;s get you back to exploring specialties that fit.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/">
              <Button variant="gold">
                <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                Back home
              </Button>
            </Link>
            <Link href="/specialties">
              <Button variant="outline" className="border-white/20 bg-transparent text-[#f6f0e2] hover:bg-white/10">
                <Compass className="mr-2 h-4 w-4" aria-hidden="true" />
                Browse specialties
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
