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
  passportNumber: string;
  appliedBy: "User" | "Agent";
  agentName?: string;
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
  nationality?: string;
  email?: string;
  phone?: string;
  address?: string;
  travelDate?: string;
  durationOfStay?: string;
  transactionId?: string;
  paymentMethod?: string;
  amountPaid?: string;
  embassyTrackingId?: string;
  embassySubmissionDate?: string;
  appointmentDate?: string;
  consulateBranch?: string;
  documents?: { name: string; status: "Verified" | "Pending" | "Rejected" }[];
  actionNotes?: { id: string; author: string; text: string; date: string }[];
  history?: { stage: string; date: string; updatedBy: string }[];
}

export const RECOMMENDED_APPLICATION_TABS = [
  "Overview",
  "Applicant Details",
  "Visa Details",
  "Uploaded Documents",
  "Payment Details",
  "Embassy Submission",
  "Action History",
  "Activity Log",
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
    passportNumber: "Z9876543",
    appliedBy: "User",
    country: "Canada",
    category: "Tourist",
    visaType: "eVisa",
    submissionDate: "28-07-2026",
    paymentStatus: "Paid",
    status: "Under Review",
    priority: "Express",
    dob: "1992-05-14",
    gender: "Male",
    nationality: "Indian",
    email: "swapnil.j@gmail.com",
    phone: "+91 98765 43210",
    address: "B-402, Green Park, Mumbai, Maharashtra",
    travelDate: "2026-09-15",
    durationOfStay: "15 Days",
    transactionId: "TXN-9988112",
    paymentMethod: "UPI",
    amountPaid: "₹12,350",
    embassyTrackingId: "CAN-EMB-8831",
    embassySubmissionDate: "2026-07-29",
    appointmentDate: "2026-08-05",
    consulateBranch: "Canada VFS Global Mumbai",
    documents: [
      { name: "Passport Front & Back", status: "Verified" },
      { name: "Bank Statement (6 Months)", status: "Verified" },
      { name: "Flight Reservation", status: "Verified" },
      { name: "Hotel Booking Confirmation", status: "Verified" },
      { name: "Passport Photo", status: "Verified" }
    ],
    actionNotes: [
      { id: "n1", author: "Admin (Vibhu)", text: "Initial document review complete. Financials verified.", date: "2026-07-29 10:30 AM" }
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
    passportNumber: "M1234567",
    appliedBy: "Agent",
    agentName: "Global Visa Solutions",
    country: "Australia",
    category: "Student",
    visaType: "Sticker Visa",
    submissionDate: "29-07-2026",
    paymentStatus: "Paid",
    status: "Approved",
    priority: "High",
    dob: "1998-11-20",
    gender: "Male",
    nationality: "Indian",
    email: "rahul.sharma@outlook.com",
    phone: "+91 91234 56789",
    address: "House 12, Sector 17, Chandigarh",
    travelDate: "2026-10-01",
    durationOfStay: "2 Years",
    transactionId: "TXN-7733441",
    paymentMethod: "Credit Card",
    amountPaid: "₹18,930",
    embassyTrackingId: "AUS-SYD-4412",
    embassySubmissionDate: "2026-07-30",
    appointmentDate: "2026-08-02",
    consulateBranch: "Australian High Commission New Delhi",
    documents: [
      { name: "Passport Copy", status: "Verified" },
      { name: "University CoE Admission Letter", status: "Verified" },
      { name: "IELTS Scorecard", status: "Verified" },
      { name: "Financial Sponsorship Affidavit", status: "Verified" }
    ],
    actionNotes: [
      { id: "n2", author: "Agent Global", text: "Client cleared medicals. Final grant issued.", date: "2026-07-30 04:15 PM" }
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
    passportNumber: "K4567890",
    appliedBy: "User",
    country: "UAE",
    category: "Business",
    visaType: "Multiple Entry",
    submissionDate: "30-07-2026",
    paymentStatus: "Pending",
    status: "Processing",
    priority: "Urgent",
    dob: "1987-03-08",
    gender: "Male",
    nationality: "Indian",
    email: "rohit.verma@techcorp.in",
    phone: "+91 99887 76655",
    address: "Plot 88, HITEC City, Hyderabad, Telangana",
    travelDate: "2026-08-10",
    durationOfStay: "30 Days",
    transactionId: "TXN-PENDING",
    paymentMethod: "Net Banking",
    amountPaid: "₹8,670",
    documents: [
      { name: "Passport Bio Page", status: "Verified" },
      { name: "Company Cover Letter", status: "Verified" },
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
  passportNumber: app.passportDetails?.passportNo || app.passportNumber || "N/A",
  appliedBy: app.appliedBy || "User",
  agentName: app.agentName || "",
  country: app.countryName || app.destination || "Australia",
  category: app.categoryName || "Tourist Visa",
  visaType: app.visaTypeName || app.visaType || "Standard Visitor",
  submissionDate: app.createdAt ? new Date(app.createdAt).toISOString().split("T")[0] : app.submissionDate || "2026-08-07",
  paymentStatus: app.paymentStatus || "Paid",
  status: (app.status as any) || "Submitted",
  priority: app.processingSpeed === "vip" ? "Urgent" : app.processingSpeed === "express" ? "Express" : "Regular",
  dob: app.personalDetails?.dob || app.dob || "",
  gender: app.personalDetails?.gender || app.gender || "Male",
  nationality: app.personalDetails?.nationality || app.nationality || "Indian",
  email: app.personalDetails?.email || app.email || "",
  phone: app.personalDetails?.phone || app.phone || "",
  address: app.travelDetails?.hostAddress || app.address || "",
  travelDate: app.travelDetails?.travelDate || app.travelDates || "",
  durationOfStay: app.stayValidity || "60 Days",
  amountPaid: app.pricing?.totalAmount ? `₹${Number(app.pricing.totalAmount).toLocaleString("en-IN")}` : `₹${Number(app.fees || 11700).toLocaleString("en-IN")}`,
  documents: Array.isArray(app.uploadedDocuments)
    ? app.uploadedDocuments.map((d: any) => ({ name: d.title, status: d.fileUrl ? "Verified" : "Pending" }))
    : []
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

  // New Note Input inside Modal
  const [newNoteText, setNewNoteText] = useState("");

  // Add / Edit Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState<ApplicationRecord | null>(null);

  const [formData, setFormData] = useState({
    applicantName: "",
    passportNumber: "",
    appliedBy: "User" as "User" | "Agent",
    agentName: "",
    country: "Canada",
    category: "Tourist",
    visaType: "eVisa",
    paymentStatus: "Paid" as "Paid" | "Pending" | "Failed" | "Refunded",
    status: "Under Review" as ApplicationRecord["status"],
    priority: "Regular" as ApplicationRecord["priority"],
    dob: "",
    gender: "Male",
    nationality: "Indian",
    email: "",
    phone: "",
    address: "",
    travelDate: "",
    durationOfStay: "15 Days"
  });

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
  const handleApprove = (app: ApplicationRecord) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: "Approved" } : a))
    );
    triggerToast(`Application ${app.appId} for ${app.applicantName} approved!`);
    if (activeModalApp?.id === app.id) {
      setActiveModalApp((prev) => (prev ? { ...prev, status: "Approved" } : null));
    }
  };

  const handleReject = (app: ApplicationRecord) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: "Rejected" } : a))
    );
    triggerToast(`Application ${app.appId} rejected.`);
    if (activeModalApp?.id === app.id) {
      setActiveModalApp((prev) => (prev ? { ...prev, status: "Rejected" } : null));
    }
  };

  const handleDeleteRecord = (app: ApplicationRecord) => {
    setApplications((prev) => prev.filter((a) => a.id !== app.id));
    triggerToast(`Application record ${app.appId} deleted.`);
    if (activeModalApp?.id === app.id) setActiveModalApp(null);
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

  const openEditForm = (app: ApplicationRecord) => {
    setEditingApp(app);
    setFormData({
      applicantName: app.applicantName,
      passportNumber: app.passportNumber,
      appliedBy: app.appliedBy,
      agentName: app.agentName || "",
      country: app.country,
      category: app.category,
      visaType: app.visaType,
      paymentStatus: app.paymentStatus,
      status: app.status,
      priority: app.priority,
      dob: app.dob || "",
      gender: app.gender || "Male",
      nationality: app.nationality || "Indian",
      email: app.email || "",
      phone: app.phone || "",
      address: app.address || "",
      travelDate: app.travelDate || "",
      durationOfStay: app.durationOfStay || "15 Days"
    });
    setShowAddModal(true);
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

  const handleSaveApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicantName || !formData.passportNumber) {
      triggerToast("Applicant Name and Passport Number are required.");
      return;
    }

    if (editingApp) {
      setApplications((prev) =>
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
                paymentStatus: formData.paymentStatus,
                status: formData.status,
                priority: formData.priority,
                dob: formData.dob,
                gender: formData.gender,
                nationality: formData.nationality,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                travelDate: formData.travelDate,
                durationOfStay: formData.durationOfStay
              }
            : a
        )
      );
      triggerToast(`Application ${editingApp.appId} updated.`);
    } else {
      const newRecord: ApplicationRecord = {
        id: Date.now().toString(),
        appId: `APP-${Math.floor(100000 + Math.random() * 900000)}`,
        applicantName: formData.applicantName,
        passportNumber: formData.passportNumber,
        appliedBy: formData.appliedBy,
        agentName: formData.agentName,
        country: formData.country,
        category: formData.category,
        visaType: formData.visaType,
        submissionDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
        paymentStatus: formData.paymentStatus,
        status: formData.status,
        priority: formData.priority,
        dob: formData.dob,
        gender: formData.gender,
        nationality: formData.nationality,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        travelDate: formData.travelDate,
        durationOfStay: formData.durationOfStay,
        documents: [
          { name: "Passport Copy", status: "Verified" },
          { name: "Photograph", status: "Verified" }
        ],
        actionNotes: [],
        history: [{ stage: "Application Created", date: new Date().toLocaleDateString(), updatedBy: "Admin" }]
      };
      setApplications((prev) => [newRecord, ...prev]);
      triggerToast(`New application ${newRecord.appId} created.`);
    }

    setShowAddModal(false);
    setEditingApp(null);
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
              <option value="Under Review">Under Review</option>
              <option value="Processing">Processing</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Document Pending">Document Pending</option>
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
                <th className="py-3.5 px-4">Applied By</th>
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
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <ClipboardList size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No applications found matching your filters.</p>
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
                      <span className="block text-[10px] text-slate-400 font-mono font-normal">Passport: {a.passportNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {a.appliedBy === "Agent" ? (
                        <span className="text-purple-700 font-bold">Agent ({a.agentName})</span>
                      ) : (
                        <span className="text-slate-600">Direct User</span>
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
                          onClick={() => openEditForm(a)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          title="Edit Application"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleApprove(a)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Approve Visa"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          onClick={() => handleReject(a)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Reject Visa"
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
          <div>Showing 1–10 of 3,845 Applications</div>
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

      {/* CENTERED POPUP DETAILS MODAL (9 TABS AS IN WIREFRAME CATALOG LIST) */}
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

              <button
                onClick={() => setActiveModalApp(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {RECOMMENDED_APPLICATION_TABS.map((tab) => {
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
              {/* TAB: OVERVIEW */}
              {modalTab === "Overview" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Application Summary
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Application ID</span>
                      <strong className="text-[#2563EB] font-mono font-bold">{activeModalApp.appId}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Applicant Name</span>
                      <strong className="text-slate-900 font-bold">{activeModalApp.applicantName}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Current Status</span>
                      <div>{getStatusBadge(activeModalApp.status)}</div>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Destination Country</span>
                      <strong className="text-slate-900 font-bold">{activeModalApp.country}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Category & Type</span>
                      <strong className="text-slate-900 font-bold">{activeModalApp.category} ({activeModalApp.visaType})</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Priority Speed</span>
                      <strong className="text-purple-600 font-bold">{activeModalApp.priority}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: APPLICANT DETAILS */}
              {modalTab === "Applicant Details" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Applicant Personal Profile
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Full Name</span>
                      <strong className="text-slate-900 font-bold">{activeModalApp.applicantName}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Passport Number</span>
                      <strong className="text-slate-900 font-mono font-bold">{activeModalApp.passportNumber}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Nationality</span>
                      <strong className="text-slate-900 font-bold">{activeModalApp.nationality || "Indian"}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Email Address</span>
                      <strong className="text-slate-900 font-bold">{activeModalApp.email || "N/A"}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Mobile Number</span>
                      <strong className="text-slate-900 font-bold">{activeModalApp.phone || "N/A"}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Residential Address</span>
                      <strong className="text-slate-900 font-bold">{activeModalApp.address || "N/A"}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: VISA DETAILS */}
              {modalTab === "Visa Details" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Visa Specification & Travel Plans
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Destination Country</span>
                      <strong className="text-slate-900 font-bold">{activeModalApp.country}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Category</span>
                      <strong className="text-[#2563EB] font-bold">{activeModalApp.category}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Type</span>
                      <strong className="text-slate-900 font-bold">{activeModalApp.visaType}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Intended Travel Date</span>
                      <strong className="text-slate-900 font-mono font-bold">{activeModalApp.travelDate || "2026-09-15"}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Duration of Stay</span>
                      <strong className="text-slate-900 font-bold">{activeModalApp.durationOfStay || "15 Days"}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: UPLOADED DOCUMENTS */}
              {modalTab === "Uploaded Documents" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Applicant Document Checklist Verification
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(activeModalApp.documents || [
                      { name: "Passport Bio Page", status: "Verified" },
                      { name: "Bank Statement", status: "Verified" }
                    ]).map((doc, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                        <span className="font-bold text-slate-800 flex items-center gap-2">
                          <FileText size={15} className="text-[#2563EB]" /> {doc.name}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          doc.status === "Verified" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: PAYMENT DETAILS */}
              {modalTab === "Payment Details" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Billing & Payment Gateway Record
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Transaction ID</span>
                      <strong className="text-slate-900 font-mono font-bold">{activeModalApp.transactionId || "TXN-9988112"}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Payment Method</span>
                      <strong className="text-slate-900 font-bold">{activeModalApp.paymentMethod || "UPI"}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Amount Paid</span>
                      <strong className="text-[#2563EB] font-mono font-black text-sm">{activeModalApp.amountPaid || "₹12,350"}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Payment Status</span>
                      <strong className="text-emerald-600 font-bold">{activeModalApp.paymentStatus}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: EMBASSY SUBMISSION */}
              {modalTab === "Embassy Submission" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Consulate & VFS Submission Status
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Embassy Tracking ID</span>
                      <strong className="text-slate-900 font-mono font-bold">{activeModalApp.embassyTrackingId || "CAN-EMB-8831"}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Submission Date</span>
                      <strong className="text-slate-900 font-mono font-bold">{activeModalApp.embassySubmissionDate || "2026-07-29"}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Appointment Date</span>
                      <strong className="text-slate-900 font-mono font-bold">{activeModalApp.appointmentDate || "2026-08-05"}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Consulate Branch</span>
                      <strong className="text-slate-900 font-bold">{activeModalApp.consulateBranch || "Canada VFS Global Mumbai"}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: ACTION NOTES */}
              {modalTab === "Action Notes" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Internal Admin & Agent Stream Notes
                  </h4>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto [scrollbar-width:thin]">
                    {(activeModalApp.actionNotes || []).length === 0 ? (
                      <p className="text-slate-400 text-xs italic">No notes recorded for this application yet.</p>
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
                    <input
                      type="text"
                      placeholder="Add a internal note or status comment..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2563EB]"
                    />
                    <button
                      onClick={handleAddNote}
                      className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold cursor-pointer"
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
                  onClick={() => handleApprove(activeModalApp)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} /> Approve Application
                </button>
                <button
                  onClick={() => handleReject(activeModalApp)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <XCircle size={15} /> Reject Application
                </button>
              </div>

              <button
                onClick={() => openEditForm(activeModalApp)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 size={14} /> Edit Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT VISA APPLICATION FORM MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-black font-outfit flex items-center gap-2">
                <ClipboardList size={18} />
                <span>{editingApp ? `Edit Application: ${editingApp.appId}` : "Create Visa Application"}</span>
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
            <form onSubmit={handleSaveApplication} className="p-6 overflow-y-auto flex-1 text-xs space-y-6 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE]">
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
                      placeholder="e.g. Swapnil Joshi"
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
                      Applied By Channel
                    </label>
                    <select
                      value={formData.appliedBy}
                      onChange={(e) => setFormData({ ...formData, appliedBy: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                    >
                      <option value="User">User (Direct Applicant)</option>
                      <option value="Agent">Agent Submitted</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: DESTINATION & VISA DETAILS */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Destination & Visa Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Destination Country
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                    >
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="UAE">UAE</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Visa Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                    >
                      <option value="Tourist">Tourist</option>
                      <option value="Business">Business</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Visa Type
                    </label>
                    <input
                      type="text"
                      placeholder="eVisa / Sticker Visa"
                      value={formData.visaType}
                      onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl"
                    />
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
                  {editingApp ? "Save Changes" : "Create Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
