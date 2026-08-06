import React, { useState } from "react";
import {
  LifeBuoy,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  PlusCircle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  UserCheck,
  Zap,
  ShieldCheck,
  Sliders,
  Send,
  FileText,
  Sparkles,
  Download,
  Star,
  Users,
  Award,
  ArrowUpRight,
  BookOpen,
  MessageCircle,
  UserX,
  Layers,
  X
} from "lucide-react";

export interface TicketRecord {
  ticketId: string;
  user: string;
  subject: string;
  category: string;
  priority: "Urgent" | "High" | "Medium" | "Low";
  assignedAgent: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdTime: string;
}

export interface AgentStatRecord {
  agentName: string;
  assignedCount: number;
  resolvedCount: number;
  csat: string;
  avgTime: string;
  status: "Online" | "Away" | "Offline";
}

export const SUPPORT_WORKFLOW = [
  "Ticket Received",
  "Priority Categorized",
  "Auto Assigned to Agent",
  "SLA Response Clock Started",
  "Customer Resolved",
  "CSAT Survey Dispatched"
];

export const SUPPORT_FEATURES = [
  "SLA Tracking & Escalation Alerts",
  "Automated Ticket Assignment",
  "Multi-channel Support (Chat/Email)",
  "Customer CSAT Surveys",
  "Knowledge Base FAQ Engine",
  "Live Response SLA Countdown",
  "Priority Level Routing",
  "Attachment Inspection",
  "Agent Workload Balancing",
  "Audit Trail Log"
];

export const LAYOUT_CATALOG = [
  "Support",
  "Statistics Cards",
  "Create Ticket",
  "Support Tickets Table",
  "Knowledge Base",
  "Agent Performance",
  "Quick Actions"
];

const MOCK_TICKETS: TicketRecord[] = [
  { ticketId: "TCK-1001", user: "Sunita Sharma", subject: "Payment Failed - Application #PV-9988", category: "Payment Issue", priority: "Urgent", assignedAgent: "Rahul Sharma", status: "Open", createdTime: "10 Mins Ago" },
  { ticketId: "TCK-1002", user: "Vikram Malhotra", subject: "Document Rejection Clarification", category: "Document Upload", priority: "High", assignedAgent: "Priya Patel", status: "In Progress", createdTime: "25 Mins Ago" },
  { ticketId: "TCK-1003", user: "Ananya Roy", subject: "Appointment Booking Delay", category: "Embassy Delay", priority: "Low", assignedAgent: "Ankit Verma", status: "Resolved", createdTime: "2 Hours Ago" }
];

const MOCK_AGENTS: AgentStatRecord[] = [
  { agentName: "Rahul Sharma", assignedCount: 42, resolvedCount: 38, csat: "4.9 / 5.0", avgTime: "10 Mins", status: "Online" },
  { agentName: "Priya Patel", assignedCount: 35, resolvedCount: 32, csat: "4.8 / 5.0", avgTime: "12 Mins", status: "Online" },
  { agentName: "Ankit Verma", assignedCount: 28, resolvedCount: 25, csat: "4.7 / 5.0", avgTime: "15 Mins", status: "Away" }
];

const MOCK_FAQS = [
  { title: "Passport Photo Size Guidelines", views: "15.4k views", category: "Documents" },
  { title: "Visa Fee Refund Eligibility Policy", views: "12.2k views", category: "Payments" },
  { title: "Embassy Appointment Slot Allocation Rules", views: "9.8k views", category: "Appointments" },
  { title: "Document Translation Requirements", views: "8.1k views", category: "Documents" },
  { title: "Track Processing Status Online", views: "18.6k views", category: "Tracking" }
];

