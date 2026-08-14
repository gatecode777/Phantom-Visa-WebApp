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

const DEFAULT_PROFILE: ApplicantProfileRecord = {
  applicantId: "APP-2026-1025",
  memberId: "APP-2026-1025",
  personalInfo: {
    fullName: "Vibhu Sharma",
    firstName: "Vibhu",
    lastName: "Sharma",
    dob: "1995-06-12",
    gender: "Male",
    nationality: "Indian",
    phone: "+91 98765 43210",
    email: "vibhu@phantomvisa.com",
    country: "India",
    address: "B-402, Highstreet Towers, MG Road, New Delhi, Delhi - 110001",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110001",
    occupation: "Senior Software Consultant",
    employer: "TechCorp Solutions Pvt Ltd"
  },
  passportDetails: {
    passportNumber: "Z9817264",
    passportType: "Regular Ordinary (Type P)",
    dateOfIssue: "2023-12-21",
    dateOfExpiry: "2033-12-20",
    placeOfIssue: "New Delhi",
    scannedStatus: "Verified & OCR Scanned"
  },
  coTravelers: [
    {
      id: "TRAVELER-1",
      fullName: "Ananya Sharma",
      relation: "Spouse",
      passportNumber: "Z9817265",
      dob: "1996-05-14",
      kycStatus: "Verified"
    },
    {
      id: "TRAVELER-2",
      fullName: "Aarav Sharma",
      relation: "Child",
      passportNumber: "X1029481",
      dob: "2020-08-02",
      kycStatus: "Verified"
    }
  ],
  preferences: {
    twoFactorAuth: true,
    emailNotifications: true,
    smsNotifications: true,
    passportReminder: true
  },
  kycDetails: {
    kycStatus: "Approved",
    govtIdType: "National Identification & Address Proof",
    aadhaarNumber: "5489 1234 9876",
    panCardNumber: "ABCDE1234F"
  },
  metrics: {
    kycStatus: "Approved",
    passportValidityLabel: "7 Years",
    passportValidityYears: 7,
    isPassportExpired: false,
    visasIssuedCount: 1,
    visasIssuedDestinations: ["Canada"],
    travelHistoryCount: 1,
    coTravelersCount: 2,
    profileScore: 95
  },
  pipeline: {
    stage1Complete: true,
    stage2Complete: true,
    stage3Complete: true,
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
      return DEFAULT_PROFILE;
    }
    const json = await res.json();
    return json.data || DEFAULT_PROFILE;
  } catch (err) {
    console.error("fetchProfileApi network error:", err);
    return DEFAULT_PROFILE;
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
