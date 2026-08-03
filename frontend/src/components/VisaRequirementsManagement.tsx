import React, { useState } from "react";
import {
  ClipboardList,
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
  Clock,
  Globe,
  FileText,
  Download,
  Check,
  X,
  CreditCard,
  Building,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  DollarSign,
  UserCheck,
  FileCheck,
  ListChecks
} from "lucide-react";

export interface VisaRequirementRecord {
  id: string;
  requirementId: string;
  requirementSetName: string;
  country: string;
  category: string;
  visaType: string;
  description: string;
  status: "Active" | "Inactive";
  processingTime: string;
  minProcessingDays: number;
  maxProcessingDays: number;
  expressProcessingAvailable: boolean;
  eligibleNationalities: string;
  requiredDocuments: string[];
  eligibility: {
    minAge: number;
    maxAge: number;
    minBankBalance: string;
    nationalityRestrictions: string;
    travelHistoryRequired: boolean;
    pastRejectionsRestricted: boolean;
    vaccinationRequired: boolean;
    criminalRecordEligibility: string;
  };
  financials: {
    minBankBalance: string;
    minMonthlyIncome: string;
    bankStatementPeriod: string;
    financialGuarantorAllowed: boolean;
    taxReturnRequired: boolean;
  };
  additionalReqs: {
    interviewRequired: boolean;
    biometricsRequired: boolean;
    tbTestRequired: boolean;
    originalPassportSubmission: boolean;
    yellowFeverVaccine: boolean;
    travelInsuranceCoverage: string;
    transitAccommodationProof: boolean;
  };
  fees: {
    visaFee: string;
    serviceCharge: string;
    additionalFees: string;
    tax: string;
  };
}

export const PREDEFINED_DOCUMENT_CHECKLIST = [
  "Passport",
  "Passport Photograph",
  "Visa Application Form",
  "Bank Statement",
  "Travel Insurance",
  "Flight Booking",
  "Hotel Booking",
  "Cover Letter",
  "Employment Letter",
  "Business Registration Certificate",
  "University Admission Letter",
  "Income Tax Return (ITR)",
  "Salary Slips (3 Months)",
  "Flight Reservation",
  "Invitation Letter",
  "Sponsor Guarantee",
  "Medical Certificate",
  "Relationship Proof for Family Visa",
  "Property Documents",
  "Sponsorship Letter",
  "Student ID Card",
  "Retirement Proof",
  "Police Clearance Certificate (PCC)",
  "No Objection Certificate (NOC)",
  "Marriage Certificate / Birth Certificate"
];

