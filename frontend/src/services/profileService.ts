import { API_V1_URL } from "../config/api";

export interface CoTravelerRecord {
  id: string;
  fullName: string;
  relation: "Spouse" | "Child" | "Parent" | "Sibling" | "Friend" | string;
  passportNumber: string;
  dob: string;
  kycStatus: "Verified" | "Pending" | string;
}

export interface ProfilePreferences {
  twoFactorAuth: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  passportReminder: boolean;
}

export interface ProfilePassportDetails {
  passportNumber: string;
  passportType: string;
  dateOfIssue: string;
  dateOfExpiry: string;
  placeOfIssue: string;
  scannedStatus: string;
}

export interface ProfilePersonalInfo {
  fullName: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  nationality: string;
  phone: string;
  email: string;
  country: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  occupation: string;
  employer: string;
}

export interface ProfileMetrics {
  kycStatus: string;
  passportValidityLabel: string;
  passportValidityYears: number;
  isPassportExpired: boolean;
  visasIssuedCount: number;
  visasIssuedDestinations: string[];
  travelHistoryCount: number;
  coTravelersCount: number;
  profileScore: number;
}

export interface ProfilePipeline {
  stage1Complete: boolean;
  stage2Complete: boolean;
  stage3Complete: boolean;
  stage4Complete: boolean;
}

export interface ApplicantProfileRecord {
  _id?: string;
  applicantId: string;
  memberId: string;
  userId?: string;
  personalInfo: ProfilePersonalInfo;
  passportDetails: ProfilePassportDetails;
  coTravelers: CoTravelerRecord[];
  preferences: ProfilePreferences;
  kycDetails?: {
    kycStatus: string;
    govtIdType?: string;
    aadhaarNumber?: string;
    panCardNumber?: string;
    rejectionReason?: string;
  };
  metrics: ProfileMetrics;
  pipeline: ProfilePipeline;
}

export const EMPTY_PROFILE: ApplicantProfileRecord = {
  applicantId: "",
  memberId: "",
  personalInfo: {
    fullName: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    nationality: "",
    phone: "",
    email: "",
    country: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    occupation: "",
    employer: ""
  },
  passportDetails: {
    passportNumber: "",
    passportType: "",
    dateOfIssue: "",
    dateOfExpiry: "",
    placeOfIssue: "",
    scannedStatus: "Pending"
  },
  coTravelers: [],
  preferences: {
    twoFactorAuth: false,
    emailNotifications: true,
    smsNotifications: false,
    passportReminder: false
  },
  kycDetails: {
    kycStatus: "Pending",
    govtIdType: "",
    aadhaarNumber: "",
    panCardNumber: ""
  },
  metrics: {
    kycStatus: "Pending",
    passportValidityLabel: "Not Provided",
    passportValidityYears: 0,
    isPassportExpired: false,
    visasIssuedCount: 0,
    visasIssuedDestinations: [],
    travelHistoryCount: 0,
    coTravelersCount: 0,
    profileScore: 0
  },
  pipeline: {
    stage1Complete: false,
    stage2Complete: false,
    stage3Complete: false,
    stage4Complete: false
  }
};

/**
 * Fetch applicant's canonical profile record and live computed metrics
 */
export async function fetchProfileApi(token?: string): Promise<ApplicantProfileRecord> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_V1_URL}/applicant/profile`, { headers });
    if (!res.ok) {
      console.warn("fetchProfileApi non-200 status:", res.status);
      return EMPTY_PROFILE;
    }
    const json = await res.json();
    return json.data || EMPTY_PROFILE;
  } catch (err) {
    console.error("fetchProfileApi network error:", err);
    return EMPTY_PROFILE;
  }
}

/**
 * Update personal details, passport vault, or preferences in MongoDB
 */
export async function updateProfileApi(
  data: Partial<ApplicantProfileRecord>,
  token?: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_V1_URL}/applicant/profile`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data)
    });

    const json = await res.json();
    return { success: res.ok, data: json.data, error: json.error?.message };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update profile." };
  }
}

/**
 * Add a new co-traveler / family member to the applicant's vault
 */
export async function addCoTravelerApi(
  traveler: { fullName: string; relation: string; passportNumber: string; dob?: string },
  applicantId?: string,
  token?: string
): Promise<{ success: boolean; data?: CoTravelerRecord[]; error?: string }> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_V1_URL}/applicant/co-travelers`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...traveler, applicantId })
    });

    const json = await res.json();
    return { success: res.ok, data: json.data, error: json.error?.message };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to add co-traveler." };
  }
}

/**
 * Remove a co-traveler from the applicant's vault
 */
export async function removeCoTravelerApi(
  id: string,
  applicantId?: string,
  token?: string
): Promise<{ success: boolean; data?: CoTravelerRecord[]; error?: string }> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const url = new URL(`${API_V1_URL}/applicant/co-travelers/${id}`);
    if (applicantId) url.searchParams.set("applicantId", applicantId);

    const res = await fetch(url.toString(), {
      method: "DELETE",
      headers
    });

    const json = await res.json();
    return { success: res.ok, data: json.data, error: json.error?.message };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to remove co-traveler." };
  }
}

/**
 * Change password
 */
export async function changePasswordApi(
  currentPassword: string,
  newPassword: string,
  token?: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_V1_URL}/auth/change-password`, {
      method: "POST",
      headers,
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const json = await res.json();
    return {
      success: res.ok,
      message: json.message,
      error: json.error?.message || json.message
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to change password." };
  }
}
