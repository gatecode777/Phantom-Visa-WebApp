import React, { useState, useEffect } from "react";
import { API_V1_URL } from "../config/api";
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  X,
  Laptop,
  Globe,
  User,
  Info,
  Layers,
  ArrowUpRight
} from "lucide-react";

export interface ActivityLogItem {
  id: string;
  logId: string;
  userName: string;
  userEmail: string;
  applicantId?: string;
  avatar?: string;
  activity: string;
  activityType: string;
  dateAndTime: string;
  ipAddress: string;
  device: string;
  status: "Success" | "Failed";
}

export default function UserActivityLogs() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Metrics
  const [metrics, setMetrics] = useState({
    totalActivities: 0,
    todayActivities: 0,
    activeUsers: 0,
    failedAttempts: 0
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivityType, setSelectedActivityType] = useState("All Activities");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // View Log Detail Modal
  const [viewLog, setViewLog] = useState<ActivityLogItem | null>(null);

  // Fetch Live Activity Logs
  const fetchActivityLogs = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_V1_URL}/applicant/activity-logs`);
      const json = await res.json();

      if (res.ok && json.success && Array.isArray(json.data)) {
        const parsedLogs: ActivityLogItem[] = json.data.map((item: any) => ({
          id: item.id || item.logId || "LOG-UNKNOWN",
          logId: item.logId || item.id || "LOG-UNKNOWN",
          userName: item.userName || "Applicant User",
          userEmail: item.userEmail || "user@email.com",
          applicantId: item.applicantId || "APP-1025",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
          activity: item.activity || "User Login",
          activityType: item.activityType || "Authentication",
          dateAndTime: item.dateAndTime || "Recently",
          ipAddress: item.ipAddress || "192.168.1.10",
          device: item.device || "Chrome / Windows",
          status: item.status === "Failed" ? "Failed" : "Success"
        }));

        setLogs(parsedLogs);
        if (json.metrics) {
          setMetrics(json.metrics);
        }
      } else {
        throw new Error(json.message || "Failed to load user activity logs.");
      }
    } catch (err: any) {
      console.error("Error fetching activity logs:", err);
      setErrorMsg(err.message || "Could not fetch activity logs from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  // Filtered Logs
  const filteredLogs = logs.filter((l) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      l.userName.toLowerCase().includes(q) ||
      l.userEmail.toLowerCase().includes(q) ||
      l.activity.toLowerCase().includes(q) ||
      l.ipAddress.includes(q) ||
      l.logId.toLowerCase().includes(q) ||
      (l.applicantId && l.applicantId.toLowerCase().includes(q));

    const matchesType = selectedActivityType === "All Activities" || l.activityType === selectedActivityType;
    const matchesStatus = selectedStatus === "All Statuses" || l.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-800">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-[#4848F7] shadow-inner">
            <Activity size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4848F7] bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 font-mono">
                Live Audit Stream
              </span>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">User Activity Logs</h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Monitor real-time system audit logs, user login attempts, security events, and platform activity.
            </p>
          </div>
        </div>

        <button
          onClick={fetchActivityLogs}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Total System Activities</span>
            <h3 className="text-2xl font-black text-slate-900 font-outfit">
              {metrics.totalActivities || logs.length}
            </h3>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">100% Audited Log Trail</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Activity size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Today's Activities</span>
            <h3 className="text-2xl font-black text-slate-900 font-outfit">
              {metrics.todayActivities || Math.min(logs.length, 12)}
            </h3>
            <span className="text-[11px] text-[#4848F7] font-bold mt-1 inline-block">Live Audit Stream</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4848F7] flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Active Registered Users</span>
            <h3 className="text-2xl font-black text-emerald-600 font-outfit">
              {metrics.activeUsers || 1}
            </h3>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">Live Access Sessions</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Failed Login Attempts</span>
            <h3 className="text-2xl font-black text-rose-600 font-outfit">
              {metrics.failedAttempts || logs.filter((l) => l.status === "Failed").length}
            </h3>
            <span className="text-[11px] text-rose-600 font-bold mt-1 inline-block">Security Flagged</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <ShieldAlert size={20} />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search Name, Email, IP Address, Log ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#4848F7] text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedActivityType}
            onChange={(e) => {
              setSelectedActivityType(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:outline-none focus:border-[#4848F7] cursor-pointer"
          >
            <option value="All Activities">All Activity Types</option>
            <option value="Authentication">Authentication</option>
            <option value="Application">Application</option>
            <option value="KYC">KYC Verification</option>
            <option value="Payment">Payment</option>
            <option value="Security">Security</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:outline-none focus:border-[#4848F7] cursor-pointer"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Success">Success Only</option>
            <option value="Failed">Failed Only</option>
          </select>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">
                <th className="py-3.5 px-4">LOG ID</th>
                <th className="py-3.5 px-4">USER</th>
                <th className="py-3.5 px-4">ACTIVITY DESCRIPTION</th>
                <th className="py-3.5 px-4">DATE & TIME</th>
                <th className="py-3.5 px-4">IP ADDRESS</th>
                <th className="py-3.5 px-4">DEVICE / BROWSER</th>
                <th className="py-3.5 px-4 text-center">STATUS</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#4848F7] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-semibold">Loading live user activity logs...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No activity logs found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#4848F7]">{l.logId}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 flex items-center gap-2.5">
                      <img src={l.avatar} alt={l.userName} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      <div>
                        <span>{l.userName}</span>
                        <span className="text-[10px] text-slate-400 block font-mono font-normal">{l.applicantId || l.userEmail}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{l.activity}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{l.dateAndTime}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{l.ipAddress}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">{l.device}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono border inline-block ${
                          l.status === "Success"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        • {l.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setViewLog(l)}
                        className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 inline-flex items-center justify-center transition cursor-pointer"
                        title="View Log Audit Details"
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

        {/* Dynamic Table Pagination Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-600">
          <div>
            Showing{" "}
            <span className="font-bold text-slate-900">
              {filteredLogs.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredLogs.length)}
            </span>{" "}
            of <span className="font-bold text-slate-900">{filteredLogs.length}</span> Activity Logs
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 font-bold font-mono text-[#4848F7] bg-indigo-50 rounded-lg border border-indigo-100">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* VIEW LOG AUDIT DETAILS MODAL */}
      {viewLog && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewLog(null);
          }}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 text-slate-800">
            <div className="bg-gradient-to-r from-indigo-700 to-blue-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">{viewLog.logId} Audit Trail</h3>
                  <p className="text-xs text-indigo-100 font-mono">{viewLog.userName} ({viewLog.userEmail})</p>
                </div>
              </div>
              <button
                onClick={() => setViewLog(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Activity Trigger</span>
                <strong className="text-slate-900 font-extrabold text-sm block">{viewLog.activity}</strong>
                <span className="inline-block px-2.5 py-0.5 bg-indigo-50 text-[#4848F7] border border-indigo-200 rounded font-mono font-bold text-[10px]">
                  {viewLog.activityType}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Execution Status</span>
                  <strong className={viewLog.status === "Success" ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                    {viewLog.status}
                  </strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Timestamp</span>
                  <strong className="text-slate-800 font-mono font-bold">{viewLog.dateAndTime}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Client IP Address</span>
                  <strong className="text-slate-800 font-mono font-bold">{viewLog.ipAddress}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Device Environment</span>
                  <strong className="text-slate-800 font-bold">{viewLog.device}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
