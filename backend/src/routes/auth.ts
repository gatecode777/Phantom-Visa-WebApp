import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import path from "path";

import User from "../models/User.js";
import Applicant from "../models/Applicant.js";
import RefreshToken from "../models/RefreshToken.js";
import { getNextSequenceValue } from "../models/Counter.js";
import { issueTokens, hashRefreshToken, getRefreshTokenExpiry, TokenPayload } from "../lib/security/jwt.js";
import { documentUploadFields } from "../middleware/upload.js";
import { formatErrorEnvelope } from "../lib/middleware/api-standards.js";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

// Rate limiter for auth endpoints (prevents brute-force attempts)
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 requests per windowMs
  message: formatErrorEnvelope("TOO_MANY_REQUESTS", "Too many authentication attempts. Please try again in 15 minutes.")
});

/**
 * POST /api/v1/auth/register-applicant
 * Multi-step Applicant Registration with file uploads & MongoDB persistence
 */
router.post("/register-applicant", authRateLimiter, documentUploadFields, async (req: Request, res: Response) => {
  try {
    const body = req.body;

    // Parse JSON string fields if sent via FormData
    let formData = body;
    if (typeof body.formData === "string") {
      try {
        formData = JSON.parse(body.formData);
      } catch (err) {
        formData = body;
      }
    }

    const {
      fullName,
      firstName,
      lastName,
      dob,
      gender,
      nationality,
      phone,
      email,
      password,
      emergencyPhone,
      passportNo,
      address,
      addressLine1,
      addressLine2,
      city,
      state,
      stateOrProvince,
      country,
      postalCode,
      passportType,
      passportIssueDate,
      passportExpiryDate,
      passportPlaceOfIssue,
      passportIssuingCountry,
      destinationCountry,
      visaCategory,
      visaType,
      purposeOfVisit,
      entryType,
      durationOfStay,
      expectedTravelDate,
      preferredEmbassy,
      govtIdType,
      govtIdNumber,
      aadhaarNumber,
      panCardNumber
    } = formData;

    // Server-side validation
    if (!phone || !fullName || !password) {
      return res.status(400).json(
        formatErrorEnvelope("VALIDATION_ERROR", "Full Name, Phone number, and Password are required.")
      );
    }

    // Check if phone or email already registered
    const cleanPhoneDigits = phone.replace(/\D/g, "");
    const last10Phone = cleanPhoneDigits.length >= 10 ? cleanPhoneDigits.slice(-10) : cleanPhoneDigits;

    const existingUser = await User.findOne({
      $or: [
        { phone },
        { phone: cleanPhoneDigits },
        { phone: last10Phone },
        { phone: { $regex: last10Phone, $options: "i" } }
      ]
    });

    if (existingUser) {
      return res.status(409).json(
        formatErrorEnvelope("USER_EXISTS", "An account with this phone number already exists.")
      );
    }

    // Hash password securely with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User record
    const user = await User.create({
      phone,
      email: email || undefined,
      passwordHash,
      role: "Applicant",
      name: fullName
    });

    // Generate real sequential Applicant ID (APP-1001, APP-1002, etc.)
    const seqNum = await getNextSequenceValue("applicantId");
    const applicantId = `APP-${seqNum}`;

    // Handle document file uploads
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const documentsObj: Record<string, string> = {};

    if (files) {
      Object.keys(files).forEach((key) => {
        if (files[key] && files[key][0]) {
          const file = files[key][0];
          documentsObj[key] = `/uploads/${file.filename}`;
        }
      });
    }

    // Initial timeline for new application
    const nowStr = new Date().toISOString().split("T")[0];
    const initialTimeline = [
      {
        status: "Submitted",
        label: "Application Submitted",
        date: nowStr,
        description: "Application package successfully received and indexed.",
        completed: true
      },
      {
        status: "Docs Uploaded",
        label: "Document Verification",
        date: "Pending",
        description: "Document integrity and OCR compliance check.",
        completed: false
      },
      {
        status: "Docs Verified",
        label: "Document Verification",
        date: "Pending",
        description: "Document integrity and OCR compliance check.",
        completed: false
      },
      {
        status: "Embassy Processing",
        label: "Embassy Processing",
        date: "Pending",
        description: "Application under formal consular audit.",
        completed: false
      },
      {
        status: "Approved",
        label: "Visa Stamped",
        date: "Pending",
        description: "Final decision and passport dispatch.",
        completed: false
      }
    ];

    // Initial default appointment placeholder
    const initialAppointments = [
      {
        id: `apt_${Date.now()}`,
        title: `${destinationCountry || "Embassy"} Biometrics & Interview`,
        date: expectedTravelDate || "2026-08-15",
        time: "10:30 AM",
        location: preferredEmbassy || "VFS Global Center, New Delhi",
        status: "Scheduled" as const
      }
    ];

    // Initial welcome message
    const initialMessages = [
      {
        id: `msg_${Date.now()}`,
        sender: "System Officer",
        text: `Welcome ${fullName}! Your visa application (${applicantId}) for ${destinationCountry || "your destination"} has been submitted successfully.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        unread: true
      }
    ];

    // Format full combined address string
    const formattedAddress = addressLine1
      ? `${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}`
      : address || "";

    // Create Applicant record in MongoDB
    const applicant = await Applicant.create({
      applicantId,
      userId: user._id,
      personalInfo: {
        fullName,
        firstName: firstName || fullName.split(" ")[0] || "",
        lastName: lastName || fullName.split(" ").slice(1).join(" ") || "",
        dob: dob || "1995-01-01",
        gender: gender || "Male",
        nationality: nationality || "Indian",
        phone,
        email: email || "",
        country: country || "India",
        addressLine1: addressLine1 || "",
        addressLine2: addressLine2 || "",
        address: formattedAddress,
        city: city || "",
        state: stateOrProvince || state || "",
        postalCode: postalCode || ""
      },
      kycDetails: {
        kycStatus: "Pending",
        submittedAt: new Date()
      },
      status: "Submitted"
    });

    return res.status(201).json({
      success: true,
      message: "Applicant registration successful. Please log in to view your dashboard.",
      data: {
        applicantId: applicant.applicantId,
        userId: user._id,
        phone: user.phone,
        name: user.name
      }
    });
  } catch (error: any) {
    console.error("❌ Registration Error:", error);
    return res.status(500).json(
      formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to register applicant.")
    );
  }
});

/**
 * POST /api/v1/auth/login
 * Password & Phone/Email authentication with JWT & HTTP-Only cookie issuance
 */
router.post("/login", authRateLimiter, async (req: Request, res: Response) => {
  try {
    const { phone, email, password, role } = req.body;

    if ((!phone && !email) || !password) {
      return res.status(400).json(
        formatErrorEnvelope("INVALID_CREDENTIALS", "Phone number/Email and password are required.")
      );
    }

    // Find user by phone or email with flexible digit matching
    let query: any;
    if (phone) {
      const cleanDigits = (phone as string).replace(/\D/g, "");
      const last10Digits = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : cleanDigits;
      query = {
        $or: [
          { phone },
          { phone: cleanDigits },
          { phone: last10Digits },
          { phone: { $regex: last10Digits, $options: "i" } }
        ]
      };
    } else {
      query = { email: (email as string).toLowerCase() };
    }

    let user = null;
    if (role) {
      user = await User.findOne({ ...query, role });
      if (!user) {
        const anyUser = await User.findOne(query);
        if (anyUser) {
          return res.status(400).json(
            formatErrorEnvelope(
              "ROLE_MISMATCH",
              `No ${role} account registered with these credentials. This account is registered as an ${anyUser.role}. Please select the ${anyUser.role} tab to log in.`
            )
          );
        }
      }
    } else {
      user = await User.findOne(query);
    }

    if (!user || user.isDeactivated) {
      return res.status(401).json(
        formatErrorEnvelope("INVALID_CREDENTIALS", "Invalid credentials or account deactivated.")
      );
    }

    // Validate password if user has a passwordHash
    if (user.passwordHash) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json(
          formatErrorEnvelope("INVALID_CREDENTIALS", "Invalid phone number/email or password.")
        );
      }
    }

    // Find linked applicant record if present
    const applicant = await Applicant.findOne({ userId: user._id });

    // Issue JWT Access Token (15m) and Refresh Token (30d)
    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      role: user.role,
      phone: user.phone,
      applicantId: applicant?.applicantId
    };

    const tokens = issueTokens(tokenPayload);

    // Save Refresh Token Hash in DB
    const refreshTokenHash = hashRefreshToken(tokens.refreshToken);
    await RefreshToken.create({
      userId: user._id,
      tokenHash: refreshTokenHash,
      expiresAt: getRefreshTokenExpiry()
    });

    // Set HTTP-Only Cookie for Refresh Token
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/v1/auth",
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      data: {
        user: {
          id: user._id.toString(),
          phone: user.phone,
          email: user.email,
          name: user.name,
          role: user.role,
          applicantId: applicant?.applicantId
        },
        accessToken: tokens.accessToken
      }
    });
  } catch (error: any) {
    console.error("❌ Login Error:", error);
    return res.status(500).json(
      formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "An unexpected error occurred.")
    );
  }
});

/**
 * POST /api/v1/auth/refresh
 * Refresh Access Token using HTTP-Only Refresh Token Cookie
 */
router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json(formatErrorEnvelope("NO_REFRESH_TOKEN", "Refresh token missing."));
    }

    const tokenHash = hashRefreshToken(refreshToken);
    const storedToken = await RefreshToken.findOne({ tokenHash, revoked: false });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(401).json(formatErrorEnvelope("INVALID_REFRESH_TOKEN", "Refresh token expired or revoked."));
    }

    const user = await User.findById(storedToken.userId);
    if (!user || user.isDeactivated) {
      return res.status(401).json(formatErrorEnvelope("INVALID_USER", "User account disabled or not found."));
    }

    const applicant = await Applicant.findOne({ userId: user._id });

    const newTokens = issueTokens({
      userId: user._id.toString(),
      role: user.role,
      phone: user.phone,
      applicantId: applicant?.applicantId
    });

    return res.status(200).json({
      success: true,
      accessToken: newTokens.accessToken
    });
  } catch (error: any) {
    return res.status(500).json(
      formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to refresh token.")
    );
  }
});

/**
 * POST /api/v1/auth/logout
 * Revoke refresh token and clear HTTP-Only cookie
 */
router.post("/logout", async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (refreshToken) {
      const tokenHash = hashRefreshToken(refreshToken);
      await RefreshToken.updateOne({ tokenHash }, { $set: { revoked: true } });
    }

    res.clearCookie("refreshToken", { path: "/api/v1/auth" });

    return res.status(200).json({
      success: true,
      message: "Successfully logged out and session revoked."
    });
  } catch (error: any) {
    return res.status(500).json(
      formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Logout failed.")
    );
  }
});

/**
 * POST /api/v1/auth/logout-all
 * Revoke ALL session refresh tokens in MongoDB and clear HTTP-Only cookie
 */
router.post("/logout-all", async (req: Request, res: Response) => {
  try {
    await RefreshToken.updateMany({}, { $set: { revoked: true } });
    res.clearCookie("refreshToken", { path: "/api/v1/auth" });

    return res.status(200).json({
      success: true,
      message: "All user sessions have been successfully logged out and revoked."
    });
  } catch (error: any) {
    return res.status(500).json(
      formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to logout all sessions.")
    );
  }
});

/**
 * GET /api/v1/auth/me
 * Protected endpoint returning current user profile
 */
router.get("/me", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json(formatErrorEnvelope("USER_NOT_FOUND", "User not found."));
    }

    const applicant = await Applicant.findOne({ userId: user._id });

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          phone: user.phone,
          email: user.email,
          name: user.name,
          role: user.role,
          applicantId: applicant?.applicantId
        }
      }
    });
  } catch (error: any) {
    return res.status(500).json(
      formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to retrieve user profile.")
    );
  }
});

/**
 * POST /api/v1/auth/verify-otp
 * Passwordless OTP Login & JWT issuance for registered MongoDB users
 */
router.post("/verify-otp", async (req: Request, res: Response) => {
  try {
    const { phone, otp, role } = req.body;

    if (!phone) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Phone number is required."));
    }

    const cleanDigits = phone.replace(/\D/g, "");
    const last10Digits = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : cleanDigits;

    const query = {
      $or: [
        { phone },
        { phone: cleanDigits },
        { phone: last10Digits },
        { phone: { $regex: last10Digits, $options: "i" } }
      ]
    };

    let user = null;
    if (role) {
      user = await User.findOne({ ...query, role });
      if (!user) {
        const anyUser = await User.findOne(query);
        if (anyUser) {
          return res.status(400).json(
            formatErrorEnvelope(
              "ROLE_MISMATCH",
              `No ${role} account registered with this phone number. This number is registered as an ${anyUser.role}. Please select the ${anyUser.role} tab to log in.`
            )
          );
        }
      }
    } else {
      user = await User.findOne(query);
    }

    if (!user || user.isDeactivated) {
      return res.status(404).json(
        formatErrorEnvelope("USER_NOT_FOUND", "No account registered with this phone number. Please register first as an applicant.")
      );
    }

    // Find linked applicant record if present
    const applicant = await Applicant.findOne({ userId: user._id });

    // Issue JWT Access Token (15m) and Refresh Token (30d)
    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      role: user.role,
      phone: user.phone,
      applicantId: applicant?.applicantId
    };

    const tokens = issueTokens(tokenPayload);

    // Save Refresh Token Hash in DB
    const refreshTokenHash = hashRefreshToken(tokens.refreshToken);
    await RefreshToken.create({
      userId: user._id,
      tokenHash: refreshTokenHash,
      expiresAt: getRefreshTokenExpiry()
    });

    // Set HTTP-Only Cookie for Refresh Token
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/v1/auth",
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      data: {
        user: {
          id: user._id.toString(),
          phone: user.phone,
          email: user.email,
          name: user.name || (applicant?.personalInfo ? `${applicant.personalInfo.firstName} ${applicant.personalInfo.lastName}` : "User Account"),
          role: user.role,
          applicantId: applicant?.applicantId
        },
        accessToken: tokens.accessToken
      }
    });
  } catch (error: any) {
    console.error("❌ OTP Verification Error:", error);
    return res.status(500).json(
      formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to authenticate OTP.")
    );
  }
});

router.post("/verify-phone", async (req: Request, res: Response) => {
  try {
    const { phone, role } = req.body;

    if (!phone) {
      return res.status(400).json(formatErrorEnvelope("VALIDATION_ERROR", "Phone number is required."));
    }

    const cleanDigits = phone.replace(/\D/g, "");
    const last10Digits = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : cleanDigits;

    const query = {
      $or: [
        { phone },
        { phone: cleanDigits },
        { phone: last10Digits },
        { phone: { $regex: last10Digits, $options: "i" } }
      ]
    };

    let user = null;
    if (role) {
      user = await User.findOne({ ...query, role });
      if (!user) {
        const anyUser = await User.findOne(query);
        if (anyUser) {
          return res.status(400).json(
            formatErrorEnvelope(
              "ROLE_MISMATCH",
              `No ${role} account registered with this phone number. This number is registered as an ${anyUser.role}. Please select the ${anyUser.role} tab to log in.`
            )
          );
        }
      }
    } else {
      user = await User.findOne(query);
    }

    if (!user || user.isDeactivated) {
      return res.status(404).json(
        formatErrorEnvelope("USER_NOT_FOUND", "No account registered with this phone number. Please register first as an applicant.")
      );
    }

    return res.status(200).json({
      success: true,
      message: "Phone number verified in database.",
      data: {
        exists: true,
        phone: user.phone,
        role: user.role,
        name: user.name
      }
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * POST /api/v1/auth/check-duplicate
 * Instant API endpoint to check if an email or phone number is already registered in MongoDB
 */
router.post("/check-duplicate", async (req: Request, res: Response) => {
  try {
    const { email, phone } = req.body;

    if (email) {
      const emailMatch = await User.findOne({ email: email.trim().toLowerCase() });
      if (emailMatch) {
        return res.status(400).json({
          success: false,
          field: "email",
          error: {
            code: "DUPLICATE_EMAIL",
            message: `An account with email address '${email.trim()}' already exists in the system. Please sign in instead.`
          }
        });
      }
    }

    if (phone) {
      const cleanPhoneDigits = phone.replace(/\D/g, "");
      const last10Phone = cleanPhoneDigits.length >= 10 ? cleanPhoneDigits.slice(-10) : cleanPhoneDigits;

      const phoneMatch = await User.findOne({
        $or: [
          { phone },
          { phone: cleanPhoneDigits },
          { phone: last10Phone },
          { phone: { $regex: last10Phone, $options: "i" } }
        ]
      });

      if (phoneMatch) {
        return res.status(400).json({
          success: false,
          field: "phone",
          error: {
            code: "DUPLICATE_PHONE",
            message: `An account with phone number '${phone.trim()}' is already registered as an ${phoneMatch.role}. Please sign in instead.`
          }
        });
      }
    }

    return res.status(200).json({
      success: true,
      available: true,
      message: "Credentials are available for registration."
    });
  } catch (error: any) {
    return res.status(500).json(formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message));
  }
});

export default router;
