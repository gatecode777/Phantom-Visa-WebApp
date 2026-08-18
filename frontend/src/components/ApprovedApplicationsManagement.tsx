import React, { useState } from "react";
import {
  CheckCircle2,
  Search,
  Filter,
  Eye,
  Trash2,
  XCircle,
  Download,
  Sparkles,
  User,
  CreditCard,
  Building,
  Calendar,
  Clock,
  Send,
  Printer,
  ShieldCheck,
  Tag,
  AlertTriangle,
  Mail,
  Phone,
  Award,
  FileCheck,
  Plane,
  Truck,
  QrCode,
  FileText,
  MapPin,
  Check,
  X,
  ExternalLink
} from "lucide-react";
import { useVisa } from "../context/VisaContext";

export interface ApprovedApplicationRecord {
  id: string;
  appId: string;
  grantNumber: string;
  applicantName: string;
  passportNumber: string;
  appliedBy: "Applicant" | "Agent";
  agentName?: string;
  country: string;
  category: string;
  visaType: string;
  approvedBy: string;
  approvalDate: string;
  approvalTime: string;
  visaIssueDate?: string;
  visaExpiryDate?: string;
  visaValidity?: string;
  issuanceType?: "E-Visa" | "Sticker Visa" | "Physical Stamp";
  dispatchStatus?: "Delivered" | "Dispatched / In Transit" | "Ready for Dispatch" | "Pending Pickup";
  courierPartner?: string;
  waybillNumber?: string;
  dispatchDate?: string;
  visaStatus?: string;
  status: "Approved" | "Visa Issued";
  amountPaid: string;
  transactionId: string;
  // Deep detail fields
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  residenceCountry?: string;
  email?: string;
  phone?: string;
  address?: string;
  cityState?: string;
  passportIssueDate?: string;
  passportExpiryDate?: string;
  passportIssuingAuthority?: string;
  passportPlaceOfIssue?: string;
  travelDate?: string;
  expectedDepartureDate?: string;
  durationOfStay?: string;
  purposeOfVisit?: string;
  portOfEntry?: string;
  accommodationDetails?: string;
  occupation?: string;
  employerName?: string;
  annualIncome?: string;
  sponsorType?: string;
  embassyRefId?: string;
  biometricsDate?: string;
  vfsBranch?: string;
  issuedDocs: { name: string; status: "Issued" | "Available"; fileSize?: string }[];
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_APPROVED_TABS = [
  "Overview",
  "Visa Grant & E-Visa",
  "Applicant & Passport",
  "Visa & Travel",
  "Courier & Dispatch",
  "Uploaded Documents",
  "Payment & Invoice",
  "Approval Certificate",
  "Verification Notes"
];

export const APPROVAL_WORKFLOW_STEPS = [
  "Application Approved",
  "Visa Grant Document Generated",
  "Stamping & Sticker Applied",
  "Courier Dispatched",
  "Passport & Visa Delivered"
];

const MOCK_APPROVED_APPLICATIONS: ApprovedApplicationRecord[] = [];

export default function ApprovedApplicationsManagement() {
  const { applications: contextApps, authSession } = useVisa();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalStatusFilter, setApprovalStatusFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [appliedByFilter, setAppliedByFilter] = useState("All");
  const [dispatchFilter, setDispatchFilter] = useState("All");

  // Records State
  const [approvedList, setApprovedList] = useState<ApprovedApplicationRecord[]>([]);

  useEffect(() => {
    if (Array.isArray(contextApps)) {
      const approved = contextApps.filter((a: any) => a.status === "Approved" || a.status === "Completed");
      const mapped: ApprovedApplicationRecord[] = approved.map((app: any) => ({
        id: app.id || app._id || String(Math.random()),
        appId: app.id || app.applicationId || "VO-2026-5001",
        grantNumber: `EV-${(app.destination || "CAN").substring(0, 3).toUpperCase()}-${Math.floor(1000000 + Math.random() * 9000000)}`,
        applicantName: app.travelerName || (app.personalDetails ? `${app.personalDetails.givenName} ${app.personalDetails.surname}` : "Applicant"),
        firstName: app.personalDetails?.givenName || app.travelerName?.split(" ")[0] || "Applicant",
        lastName: app.personalDetails?.surname || app.travelerName?.split(" ").slice(1).join(" ") || "",
        passportNumber: app.passportNumber || app.passportDetails?.passportNo || "Z9876543",
        appliedBy: app.appliedBy || "Applicant",
        country: app.destination || app.countryName || "Canada",
        category: app.visaType?.includes("Tourist") ? "Tourist" : app.visaType?.includes("Student") ? "Student" : "Business",
        visaType: app.visaType || "Tourist Visa",
        approvedBy: authSession?.user?.name ? `${authSession.user.name} (Consular Officer)` : "Consular Officer",
        approvalDate: app.submissionDate || "01 Aug 2026",
        approvalTime: "10:30 AM",
        visaIssueDate: app.submissionDate || "01 Aug 2026",
        visaStatus: "Visa Issued",
        status: "Approved",
        amountPaid: `₹${app.fees || 12350}`,
        transactionId: "TXN-9988112",
        dob: app.dob || "1994-08-12",
        gender: "Female",
        maritalStatus: "Single",
        nationality: app.nationality || "Indian",
        residenceCountry: "India",
        email: app.email || "",
        phone: app.phone || "",
        address: app.address || "",
        cityState: "New Delhi, Delhi",
        passportIssueDate: "15 Jan 2020",
        passportExpiryDate: app.passportExpiry || "14 Jan 2030",
        passportIssuingAuthority: "Passport Office New Delhi",
        passportPlaceOfIssue: "New Delhi",
        travelDate: app.travelDates || "2026-09-20",
        expectedDepartureDate: "2026-10-15",
        durationOfStay: "25 Days",
        purposeOfVisit: "Tourism",
        portOfEntry: "YYZ",
        accommodationDetails: "Hotel",
        occupation: "Professional",
        employerName: "TechCorp Global",
        annualIncome: "₹18,50,000 INR",
        sponsorType: "Self Sponsored",
        embassyRefId: "CAN-EMB-88124",
        biometricsDate: "22 Jul 2026",
        vfsBranch: "VFS Global",
        issuedDocs: [
          { name: "Official E-Visa PDF", status: "Issued", fileSize: "1.4 MB" },
          { name: "Visa Grant Notice & Confirmation", status: "Issued", fileSize: "850 KB" },
          { name: "Payment Receipt & Invoice", status: "Available", fileSize: "420 KB" }
        ],
        actionNotes: []
      }));
      setApprovedList(mapped);
    }
  }, [contextApps, authSession]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalApp, setActiveModalApp] = useState<ApprovedApplicationRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // Note Input inside Modal
  const [newNoteText, setNewNoteText] = useState("");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredApps = approvedList.filter((app) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      app.appId.toLowerCase().includes(q) ||
      app.grantNumber.toLowerCase().includes(q) ||
      app.applicantName.toLowerCase().includes(q) ||
      app.passportNumber.toLowerCase().includes(q) ||
      app.approvedBy.toLowerCase().includes(q) ||
      app.country.toLowerCase().includes(q);

    const matchesStatus = approvalStatusFilter === "All" || app.status === approvalStatusFilter;
    const matchesCountry = countryFilter === "All" || app.country === countryFilter;
    const matchesCategory = categoryFilter === "All" || app.category === categoryFilter;
    const matchesAppliedBy = appliedByFilter === "All" || app.appliedBy === appliedByFilter;
    const matchesDispatch = dispatchFilter === "All" || app.dispatchStatus === dispatchFilter;

    return matchesQuery && matchesStatus && matchesCountry && matchesCategory && matchesAppliedBy && matchesDispatch;
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
  const handleIssueVisa = (app: ApprovedApplicationRecord) => {
    setApprovedList((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: "Visa Issued" } : a))
    );
    triggerToast(`Visa issued successfully for ${app.applicantName} (${app.grantNumber})!`);
    if (activeModalApp?.id === app.id) {
      setActiveModalApp((prev) => (prev ? { ...prev, status: "Visa Issued" } : null));
    }
  };

