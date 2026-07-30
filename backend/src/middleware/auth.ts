import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../lib/security/jwt.js";
import { formatErrorEnvelope } from "../lib/middleware/api-standards.js";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json(formatErrorEnvelope("UNAUTHORIZED", "Access token missing. Please log in."));
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return res.status(403).json(formatErrorEnvelope("INVALID_TOKEN", "Access token expired or invalid."));
  }

  req.user = payload;
  next();
}
