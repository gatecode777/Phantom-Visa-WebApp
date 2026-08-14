import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useVisa } from "../context/VisaContext";
import {
  SupportTicketRecord,
  TicketPriority,
  TicketStatus,
  fetchTickets,
  appendMessageApi,
  updateTicketApi,
  elapsedLabel,
  slaElapsedMins,
  formatMsgTimestamp
} from "../services/supportService";
import {
  LifeBuoy,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Search,
  RefreshCw,
  Eye,
  Edit3,
  UserCheck,
  Zap,
  ShieldCheck,
  Send,
  FileText,
  Award,
  ArrowUpRight,
  BookOpen,
  MessageCircle,
  Download,
  X,
  Users,
  TrendingUp
} from "lucide-react";

// ─── Knowledge base topics (titles only — no fabricated view counts) ──────────
const KB_TOPICS = [
  { title: "Passport Photo Size & Format Guidelines", category: "Documents" },
  { title: "Visa Fee Refund Eligibility Policy", category: "Payments" },
  { title: "Embassy Appointment Slot Allocation Rules", category: "Appointments" },
  { title: "Document Translation & Attestation Requirements", category: "Documents" },
  { title: "How to Track Application Processing Status", category: "Tracking" },
  { title: "Biometric Data Submission Guidelines", category: "Biometrics" }
];

