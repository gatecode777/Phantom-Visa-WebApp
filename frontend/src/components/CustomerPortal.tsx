"use client";

import React, { useState, useEffect } from "react";
import { useVisa, Application, CustomerTab, formatINR } from "../context/VisaContext";
import Logo from "./Logo";
import InteractiveWorldMap from "./InteractiveWorldMap";
import CompleteKycModal from "./CompleteKycModal";
import ApplicantAllApplications from "./ApplicantAllApplications";
import ApplicantDraftApplications from "./ApplicantDraftApplications";
import ApplicantSubmittedApplications from "./ApplicantSubmittedApplications";
import ApplicantUnderReviewApplications from "./ApplicantUnderReviewApplications";
import ApplicantApprovedApplications from "./ApplicantApprovedApplications";
import ApplicantRejectedApplications from "./ApplicantRejectedApplications";
import ApplicantCancelledApplications from "./ApplicantCancelledApplications";
import ApplicantUploadDocuments from "./ApplicantUploadDocuments";
import ApplicantMyDocuments from "./ApplicantMyDocuments";
import ApplicantVerificationStatus from "./ApplicantVerificationStatus";
import ApplicantMakePayment from "./ApplicantMakePayment";
import ApplicantApplyVisa from "./ApplicantApplyVisa";
import {
  Search,
  MessageSquare,
  Send,
  User,
  Upload,
  RefreshCw,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
  LayoutDashboard,
  FilePlus2,
  ClipboardList,
  CreditCard,
  Calendar,
  Bell,
  Globe,
  LifeBuoy,
  Settings,
  LogOut,
  Clock,
  ChevronRight,
  ChevronDown,
  Filter,
  Download,
  ShieldCheck,
  MapPin,
  Check,
  X,
  Eye,
  Plus,
  FileCheck,
  Lock,
  PhoneCall,
  Mail,
  Zap,
  ArrowRight,
  Wallet,
  Building,
  Navigation
} from "lucide-react";

