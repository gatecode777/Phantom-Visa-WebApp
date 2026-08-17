import { Router, Request, Response } from "express";
import { formatErrorEnvelope, getRateLimitHeaders } from "../lib/middleware/api-standards.js";
import { createRefundRequest, approveRefundRequest } from "../lib/services/refunds.js";
import TransactionModel from "../models/Transaction.js";
import ApplicationModel from "../models/Application.js";

const router = Router();

/**
 * Helper to calculate GST and total pricing mathematically
 */
export function calculatePricing(consularFee: number, serviceFee: number = 2500, expressSurcharge: number = 0, discount: number = 0) {
  const taxableBase = consularFee + serviceFee;
  const cgst = Math.round(taxableBase * 0.09); // 9% CGST
  const sgst = Math.round(taxableBase * 0.09); // 9% SGST
  const igst = 0;
  const totalTax = cgst + sgst; // 18% Total GST
  const netAmount = taxableBase + totalTax + expressSurcharge - discount;
  return {
    consularFee,
    serviceFee,
    expressSurcharge,
    taxableBase,
    cgst,
    sgst,
    igst,
    totalTax,
    discount,
    netAmount
  };
}

/**
 * GET /api/v1/finance/transactions
 * Retrieve unified transactions list from MongoDB
 */
router.get("/transactions", async (req: Request, res: Response) => {
  try {
    const transactions = await TransactionModel.find().sort({ createdAt: -1 });

    const totalCount = transactions.length;
    const successfulCount = transactions.filter((t) => t.status === "Successful").length;
    const pendingCount = transactions.filter((t) => t.status === "Pending").length;
    const failedCount = transactions.filter((t) => t.status === "Failed").length;
    const refundedCount = transactions.filter((t) => t.status === "Refunded").length;

    const totalClearedCollection = transactions
      .filter((t) => t.status === "Successful")
      .reduce((sum, t) => sum + (t.pricing?.netAmount || 0), 0);

    const totalRefundedAmount = transactions
      .filter((t) => t.status === "Refunded")
      .reduce((sum, t) => sum + (t.refundDetails?.amount || t.pricing?.netAmount || 0), 0);

    return res.status(200).json({
      success: true,
      metrics: {
        total: totalCount,
        successful: successfulCount,
        pending: pendingCount,
        failed: failedCount,
        refunded: refundedCount,
        totalClearedCollection,
        totalRefundedAmount
      },
      data: transactions
    });
  } catch (error: any) {
    console.error("Get Transactions Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to fetch transactions."));
  }
});

/**
 * POST /api/v1/finance/transactions
 * Create a new transaction record in the unified ledger
 */
router.post("/transactions", async (req: Request, res: Response) => {
  try {
    const {
      applicationId,
      applicantName,
      passportNumber,
      nationality,
      country,
      visaType,
      visaCategory,
      paidBy,
      agentName,
      consularFee,
      serviceFee,
      expressSurcharge,
      discount,
      paymentMethod,
      paymentGateway,
      paymentRef,
      status,
      gstin,
      billingAddress
    } = req.body;

    const cleanAppId = String(applicationId || "").trim();
    if (!cleanAppId) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "applicationId is required."));
    }

    const numSuffix = cleanAppId.replace(/^VO-2026-/, "").replace(/[^0-9]/g, "") || String(Math.floor(1000 + Math.random() * 9000));
    const transactionId = `PAY-2026-${numSuffix}`;
    const invoiceNo = (status === "Proforma" ? "PRO" : "INV") + `-2026-${numSuffix}`;

    const pricing = calculatePricing(
      Number(consularFee || 8500),
      Number(serviceFee || 2500),
      Number(expressSurcharge || 0),
      Number(discount || 0)
    );

    const newTxn = new TransactionModel({
      transactionId,
      invoiceNo,
      applicationId: cleanAppId,
      applicantName: applicantName || "",
      passportNumber: passportNumber || "",
      nationality: nationality || "",
      country: country || "",
      visaType: visaType || "",
      visaCategory: visaCategory || "Tourist",
      paidBy: paidBy || "Applicant",
      agentName: agentName || "",
      pricing,
      paymentMethod: paymentMethod || "UPI",
      paymentGateway: paymentGateway || "Razorpay",
      paymentRef: paymentRef || `REF-${Date.now()}`,
      status: status || "Successful",
      gstin: gstin || "",
      billingAddress: billingAddress || "",
      sacCode: "998311"
    });

    await newTxn.save();

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully in unified ledger.",
      data: newTxn
    });
  } catch (error: any) {
    console.error("Create Transaction Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to create transaction."));
  }
});

/**
 * PUT /api/v1/finance/transactions/:id/status
 * Admin Action: Update status (Approve / Flag / Refund) on unified transaction record
 */
