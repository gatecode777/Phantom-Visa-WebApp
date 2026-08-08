import { Router, Request, Response } from "express";
import multer from "multer";
import ApplicationModel from "../models/Application.js";
import CountryModel from "../models/Country.js";
import VisaTypeModel from "../models/VisaType.js";
import VisaRequirementModel from "../models/VisaRequirement.js";
import imagekit from "../lib/imagekit.js";
import { formatErrorEnvelope } from "../lib/middleware/api-standards.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * POST /api/v1/applications/upload-doc
 * Upload applicant document scan / PDF to ImageKit in folder /PHANTOM-VISA/documents/
 */
router.post("/upload-doc", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "No document file provided for upload."));
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
          countryName: "Australia",
          countryCode: "AUS",
          categoryName: "Tourist / Visitor",
          visaTypeName: "Subclass 600 Tourist Visa",
          processingSpeed: "express",
          entryType: "Single Entry",
          stayValidity: "60 Days",
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
            hostName: "Shangri-La Sydney",
            hostAddress: "176 Cumberland St, Sydney"
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
            bankBalance: "₹4,50,000"
          },
          uploadedDocuments: [
            { title: "Passport Bio Page", documentType: "Image Scan", isMandatory: true, fileUrl: "https://ik.imagekit.io/zp0tch54w/PHANTOM-VISA/sample_passport.png", status: "verified" },
            { title: "Recent Photo (35x45mm)", documentType: "Image Scan", isMandatory: true, fileUrl: "https://ik.imagekit.io/zp0tch54w/PHANTOM-VISA/sample_photo.png", status: "verified" },
            { title: "6-Month Bank Statement", documentType: "PDF Document", isMandatory: true, fileUrl: "https://ik.imagekit.io/zp0tch54w/PHANTOM-VISA/sample_bank.pdf", status: "verified" }
          ],
          coTravelers: [
            { id: "ct-1", name: "Rohan Sharma", relation: "Spouse", passportNo: "Z9817265", age: 32 }
          ],
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
    const { id } = req.params;
    const application = await ApplicationModel.findOne({
      $or: [{ _id: id }, { applicationId: id }]
    });

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
      pricing
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
      uploadedDocuments: Array.isArray(uploadedDocuments) ? uploadedDocuments : [],
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

export default router;
