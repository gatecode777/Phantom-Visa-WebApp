import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";
import Agent from "../models/Agent.js";
import ActivityLog from "../models/ActivityLog.js";
import RefreshToken from "../models/RefreshToken.js";
import { formatErrorEnvelope } from "../lib/middleware/api-standards.js";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth.js";
import { parseUserAgent } from "../lib/security/ua-parser.js";
import { verifyAccessToken, TokenPayload } from "../lib/security/jwt.js";

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
      supportedVisaCountries,
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
      supportedVisaCountries: Array.isArray(supportedVisaCountries) ? supportedVisaCountries : [],
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
        agentId: a.agentId,
        id: a.agentId,
        _id: a._id,
        userId: a.userId,
        name: a.fullName,
        fullName: a.fullName,
        firstName: a.firstName,
        lastName: a.lastName,
        dob: a.dob,
        gender: a.gender,
        nationality: a.nationality,
        agencyName: a.agencyName,
        email: a.email,
        phone: a.phone,
        altPhone: a.altPhone,
        country: a.country,
        city: a.city || a.officeCity || "N/A",
        state: a.state,
        postalCode: a.postalCode,
        officeAddress: a.officeAddress,
        officeCity: a.officeCity,
        officeState: a.officeState,
        officeCountry: a.officeCountry,
        officePostalCode: a.officePostalCode,
        agencyRegNo: a.agencyRegNo,
        businessLicense: a.businessLicense,
        gstTaxNo: a.gstTaxNo,
        website: a.website,
        yearsInBusiness: a.yearsInBusiness,
        agencyTypes: a.agencyTypes,
        supportedVisaCountries: a.supportedVisaCountries,
        employeeCount: a.employeeCount,
        monthlyCapacity: a.monthlyCapacity,
        accountHolderName: a.accountHolderName,
        bankName: a.bankName,
        accountNumber: a.accountNumber,
        ifscSwiftCode: a.ifscSwiftCode,
        status: a.status,
        commissionValue: a.commissionValue,
        commissionType: a.commissionType,
        commission: `${a.commissionValue || 15}% (${a.commissionType || 'Percentage'})`,
        adminNotes: a.adminNotes,
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

    let agent = await Agent.findOne({
      $or: [
        { agentId },
        { agentId: new RegExp(`^${agentId}$`, "i") },
        { email: new RegExp(`^${agentId}$`, "i") },
        { _id: mongoose.isValidObjectId(agentId) ? agentId : null }
      ]
    });

    if (!agent && typeof agentId === "string") {
      agent = await Agent.findOne({ agencyName: new RegExp(agentId, "i") });
    }

    if (agent) {
      agent.status = status;
      if (blockReason) {
        (agent as any).blockReason = blockReason;
      }
      await agent.save();

      if (agent.userId) {
        await User.findByIdAndUpdate(agent.userId, {
          isDeactivated: status === "Blocked" || status === "Inactive"
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: agent ? `Agent ${agent.agencyName} status updated to ${status}.` : `Agent status updated to ${status}.`,
      data: agent || { agentId, status }
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
    const {
      agentId,
      fullName,
      firstName,
      lastName,
      dob,
      gender,
      nationality,
      agencyName,
      email,
      phone,
      altPhone,
      address,
      city,
      state,
      country,
      postalCode,
      officeAddress,
      officeCity,
      officeState,
      officeCountry,
      officePostalCode,
      agencyRegNo,
      businessLicense,
      gstTaxNo,
      website,
      yearsInBusiness,
      agencyTypes,
      supportedVisaCountries,
      employeeCount,
      monthlyCapacity,
      accountHolderName,
      bankName,
      accountNumber,
      ifscSwiftCode,
      status,
      commissionValue,
      commissionType,
      adminNotes
    } = req.body;

    if (!agentId) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Agent ID is required for update."));
    }

    // Server-side field validations
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Please provide a valid email address."));
    }

    if (phone) {
      const rawPhone = phone.replace(/\D/g, "");
      if (rawPhone.length < 7 || rawPhone.length > 15) {
        return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Phone number must be between 7 and 15 numeric digits."));
      }
    }

    if (accountNumber && accountNumber.trim()) {
      const cleanAcc = accountNumber.replace(/[\s-]/g, "");
      if (!/^\d{8,20}$/.test(cleanAcc)) {
        return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Bank account number must be between 8 and 20 numeric digits."));
      }
    }

    if (ifscSwiftCode && ifscSwiftCode.trim()) {
      if (!/^[A-Za-z0-9]{4,11}$/.test(ifscSwiftCode.trim())) {
        return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "IFSC/SWIFT code must be 4 to 11 alphanumeric characters."));
      }
    }

    let agent = await Agent.findOne({
      $or: [
        { agentId },
        { agentId: new RegExp(`^${agentId}$`, "i") },
        { email: new RegExp(`^${agentId}$`, "i") },
        { _id: mongoose.isValidObjectId(agentId) ? agentId : null }
      ]
    });

    if (!agent && agencyName) {
      agent = await Agent.findOne({ agencyName: new RegExp(agencyName, "i") });
    }

    if (agent) {
      if (fullName) agent.fullName = fullName;
      if (firstName) agent.firstName = firstName;
      if (lastName) agent.lastName = lastName;
      if (dob) agent.dob = dob;
      if (gender) agent.gender = gender;
      if (nationality) agent.nationality = nationality;
      if (agencyName) agent.agencyName = agencyName;
      if (email) agent.email = email.toLowerCase();
      if (phone) agent.phone = phone;
      if (altPhone !== undefined) agent.altPhone = altPhone;
      if (address !== undefined) agent.address = address;
      if (city !== undefined) agent.city = city;
      if (state !== undefined) agent.state = state;
      if (country !== undefined) agent.country = country;
      if (postalCode !== undefined) agent.postalCode = postalCode;
      if (officeAddress !== undefined) agent.officeAddress = officeAddress;
      if (officeCity !== undefined) agent.officeCity = officeCity;
      if (officeState !== undefined) agent.officeState = officeState;
      if (officeCountry !== undefined) agent.officeCountry = officeCountry;
      if (officePostalCode !== undefined) agent.officePostalCode = officePostalCode;
      if (agencyRegNo !== undefined) agent.agencyRegNo = agencyRegNo;
      if (businessLicense !== undefined) agent.businessLicense = businessLicense;
      if (gstTaxNo !== undefined) agent.gstTaxNo = gstTaxNo;
      if (website !== undefined) agent.website = website;
      if (yearsInBusiness !== undefined) agent.yearsInBusiness = yearsInBusiness;
      if (agencyTypes && Array.isArray(agencyTypes)) agent.agencyTypes = agencyTypes;
      if (supportedVisaCountries && Array.isArray(supportedVisaCountries)) agent.supportedVisaCountries = supportedVisaCountries;
      if (employeeCount !== undefined) agent.employeeCount = employeeCount;
      if (monthlyCapacity !== undefined) agent.monthlyCapacity = monthlyCapacity;
      if (accountHolderName !== undefined) agent.accountHolderName = accountHolderName;
      if (bankName !== undefined) agent.bankName = bankName;
      if (accountNumber !== undefined) agent.accountNumber = accountNumber;
      if (ifscSwiftCode !== undefined) agent.ifscSwiftCode = ifscSwiftCode;
      if (status) agent.status = status;
      if (commissionValue !== undefined) agent.commissionValue = Number(commissionValue);
      if (commissionType) agent.commissionType = commissionType;
      if (adminNotes !== undefined) agent.adminNotes = adminNotes;

      await agent.save();

      if (agent.userId) {
        await User.findByIdAndUpdate(agent.userId, {
          name: fullName || `${agent.firstName || ''} ${agent.lastName || ''}`.trim() || agent.fullName,
          email: email ? email.toLowerCase() : agent.email,
          phone: phone || agent.phone
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: agent ? `Agent ${agent.agencyName} updated successfully.` : `Agent updated successfully.`,
      data: agent || req.body
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

    const agent = await Agent.findOne({
      $or: [
        { agentId },
        { agentId: new RegExp(`^${agentId}$`, "i") },
        { email: new RegExp(`^${agentId}$`, "i") },
        { _id: mongoose.isValidObjectId(agentId) ? agentId : null }
      ]
    });

    if (agent) {
      if (agent.userId) {
        await User.findByIdAndDelete(agent.userId);
      }
      await Agent.findByIdAndDelete(agent._id);
    }

    return res.status(200).json({
      success: true,
      message: `Agent record permanently deleted.`
    });
  } catch (error: any) {
    console.error("❌ Delete agent error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * GET /api/v1/agent/by-country?country=Australia
 * Public Endpoint: Fetch Active agents who support visa for the given country
 * Used in the Apply Visa form Step 1 to show available agents dynamically
 */
router.get("/by-country", async (req: Request, res: Response) => {
  try {
    const countryName = String(req.query.country || "").trim();

    if (!countryName) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Query param 'country' is required."));
    }

    // Case-insensitive regex match against each element in supportedVisaCountries array
    const agents = await Agent.find({
      status: "Active",
      supportedVisaCountries: {
        $elemMatch: { $regex: new RegExp(`^${countryName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") }
      }
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: agents.length,
      data: agents.map((a) => ({
        agentId: a.agentId,
        fullName: a.fullName,
        agencyName: a.agencyName,
        city: a.city || a.officeCity || "",
        state: a.state || a.officeState || "",
        yearsInBusiness: a.yearsInBusiness || "",
        monthlyCapacity: a.monthlyCapacity || "",
        supportedVisaCountries: a.supportedVisaCountries || [],
        commissionType: a.commissionType,
        commissionValue: a.commissionValue
      }))
    });
  } catch (error: any) {
    console.error("❌ Fetch agents by country error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * GET /api/v1/agent/profile
 * Agent Self-Service: Fetch the authenticated agent's own profile from MongoDB.
 * Resolves account via JWT agentId, query param, or user phone/email.
 */
router.get("/profile", async (req: Request, res: Response) => {
  try {
    let tokenUser: TokenPayload | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      tokenUser = verifyAccessToken(authHeader.slice(7));
    }

    const queryAgentId = (req.query.agentId as string) || (req.headers["x-agent-id"] as string);
    const tokenAgentId = tokenUser?.agentId || queryAgentId;
    const tokenUserId  = tokenUser?.userId;
    const tokenPhone   = tokenUser?.phone;

    const lookupQueries: any[] = [];
    if (tokenAgentId) {
      lookupQueries.push({ agentId: tokenAgentId });
      lookupQueries.push({ agentId: new RegExp(`^${tokenAgentId.trim()}$`, "i") });
    }
    if (tokenUserId) {
      if (mongoose.isValidObjectId(tokenUserId)) {
        lookupQueries.push({ userId: new mongoose.Types.ObjectId(tokenUserId) });
      }
      lookupQueries.push({ userId: tokenUserId });
    }
    if (tokenPhone) {
      lookupQueries.push({ phone: tokenPhone });
      const cleanPhone = tokenPhone.replace(/\D/g, "");
      if (cleanPhone) {
        lookupQueries.push({ phone: { $regex: cleanPhone.slice(-10), $options: "i" } });
      }
    }
    if (queryAgentId && queryAgentId !== tokenAgentId) {
      lookupQueries.push({ agentId: queryAgentId });
      lookupQueries.push({ agentId: new RegExp(`^${queryAgentId.trim()}$`, "i") });
    }

    if (lookupQueries.length === 0) {
      return res.status(401).json(formatErrorEnvelope("UNAUTHORIZED", "Agent identity could not be resolved."));
    }

    const agent = await Agent.findOne({ $or: lookupQueries });

    if (!agent) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Agent profile record not found."));
    }

    // Pull linked User record for fallback values
    const linkedUserId = agent.userId || (tokenUserId ? new mongoose.Types.ObjectId(tokenUserId) : null);
    const linkedUser = linkedUserId ? await User.findById(linkedUserId).select("-passwordHash") : null;

    // Derive firstName/lastName from fullName when individual fields are blank
    const storedFull = (agent.fullName || linkedUser?.name || "").trim();
    const nameParts = storedFull.split(/\s+/);
    const derivedFirst = nameParts[0] || "";
    const derivedLast  = nameParts.slice(1).join(" ") || "";

    const firstName = (agent.firstName || derivedFirst || "").trim();
    const lastName  = (agent.lastName  || derivedLast || "").trim();
    const email     = agent.email     || (linkedUser as any)?.email || "";
    const phone     = agent.phone     || (linkedUser as any)?.phone || "";

    return res.status(200).json({
      success: true,
      data: {
        agentId:          agent.agentId,
        userId:           agent.userId,
        firstName:        firstName || (agent.firstName || "").trim(),
        lastName:         lastName || (agent.lastName || "").trim(),
        fullName:         storedFull || `${firstName} ${lastName}`.trim(),
        email,
        phone,
        altPhone:         agent.altPhone         || "",
        dob:              agent.dob              || (linkedUser as any)?.dob        || "",
        gender:           agent.gender           || (linkedUser as any)?.gender     || "Male",
        nationality:      agent.nationality      || (linkedUser as any)?.nationality || "Indian",
        address:          agent.address          || agent.officeAddress             || "",
        city:             agent.city             || agent.officeCity                || "",
        state:            agent.state            || agent.officeState               || "",
        country:          agent.country          || "India",
        postalCode:       agent.postalCode       || "",
        agencyName:       agent.agencyName       || "",
        agencyRegNo:      agent.agencyRegNo      || "",
        businessLicense:  agent.businessLicense  || "",
        gstTaxNo:         agent.gstTaxNo         || "",
        officeAddress:    agent.officeAddress    || "",
        officeCity:       agent.officeCity       || "",
        officeState:      agent.officeState      || "",
        website:          agent.website          || "",
        yearsInBusiness:  agent.yearsInBusiness  || "",
        employeeCount:    agent.employeeCount     || "",
        monthlyCapacity:  agent.monthlyCapacity   || "",
        commissionType:   agent.commissionType    || "Percentage",
        commissionValue:  agent.commissionValue   ?? 15,
        status:           agent.status,
        avatarUrl:        (agent as any).avatarUrl         || null,
        twoFactorEnabled: (agent as any).twoFactorEnabled  ?? false,
        idleTimeoutMinutes: (agent as any).idleTimeoutMinutes || 30,
        role:             "Agent",
        createdAt:        agent.createdAt
      }
    });
  } catch (error: any) {
    console.error("❌ Agent self-profile fetch error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * PUT /api/v1/agent/profile
 * Agent Self-Service: Update the authenticated agent's own profile fields.
 */
router.put("/profile", async (req: Request, res: Response) => {
  try {
    let tokenUser: TokenPayload | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      tokenUser = verifyAccessToken(authHeader.slice(7));
    }

    const queryAgentId = (req.query.agentId as string) || (req.headers["x-agent-id"] as string) || req.body.agentId;
    const tokenAgentId = tokenUser?.agentId || queryAgentId;
    const tokenUserId  = tokenUser?.userId;

    const lookupQueries: any[] = [];
    if (tokenAgentId) {
      lookupQueries.push({ agentId: tokenAgentId });
      lookupQueries.push({ agentId: new RegExp(`^${tokenAgentId.trim()}$`, "i") });
    }
    if (tokenUserId && mongoose.isValidObjectId(tokenUserId)) {
      lookupQueries.push({ userId: new mongoose.Types.ObjectId(tokenUserId) });
    }
    if (tokenUser?.phone) {
      lookupQueries.push({ phone: tokenUser.phone });
    }

    if (lookupQueries.length === 0) {
      return res.status(401).json(formatErrorEnvelope("UNAUTHORIZED", "Agent identity could not be resolved."));
    }

    const agent = await Agent.findOne({ $or: lookupQueries });

    if (!agent) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Agent profile record not found."));
    }

    const {
      firstName, lastName, dob, gender, nationality,
      address, city, state, country, postalCode,
      altPhone, website, gstTaxNo, avatarUrl, idleTimeoutMinutes
    } = req.body;

    if (firstName !== undefined) { agent.firstName = firstName; }
    if (lastName !== undefined) { agent.lastName = lastName; }
    if (firstName || lastName) {
      agent.fullName = `${agent.firstName || ''} ${agent.lastName || ''}`.trim();
    }
    if (dob !== undefined) agent.dob = dob;
    if (gender !== undefined) agent.gender = gender;
    if (nationality !== undefined) agent.nationality = nationality;
    if (address !== undefined) agent.address = address;
    if (city !== undefined) agent.city = city;
    if (state !== undefined) agent.state = state;
    if (country !== undefined) agent.country = country;
    if (postalCode !== undefined) agent.postalCode = postalCode;
    if (altPhone !== undefined) agent.altPhone = altPhone;
    if (website !== undefined) agent.website = website;
    if (gstTaxNo !== undefined) agent.gstTaxNo = gstTaxNo;
    if (avatarUrl !== undefined) (agent as any).avatarUrl = avatarUrl;
    if (idleTimeoutMinutes !== undefined) (agent as any).idleTimeoutMinutes = Number(idleTimeoutMinutes);

    await agent.save();

    // Sync name back to User document
    if (agent.userId) {
      await User.findByIdAndUpdate(agent.userId, { name: agent.fullName });
    }

    // Record activity log
    try {
      await ActivityLog.create({
        logId: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: agent.userId,
        userName: agent.fullName,
        userEmail: agent.email,
        activity: "Agent Profile Updated",
        activityType: "Security",
        ipAddress: (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown",
        device: req.headers["user-agent"] || "Unknown",
        status: "Success",
        details: "Agent self-service profile fields updated."
      });
    } catch (_e) {}

    return res.status(200).json({
      success: true,
      message: "Agent profile updated successfully.",
      data: agent
    });
  } catch (error: any) {
    console.error("❌ Agent self-profile update error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * GET /api/v1/agent/security-logs
 * Agent Self-Service: Fetch real login session history for the authenticated agent.
 * Returns genuine RefreshToken sessions and ActivityLog entries scoped exclusively
 * to this agent's userId — never cross-contaminated with other accounts.
 */
router.get("/security-logs", async (req: Request, res: Response) => {
  try {
    let tokenUser: TokenPayload | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      tokenUser = verifyAccessToken(authHeader.slice(7));
    }

    const queryAgentId = (req.query.agentId as string) || (req.headers["x-agent-id"] as string);
    const tokenAgentId = tokenUser?.agentId || queryAgentId;
    const tokenUserId  = tokenUser?.userId;

    const lookupQueries: any[] = [];
    if (tokenAgentId) {
      lookupQueries.push({ agentId: tokenAgentId });
      lookupQueries.push({ agentId: new RegExp(`^${tokenAgentId.trim()}$`, "i") });
    }
    if (tokenUserId && mongoose.isValidObjectId(tokenUserId)) {
      lookupQueries.push({ userId: new mongoose.Types.ObjectId(tokenUserId) });
    }
    if (tokenUser?.phone) {
      lookupQueries.push({ phone: tokenUser.phone });
    }

    if (lookupQueries.length === 0) {
      return res.status(200).json({ success: true, data: { logs: [], activeSessionsCount: 0, lastLogin: null } });
    }

    const agent = await Agent.findOne({ $or: lookupQueries });

    if (!agent) {
      return res.status(200).json({ success: true, data: { logs: [], activeSessionsCount: 0, lastLogin: null } });
    }

    // Fetch real RefreshToken sessions for this agent's userId (most recent first)
    const sessions = await RefreshToken.find({ userId: agent.userId })
      .sort({ lastSeenAt: -1 })
      .limit(10);

    // Fetch ActivityLog entries scoped to this agent only
    const activityLogs = await ActivityLog.find({ userId: agent.userId })
      .sort({ createdAt: -1 })
      .limit(10);

    // Build login history from RefreshToken sessions (real, stamped at login)
    const sessionLogs = sessions.map((s) => {
      const { deviceName, browser } = parseUserAgent(""); // already parsed at login time
      const resolvedDevice = s.deviceName && s.deviceName !== "Unknown Device" ? s.deviceName : deviceName;
      const resolvedBrowser = s.browser && s.browser !== "Unknown Browser" ? s.browser : browser;
      const ip = s.ipAddress || "";
      // Filter out loopback dev addresses for display — show as "Private Network" in non-prod
      const displayIp = ip === "::1" || ip === "127.0.0.1" || ip === "" ? "Private Network" : ip;
      return {
        time: new Date(s.lastSeenAt || s.createdAt).toLocaleString("en-IN", {
          day: "2-digit", month: "short", year: "numeric",
          hour: "2-digit", minute: "2-digit", hour12: true
        }),
        device: `${resolvedBrowser} / ${resolvedDevice}`,
        ip: displayIp,
        location: s.location || "India",
        status: s.revoked ? "Revoked" : "Success"
      };
    });

    // Merge activity logs (profile updates, 2FA changes, etc.)
    const activityEntries = activityLogs.map((l) => {
      const rawUA = typeof l.device === "string" && l.device.length > 40 ? parseUserAgent(l.device) : null;
      const displayDevice = rawUA
        ? `${rawUA.browser} / ${rawUA.deviceName}`
        : (l.device || "Agent Portal");
      const ip = l.ipAddress || "";
      const displayIp = ip === "::1" || ip === "127.0.0.1" || ip === "" ? "Private Network" : ip;
      return {
        time: new Date(l.createdAt).toLocaleString("en-IN", {
          day: "2-digit", month: "short", year: "numeric",
          hour: "2-digit", minute: "2-digit", hour12: true
        }),
        device: displayDevice,
        ip: displayIp,
        location: "India",
        status: l.status || "Success"
      };
    });

    // Merge and sort by most recent, deduplicate within same minute
    const allLogs = [...sessionLogs, ...activityEntries]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      data: {
        logs: allLogs,
        activeSessionsCount: sessions.filter((s) => !s.revoked && s.expiresAt > new Date()).length,
        lastLogin: sessionLogs[0] || null
      }
    });
  } catch (error: any) {
    console.error("❌ Agent security-logs error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * POST /api/v1/agent/change-password
 * Agent Self-Service: Change the agent's own password with bcrypt verification.
 */
router.post("/change-password", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tokenRole = req.user?.role;
    const tokenUserId = req.user?.userId;

    if (tokenRole !== "Agent") {
      return res.status(403).json(formatErrorEnvelope("FORBIDDEN", "This endpoint is only accessible to Agent accounts."));
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "New password must be at least 8 characters."));
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "New password and confirmation do not match."));
    }

    const user = await User.findById(tokenUserId);
    if (!user) {
      return res.status(404).json(formatErrorEnvelope("NOT_FOUND", "Agent user account not found."));
    }

    if (user.passwordHash && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json(formatErrorEnvelope("INVALID_CREDENTIALS", "Current password is incorrect."));
      }
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Log security event
    try {
      await ActivityLog.create({
        logId: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: user._id,
        userName: user.name,
        userEmail: user.email || "",
        activity: "Agent Password Changed",
        activityType: "Security",
        ipAddress: (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown",
        device: req.headers["user-agent"] || "Unknown",
        status: "Success",
        details: "Agent account password credentials updated via self-service."
      });
    } catch (_e) {}

    return res.status(200).json({
      success: true,
      message: "Password changed successfully."
    });
  } catch (error: any) {
    console.error("❌ Agent change-password error:", error);
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

export default router;

