import { parsePhoneNumberWithError, CountryCode } from "libphonenumber-js";

export type Role = "Admin" | "Applicant" | "Staff" | "Agent";

export interface UserProfile {
  id: string;
  phone: string;
  role: Role;
  name: string;
  isDeactivated?: boolean;
}

export interface AuthSession {
  token: string;
  user: UserProfile;
  expiresAt: number;
}

export interface LoginAuditLog {
  id: string;
  phone: string;
  timestamp: string;
  success: boolean;
  role?: Role;
  ipAddress: string;
  reason?: string;
}

// Pre-provisioned users database
const INITIAL_USERS: UserProfile[] = [
  { id: "usr_admin_1", phone: "+919876543210", role: "Admin", name: "System Administrator" },
  { id: "usr_app_1", phone: "+910123456789", role: "Applicant", name: "Default Applicant" },
  { id: "usr_staff_1", phone: "+919876543211", role: "Staff", name: "Consular Reviewer Staff" },
  { id: "usr_agent_1", phone: "+919876543212", role: "Agent", name: "Global Visa Agency Ltd" },
  { id: "usr_app_2", phone: "+919876543213", role: "Applicant", name: "Rajesh Kumar (Applicant)" },
  { id: "usr_disabled", phone: "+919999999999", role: "Applicant", name: "Suspended User", isDeactivated: true }
];

// In-memory persistent stores
let userStore: UserProfile[] = [...INITIAL_USERS];
let auditLogs: LoginAuditLog[] = [];

// Rate-limiting tracking (phone -> timestamps of send OTP requests)
const otpSendTimestamps: Record<string, number[]> = {};

// Failed attempts tracking (phone -> { count: number, lockedUntil: number })
const verifyAttempts: Record<string, { count: number; lockedUntil: number }> = {};

// Active OTP store (phone -> { otpHash: string, expiresAt: number, codeForDemo: string })
const activeOtps: Record<string, { code: string; expiresAt: number }> = {};

/**
 * Validate phone number using libphonenumber-js for E.164 compliance
 */
export function validatePhoneNumber(rawNumber: string, defaultCountry: CountryCode = "IN"): {
  isValid: boolean;
  e164Format?: string;
  formattedDisplay?: string;
  error?: string;
} {
  if (!rawNumber || rawNumber.trim().length < 5) {
    return { isValid: false, error: "Phone number is too short" };
  }

  try {
    const phoneNumber = parsePhoneNumberWithError(rawNumber, defaultCountry);
    if (phoneNumber && phoneNumber.isValid()) {
      return {
        isValid: true,
        e164Format: phoneNumber.format("E.164"),
        formattedDisplay: phoneNumber.formatInternational()
      };
    } else {
      return { isValid: false, error: "Invalid phone number format" };
    }
  } catch (err: any) {
    return { isValid: false, error: err.message || "Invalid phone number" };
  }
}

/**
 * Send OTP with rate limiting (max 3 requests / 10 min)
 */
export function requestOtp(e164Phone: string): {
  success: boolean;
  message: string;
  demoOtp?: string;
  cooldownSeconds?: number;
} {
  const now = Date.now();
  const TEN_MINUTES = 10 * 60 * 1000;

  // Rate limiting check
  if (!otpSendTimestamps[e164Phone]) {
    otpSendTimestamps[e164Phone] = [];
  }

  // Keep only requests within last 10 minutes
  otpSendTimestamps[e164Phone] = otpSendTimestamps[e164Phone].filter(
    (t) => now - t < TEN_MINUTES
  );

  if (otpSendTimestamps[e164Phone].length >= 3) {
    const oldestReq = otpSendTimestamps[e164Phone][0];
    const waitMs = TEN_MINUTES - (now - oldestReq);
    const cooldownSeconds = Math.ceil(waitMs / 1000);
    return {
      success: false,
      message: `Rate limit exceeded. Maximum 3 OTP requests allowed per 10 minutes. Please wait ${cooldownSeconds}s.`,
      cooldownSeconds
    };
  }

  // Record send attempt timestamp
  otpSendTimestamps[e164Phone].push(now);

  // Generate 6-digit numeric OTP
  const demoCode = Math.floor(100000 + Math.random() * 900000).toString();
  const FIVE_MINUTES = 5 * 60 * 1000;

  activeOtps[e164Phone] = {
    code: demoCode,
    expiresAt: now + FIVE_MINUTES
  };

  return {
    success: true,
    message: "OTP sent successfully via SMS gateway.",
    demoOtp: demoCode
  };
}

/**
 * Verify 6-digit OTP with lockout protection after 5 failed tries
 */
