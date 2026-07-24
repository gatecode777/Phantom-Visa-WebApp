"use client";

import React, { useState } from "react";
import { useVisa, Application, VisaStatus, formatINR, AdminTab } from "../context/VisaContext";
import {
  Users,
  Settings,
  Shield,
  Activity,
  Filter,
  CheckCircle,
  Building2,
  Lock,
  Globe,
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  FileText,
  CreditCard,
  Calendar,
  MessageSquare,
  Bell,
  BarChart3,
  LifeBuoy,
  User,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  RefreshCw,
  Eye,
  Send,
  Sliders,
  Database,
  Key,
  Mail,
  PhoneCall,
  Server,
  DollarSign,
  TrendingUp,
  Award,
  CheckSquare,
  FileCheck,
  Ban,
  ShieldCheck,
  Radio,
  FileSpreadsheet
} from "lucide-react";

export default function AdminPortal() {
  const {
    applications,
    walletBalance,
    ledger,
    commissions,
    auditLogs,
    companies,
    permissions,
    togglePermission,
    adminTab,
    setAdminTab,
    startImpersonation,
    subscriptionTier,
    setSubscriptionTier,
    whiteLabelConfig,
    updateWhiteLabelConfig,
    featureFlags,
    setFeatureFlagPercentage,
    updateApplicationStatus,
    setRole
  } = useVisa();

  // Toast feedback state
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // SUB-SECTION TAB STATES matching exact screenshot sub-items:

  // 1. Dashboard: 'overview' | 'analytics' | 'recent_activities'
  const [dashSubTab, setDashSubTab] = useState<"overview" | "analytics" | "recent_activities">("overview");

  // 2. User Management: 'all_applicants' | 'active_users' | 'blocked_users' | 'kyc_verification' | 'user_activity_logs'
  const [userMgmtSubTab, setUserMgmtSubTab] = useState<
    "all_applicants" | "active_users" | "blocked_users" | "kyc_verification" | "user_activity_logs"
  >("all_applicants");

  // 3. Agent Management: 'all_agents' | 'add_agent' | 'pending_approval' | 'active_agents' | 'inactive_agents' | 'agent_performance'
  const [agentMgmtSubTab, setAgentMgmtSubTab] = useState<
    "all_agents" | "add_agent" | "pending_approval" | "active_agents" | "inactive_agents" | "agent_performance"
  >("all_agents");

  // 4. Visa Management: 'countries' | 'categories' | 'types' | 'requirements' | 'processing' | 'fees' | 'documents'
  const [visaMgmtSubTab, setVisaMgmtSubTab] = useState<
    "countries" | "categories" | "types" | "requirements" | "processing" | "fees" | "documents"
  >("countries");

  // 5. Applications: 'all' | 'new' | 'assigned' | 'under_review' | 'pending_docs' | 'approved' | 'rejected' | 'completed' | 'cancelled'
  const [appSubTab, setAppSubTab] = useState<
    "all" | "new" | "assigned" | "under_review" | "pending_docs" | "approved" | "rejected" | "completed" | "cancelled"
  >("all");

  // 6. Documents: 'all_docs' | 'pending_verif' | 'verified_docs' | 'rejected_docs' | 'templates'
  const [docSubTab, setDocSubTab] = useState<
    "all_docs" | "pending_verif" | "verified_docs" | "rejected_docs" | "templates"
  >("all_docs");

  // 7. Payments: 'all_txns' | 'successful' | 'pending' | 'failed' | 'refunds' | 'invoices'
  const [paySubTab, setPaySubTab] = useState<
    "all_txns" | "successful" | "pending" | "failed" | "refunds" | "invoices"
  >("all_txns");

  // 8. Appointments: 'all_appts' | 'upcoming' | 'completed' | 'cancelled'
  const [apptSubTab, setApptSubTab] = useState<"all_appts" | "upcoming" | "completed" | "cancelled">("all_appts");

  // 9. Messages: 'inbox' | 'applicant_msgs' | 'agent_msgs' | 'broadcast'
  const [msgSubTab, setMsgSubTab] = useState<"inbox" | "applicant_msgs" | "agent_msgs" | "broadcast">("inbox");

  // 10. Notifications: 'send' | 'email' | 'sms' | 'push' | 'history'
  const [notifSubTab, setNotifSubTab] = useState<"send" | "email" | "sms" | "push" | "history">("send");

  // 11. Reports & Analytics: 'dashboard_rep' | 'app_rep' | 'pay_rep' | 'rev_rep' | 'agent_perf' | 'country_rep' | 'visa_type_rep' | 'user_act'
  const [reportSubTab, setReportSubTab] = useState<
    "dashboard_rep" | "app_rep" | "pay_rep" | "rev_rep" | "agent_perf" | "country_rep" | "visa_type_rep" | "user_act"
  >("dashboard_rep");

  // 12. System Settings: 'general' | 'company' | 'roles' | 'gateway' | 'email_cfg' | 'sms_cfg' | 'security' | 'api' | 'backup'
  const [settingsSubTab, setSettingsSubTab] = useState<
    "general" | "company" | "roles" | "gateway" | "email_cfg" | "sms_cfg" | "security" | "api" | "backup"
  >("general");

  // 13. Support: 'tickets' | 'contact' | 'faqs' | 'feedback'
  const [supportSubTab, setSupportSubTab] = useState<"tickets" | "contact" | "faqs" | "feedback">("tickets");

  // 14. Profile: 'my_profile' | 'password' | 'login_history'
  const [profileSubTab, setProfileSubTab] = useState<"my_profile" | "password" | "login_history">("my_profile");

  // Form & Input States
  const [newAgentForm, setNewAgentForm] = useState({
    name: "",
    license: "",
    email: "",
    tier: "Platinum",
    creditLimit: 500000
  });

  const [broadcastMessage, setBroadcastMessage] = useState({
    targetRole: "All",
    subject: "",
    content: "",
    channel: "Push & Email"
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [actorFilter, setActorFilter] = useState("all");

  const [agentsList, setAgentsList] = useState([
    { id: "AG-8819", name: "Apex Travel Ltd", license: "LIC-DE-9912", email: "contact@apextravel.com", status: "ACTIVE", volume: 28, revenue: 371840, tier: "Platinum 30%" },
    { id: "AG-8820", name: "Global Nomads Co", license: "LIC-UK-8812", email: "info@globalnomads.com", status: "ACTIVE", volume: 14, revenue: 198420, tier: "Gold 25%" },
    { id: "AG-8821", name: "Horizon Visa Bureau", license: "LIC-IN-4410", email: "support@horizonvisa.in", status: "PENDING_APPROVAL", volume: 4, revenue: 52400, tier: "Silver 20%" },
    { id: "AG-8822", name: "Pacific Voyage LLC", license: "LIC-US-1102", email: "admin@pacificvoyage.us", status: "BLOCKED", volume: 0, revenue: 0, tier: "Standard 15%" }
  ]);

  const [usersList, setUsersList] = useState([
    { id: "USR-01", name: "Sophia Martinez", email: "sophia.m@gmail.com", kyc: "VERIFIED", status: "ACTIVE", role: "Customer", lastLogin: "Today 09:15 AM" },
    { id: "USR-02", name: "Liam Chen", email: "liam.chen@techasia.cn", kyc: "VERIFIED", status: "ACTIVE", role: "Customer", lastLogin: "Yesterday 14:20 PM" },
    { id: "USR-03", name: "Amara Okafor", email: "amara.o@lagos.org", kyc: "PENDING", status: "ACTIVE", role: "Customer", lastLogin: "July 20, 2026" },
    { id: "USR-04", name: "Yusuf Al-Farsi", email: "yusuf.alfarsi@dubai.ae", kyc: "VERIFIED", status: "ACTIVE", role: "Customer", lastLogin: "July 21, 2026" },
    { id: "USR-05", name: "Emma Watson", email: "emma.watson@london.uk", kyc: "REJECTED", status: "BLOCKED", role: "Customer", lastLogin: "July 10, 2026" }
  ]);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesActor = actorFilter === "all" || log.actor.toLowerCase().includes(actorFilter.toLowerCase());
    const matchesSearch =
      searchQuery === "" ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesActor && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-brand-midnight text-brand-paper overflow-hidden">
      {/* Toast Banner */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-brand-gold text-brand-midnight font-bold text-xs px-4 py-2.5 rounded shadow-xl border border-white/20 animate-fade-in flex items-center gap-2">
          <ShieldCheck size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* SUPER ADMIN PLATFORM CONTROL BAR */}
      <div className="bg-brand-slate border-b border-brand-gold/15 px-6 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold text-sm">
            <Shield size={18} />
          </div>
          <div>
            <h2 className="font-outfit font-bold text-base text-brand-paper capitalize">
              Super Admin Operating Console &mdash; {adminTab.replace("_", " ")}
            </h2>
            <p className="text-[10px] text-brand-paper/50">
              Master Instance: <span className="font-mono text-brand-gold">PHANTOM-OS-ROOT-01</span> &bull; 256-Bit SSL Encrypted
            </p>
          </div>
        </div>

        {/* Global Control Plane Metrics */}
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden lg:block text-right">
            <span className="text-[10px] text-brand-paper/50 block">Platform Gross Volume</span>
            <span className="font-outfit font-bold text-brand-gold font-mono">₹1,42,85,000</span>
          </div>
          <div className="hidden lg:block text-right">
            <span className="text-[10px] text-brand-paper/50 block">Net Commission Share</span>
            <span className="font-outfit font-bold text-brand-teal font-mono">₹42,85,500</span>
          </div>
          <select
            value={subscriptionTier}
            onChange={(e) => {
              setSubscriptionTier(e.target.value as any);
              showToast(`Tenant Subscription Tier updated to: ${e.target.value}`);
            }}
            className="bg-brand-midnight border border-brand-gold/30 text-brand-gold text-xs font-bold px-2.5 py-1.5 rounded outline-none"
          >
            <option value="Starter">Starter Tier</option>
            <option value="Growth">Growth Tier</option>
            <option value="Enterprise">Enterprise Tier</option>
          </select>
        </div>
      </div>

      {/* MAIN BODY SCROLL AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* ============================================================ */}
        {/* SECTION 1: DASHBOARD */}
        {/* Sub-items: Overview, Analytics, Recent Activities */}
        {/* ============================================================ */}
        {adminTab === "dashboard" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
              <div className="flex items-center gap-3">
                {[
                  { key: "overview", label: "Overview" },
                  { key: "analytics", label: "System Analytics" },
                  { key: "recent_activities", label: "Recent Activities" }
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

              <span className="text-[11px] font-mono text-brand-teal font-bold">
                PLATFORM HEALTH: 99.98% ONLINE ✓
              </span>
            </div>

            {dashSubTab === "overview" && (
              <div className="space-y-6">
                {/* Metric Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-brand-slate border border-brand-gold/15 p-5 rounded-lg space-y-1">
                    <div className="flex justify-between items-center text-brand-paper/50">
                      <span className="text-xs font-medium uppercase tracking-wider">Gross GMV Revenue</span>
                      <DollarSign size={18} className="text-brand-gold" />
                    </div>
                    <p className="font-outfit text-2xl font-bold text-brand-gold font-mono">₹1,42,85,000</p>
                    <p className="text-[10px] text-brand-teal">+24.8% YoY Growth across 3 tenants</p>
                  </div>

                  <div className="bg-brand-slate border border-brand-gold/15 p-5 rounded-lg space-y-1">
                    <div className="flex justify-between items-center text-brand-paper/50">
                      <span className="text-xs font-medium uppercase tracking-wider">Registered Applicants</span>
                      <Users size={18} className="text-brand-paper" />
                    </div>
                    <p className="font-outfit text-2xl font-bold text-brand-paper">{usersList.length} Active</p>
                    <p className="text-[10px] text-brand-paper/50">Verified end-user accounts</p>
                  </div>

                  <div className="bg-brand-slate border border-brand-gold/15 p-5 rounded-lg space-y-1">
                    <div className="flex justify-between items-center text-brand-paper/50">
                      <span className="text-xs font-medium uppercase tracking-wider">Onboarded B2B Agencies</span>
                      <Briefcase size={18} className="text-brand-gold" />
                    </div>
                    <p className="font-outfit text-2xl font-bold text-brand-paper">{agentsList.length} Agencies</p>
                    <p className="text-[10px] text-brand-teal">Platinum & Gold partners</p>
                  </div>

                  <div className="bg-brand-slate border border-brand-gold/15 p-5 rounded-lg space-y-1">
                    <div className="flex justify-between items-center text-brand-paper/50">
                      <span className="text-xs font-medium uppercase tracking-wider">Active Visa Queue</span>
                      <ClipboardList size={18} className="text-brand-teal" />
                    </div>
                    <p className="font-outfit text-2xl font-bold text-brand-paper">{applications.length} Files</p>
                    <p className="text-[10px] text-brand-paper/50">Under consular review</p>
                  </div>
                </div>

                {/* Master Applications Queue Summary */}
                <div className="bg-brand-slate border border-brand-gold/15 rounded-lg overflow-hidden p-5 space-y-3">
                  <h3 className="font-outfit font-bold text-sm text-brand-gold uppercase tracking-wider">
                    Global System Applications Stream
                  </h3>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-brand-midnight text-brand-gold font-mono uppercase text-[10px]">
                      <tr>
                        <th className="p-3">App ID</th>
                        <th className="p-3">Applicant Name</th>
                        <th className="p-3">Destination</th>
                        <th className="p-3">Visa Type</th>
                        <th className="p-3">Fee</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-gold/10">
                      {applications.map((a) => (
                        <tr key={a.id} className="hover:bg-brand-midnight/40">
                          <td className="p-3 font-mono font-bold text-brand-gold">{a.id}</td>
                          <td className="p-3 font-bold text-brand-paper">{a.travelerName}</td>
                          <td className="p-3 text-brand-paper/80">{a.destination}</td>
                          <td className="p-3 text-brand-paper/70">{a.visaType}</td>
                          <td className="p-3 font-mono font-bold text-brand-paper">₹{formatINR(a.fees)}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                              a.status === "Approved" ? "bg-brand-teal/20 text-brand-teal" : a.status === "Rejected" ? "bg-brand-red/20 text-brand-red" : "bg-brand-gold/20 text-brand-gold"
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

            {dashSubTab === "analytics" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs">
                <h3 className="font-outfit font-bold text-base text-brand-gold">Global System Analytics & Engine Performance</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-brand-midnight p-4 rounded border border-brand-gold/10">
                    <p className="text-brand-paper/50">AI OCR Scanner Precision</p>
                    <p className="text-xl font-bold text-brand-teal">99.4% Match</p>
                  </div>
                  <div className="bg-brand-midnight p-4 rounded border border-brand-gold/10">
                    <p className="text-brand-paper/50">Average Consular Processing SLA</p>
                    <p className="text-xl font-bold text-brand-paper">4.2 Days</p>
                  </div>
                  <div className="bg-brand-midnight p-4 rounded border border-brand-gold/10">
                    <p className="text-brand-paper/50">Realtime WebSocket Latency</p>
                    <p className="text-xl font-bold text-brand-gold font-mono">1.8 ms</p>
                  </div>
                </div>
              </div>
            )}

            {dashSubTab === "recent_activities" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs">
                <h3 className="font-outfit font-bold text-base text-brand-gold">Platform Audit Activity Stream</h3>
                <div className="space-y-2 font-mono">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="bg-brand-midnight p-3 rounded border border-brand-gold/10 flex justify-between">
                      <div>
                        <span className="text-brand-gold font-bold">{log.actor}</span>: {log.action}
                      </div>
                      <span className="text-brand-paper/40 text-[10px]">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 2: USER MANAGEMENT */}
        {/* Sub-items: All Applicants, Active Users, Blocked Users, KYC Verification, User Activity Logs */}
        {/* ============================================================ */}
        {adminTab === "user_management" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { key: "all_applicants", label: "All Applicants" },
                  { key: "active_users", label: "Active Users" },
                  { key: "blocked_users", label: "Blocked Users" },
                  { key: "kyc_verification", label: "KYC Verification" },
                  { key: "user_activity_logs", label: "User Activity Logs" }
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setUserMgmtSubTab(st.key as any)}
                    className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
                      userMgmtSubTab === st.key
                        ? "bg-brand-gold text-brand-midnight font-bold shadow-md"
                        : "bg-brand-slate text-brand-paper/60 hover:text-brand-paper"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {userMgmtSubTab === "all_applicants" && (
              <div className="bg-brand-slate border border-brand-gold/15 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-midnight text-brand-gold font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3">User ID</th>
                      <th className="p-3">Full Name</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">KYC Status</th>
                      <th className="p-3">Account Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-gold/10">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-brand-midnight/40">
                        <td className="p-3 font-mono font-bold text-brand-gold">{u.id}</td>
                        <td className="p-3 font-bold text-brand-paper">{u.name}</td>
                        <td className="p-3 text-brand-paper/70">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                            u.kyc === "VERIFIED" ? "bg-brand-teal/20 text-brand-teal" : "bg-amber-500/20 text-amber-500"
                          }`}>
                            {u.kyc}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                            u.status === "ACTIVE" ? "bg-brand-teal/20 text-brand-teal" : "bg-brand-red/20 text-brand-red"
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3 flex gap-2">
                          {u.status === "ACTIVE" ? (
                            <button
                              onClick={() => {
                                setUsersList(usersList.map((item) => (item.id === u.id ? { ...item, status: "BLOCKED" } : item)));
                                showToast(`Account ${u.name} has been blocked.`);
                              }}
                              className="bg-brand-red/20 hover:bg-brand-red text-brand-red hover:text-white font-bold text-[10px] px-2.5 py-1 rounded"
                            >
                              Block User
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setUsersList(usersList.map((item) => (item.id === u.id ? { ...item, status: "ACTIVE" } : item)));
                                showToast(`Account ${u.name} unblocked successfully.`);
                              }}
                              className="bg-brand-teal/20 hover:bg-brand-teal text-brand-teal hover:text-brand-midnight font-bold text-[10px] px-2.5 py-1 rounded"
                            >
                              Unblock
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {userMgmtSubTab === "kyc_verification" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs">
                <h3 className="font-outfit font-bold text-base text-brand-gold">Applicant Identity KYC Verification Queue</h3>
                <div className="space-y-3">
                  {usersList.filter((u) => u.kyc === "PENDING").map((u) => (
                    <div key={u.id} className="bg-brand-midnight p-4 rounded border border-brand-gold/10 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-brand-paper">{u.name} ({u.email})</p>
                        <p className="text-[10px] text-brand-paper/50">Passport & Aadhaar ID Scans Uploaded</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setUsersList(usersList.map((item) => (item.id === u.id ? { ...item, kyc: "VERIFIED" } : item)));
                            showToast(`KYC Approved for ${u.name}`);
                          }}
                          className="bg-brand-teal text-brand-midnight font-bold px-3 py-1 rounded"
                        >
                          Approve KYC
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 3: AGENT MANAGEMENT */}
        {/* Sub-items: All Agents, Add New Agent, Pending Approval, Active Agents, Inactive Agents, Agent Performance */}
        {/* ============================================================ */}
        {adminTab === "agent_management" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { key: "all_agents", label: "All Agents" },
                  { key: "add_agent", label: "Add New Agent" },
                  { key: "pending_approval", label: "Pending Approval" },
                  { key: "active_agents", label: "Active Agents" },
                  { key: "agent_performance", label: "Agent Performance" }
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setAgentMgmtSubTab(st.key as any)}
                    className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
                      agentMgmtSubTab === st.key
                        ? "bg-brand-gold text-brand-midnight font-bold shadow-md"
                        : "bg-brand-slate text-brand-paper/60 hover:text-brand-paper"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {agentMgmtSubTab === "all_agents" && (
              <div className="bg-brand-slate border border-brand-gold/15 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-midnight text-brand-gold font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Agent ID</th>
                      <th className="p-3">Agency Name</th>
                      <th className="p-3">License No</th>
                      <th className="p-3">Tier</th>
                      <th className="p-3">Files Volume</th>
                      <th className="p-3">Revenue Share</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-gold/10">
                    {agentsList.map((a) => (
                      <tr key={a.id} className="hover:bg-brand-midnight/40">
                        <td className="p-3 font-mono font-bold text-brand-gold">{a.id}</td>
                        <td className="p-3 font-bold text-brand-paper">{a.name}</td>
                        <td className="p-3 font-mono text-brand-paper/70">{a.license}</td>
                        <td className="p-3 text-brand-teal font-bold">{a.tier}</td>
                        <td className="p-3 font-bold text-brand-paper">{a.volume} Visas</td>
                        <td className="p-3 font-mono font-bold text-brand-gold">₹{formatINR(a.revenue)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                            a.status === "ACTIVE" ? "bg-brand-teal/20 text-brand-teal" : "bg-amber-500/20 text-amber-500"
                          }`}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {agentMgmtSubTab === "add_agent" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-6 max-w-2xl">
                <h3 className="font-outfit font-bold text-lg text-brand-gold">Onboard New B2B Travel Agency</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setAgentsList([
                      ...agentsList,
                      {
                        id: `AG-${Math.floor(8823 + Math.random() * 100)}`,
                        name: newAgentForm.name,
                        license: newAgentForm.license,
                        email: newAgentForm.email,
                        status: "ACTIVE",
                        volume: 0,
                        revenue: 0,
                        tier: `${newAgentForm.tier} 30%`
                      }
                    ]);
                    showToast(`Onboarded agency partner: ${newAgentForm.name}`);
                    setAgentMgmtSubTab("all_agents");
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="block text-brand-paper/70 font-semibold mb-1">Agency Legal Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Horizon Travel Bureau"
                      value={newAgentForm.name}
                      onChange={(e) => setNewAgentForm({ ...newAgentForm, name: e.target.value })}
                      className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-brand-paper"
                    />
                  </div>

                  <div>
                    <label className="block text-brand-paper/70 font-semibold mb-1">License / IATA Number</label>
                    <input
                      type="text"
                      required
                      placeholder="LIC-IN-99128"
                      value={newAgentForm.license}
                      onChange={(e) => setNewAgentForm({ ...newAgentForm, license: e.target.value })}
                      className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-brand-paper font-mono"
                    />
                  </div>

                  <button type="submit" className="bg-brand-gold hover:bg-brand-gold-hover text-brand-midnight font-bold text-xs px-5 py-2.5 rounded">
                    Confirm Agency Onboarding
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 4: VISA MANAGEMENT */}
        {/* Sub-items: Countries, Visa Categories, Visa Types, Visa Requirements, Processing Time, Visa Fees, Required Documents */}
        {/* ============================================================ */}
        {adminTab === "visa_management" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { key: "countries", label: "Countries" },
                  { key: "categories", label: "Categories" },
                  { key: "types", label: "Visa Types" },
                  { key: "requirements", label: "Requirements" },
                  { key: "processing", label: "Processing SLA" },
                  { key: "fees", label: "Fee Matrix" }
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setVisaMgmtSubTab(st.key as any)}
                    className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
                      visaMgmtSubTab === st.key
                        ? "bg-brand-gold text-brand-midnight font-bold shadow-md"
                        : "bg-brand-slate text-brand-paper/60 hover:text-brand-paper"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {visaMgmtSubTab === "countries" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: "Germany", code: "DE", zone: "Schengen Area", status: "ACTIVE", price: "₹13,280" },
                  { name: "France", code: "FR", zone: "Schengen Area", status: "ACTIVE", price: "₹12,865" },
                  { name: "United Kingdom", code: "GB", zone: "UK Visas", status: "ACTIVE", price: "₹16,185" },
                  { name: "Canada", code: "CA", zone: "IRCC", status: "ACTIVE", price: "₹23,240" },
                  { name: "Japan", code: "JP", zone: "eVisa", status: "ACTIVE", price: "₹7,885" },
                  { name: "United States", code: "US", zone: "DS-160", status: "ACTIVE", price: "₹16,500" }
                ].map((c) => (
                  <div key={c.code} className="bg-brand-slate border border-brand-gold/15 p-5 rounded-lg space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-sm text-brand-paper">
                      <span>{c.name} ({c.code})</span>
                      <span className="font-mono text-brand-gold">{c.price}</span>
                    </div>
                    <p className="text-brand-paper/50">{c.zone}</p>
                    <span className="inline-block bg-brand-teal/20 text-brand-teal font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 5: APPLICATIONS */}
        {/* Sub-items: All Applications, New Applications, Assigned Applications, Under Review, Pending Documents, Approved, Rejected, Completed, Cancelled */}
        {/* ============================================================ */}
        {adminTab === "applications" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { key: "all", label: "All Applications" },
                  { key: "new", label: "New Applications" },
                  { key: "under_review", label: "Under Review" },
                  { key: "approved", label: "Approved" },
                  { key: "rejected", label: "Rejected" }
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setAppSubTab(st.key as any)}
                    className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
                      appSubTab === st.key
                        ? "bg-brand-gold text-brand-midnight font-bold shadow-md"
                        : "bg-brand-slate text-brand-paper/60 hover:text-brand-paper"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-brand-slate border border-brand-gold/15 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-midnight text-brand-gold font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3">App ID</th>
                    <th className="p-3">Applicant Name</th>
                    <th className="p-3">Destination</th>
                    <th className="p-3">Visa Type</th>
                    <th className="p-3">Fee</th>
                    <th className="p-3">Status Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gold/10">
                  {applications.map((a) => (
                    <tr key={a.id} className="hover:bg-brand-midnight/40">
                      <td className="p-3 font-mono font-bold text-brand-gold">{a.id}</td>
                      <td className="p-3 font-bold text-brand-paper">{a.travelerName}</td>
                      <td className="p-3 text-brand-paper/80">{a.destination}</td>
                      <td className="p-3 text-brand-paper/70">{a.visaType}</td>
                      <td className="p-3 font-mono font-bold text-brand-paper">₹{formatINR(a.fees)}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => {
                            updateApplicationStatus(a.id, "Approved");
                            showToast(`Super Admin Override: ${a.id} APPROVED`);
                          }}
                          className="bg-brand-teal/20 text-brand-teal hover:bg-brand-teal hover:text-brand-midnight font-bold text-[10px] px-2.5 py-1 rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            updateApplicationStatus(a.id, "Rejected", "Super Admin Discretion");
                            showToast(`Super Admin Override: ${a.id} REJECTED`);
                          }}
                          className="bg-brand-red/20 text-brand-red hover:bg-brand-red hover:text-white font-bold text-[10px] px-2.5 py-1 rounded"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 10: NOTIFICATIONS & BROADCAST */}
        {/* ============================================================ */}
        {adminTab === "notifications" && (
          <div className="space-y-6 max-w-3xl">
            <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4">
              <h3 className="font-outfit font-bold text-lg text-brand-gold">Platform Broadcast Notification Center</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast(`Broadcast notification dispatched to ${broadcastMessage.targetRole} via ${broadcastMessage.channel}!`);
                  setBroadcastMessage({ targetRole: "All", subject: "", content: "", channel: "Push & Email" });
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-brand-paper/70 font-semibold mb-1">Target Audience</label>
                  <select
                    value={broadcastMessage.targetRole}
                    onChange={(e) => setBroadcastMessage({ ...broadcastMessage, targetRole: e.target.value })}
                    className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-brand-paper"
                  >
                    <option value="All">All Users & Agencies (Global Broadcast)</option>
                    <option value="Agents">B2B Travel Agencies Only</option>
                    <option value="Customers">End Applicants Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-brand-paper/70 font-semibold mb-1">Alert Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Schengen Visa SLA Maintenance Update"
                    value={broadcastMessage.subject}
                    onChange={(e) => setBroadcastMessage({ ...broadcastMessage, subject: e.target.value })}
                    className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-brand-paper"
                  />
                </div>

                <div>
                  <label className="block text-brand-paper/70 font-semibold mb-1">Notification Body</label>
                  <textarea
                    rows={4}
                    required
                    value={broadcastMessage.content}
                    onChange={(e) => setBroadcastMessage({ ...broadcastMessage, content: e.target.value })}
                    className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-brand-paper"
                  />
                </div>

                <button type="submit" className="bg-brand-gold text-brand-midnight font-bold text-xs px-5 py-2.5 rounded">
                  Dispatch Broadcast Alert
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 12: SYSTEM SETTINGS (Tenants, Matrix, Audit, BYO Settings) */}
        {/* ============================================================ */}
        {adminTab === "system_settings" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { key: "general", label: "General Settings" },
                  { key: "roles", label: "Roles & Permissions Matrix" },
                  { key: "gateway", label: "BYO Gateways & Integrations" },
                  { key: "security", label: "Feature Flags & Security" },
                  { key: "backup", label: "Backup & Disaster Recovery" }
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setSettingsSubTab(st.key as any)}
                    className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
                      settingsSubTab === st.key
                        ? "bg-brand-gold text-brand-midnight font-bold shadow-md"
                        : "bg-brand-slate text-brand-paper/60 hover:text-brand-paper"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {settingsSubTab === "roles" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4">
                <h3 className="font-outfit font-bold text-lg text-brand-gold">Global Roles Permission Matrix</h3>
                <div className="bg-brand-midnight rounded border border-brand-gold/10 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-brand-midnight text-brand-gold font-mono uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Role</th>
                        <th className="p-3">View Wallet</th>
                        <th className="p-3">Approve Visas</th>
                        <th className="p-3">Manage Companies</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-gold/10">
                      {permissions.map((p, idx) => (
                        <tr key={p.role} className="hover:bg-brand-slate/40">
                          <td className="p-3 font-bold text-brand-paper">{p.role}</td>
                          <td className="p-3">
                            <input type="checkbox" checked={p.viewWallet} onChange={() => togglePermission(idx, "viewWallet")} />
                          </td>
                          <td className="p-3">
                            <input type="checkbox" checked={p.approveVisa} onChange={() => togglePermission(idx, "approveVisa")} />
                          </td>
                          <td className="p-3">
                            <input type="checkbox" checked={p.manageCompanies} onChange={() => togglePermission(idx, "manageCompanies")} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {settingsSubTab === "security" && (
              <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs">
                <h3 className="font-outfit font-bold text-lg text-brand-gold">Feature Flags & Rollout Engine</h3>
                <div className="space-y-3">
                  {featureFlags.map((ff) => (
                    <div key={ff.key} className="bg-brand-midnight p-4 rounded border border-brand-gold/10 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-brand-paper">{ff.name}</p>
                        <p className="font-mono text-[10px] text-brand-gold">{ff.key}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-brand-teal">{ff.percentage}% Rollout</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="25"
                          value={ff.percentage}
                          onChange={(e) => setFeatureFlagPercentage(ff.key, parseInt(e.target.value))}
                          className="w-32 accent-brand-gold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* DEFAULT FALLBACK VIEWS FOR OTHER ADMIN TABS (Documents, Payments, Reports, Support, Profile) */}
        {adminTab === "documents" && (
          <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs">
            <h3 className="font-outfit font-bold text-base text-brand-gold">Global Document Verification & Templates Vault</h3>
            <p className="text-brand-paper/60">Manage master document checklists, NOC templates, and AI scanning thresholds.</p>
          </div>
        )}

        {adminTab === "payments" && (
          <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs">
            <h3 className="font-outfit font-bold text-base text-brand-gold">Platform Payments Ledger & Refund Clearances</h3>
            <p className="text-brand-paper/60">Master audit of all agency wallet top-ups and consular fee debits.</p>
          </div>
        )}

        {adminTab === "reports" && (
          <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs">
            <h3 className="font-outfit font-bold text-base text-brand-gold">System Reports & Financial Analytics</h3>
            <p className="text-brand-paper/60">Export daily, monthly, and country-wise visa revenue reports.</p>
          </div>
        )}

        {adminTab === "support" && (
          <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs">
            <h3 className="font-outfit font-bold text-base text-brand-gold">Super Admin Master Support Ticket Queue</h3>
            <p className="text-brand-paper/60">Resolve support tickets escalated by agency partners and consular staff.</p>
          </div>
        )}

        {adminTab === "profile" && (
          <div className="bg-brand-slate border border-brand-gold/15 p-6 rounded-lg space-y-4 text-xs max-w-xl">
            <h3 className="font-outfit font-bold text-lg text-brand-gold">Super Admin Security Profile</h3>
            <p className="text-brand-paper/70">Master Root Credentials & Security Token Logs</p>
          </div>
        )}

      </div>
    </div>
  );
}
