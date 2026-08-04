import React, { useState, useEffect } from "react";
import { API_V1_URL } from "../config/api";
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Lock,
  Unlock,
  Trash2,
  Calendar,
  Globe,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Download,
  Bell,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  ChevronLeft,
  ChevronRight,
  X,
  UserCheck,
  Layers,
  AlertCircle,
  ShieldAlert,
  Info
} from "lucide-react";

export interface ActiveUserRecord {
  id: string;
  _id?: string;
  userId?: string;
  name: string;
  avatar?: string;
  email: string;
  mobile: string;
  country: string;
  flag: string;
  activeApplications: number;
  lastLogin?: string;
  status: "Active" | "Online" | "Suspended" | "Blocked";
  isDeactivated?: boolean;
  passportNumber?: string;
  nationality?: string;
  registrationDate?: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  blockReason?: string;
  blockType?: string;
  blockedBy?: string;
  blockedOn?: string;
}

export default function ActiveUsers() {
  const [users, setUsers] = useState<ActiveUserRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // View User Modal State
  const [viewUser, setViewUser] = useState<ActiveUserRecord | null>(null);

  // Block Modal State
  const [blockUserTarget, setBlockUserTarget] = useState<ActiveUserRecord | null>(null);
  const [blockType, setBlockType] = useState<"Temporary" | "Permanent" | "Security Lockdown">("Temporary");
  const [selectedReasonOption, setSelectedReasonOption] = useState<string>("Fake Documents Provided");
  const [customReasonText, setCustomReasonText] = useState<string>("");
  const [isSubmittingBlock, setIsSubmittingBlock] = useState<boolean>(false);

  // Toast State
  const [toastMsg, setToastMsg] = useState<{ title: string; type: "success" | "error" } | null>(null);

  const showToast = (title: string, type: "success" | "error" = "success") => {
    setToastMsg({ title, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Fetch Live Applicants from MongoDB
  const fetchActiveUsers = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_V1_URL}/applicant/all`);
      const json = await res.json();
      if (res.ok && json.success && Array.isArray(json.data)) {
        // Filter active users only (isDeactivated !== true)
        const activeOnly: ActiveUserRecord[] = json.data
          .filter((item: any) => !item.isDeactivated)
          .map((item: any) => ({
            id: item.id || "APP-UNKNOWN",
            _id: item._id,
            userId: item.userId,
            name: item.name || "Applicant",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
            email: item.email || "N/A",
            mobile: item.mobile || "N/A",
            country: item.country || "India",
            flag: item.country === "Canada" ? "🇨🇦" : item.country === "Australia" ? "🇦🇺" : item.country === "United States" ? "🇺🇸" : item.country === "United Kingdom" ? "🇬🇧" : "🇮🇳",
            activeApplications: 1,
            lastLogin: "Active Now",
            status: "Active",
            isDeactivated: false,
            passportNumber: item.passportNumber || "N/A",
            nationality: item.nationality || "Indian",
            registrationDate: item.registeredOn || "Recently",
            dob: item.dob,
            gender: item.gender,
            address: item.address,
            city: item.city,
            state: item.state,
            postalCode: item.postalCode
          }));
        setUsers(activeOnly);
      } else {
        throw new Error(json.message || "Failed to load active users.");
      }
    } catch (err: any) {
      console.error("Error fetching active users:", err);
      setErrorMsg(err.message || "Could not fetch active users from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  // Handle Submit Block Action with Reason Prompt
  const handleConfirmBlockUser = async () => {
    if (!blockUserTarget) return;

    const finalReason = selectedReasonOption === "Custom Reason..."
      ? customReasonText.trim() || "Policy Violation"
      : selectedReasonOption;

    setIsSubmittingBlock(true);
    try {
      const res = await fetch(`${API_V1_URL}/applicant/toggle-block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: blockUserTarget.userId,
          applicantId: blockUserTarget.id,
          isDeactivated: true,
          blockReason: finalReason,
          blockType: blockType,
          blockedBy: "Admin (Consular Officer)"
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to block user.");
      }

      showToast(`User ${blockUserTarget.name} has been blocked successfully!`, "success");
      setBlockUserTarget(null);
      fetchActiveUsers();
    } catch (err: any) {
      showToast(err.message || "Error blocking user.", "error");
    } finally {
      setIsSubmittingBlock(false);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.mobile.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q);

    const matchesCountry = selectedCountry === "All Countries" || u.country === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-800">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 p-4 rounded-2xl shadow-xl max-w-md border ${
            toastMsg.type === "success" ? "bg-emerald-900 text-white border-emerald-700" : "bg-rose-900 text-white border-rose-700"
          }`}
        >
          {toastMsg.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
          <span className="text-xs font-bold">{toastMsg.title}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-inner">
            <UserCheck size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
                Live Database Users
              </span>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Active Users Directory</h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Monitor active registered accounts, review login sessions, and manage access restrictions.
            </p>
          </div>
        </div>

        <button
          onClick={fetchActiveUsers}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Active Accounts</span>
            <h3 className="text-2xl font-black text-slate-900 font-outfit">{users.length}</h3>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">100% Account Access</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Online Today</span>
            <h3 className="text-2xl font-black text-slate-900 font-outfit">{users.length}</h3>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">Verified Live Sessions</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Activity size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Applications In-Flight</span>
            <h3 className="text-2xl font-black text-slate-900 font-outfit">{users.length}</h3>
            <span className="text-[11px] text-indigo-600 font-bold mt-1 inline-block">Submitted & Processing</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileText size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Identity Compliance</span>
            <h3 className="text-2xl font-black text-emerald-600 font-outfit">100%</h3>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">Audit Passed</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Name, Email, Mobile or User ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#4848F7] text-slate-800"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:outline-none focus:border-[#4848F7] cursor-pointer"
          >
            <option value="All Countries">All Residence Countries</option>
            <option value="India">India 🇮🇳</option>
            <option value="Canada">Canada 🇨🇦</option>
            <option value="United States">United States 🇺🇸</option>
            <option value="United Kingdom">United Kingdom 🇬🇧</option>
            <option value="Australia">Australia 🇦🇺</option>
          </select>
        </div>
      </div>

      {/* Active Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">
                <th className="py-3.5 px-4">USER ID</th>
                <th className="py-3.5 px-4">APPLICANT NAME</th>
                <th className="py-3.5 px-4">EMAIL ADDRESS</th>
                <th className="py-3.5 px-4">MOBILE</th>
                <th className="py-3.5 px-4">COUNTRY</th>
                <th className="py-3.5 px-4 text-center">ACCOUNT STATUS</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#4848F7] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-semibold">Loading live active users...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No active users found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr key={u._id || u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#4848F7]">{u.id}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 flex items-center gap-2.5">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{u.email}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{u.mobile}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      <span className="mr-1">{u.flag}</span> {u.country}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                        • {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewUser(u)}
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition cursor-pointer"
                          title="View Profile Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setBlockUserTarget(u)}
                          className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition cursor-pointer"
                          title="Block User Account"
                        >
                          <Lock size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Table Pagination Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-600">
          <div>
            Showing{" "}
            <span className="font-bold text-slate-900">
              {filteredUsers.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredUsers.length)}
            </span>{" "}
            of <span className="font-bold text-slate-900">{filteredUsers.length}</span> Active Users
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 font-bold font-mono text-[#4848F7] bg-indigo-50 rounded-lg border border-indigo-100">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* BLOCK USER REASON PROMPT MODAL */}
      {blockUserTarget && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setBlockUserTarget(null);
          }}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 text-slate-800">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">Block Account Access</h3>
                  <p className="text-xs text-rose-100/90 font-medium">User: {blockUserTarget.name} ({blockUserTarget.id})</p>
                </div>
              </div>
              <button
                onClick={() => setBlockUserTarget(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* Block Type Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Select Block Classification <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Temporary", "Permanent", "Security Lockdown"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setBlockType(t)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                        blockType === t
                          ? "bg-rose-50 border-rose-500 text-rose-700 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Reason for Blocking Account <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    "Fake Documents Provided",
                    "Multiple Fraud Attempts",
                    "Policy Violation",
                    "Unverified Identity",
                    "Custom Reason..."
                  ].map((reasonOpt) => (
                    <label
                      key={reasonOpt}
                      onClick={() => setSelectedReasonOption(reasonOpt)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                        selectedReasonOption === reasonOpt
                          ? "bg-rose-50/70 border-rose-400 text-rose-900 font-bold"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="blockReason"
                        checked={selectedReasonOption === reasonOpt}
                        onChange={() => setSelectedReasonOption(reasonOpt)}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <span>{reasonOpt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Reason Text Area */}
              {selectedReasonOption === "Custom Reason..." && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Enter Custom Reason Details <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Specify exact audit notes or policy violation details..."
                    value={customReasonText}
                    onChange={(e) => setCustomReasonText(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-rose-500 text-slate-800"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setBlockUserTarget(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingBlock}
                onClick={handleConfirmBlockUser}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-600/25 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmittingBlock ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Blocking User...</span>
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    <span>Confirm & Block User</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW USER DETAILS MODAL */}
      {viewUser && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewUser(null);
          }}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 text-slate-800">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={viewUser.avatar} alt={viewUser.name} className="w-10 h-10 rounded-full border-2 border-white/80" />
                <div>
                  <h3 className="text-base font-black tracking-tight">{viewUser.name}</h3>
                  <p className="text-xs text-blue-100 font-mono">{viewUser.id} • {viewUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setViewUser(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Country of Residence</span>
                  <strong className="text-slate-800 font-bold">{viewUser.country}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Mobile Number</span>
                  <strong className="text-slate-800 font-mono font-bold">{viewUser.mobile}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Nationality</span>
                  <strong className="text-slate-800 font-bold">{viewUser.nationality || "Indian"}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Registered Date</span>
                  <strong className="text-slate-800 font-mono font-bold">{viewUser.registrationDate}</strong>
                </div>
                <div className="col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Residential Address</span>
                  <strong className="text-slate-800 font-medium">{viewUser.address || `${viewUser.city || ''}, ${viewUser.state || ''}`}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
