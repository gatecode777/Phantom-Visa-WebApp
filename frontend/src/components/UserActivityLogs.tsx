import React, { useState } from "react";
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Download,
  FileText,
  User,
  Bell,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X,
  Layers,
  AlertTriangle,
  Globe,
  Laptop,
  Smartphone,
  Shield,
  Key,
  CreditCard,
  Calendar,
  Lock,
  Archive,
  FileSpreadsheet,
  AlertCircle,
  MapPin,
  Terminal
} from "lucide-react";

export interface ActivityLogRecord {
  id: string;
  userName: string;
  userId: string;
  avatar: string;
  email: string;
  role: string;
  country: string;
  flag: string;
  activityType:
    | "User Login"
    | "Logout"
    | "Visa Application Submitted"
    | "Document Uploaded"
    | "Payment Completed"
    | "Appointment Booked"
    | "Profile Updated"
    | "Password Changed"
    | "Failed Login"
    | "Account Blocked";
  description: string;
  dateTime: string;
  ipAddress: string;
  browser: string;
  os: string;
  device: string;
  status: "Success" | "Failed";
  sessionId: string;
  location: string;
  remarks: string;
  referenceId: string;
}

const mockActivityLogs: ActivityLogRecord[] = [
  {
    id: "LOG-1001",
    userName: "Geeta Bisht",
    userId: "APP-1025",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    email: "geeta@email.com",
    role: "Applicant",
    country: "India",
    flag: "🇮🇳",
    activityType: "User Login",
    description: "Successful authentication via Email & Password with OTP 2FA",
    dateTime: "29 Jul 2026, 10:25 AM",
    ipAddress: "192.168.1.10",
    browser: "Chrome 126.0",
    os: "Windows 11",
    device: "Chrome / Windows",
    status: "Success",
    sessionId: "SES-88901234",
    location: "New Delhi, India",
    remarks: "2FA Verified successfully via SMS OTP",
    referenceId: "AUTH-99120"
  },
  {
    id: "LOG-1002",
    userName: "Rahul Sharma",
    userId: "APP-1026",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
    email: "rahul@email.com",
    role: "Applicant",
    country: "India",
    flag: "🇮🇳",
    activityType: "Visa Application Submitted",
    description: "Submitted Tourist Visa Subclass 600 application to embassy queue",
    dateTime: "29 Jul 2026, 10:20 AM",
    ipAddress: "192.168.1.12",
    browser: "Microsoft Edge 125.0",
    os: "Windows 10",
    device: "Edge / Windows",
    status: "Success",
    sessionId: "SES-77812390",
    location: "Mumbai, India",
    remarks: "Application form fully completed with 4 attached documents",
    referenceId: "APP-VISA-600-99"
  },
  {
    id: "LOG-1003",
    userName: "Maria Wilson",
    userId: "APP-1027",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256",
    email: "maria@email.com",
    role: "Applicant",
    country: "USA",
    flag: "🇺🇸",
    activityType: "Document Uploaded",
    description: "Uploaded Bank Statement PDF for financial proof verification",
    dateTime: "29 Jul 2026, 10:15 AM",
    ipAddress: "192.168.1.15",
    browser: "Mobile Safari 17.4",
    os: "iOS 17.5",
    device: "Safari / iPhone",
    status: "Failed",
    sessionId: "SES-66512389",
    location: "New York, USA",
    remarks: "Upload failed: File size exceeded maximum 10 MB limit",
    referenceId: "DOC-BANK-001"
  },
  {
    id: "LOG-1004",
    userName: "Vikram Malhotra",
    userId: "APP-1028",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
    email: "vikram@email.com",
    role: "Applicant",
    country: "India",
    flag: "🇮🇳",
    activityType: "Payment Completed",
    description: "Completed payment of ₹45,000 via NetBanking (Razorpay)",
    dateTime: "29 Jul 2026, 09:50 AM",
    ipAddress: "192.168.1.18",
    browser: "Firefox 127.0",
    os: "Windows 11",
    device: "Firefox / Windows",
    status: "Success",
    sessionId: "SES-55412378",
    location: "Bengaluru, India",
    remarks: "Payment gateway transaction ID TXN-99881273 confirmed",
    referenceId: "TXN-99881273"
  },
  {
    id: "LOG-1005",
    userName: "Ananya Roy",
    userId: "APP-1029",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
    email: "ananya@email.com",
    role: "Applicant",
    country: "India",
    flag: "🇮🇳",
    activityType: "Failed Login",
    description: "Invalid password attempt for account ananya@email.com",
    dateTime: "29 Jul 2026, 09:30 AM",
    ipAddress: "192.168.1.25",
    browser: "Chrome 126.0",
    os: "macOS 14.5",
    device: "Chrome / Mac",
    status: "Failed",
    sessionId: "SES-44312367",
    location: "Kolkata, India",
    remarks: "Attempt 2 of 5. Security notification email sent.",
    referenceId: "FAIL-AUTH-002"
  }
];

