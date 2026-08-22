"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { API_V1_URL } from "../config/api";
import {
  UnifiedTransactionRecord,
  INITIAL_UNIFIED_TRANSACTIONS,
  fetchUnifiedTransactions,
  updateTransactionStatusApi,
  updateInvoiceGstinApi
} from "../services/paymentService";
import {
  UnifiedAppointmentRecord,
  INITIAL_UNIFIED_APPOINTMENTS,
  fetchUnifiedAppointments,
  createAppointmentApi,
  updateAppointmentApi
} from "../services/appointmentService";
import {
  SupportTicketRecord,
  TicketMessage,
  fetchTickets
} from "../services/supportService";
import { fetchSystemSettings } from "../services/systemService";

export function formatINR(val: number, decimals: number = 0): string {
  if (isNaN(val) || val === null || val === undefined) return "0";
  const isNegative = val < 0;
  const absVal = Math.abs(val);
  const parts = absVal.toFixed(decimals).split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1];

  let formattedInt = integerPart;
  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);
    formattedInt = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  }
  const result = decimalPart ? `${formattedInt}.${decimalPart}` : formattedInt;
  return isNegative ? `-${result}` : result;
}

export type VisaStatus =
  | "Draft"
  | "Docs Pending"
  | "Document Pending"
  | "Submitted"
  | "Under Review"
  | "Embassy Processing"
  | "Approved"
  | "Rejected"
  | "Cancelled"
  | "Completed";

export interface ApplicationDocument {
  _id?: string;
  id?: string;
  requirementId?: string;
  title: string;
  documentType: string;
  isMandatory?: boolean;
  fileUrl: string;
  fileName?: string;
  fileSize?: string;
  format?: string;
  status: "uploaded" | "verified" | "needs_review" | "rejected" | "pending" | "not_uploaded";
  rejectionReason?: string;
  uploadedAt?: Date | string;
  verifiedBy?: string;
  verificationDate?: string;
  aiMatchScore?: number;
  ocrData?: any;
}

export interface Application {
  id: string;
  applicationId?: string;
  travelerName: string;
  dob: string;
  passportNumber: string;
  passportExpiry: string;
  nationality: string;
  destination: string;
  visaType: string;
  travelDates: string;
  status: VisaStatus;
  fees: number;
  submissionDate: string;
  reason?: string;
  verifiedDocs: {
    passport: "verified" | "needs_review" | "pending" | "uploading";
    photo: "verified" | "needs_review" | "pending" | "uploading";
    nocLetter?: "verified" | "needs_review" | "pending" | "uploading";
    sponsorLetter?: "verified" | "needs_review" | "pending" | "uploading";
  };
  uploadedDocuments?: ApplicationDocument[];
  checklist?: {
    employed: boolean;
    sponsored: boolean;
  };
  documentsSubmitted?: boolean;
  kycCompleted?: boolean;
}

export interface LedgerEntry {
  id: string;
  date: string;
  type: "deposit" | "debit" | "payout";
  amount: number;
  description: string;
  reference: string;
}

export interface Commission {
  id: string;
  date: string;
  applicationId: string;
  travelerName: string;
  amount: number;
  status: "pending" | "paid";
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  ipAddress: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  color: string;
  activeApplications: number;
}

export type SubscriptionTier = "Starter" | "Growth" | "Enterprise";

export interface ImpersonationState {
  isActive: boolean;
  targetCompanyId: string;
  targetCompanyName: string;
}

export interface WhiteLabelConfig {
  byoSmtpEnabled: boolean;
  smtpHost: string;
  byoPaymentEnabled: boolean;
  stripeActive: boolean;
  byoSmsEnabled: boolean;
  twilioActive: boolean;
}

export type AgentTab =
  | "dashboard"
  | "applications"
  | "applicants"
  | "doc_verification"
  | "payments"
  | "appointments"
  | "messages"
  | "notifications"
  | "reports"
  | "support"
  | "profile"
  | "settings"
  | "search"
  | "wizard"
  | "wallet"
  | "crm";

export type CustomerTab =
  | "dashboard"
  | "apply"
  | "applications"
  | "documents"
  | "payments"
  | "appointments"
  | "messages"
  | "notifications"
  | "explore"
  | "support"
  | "profile"
  | "settings";

export type AdminTab =
  | "dashboard"
  | "user_management"
  | "agent_management"
  | "visa_management"
  | "applications"
  | "documents"
  | "payments"
  | "appointments"
  | "messages"
  | "notifications"
  | "reports"
  | "system_settings"
  | "support"
  | "profile"
  | "companies"
  | "matrix"
  | "audit";

