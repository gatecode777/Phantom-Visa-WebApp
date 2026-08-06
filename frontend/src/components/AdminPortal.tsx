"use client";

import React, { useState, useEffect } from "react";
import { useVisa, Application, VisaStatus, formatINR } from "../context/VisaContext";
import Logo from "./Logo";
import AllApplicants from "./AllApplicants";
import ActiveUsers from "./ActiveUsers";
import BlockedUsers from "./BlockedUsers";
import KycVerifications from "./KycVerifications";
import UserActivityLogs from "./UserActivityLogs";
import AllAgents from "./AllAgents";
import AddNewAgent from "./AddNewAgent";
import PendingApprovalAgents from "./PendingApprovalAgents";
import ActiveAgents from "./ActiveAgents";
import InactiveAgents from "./InactiveAgents";
import AgentPerformance from "./AgentPerformance";
import CountriesManagement from "./CountriesManagement";
import VisaCategoriesManagement from "./VisaCategoriesManagement";
import VisaTypesManagement from "./VisaTypesManagement";
import VisaRequirementsManagement from "./VisaRequirementsManagement";
import ProcessingTimeManagement from "./ProcessingTimeManagement";
import VisaFeesManagement from "./VisaFeesManagement";
import RequiredDocumentsManagement from "./RequiredDocumentsManagement";
import AllApplicationsManagement from "./AllApplicationsManagement";
import NewApplicationsManagement from "./NewApplicationsManagement";
import AssignedApplicationsManagement from "./AssignedApplicationsManagement";
import UnderReviewManagement from "./UnderReviewManagement";
import PendingDocumentsManagement from "./PendingDocumentsManagement";
import ApprovedApplicationsManagement from "./ApprovedApplicationsManagement";
import RejectedApplicationsManagement from "./RejectedApplicationsManagement";
import CompletedApplicationsManagement from "./CompletedApplicationsManagement";
import CancelledApplicationsManagement from "./CancelledApplicationsManagement";
import AllDocumentsManagement from "./AllDocumentsManagement";
import PendingVerificationManagement from "./PendingVerificationManagement";
import VerifiedDocumentsManagement from "./VerifiedDocumentsManagement";
import RejectedDocumentsManagement from "./RejectedDocumentsManagement";
import DocumentTemplatesManagement from "./DocumentTemplatesManagement";
import AllTransactionsManagement from "./AllTransactionsManagement";
import SuccessfulPaymentsManagement from "./SuccessfulPaymentsManagement";
import PendingPaymentsManagement from "./PendingPaymentsManagement";
import FailedPaymentsManagement from "./FailedPaymentsManagement";
import RefundRequestsManagement from "./RefundRequestsManagement";
import InvoicesManagement from "./InvoicesManagement";
import AllAppointmentsManagement from "./AllAppointmentsManagement";
import UpcomingAppointmentsManagement from "./UpcomingAppointmentsManagement";
import CompletedAppointmentsManagement from "./CompletedAppointmentsManagement";
import CancelledAppointmentsManagement from "./CancelledAppointmentsManagement";
import MessagesManagement from "./MessagesManagement";
import NotificationsManagement from "./NotificationsManagement";
import DashboardReportsManagement from "./DashboardReportsManagement";
import ApplicationReportsManagement from "./ApplicationReportsManagement";
import PaymentReportsManagement from "./PaymentReportsManagement";
import RevenueReportsManagement from "./RevenueReportsManagement";
import AgentPerformanceReportsManagement from "./AgentPerformanceReportsManagement";
import CountryReportsManagement from "./CountryReportsManagement";
import VisaTypeReportsManagement from "./VisaTypeReportsManagement";
import UserActivityReportsManagement from "./UserActivityReportsManagement";
import GeneralSettingsManagement from "./GeneralSettingsManagement";
import CompanyProfileManagement from "./CompanyProfileManagement";
import RolesPermissionsManagement from "./RolesPermissionsManagement";
import PaymentGatewayManagement from "./PaymentGatewayManagement";
import EmailConfigurationManagement from "./EmailConfigurationManagement";
import SMSConfigurationManagement from "./SMSConfigurationManagement";
import SecuritySettingsManagement from "./SecuritySettingsManagement";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Globe,
  ClipboardList,
  FileText,
  CreditCard,
  Calendar,
  MessageSquare,
  Bell,
  BarChart3,
  Settings,
  LifeBuoy,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Search,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Plus,
  Filter,
  Download,
  Eye,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Sliders,
  Database,
  Lock,
  Mail,
  PhoneCall,
  Server,
  Building,
  Key
} from "lucide-react";