export default function UserActivityLogs() {
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [activityFilter, setActivityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Selection States for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Selected Log Record for Detail Modal State
  const [viewLog, setViewLog] = useState<ActivityLogRecord | null>(null);
  const [modalTab, setModalTab] = useState<
    "userInfo" | "activityInfo" | "additionalInfo" | "activityTypes" | "quickActions" | "bulkActions"
  >("userInfo");

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Activity Logs List State
  const [logs, setLogs] = useState<ActivityLogRecord[]>(mockActivityLogs);

  // Filter Logic
  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.ipAddress.includes(searchTerm) ||
      l.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesActivity = activityFilter === "All" || l.activityType === activityFilter;
    const matchesStatus = statusFilter === "All" || l.status === statusFilter;

    return matchesSearch && matchesActivity && matchesStatus;
  });

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredLogs.map((l) => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    if (selectedIds.length === 0) {
      triggerToast("Please select at least one activity log entry first.");
      return;
    }

    if (action === "archive") {
      setLogs((prev) => prev.filter((l) => !selectedIds.includes(l.id)));
      triggerToast(`Archived ${selectedIds.length} selected activity log(s).`);
      setSelectedIds([]);
    } else {
      triggerToast(`Exported '${action}' report for ${selectedIds.length} selected log(s).`);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setActivityFilter("All");
    setStatusFilter("All");
    setFromDate("");
    setToDate("");
    triggerToast("Search & Filter inputs reset to default.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-800">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0E1A2C] border border-[#2563EB]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-mono text-[#2563EB] mb-1">
          <Activity size={14} />
          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 font-bold">
            User Activity Logs
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">User Activity Logs</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Monitor applicant activities, login history, application updates, document uploads, and account actions across the VisaOS platform.
        </p>
      </div>

      {/* STATISTICS CARDS (4 CARDS GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Activities */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Activities</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Activity size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">25,684</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-2">
            <ArrowUpRight size={13} />
            <span>+18.4% vs last month</span>
          </div>
        </div>

        {/* Card 2: Today's Activities */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Today's Activities</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Clock size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">342</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-indigo-600 font-semibold mt-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span>Live Audit Stream</span>
          </div>
        </div>

        {/* Card 3: Active Users */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Users</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <User size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">128</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-2">
            <CheckCircle2 size={13} />
            <span>Active Live Sessions</span>
          </div>
        </div>

        {/* Card 4: Failed Login Attempts */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Failed Login Attempts</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <AlertTriangle size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">14</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-red-600 font-semibold mt-2">
            <Shield size={13} />
            <span>Security Flagged</span>
          </div>
        </div>
      </div>

      {/* SEARCH & MULTI-CRITERIA FILTERS BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" />
            <span>Search & Filter Activity Logs</span>
          </h3>
          <button
            onClick={handleResetFilters}
            className="text-xs text-slate-500 hover:text-[#2563EB] font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <RefreshCw size={12} /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* Filter 1: Search Query */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Search Keyword
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Name, User ID, Email, IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Filter 2: Activity Type */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Activity Type
            </label>
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
            >
              <option value="All">All Activities</option>
              <option value="User Login">User Login</option>
              <option value="Logout">Logout</option>
              <option value="Visa Application Submitted">Visa Application</option>
              <option value="Document Uploaded">Document Upload</option>
              <option value="Payment Completed">Payment</option>
              <option value="Profile Updated">Profile Update</option>
              <option value="Appointment Booked">Appointment</option>
              <option value="Password Changed">Password Change</option>
              <option value="Failed Login">Failed Login</option>
            </select>
          </div>

          {/* Filter 3: Status */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Success">✅ Success Only</option>
              <option value="Failed">❌ Failed Only</option>
            </select>
          </div>

          {/* Filter 4: From Date */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
            />
          </div>

          {/* Filter 5: To Date */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            onClick={() => triggerToast(`Filters applied: ${filteredLogs.length} activity log(s) found`)}
            className="px-5 py-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-bold rounded-xl shadow-md shadow-[#2563EB]/20 transition cursor-pointer flex items-center gap-1.5"
          >
            <Filter size={14} /> Apply Filters
          </button>
        </div>
      </div>

      {/* CONTEXTUAL BULK ACTIONS TOOLBAR */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs text-[#2563EB] font-bold">
            <CheckCircle2 size={16} />
            <span>{selectedIds.length} Activity Log(s) Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => handleBulkAction("csv")}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet size={14} /> Export CSV
            </button>
            <button
              onClick={() => handleBulkAction("pdf")}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileText size={14} /> Export PDF
            </button>
            <button
              onClick={() => handleBulkAction("archive")}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Archive size={14} /> Archive Logs
            </button>
          </div>
        </div>
      )}

      {/* ACTIVITY LOG TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length > 0 && selectedIds.length === filteredLogs.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Log ID</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Activity</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Device</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <AlertCircle size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-bold">No activity logs match your filter criteria.</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-2 text-xs text-[#2563EB] font-semibold underline cursor-pointer"
                    >
                      Clear search filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      selectedIds.includes(log.id) ? "bg-blue-50/60" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(log.id)}
                        onChange={() => handleToggleSelect(log.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {log.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={log.avatar}
                          alt={log.userName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-extrabold text-slate-900 block">{log.userName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{log.userId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {log.activityType}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{log.dateTime}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono font-bold">{log.ipAddress}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{log.device}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border inline-flex items-center gap-1.5 ${
                          log.status === "Success"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {log.status === "Success" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setViewLog(log);
                          setModalTab("userInfo");
                        }}
                        title="View Log Details"
                        className="p-1.5 hover:bg-blue-100 text-slate-600 hover:text-[#2563EB] rounded-lg transition cursor-pointer"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900">1–{filteredLogs.length}</strong> of{" "}
            <strong className="text-slate-900">342 Today's Activity Logs</strong>
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50 cursor-pointer flex items-center gap-1 font-semibold">
              <ChevronLeft size={14} /> Previous
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#2563EB] text-white font-bold cursor-pointer">
              1
            </button>
            <button className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer">
              2
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer flex items-center gap-1 font-semibold">
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVITY DETAILS CENTERED VIEW MODAL (6 SECTIONS) */}
      {viewLog && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewLog(null);
          }}
          className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-slate-800">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-5 flex items-center justify-between border-b border-blue-700 shrink-0 rounded-t-3xl shadow-md">
              <div className="flex items-center gap-3.5">
                <img
                  src={viewLog.avatar}
                  alt={viewLog.userName}
                  className="w-13 h-13 rounded-full object-cover border-2 border-white/90 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-black text-white font-outfit tracking-wide">
                      {viewLog.userName}
                    </h2>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                        viewLog.status === "Success"
                          ? "bg-emerald-500/20 text-white border-white/30"
                          : "bg-red-500/30 text-white border-white/30"
                      }`}
                    >
                      {viewLog.status}
                    </span>
                  </div>
                  <p className="text-xs text-blue-100 font-mono flex items-center gap-2 mt-1">
                    <span>{viewLog.id}</span>
                    <span className="text-blue-300">•</span>
                    <span>{viewLog.userId}</span>
                    <span className="text-blue-300">•</span>
                    <span>{viewLog.activityType}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewLog(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer border border-white/20"
              >
                <X size={18} />
              </button>
            </div>

            {/* 6 Section Navigation Tabs */}
            <div className="bg-[#EEF2FF] border-b-2 border-blue-200 px-4 flex items-center gap-1.5 overflow-x-auto shrink-0 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-blue-100 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full">
              {[
                { id: "userInfo", label: "User Information", icon: User },
                { id: "activityInfo", label: "Activity Information", icon: Activity },
                { id: "additionalInfo", label: "Additional Information", icon: Terminal },
                { id: "activityTypes", label: "Activity Types", icon: Layers },
                { id: "quickActions", label: "Quick Actions", icon: Clock },
                { id: "bulkActions", label: "Bulk Actions", icon: Archive }
              ].map((tab) => {
                const IconComp = tab.icon;
                const isActive = modalTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setModalTab(tab.id as any)}
                    className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all duration-200 whitespace-nowrap cursor-pointer -mb-[2px] ${
                      isActive
                        ? "bg-[#2563EB] text-white font-extrabold rounded-t-xl shadow-md border-[#2563EB]"
                        : "border-transparent text-slate-700 hover:text-[#2563EB] hover:bg-white/80"
                    }`}
                  >
                    <IconComp size={15} className={isActive ? "text-white" : "text-[#2563EB]/70"} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/90 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#F1F5F9] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* 1. USER INFORMATION TAB */}
              {modalTab === "userInfo" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <User size={16} className="text-[#2563EB]" />
                      <span>User Information</span>
                    </h3>
                    <span className="text-[10px] font-mono text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 font-bold">
                      Audit User Profile
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        User Name
                      </span>
                      <strong className="text-slate-900 text-sm font-extrabold">
                        {viewLog.userName}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        User ID
                      </span>
                      <strong className="text-[#2563EB] font-mono text-sm font-extrabold">
                        {viewLog.userId}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Email Address
                      </span>
                      <strong className="text-[#2563EB] font-mono font-bold">
                        {viewLog.email}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Role
                      </span>
                      <strong className="text-slate-800 font-bold">
                        {viewLog.role}
                      </strong>
                    </div>

                    <div className="md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Country
                      </span>
                      <strong className="text-slate-900 font-extrabold flex items-center gap-2">
                        <span>{viewLog.flag}</span> {viewLog.country}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. ACTIVITY INFORMATION TAB */}
              {modalTab === "activityInfo" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Activity size={16} className="text-[#2563EB]" />
                      <span>Activity Information</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Activity Type
                      </span>
                      <strong className="text-slate-900 font-extrabold">
                        {viewLog.activityType}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Status
                      </span>
                      <strong className={viewLog.status === "Success" ? "text-emerald-600 font-bold" : "text-red-600 font-bold"}>
                        {viewLog.status}
                      </strong>
                    </div>

                    <div className="md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Activity Description
                      </span>
                      <p className="text-slate-800 font-semibold">
                        {viewLog.description}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Date & Time
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewLog.dateTime}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        IP Address
                      </span>
                      <strong className="text-[#2563EB] font-mono font-bold">
                        {viewLog.ipAddress}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Browser
                      </span>
                      <strong className="text-slate-800 font-bold">
                        {viewLog.browser}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Operating System
                      </span>
                      <strong className="text-slate-800 font-bold">
                        {viewLog.os}
                      </strong>
                    </div>

                    <div className="md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Device Format
                      </span>
                      <strong className="text-slate-800 font-bold">
                        {viewLog.device}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. ADDITIONAL INFORMATION TAB */}
              {modalTab === "additionalInfo" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Terminal size={16} className="text-[#2563EB]" />
                      <span>Additional Audit Information</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Session ID
                      </span>
                      <strong className="text-[#2563EB] font-mono font-bold">
                        {viewLog.sessionId}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Geo Location
                      </span>
                      <strong className="text-slate-800 font-bold flex items-center gap-1.5">
                        <MapPin size={13} className="text-red-500" />
                        <span>{viewLog.location}</span>
                      </strong>
                    </div>

                    <div className="md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Reference ID (Application/Payment)
                      </span>
                      <strong className="text-slate-900 font-mono text-sm font-extrabold">
                        {viewLog.referenceId}
                      </strong>
                    </div>

                    <div className="md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Remarks & System Notes
                      </span>
                      <p className="text-slate-700 font-medium">
                        {viewLog.remarks}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. ACTIVITY TYPES TAB (FILTER SHORTCUTS) */}
              {modalTab === "activityTypes" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Layers size={16} className="text-[#2563EB]" />
                      <span>Activity Types Catalogue & Shortcuts</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {[
                      { type: "User Login", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
                      { type: "Logout", icon: Clock, color: "text-slate-600 bg-slate-50 border-slate-200" },
                      { type: "Visa Application Submitted", icon: FileText, color: "text-blue-600 bg-blue-50 border-blue-200" },
                      { type: "Document Uploaded", icon: FileText, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
                      { type: "Payment Completed", icon: CreditCard, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
                      { type: "Appointment Booked", icon: Calendar, color: "text-purple-600 bg-purple-50 border-purple-200" },
                      { type: "Profile Updated", icon: User, color: "text-teal-600 bg-teal-50 border-teal-200" },
                      { type: "Password Changed", icon: Key, color: "text-amber-600 bg-amber-50 border-amber-200" },
                      { type: "Failed Login", icon: XCircle, color: "text-red-600 bg-red-50 border-red-200" },
                      { type: "Account Blocked", icon: Lock, color: "text-red-700 bg-red-50 border-red-200" }
                    ].map((item) => {
                      const IconC = item.icon;

                      return (
                        <button
                          key={item.type}
                          onClick={() => {
                            setActivityFilter(item.type);
                            setViewLog(null);
                            triggerToast(`Filtered logs for: ${item.type}`);
                          }}
                          className={`p-3.5 rounded-xl border flex items-center justify-between font-bold cursor-pointer transition hover:scale-[1.01] ${item.color}`}
                        >
                          <span className="flex items-center gap-2">
                            <IconC size={16} />
                            <span>{item.type}</span>
                          </span>
                          <span className="text-[10px] font-mono uppercase font-extrabold">Filter</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 5. QUICK ACTIONS TAB */}
              {modalTab === "quickActions" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Clock size={16} className="text-[#2563EB]" />
                      <span>Quick Operational Actions</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <button
                      onClick={() => triggerToast(`Viewing details for ${viewLog.id}`)}
                      className="p-3.5 bg-white hover:bg-[#EEF2FF] border border-slate-200 hover:border-[#2563EB]/50 rounded-xl font-bold text-[#2563EB] flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>View Details</span>
                      <Eye size={15} />
                    </button>

                    <button
                      onClick={() => triggerToast(`Log exported for ${viewLog.id}`)}
                      className="p-3.5 bg-white hover:bg-[#EEF2FF] border border-slate-200 hover:border-[#2563EB]/50 rounded-xl font-bold text-[#2563EB] flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Export Log</span>
                      <Download size={15} />
                    </button>

                    <button
                      onClick={() => triggerToast(`Security alert sent to ${viewLog.email}`)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Send Security Alert</span>
                      <Bell size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => triggerToast(`Block user account triggered for ${viewLog.userName}`)}
                      className="p-3.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Block User Account</span>
                      <Lock size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* 6. BULK ACTIONS TAB */}
              {modalTab === "bulkActions" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Archive size={16} className="text-[#2563EB]" />
                      <span>Bulk Log Operational Actions</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <button
                      onClick={() => handleSelectAll(true)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Select All Logs</span>
                      <CheckCircle2 size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => handleBulkAction("csv")}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Export CSV</span>
                      <FileSpreadsheet size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => handleBulkAction("pdf")}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Export PDF</span>
                      <FileText size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => handleBulkAction("archive")}
                      className="p-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Archive Logs</span>
                      <Archive size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
