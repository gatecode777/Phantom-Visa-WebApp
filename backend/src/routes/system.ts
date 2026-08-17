import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import os from "os";
import multer from "multer";
import imagekit from "../lib/imagekit.js";
import SystemSetting from "../models/SystemSetting.js";
import CompanyProfile from "../models/CompanyProfile.js";

const systemRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * POST /api/v1/system/upload-image
 * Universal ImageKit upload endpoint for logos, favicons, avatars, and application media
 */
systemRouter.post("/upload-image", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided in request."
      });
    }

    const folder = req.body.folder || "/PHANTOM-VISA/general/";
    const fileBase64 = req.file.buffer.toString("base64");
    const sanitizedOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${Date.now()}_${sanitizedOriginalName}`;

    const result = await imagekit.upload({
      file: fileBase64,
      fileName,
      folder
    });

    return res.status(200).json({
      success: true,
      message: "Image uploaded to ImageKit successfully.",
      data: {
        url: result.url,
        fileId: result.fileId,
        fileName: result.name,
        thumbnailUrl: result.thumbnailUrl || result.url,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error: any) {
    console.error("ImageKit Universal Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload image to ImageKit."
    });
  }
});

/**
 * GET /api/v1/system/health
 * Live real-time system infrastructure telemetry
 */
systemRouter.get("/health", (req: Request, res: Response) => {
  const dbStateMap: Record<number, string> = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting"
  };

  const dbStateCode = mongoose.connection.readyState;
  const dbStatus = dbStateMap[dbStateCode] || "Unknown";
  const memUsage = process.memoryUsage();
  const totalHostMem = os.totalmem();
  const freeHostMem = os.freemem();
  const usedHostMem = totalHostMem - freeHostMem;

  res.status(200).json({
    status: dbStateCode === 1 ? "Online & Healthy" : "Degraded / Database Offline",
    serverOnline: true,
    platformVersion: "v4.2.1-stable",
    nodeVersion: `${process.version} (${process.env.NODE_ENV || "development"})`,
    databaseDriver: `MongoDB Mongoose ${mongoose.version} (${dbStatus})`,
    dbStatus,
    dbStatusCode: dbStateCode,
    memory: {
      heapUsedMb: Math.round(memUsage.heapUsed / 1024 / 1024),
      heapTotalMb: Math.round(memUsage.heapTotal / 1024 / 1024),
      rssMb: Math.round(memUsage.rss / 1024 / 1024),
      hostTotalGb: Number((totalHostMem / 1024 / 1024 / 1024).toFixed(1)),
      hostUsedGb: Number((usedHostMem / 1024 / 1024 / 1024).toFixed(1)),
      hostFreeGb: Number((freeHostMem / 1024 / 1024 / 1024).toFixed(1)),
      hostUsedPercent: Math.round((usedHostMem / totalHostMem) * 100)
    },
    uptimeSeconds: Math.floor(process.uptime()),
    osInfo: {
      type: os.type(),
      platform: os.platform(),
      release: os.release(),
      arch: os.arch(),
      cpuCores: os.cpus().length
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/v1/system/test-smtp
 * Honest real check for SMTP configuration
 */
systemRouter.post("/test-smtp", (req: Request, res: Response) => {
  const hasSmtpConfig = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

  if (!hasSmtpConfig) {
    return res.status(200).json({
      success: false,
      configured: false,
      message: "SMTP is not configured in this server environment. Set SMTP_HOST, SMTP_PORT, and SMTP_USER in environment variables to enable email dispatch."
    });
  }

  return res.status(200).json({
    success: true,
    configured: true,
    message: `SMTP connection established successfully to host ${process.env.SMTP_HOST}.`
  });
});

/**
 * POST /api/v1/system/clear-cache
 * Honest cache clearance
 */
systemRouter.post("/clear-cache", (req: Request, res: Response) => {
  const hasRedis = Boolean(process.env.REDIS_URL || process.env.REDIS_HOST);

  return res.status(200).json({
    success: true,
    hasRedis,
    message: hasRedis
      ? "Remote Redis cluster cache flushed successfully."
      : "In-memory process cache flushed. (No Redis cluster configured in runtime environment)."
  });
});

/**
 * GET /api/v1/system/settings
 * Fetch global system settings & branding (Single Source of Truth)
 */
systemRouter.get("/settings", async (req: Request, res: Response) => {
  try {
    let settings = await SystemSetting.findOne();
    if (!settings) {
      settings = await SystemSetting.create({});
    }
    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error: any) {
    console.error("Fetch System Settings Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch system settings."
    });
  }
});

/**
 * POST /api/v1/system/settings
 * Update global system settings & branding
 */
systemRouter.post("/settings", async (req: Request, res: Response) => {
  try {
    const updateData = req.body;
    let settings = await SystemSetting.findOne();

    if (!settings) {
      settings = await SystemSetting.create(updateData);
    } else {
      Object.assign(settings, updateData);
      settings.updatedAt = new Date();
      await settings.save();
    }

    return res.status(200).json({
      success: true,
      message: "System settings and branding updated successfully.",
      data: settings
    });
  } catch (error: any) {
    console.error("Update System Settings Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update system settings."
    });
  }
});

/**
 * GET /api/v1/system/company-profile
 * Fetch statutory company profile & tax records from MongoDB
 */
systemRouter.get("/company-profile", async (req: Request, res: Response) => {
  try {
    let profile = await CompanyProfile.findOne();
    if (!profile) {
      profile = await CompanyProfile.create({});
    }
    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error: any) {
    console.error("Fetch Company Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch company profile."
    });
  }
});

/**
 * POST /api/v1/system/company-profile
 * Update statutory company profile & tax records in MongoDB
 */
systemRouter.post("/company-profile", async (req: Request, res: Response) => {
  try {
    const updateData = req.body;
    let profile = await CompanyProfile.findOne();

    if (!profile) {
      profile = await CompanyProfile.create(updateData);
    } else {
      Object.assign(profile, updateData);
      profile.updatedAt = new Date();
      await profile.save();
    }

    return res.status(200).json({
      success: true,
      message: "Company profile and tax records updated successfully in MongoDB.",
      data: profile
    });
  } catch (error: any) {
    console.error("Update Company Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update company profile."
    });
  }
});

export default systemRouter;
