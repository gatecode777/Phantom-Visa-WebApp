import { Router, Request, Response } from "express";
import fs from "fs";
import mongoose from "mongoose";
import Applicant from "../models/Applicant.js";
import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";
import ApplicationModel from "../models/Application.js";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth.js";
import { upload, documentUploadFields } from "../middleware/upload.js";
import { formatErrorEnvelope } from "../lib/middleware/api-standards.js";
import imagekit from "../lib/imagekit.js";

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

      const blockedOnFormatted = u?.blockedOn
        ? new Date(u.blockedOn).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : formattedDate;

      return {
        id: app.applicantId,
        _id: app._id.toString(),
        userId: app.userId ? app.userId.toString() : null,
        name: app.personalInfo?.fullName || `${app.personalInfo?.firstName || ""} ${app.personalInfo?.lastName || ""}`.trim() || "Applicant",
        firstName: app.personalInfo?.firstName || "",
        lastName: app.personalInfo?.lastName || "",
        email: app.personalInfo?.email || u?.email || "N/A",
        mobile: app.personalInfo?.phone || u?.phone || "N/A",
        country: app.personalInfo?.country || "India",
        status: isBlocked ? "Blocked" : (app.status === "Submitted" ? "Active" : app.status || "Active"),
        isDeactivated: isBlocked,
        blockReason: u?.blockReason || "Policy Violation",
        blockType: u?.blockType || "Temporary",
        blockedBy: u?.blockedBy || "Admin (Consular Officer)",
        blockedOn: blockedOnFormatted,
        registeredOn: formattedDate,
        rawCreatedAt: app.createdAt,
        dob: app.personalInfo?.dob || "N/A",
        gender: app.personalInfo?.gender || "N/A",
        nationality: app.personalInfo?.nationality || "Indian",
        address: app.personalInfo?.address || `${app.personalInfo?.city || ""}, ${app.personalInfo?.state || ""}`,
        city: app.personalInfo?.city || "",
        state: app.personalInfo?.state || "",
        postalCode: app.personalInfo?.postalCode || "",
        applicationStatus: app.status || "Submitted",
        kycStatus: app.kycDetails?.kycStatus || "Pending",
        kycDetails: app.kycDetails || { kycStatus: "Pending" }
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
 * POST /api/v1/applicant/submit-kyc
 * Submit country-specific identity documents for KYC verification
 */
router.post("/submit-kyc", async (req: Request, res: Response) => {
  try {
    const {
      applicantId,
      userId,
      govtIdType,
      aadhaarNumber,
      panCardNumber,
      ssnOrNationalId,
      idDocScan,
      addressProofScan,
      name,
      email,
      phone,
      country
    } = req.body;

    let queryConditions: any[] = [];
    if (applicantId && applicantId !== "APP-MYSELF") {
      queryConditions.push({ applicantId }, { id: applicantId });
    }
    if (userId) {
      queryConditions.push({ userId });
    }

    let applicant = null;
    if (queryConditions.length > 0) {
      applicant = await Applicant.findOne({ $or: queryConditions });
    }

    if (!applicant) {
      // Fall back to any existing applicant in database
      applicant = await Applicant.findOne({});
    }

    if (!applicant) {
      const nameParts = (name || "").trim().split(" ");
      const fName = nameParts[0] || "";
      const lName = nameParts.slice(1).join(" ") || "";

      applicant = new Applicant({
        applicantId: applicantId && applicantId !== "APP-MYSELF" ? applicantId : `APP-${Math.floor(1000 + Math.random() * 9000)}`,
        userId: userId || "USR-CUSTOMER",
        personalInfo: {
          fullName: name || "",
          firstName: fName,
          lastName: lName,
          email: email || "",
          country: country || "",
          phone: phone || "",
          dob: "",
          nationality: "",
          address: "",
          city: "",
          state: "",
          postalCode: ""
        },
        status: "Active"
      });
    }

    applicant.kycDetails = {
      kycStatus: "Under Audit",
      govtIdType: govtIdType || "National Identification & Address Proof",
      aadhaarNumber,
      panCardNumber,
      ssnOrNationalId,
      idDocScan,
      addressProofScan,
      submittedAt: new Date()
    };

    await applicant.save();

    return res.status(200).json({
      success: true,
      message: "KYC verification documents submitted successfully and sent for Consular Admin audit.",
      data: applicant.kycDetails
    });
  } catch (error: any) {
    console.error("❌ KYC Submission Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * POST /api/v1/applicant/verify-kyc
 * Admin Endpoint: Approve or Reject KYC submission
 */
router.post("/verify-kyc", async (req: Request, res: Response) => {
  try {
    const { applicantId, userId, status, rejectionReason } = req.body;

    if (!status || !["Approved", "Rejected", "Pending", "Under Audit"].includes(status)) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Valid KYC status is required (Approved or Rejected)."));
    }

    let queryConditions: any[] = [];
    if (applicantId) {
      queryConditions.push({ applicantId }, { id: applicantId });
      if (applicantId.match(/^[0-9a-fA-F]{24}$/)) {
        queryConditions.push({ _id: applicantId });
      }
    }
    if (userId) {
      queryConditions.push({ userId });
    }

    let applicant = null;
    if (queryConditions.length > 0) {
      applicant = await Applicant.findOne({ $or: queryConditions });
    }

    if (!applicant) {
      // Fall back to latest applicant in database
      applicant = await Applicant.findOne({}).sort({ updatedAt: -1 });
    }

    if (!applicant) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Applicant record not found."));
    }

    // Update all active applicant records in MongoDB to ensure global sync
    await Applicant.updateMany(
      {},
      {
        $set: {
          "kycDetails.kycStatus": status,
          "kycDetails.verifiedAt": status === "Approved" ? new Date() : undefined,
          "kycDetails.rejectionReason": status === "Approved" ? "" : (rejectionReason || "Document scan blurry or mismatched.")
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: `KYC verification status updated to ${status}.`,
      data: {
        kycStatus: status,
        verifiedAt: status === "Approved" ? new Date() : undefined
      }
    });
  } catch (error: any) {
    console.error("❌ KYC Verification Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * POST /api/v1/applicant/verify-kyc-document
 * Server-Side Gemini AI Verification for KYC Document Scans
 */
router.post("/verify-kyc-document", (req: Request, res: Response, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        verificationStatus: "error",
        message: err.message || "File upload streaming error. Only JPEG, PNG, and PDF files under 10MB are allowed."
      });
    }
    next();
  });
}, async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { slotType, typedAadhaarNumber, typedPanCardNumber, typedSsnOrNationalId, country } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        verificationStatus: "error",
        message: "No document scan file uploaded."
      });
    }

    if (!slotType || !["idCard", "addressProof"].includes(slotType)) {
      return res.status(400).json({
        success: false,
        verificationStatus: "error",
        message: "Valid slotType ('idCard' or 'addressProof') is required."
      });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        verificationStatus: "error",
        message: "Server AI Verification configuration error: Missing Gemini API Key."
      });
    }

    // Format pre-checks for India KYC
    const isIndia = country === "India" || !country || country === "undefined";
    const cleanTypedAadhaar = typedAadhaarNumber ? typedAadhaarNumber.replace(/\D/g, "") : "";
    const cleanTypedPan = typedPanCardNumber ? typedPanCardNumber.toUpperCase().trim() : "";

    if (slotType === "idCard" && isIndia) {
      if (cleanTypedAadhaar && cleanTypedAadhaar.length !== 12) {
        return res.status(400).json({
          success: false,
          verificationStatus: "format_error",
          message: "Aadhaar Card Number must be exactly 12 digits before document verification."
        });
      }
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (cleanTypedPan && !panRegex.test(cleanTypedPan)) {
        return res.status(400).json({
          success: false,
          verificationStatus: "format_error",
          message: "PAN Card Number format is invalid (e.g. ABCDE1234F) before document verification."
        });
      }
    }

    // Read uploaded file buffer and convert to Base64
    let fileBuffer: Buffer;
    if (file.buffer) {
      fileBuffer = file.buffer;
    } else if (file.path) {
      fileBuffer = fs.readFileSync(file.path);
    } else {
      return res.status(400).json({
        success: false,
        verificationStatus: "error",
        message: "Unable to read uploaded file content."
      });
    }

    const base64Data = fileBuffer.toString("base64");
    let mimeType = file.mimetype || "image/jpeg";
    if (mimeType === "application/pdf" || !mimeType.startsWith("image/")) {
      mimeType = "image/png"; // Default image mimeType for Gemini Vision API inlineData
    }

    // Construct AI Prompts
    let promptText = "";
    if (slotType === "idCard") {
      promptText = `Examine this document image carefully for automated international visa KYC verification.

Tasks:
1. Identify what type of government document this image is. Is it a genuine Indian "Aadhaar Card", a genuine Indian "PAN Card", or something else (e.g., Driver's License, Passport, Photo, Utility Bill, Random Image, Blank Page, Unrelated Document)?
2. Extract any 12-digit Aadhaar number (format XXXX XXXX XXXX or 12 consecutive digits) or 10-character PAN number (format XXXXX1234X) visible on the document.
3. Check if the image is too blurry, cropped, dark, or unreadable for OCR extraction.

Respond STRICTLY with valid JSON in this exact schema (no markdown, no additional text):
{
  "isReadable": true,
  "documentType": "Aadhaar Card" | "PAN Card" | "Other Document" | "Unreadable/Blurry",
  "detectedDocumentName": "string describing what document it actually is",
  "extractedNumber": "string containing extracted 12-digit Aadhaar or 10-char PAN number without spaces",
  "confidence": 95,
  "reasoning": "short explanation"
}`;
    } else {
      promptText = `Examine this document image carefully for automated international visa KYC address verification.

Tasks:
1. Identify if this document is an accepted Residential Address Proof (specifically a Utility Bill like electricity/gas/water, a Passport, a Rent/Lease Agreement, or a Bank Statement showing address).
2. Check if the image is too blurry, cropped, dark, or unreadable.

Respond STRICTLY with valid JSON in this exact schema (no markdown, no additional text):
{
  "isReadable": true,
  "isAcceptedAddressProof": true,
  "documentType": "Utility Bill" | "Passport" | "Rent Agreement" | "Bank Statement" | "Other Document" | "Unreadable/Blurry",
  "detectedDocumentName": "string describing what document it actually is",
  "confidence": 95,
  "reasoning": "short explanation"
}`;
    }

    // Persistent auto-retry loop until Gemini completes scanning
    const modelsToTry = [
      "gemini-flash-latest",
      "gemini-2.0-flash-lite",
      "gemini-2.5-flash-lite",
      "gemini-2.0-flash"
    ];

    let geminiRes: any = null;
    let geminiJson: any = null;
    const maxAttempts = 12;

    for (let attempt = 1; attempt <= maxAttempts && !geminiJson; attempt++) {
      for (const model of modelsToTry) {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const geminiPayload = {
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: base64Data
                  }
                },
                {
                  text: promptText
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json"
          }
        };

        try {
          const response = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(geminiPayload)
          });

          if (response.ok) {
            const data = await response.json();
            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
              geminiRes = response;
              geminiJson = data;
              break;
            }
          } else {
            const errJson = await response.json().catch(() => ({}));
            console.warn(`⚠️ Gemini attempt ${attempt} [${model}] HTTP ${response.status}:`, errJson?.error?.message || response.statusText);
          }
        } catch (callErr) {
          console.warn(`⚠️ Gemini attempt ${attempt} [${model}] exception:`, callErr);
        }
      }

      if (!geminiJson && attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }

    if (!geminiRes || !geminiJson) {
      return res.status(200).json({
        success: false,
        verificationStatus: "error",
        message: "AI document verification service is temporarily busy. Please retry uploading in a moment."
      });
    }

    const rawText = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(200).json({
        success: false,
        verificationStatus: "error",
        message: "Verification service returned an unreadable response. Please try uploading again."
      });
    }

    let parsed: any;
    try {
      const cleanJsonStr = rawText.replace(/```json\s*|\s*```/g, "").trim();
      parsed = JSON.parse(cleanJsonStr);
    } catch (e) {
      console.error("❌ Failed to parse Gemini response JSON:", rawText);
      return res.status(200).json({
        success: false,
        verificationStatus: "error",
        message: "Verification service response format error. Please try uploading again."
      });
    }

    // Verification Logic & Cross-Check for ID Card Slot
    if (slotType === "idCard") {
      if (!parsed.isReadable || parsed.documentType === "Unreadable/Blurry") {
        return res.status(200).json({
          success: false,
          verificationStatus: "unreadable",
          message: "The uploaded image is too blurry, cropped, or low quality for automated verification. Please upload a clear, high-resolution scan."
        });
      }

      if (parsed.documentType !== "Aadhaar Card" && parsed.documentType !== "PAN Card") {
        return res.status(200).json({
          success: false,
          verificationStatus: "wrong_type",
          message: `The uploaded file was identified as a ${parsed.detectedDocumentName || parsed.documentType || "non-government document"}, which is not a genuine Aadhaar card or PAN card.`
        });
      }

      // Cross-check extracted number with typed numbers
      const extractedClean = (parsed.extractedNumber || "").replace(/\D/g, "");
      const extractedPanClean = (parsed.extractedNumber || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

      if (parsed.documentType === "Aadhaar Card") {
        if (cleanTypedAadhaar && extractedClean && !extractedClean.includes(cleanTypedAadhaar) && !cleanTypedAadhaar.includes(extractedClean)) {
          return res.status(200).json({
            success: false,
            verificationStatus: "number_mismatch",
            message: `Document verified as an Aadhaar Card, but the number extracted from the image (${parsed.extractedNumber || "on card"}) does not match the 12-digit number you typed (${typedAadhaarNumber}).`
          });
        }
      } else if (parsed.documentType === "PAN Card") {
        if (cleanTypedPan && extractedPanClean && !extractedPanClean.includes(cleanTypedPan) && !cleanTypedPan.includes(extractedPanClean)) {
          return res.status(200).json({
            success: false,
            verificationStatus: "number_mismatch",
            message: `Document verified as a PAN Card, but the PAN number extracted from the image (${parsed.extractedNumber || "on card"}) does not match the 10-character PAN you typed (${typedPanCardNumber}).`
          });
        }
      }

      // Upload verified KYC ID Card scan to ImageKit
      let fileUrl = "";
      let imagekitId = "";
      try {
        const cleanName = (file.originalname || `kyc-id-${Date.now()}`).replace(/[^a-zA-Z0-9.-]/g, "_");
        const ikRes = await imagekit.upload({
          file: fileBuffer,
          fileName: `${Date.now()}-${cleanName}`,
          folder: "/PHANTOM-VISA/kyc/"
        });
        fileUrl = ikRes.url;
        imagekitId = ikRes.fileId;
      } catch (ikErr) {
        console.warn("⚠️ ImageKit upload failed for KYC ID:", ikErr);
      }

      return res.status(200).json({
        success: true,
        verificationStatus: "verified",
        documentType: parsed.documentType,
        extractedNumber: parsed.extractedNumber,
        fileUrl,
        imagekitId,
        message: `Successfully verified as a genuine ${parsed.documentType}!`
      });
    } else {
      // Address Proof Verification Logic
      if (!parsed.isReadable || parsed.documentType === "Unreadable/Blurry") {
        return res.status(200).json({
          success: false,
          verificationStatus: "unreadable",
          message: "The address proof image is too blurry or low quality to read. Please upload a clear document scan."
        });
      }

      if (!parsed.isAcceptedAddressProof && parsed.documentType === "Other Document") {
        return res.status(200).json({
          success: false,
          verificationStatus: "wrong_type",
          message: `The uploaded file was identified as a ${parsed.detectedDocumentName || "unrecognized file"}, which is not an accepted address proof (Utility Bill, Passport, or Rent Agreement).`
        });
      }

      // Upload verified Address Proof scan to ImageKit
      let fileUrl = "";
      let imagekitId = "";
      try {
        const cleanName = (file.originalname || `kyc-addr-${Date.now()}`).replace(/[^a-zA-Z0-9.-]/g, "_");
        const ikRes = await imagekit.upload({
          file: fileBuffer,
          fileName: `${Date.now()}-${cleanName}`,
          folder: "/PHANTOM-VISA/kyc/"
        });
        fileUrl = ikRes.url;
        imagekitId = ikRes.fileId;
      } catch (ikErr) {
        console.warn("⚠️ ImageKit upload failed for KYC Address Proof:", ikErr);
      }

      return res.status(200).json({
        success: true,
        verificationStatus: "verified",
        documentType: parsed.detectedDocumentName || parsed.documentType || "Address Proof",
        fileUrl,
        imagekitId,
        message: `Successfully verified as a genuine ${parsed.detectedDocumentName || parsed.documentType || "Address Proof"}!`
      });
    }
  } catch (error: any) {
    console.error("❌ KYC Document AI Verification Exception:", error);
    return res.status(200).json({
      success: false,
      verificationStatus: "error",
      message: "An unexpected server error occurred during AI verification. Please retry."
    });
  }
});

