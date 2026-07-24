import { Router, Request, Response } from "express";
import { formatErrorEnvelope, getRateLimitHeaders } from "../lib/middleware/api-standards.js";
import { createRefundRequest, approveRefundRequest } from "../lib/services/refunds.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const headers = getRateLimitHeaders("Growth");
  res.set(headers);
  return res.status(200).json({
    invoices: [
      { id: "INV-2026-001", amount: 13280, tax: 2390, status: "issued", date: "2026-07-20" }
    ],
    commissions: [
      { id: "COM-991", applicationId: "PV-2026-0041", amount: 1500, status: "paid" }
    ]
  });
});

router.post("/", (req: Request, res: Response) => {
  const headers = getRateLimitHeaders("Growth");
  res.set(headers);
  try {
    const { action, amount, applicationId, reason, approverUserId, approverUserRole } = req.body;

    if (action === "request_refund") {
      const refund = createRefundRequest({
        companyId: "comp_001",
        applicationId: applicationId || "PV-2026-0041",
        amount: amount || 600,
        initiatedByUserId: "agent_usr_01",
        initiatedByUserRole: "Agent",
        reason: reason || "Customer flight cancellation"
      });

      return res.status(201).json({
        success: true,
        message: refund.requiresMakerChecker
          ? "Refund request created. Higher threshold (> $500) requires maker-checker dual approval."
          : "Refund auto-approved.",
        refund
      });
    }

    if (action === "approve_refund") {
      const dummyRefund = createRefundRequest({
        companyId: "comp_001",
        applicationId: applicationId || "PV-2026-0041",
        amount: amount || 600,
        initiatedByUserId: "agent_usr_01",
        initiatedByUserRole: "Agent",
        reason: "Customer flight cancellation"
      });

      const approval = approveRefundRequest(
        dummyRefund,
        approverUserId || "supervisor_usr_99",
        approverUserRole || "Staff"
      );

      if (!approval.success) {
        return res.status(400).json(
          formatErrorEnvelope("REFUND_APPROVAL_FAILED", approval.error!)
        );
      }

      return res.status(200).json({
        success: true,
        message: "Refund approved successfully",
        refund: approval.updatedRequest
      });
    }

    return res.status(400).json(
      formatErrorEnvelope("INVALID_ACTION", "Supported actions: request_refund, approve_refund")
    );
  } catch (error: any) {
    return res.status(500).json(
      formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Finance action failed")
    );
  }
});

export default router;
