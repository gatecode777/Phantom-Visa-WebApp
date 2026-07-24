import { Router, Request, Response } from "express";
import { issueTokens } from "../lib/security/jwt.js";
import { formatErrorEnvelope, getRateLimitHeaders } from "../lib/middleware/api-standards.js";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  const headers = getRateLimitHeaders("Growth");
  res.set(headers);
  try {
    const { action, email, password } = req.body;

    if (action === "login") {
      if (!email || !password) {
        return res.status(400).json(
          formatErrorEnvelope("INVALID_CREDENTIALS", "Email and password are required.")
        );
      }

      const tokens = issueTokens({
        userId: "usr_991823",
        companyId: "comp_001",
        role: "Agent"
      });

      return res.status(200).json({
        success: true,
        message: "Authentication successful",
        data: {
          user: { id: "usr_991823", email, role: "Agent" },
          tokens
        }
      });
    }

    if (action === "register") {
      return res.status(201).json({
        success: true,
        message: "User account created. OTP sent for verification."
      });
    }

    return res.status(400).json(
      formatErrorEnvelope("UNKNOWN_AUTH_ACTION", "Supported actions: login, register, verify-otp, refresh, logout.")
    );
  } catch (error: any) {
    return res.status(500).json(
      formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "An unexpected error occurred")
    );
  }
});

router.get("/", (req: Request, res: Response) => {
  const headers = getRateLimitHeaders("Growth");
  res.set(headers);
  return res.status(200).json({
    sessions: [
      {
        id: "sess_001",
        ipAddress: "192.168.1.45",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        isActive: true,
        createdAt: "2026-07-23T10:00:00Z"
      }
    ]
  });
});

export default router;
