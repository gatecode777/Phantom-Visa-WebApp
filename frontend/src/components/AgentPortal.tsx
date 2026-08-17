"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVisa, Application, VisaStatus, formatINR, AgentTab } from "../context/VisaContext";
import MRZStrip from "./MRZStrip";
import Logo from "./Logo";
import AllApplicationsManagement from "./AllApplicationsManagement";
import NewApplicationsManagement from "./NewApplicationsManagement";
import AssignedApplicationsManagement from "./AssignedApplicationsManagement";
import UnderReviewManagement from "./UnderReviewManagement";
import ApprovedApplicationsManagement from "./ApprovedApplicationsManagement";
import RejectedApplicationsManagement from "./RejectedApplicationsManagement";
import CompletedApplicationsManagement from "./CompletedApplicationsManagement";
import AllApplicants from "./AllApplicants";
import ApplicantDetailsManagement from "./ApplicantDetailsManagement";
import PendingVerificationManagement from "./PendingVerificationManagement";
import VerifiedDocumentsManagement from "./VerifiedDocumentsManagement";
import PendingDocumentsManagement from "./PendingDocumentsManagement";
import PendingPaymentsManagement from "./PendingPaymentsManagement";
import AllTransactionsManagement from "./AllTransactionsManagement";
import InvoicesManagement from "./InvoicesManagement";
import UpcomingAppointmentsManagement from "./UpcomingAppointmentsManagement";
import MessagesManagement from "./MessagesManagement";
import NotificationsManagement from "./NotificationsManagement";
import DailyReportsManagement from "./DailyReportsManagement";
import MonthlyReportsManagement from "./MonthlyReportsManagement";
import PerformanceReportsManagement from "./PerformanceReportsManagement";
import VisaTypeReportsManagement from "./VisaTypeReportsManagement";
import RevenueReportsManagement from "./RevenueReportsManagement";
import UserActivityReportsManagement from "./UserActivityReportsManagement";
import SupportManagement from "./SupportManagement";
import MyProfileManagement from "./MyProfileManagement";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  FileCheck,
  CreditCard,
  Calendar,
  MessageSquare,
  Bell,
  BarChart3,
  Settings,
  LifeBuoy,
  User,
  LogOut,
  Search,
  Plus,
  Coins,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Upload,
  RefreshCw,
  Sparkles,
  Wallet,
  Clock,
  ArrowRight,
  Check,
  ShieldCheck,
  Building,
  MapPin
} from "lucide-react";

