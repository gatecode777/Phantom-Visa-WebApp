import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";
import Agent from "../models/Agent.js";
import { formatErrorEnvelope } from "../lib/middleware/api-standards.js";

const router = Router();

/**
 * POST /api/v1/agent/create
 * Admin Endpoint: Register a new travel agent account in MongoDB
 */
router.post("/create", async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      dob,
      gender,
      nationality,
      email,
      phone,
      altPhone,
      password,
      address,
      city,
      state,
      country,
      postalCode,
      agencyName,
      agencyRegNo,
      businessLicense,
      gstTaxNo,
      officeAddress,
      officeCity,
      officeState,
      officeCountry,
      officePostalCode,
      website,
      yearsInBusiness,
      agencyTypes,
      employeeCount,
      monthlyCapacity,
      accountHolderName,
      bankName,
      accountNumber,
      ifscSwiftCode,
      commissionType,
      commissionValue,
      accountStatus,
      adminNotes
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !agencyName) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "First name, last name, email, phone, and agency name are required."));
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Please provide a valid email address."));
    }

    // Phone number digit count validation (7 to 15 digits for international numbers)
    const rawPhone = phone.replace(/\D/g, "");
    if (rawPhone.length < 7 || rawPhone.length > 15) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Phone number must be between 7 and 15 numeric digits."));
    }

    // DOB validation (No future date & minimum age 18)
    if (dob) {
      const dobDate = new Date(dob);
      const today = new Date();
      if (dobDate > today) {
        return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Date of birth cannot be a future date."));
      }
      const age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate()) ? age - 1 : age;
      if (actualAge < 18) {
        return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", `Agent must be at least 18 years old (Current age: ${actualAge}).`));
      }
    }

    // Check if phone or email already registered (using normalized phone digit matching)
    const cleanPhoneDigits = phone.replace(/\D/g, "");
    const last10Phone = cleanPhoneDigits.length >= 10 ? cleanPhoneDigits.slice(-10) : cleanPhoneDigits;

    const existingUser = await User.findOne({
      $or: [
        { phone },
        { phone: cleanPhoneDigits },
        { phone: last10Phone },
        { phone: { $regex: last10Phone, $options: "i" } },
        { email: email.toLowerCase() }
      ]
    });

    if (existingUser) {
      return res.status(400).json(formatErrorEnvelope("DUPLICATE_USER", "A user account with this phone or email already exists."));
    }

    const passwordHash = await bcrypt.hash(password || "Agent@1234", 10);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    const user = await User.create({
      phone,
      email: email.toLowerCase(),
      passwordHash,
      role: "Agent",
      name: fullName
    });

    const agentCount = await Agent.countDocuments();
    const agentId = `AGT-${1000 + agentCount + 1}`;

    const agent = await Agent.create({
      agentId,
      userId: user._id,
      firstName,
      lastName,
      fullName,
      email: email.toLowerCase(),
      phone,
      altPhone,
      dob,
      gender: gender || "Male",
      nationality: nationality || "Indian",
      address,
      city,
      state,
      country: country || "India",
      postalCode,
      agencyName,
      agencyRegNo,
      businessLicense,
      gstTaxNo,
      officeAddress,
      officeCity,
      officeState,
      officeCountry: officeCountry || "India",
      officePostalCode,
      website,
      yearsInBusiness,
      agencyTypes: Array.isArray(agencyTypes) ? agencyTypes : ["Travel Agency"],
      employeeCount,
      monthlyCapacity,
      accountHolderName,
      bankName,
      accountNumber,
      ifscSwiftCode,
      commissionType: commissionType || "Percentage",
      commissionValue: Number(commissionValue) || 15,
      status: accountStatus || "Pending Approval",
      adminNotes
    });

    return res.status(201).json({
      success: true,
      message: `Travel Agent ${agencyName} (${agentId}) registered successfully in database.`,
      data: {
        agentId: agent.agentId,
        userId: user._id,
        fullName: agent.fullName,
        agencyName: agent.agencyName,
        status: agent.status
      }
    });
  } catch (error: any) {
    console.error("❌ Agent creation error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * GET /api/v1/agent/all
 * Admin Endpoint: Fetch all registered travel agents from MongoDB
 */
router.get("/all", async (req: Request, res: Response) => {
  try {
    const agents = await Agent.find({}).sort({ createdAt: -1 });

    const totalAgents = agents.length;
    const activeAgents = agents.filter((a) => a.status === "Active").length;
    const pendingAgents = agents.filter((a) => a.status === "Pending Approval").length;
    const inactiveAgents = agents.filter((a) => a.status === "Inactive").length;

    return res.status(200).json({
      success: true,
      metrics: {
        totalAgents,
        activeAgents,
        pendingAgents,
        inactiveAgents
      },
      data: agents.map((a) => ({
        id: a.agentId,
        _id: a._id,
        userId: a.userId,
        name: a.fullName,
        agencyName: a.agencyName,
        email: a.email,
        phone: a.phone,
        country: a.country,
        city: a.city || a.officeCity || "N/A",
        status: a.status,
        commission: `${a.commissionValue}% (${a.commissionType})`,
        registeredOn: new Date(a.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      }))
    });
  } catch (error: any) {
    console.error("❌ Fetch agents error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * POST /api/v1/agent/toggle-status
 * Admin Endpoint: Approve, Activate, Block, or Deactivate an Agent
 */
router.post("/toggle-status", async (req: Request, res: Response) => {
  try {
    const { agentId, status, blockReason } = req.body;

    if (!agentId || !status) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Agent ID and status are required."));
    }

    const agent = await Agent.findOne({ $or: [{ agentId }, { _id: mongoose.isValidObjectId(agentId) ? agentId : null }] });
    if (!agent) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Agent record not found."));
    }

    agent.status = status;
    if (blockReason) {
      (agent as any).blockReason = blockReason;
    }
    await agent.save();

    // Also update linked user status if deactivated or blocked
    if (agent.userId) {
      await User.findByIdAndUpdate(agent.userId, {
        isDeactivated: status === "Blocked" || status === "Inactive"
      });
    }

    return res.status(200).json({
      success: true,
      message: `Agent ${agent.agencyName} status updated to ${status}.`,
      data: agent
    });
  } catch (error: any) {
    console.error("❌ Toggle agent status error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * POST /api/v1/agent/update
 * Admin Endpoint: Update existing Agent details in MongoDB
 */
router.post("/update", async (req: Request, res: Response) => {
  try {
    const { agentId, fullName, agencyName, email, phone, status, commissionValue, commissionType } = req.body;

    if (!agentId) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Agent ID is required for update."));
    }

    const agent = await Agent.findOne({ $or: [{ agentId }, { _id: mongoose.isValidObjectId(agentId) ? agentId : null }] });
    if (!agent) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Agent record not found."));
    }

    if (fullName) agent.fullName = fullName;
    if (agencyName) agent.agencyName = agencyName;
    if (email) agent.email = email.toLowerCase();
    if (phone) agent.phone = phone;
    if (status) agent.status = status;
    if (commissionValue) agent.commissionValue = Number(commissionValue);
    if (commissionType) agent.commissionType = commissionType;

    await agent.save();

    if (agent.userId) {
      await User.findByIdAndUpdate(agent.userId, {
        name: fullName || agent.fullName,
        email: email ? email.toLowerCase() : agent.email,
        phone: phone || agent.phone
      });
    }

    return res.status(200).json({
      success: true,
      message: `Agent ${agent.agencyName} updated successfully.`,
      data: agent
    });
  } catch (error: any) {
    console.error("❌ Update agent error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * POST /api/v1/agent/delete
 * Admin Endpoint: Permanently delete an Agent record from MongoDB
 */
router.post("/delete", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Agent ID is required for deletion."));
    }

    const agent = await Agent.findOne({ $or: [{ agentId }, { _id: mongoose.isValidObjectId(agentId) ? agentId : null }] });
    if (!agent) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Agent record not found."));
    }

    if (agent.userId) {
      await User.findByIdAndDelete(agent.userId);
    }
    await Agent.findByIdAndDelete(agent._id);

    return res.status(200).json({
      success: true,
      message: `Agent ${agent.agencyName} (${agent.agentId}) permanently deleted from MongoDB.`
    });
  } catch (error: any) {
    console.error("❌ Delete agent error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

export default router;
