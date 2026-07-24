/**
 * Idempotency Middleware
 * Prevents duplicate processing of financial or document transactions.
 * Requires `Idempotency-Key` header on POST/PATCH endpoints.
 */

interface CachedResponse {
  statusCode: number;
  body: any;
  createdAt: number;
}

const idempotencyStore = new Map<string, CachedResponse>();
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function processIdempotentRequest(
  key: string | null,
  method: string,
  executeHandler: () => Promise<{ statusCode: number; body: any }> | { statusCode: number; body: any }
): Promise<{ statusCode: number; body: any; isCached: boolean }> {
  // Idempotency applies to POST / PATCH requests
  if (method !== "POST" && method !== "PATCH") {
    const res = await executeHandler();
    return { ...res, isCached: false };
  }

  if (!key) {
    return {
      statusCode: 400,
      body: {
        error: {
          code: "IDEMPOTENCY_KEY_REQUIRED",
          message: "Idempotency-Key header is mandatory for money or document modifying operations.",
          details: { header: "Idempotency-Key" }
        }
      },
      isCached: false
    };
  }

  if (idempotencyStore.has(key)) {
    const cached = idempotencyStore.get(key)!;
    if (Date.now() - cached.createdAt < IDEMPOTENCY_TTL_MS) {
      return { statusCode: cached.statusCode, body: cached.body, isCached: true };
    }
    idempotencyStore.delete(key);
  }

  const result = await executeHandler();
  if (result.statusCode >= 200 && result.statusCode < 300) {
    idempotencyStore.set(key, {
      statusCode: result.statusCode,
      body: result.body,
      createdAt: Date.now()
    });
  }

  return { ...result, isCached: false };
}