export interface AuthSession {
  user: {
    id: string;
    email?: string;
    phone?: string;
    name: string;
    role: "Admin" | "Agent" | "Staff" | "Applicant";
    agentId?: string;
    agencyName?: string;
    applicantId?: string;
  };
  token: string;
}

interface VisaContextType {
  authSession: AuthSession | null;
  loginSession: (session: AuthSession) => void;
  logoutSession: () => void;
  logoutAllSessions: () => Promise<void>;
  applications: Application[];
  walletBalance: number;
  ledger: LedgerEntry[];
  commissions: Commission[];
  auditLogs: AuditLog[];
  companies: Company[];
  currentRole: "Agent" | "Staff" | "Customer" | "Super Admin";
  permissions: { role: string; viewWallet: boolean; approveVisa: boolean; manageCompanies: boolean }[];
  agentTab: AgentTab;
  setAgentTab: (tab: AgentTab) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  customerTab: CustomerTab;
  setCustomerTab: (tab: CustomerTab) => void;
  setRole: (role: "Agent" | "Staff" | "Customer" | "Super Admin") => void;
  addApplication: (app: Omit<Application, "id" | "submissionDate">) => string;
  updateApplicationStatus: (id: string, status: VisaStatus, reason?: string) => void;
  updateApplicationDocs: (
    id: string,
    docKey: "passport" | "photo" | "nocLetter" | "sponsorLetter",
    status: "verified" | "needs_review" | "pending" | "uploading"
  ) => void;
  addFunds: (amount: number) => void;
  requestPayout: (amount: number) => boolean;
  togglePermission: (roleIndex: number, field: "viewWallet" | "approveVisa" | "manageCompanies") => void;

  applicantDashboardData: { greetingName: string; metrics: any; application: any } | null;
  fetchApplicantDashboardData: () => Promise<void>;

  // TIER 3 & ENHANCEMENT STATE EXTENSIONS
  subscriptionTier: SubscriptionTier;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  whiteLabelConfig: WhiteLabelConfig;
  updateWhiteLabelConfig: (config: Partial<WhiteLabelConfig>) => void;
  impersonationState: ImpersonationState;
  startImpersonation: (companyId: string, companyName: string) => void;
  stopImpersonation: () => void;
  featureFlags: { key: string; name: string; percentage: number; isActive: boolean }[];
  setFeatureFlagPercentage: (key: string, percentage: number) => void;

  // UNIFIED PAYMENT LEDGER STATE
  unifiedTransactions: UnifiedTransactionRecord[];
  updateUnifiedTransactionStatus: (id: string, status: string, reason?: string, amount?: number) => Promise<void>;
  updateUnifiedInvoiceGstin: (id: string, gstin: string, billingAddress?: string) => Promise<void>;
  addNewUnifiedTransaction: (txn: UnifiedTransactionRecord) => void;
  fetchUnifiedTransactionsList: () => Promise<void>;

  // UNIFIED APPOINTMENTS LEDGER STATE
  unifiedAppointments: UnifiedAppointmentRecord[];
  addUnifiedAppointment: (apt: UnifiedAppointmentRecord) => void;
  updateUnifiedAppointment: (id: string, changes: Partial<UnifiedAppointmentRecord>) => void;

  // UNIFIED SUPPORT TICKETS STATE
  unifiedTickets: SupportTicketRecord[];
  fetchSupportTickets: (userId?: string) => Promise<void>;
  addSupportTicket: (t: SupportTicketRecord) => void;
  updateSupportTicket: (ticketId: string, changes: Partial<SupportTicketRecord>) => void;
  appendTicketMessage: (ticketId: string, msg: TicketMessage) => void;
}

const VisaContext = createContext<VisaContextType | undefined>(undefined);

let auditCounter = 992;
let applicationCounter = 46;
let txnCounter = 9813;
let comCounter = 4;

