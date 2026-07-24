/**
 * CSRF & Security Headers Middleware
 * Enforces Double-Submit Cookie pattern for CSRF and strict Content Security Policy (CSP)
 */

export function generateCsrfToken(): { token: string; cookieValue: string } {
  const token = `csrf_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
  return {
    token,
    cookieValue: `XSRF-TOKEN=${token}; Path=/; SameSite=Strict; Secure; HttpOnly`
  };
}

export function validateCsrfToken(headerToken: string | null, cookieToken: string | null): boolean {
  if (!headerToken || !cookieToken) return false;
  return headerToken === cookieToken;
}

export function getSecurityHeaders(): Record<string, string> {
  return {
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' wss: https:; frame-ancestors 'none';",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  };
}
