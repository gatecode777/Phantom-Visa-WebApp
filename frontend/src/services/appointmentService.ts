/**
 * appointmentService.ts
 *
 * Canonical appointment types, initial seed data, and API helpers.
 *
 * ID FORMATS (defined once, used everywhere):
 *   Application ID  →  VO-YYYY-XXXX   (e.g. VO-2026-1025)
 *   Appointment ID  →  APT-YYYY-XXXX  (e.g. APT-2026-9910)
 *
 * The seed data is tied to the same applicationIds used in paymentService.ts
 * (VO-2026-1025, VO-2026-9841, VO-2026-0814) so that traveler names,
 * passport numbers, and application ownership agree identically across
 * the Documents, Payments, and Appointments modules.
 */
import { API_V1_URL } from "../config/api";

export type UnifiedAppointmentStatus =
  | "Upcoming"
  | "Completed"
  | "Rescheduled"
  | "Cancelled"
  | "No Show";

export type UnifiedAppointmentType =
  | "Biometric Submission"
  | "Embassy Interview"
  | "Document Verification"
  | "Medical Examination"
  | "VAC / VFS Collection"
  | "Premium Lounge Access"
  | "Passport Collection";

export interface UnifiedAppointmentRecord {
  /** Internal unique key */
  id: string;
  /** Canonical appointment reference — APT-YYYY-XXXX */
  aptId: string;
  /** Canonical application reference — VO-YYYY-XXXX */
  applicationId: string;
  /** Applicant's full name — sourced from the application record */
  applicantName: string;
  /** Passport number — sourced from the application record */
  passportNumber: string;
  nationality: string;
  country: string;
  visaType: string;
  appointmentType: UnifiedAppointmentType;
  /** ISO date string YYYY-MM-DD */
  dateOnly: string;
  /** Display label e.g. "15 Aug 2026" */
  dateDisplay: string;
  /** Display label e.g. "11:00 AM - 11:30 AM" */
  timeSlot: string;
  vacCenter: string;
  address: string;
  city: string;
  state: string;
  status: UnifiedAppointmentStatus;
  bookedBy: "Applicant" | "Agent" | "Admin";
  agentName?: string;
  primaryOfficer?: string;
  slotNo: string;
  qrCodeRef: string;
  slipPdfName: string;
  rescheduleCount: number;
  lastRescheduledDate?: string;
  appointmentNotes?: string;
  sendConfirmation: boolean;
  createdAt: string;
}

/**
 * Canonical seed data for client state initialization
 */
export const INITIAL_UNIFIED_APPOINTMENTS: UnifiedAppointmentRecord[] = [];

/** Generate a new canonical appointment ID: APT-YYYY-XXXX */
export function generateAptId(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `APT-${year}-${rand}`;
}

/** Format a YYYY-MM-DD date string for display */
export function formatDateDisplay(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return isoDate;
  }
}

/** Canonical list of appointment types (used in dropdowns on both admin and applicant sides) */
export const APPOINTMENT_TYPES_CATALOG = [
  "Biometric Submission",
  "Embassy Interview",
  "Document Verification",
  "Medical Examination",
  "VAC / VFS Collection",
  "Premium Lounge Access",
  "Passport Collection"
];

/** Step-by-step workflow for display in both admin and applicant UI */
export const APPOINTMENT_WORKFLOW_STEPS = [
  "Application Submitted",
  "Appointment Slot Selected",
  "Appointment Scheduled",
  "Confirmation Sent",
  "Reminder Sent",
  "Appointment Attended",
  "Completed"
];

// ─── API helpers ──────────────────────────────────────────────────────────────

/**
 * GET /api/v1/appointments
 * Fetch all appointments from MongoDB.
 * Falls back to an empty array if the backend is unreachable or returns no data.
 */
export async function fetchUnifiedAppointments(agentId?: string): Promise<UnifiedAppointmentRecord[]> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const url = agentId
      ? `${API_V1_URL}/appointments?agentId=${encodeURIComponent(agentId)}`
      : `${API_V1_URL}/appointments`;

    const res = await fetch(url, { headers });
    const json = await res.json();
    if (res.ok && json.success && Array.isArray(json.data)) {
      return json.data.map((item: any) => ({
        id:                  item._id || item.aptId,
        aptId:               item.aptId,
        applicationId:       item.applicationId,
        applicantName:       item.applicantName,
        passportNumber:      item.passportNumber,
        nationality:         item.nationality || "Indian",
        country:             item.country,
        visaType:            item.visaType,
        appointmentType:     (item.appointmentType as UnifiedAppointmentType) || "Biometric Submission",
        dateOnly:            item.dateOnly,
        dateDisplay:         item.dateDisplay,
        timeSlot:            item.timeSlot,
        vacCenter:           item.vacCenter,
        address:             item.address,
        city:                item.city,
        state:               item.state,
        status:              (item.status as UnifiedAppointmentStatus) || "Upcoming",
        bookedBy:            item.bookedBy || "Applicant",
        agentName:           item.agentName || undefined,
        primaryOfficer:      item.primaryOfficer || undefined,
        slotNo:              item.slotNo,
        qrCodeRef:           item.qrCodeRef,
        slipPdfName:         item.slipPdfName,
        rescheduleCount:     item.rescheduleCount || 0,
        lastRescheduledDate: item.lastRescheduledDate || undefined,
        appointmentNotes:    item.appointmentNotes || undefined,
        sendConfirmation:    item.sendConfirmation ?? true,
        createdAt:       item.createdAt || new Date().toISOString()
      }));
    }
  } catch (err) {
    console.error("Failed to fetch appointments from backend API:", err);
  }
  return [];
}

/**
 * POST /api/v1/appointments
 * Persist a newly booked appointment to MongoDB.
 */
export async function createAppointmentApi(
  apt: UnifiedAppointmentRecord
): Promise<{ success: boolean; data?: any }> {
  try {
    const res = await fetch(`${API_V1_URL}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(apt)
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error("Failed to create appointment via API:", err);
    return { success: false };
  }
}

/**
 * PUT /api/v1/appointments/:aptId/status
 * Update appointment status or reschedule fields in MongoDB.
 */
export async function updateAppointmentApi(
  aptId: string,
  changes: Partial<UnifiedAppointmentRecord>
): Promise<{ success: boolean; data?: any }> {
  try {
    const res = await fetch(`${API_V1_URL}/appointments/${aptId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes)
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error("Failed to update appointment via API:", err);
    return { success: false };
  }
}
