const captureExceptionImmediate = jest.fn();

jest.mock("posthog-node", () => ({
  PostHog: jest.fn(() => ({ captureExceptionImmediate }))
}));

async function load(key?: string) {
  jest.resetModules();
  if (key) process.env.NEXT_PUBLIC_POSTHOG_KEY = key;
  else delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
  return (await import("@/lib/server-errors")).reportServerError;
}

describe("reportServerError", () => {
  beforeEach(() => captureExceptionImmediate.mockReset());

  it("does nothing when no PostHog key is set", async () => {
    const report = await load();
    await report(new Error("boom"), "api/score");
    expect(captureExceptionImmediate).not.toHaveBeenCalled();
  });

  it("sends the error with its source and no user id", async () => {
    const report = await load("phc_test");
    const error = new Error("boom");
    await report(error, "api/score");
    expect(captureExceptionImmediate).toHaveBeenCalledWith(error, undefined, { source: "api/score" });
  });

  it("never throws when PostHog is unreachable", async () => {
    const report = await load("phc_test");
    captureExceptionImmediate.mockRejectedValue(new Error("network down"));
    await expect(report(new Error("boom"), "api/score")).resolves.toBeUndefined();
  });
});
