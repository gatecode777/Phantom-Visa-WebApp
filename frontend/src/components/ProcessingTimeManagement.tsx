import React, { useState } from "react";
import {
  Clock,
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
  Zap,
  Calendar,
  Layers,
  AlertTriangle
} from "lucide-react";

export interface ProcessingTimeRecord {
  id: string;
  ruleId: string;
  ruleName: string;
  country: string;
  category: string;
  visaType: string;
  entryType: string;
  status: "Active" | "Inactive";
  regular: {
    minDays: number;
    maxDays: number;
    text: string;
  };
  express: {
    minDays: number;
    maxDays: number;
    text: string;
  };
  urgent: {
    minDays: number;
    maxDays: number;
    text: string;
  };
  sla: {
    workingDaysOnly: boolean;
    excludeWeekends: boolean;
    excludePublicHolidays: boolean;
    expectedCompletionTime: string;
  };
  additional: {
    priorityLevel: "High" | "Medium" | "Low";
    remarks: string;
    specialConditions: string;
  };
  exceptions: {
    peakSeasonDelay: string;
    holidayDelay: string;
    embassyDelay: string;
    docDelay: string;
  };
  stats: {
    avgCompletionTime: string;
    fastestProcessing: string;
    longestProcessing: string;
    applicationsProcessed: number;
  };
}

export const PROCESSING_TYPES_LIST = [
  "Regular Processing",
  "Express Processing",
  "Priority Processing",
  "Urgent Processing",
  "Same-Day Processing",
  "24-Hour Processing"
];

const MOCK_PROCESSING_RULES: ProcessingTimeRecord[] = [
  {
    id: "1",
    ruleId: "PT-001",
    ruleName: "Canada Tourist Visa SLA Schedule",
    country: "Canada",
    category: "Tourist Visa",
    visaType: "Tourist E-Visa",
    entryType: "Single Entry",
    status: "Active",
    regular: { minDays: 10, maxDays: 15, text: "10–15 Days" },
    express: { minDays: 5, maxDays: 7, text: "5–7 Days" },
    urgent: { minDays: 2, maxDays: 3, text: "2–3 Days" },
    sla: {
      workingDaysOnly: true,
      excludeWeekends: true,
      excludePublicHolidays: true,
      expectedCompletionTime: "5:00 PM EST"
    },
    additional: {
      priorityLevel: "High",
      remarks: "High demand during summer travel season.",
      specialConditions: "Biometrics appointment completed required"
    },
    exceptions: {
      peakSeasonDelay: "+3 Days",
      holidayDelay: "+2 Days",
      embassyDelay: "+5 Days",
      docDelay: "+4 Days"
    },
    stats: {
      avgCompletionTime: "6.2 Days",
      fastestProcessing: "24 Hours",
      longestProcessing: "22 Days",
      applicationsProcessed: 3420
    }
  },
  {
    id: "2",
    ruleId: "PT-002",
    ruleName: "Australia Student Visa Turnaround",
    country: "Australia",
    category: "Student Visa",
    visaType: "Student Long Stay",
    entryType: "Multiple Entry",
    status: "Active",
    regular: { minDays: 15, maxDays: 20, text: "15–20 Days" },
    express: { minDays: 10, maxDays: 12, text: "10–12 Days" },
    urgent: { minDays: 5, maxDays: 7, text: "5–7 Days" },
    sla: {
      workingDaysOnly: true,
      excludeWeekends: true,
      excludePublicHolidays: true,
      expectedCompletionTime: "4:00 PM AEST"
    },
    additional: {
      priorityLevel: "Medium",
      remarks: "Academic intake semester peak.",
      specialConditions: "Health examination clearance needed"
    },
    exceptions: {
      peakSeasonDelay: "+5 Days",
      holidayDelay: "+3 Days",
      embassyDelay: "+4 Days",
      docDelay: "+2 Days"
    },
    stats: {
      avgCompletionTime: "11.4 Days",
      fastestProcessing: "3 Days",
      longestProcessing: "30 Days",
      applicationsProcessed: 2150
    }
  },
  {
    id: "3",
    ruleId: "PT-003",
    ruleName: "UAE Business Fast-Track Schedule",
    country: "UAE",
    category: "Business Visa",
    visaType: "Multiple Entry Business",
    entryType: "Multiple Entry",
    status: "Active",
    regular: { minDays: 5, maxDays: 7, text: "5–7 Days" },
    express: { minDays: 2, maxDays: 3, text: "2–3 Days" },
    urgent: { minDays: 1, maxDays: 1, text: "24 Hours" },
    sla: {
      workingDaysOnly: false,
      excludeWeekends: false,
      excludePublicHolidays: true,
      expectedCompletionTime: "6:00 PM GST"
    },
    additional: {
      priorityLevel: "High",
      remarks: "Corporate express clearance channel.",
      specialConditions: "Pre-approved host company sponsor"
    },
    exceptions: {
      peakSeasonDelay: "+1 Day",
      holidayDelay: "+2 Days",
      embassyDelay: "+2 Days",
      docDelay: "+1 Day"
    },
    stats: {
      avgCompletionTime: "2.1 Days",
      fastestProcessing: "12 Hours",
      longestProcessing: "10 Days",
      applicationsProcessed: 4890
    }
  }
];

