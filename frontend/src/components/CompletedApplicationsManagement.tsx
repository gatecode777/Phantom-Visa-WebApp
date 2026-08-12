import React, { useState } from "react";
import {
  CheckCircle2,
  Search,
  Filter,
  Eye,
  Trash2,
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
  Truck,
  Archive,
  Star,
  Award,
  FileCheck,
  Plane,
  X,
  ExternalLink,
  Lock,
  Check,
  Smile
} from "lucide-react";

export interface CompletedApplicationRecord {
  id: string;
  appId: string;
  dossierRef: string;
  grantNumber: string;
  applicantName: string;
  passportNumber: string;
  appliedBy: "Applicant" | "Agent";
  agentName?: string;
  country: string;
  category: string;
  visaType: string;
  completedDate: string;
  completedTime: string;
  handlingOfficer: string;
  deliveryStatus: "Delivered & Confirmed" | "Passport Delivered" | "E-Visa Sent & Opened";
  deliveryMethod: "Express Courier (BlueDart)" | "Digital Delivery (Email)" | "Consular Pickup";
  trackingWaybill: string;
  courierPartner: string;
  deliveryDate: string;
  amountPaid: string;
  transactionId: string;
  status: "Completed" | "Archived";
  rating?: number; // e.g. 5
  feedbackComment?: string;
  npsScore?: number; // e.g. 10
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
  archivedDocs: { name: string; status: "Archived" | "Verified"; fileSize?: string }[];
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_COMPLETED_TABS = [
  "Overview",
  "Completion & Archival Certificate",
  "Applicant & Passport",
  "Visa & Travel",
  "Delivery & Courier Proof",
  "Uploaded Documents",
  "Payment & Invoice",
  "Applicant Feedback & Ratings",
  "Officer Audit Log & Notes"
];

export const COMPLETION_WORKFLOW_STEPS = [
  "Visa Approved & Issued",
  "Passport / E-Visa Delivered to Applicant",
  "Post-Delivery Confirmation Received",
  "Applicant Feedback & Rating Recorded",
  "Final Audit & Settlement Cleared",
  "Closed & Moved to Permanent Archive"
];

const MOCK_COMPLETED_APPLICATIONS: CompletedApplicationRecord[] = [
  {
    id: "1",
    appId: "APP-20268001",
    dossierRef: "DOS-CAN-99120",
    grantNumber: "EV-CAN-9918234",
    applicantName: "Geeta Bisht",
    firstName: "Geeta",
    lastName: "Bisht",
    passportNumber: "Z9876543",
    appliedBy: "Applicant",
    country: "Canada",
    category: "Tourist",
    visaType: "V-1 Visitor Multiple Entry",
    completedDate: "01 Aug 2026",
    completedTime: "05:00 PM",
    handlingOfficer: "Rahul Sharma",
    deliveryStatus: "Delivered & Confirmed",
    deliveryMethod: "Digital Delivery (Email)",
    trackingWaybill: "BD-99182341",
    courierPartner: "BlueDart Express",
    deliveryDate: "01 Aug 2026 04:30 PM",
    amountPaid: "₹12,350",
    transactionId: "TXN-9988112",
    status: "Completed",
    rating: 5,
    feedbackComment: "Extremely smooth process! Received the Canada eVisa in 3 days. Excellent portal.",
    npsScore: 10,
    dob: "1994-08-12",
    gender: "Female",
    maritalStatus: "Single",
    nationality: "Indian",
    residenceCountry: "India",
    email: "geeta.bisht@gmail.com",
    phone: "+91 98123 45678",
    address: "B-42, South Extension Part II",
    cityState: "New Delhi, Delhi",
    passportIssueDate: "15 Jan 2020",
    passportExpiryDate: "14 Jan 2030",
    passportIssuingAuthority: "Passport Office New Delhi",
    passportPlaceOfIssue: "New Delhi",
    travelDate: "2026-09-20",
    expectedDepartureDate: "2026-10-15",
    durationOfStay: "25 Days",
    purposeOfVisit: "Tourism & Sightseeing",
    portOfEntry: "Toronto Pearson Intl (YYZ)",
    accommodationDetails: "Marriott Downtown Toronto",
    archivedDocs: [
      { name: "Complete Visa Application Dossier", status: "Archived", fileSize: "4.8 MB" },
      { name: "Official Canada E-Visa Copy", status: "Archived", fileSize: "1.4 MB" },
      { name: "Signed Delivery Receipt", status: "Archived", fileSize: "620 KB" },
      { name: "Consular Payment Receipt", status: "Verified", fileSize: "420 KB" }
    ],
    actionNotes: [
      { id: "n1", author: "Rahul Sharma", text: "Visa delivered via email. Applicant submitted 5-star rating. Case archived.", date: "01 Aug 2026 05:00 PM" }
    ]
  },
  {
    id: "2",
    appId: "APP-20268002",
    dossierRef: "DOS-AUS-44192",
    grantNumber: "EV-AUS-4410981",
    applicantName: "Rahul Sharma",
    firstName: "Rahul",
    lastName: "Sharma",
    passportNumber: "M1234567",
    appliedBy: "Agent",
    agentName: "Apex Travels",
    country: "Australia",
    category: "Student",
    visaType: "Subclass 500 Student Grant",
    completedDate: "31 Jul 2026",
    completedTime: "06:15 PM",
    handlingOfficer: "David Thomas",
    deliveryStatus: "Passport Delivered",
    deliveryMethod: "Express Courier (BlueDart)",
    trackingWaybill: "BD-77441199",
    courierPartner: "BlueDart Express",
    deliveryDate: "01 Aug 2026 02:15 PM",
    amountPaid: "₹18,930",
    transactionId: "TXN-7733441",
    status: "Completed",
    rating: 5,
    feedbackComment: "Received stamped passport via BlueDart with official grant letter. Superb service!",
    npsScore: 10,
    dob: "1999-02-15",
    gender: "Male",
    maritalStatus: "Single",
    nationality: "Indian",
    residenceCountry: "India",
    email: "rahul.sharma@outlook.com",
    phone: "+91 91234 56789",
    address: "Flat 301, Sunshine Heights",
    cityState: "Mumbai, Maharashtra",
    passportIssueDate: "10 Mar 2021",
    passportExpiryDate: "09 Mar 2031",
    passportIssuingAuthority: "Passport Office Mumbai",
    passportPlaceOfIssue: "Mumbai",
    travelDate: "2026-10-01",
    expectedDepartureDate: "2028-07-30",
    durationOfStay: "24 Months",
    purposeOfVisit: "Higher Education",
    portOfEntry: "Sydney Kingsford Smith (SYD)",
    accommodationDetails: "University Campus Residence",
    archivedDocs: [
      { name: "Full Student Visa Dossier Archive", status: "Archived", fileSize: "6.2 MB" },
      { name: "Sticker Passport Delivery Receipt", status: "Archived", fileSize: "850 KB" }
    ],
    actionNotes: [
      { id: "n2", author: "David Thomas", text: "Physical passport delivered to applicant. Receipt uploaded.", date: "31 Jul 2026 06:15 PM" }
    ]
  },
  {
    id: "3",
    appId: "APP-20268003",
    dossierRef: "DOS-UAE-33108",
    grantNumber: "EV-UAE-3319456",
    applicantName: "Bikram Suman",
    firstName: "Bikram",
    lastName: "Suman",
    passportNumber: "K4567890",
    appliedBy: "Applicant",
    country: "UAE",
    category: "Business",
    visaType: "30 Days Multiple Entry",
    completedDate: "30 Jul 2026",
    completedTime: "04:00 PM",
    handlingOfficer: "Sarah Johnston",
    deliveryStatus: "E-Visa Sent & Opened",
    deliveryMethod: "Digital Delivery (Email)",
    trackingWaybill: "DHL-5544112",
    courierPartner: "DHL Express",
    deliveryDate: "30 Jul 2026 03:45 PM",
    amountPaid: "₹8,670",
    transactionId: "TXN-5511223",
    status: "Archived",
    rating: 4,
    feedbackComment: "Quick turnaround for UAE Business visa. Very satisfied.",
    npsScore: 9,
    dob: "1988-06-25",
    gender: "Male",
    maritalStatus: "Married",
    nationality: "Indian",
    residenceCountry: "India",
    email: "bikram.s@techsolutions.com",
    phone: "+91 99887 76655",
    address: "H.No 108, Sector 15",
    cityState: "Gurugram, Haryana",
    passportIssueDate: "05 Jun 2019",
    passportExpiryDate: "04 Jun 2029",
    passportIssuingAuthority: "Passport Office Gurgaon",
    passportPlaceOfIssue: "Gurgaon",
    travelDate: "2026-08-12",
    expectedDepartureDate: "2026-08-25",
    durationOfStay: "13 Days",
    purposeOfVisit: "Business Conference",
    portOfEntry: "Dubai Intl Airport (DXB)",
    accommodationDetails: "Grand Hyatt Dubai",
    archivedDocs: [
      { name: "GDRFA UAE E-Visa Official Copy", status: "Archived", fileSize: "1.8 MB" },
      { name: "Archival Settlement Report", status: "Archived", fileSize: "510 KB" }
    ],
    actionNotes: [
      { id: "n3", author: "Sarah Johnston", text: "Case closed and permanently archived.", date: "30 Jul 2026 04:00 PM" }
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
  const [deliveryFilter, setDeliveryFilter] = useState("All");

  // Records State
  const [completedApps, setCompletedApps] = useState<CompletedApplicationRecord[]>(MOCK_COMPLETED_APPLICATIONS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalApp, setActiveModalApp] = useState<CompletedApplicationRecord | null>(null);
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
  const filteredApps = completedApps.filter((app) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      app.appId.toLowerCase().includes(q) ||
      app.dossierRef.toLowerCase().includes(q) ||
      app.grantNumber.toLowerCase().includes(q) ||
      app.applicantName.toLowerCase().includes(q) ||
      app.passportNumber.toLowerCase().includes(q) ||
      app.handlingOfficer.toLowerCase().includes(q) ||
      app.country.toLowerCase().includes(q);

    const matchesStatus = completionStatusFilter === "All" || app.status === completionStatusFilter;
    const matchesCountry = countryFilter === "All" || app.country === countryFilter;
    const matchesCategory = categoryFilter === "All" || app.category === categoryFilter;
    const matchesAppliedBy = appliedByFilter === "All" || app.appliedBy === appliedByFilter;
    const matchesDelivery = deliveryFilter === "All" || app.deliveryStatus === deliveryFilter;

    return matchesQuery && matchesStatus && matchesCountry && matchesCategory && matchesAppliedBy && matchesDelivery;
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
  const handleSendFeedbackSurvey = (app: CompletedApplicationRecord) => {
    triggerToast(`Post-travel satisfaction survey link emailed to ${app.applicantName} (${app.email})`);
  };

  const handleMoveToArchive = (app: CompletedApplicationRecord) => {
    setCompletedApps((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: "Archived" } : a))
    );
    triggerToast(`Application ${app.appId} moved to permanent cold archive.`);
    if (activeModalApp?.id === app.id) {
      setActiveModalApp((prev) => (prev ? { ...prev, status: "Archived" } : null));
    }
  };

  const handleDeleteRecord = (app: CompletedApplicationRecord) => {
    setCompletedApps((prev) => prev.filter((a) => a.id !== app.id));
    triggerToast(`Completed record ${app.appId} deleted.`);
    if (activeModalApp?.id === app.id) setActiveModalApp(null);
  };

  const handleBulkDossierDownload = () => {
    triggerToast(`Downloading ZIP dossier bundle for ${selectedIds.length} completed cases.`);
    setSelectedIds([]);
  };

  const handleBulkArchive = () => {
    setCompletedApps((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, status: "Archived" } : a))
    );
    triggerToast(`Archived ${selectedIds.length} completed cases.`);
    setSelectedIds([]);
  };