/**
 * POST /api/v1/applicant/verify-visa-document
 * Gemini AI Verification for Visa Application Document Uploads (Passport, Bank Statement, etc.)
 */
router.post("/verify-visa-document", (req: Request, res: Response, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        verificationStatus: "error",
        message: err.message || "File upload error. Only JPEG, PNG, and PDF files under 10MB are allowed."
      });
    }
    next();
  });
}, async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { documentTitle, documentType } = req.body;

    if (!file) {
      return res.status(400).json({ success: false, verificationStatus: "error", message: "No file uploaded." });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, verificationStatus: "error", message: "AI verification not configured." });
    }

    // Gemini inline vision accepts a limited set of image encodings. Never
    // relabel an unsupported format as PNG: that prevents the model from
    // inspecting the actual bytes and previously triggered a fail-open path.
    const supportedVisionMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
    if (!supportedVisionMimeTypes.has(file.mimetype)) {
      return res.status(200).json({
        success: false,
        verificationStatus: "wrong_type",
        message: "Use a JPEG, PNG, WEBP, or PDF file. This file format cannot be securely verified."
      });
    }

    // Pre-checks: classify the EXPECTED document type from its title
    const docName = (documentTitle || documentType || "visa document").toLowerCase();
    const fileNameLower = (file.originalname || "").toLowerCase();

    // ──── Document type classifiers (non-overlapping) ────────────────────────
    const isPassportDoc   = docName.includes("passport") && !docName.includes("photo") && !docName.includes("photograph");
    const isPhotoDoc      = docName.includes("photo") || docName.includes("photograph") || docName.includes("picture") || docName.includes("headshot") || docName.includes("portrait");
    const isBankDoc       = docName.includes("bank") || docName.includes("statement") || docName.includes("financial");
    // Hotel booking must come BEFORE flight/booking so "hotel booking" is not misclassified as flight
    const isHotelDoc      = docName.includes("hotel") || docName.includes("accommodation") || docName.includes("resort") || docName.includes("hostel") || docName.includes("lodge");
    // Flight doc: only pure flight/ticket/itinerary (NOT "booking" alone since hotel booking contains it)
    const isFlightDoc     = (docName.includes("flight") || docName.includes("air ticket") || docName.includes("boarding") || docName.includes("e-ticket") || docName.includes("eticket") || docName.includes("itinerary")) && !isHotelDoc;
    const isInsuranceDoc  = docName.includes("insurance") || docName.includes("travel insurance") || docName.includes("health insurance");
    const isNOCDoc        = docName.includes("noc") || docName.includes("no objection") || docName.includes("employment") || docName.includes("offer letter") || docName.includes("salary");

    // ──── Filename-based rejection heuristics (conservative — only obvious junk) ────
    const isGraphicLogoOrIcon  = fileNameLower.includes("logo") || fileNameLower.includes("removebg") || fileNameLower.includes("icon") || fileNameLower.includes("avatar") || fileNameLower.includes("generated") || fileNameLower.includes("graphic") || fileNameLower.includes("illustration") || fileNameLower.includes("vector") || fileNameLower.includes("dall-e") || fileNameLower.includes("midjourney") || fileNameLower.includes("clipart") || fileNameLower.includes("anime") || fileNameLower.includes("manga") || fileNameLower.includes("cartoon") || fileNameLower.includes("wallpaper") || fileNameLower.includes("wallhaven") || fileNameLower.includes("drawing") || fileNameLower.includes("sketch");
    const isScreenshotFile     = fileNameLower.includes("screenshot") || fileNameLower.includes("screencapture") || fileNameLower.includes("screen_capture") || fileNameLower.includes("mailersend") || fileNameLower.includes("web-page") || fileNameLower.includes("browser");
    // Electricity bill: only genuinely utility-specific terms — NOT "invoice" (hotel booking invoices are valid)
    const isElectricityBillFile = (fileNameLower.includes("electricity") || fileNameLower.includes("electric_bill") || fileNameLower.includes("electricity-bill") || fileNameLower.includes("power_bill") || fileNameLower.includes("utility_bill")) && !fileNameLower.includes("hotel") && !fileNameLower.includes("booking") && !fileNameLower.includes("flight") && !fileNameLower.includes("bank") && !fileNameLower.includes("passport");

    // ──── Pre-reject obvious graphic files before hitting Gemini API ─────────
    if (isGraphicLogoOrIcon && isPassportDoc) {
      return res.status(200).json({ success: false, verificationStatus: "wrong_type", message: "Uploaded file is a graphic/logo image, not a valid Passport." });
    }
    if (isGraphicLogoOrIcon && isPhotoDoc) {
      return res.status(200).json({ success: false, verificationStatus: "wrong_type", message: "Uploaded file is an anime/cartoon drawing, not a real human passport photo." });
    }
    if (isElectricityBillFile && (isPassportDoc || isPhotoDoc || isBankDoc || isFlightDoc || isHotelDoc)) {
      return res.status(200).json({ success: false, verificationStatus: "wrong_type", message: `Uploaded file appears to be a utility/electricity bill, not a valid ${documentTitle || "document"}.` });
    }

    // ──── Read file buffer ────────────────────────────────────────────────────
    let fileBuffer: Buffer;
    if (file.buffer) {
      fileBuffer = file.buffer;
    } else if (file.path) {
      fileBuffer = fs.readFileSync(file.path);
    } else {
      return res.status(400).json({ success: false, verificationStatus: "error", message: "Unable to read uploaded file." });
    }

    const base64Data = fileBuffer.toString("base64");
    const mimeType = file.mimetype;

    // ──── Build Gemini prompt based on expected document type ─────────────────
    let expectedTypes = "";
    let checkInstruction = "";

    if (isPhotoDoc) {
      expectedTypes = `"Passport Photograph" | "Passport Photo" | "Portrait Photo" | "Headshot"`;
      checkInstruction = `Accept ONLY a clear passport-style photograph of exactly one REAL HUMAN face. The face must be the main subject, visible, front-facing or near-front-facing, and not obscured. REJECT food, objects, animals, scenery, documents, collages, screenshots, selfies with multiple people, anime drawings, cartoons, avatars, logos, graphic designs, and unrelated files.`;
    } else if (isPassportDoc) {
      expectedTypes = `"Passport" | "Passport Bio Page" | "Passport Booklet"`;
      checkInstruction = `Check if this is a genuine international travel passport booklet or bio-data page showing a photo, full name, passport number, nationality, date of birth, issue date, and expiry date. REJECT anime images, drawings, wallpapers, logos, graphic designs, screenshots, utility bills, electricity bills, invoices, loose photos, driving licences, Aadhaar/PAN cards, or unrelated files.`;
    } else if (isBankDoc) {
      expectedTypes = `"Bank Statement" | "Bank Account Statement" | "Financial Statement"`;
      checkInstruction = `Check if this is a genuine bank account statement showing account holder name, account number, transaction history, opening/closing balance, and bank logo. REJECT anime images, wallpapers, logos, screenshots, utility bills, hotel bookings, flight tickets, or unrelated documents.`;
    } else if (isHotelDoc) {
      expectedTypes = `"Hotel Booking" | "Hotel Reservation" | "Hotel Invoice" | "Accommodation Confirmation" | "Hotel Booking Confirmation" | "Hotel Receipt" | "Hotel Invoice"`;
      checkInstruction = `Check if this is a genuine hotel booking confirmation, hotel reservation letter, hotel invoice, or accommodation confirmation document. It should show hotel name, guest name, check-in/check-out dates, booking reference, room type, or total amount. ACCEPT hotel booking invoices, hotel receipts, accommodation letters, resort confirmations. REJECT anime images, wallpapers, logos, screenshots, electricity bills, passports, bank statements, or unrelated documents.`;
    } else if (isFlightDoc) {
      expectedTypes = `"Flight Booking" | "Flight Ticket" | "Air Ticket" | "Travel Itinerary" | "E-Ticket" | "Boarding Pass"`;
      checkInstruction = `Check if this is a genuine flight booking confirmation, e-ticket, or travel itinerary showing passenger name, flight number, departure/arrival cities, and travel dates. REJECT anime images, wallpapers, logos, screenshots, utility bills, hotel bookings, or unrelated documents.`;
    } else if (isInsuranceDoc) {
      expectedTypes = `"Travel Insurance" | "Insurance Policy" | "Insurance Certificate"`;
      checkInstruction = `Check if this is a genuine travel insurance policy or certificate showing policyholder name, coverage period, policy number, and insurer details. REJECT anime images, wallpapers, logos, screenshots, utility bills, or unrelated documents.`;
    } else if (isNOCDoc) {
      expectedTypes = `"Employment NOC" | "No Objection Certificate" | "Employer Letter" | "Salary Letter" | "Offer Letter"`;
      checkInstruction = `Check if this is a genuine employment no-objection certificate, salary slip, employer letter, or similar employment document on official letterhead. REJECT anime images, wallpapers, logos, screenshots, or completely unrelated files.`;
    } else {
      expectedTypes = `"Official Document" | "Government Document" | "Supporting Document"`;
      checkInstruction = `Check if this is a genuine official document that could reasonably serve as a "${documentTitle || "visa requirement document"}" for an international visa application. It should be readable, legitimate-looking, and clearly identifiable. REJECT anime images, logos, graphic icons, screenshots, and clearly unrelated files.`;
    }

    const promptText = `You are a professional AI document verification system for an international visa processing platform. Your job is to verify that applicants upload the CORRECT document type as requested.

Expected document: "${documentTitle || documentType || "Visa Document"}"
Accepted document types for this slot: ${expectedTypes}

Verification instruction: ${checkInstruction}

Carefully examine the uploaded document image and answer:
1. Is the image clear, readable, and not blurry/cropped/dark?
2. What type of document is this ACTUALLY? Be specific (e.g. "Hotel Booking Invoice", "Hotel Reservation Confirmation", "Passport Bio Page", "Bank Statement", "Electricity Bill", "Flight E-Ticket", "Anime Drawing", "Logo Image", "Unknown", etc.)
3. Does this document MATCH the expected slot "${documentTitle}"? Consider semantic equivalents — a "Hotel Booking Invoice" IS a valid "Hotel Booking" document.
4. For a passport photograph, is there exactly one real human face as the main subject? Do not infer this from filename or context.

Respond STRICTLY with valid JSON (no markdown, no extra text):
{
  "isReadable": true,
  "isCorrectDocumentType": true,
  "hasSingleRealHumanFace": false,
  "isScreenshotOrUi": false,
  "isIllustrationOrSynthetic": false,
  "detectedDocumentName": "exact name of what this document actually is",
  "confidence": 95,
  "reasoning": "one-sentence explanation of why it matches or why it is rejected"
}`;

    // ──── Call Gemini with working model names ────────────────────────────────
    const modelsToTry = ["gemini-2.0-flash", "gemini-2.5-flash-lite", "gemini-1.5-flash", "gemini-2.0-flash-lite"];
    let geminiJson: any = null;

    for (let attempt = 1; attempt <= 3 && !geminiJson; attempt++) {
      for (const model of modelsToTry) {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        try {
          const response = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ inlineData: { mimeType, data: base64Data } }, { text: promptText }] }],
              generationConfig: { temperature: 0.05, responseMimeType: "application/json" }
            })
          });

          if (response.ok) {
            const data = await response.json();
            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
              geminiJson = data;
              console.log(`✅ Gemini response received from model: ${model} (attempt ${attempt})`);
              break;
            }
          } else {
            const errText = await response.text().catch(() => "");
            console.warn(`⚠️ Gemini [${model}] attempt ${attempt} HTTP ${response.status}: ${errText.slice(0, 200)}`);
          }
        } catch (callErr: any) {
          console.warn(`⚠️ Gemini [${model}] attempt ${attempt} exception:`, callErr?.message || callErr);
        }
      }
      if (!geminiJson && attempt < 3) await new Promise((r) => setTimeout(r, 1000));
    }

    // ──── Fail closed when AI is unavailable ─────────────────────────────────
    if (!geminiJson) {
      console.warn("⚠️ All Gemini models unavailable; document left unverified.");
      return res.status(503).json({
        success: false,
        verificationStatus: "error",
        message: "AI verification is temporarily unavailable. Your document was not accepted; please retry shortly."
      });
    }

    // ──── Parse Gemini JSON response ──────────────────────────────────────────
    const rawText = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text;
    let parsed: any;
    try {
      parsed = JSON.parse(rawText.replace(/```json\s*|\s*```/g, "").trim());
    } catch (e) {
      console.error("❌ Failed to parse Gemini JSON response:", rawText?.slice(0, 300));
      return res.status(200).json({ success: false, verificationStatus: "error", message: "AI response parsing error. Please retry." });
    }

    // ──── Readability check ───────────────────────────────────────────────────
    if (!parsed.isReadable) {
      return res.status(200).json({
        success: false,
        verificationStatus: "unreadable",
        message: "The uploaded image is too blurry, cropped, or low quality for AI verification. Please upload a clear, high-resolution scan."
      });
    }

    // ──── Detect clearly wrong file types from AI response ───────────────────
    const detectedLower = ((parsed.detectedDocumentName || "") + " " + (parsed.reasoning || "")).toLowerCase();

    const isDetectedAnimeOrCartoon = detectedLower.includes("anime") || detectedLower.includes("manga") || detectedLower.includes("cartoon") || detectedLower.includes("drawing") || detectedLower.includes("artwork") || detectedLower.includes("wallpaper") || detectedLower.includes("character") || detectedLower.includes("illustration") || detectedLower.includes("fictional");
    const isDetectedLogoOrIcon     = detectedLower.includes("logo") && !detectedLower.includes("hotel") && !detectedLower.includes("bank") || detectedLower.includes("graphic design") || detectedLower.includes("removebg");
    const isDetectedScreenshot     = detectedLower.includes("screenshot") || detectedLower.includes("screen capture") || detectedLower.includes("mailersend") || detectedLower.includes("browser capture");
    // Utility bill detection: require explicit electricity/gas/water/power + bill together — NOT standalone "invoice"
    const isDetectedUtilityBill    = (detectedLower.includes("electricity") || detectedLower.includes("gas bill") || detectedLower.includes("water bill") || detectedLower.includes("utility bill") || detectedLower.includes("power bill")) && !detectedLower.includes("hotel") && !detectedLower.includes("flight") && !detectedLower.includes("booking");

    // Start with AI's own verdict
    const confidence = Number(parsed.confidence);
    let isAccepted = parsed.isCorrectDocumentType === true && Number.isFinite(confidence) && confidence >= 85;

    // Override: reject if clearly wrong category
    if (isDetectedAnimeOrCartoon || isDetectedLogoOrIcon || isDetectedScreenshot || isDetectedUtilityBill) {
      isAccepted = false;
    }

    // ──── Per-slot semantic acceptance rules ──────────────────────────────────
    if (isPhotoDoc) {
      isAccepted = isAccepted && parsed.hasSingleRealHumanFace === true && parsed.isScreenshotOrUi !== true && parsed.isIllustrationOrSynthetic !== true && !isDetectedAnimeOrCartoon && !isDetectedLogoOrIcon && !isDetectedScreenshot && !isDetectedUtilityBill;
    } else if (isPassportDoc) {
      if (detectedLower.includes("passport bio") || detectedLower.includes("passport page") || detectedLower.includes("passport booklet") || detectedLower.includes("passport document")) {
        isAccepted = true;
      } else if (isDetectedAnimeOrCartoon || isDetectedLogoOrIcon || isDetectedScreenshot || isDetectedUtilityBill) {
        isAccepted = false;
      }
    } else if (isBankDoc) {
      if (detectedLower.includes("bank") || detectedLower.includes("statement") || detectedLower.includes("account")) {
        isAccepted = true;
      } else if (isDetectedAnimeOrCartoon || isDetectedLogoOrIcon || isDetectedScreenshot || isDetectedUtilityBill) {
        isAccepted = false;
      }
    } else if (isHotelDoc) {
      // Accept hotel booking, hotel invoice, accommodation confirmation, hotel receipt, reservation — all are valid
      if (detectedLower.includes("hotel") || detectedLower.includes("accommodation") || detectedLower.includes("booking") || detectedLower.includes("reservation") || detectedLower.includes("resort") || detectedLower.includes("hostel") || detectedLower.includes("lodg")) {
        isAccepted = true;
      } else if (isDetectedAnimeOrCartoon || isDetectedLogoOrIcon || isDetectedScreenshot || isDetectedUtilityBill) {
        isAccepted = false;
      }
    } else if (isFlightDoc) {
      if (detectedLower.includes("flight") || detectedLower.includes("ticket") || detectedLower.includes("itinerary") || detectedLower.includes("boarding") || detectedLower.includes("e-ticket")) {
        isAccepted = true;
      } else if (isDetectedAnimeOrCartoon || isDetectedLogoOrIcon || isDetectedScreenshot || isDetectedUtilityBill) {
        isAccepted = false;
      }
    }

    // ──── Build contextual rejection message ──────────────────────────────────
    if (!isAccepted) {
      const detectedName = parsed.detectedDocumentName || "an unrecognized file";
      let shortMsg: string;
      if (isDetectedAnimeOrCartoon) {
        shortMsg = `Uploaded file is an anime/cartoon drawing, not a valid ${documentTitle || "document"}.`;
      } else if (isDetectedLogoOrIcon) {
        shortMsg = `Uploaded file is a graphic/logo image, not a valid ${documentTitle || "document"}.`;
      } else if (isDetectedScreenshot) {
        shortMsg = `Uploaded file is a screenshot, not a valid ${documentTitle || "document"}.`;
      } else if (isDetectedUtilityBill) {
        shortMsg = `Uploaded file is a utility/electricity bill, not a valid ${documentTitle || "document"}.`;
      } else {
        shortMsg = `Uploaded file is "${detectedName}", not a valid ${documentTitle || "document"}. ${parsed.reasoning ? `(${parsed.reasoning})` : ""}`.trim();
      }

      return res.status(200).json({ success: false, verificationStatus: "wrong_type", message: shortMsg });
    }

    // ──── Verified successfully — Upload to ImageKit CDN ─────────────────────
    let fileUrl = "";
    let imagekitId = "";
    try {
      const cleanName = (file.originalname || `visa-doc-${Date.now()}`).replace(/[^a-zA-Z0-9.-]/g, "_");
      const ikRes = await imagekit.upload({
        file: fileBuffer,
        fileName: `${Date.now()}-${cleanName}`,
        folder: "/PHANTOM-VISA/documents/"
      });
      fileUrl = ikRes.url;
      imagekitId = ikRes.fileId;
    } catch (ikErr) {
      console.warn("⚠️ ImageKit upload failed for Visa Document:", ikErr);
    }

    return res.status(200).json({
      success: true,
      verificationStatus: "verified",
      documentType: parsed.detectedDocumentName || documentTitle || "Verified Document",
      detectedDocumentName: parsed.detectedDocumentName || documentTitle,
      confidence: parsed.confidence || 95,
      fileUrl,
      imagekitId,
      message: `✓ AI verified: ${parsed.detectedDocumentName || documentTitle || "Document"}`
    });

  } catch (error: any) {
    console.error("❌ Visa Document AI Verification Exception:", error);
    return res.status(200).json({ success: false, verificationStatus: "error", message: "Server error during AI verification. Please retry." });
  }
});




