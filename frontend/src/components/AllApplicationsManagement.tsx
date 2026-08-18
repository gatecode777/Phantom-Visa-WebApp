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
  CheckSquare,
  ExternalLink,
  Copy,
  ImageIcon
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
  | "Submitted"
  | "Draft"
  | "Pending Review"
  | "Under Review"
  | "Document Pending"
  | "Docs Pending"
  | "Embassy Processing"
  | "Awaiting Payment"
  | "Processing"
  | "Approved"
  | "Rejected"
  | "Cancelled"
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
  documents?: {
    name: string;
    status: string;
    url?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: string;
    format?: string;
    documentType?: string;
    uploadedAt?: string;
  }[];
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
  "Action Notes"
];
export const APPLICATION_MODAL_TABS = RECOMMENDED_APPLICATION_TABS;

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

const MOCK_APPLICATIONS: ApplicationRecord[] = [];

const mapMongoAppToRecord = (app: any): ApplicationRecord => ({
  id: app._id || app.applicationId || String(Math.random()),
  appId: app.applicationId || `VO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
  applicantName: app.personalDetails ? `${app.personalDetails.givenName} ${app.personalDetails.surname}` : app.travelerName || "Applicant",
  firstName: app.personalDetails?.givenName || app.travelerName?.split(" ")[0] || "Applicant",
  lastName: app.personalDetails?.surname || app.travelerName?.split(" ").slice(1).join(" ") || "",
  passportNumber: app.passportDetails?.passportNo || app.passportNumber || "Z9817264",
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
  amountPaid: app.pricing?.totalAmount ? `₹${Number(app.pricing.totalAmount).toLocaleString("en-IN")}` : `₹${Number(app.fees || 0).toLocaleString("en-IN")}`,
  documents: Array.isArray(app.uploadedDocuments) && app.uploadedDocuments.length > 0
    ? app.uploadedDocuments.map((d: any) => {
        const fileUrl = d.fileUrl || "https://ik.imagekit.io/phantomvisa/sample_passport.png";
        const isImg = fileUrl.toLowerCase().endsWith(".png") || fileUrl.toLowerCase().endsWith(".jpg") || fileUrl.toLowerCase().endsWith(".jpeg") || fileUrl.toLowerCase().endsWith(".webp");
        return {
          name: d.title || d.fileName || d.documentType || "Applicant Document",
          status: d.status ? (d.status.charAt(0).toUpperCase() + d.status.slice(1).replace("_", " ")) : (d.fileUrl ? "Verified" : "Pending"),
          fileUrl,
          fileName: d.fileName || `${(d.title || "document").toLowerCase().replace(/\s+/g, "_")}.${isImg ? "png" : "pdf"}`,
          fileSize: d.fileSize || (isImg ? "1.8 MB" : "2.4 MB"),
          format: d.format || (isImg ? "Image Scan (PNG)" : "PDF Document"),
          documentType: d.documentType || (isImg ? "Identity Document" : "PDF Document"),
          uploadedAt: d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString("en-IN") : "2026-08-01"
        };
      })
    : []
});

export default function AllApplicationsManagement() {
  const { applications: contextApps, authSession, currentRole } = useVisa();

  const isAgent = currentRole === "Agent" || authSession?.user?.role === "Agent";
  const agentId = authSession?.user?.agentId || "AGT-1001";
  const agentAgencyName = authSession?.user?.agencyName || authSession?.user?.name || "Assigned Agency";

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
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Category Pill Filter Tabs State
  const [activeCategoryTab, setActiveCategoryTab] = useState<
    "all" | "new" | "under_review" | "approved" | "rejected" | "completed" | "pool"
  >("all");

  // Fetch live MongoDB applications on mount, role, tab, or agent change
  const fetchLiveApps = async (isPoolTab = false) => {
    try {
      let url = `${API_V1_URL}/applications`;
      if (isPoolTab) {
        url += `?pool=available`;
      } else if (isAgent) {
        url += `?agentId=${encodeURIComponent(agentId)}`;
      }

      const headers: Record<string, string> = {};
      if (authSession?.token) {
        headers["Authorization"] = `Bearer ${authSession.token}`;
      }

      const res = await fetch(url, { headers });
      const json = await res.json();
      if (res.ok && Array.isArray(json.data)) {
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

  useEffect(() => {
    fetchLiveApps(activeCategoryTab === "pool");
  }, [contextApps, isAgent, agentId, activeCategoryTab]);

  // Centered Details Popup Modal State
  const [activeModalApp, setActiveModalApp] = useState<ApplicationRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // Admin Agent Assignment State
  const [availableAgents, setAvailableAgents] = useState<{
    agentId: string;
    fullName: string;
    agencyName: string;
    supportedVisaCountries?: string[];
    status?: string;
  }[]>([]);
  const [isEditingAgent, setIsEditingAgent] = useState<boolean>(false);
  const [selectedAssignAgentId, setSelectedAssignAgentId] = useState<string>("");
  const [isSavingAssignment, setIsSavingAssignment] = useState<boolean>(false);

  // Fetch all active agents for Admin assignment option
  useEffect(() => {
    fetch(`${API_V1_URL}/agent/all`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          const active = json.data
            .filter((a: any) => a.status === "Active" || !a.status)
            .map((a: any) => ({
              agentId: a.agentId || a.id || String(a._id || ""),
              fullName: a.fullName || a.name || "Agent",
              agencyName: a.agencyName || "",
              supportedVisaCountries: Array.isArray(a.supportedVisaCountries) ? a.supportedVisaCountries : [],
              status: a.status
            }));
          setAvailableAgents(active);
        }
      })
      .catch((err) => console.warn("Failed to load agents list for assignment:", err));
  }, []);

  // Admin Assign / Reassign Agent Handler
  const handleAssignAgentToApp = async (appId: string, targetAgentId: string) => {
    if (!appId) return;
    setIsSavingAssignment(true);
    try {
      let targetAgentName = "";
      if (targetAgentId && targetAgentId !== "unassign") {
        const found = availableAgents.find((a) => a.agentId === targetAgentId);
        targetAgentName = found
          ? (found.agencyName || found.fullName || targetAgentId)
          : targetAgentId;
      }

      const res = await fetch(`${API_V1_URL}/applications/${appId}/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(authSession?.token ? { Authorization: `Bearer ${authSession.token}` } : {})
        },
        body: JSON.stringify({
          agentId: targetAgentId === "unassign" ? "" : targetAgentId,
          agentName: targetAgentName
        })
      });

      const json = await res.json();
      if (res.ok) {
        const updatedAgentId = targetAgentId === "unassign" ? "" : targetAgentId;
        const updatedAgentName = targetAgentName;

        // Update active modal app
        if (activeModalApp && (activeModalApp.appId === appId || activeModalApp.id === appId)) {
          setActiveModalApp({
            ...activeModalApp,
            assignedAgentId: updatedAgentId,
            assignedAgentName: updatedAgentName,
            agentName: updatedAgentName,
            status: updatedAgentId ? "Under Review" : activeModalApp.status
          });
        }

        // Update list of applications in table
        setApplications((prev) =>
          prev.map((a) =>
            a.appId === appId || a.id === appId
              ? {
                  ...a,
                  assignedAgentId: updatedAgentId,
                  assignedAgentName: updatedAgentName,
                  agentName: updatedAgentName,
                  status: updatedAgentId ? "Under Review" : a.status
                }
              : a
          )
        );

        setIsEditingAgent(false);
        triggerToast(json.message || "Agent assignment updated successfully!");
      } else {
        triggerToast(json.error?.message || "Failed to update agent assignment.");
      }
    } catch (err) {
      console.error("Agent assignment error:", err);
      triggerToast("Error updating agent assignment.");
    } finally {
      setIsSavingAssignment(false);
    }
  };

  // ImageKit Document Preview Lightbox State
  const [previewDocument, setPreviewDocument] = useState<{
    name: string;
    fileUrl: string;
    format?: string;
    status?: string;
    fileSize?: string;
    documentType?: string;
  } | null>(null);

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

  // Claim unassigned application from pool
  const handleClaimApplication = async (app: ApplicationRecord) => {
    try {
      const res = await fetch(`${API_V1_URL}/applications/${app.appId || app.id}/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(authSession?.token ? { Authorization: `Bearer ${authSession.token}` } : {})
        },
        body: JSON.stringify({
          agentId,
          agentName: agentAgencyName
        })
      });
      const json = await res.json();
      if (res.ok) {
        triggerToast(`Application ${app.appId} claimed and assigned to your queue!`);
        fetchLiveApps(activeCategoryTab === "pool");
      } else {
        triggerToast(json.message || "Failed to claim application.");
      }
    } catch (err) {
      console.error("Error claiming application:", err);
      triggerToast("Failed to claim application.");
    }
  };

  // Mutually Exclusive Category Counts that sum strictly to total applications
  const allCount = applications.length;
  const newCount = applications.filter((a) => a.status === "Submitted" || a.status === "Draft").length;
  const underReviewCount = applications.filter((a) => ["Under Review", "Docs Pending", "Embassy Processing", "Processing"].includes(a.status)).length;
  const approvedCount = applications.filter((a) => a.status === "Approved").length;
  const rejectedCount = applications.filter((a) => a.status === "Rejected" || a.status === "Cancelled").length;
  const completedCount = applications.filter((a) => a.status === "Completed").length;

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

    // Tab category match (mutually exclusive)
    let matchesCategoryTab = true;
    if (activeCategoryTab === "new") {
      matchesCategoryTab = app.status === "Submitted" || app.status === "Draft";
    } else if (activeCategoryTab === "under_review") {
      matchesCategoryTab = ["Under Review", "Docs Pending", "Embassy Processing", "Processing"].includes(app.status);
    } else if (activeCategoryTab === "approved") {
      matchesCategoryTab = app.status === "Approved";
    } else if (activeCategoryTab === "rejected") {
      matchesCategoryTab = app.status === "Rejected" || app.status === "Cancelled";
    } else if (activeCategoryTab === "completed") {
      matchesCategoryTab = app.status === "Completed";
    }

    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    const matchesPayment = paymentFilter === "All" || app.paymentStatus === paymentFilter;
    const matchesAppliedBy = appliedByFilter === "All" || app.appliedBy === appliedByFilter;
    const matchesCountry = countryFilter === "All" || app.country === countryFilter;
    const matchesCategory = categoryFilter === "All" || app.category === categoryFilter;
    const matchesPriority = priorityFilter === "All" || app.priority === priorityFilter;

    return (
      matchesQuery &&
      matchesCategoryTab &&
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
              {isAgent ? `Assigned Workload Queue • ${agentId}` : "Global Application Operations Center"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            {isAgent ? "My Assigned Visa Applications" : "Visa Applications"}
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            {isAgent
              ? `Manage, inspect, and process visa applications assigned directly to your agency queue (${agentAgencyName}).`
              : "Track, filter, and manage all visa applications across every stage, country, and applicant category."}
          </p>
        </div>
      </div>

      {/* TOP INTERACTIVE STATISTICS CARDS (CLICK TO FILTER) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 MUTUALLY EXCLUSIVE METRIC TILES */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {/* Total Applications Card */}
          <button
            type="button"
            onClick={() => setActiveCategoryTab("all")}
            className={`text-left p-4 rounded-3xl border transition-all cursor-pointer hover:shadow-md ${
              activeCategoryTab === "all"
                ? "bg-blue-50/50 border-[#2563EB] ring-2 ring-[#2563EB]/30 shadow-sm"
                : "bg-white border-slate-200 shadow-2xs hover:border-slate-300"
            }`}
          >
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Applications</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{allCount}</div>
            <span className="text-[10px] text-[#2563EB] font-bold">{isAgent ? "Assigned Queue" : "Global Total"}</span>
          </button>

          {/* New / Submitted Card */}
          <button
            type="button"
            onClick={() => setActiveCategoryTab("new")}
            className={`text-left p-4 rounded-3xl border transition-all cursor-pointer hover:shadow-md ${
              activeCategoryTab === "new"
                ? "bg-amber-50/50 border-amber-500 ring-2 ring-amber-500/30 shadow-sm"
                : "bg-white border-slate-200 shadow-2xs hover:border-slate-300"
            }`}
          >
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">New / Submitted</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{newCount}</div>
            <span className="text-[10px] text-amber-600 font-bold">Awaiting Audit</span>
          </button>

          {/* Under Review Card */}
          <button
            type="button"
            onClick={() => setActiveCategoryTab("under_review")}
            className={`text-left p-4 rounded-3xl border transition-all cursor-pointer hover:shadow-md ${
              activeCategoryTab === "under_review"
                ? "bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/30 shadow-sm"
                : "bg-white border-slate-200 shadow-2xs hover:border-slate-300"
            }`}
          >
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Under Review</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{underReviewCount}</div>
            <span className="text-[10px] text-blue-600 font-bold">In Processing</span>
          </button>

          {/* Approved Card */}
          <button
            type="button"
            onClick={() => setActiveCategoryTab("approved")}
            className={`text-left p-4 rounded-3xl border transition-all cursor-pointer hover:shadow-md ${
              activeCategoryTab === "approved"
                ? "bg-emerald-50/50 border-emerald-500 ring-2 ring-emerald-500/30 shadow-sm"
                : "bg-white border-slate-200 shadow-2xs hover:border-slate-300"
            }`}
          >
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Approved</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{approvedCount}</div>
            <span className="text-[10px] text-emerald-600 font-bold">Visas Granted</span>
          </button>

          {/* Rejected Card */}
          <button
            type="button"
            onClick={() => setActiveCategoryTab("rejected")}
            className={`text-left p-4 rounded-3xl border transition-all cursor-pointer hover:shadow-md ${
              activeCategoryTab === "rejected"
                ? "bg-red-50/50 border-red-500 ring-2 ring-red-500/30 shadow-sm"
                : "bg-white border-slate-200 shadow-2xs hover:border-slate-300"
            }`}
          >
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Rejected</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{rejectedCount}</div>
            <span className="text-[10px] text-red-600 font-bold">Refused Visas</span>
          </button>

          {/* Completed & Issued Card */}
          <button
            type="button"
            onClick={() => setActiveCategoryTab("completed")}
            className={`text-left p-4 rounded-3xl border transition-all cursor-pointer hover:shadow-md ${
              activeCategoryTab === "completed"
                ? "bg-teal-50/50 border-teal-500 ring-2 ring-teal-500/30 shadow-sm"
                : "bg-white border-slate-200 shadow-2xs hover:border-slate-300"
            }`}
          >
            <span className="text-[10px] font-extrabold uppercase text-teal-700 block mb-1">Completed & Issued</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{completedCount}</div>
            <span className="text-[10px] text-teal-700 font-bold">Passport Delivered</span>
          </button>
        </div>

        {/* RIGHT CARD: RECOMMENDED TABS & WORKFLOW FLOW */}
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

      {/* CATEGORY FILTER PILL TABS BAR (MERGED SUB-MENU IN PLACE) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-3 shadow-2xs mb-6 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <button
            type="button"
            onClick={() => setActiveCategoryTab("all")}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
              activeCategoryTab === "all"
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <span>{isAgent ? "My Assigned Workload" : "All Applications"}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeCategoryTab === "all" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
            }`}>
              {allCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab("new")}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
              activeCategoryTab === "new"
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <span>New / Submitted</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeCategoryTab === "new" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"
            }`}>
              {newCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab("under_review")}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
              activeCategoryTab === "under_review"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <span>Under Review</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeCategoryTab === "under_review" ? "bg-white/20 text-white" : "bg-blue-100 text-blue-800"
            }`}>
              {underReviewCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab("approved")}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
              activeCategoryTab === "approved"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <span>Approved</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeCategoryTab === "approved" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
            }`}>
              {approvedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab("rejected")}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
              activeCategoryTab === "rejected"
                ? "bg-rose-600 text-white shadow-md shadow-rose-500/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <span>Rejected</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeCategoryTab === "rejected" ? "bg-white/20 text-white" : "bg-rose-100 text-rose-800"
            }`}>
              {rejectedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab("completed")}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
              activeCategoryTab === "completed"
                ? "bg-teal-600 text-white shadow-md shadow-teal-500/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <span>Completed</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeCategoryTab === "completed" ? "bg-white/20 text-white" : "bg-teal-100 text-teal-800"
            }`}>
              {completedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab("pool")}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
              activeCategoryTab === "pool"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "bg-slate-50 hover:bg-purple-50 text-purple-700 border border-purple-200/60"
            }`}
          >
            <span>Available for Pickup</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
              Pool
            </span>
          </button>
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
                placeholder="APP-100451, Swapnil, Z9817264..."
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
                        <button
                          type="button"
                          onClick={() => {
                            setActiveModalApp(a);
                            setIsEditingAgent(true);
                            const countryMatch = availableAgents.find((ag) =>
                              (ag.supportedVisaCountries || []).some(
                                (c) => c.toLowerCase() === a.country.toLowerCase()
                              )
                            );
                            setSelectedAssignAgentId(countryMatch ? countryMatch.agentId : availableAgents[0]?.agentId || "");
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200 transition cursor-pointer"
                          title="Click to assign an agent"
                        >
                          <UserCheck size={12} className="text-amber-700" />
                          <span>Assign Agent</span>
                        </button>
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
                        {activeCategoryTab === "pool" && isAgent ? (
                          <button
                            onClick={() => handleClaimApplication(a)}
                            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                            title="Claim and assign this application to your queue"
                          >
                            <UserCheck size={14} /> Claim to My Queue
                          </button>
                        ) : null}
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
                    {isEditingAgent ? (
                      <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200 col-span-1 sm:col-span-2 lg:col-span-3 space-y-2.5 animate-in fade-in duration-150 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase text-blue-700 flex items-center gap-1.5">
                            <UserCheck size={13} className="text-[#2563EB]" />
                            Assign / Change Agent for Destination: <strong>{activeModalApp.country}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsEditingAgent(false)}
                            className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                            title="Close"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <select
                            value={selectedAssignAgentId}
                            onChange={(e) => setSelectedAssignAgentId(e.target.value)}
                            className="flex-1 bg-white border border-blue-300 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                          >
                            <option value="">-- Select an Agent to Assign --</option>
                            <option value="unassign">Unassign Agent (Move to Available Pool)</option>
                            {availableAgents.map((agent) => (
                              <option key={agent.agentId} value={agent.agentId}>
                                {agent.agencyName || agent.fullName}
                              </option>
                            ))}
                          </select>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              disabled={isSavingAssignment}
                              onClick={() => handleAssignAgentToApp(activeModalApp.appId || activeModalApp.id, selectedAssignAgentId)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                            >
                              {isSavingAssignment ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
                              <span>Save Assignment</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsEditingAgent(false)}
                              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : activeModalApp.assignedAgentName ? (
                      <div className="bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-200 col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase text-indigo-600 block mb-1">Assigned Agent</span>
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4848F7] to-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                              {activeModalApp.assignedAgentName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <strong className="text-indigo-900 font-bold text-xs block leading-tight">{activeModalApp.assignedAgentName}</strong>
                              <span className="text-[10px] font-mono text-indigo-500 font-semibold">{activeModalApp.assignedAgentId}</span>
                            </div>
                          </div>
                        </div>
                        {!isAgent && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAssignAgentId(activeModalApp.assignedAgentId || "");
                              setIsEditingAgent(true);
                            }}
                            className="px-3 py-1.5 bg-white hover:bg-indigo-100/70 text-indigo-700 hover:text-indigo-900 border border-indigo-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-center"
                          >
                            <Edit3 size={13} />
                            <span>Reassign Agent</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-extrabold uppercase text-amber-800">Assigned Agent</span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-200 text-amber-900">
                              Unassigned Pool
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-800">Auto-assign / None selected</p>
                          <p className="text-[10px] text-amber-800 mt-0.5">
                            No agent was auto-assigned for <strong>{activeModalApp.country}</strong>. You can manually assign an agent to handle this application.
                          </p>
                        </div>
                        {!isAgent && (
                          <button
                            type="button"
                            onClick={() => {
                              const countryMatch = availableAgents.find((a) =>
                                (a.supportedVisaCountries || []).some(
                                  (c) => c.toLowerCase() === activeModalApp.country.toLowerCase()
                                )
                              );
                              setSelectedAssignAgentId(countryMatch ? countryMatch.agentId : availableAgents[0]?.agentId || "");
                              setIsEditingAgent(true);
                            }}
                            className="px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0 self-start sm:self-center"
                          >
                            <UserCheck size={14} />
                            <span>Assign Agent</span>
                          </button>
                        )}
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
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <FileText size={15} className="text-[#2563EB]" /> Applicant Uploaded Documents (ImageKit CDN Hosted)
                    </h4>
                    <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      ImageKit Storage Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(activeModalApp.documents && activeModalApp.documents.length > 0 ? activeModalApp.documents : [
                      { name: "Passport Copy (Bio Page)", status: "Verified", fileUrl: "https://ik.imagekit.io/phantomvisa/sample_passport.png", fileName: "passport_bio_page.png", fileSize: "2.4 MB", format: "Image Scan (PNG)", documentType: "Passport Copy" },
                      { name: "Financial Affidavit & Solvency Proof", status: "Verified", fileUrl: "https://ik.imagekit.io/phantomvisa/sample_bank.pdf", fileName: "financial_solvency_affidavit.pdf", fileSize: "3.1 MB", format: "PDF Document", documentType: "Bank Statement" }
                    ]).map((doc, idx) => {
                      const targetUrl = doc.fileUrl || doc.url || "https://ik.imagekit.io/phantomvisa/sample_passport.png";
                      const isImg = targetUrl.toLowerCase().endsWith(".png") || targetUrl.toLowerCase().endsWith(".jpg") || targetUrl.toLowerCase().endsWith(".jpeg") || targetUrl.toLowerCase().endsWith(".webp");
                      return (
                        <div key={idx} className="p-3.5 bg-slate-50 hover:bg-blue-50/30 border border-slate-200 hover:border-blue-300 rounded-2xl transition flex flex-col justify-between gap-3 shadow-2xs">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#2563EB] flex items-center justify-center font-bold shrink-0">
                                {isImg ? <ImageIcon size={18} /> : <FileText size={18} />}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 text-xs block leading-tight">{doc.name}</span>
                                <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                                  {doc.format || (isImg ? "Image Scan (PNG)" : "PDF Document")} &bull; {doc.fileSize || "2.4 MB"}
                                </span>
                              </div>
                            </div>
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 ${doc.status === "Verified" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                              {doc.status}
                            </span>
                          </div>

                          {/* IMAGEKIT CDN ASSET LINK & ACTION BUTTONS */}
                          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 truncate max-w-[140px] sm:max-w-[180px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              <span className="truncate">{targetUrl}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => setPreviewDocument({ name: doc.name, fileUrl: targetUrl, format: doc.format, status: doc.status, fileSize: doc.fileSize, documentType: doc.documentType })}
                                className="px-2.5 py-1 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                                title="Preview Document in Lightbox"
                              >
                                <Eye size={12} /> View File
                              </button>
                              <a
                                href={targetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 bg-white hover:bg-slate-100 text-slate-600 hover:text-[#2563EB] border border-slate-200 rounded-lg transition cursor-pointer"
                                title="Open direct ImageKit CDN URL in new tab"
                              >
                                <ExternalLink size={13} />
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(targetUrl);
                                  triggerToast(`ImageKit link for ${doc.name} copied to clipboard!`);
                                }}
                                className="p-1 bg-white hover:bg-slate-100 text-slate-600 hover:text-[#2563EB] border border-slate-200 rounded-lg transition cursor-pointer"
                                title="Copy ImageKit URL"
                              >
                                <Copy size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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

      {/* INTERACTIVE IMAGEKIT DOCUMENT PREVIEW LIGHTBOX */}
      {previewDocument && (
        <div className="fixed inset-0 z-[10000] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            {/* LIGHTBOX HEADER */}
            <div className="bg-[#0E1A2C] text-white p-4 px-6 flex items-center justify-between gap-4 border-b border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#2563EB]/20 text-[#2563EB] flex items-center justify-center shrink-0">
                  <FileText size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold text-white truncate font-outfit">{previewDocument.name}</h3>
                  <span className="text-[10px] text-blue-200 font-mono flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    ImageKit CDN Asset &bull; {previewDocument.fileUrl}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewDocument.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <ExternalLink size={13} /> Open in New Tab
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(previewDocument.fileUrl);
                    triggerToast("ImageKit asset URL copied to clipboard!");
                  }}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
                  title="Copy ImageKit URL"
                >
                  <Copy size={15} />
                </button>
                <button
                  onClick={() => setPreviewDocument(null)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
                  title="Close Lightbox"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* LIGHTBOX PREVIEW BODY */}
            <div className="p-4 bg-slate-900 overflow-y-auto flex-1 flex items-center justify-center min-h-[420px]">
              {previewDocument.fileUrl.toLowerCase().endsWith(".png") ||
              previewDocument.fileUrl.toLowerCase().endsWith(".jpg") ||
              previewDocument.fileUrl.toLowerCase().endsWith(".jpeg") ||
              previewDocument.fileUrl.toLowerCase().endsWith(".webp") ? (
                <div className="p-2 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-center max-h-[550px]">
                  <img
                    src={previewDocument.fileUrl}
                    alt={previewDocument.name}
                    className="max-h-[500px] w-auto mx-auto rounded-xl object-contain shadow-2xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://ik.imagekit.io/phantomvisa/sample_passport.png";
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-full min-h-[480px] bg-slate-950 rounded-2xl overflow-hidden flex flex-col border border-slate-800">
                  <iframe
                    src={previewDocument.fileUrl}
                    title={previewDocument.name}
                    className="w-full h-[480px] rounded-2xl bg-white border-0"
                  />
                  <div className="p-2.5 bg-slate-900 text-center text-slate-400 text-xs flex items-center justify-center gap-2 border-t border-slate-800">
                    <span>If PDF preview does not display in browser:</span>
                    <a
                      href={previewDocument.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2563EB] font-bold underline hover:text-blue-400"
                    >
                      Click here to view directly on ImageKit CDN
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* LIGHTBOX FOOTER */}
            <div className="bg-white p-3.5 px-6 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500">Document Status:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  {previewDocument.status || "Verified"}
                </span>
              </div>
              <button
                onClick={() => setPreviewDocument(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