export default function ProcessingTimeManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [processingTypeFilter, setProcessingTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Records State
  const [rules, setRules] = useState<ProcessingTimeRecord[]>(MOCK_PROCESSING_RULES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Popup Details Modal State
  const [activeModalRule, setActiveModalRule] = useState<ProcessingTimeRecord | null>(null);
  const [modalTab, setModalTab] = useState<"overview" | "timeline" | "exceptions" | "stats">("overview");

  // Add / Edit Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRule, setEditingRule] = useState<ProcessingTimeRecord | null>(null);

  const [formData, setFormData] = useState({
    ruleName: "",
    country: "Canada",
    category: "Tourist Visa",
    visaType: "Tourist E-Visa",
    entryType: "Single Entry",
    status: "Active" as "Active" | "Inactive",
    regularMin: 10,
    regularMax: 15,
    expressMin: 5,
    expressMax: 7,
    urgentMin: 2,
    urgentMax: 3,
    workingDaysOnly: true,
    excludeWeekends: true,
    excludePublicHolidays: true,
    expectedCompletionTime: "5:00 PM EST",
    priorityLevel: "High" as "High" | "Medium" | "Low",
    remarks: "",
    specialConditions: ""
  });

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredRules = rules.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      r.ruleName.toLowerCase().includes(q) ||
      r.country.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.visaType.toLowerCase().includes(q);

    const matchesCountry = countryFilter === "All" || r.country === countryFilter;
    const matchesCategory = categoryFilter === "All" || r.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;

    return matchesQuery && matchesCountry && matchesCategory && matchesStatus;
  });

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredRules.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRules.map((r) => r.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handleToggleStatus = (record: ProcessingTimeRecord) => {
    const newStatus = record.status === "Active" ? "Inactive" : "Active";
    setRules((prev) =>
      prev.map((r) => (r.id === record.id ? { ...r, status: newStatus } : r))
    );
    triggerToast(`Processing rule ${record.ruleName} updated to ${newStatus}.`);
  };

  const handleDeleteRecord = (record: ProcessingTimeRecord) => {
    setRules((prev) => prev.filter((r) => r.id !== record.id));
    triggerToast(`Processing rule ${record.ruleName} deleted.`);
    if (activeModalRule?.id === record.id) setActiveModalRule(null);
  };

  const handleBulkActivate = () => {
    setRules((prev) =>
      prev.map((r) => (selectedIds.includes(r.id) ? { ...r, status: "Active" } : r))
    );
    triggerToast(`${selectedIds.length} rules activated.`);
    setSelectedIds([]);
  };

  const handleBulkDeactivate = () => {
    setRules((prev) =>
      prev.map((r) => (selectedIds.includes(r.id) ? { ...r, status: "Inactive" } : r))
    );
    triggerToast(`${selectedIds.length} rules deactivated.`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    setRules((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    triggerToast(`${selectedIds.length} rules deleted.`);
    setSelectedIds([]);
  };

  const openEditForm = (record: ProcessingTimeRecord) => {
    setEditingRule(record);
    setFormData({
      ruleName: record.ruleName,
      country: record.country,
      category: record.category,
      visaType: record.visaType,
      entryType: record.entryType,
      status: record.status,
      regularMin: record.regular.minDays,
      regularMax: record.regular.maxDays,
      expressMin: record.express.minDays,
      expressMax: record.express.maxDays,
      urgentMin: record.urgent.minDays,
      urgentMax: record.urgent.maxDays,
      workingDaysOnly: record.sla.workingDaysOnly,
      excludeWeekends: record.sla.excludeWeekends,
      excludePublicHolidays: record.sla.excludePublicHolidays,
      expectedCompletionTime: record.sla.expectedCompletionTime,
      priorityLevel: record.additional.priorityLevel,
      remarks: record.additional.remarks,
      specialConditions: record.additional.specialConditions
    });
    setShowAddModal(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ruleName) {
      triggerToast("Please provide Processing Rule Name.");
      return;
    }

    if (editingRule) {
      setRules((prev) =>
        prev.map((r) =>
          r.id === editingRule.id
            ? {
                ...r,
                ruleName: formData.ruleName,
                country: formData.country,
                category: formData.category,
                visaType: formData.visaType,
                entryType: formData.entryType,
                status: formData.status,
                regular: {
                  minDays: formData.regularMin,
                  maxDays: formData.regularMax,
                  text: `${formData.regularMin}–${formData.regularMax} Days`
                },
                express: {
                  minDays: formData.expressMin,
                  maxDays: formData.expressMax,
                  text: `${formData.expressMin}–${formData.expressMax} Days`
                },
                urgent: {
                  minDays: formData.urgentMin,
                  maxDays: formData.urgentMax,
                  text: `${formData.urgentMin}–${formData.urgentMax} Days`
                },
                sla: {
                  workingDaysOnly: formData.workingDaysOnly,
                  excludeWeekends: formData.excludeWeekends,
                  excludePublicHolidays: formData.excludePublicHolidays,
                  expectedCompletionTime: formData.expectedCompletionTime
                },
                additional: {
                  priorityLevel: formData.priorityLevel,
                  remarks: formData.remarks,
                  specialConditions: formData.specialConditions
                }
              }
            : r
        )
      );
      triggerToast(`Processing rule ${formData.ruleName} updated successfully.`);
    } else {
      const newRecord: ProcessingTimeRecord = {
        id: Date.now().toString(),
        ruleId: `PT-00${rules.length + 1}`,
        ruleName: formData.ruleName,
        country: formData.country,
        category: formData.category,
        visaType: formData.visaType,
        entryType: formData.entryType,
        status: formData.status,
        regular: {
          minDays: formData.regularMin,
          maxDays: formData.regularMax,
          text: `${formData.regularMin}–${formData.regularMax} Days`
        },
        express: {
          minDays: formData.expressMin,
          maxDays: formData.expressMax,
          text: `${formData.expressMin}–${formData.expressMax} Days`
        },
        urgent: {
          minDays: formData.urgentMin,
          maxDays: formData.urgentMax,
          text: `${formData.urgentMin}–${formData.urgentMax} Days`
        },
        sla: {
          workingDaysOnly: formData.workingDaysOnly,
          excludeWeekends: formData.excludeWeekends,
          excludePublicHolidays: formData.excludePublicHolidays,
          expectedCompletionTime: formData.expectedCompletionTime
        },
        additional: {
          priorityLevel: formData.priorityLevel,
          remarks: formData.remarks,
          specialConditions: formData.specialConditions
        },
        exceptions: {
          peakSeasonDelay: "+3 Days",
          holidayDelay: "+2 Days",
          embassyDelay: "+4 Days",
          docDelay: "+2 Days"
        },
        stats: {
          avgCompletionTime: "5.5 Days",
          fastestProcessing: "24 Hours",
          longestProcessing: "15 Days",
          applicationsProcessed: 120
        }
      };
      setRules((prev) => [newRecord, ...prev]);
      triggerToast(`New Processing Rule ${formData.ruleName} created.`);
    }

    setShowAddModal(false);
    setEditingRule(null);
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
            <Clock size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Service Level Agreement (SLA) & Timeline Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Processing Time
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Manage visa processing timelines, service levels, and expected completion periods for each country and visa type.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingRule(null);
              setFormData({
                ruleName: "",
                country: "Canada",
                category: "Tourist Visa",
                visaType: "Tourist E-Visa",
                entryType: "Single Entry",
                status: "Active",
                regularMin: 10,
                regularMax: 15,
                expressMin: 5,
                expressMax: 7,
                urgentMin: 2,
                urgentMax: 3,
                workingDaysOnly: true,
                excludeWeekends: true,
                excludePublicHolidays: true,
                expectedCompletionTime: "5:00 PM EST",
                priorityLevel: "High",
                remarks: "",
                specialConditions: ""
              });
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-white text-[#2563EB] hover:bg-blue-50 text-xs font-black rounded-xl shadow-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle size={16} /> Add Processing Time Rule
          </button>
        </div>
      </div>

      {/* TOP STATISTICS CARDS & PROCESSING TYPES CATALOG (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 4 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
                Total Processing Rules
              </span>
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                <Clock size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">248</div>
            <span className="text-[11px] text-[#2563EB] font-semibold mt-1 inline-block">
              SLA Schedules Configured
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
                Express Processing
              </span>
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Zap size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">84</div>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 inline-block">
              Fast-Track Channels Active
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
                Updated This Month
              </span>
              <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <RefreshCw size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">31</div>
            <span className="text-[11px] text-purple-600 font-semibold mt-1 inline-block">
              Refreshed SLAs
            </span>
          </div>
        </div>

        {/* RIGHT CARD: PROCESSING TYPES (LIST FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Processing Types
            </h3>
            <div className="space-y-2 text-xs text-slate-700 font-semibold">
              {PROCESSING_TYPES_LIST.map((type, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3 text-[10px] text-slate-400">
            Standard VisaOS Processing Speed Tiers
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
            Showing {filteredRules.length} of {rules.length} Processing Rules
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
                placeholder="Canada, Tourist, Express..."
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
              <option value="Student Visa">Student Visa</option>
            </select>
          </div>

          {/* PROCESSING TYPE FILTER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Processing Type Tier
            </label>
            <select
              value={processingTypeFilter}
              onChange={(e) => setProcessingTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition font-semibold"
            >
              <option value="All">All Tiers</option>
              <option value="Regular">Regular</option>
              <option value="Express">Express</option>
              <option value="Urgent">Urgent</option>
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
            <span>Processing Rules Selected</span>
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
              onClick={() => triggerToast(`Exporting rules for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Processing Rules
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

      {/* PROCESSING TIME TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredRules.length && filteredRules.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Visa Category</th>
                <th className="py-3.5 px-4">Visa Type</th>
                <th className="py-3.5 px-4 font-mono">Regular</th>
                <th className="py-3.5 px-4 font-mono text-blue-600">Express</th>
                <th className="py-3.5 px-4 font-mono text-amber-600">Urgent</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredRules.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <Clock size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No processing time rules found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredRules.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(r.id)}
                        onChange={() => handleToggleSelect(r.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {r.ruleId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {r.country}
                      <span className="block text-[10px] text-slate-400 font-normal">{r.ruleName}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {r.category}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {r.visaType}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {r.regular.text}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {r.express.text}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-600">
                      {r.urgent.text}
                    </td>
                    <td className="py-3.5 px-4">
                      {r.status === "Active" ? (
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
                            setActiveModalRule(r);
                            setModalTab("overview");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => openEditForm(r)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          title="Edit Processing Time"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(r)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            r.status === "Active"
                              ? "text-emerald-600 hover:bg-emerald-50"
                              : "text-amber-600 hover:bg-amber-50"
                          }`}
                          title={r.status === "Active" ? "Deactivate" : "Activate"}
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(r)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Rule"
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
          <div>Showing 1–10 of 248 Processing Rules</div>
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

      {/* CENTERED POPUP DETAILS MODAL (4 TABS AS IN WIREFRAME) */}
      {activeModalRule && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeModalRule.ruleName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700">
                      {activeModalRule.ruleId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{activeModalRule.country} &bull; {activeModalRule.category} ({activeModalRule.visaType})</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalRule(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {[
                { id: "overview", label: "Overview", icon: Clock },
                { id: "timeline", label: "Timeline", icon: Calendar },
                { id: "exceptions", label: "Exceptions & Delays", icon: AlertTriangle },
                { id: "stats", label: "Statistics", icon: TrendingUp }
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
              {/* TAB 1: OVERVIEW */}
              {modalTab === "overview" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Processing Rule Configuration Overview
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Country</span>
                      <strong className="text-slate-900 font-bold">{activeModalRule.country}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Category</span>
                      <strong className="text-[#2563EB] font-bold">{activeModalRule.category}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Type</span>
                      <strong className="text-slate-900 font-bold">{activeModalRule.visaType}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Processing Rule Name</span>
                      <strong className="text-slate-900 font-bold">{activeModalRule.ruleName}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Current Status</span>
                      <strong className="text-emerald-600 font-bold">{activeModalRule.status}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TIMELINE */}
              {modalTab === "timeline" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Service Level Agreement Speed Tiers
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-slate-500 block">Regular Processing</span>
                      <div className="text-xl font-black text-slate-900 font-mono">{activeModalRule.regular.text}</div>
                      <span className="text-[11px] text-slate-400">Standard Business Schedule</span>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-[#2563EB] block">Express Processing</span>
                      <div className="text-xl font-black text-[#2563EB] font-mono">{activeModalRule.express.text}</div>
                      <span className="text-[11px] text-blue-600 font-medium">Fast-Track Priority Queue</span>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-amber-700 block">Urgent Processing</span>
                      <div className="text-xl font-black text-amber-800 font-mono">{activeModalRule.urgent.text}</div>
                      <span className="text-[11px] text-amber-700 font-medium">Emergency Same-Day Processing</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: EXCEPTIONS & DELAYS */}
              {modalTab === "exceptions" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Expected Delay Offsets & Exception Padding
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Peak Season Delay</span>
                      <strong className="text-amber-700 font-mono font-bold text-sm">{activeModalRule.exceptions.peakSeasonDelay}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Holiday Delay</span>
                      <strong className="text-amber-700 font-mono font-bold text-sm">{activeModalRule.exceptions.holidayDelay}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Embassy Delay</span>
                      <strong className="text-red-600 font-mono font-bold text-sm">{activeModalRule.exceptions.embassyDelay}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Doc Query Delay</span>
                      <strong className="text-slate-900 font-mono font-bold text-sm">{activeModalRule.exceptions.docDelay}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: STATISTICS */}
              {modalTab === "stats" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Turnaround Performance & Volume Metrics
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Avg Completion</span>
                      <strong className="text-slate-900 text-base font-mono font-black">{activeModalRule.stats.avgCompletionTime}</strong>
                    </div>
                    <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200">
                      <span className="text-[10px] text-emerald-700 font-extrabold uppercase block">Fastest Record</span>
                      <strong className="text-emerald-800 text-base font-mono font-black">{activeModalRule.stats.fastestProcessing}</strong>
                    </div>
                    <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
                      <span className="text-[10px] text-amber-700 font-extrabold uppercase block">Longest Record</span>
                      <strong className="text-amber-800 text-base font-mono font-black">{activeModalRule.stats.longestProcessing}</strong>
                    </div>
                    <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200">
                      <span className="text-[10px] text-[#2563EB] font-extrabold uppercase block">Apps Processed</span>
                      <strong className="text-[#2563EB] text-base font-mono font-black">{activeModalRule.stats.applicationsProcessed}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(activeModalRule)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  activeModalRule.status === "Active"
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                {activeModalRule.status === "Active" ? "Deactivate Processing Rule" : "Activate Processing Rule"}
              </button>

              <button
                onClick={() => openEditForm(activeModalRule)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 size={14} /> Edit Processing Time
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PROCESSING TIME FORM MODAL (EXACT WIREFRAME FORM) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-black font-outfit flex items-center gap-2">
                <Clock size={18} />
                <span>{editingRule ? `Edit Processing Time: ${editingRule.ruleName}` : "Add Processing Time Rule"}</span>
              </h3>

              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingRule(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* MODAL FORM BODY */}
            <form onSubmit={handleSaveRule} className="p-6 overflow-y-auto flex-1 text-xs space-y-6 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE]">
              {/* SECTION 1: VISA INFORMATION */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Visa Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
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
                      <option value="Student Visa">Student Visa</option>
                      <option value="Work Visa">Work Visa</option>
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
                      Entry Type
                    </label>
                    <select
                      value={formData.entryType}
                      onChange={(e) => setFormData({ ...formData, entryType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                    >
                      <option value="Single Entry">Single Entry</option>
                      <option value="Double Entry">Double Entry</option>
                      <option value="Multiple Entry">Multiple Entry</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Processing Rule Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Canada Tourist Visa SLA Schedule"
                      value={formData.ruleName}
                      onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: PROCESSING DURATION (3 TIERS AS IN WIREFRAME) */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Processing Duration (Turnaround Range)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Regular Processing */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <span className="font-extrabold text-slate-800 text-xs block">Regular Processing</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">Min Days</label>
                        <input
                          type="number"
                          value={formData.regularMin}
                          onChange={(e) => setFormData({ ...formData, regularMin: Number(e.target.value) })}
                          className="w-full bg-white border border-slate-200 text-xs px-2 py-1 rounded-lg font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">Max Days</label>
                        <input
                          type="number"
                          value={formData.regularMax}
                          onChange={(e) => setFormData({ ...formData, regularMax: Number(e.target.value) })}
                          className="w-full bg-white border border-slate-200 text-xs px-2 py-1 rounded-lg font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Express Processing */}
                  <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-2">
                    <span className="font-extrabold text-[#2563EB] text-xs block">Express Processing</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] uppercase font-bold text-blue-600 block mb-0.5">Min Days</label>
                        <input
                          type="number"
                          value={formData.expressMin}
                          onChange={(e) => setFormData({ ...formData, expressMin: Number(e.target.value) })}
                          className="w-full bg-white border border-blue-200 text-xs px-2 py-1 rounded-lg font-mono text-[#2563EB]"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold text-blue-600 block mb-0.5">Max Days</label>
                        <input
                          type="number"
                          value={formData.expressMax}
                          onChange={(e) => setFormData({ ...formData, expressMax: Number(e.target.value) })}
                          className="w-full bg-white border border-blue-200 text-xs px-2 py-1 rounded-lg font-mono text-[#2563EB]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Urgent Processing */}
                  <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
                    <span className="font-extrabold text-amber-700 text-xs block">Urgent Processing</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] uppercase font-bold text-amber-600 block mb-0.5">Min Days</label>
                        <input
                          type="number"
                          value={formData.urgentMin}
                          onChange={(e) => setFormData({ ...formData, urgentMin: Number(e.target.value) })}
                          className="w-full bg-white border border-amber-200 text-xs px-2 py-1 rounded-lg font-mono text-amber-700"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold text-amber-600 block mb-0.5">Max Days</label>
                        <input
                          type="number"
                          value={formData.urgentMax}
                          onChange={(e) => setFormData({ ...formData, urgentMax: Number(e.target.value) })}
                          className="w-full bg-white border border-amber-200 text-xs px-2 py-1 rounded-lg font-mono text-amber-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: SERVICE LEVEL AGREEMENT (SLA) */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Service Level Agreement (SLA) Conditions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.workingDaysOnly}
                      onChange={(e) => setFormData({ ...formData, workingDaysOnly: e.target.checked })}
                      className="rounded border-slate-300 text-[#2563EB]"
                    />
                    <span>Working Days Only</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.excludeWeekends}
                      onChange={(e) => setFormData({ ...formData, excludeWeekends: e.target.checked })}
                      className="rounded border-slate-300 text-[#2563EB]"
                    />
                    <span>Exclude Weekends</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.excludePublicHolidays}
                      onChange={(e) => setFormData({ ...formData, excludePublicHolidays: e.target.checked })}
                      className="rounded border-slate-300 text-[#2563EB]"
                    />
                    <span>Exclude Public Holidays</span>
                  </label>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Expected Completion Time
                    </label>
                    <input
                      type="text"
                      placeholder="5:00 PM EST"
                      value={formData.expectedCompletionTime}
                      onChange={(e) => setFormData({ ...formData, expectedCompletionTime: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: ADDITIONAL INFORMATION */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Additional Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Priority Level
                    </label>
                    <select
                      value={formData.priorityLevel}
                      onChange={(e) => setFormData({ ...formData, priorityLevel: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                    >
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Remarks
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. High demand during summer travel"
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Special Conditions
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Biometrics appointment completed"
                      value={formData.specialConditions}
                      onChange={(e) => setFormData({ ...formData, specialConditions: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl"
                    />
                  </div>
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
                  {editingRule ? "Save Processing Rule" : "Create Processing Rule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
