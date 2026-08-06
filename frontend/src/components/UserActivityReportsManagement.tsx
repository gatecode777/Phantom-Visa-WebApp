import React, { useState } from "react";
import {
  Users,
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
  MessageSquare,
  Tag,
  CheckSquare,
  AlertTriangle,
  FileSpreadsheet,
  PieChart,
  Calendar,
  DollarSign,
  Briefcase,
  Layers,
  Zap,
  Award,
  BarChart3,
  ShieldAlert,
  Smartphone,
  Monitor,
  Activity
} from "lucide-react";

export interface UserActivityRow {
  userId: string;
  userName: string;
  userType: string;
  dateTime: string;
  activity: string;
  device: string;
  ipAddress: string;
  status: string;
}

export const USER_ACTIVITY_WORKFLOW = [
  "User Actions Logged",
  "Activity Categorized",
  "Security Metrics Analyzed",
  "Session Duration Tracked",
  "Report Generated",
  "Export Report / Summary"
];

export const USER_ACTIVITY_FEATURES = [
  "Real-time Activity Tracking",
  "User Engagement Metrics",
  "Session Duration Tracking",
  "Device & Browser Analytics",
  "Security Action Audit Logs",
  "Suspicious Activity Monitoring",
  "User Behavior Profiling",
  "Multi-format PDF / CSV Export",
  "Interactive Visualizations",
  "Full Audit Trail Log"
];

const MOCK_USER_ACTIVITIES: UserActivityRow[] = [
  { userId: "USR-1001", userName: "Geeta Sharma", userType: "Applicant", dateTime: "May 12, 2026 10:15 AM", activity: "Application Submitted", device: "Mobile (iOS)", ipAddress: "192.168.1.10", status: "Success" },
  { userId: "USR-1002", userName: "Priya Verma", userType: "Agent", dateTime: "May 12, 2026 10:05 AM", activity: "Document Uploaded", device: "Desktop (Chrome)", ipAddress: "192.168.1.42", status: "Success" },
  { userId: "USR-1003", userName: "Rohan Singh", userType: "Applicant", dateTime: "May 12, 2026 09:50 AM", activity: "Payment Completed", device: "Mobile (Android)", ipAddress: "192.168.1.88", status: "Success" },
  { userId: "USR-1004", userName: "Amit Patel", userType: "Admin", dateTime: "May 12, 2026 09:30 AM", activity: "Role Permissions Updated", device: "Desktop (Mac)", ipAddress: "192.168.1.102", status: "Success" },
  { userId: "USR-1005", userName: "Rahul Gupta", userType: "Applicant", dateTime: "May 12, 2026 09:10 AM", activity: "Failed Login Attempt", device: "Desktop (Windows)", ipAddress: "203.0.113.45", status: "Failed" }
];

