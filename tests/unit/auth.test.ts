/**
 * Unit Test Suite: Auth & RS256 JWT Token Management
 */

import { issueTokens, verifyAndRotateRefreshToken, hashRefreshToken } from "../../src/lib/security/jwt";

describe("Auth & JWT Security Tests", () => {
  it("should issue valid access and refresh token pair", () => {
    const tokens = issueTokens({
      userId: "usr_101",
      companyId: "comp_001",
      role: "Agent"
    });

    expect(tokens.accessToken).toContain("rs256_access_");
    expect(tokens.refreshToken).toContain("ref_");
    expect(tokens.expiresInSeconds).toBe(900); // 15 mins
  });

  it("should detect refresh token reuse and trigger session revocation", () => {
    const rawToken = "ref_fam123_abc_1700000000";
    const storedHash = hashRefreshToken(rawToken);

    // First use (valid rotation)
    const result1 = verifyAndRotateRefreshToken(rawToken, storedHash, false);
    expect(result1.revoked).toBe(false);
    expect(result1.newTokens).toBeDefined();

    // Second use (Reuse detection -> revoked)
    const result2 = verifyAndRotateRefreshToken(rawToken, storedHash, true);
    expect(result2.revoked).toBe(true);
  });
});