const MOCK_REQUIREMENTS: VisaRequirementRecord[] = [
  {
    id: "1",
    requirementId: "REQ-001",
    requirementSetName: "Canada Standard Tourist Requirement Set",
    country: "Canada",
    category: "Tourist Visa",
    visaType: "Tourist E-Visa",
    description: "Mandatory documentation checklist for Canadian visitor permits.",
    status: "Active",
    processingTime: "15 Days",
    minProcessingDays: 10,
    maxProcessingDays: 20,
    expressProcessingAvailable: true,
    eligibleNationalities: "All Eligible Countries",
    requiredDocuments: [
      "Passport",
      "Passport Photograph",
      "Visa Application Form",
      "Bank Statement",
      "Travel Insurance",
      "Flight Booking",
      "Hotel Booking"
    ],
    eligibility: {
      minAge: 18,
      maxAge: 75,
      minBankBalance: "₹2,50,000",
      nationalityRestrictions: "None",
      travelHistoryRequired: false,
      pastRejectionsRestricted: true,
      vaccinationRequired: false,
      criminalRecordEligibility: "Clean Record Required"
    },
    financials: {
      minBankBalance: "₹2,50,000",
      minMonthlyIncome: "₹50,000",
      bankStatementPeriod: "6 Months",
      financialGuarantorAllowed: true,
      taxReturnRequired: true
    },
    additionalReqs: {
      interviewRequired: false,
      biometricsRequired: true,
      tbTestRequired: false,
      originalPassportSubmission: true,
      yellowFeverVaccine: false,
      travelInsuranceCoverage: "$50,000 CAD",
      transitAccommodationProof: true
    },
    fees: {
      visaFee: "6,500",
      serviceCharge: "1,500",
      additionalFees: "500",
      tax: "18%"
    }
  },
  {
    id: "2",
    requirementId: "REQ-002",
    requirementSetName: "UK Standard Visitor Visa Requirement Set",
    country: "United Kingdom",
    category: "Tourist Visa",
    visaType: "UK Short Term",
    description: "Comprehensive documentation dossier for UK standard visitor visa.",
    status: "Active",
    processingTime: "10 Days",
    minProcessingDays: 7,
    maxProcessingDays: 15,
    expressProcessingAvailable: true,
    eligibleNationalities: "All Eligible Countries",
    requiredDocuments: [
      "Passport",
      "Passport Photograph",
      "Visa Application Form",
      "Bank Statement",
      "Travel Insurance",
      "Employment Letter",
      "Income Tax Return (ITR)",
      "Salary Slips (3 Months)"
    ],
    eligibility: {
      minAge: 18,
      maxAge: 70,
      minBankBalance: "₹3,50,000",
      nationalityRestrictions: "None",
      travelHistoryRequired: true,
      pastRejectionsRestricted: true,
      vaccinationRequired: false,
      criminalRecordEligibility: "No Prior Offenses"
    },
    financials: {
      minBankBalance: "₹3,50,000",
      minMonthlyIncome: "₹75,000",
      bankStatementPeriod: "6 Months",
      financialGuarantorAllowed: true,
      taxReturnRequired: true
    },
    additionalReqs: {
      interviewRequired: false,
      biometricsRequired: true,
      tbTestRequired: true,
      originalPassportSubmission: true,
      yellowFeverVaccine: false,
      travelInsuranceCoverage: "£50,000 GBP",
      transitAccommodationProof: true
    },
    fees: {
      visaFee: "10,000",
      serviceCharge: "2,000",
      additionalFees: "750",
      tax: "18%"
    }
  },
  {
    id: "3",
    requirementId: "REQ-003",
    requirementSetName: "US B1/B2 Business & Visitor Dossier",
    country: "United States",
    category: "Business Visa",
    visaType: "US B1/B2 Visitor",
    description: "Strict interview and documentation rules for US non-immigrant visas.",
    status: "Active",
    processingTime: "25 Days",
    minProcessingDays: 15,
    maxProcessingDays: 35,
    expressProcessingAvailable: false,
    eligibleNationalities: "Restricted List Applies",
    requiredDocuments: [
      "Passport",
      "Passport Photograph",
      "Visa Application Form",
      "Bank Statement",
      "Invitation Letter",
      "Employment Letter",
      "Income Tax Return (ITR)",
      "Property Documents",
      "Cover Letter"
    ],
    eligibility: {
      minAge: 21,
      maxAge: 65,
      minBankBalance: "₹5,00,000",
      nationalityRestrictions: "Sanctioned Nations Barred",
      travelHistoryRequired: true,
      pastRejectionsRestricted: true,
      vaccinationRequired: true,
      criminalRecordEligibility: "Mandatory Police Clearance"
    },
    financials: {
      minBankBalance: "₹5,00,000",
      minMonthlyIncome: "₹1,00,000",
      bankStatementPeriod: "6 Months",
      financialGuarantorAllowed: true,
      taxReturnRequired: true
    },
    additionalReqs: {
      interviewRequired: true,
      biometricsRequired: true,
      tbTestRequired: false,
      originalPassportSubmission: true,
      yellowFeverVaccine: false,
      travelInsuranceCoverage: "$100,000 USD",
      transitAccommodationProof: true
    },
    fees: {
      visaFee: "14,500",
      serviceCharge: "2,500",
      additionalFees: "1,000",
      tax: "18%"
    }
  },
  {
    id: "4",
    requirementId: "REQ-004",
    requirementSetName: "Australia Subclass 600 Tourist Set",
    country: "Australia",
    category: "Tourist Visa",
    visaType: "Australia Visitor",
    description: "Online stream document requirements for Australian subclass 600.",
    status: "Inactive",
    processingTime: "20 Days",
    minProcessingDays: 14,
    maxProcessingDays: 28,
    expressProcessingAvailable: true,
    eligibleNationalities: "Eligible Passport Holders",
    requiredDocuments: [
      "Passport",
      "Passport Photograph",
      "Visa Application Form",
      "Bank Statement",
      "Travel Insurance",
      "Hotel Booking"
    ],
    eligibility: {
      minAge: 18,
      maxAge: 75,
      minBankBalance: "₹3,00,000",
      nationalityRestrictions: "None",
      travelHistoryRequired: false,
      pastRejectionsRestricted: false,
      vaccinationRequired: false,
      criminalRecordEligibility: "Character Declaration Required"
    },
    financials: {
      minBankBalance: "₹3,00,000",
      minMonthlyIncome: "₹60,000",
      bankStatementPeriod: "6 Months",
      financialGuarantorAllowed: true,
      taxReturnRequired: true
    },
    additionalReqs: {
      interviewRequired: false,
      biometricsRequired: true,
      tbTestRequired: false,
      originalPassportSubmission: false,
      yellowFeverVaccine: false,
      travelInsuranceCoverage: "$50,000 AUD",
      transitAccommodationProof: true
    },
    fees: {
      visaFee: "9,200",
      serviceCharge: "1,800",
      additionalFees: "600",
      tax: "18%"
    }
  }
];

