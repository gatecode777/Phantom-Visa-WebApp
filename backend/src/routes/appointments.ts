import { Router, Request, Response } from "express";
import AppointmentModel from "../models/Appointment.js";

const router = Router();

// ─── Seed default appointments tied to the same applicationIds ───────────────
// as the finance seed, so data is consistent across modules.
async function seedDefaultAppointments() {
  try {
    const count = await AppointmentModel.countDocuments();
    if (count > 0) return;

    const defaults = [
      {
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
        sendConfirmation: true
      },
      {
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
        sendConfirmation: true
      },
      {
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
        sendConfirmation: true
      }
    ];

    await AppointmentModel.insertMany(defaults);
    console.log("✅ Default appointments seeded to MongoDB");
  } catch (err) {
    console.error("Failed to seed default appointments:", err);
  }
}

// ─── GET /api/v1/appointments ─────────────────────────────────────────────────
// Returns all appointments sorted newest first. Admin uses this unfiltered.
// Applicant side filters client-side by own applicationIds.
router.get("/", async (req: Request, res: Response) => {
  try {
    await seedDefaultAppointments();
    const appointments = await AppointmentModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: appointments.length,
      data: appointments
    });
  } catch (err) {
    console.error("GET /appointments error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ─── POST /api/v1/appointments ────────────────────────────────────────────────
// Create a new appointment (book from applicant or schedule from admin).
router.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.aptId || !body.applicationId || !body.applicantName) {
      return res.status(400).json({
        success: false,
        message: "aptId, applicationId, and applicantName are required"
      });
    }

    // Guard against duplicate aptId
    const existing = await AppointmentModel.findOne({ aptId: body.aptId });
    if (existing) {
      return res.status(409).json({ success: false, message: `Appointment ${body.aptId} already exists` });
    }

    const appointment = await AppointmentModel.create(body);
    return res.status(201).json({ success: true, data: appointment });
  } catch (err) {
    console.error("POST /appointments error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ─── PUT /api/v1/appointments/:aptId/status ───────────────────────────────────
// Update appointment status (Upcoming, Completed, Rescheduled, Cancelled, No Show)
// Also handles rescheduling: accepts dateOnly, dateDisplay, timeSlot changes.
router.put("/:aptId/status", async (req: Request, res: Response) => {
  try {
    const { aptId } = req.params;
    const { status, dateOnly, dateDisplay, timeSlot, rescheduleCount, lastRescheduledDate, appointmentNotes } = req.body;

    const update: Record<string, any> = {};
    if (status) update.status = status;
    if (dateOnly) update.dateOnly = dateOnly;
    if (dateDisplay) update.dateDisplay = dateDisplay;
    if (timeSlot) update.timeSlot = timeSlot;
    if (rescheduleCount !== undefined) update.rescheduleCount = rescheduleCount;
    if (lastRescheduledDate) update.lastRescheduledDate = lastRescheduledDate;
    if (appointmentNotes) update.appointmentNotes = appointmentNotes;

    const updated = await AppointmentModel.findOneAndUpdate(
      { aptId },
      { $set: update },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: `Appointment ${aptId} not found` });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("PUT /appointments/:aptId/status error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
