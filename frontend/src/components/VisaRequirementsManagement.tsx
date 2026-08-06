import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Search,
  PlusCircle,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit3,
  RefreshCw,
  X,
  FileText,
  CheckSquare,
  Square
} from "lucide-react";
import { API_V1_URL } from "../config/api";

interface VisaTypeOption {
  _id: string;
  name: string;
}

interface VisaRequirementRecord {
  _id: string;
  title: string;
  code: string;
  visaTypeId: string;
  visaTypeName: string;
  documentType: "PDF Document" | "Image Scan" | "Notarized Letter" | "Bank Statement";
  isMandatory: boolean;
  description: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

export default function VisaRequirementsManagement() {
  const [requirements, setRequirements] = useState<VisaRequirementRecord[]>([]);
  const [visaTypes, setVisaTypes] = useState<VisaTypeOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("All");

  // Toast message
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingReq, setEditingReq] = useState<VisaRequirementRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    visaTypeId: "",
    documentType: "PDF Document" as "PDF Document" | "Image Scan" | "Notarized Letter" | "Bank Statement",
    isMandatory: true,
    description: "",
    status: "Active" as "Active" | "Inactive"
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Requirements & Visa Types from Backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, typeRes] = await Promise.all([
        fetch(`${API_V1_URL}/visa/requirements`),
        fetch(`${API_V1_URL}/visa/types`)
      ]);

      const reqJson = await reqRes.json();
      const typeJson = await typeRes.json();

      if (reqJson.success && Array.isArray(reqJson.data)) {
        setRequirements(reqJson.data);
      }

      if (typeJson.success && Array.isArray(typeJson.data)) {
        setVisaTypes(typeJson.data);
      }
    } catch (err) {
      console.error("Failed to load visa requirements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingReq(null);
    setFormData({
      title: "",
      code: "",
      visaTypeId: visaTypes[0]?._id || "",
      documentType: "PDF Document",
      isMandatory: true,
      description: "",
      status: "Active"
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (req: VisaRequirementRecord) => {
    setEditingReq(req);
    setFormData({
      title: req.title,
      code: req.code,
      visaTypeId: req.visaTypeId,
      documentType: req.documentType,
      isMandatory: req.isMandatory,
      description: req.description || "",
      status: req.status
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Form Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = "Requirement title is required.";
    if (!formData.code.trim()) errors.code = "Requirement code is required (e.g. VR-REQ-PASSPORT).";
    if (!formData.visaTypeId) errors.visaTypeId = "Target Visa Type selection is required.";
    if (!formData.description.trim()) errors.description = "Document instructions description is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const selectedType = visaTypes.find((vt) => vt._id === formData.visaTypeId);

      const payload = {
        title: formData.title.trim(),
        code: formData.code.trim().toUpperCase(),
        visaTypeId: formData.visaTypeId,
        visaTypeName: selectedType?.name || "Visa Type",
        documentType: formData.documentType,
        isMandatory: formData.isMandatory,
        description: formData.description.trim(),
        status: formData.status
      };

      const url = editingReq
        ? `${API_V1_URL}/visa/requirements/${editingReq._id}`
        : `${API_V1_URL}/visa/requirements`;

      const method = editingReq ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        triggerToast(json.error?.message || "Failed to save requirement.");
      } else {
        triggerToast(editingReq ? "Visa requirement updated!" : "New visa requirement added!");
        setIsAddModalOpen(false);
        fetchData();
      }
    } catch (err) {
      triggerToast("Error communicating with server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Requirement
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_V1_URL}/visa/requirements/${id}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (json.success) {
        triggerToast("Visa requirement deleted successfully.");
        setDeleteConfirmId(null);
        fetchData();
      } else {
        triggerToast(json.error?.message || "Failed to delete requirement.");
      }
    } catch (err) {
      triggerToast("Failed to delete requirement.");
    }
  };

  // Filtered List
  const filtered = requirements.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.visaTypeName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "All" || r.visaTypeName === typeFilter;

    return matchesSearch && matchesType;
  });

  const mandatoryCount = requirements.filter((r) => r.isMandatory).length;
  const optionalCount = requirements.filter((r) => !r.isMandatory).length;

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
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-emerald-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-200 font-mono tracking-wider uppercase mb-1">
            <ShieldCheck size={14} />
            <span>Document Checklists & KYC Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit">Visa Requirements</h1>
          <p className="text-xs text-emerald-100 mt-1 max-w-xl">
            Define and manage mandatory document checklists, verification standards, and supporting guidelines per visa type.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-xs px-4 py-3 rounded-2xl flex items-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer shrink-0"
        >
          <PlusCircle size={16} />
          <span>Add New Requirement</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Requirements</p>
            <h3 className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">{requirements.length}</h3>
            <span className="text-[10px] text-slate-500">Configured Checklists</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Mandatory Rules</p>
            <h3 className="text-2xl font-extrabold text-red-600 font-outfit mt-1">{mandatoryCount}</h3>
            <span className="text-[10px] text-red-600 font-bold">Required for Approval</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <CheckSquare size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Optional Rules</p>
            <h3 className="text-2xl font-extrabold text-blue-600 font-outfit mt-1">{optionalCount}</h3>
            <span className="text-[10px] text-blue-600 font-bold">Supporting Documents</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Square size={20} />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search requirement title or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={fetchData}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 transition"
            title="Refresh list"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Requirements Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <RefreshCw size={24} className="animate-spin mx-auto text-teal-600" />
            <p className="text-xs font-semibold">Loading Visa Requirements from MongoDB...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <AlertCircle size={28} className="mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No Visa Requirements Found</p>
            <p className="text-xs text-slate-500">Add a new requirement checklist item.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Requirement Title</th>
                  <th className="py-3.5 px-4">Target Visa Type</th>
                  <th className="py-3.5 px-4">Doc Format</th>
                  <th className="py-3.5 px-4">Mandatory?</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filtered.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-700">
                      {req.code}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 max-w-xs">
                      {req.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md">
                        {req.visaTypeName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded-md flex items-center gap-1 w-fit">
                        <FileText size={10} className="text-slate-400" /> {req.documentType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {req.isMandatory ? (
                        <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold rounded-full">
                          Mandatory
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold rounded-full">
                          Optional
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          req.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {req.status === "Active" ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(req)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-lg transition"
                          title="Edit Requirement"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(req._id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                          title="Delete Requirement"
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
                {editingReq ? "Edit Visa Requirement" : "Add New Visa Requirement"}
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
                  Requirement Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Valid Original Passport (Min 6 months validity)"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className={`w-full bg-slate-50 border text-slate-800 px-3 py-2.5 rounded-xl focus:outline-none ${
                    formErrors.title ? "border-red-500 bg-red-50/20" : "border-slate-200 focus:border-[#2563EB]"
                  }`}
                />
                {formErrors.title && <p className="text-[10px] text-red-600 font-bold mt-1">{formErrors.title}</p>}
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Requirement Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. VR-REQ-PASSPORT"
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
                  Target Visa Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.visaTypeId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, visaTypeId: e.target.value }))}
                  className={`w-full bg-slate-50 border text-slate-800 px-3 py-2.5 rounded-xl focus:outline-none font-semibold ${
                    formErrors.visaTypeId ? "border-red-500 bg-red-50/20" : "border-slate-200 focus:border-[#2563EB]"
                  }`}
                >
                  <option value="">Select Target Visa Type</option>
                  {visaTypes.map((vt) => (
                    <option key={vt._id} value={vt._id}>
                      {vt.name}
                    </option>
                  ))}
                </select>
                {formErrors.visaTypeId && <p className="text-[10px] text-red-600 font-bold mt-1">{formErrors.visaTypeId}</p>}
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Accepted Document Format
                </label>
                <select
                  value={formData.documentType}
                  onChange={(e) => setFormData((prev) => ({ ...prev, documentType: e.target.value as any }))}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                >
                  <option value="PDF Document">PDF Document</option>
                  <option value="Image Scan">Image Scan</option>
                  <option value="Notarized Letter">Notarized Letter</option>
                  <option value="Bank Statement">Bank Statement</option>
                </select>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="isMandatory"
                  checked={formData.isMandatory}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isMandatory: e.target.checked }))}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="isMandatory" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Mark as Mandatory Document Checklist Item
                </label>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Instructions & Criteria Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter detailed document criteria..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className={`w-full bg-slate-50 border text-slate-800 px-3 py-2.5 rounded-xl focus:outline-none ${
                    formErrors.description ? "border-red-500 bg-red-50/20" : "border-slate-200 focus:border-[#2563EB]"
                  }`}
                />
                {formErrors.description && <p className="text-[10px] text-red-600 font-bold mt-1">{formErrors.description}</p>}
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
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-500/20 transition flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <span>{editingReq ? "Update Requirement" : "Save Requirement"}</span>
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
              <h3 className="text-base font-extrabold text-slate-900 font-outfit">Delete Visa Requirement?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this checklist item from MongoDB? This action cannot be undone.
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
