import React, { useState } from "react";
import {
  Sparkles,
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
  FileText,
  Download,
  Check,
  X,
  TrendingUp,
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
  UserCheck,
  Tag,
  CheckSquare,
  AlertTriangle,
  UserPlus,
  Mail,
  Phone
} from "lucide-react";

export interface NewApplicationRecord {
  id: string;
  appId: string;
  applicantName: string;
  firstName?: string;
  lastName?: string;
  passportNumber: string;
  passportIssueDate?: string;
  passportExpiry?: string;
  passportIssuingCountry?: string;
  passportPlaceOfIssue?: string;
  appliedBy: "Self" | "Agent";
  agentName?: string;
  country: string;
  category: string;
  visaType: string;
  submissionDate: string;
  submissionTime: string;
  documentsStatus: "Complete" | "Missing (1)" | "Missing (2+)";
  paymentStatus: "Paid" | "Pending" | "Failed";
  priority: "Normal" | "High" | "Urgent";
  status: "New" | "In Review" | "Accepted" | "Rejected";
  // Detail fields
  dob?: string;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  countryOfResidence?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  purposeOfVisit?: string;
  travelDate?: string;
  departureDate?: string;
  durationOfStay?: string;
  portOfEntry?: string;
  hotelDetails?: string;
  occupation?: string;
  employerName?: string;
  designation?: string;
  annualIncome?: string;
  sponsorType?: string;
  bankBalance?: string;
  governmentFee?: string;
  serviceFee?: string;
  taxAmount?: string;
  amountPaid?: string;
  transactionId?: string;
  paymentMethod?: string;
  paymentDate?: string;
  embassyTrackingId?: string;
  embassySubmissionDate?: string;
  appointmentDate?: string;
  consulateBranch?: string;
  ipAddress?: string;
  verificationChecklist: {
    verifyApplicantInfo: boolean;
    verifyPassportDetails: boolean;
    verifyUploadedDocuments: boolean;
    verifyPayment: boolean;
    assignOfficer: boolean;
  };
  documents?: { name: string; status: "Verified" | "Missing" | "Pending"; url?: string }[];
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_VIEW_TABS = [
  "Overview",
  "Applicant & Passport",
  "Visa & Travel",
  "Employment & Finance",
  "Uploaded Documents",
  "Payment & Invoice",
  "Embassy & Tracking",
  "Review Checklist",
  "Action Notes"
];

export const NEW_APPLICATION_WORKFLOW = [
  "Application Submitted",
  "New Applications",
  "Initial Review",
  "Document Verification",
  "Payment Verification",
  "Assigned for Processing"
];

const MOCK_NEW_APPLICATIONS: NewApplicationRecord[] = [
  {
    id: "1",
    appId: "APP-20260045",
    applicantName: "Geeta Bisht",
    firstName: "Geeta",
    lastName: "Bisht",
    passportNumber: "Z9876543",
    passportIssueDate: "2020-04-12",
    passportExpiry: "2030-04-11",
    passportIssuingCountry: "India (RPO New Delhi)",
    passportPlaceOfIssue: "New Delhi",
    appliedBy: "Self",
    country: "Canada",
    category: "Tourist",
    visaType: "eVisa (Multiple Entry)",
    submissionDate: "Today",
    submissionTime: "09:45 AM",
    documentsStatus: "Complete",
    paymentStatus: "Paid",
    priority: "Normal",
    status: "New",
    dob: "1994-08-12",
    gender: "Female",
    maritalStatus: "Single",
    nationality: "Indian",
    countryOfResidence: "India",
    email: "geeta.bisht@gmail.com",
    phone: "+91 98123 45678",
    address: "Flat 204, Rose Apartments, Dwarka",
    city: "New Delhi, Delhi",
    purposeOfVisit: "Vacation & Sightseeing",
    travelDate: "2026-09-20",
    departureDate: "2026-10-05",
    durationOfStay: "15 Days",
    portOfEntry: "Vancouver Int'l Airport (YVR)",
    hotelDetails: "Pan Pacific Vancouver",
    occupation: "Senior UX Designer",
    employerName: "Digital Systems Tech",
    designation: "Lead Consultant",
    annualIncome: "₹16,50,000 / year",
    sponsorType: "Self-Funded",
    bankBalance: "₹7,20,000 (ICICI Bank)",
    governmentFee: "₹8,500",
    serviceFee: "₹3,150",
    taxAmount: "₹700",
    amountPaid: "₹12,350",
    transactionId: "TXN-9988112",
    paymentMethod: "UPI (PhonePe)",
    paymentDate: "Today 09:40 AM",
    embassyTrackingId: "CAN-NEW-9901",
    embassySubmissionDate: "2026-08-12",
    appointmentDate: "2026-08-18",
    consulateBranch: "VFS Canada New Delhi",
    ipAddress: "103.21.124.88",
    verificationChecklist: {
      verifyApplicantInfo: true,
      verifyPassportDetails: true,
      verifyUploadedDocuments: true,
      verifyPayment: true,
      assignOfficer: false
    },
    documents: [
      { name: "Passport Front & Back Bio Page", status: "Verified" },
      { name: "Photograph (35x45mm White BG)", status: "Verified" },
      { name: "Bank Statement (6 Months Certified)", status: "Verified" },
      { name: "Flight Reservation Voucher", status: "Verified" }
    ],
    actionNotes: [
      { id: "n1", author: "System", text: "New application logged online with 100% payment verification.", date: "Today 09:45 AM" }
    ]
  },
  {
    id: "2",
    appId: "APP-20260046",
    applicantName: "Rahul Sharma",
    firstName: "Rahul",
    lastName: "Sharma",
    passportNumber: "M1234567",
    passportIssueDate: "2021-08-15",
    passportExpiry: "2031-08-14",
    passportIssuingCountry: "India (RPO Chandigarh)",
    passportPlaceOfIssue: "Chandigarh",
    appliedBy: "Agent",
    agentName: "Apex Travels",
    country: "Australia",
    category: "Student",
    visaType: "Sticker Visa (Subclass 500)",
    submissionDate: "Today",
    submissionTime: "11:15 AM",
    documentsStatus: "Missing (1)",
    paymentStatus: "Paid",
    priority: "High",
    status: "New",
    dob: "1999-02-15",
    gender: "Male",
    maritalStatus: "Single",
    nationality: "Indian",
    countryOfResidence: "India",
    email: "rahul.sharma@outlook.com",
    phone: "+91 91234 56789",
    address: "House 12, Sector 17",
    city: "Chandigarh",
    purposeOfVisit: "Higher Education (Master's Degree)",
    travelDate: "2026-10-01",
    departureDate: "2028-09-30",
    durationOfStay: "2 Years",
    portOfEntry: "Melbourne Airport (MEL)",
    hotelDetails: "Monash University Hostel",
    occupation: "Student",
    employerName: "Full Time Graduate Scholar",
    designation: "N/A",
    annualIncome: "₹14,00,000 / year (Father)",
    sponsorType: "Family Sponsor",
    bankBalance: "₹22,50,000 (SBI Deposit)",
    governmentFee: "₹14,500",
    serviceFee: "₹3,500",
    taxAmount: "₹930",
    amountPaid: "₹18,930",
    transactionId: "TXN-8833441",
    paymentMethod: "Credit Card (HDFC)",
    paymentDate: "Today 11:10 AM",
    embassyTrackingId: "AUS-NEW-3312",
    embassySubmissionDate: "2026-08-12",
    appointmentDate: "2026-08-16",
    consulateBranch: "High Commission New Delhi",
    ipAddress: "49.207.210.15",
    verificationChecklist: {
      verifyApplicantInfo: true,
      verifyPassportDetails: true,
      verifyUploadedDocuments: false,
      verifyPayment: true,
      assignOfficer: false
    },
    documents: [
      { name: "Passport Bio Copy", status: "Verified" },
      { name: "University CoE Admission Letter", status: "Verified" },
      { name: "Health Insurance Proof (OSHC)", status: "Missing" }
    ],
    actionNotes: [
      { id: "n2", author: "Agent Apex", text: "OSHC insurance document pending upload from applicant.", date: "Today 11:15 AM" }
    ]
  },
  {
    id: "3",
    appId: "APP-20260047",
    applicantName: "Bikram Suman",
    firstName: "Bikram",
    lastName: "Suman",
    passportNumber: "K4567890",
    passportIssueDate: "2019-06-10",
    passportExpiry: "2029-06-09",
    passportIssuingCountry: "India (RPO Mumbai)",
    passportPlaceOfIssue: "Mumbai",
    appliedBy: "Self",
    country: "UAE",
    category: "Business",
    visaType: "Multiple Entry (30 Days)",
    submissionDate: "Yesterday",
    submissionTime: "04:30 PM",
    documentsStatus: "Complete",
    paymentStatus: "Pending",
    priority: "Urgent",
    status: "New",
    dob: "1988-06-25",
    gender: "Male",
    maritalStatus: "Married",
    nationality: "Indian",
    countryOfResidence: "India",
    email: "bikram.s@techsolutions.com",
    phone: "+91 99887 76655",
    address: "Plot 88, HITEC City",
    city: "Hyderabad, Telangana",
    purposeOfVisit: "Corporate Summit Conference",
    travelDate: "2026-08-12",
    departureDate: "2026-09-11",
    durationOfStay: "30 Days",
    portOfEntry: "Dubai Int'l Airport (DXB)",
    hotelDetails: "Armani Hotel Dubai",
    occupation: "Managing Director",
    employerName: "TechSolutions Pvt Ltd",
    designation: "Managing Director",
    annualIncome: "₹32,00,000 / year",
    sponsorType: "Company Sponsored",
    bankBalance: "₹18,40,000 (Kotak Corporate)",
    governmentFee: "₹6,000",
    serviceFee: "₹2,200",
    taxAmount: "₹470",
    amountPaid: "₹8,670",
    transactionId: "TXN-PENDING",
    paymentMethod: "Net Banking",
    paymentDate: "Yesterday 04:25 PM",
    embassyTrackingId: "UAE-GDRFA-7711",
    embassySubmissionDate: "2026-08-11",
    appointmentDate: "2026-08-14",
    consulateBranch: "UAE Consulate Mumbai",
    ipAddress: "122.170.89.4",
    verificationChecklist: {
      verifyApplicantInfo: true,
      verifyPassportDetails: true,
      verifyUploadedDocuments: true,
      verifyPayment: false,
      assignOfficer: false
    },
    documents: [
      { name: "Passport Bio Page", status: "Verified" },
      { name: "Company Cover Letter & License", status: "Verified" },
      { name: "UAE Host Invitation Letter", status: "Verified" }
    ],
    actionNotes: [
      { id: "n3", author: "Admin Vibhu", text: "Net Banking payment confirmation pending.", date: "Yesterday 04:30 PM" }
    ]
  }
];

export default function NewApplicationsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedByFilter, setAppliedByFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  // Records State
  const [newApps, setNewApps] = useState<NewApplicationRecord[]>(MOCK_NEW_APPLICATIONS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalApp, setActiveModalApp] = useState<NewApplicationRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // Add / Edit Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState<NewApplicationRecord | null>(null);