  const handleDispatchCourier = (app: ApprovedApplicationRecord) => {
    setApprovedList((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, dispatchStatus: "Dispatched / In Transit" } : a))
    );
    triggerToast(`Passport & E-Visa dispatched via ${app.courierPartner} (Waybill: ${app.waybillNumber})`);
    if (activeModalApp?.id === app.id) {
      setActiveModalApp((prev) => (prev ? { ...prev, dispatchStatus: "Dispatched / In Transit" } : null));
    }
  };

  const handleDeleteRecord = (app: ApprovedApplicationRecord) => {
    setApprovedList((prev) => prev.filter((a) => a.id !== app.id));
    triggerToast(`Approved record ${app.appId} removed.`);
    if (activeModalApp?.id === app.id) setActiveModalApp(null);
  };

  const handleBulkIssueVisas = () => {
    setApprovedList((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, status: "Visa Issued" } : a))
    );
    triggerToast(`E-Visas issued for ${selectedIds.length} approved applications.`);
    setSelectedIds([]);
  };

  const handleBulkDispatch = () => {
    setApprovedList((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, dispatchStatus: "Dispatched / In Transit" } : a))
    );
    triggerToast(`Courier dispatch initiated for ${selectedIds.length} passports.`);
    setSelectedIds([]);
  };

  const handleAddNote = () => {
    if (!newNoteText || !activeModalApp) return;
    const noteObj = {
      id: Date.now().toString(),
      author: "Visa Officer (Vibhu)",
      text: newNoteText,
      date: new Date().toLocaleString()
    };
    const updatedNotes = [...(activeModalApp.actionNotes || []), noteObj];
    setActiveModalApp({ ...activeModalApp, actionNotes: updatedNotes });
    setApprovedList((prev) =>
      prev.map((a) => (a.id === activeModalApp.id ? { ...a, actionNotes: updatedNotes } : a))
    );
    setNewNoteText("");
    triggerToast("Approval audit note added successfully.");
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 font-sans min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#0E1A2C] border border-[#2563EB]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-[#065F46] via-[#059669] to-[#10B981] text-white p-6 rounded-3xl shadow-xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-600">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-100 mb-1">
            <Award size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Official Visa Grants & Issuance Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Approved Applications
          </h1>
          <p className="text-xs text-emerald-100 font-medium mt-1">
            Manage visa grants, view e-visas, issue official approval certificates, track passport dispatches, and audit completed visas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => triggerToast("Generating batch zip package of all approved E-Visas...")}
            className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 border border-white/20"
          >
            <Download size={14} /> Download Batch E-Visas
          </button>
          <button
            onClick={() => triggerToast("Initiating bulk passport dispatch workflow...")}
            className="px-4 py-2 bg-slate-900/40 hover:bg-slate-900/60 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 border border-white/20"
          >
            <Truck size={14} /> Dispatch Passports
          </button>
        </div>
      </div>

      {/* TOP STATISTICS CARDS & RIGHT LIFECYCLE CARD (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 7 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Approved Visas</span>
            <div className="text-2xl font-black text-slate-900 font-mono">5,240</div>
            <span className="text-[10px] text-emerald-600 font-bold">All-Time Grants</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Visas Issued Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">42</div>
            <span className="text-[10px] text-emerald-600 font-bold">Today's Issuance</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-[#2563EB] block mb-1">E-Visas Generated</span>
            <div className="text-2xl font-black text-slate-900 font-mono">4,890</div>
            <span className="text-[10px] text-blue-600 font-bold">Ready for Download</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Sticker / Stamped</span>
            <div className="text-2xl font-black text-slate-900 font-mono">350</div>
            <span className="text-[10px] text-purple-600 font-bold">Passport Stamping</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">Dispatched</span>
            <div className="text-2xl font-black text-slate-900 font-mono">310</div>
            <span className="text-[10px] text-teal-600 font-bold">In Courier Transit</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Pending Delivery</span>
            <div className="text-2xl font-black text-slate-900 font-mono">40</div>
            <span className="text-[10px] text-amber-600 font-bold">Awaiting Pickup</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition sm:col-span-2">
            <span className="text-[10px] font-extrabold uppercase text-emerald-700 block mb-1">Average Turnaround</span>
            <div className="text-2xl font-black text-slate-900 font-mono">2.4 Days</div>
            <span className="text-[10px] text-emerald-700 font-bold">Fast Grant Processing</span>
          </div>
        </div>

        {/* RIGHT CARD: APPROVAL & ISSUANCE LIFECYCLE (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-emerald-600" /> Approval & Issuance Lifecycle
            </h3>
            <div className="space-y-1.5 text-[11px] text-slate-700 font-medium">
              {APPROVAL_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-[10px] shrink-0">
                    ▼
                  </div>
                  <span className="font-semibold text-slate-800">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-emerald-600" /> Search & Grant Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredApps.length} of {approvedList.length} Approved Grants
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search (ID, Grant No, Applicant, Passport)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="EV-CAN-9918..., Geeta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>
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

          {/* VISA CATEGORY */}
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

          {/* DISPATCH STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Dispatch Status
            </label>
            <select
              value={dispatchFilter}
              onChange={(e) => setDispatchFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Dispatch States</option>
              <option value="Delivered">Delivered</option>
              <option value="Dispatched / In Transit">Dispatched / In Transit</option>
              <option value="Ready for Dispatch">Ready for Dispatch</option>
              <option value="Pending Pickup">Pending Pickup</option>
            </select>
          </div>

          {/* APPLIED BY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Applied By Channel
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
        <div className="bg-[#0E1A2C] border border-emerald-500/40 text-white p-3.5 rounded-2xl shadow-xl mb-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-xs">
              {selectedIds.length}
            </span>
            <span>Approved Applications Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkIssueVisas}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Award size={14} /> Generate & Issue E-Visas
            </button>
            <button
              onClick={handleBulkDispatch}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Truck size={14} /> Dispatch Selected Passports
            </button>
            <button
              onClick={() => triggerToast(`Exporting details for ${selectedIds.length} approved records.`)}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Summary
            </button>
          </div>
        </div>
      )}

      {/* APPROVED APPLICATIONS TABLE */}
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
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Application ID</th>
                <th className="py-3.5 px-4">Grant / E-Visa No</th>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Applied By</th>
                <th className="py-3.5 px-4">Country & Category</th>
                <th className="py-3.5 px-4 font-mono">Approval Date</th>
                <th className="py-3.5 px-4">Visa Validity</th>
                <th className="py-3.5 px-4 font-mono text-center">E-Visa PDF</th>
                <th className="py-3.5 px-4">Dispatch Status</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    <Award size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No approved applications found matching your filters.</p>
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
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {a.appId}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-emerald-700">
                      {a.grantNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {a.applicantName}
                      <span className="block text-[10px] text-slate-400 font-mono font-normal">Passport: {a.passportNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {a.appliedBy === "Agent" ? (
                        <span className="text-purple-700 font-bold">Agent ({a.agentName})</span>
                      ) : (
                        <span className="text-slate-600">Self</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {a.country}
                      <span className="block text-[10px] text-slate-500 font-normal">{a.category} &bull; {a.visaType}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {a.approvalDate} ({a.approvalTime})
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-800">
                      {a.visaValidity}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => triggerToast(`Downloading E-Visa PDF for ${a.applicantName} (${a.grantNumber})...`)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                      >
                        <Download size={12} /> E-Visa PDF
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {a.visaStatus === "Visa Issued" ? (
                        <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[10px] border border-purple-200">
                          🟢 Visa Issued
                        </span>
                      ) : a.dispatchStatus === "Dispatched / In Transit" ? (
                        <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-200">
                          <Truck size={11} /> In Transit
                        </span>
                      ) : (
                        <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[10px] border border-blue-200">
                          📋 Ready for Issue
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                        🟢 Approved
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setActiveModalApp(a);
                            setModalTab("Overview");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Details & E-Visa"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleIssueVisa(a)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Issue E-Visa"
                        >
                          <Award size={15} />
                        </button>
                        <button
                          onClick={() => handleDispatchCourier(a)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Dispatch Passport / Courier"
                        >
                          <Truck size={15} />
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
          <div>Showing 1-10 of 1,856 Approved Applications</div>
          <div className="flex items-center gap-1 font-mono font-bold">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-40">
              Previous
            </button>
            <button className="px-3 py-1 bg-emerald-600 text-white rounded-lg">1</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">2</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">3</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CENTERED POPUP DETAILS MODAL (9 RECOMMENDED TABS FROM WIREFRAME) */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-lg text-white">
                  <Award size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeModalApp.applicantName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-700">
                      {activeModalApp.grantNumber}
                    </span>
                    <span className="text-[10px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-full">
                      APPROVED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    App ID: <strong className="text-blue-300 font-mono">{activeModalApp.appId}</strong> &bull; {activeModalApp.country} &bull; {activeModalApp.category} ({activeModalApp.visaType})
                  </p>
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
              {RECOMMENDED_APPROVED_TABS.map((tab) => {
                const active = modalTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setModalTab(tab)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      active
                        ? "bg-emerald-600 text-white shadow-sm"
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
                  {/* 6-STAGE APPROVAL LIFECYCLE STEPPER */}
                  <div className="bg-emerald-50/50 border border-emerald-200 rounded-3xl p-4">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-3 flex items-center gap-2">
                      <Sparkles size={16} className="text-emerald-600" /> Approval & Issuance Lifecycle Progress
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
                      {APPROVAL_WORKFLOW_STEPS.map((stepName, sIdx) => (
                        <div key={sIdx} className="bg-white p-2.5 rounded-2xl border border-emerald-200 flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mb-1">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-800 leading-tight">{stepName}</span>
                          <span className="text-[9px] text-emerald-700 font-bold mt-1">Verified</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* OVERVIEW TILES */}
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-3">
                      Core Grant Overview
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Application ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalApp.appId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Grant Number</span>
                        <strong className="text-emerald-700 font-mono font-black">{activeModalApp.grantNumber}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Approving Officer</span>
                        <strong className="text-slate-900 font-bold">{activeModalApp.approvedBy}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Validity</span>
                        <strong className="text-slate-900 font-bold">{activeModalApp.visaValidity}</strong>
                      </div>
                    </div>
                  </div>

                  {/* OFFICIAL APPROVAL CHECKLIST */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-4 space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <ShieldCheck size={16} className="text-emerald-600" /> Consular Approval Verification Checklist
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center gap-2 text-emerald-900 font-semibold">
                        <CheckCircle2 size={15} className="text-emerald-600" /> Biometrics & Identity Clearance Confirmed
                      </div>
                      <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center gap-2 text-emerald-900 font-semibold">
                        <CheckCircle2 size={15} className="text-emerald-600" /> Financial Solvency & Bank Proof Verified
                      </div>
                      <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center gap-2 text-emerald-900 font-semibold">
                        <CheckCircle2 size={15} className="text-emerald-600" /> Passport Validity Exceeds 6 Months
                      </div>
                      <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center gap-2 text-emerald-900 font-semibold">
                        <CheckCircle2 size={15} className="text-emerald-600" /> Consular Fee Payment Received in Full
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: VISA GRANT & E-VISA */}
              {modalTab === "Visa Grant & E-Visa" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 rounded-3xl shadow-xl border border-emerald-500/30 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                          <Award size={22} />
                        </div>
                        <div>
                          <h4 className="text-base font-black font-outfit text-white">
                            OFFICIAL VISA GRANT CARD ({activeModalApp.country.toUpperCase()})
                          </h4>
                          <span className="text-xs text-emerald-300 font-mono">Grant Ref: {activeModalApp.grantNumber}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-500 text-slate-950 font-black rounded-full text-xs uppercase font-mono">
                        OFFICIAL GRANT
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px]">VISA HOLDER</span>
                        <strong className="text-white text-sm block font-sans font-bold">{activeModalApp.applicantName}</strong>
                        <span className="text-slate-300 text-[11px]">PP: {activeModalApp.passportNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">VISA TYPE</span>
                        <strong className="text-emerald-300 block">{activeModalApp.visaType}</strong>
                        <span className="text-slate-300 text-[11px]">Validity: {activeModalApp.visaValidity}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">GRANT DATE & EXPIRY</span>
                        <strong className="text-white block">{activeModalApp.visaIssueDate}</strong>
                        <span className="text-emerald-400 text-[11px]">Expires: {activeModalApp.visaExpiryDate}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-300 text-xs">
                        <QrCode size={20} className="text-emerald-400" />
                        <span>Scan for Consular Digital Verification Seal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => triggerToast(`Printing E-Visa Document for ${activeModalApp.grantNumber}...`)}
                          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                        >
                          <Printer size={13} /> Print E-Visa
                        </button>
                        <button
                          onClick={() => triggerToast(`Downloading Official PDF E-Visa Document (${activeModalApp.grantNumber})...`)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                        >
                          <Download size={13} /> Download PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: APPLICANT & PASSPORT */}
              {modalTab === "Applicant & Passport" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-3">
                      Personal Identity Profile
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Full Name</span>
                        <strong className="text-slate-900">{activeModalApp.applicantName}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Date of Birth</span>
                        <strong className="text-slate-900">{activeModalApp.dob || "1994-08-12"}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Gender & Status</span>
                        <strong className="text-slate-900">{activeModalApp.gender || "Female"} &bull; {activeModalApp.maritalStatus || "Single"}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Nationality</span>
                        <strong className="text-slate-900">{activeModalApp.nationality || "Indian"}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Contact Email</span>
                        <strong className="text-[#2563EB]">{activeModalApp.email || "applicant@domain.com"}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Mobile Number</span>
                        <strong className="text-slate-900">{activeModalApp.phone || "+91 98123 45678"}</strong>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-3">
                      Passport Credentials
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Passport Number</span>
                        <strong className="text-slate-900 font-mono font-bold">{activeModalApp.passportNumber}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Issue Date</span>
                        <strong className="text-slate-900 font-mono">{activeModalApp.passportIssueDate || "15 Jan 2020"}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Expiry Date</span>
                        <strong className="text-slate-900 font-mono">{activeModalApp.passportExpiryDate || "14 Jan 2030"}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: VISA & TRAVEL */}
              {modalTab === "Visa & Travel" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Destination Country</span>
                      <strong className="text-slate-900 font-bold">{activeModalApp.country}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Visa Category</span>
                      <strong className="text-slate-900">{activeModalApp.category}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Intended Travel Date</span>
                      <strong className="text-[#2563EB] font-mono">{activeModalApp.travelDate || "2026-09-20"}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Port of Entry</span>
                      <strong className="text-slate-900">{activeModalApp.portOfEntry || "Toronto Pearson Intl (YYZ)"}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: COURIER & DISPATCH */}
              {modalTab === "Courier & Dispatch" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-blue-200 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                          <Truck size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black font-outfit text-slate-900">
                            COURIER TRACKING: {activeModalApp.courierPartner}
                          </h4>
                          <span className="text-xs font-mono font-bold text-blue-700">Waybill: {activeModalApp.waybillNumber}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-full text-xs border border-emerald-300">
                        {activeModalApp.dispatchStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Dispatch Date</span>
                        <strong className="text-slate-900 font-mono">{activeModalApp.dispatchDate}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Delivery Address</span>
                        <strong className="text-slate-900">{activeModalApp.address}, {activeModalApp.cityState}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Recipient Phone</span>
                        <strong className="text-slate-900">{activeModalApp.phone}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => triggerToast(`Opening live tracking for ${activeModalApp.waybillNumber}...`)}
                      className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ExternalLink size={14} /> Live Courier Tracking Page
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 6: UPLOADED DOCUMENTS */}
              {modalTab === "Uploaded Documents" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Verified Documents Checklist
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeModalApp.issuedDocs.map((doc, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 size={18} className="text-emerald-600" />
                          <div>
                            <span className="font-bold text-slate-900 block">{doc.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{doc.fileSize || "1.2 MB"} &bull; Verified & Approved</span>
                          </div>
                        </div>
                        <button
                          onClick={() => triggerToast(`Downloading ${doc.name}...`)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-extrabold flex items-center gap-1 cursor-pointer"
                        >
                          <Download size={12} /> Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: PAYMENT & INVOICE */}
              {modalTab === "Payment & Invoice" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Consular Billing & Payment Breakdown
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Total Amount Paid</span>
                      <strong className="text-emerald-700 text-sm font-black font-mono">{activeModalApp.amountPaid}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Transaction Reference ID</span>
                      <strong className="text-slate-900 font-mono">{activeModalApp.transactionId}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Payment Channel</span>
                      <strong className="text-slate-900">Online Credit Card (Paid & Cleared)</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: APPROVAL CERTIFICATE */}
              {modalTab === "Approval Certificate" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-6 bg-emerald-50/40 border border-emerald-200 rounded-3xl text-center space-y-3">
                    <Award size={40} className="mx-auto text-emerald-600" />
                    <h4 className="text-base font-black font-outfit text-slate-900">
                      OFFICIAL VISA APPROVAL CERTIFICATE
                    </h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      This is an electronically generated approval certificate certifying that visa grant <strong>{activeModalApp.grantNumber}</strong> has been officially approved.
                    </p>
                    <button
                      onClick={() => triggerToast(`Downloading Approval Certificate for ${activeModalApp.grantNumber}...`)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download size={14} /> Download Certificate PDF
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 9: VERIFICATION NOTES */}
              {modalTab === "Verification Notes" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Approval Audit Log & Consular Notes
                  </h4>
                  <div className="space-y-2">
                    {activeModalApp.actionNotes?.map((n) => (
                      <div key={n.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900">{n.author}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                        </div>
                        <p className="text-xs text-slate-600">{n.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* ADD NOTE FORM */}
                  <div className="pt-3 border-t border-slate-200 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an audit note..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600"
                    />
                    <button
                      onClick={handleAddNote}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Add Note
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleIssueVisa(activeModalApp)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Award size={15} /> Re-Issue E-Visa Copy
                </button>
                <button
                  onClick={() => handleDispatchCourier(activeModalApp)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Truck size={15} /> Dispatch Passport
                </button>
              </div>

              <button
                onClick={() => setActiveModalApp(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
