import type { Instrumentation } from "next";

// Next.js calls this for errors nothing else caught: a server component or
// route handler that threw while rendering or responding.
export const onRequestError: Instrumentation.onRequestError = async (error, _request, context) => {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { reportServerError } = await import("@/lib/server-errors");
  // routePath is the pattern (/results/[id]), so no result id leaves the app.
  await reportServerError(error, context.routePath);
};
