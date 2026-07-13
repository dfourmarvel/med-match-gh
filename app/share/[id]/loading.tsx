import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-4 sm:space-y-6" aria-busy="true">
      <div>
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-9 w-80 max-w-full animate-pulse rounded bg-muted" />
      </div>
      <Card className="min-h-[300px]">
        <div className="h-6 w-56 animate-pulse rounded bg-muted" />
        <div className="mt-5 space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
          <div className="h-4 w-3/5 animate-pulse rounded bg-muted" />
        </div>
      </Card>
      <span className="sr-only" role="status">
        Loading shared report…
      </span>
    </div>
  );
}