export default function CustomerPortal() {
  const {
    applications,
    updateApplicationDocs,
    addApplication,
    customerTab,
    setCustomerTab,
    setRole,
    walletBalance,
    currentRole,
    logoutSession,
    authSession,
    applicantDashboardData,
    fetchApplicantDashboardData
  } = useVisa();

  // Selected active application ID for tracking/documents
  const [selectedAppId, setSelectedAppId] = useState<string>("VO-2026-1025");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompleteKycModal, setShowCompleteKycModal] = useState<boolean>(false);
  const [docSubTab, setDocSubTab] = useState<"vault" | "upload" | "status">("vault");

  // Target app reference
  const app = applications.find((a) => a.id === selectedAppId) || applications[0];

  // Dynamic user data from MongoDB
  const greetingName = applicantDashboardData?.greetingName || authSession?.user?.name || "Applicant";
  const liveMetrics = applicantDashboardData?.metrics || {
    totalApplications: applications.length || 1,
    underReview: applications.filter((a) => ["Submitted", "Docs Uploaded", "Embassy Processing"].includes(a.status)).length,
    approvedVisas: applications.filter((a) => a.status === "Approved").length,
    rejectedApplications: applications.filter((a) => a.status === "Rejected").length,
    pendingDocuments: 1,
    upcomingAppointments: 1,
    unreadMessages: 2,
    notifications: 3
  };

  // Collapsible Sidebar Sections State
  const [openMyApps, setOpenMyApps] = useState(true);
  const [openDocs, setOpenDocs] = useState(false);
  const [openPayments, setOpenPayments] = useState(false);
  const [openAppts, setOpenAppts] = useState(false);
  const [openExplore, setOpenExplore] = useState(false);

  const handleTabChange = (tab: CustomerTab) => {
    setCustomerTab(tab);
    if (typeof window !== "undefined") {
      const newUrl = `${window.location.pathname}?tab=${encodeURIComponent(tab)}`;
      window.history.replaceState(null, "", newUrl);
      localStorage.setItem("customer_active_tab", tab);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get("tab") as CustomerTab | null;
      const storedTab = localStorage.getItem("customer_active_tab") as CustomerTab | null;
      const targetTab = urlTab || storedTab;
      if (targetTab) {
        setCustomerTab(targetTab);
      }
    }
  }, []);

  // SUB-TAB STATES
  const [appFilter, setAppFilter] = useState<
    "all" | "Draft" | "Submitted" | "Embassy Processing" | "Approved" | "Rejected" | "Docs Pending"
  >("all");
  const [docsSubTab, setDocsSubTab] = useState<"upload" | "my_docs" | "verification">("upload");
  const [paymentsSubTab, setPaymentsSubTab] = useState<"make_payment" | "history" | "invoices">("make_payment");
  const [exploreSubTab, setExploreSubTab] = useState<"countries" | "types" | "requirements" | "processing" | "fees">("countries");

  // Modals
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // Re-upload simulation
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [docUploadType, setDocUploadType] = useState<"passport" | "photo" | "nocLetter" | "sponsorLetter">("passport");

  // Apply Wizard State
  const [applyStep, setApplyStep] = useState<number>(1);
  const [newAppForm, setNewAppForm] = useState({
    travelerName: "Geeta Sharma",
    dob: "1995-06-12",
    passportNumber: "Z9817264",
    passportExpiry: "2033-12-20",
    nationality: "India",
    destination: "Canada",
    visaType: "Tourist Visa",
    travelDates: "2026-11-10 to 2026-11-25",
    employed: true,
    sponsored: false,
    fees: 14500
  });
  const [applySuccessId, setApplySuccessId] = useState<string | null>(null);

  // Appointment State
  const [selectedCenter, setSelectedCenter] = useState("Visa Application Center, New Delhi");
  const [selectedApptDate, setSelectedApptDate] = useState("2026-07-26");
  const [selectedApptTime, setSelectedApptTime] = useState("11:00 AM");
  const [apptSuccess, setApptSuccess] = useState(false);

  // Payments interactive checkout state
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking">("card");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState("");

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: "n1", title: "Under Review Status Updated", desc: "Embassy marked application VO-2026-1025 under active verification.", time: "10 mins ago", read: false },
    { id: "n2", title: "Visa Approved!", desc: "Application VO-2026-0987 for Australia has been stamped.", time: "2 hours ago", read: false },
    { id: "n3", title: "Upcoming Appointment", desc: "Visa Interview scheduled at New Delhi Center on 26 July 2026.", time: "1 day ago", read: true }
  ]);

  // Profile Data
  const [profileData, setProfileData] = useState({
    fullName: "Geeta Sharma",
    email: "geeta.sharma@phantomvisa.com",
    phone: "+91 98765 43210",
    nationality: "Indian",
    passportNumber: "Z9817264",
    passportExpiry: "2033-12-20",
    address: "42, Barakhamba Road, Connaught Place, New Delhi 110001"
  });
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Settings State
  const [settingsData, setSettingsData] = useState({
    emailAlerts: true,
    smsAlerts: true,
    whatsAppUpdates: true,
    twoFactorAuth: true,
    currency: "INR"
  });

  // Support Ticket Form
  const [ticketForm, setTicketForm] = useState({ subject: "", category: "Document Query", description: "" });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // Chatbot State
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: `Hello ${greetingName}! I am your Phantom Consular Assistant. How can I help with your visa application?` }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatHistory((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", text: `Your application is currently being processed by the consular division. Expected decision within 5-7 business days.` }
      ]);
    }, 600);
  };

  const handleApplyVisaSubmit = () => {
    const newId = addApplication({
      travelerName: newAppForm.travelerName,
      dob: newAppForm.dob,
      passportNumber: newAppForm.passportNumber,
      passportExpiry: newAppForm.passportExpiry,
      nationality: newAppForm.nationality,
      destination: newAppForm.destination,
      visaType: newAppForm.visaType,
      travelDates: newAppForm.travelDates,
      status: "Submitted",
      fees: newAppForm.fees,
      verifiedDocs: { passport: "verified", photo: "verified", nocLetter: "pending", sponsorLetter: "pending" },
      checklist: { employed: newAppForm.employed, sponsored: newAppForm.sponsored }
    });
    setApplySuccessId(newId);
    setApplyStep(3);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
      
      {/* TOP HEADER BAR */}
      <header className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0 z-30 shadow-xs">
        <div className="flex items-center gap-6">
          <Logo variant="header" />

          <button
            onClick={() => setCustomerTab("payments")}
            className="bg-[#F1F5F9] hover:bg-[#EEF2FF] text-slate-700 font-medium px-4 py-1.5 rounded-full border border-slate-200 text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <Wallet size={15} className="text-[#4848F7]" />
            <span className="font-semibold text-slate-800">Wallet</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
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

          <button
            onClick={() => setCustomerTab("messages")}
            className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            title="Messages"
          >
            <MessageSquare size={17} />
          </button>

          <button
            onClick={() => setCustomerTab("notifications")}
            className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition cursor-pointer relative"
            title="Notifications"
          >
            <Bell size={17} />
            {notifications.some((n) => !n.read) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#4848F7] rounded-full" />
            )}
          </button>

          <div
            onClick={() => setCustomerTab("profile")}
            className="w-9 h-9 rounded-full overflow-hidden border border-slate-300 cursor-pointer shadow-xs hover:ring-2 hover:ring-[#4848F7]/40 transition"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
              alt={greetingName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="ml-2 pl-2 border-l border-slate-200">
            <button
              onClick={logoutSession}
              className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-full font-bold text-xs transition cursor-pointer"
              title="Log Out Session"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* BODY LAYOUT: SIDEBAR + MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between overflow-y-auto shrink-0 py-4 px-3 space-y-1">
          <nav className="space-y-1">
            <button
              onClick={() => setCustomerTab("dashboard")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                customerTab === "dashboard"
                  ? "bg-[#EEF2FF] text-[#4848F7] font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <LayoutDashboard size={18} className={customerTab === "dashboard" ? "text-[#4848F7]" : "text-slate-500"} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setCustomerTab("apply")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                customerTab === "apply"
                  ? "bg-[#EEF2FF] text-[#4848F7] font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Navigation size={18} className={customerTab === "apply" ? "text-[#4848F7]" : "text-slate-500"} />
              <span>Apply for Visa</span>
            </button>

            <div>
              <button
                onClick={() => {
                  setCustomerTab("applications");
                  setOpenMyApps(!openMyApps);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  customerTab === "applications"
                    ? "bg-[#EEF2FF] text-[#4848F7] font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ClipboardList size={18} className={customerTab === "applications" ? "text-[#4848F7]" : "text-slate-500"} />
                  <span>My Applications</span>
                </div>
                {openMyApps ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </button>

              {openMyApps && (
                <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-100 space-y-1">
                  {[
                    { label: "All Applications", filter: "all" },
                    { label: "Draft", filter: "Draft" },
                    { label: "Submitted", filter: "Submitted" },
                    { label: "Under Review", filter: "Embassy Processing" },
                    { label: "Approved", filter: "Approved" },
                    { label: "Rejected", filter: "Rejected" },
                    { label: "Cancelled", filter: "Docs Pending" }
                  ].map((sub) => (
                    <button
                      key={sub.label}
                      onClick={() => {
                        setCustomerTab("applications");
                        setAppFilter(sub.filter as any);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-medium block transition ${
                        customerTab === "applications" && appFilter === sub.filter
                          ? "text-[#4848F7] font-bold bg-[#EEF2FF]/60"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => {
                  setCustomerTab("documents");
                  setOpenDocs(!openDocs);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  customerTab === "documents"
                    ? "bg-[#EEF2FF] text-[#4848F7] font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} className={customerTab === "documents" ? "text-[#4848F7]" : "text-slate-500"} />
                  <span>Documents</span>
                </div>
                {openDocs ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </button>

              {openDocs && (
                <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-100 space-y-1">
                  {[
                    { label: "Upload Documents", tab: "upload" },
                    { label: "My Documents", tab: "my_docs" },
                    { label: "Verification Status", tab: "verification" }
                  ].map((sub) => (
                    <button
                      key={sub.label}
                      onClick={() => {
                        setCustomerTab("documents");
                        setDocsSubTab(sub.tab as any);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-medium block transition ${
                        customerTab === "documents" && docsSubTab === sub.tab
                          ? "text-[#4848F7] font-bold bg-[#EEF2FF]/60"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => {
                  setCustomerTab("payments");
                  setOpenPayments(!openPayments);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  customerTab === "payments"
                    ? "bg-[#EEF2FF] text-[#4848F7] font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard size={18} className={customerTab === "payments" ? "text-[#4848F7]" : "text-slate-500"} />
                  <span>Payments</span>
                </div>
                {openPayments ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </button>

              {openPayments && (
                <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-100 space-y-1">
                  {[
                    { label: "Make Payment", tab: "make_payment" },
                    { label: "Payment History", tab: "history" },
                    { label: "Invoices", tab: "invoices" }
                  ].map((sub) => (
                    <button
                      key={sub.label}
                      onClick={() => {
                        setCustomerTab("payments");
                        setPaymentsSubTab(sub.tab as any);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-medium block transition ${
                        customerTab === "payments" && paymentsSubTab === sub.tab
                          ? "text-[#4848F7] font-bold bg-[#EEF2FF]/60"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setCustomerTab("appointments")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                customerTab === "appointments"
                  ? "bg-[#EEF2FF] text-[#4848F7] font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar size={18} className={customerTab === "appointments" ? "text-[#4848F7]" : "text-slate-500"} />
                <span>Appointments</span>
              </div>
              <ChevronRight size={15} />
            </button>

            <div>
              <button
                onClick={() => {
                  setCustomerTab("explore");
                  setOpenExplore(!openExplore);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  customerTab === "explore"
                    ? "bg-[#EEF2FF] text-[#4848F7] font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Globe size={18} className={customerTab === "explore" ? "text-[#4848F7]" : "text-slate-500"} />
                  <span>Explore Visas</span>
                </div>
                {openExplore ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </button>

              {openExplore && (
                <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-100 space-y-1">
                  {[
                    { label: "Countries", tab: "countries" },
                    { label: "Visa Types", tab: "types" },
                    { label: "Visa Requirements", tab: "requirements" },
                    { label: "Processing Time", tab: "processing" },
                    { label: "Visa Fees", tab: "fees" }
                  ].map((sub) => (
                    <button
                      key={sub.label}
                      onClick={() => {
                        setCustomerTab("explore");
                        setExploreSubTab(sub.tab as any);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-medium block transition ${
                        customerTab === "explore" && exploreSubTab === sub.tab
                          ? "text-[#4848F7] font-bold bg-[#EEF2FF]/60"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setCustomerTab("support")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                customerTab === "support"
                  ? "bg-[#EEF2FF] text-[#4848F7] font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <LifeBuoy size={18} className={customerTab === "support" ? "text-[#4848F7]" : "text-slate-500"} />
              <span>Support</span>
            </button>

            <button
              onClick={() => setCustomerTab("profile")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                customerTab === "profile"
                  ? "bg-[#EEF2FF] text-[#4848F7] font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <User size={18} className={customerTab === "profile" ? "text-[#4848F7]" : "text-slate-500"} />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => setCustomerTab("settings")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                customerTab === "settings"
                  ? "bg-[#EEF2FF] text-[#4848F7] font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Settings size={18} className={customerTab === "settings" ? "text-[#4848F7]" : "text-slate-500"} />
              <span>Settings</span>
            </button>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all mt-4"
            >
              <LogOut size={18} className="text-slate-500 hover:text-red-600" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* MAIN DASHBOARD CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">
          
          {/* SECTION 1: MAIN DASHBOARD OVERVIEW */}
          {customerTab === "dashboard" && (
            <div className="space-y-6">

              {/* KYC Pending Notification Banner */}
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-amber-400/50">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white px-2.5 py-0.5 rounded-full font-mono">
                        Action Required • Identity Audit Pending
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-white tracking-tight mt-0.5">Your KYC Verification is Pending</h3>
                    <p className="text-xs text-amber-100 font-medium">
                      Complete your country-specific identity documents verification to activate full visa processing privileges.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCompleteKycModal(true)}
                  className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-900 font-black text-xs rounded-xl shadow-md transition shrink-0 flex items-center gap-2 cursor-pointer"
                >
                  <span>Complete KYC Now</span>
                  <ArrowRight className="w-4 h-4 text-[#4848F7]" />
                </button>
              </div>

              {/* TOP ROW: Good Morning Card & Upcoming Appointment */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT: Good Morning Card */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
                  <h2 className="text-xl font-bold text-slate-800 mb-6">Good Morning, {greetingName} 👋</h2>

                  {/* 8 Stats Metrics */}
                  <div className="space-y-6">
                    {/* Row 1 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Total Applications</p>
                        <p className="text-2xl font-extrabold text-slate-900">
                          {String(liveMetrics.totalApplications).padStart(2, "0")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Under Review</p>
                        <p className="text-2xl font-extrabold text-slate-900">
                          {String(liveMetrics.underReview).padStart(2, "0")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Approved Visas</p>
                        <p className="text-2xl font-extrabold text-slate-900">
                          {String(liveMetrics.approvedVisas).padStart(2, "0")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Rejected Applications</p>
                        <p className="text-2xl font-extrabold text-slate-900">
                          {String(liveMetrics.rejectedApplications)}
                        </p>
                      </div>
                    </div>

                    <hr className="border-t border-slate-100" />

                    {/* Row 2 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Pending Documents</p>
                        <p className="text-2xl font-extrabold text-slate-900">
                          {String(liveMetrics.pendingDocuments).padStart(2, "0")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Upcoming Appointment</p>
                        <p className="text-2xl font-extrabold text-slate-900">
                          {String(liveMetrics.upcomingAppointments ?? 1).padStart(2, "0")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Unread Messages</p>
                        <p className="text-2xl font-extrabold text-slate-900">
                          {String(liveMetrics.unreadMessages ?? 2).padStart(2, "0")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Notifications</p>
                        <p className="text-2xl font-extrabold text-slate-900">
                          {String(liveMetrics.notifications ?? 3).padStart(2, "0")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Upcoming Appointment Card */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-800 mb-4">Upcoming Appointment</h3>
                    
                    {/* Inset Light Blue Details Box */}
                    <div className="bg-[#F0F4FF] border border-[#D8E2FF] rounded-xl p-4 space-y-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Visa Interview</p>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 flex items-center gap-1.5">
                            <Clock size={14} className="text-[#4848F7]" /> Date
                          </span>
                          <span className="font-bold text-slate-800">26 July 2026</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 flex items-center gap-1.5">
                            <Clock size={14} className="text-[#4848F7]" /> Time
                          </span>
                          <span className="font-bold text-slate-800">11:00 AM</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <span className="text-slate-600 flex items-center gap-1.5 shrink-0">
                            <MapPin size={14} className="text-[#4848F7]" /> Location
                          </span>
                          <span className="font-semibold text-slate-800 text-right text-[11px] leading-snug">
                            Visa Application<br />Center, New Delhi
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setCustomerTab("appointments")}
                        className="w-full bg-[#DCE6FF] hover:bg-[#D0E0FF] text-[#4848F7] font-bold text-xs py-2 rounded-lg transition mt-3 text-center cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================================================ */}
              {/* MIDDLE ROW: INTERACTIVE WORLD MAP & STEPPER CARDS */}
              {/* ============================================================ */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Interactive World Map Component */}
                <div className="lg:col-span-8">
                  <InteractiveWorldMap
                    applications={applications}
                    onSelectApplication={(id) => setSelectedAppId(id)}
                  />
                </div>

                {/* Right Column: Individual Card Stack for Active Visa Step */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-800">Visa Status Stepper</h3>
                    <span className="text-emerald-600 bg-emerald-50 border border-emerald-300 px-3 py-0.5 rounded-full text-[11px] font-semibold">
                      Under Review
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { title: "Application submitted", date: "18 Jul 2026", active: true },
                      { title: "Documents Uploaded", date: "18 Jul 2026", active: true },
                      { title: "Documents Verified", date: "19 Jul 2026", active: true },
                      { title: "Payment Confirmed", date: "19 Jul 2026", active: true },
                      { title: "Under Review", date: "Current Status", active: true },
                      { title: "Embassy Review", date: "------", active: false },
                      { title: "Decision Pending", date: "------", active: false },
                      { title: "Visa Approved", date: "------", active: false }
                    ].map((step, idx) => (
                      <div
                        key={idx}
                        className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:border-slate-300 transition flex flex-col justify-center space-y-0.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${step.active ? "text-[#4848F7]" : "text-slate-300"}`}>•</span>
                          <span className={`text-xs font-bold ${step.active ? "text-[#4848F7]" : "text-slate-400"}`}>
                            {step.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium pl-3.5">
                          {step.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ============================================================ */}
              {/* THIRD ROW: APPLICATION STATUS TRACKER TABLE */}
              {/* ============================================================ */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Application Status Tracker</h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#EEF2FF] text-slate-700 font-bold rounded-lg border-b border-slate-200">
                        <th className="py-3 px-4 rounded-l-lg">Application ID</th>
                        <th className="py-3 px-4">Country</th>
                        <th className="py-3 px-4">Visa Type</th>
                        <th className="py-3 px-4">Applied On</th>
                        <th className="py-3 px-4 rounded-r-lg">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-semibold text-slate-800">VO-2026-1025</td>
                        <td className="py-3.5 px-4 text-slate-600">Canada</td>
                        <td className="py-3.5 px-4 text-slate-600">Tourist</td>
                        <td className="py-3.5 px-4 text-slate-600">18 Jul 2026</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-full text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-amber-500" /> Under Review
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-semibold text-slate-800">VO-2026-0987</td>
                        <td className="py-3.5 px-4 text-slate-600">Australia</td>
                        <td className="py-3.5 px-4 text-slate-600">Student</td>
                        <td className="py-3.5 px-4 text-slate-600">10 Jul 2026</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Approved
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-semibold text-slate-800">VO-2026-0912</td>
                        <td className="py-3.5 px-4 text-slate-600">UK</td>
                        <td className="py-3.5 px-4 text-slate-600">Business</td>
                        <td className="py-3.5 px-4 text-slate-600">02 Jul 2026</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 text-red-700 font-bold bg-red-50 px-2.5 py-1 rounded-full text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-red-500" /> Rejected
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ============================================================ */}
              {/* FOURTH ROW: EXPLORE POPULAR VISA CARDS */}
              {/* ============================================================ */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800">Explore Popular Visa</h3>
                  <button
                    onClick={() => setCustomerTab("explore")}
                    className="text-xs font-bold text-[#4848F7] hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition">
                      {/* Image Container with Canada Flag Badge */}
                      <div className="relative h-36 bg-slate-200 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1517935703635-27c737822457?auto=format&fit=crop&q=80&w=600"
                          alt="Canada"
                          className="w-full h-full object-cover"
                        />
                        {/* Canadian Flag Circle Badge Top-Left */}
                        <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center">
                          <svg className="w-full h-full rounded-full" viewBox="0 0 36 36">
                            <rect width="36" height="36" fill="#D80027" />
                            <rect x="9" width="18" height="36" fill="#EEEEEE" />
                            <path d="M18,10 L19.5,14 L23.5,13 L21,16.5 L24,18.5 L20,19 L20.5,23 L18,21 L15.5,23 L16,19 L12,18.5 L15,16.5 L12.5,13 L16.5,14 Z" fill="#D80027" />
                          </svg>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 space-y-1 text-center">
                        <h4 className="text-base font-bold text-slate-800">Canada</h4>
                        <p className="text-xs text-slate-500 font-medium mb-3">Tourist Visa</p>
                        <button
                          onClick={() => setCustomerTab("apply")}
                          className="text-xs font-bold text-[#4848F7] hover:underline transition cursor-pointer"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FOOTER */}
              <footer className="text-center text-xs text-slate-400 py-6 border-t border-slate-200">
                @2026 Visa OS All Rights Reserved
              </footer>
            </div>
          )}

          {/* ============================================================ */}
          {/* OTHER SUBTAB VIEWS (Apply, Applications, Documents, Payments, Appointments, Messages, Notifications, Explore, Support, Profile, Settings) */}
          {/* ============================================================ */}
          
          {/* APPLY FOR VISA WIZARD */}
          {customerTab === "apply" && (
            <ApplicantApplyVisa
              onAddApplication={(appData) => {
                addApplication({
                  travelerName: appData.travelerName || "New Traveler",
                  dob: appData.dob || "1995-06-12",
                  passportNumber: appData.passportNumber || "Z9817264",
                  passportExpiry: appData.passportExpiry || "2033-12-20",
                  nationality: appData.nationality || "Indian",
                  destination: appData.destination || "Australia",
                  visaType: appData.visaType || "Tourist Visa",
                  travelDates: appData.travelDates || "15 Oct 2026 to 15 Nov 2026",
                  status: appData.status || "Submitted",
                  fees: appData.fees || 16500,
                  verifiedDocs: appData.verifiedDocs || {
                    passport: "verified",
                    photo: "verified"
                  },
                  documentsSubmitted: true,
                  kycCompleted: true
                });
              }}
              onNavigateDrafts={() => {
                setCustomerTab("applications");
                setAppFilter("Draft");
              }}
              onNavigatePayment={() => {
                setCustomerTab("payments");
              }}
            />
          )}

          {/* MY APPLICATIONS VIEW */}
          {customerTab === "applications" && appFilter === "Draft" && (
            <ApplicantDraftApplications
              applications={applications}
              onResumeDraft={(draftId) => setCustomerTab("apply")}
              onCreateNewDraft={() => setCustomerTab("apply")}
              onUpdateDocs={updateApplicationDocs}
            />
          )}

          {customerTab === "applications" && appFilter === "Submitted" && (
            <ApplicantSubmittedApplications
              applications={applications}
              onSelectAppForTracking={(appId) => setSelectedAppId(appId)}
              onNavigateSupport={() => setCustomerTab("support")}
              onUpdateDocs={updateApplicationDocs}
            />
          )}

          {customerTab === "applications" && appFilter === "Embassy Processing" && (
            <ApplicantUnderReviewApplications
              applications={applications}
              onSelectAppForTracking={(appId) => setSelectedAppId(appId)}
              onNavigateSupport={() => setCustomerTab("support")}
              onUpdateDocs={updateApplicationDocs}
            />
          )}

          {customerTab === "applications" && appFilter === "Approved" && (
            <ApplicantApprovedApplications
              applications={applications}
              onSelectAppForTracking={(appId) => setSelectedAppId(appId)}
              onNavigateSupport={() => setCustomerTab("support")}
            />
          )}

          {customerTab === "applications" && appFilter === "Rejected" && (
            <ApplicantRejectedApplications
              applications={applications}
              onNavigateApply={() => setCustomerTab("apply")}
              onNavigateSupport={() => setCustomerTab("support")}
            />
          )}

          {customerTab === "applications" && (appFilter === "Docs Pending" || (appFilter as string) === "Cancelled") && (
            <ApplicantCancelledApplications
              applications={applications}
              onNavigateApply={() => setCustomerTab("apply")}
              onNavigatePayments={() => setCustomerTab("payments")}
            />
          )}

          {customerTab === "applications" && appFilter !== "Draft" && appFilter !== "Submitted" && appFilter !== "Embassy Processing" && appFilter !== "Approved" && appFilter !== "Rejected" && appFilter !== "Docs Pending" && (appFilter as string) !== "Cancelled" && (
            <ApplicantAllApplications
              applications={applications}
              onSelectAppForTracking={(appId) => setSelectedAppId(appId)}
              onNavigateApply={() => setCustomerTab("apply")}
              onNavigateSupport={() => setCustomerTab("support")}
              onUpdateDocs={updateApplicationDocs}
            />
          )}

          {/* DOCUMENTS VIEW */}
          {customerTab === "documents" && (
            <div className="space-y-4">
              {/* Document Section Subtab Switcher */}
              <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-wrap items-center gap-2 text-xs font-bold w-fit shadow-xs">
                <button
                  onClick={() => setDocSubTab("vault")}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                    docSubTab === "vault"
                      ? "bg-[#4848F7] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  My Documents Vault
                </button>

                <button
                  onClick={() => setDocSubTab("upload")}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                    docSubTab === "upload"
                      ? "bg-[#4848F7] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Upload Documents
                </button>

                <button
                  onClick={() => setDocSubTab("status")}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                    docSubTab === "status"
                      ? "bg-[#4848F7] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Verification Status
                </button>
              </div>

              {docSubTab === "vault" && (
                <ApplicantMyDocuments
                  applications={applications}
                  onNavigateUpload={() => setDocSubTab("upload")}
                  onNavigateSupport={() => setCustomerTab("support")}
                />
              )}

              {docSubTab === "upload" && (
                <ApplicantUploadDocuments
                  applications={applications}
                  onUpdateDocs={updateApplicationDocs}
                  onNavigateApply={() => setCustomerTab("apply")}
                  onNavigateSupport={() => setCustomerTab("support")}
                />
              )}

              {docSubTab === "status" && (
                <ApplicantVerificationStatus
                  applications={applications}
                  onNavigateUpload={() => setDocSubTab("upload")}
                  onNavigateSupport={() => setCustomerTab("support")}
                />
              )}
            </div>
          )}

          {/* PAYMENTS VIEW */}
          {customerTab === "payments" && (
            <ApplicantMakePayment
              applications={applications}
              walletBalance={walletBalance}
              onNavigateSupport={() => setCustomerTab("support")}
            />
          )}

          {/* APPOINTMENTS VIEW */}
          {customerTab === "appointments" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
              <h2 className="text-lg font-bold text-slate-800">Biometrics & Consular Appointments</h2>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <p className="font-bold text-slate-800">Scheduled Interview</p>
                <p className="text-slate-600">Location: Visa Application Center, New Delhi</p>
                <p className="text-slate-600">Slot: 26 July 2026 at 11:00 AM</p>
              </div>
            </div>
          )}

          {/* MESSAGES VIEW */}
          {customerTab === "messages" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs h-[500px] flex flex-col">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Phantom AI Consular Assistant</h2>
              <div className="flex-1 overflow-y-auto space-y-3 p-2">
                {chatHistory.map((m, idx) => (
                  <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`p-3 rounded-xl text-xs max-w-md ${m.sender === "user" ? "bg-[#4848F7] text-white" : "bg-slate-100 text-slate-800"}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 text-xs px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#4848F7]"
                />
                <button type="submit" className="bg-[#4848F7] text-white text-xs font-bold px-4 py-2.5 rounded-lg">
                  Send
                </button>
              </form>
            </div>
          )}

          {/* NOTIFICATIONS VIEW */}
          {customerTab === "notifications" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
              <h2 className="text-lg font-bold text-slate-800">Notifications</h2>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <p className="font-bold text-slate-800">{n.title}</p>
                    <p className="text-slate-600">{n.desc}</p>
                    <p className="text-[10px] text-slate-400">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXPLORE VISAS VIEW */}
          {customerTab === "explore" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
              <h2 className="text-lg font-bold text-slate-800">Explore Visas Worldwide</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {["Canada", "France", "Germany", "United Kingdom", "Australia", "United States"].map((country) => (
                  <div key={country} className="p-4 border border-slate-200 rounded-xl text-center space-y-2 hover:border-[#4848F7] transition">
                    <p className="font-bold text-slate-800">{country}</p>
                    <button onClick={() => setCustomerTab("apply")} className="text-[#4848F7] font-bold hover:underline">
                      View Visas &rarr;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUPPORT VIEW */}
          {customerTab === "support" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs max-w-xl mx-auto">
              <h2 className="text-lg font-bold text-slate-800">Contact Support</h2>
              <form onSubmit={(e) => { e.preventDefault(); setTicketSubmitted(true); }} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Document query"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your issue..."
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg"
                  />
                </div>
                <button type="submit" className="bg-[#4848F7] text-white font-bold text-xs px-6 py-2.5 rounded-lg">
                  Submit Ticket
                </button>
                {ticketSubmitted && <p className="text-emerald-600 font-bold">Ticket created successfully!</p>}
              </form>
            </div>
          )}

          {/* PROFILE VIEW */}
          {customerTab === "profile" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs max-w-xl mx-auto">
              <h2 className="text-lg font-bold text-slate-800">My Applicant Profile</h2>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Passport Number</label>
                  <input
                    type="text"
                    value={profileData.passportNumber}
                    onChange={(e) => setProfileData({ ...profileData, passportNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg"
                  />
                </div>
                <button
                  onClick={() => setProfileSaveSuccess(true)}
                  className="bg-[#4848F7] text-white font-bold text-xs px-6 py-2.5 rounded-lg"
                >
                  Save Profile
                </button>
                {profileSaveSuccess && <p className="text-emerald-600 font-bold">Profile updated successfully!</p>}
              </div>
            </div>
          )}

          {/* SETTINGS VIEW */}
          {customerTab === "settings" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs max-w-xl mx-auto">
              <h2 className="text-lg font-bold text-slate-800">Account Settings</h2>
              <div className="space-y-3 text-xs">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsData.emailAlerts}
                    onChange={(e) => setSettingsData({ ...settingsData, emailAlerts: e.target.checked })}
                    className="w-4 h-4 text-[#4848F7] rounded"
                  />
                  <span>Receive Email Status Alerts</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsData.whatsAppUpdates}
                    onChange={(e) => setSettingsData({ ...settingsData, whatsAppUpdates: e.target.checked })}
                    className="w-4 h-4 text-[#4848F7] rounded"
                  />
                  <span>Receive WhatsApp Status Updates</span>
                </label>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 text-center shadow-xl">
            <h3 className="text-base font-bold text-slate-800">Log Out of Applicant Portal?</h3>
            <p className="text-xs text-slate-500">You can return to the platform role selector anytime.</p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  logoutSession();
                }}
                className="flex-1 bg-[#4848F7] hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPLETE KYC MODAL */}
      {showCompleteKycModal && (
        <CompleteKycModal
          applicant={{
            id: applicantDashboardData?.application?.id || "APP-MYSELF",
            userId: authSession?.user?.id,
            name: authSession?.user?.name || greetingName,
            email: authSession?.user?.email || "",
            mobile: authSession?.user?.phone || "",
            country: "India"
          }}
          onClose={() => setShowCompleteKycModal(false)}
          onSuccess={() => {
            setShowCompleteKycModal(false);
            if (fetchApplicantDashboardData) fetchApplicantDashboardData();
          }}
        />
      )}
    </div>
  );
}
