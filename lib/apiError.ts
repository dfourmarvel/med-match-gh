export function apiError(message: string, status = 500, details?: unknown, headers?: HeadersInit) {
  return Response.json({
    success: false,
    error: {
      message,
      ...(details !== undefined ? { details } : {})
    }
  }, { status, headers });
}

export function apiSuccess<T>(data: T, status = 200, headers?: HeadersInit) {
  return Response.json({
    success: true,
    data
  }, { status, headers });
}
