import { Router, Response } from "express";
import Applicant from "../models/Applicant.js";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth.js";
import { documentUploadFields } from "../middleware/upload.js";
import { formatErrorEnvelope } from "../lib/middleware/api-standards.js";

const router = Router();

/**
 * GET /api/v1/applicant/dashboard
 * Fetch real personalized dashboard data from MongoDB for the authenticated applicant
 */
router.get("/dashboard", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json(formatErrorEnvelope("UNAUTHORIZED", "User session unauthenticated."));
    }

    const applicant = await Applicant.findOne({ userId });

    if (!applicant) {
      return res.status(404).json(
        formatErrorEnvelope("APPLICANT_NOT_FOUND", "No applicant record found for this user account.")
      );
    }

    // Compute live dashboard metrics
    const status = applicant.status;
    const isUnderReview = ["Submitted", "Docs Uploaded", "Docs Verified", "Embassy Processing"].includes(status);
    const isApproved = status === "Approved";
    const isRejected = status === "Rejected";

    // Count pending docs
    const docs = applicant.documents || {};
    const requiredDocKeys = ["passportScan", "photo", "nationalId", "bankStatement"];
    const pendingDocsCount = requiredDocKeys.filter((key) => !docs[key as keyof typeof docs]).length;

    const unreadMessagesCount = (applicant.messages || []).filter((m: any) => m.unread).length;

    return res.status(200).json({
      success: true,
      data: {
        applicantId: applicant.applicantId,
        greetingName: applicant.personalInfo.fullName,
        metrics: {
          totalApplications: 1,
          underReview: isUnderReview ? 1 : 0,
          approvedVisas: isApproved ? 1 : 0,
          rejectedApplications: isRejected ? 1 : 0,
          pendingDocuments: pendingDocsCount,
          unreadMessages: unreadMessagesCount
        },
        application: {
          id: applicant.applicantId,
          travelerName: applicant.personalInfo.fullName,
          dob: applicant.personalInfo.dob,
          passportNumber: applicant.personalInfo.passportNo,
          passportExpiry: applicant.passportDetails.passportExpiryDate,
          nationality: applicant.personalInfo.nationality,
          destination: applicant.visaInfo.destinationCountry,
          visaType: applicant.visaInfo.visaType,
          visaCategory: applicant.visaInfo.visaCategory,
          purposeOfVisit: applicant.visaInfo.purposeOfVisit,
          entryType: applicant.visaInfo.entryType,
          durationOfStay: applicant.visaInfo.durationOfStay,
          expectedTravelDate: applicant.visaInfo.expectedTravelDate,
          preferredEmbassy: applicant.visaInfo.preferredEmbassy,
          status: applicant.status,
          fees: applicant.fees,
          submissionDate: applicant.createdAt.toISOString().split("T")[0],
          verifiedDocs: {
            passport: docs.passportScan ? "verified" : "pending",
            photo: docs.photo ? "verified" : "pending",
            nocLetter: docs.employerLetter ? "verified" : "pending",
            sponsorLetter: docs.bankStatement ? "verified" : "pending"
          },
          documents: applicant.documents,
          timeline: applicant.timeline,
          appointments: applicant.appointments,
          messages: applicant.messages
        }
      }
    });
  } catch (error: any) {
    console.error("❌ Dashboard Error:", error);
    return res.status(500).json(
      formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to fetch dashboard data.")
    );
  }
});

/**
 * POST /api/v1/applicant/documents/upload
 * Upload additional/updated documents for the authenticated applicant
 */
router.post("/documents/upload", authenticateToken, documentUploadFields, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const applicant = await Applicant.findOne({ userId });

    if (!applicant) {
      return res.status(404).json(formatErrorEnvelope("APPLICANT_NOT_FOUND", "Applicant profile not found."));
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json(formatErrorEnvelope("NO_FILES", "No document files uploaded."));
    }

    const currentDocs = applicant.documents || {};
    Object.keys(files).forEach((key) => {
      if (files[key] && files[key][0]) {
        (currentDocs as any)[key] = `/uploads/${files[key][0].filename}`;
      }
    });

    applicant.documents = currentDocs;
    if (applicant.status === "Submitted") {
      applicant.status = "Docs Uploaded";
    }

    await applicant.save();

    return res.status(200).json({
      success: true,
      message: "Document(s) uploaded successfully.",
      documents: applicant.documents
    });
  } catch (error: any) {
    return res.status(500).json(
      formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to upload document.")
    );
  }
});

export default router;
