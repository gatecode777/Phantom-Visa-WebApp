"use client";

import React, { useState, useMemo } from "react";
import { Application } from "../context/VisaContext";
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
  Filter,
  Layers,
  Building,
  User,
  ShieldCheck,
  FileText,
  Plus,
  Bot,
  Zap,
  Star,
  Flame,
  ArrowRight
} from "lucide-react";

export interface SupportTicketRecord {
  id: string;
  category: string;
  subject: string;
  applicationId: string;
  priority: "High" | "Medium" | "Low" | "Critical";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  assignedSpecialist: string;
  lastUpdated: string;
  messages: { sender: string; role: "applicant" | "officer" | "bot"; text: string; timestamp: string }[];
}

interface ApplicantSupportProps {
  applications?: Application[];
  onNavigateAppointments?: () => void;
}

export default function ApplicantSupport({
  applications = [],
  onNavigateAppointments
}: ApplicantSupportProps) {
  // Dataset matching wireframe
  const [tickets, setTickets] = useState<SupportTicketRecord[]>([
    {
      id: "#TKT-2026-8801",
      category: "Document Verification",
      subject: "Bank statement seal & stamp clarity query for France Schengen",
      applicationId: "VO-2026-1028",
      priority: "High",
      status: "In Progress",
      assignedSpecialist: "Officer Rahul Sharma",
      lastUpdated: "10 Mins Ago",
      messages: [
        {
          sender: "Applicant",
          role: "applicant",
          text: "Hi Team, I uploaded my ICICI bank statement downloaded from net banking. Does it require a physical branch stamp?",
          timestamp: "Today, 10:15 AM"
        },
        {
          sender: "Officer Rahul Sharma",
          role: "officer",
          text: "Hello! Yes, the France Consulate requires an original physical branch seal on 6-month statements. Please re-upload a stamped copy.",
          timestamp: "Today, 10:28 AM"
        }
      ]
    },
    {
      id: "#TKT-2026-7492",
      category: "Payment & Billing",
      subject: "GST Tax Invoice breakdown query for Australia Visa",
      applicationId: "VO-2026-1025",
      priority: "Medium",
      status: "Open",
      assignedSpecialist: "Specialist Sarah Jenkins",
      lastUpdated: "2 Hours Ago",
      messages: [
        {
          sender: "Applicant",
          role: "applicant",
          text: "Could you send me the GST Tax Invoice with my company GSTIN included?",
          timestamp: "Today, 08:30 AM"
        }
      ]
    },
    {
      id: "#TKT-2026-6102",
      category: "VFS Appointment",
      subject: "Biometric appointment slot reschedule assistance",
      applicationId: "VO-2026-1025",
      priority: "Low",
      status: "Resolved",
      assignedSpecialist: "Desk Manager Vikram Patel",
      lastUpdated: "Yesterday",
      messages: [
        {
          sender: "Applicant",
          role: "applicant",
          text: "I need to reschedule my VFS Global biometrics slot in Delhi.",
          timestamp: "Yesterday, 02:15 PM"
        },
        {
          sender: "Desk Manager Vikram Patel",
          role: "officer",
          text: "Slot updated to 14 August 2026, 10:00 AM. Appointment letter dispatched.",
          timestamp: "Yesterday, 03:00 PM"
        }
      ]
    }
  ]);

  // Active Selected Ticket for Inspector Thread
  const [selectedTicketId, setSelectedTicketId] = useState<string>("#TKT-2026-8801");
  const activeTicket = useMemo(() => {
    return tickets.find((t) => t.id === selectedTicketId) || tickets[0];
  }, [tickets, selectedTicketId]);

  // New Ticket Form State
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newTicketForm, setNewTicketForm] = useState({
    category: "Document Verification",
    applicationId: "VO-2026-1025",
    priority: "Medium" as "High" | "Medium" | "Low" | "Critical",
    subject: "",
    description: ""
  });

  // Reply state for Active Ticket
  const [replyText, setReplyText] = useState("");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Handle Send Reply
  const handleSendReply = () => {
    if (!replyText.trim() || !activeTicket) return;

    const newMessage = {
      sender: "Applicant",
      role: "applicant" as const,
      text: replyText,
      timestamp: "Just Now"
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === activeTicket.id
          ? {
              ...t,
              messages: [...t.messages, newMessage],
              lastUpdated: "Just Now",
              status: "In Progress"
            }
          : t
      )
    );
    setReplyText("");
  };

  // Handle Create New Ticket
  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketForm.subject.trim() || !newTicketForm.description.trim()) return;

    const newId = `#TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdTicket: SupportTicketRecord = {
      id: newId,
      category: newTicketForm.category,
      subject: newTicketForm.subject,
      applicationId: newTicketForm.applicationId,
      priority: newTicketForm.priority,
      status: "Open",
      assignedSpecialist: "Assigned Visa Officer",
      lastUpdated: "Just Now",
      messages: [
        {
          sender: "Applicant",
          role: "applicant",
          text: newTicketForm.description,
          timestamp: "Just Now"
        }
      ]
    };

    setTickets([createdTicket, ...tickets]);
    setSelectedTicketId(newId);
    setShowCreateForm(false);
    setNewTicketForm({
      category: "Document Verification",
      applicationId: "VO-2026-1025",
      priority: "Medium",
      subject: "",
      description: ""
    });
  };

  // Filtered Tickets List
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchesQ =
        t.id.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;

      return matchesQ && matchesStatus && matchesCategory;
    });
  }, [tickets, searchQuery, statusFilter, categoryFilter]);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & CONSULAR SUPPORT BANNER */}
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
            Get 24/7 dedicated support from licensed visa specialists, track open support tickets, chat with AI Consular Assistant, or book a 1-on-1 expert consultation.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
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
      {/* SECTION 2: DASHBOARD STATISTICS CARDS GRID (6 CARDS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Active Tickets */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-[#4848F7]">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Active Tickets</p>
          <p className="text-2xl font-black text-[#4848F7] mt-1">{tickets.filter((t) => t.status !== "Closed").length}</p>
          <span className="text-[10px] text-[#4848F7] font-semibold">Open help requests</span>
        </div>

        {/* Card 2: Avg Response Time */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Avg Response</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">&lt;15 Mins</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <Zap size={10} /> Fast SLA SLA Response
          </span>
        </div>

        {/* Card 3: Resolution Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Resolution Rate</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">99.6%</p>
          <span className="text-[10px] text-slate-400 font-medium">Successfully solved</span>
        </div>

        {/* Card 4: Officers Online */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-indigo-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Officers Live</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">12 Live</p>
          <span className="text-[10px] text-indigo-600 font-medium">Specialists online</span>
        </div>

        {/* Card 5: AI Bot Availability */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">AI Consular Bot</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">24/7 Active</p>
          <span className="text-[10px] text-slate-400 font-medium">Instant automated answers</span>
        </div>

        {/* Card 6: Satisfaction Rating */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Satisfaction</p>
          <p className="text-2xl font-black text-amber-600 mt-1">4.9 / 5.0</p>
          <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
            <Star size={10} className="fill-amber-500" /> Applicant rating
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: CONCEPTUAL WORKFLOW BANNER (CONNECTED SUPPORT ESCALATION FLOW) */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#4848F7]" size={20} />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
              Connected Support Escalation Pipeline (Submit Ticket ➔ AI Triage & Routing ➔ Specialist Review ➔ Ticket Resolved)
            </h3>
          </div>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
            Guaranteed 15-Min Response
          </span>
        </div>

        {/* Pipeline Diagram */}
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

        <div className="bg-white/5 p-4 rounded-xl text-xs space-y-1 text-slate-300">
          <p className="font-bold text-white">Support SLA & Priority Guidelines:</p>
          <ul className="list-disc pl-4 space-y-1 leading-relaxed text-[11px]">
            <li>Critical & High priority tickets receive immediate 15-minute response SLA.</li>
            <li>Always attach relevant document scans or error screenshots to speed up ticket resolution.</li>
            <li>For emergency travel (&lt;48 hours), call our 24/7 Urgent Emergency Departure Hotline.</li>
          </ul>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 4: MULTI-CHANNEL CONTACT CARDS (4 CHANNELS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Channel 1: AI Consular Bot */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 border-t-4 border-t-emerald-500">
          <div className="flex items-center gap-2 text-emerald-600">
            <Bot size={18} />
            <h3 className="font-extrabold text-slate-900 text-sm">AI Consular Bot</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Instant 24/7 automated assistant for document checks, visa rules, and fee inquiries.
          </p>
          <button
            onClick={() => alert("Launching AI Consular Bot...")}
            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs py-2 rounded-xl border border-emerald-200 transition"
          >
            Start Chatbot Session
          </button>
        </div>

        {/* Channel 2: Support Ticket */}
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

        {/* Channel 3: Specialist Call */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 border-t-4 border-t-indigo-500">
          <div className="flex items-center gap-2 text-indigo-600">
            <Video size={18} />
            <h3 className="font-extrabold text-slate-900 text-sm">1-on-1 Consultation</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Schedule a 15-minute video call with a dedicated visa specialist.
          </p>
          <button
            onClick={() => {
              if (onNavigateAppointments) onNavigateAppointments();
              else alert("Redirecting to Appointment scheduling...");
            }}
            className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs py-2 rounded-xl border border-indigo-200 transition"
          >
            Book Specialist Call
          </button>
        </div>

        {/* Channel 4: Emergency Hotline */}
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
      {/* SECTION 5: CREATE NEW TICKET FORM MODAL / DRAWER */}
      {/* ============================================================ */}
      {showCreateForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Plus size={18} className="text-[#4848F7]" /> Submit a New Support Request
            </h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Cancel ✕
            </button>
          </div>

          <form onSubmit={handleCreateTicketSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Support Category</label>
                <select
                  value={newTicketForm.category}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-800"
                >
                  <option value="Document Verification">Document Verification</option>
                  <option value="Payment & Billing">Payment & Billing</option>
                  <option value="VFS Appointment">VFS Appointment</option>
                  <option value="Consular Advisory">Consular Advisory</option>
                  <option value="Embassy Rejection">Embassy Rejection Appeal</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Related Application</label>
                <select
                  value={newTicketForm.applicationId}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, applicationId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-800"
                >
                  {applications.length > 0 ? (
                    applications.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.id} - {app.destination} ({app.visaType})
                      </option>
                    ))
                  ) : (
                    <option value="VO-2026-1025">VO-2026-1025 - Australia Visitor</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Priority Level</label>
                <select
                  value={newTicketForm.priority}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value as any })}
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
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Detailed Description</label>
              <textarea
                rows={4}
                required
                placeholder="Explain your query in detail, including travel dates and specific document concerns..."
                value={newTicketForm.description}
                onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-800 font-medium"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-slate-600 font-bold hover:text-slate-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl transition cursor-pointer"
              >
                Submit Ticket Now
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 6: SEARCH & MULTI-FILTER CONTROL BAR */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
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

          {/* Status & Category Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Ticket Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Categories</option>
              <option value="Document Verification">Document Verification</option>
              <option value="Payment & Billing">Payment & Billing</option>
              <option value="VFS Appointment">VFS Appointment</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 7: SUPPORT TICKETS DIRECTORY TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <HelpCircle size={16} className="text-[#4848F7]" />
            <span>Support Tickets Directory & Case History ({filteredTickets.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned Specialist</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredTickets.map((t) => {
                const isSelected = t.id === selectedTicketId;
                return (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`cursor-pointer transition hover:bg-indigo-50/40 ${
                      isSelected ? "bg-indigo-50/80 font-semibold" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 flex items-center gap-2">
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#4848F7]" />}
                      <span>{t.id}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">{t.category}</td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">{t.subject}</td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        t.priority === "High" || t.priority === "Critical"
                          ? "bg-rose-50 text-rose-800 border-rose-200"
                          : t.priority === "Medium"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}>
                        {t.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">{t.assignedSpecialist}</td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        t.status === "In Progress"
                          ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                          : t.status === "Resolved"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-slate-100 text-slate-800 border-slate-200"
                      }`}>
                        {t.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">{t.lastUpdated}</td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedTicketId(t.id)}
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
      </div>

      {/* ============================================================ */}
      {/* SECTION 8: SELECTED TICKET THREAD INSPECTOR & REPLY BOX */}
      {/* ============================================================ */}
      {activeTicket && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#4848F7] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-xs">
                  {activeTicket.id}
                </span>
                <h3 className="text-base font-black text-slate-900">{activeTicket.subject}</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Category: {activeTicket.category} &bull; Assigned Officer: <span className="font-bold text-slate-800">{activeTicket.assignedSpecialist}</span>
              </p>
            </div>

            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              activeTicket.status === "In Progress"
                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                : activeTicket.status === "Resolved"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-100 text-slate-700 border-slate-200"
            }`}>
              Status: {activeTicket.status}
            </span>
          </div>

          {/* Conversation Messages Thread */}
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {activeTicket.messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl space-y-1.5 text-xs max-w-2xl ${
                  m.role === "applicant"
                    ? "ml-auto bg-[#EEF2FF] border border-indigo-100 text-slate-900"
                    : "mr-auto bg-slate-50 border border-slate-200 text-slate-900"
                }`}
              >
                <div className="flex items-center justify-between font-bold text-[11px] text-slate-600 border-b border-black/5 pb-1">
                  <span className={m.role === "applicant" ? "text-[#4848F7]" : "text-emerald-700"}>
                    {m.sender}
                  </span>
                  <span className="text-[10px] text-slate-400">{m.timestamp}</span>
                </div>
                <p className="leading-relaxed text-slate-800">{m.text}</p>
              </div>
            ))}
          </div>

          {/* Reply Form */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your response to the visa officer..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendReply();
                }}
                className="flex-1 bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#4848F7]"
              />

              <button
                onClick={() => alert("Attaching document to message...")}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition"
                title="Attach Document"
              >
                <Paperclip size={16} />
              </button>

              <button
                onClick={handleSendReply}
                className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Send size={14} /> Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 9: QUICK ACTIONS BAR */}
      {/* ============================================================ */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg text-xs">
        <div>
          <h4 className="font-extrabold text-white">Need Urgent Escalation for Flight Departure Under 48 Hours?</h4>
          <p className="text-slate-400 mt-0.5">Contact our emergency consular dispatch team for priority biometrics and embassy expediting.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:+9118001008800"
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Phone size={14} /> Emergency Hotline (+91 1800 100 8800)
          </a>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 10: SUPPORT FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Customer Support & SLAs</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">What is the guaranteed response time for urgent tickets?</p>
            <p className="text-slate-600 leading-relaxed">
              High and Critical priority support tickets are guaranteed a first response from a licensed visa officer within 15 minutes.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Can I schedule a 1-on-1 video call with my assigned visa officer?</p>
            <p className="text-slate-600 leading-relaxed">
              Yes, you can schedule a 1-on-1 video or phone consultation via our Appointments section under Consular Consultations.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