export default function UserActivityReportsManagement() {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("All");
  const [activityTypeFilter, setActivityTypeFilter] = useState("All");
  const [deviceFilter, setDeviceFilter] = useState("All");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [reportFormat, setReportFormat] = useState("PDF");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredLogs = MOCK_USER_ACTIVITIES.filter((log) => {
    const q = searchQuery.toLowerCase();
    return (
      log.userId.toLowerCase().includes(q) ||
      log.userName.toLowerCase().includes(q) ||
      log.activity.toLowerCase().includes(q) ||
      log.ipAddress.toLowerCase().includes(q)
    );
  });

  const handleGenerateReport = () => {
    triggerToast(`Generated User Activity Report for ${userTypeFilter} (${dateRange}).`);
  };

  const handleExportFormat = (fmt: string) => {
    triggerToast(`Exported user activity report in ${fmt} format.`);
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
            <Activity size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Dashboard Reports &bull; System Activity & Engagement Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            User Activity Reports
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Track user actions, login activity, system usage, and engagement across the platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportFormat("PDF")}
            className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Download size={15} /> Download PDF
          </button>
          <button
            onClick={() => handleExportFormat("Excel")}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <FileSpreadsheet size={15} /> Export Excel
          </button>
        </div>
      </div>

      {/* TOP METRICS DASHBOARD (8 CARDS MATCHING WIREFRAME EXACTLY) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-slate-500 block mb-1">Active Users</span>
          <div className="text-xl font-black text-slate-900 font-mono">18,450</div>
          <span className="text-[9px] text-[#2563EB] font-bold">Monthly Active</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-emerald-600 block mb-1">Daily Active</span>
          <div className="text-xl font-black text-slate-900 font-mono">3,240</div>
          <span className="text-[9px] text-emerald-600 font-bold">DAU Metric</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-blue-600 block mb-1">New Signups</span>
          <div className="text-xl font-black text-slate-900 font-mono">1,120</div>
          <span className="text-[9px] text-blue-600 font-bold">Last 30 Days</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-teal-600 block mb-1">Total Logins</span>
          <div className="text-xl font-black text-slate-900 font-mono">48,920</div>
          <span className="text-[9px] text-teal-600 font-bold">User Sessions</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-purple-600 block mb-1">Avg Session</span>
          <div className="text-xl font-black text-slate-900 font-mono">18.4 Mins</div>
          <span className="text-[9px] text-purple-600 font-bold">Duration</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-amber-600 block mb-1">Top Role</span>
          <div className="text-xl font-black text-slate-900 font-mono">Applicant</div>
          <span className="text-[9px] text-amber-600 font-bold">Most Active</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-indigo-600 block mb-1">Actions Logged</span>
          <div className="text-xl font-black text-slate-900 font-mono">124.5K</div>
          <span className="text-[9px] text-indigo-600 font-bold">Audit Trail</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-red-600 block mb-1">Failed Logins</span>
          <div className="text-xl font-black text-slate-900 font-mono">28</div>
          <span className="text-[9px] text-red-600 font-bold">Security Alerts</span>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search & User Activity Filters
          </h3>
          <button
            onClick={handleGenerateReport}
            className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <BarChart3 size={15} /> Generate Report
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search (User ID, Name, IP, Activity)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="USR-1001, Geeta, 192.168..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* USER TYPE */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              User Type / Role
            </label>
            <select
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All User Roles</option>
              <option value="Applicant">Applicant</option>
              <option value="Agent">Agent</option>
              <option value="Admin">Admin</option>
              <option value="Officer">Officer</option>
            </select>
          </div>

          {/* ACTIVITY TYPE */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Activity Type
            </label>
            <select
              value={activityTypeFilter}
              onChange={(e) => setActivityTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Activities</option>
              <option value="Account Created">Account Created</option>
              <option value="Login">Login</option>
              <option value="Logout">Logout</option>
              <option value="Form Saved">Form Saved</option>
              <option value="Document Uploaded">Document Uploaded</option>
              <option value="Payment Made">Payment Made</option>
              <option value="Support Request">Support Request</option>
            </select>
          </div>

          {/* DEVICE / BROWSER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Device / Browser
            </label>
            <select
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Devices</option>
              <option value="Mobile">Mobile (iOS / Android)</option>
              <option value="Desktop">Desktop (Chrome / Safari)</option>
              <option value="Tablet">Tablet</option>
            </select>
          </div>

          {/* DATE RANGE */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Month">This Month</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* CHARTS & SECURITY AUDIT SECTION (MATCHING WIREFRAME) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* SECURITY & ACTIVITY INSIGHTS */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase font-outfit flex items-center gap-1.5">
                <ShieldAlert size={15} className="text-red-600" /> Security Audit Insights
              </h4>
              <span className="text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono font-bold">Threat Monitor</span>
            </div>
            <div className="space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex justify-between items-center bg-red-50/60 p-2 rounded-xl border border-red-200">
                <span>Failed Login Attempts:</span>
                <strong className="font-bold text-red-700">28 Cases</strong>
              </div>
              <div className="flex justify-between items-center bg-amber-50/60 p-2 rounded-xl border border-amber-200">
                <span>Suspicious IP Addresses:</span>
                <strong className="font-bold text-amber-700">3 Flagged</strong>
              </div>
              <div className="flex justify-between items-center bg-blue-50/60 p-2 rounded-xl border border-blue-200">
                <span>Password Reset Requests:</span>
                <strong className="font-bold text-blue-700">142 Requests</strong>
              </div>
              <div className="flex justify-between items-center bg-purple-50/60 p-2 rounded-xl border border-purple-200">
                <span>Unrecognized Device Logins:</span>
                <strong className="font-bold text-purple-700">12 Logins</strong>
              </div>
            </div>
          </div>
        </div>

        {/* USER ACTIVITY DATA TABLE */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
            <Activity size={16} className="text-[#2563EB]" /> Live Activity Log Feed
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                  <th className="pb-2">User ID</th>
                  <th className="pb-2">User Name</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Date & Time</th>
                  <th className="pb-2">Action / Activity</th>
                  <th className="pb-2">Device</th>
                  <th className="pb-2">IP Address</th>
                  <th className="pb-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLogs.map((log) => (
                  <tr key={log.userId + log.dateTime} className="hover:bg-slate-50">
                    <td className="py-2 font-mono font-bold text-slate-900">{log.userId}</td>
                    <td className="py-2 font-bold text-slate-800">{log.userName}</td>
                    <td className="py-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {log.userType}
                      </span>
                    </td>
                    <td className="py-2 text-[11px] text-slate-500 font-mono">{log.dateTime}</td>
                    <td className="py-2 font-bold text-slate-900">{log.activity}</td>
                    <td className="py-2 text-slate-600 text-[11px]">{log.device}</td>
                    <td className="py-2 font-mono text-[11px] text-slate-500">{log.ipAddress}</td>
                    <td className="py-2 text-center font-bold">
                      {log.status === "Success" ? (
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">🟢 Success</span>
                      ) : (
                        <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded text-[10px]">🔴 Failed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* WORKFLOW & PROFESSIONAL FEATURES CATALOG (MATCHING WIREFRAME) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-[#2563EB]" /> Report Generation Workflow & Features
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <span className="font-bold text-slate-900 block mb-2">Workflow Pipeline:</span>
            <div className="space-y-1 text-slate-700">
              {USER_ACTIVITY_WORKFLOW.map((wf, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 font-bold text-[9px] flex items-center justify-center">▼</span>
                  <span>{wf}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="font-bold text-slate-900 block mb-2">Professional Features:</span>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              {USER_ACTIVITY_FEATURES.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1 text-slate-700">
                  <Check size={11} className="text-[#2563EB]" /> {feat}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PROFESSIONAL RECOMMENDATION BOX (FROM WIREFRAME) */}
      <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2 mb-6">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-blue-100 pb-2">
          <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Recommendation
        </h3>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          The User Activity Reports page provides comprehensive user interaction analytics. Track active user counts, daily logins, session durations, system feature usage, device breakdowns, security anomalies (failed logins, suspicious IPs), and export detailed user audit reports in PDF, Excel, and CSV formats.
        </p>
      </div>
    </div>
  );
}
