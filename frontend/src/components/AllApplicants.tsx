"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Users,
  UserCheck,
  UserPlus,
  UserX,
  Eye,
  Edit,
  Lock,
  Unlock,
  Trash2,
  Mail,
  Bell,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Globe,
  FileText,
  CreditCard,
  History,
  ShieldAlert,
  ArrowUpRight,
  MoreVertical,
  Check
} from "lucide-react";

export interface ApplicantRecord {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  mobile: string;
  country: string;
  flag: string;
  totalApplications: number;
  status: "Active" | "Inactive" | "Blocked";
  registeredOn: string;
  // Detail Fields
  dob?: string;
  gender?: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiry?: string;
  address?: string;
  currentVisa?: string;
  visaType?: string;
  destinationCountry?: string;
  applicationStatus?: string;
  assignedAgent?: string;
  processingStage?: string;
  documents?: {
    passport: boolean;
    photograph: boolean;
    bankStatement: boolean;
    invitationLetter: boolean;
  };
  payments?: {
    totalPaid: number;
    pendingAmount: number;
    history: Array<{ date: string; amount: number; desc: string; method: string }>;
  };
  timeline?: Array<{ title: string; time: string; completed: boolean }>;
}

const mockApplicants: ApplicantRecord[] = [
  {
    id: "APP-1025",
    name: "Geeta Bisht",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    email: "geeta@email.com",
    mobile: "+91 9876543210",
    country: "Canada",
    flag: "🇨🇦",
    totalApplications: 2,
    status: "Active",
    registeredOn: "20 Jul 2026",
    dob: "14 May 1994",
    gender: "Female",
    nationality: "Indian",
    passportNumber: "Z9876543",
    passportExpiry: "12 Dec 2031",
    address: "B-402, Green Park Avenue, New Delhi, India",
    currentVisa: "Express Entry PR / Tourist",
    visaType: "Tourist Visa Subclass 600",
    destinationCountry: "Canada",
    applicationStatus: "Under Review",
    assignedAgent: "Balram Suman (Senior Agent)",
    processingStage: "Embassy Document Verification",
    documents: {
      passport: true,
      photograph: true,
      bankStatement: true,
      invitationLetter: false
    },
    payments: {
      totalPaid: 45000,
      pendingAmount: 0,
      history: [
        { date: "20 Jul 2026", amount: 25000, desc: "Initial Embassy Fee & Processing", method: "UPI / Net Banking" },
        { date: "22 Jul 2026", amount: 20000, desc: "Biometric & VFS Service Charge", method: "Credit Card" }
      ]
    },
    timeline: [
      { title: "Account Created", time: "20 Jul 2026, 10:15 AM", completed: true },
      { title: "Visa Application Submitted", time: "20 Jul 2026, 11:30 AM", completed: true },
      { title: "Documents Uploaded", time: "21 Jul 2026, 03:45 PM", completed: true },
      { title: "Payment Completed", time: "22 Jul 2026, 06:12 PM", completed: true },
      { title: "Under Review at Embassy", time: "24 Jul 2026, 09:00 AM", completed: true }
    ]
  },
  {
    id: "APP-1026",
    name: "Rahul Sharma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
    email: "rahul@email.com",
    mobile: "+91 9812345678",
    country: "Australia",
    flag: "🇦🇺",
    totalApplications: 1,
    status: "Active",
    registeredOn: "19 Jul 2026",
    dob: "02 Aug 1991",
    gender: "Male",
    nationality: "Indian",
    passportNumber: "K1234567",
    passportExpiry: "18 Aug 2029",
    address: "Flat 101, Sunshine Heights, Mumbai, India",
    currentVisa: "Student Visa (Subclass 500)",
    visaType: "Higher Education Sector Visa",
    destinationCountry: "Australia",
    applicationStatus: "Approved",
    assignedAgent: "Geeta Bisht (Admin Lead)",
    processingStage: "Visa Grant Letter Issued",
    documents: {
      passport: true,
      photograph: true,
      bankStatement: true,
      invitationLetter: true
    },
    payments: {
      totalPaid: 65000,
      pendingAmount: 0,
      history: [
        { date: "19 Jul 2026", amount: 65000, desc: "Full Tuition Deposit & Application Fee", method: "Razorpay" }
      ]
    },
    timeline: [
      { title: "Account Created", time: "19 Jul 2026, 08:30 AM", completed: true },
      { title: "Visa Application Submitted", time: "19 Jul 2026, 10:00 AM", completed: true },
      { title: "Documents Uploaded", time: "19 Jul 2026, 12:20 PM", completed: true },
      { title: "Payment Completed", time: "19 Jul 2026, 01:15 PM", completed: true },
      { title: "Visa Approved", time: "23 Jul 2026, 04:30 PM", completed: true }
    ]
  },
  {
    id: "APP-1027",
    name: "Priya Singh",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256",
    email: "priya@email.com",
    mobile: "+91 9765432109",
    country: "UK",
    flag: "🇬🇧",
    totalApplications: 3,
    status: "Blocked",
    registeredOn: "18 Jul 2026",
    dob: "25 Nov 1996",
    gender: "Female",
    nationality: "Indian",
    passportNumber: "M5544332",
    passportExpiry: "30 Jan 2028",
    address: "78 Lotus Colony, Bengaluru, India",
    currentVisa: "Skilled Worker Visa",
    visaType: "Tier 2 General",
    destinationCountry: "United Kingdom",
    applicationStatus: "Rejected / Suspended",
    assignedAgent: "Animesh Jain",
    processingStage: "Flagged for Compliance Audit",
    documents: {
      passport: true,
      photograph: false,
      bankStatement: true,
      invitationLetter: false
    },
    payments: {
      totalPaid: 15000,
      pendingAmount: 35000,
      history: [
        { date: "18 Jul 2026", amount: 15000, desc: "Initial Registration Fee", method: "Bank Transfer" }
      ]
    },
    timeline: [
      { title: "Account Created", time: "18 Jul 2026, 02:00 PM", completed: true },
      { title: "Visa Application Submitted", time: "18 Jul 2026, 03:15 PM", completed: true },
      { title: "Documents Uploaded", time: "18 Jul 2026, 05:00 PM", completed: false },
      { title: "Account Blocked", time: "19 Jul 2026, 11:00 AM", completed: true }
    ]
  },
  {
    id: "APP-1028",
    name: "Animesh Kumawat",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
    email: "animesh@email.com",
    mobile: "+91 9654321098",
    country: "USA",
    flag: "🇺🇸",
    totalApplications: 1,
    status: "Active",
    registeredOn: "17 Jul 2026",
    dob: "10 Oct 1992",
    gender: "Male",
    nationality: "Indian",
    passportNumber: "R7788990",
    passportExpiry: "14 Jul 2032",
    address: "C-12 Sector 62, Noida, UP, India",
    currentVisa: "B1/B2 Business Visitor",
    visaType: "Non-immigrant Visitor Visa",
    destinationCountry: "USA",
    applicationStatus: "Under Review",
    assignedAgent: "Balram Suman",
    processingStage: "DS-160 Form Review",
    documents: {
      passport: true,
      photograph: true,
      bankStatement: true,
      invitationLetter: true
    },
    payments: {
      totalPaid: 32000,
      pendingAmount: 0,
      history: [
        { date: "17 Jul 2026", amount: 32000, desc: "US Embassy DS-160 Booking Fee", method: "Credit Card" }
      ]
    },
    timeline: [
      { title: "Account Created", time: "17 Jul 2026, 11:00 AM", completed: true },
      { title: "Visa Application Submitted", time: "17 Jul 2026, 01:00 PM", completed: true },
      { title: "Documents Uploaded", time: "17 Jul 2026, 03:00 PM", completed: true },
      { title: "Under Review", time: "18 Jul 2026, 10:00 AM", completed: true }
    ]
  },
  {
    id: "APP-1029",
    name: "Bhavani Suman",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
    email: "bhavani@email.com",
    mobile: "+91 9543210987",
    country: "Germany",
    flag: "🇩🇪",
    totalApplications: 2,
    status: "Inactive",
    registeredOn: "15 Jul 2026",
    dob: "05 Mar 1998",
    gender: "Female",
    nationality: "Indian",
    passportNumber: "L3322110",
    passportExpiry: "09 Sep 2030",
    address: "45 Civil Lines, Jaipur, Rajasthan, India",
    currentVisa: "Opportunity Card / Job Seeker",
    visaType: "Chancenkarte Germany",
    destinationCountry: "Germany",
    applicationStatus: "Pending Documents",
    assignedAgent: "Geeta Bisht",
    processingStage: "Awaiting Apostille Certification",
    documents: {
      passport: true,
      photograph: true,
      bankStatement: false,
      invitationLetter: false
    },
    payments: {
      totalPaid: 18000,
      pendingAmount: 12000,
      history: [
        { date: "15 Jul 2026", amount: 18000, desc: "Consultation & Document Audit Fee", method: "Net Banking" }
      ]
    },
    timeline: [
      { title: "Documents Uploaded", time: "16 Jul 2026, 02:00 PM", completed: false }
    ]
  }
];