  const handleAddNote = () => {
    if (!newNoteText || !activeModalApp) return;
    const noteObj = {
      id: Date.now().toString(),
      author: "Archival Officer (Vibhu)",
      text: newNoteText,
      date: new Date().toLocaleString()
    };
    const updatedNotes = [...(activeModalApp.actionNotes || []), noteObj];
    setActiveModalApp({ ...activeModalApp, actionNotes: updatedNotes });
    setCompletedApps((prev) =>
      prev.map((a) => (a.id === activeModalApp.id ? { ...a, actionNotes: updatedNotes } : a))
    );
    setNewNoteText("");
    triggerToast("Archival note added successfully.");
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 font-sans min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#0E1A2C] border border-blue-500/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#334155] text-white p-6 rounded-3xl shadow-xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-700">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-300 mb-1">
            <Archive size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Completed & Permanent Consular Dossier Registry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Completed Applications
          </h1>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Review closed visa dossiers, audit passport delivery proofs, track post-travel feedback, and manage long-term consular archives.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => triggerToast("Generating full completion audit summary report...")}
            className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 border border-white/20"
          >
            <Download size={14} /> Export Dossier Summary
          </button>
          <button
            onClick={() => triggerToast("Sending post-travel satisfaction survey to recent completed applicants...")}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 border border-emerald-400/30"
          >
            <Send size={14} /> Feedback Survey
          </button>
        </div>
      </div>

