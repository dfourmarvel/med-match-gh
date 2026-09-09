/**
 * @jest-environment node
 */

import { GET } from "@/app/api/health/route";
import { serverSupabase } from "@/lib/supabase";

jest.mock("@/lib/supabase", () => ({ serverSupabase: null }));

const mockedModule = jest.requireMock("@/lib/supabase") as { serverSupabase: unknown };

/** Minimal stand-in for the head-count query the route issues. */
function supabaseReturning(result: { error: { message: string; code: string } | null }) {
  return {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(result)
      })
    })
  };
}

describe("GET /api/health", () => {
  afterEach(() => {
    mockedModule.serverSupabase = null;
    jest.restoreAllMocks();
  });

  it("reports 503 when Supabase is not configured", async () => {
    mockedModule.serverSupabase = null;

    const response = await GET();

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ status: "unconfigured", db: "unreachable" });
  });

  it("reports 503 when the query errors", async () => {
    // This is the case the old keep-alive check reported as healthy: the
    // database is unreachable, and the previous route answered 404 for it.
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockedModule.serverSupabase = supabaseReturning({
      error: { message: "connection terminated", code: "57P01" }
    });

    const response = await GET();

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ status: "degraded", db: "unreachable" });
  });

  it("reports 200 only when the database actually answered", async () => {
    mockedModule.serverSupabase = supabaseReturning({ error: null });

    const response = await GET();

    expect(response.status).toBe(200);
    // The keep-alive workflow greps for this exact shape, so it is a contract.
    await expect(response.json()).resolves.toEqual({ status: "ok", db: "reachable" });
  });

  it("never caches, so the check cannot pass on a stale response", async () => {
    mockedModule.serverSupabase = supabaseReturning({ error: null });

    const response = await GET();

    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("leaks no error detail to the caller", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockedModule.serverSupabase = supabaseReturning({
      error: { message: "relation quiz_results does not exist", code: "42P01" }
    });

    const body = await (await GET()).json();

    expect(JSON.stringify(body)).not.toContain("quiz_results");
    expect(JSON.stringify(body)).not.toContain("42P01");
  });
});

// Silences the unused-import lint while keeping the module reference explicit.
void serverSupabase;
