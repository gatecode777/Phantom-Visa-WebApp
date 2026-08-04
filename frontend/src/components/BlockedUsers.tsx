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
  ShieldAlert,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
  UserX,
  Layers,
  Edit3,
  AlertCircle,
  Info
} from "lucide-react";

export interface BlockedUserRecord {
  id: string;
  _id?: string;
  userId?: string;
  name: string;
  avatar?: string;
  email: string;
  mobile: string;
  country: string;
  flag: string;
  blockType: string;
  blockedOn: string;
  blockedBy: string;
  reason: string;
  passportNumber?: string;
  nationality?: string;
  registrationDate?: string;
  address?: string;
  isDeactivated?: boolean;
}

export default function BlockedUsers() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUserRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBlockType, setSelectedBlockType] = useState("All Block Types");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // View Modal
  const [viewUser, setViewUser] = useState<BlockedUserRecord | null>(null);
  const [unblockUserTarget, setUnblockUserTarget] = useState<BlockedUserRecord | null>(null);
  const [isSubmittingUnblock, setIsSubmittingUnblock] = useState<boolean>(false);

  // Toast
  const [toastMsg, setToastMsg] = useState<{ title: string; type: "success" | "error" } | null>(null);

  const showToast = (title: string, type: "success" | "error" = "success") => {
    setToastMsg({ title, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Fetch Blocked Applicants from MongoDB
  const fetchBlockedUsers = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_V1_URL}/applicant/all`);
      const json = await res.json();

      if (res.ok && json.success && Array.isArray(json.data)) {
        // Filter blocked users only (isDeactivated === true)
        const blockedOnly: BlockedUserRecord[] = json.data
          .filter((item: any) => item.isDeactivated)
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
            blockType: item.blockType || "Temporary",
            blockedOn: item.blockedOn || item.registeredOn || "Recently",
            blockedBy: item.blockedBy || "Admin (Consular Officer)",
            reason: item.blockReason || "Policy Violation",
            passportNumber: item.passportNumber || "N/A",
            nationality: item.nationality || "Indian",
            registrationDate: item.registeredOn || "N/A",
            address: item.address,
            isDeactivated: true
          }));

        setBlockedUsers(blockedOnly);
      } else {
        throw new Error(json.message || "Failed to load blocked users.");
      }
    } catch (err: any) {
      console.error("Error fetching blocked users:", err);
      setErrorMsg(err.message || "Could not fetch blocked users from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  // Handle Unblock User
  const handleConfirmUnblock = async () => {
    if (!unblockUserTarget) return;

    setIsSubmittingUnblock(true);
    try {
      const res = await fetch(`${API_V1_URL}/applicant/toggle-block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: unblockUserTarget.userId,
          applicantId: unblockUserTarget.id,
          isDeactivated: false
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to unblock user.");
      }

      showToast(`User ${unblockUserTarget.name} has been unblocked!`, "success");
      setUnblockUserTarget(null);
      fetchBlockedUsers();
    } catch (err: any) {
      showToast(err.message || "Error unblocking user.", "error");
    } finally {
      setIsSubmittingUnblock(false);
    }
  };

  // Filtered Blocked Users
  const filteredUsers = blockedUsers.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.mobile.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q) ||
      u.reason.toLowerCase().includes(q);

    const matchesType = selectedBlockType === "All Block Types" || u.blockType === selectedBlockType;

    return matchesSearch && matchesType;
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
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-inner">
            <UserX size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 font-mono">
                Access Restriction Audit
              </span>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Blocked Users Directory</h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Review restricted accounts, view documented block reasons, and lift restrictions when verified.
            </p>
          </div>
        </div>

        <button
          onClick={fetchBlockedUsers}
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
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Restricted Accounts</span>
            <h3 className="text-2xl font-black text-rose-600 font-outfit">{blockedUsers.length}</h3>
            <span className="text-[11px] text-rose-600 font-bold mt-1 inline-block">Blocked in Database</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <ShieldAlert size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Temporary Restrictions</span>
            <h3 className="text-2xl font-black text-slate-900 font-outfit">
              {blockedUsers.filter((u) => u.blockType === "Temporary").length}
            </h3>
            <span className="text-[11px] text-amber-600 font-bold mt-1 inline-block">Pending Document Review</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Permanent Bans</span>
            <h3 className="text-2xl font-black text-slate-900 font-outfit">
              {blockedUsers.filter((u) => u.blockType === "Permanent").length}
            </h3>
            <span className="text-[11px] text-rose-600 font-bold mt-1 inline-block">Non-appealable Bans</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Security Audit</span>
            <h3 className="text-2xl font-black text-emerald-600 font-outfit">100%</h3>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">Reason Logged</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileText size={20} />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Name, Email, Mobile or Reason..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-rose-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedBlockType}
            onChange={(e) => {
              setSelectedBlockType(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:outline-none focus:border-rose-500 cursor-pointer"
          >
            <option value="All Block Types">All Block Types</option>
            <option value="Temporary">Temporary</option>
            <option value="Permanent">Permanent</option>
            <option value="Security Lockdown">Security Lockdown</option>
          </select>
        </div>
      </div>

      {/* Blocked Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">
                <th className="py-3.5 px-4">USER ID</th>
                <th className="py-3.5 px-4">APPLICANT NAME</th>
                <th className="py-3.5 px-4">EMAIL ADDRESS</th>
                <th className="py-3.5 px-4">MOBILE</th>
                <th className="py-3.5 px-4">BLOCK TYPE</th>
                <th className="py-3.5 px-4">BLOCKED ON</th>
                <th className="py-3.5 px-4">BLOCKED BY</th>
                <th className="py-3.5 px-4 text-rose-600">REASON FOR BLOCKING</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-semibold">Loading live blocked users...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No blocked users currently found in database.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr key={u._id || u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-600">{u.id}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 flex items-center gap-2.5">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{u.email}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{u.mobile}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono border ${
                          u.blockType === "Permanent"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {u.blockType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{u.blockedOn}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{u.blockedBy}</td>
                    <td className="py-3.5 px-4 font-bold text-rose-600 bg-rose-50/30 rounded-lg">
                      {u.reason}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewUser(u)}
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition cursor-pointer"
                          title="View Profile & Audit Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setUnblockUserTarget(u)}
                          className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition cursor-pointer"
                          title="Unblock User Account"
                        >
                          <Unlock size={15} />
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
            of <span className="font-bold text-slate-900">{filteredUsers.length}</span> Blocked Users
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 font-bold font-mono text-rose-600 bg-rose-50 rounded-lg border border-rose-100">
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

      {/* UNBLOCK USER PROMPT MODAL */}
      {unblockUserTarget && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setUnblockUserTarget(null);
          }}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 text-slate-800">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <Unlock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">Lift Account Restriction</h3>
                  <p className="text-xs text-emerald-100 font-medium">User: {unblockUserTarget.name}</p>
                </div>
              </div>
              <button
                onClick={() => setUnblockUserTarget(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Are you sure you want to lift restrictions and unblock account access for{" "}
                <strong className="text-slate-900">{unblockUserTarget.name}</strong> ({unblockUserTarget.email})?
              </p>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px]">
                <strong className="block mb-0.5">Current Block Reason:</strong>
                <span>"{unblockUserTarget.reason}"</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setUnblockUserTarget(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingUnblock}
                onClick={handleConfirmUnblock}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/25 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmittingUnblock ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Unblocking...</span>
                  </>
                ) : (
                  <>
                    <Unlock size={14} />
                    <span>Confirm & Unblock</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW USER AUDIT DETAILS MODAL */}
      {viewUser && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewUser(null);
          }}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 text-slate-800">
            <div className="bg-gradient-to-r from-rose-700 to-red-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={viewUser.avatar} alt={viewUser.name} className="w-10 h-10 rounded-full border-2 border-white/80" />
                <div>
                  <h3 className="text-base font-black tracking-tight">{viewUser.name}</h3>
                  <p className="text-xs text-rose-100 font-mono">{viewUser.id} • {viewUser.email}</p>
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
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Documented Block Reason</span>
                  <span className="px-2 py-0.5 bg-rose-200 text-rose-800 rounded font-mono font-bold text-[10px]">{viewUser.blockType}</span>
                </div>
                <p className="text-slate-900 font-extrabold text-sm">{viewUser.reason}</p>
                <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-rose-200/60">
                  <span>Blocked By: {viewUser.blockedBy}</span>
                  <span>Blocked Date: {viewUser.blockedOn}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Country of Residence</span>
                  <strong className="text-slate-800 font-bold">{viewUser.country}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Mobile Number</span>
                  <strong className="text-slate-800 font-mono font-bold">{viewUser.mobile}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
