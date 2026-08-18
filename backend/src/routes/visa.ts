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
router.get("/categories", async (_req: Request, res: Response) => {
  try {
    const categories = await VisaCategory.find().sort({ createdAt: -1 });

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
    const types = await VisaType.find().sort({ createdAt: -1 });

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
    const reqs = await VisaRequirement.find().sort({ createdAt: -1 });

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
    const templates = await DocumentTemplate.find().sort({ createdAt: -1 });

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
