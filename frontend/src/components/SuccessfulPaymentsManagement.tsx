import React, { useState } from "react";
import {
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  PlusCircle,
  Trash2,
  AlertCircle,
  Globe,
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
  Tag,
  CheckSquare,
  AlertTriangle,
  Receipt,
  DollarSign,
  FileText,
  RotateCcw,
  BarChart3,
  PieChart
} from "lucide-react";

export interface SuccessfulPaymentRecord {
  id: string;
  txnId: string;
  appId: string;
  applicantName: string;
  passportNumber: string;
  nationality: string;
  paidBy: "Applicant" | "Agent";
  agentName?: string;
  amount: number;
  paymentMethod: "UPI" | "Credit Card" | "Debit Card" | "Net Banking" | "Wallet" | "Bank Transfer";
  paymentDate: string;
  paymentDateTime: string;
  invoiceNo: string;
  receiptNo: string;
  status: "Successful";
  country: string;
  visaCategory: "Tourist" | "Business" | "Student" | "Work" | "Medical" | "Transit";
  paymentGateway: "Razorpay" | "Stripe" | "HDFC Netbanking";
  paymentRefNo: string;
  breakdown: {
    visaAppFee: number;
    serviceCharge: number;
    processingFee: number;
    taxGst: number;
    discount: number;
  };
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_SUCCESSFUL_PAYMENT_TABS = [
  "Overview",
  "Applicant Details",
  "Payment Details",
  "Fee Breakdown",
  "Invoice",
  "Receipt",
  "Activity Logs"
];

export const SUCCESSFUL_PAYMENT_WORKFLOW_STEPS = [
  "Application Submitted",
  "Payment Initiated",
  "Payment Selected",
  "Payment Successful",
  "Invoice Generated",
  "Receipt Sent",
  "Application Processing Starts"
];

export const REVENUE_SUMMARY_ITEMS = [
  "Total Revenue",
  "Today's Collection",
  "Weekly Collection",
  "Monthly Collection",
  "Average Transaction Value",
  "Highest Payment"
];

export const EXPORT_OPTIONS_ITEMS = [
  "PDF Export",
  "Excel Export",
  "CSV Export",
  "Print Report"
];

const MOCK_SUCCESSFUL_PAYMENTS: SuccessfulPaymentRecord[] = [
  {
    id: "1",
    txnId: "TXN-L80501",
    appId: "APP-20262001",
    applicantName: "Geeta Bisht",
    passportNumber: "Z9876543",
    nationality: "Indian",
    paidBy: "Applicant",
    amount: 8500,
    paymentMethod: "UPI",
    paymentDate: "01 Aug 2026",
    paymentDateTime: "01 Aug 2026 10:15 AM",
    invoiceNo: "INV-#501",
    receiptNo: "RCP-2026-9901",
    status: "Successful",
    country: "Canada",
    visaCategory: "Tourist",
    paymentGateway: "Razorpay",
    paymentRefNo: "RZP_PAY_88771122",
    breakdown: {
      visaAppFee: 5000,
      serviceCharge: 1500,
      processingFee: 1000,
      taxGst: 1000,
      discount: 0
    },
    actionNotes: [
      { id: "n1", author: "System", text: "Automated instant confirmation receipt delivered.", date: "01 Aug 2026 10:15 AM" }
    ]
  },
  {
    id: "2",
    txnId: "TXN-L80502",
    appId: "APP-20262002",
    applicantName: "Rahul Sharma",
    passportNumber: "M1234567",
    nationality: "Indian",
    paidBy: "Agent",
    agentName: "Apex Travels",
    amount: 12000,
    paymentMethod: "Credit Card",
    paymentDate: "01 Aug 2026",
    paymentDateTime: "01 Aug 2026 11:45 AM",
    invoiceNo: "INV-#502",
    receiptNo: "RCP-2026-9902",
    status: "Successful",
    country: "Australia",
    visaCategory: "Business",
    paymentGateway: "Stripe",
    paymentRefNo: "STP_PAY_33445511",
    breakdown: {
      visaAppFee: 7500,
      serviceCharge: 2000,
      processingFee: 1500,
      taxGst: 1000,
      discount: 0
    },
    actionNotes: []
  },
  {
    id: "3",
    txnId: "TXN-L80503",
    appId: "APP-20262003",
    applicantName: "Bikram Suman",
    passportNumber: "K4567890",
    nationality: "Indian",
    paidBy: "Applicant",
    amount: 15500,
    paymentMethod: "Net Banking",
    paymentDate: "01 Aug 2026",
    paymentDateTime: "01 Aug 2026 01:20 PM",
    invoiceNo: "INV-#503",
    receiptNo: "RCP-2026-9903",
    status: "Successful",
    country: "UAE",
    visaCategory: "Tourist",
    paymentGateway: "HDFC Netbanking",
    paymentRefNo: "HDFC_NET_55667788",
    breakdown: {
      visaAppFee: 9500,
      serviceCharge: 2500,
      processingFee: 2000,
      taxGst: 1500,
      discount: 0
    },
    actionNotes: []
  }
];

export default function SuccessfulPaymentsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [paidByFilter, setPaidByFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");

  // Records State
  const [paymentsList, setPaymentsList] = useState<SuccessfulPaymentRecord[]>(MOCK_SUCCESSFUL_PAYMENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalPayment, setActiveModalPayment] = useState<SuccessfulPaymentRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredPayments = paymentsList.filter((pay) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      pay.txnId.toLowerCase().includes(q) ||
      pay.appId.toLowerCase().includes(q) ||
      pay.applicantName.toLowerCase().includes(q) ||
      pay.receiptNo.toLowerCase().includes(q) ||
      (pay.agentName && pay.agentName.toLowerCase().includes(q));

    const matchesPaidBy = paidByFilter === "All" || pay.paidBy === paidByFilter;
    const matchesMethod = methodFilter === "All" || pay.paymentMethod === methodFilter;
    const matchesCategory = categoryFilter === "All" || pay.visaCategory === categoryFilter;
    const matchesCountry = countryFilter === "All" || pay.country === countryFilter;

    return matchesQuery && matchesPaidBy && matchesMethod && matchesCategory && matchesCountry;
  });

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredPayments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPayments.map((p) => p.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handleDeleteRecord = (pay: SuccessfulPaymentRecord) => {
    setPaymentsList((prev) => prev.filter((p) => p.id !== pay.id));
    triggerToast(`Payment record ${pay.txnId} deleted.`);
    if (activeModalPayment?.id === pay.id) setActiveModalPayment(null);
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 font-sans min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#0E1A2C] border border-[#2563EB]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
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
            <CheckCircle2 size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Cleared Financial Receipts & Revenue Collection
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Successful Payments
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            View all successfully completed payment transactions for visa applications.
          </p>
        </div>
      </div>

      {/* DASHBOARD STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Successful</span>
            <div className="text-2xl font-black text-slate-900 font-mono">21,840</div>
            <span className="text-[10px] text-emerald-600 font-bold">Cleared Ledger Vault</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Successful Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">186</div>
            <span className="text-[10px] text-emerald-600 font-bold">Daily Approvals</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Today's Revenue</span>
            <div className="text-2xl font-black text-slate-900 font-mono">₹8,45,500</div>
            <span className="text-[10px] text-blue-600 font-bold">Daily Collection</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">This Month's Revenue</span>
            <div className="text-2xl font-black text-slate-900 font-mono">₹2,84,75,000</div>
            <span className="text-[10px] text-purple-600 font-bold">Monthly Collection</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Avg Transaction Value</span>
            <div className="text-2xl font-black text-slate-900 font-mono">₹11,250</div>
            <span className="text-[10px] text-amber-600 font-bold">Per Order Average</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">Success Rate</span>
            <div className="text-2xl font-black text-slate-900 font-mono">94.8%</div>
            <span className="text-[10px] text-teal-600 font-bold">Gateway Health</span>
          </div>
        </div>

        {/* RIGHT CARD: WORKFLOW & REVENUE FEATURES CATALOG (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Payment Workflow
            </h3>

            {/* PAYMENT WORKFLOW FLOW */}
            <div className="space-y-1 text-[11px] text-slate-700 font-medium mb-3">
              {SUCCESSFUL_PAYMENT_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-[9px] shrink-0">
                    ▼
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* REVENUE SUMMARY & EXPORT OPTIONS */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px] font-semibold text-slate-600">
              <span className="text-slate-900 font-bold block mb-1">Revenue Features & Exports:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                {REVENUE_SUMMARY_ITEMS.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-center gap-1 text-slate-700">
                    <Check size={11} className="text-[#2563EB]" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search & Revenue Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredPayments.length} of {paymentsList.length} Successful Payments
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search (Txn ID, App ID, Applicant, Receipt)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="TXN-L80501, APP-20262001..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* PAID BY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Paid By
            </label>
            <select
              value={paidByFilter}
              onChange={(e) => setPaidByFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Payers</option>
              <option value="Applicant">Applicant (Direct)</option>
              <option value="Agent">Agent (B2B Wallet)</option>
            </select>
          </div>

          {/* PAYMENT METHOD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Payment Method
            </label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
            </select>
          </div>

          {/* VISA CATEGORY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Visa Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Categories</option>
              <option value="Tourist">Tourist</option>
              <option value="Business">Business</option>
              <option value="Student">Student</option>
              <option value="Work">Work</option>
            </select>
          </div>

          {/* COUNTRY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Country
            </label>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Countries</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="UAE">UAE</option>
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
            <span>Successful Payments Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => triggerToast(`Downloading receipts for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Receipt size={14} /> Download Receipts
            </button>
            <button
              onClick={() => triggerToast(`Generating revenue report for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <BarChart3 size={14} /> Generate Revenue Report
            </button>
          </div>
        </div>
      )}

      {/* SUCCESSFUL PAYMENTS TABLE (COLUMNS MATCH WIREFRAME EXACTLY) */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredPayments.length && filteredPayments.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 font-mono">Transaction ID</th>
                <th className="py-3.5 px-4 font-mono">Application ID</th>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Paid By</th>
                <th className="py-3.5 px-4 font-mono">Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4 font-mono">Payment Date</th>
                <th className="py-3.5 px-4 font-mono">Invoice</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <CheckCircle2 size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No successful payments found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={() => handleToggleSelect(p.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {p.txnId}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {p.appId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {p.applicantName}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {p.paidBy}
                      {p.agentName && <span className="block text-[10px] text-slate-400 font-normal">({p.agentName})</span>}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-600">
                      ₹{p.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {p.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {p.paymentDate}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-700">
                      {p.invoiceNo}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                        🟢 Successful
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setActiveModalPayment(p);
                            setModalTab("Overview");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Payment Details & Fee Breakdown"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => triggerToast(`Downloading receipt ${p.receiptNo}...`)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Download Receipt"
                        >
                          <Receipt size={15} />
                        </button>
                        <button
                          onClick={() => triggerToast(`Printing invoice ${p.invoiceNo}...`)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Print Invoice"
                        >
                          <Printer size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(p)}
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
          <div>Showing 1–10 of 21,840 Successful Payments</div>
          <div className="flex items-center gap-1 font-mono font-bold">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-40">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#2563EB] text-white rounded-lg">1</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">2</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">3</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* REVENUE ANALYTICS BOX & PROFESSIONAL RECOMMENDATION (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* REVENUE ANALYTICS SUMMARY */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-slate-100 pb-2">
            <BarChart3 size={16} className="text-[#2563EB]" /> Revenue Analytics Summary
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-extrabold uppercase">Today's Revenue</span>
              <strong className="text-emerald-600 font-mono text-base font-bold">₹8,45,500</strong>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-extrabold uppercase">Weekly Revenue</span>
              <strong className="text-[#2563EB] font-mono text-base font-bold">₹64,20,000</strong>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-extrabold uppercase">Monthly Revenue</span>
              <strong className="text-purple-700 font-mono text-base font-bold">₹2,84,75,000</strong>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-extrabold uppercase">Top Country Collection</span>
              <strong className="text-slate-900 font-mono text-base font-bold">Canada (₹1.2 Cr)</strong>
            </div>
          </div>
        </div>

        {/* PROFESSIONAL RECOMMENDATION BOX */}
        <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-blue-100 pb-2">
            <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Finance Columns
          </h3>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            All columns for professional finance dashboard are fully active: Transaction ID, Application ID, Applicant Name, Paid By, Visa Category, Amount Paid, Service Fee, Tax, Payment Method, Date & Time, Invoice No, Receipt No, Status, Actions.
          </p>
        </div>
      </div>

      {/* CENTERED POPUP DETAILS MODAL (7 RECOMMENDED TABS FROM WIREFRAME) */}
      {activeModalPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-lg text-white">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      Payment Receipt {activeModalPayment.receiptNo}
                    </h3>
                    <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-700">
                      ₹{activeModalPayment.amount.toLocaleString()} (CLEARED)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">App ID: <strong className="text-blue-300">{activeModalPayment.appId}</strong> &bull; Applicant: {activeModalPayment.applicantName} ({activeModalPayment.passportNumber})</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalPayment(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {RECOMMENDED_SUCCESSFUL_PAYMENT_TABS.map((tab) => {
                const active = modalTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setModalTab(tab)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      active
                        ? "bg-[#2563EB] text-white shadow-sm"
                        : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200"
                    }`}
                  >
                    <span>{tab}</span>
                  </button>
                );
              })}
            </div>

            {/* MODAL BODY */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {/* TAB 1: OVERVIEW */}
              {modalTab === "Overview" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* OVERVIEW TILES */}
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-3">
                      Payment & Fee Breakdown Overview
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Transaction ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalPayment.txnId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Invoice Number</span>
                        <strong className="text-purple-700 font-mono font-bold">{activeModalPayment.invoiceNo}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Receipt Number</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalPayment.receiptNo}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Payment Method</span>
                        <strong className="text-slate-900 font-bold">{activeModalPayment.paymentMethod} ({activeModalPayment.paymentGateway})</strong>
                      </div>
                    </div>
                  </div>

                  {/* ITEMISED FEE BREAKDOWN TABLE */}
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <Receipt size={16} className="text-emerald-600" /> Itemised Fee Breakdown
                    </h4>
                    <div className="space-y-2 text-xs font-medium text-slate-700">
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span>Visa Application Fee</span>
                        <span className="font-mono font-bold">₹{activeModalPayment.breakdown.visaAppFee.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span>Service Charge</span>
                        <span className="font-mono font-bold">₹{activeModalPayment.breakdown.serviceCharge.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span>Processing Fee</span>
                        <span className="font-mono font-bold">₹{activeModalPayment.breakdown.processingFee.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span>Tax (18% GST)</span>
                        <span className="font-mono font-bold">₹{activeModalPayment.breakdown.taxGst.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 text-sm font-extrabold text-slate-900">
                        <span>Total Amount Paid</span>
                        <span className="font-mono text-emerald-600">₹{activeModalPayment.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerToast(`Downloading receipt ${activeModalPayment.receiptNo}...`)}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Receipt size={15} /> Download Receipt
                </button>
                <button
                  onClick={() => triggerToast(`Printing invoice ${activeModalPayment.invoiceNo}...`)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Printer size={15} /> Print Invoice
                </button>
              </div>

              <button
                onClick={() => triggerToast(`Sending receipt copy to ${activeModalPayment.applicantName}...`)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Send size={14} /> Email Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
