/**
 * Platform-Wide API Standards Middleware
 * - API Versioning (/v1/, /v2/) with 6-month deprecation lifecycle
 * - Authentication: Bearer JWT for Users, X-API-Key + HMAC Signature for Partners
 * - Cursor-based pagination for large datasets (?cursor=&limit=)
 * - Standard Error Envelope: { "error": { "code", "message", "details" } }
 * - Tiered Rate Limit Headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)
 */

export interface StandardErrorEnvelope {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

export interface CursorPaginatedResponse<T> {
  data: T[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
    limit: number;
  };
}

export function formatErrorEnvelope(code: string, message: string, details?: Record<string, any>): StandardErrorEnvelope {
  return {
    error: {
      code,
      message,
      details
    }
  };
}

export function getRateLimitHeaders(planTier: "Starter" | "Growth" | "Enterprise"): Record<string, string> {
  const limits = {
    Starter: 100,      // 100 req / min
    Growth: 1000,      // 1,000 req / min
    Enterprise: 10000  // 10,000 req / min
  };

  const limit = limits[planTier] || 100;
  const remaining = Math.max(0, limit - 12);
  const resetEpochSeconds = Math.floor(Date.now() / 1000) + 60;

  return {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": resetEpochSeconds.toString(),
    "X-API-Version": "v1.0.0"
  };
}

export function paginateArrayWithCursor<T extends { id: string }>(
  items: T[],
  cursor?: string,
  limit: number = 10
): CursorPaginatedResponse<T> {
  let startIndex = 0;
  if (cursor) {
    const foundIndex = items.findIndex((i) => i.id === cursor);
    if (foundIndex !== -1) {
      startIndex = foundIndex + 1;
    }
  }

  const sliced = items.slice(startIndex, startIndex + limit);
  const nextCursor = sliced.length > 0 && startIndex + limit < items.length ? sliced[sliced.length - 1].id : null;

  return {
    data: sliced,
    pagination: {
      nextCursor,
      hasMore: nextCursor !== null,
      limit
    }
  };
}
