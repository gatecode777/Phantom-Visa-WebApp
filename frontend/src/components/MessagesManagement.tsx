import React, { useState } from "react";
import {
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  PlusCircle,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Globe,
  Download,
  Check,
  X,
  TrendingUp,
  Sparkles,
  User,
  Building,
  Clock,
  Send,
  Printer,
  ShieldCheck,
  ArrowRight,
  Tag,
  CheckSquare,
  AlertTriangle,
  FileText,
  Paperclip,
  Star,
  Archive,
  Inbox,
  SendHorizontal,
  Mail,
  UserCheck,
  HelpCircle,
  Radio,
  Copy,
  FolderArchive,
  BarChart3,
  UserPlus
} from "lucide-react";

export interface MessageRecord {
  id: string;
  msgId: string;
  fromName: string;
  fromEmail: string;
  fromRole: "Applicant" | "Agent" | "Admin" | "System";
  toName: string;
  toEmail: string;
  toRole: "Applicant" | "Agent" | "Admin" | "All Users";
  subject: string;
  content: string;
  type: "Inbox" | "Support" | "Broadcast" | "Notification" | "System Message";
  date: string;
  dateTime: string;
  status: "Unread" | "Read" | "Replied" | "Archived";
  starred: boolean;
  ticketId?: string;
  ticketStatus?: "Open" | "In Progress" | "Waiting for Applicant" | "Resolved" | "Closed";
  priority?: "Low" | "Medium" | "High" | "Urgent";
  assignedStaff?: string;
  attachments?: { name: string; size: string }[];
  internalNotes?: string[];
}

export interface MessageTemplate {
  id: string;
  title: string;
  category: string;
  subject: string;
  body: string;
}

export const RECOMMENDED_MESSAGE_SUBMENUS = [
  "All Messages",
  "Inbox",
  "Sent Messages",
  "Unread Messages",
  "Starred Messages",
  "Support Tickets",
  "Broadcast Messages",
  "Message Templates",
  "Archived Messages"
];

export const MESSAGE_WORKFLOW_STEPS = [
  "Applicant / Agent Sends Message",
  "Admin Inbox",
  "Review Message",
  "Reply OR Convert to Ticket",
  "Applicant Receives Response",
  "Conversation Closed"
];

export const SAMPLE_MESSAGE_TEMPLATES: MessageTemplate[] = [
  { id: "t1", title: "Application Received", category: "Status", subject: "Visa Application Received", body: "Dear {name}, we have successfully received your visa application {appId}." },
  { id: "t2", title: "Document Verification Required", category: "Documents", subject: "Document Verification Needed", body: "Please re-upload your passport copy with clear resolution for visa application {appId}." },
  { id: "t3", title: "Visa Approved", category: "Decision", subject: "Congratulations! Visa Approved", body: "Your visa application {appId} has been approved by the embassy." },
  { id: "t4", title: "Visa Rejected", category: "Decision", subject: "Visa Application Decision Update", body: "Regrettably, your visa application {appId} was rejected by the embassy." },
  { id: "t5", title: "Appointment Reminder", category: "Appointments", subject: "Reminder: Upcoming Visa Appointment", body: "Reminder for your appointment on {date} at {location}." },
  { id: "t6", title: "Payment Reminder", category: "Payments", subject: "Payment Pending for Visa Application", body: "Your visa processing fee of {amount} is pending." },
  { id: "t7", title: "Refund Approved", category: "Payments", subject: "Refund Request Approved", body: "Your refund request for transaction {txnId} has been approved." },
  { id: "t8", title: "Welcome Message", category: "General", subject: "Welcome to Phantom Visa Platform", body: "Welcome aboard! Manage all your visa applications seamlessly." }
];

