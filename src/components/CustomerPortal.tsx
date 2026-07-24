"use client";

import React, { useState } from "react";
import { useVisa, Application, CustomerTab, formatINR } from "../context/VisaContext";
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
  ArrowRight
} from "lucide-react";

export default function CustomerPortal() {
  const {
    applications,
    updateApplicationDocs,
    addApplication,
    customerTab,
    setCustomerTab,
    setRole
  } = useVisa();

  // Selected active application ID for tracking/documents
  const [selectedAppId, setSelectedAppId] = useState<string>("PV-2026-0043");
  const [searchQuery, setSearchQuery] = useState("");

  // Target app reference
  const app = applications.find((a) => a.id === selectedAppId) || applications[0];

  // SUB-TAB STATES
  // 1. Dashboard: 'overview' | 'recent_activity'
  const [dashboardSubTab, setDashboardSubTab] = useState<"overview" | "recent_activity">("overview");

  // 3. My Applications: 'all' | 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'cancelled'
  const [appFilter, setAppFilter] = useState<
    "all" | "Draft" | "Submitted" | "Embassy Processing" | "Approved" | "Rejected" | "Docs Pending"
  >("all");

  // 4. Documents: 'upload' | 'my_docs' | 'verification'
  const [docsSubTab, setDocsSubTab] = useState<"upload" | "my_docs" | "verification">("upload");

  // 5. Payments: 'make_payment' | 'history' | 'invoices'
  const [paymentsSubTab, setPaymentsSubTab] = useState<"make_payment" | "history" | "invoices">("make_payment");

  // 9. Explore Visas: 'countries' | 'types' | 'requirements' | 'processing' | 'fees'
  const [exploreSubTab, setExploreSubTab] = useState<"countries" | "types" | "requirements" | "processing" | "fees">(
    "countries"
  );

  // Logout confirmation modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Invoice view modal state
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // ----------------------------------------------------
  // SIMULATED INTERACTIVE STATES
  // ----------------------------------------------------

  // Re-upload simulation
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Document Upload Form state
  const [docUploadType, setDocUploadType] = useState<"passport" | "photo" | "nocLetter" | "sponsorLetter">("passport");
  const [selectedUploadFile, setSelectedUploadFile] = useState<string | null>(null);
  const [isSimulatingOCR, setIsSimulatingOCR] = useState(false);

  // Apply for Visa Wizard State
  const [applyStep, setApplyStep] = useState<number>(1);
  const [newAppForm, setNewAppForm] = useState({
    travelerName: "Vibhu Sharma",
    dob: "1996-08-14",
    passportNumber: "Z9817264",
    passportExpiry: "2033-12-20",
    nationality: "India",
    destination: "France",
    visaType: "Schengen Tourist",
    travelDates: "2026-11-10 to 2026-11-25",
    employed: true,
    sponsored: false,
    fees: 14500
  });
  const [applySuccessId, setApplySuccessId] = useState<string | null>(null);

  // Appointment scheduling state
  const [selectedCenter, setSelectedCenter] = useState("VFS Global Center - New Delhi (Connaught Place)");
  const [selectedApptDate, setSelectedApptDate] = useState("2026-08-15");
  const [selectedApptTime, setSelectedApptTime] = useState("10:30 AM");
  const [appointmentsList, setAppointmentsList] = useState([
    {
      id: "APT-8819",
      appId: "PV-2026-0043",
      traveler: "Amara Okafor",
      center: "VFS Global Center - London Victoria",
      date: "2026-08-10",
      time: "11:00 AM",
      status: "CONFIRMED",
      type: "Biometrics & Passport Submission"
    }
  ]);
  const [apptSuccess, setApptSuccess] = useState(false);

  // Payments interactive checkout state
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking">("card");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState("");

  // Payment History mock list
  const [paymentHistory] = useState([
    { id: "PAY-9011", date: "2026-07-21", appId: "PV-2026-0044", amount: 23240, method: "Visa Card ending ••4219", status: "COMPLETED" },
    { id: "PAY-9010", date: "2026-07-20", appId: "PV-2026-0043", amount: 16185, method: "UPI (vibhu@okaxis)", status: "COMPLETED" },
    { id: "PAY-9009", date: "2026-07-18", appId: "PV-2026-0042", amount: 17430, method: "Mastercard ending ••8812", status: "COMPLETED" },
    { id: "PAY-9008", date: "2026-07-15", appId: "PV-2026-0041", amount: 13280, method: "Net Banking (HDFC)", status: "COMPLETED" }
  ]);

  // Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      title: "Document Rectification Required",
      desc: "Embassy marked your passport photo scan as blurry for PV-2026-0043.",
      time: "10 mins ago",
      type: "ACTION",
      read: false
    },
    {
      id: "n2",
      title: "Visa Approved!",
      desc: "Application PV-2026-0041 for Sophia Martinez has been stamped and released.",
      time: "2 hours ago",
      type: "SUCCESS",
      read: false
    },
    {
      id: "n3",
      title: "Payment Receipt Generated",
      desc: "Tax invoice #INV-2026-8813 for ₹23,240 is now available in your Payments tab.",
      time: "1 day ago",
      type: "INFO",
      read: true
    },
    {
      id: "n4",
      title: "Biometrics Appointment Confirmed",
      desc: "Slot reserved for Aug 10, 2026 at VFS London for Amara Okafor.",
      time: "2 days ago",
      type: "CALENDAR",
      read: true
    }
  ]);

  // Profile Form state
  const [profileData, setProfileData] = useState({
    fullName: "Vibhu Sharma",
    email: "vibhu.sharma@phantomvisa.com",
    phone: "+91 98765 43210",
    dob: "1996-08-14",
    nationality: "Indian",
    passportNumber: "Z9817264",
    passportExpiry: "2033-12-20",
    issuingAuthority: "Regional Passport Office Delhi",
    address: "42, Barakhamba Road, Connaught Place, New Delhi 110001"
  });
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Settings State
  const [settingsData, setSettingsData] = useState({
    emailAlerts: true,
    smsAlerts: true,
    whatsAppUpdates: true,
    twoFactorAuth: true,
    currency: "INR",
    sessionTimeoutMinutes: 30
  });

  // Support Ticket Form state
  const [ticketForm, setTicketForm] = useState({ subject: "", category: "Document Query", description: "" });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // Chatbot states
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "ai"; text: string; source?: string }>>([
    {
      sender: "ai",
      text: "[Powered by OpenAI GPT-4 / Anthropic Claude 3.5 Adapter] Hello! I am your Phantom AI Consular Assistant. Ask me questions about passport validity, embassy rules, fee structures, or document verification requirements."
    }
  ]);

  const cannedAnswers = [
    {
      keywords: ["passport", "validity", "expire"],
      text: "Your passport must remain valid for at least 3 months beyond the planned departure date from the Schengen area and must contain at least two empty pages.",
      source: "Visa Catalog Sec. 4.1"
    },
    {
      keywords: ["balance", "money", "funds", "bank", "germany"],
      text: "German consular services recommend showing proof of at least €45 to €100 per day of travel. This is typically verified through certified bank statements for the last 3-6 months.",
      source: "Visa Catalog Sec. 7.9"
    },
    {
      keywords: ["transit", "layover", "london", "uk"],
      text: "Many travelers require a Direct Airside Transit Visa (DATV) for UK layovers. However, if you hold a valid visa or residence permit for the US, Canada, or Schengen, you are typically exempt under Transit Without Visa rules.",
      source: "Visa Catalog Sec. 2.12"
    },
    {
      keywords: ["refusal", "rejected", "fail"],
      text: "Document verification checks verify scanning clarity, notary seals, and signatures. If a document fails, it will be marked 'Needs review' in your portal, enabling immediate re-upload.",
      source: "Visa System FAQ"
    }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatHistory((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      const matched = cannedAnswers.find((ans) => ans.keywords.some((k) => lower.includes(k)));

      if (matched) {
        setChatHistory((prev) => [...prev, { sender: "ai", text: matched.text, source: matched.source }]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "I couldn't find a direct match in our embassy archives for that specific query. Let me route you to one of our consular officers.",
            source: "Platform Router"
          }
        ]);
      }
    }, 800);
  };

  const handleCannedClick = (qText: string) => {
    setChatHistory((prev) => [...prev, { sender: "user", text: qText }]);
    setTimeout(() => {
      const lower = qText.toLowerCase();
      const matched = cannedAnswers.find((ans) => ans.keywords.some((k) => lower.includes(k)));
      if (matched) {
        setChatHistory((prev) => [...prev, { sender: "ai", text: matched.text, source: matched.source }]);
      }
    }, 600);
  };

  // Re-upload document simulation
  const handleReuploadDoc = (docKey: "passport" | "photo" | "nocLetter" | "sponsorLetter") => {
    setUploadingDoc(true);
    setUploadSuccess(false);

    setTimeout(() => {
      setUploadingDoc(false);
      setUploadSuccess(true);
      updateApplicationDocs(selectedAppId, docKey, "verified");

      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    }, 1800);
  };

  // Stepper helper
  const getStepperDetails = (status: string) => {
    const steps = [
      { key: "Draft", title: "Documents Gathered", desc: "Files uploaded locally" },
      { key: "Docs Pending", title: "AI Verification", desc: "Automated check" },
      { key: "Submitted", title: "Embassy Dispatch", desc: "Ledger clearance" },
      { key: "Embassy Processing", title: "Under Consul Review", desc: "Consular officer evaluation" },
      { key: "Approved", title: "Visa Released", desc: "Passport stamped & ready" }
    ];

    let activeIdx = 0;
    if (status === "Docs Pending") activeIdx = 1;
    else if (status === "Submitted") activeIdx = 2;
    else if (status === "Embassy Processing") activeIdx = 3;
    else if (status === "Approved" || status === "Rejected") activeIdx = 4;

    return { steps, activeIdx };
  };

  const stepper = app ? getStepperDetails(app.status) : null;

  // Filter applications
  const filteredApplications = applications.filter((a) => {
    if (appFilter === "all") return true;
    return a.status === appFilter;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-brand-midnight text-brand-paper overflow-hidden">
      {/* TOP HEADER SUB-NAV / SEARCH BAR */}
      <div className="bg-brand-slate border-b border-brand-gold/15 px-6 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold text-sm">
            {customerTab === "dashboard" && <LayoutDashboard size={18} />}
            {customerTab === "apply" && <FilePlus2 size={18} />}
            {customerTab === "applications" && <ClipboardList size={18} />}
            {customerTab === "documents" && <FileText size={18} />}
            {customerTab === "payments" && <CreditCard size={18} />}
            {customerTab === "appointments" && <Calendar size={18} />}
            {customerTab === "messages" && <MessageSquare size={18} />}
            {customerTab === "notifications" && <Bell size={18} />}
            {customerTab === "explore" && <Globe size={18} />}
            {customerTab === "support" && <LifeBuoy size={18} />}
            {customerTab === "profile" && <User size={18} />}
            {customerTab === "settings" && <Settings size={18} />}
          </div>
          <div>
            <h2 className="font-outfit font-bold text-base text-brand-paper capitalize">
              Customer Profile &mdash; {customerTab.replace("_", " ")}
            </h2>
            <p className="text-[10px] text-brand-paper/50">
              Applicant ID: <span className="font-mono text-brand-gold">APP-USER-9812</span> &bull; Schengen & UK Gateway
            </p>
          </div>
        </div>

        {/* Action Controls & Notifications */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Active File Switcher */}
          <div className="relative">
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="bg-brand-midnight border border-brand-gold/20 text-brand-gold text-xs font-mono rounded px-3 py-1.5 focus:outline-none focus:border-brand-gold"
            >
              {applications.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.id} - {a.travelerName.split(" ")[0]} ({a.destination})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Notification Bell */}
          <button
            onClick={() => setCustomerTab("notifications")}
            className="relative p-2 bg-brand-midnight hover:bg-brand-gold/10 border border-brand-gold/20 rounded transition text-brand-gold"
            title="Notifications"
          >
            <Bell size={16} />
            {notifications.some((n) => !n.read) && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-red rounded-full animate-ping" />
            )}
          </button>

          {/* Apply Shortcut Button */}
          <button
            onClick={() => setCustomerTab("apply")}
            className="bg-brand-gold hover:bg-brand-gold-hover text-brand-midnight font-bold text-xs px-3 py-1.5 rounded transition flex items-center gap-1.5 shadow-md shadow-brand-gold/10"
          >
            <Plus size={14} />
            <span>Apply Now</span>
          </button>
        </div>
      </div>

      {/* MAIN BODY AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* ============================================================ */}
        {/* SECTION 1: DASHBOARD (Overview & Recent Activity) */}
        {/* ============================================================ */}
        {customerTab === "dashboard" && (
          <div className="space-y-6">
            {/* Dashboard Sub-Tabs Header */}
            <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDashboardSubTab("overview")}
                  className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
                    dashboardSubTab === "overview"
                      ? "bg-brand-gold text-brand-midnight shadow-md shadow-brand-gold/10"
                      : "text-brand-paper/60 hover:text-brand-paper bg-brand-slate"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setDashboardSubTab("recent_activity")}
                  className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
                    dashboardSubTab === "recent_activity"
                      ? "bg-brand-gold text-brand-midnight shadow-md shadow-brand-gold/10"
                      : "text-brand-paper/60 hover:text-brand-paper bg-brand-slate"
                  }`}
                >
                  Recent Activity
                </button>
              </div>

              <span className="text-[11px] text-brand-paper/40 font-mono">
                System Status: <span className="text-brand-teal font-bold">OPERATIONAL ✓</span>
              </span>
            </div>

            {dashboardSubTab === "overview" ? (
              <div className="space-y-6">
                {/* Metrics Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-brand-slate border border-brand-gold/15 p-5 rounded-lg space-y-1 hover:border-brand-gold/40 transition">
                    <div className="flex justify-between items-center text-brand-paper/50">
                      <span className="text-xs font-medium uppercase tracking-wider">Active Visas</span>
                      <ClipboardList size={18} className="text-brand-gold" />
                    </div>
                    <p className="font-outfit text-2xl font-bold text-brand-paper">
                      {applications.filter((a) => a.status !== "Approved" && a.status !== "Rejected").length}
                    </p>
                    <p className="text-[10px] text-brand-teal">Applications in processing pipeline</p>
                  </div>

                  <div className="bg-brand-slate border border-brand-gold/15 p-5 rounded-lg space-y-1 hover:border-brand-gold/40 transition">
                    <div className="flex justify-between items-center text-brand-paper/50">
                      <span className="text-xs font-medium uppercase tracking-wider">Action Needed</span>
                      <AlertCircle size={18} className="text-brand-red" />
                    </div>
                    <p className="font-outfit text-2xl font-bold text-brand-red">
                      {applications.filter((a) => a.status === "Docs Pending").length}
                    </p>
                    <p className="text-[10px] text-brand-paper/50">Document re-upload required</p>
                  </div>

                  <div className="bg-brand-slate border border-brand-gold/15 p-5 rounded-lg space-y-1 hover:border-brand-gold/40 transition">
                    <div className="flex justify-between items-center text-brand-paper/50">
                      <span className="text-xs font-medium uppercase tracking-wider">Total Fees Paid</span>
                      <CreditCard size={18} className="text-brand-gold" />
                    </div>
                    <p className="font-outfit text-2xl font-bold text-brand-gold" suppressHydrationWarning>
                      ₹{formatINR(applications.reduce((acc, a) => acc + a.fees, 0))}
                    </p>
                    <p className="text-[10px] text-brand-paper/50">Consular & processing clearance</p>
                  </div>

                  <div className="bg-brand-slate border border-brand-gold/15 p-5 rounded-lg space-y-1 hover:border-brand-gold/40 transition">
                    <div className="flex justify-between items-center text-brand-paper/50">
                      <span className="text-xs font-medium uppercase tracking-wider">Next Appointment</span>
                      <Calendar size={18} className="text-brand-teal" />
                    </div>
                    <p className="font-outfit text-lg font-bold text-brand-paper truncate">
                      Aug 10, 2026
                    </p>
                    <p className="text-[10px] text-brand-teal truncate">VFS London Victoria</p>
                  </div>
                </div>

                {/* Primary Stepper Card for Selected Application */}
                <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-6">
                  <div className="flex justify-between items-start flex-wrap gap-4 border-b border-brand-gold/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-brand-gold font-mono font-bold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20">
                          FILE: {app.id}
                        </span>
                        <span className="text-xs text-brand-paper/50">Submitted: {app.submissionDate}</span>
                      </div>
                      <h3 className="font-outfit text-xl font-bold mt-1 text-brand-paper">
                        {app.travelerName} &mdash; {app.destination} ({app.visaType})
                      </h3>
                      <p className="text-xs text-brand-paper/60">
                        Passport: <span className="font-mono text-brand-paper">{app.passportNumber}</span> &bull; Travel Dates: {app.travelDates}
                      </p>
                    </div>

                    {/* Stamp Seal for status */}
                    {app.status === "Approved" && (
                      <div className="stamp-seal stamp-approved">
                        APPROVED<br />
                        <span className="text-[8px]">PASSPORT RELEASED</span>
                      </div>
                    )}
                    {app.status === "Rejected" && (
                      <div className="stamp-seal stamp-rejected">
                        DENIED<br />
                        <span className="text-[8px]">REFUSAL ISSUED</span>
                      </div>
                    )}
                    {app.status !== "Approved" && app.status !== "Rejected" && (
                      <div className="stamp-seal stamp-pending">
                        PROCESSING<br />
                        <span className="text-[8px]">EMBASSY QUEUE</span>
                      </div>
                    )}
                  </div>

                  {/* Horizontal Stepper Component */}
                  {stepper && (
                    <div className="pt-2">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative gap-6">
                        <div className="hidden md:block absolute left-6 right-6 top-4 h-0.5 bg-brand-midnight z-0" />
                        <div
                          className="hidden md:block absolute left-6 top-4 h-0.5 bg-brand-gold transition-all duration-500 z-0"
                          style={{ width: `${(stepper.activeIdx / (stepper.steps.length - 1)) * 92}%` }}
                        />

                        {stepper.steps.map((step, idx) => {
                          const isCompleted = idx < stepper.activeIdx;
                          const isActive = idx === stepper.activeIdx;
                          const isRejectedState = app.status === "Rejected" && idx === stepper.steps.length - 1;

                          return (
                            <div key={step.key} className="flex md:flex-col items-start md:items-center text-left md:text-center flex-1 relative z-10 gap-3 md:gap-2">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition ${
                                  isRejectedState
                                    ? "bg-brand-midnight border-brand-red text-brand-red shadow-lg shadow-brand-red/10"
                                    : isCompleted
                                    ? "bg-brand-gold border-brand-gold text-brand-midnight font-black"
                                    : isActive
                                    ? "bg-brand-midnight border-brand-gold text-brand-gold shadow-lg shadow-brand-gold/15 scale-110"
                                    : "bg-brand-midnight border-brand-gold/15 text-brand-paper/30"
                                }`}
                              >
                                {isCompleted ? "✓" : idx + 1}
                              </div>

                              <div className="space-y-0.5">
                                <p
                                  className={`text-xs font-semibold ${
                                    isRejectedState
                                      ? "text-brand-red"
                                      : isActive
                                      ? "text-brand-gold font-bold"
                                      : isCompleted
                                      ? "text-brand-paper"
                                      : "text-brand-paper/40"
                                  }`}
                                >
                                  {isRejectedState ? "Embassy Refused" : step.title}
                                </p>
                                <p className="text-[10px] text-brand-paper/50 md:max-w-[120px] leading-tight mx-auto">
                                  {isRejectedState ? app.reason : step.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Rectification Alert Box if Docs Pending */}
                  {app.status === "Docs Pending" && (
                    <div className="bg-brand-midnight p-4 rounded border border-brand-red/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-red flex items-center gap-1.5">
                          <AlertCircle size={16} />
                          Action Required: Document Rectification Requested
                        </span>
                        <button
                          onClick={() => setCustomerTab("documents")}
                          className="bg-brand-red hover:bg-brand-red/80 text-white text-[11px] font-bold px-3 py-1 rounded transition"
                        >
                          Go to Upload Center &rarr;
                        </button>
                      </div>
                      <p className="text-xs text-brand-paper/70 font-mono bg-brand-red/10 p-2.5 rounded">
                        Note from Consular Scanner: {app.reason || "Passport scan is blurred. Re-upload a clear 300 DPI scan."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Action Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => setCustomerTab("apply")}
                    className="p-4 bg-brand-slate border border-brand-gold/15 hover:border-brand-gold rounded-lg flex flex-col items-center text-center space-y-2 transition group"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-gold/10 group-hover:bg-brand-gold text-brand-gold group-hover:text-brand-midnight flex items-center justify-center transition">
                      <FilePlus2 size={20} />
                    </div>
                    <span className="text-xs font-bold text-brand-paper">Apply for New Visa</span>
                    <span className="text-[10px] text-brand-paper/50">Start 4-step Schengen/UK app</span>
                  </button>

                  <button
                    onClick={() => setCustomerTab("documents")}
                    className="p-4 bg-brand-slate border border-brand-gold/15 hover:border-brand-gold rounded-lg flex flex-col items-center text-center space-y-2 transition group"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-gold/10 group-hover:bg-brand-gold text-brand-gold group-hover:text-brand-midnight flex items-center justify-center transition">
                      <Upload size={20} />
                    </div>
                    <span className="text-xs font-bold text-brand-paper">Upload Documents</span>
                    <span className="text-[10px] text-brand-paper/50">Passports, Photos, NOCs & Bank</span>
                  </button>

                  <button
                    onClick={() => setCustomerTab("payments")}
                    className="p-4 bg-brand-slate border border-brand-gold/15 hover:border-brand-gold rounded-lg flex flex-col items-center text-center space-y-2 transition group"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-gold/10 group-hover:bg-brand-gold text-brand-gold group-hover:text-brand-midnight flex items-center justify-center transition">
                      <CreditCard size={20} />
                    </div>
                    <span className="text-xs font-bold text-brand-paper">Make Payment</span>
                    <span className="text-[10px] text-brand-paper/50">Clear consular fees & download invoice</span>
                  </button>

                  <button
                    onClick={() => setCustomerTab("explore")}
                    className="p-4 bg-brand-slate border border-brand-gold/15 hover:border-brand-gold rounded-lg flex flex-col items-center text-center space-y-2 transition group"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-gold/10 group-hover:bg-brand-gold text-brand-gold group-hover:text-brand-midnight flex items-center justify-center transition">
                      <Globe size={20} />
                    </div>
                    <span className="text-xs font-bold text-brand-paper">Explore Visa Rules</span>
                    <span className="text-[10px] text-brand-paper/50">Requirements, SLAs & Fee matrices</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Recent Activity Sub-Tab */
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4">
                <h3 className="font-outfit font-bold text-sm text-brand-gold uppercase tracking-wider">
                  Timeline of Recent Events & Activity
                </h3>
                <div className="space-y-4 relative pl-4 border-l-2 border-brand-gold/20">
                  <div className="relative space-y-1">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-brand-gold" />
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-brand-paper">Document Rectification Uploaded</span>
                      <span className="text-brand-paper/40 font-mono text-[10px]">Today, 11:20 AM</span>
                    </div>
                    <p className="text-xs text-brand-paper/60">
                      High-resolution scan of Passport Photo re-submitted for PV-2026-0043. AI check passed with 99.2% confidence.
                    </p>
                  </div>

                  <div className="relative space-y-1">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-brand-teal" />
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-brand-paper">Visa Approved by German Consulate</span>
                      <span className="text-brand-paper/40 font-mono text-[10px]">July 22, 2026</span>
                    </div>
                    <p className="text-xs text-brand-paper/60">
                      Application PV-2026-0041 for Sophia Martinez approved. Multi-entry Schengen visa valid for 1 year.
                    </p>
                  </div>

                  <div className="relative space-y-1">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-brand-gold" />
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-brand-paper">Consular Fee Payment Cleared</span>
                      <span className="text-brand-paper/40 font-mono text-[10px]">July 21, 2026</span>
                    </div>
                    <p className="text-xs text-brand-paper/60">
                      Fee of ₹23,240 debited for Student Visa PV-2026-0044. Official receipt issued.
                    </p>
                  </div>

                  <div className="relative space-y-1">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-brand-paper/40" />
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-brand-paper">Biometrics Appointment Scheduled</span>
                      <span className="text-brand-paper/40 font-mono text-[10px]">July 20, 2026</span>
                    </div>
                    <p className="text-xs text-brand-paper/60">
                      Confirmed appointment pass generated for VFS London Victoria on Aug 10, 2026 at 11:00 AM.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 2: APPLY FOR VISA (Multi-Step Form Wizard) */}
        {/* ============================================================ */}
        {customerTab === "apply" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-6">
              <div className="border-b border-brand-gold/10 pb-4">
                <h3 className="font-outfit font-bold text-xl text-brand-gold">Apply for Visa &mdash; Online Wizard</h3>
                <p className="text-xs text-brand-paper/60">
                  Complete the 4-step wizard to submit your visa application directly into the consular queue.
                </p>
              </div>

              {/* Step indicator */}
              <div className="flex justify-between items-center gap-2 font-mono text-xs">
                {[
                  { step: 1, label: "Destination & Type" },
                  { step: 2, label: "Traveler Details" },
                  { step: 3, label: "Travel & Checklist" },
                  { step: 4, label: "Review & Fee Submit" }
                ].map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setApplyStep(s.step)}
                    className={`flex-1 text-center py-2 rounded border transition ${
                      applyStep === s.step
                        ? "bg-brand-gold/20 border-brand-gold text-brand-gold font-bold"
                        : applyStep > s.step
                        ? "bg-brand-teal/20 border-brand-teal text-brand-teal"
                        : "bg-brand-midnight/40 border-brand-gold/10 text-brand-paper/40"
                    }`}
                  >
                    Step {s.step}: {s.label}
                  </button>
                ))}
              </div>

              {/* Step 1 Content */}
              {applyStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-paper/70 mb-1">Destination Country</label>
                      <select
                        value={newAppForm.destination}
                        onChange={(e) => setNewAppForm({ ...newAppForm, destination: e.target.value })}
                        className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-xs text-brand-paper outline-none focus:border-brand-gold"
                      >
                        <option value="France">France (Schengen Area)</option>
                        <option value="Germany">Germany (Schengen Area)</option>
                        <option value="United Kingdom">United Kingdom (UK Visas)</option>
                        <option value="Canada">Canada (IRCC Visitor/Student)</option>
                        <option value="Japan">Japan (eVisa/Consular)</option>
                        <option value="United States">United States (B1/B2)</option>
                        <option value="United Arab Emirates">United Arab Emirates (Dubai tourist)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-paper/70 mb-1">Visa Category</label>
                      <select
                        value={newAppForm.visaType}
                        onChange={(e) => setNewAppForm({ ...newAppForm, visaType: e.target.value })}
                        className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-xs text-brand-paper outline-none focus:border-brand-gold"
                      >
                        <option value="Schengen Tourist">Schengen Tourist (Type C Short Stay)</option>
                        <option value="Schengen Business">Schengen Business (Type C Commercial)</option>
                        <option value="Standard Visitor">Standard UK Visitor Visa</option>
                        <option value="Student Visa">Long Stay Student Visa (Type D)</option>
                        <option value="Transit Visa">Direct Airside Transit (DATV)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setApplyStep(2)}
                      className="bg-brand-gold hover:bg-brand-gold-hover text-brand-midnight text-xs font-bold px-5 py-2 rounded transition flex items-center gap-1"
                    >
                      Next: Traveler Details &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 Content */}
              {applyStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-paper/70 mb-1">Full Name (as per Passport)</label>
                      <input
                        type="text"
                        value={newAppForm.travelerName}
                        onChange={(e) => setNewAppForm({ ...newAppForm, travelerName: e.target.value })}
                        className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-xs text-brand-paper outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-paper/70 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={newAppForm.dob}
                        onChange={(e) => setNewAppForm({ ...newAppForm, dob: e.target.value })}
                        className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-xs text-brand-paper outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-paper/70 mb-1">Passport Number</label>
                      <input
                        type="text"
                        value={newAppForm.passportNumber}
                        onChange={(e) => setNewAppForm({ ...newAppForm, passportNumber: e.target.value })}
                        className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-xs text-brand-paper font-mono outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-paper/70 mb-1">Passport Expiry Date</label>
                      <input
                        type="date"
                        value={newAppForm.passportExpiry}
                        onChange={(e) => setNewAppForm({ ...newAppForm, passportExpiry: e.target.value })}
                        className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-xs text-brand-paper outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setApplyStep(1)}
                      className="bg-brand-midnight border border-brand-gold/20 text-brand-paper text-xs font-bold px-4 py-2 rounded transition"
                    >
                      &larr; Back
                    </button>
                    <button
                      onClick={() => setApplyStep(3)}
                      className="bg-brand-gold hover:bg-brand-gold-hover text-brand-midnight text-xs font-bold px-5 py-2 rounded transition flex items-center gap-1"
                    >
                      Next: Travel & Checklists &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 Content */}
              {applyStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-paper/70 mb-1">Intended Travel Dates</label>
                    <input
                      type="text"
                      placeholder="e.g. 2026-11-10 to 2026-11-25"
                      value={newAppForm.travelDates}
                      onChange={(e) => setNewAppForm({ ...newAppForm, travelDates: e.target.value })}
                      className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-xs text-brand-paper outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div className="p-4 bg-brand-midnight rounded border border-brand-gold/10 space-y-3">
                    <span className="text-xs font-bold text-brand-gold block uppercase tracking-wider">
                      Applicant Declaration Checklists
                    </span>
                    <label className="flex items-center gap-2 text-xs text-brand-paper">
                      <input
                        type="checkbox"
                        checked={newAppForm.employed}
                        onChange={(e) => setNewAppForm({ ...newAppForm, employed: e.target.checked })}
                        className="rounded border-brand-gold text-brand-gold focus:ring-brand-gold"
                      />
                      <span>Currently Employed / Self-Employed (Requires NOC & 3M Pay slips)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-brand-paper">
                      <input
                        type="checkbox"
                        checked={newAppForm.sponsored}
                        onChange={(e) => setNewAppForm({ ...newAppForm, sponsored: e.target.checked })}
                        className="rounded border-brand-gold text-brand-gold focus:ring-brand-gold"
                      />
                      <span>Trip is Sponsored by Host / Organization (Requires Sponsor Guarantee)</span>
                    </label>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setApplyStep(2)}
                      className="bg-brand-midnight border border-brand-gold/20 text-brand-paper text-xs font-bold px-4 py-2 rounded transition"
                    >
                      &larr; Back
                    </button>
                    <button
                      onClick={() => setApplyStep(4)}
                      className="bg-brand-gold hover:bg-brand-gold-hover text-brand-midnight text-xs font-bold px-5 py-2 rounded transition flex items-center gap-1"
                    >
                      Next: Fee Review & Submit &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4 Content */}
              {applyStep === 4 && (
                <div className="space-y-4">
                  <div className="bg-brand-midnight p-5 rounded border border-brand-gold/20 space-y-3 text-xs">
                    <h4 className="font-outfit font-bold text-sm text-brand-gold">Application Summary Review</h4>
                    <div className="grid grid-cols-2 gap-2 text-brand-paper/80">
                      <div><span className="text-brand-paper/40">Traveler:</span> {newAppForm.travelerName}</div>
                      <div><span className="text-brand-paper/40">Destination:</span> {newAppForm.destination}</div>
                      <div><span className="text-brand-paper/40">Passport:</span> {newAppForm.passportNumber}</div>
                      <div><span className="text-brand-paper/40">Category:</span> {newAppForm.visaType}</div>
                      <div><span className="text-brand-paper/40">Travel Dates:</span> {newAppForm.travelDates}</div>
                      <div><span className="text-brand-paper/40">Fee Estimate:</span> <span className="font-mono text-brand-gold font-bold">₹{formatINR(newAppForm.fees)}</span></div>
                    </div>
                  </div>

                  {applySuccessId ? (
                    <div className="bg-brand-teal/15 border border-brand-teal p-4 rounded text-center space-y-2">
                      <p className="text-sm font-bold text-brand-teal">Application Submitted Successfully!</p>
                      <p className="text-xs text-brand-paper/80">
                        Generated Reference ID: <span className="font-mono text-brand-gold font-bold">{applySuccessId}</span>
                      </p>
                      <button
                        onClick={() => {
                          setSelectedAppId(applySuccessId);
                          setCustomerTab("applications");
                        }}
                        className="bg-brand-teal text-brand-midnight font-bold text-xs px-4 py-1.5 rounded"
                      >
                        View in My Applications
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between pt-4">
                      <button
                        onClick={() => setApplyStep(3)}
                        className="bg-brand-midnight border border-brand-gold/20 text-brand-paper text-xs font-bold px-4 py-2 rounded transition"
                      >
                        &larr; Back
                      </button>
                      <button
                        onClick={() => {
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
                            verifiedDocs: { passport: "verified", photo: "verified" },
                            checklist: { employed: newAppForm.employed, sponsored: newAppForm.sponsored }
                          });
                          setApplySuccessId(newId);
                        }}
                        className="bg-brand-gold hover:bg-brand-gold-hover text-brand-midnight text-xs font-bold px-6 py-2.5 rounded transition flex items-center gap-1.5"
                      >
                        <Send size={14} />
                        <span>Submit Application & Pay ₹{formatINR(newAppForm.fees)}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 3: MY APPLICATIONS */}
        {/* Sub-items: All Applications, Draft, Submitted, Under Review, Approved, Rejected, Cancelled */}
        {/* ============================================================ */}
        {customerTab === "applications" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-brand-gold/15 pb-4">
              <div>
                <h3 className="font-outfit font-bold text-lg text-brand-gold">My Visa Applications</h3>
                <p className="text-xs text-brand-paper/50">Filter applications by consular state</p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                {[
                  { key: "all", label: "All Applications" },
                  { key: "Draft", label: "Draft" },
                  { key: "Submitted", label: "Submitted" },
                  { key: "Embassy Processing", label: "Under Review" },
                  { key: "Docs Pending", label: "Action Required" },
                  { key: "Approved", label: "Approved" },
                  { key: "Rejected", label: "Rejected" }
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setAppFilter(f.key as any)}
                    className={`px-3 py-1 rounded-full font-semibold transition ${
                      appFilter === f.key
                        ? "bg-brand-gold text-brand-midnight font-bold shadow-md"
                        : "bg-brand-slate text-brand-paper/60 hover:text-brand-paper"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Applications List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredApplications.map((a) => (
                <div
                  key={a.id}
                  className={`bg-brand-slate border p-5 rounded-lg space-y-3 transition ${
                    selectedAppId === a.id ? "border-brand-gold ring-1 ring-brand-gold/30" : "border-brand-gold/15 hover:border-brand-gold/40"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20">
                        {a.id}
                      </span>
                      <h4 className="font-outfit font-bold text-base mt-1 text-brand-paper">{a.travelerName}</h4>
                      <p className="text-xs text-brand-paper/60">{a.destination} &bull; {a.visaType}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase ${
                      a.status === "Approved"
                        ? "bg-brand-teal/20 text-brand-teal border border-brand-teal/30"
                        : a.status === "Rejected"
                        ? "bg-brand-red/20 text-brand-red border border-brand-red/30"
                        : a.status === "Docs Pending"
                        ? "bg-amber-500/20 text-amber-500 border border-amber-500/30 animate-pulse"
                        : "bg-brand-gold/20 text-brand-gold border border-brand-gold/30"
                    }`}>
                      {a.status}
                    </span>
                  </div>

                  <div className="text-xs text-brand-paper/60 space-y-1 border-t border-brand-gold/10 pt-3">
                    <div className="flex justify-between">
                      <span>Passport:</span>
                      <span className="font-mono text-brand-paper">{a.passportNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Travel Dates:</span>
                      <span className="text-brand-paper">{a.travelDates}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Consular Fee:</span>
                      <span className="font-mono text-brand-gold font-bold">₹{formatINR(a.fees)}</span>
                    </div>
                  </div>

                  {a.reason && (
                    <div className="text-[11px] font-mono text-brand-red bg-brand-red/10 p-2.5 rounded border-l-2 border-brand-red">
                      {a.reason}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => {
                        setSelectedAppId(a.id);
                        setCustomerTab("dashboard");
                      }}
                      className="text-xs font-bold text-brand-gold hover:underline flex items-center gap-1"
                    >
                      Track Stepper &rarr;
                    </button>

                    {a.status === "Docs Pending" && (
                      <button
                        onClick={() => {
                          setSelectedAppId(a.id);
                          setCustomerTab("documents");
                        }}
                        className="bg-brand-red hover:bg-brand-red/80 text-white text-[10px] font-bold px-3 py-1 rounded"
                      >
                        Fix Documents
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 4: DOCUMENTS */}
        {/* Sub-items: Upload Documents, My Documents, Verification Status */}
        {/* ============================================================ */}
        {customerTab === "documents" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDocsSubTab("upload")}
                  className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
                    docsSubTab === "upload"
                      ? "bg-brand-gold text-brand-midnight font-bold shadow-md"
                      : "bg-brand-slate text-brand-paper/60 hover:text-brand-paper"
                  }`}
                >
                  Upload Documents
                </button>
                <button
                  onClick={() => setDocsSubTab("my_docs")}
                  className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
                    docsSubTab === "my_docs"
                      ? "bg-brand-gold text-brand-midnight font-bold shadow-md"
                      : "bg-brand-slate text-brand-paper/60 hover:text-brand-paper"
                  }`}
                >
                  My Document Vault
                </button>
                <button
                  onClick={() => setDocsSubTab("verification")}
                  className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
                    docsSubTab === "verification"
                      ? "bg-brand-gold text-brand-midnight font-bold shadow-md"
                      : "bg-brand-slate text-brand-paper/60 hover:text-brand-paper"
                  }`}
                >
                  Verification Status
                </button>
              </div>
            </div>

            {/* Sub-Tab 1: Upload Documents */}
            {docsSubTab === "upload" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-6 max-w-3xl">
                <h3 className="font-outfit font-bold text-lg text-brand-gold">Document Upload & AI Scan Center</h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-brand-paper/70 font-semibold mb-1">Target Application File</label>
                    <select
                      value={selectedAppId}
                      onChange={(e) => setSelectedAppId(e.target.value)}
                      className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-brand-paper"
                    >
                      {applications.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.id} - {a.travelerName} ({a.destination})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-brand-paper/70 font-semibold mb-1">Credential Document Type</label>
                    <select
                      value={docUploadType}
                      onChange={(e) => setDocUploadType(e.target.value as any)}
                      className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-brand-paper"
                    >
                      <option value="passport">Passport Main Bio-Data Page Scan</option>
                      <option value="photo">Passport Specification Photograph (35x45mm)</option>
                      <option value="nocLetter">Employer No-Objection Certificate (NOC)</option>
                      <option value="sponsorLetter">Sponsor Financial Guarantee & Bank Statement</option>
                    </select>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    onClick={() => {
                      setSelectedUploadFile(`scan_${docUploadType}_${Date.now()}.pdf`);
                    }}
                    className="border-2 border-dashed border-brand-gold/30 hover:border-brand-gold p-8 rounded-lg text-center cursor-pointer bg-brand-midnight/40 transition space-y-2"
                  >
                    <Upload className="mx-auto text-brand-gold animate-bounce" size={32} />
                    <p className="text-xs font-bold text-brand-paper">
                      {selectedUploadFile ? selectedUploadFile : "Click to select or drag & drop high-resolution PDF/JPG"}
                    </p>
                    <p className="text-[10px] text-brand-paper/50">Supported: PDF, PNG, JPEG up to 15MB. DPI &gt; 300</p>
                  </div>

                  {selectedUploadFile && (
                    <div className="bg-brand-midnight p-4 rounded border border-brand-gold/20 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-brand-gold" />
                        <div>
                          <p className="font-bold text-brand-paper">{selectedUploadFile}</p>
                          <p className="text-[10px] text-brand-paper/50">Ready for AI OCR & Consular Validation</p>
                        </div>
                      </div>

                      {uploadingDoc ? (
                        <span className="text-xs font-mono text-brand-gold flex items-center gap-1.5 animate-pulse">
                          <RefreshCw className="animate-spin" size={14} /> AI Processing...
                        </span>
                      ) : uploadSuccess ? (
                        <span className="text-xs font-mono text-brand-teal font-bold flex items-center gap-1">
                          <CheckCircle2 size={14} /> Uploaded & Verified!
                        </span>
                      ) : (
                        <button
                          onClick={() => handleReuploadDoc(docUploadType)}
                          className="bg-brand-gold hover:bg-brand-gold-hover text-brand-midnight font-bold text-xs px-4 py-2 rounded"
                        >
                          Confirm & Submit File
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sub-Tab 2: My Documents Vault */}
            {docsSubTab === "my_docs" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "Passport_BioData_Page.pdf", size: "2.4 MB", type: "Passport Scan", date: "2026-07-15", status: "VERIFIED" },
                  { name: "Schengen_Photo_35x45.jpg", size: "1.1 MB", type: "Passport Photo", date: "2026-07-16", status: "VERIFIED" },
                  { name: "Bank_Statement_3M_Certified.pdf", size: "4.8 MB", type: "Financial Proof", date: "2026-07-18", status: "VERIFIED" },
                  { name: "Employer_NOC_Letter.pdf", size: "1.8 MB", type: "NOC Statement", date: "2026-07-20", status: "NEEDS_REVIEW" }
                ].map((doc, idx) => (
                  <div key={idx} className="bg-brand-slate border border-brand-gold/15 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <FileText className="text-brand-gold" size={24} />
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        doc.status === "VERIFIED" ? "bg-brand-teal/20 text-brand-teal" : "bg-brand-red/20 text-brand-red"
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-outfit font-bold text-xs text-brand-paper truncate">{doc.name}</h4>
                      <p className="text-[10px] text-brand-paper/50">{doc.type} &bull; {doc.size}</p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-brand-paper/40 border-t border-brand-gold/10 pt-2">
                      <span>Uploaded: {doc.date}</span>
                      <button className="text-brand-gold font-bold hover:underline">Download</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sub-Tab 3: Verification Status */}
            {docsSubTab === "verification" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4">
                <h3 className="font-outfit font-bold text-base text-brand-gold">AI Consular OCR Verification Matrix</h3>
                <div className="space-y-3 text-xs">
                  <div className="bg-brand-midnight p-3 rounded flex justify-between items-center border border-brand-gold/10">
                    <div>
                      <span className="font-bold text-brand-paper">Machine Readable Zone (MRZ 1 & 2):</span>
                      <span className="text-brand-paper/60 ml-2 font-mono">P&lt;INDSHARMA&lt;&lt;VIBHU&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</span>
                    </div>
                    <span className="text-brand-teal font-mono font-bold">MATCH 100% ✓</span>
                  </div>

                  <div className="bg-brand-midnight p-3 rounded flex justify-between items-center border border-brand-gold/10">
                    <div>
                      <span className="font-bold text-brand-paper">Passport Validity Horizon:</span>
                      <span className="text-brand-paper/60 ml-2">Expires Dec 2033 (&gt; 6 months threshold)</span>
                    </div>
                    <span className="text-brand-teal font-mono font-bold">VALID ✓</span>
                  </div>

                  <div className="bg-brand-midnight p-3 rounded flex justify-between items-center border border-brand-gold/10">
                    <div>
                      <span className="font-bold text-brand-paper">ICAO Photo Biometric Analysis:</span>
                      <span className="text-brand-paper/60 ml-2">Face detection 99.4%, White background clear</span>
                    </div>
                    <span className="text-brand-teal font-mono font-bold">PASS ✓</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 5: PAYMENTS */}
        {/* Sub-items: Make Payment, Payment History, Invoices */}
        {/* ============================================================ */}
        {customerTab === "payments" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPaymentsSubTab("make_payment")}
                  className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
                    paymentsSubTab === "make_payment"
                      ? "bg-brand-gold text-brand-midnight font-bold shadow-md"
                      : "bg-brand-slate text-brand-paper/60 hover:text-brand-paper"
                  }`}
                >
                  Make Payment
                </button>
                <button
                  onClick={() => setPaymentsSubTab("history")}
                  className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
                    paymentsSubTab === "history"
                      ? "bg-brand-gold text-brand-midnight font-bold shadow-md"
                      : "bg-brand-slate text-brand-paper/60 hover:text-brand-paper"
                  }`}
                >
                  Payment History
                </button>
                <button
                  onClick={() => setPaymentsSubTab("invoices")}
                  className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
                    paymentsSubTab === "invoices"
                      ? "bg-brand-gold text-brand-midnight font-bold shadow-md"
                      : "bg-brand-slate text-brand-paper/60 hover:text-brand-paper"
                  }`}
                >
                  Tax Invoices & Receipts
                </button>
              </div>
            </div>

            {/* Sub-Tab 1: Make Payment */}
            {paymentsSubTab === "make_payment" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4">
                  <h3 className="font-outfit font-bold text-base text-brand-gold">Outstanding Fee Summary</h3>
                  <div className="space-y-2 text-xs border-b border-brand-gold/10 pb-4">
                    <div className="flex justify-between">
                      <span className="text-brand-paper/60">Selected Application:</span>
                      <span className="font-mono text-brand-gold font-bold">{app.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-paper/60">Applicant Name:</span>
                      <span className="text-brand-paper">{app.travelerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-paper/60">Visa Category:</span>
                      <span className="text-brand-paper">{app.destination} - {app.visaType}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Consular Embassy Fee:</span>
                      <span className="font-mono">₹12,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VFS Global Biometrics Charge:</span>
                      <span className="font-mono">₹2,800</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Tax / GST (18%):</span>
                      <span className="font-mono">₹885</span>
                    </div>
                    <div className="flex justify-between font-bold text-brand-gold text-sm border-t border-brand-gold/15 pt-2">
                      <span>Total Liquid Payable:</span>
                      <span className="font-mono">₹{formatINR(app.fees)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4">
                  <h3 className="font-outfit font-bold text-base text-brand-gold">Select Payment Method</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`p-3 rounded text-center text-xs font-bold border transition ${
                        paymentMethod === "card" ? "bg-brand-gold/20 border-brand-gold text-brand-gold" : "bg-brand-midnight border-brand-gold/10 text-brand-paper/60"
                      }`}
                    >
                      Credit/Debit Card
                    </button>
                    <button
                      onClick={() => setPaymentMethod("upi")}
                      className={`p-3 rounded text-center text-xs font-bold border transition ${
                        paymentMethod === "upi" ? "bg-brand-gold/20 border-brand-gold text-brand-gold" : "bg-brand-midnight border-brand-gold/10 text-brand-paper/60"
                      }`}
                    >
                      UPI / GPay
                    </button>
                    <button
                      onClick={() => setPaymentMethod("netbanking")}
                      className={`p-3 rounded text-center text-xs font-bold border transition ${
                        paymentMethod === "netbanking" ? "bg-brand-gold/20 border-brand-gold text-brand-gold" : "bg-brand-midnight border-brand-gold/10 text-brand-paper/60"
                      }`}
                    >
                      Net Banking
                    </button>
                  </div>

                  {paymentSuccessMsg ? (
                    <div className="bg-brand-teal/20 border border-brand-teal p-4 rounded text-center text-xs text-brand-teal font-bold space-y-2">
                      <p>{paymentSuccessMsg}</p>
                      <button
                        onClick={() => setPaymentsSubTab("invoices")}
                        className="bg-brand-teal text-brand-midnight px-3 py-1 rounded"
                      >
                        View Tax Invoice
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsProcessingPayment(true);
                        setTimeout(() => {
                          setIsProcessingPayment(false);
                          setPaymentSuccessMsg(`Payment of ₹${formatINR(app.fees)} confirmed! Transaction ID: TXN-${Math.floor(100000 + Math.random() * 900000)}`);
                        }, 1500);
                      }}
                      className="w-full bg-brand-gold hover:bg-brand-gold-hover text-brand-midnight font-bold text-xs py-3 rounded transition flex items-center justify-center gap-2"
                    >
                      {isProcessingPayment ? <RefreshCw className="animate-spin" size={16} /> : <CreditCard size={16} />}
                      <span>Pay ₹{formatINR(app.fees)} Now</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Payment History */}
            {paymentsSubTab === "history" && (
              <div className="bg-brand-slate border border-brand-gold/15 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-midnight text-brand-gold font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Ref ID</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Application</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment Method</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-gold/10">
                    {paymentHistory.map((p) => (
                      <tr key={p.id} className="hover:bg-brand-midnight/40">
                        <td className="p-3 font-mono font-bold text-brand-gold">{p.id}</td>
                        <td className="p-3 text-brand-paper/70">{p.date}</td>
                        <td className="p-3 font-mono text-brand-paper">{p.appId}</td>
                        <td className="p-3 font-mono font-bold text-brand-paper">₹{formatINR(p.amount)}</td>
                        <td className="p-3 text-brand-paper/70">{p.method}</td>
                        <td className="p-3">
                          <span className="bg-brand-teal/20 text-brand-teal font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sub-Tab 3: Invoices */}
            {paymentsSubTab === "invoices" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentHistory.map((inv) => (
                  <div key={inv.id} className="bg-brand-slate border border-brand-gold/15 p-5 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs font-bold text-brand-gold">INV-2026-{inv.id.split("-")[1]}</span>
                      <span className="text-[10px] text-brand-paper/50">{inv.date}</span>
                    </div>
                    <div className="text-xs text-brand-paper/80 space-y-1">
                      <p>Application: <span className="font-mono text-brand-gold">{inv.appId}</span></p>
                      <p>Amount Billed: <span className="font-mono font-bold text-brand-paper">₹{formatINR(inv.amount)}</span></p>
                      <p>GSTIN: <span className="font-mono text-brand-paper/60">07AAAAA0000A1Z5</span></p>
                    </div>
                    <div className="border-t border-brand-gold/10 pt-3 flex justify-between items-center">
                      <span className="text-[10px] text-brand-teal font-mono">GST 18% INCLUDED</span>
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="bg-brand-gold/15 hover:bg-brand-gold/30 border border-brand-gold/30 text-brand-gold text-xs font-bold px-3 py-1 rounded transition flex items-center gap-1"
                      >
                        <Eye size={12} /> View Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 6: APPOINTMENTS */}
        {/* Schedule & view appointments */}
        {/* ============================================================ */}
        {customerTab === "appointments" && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-6">
              <h3 className="font-outfit font-bold text-lg text-brand-gold">Schedule Embassy Biometrics Appointment</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-brand-paper/70 font-semibold mb-1">Consular VFS Center Location</label>
                  <select
                    value={selectedCenter}
                    onChange={(e) => setSelectedCenter(e.target.value)}
                    className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-brand-paper outline-none focus:border-brand-gold"
                  >
                    <option value="VFS Global Center - New Delhi (Connaught Place)">VFS Global Center - New Delhi (Connaught Place)</option>
                    <option value="VFS Global Center - Mumbai (BKC)">VFS Global Center - Mumbai (BKC)</option>
                    <option value="VFS Global Center - London Victoria">VFS Global Center - London Victoria</option>
                    <option value="Consulate General of Germany - Frankfurt">Consulate General of Germany - Frankfurt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-brand-paper/70 font-semibold mb-1">Appointment Date</label>
                  <input
                    type="date"
                    value={selectedApptDate}
                    onChange={(e) => setSelectedApptDate(e.target.value)}
                    className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-brand-paper outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-paper/70 mb-2">Available Time Slots</label>
                <div className="grid grid-cols-4 gap-2">
                  {["09:00 AM", "10:30 AM", "01:15 PM", "03:45 PM"].map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedApptTime(slot)}
                      className={`p-2 text-xs font-mono font-bold rounded border transition ${
                        selectedApptTime === slot
                          ? "bg-brand-gold/20 border-brand-gold text-brand-gold"
                          : "bg-brand-midnight border-brand-gold/10 text-brand-paper/60"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {apptSuccess ? (
                <div className="bg-brand-teal/20 border border-brand-teal p-4 rounded text-center text-xs text-brand-teal font-bold">
                  Appointment reserved for {selectedApptDate} at {selectedApptTime}!
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAppointmentsList([
                      ...appointmentsList,
                      {
                        id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
                        appId: app.id,
                        traveler: app.travelerName,
                        center: selectedCenter,
                        date: selectedApptDate,
                        time: selectedApptTime,
                        status: "CONFIRMED",
                        type: "Biometrics & Original Docs"
                      }
                    ]);
                    setApptSuccess(true);
                  }}
                  className="bg-brand-gold hover:bg-brand-gold-hover text-brand-midnight font-bold text-xs px-6 py-2 rounded"
                >
                  Confirm Appointment Booking
                </button>
              )}
            </div>

            {/* Confirmed Appointments list */}
            <div className="space-y-4">
              <h4 className="font-outfit font-bold text-sm text-brand-gold uppercase tracking-wider">Booked Appointment Passes</h4>
              {appointmentsList.map((apt) => (
                <div key={apt.id} className="bg-brand-slate border border-brand-gold/15 p-5 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand-gold">{apt.id}</span>
                      <span className="bg-brand-teal/20 text-brand-teal font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                        {apt.status}
                      </span>
                    </div>
                    <p className="font-outfit font-bold text-sm text-brand-paper mt-1">{apt.traveler} &bull; {apt.appId}</p>
                    <p className="text-xs text-brand-paper/60">{apt.center}</p>
                    <p className="text-xs font-mono text-brand-gold mt-1">{apt.date} at {apt.time}</p>
                  </div>
                  <button className="bg-brand-gold/15 border border-brand-gold/30 text-brand-gold hover:bg-brand-gold/30 text-xs font-bold px-3 py-1.5 rounded transition">
                    Download Pass (PDF)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 7: MESSAGES / AI CONSULAR CHAT */}
        {/* ============================================================ */}
        {customerTab === "messages" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[600px] h-full">
            <div className="lg:col-span-2 bg-brand-slate border border-brand-gold/15 rounded-lg flex flex-col overflow-hidden">
              <div className="bg-brand-midnight/80 p-4 border-b border-brand-gold/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-teal animate-pulse" />
                  <div>
                    <h4 className="font-outfit font-bold text-sm">Consular AI Assistant & Support Chat</h4>
                    <p className="text-[10px] text-brand-paper/50">Schengen & UK Consular Codebooks Loaded</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[300px]">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}>
                    <div className={`p-3 rounded-lg text-xs leading-normal ${
                      msg.sender === "user"
                        ? "bg-brand-gold text-brand-midnight rounded-br-none font-medium"
                        : "bg-brand-midnight border border-brand-gold/10 text-brand-paper/95 rounded-bl-none"
                    }`}>
                      {msg.text}
                    </div>
                    {msg.source && (
                      <span className="text-[8px] bg-brand-gold/10 text-brand-gold font-mono px-1 rounded mt-1">
                        Source: {msg.source}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-3 bg-brand-midnight/40 border-t border-brand-gold/10 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question about visa rules..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-brand-midnight border border-brand-gold/15 rounded px-3 py-2 text-xs text-brand-paper outline-none focus:border-brand-gold"
                />
                <button type="submit" className="bg-brand-gold hover:bg-brand-gold-hover text-brand-midnight px-4 rounded font-bold text-xs">
                  Send
                </button>
              </form>
            </div>

            {/* Quick Questions Sidebar */}
            <div className="bg-brand-slate border border-brand-gold/15 p-5 rounded-lg space-y-4">
              <h4 className="font-outfit font-bold text-sm text-brand-gold">Frequent Inquiries</h4>
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => handleCannedClick("Schengen passport validity rules?")}
                  className="w-full text-left p-2.5 bg-brand-midnight hover:bg-brand-gold/10 rounded border border-brand-gold/10 text-brand-paper/80"
                >
                  Schengen Passport 3-Month Rule?
                </button>
                <button
                  onClick={() => handleCannedClick("Germany Visa financial criteria?")}
                  className="w-full text-left p-2.5 bg-brand-midnight hover:bg-brand-gold/10 rounded border border-brand-gold/10 text-brand-paper/80"
                >
                  German Embassy Bank Balance Requirement?
                </button>
                <button
                  onClick={() => handleCannedClick("Layover in London DATV requirements?")}
                  className="w-full text-left p-2.5 bg-brand-midnight hover:bg-brand-gold/10 rounded border border-brand-gold/10 text-brand-paper/80"
                >
                  UK Direct Airside Transit (DATV) Exemption?
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 8: NOTIFICATIONS */}
        {/* ============================================================ */}
        {customerTab === "notifications" && (
          <div className="space-y-4 max-w-4xl">
            <div className="flex justify-between items-center">
              <h3 className="font-outfit font-bold text-lg text-brand-gold">Notification Center</h3>
              <button
                onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}
                className="text-xs text-brand-gold font-bold hover:underline"
              >
                Mark all as read
              </button>
            </div>

            <div className="space-y-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-lg border flex justify-between items-start transition ${
                    n.read ? "bg-brand-slate border-brand-gold/10" : "bg-brand-midnight border-brand-gold/40 shadow-md"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-brand-paper">{n.title}</span>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />}
                    </div>
                    <p className="text-xs text-brand-paper/60">{n.desc}</p>
                  </div>
                  <span className="text-[10px] font-mono text-brand-paper/40">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 9: EXPLORE VISAS */}
        {/* Sub-items: Countries, Visa Types, Visa Requirements, Processing Time, Visa Fees */}
        {/* ============================================================ */}
        {customerTab === "explore" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { key: "countries", label: "Countries" },
                  { key: "types", label: "Visa Types" },
                  { key: "requirements", label: "Visa Requirements" },
                  { key: "processing", label: "Processing Time" },
                  { key: "fees", label: "Visa Fees" }
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setExploreSubTab(st.key as any)}
                    className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
                      exploreSubTab === st.key
                        ? "bg-brand-gold text-brand-midnight font-bold shadow-md"
                        : "bg-brand-slate text-brand-paper/60 hover:text-brand-paper"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Countries Catalog */}
            {exploreSubTab === "countries" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { country: "Germany", code: "DE", zone: "Schengen", fee: "€90 / ₹13,280", sla: "5-10 Days", desc: "Short stay C tourist & business visa" },
                  { country: "France", code: "FR", zone: "Schengen", fee: "€90 / ₹13,280", sla: "5-7 Days", desc: "Tourist, cultural & convention visa" },
                  { country: "United Kingdom", code: "GB", zone: "UK Visas", fee: "£115 / ₹16,185", sla: "10-15 Days", desc: "Standard 6-month visitor visa" },
                  { country: "Canada", code: "CA", zone: "IRCC", fee: "$185 / ₹23,240", sla: "15-20 Days", desc: "Biometric visitor & study permits" },
                  { country: "Japan", code: "JP", zone: "eVisa", fee: "¥3,000 / ₹7,885", sla: "4-5 Days", desc: "Short-term eVisa for tourism" },
                  { country: "United States", code: "US", zone: "DS-160", fee: "$185 / ₹16,500", sla: "Interview Req.", desc: "B1/B2 tourist & business visa" }
                ].map((c) => (
                  <div key={c.country} className="bg-brand-slate border border-brand-gold/15 p-5 rounded-lg space-y-3 hover:border-brand-gold transition">
                    <div className="flex justify-between items-center">
                      <h4 className="font-outfit font-bold text-base text-brand-paper">{c.country}</h4>
                      <span className="font-mono text-[10px] font-bold bg-brand-gold/15 text-brand-gold px-2 py-0.5 rounded">
                        {c.zone}
                      </span>
                    </div>
                    <p className="text-xs text-brand-paper/60">{c.desc}</p>
                    <div className="text-xs font-mono space-y-1 border-t border-brand-gold/10 pt-2">
                      <div className="flex justify-between"><span className="text-brand-paper/40">Consular Fee:</span><span className="text-brand-gold font-bold">{c.fee}</span></div>
                      <div className="flex justify-between"><span className="text-brand-paper/40">Standard SLA:</span><span className="text-brand-teal">{c.sla}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Visa Types */}
            {exploreSubTab === "types" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-brand-slate border border-brand-gold/15 p-5 rounded-lg space-y-2">
                  <h4 className="font-outfit font-bold text-sm text-brand-gold">Schengen Type C (Tourist)</h4>
                  <p className="text-brand-paper/70">Allows entry into 29 Schengen member states for up to 90 days within any 180-day period.</p>
                </div>
                <div className="bg-brand-slate border border-brand-gold/15 p-5 rounded-lg space-y-2">
                  <h4 className="font-outfit font-bold text-sm text-brand-gold">Standard UK Visitor</h4>
                  <p className="text-brand-paper/70">Covers leisure, business meetings, and short courses up to 6 months in England, Scotland, Wales, and Northern Ireland.</p>
                </div>
              </div>
            )}

            {/* Requirements & SLAs */}
            {exploreSubTab === "requirements" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs">
                <h4 className="font-outfit font-bold text-base text-brand-gold">Standard Document Checklist</h4>
                <ul className="list-disc pl-5 space-y-1 text-brand-paper/80">
                  <li>Original Passport valid for minimum 6 months from travel date with 2 blank pages.</li>
                  <li>Recent biometric photograph (35x45mm, white background, 80% face coverage).</li>
                  <li>Certified 3-6 months bank statements with official branch seal & signature.</li>
                  <li>Confirmed flight itinerary & hotel accommodation booking.</li>
                  <li>Employment NOC or Business Incorporation Certificate.</li>
                </ul>
              </div>
            )}

            {exploreSubTab === "processing" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs">
                <h4 className="font-outfit font-bold text-base text-brand-gold">Embassy SLA Processing Matrix</h4>
                <p className="text-brand-paper/60">Standard processing timelines from date of biometrics submission.</p>
              </div>
            )}

            {exploreSubTab === "fees" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs">
                <h4 className="font-outfit font-bold text-base text-brand-gold">Fee Structure Breakdown</h4>
                <p className="text-brand-paper/60">Transparent pricing for consular fees, biometric charges, and service handling.</p>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 10: SUPPORT */}
        {/* ============================================================ */}
        {customerTab === "support" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4">
              <h3 className="font-outfit font-bold text-base text-brand-gold">Submit a Consular Support Ticket</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setTicketSubmitted(true);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block text-brand-paper/70 font-semibold mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Passport collection inquiry"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-brand-paper"
                  />
                </div>

                <div>
                  <label className="block text-brand-paper/70 font-semibold mb-1">Category</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-brand-paper"
                  >
                    <option value="Document Query">Document Rectification Query</option>
                    <option value="Biometrics Slot">Biometrics / Appointment Slot</option>
                    <option value="Fee Payment">Payment & Refund</option>
                  </select>
                </div>

                <div>
                  <label className="block text-brand-paper/70 font-semibold mb-1">Message Description</label>
                  <textarea
                    rows={4}
                    required
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-brand-paper"
                  />
                </div>

                {ticketSubmitted ? (
                  <div className="p-3 bg-brand-teal/20 border border-brand-teal text-brand-teal font-bold rounded text-center">
                    Ticket #TCK-9812 created! A consular desk officer will respond within 2 hours.
                  </div>
                ) : (
                  <button type="submit" className="bg-brand-gold hover:bg-brand-gold-hover text-brand-midnight font-bold text-xs px-5 py-2 rounded">
                    Submit Support Ticket
                  </button>
                )}
              </form>
            </div>

            <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4">
              <h3 className="font-outfit font-bold text-base text-brand-gold">Emergency Helpline & Contacts</h3>
              <div className="space-y-3 text-xs text-brand-paper/80">
                <div className="flex items-center gap-2">
                  <PhoneCall size={16} className="text-brand-gold" />
                  <span>Consular Helpline: +91 (11) 4000-8800</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-brand-gold" />
                  <span>Support Email: support@phantomvisa.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-brand-teal" />
                  <span>Desk Operating Hours: 08:00 AM - 20:00 PM IST</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 11: MY PROFILE */}
        {/* ============================================================ */}
        {customerTab === "profile" && (
          <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-6 max-w-3xl">
            <h3 className="font-outfit font-bold text-lg text-brand-gold">Applicant Profile & Credentials Vault</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-brand-paper/70 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-brand-paper"
                />
              </div>

              <div>
                <label className="block text-brand-paper/70 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-brand-paper"
                />
              </div>

              <div>
                <label className="block text-brand-paper/70 font-semibold mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-brand-paper"
                />
              </div>

              <div>
                <label className="block text-brand-paper/70 font-semibold mb-1">Passport Number</label>
                <input
                  type="text"
                  value={profileData.passportNumber}
                  onChange={(e) => setProfileData({ ...profileData, passportNumber: e.target.value })}
                  className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-brand-paper font-mono"
                />
              </div>
            </div>

            {profileSaveSuccess ? (
              <div className="p-3 bg-brand-teal/20 border border-brand-teal text-brand-teal font-bold rounded text-xs text-center">
                Profile updated & synced across consular nodes!
              </div>
            ) : (
              <button
                onClick={() => {
                  setProfileSaveSuccess(true);
                  setTimeout(() => setProfileSaveSuccess(false), 3000);
                }}
                className="bg-brand-gold hover:bg-brand-gold-hover text-brand-midnight font-bold text-xs px-5 py-2 rounded"
              >
                Save Profile Updates
              </button>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 12: SETTINGS */}
        {/* ============================================================ */}
        {customerTab === "settings" && (
          <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-6 max-w-3xl">
            <h3 className="font-outfit font-bold text-lg text-brand-gold">Account & System Preferences</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-brand-gold/10 pb-3">
                <div>
                  <p className="font-bold text-brand-paper">Email Notifications</p>
                  <p className="text-brand-paper/50">Receive embassy status updates via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={settingsData.emailAlerts}
                  onChange={(e) => setSettingsData({ ...settingsData, emailAlerts: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-gold"
                />
              </div>

              <div className="flex items-center justify-between border-b border-brand-gold/10 pb-3">
                <div>
                  <p className="font-bold text-brand-paper">WhatsApp & SMS Instant Alerts</p>
                  <p className="text-brand-paper/50">Receive real-time document rectification alerts</p>
                </div>
                <input
                  type="checkbox"
                  checked={settingsData.whatsAppUpdates}
                  onChange={(e) => setSettingsData({ ...settingsData, whatsAppUpdates: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-gold"
                />
              </div>

              <div className="flex items-center justify-between border-b border-brand-gold/10 pb-3">
                <div>
                  <p className="font-bold text-brand-paper">Two-Factor Authentication (2FA)</p>
                  <p className="text-brand-paper/50">Require SMS/TOTP code during portal login</p>
                </div>
                <input
                  type="checkbox"
                  checked={settingsData.twoFactorAuth}
                  onChange={(e) => setSettingsData({ ...settingsData, twoFactorAuth: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-gold"
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ============================================================ */}
      {/* INVOICE PREVIEW MODAL */}
      {/* ============================================================ */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-brand-slate border border-brand-gold/30 p-6 rounded-lg max-w-lg w-full space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-brand-gold/15 pb-3">
              <span className="font-outfit font-bold text-base text-brand-gold">TAX INVOICE / RECEIPT</span>
              <button onClick={() => setSelectedInvoice(null)} className="text-brand-paper/50 hover:text-brand-paper">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <p>Receipt Reference: <span className="font-mono text-brand-gold">{selectedInvoice.id}</span></p>
              <p>Billed To: <span className="text-brand-paper">Vibhu Sharma</span></p>
              <p>Application ID: <span className="font-mono text-brand-paper">{selectedInvoice.appId}</span></p>
              <p>Date of Transaction: <span className="text-brand-paper">{selectedInvoice.date}</span></p>
              <p>Payment Method: <span className="text-brand-paper">{selectedInvoice.method}</span></p>
              <div className="border-t border-brand-gold/15 pt-2 flex justify-between font-bold text-sm text-brand-gold font-mono">
                <span>Amount Paid:</span>
                <span>₹{formatINR(selectedInvoice.amount)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="bg-brand-gold text-brand-midnight font-bold text-xs px-4 py-1.5 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-brand-slate border border-brand-gold/30 p-6 rounded-lg max-w-md w-full space-y-4 text-xs text-center">
            <h3 className="font-outfit font-bold text-lg text-brand-gold">Log Out of Applicant Portal?</h3>
            <p className="text-brand-paper/60">Are you sure you want to log out of your active customer session?</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-brand-midnight border border-brand-gold/20 text-brand-paper font-bold px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  setRole("Agent");
                }}
                className="bg-brand-red text-white font-bold px-4 py-2 rounded"
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
