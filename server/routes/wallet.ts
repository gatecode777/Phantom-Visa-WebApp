import { Router, Request, Response } from "express";
import { formatErrorEnvelope, getRateLimitHeaders } from "../../src/lib/middleware/api-standards.js";
import { processIdempotentRequest } from "../../src/lib/middleware/idempotency.js";
import { executeAtomicWalletDebitAndStatusChange } from "../../src/lib/services/wallet.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const headers = getRateLimitHeaders("Growth");
  res.set(headers);
  return res.status(200).json({
    wallet: {
      companyId: "comp_001",
      currency: "INR",
      balance: 45000,
      creditLimit: 100000,
      availableFunds: 145000
    }
  });
});

router.post("/", async (req: Request, res: Response) => {
  const headers = getRateLimitHeaders("Growth");
  res.set(headers);
  const idempotencyKey = (req.headers["idempotency-key"] as string) || null;

  try {
    const { action, amount, applicationId } = req.body;

    const result = await processIdempotentRequest(idempotencyKey, "POST", async () => {
      if (action === "recharge") {
        return {
          statusCode: 200,
          body: {
            success: true,
            message: "Wallet recharge initiated",
            newBalance: 45000 + (amount || 10000),
            transactionRef: `RECH_${Date.now()}`
          }
        };
      }

      if (action === "debit") {
        const debitResult = await executeAtomicWalletDebitAndStatusChange({
          companyId: "comp_001",
          applicationId: applicationId || "PV-2026-0041",
          debitAmount: amount || 13280,
          newStatus: "Submitted",
          description: "Visa submission fee deduction"
        });

        return {
          statusCode: debitResult.success ? 200 : 400,
          body: debitResult
        };
      }

      return {
        statusCode: 400,
        body: formatErrorEnvelope("INVALID_ACTION", "Supported actions: recharge, debit, credit-limit")
      };
    });

    return res.status(result.statusCode).json(result.body);
  } catch (error: any) {
    return res.status(500).json(
      formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Wallet transaction failure")
    );
  }
});

export default router;
