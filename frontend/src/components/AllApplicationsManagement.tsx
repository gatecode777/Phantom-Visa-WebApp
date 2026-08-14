import React, { useState, useEffect } from "react";
import { useVisa } from "../context/VisaContext";
import {
  ClipboardList,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
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
  UserCheck,
  Tag,
  CheckSquare
} from "lucide-react";

const API_V1_URL = "http://localhost:5000/api/v1";

export interface ApplicationRecord {
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
  appliedBy: "User" | "Agent";
  agentName?: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  country: string;
  category: string;
  visaType: string;
  submissionDate: string;
  paymentStatus: "Paid" | "Pending" | "Failed" | "Refunded";
  status:
  | "Pending Review"
  | "Under Review"
  | "Document Pending"
  | "Awaiting Payment"
  | "Processing"
  | "Approved"
  | "Rejected"
  | "Visa Issued"
  | "Completed";
  priority: "Regular" | "Express" | "High" | "Urgent";
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
  transactionId?: string;
  paymentMethod?: string;
  amountPaid?: string;
  paymentDate?: string;
  embassyTrackingId?: string;
  embassySubmissionDate?: string;
  appointmentDate?: string;
  consulateBranch?: string;
  documents?: { name: string; status: "Verified" | "Pending" | "Rejected"; url?: string }[];
  actionNotes?: { id: string; author: string; text: string; date: string }[];
  history?: { stage: string; date: string; updatedBy: string }[];
  rejectionReason?: string;
}

export const RECOMMENDED_APPLICATION_TABS = [
  "Overview",
  "Applicant & Passport",
  "Visa & Travel",
  "Employment & Finance",
  "Uploaded Documents",
  "Payment & Invoice",
  "Embassy & Tracking",
  "Action Notes"
];

export const APPLICATION_WORKFLOW_STEPS = [
  "Application Submitted",
  "Document Verification",
  "Payment Processing",
  "Assigned to Agent / Admin",
  "Application Review",
  "Embassy Submission",
  "Visa Approved",
  "Completed"
];

