import mongoose, { Schema, Document } from "mongoose";

// ─── Sub-document: one message in the ticket thread ───────────────────────────
export interface ITicketMessage {
  messageId: string;
  senderUserId: string;   // User._id of the sender
  senderName: string;     // snapshot at send time
  senderRole: "applicant" | "officer" | "bot";
  text: string;
  timestamp: Date;
}

// ─── Main ticket document ──────────────────────────────────────────────────────
export interface ISupportTicket extends Document {
  /** Canonical ticket reference — TKT-YYYY-XXXX */
  ticketId: string;

  /** User._id of the APPLICANT who opened the ticket (role === "Applicant") */
  createdByUserId: string;
  /** Snapshot of applicant name at creation time */
  createdByName: string;

  /**
   * VO-YYYY-XXXX application reference (empty string if no application linked).
   * Always uses the same canonical format as Application.applicationId.
   */
  applicationId: string;

  category: string;
  subject: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Resolved" | "Closed";

  /** User._id of the Staff/Admin officer currently assigned (empty if unassigned) */
  assignedOfficerId: string;
  /** Snapshot of officer name */
  assignedOfficerName: string;

  /** Full persisted conversation — both sides see this same array */
  messages: ITicketMessage[];

  /** Set to true when no officer reply within 15 minutes of creation */
  slaBreached: boolean;
  /** Timestamp of first officer/bot reply */
  firstResponseAt?: Date;
  /** Timestamp when status moved to Resolved or Closed */
  resolvedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────
const TicketMessageSchema = new Schema(
  {
    messageId:    { type: String, required: true },
    senderUserId: { type: String, required: true },
    senderName:   { type: String, required: true },
    senderRole:   { type: String, enum: ["applicant", "officer", "bot"], required: true },
    text:         { type: String, required: true },
    timestamp:    { type: Date, default: Date.now }
  },
  { _id: false }
);

const SupportTicketSchema: Schema = new Schema(
  {
    // Canonical ID — TKT-YYYY-XXXX
    ticketId: { type: String, required: true, unique: true, index: true },

    // Applicant identity (User._id + name snapshot) — always role=Applicant
    createdByUserId: { type: String, required: true, index: true },
    createdByName:   { type: String, required: true },

    // Linked application (VO-YYYY-XXXX canonical format; "" if none)
    applicationId: { type: String, default: "" },

    // Ticket metadata
    category: { type: String, required: true },
    subject:  { type: String, required: true },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium"
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open"
    },

    // Officer assignment — Staff or Admin user
    assignedOfficerId:   { type: String, default: "" },
    assignedOfficerName: { type: String, default: "" },

    // Conversation thread — same array seen by both applicant and admin
    messages: { type: [TicketMessageSchema], default: [] },

    // SLA tracking
    slaBreached:    { type: Boolean, default: false },
    firstResponseAt: { type: Date },
    resolvedAt:      { type: Date }
  },
  { timestamps: true }
);

export default mongoose.models.SupportTicket ||
  mongoose.model<ISupportTicket>("SupportTicket", SupportTicketSchema);