router.put("/transactions/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, refundReason, refundAmount } = req.body;

    const txn = await TransactionModel.findOne({
      $or: [{ transactionId: id }, { _id: id }]
    });

    if (!txn) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", `Transaction ${id} not found.`));
    }

    txn.status = status;
    if (status === "Refunded") {
      txn.refundDetails = {
        status: "Refunded",
        amount: Number(refundAmount || txn.pricing.netAmount),
        date: new Date().toISOString().split("T")[0],
        refNo: `RFD-${Math.floor(10000 + Math.random() * 90000)}`,
        reason: refundReason || "Approved Refund Request"
      };
      // Update invoiceNo tag to reflect refund if applicable
      txn.invoiceNo = txn.invoiceNo.replace(/^INV/, "RFD");
    }

    await txn.save();

    return res.status(200).json({
      success: true,
      message: `Transaction ${id} status updated to ${status}.`,
      data: txn
    });
  } catch (error: any) {
    console.error("Update Transaction Status Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to update status."));
  }
});

/**
 * PUT /api/v1/finance/invoices/:id/gstin
 * Applicant/Admin Action: Update GSTIN and billing details on invoice
 */
router.put("/invoices/:id/gstin", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { gstin, billingAddress } = req.body;

    if (!gstin) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "GSTIN parameter is required."));
    }

    const txn = await TransactionModel.findOne({
      $or: [{ invoiceNo: id }, { transactionId: id }, { _id: id }]
    });

    if (!txn) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", `Invoice/Transaction ${id} not found.`));
    }

    txn.gstin = String(gstin).trim().toUpperCase();
    if (billingAddress) {
      txn.billingAddress = String(billingAddress).trim();
    }

    await txn.save();

    return res.status(200).json({
      success: true,
      message: "GSTIN updated and tax invoice regenerated successfully.",
      data: txn
    });
  } catch (error: any) {
    console.error("Update GSTIN Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to update GSTIN."));
  }
});

/**
 * GET /analytics/summary
 *
 * Aggregates live data from TransactionModel and ApplicationModel.
 * This is the single source of live dynamic reporting for all 7 report pages.
 */