const MOCK_MESSAGES: MessageRecord[] = [
  {
    id: "1",
    msgId: "MSG-1001",
    fromName: "Geeta Bisht",
    fromEmail: "geeta@email.com",
    fromRole: "Applicant",
    toName: "Admin Support",
    toEmail: "support@phantomvisa.com",
    toRole: "Admin",
    subject: "Query regarding Canada Tourist Visa Document Checklist",
    content: "Hello, I uploaded my bank statements yesterday. Could you please confirm if the 6-month transaction balance is sufficient?",
    type: "Support",
    date: "04 Aug 2026",
    dateTime: "04 Aug 2026 10:15 AM",
    status: "Unread",
    starred: true,
    ticketId: "TCK-4001",
    ticketStatus: "Open",
    priority: "High",
    assignedStaff: "Officer Rahul",
    attachments: [{ name: "Bank_Statement_Jan_Jun.pdf", size: "2.4 MB" }],
    internalNotes: ["Applicant called phone support earlier today."]
  },
  {
    id: "2",
    msgId: "MSG-1002",
    fromName: "Apex Travels",
    fromEmail: "agent@apextravels.com",
    fromRole: "Agent",
    toName: "B2B Admin Team",
    toEmail: "b2b@phantomvisa.com",
    toRole: "Admin",
    subject: "Bulk Application Slot Reschedule Request for Australia Business Visa",
    content: "Hi Admin Team, we have 4 candidates whose flight schedules shifted. Kindly reschedule their biometric slots to Aug 12.",
    type: "Inbox",
    date: "04 Aug 2026",
    dateTime: "04 Aug 2026 09:30 AM",
    status: "Read",
    starred: false,
    ticketId: "TCK-4002",
    ticketStatus: "In Progress",
    priority: "Medium",
    assignedStaff: "Officer Sarah",
    attachments: [{ name: "Agent_Candidate_List.xlsx", size: "1.1 MB" }]
  },
  {
    id: "3",
    msgId: "MSG-1003",
    fromName: "Phantom Visa System",
    fromEmail: "broadcast@phantomvisa.com",
    fromRole: "System",
    toName: "All Applicants",
    toEmail: "all@phantomvisa.com",
    toRole: "All Users",
    subject: "Scheduled System Maintenance Notice - Aug 10th",
    content: "Dear Users, the portal will undergo scheduled server upgrade on August 10th from 02:00 AM to 04:00 AM IST.",
    type: "Broadcast",
    date: "03 Aug 2026",
    dateTime: "03 Aug 2026 04:00 PM",
    status: "Replied",
    starred: false
  }
];

