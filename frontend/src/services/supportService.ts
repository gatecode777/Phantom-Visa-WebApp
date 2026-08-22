/**
 * supportService.ts
 *
 * Canonical support ticket types, ID generator, and API helpers.
 *
 * ID FORMAT (defined once, used everywhere):
 *   Ticket ID  →  TKT-YYYY-XXXX  (e.g. TKT-2026-4821)
 *
 * Tickets are always tied to a real createdByUserId (User._id of an Applicant)
 * and optionally to a real applicationId (VO-YYYY-XXXX canonical format).
 * Staff and Applicants are distinguished by senderRole in messages, never by name.
 */
import { API_V1_URL } from "../config/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TicketPriority = "Low" | "Medium" | "High" | "Critical";
export type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";
export type MessageRole = "applicant" | "officer" | "bot";

export interface TicketMessage {
  messageId: string;
  senderUserId: string;
  senderName: string;
  senderRole: MessageRole;
  text: string;
  timestamp: string; // ISO string
}

export interface SupportTicketRecord {
  /** Internal MongoDB _id used as React key */
  _id: string;
  /** Canonical reference — TKT-YYYY-XXXX */
  ticketId: string;
  /** User._id of the applicant who opened the ticket */
  createdByUserId: string;
  /** Applicant display name snapshot */
  createdByName: string;
  /** VO-YYYY-XXXX or "" if no application linked */
  applicationId: string;
  category: string;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedOfficerId: string;
  assignedOfficerName: string;
  messages: TicketMessage[];
  slaBreached: boolean;
  firstResponseAt?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── ID Generator ─────────────────────────────────────────────────────────────

/** Generate a canonical support ticket ID: TKT-YYYY-XXXX */
export function generateTicketId(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TKT-${year}-${rand}`;
}

// ─── API Helpers ──────────────────────────────────────────────────────────────

/** Map a raw API response object to a typed SupportTicketRecord */
function mapTicket(item: any): SupportTicketRecord {
  return {
    _id: item._id || item.ticketId,
    ticketId: item.ticketId,
    createdByUserId: item.createdByUserId,
    createdByName: item.createdByName,
    applicationId: item.applicationId || "",
    category: item.category,
    subject: item.subject,
    priority: item.priority as TicketPriority,
    status: item.status as TicketStatus,
    assignedOfficerId: item.assignedOfficerId || "",
    assignedOfficerName: item.assignedOfficerName || "",
    messages: (item.messages || []).map((m: any): TicketMessage => ({
      messageId: m.messageId || "",
      senderUserId: m.senderUserId || "",
      senderName: m.senderName || "",
      senderRole: m.senderRole as MessageRole,
      text: m.text,
      timestamp: m.timestamp
        ? new Date(m.timestamp).toISOString()
        : new Date().toISOString()
    })),
    slaBreached: item.slaBreached ?? false,
    firstResponseAt: item.firstResponseAt
      ? new Date(item.firstResponseAt).toISOString()
      : undefined,
    resolvedAt: item.resolvedAt
      ? new Date(item.resolvedAt).toISOString()
      : undefined,
    createdAt: item.createdAt
      ? new Date(item.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: item.updatedAt
      ? new Date(item.updatedAt).toISOString()
      : new Date().toISOString()
  };
}

/**
 * GET /api/v1/support
 * Fetch tickets with optional scoping:
 *   - No params  → admin sees all
 *   - userId     → applicant sees only their own
 *   - agentId    → agent sees only tickets for their assigned applications
 */
export async function fetchTickets(userId?: string, agentId?: string): Promise<SupportTicketRecord[]> {
  try {
    const params = new URLSearchParams();
    if (userId) params.set("userId", userId);
    if (agentId) params.set("agentId", agentId);
    const query = params.toString();
    const url = query ? `${API_V1_URL}/support?${query}` : `${API_V1_URL}/support`;
    const res = await fetch(url);
    const json = await res.json();
    if (res.ok && json.success && Array.isArray(json.data)) {
      return json.data.map(mapTicket);
    }
  } catch (err) {
    console.error("fetchTickets failed:", err);
  }
  return [];
}


/**
 * GET /api/v1/support/:ticketId
 * Fetch a single ticket with its full message thread.
 */
export async function fetchTicketById(ticketId: string): Promise<SupportTicketRecord | null> {
  try {
    const res = await fetch(`${API_V1_URL}/support/${encodeURIComponent(ticketId)}`);
    const json = await res.json();
    if (res.ok && json.success && json.data) {
      return mapTicket(json.data);
    }
  } catch (err) {
    console.error("fetchTicketById failed:", err);
  }
  return null;
}

/**
 * POST /api/v1/support
 * Create a new support ticket.
 */
export async function createTicketApi(payload: {
  createdByUserId: string;
  createdByName: string;
  applicationId?: string;
  category: string;
  subject: string;
  priority: TicketPriority;
  firstMessage?: string;
}): Promise<{ success: boolean; data?: SupportTicketRecord }> {
  try {
    const res = await fetch(`${API_V1_URL}/support`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (res.ok && json.success && json.data) {
      return { success: true, data: mapTicket(json.data) };
    }
    return { success: false };
  } catch (err) {
    console.error("createTicketApi failed:", err);
    return { success: false };
  }
}

/**
 * POST /api/v1/support/:ticketId/messages
 * Append a message to the ticket thread.
 */
export async function appendMessageApi(
  ticketId: string,
  payload: {
    senderUserId: string;
    senderName: string;
    senderRole: MessageRole;
    text: string;
  }
): Promise<{ success: boolean; data?: SupportTicketRecord }> {
  try {
    const res = await fetch(
      `${API_V1_URL}/support/${encodeURIComponent(ticketId)}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );
    const json = await res.json();
    if (res.ok && json.success && json.data) {
      return { success: true, data: mapTicket(json.data) };
    }
    return { success: false };
  } catch (err) {
    console.error("appendMessageApi failed:", err);
    return { success: false };
  }
}

