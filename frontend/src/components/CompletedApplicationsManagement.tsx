import React, { useState } from "react";
import {
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  PlusCircle,
  Trash2,
  XCircle,
  AlertCircle,
  Globe,
  FileText,
  Download,
  Check,
  X,
  TrendingUp,
  Sparkles,
  User,
  CreditCard,
  Building,
  Calendar,
  Clock,
  Send,
  Printer,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Tag,
  CheckSquare,
  AlertTriangle,
  UserPlus,
  Mail,
  Phone,
  Truck,
  Archive,
  BarChart2,
  Award
} from "lucide-react";

export interface CompletedApplicationRecord {
  id: string;
  appId: string;
  applicantName: string;
  passportNumber: string;
  appliedBy: "Applicant" | "Agent";
  agentName?: string;
  country: string;
  category: string;
  visaType: string;
  visaNumber: string;
  completedDate: string;
  processingDuration: string; // e.g. "3.2 Days"
  deliveryStatus: "Delivered" | "In Transit" | "Ready for Delivery";
  courierTrackingNumber: string;
  deliveryMethod: "Express Courier (BlueDart)" | "Digital Delivery (Email)" | "In-Person Pickup";
  deliveryDate: string;
  approvedBy: string;
  visaIssueDate: string;
  totalAmountPaid: string;
  paymentMethod: string;
  transactionId: string;
  paymentDate: string;
  status: "Completed" | "Archived";
  // Detail fields
  dob?: string;
  gender?: string;
  nationality?: string;
  email?: string;
  phone?: string;
  visaValidity?: string;
  maxStayDuration?: string;
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_COMPLETED_TABS = [
  "Overview",
  "Applicant Details",
  "Visa Details",
  "Payment Details",
  "Issued Documents",
  "Delivery Information",
  "Timeline",
  "Activity Logs"
];

export const COMPLETION_WORKFLOW_STEPS = [
  "Application Submitted",
  "Document Verification",
  "Under Review",
  "Approved",
  "Visa Issued",
  "Delivered to Applicant",
  "Completed",
  "Archived"
];

export const COMPLETION_CERTIFICATES = [
  "Visa Issued Copy",
  "Approval Letter",
  "Payment Receipt",
  "Delivery Receipt",
  "Processing Summary"
];

export const DASHBOARD_REPORTS = [
  "Total Completed Applications",
  "Country-wise Completions",
  "Visa Category-wise Reports",
  "Monthly Completion Reports",
  "Agent-wise Performance",
  "Average Processing Time"
];

const MOCK_COMPLETED_APPLICATIONS: CompletedApplicationRecord[] = [
  {
    id: "1",
    appId: "APP-20261501",
    applicantName: "Geeta Bisht",
    passportNumber: "Z9876543",
    appliedBy: "Applicant",
    country: "Canada",
    category: "Tourist",
    visaType: "eVisa",
    visaNumber: "CAN-950921",
    completedDate: "01 Aug 2026",
    processingDuration: "3.0 Days",
    deliveryStatus: "Delivered",
    courierTrackingNumber: "BD-99182341",
    deliveryMethod: "Digital Delivery (Email)",
    deliveryDate: "01 Aug 2026",
    approvedBy: "Rahul Sharma",
    visaIssueDate: "01 Aug 2026",
    totalAmountPaid: "₹12,350",
    paymentMethod: "UPI / Credit Card",
    transactionId: "TXN-9988112",
    paymentDate: "28 Jul 2026",
    status: "Completed",
    dob: "1994-08-12",
    gender: "Female",
    nationality: "Indian",
    email: "geeta.bisht@gmail.com",
    phone: "+91 98123 45678",
    visaValidity: "10 Years Multiple Entry",
    maxStayDuration: "180 Days per Entry",
    actionNotes: [
      { id: "n1", author: "Rahul Sharma", text: "Visa generated and emailed to applicant. Delivery confirmed.", date: "01 Aug 2026 05:00 PM" }
    ]
  },
  {
    id: "2",
    appId: "APP-20261502",
    applicantName: "Rahul Sharma",
    passportNumber: "M1234567",
    appliedBy: "Agent",
    agentName: "Apex Travels",
    country: "Australia",
    category: "Student",
    visaType: "Sticker Visa",
    visaNumber: "AUS-329841",
    completedDate: "31 Jul 2026",
    processingDuration: "4.5 Days",
    deliveryStatus: "In Transit",
    courierTrackingNumber: "BD-77441199",
    deliveryMethod: "Express Courier (BlueDart)",
    deliveryDate: "Expected 02 Aug 2026",
    approvedBy: "David Thomas",
    visaIssueDate: "31 Jul 2026",
    totalAmountPaid: "₹18,930",
    paymentMethod: "Net Banking",
    transactionId: "TXN-7733441",
    paymentDate: "26 Jul 2026",
    status: "Completed",
    dob: "1999-02-15",
    gender: "Male",
    nationality: "Indian",
    email: "rahul.sharma@outlook.com",
    phone: "+91 91234 56789",
    visaValidity: "2 Years Student Grant",
    maxStayDuration: "Full Duration of Course",
    actionNotes: [
      { id: "n2", author: "David Thomas", text: "Sticker visa dispatched via BlueDart Express.", date: "31 Jul 2026 06:15 PM" }
    ]
  },
  {
    id: "3",
    appId: "APP-20261503",
    applicantName: "Bikram Suman",
    passportNumber: "K4567890",
    appliedBy: "Applicant",
    country: "UAE",
    category: "Business",
    visaType: "Multiple Entry",
    visaNumber: "UAE-874912",
    completedDate: "30 Jul 2026",
    processingDuration: "2.1 Days",
    deliveryStatus: "Delivered",
    courierTrackingNumber: "DHL-5544112",
    deliveryMethod: "Digital Delivery (Email)",
    deliveryDate: "30 Jul 2026",
    approvedBy: "Sarah Johnston",
    visaIssueDate: "30 Jul 2026",
    totalAmountPaid: "₹8,670",
    paymentMethod: "Debit Card",
    transactionId: "TXN-5511223",
    paymentDate: "28 Jul 2026",
    status: "Completed",
    dob: "1988-06-25",
    gender: "Male",
    nationality: "Indian",
    email: "bikram.s@techsolutions.com",
    phone: "+91 99887 76655",
    visaValidity: "30 Days Multiple Entry",
    maxStayDuration: "30 Days",
    actionNotes: [
      { id: "n3", author: "Sarah Johnston", text: "E-visa PDF delivered. Case successfully archived.", date: "30 Jul 2026 04:00 PM" }
    ]
  }
];

export default function CompletedApplicationsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [completionStatusFilter, setCompletionStatusFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [appliedByFilter, setAppliedByFilter] = useState("All");

  // Records State
  const [completedApps, setCompletedApps] = useState<CompletedApplicationRecord[]>(MOCK_COMPLETED_APPLICATIONS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalApp, setActiveModalApp] = useState<CompletedApplicationRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredApps = completedApps.filter((app) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      app.appId.toLowerCase().includes(q) ||
      app.applicantName.toLowerCase().includes(q) ||
      app.passportNumber.toLowerCase().includes(q) ||
      app.visaNumber.toLowerCase().includes(q) ||
      app.country.toLowerCase().includes(q);

    const matchesStatus = completionStatusFilter === "All" || app.deliveryStatus === completionStatusFilter || app.status === completionStatusFilter;
    const matchesCountry = countryFilter === "All" || app.country === countryFilter;
    const matchesCategory = categoryFilter === "All" || app.category === categoryFilter;
    const matchesAppliedBy = appliedByFilter === "All" || app.appliedBy === appliedByFilter;

    return matchesQuery && matchesStatus && matchesCountry && matchesCategory && matchesAppliedBy;
  });

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredApps.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApps.map((a) => a.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handleArchiveRecord = (app: CompletedApplicationRecord) => {
    setCompletedApps((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: "Archived" } : a))
    );
    triggerToast(`Completed record ${app.appId} moved to Archives!`);
    if (activeModalApp?.id === app.id) {
      setActiveModalApp((prev) => (prev ? { ...prev, status: "Archived" } : null));
    }
  };

  const handleDeleteRecord = (app: CompletedApplicationRecord) => {
    setCompletedApps((prev) => prev.filter((a) => a.id !== app.id));
    triggerToast(`Completed record ${app.appId} deleted.`);
    if (activeModalApp?.id === app.id) setActiveModalApp(null);
  };

  const handleBulkArchive = () => {
    setCompletedApps((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, status: "Archived" } : a))
    );
    triggerToast(`${selectedIds.length} records archived.`);
    setSelectedIds([]);
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
            <CheckCircle2 size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Completed Case Operations & Delivery Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Completed Applications
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            View all successfully completed visa applications, including issued visas, completed processing, and delivery status.
          </p>
        </div>
      </div>

      {/* STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Completed</span>
            <div className="text-2xl font-black text-slate-900 font-mono">1,690</div>
            <span className="text-[10px] text-emerald-600 font-bold">Successfully Delivered</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Completed Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">28</div>
            <span className="text-[10px] text-emerald-600 font-bold">Daily Fulfillment</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-[#2563EB] block mb-1">Visa Issued</span>
            <div className="text-2xl font-black text-slate-900 font-mono">1,690</div>
            <span className="text-[10px] text-blue-600 font-bold">100% Granted</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Delivered to Applicants</span>
            <div className="text-2xl font-black text-slate-900 font-mono">1,642</div>
            <span className="text-[10px] text-purple-600 font-bold">Courier & Email Confirmation</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Pending Delivery</span>
            <div className="text-2xl font-black text-slate-900 font-mono">48</div>
            <span className="text-[10px] text-amber-600 font-bold">In Courier Dispatch</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-700 block mb-1">Average Processing Time</span>
            <div className="text-2xl font-black text-slate-900 font-mono">3.2 Days</div>
            <span className="text-[10px] text-blue-700 font-bold">End-to-End SLA</span>
          </div>
        </div>

        {/* RIGHT CARD: RECOMMENDED TABS, WORKFLOW & ADDITIONAL FEATURES (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Completion Workflow & Reports
            </h3>

            {/* COMPLETION WORKFLOW LIST */}
            <div className="space-y-1 text-[11px] text-slate-700 font-medium mb-3">
              {COMPLETION_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-[9px] shrink-0">
                    ▼
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* ADDITIONAL FEATURES: CERTIFICATES & REPORTS */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-600">
              <div>
                <span className="text-slate-900 font-bold block mb-1">Completion Certificates:</span>
                {COMPLETION_CERTIFICATES.map((cert, i) => (
                  <div key={i} className="flex items-center gap-1 text-slate-700">
                    <Check size={11} className="text-emerald-600" /> {cert}
                  </div>
                ))}
              </div>
              <div>
                <span className="text-slate-900 font-bold block mb-1">Dashboard Reports:</span>
                {DASHBOARD_REPORTS.slice(0, 4).map((rep, i) => (
                  <div key={i} className="flex items-center gap-1 text-slate-700">
                    <Check size={11} className="text-[#2563EB]" /> {rep}
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
            <Filter size={16} className="text-[#2563EB]" /> Search & Completion Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredApps.length} of {completedApps.length} Completed Applications
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search By (ID, Applicant, Visa No, Passport)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="APP-20261501, CAN-950921..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* COMPLETION STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Completion & Delivery Status
            </label>
            <select
              value={completionStatusFilter}
              onChange={(e) => setCompletionStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Delivered">Delivered</option>
              <option value="In Transit">In Transit</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* COUNTRY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Country
            </label>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Countries</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="UAE">UAE</option>
            </select>
          </div>

          {/* CATEGORY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Visa Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Categories</option>
              <option value="Tourist">Tourist</option>
              <option value="Business">Business</option>
              <option value="Student">Student</option>
            </select>
          </div>

          {/* APPLIED BY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Applied By
            </label>
            <select
              value={appliedByFilter}
              onChange={(e) => setAppliedByFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Channels</option>
              <option value="Applicant">Applicant (Self)</option>
              <option value="Agent">Agent Submitted</option>
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
            <span>Completed Applications Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkArchive}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Archive size={14} /> Archive Selected
            </button>
            <button
              onClick={() => triggerToast(`Exporting data for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Applications
            </button>
            <button
              onClick={() => triggerToast(`Sending completion notifications to ${selectedIds.length} applicants.`)}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Send size={14} /> Send Notifications
            </button>
          </div>
        </div>
      )}

      {/* COMPLETED APPLICATIONS TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredApps.length && filteredApps.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Application ID</th>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Visa Category</th>
                <th className="py-3.5 px-4 font-mono">Visa Number</th>
                <th className="py-3.5 px-4 font-mono">Completed Date</th>
                <th className="py-3.5 px-4">Delivery Status</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <CheckCircle2 size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No completed applications found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredApps.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(a.id)}
                        onChange={() => handleToggleSelect(a.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {a.appId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {a.applicantName}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {a.country}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {a.category}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {a.visaNumber}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {a.completedDate}
                    </td>
                    <td className="py-3.5 px-4">
                      {a.deliveryStatus === "Delivered" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                          🟢 Delivered
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200">
                          🚚 In Transit
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {a.status === "Archived" ? (
                        <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-slate-200">
                          📁 Archived
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                          🏁 Completed
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setActiveModalApp(a);
                            setModalTab("Overview");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Completed Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleArchiveRecord(a)}
                          className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Archive Record"
                        >
                          <Archive size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(a)}
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
          <div>Showing 1–10 of 1,690 Completed Applications</div>
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

      {/* CENTERED POPUP DETAILS MODAL (8 RECOMMENDED TABS FROM WIREFRAME CATALOG) */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-lg text-white">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeModalApp.applicantName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-700">
                      {activeModalApp.appId} (COMPLETED)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{activeModalApp.country} &bull; Visa No: <strong className="text-emerald-300 font-mono">{activeModalApp.visaNumber}</strong> &bull; Completed Date: {activeModalApp.completedDate}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalApp(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {RECOMMENDED_COMPLETED_TABS.map((tab) => {
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
                      Completed Case Summary
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Application ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalApp.appId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Number</span>
                        <strong className="text-emerald-700 font-mono font-black">{activeModalApp.visaNumber}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Processing Duration</span>
                        <strong className="text-slate-900 font-mono font-bold">{activeModalApp.processingDuration}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Delivery Status</span>
                        <strong className="text-emerald-700 font-bold">{activeModalApp.deliveryStatus}</strong>
                      </div>
                    </div>
                  </div>

                  {/* DELIVERY DETAILS CARD */}
                  <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <Truck size={16} className="text-[#2563EB]" /> Delivery & Dispatch Specifications
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-blue-100">
                        <span className="text-[10px] font-bold text-slate-400 block">Delivery Method</span>
                        <strong className="text-slate-900 font-bold">{activeModalApp.deliveryMethod}</strong>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-blue-100">
                        <span className="text-[10px] font-bold text-slate-400 block">Courier Tracking No</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalApp.courierTrackingNumber}</strong>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-blue-100">
                        <span className="text-[10px] font-bold text-slate-400 block">Delivery Confirmation Date</span>
                        <strong className="text-slate-900 font-mono font-bold">{activeModalApp.deliveryDate}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerToast(`Downloading complete visa package for ${activeModalApp.appId}...`)}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={15} /> Download Full Package
                </button>
                <button
                  onClick={() => handleArchiveRecord(activeModalApp)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Archive size={15} /> Move to Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