const MOCK_APPLICATIONS: ApplicationRecord[] = [
  {
    id: "1",
    appId: "APP-100451",
    applicantName: "Swapnil Joshi",
    firstName: "Swapnil",
    lastName: "Joshi",
    passportNumber: "Z9876543",
    passportIssueDate: "2020-04-12",
    passportExpiry: "2030-04-11",
    passportIssuingCountry: "India (RPO Mumbai)",
    passportPlaceOfIssue: "Mumbai",
    appliedBy: "User",
    country: "Canada",
    category: "Tourist",
    visaType: "eVisa (Multiple Entry)",
    submissionDate: "28-07-2026",
    paymentStatus: "Paid",
    status: "Under Review",
    priority: "Express",
    dob: "1992-05-14",
    gender: "Male",
    maritalStatus: "Single",
    nationality: "Indian",
    countryOfResidence: "India",
    email: "swapnil.j@gmail.com",
    phone: "+91 98765 43210",
    address: "B-402, Green Park, Andheri East",
    city: "Mumbai, Maharashtra",
    travelDate: "2026-09-15",
    departureDate: "2026-09-30",
    durationOfStay: "15 Days",
    purposeOfVisit: "Tourism & Sightseeing",
    portOfEntry: "Toronto Pearson Int'l Airport (YYZ)",
    hotelDetails: "Fairmont Royal York, Toronto",
    occupation: "Senior Software Engineer",
    employerName: "TechSolutions Pvt Ltd",
    designation: "Lead Developer",
    annualIncome: "₹18,50,000 / year",
    sponsorType: "Self-Funded",
    bankBalance: "₹6,85,000 (HDFC Bank)",
    governmentFee: "₹8,500",
    serviceFee: "₹3,150",
    taxAmount: "₹700",
    amountPaid: "₹12,350",
    transactionId: "TXN-9988112",
    paymentMethod: "UPI",
    embassyTrackingId: "CAN-EMB-8831",
    embassySubmissionDate: "2026-07-29",
    appointmentDate: "2026-08-05",
    consulateBranch: "Canada VFS Global Mumbai",
    documents: [
      { name: "Passport Front & Back Bio Page", status: "Verified" },
      { name: "Bank Statement (6 Months Certified)", status: "Verified" },
      { name: "Flight Reservation Ticket", status: "Verified" },
      { name: "Hotel Booking Confirmation Vouchers", status: "Verified" },
      { name: "White Background Passport Photo (35x45mm)", status: "Verified" }
    ],
    actionNotes: [
      { id: "n1", author: "Admin (Vibhu)", text: "Initial document review complete. Financials and bank statement verified.", date: "2026-07-29 10:30 AM" }
    ],
    history: [
      { stage: "Submitted", date: "28-07-2026", updatedBy: "System" },
      { stage: "Payment Verified", date: "28-07-2026", updatedBy: "Payment Gateway" },
      { stage: "Under Review", date: "29-07-2026", updatedBy: "Admin Vibhu" }
    ]
  },
  {
    id: "2",
    appId: "APP-100452",
    applicantName: "Rahul Sharma",
    firstName: "Rahul",
    lastName: "Sharma",
    passportNumber: "M1234567",
    passportIssueDate: "2021-08-15",
    passportExpiry: "2031-08-14",
    passportIssuingCountry: "India (RPO Delhi)",
    passportPlaceOfIssue: "New Delhi",
    appliedBy: "Agent",
    agentName: "Global Visa Solutions",
    country: "Australia",
    category: "Student",
    visaType: "Sticker Visa (Subclass 500)",
    submissionDate: "29-07-2026",
    paymentStatus: "Paid",
    status: "Approved",
    priority: "High",
    dob: "1998-11-20",
    gender: "Male",
    maritalStatus: "Single",
    nationality: "Indian",
    countryOfResidence: "India",
    email: "rahul.sharma@outlook.com",
    phone: "+91 91234 56789",
    address: "House 12, Sector 17",
    city: "Chandigarh",
    travelDate: "2026-10-01",
    departureDate: "2028-09-30",
    durationOfStay: "2 Years",
    purposeOfVisit: "Higher Education (Master's Degree)",
    portOfEntry: "Sydney Kingsford Smith Airport (SYD)",
    hotelDetails: "University Student Accommodation Sydney",
    occupation: "Student",
    employerName: "N/A (Full Time Student)",
    designation: "Graduate Scholar",
    annualIncome: "₹12,00,000 / year (Sponsor)",
    sponsorType: "Family Sponsor (Father)",
    bankBalance: "₹24,50,000 (SBI Fixed Deposit)",
    governmentFee: "₹14,500",
    serviceFee: "₹3,500",
    taxAmount: "₹930",
    amountPaid: "₹18,930",
    transactionId: "TXN-7733441",
    paymentMethod: "Credit Card",
    embassyTrackingId: "AUS-SYD-4412",
    embassySubmissionDate: "2026-07-30",
    appointmentDate: "2026-08-02",
    consulateBranch: "Australian High Commission New Delhi",
    documents: [
      { name: "Passport Copy", status: "Verified" },
      { name: "University CoE Admission Letter", status: "Verified" },
      { name: "IELTS Scorecard (7.5 Overall)", status: "Verified" },
      { name: "Financial Sponsorship Affidavit", status: "Verified" }
    ],
    actionNotes: [
      { id: "n2", author: "Agent Global", text: "Client cleared medicals. Final grant issued by Home Affairs.", date: "2026-07-30 04:15 PM" }
    ],
    history: [
      { stage: "Submitted by Agent", date: "29-07-2026", updatedBy: "Agent Global" },
      { stage: "Visa Granted", date: "30-07-2026", updatedBy: "Australian Embassy" }
    ]
  },
  {
    id: "3",
    appId: "APP-100453",
    applicantName: "Rohit Verma",
    firstName: "Rohit",
    lastName: "Verma",
    passportNumber: "K4567890",
    passportIssueDate: "2019-01-10",
    passportExpiry: "2029-01-09",
    passportIssuingCountry: "India (RPO Hyderabad)",
    passportPlaceOfIssue: "Hyderabad",
    appliedBy: "User",
    country: "UAE",
    category: "Business",
    visaType: "Multiple Entry (30 Days)",
    submissionDate: "30-07-2026",
    paymentStatus: "Pending",
    status: "Processing",
    priority: "Urgent",
    dob: "1987-03-08",
    gender: "Male",
    maritalStatus: "Married",
    nationality: "Indian",
    countryOfResidence: "India",
    email: "rohit.verma@techcorp.in",
    phone: "+91 99887 76655",
    address: "Plot 88, HITEC City",
    city: "Hyderabad, Telangana",
    travelDate: "2026-08-10",
    departureDate: "2026-09-09",
    durationOfStay: "30 Days",
    purposeOfVisit: "Corporate Trade Summit & Meetings",
    portOfEntry: "Dubai International Airport (DXB)",
    hotelDetails: "Jumeirah Emirates Towers, Dubai",
    occupation: "Business Owner / Managing Director",
    employerName: "TechCorp Solutions Pvt Ltd",
    designation: "Managing Director",
    annualIncome: "₹35,00,000 / year",
    sponsorType: "Company Sponsored",
    bankBalance: "₹14,20,000 (ICICI Corporate Account)",
    governmentFee: "₹6,000",
    serviceFee: "₹2,200",
    taxAmount: "₹470",
    amountPaid: "₹8,670",
    transactionId: "TXN-PENDING",
    paymentMethod: "Net Banking",
    documents: [
      { name: "Passport Bio Page", status: "Verified" },
      { name: "Company Cover Letter & Trade License", status: "Verified" },
      { name: "UAE Host Invitation Letter", status: "Pending" }
    ],
    actionNotes: [
      { id: "n3", author: "Admin Vibhu", text: "Waiting for host company invitation letter.", date: "2026-07-30 02:00 PM" }
    ],
    history: [
      { stage: "Submitted", date: "30-07-2026", updatedBy: "System" },
      { stage: "Processing Initiated", date: "30-07-2026", updatedBy: "Admin Vibhu" }
    ]
  }
];

