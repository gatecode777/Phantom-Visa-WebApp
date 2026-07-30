import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "phantom_visa_jwt_secret_key_2026_super_secure";
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

export interface TokenPayload {
  userId: string;
  role: string;
  phone: string;
  applicantId?: string;
}

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
}

export function issueTokens(payload: TokenPayload): IssuedTokens {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = crypto.randomBytes(40).toString("hex");

  return {
    accessToken,
    refreshToken,
    expiresInSeconds: 15 * 60
  };
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function hashRefreshToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export function getRefreshTokenExpiry(): Date {
  const date = new Date();
  date.setDate(date.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
  return date;
}
