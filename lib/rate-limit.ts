import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

// ── In-memory fallback (local dev / when Upstash is not configured) ───────────
// SEC-2: this is only correct for a single long-lived process. On serverless
// (Vercel) each instance keeps its own map, so limits multiply per instance —
// use Upstash in production. Here we at least prevent unbounded growth.
const buckets = new Map<string, { count: number; resetAt: number }>();

function pruneExpired(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

function inMemoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  // Opportunistic cleanup so the map can't grow without bound.
  if (buckets.size > 5000) {
    pruneExpired(now);
  }

  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (current.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) };
  }

  current.count += 1;
  return { allowed: true };
}

// ── Upstash Redis limiter (durable across serverless instances) ───────────────
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

// Cache one Ratelimit instance per (limit, windowMs) config so we don't rebuild
// it on every request.
const limiters = new Map<string, Ratelimit>();

function getLimiter(limit: number, windowMs: number): Ratelimit | null {
  if (!redis) {
    return null;
  }

  const cacheKey = `${limit}:${windowMs}`;
  let limiter = limiters.get(cacheKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
      prefix: "medmatch-rl"
    });
    limiters.set(cacheKey, limiter);
  }
  return limiter;
}

function getClientKey(request: Request, namespace: string): string {
  // NOTE: x-forwarded-for is client-controllable in general; on Vercel the
  // platform sets a trustworthy value. Behind other proxies, ensure the header
  // is set by the edge and not passed through from the client.
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwardedFor || request.headers.get("x-real-ip") || "anonymous";
  return `${namespace}:${ip}`;
}

export async function rateLimit(
  request: Request,
  options: { namespace: string; limit: number; windowMs: number }
): Promise<RateLimitResult> {
  const key = getClientKey(request, options.namespace);
  const limiter = getLimiter(options.limit, options.windowMs);

  if (limiter) {
    const result = await limiter.limit(key);
    if (result.success) {
      return { allowed: true };
    }
    const retryAfterSeconds = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
    return { allowed: false, retryAfterSeconds };
  }

  return inMemoryRateLimit(key, options.limit, options.windowMs);
}
