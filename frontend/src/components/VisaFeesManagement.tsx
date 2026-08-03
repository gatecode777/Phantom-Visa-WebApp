import React, { useState } from "react";
import {
  CreditCard,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  PlusCircle,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Globe,
  FileText,
  Download,
  Check,
  X,
  TrendingUp,
  Sparkles,
  DollarSign,
  Percent,
  Calculator,
  ShieldCheck,
  Tag
} from "lucide-react";

export interface VisaFeeRecord {
  id: string;
  feeId: string;
  country: string;
  category: string;
  visaType: string;
  entryType: string;
  currency: string;
  status: "Active" | "Inactive";
  components: {
    embassyFee: string;
    serviceFee: string;
    processingFee: string;
    expressCharge: string;
    biometricsFee: string;
    insuranceFee: string;
    tax: string;
    otherCharges: string;
  };
  totalFee: string;
  discounts: {
    discountType: "None" | "Percentage" | "Flat";
    discountAmount: string;
    promoCode: string;
    expiryDate: string;
  };
  paymentMethods: string[];
  refundPolicy: {
    refundable: boolean;
    cancellationFee: string;
    refundPercentage: string;
    refundProcessingTime: string;
  };
}

export const PREDEFINED_FEE_STRUCTURE = [
  { label: "Embassy Fee", amount: "₹6,500" },
  { label: "Service Fee", amount: "₹1,500" },
  { label: "Express Charge", amount: "₹1,000" },
  { label: "Biometrics Fee", amount: "₹850" },
  { label: "Insurance Fee", amount: "₹750" },
  { label: "Processing Fee", amount: "₹250" },
  { label: "Transaction Fee", amount: "₹150" },
  { label: "Tax (18%)", amount: "₹1,980" }
];

const MOCK_FEE_RECORDS: VisaFeeRecord[] = [
  {
    id: "1",
    feeId: "VF-001",
    country: "Canada",
    category: "Tourist Visa",
    visaType: "Tourist E-Visa",
    entryType: "Single Entry",
    currency: "INR (₹)",
    status: "Active",
    components: {
      embassyFee: "6,500",
      serviceFee: "1,500",
      processingFee: "250",
      expressCharge: "1,000",
      biometricsFee: "850",
      insuranceFee: "750",
      tax: "1,450",
      otherCharges: "0"
    },
    totalFee: "12,350",
    discounts: {
      discountType: "Percentage",
      discountAmount: "10%",
      promoCode: "SUMMER10",
      expiryDate: "2026-08-31"
    },
    paymentMethods: ["Credit Card", "Debit Card", "UPI", "Net Banking", "Wallet"],
    refundPolicy: {
      refundable: true,
      cancellationFee: "₹500",
      refundPercentage: "80%",
      refundProcessingTime: "3–5 Working Days"
    }
  },
  {
    id: "2",
    feeId: "VF-002",
    country: "Australia",
    category: "Business Visa",
    visaType: "Sticker Visa",
    entryType: "Multiple Entry",
    currency: "INR (₹)",
    status: "Active",
    components: {
      embassyFee: "10,500",
      serviceFee: "1,800",
      processingFee: "500",
      expressCharge: "1,500",
      biometricsFee: "1,200",
      insuranceFee: "1,000",
      tax: "2,430",
      otherCharges: "0"
    },
    totalFee: "18,930",
    discounts: {
      discountType: "None",
      discountAmount: "0",
      promoCode: "",
      expiryDate: ""
    },
    paymentMethods: ["Credit Card", "Debit Card", "UPI", "Net Banking", "Bank Transfer"],
    refundPolicy: {
      refundable: false,
      cancellationFee: "Non-Refundable",
      refundPercentage: "0%",
      refundProcessingTime: "N/A"
    }
  },
  {
    id: "3",
    feeId: "VF-003",
    country: "UAE",
    category: "Business Visa",
    visaType: "Multiple Entry",
    entryType: "Multiple Entry",
    currency: "INR (₹)",
    status: "Active",
    components: {
      embassyFee: "5,000",
      serviceFee: "1,000",
      processingFee: "200",
      expressCharge: "800",
      biometricsFee: "0",
      insuranceFee: "500",
      tax: "1,170",
      otherCharges: "0"
    },
    totalFee: "8,670",
    discounts: {
      discountType: "Flat",
      discountAmount: "₹500",
      promoCode: "BIZ500",
      expiryDate: "2026-12-31"
    },
    paymentMethods: ["Credit Card", "Debit Card", "UPI", "Wallet"],
    refundPolicy: {
      refundable: true,
      cancellationFee: "₹300",
      refundPercentage: "90%",
      refundProcessingTime: "2–4 Working Days"
    }
  }
];

