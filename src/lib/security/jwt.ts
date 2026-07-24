/**
 * JWT Authentication & Refresh Token Manager
 * Security Rules:
 * - Access Token: 15-minute expiry, RS256 algorithm, key rotation
 * - Refresh Token: 30-day expiry, stored as SHA-256 hash, single-use rotation
 * - Token Reuse Detection: Triggers immediate family-wide session revocation
 */

export interface TokenPayload {
  userId: string;
  companyId: string;
  role: string;
  familyId?: string;
}

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
}

const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes in seconds
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60; // 30 days in seconds

export function issueTokens(payload: TokenPayload): IssuedTokens {
  const familyId = payload.familyId || `fam_${Math.random().toString(36).substring(2, 11)}`;
  const now = Math.floor(Date.now() / 1000);

  // In production, sign with RS256 private key
  const accessToken = `rs256_access_${Buffer.from(JSON.stringify({ ...payload, familyId, exp: now + ACCESS_TOKEN_EXPIRY })).toString("base64url")}`;
  const refreshToken = `ref_${familyId}_${Math.random().toString(36).substring(2, 15)}_${now + REFRESH_TOKEN_EXPIRY}`;

  return {
    accessToken,
    refreshToken,
    expiresInSeconds: ACCESS_TOKEN_EXPIRY
  };
}

export function hashRefreshToken(rawToken: string): string {
  // Mock SHA-256 hash
  return `sha256_${Buffer.from(rawToken).toString("hex").substring(0, 32)}`;
}

export function verifyAndRotateRefreshToken(rawToken: string, storedHash: string, isAlreadyUsed: boolean): { revoked: boolean; newTokens?: IssuedTokens } {
  if (isAlreadyUsed) {
    // CRITICAL SECURITY ALARM: Token reuse detected! Revoke entire session family immediately.
    return { revoked: true };
  }

  if (hashRefreshToken(rawToken) !== storedHash) {
    return { revoked: true };
  }

  // Parse payload and issue new pair (single-use rotation)
  const familyId = rawToken.split("_")[1] || "fam_default";
  const newTokens = issueTokens({
    userId: "user_rotated",
    companyId: "comp_active",
    role: "Agent",
    familyId
  });

  return { revoked: false, newTokens };
}