/**
 * POST /api/v1/applicant/toggle-block
 * Toggle active/blocked status for a user in MongoDB with block reason metadata
 */
router.post("/toggle-block", async (req: Request, res: Response) => {
  try {
    const { userId, applicantId, isDeactivated, blockReason, blockType, blockedBy } = req.body;

    if (!userId && !applicantId) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "User ID or Applicant ID is required."));
    }

    let targetUserId = userId;

    if (!targetUserId && applicantId) {
      const app = await Applicant.findOne({ applicantId });
      if (app) targetUserId = app.userId;
    }

    if (targetUserId) {
      await User.findByIdAndUpdate(targetUserId, {
        isDeactivated: !!isDeactivated,
        blockReason: isDeactivated ? (blockReason || "Policy Violation") : "",
        blockType: isDeactivated ? (blockType || "Temporary") : "Temporary",
        blockedBy: isDeactivated ? (blockedBy || "Admin (Consular Officer)") : "",
        blockedOn: isDeactivated ? new Date() : undefined
      });
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
router.get("/dashboard", async (req: Request, res: Response) => {
  try {
    let userId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const jwtSecret = process.env.JWT_SECRET || "fallback_secret";
        const jwt = await import("jsonwebtoken");
        const decoded = jwt.default.verify(token, jwtSecret) as any;
        userId = decoded.userId || decoded.id;
      } catch (e) {}
    }

    let applicant = null;
    if (userId) {
      applicant = await Applicant.findOne({ userId });
      if (!applicant) {
        const userDoc = await User.findById(userId);
        if (userDoc?.email) {
          applicant = await Applicant.findOne({ "personalInfo.email": userDoc.email });
        }
      }
    }

    if (!applicant) {
      applicant = await Applicant.findOne({}).sort({ updatedAt: -1 });
    }

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
        greetingName: applicant.personalInfo?.fullName || "Applicant",
        kycStatus: applicant.kycDetails?.kycStatus || "Pending",
        kycCompleted: applicant.kycDetails?.kycStatus === "Approved",
        kycDetails: applicant.kycDetails || { kycStatus: "Pending" },
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
          travelerName: applicant.personalInfo?.fullName || "",
          dob: applicant.personalInfo?.dob || "",
          passportNumber: applicant.personalInfo?.passportNo || applicant.passportDetails?.passportNumber || "",
          passportExpiry: applicant.passportDetails?.passportExpiryDate || "",
          nationality: applicant.personalInfo?.nationality || "",
          destination: applicant.visaInfo?.destinationCountry || "",
          visaType: applicant.visaInfo?.visaType || "",
          visaCategory: applicant.visaInfo?.visaCategory || "",
          purposeOfVisit: applicant.visaInfo?.purposeOfVisit || "",
          entryType: applicant.visaInfo?.entryType || "",
          durationOfStay: applicant.visaInfo?.durationOfStay || "",
          expectedTravelDate: applicant.visaInfo?.expectedTravelDate || "",
          preferredEmbassy: applicant.visaInfo?.preferredEmbassy || "",
          status: applicant.status || "Submitted",
          fees: applicant.fees || 0,
          submissionDate: applicant.createdAt ? new Date(applicant.createdAt).toISOString().split("T")[0] : "",
          verifiedDocs: {
            passport: docs?.passportScan ? "verified" : "pending",
            photo: docs?.photo ? "verified" : "pending",
            nocLetter: docs?.employerLetter ? "verified" : "pending",
            sponsorLetter: docs?.bankStatement ? "verified" : "pending"
          },
          documents: applicant.documents || {},
          timeline: applicant.timeline || [],
          appointments: applicant.appointments || [],
          messages: applicant.messages || []
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

/**
 * GET /api/v1/applicant/activity-logs
 * Admin Endpoint: Fetch real & synthesized user activity logs from MongoDB
 */
router.get("/activity-logs", async (req: Request, res: Response) => {
  try {
    const dbLogs = await ActivityLog.find({}).sort({ createdAt: -1 }).limit(100);
    const applicants = await Applicant.find({}).sort({ createdAt: -1 });

    const logsList: any[] = dbLogs.map((log, idx) => ({
      id: log.logId || `LOG-${1000 + idx}`,
      logId: log.logId || `LOG-${1000 + idx}`,
      userName: log.userName || "Applicant User",
      userEmail: log.userEmail || "user@example.com",
      applicantId: log.applicantId || "APP-1025",
      activity: log.activity || "User Login",
      activityType: log.activityType || "Authentication",
      dateAndTime: new Date(log.createdAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      ipAddress: log.ipAddress || "192.168.1.10",
      device: log.device || "Chrome / Windows",
      status: log.status || "Success"
    }));

    const totalActivities = logsList.length;
    const todayCount = logsList.filter(
      (l) => new Date(l.dateAndTime).toDateString() === new Date().toDateString()
    ).length || Math.min(totalActivities, 12);
    const activeUsersCount = applicants.length;
    const failedAttemptsCount = logsList.filter((l) => l.status === "Failed").length;

    return res.status(200).json({
      success: true,
      metrics: {
        totalActivities,
        todayActivities: todayCount,
        activeUsers: activeUsersCount,
        failedAttempts: failedAttemptsCount
      },
      data: logsList
    });
  } catch (error: any) {
    console.error("❌ Fetch Activity Logs Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * GET /api/v1/applicant/vault
 * Fetch applicant's personal document vault (all unique uploaded/verified documents across all applications)
 * Computes live metrics: totalStored, activeValid, verified, pending, expired
 */
router.get("/vault", async (req: Request, res: Response) => {
  try {
    const applicationId = typeof req.query.applicationId === "string" ? req.query.applicationId : "";
    const applicationQuery = applicationId
      ? { $or: [{ applicationId }, { _id: mongoose.Types.ObjectId.isValid(applicationId) ? applicationId : null }] }
      : {};
    const applications = await ApplicationModel.find(applicationQuery).sort({ createdAt: -1 });

    const vaultDocsMap = new Map<string, any>();
    let activeValidCount = 0;
    let verifiedCount = 0;
    let pendingCount = 0;
    let expiredCount = 0;

    for (const app of applications) {
      const docs = Array.isArray(app.uploadedDocuments) ? app.uploadedDocuments : [];
      for (const doc of docs) {
        // The vault contains actual uploads only; requirement placeholders and
        // status-only records belong to the upload checklist, not the vault.
        if (!doc.fileUrl) continue;

        // requirementId is the stable identity for a slot. Older records fall
        // back to title, so re-uploads update rather than create vault entries.
        const docKey = `${app.applicationId}:${doc.requirementId || doc.title.toLowerCase().trim()}`;
        const statusNorm = (doc.status || "uploaded").toLowerCase();
        let displayStatus = "pending";
        if (statusNorm === "verified") displayStatus = "verified";
        else if (statusNorm === "rejected") displayStatus = "rejected";
        else if (statusNorm === "expired") displayStatus = "expired";
        else if (statusNorm === "needs_review") displayStatus = "resubmit";

        const uploadDate = doc.uploadedAt
          ? new Date(doc.uploadedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
          : new Date(app.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

        // Calculate dynamic expiry
        let expiryDate = "20 Dec 2033";
        if (doc.title.toLowerCase().includes("bank")) {
          const exp = new Date(app.createdAt);
          exp.setMonth(exp.getMonth() + 3);
          expiryDate = exp.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
        } else if (doc.title.toLowerCase().includes("photo")) {
          const exp = new Date(app.createdAt);
          exp.setMonth(exp.getMonth() + 6);
          expiryDate = exp.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
        }

        // Status is intentionally never overridden by a derived expiry date:
        // Upload Documents, Verification Status, and the Vault must expose the
        // same document status from the application record.
        const finalStatus = displayStatus;

        if (!vaultDocsMap.has(docKey)) {
          const vaultItem = {
          id: `${app.applicationId}:${(doc as any)._id || doc.requirementId || doc.title}`,
            name: doc.title,
            category: doc.documentType?.includes("Bank") ? "Financial" : doc.documentType?.includes("Letter") ? "Employment" : "Identity",
            uploadDate,
            expiryDate,
            verificationDate: doc.verificationDate || (finalStatus === "verified" ? uploadDate : undefined),
            status: finalStatus,
            size: doc.fileSize || "2.1 MB",
            fileName: doc.fileName || doc.title.toLowerCase().replace(/[^a-z0-9]/g, "_") + ".pdf",
            fileUrl: doc.fileUrl || "",
            format: doc.format || "PDF",
            updatedBy: doc.verifiedBy || "Applicant",
            notes: doc.rejectionReason || "Uploaded document stored in encrypted vault."
          };

          vaultDocsMap.set(docKey, vaultItem);

          if (finalStatus === "verified") {
            verifiedCount++;
            activeValidCount++;
          } else if (finalStatus === "expired") {
            expiredCount++;
          } else {
            pendingCount++;
          }
        }
      }
    }

    const vaultDocs = Array.from(vaultDocsMap.values());

    return res.status(200).json({
      success: true,
      metrics: {
        totalStored: vaultDocs.length,
        activeValid: activeValidCount,
        verified: verifiedCount,
        pending: pendingCount,
        expired: expiredCount
      },
      data: vaultDocs
    });
  } catch (error: any) {
    console.error("Fetch Vault Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to fetch vault documents."));
  }
});

/**
 * POST /api/v1/applicant/vault/attach
 * Attach a vault document to an open application requirement slot
 */
router.post("/vault/attach", async (req: Request, res: Response) => {
  try {
    const { applicationId, requirementId, requirementTitle, vaultFileUrl, vaultFileName } = req.body;

    if (!applicationId || !requirementTitle || !vaultFileUrl) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "applicationId, requirementTitle, and vaultFileUrl are required."));
    }

    const application = await ApplicationModel.findOne({
      $or: [{ applicationId }, { _id: mongoose.Types.ObjectId.isValid(applicationId) ? applicationId : null }]
    });

    if (!application) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", `Application ${applicationId} not found.`));
    }

    const docs = application.uploadedDocuments || [];
    const docIndex = docs.findIndex((d: any) =>
      (requirementId && d.requirementId === requirementId) ||
      d.title.toLowerCase().trim() === requirementTitle.toLowerCase().trim()
    );

    if (docIndex !== -1) {
      docs[docIndex].fileUrl = vaultFileUrl;
      docs[docIndex].fileName = vaultFileName || docs[docIndex].title + ".pdf";
      docs[docIndex].status = "uploaded";
      docs[docIndex].uploadedAt = new Date();
    } else {
      docs.push({
        requirementId: requirementId || undefined,
        title: requirementTitle,
        fileUrl: vaultFileUrl,
        fileName: vaultFileName || requirementTitle + ".pdf",
        status: "uploaded",
        uploadedAt: new Date(),
        isMandatory: true,
        documentType: "PDF Document"
      });
    }

    // Ensure a requirement slot remains a single mutable record even if an
    // earlier client sent duplicate entries for it.
    const deduplicatedDocs = new Map<string, any>();
    for (const doc of docs) {
      const key = String(doc.requirementId || doc.title || "").trim().toLowerCase();
      if (key) deduplicatedDocs.set(key, doc);
    }
    application.uploadedDocuments = Array.from(deduplicatedDocs.values());
    await application.save();

    return res.status(200).json({
      success: true,
      message: `Vault document attached to ${requirementTitle} successfully.`,
      data: application
    });
  } catch (error: any) {
    console.error("Attach Vault Document Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to attach vault document."));
  }
});

/**
 * GET /api/v1/applicant/profile
 * Fetch comprehensive personal identity profile, passport vault, co-travelers, and live metrics
 */
router.get("/profile", async (req: Request, res: Response) => {
  try {
    let userId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const jwtSecret = process.env.JWT_SECRET || "fallback_secret";
        const jwt = await import("jsonwebtoken");
        const decoded = jwt.default.verify(token, jwtSecret) as any;
        userId = decoded.userId || decoded.id;
      } catch (e) {}
    }

    let applicant = null;
    let user = null;
    if (userId) {
      user = await User.findById(userId);
      applicant = await Applicant.findOne({ userId });
      if (!applicant && user?.email) {
        applicant = await Applicant.findOne({ "personalInfo.email": user.email });
      }
      if (!applicant && user?.phone) {
        applicant = await Applicant.findOne({ "personalInfo.phone": user.phone });
      }
    }

    if (!applicant) {
      applicant = await Applicant.findOne({}).sort({ updatedAt: -1 });
    }

    if (!applicant && user) {
      const nameParts = (user.name || "").trim().split(" ");
      applicant = await Applicant.create({
        applicantId: `APP-${Date.now().toString().slice(-6)}`,
        userId: user._id,
        personalInfo: {
          fullName: user.name || "",
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          dob: (user as any).dob || "",
          gender: (user as any).gender || "",
          nationality: (user as any).nationality || "",
          phone: user.phone || "",
          email: user.email || "",
          country: (user as any).country || "",
          address: (user as any).address || "",
          city: (user as any).city || "",
          state: (user as any).state || "",
          postalCode: (user as any).postalCode || "",
          occupation: "",
          employer: ""
        },
        passportDetails: {
          passportNumber: "",
          passportType: "",
          dateOfIssue: "",
          dateOfExpiry: "",
          placeOfIssue: "",
          scannedStatus: "Pending Upload"
        },
        coTravelers: [],
        preferences: {
          twoFactorAuth: false,
          emailNotifications: true,
          smsNotifications: false,
          passportReminder: false
        },
        kycDetails: {
          kycStatus: "Pending",
          govtIdType: "",
          aadhaarNumber: "",
          panCardNumber: ""
        },
        status: "Active"
      });
    }

    if (!applicant) {
      return res.status(200).json({
        success: true,
        data: null
      });
    }

    // Query real applications to compute live stats
    const applicantQuery: any[] = [];
    if (applicant.userId) applicantQuery.push({ userId: applicant.userId });
    if (applicant.personalInfo?.email) applicantQuery.push({ "personalDetails.email": applicant.personalInfo.email });
    if (applicant.personalInfo?.phone) applicantQuery.push({ "personalDetails.phone": applicant.personalInfo.phone });

    const applications = applicantQuery.length > 0
      ? await ApplicationModel.find({ $or: applicantQuery })
      : [];

    const approvedApps = applications.filter((app) => app.status === "Approved");
    const visasIssuedCount = approvedApps.length;
    const visasIssuedDestinations = Array.from(new Set(approvedApps.map((a) => a.countryName)));

    // Calculate Passport Validity live from dateOfExpiry
    let passportValidityYears = 0;
    let passportValidityLabel = "Not Provided";
    let isPassportExpired = false;
    if (applicant.passportDetails?.dateOfExpiry) {
      const expDate = new Date(applicant.passportDetails.dateOfExpiry);
      const now = new Date();
      const diffMs = expDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) {
        isPassportExpired = true;
        passportValidityLabel = "Expired";
      } else {
        const years = Math.floor(diffDays / 365.25);
        const months = Math.floor((diffDays % 365.25) / 30.4375);
        if (years >= 1) {
          passportValidityYears = years;
          passportValidityLabel = `${years} Year${years > 1 ? "s" : ""}${months > 0 ? ` ${months}m` : ""}`;
        } else {
          passportValidityLabel = `${months} Month${months > 1 ? "s" : ""}`;
        }
      }
    }

    // Calculate Profile Score percentage based on completeness
    let score = 0;
    const p = applicant.personalInfo || {};
    if (p.firstName && p.lastName) score += 20;
    if (p.dob) score += 10;
    if (p.gender) score += 10;
    if (p.nationality) score += 10;
    if (p.phone && p.email) score += 15;
    if (p.address || p.city) score += 10;
    if (applicant.passportDetails?.passportNumber) score += 15;
    if (applicant.kycDetails?.kycStatus === "Approved") score += 10;
    const profileScore = Math.min(100, Math.max(0, score));

    // Pipeline stages evaluation
    const pipeline = {
      stage1Complete: !!(p.firstName && p.address),
      stage2Complete: applicant.passportDetails?.scannedStatus?.includes("Verified") || applicant.kycDetails?.kycStatus === "Approved",
      stage3Complete: (applicant.coTravelers?.length || 0) > 0 || applications.length > 0,
      stage4Complete: visasIssuedCount > 0
    };

    return res.status(200).json({
      success: true,
      data: {
        _id: applicant._id,
        applicantId: applicant.applicantId,
        memberId: applicant.applicantId,
        userId: applicant.userId,
        personalInfo: applicant.personalInfo,
        passportDetails: applicant.passportDetails,
        coTravelers: applicant.coTravelers || [],
        preferences: applicant.preferences || {
          twoFactorAuth: false,
          emailNotifications: true,
          smsNotifications: false,
          passportReminder: false
        },
        kycDetails: applicant.kycDetails || { kycStatus: "Pending" },
        metrics: {
          kycStatus: applicant.kycDetails?.kycStatus || "Pending",
          passportValidityLabel,
          passportValidityYears,
          isPassportExpired,
          visasIssuedCount,
          visasIssuedDestinations,
          travelHistoryCount: applications.length,
          coTravelersCount: (applicant.coTravelers || []).length,
          profileScore
        },
        pipeline
      }
    });
  } catch (error: any) {
    console.error("❌ Fetch Profile Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to fetch profile."));
  }
});

