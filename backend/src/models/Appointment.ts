import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  aptId: string;
  applicationId: string;
  applicantName: string;
  passportNumber: string;
  nationality: string;
  country: string;
  visaType: string;
  appointmentType: string;
  dateOnly: string;
  dateDisplay: string;
  timeSlot: string;
  vacCenter: string;
  address: string;
  city: string;
  state: string;
  status: "Upcoming" | "Completed" | "Rescheduled" | "Cancelled" | "No Show";
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
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema: Schema = new Schema(
  {
    // Canonical IDs — APT-YYYY-XXXX and VO-YYYY-XXXX
    aptId:         { type: String, required: true, unique: true, index: true },
    applicationId: { type: String, required: true, index: true },

    // Traveler info sourced from the application record
    applicantName:  { type: String, required: true },
    passportNumber: { type: String, required: true },
    nationality:    { type: String, default: "Indian" },
    country:        { type: String, required: true },
    visaType:       { type: String, required: true },

    // Appointment details
    appointmentType: { type: String, required: true },
    dateOnly:        { type: String, required: true },   // YYYY-MM-DD
    dateDisplay:     { type: String, required: true },   // "15 Aug 2026"
    timeSlot:        { type: String, required: true },   // "11:00 AM - 11:30 AM"

    // Center
    vacCenter: { type: String, required: true },
    address:   { type: String, default: "" },
    city:      { type: String, required: true },
    state:     { type: String, default: "" },

    // Status
    status: {
      type: String,
      enum: ["Upcoming", "Completed", "Rescheduled", "Cancelled", "No Show"],
      default: "Upcoming"
    },

    // Booking meta
    bookedBy:   { type: String, enum: ["Applicant", "Agent", "Admin"], default: "Applicant" },
    agentName:  { type: String, default: "" },
    primaryOfficer: { type: String, default: "" },

    // Slot identity
    slotNo:       { type: String, default: "" },
    qrCodeRef:    { type: String, default: "" },
    slipPdfName:  { type: String, default: "" },

    // Reschedule tracking
    rescheduleCount:     { type: Number, default: 0 },
    lastRescheduledDate: { type: String, default: "" },

    // Notes
    appointmentNotes: { type: String, default: "" },

    // Confirmation
    sendConfirmation: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);
