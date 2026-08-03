import { Router, Request, Response } from "express";
import Applicant from "../models/Applicant.js";
import User from "../models/User.js";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth.js";
import { documentUploadFields } from "../middleware/upload.js";
import { formatErrorEnvelope } from "../lib/middleware/api-standards.js";

const router = Router();

/**
 * GET /api/v1/applicant/all
 * Admin Endpoint: Fetch all registered applicants from MongoDB with user details & live metrics
 */
router.get("/all", async (req: Request, res: Response) => {
  try {
    const applicants = await Applicant.find({}).sort({ createdAt: -1 });
    const users = await User.find({});
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const now = Date.now();
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

    let activeCount = 0;
    let blockedCount = 0;
    let newRegistrationsCount = 0;

    const records = applicants.map((app) => {
      const u = app.userId ? userMap.get(app.userId.toString()) : null;
      const isBlocked = !!u?.isDeactivated;
      
      if (isBlocked) {
        blockedCount++;
      } else {
        activeCount++;
      }

      const createdTime = new Date(app.createdAt).getTime();
      if (now - createdTime <= SEVEN_DAYS_MS) {
        newRegistrationsCount++;
      }

      const formattedDate = new Date(app.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });

      return {
        id: app.applicantId,
        _id: app._id.toString(),
        userId: app.userId ? app.userId.toString() : null,
        name: app.personalInfo?.fullName || `${app.personalInfo?.firstName || ""} ${app.personalInfo?.lastName || ""}`.trim() || "Applicant",
        email: app.personalInfo?.email || u?.email || "N/A",
        mobile: app.personalInfo?.phone || u?.phone || "N/A",
        country: app.visaInfo?.destinationCountry || app.personalInfo?.country || "Canada",
        flag: "🇨🇦",
        totalApplications: 1,
        status: isBlocked ? "Blocked" : (app.status === "Submitted" ? "Active" : app.status || "Active"),
        isDeactivated: isBlocked,
        registeredOn: formattedDate,
        rawCreatedAt: app.createdAt,
        dob: app.personalInfo?.dob || "N/A",
        gender: app.personalInfo?.gender || "N/A",
        nationality: app.personalInfo?.nationality || "Indian",
        passportNumber: app.personalInfo?.passportNo || "N/A",
        passportExpiry: app.passportDetails?.passportExpiryDate || "N/A",
        address: `${app.personalInfo?.address || ""}, ${app.personalInfo?.city || ""}, ${app.personalInfo?.state || ""}`.replace(/^,\s*|,\s*$/g, "") || "N/A",
        currentVisa: app.visaInfo?.visaCategory || "Tourist Visa",
        visaType: app.visaInfo?.visaType || "Express Tourist",
        destinationCountry: app.visaInfo?.destinationCountry || "Canada",
        applicationStatus: app.status || "Submitted",
        assignedAgent: "Consular Review Officer",
        processingStage: app.status || "Submitted",
        documents: {
          passport: !!app.documents?.passportScan,
          photograph: !!app.documents?.photo,
          bankStatement: !!app.documents?.bankStatement,
          invitationLetter: !!app.documents?.nationalId
        },
        timeline: app.timeline || []
      };
    });

    return res.status(200).json({
      success: true,
      metrics: {
        totalApplicants: records.length,
        activeApplicants: activeCount,
        newRegistrations: newRegistrationsCount,
        blockedApplicants: blockedCount
      },
      data: records
    });
  } catch (error: any) {
    console.error("❌ Admin fetch applicants error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * POST /api/v1/applicant/toggle-block
 * Toggle active/blocked status for a user in MongoDB
 */
router.post("/toggle-block", async (req: Request, res: Response) => {
  try {
    const { userId, applicantId, isDeactivated } = req.body;

    if (!userId && !applicantId) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "User ID or Applicant ID is required."));
    }

    let targetUserId = userId;

    if (!targetUserId && applicantId) {
      const app = await Applicant.findOne({ applicantId });
      if (app) targetUserId = app.userId;
    }

    if (targetUserId) {
      await User.findByIdAndUpdate(targetUserId, { isDeactivated: !!isDeactivated });
    }

    return res.status(200).json({
      success: true,
      message: `Applicant status updated to ${isDeactivated ? "Blocked" : "Active"}.`
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * DELETE /api/v1/applicant/:id
 * Delete applicant record and associated user from MongoDB
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const app = await Applicant.findById(id);
    if (!app) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Applicant record not found."));
    }

    if (app.userId) {
      await User.findByIdAndDelete(app.userId);
    }

    await Applicant.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Applicant record deleted successfully."
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

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
