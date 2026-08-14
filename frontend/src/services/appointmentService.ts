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
 * Canonical seed data.
 *
 * These three records are tied to the SAME applicationIds as
 * INITIAL_UNIFIED_TRANSACTIONS in paymentService.ts:
 *   VO-2026-1025  →  Geeta Sharma    (passport Z9817264)  Australia
 *   VO-2026-9841  →  Geeta Sharma    (passport Z9817264)  Canada
 *   VO-2026-0814  →  Amitabh Patel   (passport P8812301)  UK
 *
 * Traveler identity is consistent — one passport owns one applicant profile.
 */
export const INITIAL_UNIFIED_APPOINTMENTS: UnifiedAppointmentRecord[] = [
  {
    id: "apt-1025-bio",
    aptId: "APT-2026-9910",
    applicationId: "VO-2026-1025",
    applicantName: "Geeta Sharma",
    passportNumber: "Z9817264",
    nationality: "Indian",
    country: "Australia",
    visaType: "Subclass 600 Tourist Visa",
    appointmentType: "Biometric Submission",
    dateOnly: "2026-08-15",
    dateDisplay: "15 Aug 2026",
    timeSlot: "11:00 AM - 11:30 AM",
    vacCenter: "VFS Global Visa Application Centre",
    address: "Shivaji Stadium Metro Station, Mezzanine Level, Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    status: "Upcoming",
    bookedBy: "Applicant",
    slotNo: "SLOT-B12",
    qrCodeRef: "VFS-AU-9817264-DEL",
    slipPdfName: "appointment_slip_APT-2026-9910.pdf",
    rescheduleCount: 0,
    appointmentNotes: "Bring original passport and printed appointment confirmation letter.",
    sendConfirmation: true,
    createdAt: "2026-08-07T10:15:00.000Z"
  },
  {
    id: "apt-9841-doc",
    aptId: "APT-2026-8812",
    applicationId: "VO-2026-9841",
    applicantName: "Geeta Sharma",
    passportNumber: "Z9817264",
    nationality: "Indian",
    country: "Canada",
    visaType: "Canada Express Visitor Visa",
    appointmentType: "Document Verification",
    dateOnly: "2026-07-26",
    dateDisplay: "26 Jul 2026",
    timeSlot: "09:30 AM - 10:00 AM",
    vacCenter: "VFS Canada Application Centre",
    address: "45, Residency Road, Shanthala Nagar",
    city: "Bengaluru",
    state: "Karnataka",
    status: "Completed",
    bookedBy: "Applicant",
    slotNo: "SLOT-DV09",
    qrCodeRef: "VFS-CA-9817264-BLR",
    slipPdfName: "appointment_slip_APT-2026-8812.pdf",
    rescheduleCount: 0,
    appointmentNotes: "Document verification completed successfully.",
    sendConfirmation: true,
    createdAt: "2026-08-01T16:30:00.000Z"
  },
  {
    id: "apt-0814-emb",
    aptId: "APT-2026-7734",
    applicationId: "VO-2026-0814",
    applicantName: "Amitabh Patel",
    passportNumber: "P8812301",
    nationality: "Indian",
    country: "United Kingdom",
    visaType: "Standard Visitor 6 Months",
    appointmentType: "Embassy Interview",
    dateOnly: "2026-07-20",
    dateDisplay: "20 Jul 2026",
    timeSlot: "02:00 PM - 02:30 PM",
    vacCenter: "VFS UK Application Hub",
    address: "12, Marine Drive, Churchgate",
    city: "Mumbai",
    state: "Maharashtra",
    status: "Rescheduled",
    bookedBy: "Agent",
    agentName: "Apex Travels",
    primaryOfficer: "Consular Officer Sarah Jenkins",
    slotNo: "SLOT-E04",
    qrCodeRef: "VFS-UK-8812301-BOM",
    slipPdfName: "appointment_slip_APT-2026-7734.pdf",
    rescheduleCount: 1,
    lastRescheduledDate: "2026-07-18",
    appointmentNotes: "Rescheduled upon applicant request due to flight timing change.",
    sendConfirmation: true,
    createdAt: "2026-07-15T14:10:00.000Z"
  }
];

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
 * Falls back to INITIAL_UNIFIED_APPOINTMENTS if the backend is unreachable.
 */
export async function fetchUnifiedAppointments(): Promise<UnifiedAppointmentRecord[]> {
  try {
    const res = await fetch(`${API_V1_URL}/appointments`);
    const json = await res.json();
    if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((item: any): UnifiedAppointmentRecord => ({
        id:              item._id || item.aptId,
        aptId:           item.aptId,
        applicationId:   item.applicationId,
        applicantName:   item.applicantName,
        passportNumber:  item.passportNumber,
        nationality:     item.nationality || "Indian",
        country:         item.country,
        visaType:        item.visaType,
        appointmentType: item.appointmentType as UnifiedAppointmentType,
        dateOnly:        item.dateOnly,
        dateDisplay:     item.dateDisplay,
        timeSlot:        item.timeSlot,
        vacCenter:       item.vacCenter,
        address:         item.address || "",
        city:            item.city,
        state:           item.state || "",
        status:          item.status as UnifiedAppointmentStatus,
        bookedBy:        item.bookedBy || "Applicant",
        agentName:       item.agentName || undefined,
        primaryOfficer:  item.primaryOfficer || undefined,
        slotNo:          item.slotNo || "",
        qrCodeRef:       item.qrCodeRef || "",
        slipPdfName:     item.slipPdfName || "",
        rescheduleCount: item.rescheduleCount ?? 0,
        lastRescheduledDate: item.lastRescheduledDate || undefined,
        appointmentNotes:    item.appointmentNotes || undefined,
        sendConfirmation:    item.sendConfirmation ?? true,
        createdAt:       item.createdAt || new Date().toISOString()
      }));
    }
  } catch (err) {
    console.error("Failed to fetch appointments from backend API:", err);
  }
  // Offline fallback — seed data
  return INITIAL_UNIFIED_APPOINTMENTS;
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
