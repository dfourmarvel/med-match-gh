// API-6: every response is per-request/user data (quiz results, AI guidance),
// so responses must never be cached by browsers, CDNs, or shared proxies.
function withNoStore(headers?: HeadersInit): Headers {
  const merged = new Headers(headers);
  merged.set("Cache-Control", "private, no-store");
  return merged;
}

export function apiError(message: string, status = 500, details?: unknown, headers?: HeadersInit) {
  return Response.json({
    success: false,
    error: {
      message,
      ...(details !== undefined ? { details } : {})
    }
  }, { status, headers: withNoStore(headers) });
}

export function apiSuccess<T>(data: T, status = 200, headers?: HeadersInit) {
  return Response.json({
    success: true,
    data
  }, { status, headers: withNoStore(headers) });
}