export default function MessagesManagement() {
  // Navigation Submenu State
  const [activeSubmenu, setActiveSubmenu] = useState<string>("All Messages");

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Records State
  const [messagesList, setMessagesList] = useState<MessageRecord[]>(MOCK_MESSAGES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal / Detailed View State
  const [activeMessage, setActiveMessage] = useState<MessageRecord | null>(null);
  const [replyText, setReplyText] = useState("");

  // Broadcast Modal State
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastTarget, setBroadcastTarget] = useState("All Applicants");
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Submenu Filter Logic
  const filteredBySubmenu = messagesList.filter((msg) => {
    if (activeSubmenu === "Inbox") return msg.toRole === "Admin" && msg.status !== "Archived";
    if (activeSubmenu === "Sent Messages") return msg.fromRole === "Admin" || msg.fromRole === "System";
    if (activeSubmenu === "Unread Messages") return msg.status === "Unread";
    if (activeSubmenu === "Starred Messages") return msg.starred;
    if (activeSubmenu === "Support Tickets") return !!msg.ticketId;
    if (activeSubmenu === "Broadcast Messages") return msg.type === "Broadcast";
    if (activeSubmenu === "Archived Messages") return msg.status === "Archived";
    return true;
  });

  // Multi-criteria Search & Filter Logic
  const filteredMessages = filteredBySubmenu.filter((msg) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      msg.msgId.toLowerCase().includes(q) ||
      msg.fromName.toLowerCase().includes(q) ||
      msg.fromEmail.toLowerCase().includes(q) ||
      msg.subject.toLowerCase().includes(q) ||
      (msg.ticketId && msg.ticketId.toLowerCase().includes(q));

    const matchesType = typeFilter === "All" || msg.type === typeFilter;
    const matchesStatus = statusFilter === "All" || msg.status === statusFilter;

    return matchesQuery && matchesType && matchesStatus;
  });

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredMessages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMessages.map((m) => m.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handleToggleStar = (msg: MessageRecord) => {
    setMessagesList((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, starred: !m.starred } : m))
    );
    triggerToast(msg.starred ? `Removed star from ${msg.msgId}` : `Starred message ${msg.msgId}`);
  };

  const handleSendReply = () => {
    if (!activeMessage || !replyText.trim()) return;
    setMessagesList((prev) =>
      prev.map((m) => (m.id === activeMessage.id ? { ...m, status: "Replied" } : m))
    );
    triggerToast(`Reply sent to ${activeMessage.fromName}!`);
    setReplyText("");
    setActiveMessage(null);
  };

  const handleSendBroadcast = () => {
    if (!broadcastSubject.trim() || !broadcastBody.trim()) {
      triggerToast("Please enter subject and message body for broadcast.");
      return;
    }
    const newMsg: MessageRecord = {
      id: String(Date.now()),
      msgId: `BCST-${Math.floor(1000 + Math.random() * 9000)}`,
      fromName: "Phantom Admin System",
      fromEmail: "admin@phantomvisa.com",
      fromRole: "Admin",
      toName: broadcastTarget,
      toEmail: "group@phantomvisa.com",
      toRole: "All Users",
      subject: broadcastSubject,
      content: broadcastBody,
      type: "Broadcast",
      date: "04 Aug 2026",
      dateTime: "04 Aug 2026 11:35 AM",
      status: "Read",
      starred: false
    };
    setMessagesList([newMsg, ...messagesList]);
    triggerToast(`Broadcast message dispatched to ${broadcastTarget}!`);
    setIsBroadcastOpen(false);
    setBroadcastSubject("");
    setBroadcastBody("");
  };

  const handleDeleteRecord = (msg: MessageRecord) => {
    setMessagesList((prev) => prev.filter((m) => m.id !== msg.id));
    triggerToast(`Message ${msg.msgId} deleted.`);
    if (activeMessage?.id === msg.id) setActiveMessage(null);
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 font-sans min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#0E1A2C] border border-[#2563EB]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-6 rounded-3xl shadow-xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-700">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-200 mb-1">
            <MessageSquare size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Real-Time Helpdesk & Broadcast Messaging Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Messages & Communication Hub
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Real-time messaging, communication hub, support tickets, and broadcasts.
          </p>
        </div>

        <button
          onClick={() => setIsBroadcastOpen(true)}
          className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2 shrink-0"
        >
          <Radio size={16} /> New Broadcast Message
        </button>
      </div>

      {/* RECOMMENDED SUBMENU TABS BAR (MATCHING WIREFRAME SUBMENUS) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-2.5 shadow-2xs mb-6 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
        {RECOMMENDED_MESSAGE_SUBMENUS.map((tab) => {
          const active = activeSubmenu === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveSubmenu(tab)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 shrink-0 ${
                active
                  ? "bg-[#2563EB] text-white shadow-md"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-200/70 border border-slate-200"
              }`}
            >
              <span>{tab}</span>
            </button>
          );
        })}
      </div>

      {/* DASHBOARD STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Messages</span>
            <div className="text-2xl font-black text-slate-900 font-mono">12,840</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Message Registry</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Received Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">142</div>
            <span className="text-[10px] text-emerald-600 font-bold">Today's Inbound</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Sent Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">198</div>
            <span className="text-[10px] text-blue-600 font-bold">Today's Outbound</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Unread Messages</span>
            <div className="text-2xl font-black text-slate-900 font-mono">34</div>
            <span className="text-[10px] text-amber-600 font-bold">Awaiting Review</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Resolved Conversations</span>
            <div className="text-2xl font-black text-slate-900 font-mono">11,920</div>
            <span className="text-[10px] text-purple-600 font-bold">Closed Tickets</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">Active Chats</span>
            <div className="text-2xl font-black text-slate-900 font-mono">18</div>
            <span className="text-[10px] text-teal-600 font-bold">Live Support</span>
          </div>
        </div>

        {/* RIGHT CARD: WORKFLOW & ANALYTICS CATALOG (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Message Workflow
            </h3>

            {/* WORKFLOW FLOW */}
            <div className="space-y-1 text-[11px] text-slate-700 font-medium mb-3">
              {MESSAGE_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[9px] shrink-0">
                    ▼
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* ANALYTICS HIGHLIGHTS */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px] font-semibold text-slate-600">
              <span className="text-slate-900 font-bold block mb-1">Analytics Highlights:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                <div className="flex items-center gap-1 text-slate-700"><Check size={11} className="text-[#2563EB]" /> Avg Response: 12 Mins</div>
                <div className="flex items-center gap-1 text-slate-700"><Check size={11} className="text-[#2563EB]" /> Satisfaction: 98.4%</div>
                <div className="flex items-center gap-1 text-slate-700"><Check size={11} className="text-[#2563EB]" /> CSAT Score: 4.9/5</div>
                <div className="flex items-center gap-1 text-slate-700"><Check size={11} className="text-[#2563EB]" /> SLA Compliance: 99.1%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUBMENU 8: MESSAGE TEMPLATES SECTION (IF SELECTED) */}
      {activeSubmenu === "Message Templates" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit border-b border-slate-100 pb-2">
            <FileText size={16} className="text-[#2563EB]" /> Standard Message Templates Library
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {SAMPLE_MESSAGE_TEMPLATES.map((tmpl) => (
              <div key={tmpl.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 hover:border-blue-400 transition">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">{tmpl.title}</span>
                  <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">{tmpl.category}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono font-semibold">{tmpl.subject}</p>
                <p className="text-[11px] text-slate-600 line-clamp-2">{tmpl.body}</p>
                <button
                  onClick={() => {
                    setBroadcastSubject(tmpl.subject);
                    setBroadcastBody(tmpl.body);
                    setIsBroadcastOpen(true);
                  }}
                  className="w-full mt-1 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-[10px] transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <Copy size={12} /> Use Template
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search & Message Filters ({activeSubmenu})
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredMessages.length} of {filteredBySubmenu.length} Messages
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search (Msg ID, Name, Email, Subject, Ticket)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="MSG-1001, Geeta, Ticket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* MESSAGE TYPE */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Message Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Types</option>
              <option value="Inbox">Inbox</option>
              <option value="Support">Support</option>
              <option value="Broadcast">Broadcast</option>
              <option value="Notification">Notification</option>
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Unread">Unread</option>
              <option value="Read">Read</option>
              <option value="Replied">Replied</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* RESET BUTTON */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("All");
                setStatusFilter("All");
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-2 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200"
            >
              <RefreshCw size={13} /> Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* CONTEXTUAL BULK ACTIONS TOOLBAR */}
      {selectedIds.length > 0 && (
        <div className="bg-[#0E1A2C] border border-[#2563EB]/40 text-white p-3.5 rounded-2xl shadow-xl mb-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-6 h-6 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-mono font-bold text-xs">
              {selectedIds.length}
            </span>
            <span>Messages Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setMessagesList((prev) =>
                  prev.map((m) => (selectedIds.includes(m.id) ? { ...m, status: "Read" } : m))
                );
                triggerToast(`Marked ${selectedIds.length} messages as Read.`);
              }}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 size={14} /> Mark as Read
            </button>
            <button
              onClick={() => {
                setMessagesList((prev) =>
                  prev.map((m) => (selectedIds.includes(m.id) ? { ...m, status: "Archived" } : m))
                );
                triggerToast(`Archived ${selectedIds.length} messages.`);
              }}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <FolderArchive size={14} /> Archive Selected
            </button>
          </div>
        </div>
      )}

      {/* MESSAGES DATA TABLE (COLUMNS MATCH WIREFRAME EXACTLY) */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredMessages.length && filteredMessages.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 w-8 text-center">★</th>
                <th className="py-3.5 px-4 font-mono">Message ID</th>
                <th className="py-3.5 px-4">From</th>
                <th className="py-3.5 px-4">To</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4 font-mono">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <MessageSquare size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No messages found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(msg.id)}
                        onChange={() => handleToggleSelect(msg.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStar(msg)}
                        className="text-slate-300 hover:text-amber-400 transition cursor-pointer"
                      >
                        <Star size={15} className={msg.starred ? "fill-amber-400 text-amber-400" : ""} />
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {msg.msgId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {msg.fromName}
                      <span className="block text-[10px] text-slate-400 font-normal">({msg.fromRole})</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {msg.toName}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#2563EB] max-w-xs truncate">
                      {msg.subject}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-purple-700">
                      {msg.type}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {msg.date}
                    </td>
                    <td className="py-3.5 px-4">
                      {msg.status === "Unread" ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-amber-200">
                          🟡 Unread
                        </span>
                      ) : msg.status === "Replied" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                          🟢 Replied
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-blue-200">
                          🔵 Read
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setActiveMessage(msg);
                            setMessagesList((prev) =>
                              prev.map((m) => (m.id === msg.id && m.status === "Unread" ? { ...m, status: "Read" } : m))
                            );
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View & Reply to Message"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(msg)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>Showing 1–10 of 12,840 Messages</div>
          <div className="flex items-center gap-1 font-mono font-bold">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-40">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#2563EB] text-white rounded-lg">1</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">2</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">3</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* PROFESSIONAL RECOMMENDATION BOX (FROM WIREFRAME) */}
      <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2 mb-6">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-blue-100 pb-2">
          <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Helpdesk & Communication Controls
        </h3>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Features active: Real-time Admin ↔ Applicant / Agent messaging, file attachment preview, internal notes, priority flagging, email/SMS notification sync, and audit logs.
        </p>
      </div>

      {/* POPUP REASON / DETAIL MODAL FOR ACTIVE MESSAGE */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      Message {activeMessage.msgId}
                    </h3>
                    {activeMessage.ticketId && (
                      <span className="font-mono text-xs font-bold text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700">
                        {activeMessage.ticketId} ({activeMessage.ticketStatus})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">From: <strong className="text-blue-300">{activeMessage.fromName}</strong> ({activeMessage.fromEmail}) &bull; Date: {activeMessage.dateTime}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveMessage(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-5 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {/* SUBJECT & TYPE */}
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Subject</span>
                <h4 className="text-sm font-extrabold text-slate-900">{activeMessage.subject}</h4>
              </div>

              {/* MESSAGE CONTENT CARD */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Message Body</span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{activeMessage.content}</p>
              </div>

              {/* ATTACHMENTS IF ANY */}
              {activeMessage.attachments && activeMessage.attachments.length > 0 && (
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">Attachments</span>
                  <div className="flex flex-wrap gap-2">
                    {activeMessage.attachments.map((att, idx) => (
                      <div key={idx} className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-bold text-[#2563EB]">
                        <Paperclip size={14} />
                        <span>{att.name} ({att.size})</span>
                        <button
                          onClick={() => triggerToast(`Downloading attachment ${att.name}...`)}
                          className="ml-1 text-blue-700 hover:text-blue-900"
                        >
                          <Download size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* REPLY FORM INPUT */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-extrabold text-slate-900 block">
                  Reply to {activeMessage.fromName}:
                </label>
                <textarea
                  rows={3}
                  placeholder="Type your response message here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs p-3 rounded-2xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleToggleStar(activeMessage)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Star size={15} className={activeMessage.starred ? "fill-amber-400 text-amber-400" : ""} /> {activeMessage.starred ? "Starred" : "Star Message"}
              </button>

              <button
                onClick={handleSendReply}
                className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <SendHorizontal size={15} /> Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BROADCAST MESSAGE MODAL */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Radio size={18} className="text-[#2563EB]" />
                <h3 className="text-base font-black font-outfit text-white">Create Broadcast Message</h3>
              </div>
              <button onClick={() => setIsBroadcastOpen(false)} className="text-slate-300 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Target Recipients</label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
                >
                  <option value="All Applicants">All Applicants</option>
                  <option value="All Agents">All Agents</option>
                  <option value="Selected Countries">Selected Countries</option>
                  <option value="Specific Visa Category">Specific Visa Category</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="System Maintenance / Announcement Subject..."
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Broadcast Message Body</label>
                <textarea
                  rows={4}
                  placeholder="Write your broadcast message..."
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs p-3 rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setIsBroadcastOpen(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSendBroadcast}
                className="px-5 py-2 bg-[#2563EB] text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5"
              >
                <Radio size={14} /> Dispatch Broadcast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
