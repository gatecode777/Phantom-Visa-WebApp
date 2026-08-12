import React, { useState } from "react";
import {
  UserCheck,
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
  BarChart2,
  Users
} from "lucide-react";

export interface AssignedApplicationRecord {
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
  country: string;
  category: string;
  visaType: string;
  assignedTo: string;
  assignedType: "Agent" | "Visa Officer";
  assignedBy: string;
  assignmentDate: string;
  expectedCompletionDate: string;
  priority: "Normal" | "High" | "Urgent";
  progress: number; // Percentage, e.g. 40, 80, 90
  status:
    | "Assigned"
    | "In Progress"
    | "Documents Pending"
    | "Waiting for Applicant"
    | "Review Completed"
    | "Ready for Approval"
    | "Completed";
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
  travelDate?: string;
  departureDate?: string;
  durationOfStay?: string;
  purposeOfVisit?: string;
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
  paymentStatus?: string;
  embassyTrackingId?: string;
  embassySubmissionDate?: string;
  appointmentDate?: string;
  consulateBranch?: string;
  milestones: {
    appReview: boolean;
    docVerification: boolean;
    paymentVerification: boolean;
    embassySubmission: boolean;
    visaDecision: boolean;
    visaIssue: boolean;
  };
  documents?: { name: string; status: "Verified" | "Pending" | "Rejected"; url?: string }[];
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_ASSIGNED_TABS = [
  "Overview",
  "Applicant & Passport",
  "Visa & Travel",
  "Employment & Finance",
  "Uploaded Documents",
  "Payment & Invoice",
  "Embassy & Tracking",
  "Processing Progress",
  "Action Notes"
];

export const ASSIGNMENT_WORKFLOW_STEPS = [
  "Application Submitted",
  "Intake Review",
  "Assigned Agent / Visa Officer",
  "Document Verification",
  "Embassy Submission",
  "Visa Decision",
  "Application Completed",
  "Finished"
];

const MOCK_ASSIGNED_APPLICATIONS: AssignedApplicationRecord[] = [
  {
    id: "1",
    appId: "APP-20261001",
    applicantName: "Geeta Bisht",
    firstName: "Geeta",
    lastName: "Bisht",
    passportNumber: "Z9876543",
    passportIssueDate: "2020-04-12",
    passportExpiry: "2030-04-11",
    passportIssuingCountry: "India (RPO New Delhi)",
    passportPlaceOfIssue: "New Delhi",
    country: "Canada",
    category: "Tourist",
    visaType: "eVisa (Multiple Entry)",
    assignedTo: "Amardeep Sen",
    assignedType: "Visa Officer",
    assignedBy: "Admin Vibhu",
    assignmentDate: "01 Aug 2026",
    expectedCompletionDate: "08 Aug 2026",
    priority: "Normal",
    progress: 40,
    status: "In Progress",
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
    paymentDate: "01 Aug 2026 10:14 AM",
    paymentStatus: "Paid",
    embassyTrackingId: "CAN-EMB-8831",
    embassySubmissionDate: "2026-08-03",
    appointmentDate: "2026-08-07",
    consulateBranch: "Canada VFS Global New Delhi",
    milestones: {
      appReview: true,
      docVerification: true,
      paymentVerification: true,
      embassySubmission: false,
      visaDecision: false,
      visaIssue: false
    },
    documents: [
      { name: "Passport Front & Back Bio Page", status: "Verified" },
      { name: "Photograph (35x45mm White BG)", status: "Verified" },
      { name: "Bank Statement (6 Months Certified)", status: "Verified" },
      { name: "Flight Reservation Voucher", status: "Verified" }
    ],
    actionNotes: [
      { id: "n1", author: "Amardeep Sen", text: "Verified bank statements and employment certificate.", date: "01 Aug 2026 02:30 PM" }
    ]
  },
  {
    id: "2",
    appId: "APP-20261002",
    applicantName: "Rahul Sharma",
    firstName: "Rahul",
    lastName: "Sharma",
    passportNumber: "M1234567",
    passportIssueDate: "2021-08-15",
    passportExpiry: "2031-08-14",
    passportIssuingCountry: "India (RPO Chandigarh)",
    passportPlaceOfIssue: "Chandigarh",
    country: "Australia",
    category: "Student",
    visaType: "Sticker Visa (Subclass 500)",
    assignedTo: "Devender Sharma",
    assignedType: "Agent",
    assignedBy: "System Auto-Assign",
    assignmentDate: "01 Aug 2026",
    expectedCompletionDate: "10 Aug 2026",
    priority: "High",
    progress: 80,
    status: "Review Completed",
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
    paymentDate: "01 Aug 2026 11:10 AM",
    paymentStatus: "Paid",
    embassyTrackingId: "AUS-SYD-4412",
    embassySubmissionDate: "2026-08-02",
    appointmentDate: "2026-08-05",
    consulateBranch: "High Commission New Delhi",
    milestones: {
      appReview: true,
      docVerification: true,
      paymentVerification: true,
      embassySubmission: true,
      visaDecision: true,
      visaIssue: false
    },
    documents: [
      { name: "Passport Bio Copy", status: "Verified" },
      { name: "University CoE Admission Letter", status: "Verified" },
      { name: "Financial Sponsorship Affidavit", status: "Verified" }
    ],
    actionNotes: [
      { id: "n2", author: "Devender Sharma", text: "Embassy submission complete. Grant decision pending.", date: "01 Aug 2026 04:15 PM" }
    ]
  },
  {
    id: "3",
    appId: "APP-20261003",
    applicantName: "Bikram Suman",
    firstName: "Bikram",
    lastName: "Suman",
    passportNumber: "K4567890",
    passportIssueDate: "2019-06-10",
    passportExpiry: "2029-06-09",
    passportIssuingCountry: "India (RPO Mumbai)",
    passportPlaceOfIssue: "Mumbai",
    country: "UAE",
    category: "Business",
    visaType: "Multiple Entry (30 Days)",
    assignedTo: "V. Verma",
    assignedType: "Visa Officer",
    assignedBy: "Admin Vibhu",
    assignmentDate: "31 Jul 2026",
    expectedCompletionDate: "04 Aug 2026",
    priority: "Urgent",
    progress: 90,
    status: "Ready for Approval",
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
    transactionId: "TXN-771199",
    paymentMethod: "Net Banking",
    paymentDate: "31 Jul 2026 04:25 PM",
    paymentStatus: "Paid",
    embassyTrackingId: "UAE-GDRFA-7711",
    embassySubmissionDate: "2026-07-31",
    appointmentDate: "2026-08-02",
    consulateBranch: "UAE Consulate Mumbai",
    milestones: {
      appReview: true,
      docVerification: true,
      paymentVerification: true,
      embassySubmission: true,
      visaDecision: true,
      visaIssue: true
    },
    documents: [
      { name: "Passport Bio Page", status: "Verified" },
      { name: "Company Cover Letter & License", status: "Verified" },
      { name: "UAE Host Invitation Letter", status: "Verified" }
    ],
    actionNotes: [
      { id: "n3", author: "V. Verma", text: "Approved by consulate. Final visa copy uploaded.", date: "31 Jul 2026 06:00 PM" }
    ]
  }
];

export default function AssignedApplicationsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [assignedTypeFilter, setAssignedTypeFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Records State
  const [assignedApps, setAssignedApps] = useState<AssignedApplicationRecord[]>(MOCK_ASSIGNED_APPLICATIONS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Popup Modal State
  const [activeModalApp, setActiveModalApp] = useState<AssignedApplicationRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // Reassign Modal State
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignTargetApp, setReassignTargetApp] = useState<AssignedApplicationRecord | null>(null);
  const [newAssignee, setNewAssignee] = useState("Amardeep Sen");

  // New Note State inside Modal
  const [newNoteText, setNewNoteText] = useState("");

  // Edit Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState<AssignedApplicationRecord | null>(null);

  const [formData, setFormData] = useState({
    applicantName: "",
    passportNumber: "",
    country: "Canada",
    category: "Tourist",
    visaType: "eVisa",
    assignedTo: "Amardeep Sen",
    assignedType: "Visa Officer" as "Agent" | "Visa Officer",
    priority: "Normal" as "Normal" | "High" | "Urgent",
    status: "In Progress" as AssignedApplicationRecord["status"],
    progress: 40
  });

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredApps = assignedApps.filter((app) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      app.appId.toLowerCase().includes(q) ||
      app.applicantName.toLowerCase().includes(q) ||
      app.passportNumber.toLowerCase().includes(q) ||
      app.assignedTo.toLowerCase().includes(q) ||
      app.country.toLowerCase().includes(q);

    const matchesType = assignedTypeFilter === "All" || app.assignedType === assignedTypeFilter;
    const matchesCountry = countryFilter === "All" || app.country === countryFilter;
    const matchesCategory = categoryFilter === "All" || app.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || app.priority === priorityFilter;

    return matchesQuery && matchesType && matchesCountry && matchesCategory && matchesStatus && matchesPriority;
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
  const handleMarkCompleted = (app: AssignedApplicationRecord) => {
    setAssignedApps((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: "Completed", progress: 100 } : a))
    );
    triggerToast(`Assignment for ${app.appId} marked as Completed!`);
    if (activeModalApp?.id === app.id) {
      setActiveModalApp((prev) => (prev ? { ...prev, status: "Completed", progress: 100 } : null));
    }
  };

