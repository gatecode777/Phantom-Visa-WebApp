"use client";

import React, { useState, useMemo } from "react";
import { useVisa } from "../context/VisaContext";
import { Application } from "../context/VisaContext";
import {
  SupportTicketRecord,
  TicketMessage,
  TicketPriority,
  TicketStatus,
  createTicketApi,
  appendMessageApi,
  elapsedLabel,
  formatMsgTimestamp,
  getBotResponse
} from "../services/supportService";
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Video,
  Send,
  Paperclip,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Layers,
  User,
  ShieldCheck,
  FileText,
  Plus,
  Bot,
  Zap,
  Star,
  Flame,
  ArrowRight,
  RefreshCw,
  X,
  ChevronDown
} from "lucide-react";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ApplicantSupportProps {
  applications?: Application[];
  onNavigateAppointments?: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SUPPORT_CATEGORIES = [
  "Document Verification",
  "Payment & Billing",
  "VFS Appointment",
  "Consular Advisory",
  "Embassy Rejection Appeal",
  "Visa Status Query",
  "General Inquiry"
];

function priorityBadge(p: TicketPriority) {
  const map: Record<TicketPriority, string> = {
    Critical: "bg-rose-50 text-rose-800 border-rose-200",
    High:     "bg-amber-50 text-amber-800 border-amber-200",
    Medium:   "bg-indigo-50 text-indigo-800 border-indigo-200",
    Low:      "bg-emerald-50 text-emerald-800 border-emerald-200"
  };
  return map[p] || "bg-slate-100 text-slate-800 border-slate-200";
}

function statusBadge(s: TicketStatus) {
  const map: Record<TicketStatus, string> = {
    Open:         "bg-amber-50 text-amber-800 border-amber-200",
    "In Progress": "bg-indigo-50 text-indigo-800 border-indigo-200",
    Resolved:     "bg-emerald-50 text-emerald-800 border-emerald-200",
    Closed:       "bg-slate-100 text-slate-700 border-slate-200"
  };
  return map[s] || "bg-slate-100 text-slate-700 border-slate-200";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ApplicantSupport({
  applications = [],
  onNavigateAppointments
}: ApplicantSupportProps) {
  const {
    authSession,
    unifiedTickets,
    addSupportTicket,
    updateSupportTicket
  } = useVisa();

  // ── Scope: only this applicant's tickets ─────────────────────────────────
  const myTickets = useMemo(
    () =>
      unifiedTickets
        .filter((t) => t.createdByUserId === authSession?.user?.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [unifiedTickets, authSession]
  );

  // ── Active ticket ───────────────────────────────────────────────────────
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const activeTicket = useMemo(
    () => myTickets.find((t) => t.ticketId === selectedTicketId) || myTickets[0] || null,
    [myTickets, selectedTicketId]
  );

  // ── Stat cards ─────────────────────────────────────────────────────────────
  const activeCount   = myTickets.filter((t) => t.status === "Open" || t.status === "In Progress").length;
  const resolvedCount = myTickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;
  const totalCount    = myTickets.length;
  const assignedCount = myTickets.filter((t) => !!t.assignedOfficerName).length;

  // Avg response time from real firstResponseAt data
  const avgResponseLabel = useMemo(() => {
    const withResponse = myTickets.filter((t) => t.firstResponseAt);
    if (withResponse.length === 0) return "—";
    const totalMins = withResponse.reduce((sum, t) => {
      const diffMs = new Date(t.firstResponseAt!).getTime() - new Date(t.createdAt).getTime();
      return sum + Math.floor(diffMs / 60000);
    }, 0);
    const avg = Math.round(totalMins / withResponse.length);
    return avg < 60 ? `${avg} min` : `${Math.round(avg / 60)} hr`;
  }, [myTickets]);

  // ── Search & filter ────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery]       = useState("");
  const [statusFilter, setStatusFilter]     = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredTickets = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return myTickets.filter((t) => {
      const matchQ =
        !q ||
        t.ticketId.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      const matchStatus   = statusFilter === "all" || t.status === statusFilter;
      const matchCategory = categoryFilter === "all" || t.category === categoryFilter;
      return matchQ && matchStatus && matchCategory;
    });
  }, [myTickets, searchQuery, statusFilter, categoryFilter]);

  // ── Create ticket form ─────────────────────────────────────────────────────
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  const [createError, setCreateError]       = useState("");
  const [newTicketForm, setNewTicketForm]   = useState({
    category:      SUPPORT_CATEGORIES[0],
    applicationId: "",
    priority:      "Medium" as TicketPriority,
    subject:       "",
    description:   ""
  });

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketForm.subject.trim() || !newTicketForm.description.trim()) return;
    if (!authSession?.user?.id) {
      setCreateError("You must be logged in to create a support ticket.");
      return;
    }

    setSubmitting(true);
    setCreateError("");

    const result = await createTicketApi({
      createdByUserId: authSession.user.id,
      createdByName:   authSession.user.name,
      applicationId:   newTicketForm.applicationId || "",
      category:        newTicketForm.category,
      subject:         newTicketForm.subject.trim(),
      priority:        newTicketForm.priority,
      firstMessage:    newTicketForm.description.trim()
    });

    setSubmitting(false);

    if (result.success && result.data) {
      addSupportTicket(result.data);
      setSelectedTicketId(result.data.ticketId);
      setShowCreateForm(false);
      setNewTicketForm({
        category: SUPPORT_CATEGORIES[0],
        applicationId: "",
        priority: "Medium",
        subject: "",
        description: ""
      });
    } else {
      setCreateError("Failed to submit ticket. Please try again.");
    }
  };

  // ── Send reply ─────────────────────────────────────────────────────────────
  const [replyText, setReplyText]   = useState("");
  const [sendingReply, setSending]  = useState(false);

  const handleSendReply = async () => {
    if (!replyText.trim() || !activeTicket || !authSession?.user?.id) return;
    setSending(true);

    const result = await appendMessageApi(activeTicket.ticketId, {
      senderUserId: authSession.user.id,
      senderName:   authSession.user.name,
      senderRole:   "applicant",
      text:         replyText.trim()
    });

    setSending(false);
    if (result.success && result.data) {
      updateSupportTicket(result.data.ticketId, result.data);
    }
    setReplyText("");
  };

  // ── AI Chatbot panel ───────────────────────────────────────────────────────
  const [showChatbot, setShowChatbot]   = useState(false);
  const [chatInput, setChatInput]       = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "bot"; text: string; ts: string }[]
  >([
    {
      role: "bot",
      text: "👋 Hello! I'm the Phantom Visa AI Consular Assistant. I can help with document queries, payment issues, appointment scheduling, and application status. What can I assist you with today?",
      ts: new Date().toISOString()
    }
  ]);

  const handleChatSend = async () => {
    const text = chatInput.trim();
    if (!text) return;
    const now = new Date().toISOString();
    setChatMessages((prev) => [...prev, { role: "user", text, ts: now }]);
    setChatInput("");

    // Simulate bot typing delay (300ms) then respond
    setTimeout(() => {
      const response = getBotResponse(text);
      setChatMessages((prev) => [
        ...prev,
        { role: "bot", text: response, ts: new Date().toISOString() }
      ]);
    }, 350);

    // If logged in and there's an active ticket, also save to that thread
    if (authSession?.user?.id && activeTicket) {
      await appendMessageApi(activeTicket.ticketId, {
        senderUserId: "BOT",
        senderName:   "AI Consular Bot",
        senderRole:   "bot",
        text:         `[Bot session] User: "${text}" → ${getBotResponse(text)}`
      });
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  const isLoading = !authSession;

  return (
    <div className="space-y-6 pb-12 text-slate-800">

      {/* ============================================================ */}
      {/* SECTION 1: HEADER BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Applicant Portal</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">Support Desk</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Consular Customer Support & Help Desk</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Zap size={12} className="text-emerald-600 animate-pulse" /> 24/7 Consular Desk Live
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Get dedicated support from licensed visa specialists, track open support tickets, chat with AI Consular Assistant, or book a 1-on-1 expert consultation.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.location.reload()}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition"
            title="Refresh tickets"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>Create Support Ticket</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: STAT CARDS — all computed from real ticket data */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-[#4848F7]">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Active Tickets</p>
          {/* Active = Open + In Progress — NOT "not Closed" */}
          <p className="text-2xl font-black text-[#4848F7] mt-1">{activeCount}</p>
          <span className="text-[10px] text-[#4848F7] font-semibold">Open + In Progress</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Resolved</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{resolvedCount}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Closed issues</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-indigo-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Tickets</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">{totalCount}</p>
          <span className="text-[10px] text-indigo-600 font-semibold">All time</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Avg Response</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{avgResponseLabel}</p>
          <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
            <Zap size={10} /> Based on your tickets
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Officers Assigned</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{assignedCount}</p>
          <span className="text-[10px] text-slate-400 font-medium">Tickets with officer</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-purple-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">AI Bot</p>
          <p className="text-2xl font-black text-purple-600 mt-1">24/7</p>
          <span className="text-[10px] text-purple-500 font-semibold">Always available</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: ESCALATION PIPELINE BANNER */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#4848F7]" size={20} />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
              Connected Support Escalation Pipeline
            </h3>
          </div>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
            Guaranteed 15-Min SLA Response
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 1</span>
            <p className="text-white">Submit Ticket or Query</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 2</span>
            <p className="text-white">AI Triage & Auto-Routing</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 3</span>
            <p className="text-white">Consular Officer Review</p>
          </div>
          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30 space-y-1 text-emerald-300">
            <span className="text-emerald-300 block text-[10px] uppercase">Step 4</span>
            <p className="font-bold">Query Resolved & Closed ✓</p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 4: MULTI-CHANNEL CONTACT CARDS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* AI Consular Bot */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 border-t-4 border-t-emerald-500">
          <div className="flex items-center gap-2 text-emerald-600">
            <Bot size={18} />
            <h3 className="font-extrabold text-slate-900 text-sm">AI Consular Bot</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Instant 24/7 automated assistant for document checks, visa rules, and fee inquiries.
          </p>
          <button
            onClick={() => setShowChatbot(true)}
            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs py-2 rounded-xl border border-emerald-200 transition cursor-pointer"
          >
            Start Chatbot Session
          </button>
        </div>

        {/* Support Ticket */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 border-t-4 border-t-[#4848F7]">
          <div className="flex items-center gap-2 text-[#4848F7]">
            <FileText size={18} />
            <h3 className="font-extrabold text-slate-900 text-sm">Support Ticket</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Submit a formal ticket to licensed visa officers with file attachments.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-xl transition cursor-pointer"
          >
            Open New Ticket
          </button>
        </div>

        {/* Specialist Call — routes to real Appointments booking */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 border-t-4 border-t-indigo-500">
          <div className="flex items-center gap-2 text-indigo-600">
            <Video size={18} />
            <h3 className="font-extrabold text-slate-900 text-sm">1-on-1 Consultation</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Schedule a 15-minute video call with a dedicated visa specialist via Appointments.
          </p>
          <button
            onClick={() => {
              if (onNavigateAppointments) onNavigateAppointments();
            }}
            className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs py-2 rounded-xl border border-indigo-200 transition cursor-pointer"
          >
            Book Specialist Call
          </button>
        </div>

        {/* Emergency Hotline — real tel: link */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 border-t-4 border-t-rose-500">
          <div className="flex items-center gap-2 text-rose-600">
            <Flame size={18} />
            <h3 className="font-extrabold text-slate-900 text-sm">Emergency Hotline</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Priority phone desk for departure dates under 48 hours or airport issues.
          </p>
          <a
            href="tel:+9118001008800"
            className="w-full bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs py-2 rounded-xl border border-rose-200 transition block text-center"
          >
            Call +91 1800 100 8800
          </a>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: CREATE TICKET FORM */}
      {/* ============================================================ */}
      {showCreateForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Plus size={18} className="text-[#4848F7]" /> Submit a New Support Request
            </h3>
            <button
              onClick={() => { setShowCreateForm(false); setCreateError(""); }}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Cancel ✕
            </button>
          </div>

          {createError && (
            <p className="text-xs text-rose-600 font-semibold bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {createError}
            </p>
          )}

          <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Support Category</label>
                <select
                  value={newTicketForm.category}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-800"
                >
                  {SUPPORT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Related Application</label>
                <select
                  value={newTicketForm.applicationId}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, applicationId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-800"
                >
                  <option value="">— None / General Query —</option>
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.id} — {app.destination} ({app.visaType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Priority Level</label>
                <select
                  value={newTicketForm.priority}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value as TicketPriority })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-800"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority (SLA &lt;15m)</option>
                  <option value="Critical">Critical Emergency</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject / Issue Summary</label>
              <input
                type="text"
                required
                placeholder="Brief summary of your query..."
                value={newTicketForm.subject}
                onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-[#4848F7]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Detailed Description</label>
              <textarea
                rows={4}
                required
                placeholder="Explain your query in detail, including travel dates and specific concerns..."
                value={newTicketForm.description}
                onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-[#4848F7]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setShowCreateForm(false); setCreateError(""); }}
                className="px-4 py-2 text-slate-600 font-bold hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#4848F7] hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-xl transition cursor-pointer flex items-center gap-2"
              >
                {submitting && <RefreshCw size={13} className="animate-spin" />}
                {submitting ? "Submitting…" : "Submit Ticket Now"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 6: SEARCH & FILTER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search Ticket ID, Subject, Category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4848F7] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none"
            >
              <option value="all">All Categories</option>
              {SUPPORT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <span className="text-slate-400 font-medium">
              {filteredTickets.length} ticket{filteredTickets.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 7: TICKET TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <HelpCircle size={16} className="text-[#4848F7]" />
            <span>My Support Tickets ({filteredTickets.length})</span>
          </h3>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
            <RefreshCw size={20} className="animate-spin text-[#4848F7]" />
            <span className="text-sm">Loading your tickets…</span>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
            <HelpCircle size={32} className="text-slate-300" />
            <p className="text-sm font-semibold text-slate-500">
              {myTickets.length === 0
                ? "You haven't created any support tickets yet."
                : "No tickets match your search or filter."}
            </p>
            {myTickets.length === 0 && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-[#4848F7] text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Create Your First Ticket
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned Officer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Updated</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((t) => {
                  const isSelected = t.ticketId === (activeTicket?.ticketId ?? "");
                  return (
                    <tr
                      key={t.ticketId}
                      onClick={() => setSelectedTicketId(t.ticketId)}
                      className={`cursor-pointer transition hover:bg-indigo-50/40 ${
                        isSelected ? "bg-indigo-50/80 font-semibold" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#4848F7]" />}
                          {t.ticketId}
                          {t.slaBreached && (
                            <span className="ml-1 px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[9px] font-bold rounded-full border border-rose-200">
                              SLA!
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{t.category}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">{t.subject}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityBadge(t.priority)}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {t.assignedOfficerName || <span className="text-slate-400 italic">Pending assignment</span>}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadge(t.status)}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {elapsedLabel(t.updatedAt)}
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedTicketId(t.ticketId)}
                          className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg transition text-[11px] cursor-pointer"
                        >
                          View Thread
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* SECTION 8: TICKET THREAD INSPECTOR + REPLY */}
      {/* ============================================================ */}
      {activeTicket && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-[#4848F7] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-xs">
                  {activeTicket.ticketId}
                </span>
                <h3 className="text-base font-black text-slate-900">{activeTicket.subject}</h3>
                {activeTicket.slaBreached && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                    ⚠️ SLA Breached
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Category: {activeTicket.category}
                {activeTicket.applicationId && (
                  <> &bull; Application: <span className="font-bold text-slate-700 font-mono">{activeTicket.applicationId}</span></>
                )}
                {activeTicket.assignedOfficerName && (
                  <> &bull; Officer: <span className="font-bold text-slate-800">{activeTicket.assignedOfficerName}</span></>
                )}
                {" "}&bull; Opened {elapsedLabel(activeTicket.createdAt)}
              </p>
            </div>

            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusBadge(activeTicket.status)}`}>
              {activeTicket.status}
            </span>
          </div>

          {/* Conversation Thread */}
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {activeTicket.messages.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-8">No messages yet. Send a reply to start the conversation.</p>
            ) : (
              activeTicket.messages.map((m, idx) => (
                <div
                  key={m.messageId || idx}
                  className={`p-4 rounded-xl space-y-1.5 text-xs max-w-2xl ${
                    m.senderRole === "applicant"
                      ? "ml-auto bg-[#EEF2FF] border border-indigo-100 text-slate-900"
                      : m.senderRole === "bot"
                      ? "mr-auto bg-emerald-50 border border-emerald-200 text-slate-900"
                      : "mr-auto bg-slate-50 border border-slate-200 text-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-[11px] text-slate-600 border-b border-black/5 pb-1">
                    <span className={
                      m.senderRole === "applicant" ? "text-[#4848F7]" :
                      m.senderRole === "bot" ? "text-emerald-700" :
                      "text-orange-700"
                    }>
                      {m.senderName}
                      {m.senderRole === "bot" && " 🤖"}
                      {m.senderRole === "officer" && " 👮"}
                    </span>
                    <span className="text-[10px] text-slate-400">{formatMsgTimestamp(m.timestamp)}</span>
                  </div>
                  <p className="leading-relaxed text-slate-800">{m.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Reply Box — disabled if Resolved/Closed */}
          {activeTicket.status === "Resolved" || activeTicket.status === "Closed" ? (
            <div className="pt-3 border-t border-slate-100 bg-slate-50 rounded-xl p-3 text-center text-xs text-slate-500 font-medium">
              <CheckCircle2 size={14} className="inline mr-1.5 text-emerald-600" />
              This ticket is {activeTicket.status.toLowerCase()}. Create a new ticket if you need further assistance.
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type your response to the visa officer..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) handleSendReply(); }}
                  className="flex-1 bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#4848F7]"
                />
                <button
                  onClick={handleSendReply}
                  disabled={sendingReply || !replyText.trim()}
                  className="bg-[#4848F7] hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  {sendingReply ? <RefreshCw size={13} className="animate-spin" /> : <Send size={14} />}
                  {sendingReply ? "Sending…" : "Send Reply"}
                </button>
              </div>
              <p className="text-[10px] text-slate-400">Your reply is saved to the ticket and visible to the assigned officer.</p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 9: EMERGENCY QUICK ACTIONS */}
      {/* ============================================================ */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg text-xs">
        <div>
          <h4 className="font-extrabold text-white">Need Urgent Escalation for Flight Departure Under 48 Hours?</h4>
          <p className="text-slate-400 mt-0.5">Contact our emergency consular dispatch team for priority biometrics and embassy expediting.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:+9118001008800"
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
          >
            <Phone size={14} /> Emergency Hotline (+91 1800 100 8800)
          </a>
        </div>
      </div>

      {/* ============================================================ */}
      {/* AI CHATBOT PANEL (SLIDE-IN MODAL) */}
      {/* ============================================================ */}
      {showChatbot && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:justify-end sm:pr-6 sm:pb-6 p-0">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:w-96 h-[520px] flex flex-col shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-emerald-600 rounded-t-3xl">
              <div className="flex items-center gap-2 text-white">
                <Bot size={18} />
                <div>
                  <p className="font-extrabold text-sm">AI Consular Bot</p>
                  <p className="text-[10px] text-emerald-100">Phantom Visa • Always Online</p>
                </div>
              </div>
              <button onClick={() => setShowChatbot(false)} className="text-white/80 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "ml-auto bg-[#4848F7] text-white"
                      : "mr-auto bg-slate-100 text-slate-800"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask anything about your visa..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleChatSend(); }}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleChatSend}
                  disabled={!chatInput.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2 rounded-xl transition"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