      {/* TOP STATISTICS CARDS & RIGHT LIFECYCLE CARD (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 7 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Completed Cases</span>
            <div className="text-2xl font-black text-slate-900 font-mono">8,940</div>
            <span className="text-[10px] text-emerald-600 font-bold">Fully Closed Cases</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Completed Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">58</div>
            <span className="text-[10px] text-emerald-600 font-bold">Today's Deliveries</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-[#2563EB] block mb-1">Passports Delivered</span>
            <div className="text-2xl font-black text-slate-900 font-mono">8,120</div>
            <span className="text-[10px] text-blue-600 font-bold">Handed to Applicant</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">E-Visas Emailed</span>
            <div className="text-2xl font-black text-slate-900 font-mono">750</div>
            <span className="text-[10px] text-purple-600 font-bold">Digital Delivery</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Satisfaction Score</span>
            <div className="text-2xl font-black text-slate-900 font-mono flex items-center gap-1">
              4.9 <Star size={16} className="text-amber-500 fill-amber-500 inline" />
            </div>
            <span className="text-[10px] text-amber-600 font-bold">Post-Travel Rating</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">Flawless Success Rate</span>
            <div className="text-2xl font-black text-slate-900 font-mono">99.8%</div>
            <span className="text-[10px] text-teal-600 font-bold">Zero-Claim Record</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition sm:col-span-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-600 block mb-1">Average Total Turnaround</span>
            <div className="text-2xl font-black text-slate-900 font-mono">2.8 Days</div>
            <span className="text-[10px] text-slate-600 font-bold">Intake to Final Delivery</span>
          </div>
        </div>

        {/* RIGHT CARD: COMPLETION & ARCHIVAL WORKFLOW (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Completion & Archival Workflow
            </h3>
            <div className="space-y-1.5 text-[11px] text-slate-700 font-medium">
              {COMPLETION_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono border border-slate-200">
                    {idx + 1}
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
            <Filter size={16} className="text-[#2563EB]" /> Search & Archival Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredApps.length} of {completedApps.length} Completed Dossiers
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search (ID, Dossier, Grant, Applicant, Passport)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="DOS-CAN-99120..., Geeta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* DELIVERY METHOD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Delivery Method
            </label>
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Delivery Modes</option>
              <option value="Delivered & Confirmed">Delivered & Confirmed</option>
              <option value="Passport Delivered">Passport Delivered</option>
              <option value="E-Visa Sent & Opened">E-Visa Sent & Opened</option>
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

          {/* ARCHIVAL STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Archival Status
            </label>
            <select
              value={completionStatusFilter}
              onChange={(e) => setCompletionStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Archived">Archived (Cold Store)</option>
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
        <div className="bg-[#0E1A2C] border border-[#2563EB]/40 text-white p-3.5 rounded-2xl shadow-xl mb-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-6 h-6 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-mono font-bold text-xs">
              {selectedIds.length}
            </span>
            <span>Completed Applications Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkDossierDownload}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Download ZIP Dossiers
            </button>
            <button
              onClick={handleBulkArchive}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Archive size={14} /> Move to Cold Archive
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
                <th className="py-3.5 px-4">Dossier / Grant Ref</th>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Applied By</th>
                <th className="py-3.5 px-4">Country & Category</th>
                <th className="py-3.5 px-4 font-mono">Completion Date</th>
                <th className="py-3.5 px-4">Delivery Confirmation</th>
                <th className="py-3.5 px-4 font-mono text-center">Full Dossier PDF</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <Archive size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
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
                    <td className="py-3.5 px-4 font-mono font-black text-slate-800">
                      {a.dossierRef}
                      <span className="block text-[10px] text-emerald-700 font-bold">{a.grantNumber}</span>
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
                      {a.completedDate} ({a.completedTime})
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs">
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                        <CheckCircle2 size={11} /> {a.deliveryStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => triggerToast(`Downloading Complete Dossier Archive for ${a.applicantName} (${a.dossierRef})...`)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                      >
                        <Download size={12} /> Dossier PDF
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      {a.status === "Archived" ? (
                        <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-slate-300">
                          <Archive size={11} /> Archived
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                          <CheckCircle2 size={11} /> Completed
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
                          title="View Completed Dossier"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleSendFeedbackSurvey(a)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Send Feedback Survey"
                        >
                          <Send size={15} />
                        </button>
                        <button
                          onClick={() => handleMoveToArchive(a)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Move to Cold Archive"
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
          <div>Showing 1 to 10 of 8,940 Completed Applications</div>
          <div className="flex items-center gap-1 font-mono font-bold">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-40">
              Previous
            </button>
            <button className="px-3 py-1 bg-slate-900 text-white rounded-lg">1</button>
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
                  <Archive size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeModalApp.applicantName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700">
                      {activeModalApp.dossierRef}
                    </span>
                    <span className="text-[10px] font-bold text-slate-950 bg-emerald-400 px-2 py-0.5 rounded-full font-mono uppercase">
                      COMPLETED & ARCHIVED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    App ID: <strong className="text-blue-300 font-mono">{activeModalApp.appId}</strong> &bull; Grant: <strong className="text-emerald-300 font-mono">{activeModalApp.grantNumber}</strong> &bull; {activeModalApp.country}
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
              {RECOMMENDED_COMPLETED_TABS.map((tab) => {
                const active = modalTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setModalTab(tab)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      active
                        ? "bg-slate-900 text-white shadow-sm"
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
                  {/* 6-STAGE COMPLETION LIFECYCLE STEPPER */}
                  <div className="bg-slate-100/80 border border-slate-200 rounded-3xl p-4">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-3 flex items-center gap-2">
                      <Sparkles size={16} className="text-emerald-600" /> Completion & Archival Progress Bar
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
                      {COMPLETION_WORKFLOW_STEPS.map((stepName, sIdx) => (
                        <div key={sIdx} className="bg-white p-2.5 rounded-2xl border border-emerald-200 flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mb-1">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-800 leading-tight">{stepName}</span>
                          <span className="text-[9px] text-emerald-700 font-bold mt-1">Cleared</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* OVERVIEW TILES */}
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-3">
                      Core Archival Dossier Overview
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Dossier Reference</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalApp.dossierRef}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Grant Number</span>
                        <strong className="text-emerald-700 font-mono font-black">{activeModalApp.grantNumber}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Handling Officer</span>
                        <strong className="text-slate-900 font-bold">{activeModalApp.handlingOfficer}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Completion Timestamp</span>
                        <strong className="text-slate-900 font-mono">{activeModalApp.completedDate} ({activeModalApp.completedTime})</strong>
                      </div>
                    </div>
                  </div>

                  {/* VERIFICATION CHECKLIST */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-4 space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <ShieldCheck size={16} className="text-emerald-600" /> Post-Delivery Consular Verification Checklist
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center gap-2 text-emerald-900 font-semibold">
                        <CheckCircle2 size={15} className="text-emerald-600" /> Visa Issued & Digital Signature Sealed
                      </div>
                      <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center gap-2 text-emerald-900 font-semibold">
                        <CheckCircle2 size={15} className="text-emerald-600" /> Waybill Delivery Proof Logged & Signed
                      </div>
                      <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center gap-2 text-emerald-900 font-semibold">
                        <CheckCircle2 size={15} className="text-emerald-600" /> Consular Fee Settlement Reconciled
                      </div>
                      <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center gap-2 text-emerald-900 font-semibold">
                        <CheckCircle2 size={15} className="text-emerald-600" /> Full Dossier Archived in Vault
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: COMPLETION & ARCHIVAL CERTIFICATE */}
              {modalTab === "Completion & Archival Certificate" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-6 rounded-3xl shadow-xl border border-blue-500/30 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                          <Award size={22} />
                        </div>
                        <div>
                          <h4 className="text-base font-black font-outfit text-white">
                            OFFICIAL CONSULAR DOSSIER COMPLETION CERTIFICATE
                          </h4>
                          <span className="text-xs text-blue-300 font-mono">Dossier Ref: {activeModalApp.dossierRef}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black rounded-full text-xs uppercase font-mono">
                        ARCHIVED
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px]">APPLICANT</span>
                        <strong className="text-white text-sm block font-sans font-bold">{activeModalApp.applicantName}</strong>
                        <span className="text-slate-300 text-[11px]">PP: {activeModalApp.passportNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">GRANT & DOSSIER</span>
                        <strong className="text-emerald-300 block">{activeModalApp.grantNumber}</strong>
                        <span className="text-slate-300 text-[11px]">{activeModalApp.dossierRef}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">COMPLETED DATE</span>
                        <strong className="text-white block">{activeModalApp.completedDate}</strong>
                        <span className="text-blue-300 text-[11px]">By: {activeModalApp.handlingOfficer}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-300 text-xs">
                        <Lock size={18} className="text-amber-400" />
                        <span>Encrypted & Vaulted in Permanent Consular Records</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => triggerToast(`Printing Certificate for ${activeModalApp.dossierRef}...`)}
                          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                        >
                          <Printer size={13} /> Print Certificate
                        </button>
                        <button
                          onClick={() => triggerToast(`Downloading PDF Certificate (${activeModalApp.dossierRef})...`)}
                          className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
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

              {/* TAB 5: DELIVERY & COURIER PROOF */}
              {modalTab === "Delivery & Courier Proof" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="bg-emerald-50/50 border border-emerald-200 rounded-3xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                          <Truck size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black font-outfit text-slate-900">
                            SIGNED COURIER DELIVERY PROOF ({activeModalApp.courierPartner})
                          </h4>
                          <span className="text-xs font-mono font-bold text-emerald-700">Waybill: {activeModalApp.trackingWaybill}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-600 text-white font-extrabold rounded-full text-xs">
                        {activeModalApp.deliveryStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Delivery Timestamp</span>
                        <strong className="text-slate-900 font-mono">{activeModalApp.deliveryDate}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Delivery Address</span>
                        <strong className="text-slate-900">{activeModalApp.address}, {activeModalApp.cityState}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Recipient Signature</span>
                        <strong className="text-emerald-700 font-bold">Signature Verified on File</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: UPLOADED DOCUMENTS */}
              {modalTab === "Uploaded Documents" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Archived Application Documents Checklist
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeModalApp.archivedDocs.map((doc, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 size={18} className="text-emerald-600" />
                          <div>
                            <span className="font-bold text-slate-900 block">{doc.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{doc.fileSize || "1.2 MB"} &bull; Vaulted & Archived</span>
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
                    Consular Payment & Financial Settlement
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Total Amount Settled</span>
                      <strong className="text-emerald-700 text-sm font-black font-mono">{activeModalApp.amountPaid}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Transaction Reference ID</span>
                      <strong className="text-slate-900 font-mono">{activeModalApp.transactionId}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Settlement Status</span>
                      <strong className="text-emerald-700 font-bold">Consular Reconciled</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: APPLICANT FEEDBACK & RATINGS */}
              {modalTab === "Applicant Feedback & Ratings" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-5 bg-amber-50/50 border border-amber-200 rounded-3xl space-y-3">
                    <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                      <div>
                        <h4 className="text-sm font-black font-outfit text-slate-900">
                          POST-TRAVEL SATISFACTION FEEDBACK
                        </h4>
                        <span className="text-xs text-amber-700 font-bold">NPS Score: {activeModalApp.npsScore || 10} / 10</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: activeModalApp.rating || 5 }).map((_, i) => (
                          <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 italic bg-white p-3.5 rounded-2xl border border-amber-200">
                      "{activeModalApp.feedbackComment || "Extremely smooth process! Received the visa very quickly."}"
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 9: OFFICER AUDIT LOG & NOTES */}
              {modalTab === "Officer Audit Log & Notes" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Permanent Archival Consular Audit Log
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
                      placeholder="Add an archival audit note..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2563EB]"
                    />
                    <button
                      onClick={handleAddNote}
                      className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
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
                  onClick={() => handleSendFeedbackSurvey(activeModalApp)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Send size={15} /> Send Feedback Survey
                </button>
                <button
                  onClick={() => handleMoveToArchive(activeModalApp)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Archive size={15} /> Move to Cold Archive
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