  const handleDeleteRecord = (app: AssignedApplicationRecord) => {
    setAssignedApps((prev) => prev.filter((a) => a.id !== app.id));
    triggerToast(`Assignment record ${app.appId} deleted.`);
    if (activeModalApp?.id === app.id) setActiveModalApp(null);
  };

  const handleOpenReassign = (app: AssignedApplicationRecord) => {
    setReassignTargetApp(app);
    setShowReassignModal(true);
  };

  const handleConfirmReassign = () => {
    if (!reassignTargetApp) return;
    setAssignedApps((prev) =>
      prev.map((a) => (a.id === reassignTargetApp.id ? { ...a, assignedTo: newAssignee } : a))
    );
    triggerToast(`Application ${reassignTargetApp.appId} reassigned to ${newAssignee}.`);
    if (activeModalApp?.id === reassignTargetApp.id) {
      setActiveModalApp((prev) => (prev ? { ...prev, assignedTo: newAssignee } : null));
    }
    setShowReassignModal(false);
    setReassignTargetApp(null);
  };

  const handleAddNote = () => {
    if (!newNoteText || !activeModalApp) return;
    const noteObj = {
      id: Date.now().toString(),
      author: "Admin (Vibhu)",
      text: newNoteText,
      date: new Date().toLocaleString()
    };
    const updatedNotes = [...(activeModalApp.actionNotes || []), noteObj];
    setActiveModalApp({ ...activeModalApp, actionNotes: updatedNotes });
    setAssignedApps((prev) =>
      prev.map((a) => (a.id === activeModalApp.id ? { ...a, actionNotes: updatedNotes } : a))
    );
    setNewNoteText("");
    triggerToast("Action note recorded.");
  };

