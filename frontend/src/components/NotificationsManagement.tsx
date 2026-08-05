import React, { useState } from "react";
import {
  Bell,
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
  FileText,
  Mail,
  Smartphone,
  Radio,
  BarChart3,
  RotateCcw,
  ShieldAlert,
  Zap,
  ChevronRight
} from "lucide-react";

export interface NotificationRecord {
  id: string;
  ntfId: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  mobileNumber: string;
  userAddress: string;
  appId?: string;
  notificationType:
    | "Application Submitted"
    | "Document Verification"
    | "Payment Successful"
    | "Payment Failed"
    | "Appointment Scheduled"
    | "Visa Stamped"
    | "Security Alert"
    | "Announcement";
  channel: "Email" | "SMS" | "Push" | "System In-App";
  title: string;
  body: string;
  sentDate: string;
  sentDateTime: string;
  deliveryStatus: "Delivered" | "Pending" | "Failed";
  readStatus: "Read" | "Unread";
  readDateTime?: string;
  priority: "High" | "Normal" | "Urgent";
  gatewayInfo: string;
  retryCount: number;
  exceptionLog?: string;
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_NOTIFICATION_TABS = [
  "Overview",
  "Recipient Details",
  "Delivery Performance",
  "System Activity",
  "Activity Logs",
  "Notification History"
];

export const NOTIFICATION_WORKFLOW_STEPS = [
  "Notification Trigger Event Generated",
  "Template Processing",
  "Render Notification Message",
  "Send Channel (Email / SMS / Push)",
  "Delivery Status Tracked",
  "User Read Indicator"
];

export const NOTIFICATION_TYPES_CATALOG = [
  "Application Submitted",
  "Application Approved",
  "Application Rejected",
  "Document Verification Request",
  "Payment Successful",
  "Payment Pending",
  "Payment Failed",
  "Refund Processed",
  "Appointment Scheduled",
  "Appointment Reminder",
  "Appointment Cancelled",
  "Visa Stamped",
  "Visa Rejected",
  "Passport Receipt Acknowledged",
  "Passport Dispatched",
  "Password Reset",
  "Security Verification",
  "System / Maintenance Announcement"
];

const MOCK_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: "1",
    ntfId: "NTF-91001",
    recipientId: "USR-8801",
    recipientName: "Geeta Bisht",
    recipientEmail: "geeta@email.com",
    mobileNumber: "+91 9876543210",
    userAddress: "House 42, Sector 15, Chandigarh, India",
    appId: "APP-20261001",
    notificationType: "Document Verification",
    channel: "Email",
    title: "Document Verification Required for Canada Visa",
    body: "Please upload your updated bank statement for visa application APP-20261001.",
    sentDate: "04 Aug 2026",
    sentDateTime: "04 Aug 2026 10:10 AM",
    deliveryStatus: "Delivered",
    readStatus: "Read",
    readDateTime: "04 Aug 2026 10:15 AM",
    priority: "High",
    gatewayInfo: "AWS SES / SMTP Primary Gateway",
    retryCount: 0,
    actionNotes: [
      { id: "n1", author: "System", text: "Delivered cleanly to geeta@email.com.", date: "04 Aug 2026 10:10 AM" }
    ]
  },
  {
    id: "2",
    ntfId: "NTF-91002",
    recipientId: "USR-8802",
    recipientName: "Rahul Sharma",
    recipientEmail: "rahul@email.com",
    mobileNumber: "+91 9811223344",
    userAddress: "Flat 201, Sunshine Heights, Mumbai, India",
    appId: "APP-20261002",
    notificationType: "Payment Successful",
    channel: "SMS",
    title: "Payment Receipt Confirmed",
    body: "Payment of ₹18,500 received for Australia visa processing fee.",
    sentDate: "04 Aug 2026",
    sentDateTime: "04 Aug 2026 09:45 AM",
    deliveryStatus: "Delivered",
    readStatus: "Unread",
    priority: "Normal",
    gatewayInfo: "Twilio SMS Gateway",
    retryCount: 0,
    actionNotes: []
  },
  {
    id: "3",
    ntfId: "NTF-91003",
    recipientId: "USR-8803",
    recipientName: "Bikram Suman",
    recipientEmail: "bikram@email.com",
    mobileNumber: "+91 9988776655",
    userAddress: "3rd Cross, Indiranagar, Bengaluru, India",
    appId: "APP-20261003",
    notificationType: "Appointment Scheduled",
    channel: "Push",
    title: "Biometric Appointment Alert",
    body: "Your biometric appointment is scheduled for Aug 07 at Apollo Hospital.",
    sentDate: "03 Aug 2026",
    sentDateTime: "03 Aug 2026 02:30 PM",
    deliveryStatus: "Failed",
    readStatus: "Unread",
    priority: "Urgent",
    gatewayInfo: "Firebase Cloud Messaging (FCM)",
    retryCount: 3,
    exceptionLog: "ERR_PUSH_TOKEN_EXPIRED: User app device token invalid or uninstalled.",
    actionNotes: []
  }
];

