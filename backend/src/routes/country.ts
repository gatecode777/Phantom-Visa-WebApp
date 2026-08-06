import { Router, Request, Response } from "express";
import multer from "multer";
import Country from "../models/Country.js";
import imagekit from "../lib/imagekit.js";
import { formatErrorEnvelope } from "../lib/middleware/api-standards.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

/**
 * POST /api/v1/countries/upload-flag
 * Upload country flag / image directly to ImageKit in folder /phantom-visa/countries/
 */
router.post("/upload-flag", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "No image file provided."));
    }

    const fileBase64 = req.file.buffer.toString("base64");
    const fileName = `flag_${Date.now()}_${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    const result = await imagekit.upload({
      file: fileBase64,
      fileName,
      folder: "/PHANTOM-VISA/countries/"
    });

    return res.status(200).json({
      success: true,
      message: "Image uploaded to ImageKit successfully.",
      data: {
        url: result.url,
        fileId: result.fileId,
        thumbnailUrl: result.thumbnailUrl || result.url
      }
    });
  } catch (error: any) {
    console.error("ImageKit Upload Error:", error);
    return res.status(500).json(formatErrorEnvelope("IMAGEKIT_UPLOAD_ERROR", error.message || "Failed to upload image to ImageKit."));
  }
});

/**
 * GET /api/v1/countries
 * Retrieve all destination countries from MongoDB (Auto-seeds defaults if empty)
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    let countries = await Country.find().sort({ name: 1 });

    // Auto-seed default countries matching screenshot 1 if empty
    if (countries.length === 0) {
      const defaults = [
        {
          countryId: "CNT-001",
          name: "Canada",
          code: "CAN",
          flag: "🇨🇦",
          continent: "North America",
          capital: "Ottawa",
          currency: "CAD ($)",
          timeZone: "EST (GMT-5)",
          visaAvailable: true,
          processingTime: "15 Days",
          startingFee: 8500,
          availableCategories: ["Tourist Visa", "Business Visa", "Student & Study Visa", "Work & Employment Permit", "Transit & Airport Transfer"],
          availableVisaTypes: ["Schengen Tourist (Multiple Entry)", "US B1/B2 Tourist & Business"],
          requiredDocuments: ["Passport", "Passport Photograph", "Bank Statement", "Travel Insurance"],
          status: "Active"
        },
        {
          countryId: "CNT-002",
          name: "Australia",
          code: "AUS",
          flag: "🇦🇺",
          continent: "Oceania",
          capital: "Canberra",
          currency: "AUD ($)",
          timeZone: "AEST (GMT+10)",
          visaAvailable: true,
          processingTime: "20 Days",
          startingFee: 9200,
          availableCategories: ["Tourist Visa", "Business Visa", "Student & Study Visa", "Work & Employment Permit"],
          availableVisaTypes: ["Schengen Tourist (Multiple Entry)"],
          requiredDocuments: ["Passport", "Passport Photograph", "Bank Statement", "Travel Insurance", "Flight Booking"],
          status: "Active"
        },
        {
          countryId: "CNT-003",
          name: "Germany",
          code: "DEU",
          flag: "🇩🇪",
          continent: "Europe",
          capital: "Berlin",
          currency: "EUR (€)",
          timeZone: "CET (GMT+1)",
          visaAvailable: true,
          processingTime: "12 Days",
          startingFee: 7800,
          availableCategories: ["Tourist Visa", "Business Visa", "Student & Study Visa", "Transit & Airport Transfer"],
          availableVisaTypes: ["Schengen Tourist (Multiple Entry)"],
          requiredDocuments: ["Passport", "Passport Photograph", "Bank Statement", "Travel Insurance", "Hotel Booking"],
          status: "Active"
        },
        {
          countryId: "CNT-004",
          name: "United States",
          code: "USA",
          flag: "🇺🇸",
          continent: "North America",
          capital: "Washington D.C.",
          currency: "USD ($)",
          timeZone: "EST (GMT-5)",
          visaAvailable: true,
          processingTime: "25 Days",
          startingFee: 14500,
          availableCategories: ["Tourist Visa", "Business Visa", "Student & Study Visa", "Work & Employment Permit"],
          availableVisaTypes: ["US B1/B2 Tourist & Business"],
          requiredDocuments: ["Passport", "Passport Photograph", "Bank Statement", "Invitation Letter"],
          status: "Active"
        },
        {
          countryId: "CNT-005",
          name: "United Kingdom",
          code: "GBR",
          flag: "🇬🇧",
          continent: "Europe",
          capital: "London",
          currency: "GBP (£)",
          timeZone: "GMT+0",
          visaAvailable: true,
          processingTime: "15 Days",
          startingFee: 11000,
          availableCategories: ["Tourist Visa", "Business Visa", "Student & Study Visa"],
          availableVisaTypes: ["UK Standard Visitor Visa"],
          requiredDocuments: ["Passport", "Passport Photograph", "Bank Statement", "Employment Letter"],
          status: "Active"
        }
      ];

      countries = await Country.insertMany(defaults);
    }

    return res.status(200).json({
      success: true,
      count: countries.length,
      data: countries
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * POST /api/v1/countries
 * Create a new destination country with validation
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      name,
      code,
      flag,
      continent,
      capital,
      currency,
      timeZone,
      visaAvailable,
      processingTime,
      startingFee,
      availableCategories,
      availableVisaTypes,
      requiredDocuments,
      status
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Country Name is required."));
    }

    if (!code || !code.trim()) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Country Code is required."));
    }

    const cleanCode = code.trim().toUpperCase();

    // Check duplicate name or code
    const existing = await Country.findOne({
      $or: [{ name: name.trim() }, { code: cleanCode }]
    });

    if (existing) {
      return res.status(400).json(
        formatErrorEnvelope("DUPLICATE_COUNTRY", "A country with this Name or Code already exists in MongoDB.")
      );
    }

    const count = await Country.countDocuments();
    const nextId = `CNT-${String(count + 1).padStart(3, "0")}`;

    const country = await Country.create({
      countryId: nextId,
      name: name.trim(),
      code: cleanCode,
      flag: flag || "🌐",
      continent: continent || "Asia",
      capital: capital ? capital.trim() : "",
      currency: currency || "USD ($)",
      timeZone: timeZone || "GMT+0",
      visaAvailable: visaAvailable !== undefined ? Boolean(visaAvailable) : true,
      processingTime: processingTime ? processingTime.trim() : "15 Days",
      startingFee: Number(startingFee) || 8500,
      availableCategories: Array.isArray(availableCategories) ? availableCategories : [],
      availableVisaTypes: Array.isArray(availableVisaTypes) ? availableVisaTypes : [],
      requiredDocuments: Array.isArray(requiredDocuments) ? requiredDocuments : [],
      status: status || "Active"
    });

    return res.status(201).json({
      success: true,
      message: "Country created successfully.",
      data: country
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * PUT /api/v1/countries/:id
 * Update an existing country
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const {
      name,
      code,
      flag,
      continent,
      capital,
      currency,
      timeZone,
      visaAvailable,
      processingTime,
      startingFee,
      availableCategories,
      availableVisaTypes,
      requiredDocuments,
      status
    } = req.body;

    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Country not found."));
    }

    if (name) country.name = name.trim();
    if (code) country.code = code.trim().toUpperCase();
    if (flag) country.flag = flag;
    if (continent) country.continent = continent;
    if (capital !== undefined) country.capital = capital.trim();
    if (currency) country.currency = currency;
    if (timeZone) country.timeZone = timeZone;
    if (visaAvailable !== undefined) country.visaAvailable = Boolean(visaAvailable);
    if (processingTime) country.processingTime = processingTime.trim();
    if (startingFee !== undefined) country.startingFee = Number(startingFee);
    if (Array.isArray(availableCategories)) country.availableCategories = availableCategories;
    if (Array.isArray(availableVisaTypes)) country.availableVisaTypes = availableVisaTypes;
    if (Array.isArray(requiredDocuments)) country.requiredDocuments = requiredDocuments;
    if (status) country.status = status;

    await country.save();

    return res.status(200).json({
      success: true,
      message: "Country updated successfully.",
      data: country
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * DELETE /api/v1/countries/:id
 * Delete a country
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const country = await Country.findByIdAndDelete(req.params.id);
    if (!country) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Country not found."));
    }

    return res.status(200).json({
      success: true,
      message: "Country deleted successfully."
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

export default router;
