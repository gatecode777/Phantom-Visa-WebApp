"use client";

import React, { useState, useMemo } from "react";
import { Application, formatINR } from "../context/VisaContext";
import {
  CreditCard,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  FileText,
  Eye,
  Download,
  RefreshCw,
  Info,
  HelpCircle,
  Search,
  Filter,
  Layers,
  RotateCcw,
  Receipt,
  Building,
  User,
  Plane,
  ArrowRight,
  MessageSquare,
  FileCheck
} from "lucide-react";

export type PaymentTxStatus = "success" | "pending" | "failed" | "refunded";

export interface PaymentTxRecord {
  id: string;
  appId: string;
  country: string;
  visaType: string;
  date: string;
  amount: number;
  method: string;
  status: PaymentTxStatus;
  consularFee: number;
  serviceFee: number;
  gstTax: number;
  discount: number;
  gatewayRef: string;
  receiptPdfName: string;
  refundAmount?: number;
  refundReason?: string;
}

interface ApplicantPaymentHistoryProps {
  applications: Application[];
  onNavigateMakePayment?: () => void;
  onNavigateSupport?: () => void;
}

export default function ApplicantPaymentHistory({
  applications,
  onNavigateMakePayment,
  onNavigateSupport
}: ApplicantPaymentHistoryProps) {
  // Mock Payment History Records matching wireframe
  const [txItems, setTxItems] = useState<PaymentTxRecord[]>([
    {
      id: "PAY-2026-1025",
      appId: "VO-2026-1025",
      country: "Australia 🇦🇺",
      visaType: "Tourist Subclass 600",
      date: "07 Aug 2026, 10:15 AM",
      amount: 15500,
      method: "Credit Card (Visa •••• 8892)",
      status: "success",
      consularFee: 12500,
      serviceFee: 2500,
      gstTax: 1500,
      discount: 1000,
      gatewayRef: "RAZOR-9817264-AU",
      receiptPdfName: "invoice_PAY-2026-1025.pdf"
    },
    {
      id: "PAY-2026-0982",
      appId: "VO-2026-0982",
      country: "Schengen / France 🇫🇷",
      visaType: "Express Short-Stay Tourist",
      date: "01 Aug 2026, 04:30 PM",
      amount: 22000,
      method: "UPI Instant (Google Pay)",
      status: "success",
      consularFee: 18000,
      serviceFee: 3000,
      gstTax: 2000,
      discount: 1000,
      gatewayRef: "UPI-481920-FR",
      receiptPdfName: "invoice_PAY-2026-0982.pdf"
    },
    {
      id: "PAY-2026-0814",
      appId: "VO-2026-0814",
      country: "United Kingdom 🇬🇧",
      visaType: "Standard Visitor 6 Months",
      date: "25 Jul 2026, 02:10 PM",
      amount: 14500,
      method: "Net Banking (HDFC)",
      status: "pending",
      consularFee: 11000,
      serviceFee: 2500,
      gstTax: 1500,
      discount: 500,
      gatewayRef: "NETB-391827-UK",
      receiptPdfName: "proforma_PAY-2026-0814.pdf"
    },
    {
      id: "PAY-2026-0720",
      appId: "VO-2026-0720",
      country: "United States 🇺🇸",
      visaType: "B1/B2 Tourist Visitor",
      date: "15 Jul 2026, 11:00 AM",
      amount: 18500,
      method: "Credit Card (MasterCard)",
      status: "failed",
      consularFee: 15000,
      serviceFee: 2500,
      gstTax: 1000,
      discount: 0,
      gatewayRef: "CC-FAIL-77192",
      receiptPdfName: "failed_notice_PAY-2026-0720.pdf"
    },
    {
      id: "PAY-2026-0650",
      appId: "VO-2026-0650",
      country: "Canada 🇨🇦",
      visaType: "Visitor Visa V-1",
      date: "01 Jul 2026, 09:45 AM",
      amount: 16500,
      method: "Wallet Balance (Prepaid)",
      status: "refunded",
      consularFee: 13000,
      serviceFee: 2500,
      gstTax: 1000,
      discount: 0,
      gatewayRef: "WLT-RFD-55102",
      receiptPdfName: "refund_credit_PAY-2026-0650.pdf",
      refundAmount: 2500,
      refundReason: "Refusal Clause 4.1 Partial Platform Refund Guarantee"
    },
    {
      id: "PAY-2026-0512",
      appId: "VO-2026-0512",
      country: "Singapore 🇸🇬",
      visaType: "30-Day e-Visa",
      date: "15 Jun 2026, 03:20 PM",
      amount: 8500,
      method: "UPI Instant (PhonePe)",
      status: "success",
      consularFee: 6000,
      serviceFee: 2000,
      gstTax: 500,
      discount: 0,
      gatewayRef: "UPI-99102-SG",
      receiptPdfName: "invoice_PAY-2026-0512.pdf"
    }
  ]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "amount" | "status">("newest");

  // Selected Record for Inspector Drawer
  const [selectedTxId, setSelectedTxId] = useState<string>("PAY-2026-1025");

  const activeTx = useMemo(() => {
    return txItems.find((t) => t.id === selectedTxId) || txItems[0];
  }, [txItems, selectedTxId]);

  // Metrics
  const metrics = useMemo(() => {
    const total = txItems.length;
    const success = txItems.filter((t) => t.status === "success").length;
    const pending = txItems.filter((t) => t.status === "pending").length;
    const failed = txItems.filter((t) => t.status === "failed").length;
    const refunded = txItems.filter((t) => t.status === "refunded").length;
    
    const totalPaid = txItems
      .filter((t) => t.status === "success")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalRefunded = txItems
      .filter((t) => t.status === "refunded")
      .reduce((sum, t) => sum + (t.refundAmount || 0), 0);

    return { total, success, pending, failed, refunded, totalPaid, totalRefunded };
  }, [txItems]);

  // Itemized Statement Totals
  const statementTotals = useMemo(() => {
    const consular = txItems.filter((t) => t.status === "success").reduce((s, t) => s + t.consularFee, 0);
    const service = txItems.filter((t) => t.status === "success").reduce((s, t) => s + t.serviceFee, 0);
    const gst = txItems.filter((t) => t.status === "success").reduce((s, t) => s + t.gstTax, 0);
    const discount = txItems.filter((t) => t.status === "success").reduce((s, t) => s + t.discount, 0);

    return { consular, service, gst, discount };
  }, [txItems]);

  // Filtered List
  const filteredTx = useMemo(() => {
    return txItems
      .filter((t) => {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          t.id.toLowerCase().includes(q) ||
          t.appId.toLowerCase().includes(q) ||
          t.country.toLowerCase().includes(q) ||
          t.method.toLowerCase().includes(q) ||
          t.gatewayRef.toLowerCase().includes(q);

        const matchesStatus = statusFilter === "all" || t.status === statusFilter;
        const matchesMethod = methodFilter === "all" || t.method.toLowerCase().includes(methodFilter.toLowerCase());

        return matchesQ && matchesStatus && matchesMethod;
      })
      .sort((a, b) => {
        if (sortBy === "amount") return b.amount - a.amount;
        if (sortBy === "status") return a.status.localeCompare(b.status);
        return b.id.localeCompare(a.id);
      });
  }, [txItems, searchQuery, statusFilter, methodFilter, sortBy]);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & STATUS BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Payments</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">Payment History</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Consular Payment History & Invoices</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck size={12} className="text-emerald-600" /> Audit Verified • GST Tax Compliant
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            View all completed transactions, pending invoices, refund receipts, itemized GST tax statements, and payment activity logs.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => alert("Downloading Consolidated Tax Statement (PDF/CSV)...")}
            className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Download size={16} />
            <span>Consolidated Tax Statement</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: DASHBOARD STATISTICS CARDS GRID (6 CARDS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Transactions */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Transactions</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{String(metrics.total).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">All ledger records</span>
        </div>

        {/* Card 2: Successful Payments */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Successful</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{String(metrics.success).padStart(2, "0")}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 size={10} /> Fully cleared
          </span>
        </div>

        {/* Card 3: Pending Payments */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Pending</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{String(metrics.pending).padStart(2, "0")}</p>
          <span className="text-[10px] text-amber-600 font-medium">Gateway clearing</span>
        </div>

        {/* Card 4: Failed Payments */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-red-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Failed</p>
          <p className="text-2xl font-black text-red-600 mt-1">{String(metrics.failed).padStart(2, "0")}</p>
          <span className="text-[10px] text-red-600 font-medium">Declined/Cancelled</span>
        </div>

        {/* Card 5: Refunded Amount */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Refunded</p>
          <p className="text-xl font-bold text-slate-700 mt-1">₹{formatINR(metrics.totalRefunded)}</p>
          <span className="text-[10px] text-indigo-600 font-medium flex items-center gap-0.5">
            <RotateCcw size={10} /> Credited back
          </span>
        </div>

        {/* Card 6: Total Paid */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-[#4848F7]">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Amount Paid</p>
          <p className="text-xl font-black text-[#4848F7] mt-1">₹{formatINR(metrics.totalPaid)}</p>
          <span className="text-[10px] text-[#4848F7] font-semibold">Lifetime spent</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: CONCEPTUAL WORKFLOW BANNER (CONNECTED 3-PARTY PAYMENT AUDIT FLOW) */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#4848F7]" size={20} />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
              Connected Payment Audit Workflow (Applicant ➔ Gateway ➔ Consular Desk)
            </h3>
          </div>
          <span className="text-[11px] bg-white/10 text-slate-300 font-mono px-3 py-1 rounded-full">
            Real-Time Audit Trail
          </span>
        </div>

        {/* Workflow Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 1</span>
            <p className="text-white">Applicant Initiates Checkout</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 2</span>
            <p className="text-white">Payment Gateway Clearing</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 3</span>
            <p className="text-white">Ledger Verification & Settlement</p>
          </div>

          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30 space-y-1 text-emerald-300">
            <span className="text-emerald-300 block text-[10px] uppercase">Stage 4</span>
            <p className="font-bold">Tax Invoice & Receipt Generated ✓</p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl text-xs space-y-1 text-slate-300">
          <p className="font-bold text-white">Professional Recommendation & Tax Compliance Notes:</p>
          <ul className="list-disc pl-4 space-y-1 leading-relaxed text-[11px]">
            <li>All tax invoices include 18% GST registration details for business expense claims.</li>
            <li>For pending bank transfers, gateway clearing may take up to 24 business hours.</li>
            <li>Refunds under refusal guarantees are auto-credited to your prepaid wallet balance.</li>
          </ul>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 4: SEARCH & MULTI-FILTER CONTROL BAR */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search Transaction ID, App ID, Country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4848F7] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end text-xs">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Statuses</option>
              <option value="success">Success ✓</option>
              <option value="pending">Pending ⏳</option>
              <option value="failed">Failed ❌</option>
              <option value="refunded">Refunded ↩️</option>
            </select>

            {/* Payment Method Filter */}
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Methods</option>
              <option value="card">Credit / Debit Card</option>
              <option value="upi">UPI Instant</option>
              <option value="banking">Net Banking</option>
              <option value="wallet">Wallet Balance</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="newest">Sort: Date Newest</option>
              <option value="amount">Sort: Amount Highest</option>
              <option value="status">Sort: Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: PAYMENT HISTORY DIRECTORY TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Receipt size={16} className="text-[#4848F7]" />
            <span>Transaction Directory Ledger ({filteredTx.length})</span>
          </h3>
          <span className="text-[11px] text-slate-400">Click any row to view itemized tax breakdown</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Country & Visa</th>
                <th className="py-3 px-4">Payment Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredTx.map((t) => {
                const isSelected = t.id === selectedTxId;
                return (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTxId(t.id)}
                    className={`cursor-pointer transition hover:bg-indigo-50/40 ${
                      isSelected ? "bg-indigo-50/80 font-semibold" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 flex items-center gap-2">
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#4848F7]" />}
                      {t.id}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-700 font-semibold">{t.appId}</td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{t.country}</p>
                      <p className="text-[10px] text-slate-500">{t.visaType}</p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">{t.date}</td>

                    <td className="py-3.5 px-4 font-black text-slate-900">₹{formatINR(t.amount)}</td>

                    <td className="py-3.5 px-4 text-slate-700">{t.method}</td>

                    <td className="py-3.5 px-4">
                      {t.status === "success" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 size={12} /> Success
                        </span>
                      )}

                      {t.status === "pending" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          <Clock size={12} /> Pending
                        </span>
                      )}

                      {t.status === "failed" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                          <XCircle size={12} /> Failed
                        </span>
                      )}

                      {t.status === "refunded" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                          <RotateCcw size={12} /> Refunded
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedTxId(t.id)}
                          className="bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#4848F7] text-slate-700 font-bold px-2 py-1 rounded-lg transition text-[11px]"
                        >
                          Inspect
                        </button>

                        <button
                          onClick={() => alert(`Downloading receipt ${t.receiptPdfName}...`)}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                          title="Download Receipt PDF"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 6: SELECTED PAYMENT DETAILS INSPECTOR CARD */}
      {/* ============================================================ */}
      {activeTx && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-3">
              <FileCheck size={24} className="text-[#4848F7]" />
              <div>
                <h3 className="text-base font-black text-slate-900">Transaction Inspector: {activeTx.id}</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Gateway Ref: <span className="font-mono">{activeTx.gatewayRef}</span> &bull; Timestamp: {activeTx.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert(`Downloading receipt ${activeTx.receiptPdfName}...`)}
                className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={14} /> Download Tax Invoice PDF
              </button>
            </div>
          </div>

          {/* Itemized Fee Inspector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 font-medium block">Consular Fee</span>
              <span className="font-bold text-slate-900">₹{formatINR(activeTx.consularFee)}</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Service Fee</span>
              <span className="font-bold text-slate-900">₹{formatINR(activeTx.serviceFee)}</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">GST Tax (18%)</span>
              <span className="font-bold text-slate-900">₹{formatINR(activeTx.gstTax)}</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Discount Saved</span>
              <span className="font-bold text-indigo-600">-₹{formatINR(activeTx.discount)}</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Total Net Amount</span>
              <span className="font-black text-lg text-[#4848F7]">₹{formatINR(activeTx.amount)}</span>
            </div>
          </div>

          {activeTx.status === "refunded" && (
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-xs text-indigo-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <RotateCcw size={14} className="text-indigo-600" /> Refund Settlement Record:
              </p>
              <p className="font-mono text-slate-800">
                Amount: ₹{formatINR(activeTx.refundAmount || 0)} &bull; Reason: {activeTx.refundReason}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 7: ITEMIZED PAYMENT BREAKDOWN STATEMENT */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
        <h4 className="font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileText size={15} className="text-[#4848F7]" />
          <span>Lifetime Payment Breakdown Statement</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block mb-1">Total Consular Fees Paid</span>
            <span className="text-lg font-black text-slate-900">₹{formatINR(statementTotals.consular)}</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block mb-1">Total Service Fees</span>
            <span className="text-lg font-black text-slate-900">₹{formatINR(statementTotals.service)}</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block mb-1">Total GST Tax Paid (18%)</span>
            <span className="text-lg font-black text-slate-900">₹{formatINR(statementTotals.gst)}</span>
          </div>

          <div className="bg-indigo-50 p-3.5 rounded-xl border border-indigo-200">
            <span className="text-indigo-700 font-bold block mb-1">Total Coupon Savings</span>
            <span className="text-lg font-black text-indigo-700">₹{formatINR(statementTotals.discount)}</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 8: QUICK ACTIONS & SHORTCUTS BAR */}
      {/* ============================================================ */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg text-xs">
        <div>
          <h4 className="font-extrabold text-white">Need Help or Invoice Corrections?</h4>
          <p className="text-slate-400 mt-0.5">Contact payment support for tax receipt updates or transaction clearance issues.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onNavigateMakePayment && (
            <button
              onClick={onNavigateMakePayment}
              className="bg-[#4848F7] hover:bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <CreditCard size={14} /> Make New Payment
            </button>
          )}

          <button
            onClick={() => {
              if (onNavigateSupport) onNavigateSupport();
              else alert("Connecting to payment support desk...");
            }}
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare size={14} /> Contact Support
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 9: PAYMENT HISTORY FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Payment History</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">How can I download GST tax invoices for my business?</p>
            <p className="text-slate-600 leading-relaxed">
              Click "Download Tax Invoice PDF" on any transaction row or download the Consolidated Tax Statement from the top header.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">How are refunds processed for cancelled applications?</p>
            <p className="text-slate-600 leading-relaxed">
              Eligible refunds under our money-back policy are credited to your prepaid wallet balance within 24 business hours.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
