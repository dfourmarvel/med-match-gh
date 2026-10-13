import { PostHog } from "posthog-node";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const region = process.env.NEXT_PUBLIC_POSTHOG_REGION === "us" ? "us" : "eu";

// flushAt 1: a serverless function can freeze the moment it responds, so
// nothing may sit in a queue waiting for a later batch.
// No retries and a 2s cap: the report is awaited before the 500 goes out, and
// the library defaults (3 retries, 10s each) would hold a response for up to
// 49s while PostHog is down.
const client = key
  ? new PostHog(key, {
      host: `https://${region}.i.posthog.com`,
      flushAt: 1,
      flushInterval: 0,
      fetchRetryCount: 0,
      requestTimeout: 2000
    })
  : null;

/**
 * Reports a server-side error to PostHog error tracking. Does nothing when no
 * key is set, and never throws: reporting must not break the response.
 *
 * Sends the error and where it happened only. No request body, no user id.
 * Pass a fixed message for database errors: Postgres error text can quote
 * the values of the row that failed.
 */
export async function reportServerError(error: unknown, source: string) {
  if (!client) return;
  try {
    await client.captureExceptionImmediate(error, undefined, { source });
  } catch {
    /* PostHog unreachable: the console.error at the call site still logs it */
  }
}