  const [formData, setFormData] = useState({
    applicantName: "",
    passportNumber: "",
    appliedBy: "Self" as "Self" | "Agent",
    agentName: "",
    country: "Canada",
    category: "Tourist",
    visaType: "eVisa",
    priority: "Normal" as "Normal" | "High" | "Urgent",
    paymentStatus: "Paid" as "Paid" | "Pending" | "Failed",
    email: "",
    phone: "",
    purposeOfVisit: "",
    travelDate: ""
  });

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredApps = newApps.filter((app) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      app.appId.toLowerCase().includes(q) ||
      app.applicantName.toLowerCase().includes(q) ||
      app.passportNumber.toLowerCase().includes(q) ||
      (app.email && app.email.toLowerCase().includes(q));

    const matchesAppliedBy = appliedByFilter === "All" || app.appliedBy === appliedByFilter;
    const matchesCountry = countryFilter === "All" || app.country === countryFilter;
    const matchesCategory = categoryFilter === "All" || app.category === categoryFilter;
    const matchesPriority = priorityFilter === "All" || app.priority === priorityFilter;

    return matchesQuery && matchesAppliedBy && matchesCountry && matchesCategory && matchesPriority;
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
  const handleAcceptProcessing = (app: NewApplicationRecord) => {
    setNewApps((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: "Accepted" } : a))
    );
    triggerToast(`Application ${app.appId} for ${app.applicantName} accepted for processing!`);
    if (activeModalApp?.id === app.id) {
      setActiveModalApp((prev) => (prev ? { ...prev, status: "Accepted" } : null));
    }
  };

  const handleRejectApp = (app: NewApplicationRecord) => {
    setNewApps((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: "Rejected" } : a))
    );
    triggerToast(`Application ${app.appId} rejected.`);
    if (activeModalApp?.id === app.id) {
      setActiveModalApp((prev) => (prev ? { ...prev, status: "Rejected" } : null));
    }
  };

  const handleDeleteRecord = (app: NewApplicationRecord) => {
    setNewApps((prev) => prev.filter((a) => a.id !== app.id));
    triggerToast(`Application record ${app.appId} deleted.`);
    if (activeModalApp?.id === app.id) setActiveModalApp(null);
  };

  const handleToggleChecklist = (field: keyof NewApplicationRecord["verificationChecklist"]) => {
    if (!activeModalApp) return;
    const updatedChecklist = {
      ...activeModalApp.verificationChecklist,
      [field]: !activeModalApp.verificationChecklist[field]
    };
    setActiveModalApp({ ...activeModalApp, verificationChecklist: updatedChecklist });
    setNewApps((prev) =>
      prev.map((a) => (a.id === activeModalApp.id ? { ...a, verificationChecklist: updatedChecklist } : a))
    );
    triggerToast("Verification checklist updated.");
  };

  const handleBulkAccept = () => {
    setNewApps((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, status: "Accepted" } : a))
    );
    triggerToast(`${selectedIds.length} new applications accepted for processing.`);
    setSelectedIds([]);
  };

  const handleBulkReject = () => {
    setNewApps((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, status: "Rejected" } : a))
    );
    triggerToast(`${selectedIds.length} applications rejected.`);
    setSelectedIds([]);
  };

  const handleSaveApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicantName || !formData.passportNumber) {
      triggerToast("Applicant Name and Passport Number are required.");
      return;
    }

    if (editingApp) {
      setNewApps((prev) =>
        prev.map((a) =>
          a.id === editingApp.id
            ? {
                ...a,
                applicantName: formData.applicantName,
                passportNumber: formData.passportNumber,
                appliedBy: formData.appliedBy,
                agentName: formData.agentName,
                country: formData.country,
                category: formData.category,
                visaType: formData.visaType,
                priority: formData.priority,
                paymentStatus: formData.paymentStatus,
                email: formData.email,
                phone: formData.phone,
                purposeOfVisit: formData.purposeOfVisit,
                travelDate: formData.travelDate
              }
            : a
        )
      );
      triggerToast(`Application ${editingApp.appId} updated.`);
    } else {
      const newRecord: NewApplicationRecord = {
        id: Date.now().toString(),
        appId: `APP-2026${Math.floor(1000 + Math.random() * 9000)}`,
        applicantName: formData.applicantName,
        passportNumber: formData.passportNumber,
        appliedBy: formData.appliedBy,
        agentName: formData.agentName,
        country: formData.country,
        category: formData.category,
        visaType: formData.visaType,
        submissionDate: "Today",
        submissionTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        documentsStatus: "Complete",
        paymentStatus: formData.paymentStatus,
        priority: formData.priority,
        status: "New",
        email: formData.email,
        phone: formData.phone,
        purposeOfVisit: formData.purposeOfVisit,
        travelDate: formData.travelDate,
        verificationChecklist: {
          verifyApplicantInfo: true,
          verifyPassportDetails: true,
          verifyUploadedDocuments: true,
          verifyPayment: true,
          assignOfficer: false
        },
        documents: [
          { name: "Passport Bio Page", status: "Verified" },
          { name: "Photograph", status: "Verified" }
        ]
      };
      setNewApps((prev) => [newRecord, ...prev]);
      triggerToast(`New application ${newRecord.appId} logged.`);
    }

    setShowAddModal(false);
    setEditingApp(null);
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 font-sans min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#0E1A2C] border border-[#2563EB]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
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
            <Sparkles size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              New Intake Audit & Initial Review Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            New Applications
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Review newly submitted visa applications awaiting initial verification and processing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingApp(null);
              setFormData({
                applicantName: "",
                passportNumber: "",
                appliedBy: "Self",
                agentName: "",
                country: "Canada",
                category: "Tourist",
                visaType: "eVisa",
                priority: "Normal",
                paymentStatus: "Paid",
                email: "",
                phone: "",
                purposeOfVisit: "",
                travelDate: ""
              });
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-white text-[#2563EB] hover:bg-blue-50 text-xs font-black rounded-xl shadow-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle size={16} /> Log New Application
          </button>
        </div>
      </div>

      {/* TOP STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 4 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">New Applications Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">28</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Fresh Submissions</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-[#2563EB] block mb-1">This Week</span>
            <div className="text-2xl font-black text-slate-900 font-mono">148</div>
            <span className="text-[10px] text-blue-600 font-bold">Weekly Intake</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Awaiting Review</span>
            <div className="text-2xl font-black text-slate-900 font-mono">95</div>
            <span className="text-[10px] text-amber-600 font-bold">In Verification Queue</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Assigned Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">18</div>
            <span className="text-[10px] text-emerald-600 font-bold">Passed to Officers</span>
          </div>
        </div>

        {/* RIGHT CARD: RECOMMENDED TABS & WORKFLOW FLOW (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Intake & Verification Pipeline
            </h3>
            <div className="space-y-1.5 text-[11px] text-slate-700 font-medium">
              {NEW_APPLICATION_WORKFLOW.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-[10px] shrink-0">
                    ▼
                  </div>
                  <span>{step}</span>
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
            <Filter size={16} className="text-[#2563EB]" /> Search & Intake Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredApps.length} of {newApps.length} New Applications
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH BY KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search By (ID, Applicant, Passport, Email)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="APP-20260045, Geeta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
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
              <option value="Self">Applicant (Self)</option>
              <option value="Agent">Agent Submitted</option>
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

          {/* PRIORITY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Priority Tier
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Priorities</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
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
            <span>New Applications Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkAccept}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 size={14} /> Accept Selected
            </button>
            <button
              onClick={handleBulkReject}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <XCircle size={14} /> Reject Selected
            </button>
            <button
              onClick={() => triggerToast(`Exporting data for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export List
            </button>
          </div>
        </div>
      )}

      {/* NEW APPLICATIONS TABLE */}
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
                <th className="py-3.5 px-4">Applied By</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Visa Category</th>
                <th className="py-3.5 px-4 font-mono">Submission Date</th>
                <th className="py-3.5 px-4">Documents</th>
                <th className="py-3.5 px-4 font-mono">Payment</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    <Sparkles size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No new applications found matching your filters.</p>
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
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {a.appliedBy === "Agent" ? (
                        <span className="text-purple-700 font-bold">Agent ({a.agentName})</span>
                      ) : (
                        <span className="text-slate-600">Self</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {a.country}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {a.category}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {a.submissionDate} ({a.submissionTime})
                    </td>
                    <td className="py-3.5 px-4">
                      {a.documentsStatus === "Complete" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                          ✓ Complete
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200">
                          ⚠️ï¸ {a.documentsStatus}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {a.paymentStatus === "Paid" ? (
                        <span className="text-emerald-600">🟢 Paid</span>
                      ) : (
                        <span className="text-amber-600">⏳ Pending</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        a.priority === "Urgent" ? "bg-red-50 text-red-600 border border-red-200" :
                        a.priority === "High" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-slate-100 text-slate-600"
                      }`}>
                        {a.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {a.status === "Accepted" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                          🟢 Accepted
                        </span>
                      ) : a.status === "Rejected" ? (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-red-200">
                          🔴 Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-blue-200">
                          🆕 New
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
                          title="View Details & Checklist"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleAcceptProcessing(a)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Accept for Processing"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          onClick={() => handleRejectApp(a)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Reject Application"
                        >
                          <XCircle size={15} />
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
          <div>Showing 1-10 of 245 New Applications</div>
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

      {/* CENTERED POPUP DETAILS MODAL WITH 8 RECOMMENDED TABS & INITIAL REVIEW CHECKLIST (FROM WIREFRAME) */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeModalApp.applicantName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700">
                      {activeModalApp.appId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{activeModalApp.country} &bull; {activeModalApp.category} ({activeModalApp.visaType})</p>
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
              {RECOMMENDED_VIEW_TABS.map((tab) => {
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
              {/* TAB 1: OVERVIEW & WORKFLOW */}
              {modalTab === "Overview" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* WORKFLOW STEPPER */}
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-3">New Application Lifecycle Stepper</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                      {NEW_APPLICATION_WORKFLOW.map((step, idx) => {
                        const isDone = idx <= 2;
                        return (
                          <div key={idx} className={`p-2 rounded-xl border text-center space-y-1 ${isDone ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                            <div className={`w-5 h-5 rounded-full mx-auto flex items-center justify-center font-bold text-[10px] ${isDone ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`}>{idx + 1}</div>
                            <p className="text-[9px] font-bold truncate">{step}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* APPLICATION OVERVIEW TILES */}
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-3">
                      Core Application Overview
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Application ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold text-sm">{activeModalApp.appId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Applicant Name</span>
                        <strong className="text-slate-900 font-bold">{activeModalApp.applicantName}</strong>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Passport Number</span>
                        <strong className="text-slate-900 font-mono font-bold">{activeModalApp.passportNumber}</strong>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Destination Country</span>
                        <strong className="text-slate-900 font-bold">{activeModalApp.country}</strong>
                      </div>
                    </div>
                  </div>

                  {/* INITIAL REVIEW CHECKLIST */}
                  <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <CheckSquare size={16} className="text-[#2563EB]" /> Initial Review Checklist
                    </h4>
                    <div className="space-y-2 text-xs font-semibold text-slate-800">
                      {[
                        { key: "verifyApplicantInfo", label: "Verify Applicant Information" },
                        { key: "verifyPassportDetails", label: "Verify Passport Details" },
                        { key: "verifyUploadedDocuments", label: "Verify Uploaded Documents" },
                        { key: "verifyPayment", label: "Verify Payment Gateway Status" },
                        { key: "assignOfficer", label: "Assign Processing Officer / Agent" }
                      ].map((item) => {
                        const checked = activeModalApp.verificationChecklist[item.key as keyof NewApplicationRecord["verificationChecklist"]];
                        return (
                          <label key={item.key} className="flex items-center gap-2.5 cursor-pointer p-2 bg-white rounded-xl border border-blue-100 hover:border-blue-300 transition">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleToggleChecklist(item.key as any)}
                              className="rounded border-slate-300 text-[#2563EB]"
                            />
                            <span className={checked ? "line-through text-slate-400" : "text-slate-800"}>
                              {item.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: APPLICANT & PASSPORT */}
              {(modalTab === "Applicant & Passport" || modalTab === "Applicant Details") && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">Personal Identity Profile</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Full Name</span><strong className="text-slate-900 font-bold">{activeModalApp.applicantName}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Given / First Name</span><strong className="text-slate-900 font-bold">{activeModalApp.firstName || activeModalApp.applicantName.split(" ")[0]}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Surname / Last Name</span><strong className="text-slate-900 font-bold">{activeModalApp.lastName || activeModalApp.applicantName.split(" ").slice(1).join(" ")}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Date of Birth</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.dob || "1994-08-12"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Gender</span><strong className="text-slate-900 font-bold">{activeModalApp.gender || "Female"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Marital Status</span><strong className="text-slate-900 font-bold">{activeModalApp.maritalStatus || "Single"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Nationality</span><strong className="text-slate-900 font-bold">{activeModalApp.nationality || "Indian"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Country of Residence</span><strong className="text-slate-900 font-bold">{activeModalApp.countryOfResidence || "India"}</strong></div>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 pt-2">Passport Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Passport Number</span><strong className="text-[#2563EB] font-mono font-bold">{activeModalApp.passportNumber}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Issue Date</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.passportIssueDate || "2020-04-12"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Expiry Date</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.passportExpiry || "2030-04-11"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Issuing Authority / Country</span><strong className="text-slate-900 font-bold">{activeModalApp.passportIssuingCountry || "India (RPO New Delhi)"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Place of Issue</span><strong className="text-slate-900 font-bold">{activeModalApp.passportPlaceOfIssue || "New Delhi"}</strong></div>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 pt-2">Contact Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Email Address</span><strong className="text-slate-900 font-bold">{activeModalApp.email || "geeta.bisht@gmail.com"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Mobile Number</span><strong className="text-slate-900 font-bold">{activeModalApp.phone || "+91 98123 45678"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Residential Address</span><strong className="text-slate-900 font-bold">{activeModalApp.address || "Flat 204, Rose Apartments, Dwarka"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">City &amp; State</span><strong className="text-slate-900 font-bold">{activeModalApp.city || "New Delhi, Delhi"}</strong></div>
                  </div>
                </div>
              )}

              {/* TAB 3: VISA & TRAVEL */}
              {(modalTab === "Visa & Travel" || modalTab === "Visa Information") && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">Visa Specification &amp; Travel Itinerary</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Destination Country</span><strong className="text-slate-900 font-bold">{activeModalApp.country}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Category</span><strong className="text-[#2563EB] font-bold">{activeModalApp.category}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Type</span><strong className="text-slate-900 font-bold">{activeModalApp.visaType}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Intended Travel Date</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.travelDate || "2026-09-20"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Expected Departure Date</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.departureDate || "2026-10-05"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Duration of Stay</span><strong className="text-slate-900 font-bold">{activeModalApp.durationOfStay || "15 Days"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Purpose of Visit</span><strong className="text-slate-900 font-bold">{activeModalApp.purposeOfVisit || "Vacation & Sightseeing"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Port of Entry</span><strong className="text-slate-900 font-bold">{activeModalApp.portOfEntry || "Vancouver Airport (YVR)"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Hotel / Accommodation</span><strong className="text-slate-900 font-bold">{activeModalApp.hotelDetails || "Pan Pacific Vancouver"}</strong></div>
                  </div>
                </div>
              )}

              {/* TAB 4: EMPLOYMENT & FINANCE */}
              {modalTab === "Employment & Finance" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">Employment Profile &amp; Financial Solvency</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Occupation / Profession</span><strong className="text-slate-900 font-bold">{activeModalApp.occupation || "Senior UX Designer"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Employer / Organization</span><strong className="text-slate-900 font-bold">{activeModalApp.employerName || "Digital Systems Tech"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Designation</span><strong className="text-slate-900 font-bold">{activeModalApp.designation || "Lead Consultant"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Annual Income</span><strong className="text-emerald-700 font-mono font-bold">{activeModalApp.annualIncome || "₹16,50,000 / year"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Trip Funding / Sponsor</span><strong className="text-[#2563EB] font-bold">{activeModalApp.sponsorType || "Self-Funded"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Bank Balance Proof</span><strong className="text-emerald-700 font-mono font-bold">{activeModalApp.bankBalance || "₹7,20,000 (ICICI Bank)"}</strong></div>
                  </div>
                </div>
              )}

              {/* TAB 5: UPLOADED DOCUMENTS */}
              {modalTab === "Uploaded Documents" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Uploaded Document Files Checklist
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(activeModalApp.documents || [
                      { name: "Passport Bio Page", status: "Verified" },
                      { name: "Photograph (White BG)", status: "Verified" },
                      { name: "Bank Statement (6 Months)", status: "Verified" },
                      { name: "Flight Reservation", status: "Verified" }
                    ]).map((doc, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                            <FileText size={16} />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{doc.name}</span>
                            <span className="text-[10px] text-slate-400">PDF &bull; 2.1 MB</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            doc.status === "Verified" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {doc.status}
                          </span>
                          <button onClick={() => triggerToast(`Viewing ${doc.name}`)} className="p-1.5 text-[#2563EB] hover:bg-blue-100 rounded-lg transition" title="Preview Document">
                            <Eye size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: PAYMENT & INVOICE */}
              {(modalTab === "Payment & Invoice" || modalTab === "Payment Details") && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">Billing &amp; Payment Gateway Summary</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Government Visa Fee</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.governmentFee || "₹8,500"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">VFS / Service Charge</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.serviceFee || "₹3,150"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">GST Tax (18%)</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.taxAmount || "₹700"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Total Amount Charged</span><strong className="text-[#2563EB] font-mono font-black text-sm">{activeModalApp.amountPaid || "₹12,350"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Transaction Reference ID</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.transactionId || "TXN-9988112"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Payment Channel</span><strong className="text-slate-900 font-bold">{activeModalApp.paymentMethod || "UPI (PhonePe)"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Payment Date &amp; Time</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.paymentDate || "Today 09:40 AM"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Gateway Status</span><strong className="text-emerald-600 font-bold">{activeModalApp.paymentStatus || "Paid"}</strong></div>
                  </div>
                </div>
              )}

              {/* TAB 7: EMBASSY & TRACKING */}
              {(modalTab === "Embassy & Tracking" || modalTab === "Embassy Submission") && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">Consulate &amp; VFS Tracking Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Embassy Reference ID</span><strong className="text-[#2563EB] font-mono font-bold">{activeModalApp.embassyTrackingId || "CAN-NEW-9901"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Embassy Submission Date</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.embassySubmissionDate || "2026-08-12"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Biometrics Appointment Date</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.appointmentDate || "2026-08-18"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">VFS / Embassy Center</span><strong className="text-slate-900 font-bold">{activeModalApp.consulateBranch || "VFS Canada New Delhi"}</strong></div>
                  </div>
                </div>
              )}

              {/* TAB 8: REVIEW CHECKLIST */}
              {modalTab === "Review Checklist" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">Application Initial Verification Checklist</h4>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                    {[
                      { key: "verifyApplicantInfo", label: "Verify Applicant Information & Contact" },
                      { key: "verifyPassportDetails", label: "Verify Passport Validity & Machine Readable Zone" },
                      { key: "verifyUploadedDocuments", label: "Verify Uploaded Document Clarity & Format" },
                      { key: "verifyPayment", label: "Verify Payment Gateway & Merchant Settlement" },
                      { key: "assignOfficer", label: "Assign Officer / Consular Agent" }
                    ].map((item) => {
                      const checked = activeModalApp.verificationChecklist[item.key as keyof NewApplicationRecord["verificationChecklist"]];
                      return (
                        <label key={item.key} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-blue-50/50 transition">
                          <input type="checkbox" checked={checked} onChange={() => handleToggleChecklist(item.key as any)} className="rounded border-slate-300 text-[#2563EB]" />
                          <span className={`font-semibold ${checked ? "line-through text-slate-400" : "text-slate-800"}`}>{item.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 9: ACTION NOTES */}
              {modalTab === "Action Notes" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">Internal Remarks &amp; Audit Stream</h4>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto [scrollbar-width:thin]">
                    {(activeModalApp.actionNotes || []).length === 0 ? (
                      <p className="text-slate-400 text-xs italic">No notes logged yet.</p>
                    ) : (
                      activeModalApp.actionNotes?.map((note) => (
                        <div key={note.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span className="font-bold text-[#2563EB]">{note.author}</span>
                            <span>{note.date}</span>
                          </div>
                          <p className="text-slate-800 text-xs font-medium">{note.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAcceptProcessing(activeModalApp)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} /> Accept for Processing
                </button>
                <button
                  onClick={() => handleRejectApp(activeModalApp)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <XCircle size={15} /> Reject Application
                </button>
              </div>

              <button
                onClick={() => {
                  setEditingApp(activeModalApp);
                  setShowAddModal(true);
                }}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 size={14} /> Edit Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT NEW APPLICATION FORM MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-black font-outfit flex items-center gap-2">
                <Sparkles size={18} />
                <span>{editingApp ? `Edit New Application: ${editingApp.appId}` : "Log New Application"}</span>
              </h3>

              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingApp(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* MODAL FORM BODY */}
            <form onSubmit={handleSaveApp} className="p-6 overflow-y-auto flex-1 text-xs space-y-6 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE]">
              {/* SECTION 1: APPLICANT INFORMATION */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Applicant Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Applicant Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Geeta Bisht"
                      value={formData.applicantName}
                      onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Passport Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Z9876543"
                      value={formData.passportNumber}
                      onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Applied By
                    </label>
                    <select
                      value={formData.appliedBy}
                      onChange={(e) => setFormData({ ...formData, appliedBy: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                    >
                      <option value="Self">Applicant (Self)</option>
                      <option value="Agent">Agent Submitted</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg shadow-[#2563EB]/25"
                >
                  {editingApp ? "Save Changes" : "Log Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