export default function SupportManagement() {
  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [refId, setRefId] = useState("");
  const [category, setCategory] = useState("Payment Issue");
  const [priority, setPriority] = useState<TicketRecord["priority"]>("High");
  const [description, setDescription] = useState("");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    triggerToast(`Support ticket for '${subject}' created and assigned.`);
    setSubject("");
    setEmail("");
    setRefId("");
    setDescription("");
    setShowCreateModal(false);
  };

  const handleExportLogs = () => {
    triggerToast("Exported support tickets log to CSV.");
  };

  const handleLiveChat = () => {
    triggerToast("Opened Live Chat Console with active queue.");
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
            <LifeBuoy size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Customer Support & Help Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Support
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Manage customer support tickets, live helpdesk queues, SLAs, escalation protocols, and FAQs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLiveChat}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs backdrop-blur-md transition cursor-pointer flex items-center gap-1.5 border border-white/20"
          >
            <MessageCircle size={15} /> Live Chat Console
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <PlusCircle size={15} /> Create Support Ticket
          </button>
        </div>
      </div>

      {/* TOP METRICS DASHBOARD (7 CARDS MATCHING WIREFRAME) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Open Tickets</span>
          <div className="text-2xl font-black text-slate-900 font-mono">124</div>
          <span className="text-[10px] text-amber-600 font-bold">In Help Queue</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Resolved Today</span>
          <div className="text-2xl font-black text-slate-900 font-mono">1,840</div>
          <span className="text-[10px] text-emerald-600 font-bold">Closed Issues</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Pending Escalations</span>
          <div className="text-2xl font-black text-slate-900 font-mono">18</div>
          <span className="text-[10px] text-red-600 font-bold">Urgent Priority</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Avg Response</span>
          <div className="text-xl font-black text-slate-900 font-mono">12 mins</div>
          <span className="text-[10px] text-blue-600 font-bold">Fast SLA</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Customer CSAT</span>
          <div className="text-xl font-black text-slate-900 font-mono">4.8 / 5.0</div>
          <span className="text-[10px] text-purple-600 font-bold">High Satisfaction</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">First Resolution</span>
          <div className="text-xl font-black text-slate-900 font-mono">94.2%</div>
          <span className="text-[10px] text-teal-600 font-bold">One Contact Solve</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Support Agents</span>
          <div className="text-xl font-black text-slate-900 font-mono">16 Online 🟢</div>
          <span className="text-[10px] text-emerald-600 font-bold">Active Staff</span>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT 2 COLUMNS: TICKETS TABLE, KNOWLEDGE BASE & AGENT PERFORMANCE */}
        <div className="lg:col-span-2 space-y-6">
          {/* SUPPORT TICKETS TABLE */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                <LifeBuoy size={16} className="text-[#2563EB]" /> Live Helpdesk Support Tickets
              </h3>
              <div className="flex items-center gap-2">
                <div className="relative w-44">
                  <Search size={13} className="absolute left-2.5 top-2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[11px] pl-8 pr-2 py-1 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                    <th className="pb-2">Ticket ID</th>
                    <th className="pb-2">User</th>
                    <th className="pb-2">Subject & Category</th>
                    <th className="pb-2 text-center">Priority</th>
                    <th className="pb-2 text-center">Assigned Agent</th>
                    <th className="pb-2 text-center">Status</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {MOCK_TICKETS.map((t) => (
                    <tr key={t.ticketId} className="hover:bg-slate-50">
                      <td className="py-2.5 font-mono font-bold text-slate-900">{t.ticketId}</td>
                      <td className="py-2.5 font-bold text-slate-900">{t.user}</td>
                      <td className="py-2.5">
                        <span className="font-bold text-slate-900 block">{t.subject}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{t.category}</span>
                      </td>
                      <td className="py-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.priority === "Urgent" ? "bg-red-50 text-red-700" :
                          t.priority === "High" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-700"
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-2.5 text-center font-semibold text-blue-700">{t.assignedAgent}</td>
                      <td className="py-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === "Open" ? "bg-amber-50 text-amber-700" :
                          t.status === "In Progress" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right space-x-1">
                        <button
                          onClick={() => triggerToast(`Viewing conversation for ${t.ticketId}`)}
                          className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#2563EB] rounded-lg transition"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => triggerToast(`Replying to ${t.user}`)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition"
                        >
                          <MessageSquare size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AGENT PERFORMANCE LEADERBOARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <Award size={16} className="text-emerald-600" /> Support Team Performance Leaderboard
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                    <th className="pb-2">Team Member</th>
                    <th className="pb-2 text-center">Assigned</th>
                    <th className="pb-2 text-center">Resolved Today</th>
                    <th className="pb-2 text-center">CSAT Rating</th>
                    <th className="pb-2 text-center">Avg Time</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {MOCK_AGENTS.map((a, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 font-bold text-slate-900">{a.agentName}</td>
                      <td className="py-2 text-center font-mono font-bold text-slate-900">{a.assignedCount}</td>
                      <td className="py-2 text-center font-mono font-bold text-emerald-700">{a.resolvedCount}</td>
                      <td className="py-2 text-center font-mono font-bold text-purple-700">{a.csat}</td>
                      <td className="py-2 text-center font-mono text-[11px] text-slate-600">{a.avgTime}</td>
                      <td className="py-2 text-right font-bold text-[10px] text-emerald-700">🟢 {a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* KNOWLEDGE BASE CATALOG */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <BookOpen size={16} className="text-purple-600" /> Knowledge Base & FAQ Articles Catalog
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {MOCK_FAQS.map((faq, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex justify-between items-center">
                  <div>
                    <strong className="text-slate-900 font-bold block text-xs">{faq.title}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">{faq.views} &bull; {faq.category}</span>
                  </div>
                  <button
                    onClick={() => triggerToast(`Opened FAQ: ${faq.title}`)}
                    className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-[#2563EB] transition"
                  >
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIONS, CATALOG & WORKFLOW */}
        <div className="space-y-6">
          {/* QUICK CONTROL ACTIONS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <Zap size={16} className="text-[#2563EB]" /> Support Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <PlusCircle size={14} /> Create Support Ticket
              </button>
              <button
                onClick={handleLiveChat}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageCircle size={14} /> Launch Live Helpdesk
              </button>
              <button
                onClick={handleExportLogs}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Download size={14} /> Export Support Logs
              </button>
            </div>
          </div>

          {/* DASHBOARD LAYOUT CATALOG */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <Layers size={16} className="text-[#2563EB]" /> Dashboard Layout Catalog
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {LAYOUT_CATALOG.map((item, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* SUPPORT WORKFLOW */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
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

          {/* PROFESSIONAL FEATURES CATALOG */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <Sparkles size={16} className="text-purple-600" /> Professional Features Catalog
            </h3>
            <div className="space-y-1.5 text-xs">
              {SUPPORT_FEATURES.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RECOMMENDATION BOX */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-blue-100 pb-2">
              <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Recommendation
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              The Support & Help Desk page manages customer support tickets, live helpdesk queues, SLAs, escalation protocols, agent performance metrics, and knowledge base articles. Ensure urgent payment and embassy delay tickets are prioritized to maintain high customer satisfaction.
            </p>
          </div>
        </div>
      </div>

      {/* CREATE TICKET MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 font-outfit flex items-center gap-2">
                <PlusCircle size={16} className="text-[#2563EB]" /> Create Support Ticket
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Ticket Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Payment Failed for Schengen Application"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Customer Email</label>
                <input
                  type="email"
                  placeholder="customer@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                >
                  <option value="Urgent">🔴 Urgent</option>
                  <option value="High">🟠 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide ticket details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs p-3 rounded-xl focus:outline-none font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition shadow-md"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