export default function NotificationsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [channelFilter, setChannelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Records State
  const [notificationsList, setNotificationsList] = useState<NotificationRecord[]>(MOCK_NOTIFICATIONS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalNtf, setActiveModalNtf] = useState<NotificationRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredNotifications = notificationsList.filter((ntf) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      ntf.ntfId.toLowerCase().includes(q) ||
      ntf.recipientName.toLowerCase().includes(q) ||
      ntf.recipientEmail.toLowerCase().includes(q) ||
      (ntf.appId && ntf.appId.toLowerCase().includes(q)) ||
      ntf.title.toLowerCase().includes(q);

    const matchesType = typeFilter === "All" || ntf.notificationType === typeFilter;
    const matchesChannel = channelFilter === "All" || ntf.channel === channelFilter;
    const matchesStatus = statusFilter === "All" || ntf.deliveryStatus === statusFilter;

    return matchesQuery && matchesType && matchesChannel && matchesStatus;
  });

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handleResendNotification = (ntf: NotificationRecord) => {
    triggerToast(`Resent notification ${ntf.ntfId} via ${ntf.channel}!`);
  };

  const handleDeleteRecord = (ntf: NotificationRecord) => {
    setNotificationsList((prev) => prev.filter((n) => n.id !== ntf.id));
    triggerToast(`Notification record ${ntf.ntfId} deleted.`);
    if (activeModalNtf?.id === ntf.id) setActiveModalNtf(null);
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
            <Bell size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Multi-Channel Dispatch & Delivery Monitoring Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            All Notifications
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            View and manage all multi-channel system notifications.
          </p>
        </div>
      </div>

      {/* DASHBOARD STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Notifications</span>
            <div className="text-2xl font-black text-slate-900 font-mono">48,920</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Notification Vault</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Sent Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">1,240</div>
            <span className="text-[10px] text-emerald-600 font-bold">Daily Dispatch</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Delivered Rate</span>
            <div className="text-2xl font-black text-slate-900 font-mono">99.2%</div>
            <span className="text-[10px] text-blue-600 font-bold">Delivery Success</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Read / Open Rate</span>
            <div className="text-2xl font-black text-slate-900 font-mono">78.4%</div>
            <span className="text-[10px] text-purple-600 font-bold">Engagement Rate</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Failed Delivery</span>
            <div className="text-2xl font-black text-slate-900 font-mono">0.8%</div>
            <span className="text-[10px] text-red-600 font-bold">Bounce Rate</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Delivery Queue Size</span>
            <div className="text-2xl font-black text-slate-900 font-mono">12</div>
            <span className="text-[10px] text-amber-600 font-bold">Active Outbox</span>
          </div>
        </div>

        {/* RIGHT CARD: WORKFLOW & NOTIFICATION TYPES CATALOG (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Notification Workflow
            </h3>

            {/* WORKFLOW FLOW */}
            <div className="space-y-1 text-[11px] text-slate-700 font-medium mb-3">
              {NOTIFICATION_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[9px] shrink-0">
                    ▼
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* NOTIFICATION TYPES CATALOG */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px] font-semibold text-slate-600">
              <span className="text-slate-900 font-bold block mb-1">Supported Notification Types:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px] max-h-24 overflow-y-auto [scrollbar-width:thin]">
                {NOTIFICATION_TYPES_CATALOG.map((item, i) => (
                  <div key={i} className="flex items-center gap-1 text-slate-700">
                    <Check size={11} className="text-[#2563EB]" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search & Dispatch Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredNotifications.length} of {notificationsList.length} Notifications
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search (Ntf ID, Recipient, Email, App ID)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="NTF-91001, Geeta, APP-20261001..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* NOTIFICATION TYPE */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Notification Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Types</option>
              <option value="Document Verification">Document Verification</option>
              <option value="Payment Successful">Payment Successful</option>
              <option value="Appointment Scheduled">Appointment Scheduled</option>
            </select>
          </div>

          {/* CHANNEL */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Delivery Channel
            </label>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Channels</option>
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="Push">Push</option>
              <option value="System In-App">System In-App</option>
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Delivery Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Delivered">Delivered</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
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
            <span>Notifications Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => triggerToast(`Resending ${selectedIds.length} selected notifications.`)}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Bell size={14} /> Resend Selected
            </button>
            <button
              onClick={() => triggerToast(`Exporting log report for ${selectedIds.length} notifications.`)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Log Report
            </button>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS DATA TABLE (COLUMNS MATCH WIREFRAME EXACTLY) */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 font-mono">Notification ID</th>
                <th className="py-3.5 px-4">Recipient Name</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-4 font-mono">Sent Date</th>
                <th className="py-3.5 px-4">Delivery Status</th>
                <th className="py-3.5 px-4">Read Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Bell size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No notifications found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((ntf) => (
                  <tr key={ntf.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(ntf.id)}
                        onChange={() => handleToggleSelect(ntf.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {ntf.ntfId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {ntf.recipientName}
                      <span className="block text-[10px] text-slate-400 font-normal">{ntf.recipientEmail}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-purple-700">
                      {ntf.notificationType}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <span className="inline-flex items-center gap-1">
                        {ntf.channel === "Email" && <Mail size={13} className="text-blue-600" />}
                        {ntf.channel === "SMS" && <Smartphone size={13} className="text-emerald-600" />}
                        {ntf.channel === "Push" && <Radio size={13} className="text-purple-600" />}
                        {ntf.channel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {ntf.sentDate}
                    </td>
                    <td className="py-3.5 px-4">
                      {ntf.deliveryStatus === "Delivered" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                          🟢 Delivered
                        </span>
                      ) : ntf.deliveryStatus === "Failed" ? (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-red-200">
                          🔴 Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-amber-200">
                          🟡 Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {ntf.readStatus === "Read" ? (
                        <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-extrabold text-[10px]">🔵 Read</span>
                      ) : (
                        <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-extrabold text-[10px]">🟡 Unread</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setActiveModalNtf(ntf);
                            setModalTab("Overview");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Delivery Performance & Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleResendNotification(ntf)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Resend Notification"
                        >
                          <Bell size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(ntf)}
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
          <div>Showing 1–10 of 48,920 Notifications</div>
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
          <ShieldCheck size={16} className="text-[#2563EB]" /> Multi-Channel Dispatch Strategy
        </h3>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Features active: Multi-channel fallback rules (Email ➔ SMS ➔ Push), automated delivery retry queue, engagement tracking (Open/Click rates), template variable hydration, and compliance audit trail.
        </p>
      </div>

      {/* CENTERED POPUP DETAILS MODAL (6 RECOMMENDED TABS FROM WIREFRAME) */}
      {activeModalNtf && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                  <Bell size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      Notification {activeModalNtf.ntfId}
                    </h3>
                    <span className="font-mono text-xs font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700">
                      {activeModalNtf.channel.toUpperCase()} &bull; {activeModalNtf.deliveryStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Recipient: <strong className="text-blue-300">{activeModalNtf.recipientName}</strong> ({activeModalNtf.recipientEmail})</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalNtf(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {RECOMMENDED_NOTIFICATION_TABS.map((tab) => {
                const active = modalTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setModalTab(tab)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      active
                        ? "bg-[#2563EB] text-white shadow-sm"
                        : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200"
                    }`}
                  >
                    <span>{tab}</span>
                  </button>
                );
              })}
            </div>

            {/* MODAL BODY */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {/* TAB 1: OVERVIEW */}
              {modalTab === "Overview" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* OVERVIEW TILES */}
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-3">
                      Dispatch & Gateway Performance
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Notification ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalNtf.ntfId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Sent Timestamp</span>
                        <strong className="text-slate-900 font-mono font-bold">{activeModalNtf.sentDateTime}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Gateway Info</span>
                        <strong className="text-purple-700 font-bold">{activeModalNtf.gatewayInfo}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Retry Attempts</span>
                        <strong className="text-slate-900 font-bold">{activeModalNtf.retryCount} Attempts</strong>
                      </div>
                    </div>
                  </div>

                  {/* NOTIFICATION CONTENT CARD */}
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-2">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit">
                      {activeModalNtf.title}
                    </h4>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      "{activeModalNtf.body}"
                    </p>
                  </div>

                  {/* EXCEPTION LOG IF FAILED */}
                  {activeModalNtf.exceptionLog && (
                    <div className="bg-red-50/60 border border-red-200 rounded-3xl p-5 space-y-2">
                      <h4 className="text-xs font-extrabold text-red-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-600" /> Gateway Exception Log
                      </h4>
                      <p className="text-xs text-red-800 font-mono font-semibold">
                        {activeModalNtf.exceptionLog}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleResendNotification(activeModalNtf)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Bell size={15} /> Resend Notification
              </button>

              <button
                onClick={() => triggerToast(`Exported notification delivery report for ${activeModalNtf.ntfId}...`)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Download size={15} /> Export Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
