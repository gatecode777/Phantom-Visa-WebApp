import { Router, Request, Response } from "express";
import AppointmentModel from "../models/Appointment.js";
import ApplicationModel from "../models/Application.js";
import { verifyAccessToken, TokenPayload } from "../lib/security/jwt.js";

const router = Router();


// ─── GET /api/v1/appointments ─────────────────────────────────────────────────
// Returns all appointments sorted newest first. Scoped by agentId when provided.
router.get("/", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.query as { agentId?: string };
    let tokenUser: TokenPayload | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      tokenUser = verifyAccessToken(authHeader.slice(7));
    }

    const effectiveAgentId = agentId || (tokenUser?.role === "Agent" ? tokenUser.agentId || tokenUser.userId : undefined);

    let query: any = {};
    if (effectiveAgentId) {
      const assignedApps = await ApplicationModel.find({
        $or: [
          { assignedAgentId: effectiveAgentId },
          { assignedAgentName: { $regex: effectiveAgentId, $options: "i" } }
        ]
      });

      const assignedAppIds = assignedApps.map((a) => a.applicationId).filter(Boolean);
      query = {
        $or: [
          { applicationId: { $in: assignedAppIds } },
          { agentName: { $regex: effectiveAgentId, $options: "i" } }
        ]
      };
    }

    const appointments = await AppointmentModel.find(query).sort({ createdAt: -1 });

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

    // Auto-link agent info from application if present
    if (body.applicationId) {
      const app = await ApplicationModel.findOne({ applicationId: body.applicationId });
      if (app) {
        if (!body.agentName && app.assignedAgentName) {
          body.agentName = app.assignedAgentName;
        }
      }
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
