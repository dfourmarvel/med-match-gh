const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  request: Request,
  options: { namespace: string; limit: number; windowMs: number }
): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwardedFor || request.headers.get("x-real-ip") || "anonymous";
  const key = `${options.namespace}:${ip}`;
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true };
  }

  if (current.count >= options.limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000)
    };
  }

  current.count += 1;
  return { allowed: true };
}
