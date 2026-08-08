"use client";

import React, { useState, useMemo } from "react";
import { Application, formatINR } from "../context/VisaContext";
import {
  FileText,
  Download,
  Printer,
  Mail,
  Edit,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileCode,
  XCircle,
  Search,
  Filter,
  Layers,
  Building,
  User,
  CreditCard,
  HelpCircle,
  QrCode,
  FileCheck,
  RefreshCw,
  Info,
  Zap,
  Tag,
  ArrowRight,
  PackageCheck
} from "lucide-react";

export type InvoiceStatus = "paid" | "pending" | "proforma" | "cancelled";

export interface InvoiceRecord {
  id: string;
  appId: string;
  country: string;
  visaType: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  travelerName: string;
  consularFee: number;
  serviceFee: number;
  cgst: number;
  sgst: number;
  discount: number;
  paymentMethod: string;
  paymentRef: string;
  gstin: string;
  billingAddress: string;
  pdfFileName: string;
}

interface ApplicantInvoicesProps {
  applications: Application[];
  onNavigateMakePayment?: () => void;
  onNavigateSupport?: () => void;
}

export default function ApplicantInvoices({
  applications,
  onNavigateMakePayment,
  onNavigateSupport
}: ApplicantInvoicesProps) {
  // Mock Invoices Dataset matching wireframe
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([
    {
      id: "INV-2026-0891",
      appId: "VO-2026-1025",
      country: "Australia 🇦🇺",
      visaType: "Tourist Subclass 600",
      invoiceDate: "07 Aug 2026",
      dueDate: "07 Aug 2026",
      amount: 15500,
      status: "paid",
      travelerName: "Geeta Sharma",
      consularFee: 12500,
      serviceFee: 2500,
      cgst: 750,
      sgst: 750,
      discount: 1000,
      paymentMethod: "Credit Card (Visa •••• 8892)",
      paymentRef: "PAY-2026-1025",
      gstin: "27AAACG1234H1Z5",
      billingAddress: "104, Park Street, Connaught Place, New Delhi - 110001",
      pdfFileName: "INV-2026-0891_Geeta_Australia.pdf"
    },
    {
      id: "INV-2026-0742",
      appId: "VO-2026-0982",
      country: "Schengen / France 🇫🇷",
      visaType: "Express Short-Stay Tourist",
      invoiceDate: "01 Aug 2026",
      dueDate: "01 Aug 2026",
      amount: 22000,
      status: "paid",
      travelerName: "Rohan Verma",
      consularFee: 18000,
      serviceFee: 3000,
      cgst: 1000,
      sgst: 1000,
      discount: 1000,
      paymentMethod: "UPI Instant (Google Pay)",
      paymentRef: "PAY-2026-0982",
      gstin: "27AAACG1234H1Z5",
      billingAddress: "45, Residency Road, Bengaluru - 560025",
      pdfFileName: "INV-2026-0742_Rohan_France.pdf"
    },
    {
      id: "PRO-2026-0511",
      appId: "VO-2026-0814",
      country: "United Kingdom 🇬🇧",
      visaType: "Standard Visitor 6 Months",
      invoiceDate: "25 Jul 2026",
      dueDate: "10 Aug 2026",
      amount: 14500,
      status: "pending",
      travelerName: "Amitabh Patel",
      consularFee: 11000,
      serviceFee: 2500,
      cgst: 750,
      sgst: 750,
      discount: 500,
      paymentMethod: "Net Banking (HDFC Pending)",
      paymentRef: "PAY-2026-0814",
      gstin: "27AAACG1234H1Z5",
      billingAddress: "12, Marine Drive, Mumbai - 400020",
      pdfFileName: "PRO-2026-0511_Amitabh_UK.pdf"
    },
    {
      id: "PRO-2026-0390",
      appId: "VO-2026-0720",
      country: "United States 🇺🇸",
      visaType: "B1/B2 Tourist Visitor",
      invoiceDate: "15 Jul 2026",
      dueDate: "15 Jul 2026",
      amount: 18500,
      status: "proforma",
      travelerName: "Priya Sundaram",
      consularFee: 15000,
      serviceFee: 2500,
      cgst: 500,
      sgst: 500,
      discount: 0,
      paymentMethod: "Awaiting Checkout",
      paymentRef: "UNPAID",
      gstin: "N/A",
      billingAddress: "88, T. Nagar, Chennai - 600017",
      pdfFileName: "PRO-2026-0390_Priya_US.pdf"
    },
    {
      id: "INV-2026-0210",
      appId: "VO-2026-0512",
      country: "Singapore 🇸🇬",
      visaType: "30-Day e-Visa",
      invoiceDate: "15 Jun 2026",
      dueDate: "15 Jun 2026",
      amount: 8500,
      status: "paid",
      travelerName: "Karan Mehta",
      consularFee: 6000,
      serviceFee: 2000,
      cgst: 250,
      sgst: 250,
      discount: 0,
      paymentMethod: "UPI Instant (PhonePe)",
      paymentRef: "PAY-2026-0512",
      gstin: "27AAACG1234H1Z5",
      billingAddress: "56, Sector 18, Noida - 201301",
      pdfFileName: "INV-2026-0210_Karan_SG.pdf"
    },
    {
      id: "INV-2026-0105",
      appId: "VO-2026-0650",
      country: "Canada 🇨🇦",
      visaType: "Visitor Visa V-1",
      invoiceDate: "01 Jul 2026",
      dueDate: "01 Jul 2026",
      amount: 16500,
      status: "cancelled",
      travelerName: "Vikram Malhotra",
      consularFee: 13000,
      serviceFee: 2500,
      cgst: 500,
      sgst: 500,
      discount: 0,
      paymentMethod: "Refunded to Wallet",
      paymentRef: "PAY-2026-0650-RFD",
      gstin: "27AAACG1234H1Z5",
      billingAddress: "104, Park Street, New Delhi - 110001",
      pdfFileName: "INV-2026-0105_CANCELLED.pdf"
    }
  ]);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "amount">("newest");

  // Selected Invoice ID for Inspector
  const [selectedInvId, setSelectedInvId] = useState<string>("INV-2026-0891");

  const activeInv = useMemo(() => {
    return invoices.find((i) => i.id === selectedInvId) || invoices[0];
  }, [invoices, selectedInvId]);

  // Dynamic Dashboard Statistics
  const metrics = useMemo(() => {
    const total = invoices.length;
    const paid = invoices.filter((i) => i.status === "paid").length;
    const pending = invoices.filter((i) => i.status === "pending").length;
    const proforma = invoices.filter((i) => i.status === "proforma").length;
    const cancelled = invoices.filter((i) => i.status === "cancelled").length;

    const totalValue = invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.amount, 0);

    const totalGst = invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + (i.cgst + i.sgst), 0);

    return { total, paid, pending, proforma, cancelled, totalValue, totalGst };
  }, [invoices]);

  // Filtered Invoices List
  const filteredInvoices = useMemo(() => {
    return invoices
      .filter((i) => {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          i.id.toLowerCase().includes(q) ||
          i.appId.toLowerCase().includes(q) ||
          i.travelerName.toLowerCase().includes(q) ||
          i.country.toLowerCase().includes(q) ||
          i.gstin.toLowerCase().includes(q);

        const matchesStatus = statusFilter === "all" || i.status === statusFilter;
        return matchesQ && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "amount") return b.amount - a.amount;
        return b.id.localeCompare(a.id);
      });
  }, [invoices, searchQuery, statusFilter, sortBy]);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & GST AUDIT STATUS BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Payments</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">Invoices</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Official GST Tax Invoices & Proforma Statements</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck size={12} className="text-emerald-600" /> GST Tax Compliant • 18% Audit Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Access, download, and manage GST tax invoices, proforma receipts, and fee statements for all visa applications.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => alert("Downloading Zip containing all official Tax Invoices...")}
            className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Download size={16} />
            <span>Download All Invoices (ZIP)</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: DASHBOARD STATISTICS CARDS GRID (6 CARDS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Invoices */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Invoices</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{String(metrics.total).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">All tax documents</span>
        </div>

        {/* Card 2: Paid Invoices */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Paid Invoices</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{String(metrics.paid).padStart(2, "0")}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 size={10} /> Tax cleared
          </span>
        </div>

        {/* Card 3: Pending Invoices */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Pending</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{String(metrics.pending).padStart(2, "0")}</p>
          <span className="text-[10px] text-amber-600 font-medium">Payment clearing</span>
        </div>

        {/* Card 4: Proforma Invoices */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-indigo-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Proforma</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">{String(metrics.proforma).padStart(2, "0")}</p>
          <span className="text-[10px] text-indigo-600 font-medium">Pre-checkout draft</span>
        </div>

        {/* Card 5: Total Tax Invoice Value */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-[#4848F7]">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Invoice Value</p>
          <p className="text-xl font-black text-[#4848F7] mt-1">₹{formatINR(metrics.totalValue)}</p>
          <span className="text-[10px] text-[#4848F7] font-semibold">Cleared value</span>
        </div>

        {/* Card 6: Total GST Tax Amount */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-600">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total GST (18%)</p>
          <p className="text-xl font-black text-emerald-700 mt-1">₹{formatINR(metrics.totalGst)}</p>
          <span className="text-[10px] text-emerald-700 font-semibold">CGST + SGST</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: CONCEPTUAL WORKFLOW BANNER (CONNECTED 3-PARTY INVOICE AUDIT FLOW) */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#4848F7]" size={20} />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
              Connected Invoice Workflow (Consular Request ➔ Fee Filing ➔ Verified Tax Invoice Issued)
            </h3>
          </div>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
            GST Compliant
          </span>
        </div>

        {/* Workflow Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 1</span>
            <p className="text-white">Consular Request & Requirements</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 2</span>
            <p className="text-white">Fee Calculation & GST Filing</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 3</span>
            <p className="text-white">Payment Gateway Settlement</p>
          </div>

          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30 space-y-1 text-emerald-300">
            <span className="text-emerald-300 block text-[10px] uppercase">Stage 4</span>
            <p className="font-bold">Verified Tax Invoice Issued ✓</p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl text-xs space-y-1 text-slate-300">
          <p className="font-bold text-white">Professional Tax Guidelines:</p>
          <ul className="list-disc pl-4 space-y-1 leading-relaxed text-[11px]">
            <li>Official tax invoices feature 18% GST breakdown (9% CGST + 9% SGST) for input tax credit claims.</li>
            <li>GSTIN numbers can be updated prior to payment settlement or via support for revised tax invoices.</li>
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
              placeholder="Search Invoice No, App ID, Traveler, GSTIN..."
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
              <option value="all">All Invoice Types</option>
              <option value="paid">Paid (Tax Invoice) ✓</option>
              <option value="pending">Pending ⏳</option>
              <option value="proforma">Proforma 📜</option>
              <option value="cancelled">Cancelled ❌</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="newest">Sort: Date Newest</option>
              <option value="amount">Sort: Amount Highest</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: INVOICES DIRECTORY TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileText size={16} className="text-[#4848F7]" />
            <span>Tax Invoices & Proforma Statements ({filteredInvoices.length})</span>
          </h3>
          <span className="text-[11px] text-slate-400">Click any row to open itemized document inspector</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Invoice Number</th>
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Country & Visa</th>
                <th className="py-3 px-4">Invoice Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => {
                const isSelected = inv.id === selectedInvId;
                return (
                  <tr
                    key={inv.id}
                    onClick={() => setSelectedInvId(inv.id)}
                    className={`cursor-pointer transition hover:bg-indigo-50/40 ${
                      isSelected ? "bg-indigo-50/80 font-semibold" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 flex items-center gap-2">
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#4848F7]" />}
                      {inv.id}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-700 font-semibold">{inv.appId}</td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{inv.country}</p>
                      <p className="text-[10px] text-slate-500">{inv.visaType}</p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">{inv.invoiceDate}</td>

                    <td className="py-3.5 px-4 font-black text-slate-900">₹{formatINR(inv.amount)}</td>

                    <td className="py-3.5 px-4">
                      {inv.status === "paid" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 size={12} /> Paid
                        </span>
                      )}

                      {inv.status === "pending" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          <Clock size={12} /> Pending
                        </span>
                      )}

                      {inv.status === "proforma" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                          <FileCode size={12} /> Proforma
                        </span>
                      )}

                      {inv.status === "cancelled" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                          <XCircle size={12} /> Cancelled
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedInvId(inv.id)}
                          className="bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#4848F7] text-slate-700 font-bold px-2 py-1 rounded-lg transition text-[11px]"
                        >
                          Inspect
                        </button>

                        <button
                          onClick={() => alert(`Downloading ${inv.pdfFileName}...`)}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                          title="Download PDF Invoice"
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
      {/* SECTION 6: SELECTED INVOICE DETAILS INSPECTOR CARD */}
      {/* ============================================================ */}
      {activeInv && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <FileCheck size={26} className="text-[#4848F7]" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">Invoice Viewer: {activeInv.id}</h3>
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                    Official Document
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Application Ref: <span className="font-mono">{activeInv.appId}</span> &bull; Traveler: {activeInv.travelerName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert(`Printing invoice ${activeInv.id}...`)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
              >
                <Printer size={14} /> Print
              </button>

              <button
                onClick={() => alert(`Sending invoice copy to ${activeInv.travelerName}...`)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
              >
                <Mail size={14} /> Email Copy
              </button>

              <button
                onClick={() => alert(`Downloading official PDF ${activeInv.pdfFileName}...`)}
                className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Itemized Amount Breakdown Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <Tag size={15} className="text-[#4848F7]" /> Itemized Amount Breakdown
              </h4>

              <div className="space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Embassy Consular Visa Charge</span>
                  <span className="font-bold text-slate-900">₹{formatINR(activeInv.consularFee)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Documentation & Portal Fee</span>
                  <span className="font-bold text-slate-900">₹{formatINR(activeInv.serviceFee)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>CGST (9%)</span>
                  <span className="font-bold text-slate-900">₹{formatINR(activeInv.cgst)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>SGST (9%)</span>
                  <span className="font-bold text-slate-900">₹{formatINR(activeInv.sgst)}</span>
                </div>

                {activeInv.discount > 0 && (
                  <div className="flex justify-between text-indigo-600 font-bold bg-indigo-50 p-1.5 rounded">
                    <span>Discount Coupon</span>
                    <span>-₹{formatINR(activeInv.discount)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-300 pt-2.5 flex justify-between items-center text-sm font-black text-slate-900">
                <span>Net Total Invoice Amount</span>
                <span className="text-xl text-[#4848F7]">₹{formatINR(activeInv.amount)}</span>
              </div>
            </div>

            {/* Billing Information & GSTIN Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <Building size={15} className="text-[#4848F7]" /> Billing Address & Tax Registration
              </h4>

              <div className="space-y-2">
                <div>
                  <span className="text-slate-500 block">Billed To Name:</span>
                  <span className="font-bold text-slate-900">{activeInv.travelerName}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">GSTIN Number:</span>
                  <span className="font-mono font-bold text-slate-900">{activeInv.gstin}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Billing Address:</span>
                  <span className="text-slate-700 leading-relaxed">{activeInv.billingAddress}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Payment Method & Reference:</span>
                  <span className="text-slate-800 font-medium">{activeInv.paymentMethod} &bull; {activeInv.paymentRef}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 7: INVOICE QUICK ACTIONS BAR */}
      {/* ============================================================ */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg text-xs">
        <div>
          <h4 className="font-extrabold text-white">Need Tax Invoices for Business Filing or GST Edit?</h4>
          <p className="text-slate-400 mt-0.5">Submit GSTIN updates or request customized corporate tax statements.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => alert("Opening GSTIN edit request modal...")}
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Edit size={14} /> Update GSTIN
          </button>

          {onNavigateSupport && (
            <button
              onClick={onNavigateSupport}
              className="bg-[#4848F7] hover:bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Mail size={14} /> Billing Support
            </button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 8: INVOICE STATUS LEGEND & BADGES */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
        <h4 className="font-extrabold uppercase tracking-wider text-slate-500">Invoice Status Legend</h4>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
            <span className="font-bold text-emerald-800 flex items-center gap-1">
              <CheckCircle2 size={14} /> Paid (Green)
            </span>
            <p className="text-[11px] text-emerald-700">Official tax invoice generated and cleared.</p>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
            <span className="font-bold text-amber-800 flex items-center gap-1">
              <Clock size={14} /> Pending (Yellow)
            </span>
            <p className="text-[11px] text-amber-700">Payment authorization in progress.</p>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
            <span className="font-bold text-indigo-800 flex items-center gap-1">
              <FileCode size={14} /> Proforma (Blue)
            </span>
            <p className="text-[11px] text-indigo-700">Preliminary invoice before payment.</p>
          </div>

          <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1">
            <span className="font-bold text-red-800 flex items-center gap-1">
              <XCircle size={14} /> Cancelled (Red)
            </span>
            <p className="text-[11px] text-red-700">Application refunded or cancelled.</p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 9: INVOICES FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Tax Invoices</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">What is the difference between Proforma and Tax Invoices?</p>
            <p className="text-slate-600 leading-relaxed">
              A Proforma invoice is an estimated fee summary issued prior to checkout. An Official Tax Invoice with GST registration details is issued immediately after payment completion.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Can I edit my company GSTIN number after payment?</p>
            <p className="text-slate-600 leading-relaxed">
              Yes, click "Update GSTIN" above to submit your tax credentials. A revised GST tax invoice will be regenerated for your business records.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
