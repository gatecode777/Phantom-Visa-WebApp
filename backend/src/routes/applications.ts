import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import multer from "multer";
import ApplicationModel from "../models/Application.js";
import AgentModel from "../models/Agent.js";
import CountryModel from "../models/Country.js";
import VisaTypeModel from "../models/VisaType.js";
import VisaRequirementModel from "../models/VisaRequirement.js";
import TransactionModel from "../models/Transaction.js";
import { calculatePricing } from "./finance.js";
import imagekit from "../lib/imagekit.js";
import { formatErrorEnvelope } from "../lib/middleware/api-standards.js";
import { verifyAccessToken, TokenPayload } from "../lib/security/jwt.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

function deduplicateRequirementDocuments(documents: any[] = []) {
  const unique = new Map<string, any>();
  for (const document of documents) {
    const key = String(document.requirementId || document.title || "").trim().toLowerCase();
    if (!key) continue;
    // Later values represent a re-upload/update of the same requirement slot.
    unique.set(key, document);
  }
  return Array.from(unique.values());
}

/**
 * POST /api/v1/applications/upload-doc
 * Upload applicant requirement document to ImageKit with base64 data-URI fallback
 */
router.post("/upload-doc", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "No file uploaded."));
    }

    const folder = req.body.folder || "/PHANTOM-VISA/applications/documents/";
    const fileBase64 = req.file.buffer.toString("base64");
    const sanitizedOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${Date.now()}_${sanitizedOriginalName}`;

    let uploadedUrl = "";
    let fileId = `file_${Date.now()}`;

    try {
      const result = await imagekit.upload({
        file: fileBase64,
        fileName,
        folder
      });
      uploadedUrl = result.url;
      fileId = result.fileId;
    } catch (ikErr: any) {
      console.warn("⚠️ ImageKit upload failed, falling back to base64 data-URL:", ikErr?.message || ikErr);
      uploadedUrl = `data:${req.file.mimetype};base64,${fileBase64}`;
    }

    return res.status(200).json({
      success: true,
      message: "Document uploaded successfully.",
      data: {
        url: uploadedUrl,
        fileId: fileId,
        fileName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error: any) {
    console.error("Application doc upload error:", error);
    return res.status(500).json(formatErrorEnvelope("UPLOAD_ERROR", error.message || "Failed to upload document."));
  }
});

/**
 * GET /api/v1/applications
 * Retrieve visa applications scoped by Agent assignment, Available Pool, or Global Admin view
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    // Inspect Authorization Token if provided
    let tokenUser: TokenPayload | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      tokenUser = verifyAccessToken(authHeader.slice(7));
    }

    const { agentId, pool, status, search } = req.query as {
      agentId?: string;
      pool?: string;
      status?: string;
      search?: string;
    };

    const queryFilters: any[] = [];

    // Determine target Agent ID from query param or verified Agent token
    const effectiveAgentId = agentId || (tokenUser?.role === "Agent" ? tokenUser.agentId || tokenUser.userId : undefined);

    if (pool === "available") {
      // Unassigned / general pickup pool
      queryFilters.push({
        $or: [
          { assignedAgentId: { $in: ["", null, "Auto-assign / None"] } },
          { assignedAgentId: { $exists: false } }
        ]
      });
    } else if (effectiveAgentId) {
      // Agent-scoped assigned workload query
      queryFilters.push({
        $or: [
          { assignedAgentId: effectiveAgentId },
          { assignedAgentName: { $regex: effectiveAgentId, $options: "i" } }
        ]
      });
    } else if (tokenUser?.role === "Applicant") {
      // Applicant-scoped query
      queryFilters.push({
        $or: [
          { userId: tokenUser.userId },
          { "personalDetails.phone": tokenUser.phone }
        ]
      });
    }

    // Status filter
    if (status && status !== "All") {
      if (status === "New" || status === "Submitted") {
        queryFilters.push({ status: "Submitted" });
      } else if (status === "Under Review" || status === "Docs Pending" || status === "In Review") {
        queryFilters.push({ status: { $in: ["Under Review", "Docs Pending", "Embassy Processing"] } });
      } else {
        queryFilters.push({ status: { $regex: new RegExp(`^${status}$`, "i") } });
      }
    }

    // Keyword Search filter
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      queryFilters.push({
        $or: [
          { applicationId: searchRegex },
          { "personalDetails.givenName": searchRegex },
          { "personalDetails.surname": searchRegex },
          { "passportDetails.passportNo": searchRegex },
          { countryName: searchRegex },
          { visaTypeName: searchRegex }
        ]
      });
    }

    const finalQuery = queryFilters.length > 0 ? { $and: queryFilters } : {};
    const applications = await ApplicationModel.find(finalQuery).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      scope: pool === "available" ? "available_pool" : effectiveAgentId ? `agent_${effectiveAgentId}` : "global",
      data: applications
    });
  } catch (error: any) {
    console.error("Get Applications Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to fetch applications."));
  }
});

/**
 * PUT /api/v1/applications/:id/assign
 * Assign an application to an agent (or claim from Available Pool)
 */
router.put("/:id/assign", async (req: Request, res: Response) => {
  try {
    const targetId = String(req.params.id);
    const { agentId, agentName } = req.body;

    const queryConditions: any[] = [{ applicationId: targetId }];
    if (mongoose.Types.ObjectId.isValid(targetId)) {
      queryConditions.push({ _id: targetId });
    }

    let finalAgentId = agentId ? String(agentId).trim() : "";
    let finalAgentName = agentName ? String(agentName).trim() : "";

    if (finalAgentId && finalAgentId !== "unassign" && finalAgentId !== "none" && finalAgentId !== "None") {
      if (!finalAgentName) {
        const foundAgent = await AgentModel.findOne({ agentId: finalAgentId });
        if (foundAgent) {
          finalAgentName = foundAgent.agencyName
            ? foundAgent.agencyName
            : (foundAgent.fullName || foundAgent.firstName || finalAgentId);
        } else {
          finalAgentName = finalAgentId;
        }
      }
    } else {
      finalAgentId = "";
      finalAgentName = "";
    }

    const application = await ApplicationModel.findOneAndUpdate(
      { $or: queryConditions },
      {
        $set: {
          assignedAgentId: finalAgentId,
          assignedAgentName: finalAgentName,
          ...(finalAgentId ? { status: "Under Review" } : {})
        }
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Application record not found."));
    }

    return res.status(200).json({
      success: true,
      message: finalAgentId
        ? `Application ${application.applicationId} successfully assigned to ${application.assignedAgentName}.`
        : `Application ${application.applicationId} unassigned successfully.`,
      data: application
    });
  } catch (error: any) {
    console.error("Assign Application Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to assign application."));
  }
});

/**
 * GET /api/v1/applications/:id
 * Retrieve a single application by ID or applicationId
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const targetId = String(req.params.id);
    const queryConditions: any[] = [{ applicationId: targetId }];
    if (mongoose.Types.ObjectId.isValid(targetId)) {
      queryConditions.push({ _id: targetId });
    }

    const application = await ApplicationModel.findOne({ $or: queryConditions });

    if (!application) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Application record not found."));
    }

    return res.status(200).json({
      success: true,
      data: application
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Error fetching application."));
  }
});

/**
 * POST /api/v1/applications/submit
 * Create & Save a fully validated Visa Application into MongoDB
 */
router.post("/submit", async (req: Request, res: Response) => {
  try {
    const {
      countryName,
      countryCode,
      categoryName,
      visaTypeName,
      processingSpeed,
      entryType,
      stayValidity,
      personalDetails,
      travelDetails,
      passportDetails,
      employmentDetails,
      uploadedDocuments,
      coTravelers,
      pricing,
      assignedAgentId,
      assignedAgentName
    } = req.body;

    const errors: Record<string, string> = {};

    // 1. Basic Fields Validation
    if (!countryName) errors.countryName = "Destination Country is required.";
    if (!categoryName) errors.categoryName = "Visa Category is required.";
    if (!visaTypeName) errors.visaTypeName = "Visa Subclass / Type is required.";

    // 2. Personal Details Validation
    if (!personalDetails?.givenName) errors.givenName = "Given / First Name is required.";
    if (!personalDetails?.surname) errors.surname = "Surname / Last Name is required.";
    if (!personalDetails?.dob) errors.dob = "Date of birth is required.";
    
    // Provide sensible defaults for optional contact fields
    const safePersonalDetails = {
      ...personalDetails,
      phone: personalDetails?.phone || "+91 98765 43210",
      email: personalDetails?.email || "applicant@phantomvisa.com"
    };

    // 3. Travel Dates Validation
    if (!travelDetails?.travelDate) errors.travelDate = "Intended departure date is required.";
    if (!travelDetails?.returnDate) errors.returnDate = "Intended return date is required.";

    if (travelDetails?.travelDate && travelDetails?.returnDate) {
      const departure = new Date(travelDetails.travelDate);
      const returnD = new Date(travelDetails.returnDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (departure < today) {
        errors.travelDate = "Departure date cannot be in the past.";
      }
      if (returnD <= departure) {
        errors.returnDate = "Return date must be after departure date.";
      } else if (visaTypeName) {
        const vtObj = await VisaTypeModel.findOne({ name: visaTypeName });
        if (vtObj && vtObj.maxStayDays) {
          const tripDays = Math.ceil((returnD.getTime() - departure.getTime()) / (1000 * 60 * 60 * 24));
          if (tripDays > vtObj.maxStayDays) {
            errors.returnDate = `Selected travel duration (${tripDays} days) exceeds the maximum allowed stay limit of ${vtObj.maxStayDays} days for ${visaTypeName}.`;
          }
        }
      }
    }

    // 4. Passport Expiry Validation (Must be >= 6 months after return date)
    if (!passportDetails?.passportNo) errors.passportNo = "Passport number is required.";
    if (!passportDetails?.expiryDate) {
      errors.passportExpiry = "Passport expiry date is required.";
    } else if (travelDetails?.returnDate) {
      const expiry = new Date(passportDetails.expiryDate);
      const returnD = new Date(travelDetails.returnDate);
      const sixMonthsAfterReturn = new Date(returnD);
      sixMonthsAfterReturn.setMonth(sixMonthsAfterReturn.getMonth() + 6);

      if (expiry < sixMonthsAfterReturn) {
        errors.passportExpiry = `Passport must be valid for at least 6 months beyond intended return date (${sixMonthsAfterReturn.toISOString().split("T")[0]}).`;
      }
    }

    // 5. Mandatory Documents Upload Verification
    if (Array.isArray(uploadedDocuments)) {
      for (const doc of uploadedDocuments) {
        if (doc.isMandatory && (!doc.fileUrl || doc.fileUrl.trim() === "")) {
          errors[`doc_${doc.title}`] = `Mandatory document "${doc.title}" must be uploaded.`;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Application form has validation errors.", errors));
    }

    // Server-side Pricing Calculation
    let consularFee = 8500; // Default base fee
    const country = await CountryModel.findOne({ name: countryName });
    if (country && country.startingFee) {
      consularFee = country.startingFee;
    }

    const platformFee = 2500;
    const speed = processingSpeed || "express";
    const expressSurcharge = speed === "express" ? 2000 : speed === "vip" ? 4000 : 0;
    const promoCode = pricing?.promoCode || "";
    const promoDiscount = promoCode.toUpperCase() === "WELCOME10" ? 1000 : 0;

    const calculatedTotal = consularFee + platformFee + expressSurcharge - promoDiscount;

    // Auto-assign Agent by Destination Country if applicant didn't select an agent
    let finalAgentId = (assignedAgentId || "").trim();
    let finalAgentName = (assignedAgentName || "").trim();

    if (!finalAgentId || finalAgentId === "Auto-assign / None" || finalAgentId === "None" || finalAgentId === "unassigned") {
      try {
        const countryRegex = new RegExp(`^${countryName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
        const eligibleAgents = await AgentModel.find({
          status: "Active",
          supportedVisaCountries: {
            $elemMatch: { $regex: countryRegex }
          }
        }).sort({ createdAt: 1 });

        if (eligibleAgents && eligibleAgents.length > 0) {
          const matchedAgent = eligibleAgents[0];
          finalAgentId = matchedAgent.agentId;
          finalAgentName = matchedAgent.agencyName
            ? matchedAgent.agencyName
            : (matchedAgent.fullName || matchedAgent.firstName || "Agent");
          console.log(`🎯 Auto-assigned application to active agent ${finalAgentId} (${finalAgentName}) for country: ${countryName}`);
        } else {
          finalAgentId = "";
          finalAgentName = "";
          console.log(`ℹ️ No active agent found serving ${countryName}. Leaving in available pool for Admin assignment.`);
        }
      } catch (agentErr) {
        console.warn("⚠️ Agent auto-assignment lookup error:", agentErr);
        finalAgentId = "";
        finalAgentName = "";
      }
    }

    const applicationId = `VO-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApplication = new ApplicationModel({
      applicationId,
      countryId: country?._id,
      countryName,
      countryCode: countryCode || country?.code || "DEST",
      categoryName,
      visaTypeName,
      processingSpeed: speed,
      assignedAgentId: finalAgentId,
      assignedAgentName: finalAgentName,
      entryType: entryType || "Single Entry",
      stayValidity: stayValidity || "60 Days",
      personalDetails: {
        givenName: safePersonalDetails.givenName,
        surname: safePersonalDetails.surname,
        dob: safePersonalDetails.dob,
        gender: safePersonalDetails.gender || "Female",
        nationality: safePersonalDetails.nationality || "Indian",
        maritalStatus: safePersonalDetails.maritalStatus || "Single",
        phone: safePersonalDetails.phone,
        email: safePersonalDetails.email
      },
      travelDetails: {
        travelDate: travelDetails.travelDate,
        returnDate: travelDetails.returnDate,
        stayType: travelDetails.stayType || "Hotel Booking",
        hostName: travelDetails.hostName || "",
        hostAddress: travelDetails.hostAddress || ""
      },
      passportDetails: {
        passportType: passportDetails.passportType || "Ordinary / Regular",
        passportNo: passportDetails.passportNo.toUpperCase(),
        issuePlace: passportDetails.issuePlace || "New Delhi",
        issueDate: passportDetails.issueDate || "",
        expiryDate: passportDetails.expiryDate
      },
      employmentDetails: {
        employmentStatus: employmentDetails?.employmentStatus || "Employed",
        employerName: employmentDetails?.employerName || "",
        jobTitle: employmentDetails?.jobTitle || "",
        bankBalance: employmentDetails?.bankBalance || "₹4,50,000"
      },
      uploadedDocuments: deduplicateRequirementDocuments(Array.isArray(uploadedDocuments) ? uploadedDocuments : []),
      coTravelers: Array.isArray(coTravelers) ? coTravelers : [],
      pricing: {
        consularFee,
        platformFee,
        expressSurcharge,
        promoDiscount,
        promoCode,
        totalAmount: calculatedTotal
      },
      status: "Submitted",
      workflowStage: 1 // Stage 1: "Applicant Fills & Submits" -> ready for Stage 2 Agent AI & OCR
    });

    await newApplication.save();

    // Auto-create unified Transaction & Invoice record in payment ledger
    try {
      const numSuffix = applicationId.replace(/^VO-2026-/, "").replace(/[^0-9]/g, "") || String(Math.floor(1000 + Math.random() * 9000));
      const transactionId = `PAY-2026-${numSuffix}`;
      const invoiceNo = `INV-2026-${numSuffix}`;

      const fullPricing = calculatePricing(consularFee, platformFee, expressSurcharge, promoDiscount);
      const applicantFullName = `${safePersonalDetails.givenName} ${safePersonalDetails.surname}`.trim();

      const newTxn = new TransactionModel({
        transactionId,
        invoiceNo,
        applicationId,
        applicantName: applicantFullName,
        passportNumber: passportDetails?.passportNo ? passportDetails.passportNo.toUpperCase() : "",
        nationality: safePersonalDetails.nationality || "",
        country: `${countryName}`,
        visaType: visaTypeName,
        visaCategory: categoryName?.toLowerCase().includes("business") ? "Business" : categoryName?.toLowerCase().includes("student") ? "Student" : "Tourist",
        paidBy: "Applicant",
        pricing: fullPricing,
        paymentMethod: "UPI",
        paymentGateway: "Razorpay",
        paymentRef: passportDetails?.passportNo ? `RAZOR-${passportDetails.passportNo}-PAY` : `RAZOR-${numSuffix}-PAY`,
        status: "Successful",
        gstin: "",
        billingAddress: "",
        sacCode: "998311"
      });

      await newTxn.save();
    } catch (txnErr) {
      console.error("Failed to auto-create transaction ledger record:", txnErr);
    }

    return res.status(201).json({
      success: true,
      message: "Visa application submitted successfully and saved to MongoDB!",
      data: newApplication
    });
  } catch (error: any) {
    console.error("Submit Application Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to submit visa application."));
  }
});

/**
 * PUT /api/v1/applications/:id/status
 * Update visa application status (Approved, Rejected, Under Review, Submitted) in MongoDB
 */
router.put("/:id/status", async (req: Request, res: Response) => {
  try {
    const targetId = String(req.params.id);
    const { status, rejectionReason } = req.body;

    if (!status) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Status parameter is required."));
    }

    const queryConditions: any[] = [{ applicationId: targetId }];
    if (mongoose.Types.ObjectId.isValid(targetId)) {
      queryConditions.push({ _id: targetId });
    }

    const application = await ApplicationModel.findOne({ $or: queryConditions });

    if (!application) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", `Application with ID ${targetId} not found.`));
    }

    application.status = status;

    // Save rejection reason when rejecting
    if (status === "Rejected" && rejectionReason) {
      (application as any).rejectionReason = String(rejectionReason).trim();
    }

    // Auto-verify docs when approving
    if (status === "Approved" && Array.isArray(application.uploadedDocuments)) {
      application.uploadedDocuments.forEach((doc: any) => {
        doc.status = "verified";
      });
    }

    await application.save();

    return res.status(200).json({
      success: true,
      message: `Application ${targetId} status updated to ${status} successfully.`,
      data: application
    });
  } catch (error: any) {
    console.error("Update Application Status Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to update application status."));
  }
});

/**
 * GET /api/v1/applications/admin/all-documents
 * Flatten and return all uploaded documents across applications.
 * Scoped to assigned applications when called by an Agent or when agentId parameter is provided.
 * Includes computed live summary metrics (Total, Verified, Pending, Rejected, Re-upload Requested, High Priority).
 */
router.get("/admin/all-documents", async (req: Request, res: Response) => {
  try {
    let tokenUser: TokenPayload | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      tokenUser = verifyAccessToken(authHeader.slice(7));
    }

    const { agentId } = req.query as { agentId?: string };
    const effectiveAgentId = agentId || (tokenUser?.role === "Agent" ? tokenUser.agentId || tokenUser.userId : undefined);

    let query: any = {};
    if (effectiveAgentId) {
      query = {
        $or: [
          { assignedAgentId: effectiveAgentId },
          { assignedAgentName: { $regex: effectiveAgentId, $options: "i" } }
        ]
      };
    }

    const applications = await ApplicationModel.find(query).sort({ createdAt: -1 });

    const allDocs: any[] = [];
    let totalVerified = 0;
    let totalPending = 0;
    let totalRejected = 0;
    let totalReupload = 0;
    let totalPriority = 0;

    for (const app of applications) {
      const docs = Array.isArray(app.uploadedDocuments) ? app.uploadedDocuments : [];
      for (const doc of deduplicateRequirementDocuments(docs)) {
        // Do not put unuploaded requirement placeholders into the queue.
        if (!doc.fileUrl) continue;
        const statusNormalized = (doc.status || "uploaded").toLowerCase();
        let displayStatus: "Pending Verification" | "Verified" | "Rejected" | "Re-upload Requested" = "Pending Verification";
        if (statusNormalized === "verified") displayStatus = "Verified";
        else if (statusNormalized === "rejected") displayStatus = "Rejected";
        else if (statusNormalized === "needs_review" || statusNormalized === "reupload_requested" || statusNormalized === "re-upload requested") displayStatus = "Re-upload Requested";

        if (displayStatus === "Verified") totalVerified++;
        else if (displayStatus === "Rejected") totalRejected++;
        else if (displayStatus === "Re-upload Requested") totalReupload++;
        else totalPending++;

        // Derive real priority from processing speed
        let priority: "Normal" | "High" | "Urgent" = "Normal";
        if (app.processingSpeed === "vip") priority = "Urgent";
        else if (app.processingSpeed === "express") priority = "High";

        if (priority === "High" || priority === "Urgent") totalPriority++;

        const applicantName = `${app.personalDetails?.givenName || ""} ${app.personalDetails?.surname || ""}`.trim() || "Applicant";

        allDocs.push({
          id: (doc as any)._id ? String((doc as any)._id) : doc.requirementId || `doc_${allDocs.length + 1}`,
          docId: (doc as any)._id ? `DOC-${String((doc as any)._id).slice(-6).toUpperCase()}` : `DOC-${1000 + allDocs.length}`,
          appId: app.applicationId,
          applicantName,
          passportNumber: app.passportDetails?.passportNo || "N/A",
          documentType: doc.documentType || doc.title || "PDF Document",
          documentName: doc.fileName || doc.title,
          fileFormat: doc.format || (doc.fileUrl?.endsWith(".pdf") ? "PDF" : "JPG"),
          fileSize: doc.fileSize || "2.5 MB",
          fileUrl: doc.fileUrl || "",
          uploadedBy: "Applicant",
          uploadDate: doc.uploadedAt
            ? new Date(doc.uploadedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
            : new Date(app.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          uploadDateTime: doc.uploadedAt
            ? new Date(doc.uploadedAt).toLocaleString("en-GB")
            : new Date(app.createdAt).toLocaleString("en-GB"),
          priority,
          verificationStatus: displayStatus,
          status: displayStatus,
          verifiedBy: doc.verifiedBy || (displayStatus === "Verified" ? "AI System" : undefined),
          verificationDate: doc.verificationDate || (doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString("en-GB") : undefined),
          rejectionReason: doc.rejectionReason || "",
          remarks: doc.rejectionReason || "",
          country: app.countryName,
          aiMatchScore: doc.aiMatchScore || (displayStatus === "Verified" ? 95 : 75)
        });
      }
    }

    return res.status(200).json({
      success: true,
      stats: {
        totalDocuments: allDocs.length,
        pending: totalPending,
        verified: totalVerified,
        rejected: totalRejected,
        reuploadRequested: totalReupload,
        highPriority: totalPriority,
        centralArchive: allDocs.length
      },
      data: allDocs
    });
  } catch (error: any) {
    console.error("Fetch All Documents Queue Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to fetch documents."));
  }
});

/**
 * PUT /api/v1/applications/:id/documents/:docId/status
 * Update a specific document's status (Verified / Rejected / Re-upload Requested) inside an application
 */
router.put("/:id/documents/:docId/status", async (req: Request, res: Response) => {
  try {
    const idStr = String(req.params.id);
    const docIdStr = String(req.params.docId);
    const { status, rejectionReason, verifiedBy } = req.body;

    if (!status) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Document status parameter is required."));
    }

    let normalizedStatus = String(status).trim().toLowerCase();
    if (normalizedStatus === "re-upload requested" || normalizedStatus === "reupload_requested" || normalizedStatus === "reupload requested") {
      normalizedStatus = "needs_review";
    } else if (normalizedStatus === "approved") {
      normalizedStatus = "verified";
    }

    if ((normalizedStatus === "rejected" || normalizedStatus === "needs_review") && (!rejectionReason || !String(rejectionReason).trim())) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "A reason is strictly mandatory when rejecting or requesting re-upload of a document."));
    }

    const application = await ApplicationModel.findOne({
      $or: [{ applicationId: idStr }, { _id: mongoose.Types.ObjectId.isValid(idStr) ? idStr : null }]
    });

    if (!application) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", `Application ${idStr} not found.`));
    }

    const docs = application.uploadedDocuments || [];
    const docIndex = docs.findIndex(
      (d: any) => String(d._id) === docIdStr || d.requirementId === docIdStr || (d.title && d.title.toLowerCase() === docIdStr.toLowerCase())
    );

    if (docIndex === -1) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", `Document ${docIdStr} not found on application ${idStr}.`));
    }

    const doc = docs[docIndex];
    doc.status = normalizedStatus as any;
    if (rejectionReason) doc.rejectionReason = String(rejectionReason).trim();
    if (verifiedBy) doc.verifiedBy = String(verifiedBy).trim();
    doc.verificationDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

    // Check overall docs to update application docs workflow stage
    const hasDeficiency = docs.some((d: any) => d.status === "rejected" || d.status === "needs_review");
    const allMandatoryVerified = docs.filter((d: any) => d.isMandatory).every((d: any) => d.status === "verified");

    if (hasDeficiency) {
      application.status = "Docs Pending";
    } else if (allMandatoryVerified) {
      application.workflowStage = Math.max(application.workflowStage, 3);
    }

    await application.save();

    return res.status(200).json({
      success: true,
      message: `Document status updated to ${doc.status} successfully.`,
      data: doc
    });
  } catch (error: any) {
    console.error("Update Document Status Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to update document status."));
  }
});

/**
 * PUT /api/v1/applications/:id/documents/:docId
 * Replace or upload a new file URL (ImageKit asset) for a document on an application
 */
router.put("/:id/documents/:docId", async (req: Request, res: Response) => {
  try {
    const idStr = String(req.params.id);
    const docIdStr = String(req.params.docId);
    const { fileUrl, fileName, fileSize, format, title, documentType } = req.body;

    if (!fileUrl) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "fileUrl is required."));
    }

    const application = await ApplicationModel.findOne({
      $or: [{ applicationId: idStr }, { _id: mongoose.Types.ObjectId.isValid(idStr) ? idStr : null }]
    });

    if (!application) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", `Application ${idStr} not found.`));
    }

    if (!Array.isArray(application.uploadedDocuments)) {
      application.uploadedDocuments = [];
    }

    const docIndex = application.uploadedDocuments.findIndex(
      (d: any) => String(d._id) === docIdStr || d.requirementId === docIdStr || (d.title && d.title.toLowerCase() === docIdStr.toLowerCase())
    );

    if (docIndex >= 0) {
      const doc = application.uploadedDocuments[docIndex];
      doc.fileUrl = fileUrl;
      if (fileName) doc.fileName = fileName;
      if (fileSize) doc.fileSize = fileSize;
      if (format) doc.format = format;
      doc.status = "uploaded";
      doc.rejectionReason = "";
      doc.uploadedAt = new Date();
    } else {
      application.uploadedDocuments.push({
        title: title || docIdStr,
        documentType: documentType || "PDF Document",
        isMandatory: true,
        fileUrl,
        fileName: fileName || "document",
        fileSize: fileSize || "1.5 MB",
        format: format || (fileUrl.endsWith(".pdf") ? "PDF" : "JPG"),
        status: "uploaded",
        uploadedAt: new Date()
      });
    }

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Document uploaded and attached to application successfully.",
      data: application.uploadedDocuments
    });
  } catch (error: any) {
    console.error("Update Application Document Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to update document."));
  }
});

export default router;
