import { cn } from "@/lib/utils";

/** Thin kente-inspired woven band, used as a signature accent on cards, headers, and dividers. */
export function KenteStrip({ className, vertical = false }: { className?: string; vertical?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(vertical ? "kente-strip-vertical w-1" : "kente-strip h-1", className)}
    />
  );
}