const SUPPORT_WORKFLOW = [
  "Ticket Received & Logged",
  "Priority Categorized by AI",
  "Auto-Assigned to Agent",
  "SLA Response Clock Started",
  "Officer Responds & Resolves",
  "CSAT Survey Dispatched"
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function priorityBadge(p: TicketPriority) {
  const map: Record<TicketPriority, string> = {
    Critical: "bg-rose-50 text-rose-700",
    High:     "bg-amber-50 text-amber-700",
    Medium:   "bg-indigo-50 text-indigo-700",
    Low:      "bg-slate-100 text-slate-700"
  };
  return map[p] || "bg-slate-100 text-slate-700";
}

function statusBadge(s: TicketStatus) {
  const map: Record<TicketStatus, string> = {
    Open:          "bg-amber-50 text-amber-700",
    "In Progress": "bg-blue-50 text-blue-700",
    Resolved:      "bg-emerald-50 text-emerald-700",
    Closed:        "bg-slate-100 text-slate-600"
  };
  return map[s] || "bg-slate-100 text-slate-600";
}

function slaLabel(createdAt: string, firstResponseAt?: string): {
  label: string;
  breached: boolean;
} {
  if (firstResponseAt) {
    const mins = Math.floor(
      (new Date(firstResponseAt).getTime() - new Date(createdAt).getTime()) / 60000
    );
    return { label: `Responded in ${mins}m`, breached: mins > 15 };
  }
  const mins = slaElapsedMins(createdAt);
  return {
    label: mins >= 15 ? `${mins}m — BREACHED` : `${mins}m elapsed`,
    breached: mins >= 15
  };
}

// ─── Component ────────────────────────────────────────────────────────────────────

export default function SupportManagement() {
  const { authSession } = useVisa();

  // ── LOCAL ticket state — completely isolated from shared context ──────────
  // Fetching into local state means NO context state update → NO cascade re-renders
  const [tickets, setTickets] = useState<SupportTicketRecord[]>([]);
  const [loading, setLoading]  = useState(false);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTickets(); // no userId = admin sees all
      if (Array.isArray(data)) setTickets(data);
    } catch (err) {
      console.error("SupportManagement: failed to load tickets", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch once on mount — safe because setTickets is LOCAL, not shared context
  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  /** Patch a ticket in local state after API mutation */
  const patchTicket = (updated: SupportTicketRecord) => {
    setTickets((prev) =>
      prev.map((t) => (t.ticketId === updated.ticketId ? updated : t))
    );
  };

  // ── Stat cards — all computed from local tickets ──────────────────────────
  const openCount         = tickets.filter((t) => t.status === "Open").length;
  const inProgressCount   = tickets.filter((t) => t.status === "In Progress").length;
  const pendingEscalation = tickets.filter((t) => t.slaBreached && t.status !== "Resolved" && t.status !== "Closed").length;

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  const resolvedToday = tickets.filter(
    (t) => t.resolvedAt && new Date(t.resolvedAt) >= todayMidnight
  ).length;

  const activeOfficerIds = new Set(
    tickets
      .filter((t) => t.status === "Open" || t.status === "In Progress")
      .map((t) => t.assignedOfficerId)
      .filter(Boolean)
  );
  const agentsWorkingCount = activeOfficerIds.size;

  const agentLeaderboard = useMemo(() => {
    const map: Record<string, { name: string; assigned: number; resolved: number }> = {};
    tickets.forEach((t) => {
      if (!t.assignedOfficerName) return;
      const key = t.assignedOfficerId || t.assignedOfficerName;
      if (!map[key]) map[key] = { name: t.assignedOfficerName, assigned: 0, resolved: 0 };
      map[key].assigned++;
      if (t.status === "Resolved" || t.status === "Closed") map[key].resolved++;
    });
    return Object.values(map).sort((a, b) => b.resolved - a.resolved).slice(0, 5);
  }, [tickets]);

  // ── Selected ticket inspector ─────────────────────────────────────────────
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const activeTicket = useMemo(
    () => tickets.find((t) => t.ticketId === selectedTicketId) || null,
    [tickets, selectedTicketId]
  );

  // ── Admin reply ───────────────────────────────────────────────────────────
  const [replyText, setReplyText]  = useState("");
  const [sendingReply, setSending] = useState(false);

  const handleSendReply = async () => {
    if (!replyText.trim() || !activeTicket || !authSession?.user?.id) return;
    setSending(true);
    const result = await appendMessageApi(activeTicket.ticketId, {
      senderUserId: authSession.user.id,
      senderName:   authSession.user.name,
      senderRole:   "officer",
      text:         replyText.trim()
    });
    setSending(false);
    if (result.success && result.data) patchTicket(result.data);
    setReplyText("");
  };

  // ── Update ticket (status / priority / officer assignment) ────────────────
  const handleUpdateTicket = async (
    ticketId: string,
    changes: {
      status?: TicketStatus;
      priority?: TicketPriority;
      assignedOfficerName?: string;
      assignedOfficerId?: string;
    }
  ) => {
    const result = await updateTicketApi(ticketId, changes);
    if (result.success && result.data) patchTicket(result.data);
  };

  // ── Search, filter, pagination ────────────────────────────────────────────
  const [searchQuery, setSearchQuery]     = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilterAdmin, setStatusFilterAdmin] = useState("All");
  const [currentPage, setCurrentPage]    = useState(1);
  const PAGE_SIZE = 20;

  const filteredTickets = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return tickets.filter((t) => {
      const matchQ =
        !q ||
        t.ticketId.toLowerCase().includes(q) ||
        t.createdByName.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      const matchPriority = priorityFilter === "All" || t.priority === priorityFilter;
      const matchStatus   = statusFilterAdmin === "All" || t.status === statusFilterAdmin;
      return matchQ && matchPriority && matchStatus;
    });
  }, [tickets, searchQuery, priorityFilter, statusFilterAdmin]);

  const totalPages      = Math.max(1, Math.ceil(filteredTickets.length / PAGE_SIZE));
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // ── Toast ─────────────────────────────────────────────────────────────────
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleExport = () => {
    const rows = [
      ["Ticket ID", "Applicant", "Category", "Subject", "Priority", "Status", "Assigned Officer", "Created"],
      ...tickets.map((t) => [
        t.ticketId,
        t.createdByName,
        t.category,
        t.subject,
        t.priority,
        t.status,
        t.assignedOfficerName || "Unassigned",
        new Date(t.createdAt).toLocaleDateString("en-IN")
      ])
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `support_tickets_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast("Support tickets exported to CSV.");
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 font-sans min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">

      {/* TOAST */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#0E1A2C] border border-[#2563EB]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-6 rounded-3xl shadow-xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-700">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-200 mb-1">
            <LifeBuoy size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Admin — Customer Support & Help Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Support Management
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Live helpdesk queue, agent performance, SLA tracking, and knowledge base — all from real ticket data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs backdrop-blur-md transition cursor-pointer flex items-center gap-1.5 border border-white/20"
          >
            <RefreshCw size={15} /> Refresh Queue
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* STAT CARDS — all computed from real unifiedTickets */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Open Tickets</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{openCount}</div>
          <span className="text-[10px] text-amber-600 font-bold">Awaiting response</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">In Progress</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{inProgressCount}</div>
          <span className="text-[10px] text-blue-600 font-bold">Being handled</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">SLA Breached</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{pendingEscalation}</div>
          <span className="text-[10px] text-red-600 font-bold">Needs escalation</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Resolved Today</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{resolvedToday}</div>
          <span className="text-[10px] text-emerald-600 font-bold">Since midnight</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-indigo-600 block mb-1">Total Tickets</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{tickets.length}</div>
          <span className="text-[10px] text-indigo-600 font-bold">In system</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">Active Officers</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{agentsWorkingCount}</div>
          <span className="text-[10px] text-teal-600 font-bold">With open tickets</span>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* LEFT 2 COLUMNS */}
        <div className="lg:col-span-2 space-y-6">

          {/* SEARCH + FILTER BAR */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative w-full sm:w-64">
              <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tickets, applicants..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[11px] pl-8 pr-2 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-semibold px-3 py-2 rounded-xl focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={statusFilterAdmin}
              onChange={(e) => { setStatusFilterAdmin(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-semibold px-3 py-2 rounded-xl focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <span className="text-[11px] text-slate-400 font-medium ml-auto">
              {filteredTickets.length} ticket{filteredTickets.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* LIVE HELPDESK QUEUE TABLE */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <LifeBuoy size={16} className="text-[#2563EB]" />
                Live Helpdesk Queue ({filteredTickets.length})
              </h3>
            </div>

            {tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                <LifeBuoy size={32} className="text-slate-300" />
                <p className="text-sm font-semibold text-slate-500">No support tickets yet.</p>
                <p className="text-xs text-slate-400">Tickets submitted by applicants will appear here in real-time.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                        <th className="pb-2">Ticket ID</th>
                        <th className="pb-2">Applicant</th>
                        <th className="pb-2">Subject & Category</th>
                        <th className="pb-2 text-center">Priority</th>
                        <th className="pb-2 text-center">SLA</th>
                        <th className="pb-2 text-center">Status</th>
                        <th className="pb-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {paginatedTickets.map((t) => {
                        const sla = slaLabel(t.createdAt, t.firstResponseAt);
                        const isActive = t.ticketId === selectedTicketId;
                        return (
                          <tr
                            key={t.ticketId}
                            className={`hover:bg-slate-50 cursor-pointer transition ${isActive ? "bg-blue-50/60" : ""}`}
                            onClick={() => setSelectedTicketId(t.ticketId)}
                          >
                            <td className="py-2.5">
                              <div className="font-mono font-bold text-slate-900 flex items-center gap-1">
                                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />}
                                {t.ticketId}
                                {t.slaBreached && (
                                  <span className="text-[9px] bg-rose-100 text-rose-700 px-1 py-0.5 rounded font-bold border border-rose-200">SLA!</span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">{elapsedLabel(t.createdAt)}</div>
                            </td>
                            <td className="py-2.5 font-bold text-slate-900">{t.createdByName}</td>
                            <td className="py-2.5">
                              <span className="font-bold text-slate-900 block truncate max-w-[160px]">{t.subject}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{t.category}</span>
                            </td>
                            <td className="py-2.5 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${priorityBadge(t.priority)}`}>
                                {t.priority}
                              </span>
                            </td>
                            <td className={`py-2.5 text-center text-[10px] font-bold ${sla.breached ? "text-rose-600" : "text-emerald-700"}`}>
                              {sla.label}
                            </td>
                            <td className="py-2.5 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusBadge(t.status)}`}>
                                {t.status}
                              </span>
                            </td>
                            <td className="py-2.5 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setSelectedTicketId(t.ticketId)}
                                className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#2563EB] rounded-lg transition"
                                title="View thread"
                              >
                                <Eye size={13} />
                              </button>
                              <button
                                onClick={async () => {
                                  const next: TicketStatus =
                                    t.status === "Open" ? "In Progress" :
                                    t.status === "In Progress" ? "Resolved" : "Closed";
                                  await handleUpdateTicket(t.ticketId, { status: next });
                                  triggerToast(`Ticket ${t.ticketId} → ${next}`);
                                }}
                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition"
                                title="Advance status"
                              >
                                <Edit3 size={13} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span>
                      Page {currentPage} of {totalPages} ({filteredTickets.length} tickets)
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
                      >
                        ← Prev
                      </button>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* SELECTED TICKET THREAD (ADMIN VIEW) */}
          {activeTicket && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-[#2563EB] text-xs bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {activeTicket.ticketId}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900">{activeTicket.subject}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {activeTicket.createdByName} &bull; {activeTicket.category}
                    {activeTicket.applicationId && (
                      <> &bull; App: <span className="font-mono font-bold">{activeTicket.applicationId}</span></>
                    )}
                    {" "}&bull; {elapsedLabel(activeTicket.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Status changer */}
                  <select
                    value={activeTicket.status}
                    onChange={async (e) => {
                      await handleUpdateTicket(activeTicket.ticketId, { status: e.target.value as TicketStatus });
                      triggerToast(`Status updated to ${e.target.value}`);
                    }}
                    className="bg-blue-50 border border-blue-200 text-[11px] text-blue-800 font-bold px-2 py-1.5 rounded-xl focus:outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                  {/* Priority changer */}
                  <select
                    value={activeTicket.priority}
                    onChange={async (e) => {
                      await handleUpdateTicket(activeTicket.ticketId, { priority: e.target.value as TicketPriority });
                      triggerToast(`Priority updated to ${e.target.value}`);
                    }}
                    className="bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-bold px-2 py-1.5 rounded-xl focus:outline-none"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Thread */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {activeTicket.messages.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-6">No messages in this ticket yet.</p>
                ) : (
                  activeTicket.messages.map((m, idx) => (
                    <div
                      key={m.messageId || idx}
                      className={`p-3 rounded-xl text-xs max-w-2xl ${
                        m.senderRole === "applicant"
                          ? "ml-auto bg-indigo-50 border border-indigo-100 text-slate-900"
                          : m.senderRole === "bot"
                          ? "mr-auto bg-emerald-50 border border-emerald-100 text-slate-900"
                          : "mr-auto bg-slate-50 border border-slate-200 text-slate-900"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1 text-[10px] font-bold">
                        <span className={
                          m.senderRole === "applicant" ? "text-[#4848F7]" :
                          m.senderRole === "bot" ? "text-emerald-700" : "text-orange-700"
                        }>
                          {m.senderName}
                          {m.senderRole === "bot" && " 🤖"}
                          {m.senderRole === "officer" && " 👮"}
                        </span>
                        <span className="text-slate-400">{formatMsgTimestamp(m.timestamp)}</span>
                      </div>
                      <p className="leading-relaxed">{m.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Assign officer */}
              <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                <UserCheck size={14} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Assign officer name (e.g. Priya Patel)"
                  defaultValue={activeTicket.assignedOfficerName}
                  onBlur={async (e) => {
                    const name = e.target.value.trim();
                    if (name !== activeTicket.assignedOfficerName) {
                      await handleUpdateTicket(activeTicket.ticketId, {
                        assignedOfficerName: name,
                        assignedOfficerId:   authSession?.user?.id || ""
                      });
                      triggerToast(`Assigned to ${name || "nobody"}`);
                    }
                  }}
                  className="flex-1 bg-slate-50 border border-slate-200 text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Admin reply box */}
              <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                <input
                  type="text"
                  placeholder="Type official reply to applicant..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) handleSendReply(); }}
                  className="flex-1 bg-slate-50 border border-slate-200 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
                <button
                  onClick={handleSendReply}
                  disabled={sendingReply || !replyText.trim()}
                  className="bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  {sendingReply ? <RefreshCw size={12} className="animate-spin" /> : <Send size={13} />}
                  Reply
                </button>
              </div>
            </div>
          )}

          {/* AGENT LEADERBOARD — computed from real ticket data */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award size={16} className="text-emerald-600" />
              Support Team Performance Leaderboard
            </h3>
            {agentLeaderboard.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">
                No officer assignments yet. Assign tickets to officers to build the leaderboard.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                      <th className="pb-2">Officer</th>
                      <th className="pb-2 text-center">Assigned</th>
                      <th className="pb-2 text-center">Resolved</th>
                      <th className="pb-2 text-center">Resolution Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {agentLeaderboard.map((a, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 font-bold text-slate-900 flex items-center gap-2">
                          {idx === 0 && <span className="text-amber-500">🥇</span>}
                          {idx === 1 && <span className="text-slate-400">🥈</span>}
                          {idx === 2 && <span className="text-amber-700">🥉</span>}
                          {a.name}
                        </td>
                        <td className="py-2 text-center font-mono font-bold text-slate-900">{a.assigned}</td>
                        <td className="py-2 text-center font-mono font-bold text-emerald-700">{a.resolved}</td>
                        <td className="py-2 text-center font-mono text-slate-600">
                          {a.assigned > 0 ? `${Math.round((a.resolved / a.assigned) * 100)}%` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* KNOWLEDGE BASE — titles only, no fabricated view counts */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <BookOpen size={16} className="text-purple-600" /> Knowledge Base Help Topics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {KB_TOPICS.map((faq, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex justify-between items-center">
                  <div>
                    <strong className="text-slate-900 font-bold block text-xs">{faq.title}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">{faq.category}</span>
                  </div>
                  <button
                    onClick={() => triggerToast(`Opened: ${faq.title}`)}
                    className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-[#2563EB] transition"
                  >
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* QUICK ACTIONS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <Zap size={16} className="text-[#2563EB]" /> Support Actions
            </h3>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} /> Refresh Live Queue
            </button>
            <button
              onClick={handleExport}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Download size={14} /> Export Support Logs
            </button>
          </div>

          {/* TICKET RESOLUTION WORKFLOW */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <Clock size={16} className="text-emerald-600" /> Ticket Resolution Workflow
            </h3>
            <div className="space-y-2">
              {SUPPORT_WORKFLOW.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SLA POLICY REMINDER */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-blue-100 pb-2">
              <ShieldCheck size={16} className="text-[#2563EB]" /> SLA Policy
            </h3>
            <ul className="text-[11px] text-slate-600 leading-relaxed space-y-1.5 font-medium list-disc pl-4">
              <li>Critical & High tickets: 15-minute guaranteed first response.</li>
              <li>SLA breaches are automatically flagged and system-notified in the ticket thread.</li>
              <li>Assign an officer immediately to clear SLA breach status.</li>
              <li>Resolved status must be confirmed by the applicant or auto-closed after 72 hours.</li>
            </ul>
          </div>

          {/* SUMMARY METRICS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <TrendingUp size={16} className="text-purple-600" /> Queue Snapshot
            </h3>
            <div className="space-y-2 text-xs">
              {(["Critical", "High", "Medium", "Low"] as TicketPriority[]).map((p) => {
                const count = tickets.filter((t) => t.priority === p && (t.status === "Open" || t.status === "In Progress")).length;
                return (
                  <div key={p} className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${priorityBadge(p)}`}>{p}</span>
                    <div className="flex-1 mx-3 bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-[#2563EB] h-1.5 rounded-full transition-all"
                        style={{ width: tickets.length ? `${(count / tickets.length) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className="font-mono font-bold text-slate-700">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
