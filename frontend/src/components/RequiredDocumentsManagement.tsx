import React, { useState } from "react";
import {
  FileText,
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
  Download,
  Check,
  X,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Upload,
  FolderPlus,
  FileCheck,
  Layers,
  FileSpreadsheet
} from "lucide-react";

export interface DocumentSetRecord {
  id: string;
  docSetId: string;
  country: string;
  category: string;
  visaType: string;
  entryType: string;
  docSetName: string;
  status: "Active" | "Inactive";
  mandatoryDocs: string[];
  optionalDocs: string[];
  uploadRules: {
    maxFileSize: string;
    minFileSize: string;
    allowedFormats: string[];
    photoDimensions: string;
    expiryCheckRequired: boolean;
  };
  verification: {
    translationRequired: boolean;
    notarizationRequired: boolean;
    apostilleRequired: boolean;
    originalPhysicalNeeded: boolean;
  };
}

export const MASTER_DOCUMENT_LIBRARY = [
  {
    category: "Identity Documents",
    items: ["Passport", "National ID / Aadhaar", "PAN Card", "Driving License"]
  },
  {
    category: "Personal Documents",
    items: ["Passport Size Photograph", "Birth Certificate", "Marriage Certificate"]
  },
  {
    category: "Financial Documents",
    items: ["Bank Statement", "Income Tax Return (ITR)", "Salary Slips", "Fixed Deposit Certificate"]
  },
  {
    category: "Employment & Business",
    items: ["Employment Letter", "Offer Letter", "Business Registration Certificate", "GST Certificate", "Business Bank Statement"]
  },
  {
    category: "Education",
    items: ["Admission Letter", "Marksheets / Transcripts", "Degree Certificate", "TOEFL / IELTS Scorecard"]
  },
  {
    category: "Travel Documents",
    items: ["Flight Reservation", "Hotel Booking", "Travel Itinerary", "Travel Insurance"]
  },
  {
    category: "Supporting Documents",
    items: ["Cover Letter", "Invitation Letter", "Police Clearance Certificate (PCC)", "Medical Certificate", "Previous Visa Copies", "Previous Passport", "Sponsor Letter", "Financial Support Affidavit"]
  }
];

const MOCK_DOC_SETS: DocumentSetRecord[] = [
  {
    id: "1",
    docSetId: "DOC-001",
    country: "Canada",
    category: "Tourist Visa",
    visaType: "Tourist E-Visa",
    entryType: "Single Entry",
    docSetName: "Canada Standard Tourist Checklist",
    status: "Active",
    mandatoryDocs: [
      "Passport",
      "Passport Size Photograph",
      "Bank Statement",
      "Income Tax Return (ITR)",
      "Salary Slips",
      "Employment Letter",
      "Flight Reservation",
      "Hotel Booking"
    ],
    optionalDocs: ["Marriage Certificate", "Property Documents", "Previous Visa Copies"],
    uploadRules: {
      maxFileSize: "5 MB",
      minFileSize: "100 KB",
      allowedFormats: ["PDF", "JPG", "PNG"],
      photoDimensions: "35mm x 45mm (White Background)",
      expiryCheckRequired: true
    },
    verification: {
      translationRequired: true,
      notarizationRequired: false,
      apostilleRequired: false,
      originalPhysicalNeeded: false
    }
  },
  {
    id: "2",
    docSetId: "DOC-002",
    country: "Australia",
    category: "Student Visa",
    visaType: "Student Long Stay",
    entryType: "Multiple Entry",
    docSetName: "Australia Subclass 500 Student Set",
    status: "Active",
    mandatoryDocs: [
      "Passport",
      "Passport Size Photograph",
      "Bank Statement",
      "Income Tax Return (ITR)",
      "Admission Letter",
      "Marksheets / Transcripts",
      "Degree Certificate",
      "TOEFL / IELTS Scorecard",
      "Medical Certificate",
      "Police Clearance Certificate (PCC)",
      "Travel Insurance",
      "Cover Letter"
    ],
    optionalDocs: ["Financial Support Affidavit", "Previous Passport", "Sponsor Letter", "Fixed Deposit Certificate"],
    uploadRules: {
      maxFileSize: "10 MB",
      minFileSize: "200 KB",
      allowedFormats: ["PDF"],
      photoDimensions: "35mm x 45mm",
      expiryCheckRequired: true
    },
    verification: {
      translationRequired: true,
      notarizationRequired: true,
      apostilleRequired: false,
      originalPhysicalNeeded: false
    }
  },
  {
    id: "3",
    docSetId: "DOC-003",
    country: "UAE",
    category: "Business Visa",
    visaType: "Multiple Entry Business",
    entryType: "Multiple Entry",
    docSetName: "UAE Express Business Checklist",
    status: "Active",
    mandatoryDocs: [
      "Passport",
      "Passport Size Photograph",
      "Business Registration Certificate",
      "Invitation Letter",
      "Business Bank Statement",
      "Cover Letter"
    ],
    optionalDocs: ["GST Certificate", "Trade License"],
    uploadRules: {
      maxFileSize: "4 MB",
      minFileSize: "50 KB",
      allowedFormats: ["PDF", "JPG"],
      photoDimensions: "43mm x 55mm",
      expiryCheckRequired: true
    },
    verification: {
      translationRequired: false,
      notarizationRequired: false,
      apostilleRequired: false,
      originalPhysicalNeeded: false
    }
  }
];