const mapMongoAppToRecord = (app: any): ApplicationRecord => ({
  id: app._id || app.applicationId || String(Math.random()),
  appId: app.applicationId || `VO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
  applicantName: app.personalDetails ? `${app.personalDetails.givenName} ${app.personalDetails.surname}` : app.travelerName || "Applicant",
  firstName: app.personalDetails?.givenName || app.travelerName?.split(" ")[0] || "Applicant",
  lastName: app.personalDetails?.surname || app.travelerName?.split(" ").slice(1).join(" ") || "",
  passportNumber: app.passportDetails?.passportNo || app.passportNumber || "Z9876543",
  passportIssueDate: app.passportDetails?.issueDate || "2020-01-15",
  passportExpiry: app.passportDetails?.expiryDate || app.passportExpiry || "2030-01-14",
  passportIssuingCountry: app.passportDetails?.issuingCountry || "India",
  passportPlaceOfIssue: app.passportDetails?.placeOfIssue || "New Delhi",
  appliedBy: app.appliedBy || "User",
  agentName: app.agentName || app.assignedAgentName || "",
  assignedAgentId: app.assignedAgentId || "",
  assignedAgentName: app.assignedAgentName || "",
  country: app.countryName || app.destination || "Australia",
  category: app.categoryName || "Tourist Visa",
  visaType: app.visaTypeName || app.visaType || "Standard Visitor",
  submissionDate: app.createdAt ? new Date(app.createdAt).toISOString().split("T")[0] : app.submissionDate || "2026-08-07",
  paymentStatus: app.paymentStatus || "Paid",
  status: (app.status as any) || "Submitted",
  priority: app.processingSpeed === "vip" ? "Urgent" : app.processingSpeed === "express" ? "Express" : "Regular",
  dob: app.personalDetails?.dob || app.dob || "1992-05-14",
  gender: app.personalDetails?.gender || app.gender || "Male",
  maritalStatus: app.personalDetails?.maritalStatus || "Single",
  nationality: app.personalDetails?.nationality || app.nationality || "Indian",
  email: app.personalDetails?.email || app.email || "",
  phone: app.personalDetails?.phone || app.phone || "",
  address: app.travelDetails?.hostAddress || app.address || "",
  travelDate: app.travelDetails?.travelDate || app.travelDates || "",
  durationOfStay: app.stayValidity || "60 Days",
  amountPaid: app.pricing?.totalAmount ? `₹${Number(app.pricing.totalAmount).toLocaleString("en-IN")}` : `₹${Number(app.fees || 11700).toLocaleString("en-IN")}`,
  documents: Array.isArray(app.uploadedDocuments)
    ? app.uploadedDocuments.map((d: any) => ({ name: d.title, status: d.fileUrl ? "Verified" : "Pending" }))
    : [
      { name: "Passport Bio Page", status: "Verified" },
      { name: "Bank Statement (6 Months)", status: "Verified" },
      { name: "Flight Reservation", status: "Verified" },
      { name: "Hotel Booking Confirmation", status: "Verified" }
    ]
});

export default function AllApplicationsManagement() {
  const { applications: contextApps } = useVisa();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [appliedByFilter, setAppliedByFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Records State
  const [applications, setApplications] = useState<ApplicationRecord[]>(MOCK_APPLICATIONS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Fetch live MongoDB applications on mount & context updates
  useEffect(() => {
    const fetchLiveApps = async () => {
      try {
        const res = await fetch(`${API_V1_URL}/applications`);
        const json = await res.json();
        if (res.ok && Array.isArray(json.data) && json.data.length > 0) {
          const mapped = json.data.map(mapMongoAppToRecord);
          setApplications(mapped);
          return;
        }
      } catch (err) {
        console.error("Failed to fetch live applications from MongoDB:", err);
      }

      if (Array.isArray(contextApps) && contextApps.length > 0) {
        setApplications(contextApps.map(mapMongoAppToRecord));
      }
    };

    fetchLiveApps();
  }, [contextApps]);

  // Centered Details Popup Modal State
  const [activeModalApp, setActiveModalApp] = useState<ApplicationRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // Rejection reason modal state
  const [rejectDialogApp, setRejectDialogApp] = useState<ApplicationRecord | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectReasonError, setRejectReasonError] = useState("");

  // New Note Input inside Modal
  const [newNoteText, setNewNoteText] = useState("");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredApps = applications.filter((app) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      app.appId.toLowerCase().includes(q) ||
      app.applicantName.toLowerCase().includes(q) ||
      app.passportNumber.toLowerCase().includes(q) ||
      (app.agentName && app.agentName.toLowerCase().includes(q)) ||
      app.country.toLowerCase().includes(q) ||
      app.category.toLowerCase().includes(q) ||
      app.visaType.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    const matchesPayment = paymentFilter === "All" || app.paymentStatus === paymentFilter;
    const matchesAppliedBy = appliedByFilter === "All" || app.appliedBy === appliedByFilter;
    const matchesCountry = countryFilter === "All" || app.country === countryFilter;
    const matchesCategory = categoryFilter === "All" || app.category === categoryFilter;
    const matchesPriority = priorityFilter === "All" || app.priority === priorityFilter;

    return (
      matchesQuery &&
      matchesStatus &&
      matchesPayment &&
      matchesAppliedBy &&
      matchesCountry &&
      matchesCategory &&
      matchesPriority
    );
  });

  // Pagination State & Calculation
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = filteredApps.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalItems, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedApps = filteredApps.slice(startIndex, endIndex);

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
  const handleApprove = async (app: ApplicationRecord) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: "Approved" } : a))
    );
    triggerToast(`Application ${app.appId} for ${app.applicantName} approved!`);
    setActiveModalApp(null);

    try {
      await fetch(`${API_V1_URL}/applications/${app.appId || app.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" })
      });
    } catch (err) {
      console.error("Failed to update status in MongoDB:", err);
    }
  };

  const handleReject = (app: ApplicationRecord) => {
    // Open the rejection reason dialog instead of rejecting immediately
    setRejectDialogApp(app);
    setRejectReason("");
    setRejectReasonError("");
  };

  const handleConfirmReject = async () => {
    if (!rejectDialogApp) return;
    if (!rejectReason.trim()) {
      setRejectReasonError("Please provide a reason for rejection.");
      return;
    }

    const app = rejectDialogApp;
    const reason = rejectReason.trim();

    // Close both dialogs
    setRejectDialogApp(null);
    setRejectReason("");
    setActiveModalApp(null);

    // Optimistic UI update
    setApplications((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: "Rejected", rejectionReason: reason } : a))
    );
    triggerToast(`Application ${app.appId} rejected.`);

    try {
      await fetch(`${API_V1_URL}/applications/${app.appId || app.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Rejected", rejectionReason: reason })
      });
    } catch (err) {
      console.error("Failed to update status in MongoDB:", err);
    }
  };

  const handleDeleteRecord = async (app: ApplicationRecord) => {
    setApplications((prev) => prev.filter((a) => a.id !== app.id));
    triggerToast(`Application record ${app.appId} deleted.`);
    if (activeModalApp?.id === app.id) setActiveModalApp(null);

    try {
      await fetch(`${API_V1_URL}/applications/${app.appId || app.id}`, {
        method: "DELETE"
      });
    } catch (err) {
      console.error("Failed to delete application in MongoDB:", err);
    }
  };

  const handleBulkApprove = () => {
    setApplications((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, status: "Approved" } : a))
    );
    triggerToast(`${selectedIds.length} applications approved.`);
    setSelectedIds([]);
  };

  const handleBulkReject = () => {
    setApplications((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, status: "Rejected" } : a))
    );
    triggerToast(`${selectedIds.length} applications rejected.`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    setApplications((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
    triggerToast(`${selectedIds.length} applications deleted.`);
    setSelectedIds([]);
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
    setApplications((prev) =>
      prev.map((a) => (a.id === activeModalApp.id ? { ...a, actionNotes: updatedNotes } : a))
    );
    setNewNoteText("");
    triggerToast("Action note added successfully.");
  };

  // Helper for Status Badge Rendering
  const getStatusBadge = (status: ApplicationRecord["status"]) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Rejected
          </span>
        );
      case "Under Review":
        return (
          <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Under Review
          </span>
        );
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Processing
          </span>
        );
      case "Document Pending":
        return (
          <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Document Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" /> {status}
          </span>
        );
    }
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
            <ClipboardList size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Global Application Operations Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            All Applications
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Track, filter, and manage all visa applications across every stage, country, and applicant category.
          </p>
        </div>
      </div>

      {/* TOP STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 7 METRIC TILES */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Applications</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{applications.length}</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Global Submissions</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Pending Review</span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {applications.filter((a) => ["Submitted", "Pending Review", "Under Review", "Draft"].includes(a.status)).length}
            </div>
            <span className="text-[10px] text-amber-600 font-bold">Awaiting Audit</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Approved</span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {applications.filter((a) => ["Approved", "Visa Issued", "Granted"].includes(a.status)).length}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">Visas Granted</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Rejected</span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {applications.filter((a) => ["Rejected", "Refused", "Cancelled"].includes(a.status)).length}
            </div>
            <span className="text-[10px] text-red-600 font-bold">Refused Visas</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Processing</span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {applications.filter((a) => ["Processing", "Embassy Processing", "Under Review"].includes(a.status)).length}
            </div>
            <span className="text-[10px] text-blue-600 font-bold">At Embassy / VFS</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Doc Pending</span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {applications.filter((a) => ["Document Pending", "Docs Pending", "Draft"].includes(a.status)).length}
            </div>
            <span className="text-[10px] text-purple-600 font-bold">Missing Files</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition sm:col-span-2">
            <span className="text-[10px] font-extrabold uppercase text-emerald-700 block mb-1">Completed & Issued</span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {applications.filter((a) => ["Completed", "Approved", "Passport Delivered", "Visa Issued"].includes(a.status)).length}
            </div>
            <span className="text-[10px] text-emerald-700 font-bold">Passport Delivered</span>
          </div>
        </div>

        {/* RIGHT CARD: RECOMMENDED TABS & WORKFLOW FLOW (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Application Workflow Lifecycle
            </h3>
            <div className="space-y-1.5 text-[11px] text-slate-700 font-medium">
              {APPLICATION_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-[10px] shrink-0">
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
            <Filter size={16} className="text-[#2563EB]" /> Search & Multi-Criteria Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredApps.length} of {applications.length} Applications
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search By (ID, Applicant, Passport, Agent, Country)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="APP-100451, Swapnil, Z9876543..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* APPLICATION STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Application Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* PAYMENT STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Payment Status
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
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
              <option value="User">User (Direct Applicant)</option>
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
            <span>Applications Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkApprove}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 size={14} /> Approve Selected
            </button>
            <button
              onClick={handleBulkReject}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <XCircle size={14} /> Reject Selected
            </button>
            <button
              onClick={() => triggerToast(`Exporting data for ${selectedIds.length} applications.`)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Applications
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Trash2 size={14} /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* APPLICATIONS TABLE */}
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
                <th className="py-3.5 px-4">Agent Assigned</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Visa Category</th>
                <th className="py-3.5 px-4">Visa Type</th>
                <th className="py-3.5 px-4 font-mono">Submission Date</th>
                <th className="py-3.5 px-4 font-mono">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {paginatedApps.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <ClipboardList size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No applications found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedApps.map((a) => (
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
                      <span className="block text-[10px] text-slate-400 font-mono font-normal">Passport: {a.passportNumber}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {a.assignedAgentName ? (
                        <div>
                          <span className="font-bold text-indigo-700">{a.assignedAgentName}</span>
                          <span className="block text-[10px] font-mono text-slate-400">{a.assignedAgentId}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px] font-semibold italic">Auto-assign / None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {a.country}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {a.category}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {a.visaType}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {a.submissionDate}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {a.paymentStatus === "Paid" ? (
                        <span className="text-emerald-600">🟢 Paid</span>
                      ) : (
                        <span className="text-amber-600">🟡 Pending</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(a.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setActiveModalApp(a)}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          disabled={a.status === "Approved"}
                          onClick={() => handleApprove(a)}
                          className={`p-1.5 rounded-lg transition ${a.status === "Approved"
                              ? "text-emerald-400/50 cursor-not-allowed opacity-50"
                              : "text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                            }`}
                          title={a.status === "Approved" ? "Approved" : "Approve Visa"}
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          disabled={a.status === "Rejected"}
                          onClick={() => handleReject(a)}
                          className={`p-1.5 rounded-lg transition ${a.status === "Rejected"
                              ? "text-red-400/50 cursor-not-allowed opacity-50"
                              : "text-red-600 hover:bg-red-50 cursor-pointer"
                            }`}
                          title={a.status === "Rejected" ? "Rejected" : "Reject Visa"}
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
          <div>
            {totalItems === 0
              ? "Showing 0 of 0 Applications"
              : `Showing ${startIndex + 1}-${endIndex} of ${totalItems} Application${totalItems === 1 ? "" : "s"}`}
          </div>

          <div className="flex items-center gap-1 font-mono font-bold">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded-lg cursor-pointer transition ${currentPage === pageNum
                    ? "bg-[#2563EB] text-white font-bold"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CENTERED POPUP DETAILS MODAL */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                  <ClipboardList size={20} />
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
              <button onClick={() => setActiveModalApp(null)} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer">
                <X size={16} />
              </button>
            </div>
            {/* TAB BAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {RECOMMENDED_APPLICATION_TABS.map((tab) => {
                const active = modalTab === tab;
                return (
                  <button key={tab} onClick={() => setModalTab(tab)} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${active ? "bg-[#2563EB] text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200"}`}>
                    <span>{tab}</span>
                  </button>
                );
              })}
            </div>
            {/* MODAL BODY */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {modalTab === "Overview" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* WORKFLOW STEPPER */}
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-3">Workflow Lifecycle Stepper</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                      {APPLICATION_WORKFLOW_STEPS.map((step, idx) => {
                        const isDone = idx <= 4;
                        return (
                          <div key={idx} className={`p-2 rounded-xl border text-center space-y-1 ${isDone ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                            <div className={`w-5 h-5 rounded-full mx-auto flex items-center justify-center font-bold text-[10px] ${isDone ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`}>{idx + 1}</div>
                            <p className="text-[9px] font-bold truncate">{step}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">Core Application Summary</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Application ID</span><strong className="text-[#2563EB] font-mono font-bold text-sm">{activeModalApp.appId}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Applicant Full Name</span><strong className="text-slate-900 font-bold">{activeModalApp.applicantName}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Current Workflow Status</span><div>{getStatusBadge(activeModalApp.status)}</div></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Destination Country</span><strong className="text-slate-900 font-bold">{activeModalApp.country}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Category &amp; Type</span><strong className="text-slate-900 font-bold">{activeModalApp.category} ({activeModalApp.visaType})</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Priority Speed</span><strong className="text-purple-600 font-bold">{activeModalApp.priority}</strong></div>
                    {activeModalApp.assignedAgentName ? (
                      <div className="bg-indigo-50 p-3.5 rounded-2xl border border-indigo-200 col-span-1 sm:col-span-2 lg:col-span-3">
                        <span className="text-[10px] font-extrabold uppercase text-indigo-500 block mb-1">Assigned Agent</span>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#4848F7] text-white flex items-center justify-center font-black text-xs shrink-0">
                            {activeModalApp.assignedAgentName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong className="text-indigo-800 font-bold text-xs">{activeModalApp.assignedAgentName}</strong>
                            <span className="block text-[10px] font-mono text-indigo-500">{activeModalApp.assignedAgentId}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Assigned Agent</span>
                        <span className="text-slate-400 italic text-xs">Auto-assign / None selected</span>
                      </div>
                    )}
                  </div>

                  {activeModalApp.status === "Rejected" && activeModalApp.rejectionReason && (
                    <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                      <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-extrabold uppercase text-red-500 mb-0.5">Rejection Reason</p>
                        <p className="text-xs text-red-800 font-medium leading-relaxed">{activeModalApp.rejectionReason}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {(modalTab === "Applicant & Passport" || modalTab === "Applicant Details") && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">Personal Identity Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Full Name</span><strong className="text-slate-900 font-bold">{activeModalApp.applicantName}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Given / First Name</span><strong className="text-slate-900 font-bold">{activeModalApp.firstName || activeModalApp.applicantName.split(" ")[0]}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Surname / Last Name</span><strong className="text-slate-900 font-bold">{activeModalApp.lastName || activeModalApp.applicantName.split(" ").slice(1).join(" ")}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Date of Birth</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.dob || "1992-05-14"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Gender</span><strong className="text-slate-900 font-bold">{activeModalApp.gender || "Male"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Marital Status</span><strong className="text-slate-900 font-bold">{activeModalApp.maritalStatus || "Single"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Nationality</span><strong className="text-slate-900 font-bold">{activeModalApp.nationality || "Indian"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Country of Residence</span><strong className="text-slate-900 font-bold">{activeModalApp.countryOfResidence || "India"}</strong></div>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 pt-2">Passport Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Passport Number</span><strong className="text-[#2563EB] font-mono font-bold">{activeModalApp.passportNumber}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Issue Date</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.passportIssueDate || "2020-04-12"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Expiry Date</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.passportExpiry || "2030-04-11"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Issuing Authority / Country</span><strong className="text-slate-900 font-bold">{activeModalApp.passportIssuingCountry || "India (RPO Mumbai)"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Place of Issue</span><strong className="text-slate-900 font-bold">{activeModalApp.passportPlaceOfIssue || "Mumbai"}</strong></div>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 pt-2">Contact Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Email Address</span><strong className="text-slate-900 font-bold">{activeModalApp.email || "N/A"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Mobile Number</span><strong className="text-slate-900 font-bold">{activeModalApp.phone || "N/A"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Residential Address</span><strong className="text-slate-900 font-bold">{activeModalApp.address || "N/A"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">City &amp; State</span><strong className="text-slate-900 font-bold">{activeModalApp.city || "Mumbai, Maharashtra"}</strong></div>
                  </div>
                </div>
              )}

              {(modalTab === "Visa & Travel" || modalTab === "Visa Details") && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">Visa Specification &amp; Travel Plans</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Destination Country</span><strong className="text-slate-900 font-bold">{activeModalApp.country}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Category</span><strong className="text-[#2563EB] font-bold">{activeModalApp.category}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Type</span><strong className="text-slate-900 font-bold">{activeModalApp.visaType}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Intended Travel Date</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.travelDate || "2026-09-15"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Expected Departure Date</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.departureDate || "2026-09-30"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Duration of Stay</span><strong className="text-slate-900 font-bold">{activeModalApp.durationOfStay || "15 Days"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Purpose of Visit</span><strong className="text-slate-900 font-bold">{activeModalApp.purposeOfVisit || "Tourism & Sightseeing"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Port of Entry</span><strong className="text-slate-900 font-bold">{activeModalApp.portOfEntry || "Toronto Airport (YYZ)"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Hotel / Accommodation</span><strong className="text-slate-900 font-bold">{activeModalApp.hotelDetails || "Fairmont Royal York"}</strong></div>
                  </div>
                </div>
              )}

              {modalTab === "Employment & Finance" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">Employment Profile &amp; Financial Solvency</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Occupation / Status</span><strong className="text-slate-900 font-bold">{activeModalApp.occupation || "Software Engineer"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Employer / Business Name</span><strong className="text-slate-900 font-bold">{activeModalApp.employerName || "TechSolutions Pvt Ltd"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Job Title / Designation</span><strong className="text-slate-900 font-bold">{activeModalApp.designation || "Lead Developer"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Annual Income</span><strong className="text-emerald-700 font-mono font-bold">{activeModalApp.annualIncome || "₹18,50,000 / year"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Trip Funding / Sponsor</span><strong className="text-[#2563EB] font-bold">{activeModalApp.sponsorType || "Self-Funded"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Bank Balance Proof</span><strong className="text-emerald-700 font-mono font-bold">{activeModalApp.bankBalance || "₹6,85,000 (HDFC Bank)"}</strong></div>
                  </div>
                </div>
              )}

              {modalTab === "Uploaded Documents" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">Applicant Document Verification Checklist</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(activeModalApp.documents || [
                      { name: "Passport Bio Page", status: "Verified" },
                      { name: "Bank Statement (6 Months)", status: "Verified" },
                      { name: "Flight Ticket Reservation", status: "Verified" },
                      { name: "Hotel Accommodation Voucher", status: "Verified" }
                    ]).map((doc, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                            <FileText size={16} />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{doc.name}</span>
                            <span className="text-[10px] text-slate-400">PDF &bull; 2.4 MB</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${doc.status === "Verified" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>{doc.status}</span>
                          <button onClick={() => triggerToast(`Viewing ${doc.name}`)} className="p-1.5 text-[#2563EB] hover:bg-blue-100 rounded-lg transition" title="Preview Document">
                            <Eye size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(modalTab === "Payment & Invoice" || modalTab === "Payment Details") && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">Billing &amp; Payment Gateway Summary</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Government Visa Fee</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.governmentFee || "₹8,500"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">VFS / Service Charge</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.serviceFee || "₹3,150"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">GST Tax (18%)</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.taxAmount || "₹700"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Total Amount Charged</span><strong className="text-[#2563EB] font-mono font-black text-sm">{activeModalApp.amountPaid || "₹12,350"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Transaction Reference ID</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.transactionId || "TXN-9988112"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Payment Channel</span><strong className="text-slate-900 font-bold">{activeModalApp.paymentMethod || "UPI (Google Pay)"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Payment Date &amp; Time</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.paymentDate || "28-07-2026 10:14 AM"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Gateway Status</span><strong className="text-emerald-600 font-bold">{activeModalApp.paymentStatus || "Paid"}</strong></div>
                  </div>
                </div>
              )}

              {(modalTab === "Embassy & Tracking" || modalTab === "Embassy Submission") && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">Consulate &amp; VFS Tracking Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Embassy Reference ID</span><strong className="text-[#2563EB] font-mono font-bold">{activeModalApp.embassyTrackingId || "CAN-EMB-8831"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Embassy Submission Date</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.embassySubmissionDate || "2026-07-29"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Biometrics Appointment Date</span><strong className="text-slate-900 font-mono font-bold">{activeModalApp.appointmentDate || "2026-08-05"}</strong></div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200"><span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">VFS / Embassy Center</span><strong className="text-slate-900 font-bold">{activeModalApp.consulateBranch || "VFS Global Center Mumbai"}</strong></div>
                  </div>
                </div>
              )}

              {modalTab === "Action Notes" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">Internal Agent &amp; Consular Notes Log</h4>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto [scrollbar-width:thin]">
                    {(activeModalApp.actionNotes || []).length === 0 ? (
                      <p className="text-slate-400 text-xs italic">No internal notes recorded yet.</p>
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
                    <input type="text" placeholder="Type internal remark..." value={newNoteText} onChange={(e) => setNewNoteText(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2563EB]" />
                    <button onClick={handleAddNote} className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold cursor-pointer">Add Remark</button>
                  </div>
                </div>
              )}
            </div>
            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Update Status:</span>
                <select
                  value={activeModalApp.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as ApplicationRecord["status"];
                    setApplications((prev) => prev.map((a) => (a.id === activeModalApp.id ? { ...a, status: newStatus } : a)));
                    setActiveModalApp({ ...activeModalApp, status: newStatus });
                    triggerToast(`Status updated to ${newStatus}`);
                  }}
                  className="bg-white border border-slate-300 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl outline-none"
                >
                  <option value="Draft">Draft</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Embassy Processing">Embassy Processing</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={activeModalApp.status === "Approved"}
                  onClick={() => handleApprove(activeModalApp)}
                  className={`px-4 py-2 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${activeModalApp.status === "Approved" ? "bg-emerald-600/50 cursor-not-allowed opacity-75" : "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"}`}
                >
                  <CheckCircle2 size={15} /> {activeModalApp.status === "Approved" ? "Approved" : "Approve Application"}
                </button>
                <button
                  disabled={activeModalApp.status === "Rejected"}
                  onClick={() => handleReject(activeModalApp)}
                  className={`px-4 py-2 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${activeModalApp.status === "Rejected" ? "bg-red-600/50 cursor-not-allowed opacity-75" : "bg-red-600 hover:bg-red-700 cursor-pointer"}`}
                >
                  <XCircle size={15} /> {activeModalApp.status === "Rejected" ? "Rejected" : "Reject Application"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON DIALOG */}
      {rejectDialogApp && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Dialog Header */}
            <div className="bg-red-600 text-white p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-700/50 flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black font-outfit">Reject Application</h3>
                <p className="text-xs text-red-200">{rejectDialogApp.appId} &bull; {rejectDialogApp.applicantName}</p>
              </div>
            </div>

            {/* Dialog Body */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Please provide a clear reason for rejecting this application. This reason will be <strong>visible to the applicant</strong> in their panel.
              </p>
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1.5">Rejection Reason <span className="text-red-500">*</span></label>
                <textarea
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => { setRejectReason(e.target.value); setRejectReasonError(""); }}
                  placeholder="e.g. Incomplete bank statement, passport validity less than 6 months, missing invitation letter..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200 resize-none transition"
                />
                {rejectReasonError && (
                  <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                    <AlertTriangle size={12} /> {rejectReasonError}
                  </p>
                )}
              </div>

              {/* Common reason quick-picks */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Insufficient funds",
                  "Invalid passport",
                  "Missing documents",
                  "Incomplete application",
                  "Travel history concern",
                  "Passport expires within 6 months"
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => { setRejectReason(suggestion); setRejectReasonError(""); }}
                    className="text-[10px] px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full hover:bg-red-100 cursor-pointer transition font-semibold"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => { setRejectDialogApp(null); setRejectReason(""); setRejectReasonError(""); }}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold cursor-pointer transition flex items-center gap-1.5"
              >
                <XCircle size={14} /> Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