export default function AgentPortal() {
  const navigate = useNavigate();
  const {
    applications,
    walletBalance,
    ledger,
    commissions,
    auditLogs,
    authSession,
    unifiedAppointments,
    addApplication,
    addFunds,
    requestPayout,
    agentTab,
    setAgentTab,
    updateApplicationStatus,
    updateApplicationDocs,
    logoutSession
  } = useVisa();

  // Accordions for Sidebar Navigation
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    visa_apps: true,
    applicants: false,
    doc_verif: false,
    payments: false,
    reports: false
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTabChange = (tab: AgentTab) => {
    setAgentTab(tab);
    if (typeof window !== "undefined") {
      const newUrl = `${window.location.pathname}?tab=${encodeURIComponent(tab)}`;
      window.history.replaceState(null, "", newUrl);
      localStorage.setItem("agent_active_tab", tab);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get("tab") as AgentTab | null;
      const storedTab = localStorage.getItem("agent_active_tab") as AgentTab | null;
      const targetTab = urlTab || storedTab;
      if (targetTab) {
        setAgentTab(targetTab);
      }
    }
  }, []);

  // Sub-tab filtering states
  const [appSubTab, setAppSubTab] = useState<
    "all" | "new" | "assigned" | "review" | "approved" | "rejected" | "completed"
  >("assigned");
  const [applicantSubTab, setApplicantSubTab] = useState<"list" | "details">("list");
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [docSubTab, setDocSubTab] = useState<"pending" | "verified" | "rejected">("pending");
  const [paymentSubTab, setPaymentSubTab] = useState<"verification" | "transactions" | "invoices">("transactions");
  const [reportSubTab, setReportSubTab] = useState<"daily" | "monthly" | "performance">("daily");

  // Filter & Search States
  const [searchAppQuery, setSearchAppQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Modals
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Inputs
  const [topupAmount, setTopupAmount] = useState("50000");
  const [payoutAmount, setPayoutAmount] = useState("10000");

  // Visa Apply Wizard (Self Application Flow)
  const [searchDest, setSearchDest] = useState("Canada");
  const [searchType, setSearchType] = useState("Tourist Visa");
  const [applicantName, setApplicantName] = useState("");
  const [passportNum, setPassportNum] = useState("");
  const [travelDates, setTravelDates] = useState("");
  const [isEmployed, setIsEmployed] = useState(true);
  const [isSponsored, setIsSponsored] = useState(false);

  const availableProducts = [
    { destination: "Canada", visaType: "Tourist Visa", price: 13280, processingDays: "12-15 Days", flag: "🇨🇦" },
    { destination: "United Kingdom", visaType: "Standard Visitor", price: 16185, processingDays: "15-20 Days", flag: "🇬🇧" },
    { destination: "Australia", visaType: "Visitor Visa 600", price: 14500, processingDays: "10-14 Days", flag: "🇦🇺" },
    { destination: "United States", visaType: "B1/B2 Tourist", price: 17800, processingDays: "30-45 Days", flag: "🇺🇸" },
    { destination: "Schengen (France)", visaType: "Short Stay", price: 11900, processingDays: "7-10 Days", flag: "🇫🇷" },
    { destination: "Japan", visaType: "Tourist eVisa", price: 7885, processingDays: "5-7 Days", flag: "🇯🇵" }
  ];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApplyVisaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !passportNum) {
      triggerToast("Please complete traveler personal and passport information.");
      return;
    }
    const newId = `VO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const selectedProduct = availableProducts.find(
      (p) => p.destination === searchDest && p.visaType === searchType
    );

    addApplication({
      id: newId,
      travelerName: applicantName,
      dob: "1994-08-14",
      passportNumber: passportNum,
      passportExpiry: "2034-08-14",
      nationality: "Indian",
      destination: selectedProduct?.destination || searchDest,
      visaType: selectedProduct?.visaType || searchType,
      travelDates: travelDates || "2026-10-01 to 2026-10-15",
      status: "Submitted",
      fees: selectedProduct?.price || 13280,
      submissionDate: new Date().toISOString().split("T")[0],
      verifiedDocs: { passport: "verified", photo: "verified" },
      checklist: { employed: isEmployed, sponsored: isSponsored }
    });
    triggerToast(`Application ${newId} submitted into embassy queue! Fee deducted.`);
    setAgentTab("applications");
  };

  // Agent Identity Details
  const agentName = authSession?.user?.name || "Agent";
  const agentInitials = agentName
    .split(" ")
    .map((w: string) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AG";

  // Dynamic Live Data Derivations from Context & DB
  const agentApplications = applications || [];
  const totalAssigned = agentApplications.length;
  const rejectedCount = agentApplications.filter((a) => a.status === "Rejected").length;
  const underReviewCount = agentApplications.filter(
    (a) => a.status === "Under Review" || a.status === "Submitted" || a.status === "Docs Pending" || a.status === "Document Pending" || a.status === "Embassy Processing"
  ).length;
  const approvedCount = agentApplications.filter((a) => a.status === "Approved").length;
  const completedCount = agentApplications.filter((a) => a.status === "Completed").length;
  const cancelledCount = agentApplications.filter((a) => a.status === "Cancelled").length;
  const docsToVerifyCount = agentApplications.filter(
    (a) =>
      a.status === "Docs Pending" ||
      a.status === "Document Pending" ||
      (a.verifiedDocs && (a.verifiedDocs.passport === "needs_review" || a.verifiedDocs.photo === "needs_review" || a.verifiedDocs.passport === "pending"))
  ).length;

  const underReviewPct = totalAssigned > 0 ? ((underReviewCount / totalAssigned) * 100).toFixed(1) : "0.0";
  const approvedPct = totalAssigned > 0 ? ((approvedCount / totalAssigned) * 100).toFixed(1) : "0.0";
  const rejectedPct = totalAssigned > 0 ? ((rejectedCount / totalAssigned) * 100).toFixed(1) : "0.0";
  const cancelledPct = totalAssigned > 0 ? ((cancelledCount / totalAssigned) * 100).toFixed(1) : "0.0";

  return (
    <div className="flex h-screen bg-[#F8F9FD] text-slate-800 font-sans overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-indigo-600 text-white font-semibold text-xs px-4 py-3 rounded-lg shadow-xl animate-fade-in flex items-center gap-2">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* LEFT SIDEBAR NAVIGATION */}
      {/* ============================================================ */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full select-none z-20 shrink-0">
        {/* Top Branding Section in Sidebar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <Logo variant="header" />
        </div>

        {/* Scrollable Sidebar Nav Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-medium text-slate-600">
          {/* Dashboard */}
          <button
            onClick={() => handleTabChange("dashboard")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
              agentTab === "dashboard"
                ? "bg-purple-50 text-purple-700 font-bold shadow-sm"
                : "hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <LayoutDashboard size={18} className={agentTab === "dashboard" ? "text-purple-600" : "text-slate-400"} />
            <span>Dashboard</span>
          </button>

          {/* Visa Applications Single Direct Menu */}
          <button
            onClick={() => handleTabChange("applications")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              agentTab === "applications"
                ? "bg-purple-50 text-purple-700 font-extrabold shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <ClipboardList size={18} className={agentTab === "applications" ? "text-purple-600" : "text-slate-400"} />
            <span>Visa Applications</span>
          </button>

          {/* Applicants Single Direct Menu */}
          <button
            onClick={() => {
              setApplicantSubTab("list");
              handleTabChange("applicants");
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              agentTab === "applicants"
                ? "bg-purple-50 text-purple-700 font-extrabold shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Users size={18} className={agentTab === "applicants" ? "text-purple-600" : "text-slate-400"} />
            <span>Applicants</span>
          </button>

          {/* Document Verification Single Direct Menu */}
          <button
            onClick={() => handleTabChange("doc_verification")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              agentTab === "doc_verification"
                ? "bg-purple-50 text-purple-700 font-extrabold shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <FileCheck size={18} className={agentTab === "doc_verification" ? "text-purple-600" : "text-slate-400"} />
            <span>Document Verification</span>
          </button>

          {/* Payments Accordion */}
          <div>
            <button
              onClick={() => {
                toggleAccordion("payments");
                handleTabChange("payments");
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                agentTab === "payments"
                  ? "bg-purple-50 text-purple-700 font-bold"
                  : "hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard size={18} className={agentTab === "payments" ? "text-purple-600" : "text-slate-400"} />
                <span>Payments</span>
              </div>
              {openAccordions["payments"] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {openAccordions["payments"] && (
              <div className="ml-8 mt-1 space-y-1 text-[11px] text-slate-500 border-l border-slate-100 pl-2">
                <button
                  onClick={() => { setPaymentSubTab("verification"); handleTabChange("payments"); }}
                  className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                    agentTab === "payments" && paymentSubTab === "verification" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>Payment Verification</span>
                </button>
                <button
                  onClick={() => { setPaymentSubTab("transactions"); handleTabChange("payments"); }}
                  className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                    agentTab === "payments" && paymentSubTab === "transactions" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>Transactions</span>
                </button>
                <button
                  onClick={() => { setPaymentSubTab("invoices"); handleTabChange("payments"); }}
                  className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                    agentTab === "payments" && paymentSubTab === "invoices" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>Invoices</span>
                </button>
              </div>
            )}
          </div>

          {/* Appointments */}
          <button
            onClick={() => handleTabChange("appointments")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
              agentTab === "appointments"
                ? "bg-purple-50 text-purple-700 font-bold"
                : "hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Calendar size={18} className={agentTab === "appointments" ? "text-purple-600" : "text-slate-400"} />
            <span>All Appointments</span>
          </button>

          {/* Messages */}
          <button
            onClick={() => handleTabChange("messages")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
              agentTab === "messages"
                ? "bg-purple-50 text-purple-700 font-bold"
                : "hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <MessageSquare size={18} className={agentTab === "messages" ? "text-purple-600" : "text-slate-400"} />
            <span>Messages</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => handleTabChange("notifications")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
              agentTab === "notifications"
                ? "bg-purple-50 text-purple-700 font-bold"
                : "hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Bell size={18} className={agentTab === "notifications" ? "text-purple-600" : "text-slate-400"} />
            <span>Notifications</span>
          </button>

          {/* Reports Accordion */}
          <div>
            <button
              onClick={() => {
                toggleAccordion("reports");
                handleTabChange("reports");
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                agentTab === "reports"
                  ? "bg-purple-50 text-purple-700 font-bold"
                  : "hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 size={18} className={agentTab === "reports" ? "text-purple-600" : "text-slate-400"} />
                <span>Reports</span>
              </div>
              {openAccordions["reports"] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {openAccordions["reports"] && (
              <div className="ml-8 mt-1 space-y-1 text-[11px] text-slate-500 border-l border-slate-100 pl-2">
                <button
                  onClick={() => { setReportSubTab("daily"); handleTabChange("reports"); }}
                  className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                    agentTab === "reports" && reportSubTab === "daily" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>Daily Report</span>
                </button>
                <button
                  onClick={() => { setReportSubTab("monthly"); handleTabChange("reports"); }}
                  className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                    agentTab === "reports" && reportSubTab === "monthly" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>Monthly Report</span>
                </button>
                <button
                  onClick={() => { setReportSubTab("performance"); handleTabChange("reports"); }}
                  className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                    agentTab === "reports" && reportSubTab === "performance" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>Performance Report</span>
                </button>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1">
            {/* Support */}
            <button
              onClick={() => handleTabChange("support")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                agentTab === "support" ? "bg-purple-50 text-purple-700 font-bold" : "hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <LifeBuoy size={18} className={agentTab === "support" ? "text-purple-600" : "text-slate-400"} />
              <span>Support</span>
            </button>

            {/* My Profile */}
            <button
              onClick={() => handleTabChange("profile")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                agentTab === "profile" ? "bg-purple-50 text-purple-700 font-bold" : "hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <User size={18} className={agentTab === "profile" ? "text-purple-600" : "text-slate-400"} />
              <span>My Profile</span>
            </button>

            {/* Logout */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition"
            >
              <LogOut size={18} className="text-slate-400 hover:text-rose-600" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* RIGHT MAIN CONTENT AREA */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between z-10">
          {/* Wallet Action Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddFundsModal(true)}
              className="flex items-center gap-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-3.5 py-1.5 rounded-full font-semibold text-xs transition shadow-sm"
            >
              <Wallet size={16} className="text-sky-600" />
              <span>Wallet</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-md mx-6">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchAppQuery}
                onChange={(e) => setSearchAppQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-purple-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* User Profile & Quick Notifications */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTabChange("messages")}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center relative transition"
            >
              <MessageSquare size={16} />
            </button>

            <button
              onClick={() => handleTabChange("notifications")}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center relative transition"
            >
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-600"></span>
            </button>

            {/* Profile Avatar */}
            <div
              onClick={() => handleTabChange("profile")}
              className="flex items-center gap-2 pl-2 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden flex items-center justify-center font-bold text-indigo-700 text-xs">
                {agentInitials}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Workspace */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ============================================================ */}
          {/* SECTION 1: DASHBOARD OVERVIEW */}
          {/* ============================================================ */}
          {agentTab === "dashboard" && (
            <div className="space-y-6">
              {/* Greeting Header */}
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Good Morning, {agentName} 👋
                </h1>
              </div>

              {/* KPI Summary Cards Grid (5 Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Total Assigned */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2">
                  <span className="text-[11px] font-medium text-slate-500 block">Total Assigned</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900">{totalAssigned}</span>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-0.5">
                      Live Queue
                    </span>
                  </div>
                </div>

                {/* Rejected Today */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2">
                  <span className="text-[11px] font-medium text-slate-500 block">Rejected</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900">{rejectedCount}</span>
                    <span className="text-[11px] font-semibold text-rose-500 flex items-center gap-0.5">
                      {rejectedPct}%
                    </span>
                  </div>
                </div>

                {/* Under Review */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2">
                  <span className="text-[11px] font-medium text-slate-500 block">Under Review</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900">{underReviewCount}</span>
                    <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-0.5">
                      {underReviewPct}%
                    </span>
                  </div>
                </div>

                {/* Approved */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2">
                  <span className="text-[11px] font-medium text-slate-500 block">Approved</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900">{approvedCount}</span>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                      {approvedPct}%
                    </span>
                  </div>
                </div>

                {/* Documents to Verify */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2">
                  <span className="text-[11px] font-medium text-slate-500 block">Docs to Verify</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900">{docsToVerifyCount}</span>
                    <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-0.5">
                      Awaiting Audit
                    </span>
                  </div>
                </div>
              </div>

              {/* Table: My Assigned Applications */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-900">My Assigned Applications</h3>
                  <button
                    onClick={() => {
                      setAppSubTab("assigned");
                      handleTabChange("applications");
                    }}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-purple-50/60 text-purple-900 font-semibold border-b border-purple-100">
                        <th className="py-2.5 px-3">Application ID</th>
                        <th className="py-2.5 px-3">Applicant Name</th>
                        <th className="py-2.5 px-3">Country</th>
                        <th className="py-2.5 px-3">Visa Type</th>
                        <th className="py-2.5 px-3">Submit On</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {agentApplications.length > 0 ? (
                        agentApplications.slice(0, 5).map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-3 font-mono font-medium text-slate-600">{row.id}</td>
                            <td className="py-3 px-3 font-semibold text-slate-900">{row.travelerName}</td>
                            <td className="py-3 px-3">{row.destination}</td>
                            <td className="py-3 px-3 text-slate-600">{row.visaType}</td>
                            <td className="py-3 px-3 text-slate-500">{row.submissionDate}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                  row.status === "Approved"
                                    ? "text-emerald-600 bg-emerald-50"
                                    : row.status === "Rejected"
                                    ? "text-rose-600 bg-rose-50"
                                    : "text-amber-600 bg-amber-50"
                                }`}
                              >
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                            No applications assigned to your queue in the database.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Middle Row (2 Columns: Applications Status Overview & Document Verifications) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Card: Applications Status Overview */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-slate-900">Applications Status Overview</h3>
                    <span className="text-xs font-semibold text-slate-400 font-mono">Live Sync</span>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-around py-4 gap-6">
                    {/* Polar/Coxcomb SVG Chart */}
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                        {/* Concentric grid circles */}
                        <circle cx="100" cy="100" r="80" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                        <circle cx="100" cy="100" r="60" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                        <circle cx="100" cy="100" r="40" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                        <circle cx="100" cy="100" r="20" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />

                        {totalAssigned > 0 ? (
                          <>
                            <path d="M 100 100 L 100 20 A 80 80 0 0 1 180 100 Z" fill="#93C5FD" fillOpacity="0.75" stroke="#ffffff" strokeWidth="2" />
                            <path d="M 100 100 L 180 100 A 80 80 0 0 1 20 100 Z" fill="#86EFAC" fillOpacity="0.85" stroke="#ffffff" strokeWidth="2" />
                            <path d="M 100 100 L 20 100 A 80 80 0 0 1 50 30 Z" fill="#FDBA74" fillOpacity="0.85" stroke="#ffffff" strokeWidth="2" />
                            <path d="M 100 100 L 50 30 A 80 80 0 0 1 100 20 Z" fill="#FCA5A5" fillOpacity="0.85" stroke="#ffffff" strokeWidth="2" />
                          </>
                        ) : null}
                      </svg>
                      {/* Center total overlay */}
                      <div className="absolute text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total</span>
                        <span className="text-base font-extrabold text-slate-900 font-mono">{totalAssigned}</span>
                      </div>
                    </div>

                    {/* Chart Legend */}
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-300"></span>
                          <span className="text-slate-600 font-medium">Under Review</span>
                        </div>
                        <span className="font-bold text-slate-900">{underReviewPct}% <span className="text-slate-400 font-normal">({underReviewCount})</span></span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-300"></span>
                          <span className="text-slate-600 font-medium">Approved</span>
                        </div>
                        <span className="font-bold text-slate-900">{approvedPct}% <span className="text-slate-400 font-normal">({approvedCount})</span></span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-300"></span>
                          <span className="text-slate-600 font-medium">Rejected</span>
                        </div>
                        <span className="font-bold text-slate-900">{rejectedPct}% <span className="text-slate-400 font-normal">({rejectedCount})</span></span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-300"></span>
                          <span className="text-slate-600 font-medium">Cancelled</span>
                        </div>
                        <span className="font-bold text-slate-900">{cancelledPct}% <span className="text-slate-400 font-normal">({cancelledCount})</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Card: Document Verifications */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-slate-900">Document Verifications</h3>
                    <button
                      onClick={() => handleTabChange("doc_verification")}
                      className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-purple-50/60 text-purple-900 font-semibold border-b border-purple-100">
                          <th className="py-2.5 px-3">Documents Verification</th>
                          <th className="py-2.5 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {agentApplications.filter((a) => a.status === "Docs Pending" || a.status === "Document Pending").length > 0 ? (
                          agentApplications
                            .filter((a) => a.status === "Docs Pending" || a.status === "Document Pending")
                            .slice(0, 5)
                            .map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 transition">
                                <td className="py-2.5 px-3">
                                  <span className="font-semibold text-slate-900 block">
                                    Passport Verification &bull; {item.travelerName}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {item.id} &bull; {item.submissionDate}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <span className="text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full font-semibold text-[11px]">
                                    Needs Audit
                                  </span>
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={2} className="py-6 text-center text-slate-400 font-medium">
                              No documents currently pending verification.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Third Row (2 Columns: My Task & Upcoming Appointments) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Card: My Task */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-slate-900">My Tasks</h3>
                    <button
                      onClick={() => handleTabChange("applications")}
                      className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition cursor-pointer"
                    >
                      View All &gt;
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    <div
                      onClick={() => handleTabChange("doc_verification")}
                      className="bg-slate-50/80 hover:bg-slate-100/80 p-3 rounded-lg flex items-center justify-between transition cursor-pointer"
                    >
                      <div>
                        <span className="text-[11px] text-slate-400 block">Documents Pending Verifications</span>
                        <span className="text-xs font-bold text-slate-900">Verify Documents</span>
                      </div>
                      <span className="font-bold text-sm text-slate-800 font-mono">{docsToVerifyCount}</span>
                    </div>

                    <div
                      onClick={() => handleTabChange("applications")}
                      className="bg-slate-50/80 hover:bg-slate-100/80 p-3 rounded-lg flex items-center justify-between transition cursor-pointer"
                    >
                      <div>
                        <span className="text-[11px] text-slate-400 block">Applications in Review</span>
                        <span className="text-xs font-bold text-slate-900">Review Applications</span>
                      </div>
                      <span className="font-bold text-sm text-slate-800 font-mono">{underReviewCount}</span>
                    </div>

                    <div
                      onClick={() => handleTabChange("appointments")}
                      className="bg-slate-50/80 hover:bg-slate-100/80 p-3 rounded-lg flex items-center justify-between transition cursor-pointer"
                    >
                      <div>
                        <span className="text-[11px] text-slate-400 block">Appointments to Confirm</span>
                        <span className="text-xs font-bold text-slate-900">Schedule Appointments</span>
                      </div>
                      <span className="font-bold text-sm text-slate-800 font-mono">{(unifiedAppointments || []).length}</span>
                    </div>
                  </div>
                </div>

                {/* Right Card: Upcoming Appointments */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-slate-900">Upcoming Appointments</h3>
                    <button
                      onClick={() => handleTabChange("appointments")}
                      className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition cursor-pointer"
                    >
                      View All &gt;
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {(unifiedAppointments || []).length > 0 ? (
                      (unifiedAppointments || []).slice(0, 3).map((apt, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50/80 p-3 rounded-lg flex items-center justify-between text-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-800">{apt.visaType}</span>
                            </div>
                            <span className="font-bold text-slate-900 block">{apt.applicantName}</span>
                          </div>

                          <div className="text-right space-y-0.5">
                            <span className="text-[11px] text-slate-500 block">{apt.vacCenter}</span>
                            <div className="flex items-center justify-end gap-2 text-[11px] font-semibold text-slate-800">
                              <span>{apt.dateDisplay}</span>
                              <span className="font-mono">{apt.timeSlot}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-slate-400 text-xs font-medium">
                        No upcoming appointments in the database.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Recent Activity */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-900">Recent Activity</h3>
                  <button
                    onClick={() => handleTabChange("applications")}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition cursor-pointer"
                  >
                    View All &gt;
                  </button>
                </div>

                {agentApplications.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {agentApplications.slice(0, 4).map((app, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-700">{app.id}</span>
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {app.status}
                          </span>
                        </div>
                        <p className="font-bold text-slate-900 truncate">{app.travelerName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{app.destination} &bull; {app.visaType}</p>
                        <span className="text-[10px] text-slate-400 block pt-1">{app.submissionDate}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-slate-400 text-xs font-medium">
                    No recent activity recorded in the database.
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-center pt-4 pb-2 text-[11px] text-slate-400 font-medium">
                @2026 Visa OS All Rights Reserved
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* OTHER SUB-TAB VIEWS (Visa Applications, Applicants, etc.) */}
          {/* ============================================================ */}
          {agentTab === "applications" && (
            <div className="space-y-6">
              <AllApplicationsManagement />
            </div>
          )}

          {agentTab === "applicants" && (
            <div>
              {applicantSubTab === "list" && (
                <AllApplicants
                  onSelectApplicant={(app) => {
                    setSelectedApplicant(app);
                    setApplicantSubTab("details");
                  }}
                />
              )}
              {applicantSubTab === "details" && (
                <ApplicantDetailsManagement
                  selectedApplicant={selectedApplicant}
                  onSelectApplicant={(app) => setSelectedApplicant(app)}
                  onBackToList={() => setApplicantSubTab("list")}
                />
              )}
            </div>
          )}

          {agentTab === "doc_verification" && (
            <div className="space-y-6">
              <PendingVerificationManagement />
            </div>
          )}

          {agentTab === "payments" && (
            <div className="space-y-6">
              {paymentSubTab === "verification" && <PendingPaymentsManagement />}
              {paymentSubTab === "transactions" && <AllTransactionsManagement />}
              {paymentSubTab === "invoices" && <InvoicesManagement />}
            </div>
          )}

          {agentTab === "appointments" && (
            <div className="space-y-6">
              <UpcomingAppointmentsManagement />
            </div>
          )}

          {agentTab === "messages" && (
            <div className="space-y-6">
              <MessagesManagement />
            </div>
          )}

          {agentTab === "notifications" && (
            <div className="space-y-6">
              <NotificationsManagement />
            </div>
          )}

          {agentTab === "reports" && (
            <div className="space-y-6">
              {reportSubTab === "daily" && <DailyReportsManagement />}
              {reportSubTab === "monthly" && <MonthlyReportsManagement />}
              {reportSubTab === "performance" && <PerformanceReportsManagement />}
            </div>
          )}


          {agentTab === "support" && (
            <div className="space-y-6">
              <SupportManagement />
            </div>
          )}

          {agentTab === "profile" && (
            <div className="space-y-6">
              <MyProfileManagement />
            </div>
          )}
        </main>
      </div>

      {/* TOP UP FUNDS MODAL */}
      {showAddFundsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 p-6 rounded-xl max-w-md w-full space-y-4 text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="font-bold text-base text-slate-900">TOP UP AGENCY WALLET</span>
              <button onClick={() => setShowAddFundsModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Enter Deposit Amount (INR)</label>
              <input
                type="number"
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddFundsModal(false)} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-semibold">Cancel</button>
              <button
                onClick={() => {
                  const amt = parseFloat(topupAmount);
                  if (amt > 0) {
                    addFunds(amt);
                    triggerToast(`Added ₹${formatINR(amt)} to agency wallet balance!`);
                    setShowAddFundsModal(false);
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg"
              >
                Confirm Deposit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 p-6 rounded-xl max-w-md w-full space-y-4 text-xs text-center shadow-2xl">
            <h3 className="font-bold text-lg text-slate-900">Log Out of Agent Portal?</h3>
            <p className="text-slate-500">Are you sure you want to exit your active agent session?</p>
            <div className="flex justify-center gap-3 pt-2">
              <button onClick={() => setShowLogoutModal(false)} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-semibold">Cancel</button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  logoutSession();
                  navigate("/login");
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-lg"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