export function VisaProvider({ children }: { children: React.ReactNode }) {
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => {
    try {
      const saved = localStorage.getItem("phantom_auth_session");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return null;
  });

  const [currentRole, setCurrentRole] = useState<"Agent" | "Staff" | "Customer" | "Super Admin">(() => {
    try {
      const saved = localStorage.getItem("phantom_auth_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        const roleMap: Record<string, "Agent" | "Staff" | "Customer" | "Super Admin"> = {
          Admin: "Super Admin",
          Applicant: "Customer",
          Staff: "Staff",
          Agent: "Agent"
        };
        return roleMap[parsed.user?.role] || "Customer";
      }
    } catch (e) {}
    return "Customer";
  });

  const [applicantDashboardData, setApplicantDashboardData] = useState<{
    greetingName: string;
    metrics: any;
    application: any;
  } | null>(null);

  // Unified Payment Ledger State
  const [unifiedTransactions, setUnifiedTransactions] = useState<UnifiedTransactionRecord[]>(INITIAL_UNIFIED_TRANSACTIONS);

  // Unified Appointments Ledger State
  const [unifiedAppointments, setUnifiedAppointments] = useState<UnifiedAppointmentRecord[]>(INITIAL_UNIFIED_APPOINTMENTS);

  // Fetch from MongoDB on mount — same pattern as fetchUnifiedTransactionsList
  const fetchUnifiedAppointmentsList = async () => {
    try {
      const data = await fetchUnifiedAppointments();
      if (Array.isArray(data)) {
        setUnifiedAppointments(data);
      } else {
        setUnifiedAppointments([]);
      }
    } catch (err) {
      console.error("Failed to fetch unified appointments list:", err);
      setUnifiedAppointments([]);
    }
  };

  useEffect(() => {
    fetchUnifiedAppointmentsList();
  }, []);

  // ── Unified Support Tickets State ──────────────────────────────────────────
  const [unifiedTickets, setUnifiedTickets] = useState<SupportTicketRecord[]>([]);

  const fetchSupportTickets = async (userId?: string) => {
    try {
      const data = await fetchTickets(userId);
      if (Array.isArray(data) && data.length > 0) {
        setUnifiedTickets(data);
      } else {
        // Provide canonical initial support tickets if backend returns empty
        setUnifiedTickets([
          {
            _id: "tkt_sample_1",
            ticketId: "TKT-2026-2295",
            createdByUserId: "6a71863c3b5de3ab19214912",
            createdByName: "Vibhu Sharma",
            applicationId: "VO-2026-5894",
            category: "Payment & Billing",
            subject: "Consular Payment Receipt & GST Invoice Query",
            priority: "High",
            status: "In Progress",
            assignedOfficerId: "OFF-204",
            assignedOfficerName: "Sarah Jenkins (Senior Auditor)",
            messages: [
              {
                messageId: "msg_1",
                senderUserId: "6a71863c3b5de3ab19214912",
                senderName: "Vibhu Sharma",
                senderRole: "applicant",
                text: "Hello, I completed the visa fee payment for application VO-2026-5894 via UPI. Could you please confirm if the consular tax invoice has been stamped?",
                timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
              },
              {
                messageId: "msg_2",
                senderUserId: "OFF-204",
                senderName: "Sarah Jenkins (Senior Auditor)",
                senderRole: "officer",
                text: "Hello Vibhu, your payment of ₹12,980 has been successfully reconciled. The GST tax invoice is now accessible in your Payments tab.",
                timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
              }
            ],
            slaBreached: false,
            firstResponseAt: new Date(Date.now() - 3600000 * 2).toISOString(),
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
          },
          {
            _id: "tkt_sample_2",
            ticketId: "TKT-2026-4821",
            createdByUserId: "6a71863c3b5de3ab19214912",
            createdByName: "Vibhu Sharma",
            applicationId: "VO-2026-9841",
            category: "Document Verification",
            subject: "Bank Statement Verification & Embassy Dispatch Status",
            priority: "Medium",
            status: "Resolved",
            assignedOfficerId: "OFF-102",
            assignedOfficerName: "Michael Chang (Consular Specialist)",
            messages: [
              {
                messageId: "msg_3",
                senderUserId: "6a71863c3b5de3ab19214912",
                senderName: "Vibhu Sharma",
                senderRole: "applicant",
                text: "Could you please confirm if my 6-month bank statement proof has cleared the AI OCR audit?",
                timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
              },
              {
                messageId: "msg_4",
                senderUserId: "OFF-102",
                senderName: "Michael Chang (Consular Specialist)",
                senderRole: "officer",
                text: "Yes, your bank balance proof of ₹5,00,000 has passed document verification and has been queued for consular dispatch.",
                timestamp: new Date(Date.now() - 86400000 * 2 + 1800000).toISOString()
              }
            ],
            slaBreached: false,
            firstResponseAt: new Date(Date.now() - 86400000 * 2 + 1800000).toISOString(),
            resolvedAt: new Date(Date.now() - 86400000).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString()
          }
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch support tickets:", err);
    }
  };

  useEffect(() => {
    fetchSupportTickets();
  }, []);

  /** Optimistic-add: reflect in UI immediately */
  const addSupportTicket = (t: SupportTicketRecord) => {
    setUnifiedTickets((prev) => {
      const exists = prev.some((x) => x.ticketId === t.ticketId);
      if (exists) return prev;
      return [t, ...prev];
    });
  };

  /** Optimistic-update: patch an existing ticket */
  const updateSupportTicket = (ticketId: string, changes: Partial<SupportTicketRecord>) => {
    setUnifiedTickets((prev) =>
      prev.map((t) => (t.ticketId === ticketId ? { ...t, ...changes } : t))
    );
  };

  /** Optimistic-append: add a new message to a ticket's thread */
  const appendTicketMessage = (ticketId: string, msg: TicketMessage) => {
    setUnifiedTickets((prev) =>
      prev.map((t) =>
        t.ticketId === ticketId
          ? { ...t, messages: [...t.messages, msg], updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  /**
   * Optimistic-add: update UI instantly, then persist to MongoDB.
   * If the API call fails, the record still lives in React state for
   * the current session (no rollback needed for a booking flow).
   */
  const addUnifiedAppointment = (apt: UnifiedAppointmentRecord) => {
    setUnifiedAppointments((prev) => {
      const exists = prev.some((a) => a.id === apt.id || a.aptId === apt.aptId);
      if (exists) return prev;
      return [apt, ...prev];
    });
    // Fire-and-forget persist to MongoDB
    createAppointmentApi(apt).catch((err) =>
      console.error("createAppointmentApi failed:", err)
    );
  };

  /**
   * Optimistic-update: reflect change in UI immediately, then persist to MongoDB.
   */
  const updateUnifiedAppointment = (id: string, changes: Partial<UnifiedAppointmentRecord>) => {
    setUnifiedAppointments((prev) =>
      prev.map((a) => (a.id === id || a.aptId === id ? { ...a, ...changes } : a))
    );
    // Determine the canonical aptId to send to the API
    const aptId = id.startsWith("APT-") ? id : (unifiedAppointments.find(a => a.id === id)?.aptId ?? id);
    updateAppointmentApi(aptId, changes).catch((err) =>
      console.error("updateAppointmentApi failed:", err)
    );
  };

  const fetchUnifiedTransactionsList = async () => {
    try {
      const data = await fetchUnifiedTransactions();
      if (Array.isArray(data)) {
        setUnifiedTransactions(data);
      } else {
        setUnifiedTransactions([]);
      }
    } catch (err) {
      console.error("Failed to fetch unified transactions list:", err);
      setUnifiedTransactions([]);
    }
  };

  useEffect(() => {
    fetchUnifiedTransactionsList();
  }, []);

  const updateUnifiedTransactionStatus = async (id: string, status: string, reason?: string, amount?: number) => {
    setUnifiedTransactions((prev) =>
      prev.map((t) => {
        if (t.id === id || t.transactionId === id) {
          const updated: UnifiedTransactionRecord = { ...t, status: status as any };
          if (status === "Refunded") {
            updated.refundDetails = {
              status: "Refunded",
              amount: amount || t.pricing.netAmount,
              date: new Date().toISOString().split("T")[0],
              refNo: `RFD-${Math.floor(10000 + Math.random() * 90000)}`,
              reason: reason || "Approved Refund Request"
            };
          }
          return updated;
        }
        return t;
      })
    );
    await updateTransactionStatusApi(id, status, reason, amount);
  };

  const updateUnifiedInvoiceGstin = async (id: string, gstin: string, billingAddress?: string) => {
    const cleanGstin = gstin.trim().toUpperCase();
    setUnifiedTransactions((prev) =>
      prev.map((t) => {
        if (t.id === id || t.transactionId === id || t.invoiceNo === id) {
          return {
            ...t,
            gstin: cleanGstin,
            billingAddress: billingAddress ? billingAddress.trim() : t.billingAddress
          };
        }
        return t;
      })
    );
    await updateInvoiceGstinApi(id, cleanGstin, billingAddress);
  };

  const addNewUnifiedTransaction = (txn: UnifiedTransactionRecord) => {
    setUnifiedTransactions((prev) => {
      const exists = prev.some((t) => t.transactionId === txn.transactionId || t.applicationId === txn.applicationId);
      if (exists) {
        return prev.map((t) => (t.applicationId === txn.applicationId ? { ...t, ...txn } : t));
      }
      return [txn, ...prev];
    });
  };

  const fetchApplicantDashboardData = async () => {
    try {
      const headers: Record<string, string> = {};
      if (authSession?.token) {
        headers.Authorization = `Bearer ${authSession.token}`;
      }
      const res = await fetch(`${API_V1_URL}/applicant/dashboard`, { headers });
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        // Only update dashboard data state if key values actually changed
        setApplicantDashboardData((prev) => {
          if (
            prev &&
            prev.greetingName === json.data.greetingName &&
            (prev as any).kycStatus === json.data.kycStatus &&
            JSON.stringify((prev as any).metrics) === JSON.stringify(json.data.metrics)
          ) {
            return prev; // no state update, no re-render
          }
          return json.data;
        });
        if (json.data.application) {
          const appData = json.data.application;
          setApplications((prev) => {
            const existing = prev.find((a) => a.id === appData.id);
            if (existing && existing.status === appData.status) {
              return prev; // same status — no new array, no re-render
            }
            if (existing) {
              return prev.map((a) => (a.id === appData.id ? { ...a, ...appData } : a));
            }
            return [appData, ...prev];
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch applicant dashboard:", err);
    }
  };

  const loginSession = (session: AuthSession) => {
    setAuthSession(session);
    try {
      localStorage.setItem("phantom_auth_session", JSON.stringify(session));
      localStorage.removeItem("customer_active_tab");
      localStorage.removeItem("customer_active_subtab");
    } catch (e) {}
    const roleMap: Record<string, "Agent" | "Staff" | "Customer" | "Super Admin"> = {
      Admin: "Super Admin",
      Applicant: "Customer",
      Staff: "Staff",
      Agent: "Agent"
    };
    const mappedRole = roleMap[session.user?.role] || "Customer";
    setCurrentRole(mappedRole);
    setCustomerTab("dashboard");
  };

  // Silent token refresh — does NOT call loginSession to avoid tab/role reset cascade
  const refreshSessionSilently = (token: string) => {
    setAuthSession((prev) => {
      if (!prev) return prev;
      const updated: AuthSession = { ...prev, token };
      try {
        localStorage.setItem("phantom_auth_session", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Restore & verify refresh token on application mount
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      try {
        const res = await fetch(`${API_V1_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });
        const json = await res.json();
        // Use silent refresh — only update the access token, never reset tab or trigger cascades
        if (res.ok && json.success) {
          const newToken = json.accessToken || json.data?.accessToken;
          if (newToken) {
            refreshSessionSilently(newToken);
          }
        }
      } catch (err) {
        // Silently preserve local session if offline or backend unavailable
      }
    };

    checkAndRefreshToken();
    fetchSystemSettings();
  }, []);

  // Fetch applicant dashboard data once on initial mount only
  // Do NOT depend on authSession.token — the silent refresh updates the token
  // but should not trigger a full dashboard re-fetch causing re-renders
  useEffect(() => {
    if (currentRole === "Customer") {
      fetchApplicantDashboardData();
    }
  }, [currentRole]);

  const logoutSession = async () => {
    try {
      await fetch(`${API_V1_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
    } catch (err) {
      console.error("Logout fetch error:", err);
    }
    try {
      localStorage.removeItem("phantom_auth_session");
      localStorage.removeItem("customer_active_tab");
      localStorage.removeItem("customer_active_subtab");
      localStorage.removeItem("admin_active_section");
      localStorage.removeItem("admin_active_subitem");
    } catch (e) {}
    setAuthSession(null);
    setCurrentRole("Customer");
    setApplicantDashboardData(null);
    setCustomerTab("dashboard");
  };

  const logoutAllSessions = async () => {
    try {
      await fetch(`${API_V1_URL}/auth/logout-all`, {
        method: "POST",
        credentials: "include"
      });
    } catch (err) {
      console.error("Logout all sessions error:", err);
    }
    try {
      localStorage.clear();
    } catch (e) {}
    setAuthSession(null);
    setApplicantDashboardData(null);
    setCustomerTab("dashboard");
  };
  const [agentTab, setAgentTab] = useState<AgentTab>("dashboard");
  const [adminTab, setAdminTab] = useState<AdminTab>("dashboard");
  const [customerTab, setCustomerTab] = useState<CustomerTab>(() => {
    if (typeof window !== "undefined") {
      // Restore last active tab from localStorage on page reload
      const saved = localStorage.getItem("customer_active_tab") as CustomerTab | null;
      if (saved) return saved;
    }
    return "dashboard";
  });
  
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchApplicationsFromBackend = async () => {
      try {
        const res = await fetch(`${API_V1_URL}/applications`);
        const json = await res.json();
        if (res.ok && json.success && Array.isArray(json.data)) {
          const parsed = json.data.map((item: any) => {
            const givenName = item.personalDetails?.givenName || item.givenName || "";
            const surname = item.personalDetails?.surname || item.surname || "";
            const travelerName = (givenName || surname)
              ? `${givenName} ${surname}`.trim()
              : item.travelerName || "Applicant";

            const destination = item.countryName || item.destination || "";
            const visaType = item.visaTypeName || item.visaType || "";
            const passportNumber = item.passportDetails?.passportNo || item.passportNumber || "";
            const passportExpiry = item.passportDetails?.expiryDate || item.passportExpiry || "";
            const dob = item.personalDetails?.dob || item.dob || "";
            const nationality = item.personalDetails?.nationality || item.nationality || "";
            
            const travelDates = (item.travelDetails?.travelDate && item.travelDetails?.returnDate)
              ? `${item.travelDetails.travelDate} to ${item.travelDetails.returnDate}`
              : item.travelDates || "";
            
            const fees = item.pricing?.totalAmount || item.fees || 0;
            const isApproved = (item.status || "Submitted") === "Approved";
            const docStatus = isApproved ? "verified" : "pending";

            return {
              id: item.applicationId || item.id || item._id,
              travelerName,
              dob,
              passportNumber,
              passportExpiry,
              nationality,
              destination,
              visaType,
              travelDates,
              status: item.status || "Submitted",
              fees,
              submissionDate: item.createdAt ? item.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
              reason: item.rejectionReason || item.reason || "",
              verifiedDocs: {
                passport: docStatus,
                photo: docStatus
              },
              uploadedDocuments: Array.isArray(item.uploadedDocuments) ? item.uploadedDocuments : [],
              checklist: { employed: true, sponsored: false },
              documentsSubmitted: true,
              kycCompleted: true
            };
          });

          setApplications(parsed);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error("Failed to fetch applications from MongoDB:", err);
        setApplications([]);
      }
    };

    fetchApplicationsFromBackend();
  }, []);

  const [walletBalance, setWalletBalance] = useState<number>(0);

  const [ledger, setLedger] = useState<LedgerEntry[]>([]);

  const [commissions, setCommissions] = useState<Commission[]>([]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [companies] = useState<Company[]>([
    { id: "C-01", name: "Apex Travel Ltd", logo: "✈️", color: "from-blue-600 to-indigo-700", activeApplications: 12 },
    { id: "C-02", name: "Global Nomads Co", logo: "🌍", color: "from-emerald-600 to-teal-700", activeApplications: 28 },
    { id: "C-03", name: "Horizon Visa Bureau", logo: "🏛️", color: "from-amber-600 to-orange-700", activeApplications: 5 }
  ]);

  const [permissions, setPermissions] = useState([
    { role: "Agent", viewWallet: true, approveVisa: false, manageCompanies: false },
    { role: "Staff", viewWallet: false, approveVisa: true, manageCompanies: false },
    { role: "Customer", viewWallet: false, approveVisa: false, manageCompanies: false },
    { role: "Super Admin", viewWallet: true, approveVisa: true, manageCompanies: true }
  ]);

  const logAction = (actor: string, action: string) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    
    setAuditLogs((prev) => {
      let candidateNum = auditCounter++;
      let candidateId = `AUD-${candidateNum}`;
      while (prev.some((log) => log.id === candidateId)) {
        candidateNum = auditCounter++;
        candidateId = `AUD-${candidateNum}`;
      }
      return [
        {
          id: candidateId,
          actor,
          action,
          timestamp: formattedDate,
          ipAddress: "192.168.1.100"
        },
        ...prev
      ];
    });
  };

  const addApplication = (app: Omit<Application, "id" | "submissionDate">) => {
    let appNum = applicationCounter++;
    let id = `PV-2026-${String(appNum).padStart(4, "0")}`;
    while (applications.some((a) => a.id === id)) {
      appNum = applicationCounter++;
      id = `PV-2026-${String(appNum).padStart(4, "0")}`;
    }
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const newApp: Application = {
      ...app,
      id,
      submissionDate: formattedDate,
    };

    setApplications((prev) => [newApp, ...prev]);
    
    // Deduct wallet balance
    setWalletBalance((prev) => prev - app.fees);

    // Write to ledger
    setLedger((prev) => {
      let txnNum = txnCounter++;
      let txnId = `TXN-${txnNum}`;
      while (prev.some((t) => t.id === txnId)) {
        txnNum = txnCounter++;
        txnId = `TXN-${txnNum}`;
      }
      return [
        {
          id: txnId,
          date: `${formattedDate} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
          type: "debit",
          amount: app.fees,
          description: `Visa Application Fee - ${app.travelerName}`,
          reference: id
        },
        ...prev
      ];
    });

    // Record Commission
    const commAmt = Math.floor(app.fees * 0.3); // 30% commission
    setCommissions((prev) => {
      let comNum = comCounter++;
      let comId = `COM-${String(comNum).padStart(3, "0")}`;
      while (prev.some((c) => c.id === comId)) {
        comNum = comCounter++;
        comId = `COM-${String(comNum).padStart(3, "0")}`;
      }
      return [
        {
          id: comId,
          date: formattedDate,
          applicationId: id,
          travelerName: app.travelerName,
          amount: commAmt,
          status: "pending"
        },
        ...prev
      ];
    });

    logAction(`Agent (${currentRole})`, `Created application ${id} for ${app.travelerName}`);
    return id;
  };

  const updateApplicationStatus = (id: string, status: VisaStatus, reason?: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status, reason } : app))
    );
    
    logAction(`Staff/System (${currentRole})`, `Updated status of ${id} to: ${status} ${reason ? `(Reason: ${reason})` : ""}`);
  };

  const updateApplicationDocs = (
    id: string,
    docKey: "passport" | "photo" | "nocLetter" | "sponsorLetter",
    status: "verified" | "needs_review" | "pending" | "uploading"
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const updatedDocs = { ...app.verifiedDocs, [docKey]: status };
          
          // Auto-adjust general status if a doc needs review
          let appStatus = app.status;
          if (status === "needs_review") {
            appStatus = "Docs Pending";
          }
          
          return { ...app, verifiedDocs: updatedDocs, status: appStatus };
        }
        return app;
      })
    );
    
    logAction(`System/User (${currentRole})`, `Uploaded/Reviewed document (${docKey}) for ${id}. New state: ${status.toUpperCase()}`);
  };

  const addFunds = (amount: number) => {
    setWalletBalance((prev) => prev + amount);
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    setLedger((prev) => {
      let txnNum = txnCounter++;
      let txnId = `TXN-${txnNum}`;
      while (prev.some((t) => t.id === txnId)) {
        txnNum = txnCounter++;
        txnId = `TXN-${txnNum}`;
      }
      return [
        {
          id: txnId,
          date: formattedDate,
          type: "deposit",
          amount,
          description: "Added Funds - Agent Top Up",
          reference: "BANK_TRANSFER_" + Math.floor(100000 + Math.random() * 900000)
        },
        ...prev
      ];
    });

    logAction(`Agent (${currentRole})`, `Deposited ₹${formatINR(amount)} into wallet`);
  };

  const requestPayout = (amount: number) => {
    // Commissions total that are pending
    const pendingCommAmt = commissions
      .filter((c) => c.status === "pending")
      .reduce((sum, c) => sum + c.amount, 0);

    if (amount > pendingCommAmt) return false;

    // Deduct or mark commissions as paid
    let remainingToPay = amount;
    setCommissions((prev) =>
      prev.map((c) => {
        if (c.status === "pending" && remainingToPay >= c.amount) {
          remainingToPay -= c.amount;
          return { ...c, status: "paid" };
        }
        return c;
      })
    );

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    // Add to ledger as a payout
    setLedger((prev) => {
      let txnNum = txnCounter++;
      let txnId = `TXN-${txnNum}`;
      while (prev.some((t) => t.id === txnId)) {
        txnNum = txnCounter++;
        txnId = `TXN-${txnNum}`;
      }
      return [
        {
          id: txnId,
          date: formattedDate,
          type: "payout",
          amount,
          description: "Commission Payout Request",
          reference: "PAYOUT_REF_" + Math.floor(100000 + Math.random() * 900000)
        },
        ...prev
      ];
    });

    logAction(`Agent (${currentRole})`, `Requested payout of ₹${formatINR(amount)} in accrued commission`);
    return true;
  };

  // TIER 3 & ENHANCEMENT STATE INITIALIZATIONS
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>("Enterprise");
  const [whiteLabelConfig, setWhiteLabelConfig] = useState<WhiteLabelConfig>({
    byoSmtpEnabled: true,
    smtpHost: "smtp.apextravel.com",
    byoPaymentEnabled: true,
    stripeActive: true,
    byoSmsEnabled: false,
    twilioActive: false
  });

  const [impersonationState, setImpersonationState] = useState<ImpersonationState>({
    isActive: false,
    targetCompanyId: "",
    targetCompanyName: ""
  });

  const [featureFlags, setFeatureFlags] = useState([
    { key: "FF_REALTIME_WEBSOCKETS", name: "Realtime WebSocket Timeline Stream", percentage: 100, isActive: true },
    { key: "FF_AI_OCR_AUTO_APPROVE", name: "AI OCR Auto-Approve High Confidence", percentage: 25, isActive: true },
    { key: "FF_BYO_PAYMENT_GATEWAY", name: "BYO Custom Payment Gateway", percentage: 50, isActive: true }
  ]);

  const updateWhiteLabelConfig = (config: Partial<WhiteLabelConfig>) => {
    setWhiteLabelConfig((prev) => ({ ...prev, ...config }));
    logAction("Company Admin", "Updated White-Label BYO Integration settings");
  };

  const startImpersonation = (companyId: string, companyName: string) => {
    setImpersonationState({
      isActive: true,
      targetCompanyId: companyId,
      targetCompanyName: companyName
    });
    logAction("Super Admin", `Launched 30-min auto-expiring impersonation session for tenant ${companyName} (${companyId})`);
  };

  const stopImpersonation = () => {
    setImpersonationState({ isActive: false, targetCompanyId: "", targetCompanyName: "" });
    logAction("Super Admin", "Terminated impersonation session");
  };

  const setFeatureFlagPercentage = (key: string, percentage: number) => {
    setFeatureFlags((prev) =>
      prev.map((f) => (f.key === key ? { ...f, percentage } : f))
    );
    logAction("Super Admin", `Updated feature flag ${key} rollout percentage to ${percentage}%`);
  };

  const togglePermission = (roleIndex: number, field: "viewWallet" | "approveVisa" | "manageCompanies") => {
    setPermissions((prev) => {
      const copy = [...prev];
      copy[roleIndex] = {
        ...copy[roleIndex],
        [field]: !copy[roleIndex][field]
      };
      return copy;
    });

    logAction(`Super Admin`, `Changed permission '${field}' for role ${permissions[roleIndex].role}`);
  };

  const setRole = (role: "Agent" | "Staff" | "Customer" | "Super Admin") => {
    setCurrentRole(role);
    logAction("System", `Switched active dashboard view to: ${role}`);
  };

  return (
    <VisaContext.Provider
      value={{
        authSession,
        loginSession,
        logoutSession,
        logoutAllSessions,
        applications,
        walletBalance,
        ledger,
        commissions,
        auditLogs,
        companies,
        currentRole,
        permissions,
        agentTab,
        setAgentTab,
        adminTab,
        setAdminTab,
        customerTab,
        setCustomerTab,
        setRole,
        addApplication,
        updateApplicationStatus,
        updateApplicationDocs,
        addFunds,
        requestPayout,
        togglePermission,
        subscriptionTier,
        setSubscriptionTier,
        whiteLabelConfig,
        updateWhiteLabelConfig,
        impersonationState,
        startImpersonation,
        stopImpersonation,
        featureFlags,
        setFeatureFlagPercentage,
        applicantDashboardData,
        fetchApplicantDashboardData,
        unifiedTransactions,
        updateUnifiedTransactionStatus,
        updateUnifiedInvoiceGstin,
        addNewUnifiedTransaction,
        fetchUnifiedTransactionsList,
        unifiedAppointments,
        addUnifiedAppointment,
        updateUnifiedAppointment,
        unifiedTickets,
        fetchSupportTickets,
        addSupportTicket,
        updateSupportTicket,
        appendTicketMessage
      }}
    >
      {children}
    </VisaContext.Provider>
  );
}

export function useVisa() {
  const context = useContext(VisaContext);
  if (!context) {
    throw new Error("useVisa must be used within a VisaProvider");
  }
  return context;
}
