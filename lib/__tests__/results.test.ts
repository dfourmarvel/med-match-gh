let mockServerSupabase: unknown = null;

jest.mock("@/lib/supabase", () => ({
  get serverSupabase() {
    return mockServerSupabase;
  }
}));

import { getResultById } from "@/lib/results";

const VALID_ID = "11111111-1111-4111-8111-111111111111";

const notCalls: unknown[][] = [];

function supabaseReturning(result: { data: unknown; error: unknown }) {
  notCalls.length = 0;
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          not: (...args: unknown[]) => {
            notCalls.push(args);
            return { maybeSingle: () => Promise.resolve(result) };
          }
        })
      })
    })
  };
}

describe("getResultById", () => {
  beforeEach(() => {
    mockServerSupabase = null;
  });

  it("returns invalid-id for a non-UUID", async () => {
    expect(await getResultById("not-a-uuid")).toEqual({ status: "invalid-id" });
  });

  it("returns not-found when Supabase is not configured", async () => {
    mockServerSupabase = null;
    expect(await getResultById(VALID_ID)).toEqual({ status: "not-found" });
  });

  it("returns the stored result on a hit", async () => {
    const fullResult = { audience: "medical-student" };
    mockServerSupabase = supabaseReturning({ data: { scores: { fullResult } }, error: null });
    expect(await getResultById(VALID_ID)).toEqual({ status: "ok", result: fullResult });
  });

  it("returns not-found when the row has no fullResult", async () => {
    mockServerSupabase = supabaseReturning({ data: { scores: {} }, error: null });
    expect(await getResultById(VALID_ID)).toEqual({ status: "not-found" });
  });

  it("returns not-found and logs on a Supabase error", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    mockServerSupabase = supabaseReturning({ data: null, error: { message: "boom", code: "500" } });

    expect(await getResultById(VALID_ID)).toEqual({ status: "not-found" });
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

describe("getResultById publication filter", () => {
  // Every visitor's row is created the moment they finish the assessment and its
  // id lands in their browser. Only a published row may be read back, or a
  // signed-out visitor could open their own unlocked report through /share/<id>.
  it("only ever reads published rows", async () => {
    mockServerSupabase = supabaseReturning({
      data: { scores: { fullResult: { audience: "medical-student" } } },
      error: null
    });

    await getResultById(VALID_ID);
    expect(notCalls).toEqual([["published_at", "is", null]]);
  });
});