export default function VisaRequirementsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [visaTypeFilter, setVisaTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Records State
  const [requirements, setRequirements] = useState<VisaRequirementRecord[]>(MOCK_REQUIREMENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalReq, setActiveModalReq] = useState<VisaRequirementRecord | null>(null);
  const [modalTab, setModalTab] = useState<"general" | "docs" | "eligibility" | "financials" | "fees">("general");

  // Add / Edit Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReq, setEditingReq] = useState<VisaRequirementRecord | null>(null);

  const [formData, setFormData] = useState({
    requirementSetName: "",
    country: "Canada",
    category: "Tourist Visa",
    visaType: "Tourist E-Visa",
    description: "",
    status: "Active" as "Active" | "Inactive",
    processingTime: "15 Days",
    minProcessingDays: 10,
    maxProcessingDays: 20,
    expressProcessingAvailable: true,
    eligibleNationalities: "All Eligible Countries",
    selectedDocs: [
      "Passport",
      "Passport Photograph",
      "Visa Application Form",
      "Bank Statement",
      "Travel Insurance",
      "Flight Booking",
      "Hotel Booking"
    ],
    minAge: 18,
    maxAge: 75,
    minBankBalance: "₹2,50,000",
    nationalityRestrictions: "None",
    travelHistoryRequired: false,
    pastRejectionsRestricted: true,
    vaccinationRequired: false,
    criminalRecordEligibility: "Clean Record Required",
    minMonthlyIncome: "₹50,000",
    bankStatementPeriod: "6 Months",
    financialGuarantorAllowed: true,
    taxReturnRequired: true,
    interviewRequired: false,
    biometricsRequired: true,
    tbTestRequired: false,
    originalPassportSubmission: true,
    yellowFeverVaccine: false,
    travelInsuranceCoverage: "$50,000",
    transitAccommodationProof: true,
    visaFee: "6,500",
    serviceCharge: "1,500",
    additionalFees: "500",
    tax: "18%"
  });

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredRequirements = requirements.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      r.requirementSetName.toLowerCase().includes(q) ||
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
    if (selectedIds.length === filteredRequirements.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRequirements.map((r) => r.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handleToggleStatus = (record: VisaRequirementRecord) => {
    const newStatus = record.status === "Active" ? "Inactive" : "Active";
    setRequirements((prev) =>
      prev.map((r) => (r.id === record.id ? { ...r, status: newStatus } : r))
    );
    triggerToast(`Requirement ${record.requirementSetName} updated to ${newStatus}.`);
  };

  const handleDeleteRecord = (record: VisaRequirementRecord) => {
    setRequirements((prev) => prev.filter((r) => r.id !== record.id));
    triggerToast(`Requirement set ${record.requirementSetName} deleted.`);
    if (activeModalReq?.id === record.id) setActiveModalReq(null);
  };

  const handleBulkActivate = () => {
    setRequirements((prev) =>
      prev.map((r) => (selectedIds.includes(r.id) ? { ...r, status: "Active" } : r))
    );
    triggerToast(`${selectedIds.length} requirements activated.`);
    setSelectedIds([]);
  };

  const handleBulkDeactivate = () => {
    setRequirements((prev) =>
      prev.map((r) => (selectedIds.includes(r.id) ? { ...r, status: "Inactive" } : r))
    );
    triggerToast(`${selectedIds.length} requirements deactivated.`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    setRequirements((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    triggerToast(`${selectedIds.length} requirements deleted.`);
    setSelectedIds([]);
  };

  const openEditForm = (record: VisaRequirementRecord) => {
    setEditingReq(record);
    setFormData({
      requirementSetName: record.requirementSetName,
      country: record.country,
      category: record.category,
      visaType: record.visaType,
      description: record.description,
      status: record.status,
      processingTime: record.processingTime,
      minProcessingDays: record.minProcessingDays,
      maxProcessingDays: record.maxProcessingDays,
      expressProcessingAvailable: record.expressProcessingAvailable,
      eligibleNationalities: record.eligibleNationalities,
      selectedDocs: record.requiredDocuments,
      minAge: record.eligibility.minAge,
      maxAge: record.eligibility.maxAge,
      minBankBalance: record.eligibility.minBankBalance,
      nationalityRestrictions: record.eligibility.nationalityRestrictions,
      travelHistoryRequired: record.eligibility.travelHistoryRequired,
      pastRejectionsRestricted: record.eligibility.pastRejectionsRestricted,
      vaccinationRequired: record.eligibility.vaccinationRequired,
      criminalRecordEligibility: record.eligibility.criminalRecordEligibility,
      minMonthlyIncome: record.financials.minMonthlyIncome,
      bankStatementPeriod: record.financials.bankStatementPeriod,
      financialGuarantorAllowed: record.financials.financialGuarantorAllowed,
      taxReturnRequired: record.financials.taxReturnRequired,
      interviewRequired: record.additionalReqs.interviewRequired,
      biometricsRequired: record.additionalReqs.biometricsRequired,
      tbTestRequired: record.additionalReqs.tbTestRequired,
      originalPassportSubmission: record.additionalReqs.originalPassportSubmission,
      yellowFeverVaccine: record.additionalReqs.yellowFeverVaccine,
      travelInsuranceCoverage: record.additionalReqs.travelInsuranceCoverage,
      transitAccommodationProof: record.additionalReqs.transitAccommodationProof,
      visaFee: record.fees.visaFee,
      serviceCharge: record.fees.serviceCharge,
      additionalFees: record.fees.additionalFees,
      tax: record.fees.tax
    });
    setShowAddModal(true);
  };

  const handleSaveReq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.requirementSetName) {
      triggerToast("Please provide Requirement Set Name.");
      return;
    }

    if (editingReq) {
      setRequirements((prev) =>
        prev.map((r) =>
          r.id === editingReq.id
            ? {
                ...r,
                requirementSetName: formData.requirementSetName,
                country: formData.country,
                category: formData.category,
                visaType: formData.visaType,
                description: formData.description,
                status: formData.status,
                processingTime: formData.processingTime,
                minProcessingDays: formData.minProcessingDays,
                maxProcessingDays: formData.maxProcessingDays,
                expressProcessingAvailable: formData.expressProcessingAvailable,
                eligibleNationalities: formData.eligibleNationalities,
                requiredDocuments: formData.selectedDocs,
                eligibility: {
                  minAge: formData.minAge,
                  maxAge: formData.maxAge,
                  minBankBalance: formData.minBankBalance,
                  nationalityRestrictions: formData.nationalityRestrictions,
                  travelHistoryRequired: formData.travelHistoryRequired,
                  pastRejectionsRestricted: formData.pastRejectionsRestricted,
                  vaccinationRequired: formData.vaccinationRequired,
                  criminalRecordEligibility: formData.criminalRecordEligibility
                },
                financials: {
                  minBankBalance: formData.minBankBalance,
                  minMonthlyIncome: formData.minMonthlyIncome,
                  bankStatementPeriod: formData.bankStatementPeriod,
                  financialGuarantorAllowed: formData.financialGuarantorAllowed,
                  taxReturnRequired: formData.taxReturnRequired
                },
                additionalReqs: {
                  interviewRequired: formData.interviewRequired,
                  biometricsRequired: formData.biometricsRequired,
                  tbTestRequired: formData.tbTestRequired,
                  originalPassportSubmission: formData.originalPassportSubmission,
                  yellowFeverVaccine: formData.yellowFeverVaccine,
                  travelInsuranceCoverage: formData.travelInsuranceCoverage,
                  transitAccommodationProof: formData.transitAccommodationProof
                },
                fees: {
                  visaFee: formData.visaFee,
                  serviceCharge: formData.serviceCharge,
                  additionalFees: formData.additionalFees,
                  tax: formData.tax
                }
              }
            : r
        )
      );
      triggerToast(`Requirement set ${formData.requirementSetName} updated successfully.`);
    } else {
      const newRecord: VisaRequirementRecord = {
        id: Date.now().toString(),
        requirementId: `REQ-00${requirements.length + 1}`,
        requirementSetName: formData.requirementSetName,
        country: formData.country,
        category: formData.category,
        visaType: formData.visaType,
        description: formData.description,
        status: formData.status,
        processingTime: formData.processingTime,
        minProcessingDays: formData.minProcessingDays,
        maxProcessingDays: formData.maxProcessingDays,
        expressProcessingAvailable: formData.expressProcessingAvailable,
        eligibleNationalities: formData.eligibleNationalities,
        requiredDocuments: formData.selectedDocs,
        eligibility: {
          minAge: formData.minAge,
          maxAge: formData.maxAge,
          minBankBalance: formData.minBankBalance,
          nationalityRestrictions: formData.nationalityRestrictions,
          travelHistoryRequired: formData.travelHistoryRequired,
          pastRejectionsRestricted: formData.pastRejectionsRestricted,
          vaccinationRequired: formData.vaccinationRequired,
          criminalRecordEligibility: formData.criminalRecordEligibility
        },
        financials: {
          minBankBalance: formData.minBankBalance,
          minMonthlyIncome: formData.minMonthlyIncome,
          bankStatementPeriod: formData.bankStatementPeriod,
          financialGuarantorAllowed: formData.financialGuarantorAllowed,
          taxReturnRequired: formData.taxReturnRequired
        },
        additionalReqs: {
          interviewRequired: formData.interviewRequired,
          biometricsRequired: formData.biometricsRequired,
          tbTestRequired: formData.tbTestRequired,
          originalPassportSubmission: formData.originalPassportSubmission,
          yellowFeverVaccine: formData.yellowFeverVaccine,
          travelInsuranceCoverage: formData.travelInsuranceCoverage,
          transitAccommodationProof: formData.transitAccommodationProof
        },
        fees: {
          visaFee: formData.visaFee,
          serviceCharge: formData.serviceCharge,
          additionalFees: formData.additionalFees,
          tax: formData.tax
        }
      };
      setRequirements((prev) => [newRecord, ...prev]);
      triggerToast(`New Requirement Set ${formData.requirementSetName} created.`);
    }

    setShowAddModal(false);
    setEditingReq(null);
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
            <ClipboardList size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Checklist & Eligibility Rules Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Visa Requirements
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Configure and manage mandatory document checklists, eligibility criteria, and financial requirements for each country and visa type.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingReq(null);
              setFormData({
                requirementSetName: "",
                country: "Canada",
                category: "Tourist Visa",
                visaType: "Tourist E-Visa",
                description: "",
                status: "Active",
                processingTime: "15 Days",
                minProcessingDays: 10,
                maxProcessingDays: 20,
                expressProcessingAvailable: true,
                eligibleNationalities: "All Eligible Countries",
                selectedDocs: [
                  "Passport",
                  "Passport Photograph",
                  "Visa Application Form",
                  "Bank Statement",
                  "Travel Insurance",
                  "Flight Booking"
                ],
                minAge: 18,
                maxAge: 75,
                minBankBalance: "₹2,50,000",
                nationalityRestrictions: "None",
                travelHistoryRequired: false,
                pastRejectionsRestricted: true,
                vaccinationRequired: false,
                criminalRecordEligibility: "Clean Record Required",
                minMonthlyIncome: "₹50,000",
                bankStatementPeriod: "6 Months",
                financialGuarantorAllowed: true,
                taxReturnRequired: true,
                interviewRequired: false,
                biometricsRequired: true,
                tbTestRequired: false,
                originalPassportSubmission: true,
                yellowFeverVaccine: false,
                travelInsuranceCoverage: "$50,000",
                transitAccommodationProof: true,
                visaFee: "6,500",
                serviceCharge: "1,500",
                additionalFees: "500",
                tax: "18%"
              });
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-white text-[#2563EB] hover:bg-blue-50 text-xs font-black rounded-xl shadow-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle size={16} /> Add New Visa Requirement
          </button>
        </div>
      </div>

      {/* TOP STATISTICS CARDS & PREDEFINED CHECKLIST CATALOG */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 4 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
                Total Requirements Sets
              </span>
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                <ClipboardList size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">178</div>
            <span className="text-[11px] text-[#2563EB] font-semibold mt-1 inline-block">
              Country Rulesets Configured
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
                Mandatory Documents
              </span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <FileCheck size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">24</div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
              Global Standard Document Types
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
                Active Requirement Rules
              </span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">162</div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
              Live Validation Rules
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
                Pending Approval Rules
              </span>
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Clock size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">16</div>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 inline-block">
              Under Compliance Audit
            </span>
          </div>
        </div>

        {/* RIGHT CARD: PREDEFINED DOCUMENT CHECKLIST (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <ListChecks size={16} className="text-[#2563EB]" /> Predefined Document Checklist
            </h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-600 font-medium max-h-48 overflow-y-auto [scrollbar-width:thin]">
              {PREDEFINED_DOCUMENT_CHECKLIST.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="text-[#2563EB] font-bold">•</span>
                  <span className="truncate">{doc}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3 text-[10px] text-slate-400">
            Standardized VisaOS Document Verification Master List
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
            Showing {filteredRequirements.length} of {requirements.length} Requirements Sets
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH BY KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search By (Name, Country, Type)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Canada, Tourist, Set Name..."
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
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
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
              <option value="Work Visa">Work Visa</option>
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
              <option value="UK Short Term">UK Short Term</option>
              <option value="US B1/B2 Visitor">US B1/B2 Visitor</option>
              <option value="Australia Visitor">Australia Visitor</option>
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
            <span>Requirement Sets Selected</span>
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
              onClick={() => triggerToast(`Exporting rulesets for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Requirements
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

      {/* VISA REQUIREMENTS TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredRequirements.length && filteredRequirements.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Requirement ID</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4 text-center">Mandatory Docs</th>
                <th className="py-3.5 px-4">Visa Type</th>
                <th className="py-3.5 px-4">Eligible Nationalities</th>
                <th className="py-3.5 px-4 font-mono">Processing Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredRequirements.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <ClipboardList size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No visa requirements found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredRequirements.map((r) => (
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
                      {r.requirementId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {r.country}
                      <span className="block text-[10px] text-slate-400 font-normal">{r.requirementSetName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                      {r.requiredDocuments.length} Docs
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {r.visaType}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {r.eligibleNationalities}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {r.processingTime}
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
                            setActiveModalReq(r);
                            setModalTab("general");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => openEditForm(r)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          title="Edit Requirement Set"
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
                          title="Delete Requirement Set"
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
          <div>Showing 1–10 of 178 Requirements</div>
          <div className="flex items-center gap-1 font-mono font-bold">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-40">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#2563EB] text-white rounded-lg">1</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">2</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">3</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">4</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CENTERED POPUP DETAILS MODAL (5 TABS AS IN WIREFRAME) */}
      {activeModalReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                  <ClipboardList size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeModalReq.requirementSetName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700">
                      {activeModalReq.requirementId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{activeModalReq.country} &bull; {activeModalReq.category} ({activeModalReq.visaType})</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalReq(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {[
                { id: "general", label: "General Information", icon: ClipboardList },
                { id: "docs", label: "Required Documents", icon: FileText },
                { id: "eligibility", label: "Eligibility Rules", icon: ShieldCheck },
                { id: "financials", label: "Financial Requirements", icon: DollarSign },
                { id: "fees", label: "Processing & Fees", icon: CreditCard }
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
                    Requirements Definition Overview
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Country</span>
                      <strong className="text-slate-900 font-bold">{activeModalReq.country}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Category</span>
                      <strong className="text-[#2563EB] font-bold">{activeModalReq.category}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Type</span>
                      <strong className="text-slate-900 font-bold">{activeModalReq.visaType}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Processing Time</span>
                      <strong className="text-slate-900 font-mono">{activeModalReq.processingTime}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Status</span>
                      <strong className="text-emerald-600 font-bold">{activeModalReq.status}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: REQUIRED DOCUMENTS */}
              {modalTab === "docs" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Mandatory Document Checklist ({activeModalReq.requiredDocuments.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeModalReq.requiredDocuments.map((doc, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        <span className="font-bold text-slate-800">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ELIGIBILITY RULES */}
              {modalTab === "eligibility" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Applicant Eligibility Rules
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Age Limits</span>
                      <strong className="text-slate-900 font-mono">{activeModalReq.eligibility.minAge} to {activeModalReq.eligibility.maxAge} Years</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Nationality Eligibility</span>
                      <strong className="text-slate-900 font-bold">{activeModalReq.eligibleNationalities}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Min Bank Balance</span>
                      <strong className="text-emerald-700 font-mono font-bold">{activeModalReq.eligibility.minBankBalance}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Criminal Clearance</span>
                      <strong className="text-slate-900 font-bold">{activeModalReq.eligibility.criminalRecordEligibility}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: FINANCIAL REQUIREMENTS */}
              {modalTab === "financials" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Financial Proof Guidelines
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Min Bank Balance</span>
                      <strong className="text-emerald-700 font-mono font-bold text-sm">{activeModalReq.financials.minBankBalance}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Min Monthly Income</span>
                      <strong className="text-slate-900 font-mono font-bold text-xs">{activeModalReq.financials.minMonthlyIncome}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Statement Duration</span>
                      <strong className="text-slate-900 font-mono font-bold text-xs">{activeModalReq.financials.bankStatementPeriod}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Guarantor Allowed</span>
                      <strong className="text-[#2563EB] font-bold text-xs">{activeModalReq.financials.financialGuarantorAllowed ? "Yes" : "No"}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: PROCESSING & FEES */}
              {modalTab === "fees" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Fee Schedule Breakdown
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Visa Fee</span>
                      <strong className="text-slate-900 font-mono font-bold text-sm">₹{activeModalReq.fees.visaFee}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Service Charge</span>
                      <strong className="text-slate-900 font-mono font-bold text-sm">₹{activeModalReq.fees.serviceCharge}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Additional Fee</span>
                      <strong className="text-slate-900 font-mono font-bold text-sm">₹{activeModalReq.fees.additionalFees}</strong>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200">
                      <span className="text-[10px] text-[#2563EB] font-extrabold uppercase block">Tax</span>
                      <strong className="text-[#2563EB] font-mono font-black text-sm">{activeModalReq.fees.tax}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(activeModalReq)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  activeModalReq.status === "Active"
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                {activeModalReq.status === "Active" ? "Deactivate Requirement" : "Activate Requirement"}
              </button>

              <button
                onClick={() => openEditForm(activeModalReq)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 size={14} /> Edit Requirement Set
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT VISA REQUIREMENT FORM MODAL (EXACT WIREFRAME FORM) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-black font-outfit flex items-center gap-2">
                <ClipboardList size={18} />
                <span>{editingReq ? `Edit Requirement Set: ${editingReq.requirementSetName}` : "Add / Edit Visa Requirement"}</span>
              </h3>

              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingReq(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* MODAL FORM BODY */}
            <form onSubmit={handleSaveReq} className="p-6 overflow-y-auto flex-1 text-xs space-y-6 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE]">
              {/* SECTION 1: BASIC INFORMATION */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Requirement Set Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Canada Standard Tourist Set"
                      value={formData.requirementSetName}
                      onChange={(e) => setFormData({ ...formData, requirementSetName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

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

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="Mandatory documentation checklist..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: REQUIRED DOCUMENTS (CHECKBOXES - PREDEFINED CHECKLIST) */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Required Documents Checklist (Check All Mandatory Items)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 [scrollbar-width:thin]">
                  {PREDEFINED_DOCUMENT_CHECKLIST.map((doc) => {
                    const checked = formData.selectedDocs.includes(doc);
                    return (
                      <label
                        key={doc}
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
                                selectedDocs: formData.selectedDocs.filter((d) => d !== doc)
                              });
                            } else {
                              setFormData({
                                ...formData,
                                selectedDocs: [...formData.selectedDocs, doc]
                              });
                            }
                          }}
                          className="rounded border-slate-300 text-[#2563EB]"
                        />
                        <span className="truncate">{doc}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: APPLICANT ELIGIBILITY */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Applicant Eligibility Criteria
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Minimum Age
                    </label>
                    <input
                      type="number"
                      value={formData.minAge}
                      onChange={(e) => setFormData({ ...formData, minAge: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Maximum Age
                    </label>
                    <input
                      type="number"
                      value={formData.maxAge}
                      onChange={(e) => setFormData({ ...formData, maxAge: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Minimum Bank Balance (₹)
                    </label>
                    <input
                      type="text"
                      placeholder="₹2,50,000"
                      value={formData.minBankBalance}
                      onChange={(e) => setFormData({ ...formData, minBankBalance: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Nationality Restrictions
                    </label>
                    <input
                      type="text"
                      placeholder="None / Specific Countries"
                      value={formData.nationalityRestrictions}
                      onChange={(e) => setFormData({ ...formData, nationalityRestrictions: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: FINANCIAL REQUIREMENTS */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Financial Requirements
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Min Monthly Income (₹)
                    </label>
                    <input
                      type="text"
                      placeholder="₹50,000"
                      value={formData.minMonthlyIncome}
                      onChange={(e) => setFormData({ ...formData, minMonthlyIncome: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Bank Statement Duration
                    </label>
                    <input
                      type="text"
                      placeholder="6 Months"
                      value={formData.bankStatementPeriod}
                      onChange={(e) => setFormData({ ...formData, bankStatementPeriod: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Financial Guarantor Allowed
                    </label>
                    <select
                      value={formData.financialGuarantorAllowed ? "Yes" : "No"}
                      onChange={(e) => setFormData({ ...formData, financialGuarantorAllowed: e.target.value === "Yes" })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 5: ADDITIONAL REQUIREMENTS */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Additional Verification Requirements
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: "Interview Required", key: "interviewRequired" },
                    { label: "Biometrics Required", key: "biometricsRequired" },
                    { label: "TB Test Required", key: "tbTestRequired" },
                    { label: "Original Passport", key: "originalPassportSubmission" }
                  ].map((item) => {
                    const checked = (formData as any)[item.key];
                    return (
                      <label
                        key={item.key}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition text-xs font-semibold ${
                          checked
                            ? "bg-emerald-50/80 border-emerald-300 text-emerald-800"
                            : "bg-slate-50 border-slate-200 text-slate-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => setFormData({ ...formData, [item.key]: e.target.checked })}
                          className="rounded border-slate-300 text-emerald-600"
                        />
                        <span>{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 6: FEE DETAILS */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Fee Schedule
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Visa Fee (₹)
                    </label>
                    <input
                      type="text"
                      placeholder="6,500"
                      value={formData.visaFee}
                      onChange={(e) => setFormData({ ...formData, visaFee: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Service Charge (₹)
                    </label>
                    <input
                      type="text"
                      placeholder="1,500"
                      value={formData.serviceCharge}
                      onChange={(e) => setFormData({ ...formData, serviceCharge: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Additional Fees (₹)
                    </label>
                    <input
                      type="text"
                      placeholder="500"
                      value={formData.additionalFees}
                      onChange={(e) => setFormData({ ...formData, additionalFees: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Tax (₹ / %)
                    </label>
                    <input
                      type="text"
                      placeholder="18%"
                      value={formData.tax}
                      onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
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
                  {editingReq ? "Save Requirement Set" : "Create Requirement Set"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
