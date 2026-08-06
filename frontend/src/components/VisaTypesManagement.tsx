import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  PlusCircle,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit3,
  RefreshCw,
  X,
  Calendar
} from "lucide-react";
import { API_V1_URL } from "../config/api";

interface Category {
  _id: string;
  name: string;
}

interface VisaTypeRecord {
  _id: string;
  name: string;
  code: string;
  categoryId: string;
  categoryName: string;
  entryType: "Single Entry" | "Multiple Entry" | "Double Entry";
  validityMonths: number;
  maxStayDays: number;
  processingTimeDays: number;
  status: "Active" | "Inactive";
  createdAt: string;
}

export default function VisaTypesManagement() {
  const [types, setTypes] = useState<VisaTypeRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Toast message
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<VisaTypeRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    categoryId: "",
    entryType: "Multiple Entry" as "Single Entry" | "Multiple Entry" | "Double Entry",
    validityMonths: 6,
    maxStayDays: 90,
    processingTimeDays: 7,
    status: "Active" as "Active" | "Inactive"
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Visa Types & Categories from Backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const [typeRes, catRes] = await Promise.all([
        fetch(`${API_V1_URL}/visa/types`),
        fetch(`${API_V1_URL}/visa/categories`)
      ]);

      const typeJson = await typeRes.json();
      const catJson = await catRes.json();

      if (typeJson.success && Array.isArray(typeJson.data)) {
        setTypes(typeJson.data);
      }

      if (catJson.success && Array.isArray(catJson.data)) {
        setCategories(catJson.data);
      }
    } catch (err) {
      console.error("Failed to load visa types:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingType(null);
    setFormData({
      name: "",
      code: "",
      categoryId: categories[0]?._id || "",
      entryType: "Multiple Entry",
      validityMonths: 6,
      maxStayDays: 90,
      processingTimeDays: 7,
      status: "Active"
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (vt: VisaTypeRecord) => {
    setEditingType(vt);
    setFormData({
      name: vt.name,
      code: vt.code,
      categoryId: vt.categoryId,
      entryType: vt.entryType,
      validityMonths: vt.validityMonths,
      maxStayDays: vt.maxStayDays,
      processingTimeDays: vt.processingTimeDays,
      status: vt.status
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Validate Form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Visa Type Name is required.";
    if (!formData.code.trim()) errors.code = "Visa Type Code is required (e.g. VT-SCH-01).";
    if (!formData.categoryId) errors.categoryId = "Visa Category selection is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const selectedCat = categories.find((c) => c._id === formData.categoryId);

      const payload = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        categoryId: formData.categoryId,
        categoryName: selectedCat?.name || "Visa Category",
        entryType: formData.entryType,
        validityMonths: Number(formData.validityMonths),
        maxStayDays: Number(formData.maxStayDays),
        processingTimeDays: Number(formData.processingTimeDays),
        status: formData.status
      };

      const url = editingType
        ? `${API_V1_URL}/visa/types/${editingType._id}`
        : `${API_V1_URL}/visa/types`;

      const method = editingType ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        triggerToast(json.error?.message || "Failed to save visa type.");
      } else {
        triggerToast(editingType ? "Visa type updated!" : "New visa type created!");
        setIsAddModalOpen(false);
        fetchData();
      }
    } catch (err) {
      triggerToast("Error connecting to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Visa Type
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_V1_URL}/visa/types/${id}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (json.success) {
        triggerToast("Visa Type deleted successfully.");
        setDeleteConfirmId(null);
        fetchData();
      } else {
        triggerToast(json.error?.message || "Failed to delete visa type.");
      }
    } catch (err) {
      triggerToast("Failed to delete visa type.");
    }
  };

  // Filtered List
  const filtered = types.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || t.categoryName === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const activeCount = types.filter((t) => t.status === "Active").length;
  const inactiveCount = types.filter((t) => t.status === "Inactive").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom-3">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-indigo-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-200 font-mono tracking-wider uppercase mb-1">
            <FileText size={14} />
            <span>Visa Sub-classifications & Rules</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit">Visa Types</h1>
          <p className="text-xs text-indigo-100 mt-1 max-w-xl">
            Manage global visa classifications, entry types, validity rules, and max stay durations.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs px-4 py-3 rounded-2xl flex items-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer shrink-0"
        >
          <PlusCircle size={16} />
          <span>Add New Visa Type</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Visa Types</p>
            <h3 className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">{types.length}</h3>
            <span className="text-[10px] text-slate-500">Configured Classifications</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <FileText size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Active Types</p>
            <h3 className="text-2xl font-extrabold text-emerald-600 font-outfit mt-1">{activeCount}</h3>
            <span className="text-[10px] text-emerald-600 font-bold">Available in System</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Inactive Types</p>
            <h3 className="text-2xl font-extrabold text-amber-600 font-outfit mt-1">{inactiveCount}</h3>
            <span className="text-[10px] text-amber-600 font-bold">Disabled Types</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <XCircle size={20} />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchData}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 transition"
            title="Refresh list"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Visa Types Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <RefreshCw size={24} className="animate-spin mx-auto text-[#2563EB]" />
            <p className="text-xs font-semibold">Loading Visa Types from MongoDB...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <AlertCircle size={28} className="mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No Visa Types Found</p>
            <p className="text-xs text-slate-500">Try adjusting your filters or add a new visa type.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Visa Type Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Entry / Validity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filtered.map((vt) => (
                  <tr key={vt._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {vt.code}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      {vt.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-[#2563EB] text-[10px] font-bold rounded-md">
                        {vt.categoryName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800">{vt.entryType}</p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {vt.validityMonths} Months | Max {vt.maxStayDays} Days
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          vt.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {vt.status === "Active" ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                        {vt.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(vt)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-lg transition"
                          title="Edit Visa Type"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(vt._id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                          title="Delete Visa Type"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 font-outfit">
                {editingType ? "Edit Visa Type" : "Add New Visa Type"}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Visa Type Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Schengen Tourist (Multiple Entry)"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className={`w-full bg-slate-50 border text-slate-800 px-3 py-2.5 rounded-xl focus:outline-none ${
                    formErrors.name ? "border-red-500 bg-red-50/20" : "border-slate-200 focus:border-[#2563EB]"
                  }`}
                />
                {formErrors.name && <p className="text-[10px] text-red-600 font-bold mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Product Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. VT-SCH-01"
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className={`w-full bg-slate-50 border text-slate-800 font-mono font-bold px-3 py-2.5 rounded-xl focus:outline-none ${
                    formErrors.code ? "border-red-500 bg-red-50/20" : "border-slate-200 focus:border-[#2563EB]"
                  }`}
                />
                {formErrors.code && <p className="text-[10px] text-red-600 font-bold mt-1">{formErrors.code}</p>}
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Visa Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
                  className={`w-full bg-slate-50 border text-slate-800 px-3 py-2.5 rounded-xl focus:outline-none font-semibold ${
                    formErrors.categoryId ? "border-red-500 bg-red-50/20" : "border-slate-200 focus:border-[#2563EB]"
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {formErrors.categoryId && <p className="text-[10px] text-red-600 font-bold mt-1">{formErrors.categoryId}</p>}
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Entry Type
                </label>
                <select
                  value={formData.entryType}
                  onChange={(e) => setFormData((prev) => ({ ...prev, entryType: e.target.value as any }))}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                >
                  <option value="Single Entry">Single Entry</option>
                  <option value="Multiple Entry">Multiple Entry</option>
                  <option value="Double Entry">Double Entry</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Validity (Months)
                  </label>
                  <input
                    type="number"
                    value={formData.validityMonths}
                    onChange={(e) => setFormData((prev) => ({ ...prev, validityMonths: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Max Stay Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={formData.maxStayDays}
                    onChange={(e) => setFormData((prev) => ({ ...prev, maxStayDays: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as "Active" | "Inactive" }))}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB] font-bold"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20 transition flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <span>{editingType ? "Update Visa Type" : "Save Visa Type"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-outfit">Delete Visa Type?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this visa product from MongoDB? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