  const handleBulkReassign = () => {
    setAssignedApps((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, assignedTo: "Amardeep Sen" } : a))
    );
    triggerToast(`${selectedIds.length} assignments reassigned to Amardeep Sen.`);
    setSelectedIds([]);
  };

  const handleBulkComplete = () => {
    setAssignedApps((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, status: "Completed", progress: 100 } : a))
    );
    triggerToast(`${selectedIds.length} assignments marked as Completed.`);
    setSelectedIds([]);
  };

  const handleSaveApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicantName || !formData.passportNumber) {
      triggerToast("Applicant Name and Passport Number are required.");
      return;
    }

    if (editingApp) {
      setAssignedApps((prev) =>
        prev.map((a) =>
          a.id === editingApp.id
            ? {
                ...a,
                applicantName: formData.applicantName,
                passportNumber: formData.passportNumber,
                country: formData.country,
                category: formData.category,
                visaType: formData.visaType,
                assignedTo: formData.assignedTo,
                assignedType: formData.assignedType,
                priority: formData.priority,
                status: formData.status,
                progress: formData.progress
              }
            : a
        )
      );
      triggerToast(`Assignment for ${editingApp.appId} updated.`);
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
            <UserCheck size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Workforce Task Delegation & SLA Tracker
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Assigned Applications
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Monitor and manage visa applications assigned to agents and visa processing officers.
          </p>
        </div>
      </div>

      {/* TOP STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Assigned</span>
            <div className="text-2xl font-black text-slate-900 font-mono">1,240</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Delegated Queue</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Assigned to Agents</span>
            <div className="text-2xl font-black text-slate-900 font-mono">910</div>
            <span className="text-[10px] text-purple-600 font-bold">External Channel</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Assigned to Officers</span>
            <div className="text-2xl font-black text-slate-900 font-mono">330</div>
            <span className="text-[10px] text-blue-600 font-bold">Internal Processing</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Completed Assignment</span>
            <div className="text-2xl font-black text-slate-900 font-mono">860</div>
            <span className="text-[10px] text-emerald-600 font-bold">SLAs Fulfilled</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Processing / In Review</span>
            <div className="text-2xl font-black text-slate-900 font-mono">334</div>
            <span className="text-[10px] text-amber-600 font-bold">Active Handling</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Overdue Applications</span>
            <div className="text-2xl font-black text-slate-900 font-mono">46</div>
            <span className="text-[10px] text-red-600 font-bold">SLA Breach Warning</span>
          </div>
        </div>

        {/* RIGHT CARD: RECOMMENDED TABS & WORKFLOW FLOW (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Assignment Workflow Steps
            </h3>
            <div className="space-y-1 text-[11px] text-slate-700 font-medium">
              {ASSIGNMENT_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                    {idx + 1}
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
            <Filter size={16} className="text-[#2563EB]" /> Search & Delegation Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredApps.length} of {assignedApps.length} Assigned Applications
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search By (ID, Applicant, Agent, Officer)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="APP-20261001, Amardeep..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* ASSIGNMENT TYPE */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Assignment Type
            </label>
            <select
              value={assignedTypeFilter}
              onChange={(e) => setAssignedTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Types</option>
              <option value="Visa Officer">Visa Officer</option>
              <option value="Agent">Agent</option>
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

          {/* STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Assignment Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Review Completed">Review Completed</option>
              <option value="Ready for Approval">Ready for Approval</option>
              <option value="Completed">Completed</option>
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
            <span>Assigned Applications Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkReassign}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <UserPlus size={14} /> Reassign Selected
            </button>
            <button
              onClick={handleBulkComplete}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 size={14} /> Mark Completed
            </button>
            <button
              onClick={() => triggerToast(`Exporting data for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Applications
            </button>
          </div>
        </div>
      )}

      {/* ASSIGNED APPLICATIONS TABLE */}
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
                <th className="py-3.5 px-4">Assigned To</th>
                <th className="py-3.5 px-4 font-mono">Assignment Date</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4 font-mono text-center">Progress</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <UserCheck size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No assigned applications found matching your filters.</p>
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
                    <td className="py-3.5 px-4 font-bold text-[#2563EB]">
                      {a.assignedTo}
                      <span className="block text-[10px] text-slate-400 font-normal">{a.assignedType}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {a.assignmentDate}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        a.priority === "Urgent" ? "bg-red-50 text-red-600 border border-red-200" :
                        a.priority === "High" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-slate-100 text-slate-600"
                      }`}>
                        {a.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-center">
                      <div className="w-16 bg-slate-100 rounded-full h-2.5 mx-auto overflow-hidden border border-slate-200 mb-0.5">
                        <div
                          className="bg-[#2563EB] h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${a.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">{a.progress}%</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {a.status === "Completed" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                          <CheckCircle2 size={11} /> Completed
                        </span>
                      ) : a.status === "Ready for Approval" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                          <CheckCircle2 size={11} /> Ready for Approval
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-blue-200">
                          <Clock size={11} /> {a.status}
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
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleOpenReassign(a)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          title="Reassign Officer / Agent"
                        >
                          <UserPlus size={15} />
                        </button>
                        <button
                          onClick={() => handleMarkCompleted(a)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Mark Completed"
                        >
                          <CheckCircle2 size={15} />
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
          <div>Showing 1 to 10 of 325 Assigned Applications</div>
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

      {/* CENTERED POPUP DETAILS MODAL (9 RECOMMENDED TABS FROM WIREFRAME) */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                  <UserCheck size={20} />
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
                  <p className="text-xs text-slate-400">Assigned To: <strong className="text-blue-300">{activeModalApp.assignedTo}</strong> ({activeModalApp.assignedType})</p>
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
              {RECOMMENDED_ASSIGNED_TABS.map((tab) => {
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
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-3">Assigned Application Lifecycle Stepper</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                      {ASSIGNMENT_WORKFLOW_STEPS.map((step, idx) => {
                        const isDone = idx <= Math.floor((activeModalApp.progress / 100) * 8);
                        return (
                          <div key={idx} className={`p-2 rounded-xl border text-center space-y-1 ${isDone ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                            <div className={`w-5 h-5 rounded-full mx-auto flex items-center justify-center font-bold text-[10px] ${isDone ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`}>{idx + 1}</div>
                            <p className="text-[9px] font-bold truncate">{step}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Assignment &amp; Core Summary
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Application ID</span>
                      <strong className="text-[#2563EB] font-mono font-bold text-sm">{activeModalApp.appId}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Assigned Officer / Agent</span>
                      <strong className="text-[#2563EB] font-bold">{activeModalApp.assignedTo} ({activeModalApp.assignedType})</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Assigned By</span>
                      <strong className="text-slate-900 font-bold">{activeModalApp.assignedBy}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Assignment Date</span>
                      <strong className="text-slate-900 font-mono font-bold">{activeModalApp.assignmentDate}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Expected Completion</span>
                      <strong className="text-slate-900 font-mono font-bold">{activeModalApp.expectedCompletionDate}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Priority &amp; Progress</span>
                      <strong className="text-purple-600 font-bold">{activeModalApp.priority} &bull; {activeModalApp.progress}% Completed</strong>
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

                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 pt-2">Contact Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Email Address</span><strong className="text-slate-900 font-bold">{activeModalApp.email || "geeta.bisht@gmail.com"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Mobile Number</span><strong className="text-slate-900 font-bold">{activeModalApp.phone || "+91 98123 45678"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Residential Address</span><strong className="text-slate-900 font-bold">{activeModalApp.address || "Flat 204, Rose Apartments, Dwarka"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">City &amp; State</span><strong className="text-slate-900 font-bold">{activeModalApp.city || "New Delhi, Delhi"}</strong></div>
                  </div>
                </div>
              )}

              {/* TAB 3: VISA & TRAVEL */}
              {(modalTab === "Visa & Travel" || modalTab === "Visa Details") && (
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
              {(modalTab === "Uploaded Documents" || modalTab === "Documents") && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Uploaded Document Verification Checklist
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(activeModalApp.documents || [
                      { name: "Passport Bio Page", status: "Verified" },
                      { name: "Photograph (White BG)", status: "Verified" },
                      { name: "Bank Statement (6 Months)", status: "Verified" },
                      { name: "Flight Reservation Voucher", status: "Verified" }
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
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Payment Date &amp; Time</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.paymentDate || "01 Aug 2026 10:14 AM"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Gateway Status</span><strong className="text-emerald-600 font-bold">{activeModalApp.paymentStatus || "Paid"}</strong></div>
                  </div>
                </div>
              )}

              {/* TAB 7: EMBASSY & TRACKING */}
              {(modalTab === "Embassy & Tracking" || modalTab === "Embassy Submission") && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">Consulate &amp; VFS Tracking Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Embassy Reference ID</span><strong className="text-[#2563EB] font-mono font-bold">{activeModalApp.embassyTrackingId || "CAN-EMB-8831"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Embassy Submission Date</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.embassySubmissionDate || "2026-08-03"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Biometrics Appointment Date</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.appointmentDate || "2026-08-07"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">VFS / Embassy Center</span><strong className="text-slate-900 font-bold">{activeModalApp.consulateBranch || "Canada VFS Global New Delhi"}</strong></div>
                  </div>
                </div>
              )}

              {/* TAB 8: PROCESSING PROGRESS */}
              {modalTab === "Processing Progress" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Milestone Progress Tracking
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: "appReview", label: "Application Review" },
                      { key: "docVerification", label: "Document Verification" },
                      { key: "paymentVerification", label: "Payment Verification" },
                      { key: "embassySubmission", label: "Embassy Submission" },
                      { key: "visaDecision", label: "Embassy Visa Decision" },
                      { key: "visaIssue", label: "Visa Issue / Stamping" }
                    ].map((m) => {
                      const done = activeModalApp.milestones[m.key as keyof typeof activeModalApp.milestones];
                      return (
                        <div key={m.key} className={`p-3 rounded-2xl border flex items-center justify-between font-bold ${
                          done ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-50 border-slate-200 text-slate-500"
                        }`}>
                          <span>{m.label}</span>
                          <span>{done ? "✓ Completed" : "⏳ Pending"}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 9: ACTION NOTES */}
              {modalTab === "Action Notes" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">Internal Officer Remarks &amp; Audit Stream</h4>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto [scrollbar-width:thin]">
                    {(activeModalApp.actionNotes || []).length === 0 ? (
                      <p className="text-slate-400 text-xs italic">No internal notes logged yet.</p>
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
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <input type="text" placeholder="Add an officer note..." value={newNoteText} onChange={(e) => setNewNoteText(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2563EB]" />
                    <button onClick={handleAddNote} className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold cursor-pointer">Add Note</button>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenReassign(activeModalApp)}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus size={15} /> Reassign Officer
                </button>
                <button
                  onClick={() => handleMarkCompleted(activeModalApp)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} /> Mark Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REASSIGN MODAL */}
      {showReassignModal && reassignTargetApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-black text-slate-900 font-outfit flex items-center gap-2">
              <UserPlus size={18} className="text-[#2563EB]" />
              <span>Reassign Application: {reassignTargetApp.appId}</span>
            </h3>

            <div className="space-y-2 text-xs">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 block">Select Officer / Agent</label>
              <select
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800"
              >
                <option value="Amardeep Sen">Amardeep Sen (Visa Officer)</option>
                <option value="Devender Sharma">Devender Sharma (Agent)</option>
                <option value="V. Verma">V. Verma (Visa Officer)</option>
                <option value="Global Visa Solutions">Global Visa Solutions (Agent)</option>
              </select>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setShowReassignModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReassign}
                className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg"
              >
                Confirm Reassignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
