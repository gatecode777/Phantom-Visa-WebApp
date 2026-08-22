import React, { useState, useEffect, useMemo, useRef } from "react";
import { useVisa, Application, CustomerTab, formatINR } from "../context/VisaContext";
import { API_V1_URL } from "../config/api";
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
import ApplicantApplyVisa from "./ApplicantApplyVisa";
import ApplicantPaymentHistory from "./ApplicantPaymentHistory";
import ApplicantInvoices from "./ApplicantInvoices";
import ApplicantAppointments from "./ApplicantAppointments";
import ApplicantExploreCountries from "./ApplicantExploreCountries";
import ApplicantVisaTypes from "./ApplicantVisaTypes";
import ApplicantVisaProcessingTime from "./ApplicantVisaProcessingTime";
import ApplicantVisaFees from "./ApplicantVisaFees";
import ApplicantSupport from "./ApplicantSupport";
import ApplicantProfile from "./ApplicantProfile";
import ApplicantSettings from "./ApplicantSettings";
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
    fetchApplicantDashboardData,
    unifiedAppointments,
    unifiedTickets
  } = useVisa();

  // Selected active application ID for tracking/documents
  const [selectedAppId, setSelectedAppId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompleteKycModal, setShowCompleteKycModal] = useState<boolean>(false);
  const [kycCompletedState, setKycCompletedState] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("phantom_customer_kyc_completed") === "true";
    }
    return false;
  });
  const [docSubTab, setDocSubTab] = useState<"vault" | "upload">(() => {
    try {
      const saved = localStorage.getItem("customer_active_subtab");
      if (localStorage.getItem("customer_active_tab") === "documents" && saved && saved !== "status") return saved as any;
    } catch { }
    return "vault";
  });
  
  const [exploreSubTab, setExploreSubTab] = useState<"countries" | "types" | "processing" | "fees">(() => {
    try {
      const saved = localStorage.getItem("customer_active_subtab");
      if (localStorage.getItem("customer_active_tab") === "explore" && saved && saved !== "requirements") return saved as any;
    } catch { }
    return "countries";
  });

  const [paymentSubTab, setPaymentSubTab] = useState<"history" | "invoices">("history");

  // Real-time dynamic KYC status state listener
  const [localKycStatus, setLocalKycStatus] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("phantom_customer_kyc_status") || "Pending";
    }
    return "Pending";
  });

  const liveKycStatusFromDb =
    (applicantDashboardData as any)?.kycStatus ||
    (applicantDashboardData as any)?.kycDetails?.kycStatus ||
    (authSession?.user as any)?.kycStatus;

  // Sync localStorage with live DB status whenever DB status updates
  // Guard with strict equality to avoid unnecessary re-renders that reset scroll position
  useEffect(() => {
    if (liveKycStatusFromDb && liveKycStatusFromDb !== localKycStatus && typeof window !== "undefined") {
      try {
        localStorage.setItem("phantom_customer_kyc_status", liveKycStatusFromDb);
      } catch (e) {}
      setLocalKycStatus(liveKycStatusFromDb);
    }
  }, [liveKycStatusFromDb]);

  const rawKycStatus = liveKycStatusFromDb || localKycStatus || "Pending";

  const isKycVerified =
    rawKycStatus === "Approved" ||
    rawKycStatus === "Verified";

  const isKycUnderAudit =
    rawKycStatus === "Under Audit" ||
    rawKycStatus === "Pending Approval" ||
    rawKycStatus === "Under Review";

  const isKycRejected = rawKycStatus === "Rejected";
  const kycRejectionReason = (applicantDashboardData as any)?.kycDetails?.rejectionReason || "Document scan blurry or mismatched.";

  // Target app reference
  const app = applications.find((a) => a.id === selectedAppId) || applications[0];

  // Dynamic user data from MongoDB
  const greetingName = authSession?.user?.name || applicantDashboardData?.greetingName || "Vibhu Sharma";

  const liveMetrics = useMemo(() => {
    const totalApps = applications.length;
    const underReview = applications.filter((a) =>
      ["Submitted", "Docs Uploaded", "Docs Pending", "Embassy Processing", "Under Review", "Processing", "In Progress"].includes(a.status)
    ).length;
    const approvedVisas = applications.filter((a) => a.status === "Approved").length;
    const rejectedApplications = applications.filter((a) => a.status === "Rejected").length;

    let pendingDocs = 0;
    applications.forEach((a) => {
      const docs = Array.isArray((a as any).uploadedDocuments) ? (a as any).uploadedDocuments : [];
      docs.forEach((d: any) => {
        if (!d.fileUrl || d.status === "pending" || d.status === "needs_review" || d.status === "rejected") {
          pendingDocs++;
        }
      });
    });

    const upcomingAppointments = (unifiedAppointments || []).filter(
      (apt) => apt.status === "Upcoming" || apt.status === "Rescheduled"
    ).length;

    const unreadMessages = (unifiedTickets || []).filter(
      (t) => t.status === "Open" || t.status === "In Progress"
    ).length;

    return {
      totalApplications: totalApps,
      underReview: underReview || applicantDashboardData?.metrics?.underReview || 0,
      approvedVisas,
      rejectedApplications,
      pendingDocuments: pendingDocs || applicantDashboardData?.metrics?.pendingDocuments || 0,
      upcomingAppointments: upcomingAppointments || 1,
      unreadMessages,
      notifications: 3
    };
  }, [applications, unifiedAppointments, unifiedTickets, applicantDashboardData]);

  // Nearest upcoming appointment for dashboard widget
  const nextAppointment = useMemo(() => {
    if (!unifiedAppointments || unifiedAppointments.length === 0) return null;
    const upcoming = unifiedAppointments.filter(
      (a) => a.status === "Upcoming" || a.status === "Rescheduled"
    );
    if (upcoming.length === 0) return unifiedAppointments[0] || null;
    return upcoming.sort((a, b) => (a.dateOnly || "").localeCompare(b.dateOnly || ""))[0];
  }, [unifiedAppointments]);

  // Active application for stepper
  const activeStepperApp = useMemo(() => {
    return applications.find((a) => a.id === selectedAppId) || applications[0] || null;
  }, [applications, selectedAppId]);

  // Stepper timeline dynamically derived from active application
  const stepperSteps = useMemo(() => {
    if (!activeStepperApp) {
      return [
        { title: "Application Submitted", date: "18 Jul 2026", active: true },
        { title: "Documents Uploaded", date: "18 Jul 2026", active: true },
        { title: "Documents Verified", date: "19 Jul 2026", active: true },
        { title: "Payment Confirmed", date: "19 Jul 2026", active: true },
        { title: "Under Review", date: "Current Status", active: true },
        { title: "Embassy Review", date: "------", active: false },
        { title: "Decision Pending", date: "------", active: false },
        { title: "Visa Approved", date: "------", active: false }
      ];
    }

    const subDate = activeStepperApp.submissionDate || (activeStepperApp.createdAt ? new Date(activeStepperApp.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "18 Jul 2026");
    const status = activeStepperApp.status;
    const isApproved = status === "Approved";
    const isRejected = status === "Rejected";
    const isUnderReview = ["Submitted", "Docs Uploaded", "Docs Pending", "Embassy Processing", "Under Review", "Processing", "In Progress"].includes(status);

    const hasDocs = Array.isArray((activeStepperApp as any).uploadedDocuments) && (activeStepperApp as any).uploadedDocuments.some((d: any) => d.fileUrl);
    const hasVerifiedDocs = Array.isArray((activeStepperApp as any).uploadedDocuments) && (activeStepperApp as any).uploadedDocuments.some((d: any) => d.status === "verified");

    return [
      { title: "Application submitted", date: subDate, active: true },
      { title: "Documents Uploaded", date: hasDocs ? subDate : "In Progress", active: hasDocs || isApproved },
      { title: "Documents Verified", date: hasVerifiedDocs ? subDate : (isApproved ? subDate : "Under Audit"), active: hasVerifiedDocs || isApproved },
      { title: "Payment Confirmed", date: `₹${(activeStepperApp.fees || 12980).toLocaleString("en-IN")} Received`, active: true },
      { title: isApproved ? "Embassy Review Passed" : isRejected ? "Embassy Review Completed" : "Under Review", date: isApproved || isRejected ? subDate : "Current Status", active: isUnderReview || isApproved || isRejected },
      { title: "Embassy Review", date: isApproved ? "Consular Cleared" : isRejected ? "Review Complete" : "In Progress", active: isApproved || isRejected || status === "Embassy Processing" },
      { title: "Decision Pending", date: isApproved ? "Granted" : isRejected ? "Decision Issued" : "------", active: isApproved || isRejected },
      { title: isApproved ? "Visa Approved" : isRejected ? "Visa Decision Finalized" : "Visa Approved", date: isApproved ? "Approved ✓" : isRejected ? "Rejected ❌" : "------", active: isApproved }
    ];
  }, [activeStepperApp]);

  // Dynamic Countries loaded from MongoDB
  const [dbCountries, setDbCountries] = useState<any[]>([]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const res = await fetch(`${API_V1_URL}/countries`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setDbCountries(json.data);
        }
      } catch (err) {
        console.error("Failed to load countries from backend:", err);
      }
    };
    loadCountries();
  }, []);

  const getCountryImage = (name: string) => {
    const n = (name || "").toLowerCase();
    if (n.includes("australia")) return "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&q=80&w=600";
    if (n.includes("canada")) return "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=80&w=600";
    if (n.includes("germany")) return "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=600";
    if (n.includes("uk") || n.includes("united kingdom") || n.includes("britain")) return "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=600";
    if (n.includes("usa") || n.includes("united states") || n.includes("america")) return "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&q=80&w=600";
    if (n.includes("france")) return "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600";
    if (n.includes("uae") || n.includes("dubai") || n.includes("emirates")) return "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=600";
    if (n.includes("japan")) return "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600";
    if (n.includes("singapore")) return "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=600";
    return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600";
  };

  const getStaticCountryFlag = (name: string, code?: string) => {
    const n = (name || "").toLowerCase();
    const c = (code || "").toUpperCase();
    if (n.includes("australia") || c === "AUS" || c === "AU") {
      return { url: "https://flagcdn.com/w80/au.png", emoji: "🇦🇺" };
    }
    if (n.includes("canada") || c === "CAN" || c === "CA") {
      return { url: "https://flagcdn.com/w80/ca.png", emoji: "🇨🇦" };
    }
    if (n.includes("germany") || c === "DEU" || c === "DE") {
      return { url: "https://flagcdn.com/w80/de.png", emoji: "🇩🇪" };
    }
    if (n.includes("uk") || n.includes("united kingdom") || n.includes("britain") || c === "GBR" || c === "GB") {
      return { url: "https://flagcdn.com/w80/gb.png", emoji: "🇬🇧" };
    }
    if (n.includes("usa") || n.includes("united states") || n.includes("america") || c === "USA" || c === "US") {
      return { url: "https://flagcdn.com/w80/us.png", emoji: "🇺🇸" };
    }
    if (n.includes("france") || c === "FRA" || c === "FR") {
      return { url: "https://flagcdn.com/w80/fr.png", emoji: "🇫🇷" };
    }
    if (n.includes("uae") || n.includes("dubai") || n.includes("emirates") || c === "ARE" || c === "AE") {
      return { url: "https://flagcdn.com/w80/ae.png", emoji: "🇦🇪" };
    }
    if (n.includes("japan") || c === "JPN" || c === "JP") {
      return { url: "https://flagcdn.com/w80/jp.png", emoji: "🇯🇵" };
    }
    if (n.includes("singapore") || c === "SGP" || c === "SG") {
      return { url: "https://flagcdn.com/w80/sg.png", emoji: "🇸🇬" };
    }
    return { url: "https://flagcdn.com/w80/un.png", emoji: "🌐" };
  };

  // Popular Destinations Catalog dynamically derived from MongoDB with clean static flags
  const popularVisas = useMemo(() => {
    if (dbCountries.length > 0) {
      return dbCountries.slice(0, 4).map((c: any) => {
        const visaTypes = Array.isArray(c.availableVisaTypes)
          ? c.availableVisaTypes
          : typeof c.availableVisaTypes === "string"
          ? c.availableVisaTypes.split(" ").filter(Boolean)
          : ["Tourist & Visitor Visa"];

        const mainVisaType = visaTypes[0] || "Tourist Visa";
        const badge = c.processingTime ? `Fast Track ${c.processingTime}` : "Popular";
        const staticFlag = getStaticCountryFlag(c.name, c.code);

        // Dynamic main image from DB (ImageKit URL stored in country record)
        const dynamicMainImage = (c.flag && (c.flag.startsWith("http://") || c.flag.startsWith("https://")))
          ? c.flag
          : (c.imageUrl || c.image || getCountryImage(c.name));

        return {
          id: c._id || c.countryId || c.code,
          country: c.name,
          code: c.code,
          visaType: mainVisaType,
          image: dynamicMainImage,
          flagUrl: staticFlag.url,
          flagEmoji: staticFlag.emoji,
          badge,
          startingFee: c.startingFee ? formatINR(c.startingFee) : "₹8,500",
          processingTime: c.processingTime || "15 Days"
        };
      });
    }

    return [
      {
        id: "cnt-can",
        country: "Canada",
        code: "CAN",
        visaType: "Tourist & Visitor Visa",
        image: getCountryImage("Canada"),
        flagUrl: "https://flagcdn.com/w80/ca.png",
        flagEmoji: "🇨🇦",
        badge: "Fast Track 15 Days",
        startingFee: "₹8,500",
        processingTime: "15 Days"
      },
      {
        id: "cnt-gbr",
        country: "United Kingdom",
        code: "GBR",
        visaType: "Standard Visitor Visa",
        image: getCountryImage("United Kingdom"),
        flagUrl: "https://flagcdn.com/w80/gb.png",
        flagEmoji: "🇬🇧",
        badge: "Popular",
        startingFee: "₹11,000",
        processingTime: "15 Days"
      },
      {
        id: "cnt-aus",
        country: "Australia",
        code: "AUS",
        visaType: "Visitor & Working Holiday",
        image: getCountryImage("Australia"),
        flagUrl: "https://flagcdn.com/w80/au.png",
        flagEmoji: "🇦🇺",
        badge: "Express 20 Days",
        startingFee: "₹9,200",
        processingTime: "20 Days"
      },
      {
        id: "cnt-usa",
        country: "United States",
        code: "USA",
        visaType: "B1/B2 Business & Visitor",
        image: getCountryImage("United States"),
        flagUrl: "https://flagcdn.com/w80/us.png",
        flagEmoji: "🇺🇸",
        badge: "10-Year Multiple",
        startingFee: "₹14,500",
        processingTime: "25 Days"
      }
    ];
  }, [dbCountries]);

  // Collapsible Sidebar Sections State — initialized from localStorage to avoid blink on reload
  const [openMyApps, setOpenMyApps] = useState<boolean>(() => {
    try { return localStorage.getItem("customer_active_tab") === "applications"; } catch { return false; }
  });
  const [openDocs, setOpenDocs] = useState<boolean>(() => {
    try { return localStorage.getItem("customer_active_tab") === "documents"; } catch { return false; }
  });

  const [openAppts, setOpenAppts] = useState<boolean>(() => {
    try { return localStorage.getItem("customer_active_tab") === "appointments"; } catch { return false; }
  });
  const [openExplore, setOpenExplore] = useState<boolean>(() => {
    try { return localStorage.getItem("customer_active_tab") === "explore"; } catch { return false; }
  });

  const handleTabChange = (tab: CustomerTab, subTab?: string) => {
    setCustomerTab(tab);
    // Persist active tab to localStorage so page reload restores position
    try {
      localStorage.setItem("customer_active_tab", tab);
      if (subTab) {
        localStorage.setItem("customer_active_subtab", subTab);
      } else {
        localStorage.removeItem("customer_active_subtab");
      }
    } catch (e) {}
    // Close all dropdowns when switching to a top-level tab that isn't the one being opened
    if (tab !== "applications") setOpenMyApps(false);
    if (tab !== "documents") setOpenDocs(false);
    if (tab !== "appointments") setOpenAppts(false);
    if (tab !== "explore") setOpenExplore(false);
  };

  // Fetch dashboard data on mount
  useEffect(() => {
    if (fetchApplicantDashboardData) {
      fetchApplicantDashboardData();
    }
  }, []);

  // SUB-TAB STATES — initialized from localStorage to avoid blink on reload
  const [appFilter, setAppFilter] = useState<
    "all" | "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected" | "Cancelled"
  >(() => {
    try {
      const saved = localStorage.getItem("customer_active_subtab");
      if (localStorage.getItem("customer_active_tab") === "applications" && saved) {
        return saved as any;
      }
    } catch { }
    return "all";
  });

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
    travelerName: authSession?.user?.name || "",
    dob: "",
    passportNumber: "",
    passportExpiry: "",
    nationality: "",
    destination: "",
    visaType: "",
    travelDates: "",
    employed: true,
    sponsored: false,
    fees: 0
  });
  const [applySuccessId, setApplySuccessId] = useState<string | null>(null);

  // Appointment State
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedApptDate, setSelectedApptDate] = useState("");
  const [selectedApptTime, setSelectedApptTime] = useState("");
  const [apptSuccess, setApptSuccess] = useState(false);

  // Payments interactive checkout state
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking">("card");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState("");

  // Notifications state
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; desc: string; time: string; read: boolean }>>([]);

  // Profile Data
  const [profileData, setProfileData] = useState({
    fullName: authSession?.user?.name || "",
    email: authSession?.user?.email || "",
    phone: authSession?.user?.phone || "",
    nationality: "",
    passportNumber: "",
    passportExpiry: "",
    address: ""
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
            onClick={() => handleTabChange("payments")}
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
            onClick={() => handleTabChange("messages")}
            className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            title="Messages"
          >
            <MessageSquare size={17} />
          </button>

          <button
            onClick={() => handleTabChange("notifications")}
            className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition cursor-pointer relative"
            title="Notifications"
          >
            <Bell size={17} />
            {notifications.some((n) => !n.read) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#4848F7] rounded-full" />
            )}
          </button>

          <div
            onClick={() => handleTabChange("profile")}
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
      <div className="flex flex-1 min-h-0 overflow-hidden">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="w-64 h-full bg-white border-r border-slate-200 flex flex-col overflow-y-auto shrink-0 py-4 px-3">
          <nav className="space-y-1 flex-1">
            <button
              onClick={() => handleTabChange("dashboard")}
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
              onClick={() => handleTabChange("apply")}
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
                  handleTabChange("applications");
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
                    { label: "Submitted", filter: "Submitted" }
                  ].map((sub) => (
                    <button
                      key={sub.label}
                      onClick={() => {
                        handleTabChange("applications", sub.filter);
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
                  handleTabChange("documents");
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
                    { label: "My Documents", tab: "vault" }
                  ].map((sub) => (
                    <button
                      key={sub.label}
                      onClick={() => {
                        handleTabChange("documents", sub.tab);
                        setDocSubTab(sub.tab as any);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-medium block transition ${
                        customerTab === "documents" && docSubTab === sub.tab
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
                onClick={() => handleTabChange("payments")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                  customerTab === "payments"
                    ? "bg-[#EEF2FF] text-[#4848F7] font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <CreditCard size={18} className={customerTab === "payments" ? "text-[#4848F7]" : "text-slate-500"} />
                <span>Payments</span>
              </button>
            </div>

            <div>
              <button
                onClick={() => handleTabChange("appointments")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  customerTab === "appointments"
                    ? "bg-[#EEF2FF] text-[#4848F7] font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar size={18} className={customerTab === "appointments" ? "text-[#4848F7]" : "text-slate-500"} />
                  <span>All Appointments</span>
                </div>
              </button>
            </div>

            <div>
              <button
                onClick={() => {
                  handleTabChange("explore");
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
                    { label: "Countries & Fees", subTab: "countries" },
                    { label: "Visa Types & Validity", subTab: "types" }
                  ].map((sub) => (
                    <button
                      key={sub.label}
                      onClick={() => {
                        handleTabChange("explore", sub.subTab);
                        setExploreSubTab(sub.subTab as any);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-medium block transition ${
                        customerTab === "explore" && exploreSubTab === sub.subTab
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
              onClick={() => handleTabChange("support")}
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
              onClick={() => handleTabChange("profile")}
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
              onClick={() => handleTabChange("settings")}
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
        <main className="flex-1 min-h-0 min-w-0 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">
          
          {/* SECTION 1: MAIN DASHBOARD OVERVIEW */}
          {customerTab === "dashboard" && (
            <div className="space-y-6">

              {/* KYC Notification Banner (Pending vs Under Audit vs Approved vs Rejected) */}
              {isKycVerified ? (
                <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-500/50 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-emerald-100 px-2.5 py-0.5 rounded-full font-mono">
                          Identity Verified • Consular Audit Approved
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-white tracking-tight mt-0.5">KYC Verification Complete & Approved</h3>
                      <p className="text-[11px] text-emerald-100 font-medium">
                        Your identity documents have been approved by Admin for full international visa processing privileges.
                      </p>
                    </div>
                  </div>
                  <div className="px-3.5 py-1.5 bg-white/15 text-white font-mono font-bold text-xs rounded-xl border border-white/20 shrink-0">
                    Status: Approved ✓
                  </div>
                </div>
              ) : isKycUnderAudit ? (
                <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white rounded-2xl p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 border border-indigo-500/50 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30">
                      <Clock className="w-5 h-5 text-white animate-spin-slow" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-indigo-100 px-2.5 py-0.5 rounded-full font-mono">
                          Consular Identity Audit • Pending Admin Approval
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-white tracking-tight mt-0.5">KYC Submitted — Under Admin Review</h3>
                      <p className="text-[11px] text-indigo-100 font-medium">
                        Your AI-verified document scans have been submitted and are currently under review by the Consular Admin. You will be notified once approved.
                      </p>
                    </div>
                  </div>
                  <div className="px-3.5 py-1.5 bg-white/15 text-white font-mono font-bold text-xs rounded-xl border border-white/20 shrink-0 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Status: Under Audit ⏳
                  </div>
                </div>
              ) : isKycRejected ? (
                <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-rose-400/50">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white px-2.5 py-0.5 rounded-full font-mono">
                          Identity Audit Failure
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-white tracking-tight mt-0.5">KYC Verification Rejected by Admin</h3>
                      <p className="text-xs text-rose-100 font-medium">
                        Reason: {kycRejectionReason}. Please re-submit your identity documents.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowCompleteKycModal(true)}
                    className="px-5 py-2.5 bg-white hover:bg-slate-50 text-rose-700 font-black text-xs rounded-xl shadow-md transition shrink-0 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Re-Submit KYC Verification</span>
                    <ArrowRight className="w-4 h-4 text-rose-600" />
                  </button>
                </div>
              ) : (
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
              )}

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
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-slate-800">Upcoming Appointment</h3>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-[#4848F7] border border-indigo-200 font-mono">
                        {nextAppointment?.status || "Confirmed"}
                      </span>
                    </div>
                    
                    {/* Inset Light Blue Details Box */}
                    <div className="bg-[#F0F4FF] border border-[#D8E2FF] rounded-xl p-4 space-y-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {nextAppointment?.appointmentType || "Visa Interview & Biometrics"}
                      </p>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 flex items-center gap-1.5">
                            <Clock size={14} className="text-[#4848F7]" /> Date
                          </span>
                          <span className="font-bold text-slate-800">
                            {nextAppointment?.dateDisplay || nextAppointment?.dateOnly || "26 July 2026"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 flex items-center gap-1.5">
                            <Clock size={14} className="text-[#4848F7]" /> Time
                          </span>
                          <span className="font-bold text-slate-800">
                            {nextAppointment?.timeSlot || "11:00 AM"}
                          </span>
                        </div>

                        <div className="flex justify-between items-start">
                          <span className="text-slate-600 flex items-center gap-1.5 shrink-0">
                            <MapPin size={14} className="text-[#4848F7]" /> Location
                          </span>
                          <span className="font-semibold text-slate-800 text-right text-[11px] leading-snug">
                            {nextAppointment?.vacCenter ? `${nextAppointment.vacCenter}, ${nextAppointment.city}` : "Visa Application Center, New Delhi"}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleTabChange("appointments")}
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
                    <div>
                      <h3 className="text-base font-bold text-slate-800">Visa Status Stepper</h3>
                      <p className="text-[10px] text-slate-400 font-mono truncate max-w-[180px]">
                        {activeStepperApp?.id ? `${activeStepperApp.id} (${activeStepperApp.destination || "Canada"})` : "VO-2026-9841"}
                      </p>
                    </div>
                    <span className="text-emerald-600 bg-emerald-50 border border-emerald-300 px-3 py-0.5 rounded-full text-[11px] font-semibold">
                      {activeStepperApp?.status || "Under Review"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {stepperSteps.map((step, idx) => (
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
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800">Application Status Tracker</h3>
                  <button
                    onClick={() => handleTabChange("applications", "all")}
                    className="text-xs font-bold text-[#4848F7] hover:underline cursor-pointer"
                  >
                    View All Applications ({applications.length})
                  </button>
                </div>

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
                      {applications.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400">
                            No visa applications found. Click "Apply for Visa" to start your first application.
                          </td>
                        </tr>
                      ) : (
                        applications.map((appItem) => {
                          const status = appItem.status || "Submitted";
                          const dateStr = appItem.submissionDate || (appItem.createdAt ? new Date(appItem.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Recent");

                          let pillColor = "text-amber-700 bg-amber-50";
                          let dotColor = "bg-amber-500";
                          if (status === "Approved") {
                            pillColor = "text-emerald-700 bg-emerald-50";
                            dotColor = "bg-emerald-500";
                          } else if (status === "Rejected") {
                            pillColor = "text-red-700 bg-red-50";
                            dotColor = "bg-red-500";
                          } else if (status === "Cancelled" || status === "Withdrawn") {
                            pillColor = "text-slate-700 bg-slate-100";
                            dotColor = "bg-slate-500";
                          }

                          return (
                            <tr
                              key={appItem.id}
                              onClick={() => {
                                setSelectedAppId(appItem.id);
                                handleTabChange("applications", "all");
                              }}
                              className="hover:bg-slate-50 transition cursor-pointer"
                            >
                              <td className="py-3.5 px-4 font-mono font-bold text-[#4848F7]">{appItem.id}</td>
                              <td className="py-3.5 px-4 font-semibold text-slate-800">{appItem.destination || appItem.countryName || "Canada"}</td>
                              <td className="py-3.5 px-4 text-slate-600">{appItem.visaType || "Tourist Visa"}</td>
                              <td className="py-3.5 px-4 text-slate-600">{dateStr}</td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-full text-[11px] ${pillColor}`}>
                                  <span className={`w-2 h-2 rounded-full ${dotColor}`} /> {status}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ============================================================ */}
              {/* FOURTH ROW: EXPLORE POPULAR VISA CARDS */}
              {/* ============================================================ */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Explore Popular Visa Destinations</h3>
                    <p className="text-xs text-slate-500">Fast-track international e-visas and consular permits</p>
                  </div>
                  <button
                    onClick={() => handleTabChange("explore", "countries")}
                    className="text-xs font-bold text-[#4848F7] hover:underline cursor-pointer"
                  >
                    View All Countries ➔
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {popularVisas.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                    >
                      {/* Image Container with Country Flag Badge */}
                      <div className="relative h-36 bg-slate-200 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.country}
                          className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        />
                        {/* Country Flag Circle Badge Top-Left */}
                        <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs p-1 shadow-md flex items-center justify-center text-lg overflow-hidden border border-slate-100">
                          {item.flagUrl ? (
                            <img
                              src={item.flagUrl}
                              alt={item.country}
                              className="w-full h-full object-cover rounded-full"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <span>{item.flagEmoji}</span>
                          )}
                        </div>
                        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono shadow-xs">
                          {item.badge}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 space-y-2 text-center">
                        <div>
                          <h4 className="text-base font-bold text-slate-900">{item.country}</h4>
                          <p className="text-xs text-slate-500 font-medium">{item.visaType}</p>
                          <p className="text-[11px] font-bold text-emerald-600 font-mono mt-0.5">
                            From {item.startingFee} &bull; {item.processingTime}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setNewAppForm((prev) => ({
                              ...prev,
                              destination: item.country,
                              visaType: item.visaType
                            }));
                            handleTabChange("apply");
                          }}
                          className="w-full bg-indigo-50 hover:bg-[#4848F7] text-[#4848F7] hover:text-white text-xs font-bold py-2 rounded-xl transition cursor-pointer"
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
          
          {/* APPLY FOR VISA WIZARD (LOCKED UNTIL KYC COMPLETED) */}
          {customerTab === "apply" && (
            !isKycVerified ? (
              isKycUnderAudit ? (
                <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-indigo-200 p-8 sm:p-12 text-center space-y-6 shadow-md animate-in fade-in zoom-in duration-200 my-4">
                  <div className="w-20 h-20 bg-indigo-50 border border-indigo-200 rounded-full flex items-center justify-center mx-auto text-indigo-600 shadow-inner">
                    <Clock size={40} className="animate-spin-slow" />
                  </div>

                  <div className="space-y-2">
                    <span className="bg-indigo-100 text-indigo-800 font-extrabold px-3.5 py-1 rounded-full text-xs uppercase tracking-wider inline-flex items-center gap-1.5 font-mono">
                      <Clock size={14} className="text-indigo-600" />
                      Consular Audit In Progress
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-outfit">
                      KYC Submission Under Admin Audit ⏳
                    </h2>
                    <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                      Your identity & document scans (Aadhaar / PAN & Address Proof) have been submitted and are currently under review by the Consular Admin team.
                    </p>
                  </div>

                  <div className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-5 max-w-md mx-auto text-left space-y-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">1</div>
                      <div>
                        <p className="font-bold text-slate-900">AI Document Scan Passed</p>
                        <p className="text-slate-500 text-[11px]">Real-time Gemini AI classification verified</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2 border-t border-indigo-200/60">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">2</div>
                      <div>
                        <p className="font-bold text-slate-900">Pending Consular Admin Sign-off</p>
                        <p className="text-slate-500 text-[11px]">Admin review queued in Consular Panel</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold px-6 py-3 rounded-2xl text-xs">
                      <span>Status: Awaiting Admin Approval ⏳</span>
                    </div>
                  </div>
                </div>
              ) : isKycRejected ? (
                <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-rose-200 p-8 sm:p-12 text-center space-y-6 shadow-md animate-in fade-in zoom-in duration-200 my-4">
                  <div className="w-20 h-20 bg-rose-100 border border-rose-200 rounded-full flex items-center justify-center mx-auto text-rose-600 shadow-inner">
                    <AlertCircle size={40} />
                  </div>

                  <div className="space-y-2">
                    <span className="bg-rose-100 text-rose-800 font-extrabold px-3.5 py-1 rounded-full text-xs uppercase tracking-wider inline-flex items-center gap-1.5 font-mono">
                      Identity Audit Failed
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-outfit">
                      KYC Verification Audit Rejected ❌
                    </h2>
                    <p className="text-sm text-rose-700 max-w-xl mx-auto leading-relaxed font-semibold">
                      Reason: {kycRejectionReason}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setShowCompleteKycModal(true)}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-8 py-3.5 rounded-2xl text-xs transition shadow-lg shadow-rose-500/20 cursor-pointer flex items-center gap-2 mx-auto"
                    >
                      <ShieldCheck size={18} />
                      <span>Re-Submit KYC Verification</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-sm animate-in fade-in zoom-in duration-200 my-4">
                  <div className="w-20 h-20 bg-amber-100 border border-amber-200 rounded-full flex items-center justify-center mx-auto text-amber-600 shadow-inner">
                    <Lock size={40} />
                  </div>

                  <div className="space-y-2">
                    <span className="bg-amber-100 text-amber-800 font-extrabold px-3.5 py-1 rounded-full text-xs uppercase tracking-wider inline-flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-amber-600" />
                      Identity Audit & KYC Required
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-outfit">
                      Complete KYC Verification to Apply for Visa 🔒
                    </h2>
                    <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                      Consular regulations require all primary applicants to complete government identity & address verification (Aadhaar / PAN Audit) before submitting an international visa application.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto text-left space-y-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#4848F7] flex items-center justify-center font-bold shrink-0">1</div>
                      <div>
                        <p className="font-bold text-slate-900">Government Identity Numbers</p>
                        <p className="text-slate-500 text-[11px]">Valid Aadhaar Card (12 Digits) & PAN Card Number</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#4848F7] flex items-center justify-center font-bold shrink-0">2</div>
                      <div>
                        <p className="font-bold text-slate-900">Document Scan Proofs</p>
                        <p className="text-slate-500 text-[11px]">Front/Back Govt ID Scan & Utility Bill Address Proof</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setShowCompleteKycModal(true)}
                      className="bg-[#4848F7] hover:bg-[#3838E6] text-white font-extrabold px-8 py-3.5 rounded-2xl text-xs transition shadow-lg shadow-blue-500/20 cursor-pointer flex items-center gap-2 mx-auto"
                    >
                      <ShieldCheck size={18} />
                      <span>Complete KYC Verification Now</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )
            ) : (
              <ApplicantApplyVisa
                onAddApplication={(appData: any) => {
                  const givenName = appData.personalDetails?.givenName || appData.givenName || "";
                  const surname = appData.personalDetails?.surname || appData.surname || "";
                  const travelerName = (givenName || surname)
                    ? `${givenName} ${surname}`.trim()
                    : appData.travelerName || "New Traveler";

                  const destination = appData.countryName || appData.destination || "Canada";
                  const visaType = appData.visaTypeName || appData.visaType || "Tourist Visa";
                  const passportNumber = appData.passportDetails?.passportNo || appData.passportNumber || "Z9817264";
                  const passportExpiry = appData.passportDetails?.expiryDate || appData.passportExpiry || "2033-12-20";
                  const dob = appData.personalDetails?.dob || appData.dob || "1995-06-12";
                  const nationality = appData.personalDetails?.nationality || appData.nationality || "Indian";
                  
                  const travelDates = (appData.travelDetails?.travelDate && appData.travelDetails?.returnDate)
                    ? `${appData.travelDetails.travelDate} to ${appData.travelDetails.returnDate}`
                    : appData.travelDates || "15 Oct 2026 to 15 Nov 2026";
                  
                  const fees = appData.pricing?.totalAmount || appData.fees || 11000;

                  addApplication({
                    travelerName,
                    dob,
                    passportNumber,
                    passportExpiry,
                    nationality,
                    destination,
                    visaType,
                    travelDates,
                    status: appData.status || "Submitted",
                    fees,
                    verifiedDocs: appData.verifiedDocs || {
                      passport: "pending",
                      photo: "pending"
                    },
                    documentsSubmitted: true,
                    kycCompleted: true
                  });
                }}
                onNavigateDrafts={() => {
                  handleTabChange("applications", "Submitted");
                  setAppFilter("Submitted");
                }}
                onNavigatePayment={() => {
                  handleTabChange("payments", "history");
                  setPaymentSubTab("history");
                }}
              />
            )
          )}

          {/* MY APPLICATIONS VIEW */}
          {customerTab === "applications" && (appFilter === "all" || !appFilter || (appFilter as string) === "all") && (
            <ApplicantAllApplications
              applications={applications}
              onSelectAppForTracking={(appId) => setSelectedAppId(appId)}
              onNavigateApply={() => setCustomerTab("apply")}
              onNavigateSupport={() => setCustomerTab("support")}
              onUpdateDocs={updateApplicationDocs}
            />
          )}

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

          {customerTab === "applications" && appFilter === "Under Review" && (
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

          {customerTab === "applications" && appFilter === "Cancelled" && (
            <ApplicantCancelledApplications
              applications={applications}
              onNavigateApply={() => setCustomerTab("apply")}
              onNavigatePayments={() => setCustomerTab("payments")}
            />
          )}

          {/* DOCUMENTS VIEW */}
          {customerTab === "documents" && (
            <div>
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
            </div>
          )}

          {/* PAYMENTS VIEW */}
          {customerTab === "payments" && (
            <ApplicantPaymentHistory
              applications={applications}
              onNavigateSupport={() => setCustomerTab("support")}
            />
          )}

          {/* APPOINTMENTS VIEW */}
          {customerTab === "appointments" && (
            <ApplicantAppointments
              applications={applications}
              onNavigateApply={() => setCustomerTab("apply")}
              onNavigateSupport={() => setCustomerTab("support")}
            />
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
            <div>
              {exploreSubTab === "types" && (
                <ApplicantVisaTypes
                  onNavigateApply={() => handleTabChange("apply")}
                  onNavigateSupport={() => handleTabChange("support")}
                />
              )}
              {exploreSubTab === "processing" && (
                <ApplicantVisaProcessingTime
                  onNavigateApply={() => handleTabChange("apply")}
                  onNavigateSupport={() => handleTabChange("support")}
                />
              )}
              {exploreSubTab === "fees" && (
                <ApplicantVisaFees
                  onNavigateApply={() => handleTabChange("apply")}
                  onNavigateCheckout={() => {
                    handleTabChange("payments");
                    setPaymentSubTab("history");
                  }}
                  onNavigateSupport={() => handleTabChange("support")}
                />
              )}
              {exploreSubTab === "countries" && (
                <ApplicantExploreCountries
                  onSelectCountryToApply={(country) => {
                    handleTabChange("apply");
                  }}
                  onNavigateSupport={() => handleTabChange("support")}
                />
              )}
            </div>
          )}

          {/* SUPPORT VIEW */}
          {customerTab === "support" && (
            <ApplicantSupport
              applications={applications}
              onNavigateAppointments={() => handleTabChange("appointments")}
            />
          )}

          {/* PROFILE VIEW */}
          {customerTab === "profile" && (
            <ApplicantProfile
              userSession={authSession}
              onNavigateDocuments={() => {
                handleTabChange("documents");
                setDocSubTab("upload");
              }}
              onNavigateApply={() => handleTabChange("apply")}
            />
          )}

          {/* SETTINGS VIEW */}
          {customerTab === "settings" && (
            <ApplicantSettings
              onNavigatePayments={() => {
                handleTabChange("payments");
                setPaymentSubTab("history");
              }}
              onNavigateSupport={() => handleTabChange("support")}
              onNavigateProfile={() => handleTabChange("profile")}
            />

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
            setKycCompletedState(true);
            if (typeof window !== "undefined") {
              localStorage.setItem("phantom_customer_kyc_completed", "true");
            }
            if (fetchApplicantDashboardData) fetchApplicantDashboardData();
          }}
        />
      )}
    </div>
  );
}
