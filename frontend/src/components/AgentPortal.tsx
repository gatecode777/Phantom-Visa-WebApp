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
import GeneralSettingsManagement from "./GeneralSettingsManagement";
import SecuritySettingsManagement from "./SecuritySettingsManagement";
import PaymentGatewayManagement from "./PaymentGatewayManagement";
import EmailConfigurationManagement from "./EmailConfigurationManagement";
import SMSConfigurationManagement from "./SMSConfigurationManagement";
import RolesPermissionsManagement from "./RolesPermissionsManagement";
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
    "all" | "new" | "assigned" | "under_review" | "approved" | "rejected" | "completed"
  >("all");
  const [searchAppQuery, setSearchAppQuery] = useState("");
  const [applicantSubTab, setApplicantSubTab] = useState<"list" | "details">("list");
  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
  const [docVerifSubTab, setDocVerifSubTab] = useState<"pending" | "verified" | "additional">("pending");
  const [paymentSubTab, setPaymentSubTab] = useState<"verification" | "transactions" | "invoices">("verification");
  const [reportSubTab, setReportSubTab] = useState<"daily" | "monthly" | "performance">("daily");
  const [settingsSubTab, setSettingsSubTab] = useState<"security" | "general" | "payment_gateway" | "email" | "sms" | "roles">("security");

  // Modals & Toast
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState("415000");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Search & Wizard Sub-States
  const [searchDest, setSearchDest] = useState("Germany");
  const [searchNational, setSearchNational] = useState("India");
  const [searchType, setSearchType] = useState("Tourist");
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    destination: string;
    visaType: string;
    price: number;
    processingTime: string;
    entry: string;
  } | null>(null);

  const [wizardStep, setWizardStep] = useState(1);
  const [travelerName, setTravelerName] = useState("");
  const [dob, setDob] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");
  const [travelDates, setTravelDates] = useState("2026-10-01 to 2026-10-15");
  const [isEmployed, setIsEmployed] = useState(false);
  const [isSponsored, setIsSponsored] = useState(false);

  const [ocrScanning, setOcrScanning] = useState(false);
  const [docUploadState, setDocUploadState] = useState<Record<string, "idle" | "uploading" | "verifying" | "done" | "needs_review">>({
    passport: "idle",
    photo: "idle",
    nocLetter: "idle",
    sponsorLetter: "idle"
  });

  const simulatePassportOCR = () => {
    setOcrScanning(true);
    setTimeout(() => {
      setOcrScanning(false);
      setTravelerName("AARAV SHARMA");
      setDob("1991-08-14");
      setPassportNumber("Z5592817");
      setPassportExpiry("2035-12-10");
      setDocUploadState((prev) => ({ ...prev, passport: "done" }));
      triggerToast("Passport scanned! AI parsed fields automatically.");
    }, 1800);
  };

  const handleSubmitVisaApplication = () => {
    if (walletBalance < (selectedProduct?.price || 13280)) {
      triggerToast("Insufficient wallet balance. Please top up funds.");
      return;
    }
    const newId = addApplication({
      travelerName: travelerName || "Aarav Sharma",
      dob: dob || "1991-08-14",
      passportNumber: passportNumber || "Z5592817",
      passportExpiry: passportExpiry || "2035-12-10",
      nationality: searchNational,
      destination: selectedProduct?.destination || searchDest,
      visaType: selectedProduct?.visaType || searchType,
      travelDates: travelDates || "2026-10-01 to 2026-10-15",
      status: "Submitted",
      fees: selectedProduct?.price || 13280,
      verifiedDocs: { passport: "verified", photo: "verified" },
      checklist: { employed: isEmployed, sponsored: isSponsored }
    });
    triggerToast(`Application ${newId} submitted into embassy queue! Fee deducted.`);
    setAgentTab("applications");
  };

  // Mock Data matching exact screenshot details
  const assignedApplicationsMock = [
    { id: "VO-2026-1250", name: "Rahul Kumawat", country: "Canada", flag: "🇨🇦", visaType: "Tourist Visa", submitOn: "26 Jul 2026", status: "Under Review", statusColor: "text-amber-600 bg-amber-50" },
    { id: "VO-2026-1251", name: "Animesh Jain", country: "Australia", flag: "🇦🇺", visaType: "Student Visa", submitOn: "26 Jul 2026", status: "Approved", statusColor: "text-emerald-600 bg-emerald-50" },
    { id: "VO-2026-1252", name: "Omrishi Sharma", country: "United States", flag: "🇺🇸", visaType: "Business Visa", submitOn: "26 Jul 2026", status: "Under Review", statusColor: "text-amber-600 bg-amber-50" },
    { id: "VO-2026-1253", name: "Balram Suman", country: "United Kingdom", flag: "🇬🇧", visaType: "Work Visa", submitOn: "26 Jul 2026", status: "Rejected", statusColor: "text-rose-600 bg-rose-50" },
    { id: "VO-2026-1254", name: "Garv Gupta", country: "Others", flag: "🌐", visaType: "Visitor Visa", submitOn: "26 Jul 2026", status: "Approved", statusColor: "text-emerald-600 bg-emerald-50" }
  ];

  const docVerificationsMock = [
    { title: "Passport- Geeta Bisht", submitOn: "Submitted on 26 Jul 2026", status: "Pending" },
    { title: "Bank Statement- Geeta Bisht", submitOn: "Submitted on 26 Jul 2026", status: "Pending" },
    { title: "Education Cert.- Geeta Bisht", submitOn: "Submitted on 26 Jul 2026", status: "Pending" },
    { title: "Employment Letter- Geeta Bisht", submitOn: "Submitted on 26 Jul 2026", status: "Pending" },
    { title: "Invitation Letter- Geeta Bisht", submitOn: "Submitted on 26 Jul 2026", status: "Pending" },
    { title: "Passport- Ramchandra Suman", submitOn: "Submitted on 26 Jul 2026", status: "Pending" }
  ];

  const myTasksMock = [
    { title: "Documents Pending Verifications", subtitle: "Verify Documents", count: 18 },
    { title: "Applications in Review", subtitle: "Review Applications", count: 15 },
    { title: "Request from Applicants", subtitle: "Documents Requests", count: 7 },
    { title: "Payments to Verify", subtitle: "Payment Verifications", count: 6 },
    { title: "Appointments to Confirm", subtitle: "Schedule Appointments", count: 4 }
  ];

  const upcomingAppointmentsMock = [
    { visa: "Canada Tourist Visa", location: "Visa Application Centre, New Delhi", time: "11:00 AM", applicant: "Geeta Bisht", date: "28 June 2026" },
    { visa: "UK Business Visa", location: "Visa Application Centre, New Delhi", time: "02:00 PM", applicant: "Rahul Kumawat", date: "28 June 2026" },
    { visa: "Canada Tourist Visa", location: "Visa Application Centre, New Delhi", time: "11:00 AM", applicant: "Geeta Bisht", date: "28 June 2026" },
    { visa: "Canada Tourist Visa", location: "Visa Application Centre, New Delhi", time: "11:00 AM", applicant: "Geeta Bisht", date: "28 June 2026" },
    { visa: "Canada Tourist Visa", location: "Visa Application Centre, New Delhi", time: "11:00 AM", applicant: "Geeta Bisht", date: "28 June 2026" }
  ];

  const recentActivityMock = [
    { title: "New Applications Assigned", detail: "VO-2026-1255 By Admin", time: "5 min ago", color: "bg-blue-500", textColor: "text-blue-600", borderPos: "top" },
    { title: "Document Verified", detail: "Passport - Geeta Bisht", time: "20 min ago", color: "bg-emerald-500", textColor: "text-emerald-600", borderPos: "bottom" },
    { title: "Application Under Review", detail: "VO-2026-1240", time: "45 min ago", color: "bg-amber-500", textColor: "text-amber-600", borderPos: "top" },
    { title: "Application Approved", detail: "VO-2026-1239", time: "45 min ago", color: "bg-emerald-500", textColor: "text-emerald-600", borderPos: "bottom" },
    { title: "Application Rejected", detail: "VO-2026-1236", time: "2 hr ago", color: "bg-rose-500", textColor: "text-rose-600", borderPos: "top" },
    { title: "Document Request Sent", detail: "To Geeta Bisht", time: "2 hr ago", color: "bg-blue-500", textColor: "text-blue-600", borderPos: "bottom" }
  ];

  const applicantsList = [
    { id: "APP-01", name: "Geeta Bisht", nationality: "India", passport: "Z5592817", email: "geeta.bisht@phantom.com", activeVisas: 1, lastApp: "VO-2026-1250" },
    { id: "APP-02", name: "Rahul Kumawat", nationality: "India", passport: "Z8829102", email: "rahul.k@gmail.com", activeVisas: 1, lastApp: "VO-2026-1250" },
    { id: "APP-03", name: "Animesh Jain", nationality: "India", passport: "Z9928172", email: "animesh@jain.org", activeVisas: 1, lastApp: "VO-2026-1251" },
    { id: "APP-04", name: "Omrishi Sharma", nationality: "India", passport: "Z1182736", email: "omrishi@sharma.in", activeVisas: 1, lastApp: "VO-2026-1252" }
  ];

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

          {/* Visa Applications Accordion */}
          <div>
            <button
              onClick={() => {
                toggleAccordion("visa_apps");
                setAppSubTab("all");
                handleTabChange("applications");
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                agentTab === "applications"
                  ? "bg-purple-50 text-purple-700 font-bold"
                  : "hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <ClipboardList size={18} className={agentTab === "applications" ? "text-purple-600" : "text-slate-400"} />
                <span>Visa Applications</span>
              </div>
              {openAccordions["visa_apps"] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {openAccordions["visa_apps"] && (
              <div className="ml-8 mt-1 space-y-1 text-[11px] text-slate-500 border-l border-slate-100 pl-2">
                <button
                  onClick={() => { setAppSubTab("all"); handleTabChange("applications"); }}
                  className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                    agentTab === "applications" && appSubTab === "all" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>All Applications</span>
                </button>
                <button
                  onClick={() => { setAppSubTab("new"); handleTabChange("applications"); }}
                  className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                    agentTab === "applications" && appSubTab === "new" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>New Applications</span>
                  <span className="bg-purple-100 text-purple-700 font-bold px-1.5 py-0.2 rounded-full text-[10px]">12</span>
                </button>
                <button
                  onClick={() => { setAppSubTab("assigned"); handleTabChange("applications"); }}
                  className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                    agentTab === "applications" && appSubTab === "assigned" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>Assigned to Me</span>
                  <span className="bg-purple-100 text-purple-700 font-bold px-1.5 py-0.2 rounded-full text-[10px]">8</span>
                </button>
                <button
                  onClick={() => { setAppSubTab("under_review"); handleTabChange("applications"); }}
                  className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                    agentTab === "applications" && appSubTab === "under_review" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>Under Review</span>
                  <span className="bg-purple-100 text-purple-700 font-bold px-1.5 py-0.2 rounded-full text-[10px]">15</span>
                </button>
                <button
                  onClick={() => { setAppSubTab("approved"); handleTabChange("applications"); }}
                  className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                    agentTab === "applications" && appSubTab === "approved" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>Approved</span>
                </button>
                <button
                  onClick={() => { setAppSubTab("rejected"); handleTabChange("applications"); }}
                  className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                    agentTab === "applications" && appSubTab === "rejected" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>Rejected</span>
                </button>
                <button
                  onClick={() => { setAppSubTab("completed"); handleTabChange("applications"); }}
                  className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                    agentTab === "applications" && appSubTab === "completed" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>Completed</span>
                </button>
              </div>
            )}
          </div>

          {/* Applicants Accordion */}
          <div>
            <button
              onClick={() => {
                toggleAccordion("applicants");
                handleTabChange("applicants");
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                agentTab === "applicants"
                  ? "bg-purple-50 text-purple-700 font-bold"
                  : "hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users size={18} className={agentTab === "applicants" ? "text-purple-600" : "text-slate-400"} />
                <span>Applicants</span>
              </div>
              {openAccordions["applicants"] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {openAccordions["applicants"] && (
              <div className="ml-8 mt-1 space-y-1 text-[11px] text-slate-500 border-l border-slate-100 pl-2">
                <button
                  onClick={() => { setApplicantSubTab("list"); handleTabChange("applicants"); }}
                  className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                    agentTab === "applicants" && applicantSubTab === "list" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>Applicant List</span>
                </button>
                <button
                  onClick={() => { setApplicantSubTab("details"); handleTabChange("applicants"); }}
                  className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                    agentTab === "applicants" && applicantSubTab === "details" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>Applicant Details</span>
                </button>
              </div>
            )}
          </div>

          {/* Document Verification Accordion */}
          <div>
            <button
              onClick={() => {
                toggleAccordion("doc_verif");
                handleTabChange("doc_verification");
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                agentTab === "doc_verification"
                  ? "bg-purple-50 text-purple-700 font-bold"
                  : "hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <FileCheck size={18} className={agentTab === "doc_verification" ? "text-purple-600" : "text-slate-400"} />
                <span>Document Verification</span>
              </div>
              {openAccordions["doc_verif"] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {openAccordions["doc_verif"] && (
              <div className="ml-8 mt-1 space-y-1 text-[11px] text-slate-500 border-l border-slate-100 pl-2">
                <button
                  onClick={() => { setDocVerifSubTab("pending"); handleTabChange("doc_verification"); }}
                  className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                    agentTab === "doc_verification" && docVerifSubTab === "pending" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>Pending Verification</span>
                </button>
                <button
                  onClick={() => { setDocVerifSubTab("verified"); handleTabChange("doc_verification"); }}
                  className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                    agentTab === "doc_verification" && docVerifSubTab === "verified" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>Verified Documents</span>
                </button>
                <button
                  onClick={() => { setDocVerifSubTab("additional"); handleTabChange("doc_verification"); }}
                  className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                    agentTab === "doc_verification" && docVerifSubTab === "additional" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>Additional Requests</span>
                </button>
              </div>
            )}
          </div>

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
            <span>Appointments</span>
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
            {/* Settings Accordion */}
            <div>
              <button
                onClick={() => {
                  toggleAccordion("settings");
                  handleTabChange("settings");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
                  agentTab === "settings" ? "bg-purple-50 text-purple-700 font-bold" : "hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings size={18} className={agentTab === "settings" ? "text-purple-600" : "text-slate-400"} />
                  <span>Settings</span>
                </div>
                {openAccordions["settings"] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {openAccordions["settings"] && (
                <div className="ml-8 mt-1 space-y-1 text-[11px] text-slate-500 border-l border-slate-100 pl-2">
                  <button
                    onClick={() => { setSettingsSubTab("security"); handleTabChange("settings"); }}
                    className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                      agentTab === "settings" && settingsSubTab === "security" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span>Security Settings</span>
                  </button>
                  <button
                    onClick={() => { setSettingsSubTab("general"); handleTabChange("settings"); }}
                    className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                      agentTab === "settings" && settingsSubTab === "general" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span>General Settings</span>
                  </button>
                  <button
                    onClick={() => { setSettingsSubTab("payment_gateway"); handleTabChange("settings"); }}
                    className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                      agentTab === "settings" && settingsSubTab === "payment_gateway" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span>Payment Gateway</span>
                  </button>
                  <button
                    onClick={() => { setSettingsSubTab("email"); handleTabChange("settings"); }}
                    className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                      agentTab === "settings" && settingsSubTab === "email" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span>Email Config</span>
                  </button>
                  <button
                    onClick={() => { setSettingsSubTab("sms"); handleTabChange("settings"); }}
                    className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                      agentTab === "settings" && settingsSubTab === "sms" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span>SMS Config</span>
                  </button>
                  <button
                    onClick={() => { setSettingsSubTab("roles"); handleTabChange("settings"); }}
                    className={`w-full text-left px-2 py-1.5 rounded flex justify-between items-center transition ${
                      agentTab === "settings" && settingsSubTab === "roles" ? "text-purple-700 font-bold bg-purple-50/60" : "hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span>Roles & Permissions</span>
                  </button>
                </div>
              )}
            </div>

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
              <div className="w-9 h-9 rounded-full bg-amber-200 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-amber-900 text-xs">
                GB
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
                  Good Morning, Geeta 👋
                </h1>
              </div>

              {/* KPI Summary Cards Grid (5 Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Total Assigned */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2">
                  <span className="text-[11px] font-medium text-slate-500 block">Total Assigned</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900">42</span>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp size={12} /> 12.5% vs yesterday
                    </span>
                  </div>
                </div>

                {/* Rejected Today */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2">
                  <span className="text-[11px] font-medium text-slate-500 block">Rejected Today</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900">03</span>
                    <span className="text-[11px] font-semibold text-rose-500 flex items-center gap-0.5">
                      <TrendingDown size={12} /> 25% vs yesterday
                    </span>
                  </div>
                </div>

                {/* Under Review */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2">
                  <span className="text-[11px] font-medium text-slate-500 block">Under Review</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900">15</span>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp size={12} /> 7.3% vs yesterday
                    </span>
                  </div>
                </div>

                {/* Approved Today */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2">
                  <span className="text-[11px] font-medium text-slate-500 block">Approved Today</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900">08</span>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp size={12} /> 33.3% vs yesterday
                    </span>
                  </div>
                </div>

                {/* Documents to Verify */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2">
                  <span className="text-[11px] font-medium text-slate-500 block">Documents to Verify</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900">18</span>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp size={12} /> 5.9% vs yesterday
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
                    className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition"
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
                      {assignedApplicationsMock.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-3 font-mono font-medium text-slate-600">{row.id}</td>
                          <td className="py-3 px-3 font-semibold text-slate-900">{row.name}</td>
                          <td className="py-3 px-3 flex items-center gap-1.5">
                            <span>{row.flag}</span>
                            <span>{row.country}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-600">{row.visaType}</td>
                          <td className="py-3 px-3 text-slate-500">{row.submitOn}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${row.statusColor}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
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
                    <select className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg px-2.5 py-1 outline-none">
                      <option>Last 30 Days</option>
                      <option>Last 7 Days</option>
                      <option>This Year</option>
                    </select>
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

                        {/* Purple Segment (Under Review ~24.4%) */}
                        <path d="M 100 100 L 100 20 A 80 80 0 0 1 180 100 Z" fill="#93C5FD" fillOpacity="0.75" stroke="#ffffff" strokeWidth="2" />
                        {/* Green Segment (Approved ~55.2%) */}
                        <path d="M 100 100 L 180 100 A 80 80 0 0 1 20 100 Z" fill="#86EFAC" fillOpacity="0.85" stroke="#ffffff" strokeWidth="2" />
                        {/* Orange Segment (Rejected ~12.5%) */}
                        <path d="M 100 100 L 20 100 A 80 80 0 0 1 50 30 Z" fill="#FDBA74" fillOpacity="0.85" stroke="#ffffff" strokeWidth="2" />
                        {/* Red Segment (Cancelled ~4.9%) */}
                        <path d="M 100 100 L 50 30 A 80 80 0 0 1 100 20 Z" fill="#FCA5A5" fillOpacity="0.85" stroke="#ffffff" strokeWidth="2" />
                      </svg>
                      {/* Center total overlay */}
                      <div className="absolute text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total</span>
                        <span className="text-base font-extrabold text-slate-900 font-mono">1,248</span>
                      </div>
                    </div>

                    {/* Chart Legend */}
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-300"></span>
                          <span className="text-slate-600 font-medium">Under Review</span>
                        </div>
                        <span className="font-bold text-slate-900">24.4% <span className="text-slate-400 font-normal">(342)</span></span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-300"></span>
                          <span className="text-slate-600 font-medium">Approved</span>
                        </div>
                        <span className="font-bold text-slate-900">55.2% <span className="text-slate-400 font-normal">(689)</span></span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-300"></span>
                          <span className="text-slate-600 font-medium">Rejected</span>
                        </div>
                        <span className="font-bold text-slate-900">12.5% <span className="text-slate-400 font-normal">(156)</span></span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-300"></span>
                          <span className="text-slate-600 font-medium">Cancelled</span>
                        </div>
                        <span className="font-bold text-slate-900">4.9% <span className="text-slate-400 font-normal">(61)</span></span>
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
                      className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition"
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
                        {docVerificationsMock.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition">
                            <td className="py-2.5 px-3">
                              <span className="font-semibold text-slate-900 block">{item.title}</span>
                              <span className="text-[10px] text-slate-400">{item.submitOn}</span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <span className="text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full font-semibold text-[11px]">
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
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
                    <h3 className="font-bold text-sm text-slate-900">My Task</h3>
                    <button className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition">
                      View All &gt;
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {myTasksMock.map((t, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50/80 hover:bg-slate-100/80 p-3 rounded-lg flex items-center justify-between transition cursor-pointer"
                      >
                        <div>
                          <span className="text-[11px] text-slate-400 block">{t.title}</span>
                          <span className="text-xs font-bold text-slate-900">{t.subtitle}</span>
                        </div>
                        <span className="font-bold text-sm text-slate-800 font-mono">{t.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Card: Upcoming Appointments */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-slate-900">Upcoming Appointments</h3>
                    <button
                      onClick={() => handleTabChange("appointments")}
                      className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition"
                    >
                      View All &gt;
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {upcomingAppointmentsMock.map((apt, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50/80 p-3 rounded-lg flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">{apt.visa}</span>
                          </div>
                          <span className="font-bold text-slate-900 block">{apt.applicant}</span>
                        </div>

                        <div className="text-right space-y-0.5">
                          <span className="text-[11px] text-slate-500 block">{apt.location}</span>
                          <div className="flex items-center justify-end gap-2 text-[11px] font-semibold text-slate-800">
                            <span>{apt.date}</span>
                            <span className="font-mono">{apt.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Recent Activity */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-900">Recent Activity</h3>
                  <button className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition">
                    View All &gt;
                  </button>
                </div>

                {/* Horizontal Activity Timeline */}
                <div className="relative py-8 overflow-x-auto">
                  {/* Central Horizontal Line */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>

                  <div className="flex items-center justify-between min-w-[700px] relative z-10 px-4">
                    {recentActivityMock.map((act, idx) => (
                      <div key={idx} className="flex flex-col items-center relative group">
                        {/* Upper Content Box */}
                        {act.borderPos === "top" ? (
                          <div className="mb-4 text-center space-y-0.5">
                            <span className="text-[10px] text-slate-400 block">{act.time}</span>
                            <span className={`text-xs font-bold ${act.textColor} block`}>{act.title}</span>
                            <span className="text-[11px] text-slate-500 block">{act.detail}</span>
                          </div>
                        ) : (
                          <div className="mb-8 opacity-0 pointer-events-none">&nbsp;</div>
                        )}

                        {/* Timeline Node Icon */}
                        <div className={`w-6 h-6 rounded-full ${act.color} text-white flex items-center justify-center shadow-md z-10 ring-4 ring-white`}>
                          <User size={12} />
                        </div>

                        {/* Lower Content Box */}
                        {act.borderPos === "bottom" ? (
                          <div className="mt-4 text-center space-y-0.5">
                            <span className={`text-xs font-bold ${act.textColor} block`}>{act.title}</span>
                            <span className="text-[11px] text-slate-500 block">{act.detail}</span>
                            <span className="text-[10px] text-slate-400 block">{act.time}</span>
                          </div>
                        ) : (
                          <div className="mt-8 opacity-0 pointer-events-none">&nbsp;</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
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
              {appSubTab === "all" && <AllApplicationsManagement />}
              {appSubTab === "new" && <NewApplicationsManagement />}
              {appSubTab === "assigned" && <AssignedApplicationsManagement />}
              {appSubTab === "under_review" && <UnderReviewManagement />}
              {appSubTab === "approved" && <ApprovedApplicationsManagement />}
              {appSubTab === "rejected" && <RejectedApplicationsManagement />}
              {appSubTab === "completed" && <CompletedApplicationsManagement />}
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
              {docVerifSubTab === "pending" && <PendingVerificationManagement />}
              {docVerifSubTab === "verified" && <VerifiedDocumentsManagement />}
              {docVerifSubTab === "additional" && <PendingDocumentsManagement />}
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

          {agentTab === "settings" && (
            <div className="space-y-6">
              {settingsSubTab === "security" && <SecuritySettingsManagement />}
              {settingsSubTab === "general" && <GeneralSettingsManagement />}
              {settingsSubTab === "payment_gateway" && <PaymentGatewayManagement />}
              {settingsSubTab === "email" && <EmailConfigurationManagement />}
              {settingsSubTab === "sms" && <SMSConfigurationManagement />}
              {settingsSubTab === "roles" && <RolesPermissionsManagement />}
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