export default function RequiredDocumentsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [visaTypeFilter, setVisaTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Records State
  const [docSets, setDocSets] = useState<DocumentSetRecord[]>(MOCK_DOC_SETS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalDocSet, setActiveModalDocSet] = useState<DocumentSetRecord | null>(null);
  const [modalTab, setModalTab] = useState<"overview" | "mandatory" | "optional" | "rules" | "verification">("overview");

  // Add / Edit Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDocSet, setEditingDocSet] = useState<DocumentSetRecord | null>(null);

  const [formData, setFormData] = useState({
    country: "Canada",
    category: "Tourist Visa",
    visaType: "Tourist E-Visa",
    entryType: "Single Entry",
    docSetName: "",
    status: "Active" as "Active" | "Inactive",
    mandatoryDocs: [
      "Passport",
      "Passport Size Photograph",
      "Bank Statement",
      "Income Tax Return (ITR)",
      "Salary Slips",
      "Employment Letter"
    ],
    optionalDocs: ["Marriage Certificate", "Birth Certificate", "Previous Visa Copies"],
    maxFileSize: "5 MB",
    minFileSize: "100 KB",
    allowedFormats: ["PDF", "JPG", "PNG"],
    photoDimensions: "35mm x 45mm",
    expiryCheckRequired: true,
    translationRequired: true,
    notarizationRequired: false,
    apostilleRequired: false,
    originalPhysicalNeeded: false
  });

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredSets = docSets.filter((d) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      d.docSetName.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.visaType.toLowerCase().includes(q);

    const matchesCountry = countryFilter === "All" || d.country === countryFilter;
    const matchesCategory = categoryFilter === "All" || d.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;

    return matchesQuery && matchesCountry && matchesCategory && matchesStatus;
  });

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredSets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSets.map((d) => d.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handleToggleStatus = (record: DocumentSetRecord) => {
    const newStatus = record.status === "Active" ? "Inactive" : "Active";
    setDocSets((prev) =>
      prev.map((d) => (d.id === record.id ? { ...d, status: newStatus } : d))
    );
    triggerToast(`Document set ${record.docSetId} updated to ${newStatus}.`);
  };

  const handleDeleteRecord = (record: DocumentSetRecord) => {
    setDocSets((prev) => prev.filter((d) => d.id !== record.id));
    triggerToast(`Document set ${record.docSetId} deleted.`);
    if (activeModalDocSet?.id === record.id) setActiveModalDocSet(null);
  };

  const handleBulkActivate = () => {
    setDocSets((prev) =>
      prev.map((d) => (selectedIds.includes(d.id) ? { ...d, status: "Active" } : d))
    );
    triggerToast(`${selectedIds.length} document sets activated.`);
    setSelectedIds([]);
  };

  const handleBulkDeactivate = () => {
    setDocSets((prev) =>
      prev.map((d) => (selectedIds.includes(d.id) ? { ...d, status: "Inactive" } : d))
    );
    triggerToast(`${selectedIds.length} document sets deactivated.`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    setDocSets((prev) => prev.filter((d) => !selectedIds.includes(d.id)));
    triggerToast(`${selectedIds.length} document sets deleted.`);
    setSelectedIds([]);
  };

  const openEditForm = (record: DocumentSetRecord) => {
    setEditingDocSet(record);
    setFormData({
      country: record.country,
      category: record.category,
      visaType: record.visaType,
      entryType: record.entryType,
      docSetName: record.docSetName,
      status: record.status,
      mandatoryDocs: record.mandatoryDocs,
      optionalDocs: record.optionalDocs,
      maxFileSize: record.uploadRules.maxFileSize,
      minFileSize: record.uploadRules.minFileSize,
      allowedFormats: record.uploadRules.allowedFormats,
      photoDimensions: record.uploadRules.photoDimensions,
      expiryCheckRequired: record.uploadRules.expiryCheckRequired,
      translationRequired: record.verification.translationRequired,
      notarizationRequired: record.verification.notarizationRequired,
      apostilleRequired: record.verification.apostilleRequired,
      originalPhysicalNeeded: record.verification.originalPhysicalNeeded
    });
    setShowAddModal(true);
  };

  const handleSaveDocSet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.docSetName) {
      triggerToast("Please enter a Document Set Name.");
      return;
    }

    if (editingDocSet) {
      setDocSets((prev) =>
        prev.map((d) =>
          d.id === editingDocSet.id
            ? {
                ...d,
                country: formData.country,
                category: formData.category,
                visaType: formData.visaType,
                entryType: formData.entryType,
                docSetName: formData.docSetName,
                status: formData.status,
                mandatoryDocs: formData.mandatoryDocs,
                optionalDocs: formData.optionalDocs,
                uploadRules: {
                  maxFileSize: formData.maxFileSize,
                  minFileSize: formData.minFileSize,
                  allowedFormats: formData.allowedFormats,
                  photoDimensions: formData.photoDimensions,
                  expiryCheckRequired: formData.expiryCheckRequired
                },
                verification: {
                  translationRequired: formData.translationRequired,
                  notarizationRequired: formData.notarizationRequired,
                  apostilleRequired: formData.apostilleRequired,
                  originalPhysicalNeeded: formData.originalPhysicalNeeded
                }
              }
            : d
        )
      );
      triggerToast(`Document set ${formData.docSetName} updated successfully.`);
    } else {
      const newRecord: DocumentSetRecord = {
        id: Date.now().toString(),
        docSetId: `DOC-00${docSets.length + 1}`,
        country: formData.country,
        category: formData.category,
        visaType: formData.visaType,
        entryType: formData.entryType,
        docSetName: formData.docSetName,
        status: formData.status,
        mandatoryDocs: formData.mandatoryDocs,
        optionalDocs: formData.optionalDocs,
        uploadRules: {
          maxFileSize: formData.maxFileSize,
          minFileSize: formData.minFileSize,
          allowedFormats: formData.allowedFormats,
          photoDimensions: formData.photoDimensions,
          expiryCheckRequired: formData.expiryCheckRequired
        },
        verification: {
          translationRequired: formData.translationRequired,
          notarizationRequired: formData.notarizationRequired,
          apostilleRequired: formData.apostilleRequired,
          originalPhysicalNeeded: formData.originalPhysicalNeeded
        }
      };
      setDocSets((prev) => [newRecord, ...prev]);
      triggerToast(`New Document Set ${formData.docSetName} created.`);
    }

    setShowAddModal(false);
    setEditingDocSet(null);
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
            <FileText size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Global Document Verification & Compliance Rules
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Required Documents
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Manage document requirements, validation rules, upload formats, file size limits, and templates for each country.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingDocSet(null);
              setFormData({
                country: "Canada",
                category: "Tourist Visa",
                visaType: "Tourist E-Visa",
                entryType: "Single Entry",
                docSetName: "",
                status: "Active",
                mandatoryDocs: [
                  "Passport",
                  "Passport Size Photograph",
                  "Bank Statement",
                  "Income Tax Return (ITR)",
                  "Salary Slips",
                  "Employment Letter"
                ],
                optionalDocs: ["Marriage Certificate", "Birth Certificate", "Previous Visa Copies"],
                maxFileSize: "5 MB",
                minFileSize: "100 KB",
                allowedFormats: ["PDF", "JPG", "PNG"],
                photoDimensions: "35mm x 45mm",
                expiryCheckRequired: true,
                translationRequired: true,
                notarizationRequired: false,
                apostilleRequired: false,
                originalPhysicalNeeded: false
              });
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-white text-[#2563EB] hover:bg-blue-50 text-xs font-black rounded-xl shadow-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle size={16} /> Add Required Document Set
          </button>
        </div>
      </div>

      {/* TOP STATISTICS CARDS & MASTER DOCUMENT LIBRARY CATALOG (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 4 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
                Total Document Sets
              </span>
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                <FileText size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">268</div>
            <span className="text-[11px] text-[#2563EB] font-semibold mt-1 inline-block">
              Checklists Configured
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
              Global Missions Covered
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
                Visa Types Covered
              </span>
              <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Layers size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">142</div>
            <span className="text-[11px] text-purple-600 font-semibold mt-1 inline-block">
              Visa Categories Standardized
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
                Updated This Month
              </span>
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <RefreshCw size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">28</div>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 inline-block">
              Audit Updates Complete
            </span>
          </div>
        </div>

        {/* RIGHT CARD: MASTER DOCUMENT LIBRARY (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Master Document Library
            </h3>
            <div className="space-y-3 text-xs max-h-52 overflow-y-auto [scrollbar-width:thin] pr-1">
              {MASTER_DOCUMENT_LIBRARY.map((grp, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#2563EB] tracking-wider block">
                    • {grp.category}
                  </span>
                  <div className="pl-2 space-y-0.5 text-slate-600">
                    {grp.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-300">-</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3 text-[10px] text-slate-400">
            VisaOS Master Verification Repository
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
            Showing {filteredSets.length} of {docSets.length} Document Sets
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
              <option value="Student Visa">Student Visa</option>
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
              <option value="Student Long Stay">Student Long Stay</option>
              <option value="Multiple Entry Business">Multiple Entry Business</option>
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
            <span>Document Sets Selected</span>
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
              onClick={() => triggerToast(`Exporting document checklists for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Document Sets
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

      {/* REQUIRED DOCUMENTS TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredSets.length && filteredSets.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Document Set ID</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Visa Category</th>
                <th className="py-3.5 px-4">Visa Type</th>
                <th className="py-3.5 px-4 font-mono text-[#2563EB]">Required Docs</th>
                <th className="py-3.5 px-4 font-mono text-purple-600">Optional Docs</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredSets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <FileText size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No document sets found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredSets.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(d.id)}
                        onChange={() => handleToggleSelect(d.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {d.docSetId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {d.country}
                      <span className="block text-[10px] text-slate-400 font-normal">{d.docSetName}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {d.category}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {d.visaType}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {d.mandatoryDocs.length} Mandatory
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-purple-600">
                      {d.optionalDocs.length} Optional
                    </td>
                    <td className="py-3.5 px-4">
                      {d.status === "Active" ? (
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
                            setActiveModalDocSet(d);
                            setModalTab("overview");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => openEditForm(d)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          title="Edit Document Set"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(d)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            d.status === "Active"
                              ? "text-emerald-600 hover:bg-emerald-50"
                              : "text-amber-600 hover:bg-amber-50"
                          }`}
                          title={d.status === "Active" ? "Deactivate" : "Activate"}
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(d)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Document Set"
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
          <div>Showing 1–10 of 268 Document Sets</div>
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
      {activeModalDocSet && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeModalDocSet.docSetName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700">
                      {activeModalDocSet.docSetId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{activeModalDocSet.country} &bull; {activeModalDocSet.category} ({activeModalDocSet.visaType})</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalDocSet(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {[
                { id: "overview", label: "Overview", icon: FileText },
                { id: "mandatory", label: "Mandatory Documents", icon: CheckCircle2 },
                { id: "optional", label: "Optional Documents", icon: FileCheck },
                { id: "rules", label: "Upload Rules", icon: Upload },
                { id: "verification", label: "Verification Specs", icon: ShieldCheck }
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
                    Document Checklist Configuration Overview
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Country</span>
                      <strong className="text-slate-900 font-bold">{activeModalDocSet.country}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Category</span>
                      <strong className="text-[#2563EB] font-bold">{activeModalDocSet.category}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Type</span>
                      <strong className="text-slate-900 font-bold">{activeModalDocSet.visaType}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Mandatory Count</span>
                      <strong className="text-[#2563EB] font-bold">{activeModalDocSet.mandatoryDocs.length} Documents</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Status</span>
                      <strong className="text-emerald-600 font-bold">{activeModalDocSet.status}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MANDATORY DOCUMENTS */}
              {modalTab === "mandatory" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Mandatory Required Documents ({activeModalDocSet.mandatoryDocs.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeModalDocSet.mandatoryDocs.map((doc, idx) => (
                      <div key={idx} className="p-3 bg-blue-50/60 border border-blue-200 rounded-2xl flex items-center justify-between font-bold text-slate-800">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-[#2563EB]" /> {doc}
                        </span>
                        <span className="text-[10px] text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200">Mandatory</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: OPTIONAL DOCUMENTS */}
              {modalTab === "optional" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Optional Supplementary Documents ({activeModalDocSet.optionalDocs.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeModalDocSet.optionalDocs.map((doc, idx) => (
                      <div key={idx} className="p-3 bg-purple-50/60 border border-purple-200 rounded-2xl flex items-center justify-between font-bold text-slate-800">
                        <span className="flex items-center gap-2">
                          <FileCheck size={15} className="text-purple-600" /> {doc}
                        </span>
                        <span className="text-[10px] text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200">Optional</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: UPLOAD RULES */}
              {modalTab === "rules" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    File Upload Validation Specifications
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Max File Size</span>
                      <strong className="text-slate-900 font-mono font-bold text-sm">{activeModalDocSet.uploadRules.maxFileSize}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Min File Size</span>
                      <strong className="text-slate-900 font-mono font-bold text-sm">{activeModalDocSet.uploadRules.minFileSize}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Allowed Formats</span>
                      <strong className="text-[#2563EB] font-mono font-bold text-xs">{activeModalDocSet.uploadRules.allowedFormats.join(", ")}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Photo Specs</span>
                      <strong className="text-slate-900 font-mono text-[11px]">{activeModalDocSet.uploadRules.photoDimensions}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: VERIFICATION SPECS */}
              {modalTab === "verification" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Legal & Official Verification Protocol
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Translation Required</span>
                      <strong className="text-slate-900 font-bold">{activeModalDocSet.verification.translationRequired ? "Yes (Certified Translation Needed)" : "No"}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Notarization Required</span>
                      <strong className="text-slate-900 font-bold">{activeModalDocSet.verification.notarizationRequired ? "Yes (Notary Public Stamp Needed)" : "No"}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Apostille Legalization</span>
                      <strong className="text-slate-900 font-bold">{activeModalDocSet.verification.apostilleRequired ? "Yes (MEA Apostille Required)" : "No"}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Physical Copies Needed</span>
                      <strong className="text-slate-900 font-bold">{activeModalDocSet.verification.originalPhysicalNeeded ? "Yes (VFS Original Submission)" : "No"}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(activeModalDocSet)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  activeModalDocSet.status === "Active"
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                {activeModalDocSet.status === "Active" ? "Deactivate Document Set" : "Activate Document Set"}
              </button>

              <button
                onClick={() => openEditForm(activeModalDocSet)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 size={14} /> Edit Document Set
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT REQUIRED DOCUMENTS FORM MODAL (EXACT WIREFRAME FORM) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-black font-outfit flex items-center gap-2">
                <FileText size={18} />
                <span>{editingDocSet ? `Edit Document Set: ${editingDocSet.docSetName}` : "Add Required Document Set"}</span>
              </h3>

              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingDocSet(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* MODAL FORM BODY */}
            <form onSubmit={handleSaveDocSet} className="p-6 overflow-y-auto flex-1 text-xs space-y-6 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE]">
              {/* SECTION 1: BASIC INFORMATION */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
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
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
                    >
                      <option value="Tourist Visa">Tourist Visa</option>
                      <option value="Business Visa">Business Visa</option>
                      <option value="Student Visa">Student Visa</option>
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
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Document Set Name
                    </label>
                    <input
                      type="text"
                      placeholder="Canada Standard Tourist Checklist"
                      value={formData.docSetName}
                      onChange={(e) => setFormData({ ...formData, docSetName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: MANDATORY DOCUMENTS CHECKLIST */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Mandatory Required Documents Checklist
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    "Passport",
                    "Passport Size Photograph",
                    "Bank Statement",
                    "Income Tax Return (ITR)",
                    "Salary Slips",
                    "Employment Letter",
                    "Flight Reservation",
                    "Hotel Booking",
                    "Travel Insurance",
                    "Cover Letter",
                    "Medical Certificate",
                    "Police Clearance Certificate (PCC)",
                    "Invitation Letter",
                    "Business Registration Certificate",
                    "Admission Letter",
                    "Financial Support Affidavit"
                  ].map((doc) => {
                    const checked = formData.mandatoryDocs.includes(doc);
                    return (
                      <label
                        key={doc}
                        className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition text-[11px] font-semibold ${
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
                                mandatoryDocs: formData.mandatoryDocs.filter((d) => d !== doc)
                              });
                            } else {
                              setFormData({
                                ...formData,
                                mandatoryDocs: [...formData.mandatoryDocs, doc]
                              });
                            }
                          }}
                          className="rounded border-slate-300 text-[#2563EB]"
                        />
                        <span>{doc}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: UPLOAD RULES & VERIFICATION */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Upload Rules & Legal Verification
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Max File Size
                    </label>
                    <input
                      type="text"
                      placeholder="5 MB"
                      value={formData.maxFileSize}
                      onChange={(e) => setFormData({ ...formData, maxFileSize: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Photo Specifications
                    </label>
                    <input
                      type="text"
                      placeholder="35mm x 45mm"
                      value={formData.photoDimensions}
                      onChange={(e) => setFormData({ ...formData, photoDimensions: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.translationRequired}
                      onChange={(e) => setFormData({ ...formData, translationRequired: e.target.checked })}
                      className="rounded border-slate-300 text-[#2563EB]"
                    />
                    <span>Translation Required</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.originalPhysicalNeeded}
                      onChange={(e) => setFormData({ ...formData, originalPhysicalNeeded: e.target.checked })}
                      className="rounded border-slate-300 text-[#2563EB]"
                    />
                    <span>Original Physical Copies</span>
                  </label>
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
                  {editingDocSet ? "Save Document Set" : "Create Document Set"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
