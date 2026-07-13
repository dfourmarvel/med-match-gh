let mockServerSupabase: unknown = null;
let mockHasServiceRole = true;

jest.mock("@/lib/supabase", () => ({
  get serverSupabase() {
    return mockServerSupabase;
  },
  get hasSupabaseServiceRole() {
    return mockHasServiceRole;
  }
}));

import { getResultById } from "@/lib/results";

const VALID_ID = "11111111-1111-4111-8111-111111111111";

function supabaseReturning(result: { data: unknown; error: unknown }) {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve(result)
        })
      })
    })
  };
}

describe("getResultById", () => {
  beforeEach(() => {
    mockServerSupabase = null;
    mockHasServiceRole = true;
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