export default function VisaFeesManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [visaTypeFilter, setVisaTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Records State
  const [feeRecords, setFeeRecords] = useState<VisaFeeRecord[]>(MOCK_FEE_RECORDS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalFee, setActiveModalFee] = useState<VisaFeeRecord | null>(null);
  const [modalTab, setModalTab] = useState<"general" | "components" | "total" | "payment" | "refund">("general");

  // Add / Edit Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFee, setEditingFee] = useState<VisaFeeRecord | null>(null);

  const [formData, setFormData] = useState({
    country: "Canada",
    category: "Tourist Visa",
    visaType: "Tourist E-Visa",
    entryType: "Single Entry",
    currency: "INR (₹)",
    status: "Active" as "Active" | "Inactive",
    embassyFee: "6,500",
    serviceFee: "1,500",
    processingFee: "250",
    expressCharge: "1,000",
    biometricsFee: "850",
    insuranceFee: "750",
    tax: "1,450",
    otherCharges: "0",
    discountType: "None" as "None" | "Percentage" | "Flat",
    discountAmount: "0",
    promoCode: "",
    expiryDate: "",
    selectedPaymentMethods: ["Credit Card", "Debit Card", "UPI", "Net Banking"],
    refundable: true,
    cancellationFee: "₹500",
    refundPercentage: "80%",
    refundProcessingTime: "3–5 Working Days"
  });

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredFees = feeRecords.filter((f) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      f.country.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.visaType.toLowerCase().includes(q);

    const matchesCountry = countryFilter === "All" || f.country === countryFilter;
    const matchesCategory = categoryFilter === "All" || f.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || f.status === statusFilter;

    return matchesQuery && matchesCountry && matchesCategory && matchesStatus;
  });

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredFees.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredFees.map((f) => f.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handleToggleStatus = (record: VisaFeeRecord) => {
    const newStatus = record.status === "Active" ? "Inactive" : "Active";
    setFeeRecords((prev) =>
      prev.map((f) => (f.id === record.id ? { ...f, status: newStatus } : f))
    );
    triggerToast(`Fee rule ${record.feeId} updated to ${newStatus}.`);
  };

  const handleDeleteRecord = (record: VisaFeeRecord) => {
    setFeeRecords((prev) => prev.filter((f) => f.id !== record.id));
    triggerToast(`Fee record ${record.feeId} deleted.`);
    if (activeModalFee?.id === record.id) setActiveModalFee(null);
  };

  const handleBulkActivate = () => {
    setFeeRecords((prev) =>
      prev.map((f) => (selectedIds.includes(f.id) ? { ...f, status: "Active" } : f))
    );
    triggerToast(`${selectedIds.length} fee rules activated.`);
    setSelectedIds([]);
  };

  const handleBulkDeactivate = () => {
    setFeeRecords((prev) =>
      prev.map((f) => (selectedIds.includes(f.id) ? { ...f, status: "Inactive" } : f))
    );
    triggerToast(`${selectedIds.length} fee rules deactivated.`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    setFeeRecords((prev) => prev.filter((f) => !selectedIds.includes(f.id)));
    triggerToast(`${selectedIds.length} fee rules deleted.`);
    setSelectedIds([]);
  };

  const openEditForm = (record: VisaFeeRecord) => {
    setEditingFee(record);
    setFormData({
      country: record.country,
      category: record.category,
      visaType: record.visaType,
      entryType: record.entryType,
      currency: record.currency,
      status: record.status,
      embassyFee: record.components.embassyFee,
      serviceFee: record.components.serviceFee,
      processingFee: record.components.processingFee,
      expressCharge: record.components.expressCharge,
      biometricsFee: record.components.biometricsFee,
      insuranceFee: record.components.insuranceFee,
      tax: record.components.tax,
      otherCharges: record.components.otherCharges,
      discountType: record.discounts.discountType,
      discountAmount: record.discounts.discountAmount,
      promoCode: record.discounts.promoCode,
      expiryDate: record.discounts.expiryDate,
      selectedPaymentMethods: record.paymentMethods,
      refundable: record.refundPolicy.refundable,
      cancellationFee: record.refundPolicy.cancellationFee,
      refundPercentage: record.refundPolicy.refundPercentage,
      refundProcessingTime: record.refundPolicy.refundProcessingTime
    });
    setShowAddModal(true);
  };

  // Dynamic Total Fee Calculator
  const calculateTotalFee = () => {
    const e = parseFloat(formData.embassyFee.replace(/,/g, "")) || 0;
    const s = parseFloat(formData.serviceFee.replace(/,/g, "")) || 0;
    const p = parseFloat(formData.processingFee.replace(/,/g, "")) || 0;
    const ex = parseFloat(formData.expressCharge.replace(/,/g, "")) || 0;
    const b = parseFloat(formData.biometricsFee.replace(/,/g, "")) || 0;
    const i = parseFloat(formData.insuranceFee.replace(/,/g, "")) || 0;
    const o = parseFloat(formData.otherCharges.replace(/,/g, "")) || 0;

    const subtotal = e + s + p + ex + b + i + o;
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    return Math.round(total).toLocaleString("en-IN");
  };

  const handleSaveFee = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedTotal = calculateTotalFee();

    if (editingFee) {
      setFeeRecords((prev) =>
        prev.map((f) =>
          f.id === editingFee.id
            ? {
                ...f,
                country: formData.country,
                category: formData.category,
                visaType: formData.visaType,
                entryType: formData.entryType,
                currency: formData.currency,
                status: formData.status,
                components: {
                  embassyFee: formData.embassyFee,
                  serviceFee: formData.serviceFee,
                  processingFee: formData.processingFee,
                  expressCharge: formData.expressCharge,
                  biometricsFee: formData.biometricsFee,
                  insuranceFee: formData.insuranceFee,
                  tax: formData.tax,
                  otherCharges: formData.otherCharges
                },
                totalFee: calculatedTotal,
                discounts: {
                  discountType: formData.discountType,
                  discountAmount: formData.discountAmount,
                  promoCode: formData.promoCode,
                  expiryDate: formData.expiryDate
                },
                paymentMethods: formData.selectedPaymentMethods,
                refundPolicy: {
                  refundable: formData.refundable,
                  cancellationFee: formData.cancellationFee,
                  refundPercentage: formData.refundPercentage,
                  refundProcessingTime: formData.refundProcessingTime
                }
              }
            : f
        )
      );
      triggerToast(`Fee configuration for ${formData.country} updated.`);
    } else {
      const newRecord: VisaFeeRecord = {
        id: Date.now().toString(),
        feeId: `VF-00${feeRecords.length + 1}`,
        country: formData.country,
        category: formData.category,
        visaType: formData.visaType,
        entryType: formData.entryType,
        currency: formData.currency,
        status: formData.status,
        components: {
          embassyFee: formData.embassyFee,
          serviceFee: formData.serviceFee,
          processingFee: formData.processingFee,
          expressCharge: formData.expressCharge,
          biometricsFee: formData.biometricsFee,
          insuranceFee: formData.insuranceFee,
          tax: formData.tax,
          otherCharges: formData.otherCharges
        },
        totalFee: calculatedTotal,
        discounts: {
          discountType: formData.discountType,
          discountAmount: formData.discountAmount,
          promoCode: formData.promoCode,
          expiryDate: formData.expiryDate
        },
        paymentMethods: formData.selectedPaymentMethods,
        refundPolicy: {
          refundable: formData.refundable,
          cancellationFee: formData.cancellationFee,
          refundPercentage: formData.refundPercentage,
          refundProcessingTime: formData.refundProcessingTime
        }
      };
      setFeeRecords((prev) => [newRecord, ...prev]);
      triggerToast(`New fee configuration for ${formData.country} created.`);
    }

    setShowAddModal(false);
    setEditingFee(null);
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
            <CreditCard size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Global Fee Schedules & Tax Matrix
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Visa Fees
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Manage visa application fees, service charges, tax rates, and total cost schedules across all countries and visa types.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingFee(null);
              setFormData({
                country: "Canada",
                category: "Tourist Visa",
                visaType: "Tourist E-Visa",
                entryType: "Single Entry",
                currency: "INR (₹)",
                status: "Active",
                embassyFee: "6,500",
                serviceFee: "1,500",
                processingFee: "250",
                expressCharge: "1,000",
                biometricsFee: "850",
                insuranceFee: "750",
                tax: "1,450",
                otherCharges: "0",
                discountType: "None",
                discountAmount: "0",
                promoCode: "",
                expiryDate: "",
                selectedPaymentMethods: ["Credit Card", "Debit Card", "UPI", "Net Banking"],
                refundable: true,
                cancellationFee: "₹500",
                refundPercentage: "80%",
                refundProcessingTime: "3–5 Working Days"
              });
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-white text-[#2563EB] hover:bg-blue-50 text-xs font-black rounded-xl shadow-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle size={16} /> Add Fee Configuration
          </button>
        </div>
      </div>

      {/* TOP STATISTICS CARDS & PREDEFINED FEE STRUCTURE CATALOG (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 4 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
                Total Fee Configurations
              </span>
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                <CreditCard size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">312</div>
            <span className="text-[11px] text-[#2563EB] font-semibold mt-1 inline-block">
              Configured Country Price Matrices
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
                Countries Configured
              </span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Globe size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">65</div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
              Global Destinations Covered
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
                Active Fee Rules
              </span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">296</div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
              Live Billing Rates
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
                Pending Approval
              </span>
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <AlertCircle size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">16</div>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 inline-block">
              Pending Finance Audit
            </span>
          </div>
        </div>

        {/* RIGHT CARD: PREDEFINED FEE STRUCTURE (TABLE FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Calculator size={16} className="text-[#2563EB]" /> Predefined Fee Structure
            </h3>
            <div className="space-y-1.5 text-xs font-medium max-h-48 overflow-y-auto [scrollbar-width:thin]">
              {PREDEFINED_FEE_STRUCTURE.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-1.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">{item.label}:</span>
                  <strong className="text-slate-900 font-mono font-bold">{item.amount}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-extrabold uppercase text-[10px]">Current Total:</span>
            <strong className="text-[#2563EB] font-mono font-black text-sm">₹13,000</strong>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search & Multi-Criteria Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredFees.length} of {feeRecords.length} Fee Configurations
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH BY KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search By (Country, Category, Type)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Canada, Tourist, eVisa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition"
              />
            </div>
          </div>

          {/* COUNTRY FILTER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Country
            </label>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition font-semibold"
            >
              <option value="All">All Countries</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="UAE">UAE</option>
            </select>
          </div>

          {/* CATEGORY FILTER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Visa Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition font-semibold"
            >
              <option value="All">All Categories</option>
              <option value="Tourist Visa">Tourist Visa</option>
              <option value="Business Visa">Business Visa</option>
            </select>
          </div>

          {/* VISA TYPE FILTER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Visa Type
            </label>
            <select
              value={visaTypeFilter}
              onChange={(e) => setVisaTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition font-semibold"
            >
              <option value="All">All Visa Types</option>
              <option value="Tourist E-Visa">Tourist E-Visa</option>
              <option value="Sticker Visa">Sticker Visa</option>
              <option value="Multiple Entry">Multiple Entry</option>
            </select>
          </div>

          {/* STATUS FILTER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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
            <span>Fee Rules Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkActivate}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 size={14} /> Activate Selected
            </button>
            <button
              onClick={handleBulkDeactivate}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <XCircle size={14} /> Deactivate Selected
            </button>
            <button
              onClick={() => triggerToast(`Exporting fee matrix for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Fee Rules
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

      {/* VISA FEES TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredFees.length && filteredFees.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Fee ID</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Visa Category</th>
                <th className="py-3.5 px-4">Visa Type</th>
                <th className="py-3.5 px-4 font-mono">Embassy Fee</th>
                <th className="py-3.5 px-4 font-mono">Service Fee</th>
                <th className="py-3.5 px-4 font-mono font-black text-[#2563EB]">Total Fee</th>
                <th className="py-3.5 px-4 font-mono">Currency</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <CreditCard size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No visa fee configurations found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredFees.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(f.id)}
                        onChange={() => handleToggleSelect(f.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {f.feeId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {f.country}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {f.category}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {f.visaType}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      ₹{f.components.embassyFee}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      ₹{f.components.serviceFee}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-[#2563EB]">
                      ₹{f.totalFee}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {f.currency}
                    </td>
                    <td className="py-3.5 px-4">
                      {f.status === "Active" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setActiveModalFee(f);
                            setModalTab("general");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => openEditForm(f)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          title="Edit Fee Configuration"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(f)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            f.status === "Active"
                              ? "text-emerald-600 hover:bg-emerald-50"
                              : "text-amber-600 hover:bg-amber-50"
                          }`}
                          title={f.status === "Active" ? "Deactivate" : "Activate"}
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(f)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Fee Record"
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
          <div>Showing 1–10 of 312 Fee Configurations</div>
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

      {/* CENTERED POPUP DETAILS MODAL (5 TABS AS IN WIREFRAME) */}
      {activeModalFee && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                  <CreditCard size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeModalFee.country} &bull; {activeModalFee.visaType} Fee
                    </h3>
                    <span className="font-mono text-xs font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700">
                      {activeModalFee.feeId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{activeModalFee.category} &bull; Currency: {activeModalFee.currency}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalFee(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {[
                { id: "general", label: "General Information", icon: CreditCard },
                { id: "components", label: "Fee Components", icon: Calculator },
                { id: "total", label: "Total Cost Breakdown", icon: DollarSign },
                { id: "payment", label: "Payment Methods", icon: Tag },
                { id: "refund", label: "Refund Policy", icon: ShieldCheck }
              ].map((tab) => {
                const IconComp = tab.icon;
                const active = modalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setModalTab(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      active
                        ? "bg-[#2563EB] text-white shadow-sm"
                        : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200"
                    }`}
                  >
                    <IconComp size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* MODAL BODY */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {/* TAB 1: GENERAL INFORMATION */}
              {modalTab === "general" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Fee Configuration Overview
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Country</span>
                      <strong className="text-slate-900 font-bold">{activeModalFee.country}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Category</span>
                      <strong className="text-[#2563EB] font-bold">{activeModalFee.category}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Type</span>
                      <strong className="text-slate-900 font-bold">{activeModalFee.visaType}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Currency</span>
                      <strong className="text-slate-900 font-mono font-bold">{activeModalFee.currency}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Status</span>
                      <strong className="text-emerald-600 font-bold">{activeModalFee.status}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FEE COMPONENTS */}
              {modalTab === "components" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Itemized Billing Components
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Embassy Fee</span>
                      <strong className="text-slate-900 font-mono font-bold text-sm">₹{activeModalFee.components.embassyFee}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Service Fee</span>
                      <strong className="text-slate-900 font-mono font-bold text-sm">₹{activeModalFee.components.serviceFee}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Express Charge</span>
                      <strong className="text-blue-600 font-mono font-bold text-sm">₹{activeModalFee.components.expressCharge}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Biometrics Fee</span>
                      <strong className="text-slate-900 font-mono font-bold text-sm">₹{activeModalFee.components.biometricsFee}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Insurance Fee</span>
                      <strong className="text-slate-900 font-mono font-bold text-sm">₹{activeModalFee.components.insuranceFee}</strong>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200">
                      <span className="text-[10px] text-[#2563EB] font-extrabold uppercase block">Tax</span>
                      <strong className="text-[#2563EB] font-mono font-black text-sm">₹{activeModalFee.components.tax}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TOTAL COST BREAKDOWN */}
              {modalTab === "total" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Total Payable Amount Schedule
                  </h4>
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200 rounded-3xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-blue-700 font-extrabold uppercase tracking-wider block mb-1">
                        Final Total Application Fee
                      </span>
                      <p className="text-xs text-slate-500 font-medium">Includes all embassy charges, service fees, and 18% Tax.</p>
                    </div>
                    <strong className="text-3xl font-black text-[#2563EB] font-mono">₹{activeModalFee.totalFee}</strong>
                  </div>
                </div>
              )}

              {/* TAB 4: PAYMENT METHODS */}
              {modalTab === "payment" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Accepted Payment Channels
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeModalFee.paymentMethods.map((pm, idx) => (
                      <span key={idx} className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                        <CreditCard size={14} className="text-[#2563EB]" /> {pm}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: REFUND POLICY */}
              {modalTab === "refund" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Cancellation & Refund Conditions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Refundable Status</span>
                      <strong className="text-emerald-700 font-bold">{activeModalFee.refundPolicy.refundable ? "Yes (Refundable)" : "No (Non-Refundable)"}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Cancellation Fee</span>
                      <strong className="text-slate-900 font-mono font-bold">{activeModalFee.refundPolicy.cancellationFee}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Refund Percentage</span>
                      <strong className="text-[#2563EB] font-mono font-black">{activeModalFee.refundPolicy.refundPercentage}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Refund Turnaround Time</span>
                      <strong className="text-slate-900 font-mono">{activeModalFee.refundPolicy.refundProcessingTime}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(activeModalFee)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  activeModalFee.status === "Active"
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                {activeModalFee.status === "Active" ? "Deactivate Fee Configuration" : "Activate Fee Configuration"}
              </button>

              <button
                onClick={() => openEditForm(activeModalFee)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 size={14} /> Edit Fee Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT VISA FEE FORM MODAL (EXACT WIREFRAME FORM) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-black font-outfit flex items-center gap-2">
                <CreditCard size={18} />
                <span>{editingFee ? `Edit Visa Fee: ${editingFee.country}` : "Add Fee Configuration"}</span>
              </h3>

              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingFee(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* MODAL FORM BODY */}
            <form onSubmit={handleSaveFee} className="p-6 overflow-y-auto flex-1 text-xs space-y-6 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE]">
              {/* SECTION 1: VISA INFORMATION */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Visa Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                    >
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="UAE">UAE</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Visa Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                    >
                      <option value="Tourist Visa">Tourist Visa</option>
                      <option value="Business Visa">Business Visa</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Visa Type <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tourist E-Visa"
                      value={formData.visaType}
                      onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Currency <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="INR (₹)"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: FEE COMPONENTS */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Itemized Fee Components
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Embassy Fee (₹)
                    </label>
                    <input
                      type="text"
                      placeholder="6,500"
                      value={formData.embassyFee}
                      onChange={(e) => setFormData({ ...formData, embassyFee: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Service Fee (₹)
                    </label>
                    <input
                      type="text"
                      placeholder="1,500"
                      value={formData.serviceFee}
                      onChange={(e) => setFormData({ ...formData, serviceFee: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Express Charge (₹)
                    </label>
                    <input
                      type="text"
                      placeholder="1,000"
                      value={formData.expressCharge}
                      onChange={(e) => setFormData({ ...formData, expressCharge: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono text-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Biometrics Fee (₹)
                    </label>
                    <input
                      type="text"
                      placeholder="850"
                      value={formData.biometricsFee}
                      onChange={(e) => setFormData({ ...formData, biometricsFee: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* DYNAMIC CALCULATED TOTAL BAR */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                <span className="font-extrabold text-[#2563EB] text-xs">Calculated Total Application Fee (Incl. Tax):</span>
                <strong className="text-xl font-black text-[#2563EB] font-mono">₹{calculateTotalFee()}</strong>
              </div>

              {/* SECTION 3: PAYMENT METHODS */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Accepted Payment Methods
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["Credit Card", "Debit Card", "UPI", "Net Banking", "Wallet", "Bank Transfer"].map((pm) => {
                    const checked = formData.selectedPaymentMethods.includes(pm);
                    return (
                      <label
                        key={pm}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition text-xs font-semibold ${
                          checked
                            ? "bg-blue-50/80 border-blue-300 text-[#2563EB]"
                            : "bg-slate-50 border-slate-200 text-slate-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                selectedPaymentMethods: formData.selectedPaymentMethods.filter((p) => p !== pm)
                              });
                            } else {
                              setFormData({
                                ...formData,
                                selectedPaymentMethods: [...formData.selectedPaymentMethods, pm]
                              });
                            }
                          }}
                          className="rounded border-slate-300 text-[#2563EB]"
                        />
                        <span>{pm}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg shadow-[#2563EB]/25"
                >
                  {editingFee ? "Save Fee Configuration" : "Create Fee Configuration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