export function verifyOtp(
  e164Phone: string,
  inputOtp: string,
  clientIp: string = "192.168.1.1"
): {
  success: boolean;
  message: string;
  session?: AuthSession;
  remainingAttempts?: number;
  lockoutSeconds?: number;
} {
  const now = Date.now();

  // Check Lockout Status
  const attemptState = verifyAttempts[e164Phone] || { count: 0, lockedUntil: 0 };
  if (attemptState.lockedUntil > now) {
    const lockoutSeconds = Math.ceil((attemptState.lockedUntil - now) / 1000);
    logAttempt(e164Phone, false, clientIp, undefined, `Account locked out for ${lockoutSeconds}s`);
    return {
      success: false,
      message: `Too many failed attempts. Account temporarily locked out. Try again in ${lockoutSeconds} seconds.`,
      lockoutSeconds
    };
  }

  const storedOtp = activeOtps[e164Phone];
  if (!storedOtp) {
    logAttempt(e164Phone, false, clientIp, undefined, "No active OTP found. Request a new OTP.");
    return {
      success: false,
      message: "No active OTP found. Please request a new OTP code."
    };
  }

  if (now > storedOtp.expiresAt) {
    delete activeOtps[e164Phone];
    logAttempt(e164Phone, false, clientIp, undefined, "OTP expired");
    return {
      success: false,
      message: "OTP code has expired (5-minute limit). Please request a new OTP."
    };
  }

  // Check OTP Match (Support demo OTP 123456 or generated OTP)
  const isMatch = inputOtp === storedOtp.code || inputOtp === "123456";

  if (!isMatch) {
    const newCount = attemptState.count + 1;
    const MAX_TRIES = 5;

    if (newCount >= MAX_TRIES) {
      const COOLDOWN_MS = 60 * 1000; // 60 seconds lockout
      verifyAttempts[e164Phone] = { count: 0, lockedUntil: now + COOLDOWN_MS };
      logAttempt(e164Phone, false, clientIp, undefined, "Exceeded 5 wrong OTP tries");
      return {
        success: false,
        message: "Maximum incorrect OTP attempts (5) reached. Account locked for 60 seconds.",
        lockoutSeconds: 60
      };
    } else {
      verifyAttempts[e164Phone] = { count: newCount, lockedUntil: 0 };
      const remaining = MAX_TRIES - newCount;
      logAttempt(e164Phone, false, clientIp, undefined, `Invalid OTP (${remaining} attempts left)`);
      return {
        success: false,
        message: `Invalid OTP code. ${remaining} attempt(s) remaining.`,
        remainingAttempts: remaining
      };
    }
  }

  // OTP Verified Successfully -> Clear OTP and reset attempts
  delete activeOtps[e164Phone];
  verifyAttempts[e164Phone] = { count: 0, lockedUntil: 0 };

  // Fetch or Auto-create User Account
  let existingUser = userStore.find((u) => u.phone === e164Phone);

  if (existingUser?.isDeactivated) {
    logAttempt(e164Phone, false, clientIp, existingUser.role, "Account deactivated");
    return {
      success: false,
      message: "Your account has been disabled by the Administrator. Please contact support."
    };
  }

  if (!existingUser) {
    // Section 3 Requirement: Unrecognized number -> Auto-create as Applicant
    const formattedShort = e164Phone.replace("+", "");
    existingUser = {
      id: `usr_app_${Date.now()}`,
      phone: e164Phone,
      role: "Applicant",
      name: `Applicant (${formattedShort.slice(-4)})`
    };
    userStore.push(existingUser);
  }

  // Issue Short-lived JWT Session Token
  const token = generateMockJwt(existingUser);
  const session: AuthSession = {
    token,
    user: existingUser,
    expiresAt: now + 8 * 60 * 60 * 1000 // 8 hours session
  };

  logAttempt(e164Phone, true, clientIp, existingUser.role, "Successful login");

  return {
    success: true,
    message: `Authentication successful! Redirecting to ${getDashboardPath(existingUser.role)}...`,
    session
  };
}

/**
 * Map Role to Exact Dashboard Path
 */
export function getDashboardPath(role: Role): string {
  switch (role) {
    case "Admin":
      return "/dashboard/admin";
    case "Applicant":
      return "/dashboard/applicant";
    case "Staff":
      return "/dashboard/staff";
    case "Agent":
      return "/dashboard/agent";
    default:
      return "/dashboard/applicant";
  }
}

/**
 * Generate Mock JWT Token containing role claims
 */
export function generateMockJwt(user: UserProfile): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 8 * 3600
    })
  );
  const signature = btoa(`sig_${user.id}_${Date.now()}`);
  return `${header}.${payload}.${signature}`;
}

/**
 * Log login attempt for audit trail
 */
export function logAttempt(
  phone: string,
  success: boolean,
  ipAddress: string,
  role?: Role,
  reason?: string
) {
  const log: LoginAuditLog = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    phone,
    timestamp: new Date().toISOString(),
    success,
    role,
    ipAddress,
    reason
  };
  auditLogs.unshift(log);
}

/**
 * Retrieve audit logs
 */
export function getAuditLogs(): LoginAuditLog[] {
  return [...auditLogs];
}

