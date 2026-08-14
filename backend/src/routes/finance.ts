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
 * Seed canonical default transactions tied to default applications if DB is empty
 */
async function seedDefaultTransactions() {
  try {
    const count = await TransactionModel.countDocuments();
    if (count > 0) return;

    const defaultTxns = [
      {
        transactionId: "PAY-2026-1025",
        invoiceNo: "INV-2026-1025",
        applicationId: "VO-2026-1025",
        applicantName: "Geeta Sharma",
        passportNumber: "Z9817264",
        nationality: "Indian",
        country: "Australia 🇦🇺",
        visaType: "Subclass 600 Tourist Visa",
        visaCategory: "Tourist",
        paidBy: "Applicant",
        pricing: calculatePricing(12500, 2500, 2000, 1000),
        paymentMethod: "Credit Card (Visa •••• 8892)",
        paymentGateway: "Razorpay",
        paymentRef: "RAZOR-9817264-AU",
        status: "Successful",
        gstin: "27AAACG1234H1Z5",
        billingAddress: "104, Park Street, Connaught Place, New Delhi - 110001",
        sacCode: "998311"
      },
      {
        transactionId: "PAY-2026-9841",
        invoiceNo: "INV-2026-9841",
        applicationId: "VO-2026-9841",
        applicantName: "Geeta Sharma",
        passportNumber: "Z9817264",
        nationality: "Indian",
        country: "Canada 🇨🇦",
        visaType: "Canada Express Visitor Visa",
        visaCategory: "Tourist",
        paidBy: "Applicant",
        pricing: calculatePricing(8500, 2500, 2000, 0),
        paymentMethod: "UPI Instant (Google Pay)",
        paymentGateway: "Razorpay",
        paymentRef: "UPI-481920-CA",
        status: "Successful",
        gstin: "27AAACG1234H1Z5",
        billingAddress: "104, Park Street, Connaught Place, New Delhi - 110001",
        sacCode: "998311"
      },
      {
        transactionId: "PAY-2026-1229",
        invoiceNo: "INV-2026-1229",
        applicationId: "VO-2026-1229",
        applicantName: "Vikram Mehta",
        passportNumber: "Z4481920",
        nationality: "Indian",
        country: "Australia 🇦🇺",
        visaType: "Subclass 600 Tourist Visa",
        visaCategory: "Tourist",
        paidBy: "Applicant",
        pricing: calculatePricing(12500, 2500, 2000, 1000),
        paymentMethod: "Credit Card (MasterCard)",
        paymentGateway: "Stripe",
        paymentRef: "PAY-STP-33445566",
        status: "Successful",
        gstin: "27BBBBB1111B1Z2",
        billingAddress: "45, Residency Road, Bengaluru - 560025",
        sacCode: "998311"
      },
      {
        transactionId: "PAY-2026-0814",
        invoiceNo: "PRO-2026-0814",
        applicationId: "VO-2026-0814",
        applicantName: "Amitabh Patel",
        passportNumber: "P8812301",
        nationality: "Indian",
        country: "United Kingdom 🇬🇧",
        visaType: "Standard Visitor 6 Months",
        visaCategory: "Tourist",
        paidBy: "Applicant",
        pricing: calculatePricing(11000, 2500, 0, 500),
        paymentMethod: "Net Banking (HDFC)",
        paymentGateway: "HDFC Netbanking",
        paymentRef: "NETB-391827-UK",
        status: "Pending",
        gstin: "27AAACG1234H1Z5",
        billingAddress: "12, Marine Drive, Mumbai - 400020",
        sacCode: "998311"
      },
      {
        transactionId: "PAY-2026-0720",
        invoiceNo: "PRO-2026-0720",
        applicationId: "VO-2026-0720",
        applicantName: "Priya Sundaram",
        passportNumber: "K9928172",
        nationality: "Indian",
        country: "United States 🇺🇸",
        visaType: "B1/B2 Tourist Visitor",
        visaCategory: "Tourist",
        paidBy: "Applicant",
        pricing: calculatePricing(15000, 2500, 0, 0),
        paymentMethod: "Awaiting Checkout",
        paymentGateway: "Razorpay",
        paymentRef: "UNPAID",
        status: "Proforma",
        gstin: "27AAACG1234H1Z5",
        billingAddress: "88, T. Nagar, Chennai - 600017",
        sacCode: "998311"
      },
      {
        transactionId: "PAY-2026-0650",
        invoiceNo: "INV-2026-0650",
        applicationId: "VO-2026-0650",
        applicantName: "Vikram Malhotra",
        passportNumber: "S8817263",
        nationality: "Indian",
        country: "Canada 🇨🇦",
        visaType: "Visitor Visa V-1",
        visaCategory: "Tourist",
        paidBy: "Applicant",
        pricing: calculatePricing(13000, 2500, 0, 0),
        paymentMethod: "Wallet Balance (Prepaid)",
        paymentGateway: "Prepaid Wallet",
        paymentRef: "WLT-RFD-55102",
        status: "Refunded",
        gstin: "27AAACG1234H1Z5",
        billingAddress: "104, Park Street, New Delhi - 110001",
        sacCode: "998311",
        refundDetails: {
          status: "Refunded",
          amount: 18290, // Full fee + tax refunded
          date: new Date().toISOString().split("T")[0],
          refNo: "RFD-55102",
          reason: "Refusal Clause 4.1 Platform Refund Guarantee"
        }
      }
    ];

    await TransactionModel.insertMany(defaultTxns);
  } catch (err) {
    console.error("Failed to seed default transactions:", err);
  }
}

/**
 * GET /api/v1/finance/transactions
 * Retrieve unified transactions list from MongoDB
 */
router.get("/transactions", async (req: Request, res: Response) => {
  try {
    await seedDefaultTransactions();
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
      applicantName: applicantName || "Applicant",
      passportNumber: passportNumber || "Z9817264",
      nationality: nationality || "Indian",
      country: country || "Canada 🇨🇦",
      visaType: visaType || "Express Visitor Visa",
      visaCategory: visaCategory || "Tourist",
      paidBy: paidBy || "Applicant",
      agentName: agentName || "",
      pricing,
      paymentMethod: paymentMethod || "UPI Instant (Google Pay)",
      paymentGateway: paymentGateway || "Razorpay",
      paymentRef: paymentRef || `RAZOR-${passportNumber || "9817264"}-PAY`,
      status: status || "Successful",
      gstin: gstin || "27AAACG1234H1Z5",
      billingAddress: billingAddress || "104, Park Street, Connaught Place, New Delhi - 110001",
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
 * Legacy Finance compatibility endpoints
 */
router.get("/", (req: Request, res: Response) => {
  const headers = getRateLimitHeaders("Growth");
  res.set(headers);
  return res.status(200).json({
    invoices: [
      { id: "INV-2026-1025", amount: 16700, tax: 2700, status: "issued", date: "2026-08-07" }
    ],
    commissions: [
      { id: "COM-991", applicationId: "VO-2026-1025", amount: 3750, status: "paid" }
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