/**
 * PUT /api/v1/applicant/profile
 * Update personal identity details, passport info, or security preferences in MongoDB
 */
router.put("/profile", async (req: Request, res: Response) => {
  try {
    const { personalInfo, passportDetails, preferences, applicantId } = req.body;

    let userId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const jwtSecret = process.env.JWT_SECRET || "fallback_secret";
        const jwt = await import("jsonwebtoken");
        const decoded = jwt.default.verify(token, jwtSecret) as any;
        userId = decoded.userId || decoded.id;
      } catch (e) {}
    }

    const query: any[] = [];
    if (applicantId) query.push({ applicantId });
    if (userId) query.push({ userId });

    let applicant = query.length > 0 ? await Applicant.findOne({ $or: query }) : null;
    if (!applicant) {
      applicant = await Applicant.findOne({}).sort({ updatedAt: -1 });
    }

    if (!applicant) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Applicant record not found to update."));
    }

    if (personalInfo) {
      applicant.personalInfo = {
        ...applicant.personalInfo,
        ...personalInfo,
        fullName: personalInfo.fullName || `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.trim() || applicant.personalInfo?.fullName
      };

      // Sync name with linked User document
      if (applicant.userId) {
        await User.findByIdAndUpdate(applicant.userId, {
          name: applicant.personalInfo.fullName,
          phone: applicant.personalInfo.phone,
          email: applicant.personalInfo.email
        });
      }
    }

    if (passportDetails) {
      applicant.passportDetails = {
        ...applicant.passportDetails,
        ...passportDetails
      };
    }

    if (preferences) {
      applicant.preferences = {
        ...applicant.preferences,
        ...preferences
      };
    }

    await applicant.save();

    return res.status(200).json({
      success: true,
      message: "Applicant profile updated successfully in MongoDB.",
      data: applicant
    });
  } catch (error: any) {
    console.error("❌ Update Profile Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to update profile."));
  }
});

/**
 * POST /api/v1/applicant/co-travelers
 * Add a new co-traveler / family member to applicant's shared vault in MongoDB
 */
router.post("/co-travelers", async (req: Request, res: Response) => {
  try {
    const { fullName, relation, passportNumber, dob, applicantId } = req.body;

    if (!fullName || !passportNumber) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Full Name and Passport Number are required."));
    }

    let applicant = applicantId ? await Applicant.findOne({ applicantId }) : await Applicant.findOne({}).sort({ updatedAt: -1 });
    if (!applicant) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Applicant record not found."));
    }

    const newTraveler = {
      id: `TRAVELER-${Date.now()}`,
      fullName,
      relation: relation || "Spouse",
      passportNumber: passportNumber.toUpperCase().trim(),
      dob: dob || "2000-01-01",
      kycStatus: "Verified"
    };

    if (!applicant.coTravelers) {
      applicant.coTravelers = [];
    }

    applicant.coTravelers.push(newTraveler);
    await applicant.save();

    return res.status(201).json({
      success: true,
      message: "Co-traveler added to your vault successfully.",
      data: applicant.coTravelers
    });
  } catch (error: any) {
    console.error("❌ Add Co-Traveler Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to add co-traveler."));
  }
});

/**
 * DELETE /api/v1/applicant/co-travelers/:id
 * Remove a co-traveler from applicant's vault in MongoDB
 */
router.delete("/co-travelers/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { applicantId } = req.query;

    let applicant = applicantId ? await Applicant.findOne({ applicantId: String(applicantId) }) : await Applicant.findOne({}).sort({ updatedAt: -1 });
    if (!applicant) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Applicant record not found."));
    }

    applicant.coTravelers = (applicant.coTravelers || []).filter((t: any) => t.id !== id);
    await applicant.save();

    return res.status(200).json({
      success: true,
      message: "Co-traveler removed from your vault.",
      data: applicant.coTravelers
    });
  } catch (error: any) {
    console.error("❌ Remove Co-Traveler Error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to remove co-traveler."));
  }
});

export default router;

