"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { API_V1_URL } from "../config/api";

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
  | "Submitted"
  | "Embassy Processing"
  | "Approved"
  | "Rejected";

export interface Application {
  id: string;
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
  checklist: {
    employed: boolean;
    sponsored: boolean;
  };
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
  };
  token: string;
}

interface VisaContextType {
  authSession: AuthSession | null;
  loginSession: (session: AuthSession) => void;
  logoutSession: () => void;
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
    return "Agent";
  });

  const [applicantDashboardData, setApplicantDashboardData] = useState<{
    greetingName: string;
    metrics: any;
    application: any;
  } | null>(null);

  const fetchApplicantDashboardData = async () => {
    if (!authSession?.token) return;
    try {
      const res = await fetch(`${API_V1_URL}/applicant/dashboard`, {
        headers: {
          Authorization: `Bearer ${authSession.token}`
        }
      });
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setApplicantDashboardData(json.data);
        if (json.data.application) {
          const appData = json.data.application;
          setApplications((prev) => {
            const exists = prev.some((a) => a.id === appData.id);
            if (exists) {
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
    } catch (e) {}
    const roleMap: Record<string, "Agent" | "Staff" | "Customer" | "Super Admin"> = {
      Admin: "Super Admin",
      Applicant: "Customer",
      Staff: "Staff",
      Agent: "Agent"
    };
    const mappedRole = roleMap[session.user?.role] || "Customer";
    setCurrentRole(mappedRole);
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
        if (res.ok && json.success && json.data) {
          const newSession: AuthSession = {
            user: json.data.user,
            token: json.data.accessToken
          };
          loginSession(newSession);
        }
      } catch (err) {
        // Silently preserve local session if offline or backend unavailable
      }
    };

    checkAndRefreshToken();
  }, []);

  useEffect(() => {
    if (authSession?.token && currentRole === "Customer") {
      fetchApplicantDashboardData();
    }
  }, [authSession, currentRole]);

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
    } catch (e) {}
    setAuthSession(null);
    setApplicantDashboardData(null);
  };
  const [agentTab, setAgentTab] = useState<AgentTab>("dashboard");
  const [adminTab, setAdminTab] = useState<AdminTab>("dashboard");
  const [customerTab, setCustomerTab] = useState<CustomerTab>("dashboard");
  
  const [applications, setApplications] = useState<Application[]>([
    {
      id: "PV-2026-0041",
      travelerName: "Sophia Martinez",
      dob: "1992-04-12",
      passportNumber: "US8829102",
      passportExpiry: "2032-10-15",
      nationality: "United States",
      destination: "Germany",
      visaType: "Schengen Tourist",
      travelDates: "2026-09-01 to 2026-09-15",
      status: "Approved",
      fees: 13280,
      submissionDate: "2026-07-15",
      verifiedDocs: {
        passport: "verified",
        photo: "verified",
      },
      checklist: { employed: false, sponsored: false }
    },
    {
      id: "PV-2026-0042",
      travelerName: "Liam Chen",
      dob: "1988-11-23",
      passportNumber: "CN9928172",
      passportExpiry: "2029-05-18",
      nationality: "China",
      destination: "France",
      visaType: "Schengen Business",
      travelDates: "2026-08-10 to 2026-08-25",
      status: "Embassy Processing",
      fees: 17430,
      submissionDate: "2026-07-18",
      verifiedDocs: {
        passport: "verified",
        photo: "verified",
        nocLetter: "verified",
      },
      checklist: { employed: true, sponsored: false }
    },
    {
      id: "PV-2026-0043",
      travelerName: "Amara Okafor",
      dob: "1995-07-02",
      passportNumber: "NG1182736",
      passportExpiry: "2030-08-12",
      nationality: "Nigeria",
      destination: "United Kingdom",
      visaType: "Standard Visitor",
      travelDates: "2026-10-05 to 2026-10-20",
      status: "Docs Pending",
      fees: 16185,
      submissionDate: "2026-07-20",
      verifiedDocs: {
        passport: "needs_review",
        photo: "pending",
        sponsorLetter: "pending"
      },
      checklist: { employed: false, sponsored: true },
      reason: "Passport photo is blurred. Please re-upload a clear high-res scan."
    },
    {
      id: "PV-2026-0044",
      travelerName: "Yusuf Al-Farsi",
      dob: "1994-02-14",
      passportNumber: "AE8827361",
      passportExpiry: "2034-01-09",
      nationality: "United Arab Emirates",
      destination: "Canada",
      visaType: "Student Visa",
      travelDates: "2026-09-01 to 2027-06-30",
      status: "Submitted",
      fees: 23240,
      submissionDate: "2026-07-21",
      verifiedDocs: {
        passport: "verified",
        photo: "verified",
      },
      checklist: { employed: false, sponsored: false }
    },
    {
      id: "PV-2026-0045",
      travelerName: "Emma Watson",
      dob: "1990-04-15",
      passportNumber: "GB7728391",
      passportExpiry: "2030-12-31",
      nationality: "United Kingdom",
      destination: "Japan",
      visaType: "Transit Visa",
      travelDates: "2026-08-01 to 2026-08-03",
      status: "Rejected",
      fees: 7885,
      submissionDate: "2026-07-10",
      verifiedDocs: {
        passport: "verified",
        photo: "verified"
      },
      checklist: { employed: false, sponsored: false },
      reason: "Flight itinerary shows layover exceeds transit limits. Apply for full tourist entry."
    }
  ]);

  const [walletBalance, setWalletBalance] = useState<number>(2037650);

  const [ledger, setLedger] = useState<LedgerEntry[]>([
    {
      id: "TXN-9812",
      date: "2026-07-21 11:30",
      type: "deposit",
      amount: 415000,
      description: "Added Funds - Agent Portal Top Up",
      reference: "STRIPE_CH_908123"
    },
    {
      id: "TXN-9811",
      date: "2026-07-21 09:15",
      type: "debit",
      amount: 23240,
      description: "Visa Application Fee - Yusuf Al-Farsi",
      reference: "PV-2026-0044"
    },
    {
      id: "TXN-9810",
      date: "2026-07-20 16:45",
      type: "debit",
      amount: 16185,
      description: "Visa Application Fee - Amara Okafor",
      reference: "PV-2026-0043"
    },
    {
      id: "TXN-9809",
      date: "2026-07-18 14:10",
      type: "debit",
      amount: 17430,
      description: "Visa Application Fee - Liam Chen",
      reference: "PV-2026-0042"
    },
    {
      id: "TXN-9808",
      date: "2026-07-15 10:05",
      type: "debit",
      amount: 13280,
      description: "Visa Application Fee - Sophia Martinez",
      reference: "PV-2026-0041"
    }
  ]);

  const [commissions, setCommissions] = useState<Commission[]>([
    {
      id: "COM-001",
      date: "2026-07-15",
      applicationId: "PV-2026-0041",
      travelerName: "Sophia Martinez",
      amount: 3984, // 30% of ₹13,280 fee
      status: "paid"
    },
    {
      id: "COM-002",
      date: "2026-07-18",
      applicationId: "PV-2026-0042",
      travelerName: "Liam Chen",
      amount: 5229, // 30% of ₹17,430 fee
      status: "pending"
    },
    {
      id: "COM-003",
      date: "2026-07-21",
      applicationId: "PV-2026-0044",
      travelerName: "Yusuf Al-Farsi",
      amount: 6972, // 30% of ₹23,240 fee
      status: "pending"
    }
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: "AUD-991",
      actor: "Agent vibhu",
      action: "Created Application PV-2026-0044 for Yusuf Al-Farsi",
      timestamp: "2026-07-21 09:15:32",
      ipAddress: "192.168.1.45"
    },
    {
      id: "AUD-990",
      actor: "Agent vibhu",
      action: "Topped up wallet balance with ₹4,15,000.00",
      timestamp: "2026-07-21 11:30:00",
      ipAddress: "192.168.1.45"
    },
    {
      id: "AUD-989",
      actor: "Staff reviewer",
      action: "Updated Amara Okafor (PV-2026-0043) document status: Photo NEEDS_REVIEW",
      timestamp: "2026-07-20 18:22:15",
      ipAddress: "10.0.4.122"
    },
    {
      id: "AUD-988",
      actor: "Super Admin",
      action: "Modified Role Matrix: Grant 'Approve Visa' permission to Staff",
      timestamp: "2026-07-19 10:11:02",
      ipAddress: "10.0.1.15"
    }
  ]);

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
        fetchApplicantDashboardData
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
