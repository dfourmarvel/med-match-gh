import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase";

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
 * This route separates the two. A real query runs; 200 means the database
 * answered, 503 means it did not. It also does the keeping-alive, since a free
 * Supabase project pauses after ~7 days with no database activity.
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

  // head:true sends no rows back — we only care that Postgres answered.
  const { error } = await serverSupabase
    .from("quiz_results")
    .select("id", { count: "exact", head: true })
    .limit(1);

  if (error) {
    console.error("Health check failed", {
      source: "app/api/health",
      message: error.message,
      code: error.code
    });
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