export default function AdminPortal() {
  const {
    applications,
    updateApplicationStatus,
    walletBalance,
    logoutSession
  } = useVisa();

  // Active Main Section & Sub Section state
  const [activeSection, setActiveSection] = useState<string>("Dashboard");
  const [activeSubItem, setActiveSubItem] = useState<string>("");

  // Accordion Expand/Collapse State
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    "Apply for You": false,
    "Agent Management": false,
    "Visa Management": false,
    "Applications": false,
    "Documents": false,
    "Payments": false,
    "Appointments": false,
    "Reports & Analytics": false,
    "System Settings": false
  });

  const switchNav = (sec: string, sub: string = "") => {
    setActiveSection(sec);
    setActiveSubItem(sub);

    if (sec && sec !== "Dashboard") {
      setOpenAccordions((prev) => ({
        ...prev,
        [sec]: true
      }));
    }

    if (typeof window !== "undefined") {
      const newUrl = `${window.location.pathname}?sec=${encodeURIComponent(sec)}${
        sub ? `&sub=${encodeURIComponent(sub)}` : ""
      }`;
      window.history.replaceState(null, "", newUrl);

      localStorage.setItem("admin_active_section", sec);
      localStorage.setItem("admin_active_subitem", sub);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlSec = params.get("sec");
      const urlSub = params.get("sub");

      // Default strictly to "Dashboard" when navigating to /admin without query params
      const targetSec = urlSec ? decodeURIComponent(urlSec) : "Dashboard";
      const targetSub = urlSub ? decodeURIComponent(urlSub) : "";

      setActiveSection(targetSec);
      setActiveSubItem(targetSub);

      if (!urlSec) {
        localStorage.removeItem("admin_active_section");
        localStorage.removeItem("admin_active_subitem");
      }

      if (targetSec && targetSec !== "Dashboard") {
        setOpenAccordions((prev) => ({
          ...prev,
          [targetSec]: true
        }));
      }
    }
  }, []);

  const toggleAccordion = (name: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Toast feedback state
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Filter States for tables
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("Last 30 Days");

  // Sidebar Menu Definition matching 1:1 with the screenshot
  const menuStructure = [
    { type: "item", name: "Dashboard", icon: LayoutDashboard },
    {
      type: "group",
      name: "Apply for You",
      icon: Users,
      children: [
        "All Applicants",
        "Active Users",
        "Blocked Users",
        "KYC Verifications",
        "User Activity Logs"
      ]
    },
    {
      type: "group",
      name: "Agent Management",
      icon: Briefcase,
      children: [
        "Add New Agents",
        "All Agents",
        "Pending Approval",
        "Active Agents",
        "Inactive Agents",
        "Agent Performance"
      ]
    },
    {
      type: "group",
      name: "Visa Management",
      icon: Globe,
      children: [
        "Countries",
        "Visa Categories",
        "Visa Types",
        "Visa Requirements"
      ]
    },
    {
      type: "group",
      name: "Applications",
      icon: ClipboardList,
      children: [
        "All Applications",
        "New Applications",
        "Assigned Applications",
        "Under Review",
        "Pending Documents",
        "Approved",
        "Rejected",
        "Completed",
        "Cancelled"
      ]
    },
    {
      type: "group",
      name: "Documents",
      icon: FileText,
      children: [
        "All Documents",
        "Pending Verification",
        "Verified Documents",
        "Rejected Documents",
        "Document Templates"
      ]
    },
    {
      type: "group",
      name: "Payments",
      icon: CreditCard,
      children: [
        "All Transactions",
        "Successful Payments",
        "Pending Payments",
        "Failed Payments",
        "Refund Requests",
        "Invoices"
      ]
    },
    {
      type: "group",
      name: "Appointments",
      icon: Calendar,
      children: [
        "All Appointments",
        "Upcoming",
        "Completed",
        "Cancelled"
      ]
    },
    { type: "item", name: "Messages", icon: MessageSquare },
    { type: "item", name: "Notifications", icon: Bell },
    {
      type: "group",
      name: "Reports & Analytics",
      icon: BarChart3,
      children: [
        "Dashboard Reports",
        "Application Reports",
        "Payment Reports",
        "Revenue Reports",
        "Agent Performance",
        "Country-wise Reports",
        "Visa Type Reports",
        "User Activity"
      ]
    },
    {
      type: "group",
      name: "System Settings",
      icon: Settings,
      children: [
        "General Settings",
        "Company Profile",
        "Roles & Permissions",
        "Payment Gateway",
        "Email Configuration",
        "SMS Configuration",
        "Security Settings",
        "API Integrations",
        "Backup & Restore"
      ]
    },
    { type: "item", name: "Support", icon: LifeBuoy },
    { type: "item", name: "My Profile", icon: User },
    { type: "item", name: "Logout", icon: LogOut, action: () => logoutSession() }
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden select-none">
      
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-[#4848F7] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* TOP HEADER BAR */}
      {/* ============================================================ */}
      <header className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0 z-30 shadow-xs">
        {/* Left Logo & Wallet Badge */}
        <div className="flex items-center gap-6">
          <Logo variant="header" />

          <button
            onClick={() => switchNav("Payments", "All Transactions")}
            className="bg-[#EEF2FF] hover:bg-indigo-100 text-[#4848F7] font-semibold px-3.5 py-1.5 rounded-full border border-[#4848F7]/20 text-xs flex items-center gap-2 transition cursor-pointer shadow-2xs"
          >
            <Wallet size={15} className="text-[#4848F7]" />
            <span className="font-bold">Wallet</span>
          </button>
        </div>

        {/* Right Search, Chat, Bell, Profile Avatar */}
        <div className="flex items-center gap-3">
          {/* Search Field */}
          <div className="relative hidden md:block">
            <Search size={15} className="absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#F8FAFC] border border-slate-200 text-xs pl-9 pr-4 py-2 rounded-full w-64 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#4848F7] transition"
            />
          </div>

          {/* Messages */}
          <button
            onClick={() => switchNav("Messages", "")}
            className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            title="Messages"
          >
            <MessageSquare size={16} />
          </button>

          {/* Notifications */}
          <button
            onClick={() => switchNav("Notifications", "")}
            className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition cursor-pointer relative"
            title="Notifications"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#4848F7] rounded-full" />
          </button>

          {/* User Profile Avatar */}
          <div
            onClick={() => switchNav("My Profile", "")}
            className="w-9 h-9 rounded-full overflow-hidden border border-slate-300 cursor-pointer shadow-xs hover:ring-2 hover:ring-[#4848F7]/40 transition"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
              alt="Geeta"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* BODY LAYOUT: SIDEBAR + MAIN CONTENT */}
      {/* ============================================================ */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT SIDEBAR ACCORDION NAVIGATION */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between overflow-y-auto shrink-0 py-3 px-2 z-20">
          <nav className="space-y-1">
            {menuStructure.map((menuItem, idx) => {
              const IconComp = menuItem.icon;

              if (menuItem.type === "item") {
                const isActive = activeSection === menuItem.name && !activeSubItem;

                return (
                  <button
                    key={menuItem.name || idx}
                    onClick={() => {
                      if (menuItem.action) {
                        menuItem.action();
                      } else {
                        switchNav(menuItem.name, "");
                      }
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#EEF2FF] text-[#4848F7] font-bold border-l-4 border-[#4848F7] shadow-2xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp size={16} className={isActive ? "text-[#4848F7]" : "text-slate-500"} />
                      <span>{menuItem.name}</span>
                    </div>
                  </button>
                );
              }

              // Accordion Group
              const isAccordionOpen = openAccordions[menuItem.name];
              const isGroupActive = activeSection === menuItem.name;

              return (
                <div key={menuItem.name} className="space-y-0.5">
                  <div
                    onClick={() => {
                      if (!isGroupActive) {
                        switchNav(menuItem.name, menuItem.children?.[0] || "");
                      }
                      toggleAccordion(menuItem.name);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer select-none ${
                      isGroupActive
                        ? "bg-slate-100/80 text-slate-900 font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 flex-1">
                      <IconComp size={16} className={isGroupActive ? "text-[#4848F7]" : "text-slate-500"} />
                      <span>{menuItem.name}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAccordion(menuItem.name);
                      }}
                      className="p-1 rounded-lg hover:bg-slate-200/70 text-slate-400 hover:text-[#4848F7] transition cursor-pointer flex items-center justify-center"
                      title={isAccordionOpen ? "Collapse Submenu" : "Expand Submenu"}
                    >
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          isAccordionOpen ? "rotate-180 text-[#4848F7]" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Accordion Sub-items */}
                  {isAccordionOpen && (
                    <div className="pl-8 pr-1 py-1 space-y-1 border-l-2 border-slate-100 ml-5 animate-in fade-in duration-150">
                      {menuItem.children?.map((subName) => {
                        const isSubActive = activeSection === menuItem.name && activeSubItem === subName;
                        return (
                          <button
                            key={subName}
                            onClick={() => {
                              switchNav(menuItem.name, subName);
                            }}
                            className={`w-full text-left py-1.5 px-2.5 rounded-lg text-[11px] font-medium flex items-center gap-2 transition cursor-pointer ${
                              isSubActive
                                ? "bg-[#EEF2FF] text-[#4848F7] font-bold"
                                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/60"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isSubActive ? "bg-[#4848F7]" : "bg-slate-300"}`} />
                            <span className="truncate">{subName}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* MAIN DASHBOARD CONTENT DISPLAY AREA */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">
          
          {/* ============================================================ */}
          {/* 1. MAIN ADMIN DASHBOARD VIEW (WHEN ACTIVE SECTION IS DASHBOARD) */}
          {/* ============================================================ */}
          {activeSection === "Dashboard" && !activeSubItem && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* WELCOME BANNER */}
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <span>Welcome back, Geeta</span>
                  <span className="text-xl">👋</span>
                </h1>
              </div>

              {/* 5 KEY STAT CARDS GRID */}
              <div className="space-y-4">
                {/* Row 1: 3 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Total Applications */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
                    <p className="text-xs font-semibold text-slate-500">Total Applications</p>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-2">1,248</h3>
                  </div>

                  {/* Under Review */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
                    <p className="text-xs font-semibold text-slate-500">Under Review</p>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-2">342</h3>
                  </div>

                  {/* Approved Visas */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
                    <p className="text-xs font-semibold text-slate-500">Approved Visas</p>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-2">688</h3>
                  </div>
                </div>

                {/* Row 2: 2 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Rejected Applications */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
                    <p className="text-xs font-semibold text-slate-500">Rejected Applications</p>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-2">156</h3>
                  </div>

                  {/* Total Revenue */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
                    <p className="text-xs font-semibold text-slate-500">Total Revenue</p>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-2">₹28,75,400</h3>
                  </div>
                </div>
              </div>

              {/* APPLICATION OVERVIEW CHART WIDGET */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">Application Overview</h3>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      ⚡ +14.5% vs 30d
                    </span>
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-2.5 py-1 focus:outline-none"
                    >
                      <option>Last 30 Days</option>
                      <option>Last 90 Days</option>
                      <option>This Year</option>
                    </select>
                  </div>
                </div>

                {/* SMOOTH GOLD/AMBER AREA LINE CHART SVG */}
                <div className="w-full h-56 relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="amberAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Gridlines */}
                    <line x1="0" y1="40" x2="800" y2="40" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="80" x2="800" y2="80" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="120" x2="800" y2="120" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="160" x2="800" y2="160" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />

                    {/* Area Gradient Fill */}
                    <path
                      d="M 0 130 C 50 110, 80 100, 130 140 C 180 180, 240 160, 300 130 C 360 100, 420 110, 480 100 C 540 90, 600 110, 660 150 C 720 120, 760 100, 800 130 L 800 190 L 0 190 Z"
                      fill="url(#amberAreaGrad)"
                    />

                    {/* Stroke Line */}
                    <path
                      d="M 0 130 C 50 110, 80 100, 130 140 C 180 180, 240 160, 300 130 C 360 100, 420 110, 480 100 C 540 90, 600 110, 660 150 C 720 120, 760 100, 800 130"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Month X-Axis Labels */}
                  <div className="flex justify-between text-[10px] font-semibold text-slate-400 pt-2 px-1">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Dec</span>
                  </div>
                </div>

                {/* 4 METRIC INDICATOR BADGES */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#4848F7] flex items-center justify-center font-bold">
                      <Users size={16} />
                    </span>
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold">New Applications</p>
                      <p className="text-sm font-extrabold text-slate-800">412</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <CheckCircle2 size={16} />
                    </span>
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold">Completed</p>
                      <p className="text-sm font-extrabold text-slate-800">587</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                      <Clock size={16} />
                    </span>
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold">In Process</p>
                      <p className="text-sm font-extrabold text-slate-800">342</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                      <AlertCircle size={16} />
                    </span>
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold">Pending Documents</p>
                      <p className="text-sm font-extrabold text-slate-800">210</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* TWO COLUMN ROW 1: APPLICATIONS BY STATUS & RECENT ACTIVITIES */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Card: Applications by Status (Polar / Radial Chart) */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
                  <h3 className="text-sm font-bold text-slate-800">Applications by Status</h3>

                  {/* Polar Area Nightingale Rose Chart matching screenshot */}
                  <div className="flex items-center justify-center py-2 relative">
                    <svg className="w-64 h-64 overflow-visible" viewBox="0 0 300 300">
                      {/* Concentric Radial Grid Circles */}
                      {[18, 36, 54, 72, 90, 108, 126, 144].map((r, i) => (
                        <circle
                          key={i}
                          cx="150"
                          cy="150"
                          r={r}
                          fill="none"
                          stroke="#E2E8F0"
                          strokeWidth="1"
                        />
                      ))}

                      {/* Top Vertical Axis Line */}
                      <line x1="150" y1="150" x2="150" y2="5" stroke="#CBD5E1" strokeWidth="1" />

                      {/* Radial Scale Numbers along Vertical Axis */}
                      {[
                        { text: "10", y: 132 },
                        { text: "20", y: 114 },
                        { text: "30", y: 96 },
                        { text: "40", y: 78 },
                        { text: "50", y: 60 },
                        { text: "60", y: 42 },
                        { text: "70", y: 24 },
                        { text: "80", y: 6 }
                      ].map((tick, i) => (
                        <text
                          key={i}
                          x="150"
                          y={tick.y}
                          textAnchor="middle"
                          fill="#64748B"
                          fontSize="9"
                          fontWeight="600"
                          className="font-mono"
                        >
                          {tick.text}
                        </text>
                      ))}

                      {/* Sector 1: Under Review (Top-Right Blue/Indigo - Radius ~92) */}
                      <path
                        d="M 150 150 L 150 58 A 92 92 0 0 1 242 150 Z"
                        fill="rgba(99, 102, 241, 0.28)"
                        stroke="#4F46E5"
                        strokeWidth="1.5"
                      />

                      {/* Sector 2: Rejected (Bottom-Right Orange - Radius ~58) */}
                      <path
                        d="M 150 150 L 208 150 A 58 58 0 0 1 150 208 Z"
                        fill="rgba(249, 115, 22, 0.28)"
                        stroke="#F97316"
                        strokeWidth="1.5"
                      />

                      {/* Sector 3: Approved (Bottom-Left Lime Green - Radius ~130) */}
                      <path
                        d="M 150 150 L 150 280 A 130 130 0 0 1 20 150 Z"
                        fill="rgba(132, 204, 22, 0.32)"
                        stroke="#84CC16"
                        strokeWidth="1.5"
                      />

                      {/* Sector 4: Cancelled (Top-Left Red/Coral - Radius ~28) */}
                      <path
                        d="M 150 150 L 122 150 A 28 28 0 0 1 150 122 Z"
                        fill="rgba(239, 68, 68, 0.35)"
                        stroke="#EF4444"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>

                  {/* Status Legend Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#818CF8]" />
                      <span className="text-slate-600">Under Review:</span>
                      <strong className="text-slate-800 font-mono">27.4% (342)</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-slate-600">Approved:</span>
                      <strong className="text-slate-800 font-mono">55.2% (689)</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                      <span className="text-slate-600">Rejected:</span>
                      <strong className="text-slate-800 font-mono">12.5% (156)</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <span className="text-slate-600">Cancelled:</span>
                      <strong className="text-slate-800 font-mono">4.9% (61)</strong>
                    </div>
                  </div>
                </div>

                {/* Right Card: Recent Activities */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800">Recent Activities</h3>
                    <button
                      onClick={() => {
                        setActiveSection("Apply for You");
                        setActiveSubItem("User Activity Logs");
                      }}
                      className="text-xs text-[#4848F7] font-bold hover:underline"
                    >
                      View All &gt;
                    </button>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        title: "New Application Received",
                        desc: "By Rajesh Sharma (Canada Tourist Visa)",
                        time: "2 min. ago"
                      },
                      {
                        title: "Document Verified",
                        desc: "By Agent Geeta Bisht",
                        time: "15 min. ago"
                      },
                      {
                        title: "Payment Received",
                        desc: "₹23,000 - By Rahul Kumawat",
                        time: "30 min. ago"
                      },
                      {
                        title: "Application Approved",
                        desc: "By Agent Balram Suman",
                        time: "1 hr ago"
                      },
                      {
                        title: "New Agent Registered",
                        desc: "Agent Animesh Jain",
                        time: "2 hr ago"
                      }
                    ].map((act, i) => (
                      <div key={i} className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{act.title}</p>
                          <p className="text-[11px] text-slate-500">{act.desc}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* TWO COLUMN ROW 2: TOP COUNTRIES & RECENT APPLICATIONS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Card: Top Countries */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800">Top Countries</h3>
                    <span className="text-xs font-mono text-slate-400">Last 30 Days</span>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100 text-[11px]">
                        <th className="pb-2 font-semibold">Countries</th>
                        <th className="pb-2 font-semibold">Applications</th>
                        <th className="pb-2 font-semibold text-right">Percentage %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { flag: "🇨🇦", name: "Canada", apps: 432, pct: "34.64%" },
                        { flag: "🇦🇺", name: "Australia", apps: 321, pct: "25.72%" },
                        { flag: "🇺🇸", name: "United States", apps: 218, pct: "17.47%" },
                        { flag: "🇬🇧", name: "United Kingdom", apps: 156, pct: "12.50%" },
                        { flag: "🌐", name: "Others", apps: 121, pct: "09.70%" }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition">
                          <td className="py-2.5 font-semibold text-slate-800 flex items-center gap-2">
                            <span>{row.flag}</span>
                            <span>{row.name}</span>
                          </td>
                          <td className="py-2.5 font-mono text-slate-600">{row.apps}</td>
                          <td className="py-2.5 text-right font-mono font-bold text-emerald-600">
                            {row.pct} ↗
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Right Card: Recent Applications */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800">Recent Applications</h3>
                    <button
                      onClick={() => {
                        setActiveSection("Applications");
                        setActiveSubItem("All Applications");
                      }}
                      className="text-xs text-[#4848F7] font-bold hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-100 text-[11px]">
                          <th className="pb-2 font-semibold">Application ID</th>
                          <th className="pb-2 font-semibold">Applicant Name</th>
                          <th className="pb-2 font-semibold">Country</th>
                          <th className="pb-2 font-semibold">Submit On</th>
                          <th className="pb-2 font-semibold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { id: "VO-2026-1256", name: "Rahul Kumawat", country: "🇨🇦 Canada", date: "25 Jul 2026", status: "Under Review", stClass: "bg-amber-50 text-amber-700 border-amber-200" },
                          { id: "VO-2026-1255", name: "Animesh Jain", country: "🇦🇺 Australia", date: "25 Jul 2026", status: "Approved", stClass: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                          { id: "VO-2026-1254", name: "Bhavani Sharma", country: "🇺🇸 United States", date: "25 Jul 2026", status: "Under Review", stClass: "bg-amber-50 text-amber-700 border-amber-200" },
                          { id: "VO-2026-1253", name: "Balram Suman", country: "🇬🇧 United Kingdom", date: "25 Jul 2026", status: "Rejected", stClass: "bg-red-50 text-red-700 border-red-200" },
                          { id: "VO-2026-1252", name: "Som Gupta", country: "🌐 Others", date: "25 Jul 2026", status: "Approved", stClass: "bg-emerald-50 text-emerald-700 border-emerald-200" }
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition">
                            <td className="py-2.5 font-mono font-bold text-[#4848F7]">{row.id}</td>
                            <td className="py-2.5 font-semibold text-slate-800">{row.name}</td>
                            <td className="py-2.5 text-slate-600">{row.country}</td>
                            <td className="py-2.5 font-mono text-slate-500">{row.date}</td>
                            <td className="py-2.5 text-right">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${row.stClass}`}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* REVENUE OVERVIEW BAR CHART WIDGET */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Revenue Overview</h3>
                    <p className="text-xs text-emerald-600 font-semibold font-mono">
                      Total Revenue +18.6% vs last 30 days
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xl font-extrabold text-slate-900">₹28,75,400</span>
                    <select className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-2.5 py-1 focus:outline-none">
                      <option>Last 30 Days</option>
                      <option>Last 90 Days</option>
                    </select>
                  </div>
                </div>

                {/* 30 VERTICAL REVENUE BARS SVG */}
                <div className="w-full h-44 relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 900 150">
                    {[
                      45, 60, 85, 30, 95, 110, 75, 65, 80, 120,
                      40, 90, 105, 55, 70, 115, 80, 95, 60, 45,
                      35, 75, 90, 40, 65, 110, 85, 95, 125, 130
                    ].map((height, idx) => (
                      <rect
                        key={idx}
                        x={idx * 30 + 5}
                        y={140 - height}
                        width="18"
                        height={height}
                        rx="4"
                        fill="#4848F7"
                        opacity={idx % 4 === 0 ? "1" : "0.65"}
                      />
                    ))}
                  </svg>

                  <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-2">
                    <span>27 Jun</span>
                    <span>02 Jul</span>
                    <span>07 Jul</span>
                    <span>12 Jul</span>
                    <span>17 Jul</span>
                    <span>22 Jul</span>
                    <span>25 Jul</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* 2. SUB-SECTION DETAILED MANAGEMENT PANELS */}
          {/* ============================================================ */}
          {(activeSubItem || activeSection !== "Dashboard") && (
            <>
              {activeSubItem === "All Applicants" || (activeSection === "Apply for You" && (!activeSubItem || activeSubItem === "All Applicants")) ? (
                <AllApplicants />
              ) : activeSubItem === "Active Users" ? (
                <ActiveUsers />
              ) : activeSubItem === "Blocked Users" ? (
                <BlockedUsers />
              ) : activeSubItem === "KYC Verifications" ? (
                <KycVerifications />
              ) : activeSubItem === "User Activity Logs" ? (
                <UserActivityLogs />
              ) : activeSubItem === "All Agents" || (activeSection === "Agent Management" && (!activeSubItem || activeSubItem === "All Agents")) ? (
                <AllAgents />
              ) : activeSubItem === "Add New Agents" || activeSubItem === "Add New Agent" ? (
                <AddNewAgent onSuccess={() => switchNav("Agent Management", "All Agents")} />
              ) : activeSubItem === "Pending Approval" ? (
                <PendingApprovalAgents />
              ) : activeSubItem === "Active Agents" ? (
                <ActiveAgents />
              ) : activeSubItem === "Inactive Agents" ? (
                <InactiveAgents />
              ) : activeSubItem === "Agent Performance" && activeSection === "Agent Management" ? (
                <AgentPerformance />
              ) : activeSubItem === "Countries" || (activeSection === "Visa Management" && (!activeSubItem || activeSubItem === "Countries")) ? (
                <CountriesManagement />
              ) : activeSubItem === "Visa Categories" ? (
                <VisaCategoriesManagement />
              ) : activeSubItem === "Visa Types" ? (
                <VisaTypesManagement />
              ) : activeSubItem === "Visa Requirements" ? (
                <VisaRequirementsManagement />
              ) : activeSubItem === "All Applications" || (activeSection === "Applications" && (!activeSubItem || activeSubItem === "All Applications")) ? (
                <AllApplicationsManagement />
              ) : activeSubItem === "New Applications" ? (
                <NewApplicationsManagement />
              ) : activeSubItem === "Assigned Applications" ? (
                <AssignedApplicationsManagement />
              ) : activeSubItem === "Under Review" ? (
                <UnderReviewManagement />
              ) : activeSubItem === "Pending Documents" ? (
                <PendingDocumentsManagement />
              ) : activeSubItem === "Approved" ? (
                <ApprovedApplicationsManagement />
              ) : activeSubItem === "Rejected" ? (
                <RejectedApplicationsManagement />
              ) : activeSubItem === "Completed" && activeSection === "Applications" ? (
                <CompletedApplicationsManagement />
              ) : activeSubItem === "Cancelled" && activeSection === "Applications" ? (
                <CancelledApplicationsManagement />
              ) : activeSubItem === "All Documents" || (activeSection === "Documents" && (!activeSubItem || activeSubItem === "All Documents")) ? (
                <AllDocumentsManagement />
              ) : activeSubItem === "Pending Verification" ? (
                <PendingVerificationManagement />
              ) : activeSubItem === "Verified Documents" ? (
                <VerifiedDocumentsManagement />
              ) : activeSubItem === "Rejected Documents" ? (
                <RejectedDocumentsManagement />
              ) : activeSubItem === "Document Templates" ? (
                <DocumentTemplatesManagement />
              ) : activeSubItem === "All Transactions" || (activeSection === "Payments" && (!activeSubItem || activeSubItem === "All Transactions")) ? (
                <AllTransactionsManagement />
              ) : activeSubItem === "Successful Payments" ? (
                <SuccessfulPaymentsManagement />
              ) : activeSubItem === "Pending Payments" ? (
                <PendingPaymentsManagement />
              ) : activeSubItem === "Failed Payments" ? (
                <FailedPaymentsManagement />
              ) : activeSubItem === "Refund Requests" ? (
                <RefundRequestsManagement />
              ) : activeSubItem === "Invoices" ? (
                <InvoicesManagement />
              ) : activeSubItem === "All Appointments" || (activeSection === "Appointments" && (!activeSubItem || activeSubItem === "All Appointments")) ? (
                <AllAppointmentsManagement />
              ) : activeSubItem === "Upcoming Appointments" || activeSubItem === "Upcoming" ? (
                <UpcomingAppointmentsManagement />
              ) : activeSubItem === "Completed Appointments" || (activeSection === "Appointments" && activeSubItem === "Completed") ? (
                <CompletedAppointmentsManagement />
              ) : activeSubItem === "Cancelled Appointments" || (activeSection === "Appointments" && activeSubItem === "Cancelled") ? (
                <CancelledAppointmentsManagement />
              ) : activeSection === "Messages" ? (
                <MessagesManagement />
              ) : activeSection === "Notifications" ? (
                <NotificationsManagement />
              ) : activeSubItem === "Application Reports" ? (
                <ApplicationReportsManagement />
              ) : activeSubItem === "Payment Reports" ? (
                <PaymentReportsManagement />
              ) : activeSubItem === "Revenue Reports" ? (
                <RevenueReportsManagement />
              ) : activeSubItem === "Agent Performance" ? (
                <AgentPerformanceReportsManagement />
              ) : activeSubItem === "Country-wise Reports" ? (
                <CountryReportsManagement />
              ) : activeSubItem === "Visa Type Reports" ? (
                <VisaTypeReportsManagement />
              ) : activeSubItem === "User Activity Reports" || activeSubItem === "User Activity" ? (
                <UserActivityReportsManagement />
              ) : activeSection === "Reports & Analytics" || activeSection === "Reports" || activeSubItem === "Dashboard Reports" || activeSection === "Dashboard Reports" ? (
                <DashboardReportsManagement />
              ) : activeSubItem === "Company Profile" ? (
                <CompanyProfileManagement />
              ) : activeSubItem === "Roles & Permissions" || activeSubItem === "Roles" ? (
                <RolesPermissionsManagement />
              ) : activeSubItem === "Payment Gateway" || activeSubItem === "Payment Gateway Settings" ? (
                <PaymentGatewayManagement />
              ) : activeSubItem === "Email Configuration" || activeSubItem === "Email Settings" ? (
                <EmailConfigurationManagement />
              ) : activeSubItem === "SMS Configuration" || activeSubItem === "SMS Settings" ? (
                <SMSConfigurationManagement />
              ) : activeSubItem === "Security Settings" || activeSubItem === "Security" ? (
                <SecuritySettingsManagement />
              ) : activeSection === "Settings" || activeSubItem === "General Settings" ? (
                <GeneralSettingsManagement />
              ) : (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Header Breadcrumb & Title */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <span className="hover:text-[#4848F7] cursor-pointer" onClick={() => { setActiveSection("Dashboard"); setActiveSubItem(""); }}>Admin Dashboard</span>
                        <ChevronRight size={12} />
                        <span>{activeSection}</span>
                        {activeSubItem && (
                          <>
                            <ChevronRight size={12} />
                            <span className="text-[#4848F7] font-bold">{activeSubItem}</span>
                          </>
                        )}
                      </div>

                      <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                        {activeSubItem || activeSection}
                      </h2>
                    </div>

                    <button
                      onClick={() => showToast(`Action triggered for ${activeSubItem || activeSection}`)}
                      className="bg-[#4848F7] hover:bg-[#3838D6] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-md shadow-[#4848F7]/20 cursor-pointer"
                    >
                      <Plus size={14} /> Add New Entry
                    </button>
                  </div>

                  {/* Data Table / Panel Container */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-800">
                        {activeSubItem || activeSection} Register
                      </h3>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Filter records..."
                          className="bg-slate-50 border border-slate-200 text-xs px-3 py-1.5 rounded-lg w-56 focus:outline-none focus:border-[#4848F7]"
                        />
                        <button className="bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 font-bold">
                          <Filter size={13} /> Filter
                        </button>
                      </div>
                    </div>

                    {/* Sub-Item Dynamic Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 border-y border-slate-200 font-bold uppercase text-[10px]">
                            <th className="py-2.5 px-3">Reference ID</th>
                            <th className="py-2.5 px-3">Primary Entity</th>
                            <th className="py-2.5 px-3">Category</th>
                            <th className="py-2.5 px-3">Timestamp</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {applications.map((appItem) => (
                            <tr key={appItem.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3 px-3 font-mono font-bold text-[#4848F7]">{appItem.id}</td>
                              <td className="py-3 px-3 font-bold text-slate-800">{appItem.travelerName}</td>
                              <td className="py-3 px-3 text-slate-600">{appItem.visaType}</td>
                              <td className="py-3 px-3 font-mono text-slate-500">{appItem.submissionDate}</td>
                              <td className="py-3 px-3">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {appItem.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right space-x-2">
                                <button
                                  onClick={() => showToast(`Viewing details for ${appItem.id}`)}
                                  className="px-2.5 py-1 bg-slate-100 hover:bg-[#EEF2FF] text-[#4848F7] rounded-lg font-bold text-[10px] border border-slate-200"
                                >
                                  Manage
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>

                </div>
              )}
            </>
          )}

        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-2.5 text-center text-[11px] font-mono text-slate-400 z-10">
        &copy;2026 Visa OS. All Rights Reserved
      </footer>

    </div>
  );
}
