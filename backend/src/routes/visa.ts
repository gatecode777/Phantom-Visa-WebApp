import { Router, Request, Response } from "express";
import VisaCategory from "../models/VisaCategory.js";
import VisaType from "../models/VisaType.js";
import VisaRequirement from "../models/VisaRequirement.js";
import DocumentTemplate from "../models/DocumentTemplate.js";
import { formatErrorEnvelope } from "../lib/middleware/api-standards.js";

const router = Router();

// ============================================================================
// 1. VISA CATEGORIES API ROUTES
// ============================================================================

/**
 * GET /api/v1/visa/categories
 * Retrieve all visa categories from MongoDB (Auto-seeds default categories if empty)
 */
router.get("/categories", async (req: Request, res: Response) => {
  try {
    let categories = await VisaCategory.find().sort({ createdAt: -1 });

    // Auto-seed default categories if empty
    if (categories.length === 0) {
      const defaults = [
        {
          name: "Tourist Visa",
          code: "CAT-TV-01",
          description: "Leisure, sightseeing, holiday, and short family visit visas.",
          status: "Active"
        },
        {
          name: "Business Visa",
          code: "CAT-BV-02",
          description: "Commercial meetings, trade conferences, corporate training, and negotiations.",
          status: "Active"
        },
        {
          name: "Student & Study Visa",
          code: "CAT-SV-03",
          description: "University enrollment, academic degrees, exchange programs, and language courses.",
          status: "Active"
        },
        {
          name: "Work & Employment Permit",
          code: "CAT-WP-04",
          description: "Long-term employment contracts, intra-company transfers, and skilled worker permits.",
          status: "Active"
        },
        {
          name: "Transit & Airport Transfer",
          code: "CAT-TR-05",
          description: "Short stay in international transit zones or layovers between connecting flights.",
          status: "Active"
        }
      ];

      categories = await VisaCategory.insertMany(defaults);
    }

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * POST /api/v1/visa/categories
 * Create a new visa category with validation
 */
router.post("/categories", async (req: Request, res: Response) => {
  try {
    const { name, code, description, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Category Name is required."));
    }

    if (!code || !code.trim()) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Category Code is required."));
    }

    const cleanCode = code.trim().toUpperCase();

    // Check duplicate name or code
    const existing = await VisaCategory.findOne({
      $or: [{ name: name.trim() }, { code: cleanCode }]
    });

    if (existing) {
      return res.status(400).json(
        formatErrorEnvelope("DUPLICATE_CATEGORY", "A visa category with this Name or Code already exists in MongoDB.")
      );
    }

    const category = await VisaCategory.create({
      name: name.trim(),
      code: cleanCode,
      description: description ? description.trim() : "",
      status: status || "Active"
    });

    return res.status(201).json({
      success: true,
      message: "Visa Category created successfully.",
      data: category
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * PUT /api/v1/visa/categories/:id
 * Update an existing visa category
 */
router.put("/categories/:id", async (req: Request, res: Response) => {
  try {
    const { name, code, description, status } = req.body;

    const category = await VisaCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Visa Category not found."));
    }

    if (name) category.name = name.trim();
    if (code) category.code = code.trim().toUpperCase();
    if (description !== undefined) category.description = description.trim();
    if (status) category.status = status;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Visa Category updated successfully.",
      data: category
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * DELETE /api/v1/visa/categories/:id
 * Delete a visa category
 */
router.delete("/categories/:id", async (req: Request, res: Response) => {
  try {
    const category = await VisaCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Visa Category not found."));
    }

    return res.status(200).json({
      success: true,
      message: "Visa Category deleted successfully."
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

// ============================================================================
// 2. VISA TYPES API ROUTES
// ============================================================================

/**
 * GET /api/v1/visa/types
 * Retrieve all visa types from MongoDB (Auto-seeds default visa types if empty)
 */
router.get("/types", async (req: Request, res: Response) => {
  try {
    let types = await VisaType.find().sort({ createdAt: -1 });

    // Auto-seed default visa types if empty
    if (types.length === 0) {
      const categories = await VisaCategory.find();
      const defaultCatId = categories[0]?._id || new Object();
      const defaultCatName = categories[0]?.name || "Tourist Visa";

      const defaults = [
        {
          name: "Schengen Tourist (Multiple Entry)",
          code: "VT-SCH-TV01",
          categoryId: defaultCatId,
          categoryName: defaultCatName,
          entryType: "Multiple Entry",
          validityMonths: 6,
          maxStayDays: 90,
          processingTimeDays: 7,
          status: "Active"
        },
        {
          name: "US B1/B2 Tourist & Business",
          code: "VT-USA-B1B2",
          categoryId: defaultCatId,
          categoryName: defaultCatName,
          entryType: "Multiple Entry",
          validityMonths: 120,
          maxStayDays: 180,
          processingTimeDays: 14,
          status: "Active"
        },
        {
          name: "UK Standard Visitor Visa",
          code: "VT-UK-SV06M",
          categoryId: defaultCatId,
          categoryName: defaultCatName,
          entryType: "Multiple Entry",
          validityMonths: 6,
          maxStayDays: 180,
          processingTimeDays: 15,
          status: "Active"
        },
        {
          name: "France Business Fast-Track",
          code: "VT-FRA-BV01",
          categoryId: defaultCatId,
          categoryName: "Business Visa",
          entryType: "Single Entry",
          validityMonths: 3,
          maxStayDays: 30,
          processingTimeDays: 5,
          status: "Active"
        }
      ];

      types = await VisaType.insertMany(defaults);
    }

    return res.status(200).json({
      success: true,
      count: types.length,
      data: types
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * POST /api/v1/visa/types
 * Create a new visa type with validation
 */
router.post("/types", async (req: Request, res: Response) => {
  try {
    const {
      name,
      code,
      categoryId,
      categoryName,
      entryType,
      validityMonths,
      maxStayDays,
      processingTimeDays,
      status
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Visa Type Name is required."));
    }

    if (!code || !code.trim()) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Visa Type Code is required."));
    }

    if (!categoryId) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Visa Category is required."));
    }

    const cleanCode = code.trim().toUpperCase();

    // Check duplicate
    const existing = await VisaType.findOne({
      $or: [{ name: name.trim() }, { code: cleanCode }]
    });

    if (existing) {
      return res.status(400).json(
        formatErrorEnvelope("DUPLICATE_TYPE", "A visa type with this Name or Code already exists in MongoDB.")
      );
    }

    // Resolve category name if not provided
    let resolvedCategoryName = categoryName;
    if (!resolvedCategoryName) {
      const cat = await VisaCategory.findById(categoryId);
      resolvedCategoryName = cat?.name || "Visa Category";
    }

    const visaType = await VisaType.create({
      name: name.trim(),
      code: cleanCode,
      categoryId,
      categoryName: resolvedCategoryName,
      entryType: entryType || "Multiple Entry",
      validityMonths: Number(validityMonths) || 6,
      maxStayDays: Number(maxStayDays) || 90,
      processingTimeDays: Number(processingTimeDays) || 7,
      status: status || "Active"
    });

    return res.status(201).json({
      success: true,
      message: "Visa Type created successfully.",
      data: visaType
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * PUT /api/v1/visa/types/:id
 * Update an existing visa type
 */
router.put("/types/:id", async (req: Request, res: Response) => {
  try {
    const {
      name,
      code,
      categoryId,
      categoryName,
      entryType,
      validityMonths,
      maxStayDays,
      processingTimeDays,
      status
    } = req.body;

    const visaType = await VisaType.findById(req.params.id);
    if (!visaType) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Visa Type not found."));
    }

    if (name) visaType.name = name.trim();
    if (code) visaType.code = code.trim().toUpperCase();
    if (categoryId) {
      visaType.categoryId = categoryId;
      const cat = await VisaCategory.findById(categoryId);
      if (cat) visaType.categoryName = cat.name;
    }
    if (categoryName) visaType.categoryName = categoryName;
    if (entryType) visaType.entryType = entryType;
    if (validityMonths !== undefined) visaType.validityMonths = Number(validityMonths);
    if (maxStayDays !== undefined) visaType.maxStayDays = Number(maxStayDays);
    if (processingTimeDays !== undefined) visaType.processingTimeDays = Number(processingTimeDays);
    if (status) visaType.status = status;

    await visaType.save();

    return res.status(200).json({
      success: true,
      message: "Visa Type updated successfully.",
      data: visaType
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * DELETE /api/v1/visa/types/:id
 * Delete a visa type
 */
router.delete("/types/:id", async (req: Request, res: Response) => {
  try {
    const visaType = await VisaType.findByIdAndDelete(req.params.id);
    if (!visaType) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Visa Type not found."));
    }

    return res.status(200).json({
      success: true,
      message: "Visa Type deleted successfully."
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

// ============================================================================
// 3. VISA REQUIREMENTS API ROUTES
// ============================================================================

/**
 * GET /api/v1/visa/requirements
 * Retrieve all visa requirements from MongoDB (Auto-seeds default requirements if empty)
 */
router.get("/requirements", async (req: Request, res: Response) => {
  try {
    let reqs = await VisaRequirement.find().sort({ createdAt: -1 });

    // Auto-seed default requirements if empty
    if (reqs.length === 0) {
      const types = await VisaType.find();
      const defaultTypeId = types[0]?._id || new Object();
      const defaultTypeName = types[0]?.name || "Schengen Tourist Visa";

      const defaults = [
        {
          title: "Valid Original Passport (Min 6 months validity)",
          code: "VR-REQ-PASSPORT",
          visaTypeId: defaultTypeId,
          visaTypeName: defaultTypeName,
          documentType: "PDF Document",
          isMandatory: true,
          description: "Original passport with at least 2 blank visa pages and valid for at least 6 months post travel.",
          status: "Active"
        },
        {
          title: "Proof of Financial Funds (6 Months Bank Statement)",
          code: "VR-REQ-BANK-STMT",
          visaTypeId: defaultTypeId,
          visaTypeName: defaultTypeName,
          documentType: "Bank Statement",
          isMandatory: true,
          description: "Attested bank statement showing minimum closing balance of ₹2.5 Lakhs per applicant.",
          status: "Active"
        },
        {
          title: "No Objection Certificate (NOC) from Employer",
          code: "VR-REQ-NOC-EMP",
          visaTypeId: defaultTypeId,
          visaTypeName: defaultTypeName,
          documentType: "Notarized Letter",
          isMandatory: true,
          description: "Official NOC letter on company letterhead confirming sanctioned leave dates.",
          status: "Active"
        },
        {
          title: "Schengen Approved Travel Health Insurance (€30,000 Cover)",
          code: "VR-REQ-INSURANCE",
          visaTypeId: defaultTypeId,
          visaTypeName: defaultTypeName,
          documentType: "PDF Document",
          isMandatory: true,
          description: "Medical insurance policy certificate covering emergency medical repatriation.",
          status: "Active"
        }
      ];

      reqs = await VisaRequirement.insertMany(defaults);
    }

    return res.status(200).json({
      success: true,
      count: reqs.length,
      data: reqs
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * POST /api/v1/visa/requirements
 * Create a new visa requirement with validation
 */
router.post("/requirements", async (req: Request, res: Response) => {
  try {
    const {
      title,
      code,
      visaTypeId,
      visaTypeName,
      documentType,
      isMandatory,
      description,
      status
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Requirement Title is required."));
    }

    if (!code || !code.trim()) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Requirement Code is required."));
    }

    if (!visaTypeId) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Target Visa Type is required."));
    }

    const cleanCode = code.trim().toUpperCase();

    // Check duplicate code
    const existing = await VisaRequirement.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json(
        formatErrorEnvelope("DUPLICATE_REQUIREMENT", "A requirement with this Code already exists in MongoDB.")
      );
    }

    let resolvedTypeName = visaTypeName;
    if (!resolvedTypeName) {
      const vt = await VisaType.findById(visaTypeId);
      resolvedTypeName = vt?.name || "Visa Type";
    }

    const requirement = await VisaRequirement.create({
      title: title.trim(),
      code: cleanCode,
      visaTypeId,
      visaTypeName: resolvedTypeName,
      documentType: documentType || "PDF Document",
      isMandatory: isMandatory !== undefined ? isMandatory : true,
      description: description ? description.trim() : "",
      status: status || "Active"
    });

    return res.status(201).json({
      success: true,
      message: "Visa Requirement created successfully.",
      data: requirement
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * PUT /api/v1/visa/requirements/:id
 * Update an existing visa requirement
 */
router.put("/requirements/:id", async (req: Request, res: Response) => {
  try {
    const {
      title,
      code,
      visaTypeId,
      visaTypeName,
      documentType,
      isMandatory,
      description,
      status
    } = req.body;

    const reqDoc = await VisaRequirement.findById(req.params.id);
    if (!reqDoc) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Visa Requirement not found."));
    }

    if (title) reqDoc.title = title.trim();
    if (code) reqDoc.code = code.trim().toUpperCase();
    if (visaTypeId) {
      reqDoc.visaTypeId = visaTypeId;
      const vt = await VisaType.findById(visaTypeId);
      if (vt) reqDoc.visaTypeName = vt.name;
    }
    if (visaTypeName) reqDoc.visaTypeName = visaTypeName;
    if (documentType) reqDoc.documentType = documentType;
    if (isMandatory !== undefined) reqDoc.isMandatory = isMandatory;
    if (description !== undefined) reqDoc.description = description.trim();
    if (status) reqDoc.status = status;

    await reqDoc.save();

    return res.status(200).json({
      success: true,
      message: "Visa Requirement updated successfully.",
      data: reqDoc
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * DELETE /api/v1/visa/requirements/:id
 * Delete a visa requirement
 */
router.delete("/requirements/:id", async (req: Request, res: Response) => {
  try {
    const reqDoc = await VisaRequirement.findByIdAndDelete(req.params.id);
    if (!reqDoc) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Visa Requirement not found."));
    }

    return res.status(200).json({
      success: true,
      message: "Visa Requirement deleted successfully."
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

// ============================================================================
// 4. DOCUMENT TEMPLATES API ROUTES
// ============================================================================

/**
 * GET /api/v1/visa/templates
 * Retrieve all document templates from MongoDB (Auto-seeds default templates if empty)
 */
router.get("/templates", async (_req: Request, res: Response) => {
  try {
    let templates = await DocumentTemplate.find().sort({ createdAt: -1 });

    if (templates.length === 0) {
      const defaultTemplates = [
        {
          templateId: "TMP-101",
          title: "Canada Tourist Visa Personal Cover Letter",
          category: "Cover Letter",
          country: "Canada",
          fileFormat: "DOCX",
          fileSize: "120 KB",
          downloadsCount: 1420,
          status: "Active",
          description: "Standard personal cover letter format required for Canadian tourist visa applications.",
          templateBody: `To,\nThe High Commission of Canada / Visa Officer,\n\nSubject: Application for Visitor Visa for {APPLICANT_NAME} (Passport No: {PASSPORT_NUMBER})\n\nRespected Sir/Madam,\n\nI am writing to formally submit my application for a Canadian Tourist Visa. I plan to visit Canada from {TRAVEL_START_DATE} to {TRAVEL_END_DATE} for sightseeing and holiday purposes.\n\nMy travel itinerary and funds are enclosed herein. I assure you that I will comply with all visa regulations and return to my home country before the expiry of my authorized stay.\n\nThanking you,\n{APPLICANT_NAME}\nContact: {APPLICANT_PHONE}`,
          placeholderFields: ["{APPLICANT_NAME}", "{PASSPORT_NUMBER}", "{TRAVEL_START_DATE}", "{TRAVEL_END_DATE}", "{APPLICANT_PHONE}"]
        },
        {
          templateId: "TMP-102",
          title: "Schengen Visa Employer NOC & Leave Sanction Letter",
          category: "NOC / Leave Letter",
          country: "Schengen / Europe",
          fileFormat: "DOCX",
          fileSize: "95 KB",
          downloadsCount: 2150,
          status: "Active",
          description: "No Objection Certificate (NOC) format on official employer letterhead for Schengen short-stay visas.",
          templateBody: `TO WHOM IT MAY CONCERN\n\nDate: {CURRENT_DATE}\n\nThis is to certify that Mr./Ms. {APPLICANT_NAME}, holding Passport No: {PASSPORT_NUMBER}, is employed with {EMPLOYER_NAME} as a {JOB_TITLE} since {EMPLOYMENT_START_DATE}.\n\nWe have no objection to {APPLICANT_NAME} traveling to Schengen countries from {TRAVEL_START_DATE} to {TRAVEL_END_DATE} for personal vacation. Approved leave has been sanctioned for this period.\n\nSincerely,\n{HR_MANAGER_NAME}\n{EMPLOYER_NAME}`,
          placeholderFields: ["{CURRENT_DATE}", "{APPLICANT_NAME}", "{PASSPORT_NUMBER}", "{EMPLOYER_NAME}", "{JOB_TITLE}", "{EMPLOYMENT_START_DATE}", "{TRAVEL_START_DATE}", "{TRAVEL_END_DATE}", "{HR_MANAGER_NAME}"]
        },
        {
          templateId: "TMP-103",
          title: "UK Visitor Visa Sponsorship & Financial Support Affidavit",
          category: "Sponsorship Letter",
          country: "United Kingdom",
          fileFormat: "PDF",
          fileSize: "180 KB",
          downloadsCount: 980,
          status: "Active",
          description: "Formal declaration of financial support & accommodation guarantee for UK visitor visas.",
          templateBody: `SPONSORSHIP DECLARATION\n\nI, {SPONSOR_NAME}, residing at {SPONSOR_ADDRESS}, UK, hereby declare that I am sponsoring the UK visit of my {RELATIONSHIP}, {APPLICANT_NAME} (Passport No: {PASSPORT_NUMBER}).\n\nI undertake full financial responsibility for accommodation, travel, medical and living expenses during their visit from {TRAVEL_START_DATE} to {TRAVEL_END_DATE}.\n\nSignature: ____________________\n{SPONSOR_NAME}`,
          placeholderFields: ["{SPONSOR_NAME}", "{SPONSOR_ADDRESS}", "{RELATIONSHIP}", "{APPLICANT_NAME}", "{PASSPORT_NUMBER}", "{TRAVEL_START_DATE}", "{TRAVEL_END_DATE}"]
        },
        {
          templateId: "TMP-104",
          title: "US B1/B2 Self-Funding Financial Affidavit",
          category: "Financial Affidavit",
          country: "USA",
          fileFormat: "DOCX",
          fileSize: "110 KB",
          downloadsCount: 1640,
          status: "Active",
          description: "Self-declaration affidavit confirming liquid assets and personal funding for US B1/B2 visas.",
          templateBody: `AFFIDAVIT OF FINANCIAL SUPPORT\n\nI, {APPLICANT_NAME}, holder of Passport No {PASSPORT_NUMBER}, do hereby solemnly affirm that I possess sufficient liquid funds in my bank account ({BANK_NAME}, A/C No: {ACCOUNT_NUMBER}) to cover all expenses for my US trip.\n\nSworn on {CURRENT_DATE} at {CITY_NAME}.\n\nDeponent: {APPLICANT_NAME}`,
          placeholderFields: ["{APPLICANT_NAME}", "{PASSPORT_NUMBER}", "{BANK_NAME}", "{ACCOUNT_NUMBER}", "{CURRENT_DATE}", "{CITY_NAME}"]
        }
      ];

      templates = await DocumentTemplate.insertMany(defaultTemplates);
    }

    return res.status(200).json({
      success: true,
      data: templates
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * POST /api/v1/visa/templates
 * Create a new Document Template in MongoDB
 */
router.post("/templates", async (req: Request, res: Response) => {
  try {
    const { title, category, country, fileFormat, fileSize, description, templateBody, placeholderFields, status } = req.body;

    if (!title || !category || !templateBody) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Title, category, and templateBody are required."));
    }

    const templateId = `TMP-${Math.floor(100 + Math.random() * 900)}`;

    const template = new DocumentTemplate({
      templateId,
      title: String(title).trim(),
      category: String(category).trim(),
      country: country ? String(country).trim() : "Global / All",
      fileFormat: fileFormat || "DOCX",
      fileSize: fileSize || "120 KB",
      downloadsCount: 0,
      status: status || "Active",
      description: description ? String(description).trim() : "",
      templateBody: String(templateBody).trim(),
      placeholderFields: Array.isArray(placeholderFields) ? placeholderFields : []
    });

    await template.save();

    return res.status(201).json({
      success: true,
      message: "Document template created successfully.",
      data: template
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * PUT /api/v1/visa/templates/:id
 * Update an existing Document Template
 */
router.put("/templates/:id", async (req: Request, res: Response) => {
  try {
    const { title, category, country, fileFormat, fileSize, description, templateBody, placeholderFields, status, downloadsCount } = req.body;

    const template = await DocumentTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Document Template not found."));
    }

    if (title) template.title = String(title).trim();
    if (category) template.category = String(category).trim();
    if (country) template.country = String(country).trim();
    if (fileFormat) template.fileFormat = fileFormat;
    if (fileSize) template.fileSize = fileSize;
    if (description !== undefined) template.description = String(description).trim();
    if (templateBody) template.templateBody = String(templateBody).trim();
    if (Array.isArray(placeholderFields)) template.placeholderFields = placeholderFields;
    if (status) template.status = status;
    if (typeof downloadsCount === "number") template.downloadsCount = downloadsCount;

    await template.save();

    return res.status(200).json({
      success: true,
      message: "Document template updated successfully.",
      data: template
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * DELETE /api/v1/visa/templates/:id
 * Delete a Document Template
 */
router.delete("/templates/:id", async (req: Request, res: Response) => {
  try {
    const template = await DocumentTemplate.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Document Template not found."));
    }

    return res.status(200).json({
      success: true,
      message: "Document template deleted successfully."
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

export default router;
