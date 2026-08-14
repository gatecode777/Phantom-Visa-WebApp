import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import multer from "multer";
import ApplicationModel from "../models/Application.js";
import CountryModel from "../models/Country.js";
import VisaTypeModel from "../models/VisaType.js";
import VisaRequirementModel from "../models/VisaRequirement.js";
import TransactionModel from "../models/Transaction.js";
import { calculatePricing } from "./finance.js";
import imagekit from "../lib/imagekit.js";
import { formatErrorEnvelope } from "../lib/middleware/api-standards.js";

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
 * Upload applicant document scan / PDF to ImageKit in folder /PHANTOM-VISA/documents/
 */
router.post("/upload-doc", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "No document file provided for upload."));
    }

    const supportedVerificationMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
    if (!supportedVerificationMimeTypes.has(req.file.mimetype)) {
      return res.status(415).json(formatErrorEnvelope("UNSUPPORTED_MEDIA_TYPE", "Use a JPEG, PNG, WEBP, or PDF file. This format cannot be securely verified."));
    }

    const fileBase64 = req.file.buffer.toString("base64");
    const fileName = `doc_${Date.now()}_${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    const result = await imagekit.upload({
      file: fileBase64,
      fileName,
      folder: "/PHANTOM-VISA/documents/"
    });

    return res.status(200).json({
      success: true,
      message: "Document uploaded to ImageKit successfully.",
      data: {
        url: result.url,
        fileId: result.fileId,
        fileName: result.name
      }
    });
  } catch (error: any) {
    console.error("ImageKit Document Upload Error:", error);
    return res.status(500).json(
      formatErrorEnvelope("IMAGEKIT_UPLOAD_ERROR", error.message || "Failed to upload document scan to ImageKit.")
    );
  }
});

/**
 * GET /api/v1/applications
 * Retrieve all visa applications from MongoDB (sorted by newest first)
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    let applications = await ApplicationModel.find().sort({ createdAt: -1 });

    // Seed defaults if database is empty so dashboard lists render smoothly
    if (applications.length === 0) {
      const defaultApps = [
        {
          applicationId: "VO-2026-9841",
          countryName: "Canada",
          countryCode: "CAN",
          categoryName: "Tourist / Visitor",
          visaTypeName: "Canada Express Visitor Visa",
          processingSpeed: "express",
          entryType: "Multiple Entry",
          stayValidity: "180 Days",
          personalDetails: {
            givenName: "Geeta",
            surname: "Sharma",
            dob: "1995-06-12",
            gender: "Female",
            nationality: "Indian",
            maritalStatus: "Single",
            phone: "+91 98765 43210",
            email: "geeta.sharma@gmail.com"
          },
          travelDetails: {
            travelDate: "2026-10-15",
            returnDate: "2026-11-15",
            stayType: "Hotel Booking",
            hostName: "Fairmont Royal York Toronto",
            hostAddress: "100 Front St W, Toronto, ON"
          },
          passportDetails: {
            passportType: "Ordinary / Regular",
            passportNo: "Z9817264",
            issuePlace: "New Delhi",
            issueDate: "2023-12-21",
            expiryDate: "2033-12-20"
          },
          employmentDetails: {
            employmentStatus: "Employed",
            employerName: "TechCorp Solutions Pvt Ltd",
            jobTitle: "Senior Product Designer",
            bankBalance: "₹6,50,000"
          },
          uploadedDocuments: [
            { title: "Passport Bio Page", documentType: "Image Scan", isMandatory: true, fileUrl: "https://ik.imagekit.io/phantomvisa/sample_passport.png", status: "verified" },
            { title: "Recent Photo (35x45mm)", documentType: "Image Scan", isMandatory: true, fileUrl: "https://ik.imagekit.io/phantomvisa/sample_photo.png", status: "verified" },
            { title: "6-Month Bank Statement", documentType: "PDF Document", isMandatory: true, fileUrl: "https://ik.imagekit.io/phantomvisa/sample_bank.pdf", status: "verified" }
          ],
          coTravelers: [
            { id: "ct-1", name: "Rohan Sharma", relation: "Spouse", passportNo: "Z9817265", age: 32 }
          ],
          pricing: {
            consularFee: 8500,
            platformFee: 2500,
            expressSurcharge: 2000,
            promoDiscount: 0,
            promoCode: "",
            totalAmount: 13000
          },
          status: "Submitted",
          workflowStage: 1
        },
        {
          applicationId: "VO-2026-1229",
          countryName: "Australia",
          countryCode: "AUS",
          categoryName: "Tourist / Visitor",
          visaTypeName: "Subclass 600 Tourist Visa",
          processingSpeed: "express",
          entryType: "Single Entry",
          stayValidity: "60 Days",
          personalDetails: {
            givenName: "Vikram",
            surname: "Mehta",
            dob: "1988-03-24",
            gender: "Male",
            nationality: "Indian",
            maritalStatus: "Married",
            phone: "+91 98112 33445",
            email: "vikram.mehta@outlook.com"
          },
          travelDetails: {
            travelDate: "2026-09-10",
            returnDate: "2026-09-28",
            stayType: "Hotel Booking",
            hostName: "Shangri-La Sydney",
            hostAddress: "176 Cumberland St, Sydney"
          },
          passportDetails: {
            passportType: "Ordinary / Regular",
            passportNo: "Z4481920",
            issuePlace: "Mumbai",
            issueDate: "2022-05-10",
            expiryDate: "2032-05-09"
          },
          employmentDetails: {
            employmentStatus: "Employed",
            employerName: "Infosys Technologies",
            jobTitle: "Project Lead",
            bankBalance: "₹8,20,000"
          },
          uploadedDocuments: [],
          coTravelers: [],
          pricing: {
            consularFee: 12500,
            platformFee: 2500,
            expressSurcharge: 2000,
            promoDiscount: 1000,
            promoCode: "WELCOME10",
            totalAmount: 16000
          },
          status: "Submitted",
          workflowStage: 1
        }
      ];

      applications = await ApplicationModel.insertMany(defaultApps);
    }

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error: any) {
    console.error("Get Applications Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to fetch applications."));
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

    const applicationId = `VO-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApplication = new ApplicationModel({
      applicationId,
      countryId: country?._id,
      countryName,
      countryCode: countryCode || country?.code || "DEST",
      categoryName,
      visaTypeName,
      processingSpeed: speed,
      assignedAgentId: assignedAgentId || "",
      assignedAgentName: assignedAgentName || "",
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
        passportNumber: passportDetails?.passportNo ? passportDetails.passportNo.toUpperCase() : "Z9817264",
        nationality: safePersonalDetails.nationality || "Indian",
        country: `${countryName}`,
        visaType: visaTypeName,
        visaCategory: categoryName?.toLowerCase().includes("business") ? "Business" : categoryName?.toLowerCase().includes("student") ? "Student" : "Tourist",
        paidBy: "Applicant",
        pricing: fullPricing,
        paymentMethod: "UPI Instant (Google Pay)",
        paymentGateway: "Razorpay",
        paymentRef: `RAZOR-${passportDetails?.passportNo || "9817264"}-PAY`,
        status: "Successful",
        gstin: "27AAACG1234H1Z5",
        billingAddress: "104, Park Street, Connaught Place, New Delhi - 110001",
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
 * Flatten and return all uploaded documents across all applications for Admin All Documents screen
 * Includes computed summary metrics (Total, Verified, Pending, Rejected, Expired)
 */
router.get("/admin/all-documents", async (req: Request, res: Response) => {
  try {
    const applications = await ApplicationModel.find().sort({ createdAt: -1 });

    const allDocs: any[] = [];
    let totalVerified = 0;
    let totalPending = 0;
    let totalRejected = 0;
    let totalExpired = 0;

    for (const app of applications) {
      const docs = Array.isArray(app.uploadedDocuments) ? app.uploadedDocuments : [];
      for (const doc of deduplicateRequirementDocuments(docs)) {
        // Do not put unuploaded requirement placeholders into the admin archive.
        if (!doc.fileUrl) continue;
        const statusNormalized = (doc.status || "uploaded").toLowerCase();
        let displayStatus = "Pending";
        if (statusNormalized === "verified") displayStatus = "Verified";
        else if (statusNormalized === "rejected") displayStatus = "Rejected";
        else if (statusNormalized === "needs_review") displayStatus = "Re-upload Requested";
        else if (statusNormalized === "expired") displayStatus = "Expired";

        if (displayStatus === "Verified") totalVerified++;
        else if (displayStatus === "Rejected") totalRejected++;
        else if (displayStatus === "Expired") totalExpired++;
        else totalPending++;

        const applicantName = `${app.personalDetails?.givenName || ""} ${app.personalDetails?.surname || ""}`.trim() || "Applicant";

        allDocs.push({
          id: (doc as any)._id ? String((doc as any)._id) : doc.requirementId || `doc_${allDocs.length + 1}`,
          docId: (doc as any)._id ? `DOC-${String((doc as any)._id).slice(-6).toUpperCase()}` : `DOC-${1000 + allDocs.length}`,
          appId: app.applicationId,
          applicantName,
          passportNumber: app.passportDetails?.passportNo || "N/A",
          documentType: doc.documentType || "PDF Document",
          documentName: doc.title,
          fileFormat: doc.format || "PDF",
          fileSize: doc.fileSize || "2.5 MB",
          fileUrl: doc.fileUrl || "",
          uploadedBy: "Applicant",
          uploadDate: doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : new Date(app.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          uploadDateTime: doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString("en-GB") : new Date(app.createdAt).toLocaleString("en-GB"),
          verificationStatus: displayStatus,
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
        verified: totalVerified,
        pending: totalPending,
        rejected: totalRejected,
        expired: totalExpired,
        centralArchive: allDocs.length
      },
      data: allDocs
    });
  } catch (error: any) {
    console.error("Fetch Admin All Documents Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to fetch all documents."));
  }
});

/**
 * PUT /api/v1/applications/:id/documents/:docId/status
 * Update a specific document's status (Verified / Rejected / Pending) inside an application
 */
router.put("/:id/documents/:docId/status", async (req: Request, res: Response) => {
  try {
    const idStr = String(req.params.id);
    const docIdStr = String(req.params.docId);
    const { status, rejectionReason, verifiedBy } = req.body;

    if (!status) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Document status parameter is required."));
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
    doc.status = status.toLowerCase() === "verified" ? "verified" : status.toLowerCase() === "rejected" ? "rejected" : status.toLowerCase();
    if (rejectionReason) doc.rejectionReason = String(rejectionReason).trim();
    if (verifiedBy) doc.verifiedBy = String(verifiedBy).trim();
    doc.verificationDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

    // Check overall docs to update application docs workflow stage
    const hasRejected = docs.some((d: any) => d.status === "rejected");
    const allMandatoryVerified = docs.filter((d: any) => d.isMandatory).every((d: any) => d.status === "verified");

    if (hasRejected) {
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

export default router;
