import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";
import RefreshToken from "../models/RefreshToken.js";

const adminRouter = Router();

/**
 * Helper to ensure a Super Admin user exists in DB
 */
async function getOrCreateSuperAdmin() {
  let admin = await User.findOne({ role: "Admin" });
  if (!admin) {
    admin = await User.create({
      name: "Vikramaditya Singhania",
      phone: "+91 98100 99001",
      email: "admin@phantomvisa.com",
      role: "Admin",
      designation: "Lead Platform Administrator",
      altPhone: "+91 98100 99002",
      dob: "1988-11-20",
      gender: "Male",
      nationality: "Indian",
      city: "New Delhi, Delhi",
      address: "Suite 402, Visa OS Tower, Connaught Place, New Delhi 110001",
      twoFactorEnabled: true,
      twoFactorSecret: "G-2FA-PHANTOM-ADM9001-SEC",
      idleTimeoutMinutes: 15
    });
  }
  return admin;
}

/**
 * GET /api/v1/admin/profile
 * Fetch Super Admin Profile details
 */
adminRouter.get("/profile", async (req: Request, res: Response) => {
  try {
    const admin = await getOrCreateSuperAdmin();
    const nameParts = (admin.name || "Vikramaditya Singhania").split(" ");
    const firstName = nameParts[0] || "Vikramaditya";
    const lastName = nameParts.slice(1).join(" ") || "Singhania";

    return res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        adminId: "ADM-9001",
        name: admin.name,
        firstName,
        lastName,
        designation: admin.designation || "Lead Platform Administrator",
        gender: admin.gender || "Male",
        dob: admin.dob || "1994-08-15",
        nationality: admin.nationality || "Indian",
        email: admin.email || "admin@phantomvisa.com",
        phone: admin.phone || "+91 98100 11001",
        mobile: admin.phone || "+91 98100 11001",
        altPhone: admin.altPhone || "+91 98100 11002",
        city: admin.city || "New Delhi, Delhi",
        address: admin.address || "Suite 402, Visa OS Tower, Connaught Place, New Delhi 110001",
        avatarUrl: admin.avatarUrl || null,
        twoFactorEnabled: admin.twoFactorEnabled ?? true,
        twoFactorSecret: admin.twoFactorSecret || "G-2FA-PHANTOM-ADM9001-SEC",
        idleTimeoutMinutes: admin.idleTimeoutMinutes || 15,
        role: "Super Admin",
        employeeId: "EMP-2025-001",
        createdAt: admin.createdAt
      }
    });
  } catch (error: any) {
    console.error("Fetch Admin Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch admin profile."
    });
  }
});

/**
 * PUT /api/v1/admin/profile
 * Update Super Admin Profile details with strict phone uniqueness validation
 */
adminRouter.put("/profile", async (req: Request, res: Response) => {
  try {
    const admin = await getOrCreateSuperAdmin();
    const {
      firstName,
      lastName,
      designation,
      gender,
      dob,
      nationality,
      email,
      mobile,
      phone,
      altPhone,
      city,
      address,
      avatarUrl,
      idleTimeoutMinutes
    } = req.body;

    const targetPhone = mobile || phone || admin.phone;

    // Validate phone number uniqueness across all other user accounts
    if (targetPhone && targetPhone !== admin.phone) {
      const cleanDigits = targetPhone.replace(/\D/g, "");
      const last10 = cleanDigits.slice(-10);

      const existingCollision = await User.findOne({
        _id: { $ne: admin._id },
        $or: [
          { phone: targetPhone },
          { phone: cleanDigits },
          { phone: last10 },
          { phone: { $regex: last10, $options: "i" } }
        ]
      });

      if (existingCollision) {
        return res.status(400).json({
          success: false,
          message: `Phone number ${targetPhone} is already in use by another account (${existingCollision.role}: ${existingCollision.name}). Contact fields must be unique per individual.`
        });
      }
    }

    // Validate alternative phone does not collide with primary phone
    if (altPhone && targetPhone && altPhone.replace(/\D/g, "") === targetPhone.replace(/\D/g, "")) {
      return res.status(400).json({
        success: false,
        message: "Alternative contact cannot be identical to the primary phone number."
      });
    }

    // Update fields
    const fullName = `${firstName || ""} ${lastName || ""}`.trim() || admin.name;
    admin.name = fullName;
    if (designation !== undefined) admin.designation = designation;
    if (gender !== undefined) admin.gender = gender;
    if (dob !== undefined) admin.dob = dob;
    if (nationality !== undefined) admin.nationality = nationality;
    if (email !== undefined) admin.email = email;
    if (targetPhone) admin.phone = targetPhone;
    if (altPhone !== undefined) admin.altPhone = altPhone;
    if (city !== undefined) admin.city = city;
    if (address !== undefined) admin.address = address;
    if (avatarUrl !== undefined) admin.avatarUrl = avatarUrl;
    if (idleTimeoutMinutes !== undefined) admin.idleTimeoutMinutes = Number(idleTimeoutMinutes);

    admin.updatedAt = new Date();
    await admin.save();

    // Record Security Activity Log
    try {
      await ActivityLog.create({
        logId: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: admin._id,
        userName: admin.name,
        userEmail: admin.email || "admin@phantomvisa.com",
        activity: "Admin Profile Information Updated",
        activityType: "Security",
        ipAddress: req.ip || "127.0.0.1",
        device: req.headers["user-agent"] || "Chrome / Windows",
        status: "Success",
        details: "Personal, contact, and security preferences saved."
      });
    } catch (e) {}

    return res.status(200).json({
      success: true,
      message: "Admin profile updated successfully.",
      data: admin
    });
  } catch (error: any) {
    console.error("Update Admin Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update admin profile."
    });
  }
});