router.get("/analytics/summary", async (req: Request, res: Response) => {
  try {
    // ── 1. Comprehensive Payment Aggregation ──────────────────────────────────
    const paymentStatusAgg = await TransactionModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$pricing.netAmount" },
        },
      },
    ]);

    const paymentBreakdown: Record<string, { count: number; totalAmount: number }> = {
      Successful: { count: 0, totalAmount: 0 },
      Pending: { count: 0, totalAmount: 0 },
      Failed: { count: 0, totalAmount: 0 },
      Refunded: { count: 0, totalAmount: 0 },
      Proforma: { count: 0, totalAmount: 0 },
      Cancelled: { count: 0, totalAmount: 0 },
    };

    let totalTransactions = 0;
    for (const row of paymentStatusAgg) {
      if (row._id) {
        paymentBreakdown[row._id] = {
          count: row.count,
          totalAmount: row.totalAmount || 0,
        };
        totalTransactions += row.count;
      }
    }

    const successfulPayments = paymentBreakdown.Successful.count;
    const totalGrossRevenue = paymentBreakdown.Successful.totalAmount;
    const pendingPayments = paymentBreakdown.Pending.count;
    const failedPayments = paymentBreakdown.Failed.count;
    const refundedPayments = paymentBreakdown.Refunded.count;
    const refundedAmount = paymentBreakdown.Refunded.totalAmount;

    // ── 2. Revenue Sources Breakdown (From Successful Transactions) ───────────
    const feeSourcesAgg = await TransactionModel.aggregate([
      { $match: { status: "Successful" } },
      {
        $group: {
          _id: null,
          consularFee: { $sum: "$pricing.consularFee" },
          serviceFee: { $sum: "$pricing.serviceFee" },
          expressSurcharge: { $sum: "$pricing.expressSurcharge" },
          totalTax: { $sum: "$pricing.totalTax" },
          discount: { $sum: "$pricing.discount" },
          netAmount: { $sum: "$pricing.netAmount" },
        },
      },
    ]);

    const feeData = feeSourcesAgg[0] || {
      consularFee: 0,
      serviceFee: 0,
      expressSurcharge: 0,
      totalTax: 0,
      discount: 0,
      netAmount: 0,
    };

    const revenueSources = [
      { source: "Visa / Consular Fees", amount: feeData.consularFee },
      { source: "Platform Service Charges", amount: feeData.serviceFee },
      { source: "Express Processing Surcharges", amount: feeData.expressSurcharge },
      { source: "GST & Taxes Collected", amount: feeData.totalTax },
      { source: "Discounts & Promos", amount: -feeData.discount },
    ];

    // ── 3. Application Aggregation ────────────────────────────────────────────
    const appStatusAgg = await ApplicationModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const applicationBreakdown: Record<string, number> = {
      Approved: 0,
      Rejected: 0,
      Submitted: 0,
      "Docs Pending": 0,
      "Embassy Processing": 0,
      Draft: 0,
      Cancelled: 0,
    };

    let totalApplications = 0;
    for (const row of appStatusAgg) {
      if (row._id) {
        applicationBreakdown[row._id] = row.count;
        totalApplications += row.count;
      }
    }

    const approvedApps = applicationBreakdown["Approved"] || 0;
    const rejectedApps = applicationBreakdown["Rejected"] || 0;
    const pendingApps =
      (applicationBreakdown["Submitted"] || 0) +
      (applicationBreakdown["Docs Pending"] || 0) +
      (applicationBreakdown["Embassy Processing"] || 0) +
      (applicationBreakdown["Draft"] || 0);

    const approvalRate =
      totalApplications > 0
        ? parseFloat(((approvedApps / totalApplications) * 100).toFixed(1))
        : 0;

    // ── 4. Country Breakdown with Live Applications & Revenue ────────────────
    const countryAppAgg = await ApplicationModel.aggregate([
      {
        $group: {
          _id: "$countryName",
          applications: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] },
          },
          rejected: {
            $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] },
          },
          pending: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$status",
                    ["Submitted", "Docs Pending", "Embassy Processing", "Draft"],
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { applications: -1 } },
    ]);

    const countryTxnAgg = await TransactionModel.aggregate([
      { $match: { status: "Successful" } },
      {
        $group: {
          _id: "$country",
          revenue: { $sum: "$pricing.netAmount" },
        },
      },
    ]);

    const countryRevMap: Record<string, number> = {};
    for (const r of countryTxnAgg) {
      if (r._id) {
        // Strip flag emoji and whitespace to normalize matching ("Australia 🇦🇺" -> "Australia")
        const normalized = (r._id as string).replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\s]+/g, "").trim().toLowerCase();
        countryRevMap[normalized] = r.revenue;
      }
    }

    const countryBreakdown = countryAppAgg.map((c) => {
      const normalizedCountry = (c._id || "").replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\s]+/g, "").trim().toLowerCase();
      const rev = countryRevMap[normalizedCountry] || 0;
      const rate =
        c.applications > 0
          ? ((c.approved / c.applications) * 100).toFixed(1) + "%"
          : "0.0%";
      return {
        country: c._id || "Unknown",
        applications: c.applications,
        approved: c.approved,
        rejected: c.rejected,
        pending: c.pending,
        revenue: rev,
        approvalRate: rate,
      };
    });

    // ── 5. Visa Type Breakdown ────────────────────────────────────────────────
    const visaAgg = await ApplicationModel.aggregate([
      {
        $group: {
          _id: "$categoryName",
          applications: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] },
          },
          rejected: {
            $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] },
          },
          pending: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$status",
                    ["Submitted", "Docs Pending", "Embassy Processing", "Draft"],
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { applications: -1 } },
    ]);

    const visaTxnAgg = await TransactionModel.aggregate([
      { $match: { status: "Successful" } },
      {
        $group: {
          _id: "$visaCategory",
          revenue: { $sum: "$pricing.netAmount" },
        },
      },
    ]);
    const visaRevMap: Record<string, number> = {};
    for (const v of visaTxnAgg) {
      if (v._id) {
        visaRevMap[v._id.toLowerCase()] = v.revenue;
      }
    }

    const visaTypeBreakdown = visaAgg.map((v) => {
      const catKey = (v._id || "").toLowerCase();
      const rev = visaRevMap[catKey] || 0;
      const rate =
        v.applications > 0
          ? ((v.approved / v.applications) * 100).toFixed(1) + "%"
          : "0.0%";
      return {
        visaType: v._id || "General Visa",
        applications: v.applications,
        approved: v.approved,
        rejected: v.rejected,
        pending: v.pending,
        revenue: rev,
        approvalRate: rate,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        totalRevenue: totalGrossRevenue,
        netRevenue: totalGrossRevenue - refundedAmount,
        totalApplications,
        approvedApplications: approvedApps,
        rejectedApplications: rejectedApps,
        pendingApplications: pendingApps,
        approvalRate,
        totalTransactions,
        successfulPayments,
        pendingPayments,
        failedPayments,
        refundedPayments,
        refundedAmount,
        applicationBreakdown,
        paymentBreakdown,
        revenueSources,
        countryBreakdown,
        visaTypeBreakdown,
      },
    });
  } catch (error: any) {
    console.error("Analytics Summary Error:", error);
    return res.status(500).json(
      formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to compute analytics.")
    );
  }
});

/**
 * Legacy Finance compatibility endpoints
 */
router.get("/", (req: Request, res: Response) => {

  return res.status(200).json({
    invoices: [],
    commissions: []
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
        applicationId: applicationId || "VO-2026-1025",
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
        applicationId: applicationId || "VO-2026-1025",
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