/**
 * PUT /api/v1/support/:ticketId/status
 * Update ticket status, priority, or officer assignment.
 */
export async function updateTicketApi(
  ticketId: string,
  changes: {
    status?: TicketStatus;
    priority?: TicketPriority;
    assignedOfficerId?: string;
    assignedOfficerName?: string;
  }
): Promise<{ success: boolean; data?: SupportTicketRecord }> {
  try {
    const res = await fetch(
      `${API_V1_URL}/support/${encodeURIComponent(ticketId)}/status`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes)
      }
    );
    const json = await res.json();
    if (res.ok && json.success && json.data) {
      return { success: true, data: mapTicket(json.data) };
    }
    return { success: false };
  } catch (err) {
    console.error("updateTicketApi failed:", err);
    return { success: false };
  }
}

// ─── Utility helpers used by both UI components ───────────────────────────────

/** Elapsed time string from a timestamp. e.g. "3 mins ago", "2 hrs ago" */
export function elapsedLabel(isoString: string): string {
  const ms = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

/** SLA elapsed minutes from ticket creation */
export function slaElapsedMins(createdAt: string): number {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
}

/** Format timestamp for display in message thread */
export function formatMsgTimestamp(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "short"
  });
}

/** Simple keyword-based bot response — used for the in-page AI chat panel */
export function getBotResponse(userText: string): string {
  const t = userText.toLowerCase();
  if (t.includes("document") || t.includes("upload") || t.includes("file"))
    return "📄 For document queries, ensure all files are in PDF/JPG format under 5 MB. If your document shows 'needs review', our team will contact you within 15 minutes. Would you like me to escalate this to a human officer?";
  if (t.includes("payment") || t.includes("fee") || t.includes("invoice") || t.includes("refund"))
    return "💳 For payment and billing queries, please share your Transaction ID. Refund requests are processed within 5–7 business days after approval. Shall I create a formal ticket for a billing specialist?";
  if (t.includes("appointment") || t.includes("biometric") || t.includes("vfs") || t.includes("slot"))
    return "📅 For appointment rescheduling or VFS queries, you can use the Appointments section to reschedule directly. Embassy biometric slots are subject to availability. Would you like me to route this to our appointment desk?";
  if (t.includes("status") || t.includes("track") || t.includes("progress"))
    return "🔍 Your application status is visible in real-time on the Applications dashboard. If your status hasn't updated in 72 hours, that may indicate an embassy delay. Would you like to escalate?";
  if (t.includes("reject") || t.includes("refused") || t.includes("denial"))
    return "⚖️ A visa refusal does not mean a permanent ban. Our team can review the refusal grounds and advise on reapplication or appeal. Would you like to create a formal case with our embassy liaison team?";
  if (t.includes("passport") || t.includes("travel"))
    return "🛂 Ensure your passport has at least 6 months of validity beyond your intended travel date. For name discrepancies between passport and tickets, contact our document desk immediately.";
  if (t.includes("hello") || t.includes("hi") || t.includes("help"))
    return "👋 Hello! I'm the Phantom Visa AI Consular Assistant. I can help with document queries, payment issues, appointment scheduling, and application status. What can I assist you with today?";
  return "🤖 Thank you for your message. I've noted your query. If you'd like a human visa officer to review this, I can create a formal support ticket on your behalf. Would you like me to escalate?";
}
