import express, { Request, Response } from "express";
import SupportTicket from "../models/SupportTicket.js";
import { randomUUID } from "crypto";

const router = express.Router();

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generate canonical TKT-YYYY-XXXX ticket ID */
function generateTicketId(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TKT-${year}-${rand}`;
}

/**
 * Check and mark SLA breached if no officer/bot reply within 15 minutes
 * of ticket creation. Called every time a ticket is read.
 */
async function checkAndMarkSLA(ticket: any): Promise<void> {
  if (ticket.slaBreached) return; // already flagged
  if (ticket.status === "Resolved" || ticket.status === "Closed") return;
  if (ticket.firstResponseAt) return; // got a response in time

  const ageMs = Date.now() - new Date(ticket.createdAt).getTime();
  const fifteenMins = 15 * 60 * 1000;

  if (ageMs > fifteenMins) {
    // Breach: add a system message and flag
    const systemMsg = {
      messageId: randomUUID(),
      senderUserId: "SYSTEM",
      senderName: "System",
      senderRole: "bot",
      text: "⚠️ SLA BREACH: This ticket has not received an officer response within the 15-minute guaranteed window. It has been automatically escalated.",
      timestamp: new Date()
    };
    await SupportTicket.updateOne(
      { _id: ticket._id },
      {
        $set: { slaBreached: true },
        $push: { messages: systemMsg }
      }
    );
  }
}

// ─── GET /api/v1/support ──────────────────────────────────────────────────────
// All tickets (admin) or filtered by createdByUserId (applicant).
// Query params: ?userId=<User._id>
router.get("/", async (req: Request, res: Response) => {
  try {
    const filter: Record<string, any> = {};
    if (req.query.userId) {
      filter.createdByUserId = req.query.userId as string;
    }

    const tickets = await SupportTicket.find(filter).sort({ createdAt: -1 }).lean();

    // Check SLA on every open ticket (async, don't block response)
    tickets
      .filter((t: any) => t.status === "Open" || t.status === "In Progress")
      .forEach((t: any) => checkAndMarkSLA(t).catch(() => {}));

    res.json({ success: true, data: tickets });
  } catch (err) {
    console.error("GET /support error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch tickets" });
  }
});

// ─── POST /api/v1/support ─────────────────────────────────────────────────────
// Create a new support ticket. Body: { createdByUserId, createdByName,
//   applicationId?, category, subject, priority, firstMessage }
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      createdByUserId,
      createdByName,
      applicationId = "",
      category,
      subject,
      priority = "Medium",
      firstMessage = ""
    } = req.body;

    if (!createdByUserId || !createdByName || !category || !subject) {
      return res.status(400).json({
        success: false,
        message: "createdByUserId, createdByName, category, and subject are required"
      });
    }

    // Generate unique ticketId — retry on collision (extremely rare)
    let ticketId = generateTicketId();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await SupportTicket.findOne({ ticketId });
      if (!existing) break;
      ticketId = generateTicketId();
      attempts++;
    }

    const messages = firstMessage.trim()
      ? [
          {
            messageId: randomUUID(),
            senderUserId: createdByUserId,
            senderName: createdByName,
            senderRole: "applicant",
            text: firstMessage.trim(),
            timestamp: new Date()
          }
        ]
      : [];

    const ticket = await SupportTicket.create({
      ticketId,
      createdByUserId,
      createdByName,
      applicationId,
      category,
      subject,
      priority,
      status: "Open",
      messages
    });

    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    console.error("POST /support error:", err);
    res.status(500).json({ success: false, message: "Failed to create ticket" });
  }
});

// ─── GET /api/v1/support/:ticketId ───────────────────────────────────────────
// Fetch a single ticket (thread included).
router.get("/:ticketId", async (req: Request, res: Response) => {
  try {
    const ticket = await SupportTicket.findOne({
      ticketId: req.params.ticketId
    }).lean();

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    // SLA check (async)
    checkAndMarkSLA(ticket).catch(() => {});

    // Re-fetch after potential SLA mutation
    const fresh = await SupportTicket.findOne({
      ticketId: req.params.ticketId
    }).lean();

    res.json({ success: true, data: fresh || ticket });
  } catch (err) {
    console.error("GET /support/:ticketId error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch ticket" });
  }
});

// ─── POST /api/v1/support/:ticketId/messages ─────────────────────────────────
// Append a message to the ticket thread (applicant, officer, or bot).
// Body: { senderUserId, senderName, senderRole, text }
router.post("/:ticketId/messages", async (req: Request, res: Response) => {
  try {
    const { senderUserId, senderName, senderRole, text } = req.body;

    if (!senderUserId || !senderName || !senderRole || !text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "senderUserId, senderName, senderRole, and text are required"
      });
    }

    const newMessage = {
      messageId: randomUUID(),
      senderUserId,
      senderName,
      senderRole,
      text: text.trim(),
      timestamp: new Date()
    };

    const updateData: Record<string, any> = {
      $push: { messages: newMessage },
      $set: { updatedAt: new Date() }
    };

    // If this is the first officer/bot reply, record firstResponseAt and
    // auto-transition status from Open → In Progress
    const ticket = await SupportTicket.findOne({ ticketId: req.params.ticketId });
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    const isOfficerOrBot =
      senderRole === "officer" || senderRole === "bot";
    const noPriorOfficerReply = !ticket.firstResponseAt;

    if (isOfficerOrBot && noPriorOfficerReply) {
      updateData.$set.firstResponseAt = new Date();
      if (ticket.status === "Open") {
        updateData.$set.status = "In Progress";
      }
    }

    const updated = await SupportTicket.findOneAndUpdate(
      { ticketId: req.params.ticketId },
      updateData,
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("POST /support/:ticketId/messages error:", err);
    res.status(500).json({ success: false, message: "Failed to append message" });
  }
});

// ─── PUT /api/v1/support/:ticketId/status ────────────────────────────────────
// Update ticket status, priority, or assigned officer.
// Body: { status?, priority?, assignedOfficerId?, assignedOfficerName? }
router.put("/:ticketId/status", async (req: Request, res: Response) => {
  try {
    const {
      status,
      priority,
      assignedOfficerId,
      assignedOfficerName
    } = req.body;

    const setData: Record<string, any> = { updatedAt: new Date() };

    if (status) {
      setData.status = status;
      if (status === "Resolved" || status === "Closed") {
        setData.resolvedAt = new Date();
      }
    }
    if (priority) setData.priority = priority;
    if (assignedOfficerId !== undefined) setData.assignedOfficerId = assignedOfficerId;
    if (assignedOfficerName !== undefined) setData.assignedOfficerName = assignedOfficerName;

    const updated = await SupportTicket.findOneAndUpdate(
      { ticketId: req.params.ticketId },
      { $set: setData },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("PUT /support/:ticketId/status error:", err);
    res.status(500).json({ success: false, message: "Failed to update ticket" });
  }
});

export default router;
