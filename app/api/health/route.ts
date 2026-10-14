import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase";
import { reportServerError } from "@/lib/server-errors";

// Never cached: the whole point is to hit the database on every call.
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Liveness check that actually proves a database round-trip.
 *
 * The keep-alive workflow used to call /api/results/<zero-uuid> and treat 404 as
 * healthy. That could not work: getResultById returns "not-found" — and so 404 —
 * both when the row is genuinely absent AND when `serverSupabase` is null or the
 * query itself errors. The check reported green with the database entirely
 * unreachable, which is the one condition it existed to catch.
 *
 * This route separates the two. A real write runs; 200 means the database
 * accepted it, 503 means it did not.
 *
 * It writes rather than reads because reading most likely was not enough: a
 * count-only read twice a week passed every run and the database still went
 * unreachable by 24 Sep 2026. The write is one fixed row, so calling this route
 * repeatedly cannot grow the table.
 *
 * Deliberately leaks nothing: no row data, no error detail, no table shape.
 */
export async function GET() {
  if (!serverSupabase) {
    return NextResponse.json(
      { status: "unconfigured", db: "unreachable" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const { error } = await serverSupabase
    .from("keepalive")
    .upsert({ id: 1, pinged_at: new Date().toISOString() });

  if (error) {
    console.error("Health check failed", {
      source: "app/api/health",
      message: error.message,
      code: error.code
    });
    await reportServerError(new Error("Health check failed"), "api/health");
    return NextResponse.json(
      { status: "degraded", db: "unreachable" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    { status: "ok", db: "reachable" },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
