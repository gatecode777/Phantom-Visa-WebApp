import React, { useState, useEffect } from "react";
import { API_V1_URL } from "../config/api";
import {
  FileCheck2,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Building,
  CreditCard,
  UserCheck,
  UserX,
  Check,
  Layers,
  ArrowUpRight
} from "lucide-react";

export interface KycRecord {
  id: string; // applicantId e.g. APP-1025
  _id?: string;
  userId?: string;
  name: string;
  avatar?: string;
  email: string;
  mobile: string;
  country: string;
  flag: string;
  kycStatus: "Pending" | "Under Audit" | "Approved" | "Rejected";
  submittedOn: string;
  govtIdType: string;
  aadhaarNumber?: string;
  panCardNumber?: string;
  ssnOrNationalId?: string;
  rejectionReason?: string;
}

export default function KycVerifications() {
  const [kycRecords, setKycRecords] = useState<KycRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // View Details Modal state
  const [viewRecord, setViewRecord] = useState<KycRecord | null>(null);

  // Toast notification
  const [toastMsg, setToastMsg] = useState<{ title: string; type: "success" | "error" } | null>(null);

  const showToast = (title: string, type: "success" | "error" = "success") => {
    setToastMsg({ title, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Fetch Live Applicants & KYC Records
  const fetchKycRecords = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_V1_URL}/applicant/all`);
      const json = await res.json();

      if (res.ok && json.success && Array.isArray(json.data)) {
        const records: KycRecord[] = json.data.map((item: any) => ({
          id: item.id || "APP-UNKNOWN",
          _id: item._id,
          userId: item.userId,
          name: item.name || "Applicant",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
          email: item.email || "N/A",
          mobile: item.mobile || "N/A",
          country: item.country || "India",
          flag: item.country === "Canada" ? "🇨🇦" : item.country === "Australia" ? "🇦🇺" : item.country === "United States" ? "🇺🇸" : item.country === "United Kingdom" ? "🇬🇧" : "🇮🇳",
          kycStatus: item.kycStatus || item.kycDetails?.kycStatus || "Pending",
          submittedOn: item.registeredOn || "Recently",
          govtIdType: item.kycDetails?.govtIdType || (item.country === "India" ? "Aadhaar & PAN Card" : "National Passport / ID"),
          aadhaarNumber: item.kycDetails?.aadhaarNumber,
          panCardNumber: item.kycDetails?.panCardNumber,
          ssnOrNationalId: item.kycDetails?.ssnOrNationalId,
          rejectionReason: item.kycDetails?.rejectionReason
        }));
        setKycRecords(records);
      } else {
        throw new Error(json.message || "Failed to load KYC records.");
      }
    } catch (err: any) {
      console.error("Error fetching KYC records:", err);
      setErrorMsg(err.message || "Could not fetch KYC submissions from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycRecords();
  }, []);

  // Handle Admin Approve / Reject Action
  const handleVerifyKyc = async (record: KycRecord, status: "Approved" | "Rejected") => {
    let rejectionReason = "";
    if (status === "Rejected") {
      const reasonInput = prompt("Enter rejection reason for KYC audit failure:", "Document scan blurry or mismatched.");
      if (reasonInput === null) return; // User cancelled
      rejectionReason = reasonInput.trim() || "Document scan blurry or mismatched.";
    }

    try {
      const res = await fetch(`${API_V1_URL}/applicant/verify-kyc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantId: record.id,
          userId: record.userId,
          status,
          rejectionReason
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update KYC verification status.");
      }

      showToast(`KYC status for ${record.name} updated to ${status}!`, "success");
      fetchKycRecords();
    } catch (err: any) {
      showToast(err.message || "Error updating KYC verification status.", "error");
    }
  };

  // Filter Logic
  const filteredRecords = kycRecords.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.mobile.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      r.country.toLowerCase().includes(q);

    const matchesStatus = selectedStatus === "All Statuses" || r.kycStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // KPI Metrics
  const totalCount = kycRecords.length;
  const pendingCount = kycRecords.filter((r) => r.kycStatus === "Pending" || r.kycStatus === "Under Audit").length;
  const approvedCount = kycRecords.filter((r) => r.kycStatus === "Approved").length;
  const rejectedCount = kycRecords.filter((r) => r.kycStatus === "Rejected").length;

  // Pagination Logic
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

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
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-[#4848F7] shadow-inner">
            <FileCheck2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4848F7] bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 font-mono">
                Consular Identity Audit
              </span>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">KYC Verifications Queue</h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Review, verify, approve, or request resubmission for applicant identity verification documents.
            </p>
          </div>
        </div>

        <button
          onClick={fetchKycRecords}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Total KYC Submissions</span>
            <h3 className="text-2xl font-black text-slate-900 font-outfit">{totalCount}</h3>
            <span className="text-[11px] text-indigo-600 font-bold mt-1 inline-block">Registered Applicants</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Pending Verification</span>
            <h3 className="text-2xl font-black text-amber-600 font-outfit">{pendingCount}</h3>
            <span className="text-[11px] text-amber-600 font-bold mt-1 inline-block">Requires Action / Complete</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Approved KYC</span>
            <h3 className="text-2xl font-black text-emerald-600 font-outfit">{approvedCount}</h3>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">Identity Verified</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Rejected KYC</span>
            <h3 className="text-2xl font-black text-rose-600 font-outfit">{rejectedCount}</h3>
            <span className="text-[11px] text-rose-600 font-bold mt-1 inline-block">Doc Mismatch / Blurry</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle size={20} />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Name, Email, Country or User ID..."
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
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:outline-none focus:border-[#4848F7] cursor-pointer"
          >
            <option value="All Statuses">All KYC Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Audit">Under Audit</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* KYC Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">
                <th className="py-3.5 px-4">USER ID</th>
                <th className="py-3.5 px-4">APPLICANT</th>
                <th className="py-3.5 px-4">COUNTRY</th>
                <th className="py-3.5 px-4">DOCUMENT TYPE</th>
                <th className="py-3.5 px-4">SUBMITTED ON</th>
                <th className="py-3.5 px-4 text-center">KYC STATUS</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#4848F7] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-semibold">Loading live KYC queue...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No KYC verification submissions found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((r) => (
                  <tr key={r._id || r.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#4848F7]">{r.id}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 flex items-center gap-2.5">
                      <img src={r.avatar} alt={r.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      <div>
                        <span>{r.name}</span>
                        <span className="text-[10px] text-slate-400 block font-mono font-normal">{r.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      <span className="mr-1">{r.flag}</span> {r.country}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{r.govtIdType}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{r.submittedOn}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold font-mono border inline-block ${
                          r.kycStatus === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : r.kycStatus === "Rejected"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : r.kycStatus === "Under Audit"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        • {r.kycStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewRecord(r)}
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition cursor-pointer"
                          title="View Submission Details"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => handleVerifyKyc(r, "Approved")}
                          className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition cursor-pointer"
                          title="Approve KYC Verification"
                        >
                          <Check size={15} />
                        </button>

                        <button
                          onClick={() => handleVerifyKyc(r, "Rejected")}
                          className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition cursor-pointer"
                          title="Reject KYC Submission"
                        >
                          <X size={15} />
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
              {filteredRecords.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredRecords.length)}
            </span>{" "}
            of <span className="font-bold text-slate-900">{filteredRecords.length}</span> KYC Submissions
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

      {/* View Details Modal */}
      {viewRecord && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewRecord(null);
          }}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 text-slate-800">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={viewRecord.avatar} alt={viewRecord.name} className="w-10 h-10 rounded-full border-2 border-white/80" />
                <div>
                  <h3 className="text-base font-black tracking-tight">{viewRecord.name}</h3>
                  <p className="text-xs text-blue-100 font-mono">{viewRecord.id} • {viewRecord.email}</p>
                </div>
              </div>
              <button
                onClick={() => setViewRecord(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Country</span>
                  <strong className="text-slate-800 font-bold">{viewRecord.flag} {viewRecord.country}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">KYC Status</span>
                  <strong className="text-[#4848F7] font-mono font-bold">{viewRecord.kycStatus}</strong>
                </div>
                <div className="col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Submitted Document Scheme</span>
                  <strong className="text-slate-900 font-bold">{viewRecord.govtIdType}</strong>
                </div>

                {viewRecord.aadhaarNumber && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Aadhaar Card No.</span>
                    <strong className="text-slate-900 font-mono font-extrabold">{viewRecord.aadhaarNumber}</strong>
                  </div>
                )}

                {viewRecord.panCardNumber && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">PAN Card No.</span>
                    <strong className="text-slate-900 font-mono font-extrabold">{viewRecord.panCardNumber}</strong>
                  </div>
                )}

                {viewRecord.ssnOrNationalId && (
                  <div className="col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">SSN / National ID</span>
                    <strong className="text-slate-900 font-mono font-extrabold">{viewRecord.ssnOrNationalId}</strong>
                  </div>
                )}
              </div>

              {viewRecord.rejectionReason && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-800">
                  <strong className="block mb-0.5 font-bold">Rejection Reason:</strong>
                  <span>{viewRecord.rejectionReason}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
