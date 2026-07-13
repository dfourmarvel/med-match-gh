import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-4 sm:space-y-6" aria-busy="true">
      <div>
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-9 w-72 max-w-full animate-pulse rounded bg-muted" />
      </div>
      <Card className="min-h-[220px]">
        <div className="h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-5 space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="min-h-[320px]">
          <div className="h-full min-h-[280px] w-full animate-pulse rounded-xl bg-muted" />
        </Card>
        <Card className="min-h-[320px]">
          <div className="h-full min-h-[280px] w-full animate-pulse rounded-xl bg-muted" />
        </Card>
      </div>
      <span className="sr-only" role="status">
        Loading your results…
      </span>
    </div>
  );
}
