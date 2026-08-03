"use client";

import React, { useState } from "react";
import { useVisa, Application, VisaStatus, formatINR, AgentTab } from "../context/VisaContext";
import MRZStrip from "./MRZStrip";
import {
  Wallet,
  FileText,
  AlertCircle,
  TrendingUp,
  Search,
  CheckCircle2,
  Upload,
  ArrowRight,
  Plus,
  Coins,
  RefreshCw,
  Eye,
  Check,
  Building,
  User,
  MapPin,
  Calendar,
  AlertTriangle,
  LayoutDashboard,
  ClipboardList,
  Users,
  FileCheck,
  CreditCard,
  MessageSquare,
  Bell,
  BarChart3,
  LifeBuoy,
  Settings,
  LogOut,
  Clock,
  ChevronRight,
  Download,
  ShieldCheck,
  X,
  Send,
  HelpCircle,
  Filter,
  DollarSign,
  PhoneCall,
  Mail,
  Zap,
  CheckSquare,
  Layers,
  Sparkles
} from "lucide-react";

export default function AgentPortal() {
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

  // Active sub-tab states matching the screenshot sub-sections
  // 1. Dashboard: 'overview' | 'today' | 'pending_tasks'
  const [dashSubTab, setDashSubTab] = useState<"overview" | "today" | "pending_tasks">("overview");

  // 2. Visa Applications: 'all' | 'Draft' | 'Submitted' | 'Embassy Processing' | 'Approved' | 'Rejected' | 'Docs Pending'
  const [appFilter, setAppFilter] = useState<
    "all" | "Draft" | "Submitted" | "Embassy Processing" | "Approved" | "Rejected" | "Docs Pending"
  >("all");
  const [searchAppQuery, setSearchAppQuery] = useState("");

  // 3. Applicants: 'list' | 'details'
  const [applicantSubTab, setApplicantSubTab] = useState<"list" | "details">("list");
  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);

  // 4. Document Verification: 'pending' | 'verified' | 'additional'
  const [docVerifSubTab, setDocVerifSubTab] = useState<"pending" | "verified" | "additional">("pending");

  // 5. Payments: 'verification' | 'transactions' | 'invoices'
  const [paymentSubTab, setPaymentSubTab] = useState<"verification" | "transactions" | "invoices">("verification");

  // 9. Reports: 'daily' | 'monthly' | 'performance'
  const [reportSubTab, setReportSubTab] = useState<"daily" | "monthly" | "performance">("daily");

  // Interactive Modals
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState("415000");
  const [payoutAmount, setPayoutAmount] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // ----------------------------------------------------
  // SEARCH & WIZARD SUB-STATES
  // ----------------------------------------------------
  const [searchDest, setSearchDest] = useState("Germany");
  const [searchNational, setSearchNational] = useState("India");
  const [searchType, setSearchType] = useState("Tourist");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    destination: string;
    visaType: string;
    price: number;
    processingTime: string;
    entry: string;
    aiRecommend?: string;
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
  const [ocrCompleted, setOcrCompleted] = useState(false);
  const [fieldsConfirmed, setFieldsConfirmed] = useState({
    name: false,
    dob: false,
    passportNumber: false,
    passportExpiry: false
  });

  const [docUploadState, setDocUploadState] = useState<Record<string, "idle" | "uploading" | "verifying" | "done" | "needs_review">>({
    passport: "idle",
    photo: "idle",
    nocLetter: "idle",
    sponsorLetter: "idle"
  });

  const mockVisaProducts = [
    {
      id: "PROD-DE-01",
      destination: "Germany",
      visaType: "Schengen Tourist",
      price: 13280,
      processingTime: "5-7 Working Days",
      entry: "Multiple Entry",
      aiRecommend: "Fastest route (98.4% success) based on Germany's recent high B2B agent acceptance rate."
    },
    {
      id: "PROD-DE-02",
      destination: "Germany",
      visaType: "Schengen Business",
      price: 17430,
      processingTime: "4-5 Working Days",
      entry: "Single Entry",
      aiRecommend: "Top pick if business invite letter is notarized; bypasses queue filters."
    },
    {
      id: "PROD-FR-01",
      destination: "France",
      visaType: "Schengen Tourist",
      price: 12865,
      processingTime: "10-12 Working Days",
      entry: "Single Entry"
    }
  ];

  const simulatePassportOCR = () => {
    setOcrScanning(true);
    setOcrCompleted(false);
    setTimeout(() => {
      setOcrScanning(false);
      setOcrCompleted(true);
      setTravelerName("AARAV SHARMA");
      setDob("1991-08-14");
      setPassportNumber("Z5592817");
      setPassportExpiry("2035-12-10");
      setDocUploadState((prev) => ({ ...prev, passport: "done" }));
      triggerToast("Passport scanned! AI parsed fields automatically.");
    }, 1800);
  };

  const handleDocUploadSim = (docKey: "photo" | "nocLetter" | "sponsorLetter") => {
    setDocUploadState((prev) => ({ ...prev, [docKey]: "uploading" }));
    setTimeout(() => {
      setDocUploadState((prev) => ({ ...prev, [docKey]: "verifying" }));
      setTimeout(() => {
        if (docKey === "sponsorLetter") {
          setDocUploadState((prev) => ({ ...prev, [docKey]: "needs_review" }));
          triggerToast("Sponsor letter verified: Action required (Missing seal)");
        } else {
          setDocUploadState((prev) => ({ ...prev, [docKey]: "done" }));
          triggerToast(`${docKey === "photo" ? "Travel Photo" : "NOC Letter"} verified successfully!`);
        }
      }, 1200);
    }, 1000);
  };

  const handleSubmitVisaApplication = () => {
    if (walletBalance < (selectedProduct?.price || 13280)) {
      triggerToast("Insufficient wallet balance. Please add funds.");
      return;
    }

    const appDocs: Record<string, "verified" | "needs_review" | "pending" | "uploading"> = {
      passport: "verified",
      photo: docUploadState.photo === "done" ? "verified" : "pending"
    };

    if (isEmployed) appDocs.nocLetter = docUploadState.nocLetter === "done" ? "verified" : "pending";
    if (isSponsored) appDocs.sponsorLetter = docUploadState.sponsorLetter === "needs_review" ? "needs_review" : "verified";

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
      verifiedDocs: appDocs as any,
      checklist: { employed: isEmployed, sponsored: isSponsored }
    });

    triggerToast(`Application ${newId} submitted into embassy queue! Fee deducted.`);
    setAgentTab("applications");
  };

  // Mock Applicants List
  const applicantsList = [
    { id: "APP-01", name: "Sophia Martinez", nationality: "United States", passport: "US8829102", email: "sophia.m@gmail.com", activeVisas: 1, lastApp: "PV-2026-0041" },
    { id: "APP-02", name: "Liam Chen", nationality: "China", passport: "CN9928172", email: "liam.chen@techasia.cn", activeVisas: 1, lastApp: "PV-2026-0042" },
    { id: "APP-03", name: "Amara Okafor", nationality: "Nigeria", passport: "NG1182736", email: "amara.o@lagos.org", activeVisas: 1, lastApp: "PV-2026-0043" },
    { id: "APP-04", name: "Yusuf Al-Farsi", nationality: "United Arab Emirates", passport: "AE8827361", email: "yusuf.alfarsi@dubai.ae", activeVisas: 1, lastApp: "PV-2026-0044" },
    { id: "APP-05", name: "Emma Watson", nationality: "United Kingdom", passport: "GB7728391", email: "emma.watson@london.uk", activeVisas: 1, lastApp: "PV-2026-0045" }
  ];

  // Filtered Applications
  const filteredApps = applications.filter((a) => {
    const matchesSearch =
      a.id.toLowerCase().includes(searchAppQuery.toLowerCase()) ||
      a.travelerName.toLowerCase().includes(searchAppQuery.toLowerCase()) ||
      a.destination.toLowerCase().includes(searchAppQuery.toLowerCase());
    if (appFilter === "all") return matchesSearch;
    return matchesSearch && a.status === appFilter;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-brand-midnight text-brand-paper overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-brand-gold text-brand-midnight font-bold text-xs px-4 py-2.5 rounded shadow-xl border border-white/20 animate-fade-in flex items-center gap-2">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER SUB-NAV */}
      <div className="bg-brand-slate border-b border-brand-gold/15 px-6 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold text-sm">
            {agentTab === "dashboard" && <LayoutDashboard size={18} />}
            {agentTab === "applications" && <ClipboardList size={18} />}
            {agentTab === "applicants" && <Users size={18} />}
            {agentTab === "doc_verification" && <FileCheck size={18} />}
            {agentTab === "payments" && <CreditCard size={18} />}
            {agentTab === "appointments" && <Calendar size={18} />}
            {agentTab === "messages" && <MessageSquare size={18} />}
            {agentTab === "notifications" && <Bell size={18} />}
            {agentTab === "reports" && <BarChart3 size={18} />}
            {agentTab === "support" && <LifeBuoy size={18} />}
            {agentTab === "profile" && <User size={18} />}
            {agentTab === "settings" && <Settings size={18} />}
            {agentTab === "search" && <Search size={18} />}
            {agentTab === "wizard" && <Plus size={18} />}
            {agentTab === "wallet" && <Wallet size={18} />}
            {agentTab === "crm" && <TrendingUp size={18} />}
          </div>
          <div>
            <h2 className="font-outfit font-bold text-base text-brand-paper capitalize">
              Agent Portal &mdash; {agentTab.replace("_", " ")}
            </h2>
            <p className="text-[10px] text-brand-paper/50">
              Agency License: <span className="font-mono text-brand-gold">AG-2026-8819</span> &bull; Rev Share: Tier 1 Platinum (30%)
            </p>
          </div>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setAgentTab("wizard")}
            className="bg-brand-gold hover:bg-brand-gold-hover text-brand-midnight font-bold text-xs px-3 py-1.5 rounded transition flex items-center gap-1.5 shadow-md shadow-brand-gold/10"
          >
            <Plus size={14} />
            <span>New Application</span>
          </button>
          <button
            onClick={() => setAgentTab("search")}
            className="bg-brand-midnight hover:bg-brand-slate border border-brand-gold/20 text-brand-gold font-bold text-xs px-3 py-1.5 rounded transition flex items-center gap-1.5"
          >
            <Search size={14} />
            <span>Search Visas</span>
          </button>
          <button
            onClick={() => setShowAddFundsModal(true)}
            className="bg-brand-teal/20 hover:bg-brand-teal/30 border border-brand-teal/40 text-brand-teal font-mono font-bold text-xs px-3 py-1.5 rounded transition flex items-center gap-1"
          >
            <Coins size={14} />
            <span>Top Up Wallet</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* ============================================================ */}
        {/* SECTION 1: DASHBOARD (Overview, Today's Applications, Pending Tasks) */}
        {/* ============================================================ */}
        {agentTab === "dashboard" && (
          <div className="space-y-6">
            {/* Sub-tabs header */}
            <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
              <div className="flex items-center gap-3">
                {[
                  { key: "overview", label: "Overview" },
                  { key: "today", label: "Today's Applications" },
                  { key: "pending_tasks", label: "Pending Tasks" }
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setDashSubTab(st.key as any)}
                    className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
                      dashSubTab === st.key
                        ? "bg-brand-gold text-brand-midnight font-bold shadow-md shadow-brand-gold/10"
                        : "bg-brand-slate text-brand-paper/60 hover:text-brand-paper"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {dashSubTab === "overview" && (
              <div className="space-y-6">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-brand-slate border border-brand-gold/15 p-5 rounded-lg space-y-1">
                    <div className="flex justify-between items-center text-brand-paper/50">
                      <span className="text-xs font-medium uppercase tracking-wider">Ledger Balance</span>
                      <Wallet size={18} className="text-brand-gold" />
                    </div>
                    <p className="font-outfit text-2xl font-bold text-brand-gold font-mono" suppressHydrationWarning>
                      ₹{formatINR(walletBalance)}
                    </p>
                    <p className="text-[10px] text-brand-teal">Cleared for immediate liquidation</p>
                  </div>

                  <div className="bg-brand-slate border border-brand-gold/15 p-5 rounded-lg space-y-1">
                    <div className="flex justify-between items-center text-brand-paper/50">
                      <span className="text-xs font-medium uppercase tracking-wider">Active Queue</span>
                      <ClipboardList size={18} className="text-brand-paper" />
                    </div>
                    <p className="font-outfit text-2xl font-bold text-brand-paper">
                      {applications.length} Files
                    </p>
                    <p className="text-[10px] text-brand-paper/50">Applications in system</p>
                  </div>

                  <div className="bg-brand-slate border border-brand-gold/15 p-5 rounded-lg space-y-1">
                    <div className="flex justify-between items-center text-brand-paper/50">
                      <span className="text-xs font-medium uppercase tracking-wider">Pending Action</span>
                      <AlertCircle size={18} className="text-brand-red" />
                    </div>
                    <p className="font-outfit text-2xl font-bold text-brand-red">
                      {applications.filter((a) => a.status === "Docs Pending").length}
                    </p>
                    <p className="text-[10px] text-brand-paper/50">Doc rectifications requested</p>
                  </div>

                  <div className="bg-brand-slate border border-brand-gold/15 p-5 rounded-lg space-y-1">
                    <div className="flex justify-between items-center text-brand-paper/50">
                      <span className="text-xs font-medium uppercase tracking-wider">Accrued Commission</span>
                      <Coins size={18} className="text-brand-gold" />
                    </div>
                    <p className="font-outfit text-2xl font-bold text-brand-paper font-mono" suppressHydrationWarning>
                      ₹{formatINR(commissions.reduce((acc, c) => acc + (c.status === "pending" ? c.amount : 0), 0))}
                    </p>
                    <p className="text-[10px] text-brand-teal">Pending payout</p>
                  </div>
                </div>

                {/* Quick Action Navigation Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <button
                    onClick={() => setAgentTab("wizard")}
                    className="p-4 bg-brand-slate border border-brand-gold/15 hover:border-brand-gold rounded-lg flex flex-col items-center text-center space-y-2 transition group"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-gold/10 group-hover:bg-brand-gold text-brand-gold group-hover:text-brand-midnight flex items-center justify-center transition">
                      <Plus size={20} />
                    </div>
                    <span className="text-xs font-bold text-brand-paper">New Visa Wizard</span>
                    <span className="text-[10px] text-brand-paper/50">4-step OCR scan application</span>
                  </button>

                  <button
                    onClick={() => setAgentTab("doc_verification")}
                    className="p-4 bg-brand-slate border border-brand-gold/15 hover:border-brand-gold rounded-lg flex flex-col items-center text-center space-y-2 transition group"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-gold/10 group-hover:bg-brand-gold text-brand-gold group-hover:text-brand-midnight flex items-center justify-center transition">
                      <FileCheck size={20} />
                    </div>
                    <span className="text-xs font-bold text-brand-paper">Document Verification</span>
                    <span className="text-[10px] text-brand-paper/50">Pass/Fail AI document checks</span>
                  </button>

                  <button
                    onClick={() => setAgentTab("payments")}
                    className="p-4 bg-brand-slate border border-brand-gold/15 hover:border-brand-gold rounded-lg flex flex-col items-center text-center space-y-2 transition group"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-gold/10 group-hover:bg-brand-gold text-brand-gold group-hover:text-brand-midnight flex items-center justify-center transition">
                      <CreditCard size={20} />
                    </div>
                    <span className="text-xs font-bold text-brand-paper">Payments & Wallet</span>
                    <span className="text-[10px] text-brand-paper/50">Top up & verify transactions</span>
                  </button>

                  <button
                    onClick={() => setAgentTab("reports")}
                    className="p-4 bg-brand-slate border border-brand-gold/15 hover:border-brand-gold rounded-lg flex flex-col items-center text-center space-y-2 transition group"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-gold/10 group-hover:bg-brand-gold text-brand-gold group-hover:text-brand-midnight flex items-center justify-center transition">
                      <BarChart3 size={20} />
                    </div>
                    <span className="text-xs font-bold text-brand-paper">Performance Reports</span>
                    <span className="text-[10px] text-brand-paper/50">Daily & Monthly revenue analytics</span>
                  </button>
                </div>

                {/* Applications Table Summary */}
                <div className="bg-brand-slate border border-brand-gold/15 rounded-lg overflow-hidden space-y-3 p-4">
                  <h3 className="font-outfit font-bold text-sm text-brand-gold uppercase tracking-wider">
                    Recent Consular Submissions Queue
                  </h3>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-brand-midnight text-brand-gold font-mono uppercase text-[10px]">
                      <tr>
                        <th className="p-3">File ID</th>
                        <th className="p-3">Traveler</th>
                        <th className="p-3">Destination</th>
                        <th className="p-3">Passport #</th>
                        <th className="p-3">Fee</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-gold/10">
                      {applications.slice(0, 5).map((a) => (
                        <tr key={a.id} className="hover:bg-brand-midnight/40">
                          <td className="p-3 font-mono font-bold text-brand-gold">{a.id}</td>
                          <td className="p-3 font-bold text-brand-paper">{a.travelerName}</td>
                          <td className="p-3 text-brand-paper/80">{a.destination}</td>
                          <td className="p-3 font-mono text-brand-paper/70">{a.passportNumber}</td>
                          <td className="p-3 font-mono font-bold text-brand-paper">₹{formatINR(a.fees)}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase ${
                              a.status === "Approved"
                                ? "bg-brand-teal/20 text-brand-teal"
                                : a.status === "Rejected"
                                ? "bg-brand-red/20 text-brand-red"
                                : a.status === "Docs Pending"
                                ? "bg-amber-500/20 text-amber-500"
                                : "bg-brand-gold/20 text-brand-gold"
                            }`}>
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {dashSubTab === "today" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4">
                <h3 className="font-outfit font-bold text-base text-brand-gold">Today's Visa Submissions</h3>
                <div className="space-y-3 text-xs">
                  {applications.map((app) => (
                    <div key={app.id} className="bg-brand-midnight p-4 rounded border border-brand-gold/10 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-brand-gold font-bold">{app.id}</span>
                          <span className="text-brand-paper/50">{app.submissionDate}</span>
                        </div>
                        <p className="font-bold text-brand-paper text-sm mt-1">{app.travelerName} &bull; {app.destination}</p>
                      </div>
                      <span className="font-mono font-bold text-brand-gold">₹{formatINR(app.fees)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {dashSubTab === "pending_tasks" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4">
                <h3 className="font-outfit font-bold text-base text-brand-gold">Agent Task Checklist</h3>
                <div className="space-y-3 text-xs">
                  {[
                    { task: "Verify Sponsor Letter for PV-2026-0043 (Amara Okafor)", priority: "HIGH", status: "PENDING" },
                    { task: "Schedule VFS Biometrics slot for Yusuf Al-Farsi", priority: "MEDIUM", status: "IN_PROGRESS" },
                    { task: "Top up agency wallet balance before 5 PM ledger clearance", priority: "URGENT", status: "ACTION_REQUIRED" }
                  ].map((t, idx) => (
                    <div key={idx} className="bg-brand-midnight p-4 rounded border border-brand-gold/10 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 rounded text-brand-gold" />
                        <div>
                          <p className="font-bold text-brand-paper">{t.task}</p>
                          <span className="text-[10px] font-mono text-brand-gold">Priority: {t.priority}</span>
                        </div>
                      </div>
                      <span className="bg-brand-gold/15 text-brand-gold font-mono text-[10px] font-bold px-2.5 py-1 rounded">
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 2: VISA APPLICATIONS */}
        {/* Sub-items: All Applications, Draft, Submitted, Under Review, Approved, Rejected, Cancelled */}
        {/* ============================================================ */}
        {agentTab === "applications" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-brand-gold/15 pb-4">
              <div>
                <h3 className="font-outfit font-bold text-lg text-brand-gold">Visa Applications Directory</h3>
                <p className="text-xs text-brand-paper/50">Manage all client visa submissions</p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                {[
                  { key: "all", label: "All Applications" },
                  { key: "Draft", label: "Draft" },
                  { key: "Submitted", label: "Submitted" },
                  { key: "Embassy Processing", label: "Under Review" },
                  { key: "Approved", label: "Approved" },
                  { key: "Rejected", label: "Rejected" },
                  { key: "Docs Pending", label: "Docs Pending" }
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

            {/* Search Input */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-2.5 text-brand-paper/40" size={16} />
              <input
                type="text"
                placeholder="Search by ID, traveler name, or destination..."
                value={searchAppQuery}
                onChange={(e) => setSearchAppQuery(e.target.value)}
                className="w-full bg-brand-slate border border-brand-gold/20 rounded pl-9 pr-4 py-2 text-xs text-brand-paper outline-none focus:border-brand-gold"
              />
            </div>

            {/* Applications List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredApps.map((a) => (
                <div key={a.id} className="bg-brand-slate border border-brand-gold/15 p-5 rounded-lg space-y-3">
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
                        ? "bg-brand-teal/20 text-brand-teal"
                        : a.status === "Rejected"
                        ? "bg-brand-red/20 text-brand-red"
                        : "bg-brand-gold/20 text-brand-gold"
                    }`}>
                      {a.status}
                    </span>
                  </div>

                  <div className="text-xs text-brand-paper/70 space-y-1 border-t border-brand-gold/10 pt-3">
                    <div className="flex justify-between"><span>Passport:</span><span className="font-mono text-brand-paper">{a.passportNumber}</span></div>
                    <div className="flex justify-between"><span>Submission Date:</span><span>{a.submissionDate}</span></div>
                    <div className="flex justify-between"><span>Fee Charged:</span><span className="font-mono text-brand-gold font-bold">₹{formatINR(a.fees)}</span></div>
                  </div>

                  {a.reason && (
                    <div className="text-[11px] font-mono text-brand-red bg-brand-red/10 p-2.5 rounded border-l-2 border-brand-red">
                      {a.reason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 3: APPLICANTS */}
        {/* Sub-items: Applicant List, Applicant Details */}
        {/* ============================================================ */}
        {agentTab === "applicants" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setApplicantSubTab("list")}
                  className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
                    applicantSubTab === "list"
                      ? "bg-brand-gold text-brand-midnight font-bold shadow-md"
                      : "bg-brand-slate text-brand-paper/60 hover:text-brand-paper"
                  }`}
                >
                  Applicant List
                </button>
                <button
                  onClick={() => setApplicantSubTab("details")}
                  className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
                    applicantSubTab === "details"
                      ? "bg-brand-gold text-brand-midnight font-bold shadow-md"
                      : "bg-brand-slate text-brand-paper/60 hover:text-brand-paper"
                  }`}
                >
                  Applicant Details
                </button>
              </div>
            </div>

            {applicantSubTab === "list" ? (
              <div className="bg-brand-slate border border-brand-gold/15 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-midnight text-brand-gold font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Applicant ID</th>
                      <th className="p-3">Full Name</th>
                      <th className="p-3">Nationality</th>
                      <th className="p-3">Passport #</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-gold/10">
                    {applicantsList.map((app) => (
                      <tr key={app.id} className="hover:bg-brand-midnight/40">
                        <td className="p-3 font-mono font-bold text-brand-gold">{app.id}</td>
                        <td className="p-3 font-bold text-brand-paper">{app.name}</td>
                        <td className="p-3 text-brand-paper/80">{app.nationality}</td>
                        <td className="p-3 font-mono text-brand-paper/70">{app.passport}</td>
                        <td className="p-3 text-brand-paper/60">{app.email}</td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              setSelectedApplicant(app);
                              setApplicantSubTab("details");
                            }}
                            className="bg-brand-gold/15 hover:bg-brand-gold/30 border border-brand-gold/30 text-brand-gold font-bold px-3 py-1 rounded text-[10px]"
                          >
                            View Bio Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Applicant Details view */
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-6 max-w-3xl">
                <div className="border-b border-brand-gold/15 pb-4">
                  <h3 className="font-outfit font-bold text-xl text-brand-paper">
                    {selectedApplicant?.name || "Sophia Martinez"} &mdash; Bio Credentials
                  </h3>
                  <p className="text-xs text-brand-paper/50">Applicant ID: {selectedApplicant?.id || "APP-01"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div><span className="text-brand-paper/50">Nationality:</span> <span className="font-bold text-brand-paper">{selectedApplicant?.nationality || "United States"}</span></div>
                  <div><span className="text-brand-paper/50">Passport Number:</span> <span className="font-mono text-brand-gold font-bold">{selectedApplicant?.passport || "US8829102"}</span></div>
                  <div><span className="text-brand-paper/50">Email Contact:</span> <span className="text-brand-paper">{selectedApplicant?.email || "sophia.m@gmail.com"}</span></div>
                  <div><span className="text-brand-paper/50">Linked Visa File:</span> <span className="font-mono text-brand-gold">{selectedApplicant?.lastApp || "PV-2026-0041"}</span></div>
                </div>

                <MRZStrip
                  passportNumber={selectedApplicant?.passport || "US8829102"}
                  travelerName={selectedApplicant?.name || "Sophia Martinez"}
                  nationality={selectedApplicant?.nationality || "United States"}
                />
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 4: DOCUMENT VERIFICATION */}
        {/* Sub-items: Pending Verification, Verified Documents, Additional Document Requests */}
        {/* ============================================================ */}
        {agentTab === "doc_verification" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
              <div className="flex items-center gap-3">
                {[
                  { key: "pending", label: "Pending Verification" },
                  { key: "verified", label: "Verified Documents" },
                  { key: "additional", label: "Additional Doc Requests" }
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setDocVerifSubTab(st.key as any)}
                    className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
                      docVerifSubTab === st.key
                        ? "bg-brand-gold text-brand-midnight font-bold shadow-md"
                        : "bg-brand-slate text-brand-paper/60 hover:text-brand-paper"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {docVerifSubTab === "pending" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4">
                <h3 className="font-outfit font-bold text-base text-brand-gold">Documents Requiring Agent Validation</h3>
                <div className="space-y-3 text-xs">
                  {applications.filter((a) => a.status === "Docs Pending").map((app) => (
                    <div key={app.id} className="bg-brand-midnight p-4 rounded border border-brand-red/30 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono text-brand-gold font-bold">{app.id}</span>
                          <h4 className="font-bold text-brand-paper text-sm">{app.travelerName} &bull; {app.destination}</h4>
                        </div>
                        <span className="bg-brand-red/20 text-brand-red font-mono text-[10px] font-bold px-2.5 py-0.5 rounded">
                          ACTION REQUIRED
                        </span>
                      </div>
                      <p className="text-xs text-brand-red/90 bg-brand-red/10 p-2.5 rounded font-mono">
                        Issue: {app.reason || "Passport photo blur threshold exceeded."}
                      </p>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => {
                            updateApplicationDocs(app.id, "photo", "verified");
                            updateApplicationStatus(app.id, "Submitted");
                            triggerToast(`Approved doc for ${app.id}. Application moved to Submitted.`);
                          }}
                          className="bg-brand-teal hover:bg-brand-teal/80 text-brand-midnight font-bold px-3 py-1 rounded text-xs"
                        >
                          Pass & Approve Doc
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {docVerifSubTab === "verified" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs">
                <h3 className="font-outfit font-bold text-base text-brand-gold">Verified Credentials Archive</h3>
                <p className="text-brand-paper/60">Documents clear AI OCR and seal checks.</p>
              </div>
            )}

            {docVerifSubTab === "additional" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs">
                <h3 className="font-outfit font-bold text-base text-brand-gold">Request Additional Client Credentials</h3>
                <p className="text-brand-paper/60">Send automated SMS/email notices requesting rectified bank statements or NOCs.</p>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 5: PAYMENTS */}
        {/* Sub-items: Payment Verification, Transactions, Invoices */}
        {/* ============================================================ */}
        {agentTab === "payments" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
              <div className="flex items-center gap-3">
                {[
                  { key: "verification", label: "Payment Verification" },
                  { key: "transactions", label: "Transactions Ledger" },
                  { key: "invoices", label: "Agency Invoices" }
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setPaymentSubTab(st.key as any)}
                    className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
                      paymentSubTab === st.key
                        ? "bg-brand-gold text-brand-midnight font-bold shadow-md"
                        : "bg-brand-slate text-brand-paper/60 hover:text-brand-paper"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              <span className="font-mono text-xs text-brand-gold font-bold" suppressHydrationWarning>
                Wallet Liquidity: ₹{formatINR(walletBalance)}
              </span>
            </div>

            {paymentSubTab === "verification" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs">
                <h3 className="font-outfit font-bold text-base text-brand-gold">Consular Fee Settlement & Clearing</h3>
                <div className="bg-brand-midnight p-4 rounded border border-brand-gold/10 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-brand-paper">Available Wallet Liquidity</p>
                    <p className="text-[10px] text-brand-paper/50">Used to debit embassy application fees instantly</p>
                  </div>
                  <button
                    onClick={() => setShowAddFundsModal(true)}
                    className="bg-brand-gold text-brand-midnight font-bold px-4 py-2 rounded text-xs"
                  >
                    + Top Up Balance
                  </button>
                </div>
              </div>
            )}

            {paymentSubTab === "transactions" && (
              <div className="bg-brand-slate border border-brand-gold/15 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-midnight text-brand-gold font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Txn ID</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-gold/10">
                    {ledger.map((l) => (
                      <tr key={l.id} className="hover:bg-brand-midnight/40">
                        <td className="p-3 font-mono font-bold text-brand-gold">{l.id}</td>
                        <td className="p-3 text-brand-paper/70">{l.date}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                            l.type === "deposit" ? "bg-brand-teal/20 text-brand-teal" : "bg-brand-red/20 text-brand-red"
                          }`}>
                            {l.type}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-brand-paper">₹{formatINR(l.amount)}</td>
                        <td className="p-3 text-brand-paper/80">{l.description}</td>
                        <td className="p-3 font-mono text-brand-paper/50">{l.reference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {paymentSubTab === "invoices" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs">
                <h3 className="font-outfit font-bold text-base text-brand-gold">B2B Tax Invoices</h3>
                <p className="text-brand-paper/60">Download official agency tax invoices for monthly accounting.</p>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 6: APPOINTMENTS */}
        {/* ============================================================ */}
        {agentTab === "appointments" && (
          <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4">
            <h3 className="font-outfit font-bold text-lg text-brand-gold">Consular Slot & Biometrics Booking</h3>
            <p className="text-xs text-brand-paper/60">Manage VFS & Embassy appointments for clients.</p>
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 7: MESSAGES */}
        {/* ============================================================ */}
        {agentTab === "messages" && (
          <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4">
            <h3 className="font-outfit font-bold text-lg text-brand-gold">Agency Communication Center</h3>
            <p className="text-xs text-brand-paper/60">Live messaging with consular officers & applicants.</p>
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 8: NOTIFICATIONS */}
        {/* ============================================================ */}
        {agentTab === "notifications" && (
          <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4">
            <h3 className="font-outfit font-bold text-lg text-brand-gold">Agency System Alerts</h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-brand-midnight rounded border border-brand-gold/10 flex justify-between">
                <span>Wallet liquid balance updated after top-up of ₹4,15,000</span>
                <span className="font-mono text-brand-paper/40">Today, 11:30</span>
              </div>
              <div className="p-3 bg-brand-midnight rounded border border-brand-gold/10 flex justify-between">
                <span>Application PV-2026-0043 marked DOCS_PENDING by consular reviewer</span>
                <span className="font-mono text-brand-paper/40">July 20</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 9: REPORTS */}
        {/* Sub-items: Daily Report, Monthly Report, Performance Report */}
        {/* ============================================================ */}
        {agentTab === "reports" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
              <div className="flex items-center gap-3">
                {[
                  { key: "daily", label: "Daily Report" },
                  { key: "monthly", label: "Monthly Report" },
                  { key: "performance", label: "Performance SLA Report" }
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setReportSubTab(st.key as any)}
                    className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
                      reportSubTab === st.key
                        ? "bg-brand-gold text-brand-midnight font-bold shadow-md"
                        : "bg-brand-slate text-brand-paper/60 hover:text-brand-paper"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {reportSubTab === "daily" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs">
                <h3 className="font-outfit font-bold text-base text-brand-gold">Daily Revenue & Volume Analytics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-brand-midnight p-4 rounded border border-brand-gold/10">
                    <p className="text-brand-paper/50">Submissions Today</p>
                    <p className="text-xl font-bold text-brand-paper">5 Applications</p>
                  </div>
                  <div className="bg-brand-midnight p-4 rounded border border-brand-gold/10">
                    <p className="text-brand-paper/50">Fees Processed</p>
                    <p className="text-xl font-bold text-brand-gold font-mono">₹78,020</p>
                  </div>
                  <div className="bg-brand-midnight p-4 rounded border border-brand-gold/10">
                    <p className="text-brand-paper/50">Commission Earned</p>
                    <p className="text-xl font-bold text-brand-teal font-mono">₹23,406</p>
                  </div>
                </div>
              </div>
            )}

            {reportSubTab === "monthly" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs">
                <h3 className="font-outfit font-bold text-base text-brand-gold">Monthly Financial & SLA Report</h3>
                <p className="text-brand-paper/60">Total monthly application volume: 46 files. Approval rate: 97.8%.</p>
              </div>
            )}

            {reportSubTab === "performance" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs">
                <h3 className="font-outfit font-bold text-base text-brand-gold">Agency SLA & AI OCR Performance</h3>
                <p className="text-brand-paper/60">Average document verification speed: 1.4 seconds via AI scanner.</p>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 10: SUPPORT */}
        {/* ============================================================ */}
        {agentTab === "support" && (
          <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs">
            <h3 className="font-outfit font-bold text-base text-brand-gold">Agency Consular Support Desk</h3>
            <p className="text-brand-paper/60">Direct priority line for B2B visa agents.</p>
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 11: MY PROFILE */}
        {/* ============================================================ */}
        {agentTab === "profile" && (
          <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs max-w-2xl">
            <h3 className="font-outfit font-bold text-lg text-brand-gold">Agency Profile & License Credentials</h3>
            <div className="space-y-2">
              <p>Agency Name: <span className="font-bold text-brand-paper">Apex Travel B2B Bureau</span></p>
              <p>License ID: <span className="font-mono text-brand-gold">AG-2026-8819</span></p>
              <p>Revenue Share Tier: <span className="text-brand-teal font-bold">Tier 1 Platinum (30%)</span></p>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 12: SETTINGS */}
        {/* ============================================================ */}
        {agentTab === "settings" && (
          <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs max-w-2xl">
            <h3 className="font-outfit font-bold text-lg text-brand-gold">Agency System Settings</h3>
            <p className="text-brand-paper/60">Manage ledger auto-refill rules and notifications.</p>
          </div>
        )}

        {/* ============================================================ */}
        {/* BACKWARD-COMPATIBLE VIEWS: SEARCH, WIZARD, WALLET, CRM */}
        {/* ============================================================ */}
        {agentTab === "search" && (
          <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-6">
            <h3 className="font-outfit font-bold text-lg text-brand-gold">Visa Requirements Search</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-brand-paper/70 font-semibold mb-1">Destination Country</label>
                <select
                  value={searchDest}
                  onChange={(e) => setSearchDest(e.target.value)}
                  className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-brand-paper"
                >
                  <option value="Germany">Germany (Schengen)</option>
                  <option value="France">France (Schengen)</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>

              <div>
                <label className="block text-brand-paper/70 font-semibold mb-1">Applicant Nationality</label>
                <select
                  value={searchNational}
                  onChange={(e) => setSearchNational(e.target.value)}
                  className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-brand-paper"
                >
                  <option value="India">India</option>
                  <option value="China">China</option>
                  <option value="Nigeria">Nigeria</option>
                </select>
              </div>

              <div>
                <label className="block text-brand-paper/70 font-semibold mb-1">Visa Category</label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-brand-paper"
                >
                  <option value="Tourist">Tourist Visa</option>
                  <option value="Business">Business Visa</option>
                  <option value="Student">Student Visa</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowSearchResults(true)}
              className="bg-brand-gold text-brand-midnight font-bold text-xs px-5 py-2 rounded"
            >
              Run Rules Query
            </button>

            {showSearchResults && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-brand-gold/15 pt-4">
                {mockVisaProducts.map((p) => (
                  <div key={p.id} className="bg-brand-midnight p-4 rounded border border-brand-gold/10 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="font-bold text-brand-paper">{p.destination} - {p.visaType}</span>
                      <span className="font-mono text-brand-gold font-bold">₹{formatINR(p.price)}</span>
                    </div>
                    <p className="text-[10px] text-brand-paper/50">SLA: {p.processingTime}</p>
                    {p.aiRecommend && (
                      <p className="text-[10px] text-brand-teal bg-brand-teal/10 p-2 rounded">AI Note: {p.aiRecommend}</p>
                    )}
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setAgentTab("wizard");
                      }}
                      className="bg-brand-gold text-brand-midnight font-bold text-[10px] px-3 py-1 rounded mt-2"
                    >
                      Apply With Product &rarr;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {agentTab === "wizard" && (
          <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-6 max-w-3xl">
            <h3 className="font-outfit font-bold text-lg text-brand-gold">New Visa Application Wizard</h3>
            
            <div className="flex justify-between font-mono text-xs border-b border-brand-gold/10 pb-3">
              <span className={wizardStep === 1 ? "text-brand-gold font-bold" : "text-brand-paper/40"}>1. Passport Scan</span>
              <span className={wizardStep === 2 ? "text-brand-gold font-bold" : "text-brand-paper/40"}>2. Credentials & Checklist</span>
              <span className={wizardStep === 3 ? "text-brand-gold font-bold" : "text-brand-paper/40"}>3. Submit File</span>
            </div>

            {wizardStep === 1 && (
              <div className="space-y-4 text-xs">
                <div
                  onClick={simulatePassportOCR}
                  className="border-2 border-dashed border-brand-gold/30 hover:border-brand-gold p-8 rounded text-center cursor-pointer bg-brand-midnight"
                >
                  <Upload size={32} className="mx-auto text-brand-gold mb-2" />
                  <p className="font-bold text-brand-paper">Click to upload passport scan for AI OCR auto-parsing</p>
                  <p className="text-[10px] text-brand-paper/50">Auto-detects MRZ 1 & 2 codes</p>
                </div>

                {ocrScanning && <p className="text-brand-gold font-mono animate-pulse text-center">AI parsing MRZ data...</p>}

                {ocrCompleted && (
                  <div className="space-y-3 bg-brand-midnight p-4 rounded border border-brand-gold/20">
                    <p className="font-bold text-brand-teal">Parsed Fields:</p>
                    <input
                      type="text"
                      value={travelerName}
                      onChange={(e) => setTravelerName(e.target.value)}
                      className="w-full bg-brand-slate border border-brand-gold/20 rounded p-2 text-xs"
                    />
                    <input
                      type="text"
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value)}
                      className="w-full bg-brand-slate border border-brand-gold/20 rounded p-2 text-xs font-mono"
                    />
                    <button onClick={() => setWizardStep(2)} className="bg-brand-gold text-brand-midnight font-bold px-4 py-2 rounded">
                      Proceed to Step 2 &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-4 text-xs">
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={isEmployed} onChange={(e) => setIsEmployed(e.target.checked)} />
                    <span>Employed Applicant (Requires NOC)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={isSponsored} onChange={(e) => setIsSponsored(e.target.checked)} />
                    <span>Sponsored Trip (Requires Guarantee)</span>
                  </label>
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={() => setWizardStep(1)} className="bg-brand-midnight border text-brand-paper px-4 py-2 rounded">&larr; Back</button>
                  <button onClick={() => setWizardStep(3)} className="bg-brand-gold text-brand-midnight font-bold px-4 py-2 rounded">Next &rarr;</button>
                </div>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="space-y-4 text-xs">
                <div className="bg-brand-midnight p-4 rounded border border-brand-gold/10 space-y-2">
                  <p>Traveler: <span className="font-bold text-brand-paper">{travelerName || "Aarav Sharma"}</span></p>
                  <p>Passport: <span className="font-mono text-brand-gold">{passportNumber || "Z5592817"}</span></p>
                  <p>Consular Fee: <span className="font-mono text-brand-gold font-bold">₹{formatINR(selectedProduct?.price || 13280)}</span></p>
                </div>
                <button
                  onClick={handleSubmitVisaApplication}
                  className="bg-brand-gold hover:bg-brand-gold-hover text-brand-midnight font-bold text-xs px-6 py-2.5 rounded w-full"
                >
                  Confirm & Submit File
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* TOP UP FUNDS MODAL */}
      {showAddFundsModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-brand-slate border border-brand-gold/30 p-6 rounded-lg max-w-md w-full space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-brand-gold/15 pb-3">
              <span className="font-outfit font-bold text-base text-brand-gold">TOP UP AGENCY WALLET</span>
              <button onClick={() => setShowAddFundsModal(false)} className="text-brand-paper/50 hover:text-brand-paper">
                <X size={18} />
              </button>
            </div>
            <div>
              <label className="block text-brand-paper/70 font-semibold mb-1">Enter Top-Up Amount (INR)</label>
              <input
                type="number"
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value)}
                className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-brand-paper font-mono text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddFundsModal(false)} className="bg-brand-midnight text-brand-paper px-4 py-2 rounded">Cancel</button>
              <button
                onClick={() => {
                  const amt = parseFloat(topupAmount);
                  if (amt > 0) {
                    addFunds(amt);
                    triggerToast(`Added ₹${formatINR(amt)} to agency wallet balance!`);
                    setShowAddFundsModal(false);
                  }
                }}
                className="bg-brand-gold text-brand-midnight font-bold px-4 py-2 rounded"
              >
                Confirm Deposit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-brand-slate border border-brand-gold/30 p-6 rounded-lg max-w-md w-full space-y-4 text-xs text-center">
            <h3 className="font-outfit font-bold text-lg text-brand-gold">Log Out of Agent Portal?</h3>
            <p className="text-brand-paper/60">Are you sure you want to exit your active agent session?</p>
            <div className="flex justify-center gap-3 pt-2">
              <button onClick={() => setShowLogoutModal(false)} className="bg-brand-midnight text-brand-paper px-4 py-2 rounded">Cancel</button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  logoutSession();
                }}
                className="bg-brand-red text-white font-bold px-4 py-2 rounded cursor-pointer"
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
