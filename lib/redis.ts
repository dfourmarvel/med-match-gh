import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// A malformed URL is treated exactly like "not configured" rather than being
// allowed to throw. `new Redis()` runs at module load, so an unparseable value
// (e.g. the literal "[SENSITIVE]" that `vercel env pull` writes for secrets)
// used to crash `next build` during page-data collection, not just at request
// time. The warning matters: silently degrading in production would weaken both
// rate limiting and caching with no visible signal.
//
// Lives here rather than inside lib/rate-limit.ts because the AI explanation
// cache needs the same connection, and two modules each building their own
// client from the same env is how the guard above drifts apart.
function buildRedis(): Redis | null {
  if (!redisUrl || !redisToken) return null;
  try {
    new URL(redisUrl);
  } catch {
    console.warn(
      "UPSTASH_REDIS_REST_URL is not a valid URL — Upstash-backed rate limiting and " +
        "AI response caching are disabled. Rate limiting falls back to a per-instance " +
        "in-memory limiter, which is NOT sufficient on serverless."
    );
    return null;
  }
  return new Redis({ url: redisUrl, token: redisToken });
}

export const redis = buildRedis();