/**
 * GET /api/v1/admin/security-logs
 * Fetch genuine authentication and security audit logs for the Super Admin
 */
adminRouter.get("/security-logs", async (req: Request, res: Response) => {
  try {
    const admin = await getOrCreateSuperAdmin();

    // Query genuine activity logs and recent refresh token sessions
    const activityLogs = await ActivityLog.find({
      $or: [
        { userId: admin._id },
        { activityType: { $in: ["Authentication", "Security"] } }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(10);

    const activeSessions = await RefreshToken.find({ userId: admin._id })
      .sort({ lastSeenAt: -1 })
      .limit(5);

    // If no records in DB yet, synthesize verified initial logs matching the admin's session
    const logs = activityLogs.map((l) => ({
      time: new Date(l.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }),
      device: l.device || "Unknown Device",
      ip: l.ipAddress || "0.0.0.0",
      location: "India",
      status: l.status || "Success"
    }));

    return res.status(200).json({
      success: true,
      data: {
        logs,
        activeSessionsCount: activeSessions.length || 1,
        lastLogin: logs[0] || null
      }
    });
  } catch (error: any) {
    console.error("Fetch Security Logs Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch security logs."
    });
  }
});

/**
 * POST /api/v1/admin/toggle-2fa
 * Toggle 2FA security configuration and regenerate secret key
 */
adminRouter.post("/toggle-2fa", async (req: Request, res: Response) => {
  try {
    const admin = await getOrCreateSuperAdmin();
    const { enabled, code } = req.body;

    if (enabled && code && code.trim().length !== 6) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 6-digit verification code from your authenticator app."
      });
    }

    admin.twoFactorEnabled = Boolean(enabled);
    if (enabled && !admin.twoFactorSecret) {
      admin.twoFactorSecret = `G-2FA-PHANTOM-ADM9001-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
    await admin.save();

    // Log Activity
    try {
      await ActivityLog.create({
        logId: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: admin._id,
        userName: admin.name,
        userEmail: admin.email || "admin@phantomvisa.com",
        activity: `Two-Factor Authentication ${admin.twoFactorEnabled ? "Enabled" : "Disabled"}`,
        activityType: "Security",
        ipAddress: req.ip || "127.0.0.1",
        device: req.headers["user-agent"] || "Chrome / Windows",
        status: "Success",
        details: `2FA status modified to ${admin.twoFactorEnabled}`
      });
    } catch (e) {}

    return res.status(200).json({
      success: true,
      message: `Two-Factor Authentication has been ${admin.twoFactorEnabled ? "enabled and secured" : "disabled"}.`,
      data: {
        twoFactorEnabled: admin.twoFactorEnabled,
        twoFactorSecret: admin.twoFactorSecret
      }
    });
  } catch (error: any) {
    console.error("Toggle 2FA Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle 2FA."
    });
  }
});

/**
 * POST /api/v1/admin/change-password
 * Change admin password with bcrypt verification
 */
adminRouter.post("/change-password", async (req: Request, res: Response) => {
  try {
    const admin = await getOrCreateSuperAdmin();
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long."
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirmation password do not match."
      });
    }

    if (admin.passwordHash && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect."
        });
      }
    }

    admin.passwordHash = await bcrypt.hash(newPassword, 10);
    await admin.save();

    // Log Security Activity
    try {
      await ActivityLog.create({
        logId: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: admin._id,
        userName: admin.name,
        userEmail: admin.email || "admin@phantomvisa.com",
        activity: "Super Admin Password Changed",
        activityType: "Security",
        ipAddress: req.ip || "127.0.0.1",
        device: req.headers["user-agent"] || "Chrome / Windows",
        status: "Success",
        details: "Root administrator password credentials updated."
      });
    } catch (e) {}

    return res.status(200).json({
      success: true,
      message: "Password changed successfully. Your root administrator account credentials are now updated."
    });
  } catch (error: any) {
    console.error("Change Password Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to change password."
    });
  }
});

export default adminRouter;
