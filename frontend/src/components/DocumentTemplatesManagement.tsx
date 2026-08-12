import React, { useState, useEffect } from "react";
import { API_V1_URL } from "../config/api";
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
  UserPlus,
  Mail,
  Phone,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  FileCheck,
  Copy,
  Plus
} from "lucide-react";

export interface DocumentTemplateRecord {
  _id?: string;
  id: string;
  templateId: string;
  title: string;
  category:
    | "Cover Letter"
    | "Sponsorship Letter"
    | "NOC / Leave Letter"
    | "Financial Affidavit"
    | "Self Declaration"
    | "Invitation Letter"
    | "Other";
  country: string;
  fileFormat: "DOCX" | "PDF" | "TXT";
  fileSize: string;
  downloadsCount: number;
  status: "Active" | "Draft" | "Deprecated";
  description: string;
  templateBody: string;
  placeholderFields: string[];
  lastUpdated?: string;
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_TEMPLATE_TABS = [
  "Overview",
  "Template Content",
  "Placeholder Fields",
  "Download Settings",
  "Usage History"
];

export const TEMPLATE_CATEGORIES = [
  "Cover Letter",
  "Sponsorship Letter",
  "NOC / Leave Letter",
  "Financial Affidavit",
  "Self Declaration",
  "Invitation Letter",
  "Other"
];

export default function DocumentTemplatesManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [formatFilter, setFormatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Records & Loading State
  const [templatesList, setTemplatesList] = useState<DocumentTemplateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details / Edit Modal State
  const [activeModalTemplate, setActiveModalTemplate] = useState<DocumentTemplateRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // Add New Template Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<DocumentTemplateRecord["category"]>("Cover Letter");
  const [newCountry, setNewCountry] = useState("Global");
  const [newFormat, setNewFormat] = useState<"DOCX" | "PDF" | "TXT">("DOCX");
  const [newDescription, setNewDescription] = useState("");
  const [newBody, setNewBody] = useState("");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Fetch Templates from Backend API
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_V1_URL}/visa/templates`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const formatted: DocumentTemplateRecord[] = json.data.map((t: any) => ({
          _id: t._id,
          id: t._id || t.templateId,
          templateId: t.templateId,
          title: t.title,
          category: t.category,
          country: t.country || "Global",
          fileFormat: t.fileFormat || "DOCX",
          fileSize: t.fileSize || "120 KB",
          downloadsCount: t.downloadsCount || 0,
          status: t.status || "Active",
          description: t.description || "",
          templateBody: t.templateBody || "",
          placeholderFields: t.placeholderFields || [],
          lastUpdated: t.updatedAt ? new Date(t.updatedAt).toLocaleDateString("en-GB") : "Recently"
        }));
        setTemplatesList(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Filter Logic
  const filteredTemplates = templatesList.filter((tmp) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      tmp.templateId.toLowerCase().includes(q) ||
      tmp.title.toLowerCase().includes(q) ||
      tmp.country.toLowerCase().includes(q) ||
      tmp.description.toLowerCase().includes(q);

    const matchesCategory = categoryFilter === "All" || tmp.category === categoryFilter;
    const matchesCountry = countryFilter === "All" || tmp.country === countryFilter;
    const matchesFormat = formatFilter === "All" || tmp.fileFormat === formatFilter;
    const matchesStatus = statusFilter === "All" || tmp.status === statusFilter;

    return matchesQuery && matchesCategory && matchesCountry && matchesFormat && matchesStatus;
  });

  // Handle Add Template Submit
  const handleAddTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) {
      triggerToast("Please provide both title and template body text.");
      return;
    }

    try {
      const payload = {
        title: newTitle.trim(),
        category: newCategory,
        country: newCountry,
        fileFormat: newFormat,
        description: newDescription.trim(),
        templateBody: newBody.trim(),
        placeholderFields: Array.from(newBody.match(/\{[A-Z0-9_]+\}/g) || [])
      };

      const res = await fetch(`${API_V1_URL}/visa/templates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        triggerToast("New Document Template created successfully in MongoDB!");
        setIsAddModalOpen(false);
        setNewTitle("");
        setNewBody("");
        setNewDescription("");
        fetchTemplates();
      }
    } catch (err) {
      triggerToast("Failed to create template.");
    }
  };

  // Handle Delete Template
  const handleDeleteTemplate = async (id: string, mongoId?: string) => {
    const targetId = mongoId || id;
    try {
      const res = await fetch(`${API_V1_URL}/visa/templates/${targetId}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (json.success) {
        triggerToast("Document Template deleted successfully!");
        setTemplatesList((prev) => prev.filter((t) => t.id !== id && t._id !== targetId));
      }
    } catch (err) {
      triggerToast("Failed to delete template.");
    }
  };

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredTemplates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTemplates.map((t) => t.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handleCreateTemplate = () => {
    if (!newTitle || !newBody) {
      triggerToast("Please fill in template title and body content.");
      return;
    }
    const newId = (templatesList.length + 1).toString();
    const newRecord: DocumentTemplateRecord = {
      id: newId,
      templateId: `TMP-10${newId}`,
      title: newTitle,
      category: newCategory,
      country: newCountry,
      fileFormat: newFormat,
      fileSize: "150 KB",
      downloadsCount: 0,
      status: "Active",
      description: newDescription || "Custom user uploaded visa declaration template.",
      templateBody: newBody,
      placeholderFields: ["{APPLICANT_NAME}", "{PASSPORT_NUMBER}", "{DATE}"],
      lastUpdated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      actionNotes: []
    };

    setTemplatesList([newRecord, ...templatesList]);
    triggerToast(`Template ${newRecord.templateId} created successfully!`);
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewDescription("");
    setNewBody("");
  };

  const handleDeleteRecord = (tmp: DocumentTemplateRecord) => {
    setTemplatesList((prev) => prev.filter((t) => t.id !== tmp.id));
    triggerToast(`Template ${tmp.templateId} deleted.`);
    if (activeModalTemplate?.id === tmp.id) setActiveModalTemplate(null);
  };

  const handleCopyTemplateText = (text: string) => {
    navigator.clipboard.writeText(text);
    triggerToast("Template body text copied to clipboard!");
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 font-sans min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#0E1A2C] border border-[#2563EB]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
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
              Official Form Formats & Declaration Repository
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Document Templates
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Manage official visa application document templates, declaration samples, cover letter formats, and downloadable guidelines.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold text-xs rounded-2xl shadow-lg transition cursor-pointer flex items-center gap-2 shrink-0 border border-white/20"
        >
          <Plus size={16} /> Add New Template
        </button>
      </div>

      {/* DASHBOARD STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME DESIGN SYSTEM) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Active Templates</span>
            <div className="text-2xl font-black text-slate-900 font-mono">48</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Standard Formats</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Cover Letters</span>
            <div className="text-2xl font-black text-slate-900 font-mono">14</div>
            <span className="text-[10px] text-emerald-600 font-bold">Embassy Addressed</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Sponsorship Affidavits</span>
            <div className="text-2xl font-black text-slate-900 font-mono">8</div>
            <span className="text-[10px] text-blue-600 font-bold">Financial Proofs</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">NOC / Leave Letters</span>
            <div className="text-2xl font-black text-slate-900 font-mono">12</div>
            <span className="text-[10px] text-purple-600 font-bold">Work Approvals</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Self-Declarations</span>
            <div className="text-2xl font-black text-slate-900 font-mono">9</div>
            <span className="text-[10px] text-amber-600 font-bold">Custom Declarations</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">Downloads Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">420</div>
            <span className="text-[10px] text-teal-600 font-bold">User & Agent Use</span>
          </div>
        </div>

        {/* RIGHT CARD: TEMPLATE WORKFLOW & FORMAT GUIDE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> How Template System Works
            </h3>

            <div className="space-y-1.5 text-[11px] text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-[9px]">1</span>
                <span>Select Target Country & Visa Type</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-[9px]">2</span>
                <span>Choose Sample Form / Cover Letter Format</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-[9px]">3</span>
                <span>Fill Dynamic Variable Tags ({`{APPLICANT_NAME}`})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-[9px]">4</span>
                <span>Download Editable DOCX or PDF Document</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search & Category Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredTemplates.length} of {templatesList.length} Document Templates
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search (Title, ID, Country)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="TMP-101, Cover Letter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* CATEGORY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Categories</option>
              {TEMPLATE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
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
              <option value="Global">Global / Universal</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Schengen / UK">Schengen / UK</option>
              <option value="UAE">UAE</option>
            </select>
          </div>

          {/* FORMAT */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              File Format
            </label>
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Formats</option>
              <option value="DOCX">Word (.docx)</option>
              <option value="PDF">PDF (.pdf)</option>
              <option value="TXT">Plain Text (.txt)</option>
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Deprecated">Deprecated</option>
            </select>
          </div>
        </div>
      </div>

      {/* DOCUMENT TEMPLATES DATA TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredTemplates.length && filteredTemplates.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 font-mono">Template ID</th>
                <th className="py-3.5 px-4">Template Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4 font-mono">Format & Size</th>
                <th className="py-3.5 px-4 font-mono">Downloads</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredTemplates.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <FileText size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No document templates found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredTemplates.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(t.id)}
                        onChange={() => handleToggleSelect(t.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {t.templateId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {t.title}
                      <span className="block text-[10px] font-normal text-slate-400">{t.description}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#2563EB]">
                      {t.category}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {t.country}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-purple-700 font-bold">
                      {t.fileFormat} ({t.fileSize})
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {t.downloadsCount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                        ðŸŸ¢ Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setActiveModalTemplate(t);
                            setModalTab("Overview");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Template Content & Variables"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleCopyTemplateText(t.templateBody)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Copy Body Text"
                        >
                          <Copy size={15} />
                        </button>
                        <button
                          onClick={() => triggerToast(`Downloading ${t.title}.${t.fileFormat.toLowerCase()}...`)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Download File Format"
                        >
                          <Download size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(t)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Template"
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
          <div>Showing 1â€“10 of 48 Document Templates</div>
          <div className="flex items-center gap-1 font-mono font-bold">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-40">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#2563EB] text-white rounded-lg">1</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">2</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CENTERED POPUP DETAILS / EDITOR MODAL */}
      {activeModalTemplate && (
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
                      {activeModalTemplate.title}
                    </h3>
                    <span className="font-mono text-xs font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700">
                      {activeModalTemplate.templateId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Category: {activeModalTemplate.category} &bull; Country: {activeModalTemplate.country}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalTemplate(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {RECOMMENDED_TEMPLATE_TABS.map((tab) => {
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
              {modalTab === "Overview" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Template ID</span>
                      <strong className="text-[#2563EB] font-mono font-bold">{activeModalTemplate.templateId}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">File Format</span>
                      <strong className="text-purple-700 font-bold">{activeModalTemplate.fileFormat} ({activeModalTemplate.fileSize})</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Total Downloads</span>
                      <strong className="text-slate-900 font-mono font-bold">{activeModalTemplate.downloadsCount}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Last Updated</span>
                      <strong className="text-slate-900 font-mono font-bold">{activeModalTemplate.lastUpdated}</strong>
                    </div>
                  </div>

                  {/* PLACEHOLDER TAGS */}
                  <div className="bg-blue-50/60 border border-blue-200 rounded-3xl p-4 space-y-2">
                    <h4 className="text-xs font-extrabold text-[#2563EB] uppercase tracking-wider font-outfit flex items-center gap-2">
                      <Tag size={15} /> Supported Dynamic Variables / Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeModalTemplate.placeholderFields.map((field, i) => (
                        <span key={i} className="px-2.5 py-1 bg-white border border-blue-300 text-blue-800 font-mono text-[11px] font-bold rounded-lg shadow-2xs">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* TEMPLATE BODY RENDER CANVAS */}
                  <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-3 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 font-outfit flex items-center gap-2">
                        <FileText size={16} className="text-blue-400" /> Template Body Draft
                      </h4>
                      <button
                        onClick={() => handleCopyTemplateText(activeModalTemplate.templateBody)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-extrabold text-blue-300 transition cursor-pointer flex items-center gap-1"
                      >
                        <Copy size={13} /> Copy Text
                      </button>
                    </div>

                    <pre className="bg-slate-950 p-4 rounded-2xl text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed border border-slate-800">
                      {activeModalTemplate.templateBody}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleCopyTemplateText(activeModalTemplate.templateBody)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Copy size={14} /> Copy Full Text
              </button>

              <button
                onClick={() => triggerToast(`Downloading ${activeModalTemplate.title}...`)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Download size={14} /> Download Sample Format ({activeModalTemplate.fileFormat})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW TEMPLATE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black font-outfit text-slate-900 flex items-center gap-2">
                <PlusCircle size={18} className="text-[#2563EB]" /> Add New Document Template
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Template Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Schengen Business Cover Letter Format"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
                  >
                    {TEMPLATE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Target Country
                  </label>
                  <select
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
                  >
                    <option value="Global">Global / Universal</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Schengen / UK">Schengen / UK</option>
                    <option value="UAE">UAE</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Format
                  </label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
                  >
                    <option value="DOCX">DOCX</option>
                    <option value="PDF">PDF</option>
                    <option value="TXT">TXT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Template Body Text (Use bracket tags like {"{APPLICANT_NAME}"})
                </label>
                <textarea
                  rows={6}
                  placeholder="Draft your document text template here..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs p-3 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={15} /> Save & Publish Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