export default function AllApplicants() {
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selection States for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Selected Applicant for Detail Drawer / View Modal
  const [viewApplicant, setViewApplicant] = useState<ApplicantRecord | null>(null);
  const [activeTab, setActiveTab] = useState<
    "personal" | "visa" | "documents" | "payments" | "timeline" | "quickActions" | "bulkActions"
  >("personal");

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Applicants List State & Metrics State
  const [applicants, setApplicants] = useState<ApplicantRecord[]>(mockApplicants);
  const [dbMetrics, setDbMetrics] = useState<{
    totalApplicants: number;
    activeApplicants: number;
    newRegistrations: number;
    blockedApplicants: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch real database records from backend
  const fetchApplicantsFromDB = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5000/api/v1/applicant/all");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setApplicants(json.data);
        if (json.metrics) {
          setDbMetrics(json.metrics);
        }
      }
    } catch (err) {
      console.error("Failed to fetch applicant records from MongoDB:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicantsFromDB();
  }, []);

  // Filter Logic
  const filteredApplicants = applicants.filter((app) => {
    // Search matching
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.mobile.includes(searchTerm) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.passportNumber && app.passportNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status matching
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;

    // Country matching
    const matchesCountry = countryFilter === "All" || app.country === countryFilter || app.destinationCountry === countryFilter;

    // Date range matching
    let matchesDate = true;
    if (fromDate && (app as any).rawCreatedAt) {
      matchesDate = new Date((app as any).rawCreatedAt) >= new Date(fromDate);
    }
    if (toDate && matchesDate && (app as any).rawCreatedAt) {
      matchesDate = new Date((app as any).rawCreatedAt) <= new Date(toDate + "T23:59:59");
    }

    return matchesSearch && matchesStatus && matchesCountry && matchesDate;
  });

  // Calculate dynamic pagination bounds
  const totalItems = filteredApplicants.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedApplicants = filteredApplicants.slice(startIndex, endIndex);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, countryFilter, fromDate, toDate]);

  // Unique country options
  const uniqueCountries = Array.from(
    new Set(applicants.map((a) => a.country || a.destinationCountry).filter(Boolean))
  );

  // Computed KPI Metrics
  const totalApplicantsCount = dbMetrics?.totalApplicants ?? applicants.length;
  const activeApplicantsCount =
    dbMetrics?.activeApplicants ?? applicants.filter((a) => a.status === "Active" || !(a as any).isDeactivated).length;
  const newRegistrationsCount = dbMetrics?.newRegistrations ?? applicants.length;
  const blockedApplicantsCount =
    dbMetrics?.blockedApplicants ?? applicants.filter((a) => a.status === "Blocked" || (a as any).isDeactivated).length;
  const activeRatio =
    totalApplicantsCount > 0 ? ((activeApplicantsCount / totalApplicantsCount) * 100).toFixed(1) : "100.0";

  // Select All logic
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredApplicants.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Actions
  const handleBlockUser = async (id: string) => {
    const target = applicants.find((a) => a.id === id || (a as any)._id === id);
    if (!target) return;

    const willBeBlocked = target.status !== "Blocked" && !(target as any).isDeactivated;

    // Optimistic UI state update
    setApplicants((prev) =>
      prev.map((app) =>
        app.id === id || (app as any)._id === id
          ? {
              ...app,
              status: willBeBlocked ? "Blocked" : "Active",
              isDeactivated: willBeBlocked
            }
          : app
      )
    );

    if (viewApplicant && (viewApplicant.id === id || (viewApplicant as any)._id === id)) {
      setViewApplicant((prev) =>
        prev
          ? {
              ...prev,
              status: willBeBlocked ? "Blocked" : "Active",
              isDeactivated: willBeBlocked
            }
          : null
      );
    }

    try {
      await fetch("http://localhost:5000/api/v1/applicant/toggle-block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: (target as any).userId,
          applicantId: target.id,
          isDeactivated: willBeBlocked
        })
      });
      triggerToast(`Applicant ${target.id} (${target.name}) ${willBeBlocked ? "blocked" : "unblocked"} successfully.`);
    } catch (e) {
      console.error("Failed to toggle block status:", e);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const target = applicants.find((a) => a.id === id || (a as any)._id === id);
    const mongoId = (target as any)?._id || id;

    setApplicants((prev) => prev.filter((a) => a.id !== id && (a as any)._id !== id));
    if (viewApplicant?.id === id || (viewApplicant as any)?._id === id) {
      setViewApplicant(null);
    }

    try {
      await fetch(`http://localhost:5000/api/v1/applicant/${mongoId}`, {
        method: "DELETE"
      });
      triggerToast(`Applicant ${target?.id || id} removed from database.`);
    } catch (e) {
      console.error("Failed to delete applicant:", e);
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedIds.length === 0) {
      triggerToast("Please select at least one applicant.");
      return;
    }
    if (action === "block") {
      setApplicants((prev) =>
        prev.map((a) => (selectedIds.includes(a.id) ? { ...a, status: "Blocked" } : a))
      );
      triggerToast(`Blocked ${selectedIds.length} selected applicant(s).`);
    } else if (action === "delete") {
      setApplicants((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
      setSelectedIds([]);
      triggerToast(`Deleted ${selectedIds.length} selected applicant(s).`);
    } else {
      triggerToast(`Executed '${action}' for ${selectedIds.length} applicant(s).`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-800">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0E1A2C] border border-[#C5A880]/40 text-[#F8F9FA] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <div className="w-8 h-8 rounded-lg bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#4848F7] mb-1">
            <Users size={14} />
            <span>APPLICANTS MANAGEMENT MODULE</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">All Applicants</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage and monitor all registered applicants, verify profiles, and review application activity.
          </p>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7]">
            <Clock size={14} className="animate-spin" />
            <span>Syncing MongoDB Database...</span>
          </div>
        )}
      </div>

      {/* TOP STATISTICS CARDS (4 CARDS GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Applicants */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Applicants</span>
            <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#4848F7] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Users size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">{totalApplicantsCount}</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-2">
            <ArrowUpRight size={13} />
            <span>Live Database Records</span>
          </div>
        </div>

        {/* Card 2: Active Applicants */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Applicants</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <UserCheck size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">{activeApplicantsCount}</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-2">
            <CheckCircle2 size={13} />
            <span>{activeRatio}% Active Ratio</span>
          </div>
        </div>

        {/* Card 3: New Registrations */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">New Registrations</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <UserPlus size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">{newRegistrationsCount}</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-semibold mt-2">
            <Clock size={13} />
            <span>Registered past 7 days</span>
          </div>
        </div>

        {/* Card 4: Blocked Applicants */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Blocked Applicants</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <UserX size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">{blockedApplicantsCount}</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-red-600 font-semibold mt-2">
            <ShieldAlert size={13} />
            <span>{blockedApplicantsCount > 0 ? "Requires Admin Review" : "No Blocked Users"}</span>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#4848F7] flex items-center justify-center">
              <Filter size={15} />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Search & Filters</h3>
              <p className="text-[11px] text-slate-400 font-medium">Filter applicants by keyword, status, country or registration date</p>
            </div>
          </div>
          {(searchTerm || statusFilter !== "All" || countryFilter !== "All" || fromDate || toDate) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
                setCountryFilter("All");
                setFromDate("");
                setToDate("");
              }}
              className="px-2.5 py-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <X size={13} /> Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          {/* Search Input */}
          <div className="lg:col-span-3 space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Search Applicant</label>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name, Email, Mobile, Passport, App ID..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4848F7] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#4848F7] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          {/* Country Filter */}
          <div className="lg:col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Country</label>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#4848F7] cursor-pointer"
            >
              <option value="All">All Countries</option>
              {uniqueCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Pickers */}
          <div className="lg:col-span-3 space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Registration Date</label>
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:border-[#4848F7]"
                title="From Date"
              />
              <span className="text-slate-400 text-xs font-bold shrink-0">-</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:border-[#4848F7]"
                title="To Date"
              />
            </div>
          </div>

          {/* Filter Trigger Button */}
          <div className="lg:col-span-2">
            <button
              onClick={() => triggerToast("Filters applied to applicant dataset.")}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Filter size={14} /> Filter Output
            </button>
          </div>
        </div>
      </div>

      {/* BULK ACTIONS BAR (When records selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-[#0E1A2C] border border-[#C5A880]/30 rounded-2xl p-3 px-5 flex flex-wrap items-center justify-between gap-3 text-slate-100 shadow-xl animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[#C5A880]/20 text-[#C5A880] text-xs font-bold font-mono flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span className="text-xs font-bold text-white">Applicants Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => handleBulkAction("export")}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1.5 font-semibold cursor-pointer"
            >
              <Download size={13} /> Export Selected
            </button>
            <button
              onClick={() => handleBulkAction("email")}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1.5 font-semibold cursor-pointer"
            >
              <Mail size={13} /> Send Email
            </button>
            <button
              onClick={() => handleBulkAction("notification")}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1.5 font-semibold cursor-pointer"
            >
              <Bell size={13} /> Send Notification
            </button>
            <button
              onClick={() => handleBulkAction("block")}
              className="px-3 py-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded-lg border border-amber-500/40 flex items-center gap-1.5 font-semibold cursor-pointer"
            >
              <Lock size={13} /> Block Selected
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              className="px-3 py-1.5 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg border border-red-500/40 flex items-center gap-1.5 font-semibold cursor-pointer"
            >
              <Trash2 size={13} /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* APPLICANTS TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-slate-900">Applicants Table</h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono font-bold">
              {filteredApplicants.length} records
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-y border-slate-200 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredApplicants.length > 0 &&
                      selectedIds.length === filteredApplicants.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-[#4848F7] focus:ring-[#4848F7]"
                  />
                </th>
                <th className="py-3 px-3">Applicant ID</th>
                <th className="py-3 px-3">Applicant Name</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Mobile</th>
                <th className="py-3 px-3">Country</th>
                <th className="py-3 px-3 text-center">Total Applications</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Registered On</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedApplicants.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400 font-medium">
                    No applicants found matching current search/filter parameters.
                  </td>
                </tr>
              ) : (
                paginatedApplicants.map((app) => {
                  const isSelected = selectedIds.includes(app.id);

                  return (
                    <tr
                      key={app.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isSelected ? "bg-[#EEF2FF]/40" : ""
                      }`}
                    >
                      <td className="py-3.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(app.id)}
                          className="rounded border-slate-300 text-[#4848F7] focus:ring-[#4848F7]"
                        />
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-[#4848F7]">{app.id}</td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              app.avatar ||
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
                            }
                            alt={app.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
                          />
                          <span className="font-extrabold text-slate-900">{app.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 font-medium">{app.email}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-600">{app.mobile}</td>
                      <td className="py-3.5 px-3 font-medium text-slate-800">
                        <span className="mr-1.5">{app.flag}</span>
                        {app.country}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-800">
                        {app.totalApplications}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            app.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : app.status === "Blocked"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-500">{app.registeredOn}</td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details Action */}
                          <button
                            onClick={() => {
                              setViewApplicant(app);
                              setActiveTab("personal");
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] text-[#4848F7] border border-slate-200 transition cursor-pointer"
                            title="View Applicant Details"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Edit Action */}
                          <button
                            onClick={() => triggerToast(`Edit profile modal opened for ${app.name}`)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
                            title="Edit Applicant Profile"
                          >
                            <Edit size={15} />
                          </button>

                          {/* Lock / Unlock Action */}
                          <button
                            onClick={() => handleBlockUser(app.id)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              app.status === "Blocked"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                                : "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                            }`}
                            title={app.status === "Blocked" ? "Activate User" : "Block User"}
                          >
                            {app.status === "Blocked" ? <Unlock size={15} /> : <Lock size={15} />}
                          </button>

                          {/* Delete Action */}
                          <button
                            onClick={() => handleDeleteUser(app.id)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition cursor-pointer"
                            title="Delete Applicant Account"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="text-slate-500 font-medium">
            {totalItems === 0 ? (
              <span>Showing <strong className="text-slate-900 font-mono">0</strong> Applicants</span>
            ) : (
              <span>
                Showing <strong className="text-slate-900 font-mono">{startIndex + 1}–{endIndex}</strong> of{" "}
                <strong className="text-slate-900 font-mono">{totalItems}</strong> Applicants
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition ${
                currentPage === 1
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 cursor-pointer"
              }`}
            >
              <ChevronLeft size={14} /> Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition border cursor-pointer ${
                  currentPage === pageNum
                    ? "bg-[#4848F7] text-white border-[#4848F7] shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalItems === 0}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition ${
                currentPage === totalPages || totalItems === 0
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 cursor-pointer"
              }`}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* APPLICANT DETAILS CENTERED VIEW MODAL - BRIGHT WHITE & BLUE THEME */}
      {viewApplicant && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewApplicant(null);
          }}
          className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-slate-800">
            
            {/* Modal Header - Crisp Royal Blue Gradient */}
            <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-5 flex items-center justify-between border-b border-blue-700 shrink-0 rounded-t-3xl shadow-md">
              <div className="flex items-center gap-3.5">
                <img
                  src={
                    viewApplicant.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
                  }
                  alt={viewApplicant.name}
                  className="w-13 h-13 rounded-full object-cover border-2 border-white/90 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-black text-white font-outfit tracking-wide">{viewApplicant.name}</h2>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                        viewApplicant.status === "Active"
                          ? "bg-emerald-500/20 text-white border-white/30"
                          : viewApplicant.status === "Blocked"
                          ? "bg-red-500/30 text-white border-white/30"
                          : "bg-white/20 text-white border-white/30"
                      }`}
                    >
                      {viewApplicant.status}
                    </span>
                  </div>
                  <p className="text-xs text-blue-100 font-mono flex items-center gap-2 mt-1">
                    <span>{viewApplicant.id}</span>
                    <span className="text-blue-300">•</span>
                    <span>{viewApplicant.email}</span>
                    <span className="text-blue-300">•</span>
                    <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-white font-sans font-semibold">
                      <span>{viewApplicant.flag}</span> {viewApplicant.country}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewApplicant(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer border border-white/20"
              >
                <X size={18} />
              </button>
            </div>

            {/* 7 Section Navigation Tabs - Bright Blue Bar with Custom Light Scrollbar */}
            <div className="bg-[#EEF2FF] border-b-2 border-blue-200 px-4 flex items-center gap-1.5 overflow-x-auto shrink-0 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-blue-100 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full">
              {[
                { id: "personal", label: "Personal Information", icon: FileText },
                { id: "visa", label: "Visa Information", icon: Globe },
                { id: "documents", label: "Documents", icon: CheckCircle2 },
                { id: "payments", label: "Payment Details", icon: CreditCard },
                { id: "timeline", label: "Activity Timeline", icon: History },
                { id: "quickActions", label: "Quick Actions", icon: Briefcase },
                { id: "bulkActions", label: "Bulk Actions", icon: Users }
              ].map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all duration-200 whitespace-nowrap cursor-pointer -mb-[2px] ${
                      isActive
                        ? "bg-[#2563EB] text-white font-extrabold rounded-t-xl shadow-md border-[#2563EB]"
                        : "border-transparent text-slate-700 hover:text-[#2563EB] hover:bg-white/80"
                    }`}
                  >
                    <IconComp size={15} className={isActive ? "text-white" : "text-[#2563EB]/70"} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body Tab Contents - Clean Light Slate with Custom Scrollbar */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/90 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#F1F5F9] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* 1. PERSONAL INFORMATION TAB */}
              {activeTab === "personal" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <FileText size={16} className="text-[#2563EB]" />
                      <span>Personal Information</span>
                    </h3>
                    <span className="text-[10px] font-mono text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 font-bold">
                      Verified Passport Identity
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">Full Name</span>
                      <strong className="text-slate-900 text-sm font-extrabold">{viewApplicant.name}</strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">Date of Birth</span>
                      <strong className="text-slate-800 font-mono text-xs font-bold">{viewApplicant.dob || "14 May 1994"}</strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">Gender</span>
                      <strong className="text-slate-800 font-bold">{viewApplicant.gender || "Female"}</strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">Nationality</span>
                      <strong className="text-slate-800 font-bold">{viewApplicant.nationality || "Indian"}</strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">Passport Number</span>
                      <strong className="text-[#2563EB] font-mono text-sm font-extrabold">{viewApplicant.passportNumber || "Z9876543"}</strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">Passport Expiry</span>
                      <strong className="text-slate-800 font-mono font-bold">{viewApplicant.passportExpiry || "12 Dec 2031"}</strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">Email Address</span>
                      <strong className="text-[#2563EB] font-mono font-bold">{viewApplicant.email}</strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">Mobile Number</span>
                      <strong className="text-slate-800 font-mono font-bold">{viewApplicant.mobile}</strong>
                    </div>

                    <div className="md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">Permanent Residential Address</span>
                      <strong className="text-slate-800 font-semibold">{viewApplicant.address || "B-402, Green Park Avenue, New Delhi, India"}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. VISA INFORMATION TAB */}
              {activeTab === "visa" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Globe size={16} className="text-[#2563EB]" />
                      <span>Visa Application Details</span>
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
                      Active Application State
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">Current Visa Scheme</span>
                      <strong className="text-slate-800 font-bold">{viewApplicant.currentVisa || "Express Entry PR / Tourist"}</strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">Visa Subclass / Category</span>
                      <strong className="text-slate-800 font-bold">{viewApplicant.visaType || "Tourist Visa Subclass 600"}</strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">Destination Country</span>
                      <strong className="text-slate-900 font-extrabold flex items-center gap-2 mt-0.5">
                        <span className="text-lg">{viewApplicant.flag}</span>
                        <span>{viewApplicant.destinationCountry || viewApplicant.country}</span>
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">Application Status</span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold font-mono bg-amber-50 text-amber-700 border border-amber-200 inline-block mt-0.5">
                        {viewApplicant.applicationStatus || "Under Review"}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">Assigned Agent</span>
                      <strong className="text-slate-800 font-bold">{viewApplicant.assignedAgent || "Balram Suman"}</strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">Processing Stage</span>
                      <strong className="text-slate-800 font-bold">{viewApplicant.processingStage || "Embassy Document Verification"}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. DOCUMENTS TAB */}
              {activeTab === "documents" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <CheckCircle2 size={16} className="text-[#2563EB]" />
                      <span>Required Documents Checklist</span>
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    {[
                      { name: "Passport Scan Copy (Biometric & Stamps)", key: "passport" },
                      { name: "Passport Size High-Res Photograph", key: "photograph" },
                      { name: "6 Months Verified Bank Statement", key: "bankStatement" },
                      { name: "Sponsorship / Official Invitation Letter", key: "invitationLetter" }
                    ].map((doc) => {
                      const isUploaded = viewApplicant.documents?.[doc.key as keyof typeof viewApplicant.documents] ?? true;

                      return (
                        <div
                          key={doc.key}
                          className="p-4 rounded-xl border border-slate-200/80 bg-slate-50 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <FileText size={18} className="text-[#2563EB]" />
                            <span className="font-extrabold text-slate-800">{doc.name}</span>
                          </div>

                          {isUploaded ? (
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold font-mono flex items-center gap-1.5 text-[11px]">
                              <CheckCircle2 size={14} /> Verified & Uploaded
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg font-bold font-mono flex items-center gap-1.5 text-[11px]">
                              <XCircle size={14} /> Action Required / Missing
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. PAYMENT DETAILS TAB */}
              {activeTab === "payments" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <CreditCard size={16} className="text-[#2563EB]" />
                      <span>Payment & Financial History</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">Total Paid Amount</span>
                      <strong className="text-emerald-600 text-xl font-mono font-black">
                        ₹{(viewApplicant.payments?.totalPaid || 45000).toLocaleString("en-IN")}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">Pending Balance</span>
                      <strong className="text-red-600 text-xl font-mono font-black">
                        ₹{(viewApplicant.payments?.pendingAmount || 0).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Transaction History Log</h4>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                      {(viewApplicant.payments?.history || []).map((txn, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50/60 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-800">{txn.desc}</p>
                            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                              {txn.date} • via {txn.method}
                            </p>
                          </div>
                          <span className="font-mono font-bold text-emerald-600 text-sm">
                            +₹{txn.amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. ACTIVITY TIMELINE TAB */}
              {activeTab === "timeline" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <History size={16} className="text-[#2563EB]" />
                      <span>Applicant Activity Timeline</span>
                    </h3>
                  </div>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {(viewApplicant.timeline || []).map((item, idx) => (
                      <div key={idx} className="relative text-xs">
                        <div
                          className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                            item.completed
                              ? "border-emerald-500 text-emerald-500"
                              : "border-slate-300 text-slate-300"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              item.completed ? "bg-emerald-500" : "bg-slate-300"
                            }`}
                          />
                        </div>
                        <p className="font-extrabold text-slate-900 text-xs">{item.title}</p>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">{item.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. QUICK ACTIONS TAB */}
              {activeTab === "quickActions" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Briefcase size={16} className="text-[#2563EB]" />
                      <span>Quick Operational Actions</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <button
                      onClick={() => triggerToast(`Navigated to full profile of ${viewApplicant.name}`)}
                      className="p-3.5 bg-white hover:bg-[#EEF2FF] border border-slate-200 hover:border-[#2563EB]/50 rounded-xl font-bold text-[#2563EB] flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>View Full Profile</span>
                      <ArrowUpRight size={15} />
                    </button>

                    <button
                      onClick={() => triggerToast(`Filtered applications for ${viewApplicant.name}`)}
                      className="p-3.5 bg-white hover:bg-[#EEF2FF] border border-slate-200 hover:border-[#2563EB]/50 rounded-xl font-bold text-[#2563EB] flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>View Applications ({viewApplicant.totalApplications})</span>
                      <ArrowUpRight size={15} />
                    </button>

                    <button
                      onClick={() => triggerToast(`Agent assignment dialog opened for ${viewApplicant.name}`)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Assign Senior Agent</span>
                      <Briefcase size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => triggerToast(`Push notification sent to ${viewApplicant.name}`)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Send Direct Notification</span>
                      <Bell size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => handleBlockUser(viewApplicant.id)}
                      className={`p-3.5 border rounded-xl font-bold flex items-center justify-between transition cursor-pointer shadow-2xs ${
                        viewApplicant.status === "Blocked"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                      }`}
                    >
                      <span>{viewApplicant.status === "Blocked" ? "Activate User" : "Block User"}</span>
                      {viewApplicant.status === "Blocked" ? <Unlock size={15} /> : <Lock size={15} />}
                    </button>

                    <button
                      onClick={() => handleDeleteUser(viewApplicant.id)}
                      className="p-3.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Delete Account Record</span>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* 7. BULK ACTIONS TAB */}
              {activeTab === "bulkActions" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Users size={16} className="text-[#2563EB]" />
                      <span>Bulk Operational Actions</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <button
                      onClick={() => handleSelectAll(true)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Select All Applicants</span>
                      <CheckCircle2 size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => handleBulkAction("export")}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Export Applicants</span>
                      <Download size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => handleBulkAction("email")}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Send Bulk Email</span>
                      <Mail size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => handleBulkAction("notification")}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Send Bulk Notification</span>
                      <Bell size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => handleBulkAction("block")}
                      className="p-3.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Block Selected</span>
                      <Lock size={15} />
                    </button>

                    <button
                      onClick={() => handleBulkAction("delete")}
                      className="p-3.5 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-xl font-bold flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Delete Selected</span>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
