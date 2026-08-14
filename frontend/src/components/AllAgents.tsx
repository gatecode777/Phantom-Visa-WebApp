import React, { useState, useEffect } from "react";
import { API_V1_URL } from "../config/api";
import { ALL_VISA_DESTINATION_COUNTRIES } from "./AddNewAgent";
import { COUNTRY_DIAL_CODES, getCountryByCodeOrName } from "../utils/countryData";
import {
  Briefcase,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  Lock,
  Unlock,
  Trash2,
  Calendar,
  Globe,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Download,
  Bell,
  CreditCard,
  ArrowUpRight,
  ShieldCheck,
  Star,
  Building,
  User,
  UserCheck,
  UserX,
  Layers,
  Award,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  X,
  MessageSquare,
  AlertCircle,
  Check,
  Save
} from "lucide-react";

export interface AgentRecord {
  id: string;
  name: string;
  avatar: string;
  agencyName: string;
  email: string;
  mobile: string;
  assignedApps: number;
  completedApps: number;
  activeCases: number;
  rating: number;
  status: "Active" | "Inactive" | "Pending Approval" | "Blocked";
  country: string;
  commissionRate?: string;
  flag: string;
  dob: string;
  gender: string;
  address: string;
  agencyRegNo: string;
  businessLicense: string;
  officeAddress: string;
  website: string;
  gstTaxNo: string;
  performance: {
    assigned: number;
    completed: number;
    pending: number;
    rejected: number;
    approvalRate: string;
    avgProcessingTime: string;
  };
  kyc: {
    identityProof: boolean;
    businessRegistration: boolean;
    officeAddressProof: boolean;
    bankDetails: boolean;
    taxCertificate: boolean;
    status: "Verified" | "Pending Audit" | "Rejected";
  };
  accountInfo: {
    regDate: string;
    lastLogin: string;
    emailVerified: boolean;
    mobileVerified: boolean;
  };
  recentActivities: {
    title: string;
    time: string;
  }[];
}

const mockAgents: AgentRecord[] = [
  {
    id: "AGT-1001",
    name: "Geeta Bisht",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    agencyName: "Global Visa Services",
    email: "geeta@gmail.com",
    mobile: "+91 9876543210",
    assignedApps: 52,
    completedApps: 45,
    activeCases: 7,
    rating: 4.9,
    status: "Active",
    country: "India",
    flag: "🇮🇳",
    dob: "14 May 1990",
    gender: "Female",
    address: "B-402, Connaught Place, New Delhi, India",
    agencyRegNo: "REG-IND-99120",
    businessLicense: "LIC-DEL-88912",
    officeAddress: "Suite 401, Global Tower, CP, New Delhi",
    website: "https://globalvisa.com",
    gstTaxNo: "07AAAAA0000A1Z5",
    performance: {
      assigned: 52,
      completed: 45,
      pending: 7,
      rejected: 0,
      approvalRate: "92%",
      avgProcessingTime: "4.2 Days"
    },
    kyc: {
      identityProof: true,
      businessRegistration: true,
      officeAddressProof: true,
      bankDetails: true,
      taxCertificate: true,
      status: "Verified"
    },
    accountInfo: {
      regDate: "12 Jan 2025",
      lastLogin: "10 mins ago",
      emailVerified: true,
      mobileVerified: true
    },
    recentActivities: [
      { title: "Logged in from Chrome (Windows)", time: "10 mins ago" },
      { title: "Reviewed Application APP-1025 for Tourist Visa", time: "1 hour ago" },
      { title: "Verified Documents for 3 new applicants", time: "Yesterday" },
      { title: "Updated Visa Status to Embassy Under Review", time: "2 days ago" },
      { title: "Sent Direct Notification to Geeta Bisht", time: "3 days ago" }
    ]
  },
  {
    id: "AGT-1002",
    name: "Rahul Sharma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
    agencyName: "Visa Experts Ltd",
    email: "rahul@gmail.com",
    mobile: "+91 9812345678",
    assignedApps: 34,
    completedApps: 30,
    activeCases: 4,
    rating: 4.8,
    status: "Active",
    country: "India",
    flag: "🇮🇳",
    dob: "22 Aug 1988",
    gender: "Male",
    address: "A-12, Sector 62, Noida, UP, India",
    agencyRegNo: "REG-UP-44512",
    businessLicense: "LIC-NOI-33219",
    officeAddress: "2nd Floor, Visa Plaza, Noida Sector 62",
    website: "https://visaexperts.in",
    gstTaxNo: "09BBBBB1111B2Y6",
    performance: {
      assigned: 34,
      completed: 30,
      pending: 4,
      rejected: 0,
      approvalRate: "88%",
      avgProcessingTime: "5.1 Days"
    },
    kyc: {
      identityProof: true,
      businessRegistration: true,
      officeAddressProof: true,
      bankDetails: true,
      taxCertificate: true,
      status: "Verified"
    },
    accountInfo: {
      regDate: "05 Feb 2025",
      lastLogin: "1 hour ago",
      emailVerified: true,
      mobileVerified: true
    },
    recentActivities: [
      { title: "Logged in from Safari (macOS)", time: "1 hour ago" },
      { title: "Uploaded Embassy Submission Slip", time: "3 hours ago" },
      { title: "Approved Student Visa Application", time: "1 day ago" }
    ]
  },
  {
    id: "AGT-1003",
    name: "Balram Suman",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
    agencyName: "World Travel Agency",
    email: "balram@gmail.com",
    mobile: "+91 9988776655",
    assignedApps: 21,
    completedApps: 18,
    activeCases: 3,
    rating: 4.6,
    status: "Pending Approval",
    country: "India",
    flag: "🇮🇳",
    dob: "10 Apr 1985",
    gender: "Male",
    address: "C-88, Malviya Nagar, Jaipur, Rajasthan",
    agencyRegNo: "REG-RAJ-88123",
    businessLicense: "LIC-JAI-11209",
    officeAddress: "G-10, Travel Hub, MI Road, Jaipur",
    website: "https://worldtravel.co.in",
    gstTaxNo: "08CCCCC2222C3X7",
    performance: {
      assigned: 21,
      completed: 18,
      pending: 3,
      rejected: 0,
      approvalRate: "85%",
      avgProcessingTime: "5.8 Days"
    },
    kyc: {
      identityProof: true,
      businessRegistration: true,
      officeAddressProof: false,
      bankDetails: true,
      taxCertificate: false,
      status: "Pending Audit"
    },
    accountInfo: {
      regDate: "20 Jul 2026",
      lastLogin: "2 hours ago",
      emailVerified: true,
      mobileVerified: false
    },
    recentActivities: [
      { title: "Agent Account Registered", time: "20 Jul 2026" },
      { title: "Uploaded Agency License Documents", time: "20 Jul 2026" }
    ]
  },
  {
    id: "AGT-1004",
    name: "Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256",
    agencyName: "Pacific Migration Partners",
    email: "sarah@pacificvisa.com",
    mobile: "+1 4155552671",
    assignedApps: 68,
    completedApps: 62,
    activeCases: 6,
    rating: 4.95,
    status: "Active",
    country: "USA",
    flag: "🇺🇸",
    dob: "18 Mar 1991",
    gender: "Female",
    address: "500 Market St, San Francisco, CA, USA",
    agencyRegNo: "REG-US-10293",
    businessLicense: "LIC-CA-99182",
    officeAddress: "Suite 1200, Financial District, SF",
    website: "https://pacificmigration.com",
    gstTaxNo: "US-EIN-9928120",
    performance: {
      assigned: 68,
      completed: 62,
      pending: 6,
      rejected: 0,
      approvalRate: "96%",
      avgProcessingTime: "3.5 Days"
    },
    kyc: {
      identityProof: true,
      businessRegistration: true,
      officeAddressProof: true,
      bankDetails: true,
      taxCertificate: true,
      status: "Verified"
    },
    accountInfo: {
      regDate: "10 Mar 2025",
      lastLogin: "30 mins ago",
      emailVerified: true,
      mobileVerified: true
    },
    recentActivities: [
      { title: "Logged in from Chrome (MacBook)", time: "30 mins ago" },
      { title: "Completed Express Entry PR Audit", time: "2 hours ago" }
    ]
  },
  {
    id: "AGT-1005",
    name: "David Chen",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
    agencyName: "Apex Immigrations",
    email: "david@apexvisa.ca",
    mobile: "+1 6045558912",
    assignedApps: 15,
    completedApps: 10,
    activeCases: 5,
    rating: 4.2,
    status: "Inactive",
    country: "Canada",
    flag: "🇨🇦",
    dob: "05 Nov 1986",
    gender: "Male",
    address: "700 W Georgia St, Vancouver, BC, Canada",
    agencyRegNo: "REG-CAN-88192",
    businessLicense: "LIC-BC-77281",
    officeAddress: "Pacific Centre, Vancouver",
    website: "https://apexvisa.ca",
    gstTaxNo: "CA-BN-8829102",
    performance: {
      assigned: 15,
      completed: 10,
      pending: 5,
      rejected: 0,
      approvalRate: "75%",
      avgProcessingTime: "7.1 Days"
    },
    kyc: {
      identityProof: true,
      businessRegistration: true,
      officeAddressProof: true,
      bankDetails: true,
      taxCertificate: false,
      status: "Verified"
    },
    accountInfo: {
      regDate: "15 Nov 2025",
      lastLogin: "15 days ago",
      emailVerified: true,
      mobileVerified: true
    },
    recentActivities: [
      { title: "Logged in from Chrome (Windows)", time: "15 days ago" }
    ]
  }
];

export default function AllAgents() {
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [performanceFilter, setPerformanceFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Selection States for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Selected Agent Detail Modal State
  const [viewAgent, setViewAgent] = useState<AgentRecord | null>(null);
  const [modalTab, setModalTab] = useState<
    | "personal"
    | "agency"
    | "performanceSummary"
    | "kyc"
    | "account"
    | "activity"
    | "performanceOverview"
    | "quickActions"
    | "bulkActions"
  >("personal");

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Dynamic Destination Countries Loaded directly from MongoDB Database API (/api/v1/countries)
  const [availableDbCountries, setAvailableDbCountries] = useState<{ name: string; flag: string; code?: string }[]>([]);
  const [isLoadingDbCountries, setIsLoadingDbCountries] = useState<boolean>(true);

  const renderCountryFlag = (flag?: string) => {
    if (!flag) return <span>🌐</span>;
    if (flag.startsWith("http://") || flag.startsWith("https://") || flag.startsWith("data:")) {
      return <img src={flag} alt="" className="w-4 h-3 object-cover rounded shrink-0 inline-block" />;
    }
    return <span>{flag}</span>;
  };

  useEffect(() => {
    fetchDatabaseCountries();
  }, []);

  const fetchDatabaseCountries = async () => {
    try {
      setIsLoadingDbCountries(true);
      const res = await fetch(`${API_V1_URL}/countries`);
      const json = await res.json();

      if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
        const activeDbCountries = json.data
          .filter(
            (c: any) =>
              c.status !== "Inactive" &&
              c.name &&
              !c.name.startsWith("http://") &&
              !c.name.startsWith("https://") &&
              !c.name.includes("imagekit")
          )
          .map((c: any) => ({
            name: c.name.trim(),
            flag: c.flag || "🌐",
            code: c.code || ""
          }));
        setAvailableDbCountries(activeDbCountries.length > 0 ? activeDbCountries : ALL_VISA_DESTINATION_COUNTRIES);
      } else {
        setAvailableDbCountries(ALL_VISA_DESTINATION_COUNTRIES);
      }
    } catch (err) {
      console.warn("Could not fetch database countries in AllAgents, using fallback list:", err);
      setAvailableDbCountries(ALL_VISA_DESTINATION_COUNTRIES);
    } finally {
      setIsLoadingDbCountries(false);
    }
  };

  // Agent List State (Loaded dynamically from MongoDB)
  const [agents, setAgents] = useState<AgentRecord[]>([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch(`${API_V1_URL}/agent/all`);
        const json = await res.json();
        if (res.ok && json.success && Array.isArray(json.data)) {
          const apiAgents: AgentRecord[] = json.data.map((item: any) => ({
            id: item.id || "AGT-1001",
            _id: item._id,
            name: item.name || item.fullName || "Travel Agent",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
            agencyName: item.agencyName || "Visa Agency",
            email: item.email || "agent@email.com",
            mobile: item.phone || "+91 9876543210",
            altPhone: item.altPhone || "",
            dob: item.dob || "",
            gender: item.gender || "",
            nationality: item.nationality || "",
            assignedApps: item.assignedApps || 0,
            completedApps: item.completedApps || 0,
            activeCases: item.activeCases || 0,
            rating: item.rating || 5.0,
            status: item.status || "Pending Approval",
            country: item.country || "India",
            city: item.city || item.officeCity || "New Delhi",
            state: item.state || "",
            postalCode: item.postalCode || "",
            officeAddress: item.officeAddress || `${item.city || 'New Delhi'}, ${item.country || 'India'}`,
            officeCity: item.officeCity || item.city || "",
            officeState: item.officeState || "",
            officeCountry: item.officeCountry || item.country || "India",
            officePostalCode: item.officePostalCode || "",
            agencyRegNo: item.agencyRegNo || "",
            businessLicense: item.businessLicense || "",
            gstTaxNo: item.gstTaxNo || "",
            website: item.website || "",
            yearsInBusiness: item.yearsInBusiness || "1 Year",
            supportedVisaCountries: Array.isArray(item.supportedVisaCountries) ? item.supportedVisaCountries : [],
            employeeCount: item.employeeCount || "10-50",
            monthlyCapacity: item.monthlyCapacity || 100,
            accountHolderName: item.accountHolderName || "",
            bankName: item.bankName || "",
            accountNumber: item.accountNumber || "",
            ifscSwiftCode: item.ifscSwiftCode || "",
            commissionRate: item.commission || `${item.commissionValue || 15}% (${item.commissionType || 'Percentage'})`,
            commissionValue: item.commissionValue || 15,
            commissionType: item.commissionType || "Percentage",
            adminNotes: item.adminNotes || "",
            registeredOn: item.registeredOn || "Recently",
            performanceLevel: "Good",
            agencyDetails: {
              licenseNo: item.businessLicense && item.businessLicense !== "N/A" ? item.businessLicense : "",
              taxRegNo: item.gstTaxNo && item.gstTaxNo !== "N/A" ? item.gstTaxNo : "",
              officeAddress: item.officeAddress || `${item.city || 'New Delhi'}, ${item.country || 'India'}`,
              businessType: "Authorized Visa Agency",
              yearsInOperation: item.yearsInBusiness || "1 Year",
              monthlyAppCapacity: Number(item.monthlyCapacity) || 100
            },
            kyc: {
              identityProof: true,
              businessRegistration: true,
              officeAddressProof: true,
              bankDetails: true,
              taxCertificate: true,
              status: "Verified"
            },
            accountInfo: {
              regDate: item.registeredOn || "Recently",
              lastLogin: "Just now",
              emailVerified: true,
              mobileVerified: true
            },
            recentActivities: [
              { title: "Account registered in MongoDB", time: "Recently" }
            ]
          }));
          setAgents(apiAgents);
        }
      } catch (err) {
        console.error("Failed to fetch live agents:", err);
      }
    };
    fetchAgents();
  }, []);

  // Filter Logic
  const filteredAgents = agents.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.mobile.includes(searchTerm);

    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    const matchesCountry = countryFilter === "All" || a.country === countryFilter;

    let matchesPerf = true;
    if (performanceFilter === "Excellent") matchesPerf = a.rating >= 4.8;
    else if (performanceFilter === "Good") matchesPerf = a.rating >= 4.5 && a.rating < 4.8;
    else if (performanceFilter === "Average") matchesPerf = a.rating >= 4.0 && a.rating < 4.5;
    else if (performanceFilter === "Low") matchesPerf = a.rating < 4.0;

    return matchesSearch && matchesStatus && matchesCountry && matchesPerf;
  });

  // Dynamic Pagination State & Math
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredAgents.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, countryFilter, performanceFilter, fromDate, toDate]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredAgents.length);
  const paginatedAgents = filteredAgents.slice(startIndex, endIndex);

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredAgents.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Block Modal State (Asking reason when blocking agent)
  const [blockingAgent, setBlockingAgent] = useState<AgentRecord | null>(null);
  const [blockReasonInput, setBlockReasonInput] = useState("");

  // Edit Modal State (Full Profile Edit with Validations & Country Dial Codes)
  const [editingAgent, setEditingAgent] = useState<AgentRecord | null>(null);
  const [editActiveTab, setEditActiveTab] = useState<"personal" | "agency" | "visas" | "bank" | "status">("personal");
  const [editCountrySearch, setEditCountrySearch] = useState("");
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const [editPhoneDialCode, setEditPhoneDialCode] = useState<string>("+91");
  const [editAltPhoneDialCode, setEditAltPhoneDialCode] = useState<string>("+91");

  const [editForm, setEditForm] = useState({
    name: "",
    agencyName: "",
    email: "",
    mobile: "",
    altPhone: "",
    city: "",
    country: "India",
    postalCode: "",
    officeAddress: "",
    businessLicense: "",
    gstTaxNo: "",
    website: "",
    employeeCount: "10-50",
    monthlyCapacity: "100",
    supportedVisaCountries: [] as string[],
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscSwiftCode: "",
    status: "Active",
    commissionType: "Percentage",
    commissionRate: "15",
    adminNotes: ""
  });

  const validateSinglePhoneField = (fieldName: "mobile" | "altPhone", val: string, dialCode: string) => {
    const selectedCountry = COUNTRY_DIAL_CODES.find((c) => c.dialCode === dialCode) || COUNTRY_DIAL_CODES[0];
    const raw = val.replace(/\D/g, "");

    if (!raw) {
      if (fieldName === "mobile") {
        return `Mobile number is required for ${selectedCountry.name}.`;
      }
      return "";
    }

    if (raw.length < selectedCountry.minPhoneDigits || raw.length > selectedCountry.maxPhoneDigits) {
      return `${selectedCountry.name} (${selectedCountry.dialCode}) phone number must be exactly ${selectedCountry.minPhoneDigits} digits (e.g. ${selectedCountry.examplePhone}).`;
    }

    if (selectedCountry.phoneRegex && !selectedCountry.phoneRegex.test(raw)) {
      return selectedCountry.phoneErrorMsg || `Invalid ${selectedCountry.name} phone number format.`;
    }

    return "";
  };

  const handleEditPhoneDialCodeChange = (newDialCode: string) => {
    setEditPhoneDialCode(newDialCode);
    const selectedCountry = COUNTRY_DIAL_CODES.find((c) => c.dialCode === newDialCode) || COUNTRY_DIAL_CODES[0];
    const truncated = editForm.mobile.replace(/\D/g, "").slice(0, selectedCountry.maxPhoneDigits);
    setEditForm((prev) => ({ ...prev, mobile: truncated }));
    const errMsg = validateSinglePhoneField("mobile", truncated, newDialCode);
    setEditErrors((prev) => ({ ...prev, mobile: errMsg }));
  };

  const handleEditAltPhoneDialCodeChange = (newDialCode: string) => {
    setEditAltPhoneDialCode(newDialCode);
    const selectedCountry = COUNTRY_DIAL_CODES.find((c) => c.dialCode === newDialCode) || COUNTRY_DIAL_CODES[0];
    const truncated = editForm.altPhone.replace(/\D/g, "").slice(0, selectedCountry.maxPhoneDigits);
    setEditForm((prev) => ({ ...prev, altPhone: truncated }));
    const errMsg = validateSinglePhoneField("altPhone", truncated, newDialCode);
    setEditErrors((prev) => ({ ...prev, altPhone: errMsg }));
  };

  const validateEditForm = (): { isValid: boolean; firstErrorTab: "personal" | "agency" | "visas" | "bank" | "status" | null; errors: Record<string, string> } => {
    const errs: Record<string, string> = {};
    let firstTab: "personal" | "agency" | "visas" | "bank" | "status" | null = null;

    // 1. Personal & Contact Tab
    if (!editForm.name.trim() || editForm.name.trim().length < 2) {
      errs.name = "Full name is required (minimum 2 letters).";
      if (!firstTab) firstTab = "personal";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editForm.email.trim() || !emailRegex.test(editForm.email.trim())) {
      errs.email = "Please enter a valid email address (e.g. agent@domain.com).";
      if (!firstTab) firstTab = "personal";
    }

    const mobileErr = validateSinglePhoneField("mobile", editForm.mobile, editPhoneDialCode);
    if (mobileErr) {
      errs.mobile = mobileErr;
      if (!firstTab) firstTab = "personal";
    }

    if (editForm.altPhone && editForm.altPhone.trim()) {
      const altErr = validateSinglePhoneField("altPhone", editForm.altPhone, editAltPhoneDialCode);
      if (altErr) {
        errs.altPhone = altErr;
        if (!firstTab) firstTab = "personal";
      }
    }

    // 2. Agency & Business Tab
    if (!editForm.agencyName.trim() || editForm.agencyName.trim().length < 2) {
      errs.agencyName = "Agency name is required (minimum 2 characters).";
      if (!firstTab) firstTab = "agency";
    }

    if (editForm.website && editForm.website.trim()) {
      const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;
      if (!urlRegex.test(editForm.website.trim())) {
        errs.website = "Please enter a valid website URL (e.g., https://agency.com).";
        if (!firstTab) firstTab = "agency";
      }
    }

    const capacityNum = Number(editForm.monthlyCapacity);
    if (isNaN(capacityNum) || capacityNum <= 0 || capacityNum > 50000) {
      errs.monthlyCapacity = "Monthly capacity must be a positive number between 1 and 50,000.";
      if (!firstTab) firstTab = "agency";
    }

    // 3. Visas Tab
    if (!editForm.supportedVisaCountries || editForm.supportedVisaCountries.length === 0) {
      errs.supportedVisaCountries = "Please select at least 1 supported visa country.";
      if (!firstTab) firstTab = "visas";
    }

    // 4. Bank & Financial Tab
    if (editForm.accountNumber && editForm.accountNumber.trim()) {
      const cleanAcc = editForm.accountNumber.replace(/[\s-]/g, "");
      if (!/^\d{8,20}$/.test(cleanAcc)) {
        errs.accountNumber = "Bank account number must be between 8 and 20 numeric digits.";
        if (!firstTab) firstTab = "bank";
      }
    }

    if (editForm.ifscSwiftCode && editForm.ifscSwiftCode.trim()) {
      const codeClean = editForm.ifscSwiftCode.trim();
      if (!/^[A-Za-z0-9]{4,11}$/.test(codeClean)) {
        errs.ifscSwiftCode = "IFSC/SWIFT code must be 4 to 11 alphanumeric characters (e.g., SBIN0001234).";
        if (!firstTab) firstTab = "bank";
      }
    }

    // 5. Commission & Status Tab
    const commVal = Number(editForm.commissionRate);
    if (isNaN(commVal) || commVal < 0) {
      errs.commissionRate = "Commission value must be a valid non-negative number.";
      if (!firstTab) firstTab = "status";
    } else if (editForm.commissionType === "Percentage" && commVal > 100) {
      errs.commissionRate = "Commission percentage cannot exceed 100%.";
      if (!firstTab) firstTab = "status";
    }

    return {
      isValid: Object.keys(errs).length === 0,
      firstErrorTab: firstTab,
      errors: errs
    };
  };

  const handleToggleEditVisaCountry = (countryName: string) => {
    setEditForm((prev) => {
      const current = prev.supportedVisaCountries || [];
      const updated = current.includes(countryName)
        ? current.filter((c) => c !== countryName)
        : [...current, countryName];
      return { ...prev, supportedVisaCountries: updated };
    });
    setEditErrors((prev) => ({ ...prev, supportedVisaCountries: "" }));
  };

  // Edit Agent modal opener & handler
  const openEditModal = (agent: any) => {
    setEditingAgent(agent);
    setEditActiveTab("personal");
    setEditCountrySearch("");
    setEditErrors({});

    // Parse mobile dial code & raw digits
    const rawMobFull = agent.mobile || "";
    let matchedDialCode = "+91";
    let cleanMobileDigits = rawMobFull.replace(/\D/g, "");

    for (const c of COUNTRY_DIAL_CODES) {
      const dialClean = c.dialCode.replace(/\D/g, "");
      if (rawMobFull.includes(c.dialCode) || cleanMobileDigits.startsWith(dialClean)) {
        matchedDialCode = c.dialCode;
        if (cleanMobileDigits.startsWith(dialClean)) {
          cleanMobileDigits = cleanMobileDigits.slice(dialClean.length);
        }
        break;
      }
    }

    const matchedCountryObj = COUNTRY_DIAL_CODES.find((c) => c.dialCode === matchedDialCode) || COUNTRY_DIAL_CODES[0];
    cleanMobileDigits = cleanMobileDigits.slice(0, matchedCountryObj.maxPhoneDigits);

    // Parse altPhone dial code & raw digits
    const rawAltFull = agent.altPhone || "";
    let matchedAltDialCode = matchedDialCode;
    let cleanAltDigits = rawAltFull.replace(/\D/g, "");

    for (const c of COUNTRY_DIAL_CODES) {
      const dialClean = c.dialCode.replace(/\D/g, "");
      if (rawAltFull.includes(c.dialCode) || (cleanAltDigits && cleanAltDigits.startsWith(dialClean))) {
        matchedAltDialCode = c.dialCode;
        if (cleanAltDigits.startsWith(dialClean)) {
          cleanAltDigits = cleanAltDigits.slice(dialClean.length);
        }
        break;
      }
    }

    setEditPhoneDialCode(matchedDialCode);
    setEditAltPhoneDialCode(matchedAltDialCode);

    setEditForm({
      name: agent.name || "",
      agencyName: agent.agencyName || "",
      email: agent.email || "",
      mobile: cleanMobileDigits,
      altPhone: cleanAltDigits,
      city: agent.city || "New Delhi",
      country: agent.country || "India",
      postalCode: agent.postalCode || "",
      officeAddress: (agent.officeAddress && agent.officeAddress !== "N/A" ? agent.officeAddress : agent.agencyDetails?.officeAddress && agent.agencyDetails?.officeAddress !== "N/A" ? agent.agencyDetails?.officeAddress : ""),
      businessLicense: (agent.businessLicense && agent.businessLicense !== "N/A" ? agent.businessLicense : agent.agencyDetails?.licenseNo && agent.agencyDetails?.licenseNo !== "N/A" ? agent.agencyDetails?.licenseNo : ""),
      gstTaxNo: (agent.gstTaxNo && agent.gstTaxNo !== "N/A" ? agent.gstTaxNo : agent.agencyDetails?.taxRegNo && agent.agencyDetails?.taxRegNo !== "N/A" ? agent.agencyDetails?.taxRegNo : ""),
      website: agent.website || "",
      employeeCount: agent.employeeCount || "10-50",
      monthlyCapacity: String(agent.agencyDetails?.monthlyAppCapacity || 100),
      supportedVisaCountries: Array.isArray(agent.supportedVisaCountries) ? agent.supportedVisaCountries : [],
      accountHolderName: agent.accountHolderName || "",
      bankName: agent.bankName || "",
      accountNumber: agent.accountNumber || "",
      ifscSwiftCode: agent.ifscSwiftCode || "",
      status: agent.status || "Active",
      commissionType: "Percentage",
      commissionRate: agent.commissionRate ? agent.commissionRate.replace(/[^\d.]/g, "") || "15" : "15",
      adminNotes: agent.adminNotes || ""
    });
  };

  const handleSaveEditAgent = async () => {
    if (!editingAgent) return;

    const validation = validateEditForm();
    if (!validation.isValid) {
      setEditErrors(validation.errors);
      if (validation.firstErrorTab) {
        setEditActiveTab(validation.firstErrorTab);
      }
      triggerToast("Please fix the highlighted validation errors before saving.");
      return;
    }

    setEditErrors({});

    const targetId = editingAgent.id;
    const newStatus = editForm.status as "Active" | "Inactive" | "Blocked" | "Pending Approval";
    const updatedName = editForm.name;

    const fullMobile = `${editPhoneDialCode} ${editForm.mobile}`;
    const fullAltPhone = editForm.altPhone ? `${editAltPhoneDialCode} ${editForm.altPhone}` : "";

    // Optimistic UI update & close modal
    setAgents((prev) =>
      prev.map((a) =>
        a.id === targetId
          ? {
              ...a,
              name: editForm.name,
              agencyName: editForm.agencyName,
              email: editForm.email,
              mobile: fullMobile,
              altPhone: fullAltPhone,
              city: editForm.city,
              country: editForm.country,
              status: newStatus,
              commissionRate: `${editForm.commissionRate}% (${editForm.commissionType})`,
              supportedVisaCountries: editForm.supportedVisaCountries,
              agencyDetails: {
                ...(a as any).agencyDetails,
                licenseNo: editForm.businessLicense,
                taxRegNo: editForm.gstTaxNo,
                officeAddress: editForm.officeAddress,
                monthlyAppCapacity: Number(editForm.monthlyCapacity) || 100
              }
            }
          : a
      )
    );

    if (viewAgent?.id === targetId) {
      setViewAgent((prev) =>
        prev
          ? {
              ...prev,
              name: editForm.name,
              agencyName: editForm.agencyName,
              email: editForm.email,
              mobile: fullMobile,
              status: newStatus,
              commissionRate: `${editForm.commissionRate}% (${editForm.commissionType})`,
              supportedVisaCountries: editForm.supportedVisaCountries
            }
          : null
      );
    }
    setEditingAgent(null);
    triggerToast(`Agent ${updatedName} profile updated successfully!`);

    try {
      await fetch(`${API_V1_URL}/agent/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: targetId,
          fullName: editForm.name,
          agencyName: editForm.agencyName,
          email: editForm.email,
          phone: fullMobile,
          altPhone: fullAltPhone,
          city: editForm.city,
          country: editForm.country,
          postalCode: editForm.postalCode,
          officeAddress: editForm.officeAddress,
          businessLicense: editForm.businessLicense,
          gstTaxNo: editForm.gstTaxNo,
          website: editForm.website,
          employeeCount: editForm.employeeCount,
          monthlyCapacity: editForm.monthlyCapacity,
          supportedVisaCountries: editForm.supportedVisaCountries,
          accountHolderName: editForm.accountHolderName,
          bankName: editForm.bankName,
          accountNumber: editForm.accountNumber,
          ifscSwiftCode: editForm.ifscSwiftCode,
          status: newStatus,
          commissionValue: editForm.commissionRate,
          commissionType: editForm.commissionType,
          adminNotes: editForm.adminNotes
        })
      });
    } catch (err) {
      console.warn("Backend edit update sync warning:", err);
    }
  };

  // Approve Agent live API call
  const handleApproveAgent = async (id: string) => {
    const target = agents.find((a) => a.id === id);

    // Optimistic UI state update
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Active" } : a))
    );
    if (viewAgent?.id === id) {
      setViewAgent((prev) => (prev ? { ...prev, status: "Active" } : null));
    }
    triggerToast(`Approved agent account for ${target?.name || id}`);

    try {
      await fetch(`${API_V1_URL}/agent/toggle-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: id, status: "Active" })
      });
    } catch (err) {
      console.warn("Backend status update sync warning:", err);
    }
  };

  // Open Block Modal or Re-activate
  const initiateBlockAgent = (agent: AgentRecord) => {
    if (agent.status === "Blocked") {
      handleApproveAgent(agent.id);
    } else {
      setBlockingAgent(agent);
      setBlockReasonInput("");
    }
  };

  // Submit Block Agent with Reason live API call
  const handleConfirmBlock = async () => {
    if (!blockingAgent) return;
    if (!blockReasonInput.trim()) {
      triggerToast("Please provide a reason for blocking this agent.");
      return;
    }

    const targetId = blockingAgent.id;
    const targetName = blockingAgent.name;
    const reason = blockReasonInput.trim();

    // Optimistic UI update & close modal
    setAgents((prev) =>
      prev.map((a) => (a.id === targetId ? { ...a, status: "Blocked" } : a))
    );
    if (viewAgent?.id === targetId) {
      setViewAgent((prev) => (prev ? { ...prev, status: "Blocked" } : null));
    }
    setBlockingAgent(null);
    setBlockReasonInput("");
    triggerToast(`Blocked agent ${targetName}. Reason: ${reason}`);

    try {
      await fetch(`${API_V1_URL}/agent/toggle-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: targetId,
          status: "Blocked",
          blockReason: reason
        })
      });
    } catch (err) {
      console.warn("Backend block sync warning:", err);
    }
  };

  // Delete Agent live API call
  const handleDeleteAgent = async (id: string) => {
    const target = agents.find((a) => a.id === id);
    if (!window.confirm(`Are you sure you want to permanently delete agent ${target?.name || id}?`)) {
      return;
    }

    // Optimistic UI update & close modal
    setAgents((prev) => prev.filter((a) => a.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    if (viewAgent?.id === id) setViewAgent(null);
    triggerToast(`Permanently deleted agent record for ${target?.name || id}`);

    try {
      await fetch(`${API_V1_URL}/agent/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: id })
      });
    } catch (err) {
      console.warn("Backend delete sync warning:", err);
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedIds.length === 0) {
      triggerToast("Please select at least one agent first.");
      return;
    }

    if (action === "block") {
      setAgents((prev) =>
        prev.map((a) => (selectedIds.includes(a.id) ? { ...a, status: "Blocked" } : a))
      );
      triggerToast(`Blocked ${selectedIds.length} selected agent(s).`);
    } else if (action === "delete") {
      setAgents((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
      setSelectedIds([]);
      triggerToast(`Deleted ${selectedIds.length} selected agent(s).`);
    } else {
      triggerToast(`Executed '${action}' for ${selectedIds.length} agent(s).`);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setCountryFilter("All");
    setPerformanceFilter("All");
    setFromDate("");
    setToDate("");
    triggerToast("Search & Filter inputs reset to default.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-800">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#0E1A2C] border border-[#2563EB]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-mono text-[#2563EB] mb-1">
          <Briefcase size={14} />
          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 font-bold">
            All Agents
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">All Agents</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Manage all registered agents, monitor their performance, assign applications, and manage account status.
        </p>
      </div>

      {/* TOP STATISTICS CARDS (4 CARDS GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Agents */}
        <div
          onClick={() => setStatusFilter("All")}
          className={`bg-white border rounded-2xl p-5 shadow-2xs hover:shadow-md transition group cursor-pointer ${statusFilter === "All" ? "border-[#2563EB] ring-2 ring-blue-200" : "border-slate-200"
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Agents</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Briefcase size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">{agents.length}</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-[#2563EB] font-semibold mt-2">
            <ArrowUpRight size={13} />
            <span>{statusFilter === "All" ? "Showing all agents ✓" : "Click for all agents"}</span>
          </div>
        </div>

        {/* Card 2: Active Agents — click to filter */}
        <div
          onClick={() => setStatusFilter(statusFilter === "Active" ? "All" : "Active")}
          className={`bg-white border rounded-2xl p-5 shadow-2xs hover:shadow-md transition group cursor-pointer ${statusFilter === "Active" ? "border-emerald-500 ring-2 ring-emerald-200" : "border-slate-200"
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Agents</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <UserCheck size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">{agents.filter((a) => a.status === "Active").length}</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-2">
            <ShieldCheck size={13} />
            <span>{statusFilter === "Active" ? "Showing active only ✓" : "Click to filter active"}</span>
          </div>
        </div>

        {/* Card 3: Inactive / Blocked Agents — click to filter */}
        <div
          onClick={() => setStatusFilter(statusFilter === "Inactive" ? "All" : "Inactive")}
          className={`bg-white border rounded-2xl p-5 shadow-2xs hover:shadow-md transition group cursor-pointer ${statusFilter === "Inactive" ? "border-slate-500 ring-2 ring-slate-200" : "border-slate-200"
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Inactive Agents</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <UserX size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">{agents.filter((a) => a.status === "Inactive" || a.status === "Blocked").length}</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold mt-2">
            <Clock size={13} />
            <span>{statusFilter === "Inactive" ? "Showing inactive only ✓" : "Click to filter inactive"}</span>
          </div>
        </div>

        {/* Card 4: Pending Approval — click to filter */}
        <div
          onClick={() => setStatusFilter(statusFilter === "Pending Approval" ? "All" : "Pending Approval")}
          className={`bg-white border rounded-2xl p-5 shadow-2xs hover:shadow-md transition group cursor-pointer ${statusFilter === "Pending Approval" ? "border-amber-500 ring-2 ring-amber-200" : "border-slate-200"
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Pending Approval</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Clock size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">{agents.filter((a) => a.status === "Pending Approval").length}</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-semibold mt-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>{statusFilter === "Pending Approval" ? "Showing pending only ✓" : "Click to filter pending"}</span>
          </div>
        </div>
      </div>

      {/* SEARCH & MULTI-CRITERIA FILTERS BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" />
            <span>Search & Filter Registered Agents</span>
          </h3>
          <button
            onClick={handleResetFilters}
            className="text-xs text-slate-500 hover:text-[#2563EB] font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <RefreshCw size={12} /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* Filter 1: Search By Keyword */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Search Keyword
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Agent ID, Name, Agency, Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Filter 2: Account Status */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Account Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Active">🟢 Active</option>
              <option value="Inactive">⚪ Inactive</option>
              <option value="Pending Approval">🟡 Pending Approval</option>
              <option value="Blocked">🔴 Blocked</option>
            </select>
          </div>

          {/* Filter 3: Country */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Country
            </label>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
            >
              <option value="All">All Countries</option>
              {(availableDbCountries.length > 0 ? availableDbCountries : ALL_VISA_DESTINATION_COUNTRIES).map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter 4: Performance Tier */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Performance Rating
            </label>
            <select
              value={performanceFilter}
              onChange={(e) => setPerformanceFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
            >
              <option value="All">All Tiers</option>
              <option value="Excellent">⭐ Excellent (4.8+)</option>
              <option value="Good">⭐ Good (4.5 - 4.7)</option>
              <option value="Average">⭐ Average (4.0 - 4.4)</option>
              <option value="Low">⭐ Low (&lt; 4.0)</option>
            </select>
          </div>

          {/* Filter 5: Registration Date Range */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              From Registration Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            onClick={() => triggerToast(`Filters applied: ${filteredAgents.length} agent(s) found`)}
            className="px-5 py-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-bold rounded-xl shadow-md shadow-[#2563EB]/20 transition cursor-pointer flex items-center gap-1.5"
          >
            <Filter size={14} /> Apply Filters
          </button>
        </div>
      </div>

      {/* CONTEXTUAL BULK ACTIONS TOOLBAR */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs text-[#2563EB] font-bold">
            <CheckCircle2 size={16} />
            <span>{selectedIds.length} Agent(s) Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => handleBulkAction("export")}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} /> Export Agent List
            </button>
            <button
              onClick={() => handleBulkAction("email")}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Mail size={14} /> Send Email
            </button>
            <button
              onClick={() => handleBulkAction("notification")}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Bell size={14} /> Send Notification
            </button>
            <button
              onClick={() => handleBulkAction("block")}
              className="px-3.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold rounded-lg border border-amber-300 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Lock size={14} /> Block Selected
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={14} /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* AGENTS TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length > 0 && selectedIds.length === filteredAgents.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Agent ID</th>
                <th className="py-3.5 px-4">Agent Name</th>
                <th className="py-3.5 px-4">Agency Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Mobile</th>
                <th className="py-3.5 px-4 text-center">Assigned Apps</th>
                <th className="py-3.5 px-4 text-center">Completed</th>
                <th className="py-3.5 px-4 text-center">Active Cases</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    <AlertCircle size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-bold">No agents match your search criteria.</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-2 text-xs text-[#2563EB] font-semibold underline cursor-pointer"
                    >
                      Clear search filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedAgents.map((agent) => (
                  <tr
                    key={agent.id}
                    className={`hover:bg-blue-50/40 transition-colors ${selectedIds.includes(agent.id) ? "bg-blue-50/60" : ""
                      }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(agent.id)}
                        onChange={() => handleToggleSelect(agent.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {agent.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <span className="font-extrabold text-slate-900">{agent.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-bold">{agent.agencyName}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">{agent.email}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">{agent.mobile}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-extrabold text-slate-800">
                      {agent.assignedApps}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-extrabold text-emerald-600">
                      {agent.completedApps}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold bg-blue-50 text-[#2563EB] border border-blue-200">
                        {agent.activeCases}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1 font-bold text-amber-600">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span>{agent.rating}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border inline-flex items-center gap-1.5 ${agent.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : agent.status === "Pending Approval"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : agent.status === "Blocked"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${agent.status === "Active"
                            ? "bg-emerald-500"
                            : agent.status === "Pending Approval"
                              ? "bg-amber-500 animate-ping"
                              : agent.status === "Blocked"
                                ? "bg-red-500"
                                : "bg-slate-400"
                            }`}
                        />
                        {agent.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setViewAgent(agent);
                            setModalTab("personal");
                          }}
                          title="View Details"
                          className="p-1.5 hover:bg-blue-100 text-slate-600 hover:text-[#2563EB] rounded-lg transition cursor-pointer"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => openEditModal(agent)}
                          title="Edit Agent Profile"
                          className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition cursor-pointer"
                        >
                          <Edit3 size={15} />
                        </button>
                        {agent.status === "Pending Approval" && (
                          <button
                            onClick={() => handleApproveAgent(agent.id)}
                            title="Approve Agent"
                            className="p-1.5 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 rounded-lg transition cursor-pointer"
                          >
                            <Check size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => initiateBlockAgent(agent)}
                          title={agent.status === "Blocked" ? "Activate Agent" : "Block Agent"}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${agent.status === "Blocked"
                            ? "hover:bg-emerald-100 text-emerald-600"
                            : "hover:bg-amber-100 text-amber-600"
                            }`}
                        >
                          {agent.status === "Blocked" ? <Unlock size={15} /> : <Lock size={15} />}
                        </button>
                        <button
                          onClick={() => handleDeleteAgent(agent.id)}
                          title="Delete Agent Record"
                          className="p-1.5 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition cursor-pointer"
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

        {/* DYNAMIC PAGINATION FOOTER */}
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900">{filteredAgents.length === 0 ? 0 : startIndex + 1}-{endIndex}</strong> of{" "}
            <strong className="text-slate-900">{filteredAgents.length} Registered Agents</strong>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-semibold transition"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg font-bold transition cursor-pointer ${currentPage === pageNum
                  ? "bg-[#2563EB] text-white"
                  : "border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold"
                  }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-semibold transition"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* AGENT DETAILS CENTERED VIEW MODAL (9 TABS / SECTIONS) */}
      {viewAgent && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewAgent(null);
          }}
          className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-slate-800">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-5 flex items-center justify-between border-b border-blue-700 shrink-0 rounded-t-3xl shadow-md">
              <div className="flex items-center gap-3.5">
                <img
                  src={viewAgent.avatar}
                  alt={viewAgent.name}
                  className="w-13 h-13 rounded-full object-cover border-2 border-white/90 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-black text-white font-outfit tracking-wide">
                      {viewAgent.name}
                    </h2>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-bold font-mono border ${viewAgent.status === "Active"
                        ? "bg-emerald-500/20 text-white border-white/30"
                        : viewAgent.status === "Pending Approval"
                          ? "bg-amber-500/30 text-white border-white/30"
                          : "bg-slate-500/30 text-white border-white/30"
                        }`}
                    >
                      {viewAgent.status}
                    </span>
                  </div>
                  <p className="text-xs text-blue-100 font-mono flex items-center gap-2 mt-1">
                    <span>{viewAgent.id}</span>
                    <span className="text-blue-300">•</span>
                    <span>{viewAgent.agencyName}</span>
                    <span className="text-blue-300">•</span>
                    <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-white font-sans font-semibold">
                      <span>{viewAgent.flag}</span> {viewAgent.country}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewAgent(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer border border-white/20"
              >
                <X size={18} />
              </button>
            </div>

            {/* 9 Section Navigation Tabs */}
            <div className="bg-[#EEF2FF] border-b-2 border-blue-200 px-4 flex items-center gap-1.5 overflow-x-auto shrink-0 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-blue-100 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full">
              {[
                { id: "personal", label: "Personal Info", icon: UserCheck },
                { id: "agency", label: "Agency Info", icon: Building },
                { id: "kyc", label: "KYC Verification", icon: ShieldCheck },
                { id: "account", label: "Account Info", icon: FileText },
                { id: "activity", label: "Recent Activities", icon: Clock },
                { id: "performanceOverview", label: "Performance Overview", icon: Award }
              ].map((tab) => {
                const IconComp = tab.icon;
                const isActive = modalTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setModalTab(tab.id as any)}
                    className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all duration-200 whitespace-nowrap cursor-pointer -mb-[2px] ${isActive
                      ? "bg-[#2563EB] text-white font-extrabold rounded-t-xl shadow-md border-[#2563EB]"
                      : "border-transparent text-slate-700 hover:text-[#2563EB] hover:bg-white/80"
                      }`}
                  >
                    <IconComp size={15} className={isActive ? "text-white" : "text-[#2563EB]/70"} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/90 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#F1F5F9] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* 1. PERSONAL INFORMATION TAB */}
              {modalTab === "personal" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <UserCheck size={16} className="text-[#2563EB]" />
                      <span>Personal Information</span>
                    </h3>
                    <span className="text-[10px] font-mono text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 font-bold">
                      Verified Agent Dossier
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Agent ID
                      </span>
                      <strong className="text-[#2563EB] font-mono text-sm font-extrabold">
                        {viewAgent.id}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Full Name
                      </span>
                      <strong className="text-slate-900 text-sm font-extrabold">
                        {viewAgent.name}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Date of Birth
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewAgent.dob}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Gender
                      </span>
                      <strong className="text-slate-800 font-bold">
                        {viewAgent.gender}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Email Address
                      </span>
                      <strong className="text-[#2563EB] font-mono font-bold">
                        {viewAgent.email}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Mobile Number
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewAgent.mobile}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Country
                      </span>
                      <strong className="text-slate-900 font-extrabold flex items-center gap-2">
                        <span>{viewAgent.flag}</span> {viewAgent.country}
                      </strong>
                    </div>

                    <div className="md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Address
                      </span>
                      <strong className="text-slate-800 font-semibold">
                        {viewAgent.address}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. AGENCY INFORMATION TAB */}
              {modalTab === "agency" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Building size={16} className="text-[#2563EB]" />
                      <span>Agency Information</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Agency Name
                      </span>
                      <strong className="text-slate-900 text-sm font-extrabold">
                        {viewAgent.agencyName}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Agency Registration Number
                      </span>
                      <strong className="text-[#2563EB] font-mono font-bold">
                        {viewAgent.agencyRegNo}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Business License Number
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewAgent.businessLicense}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        GST / Tax Number (Optional)
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewAgent.gstTaxNo}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Official Website
                      </span>
                      <a
                        href={viewAgent.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#2563EB] underline font-bold"
                      >
                        {viewAgent.website}
                      </a>
                    </div>

                    <div className="md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Office Address
                      </span>
                      <strong className="text-slate-800 font-semibold">
                        {viewAgent.officeAddress}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. KYC VERIFICATION TAB */}
              {modalTab === "kyc" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <ShieldCheck size={16} className="text-[#2563EB]" />
                      <span>KYC & Business Verification</span>
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
                      {viewAgent.kyc.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    {[
                      { label: "Identity Proof (Passport/National ID)", verified: viewAgent.kyc.identityProof },
                      { label: "Business Registration Certificate", verified: viewAgent.kyc.businessRegistration },
                      { label: "Office Address Proof", verified: viewAgent.kyc.officeAddressProof },
                      { label: "Bank Account Details", verified: viewAgent.kyc.bankDetails },
                      { label: "GST / Tax Certificate", verified: viewAgent.kyc.taxCertificate }
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border flex items-center justify-between font-bold ${item.verified
                          ? "bg-emerald-50/70 border-emerald-200 text-emerald-800"
                          : "bg-amber-50/70 border-amber-200 text-amber-800"
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          {item.verified ? (
                            <CheckCircle2 size={16} className="text-emerald-600" />
                          ) : (
                            <XCircle size={16} className="text-amber-600" />
                          )}
                          <span>{item.label}</span>
                        </span>
                        <span className="font-mono text-[11px] font-extrabold uppercase">
                          {item.verified ? "VERIFIED" : "PENDING"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. ACCOUNT INFORMATION TAB */}
              {modalTab === "account" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <FileText size={16} className="text-[#2563EB]" />
                      <span>Account Information</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Registration Date
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewAgent.accountInfo.regDate}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Last Login
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewAgent.accountInfo.lastLogin}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Account Status
                      </span>
                      <strong className="text-slate-900 font-bold">
                        {viewAgent.status}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Email & Mobile Verification
                      </span>
                      <div className="flex items-center gap-3 mt-1 font-bold text-[11px]">
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 size={13} /> Email Verified
                        </span>
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 size={13} /> Mobile Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. RECENT ACTIVITIES TAB */}
              {modalTab === "activity" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Clock size={16} className="text-[#2563EB]" />
                      <span>Recent Activities Log</span>
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {viewAgent.recentActivities.map((act, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
                          <span className="font-bold text-slate-800">{act.title}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. PERFORMANCE OVERVIEW TAB */}
              {modalTab === "performanceOverview" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Award size={16} className="text-[#2563EB]" />
                      <span>Detailed Performance Metrics</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Applications Assigned
                      </span>
                      <strong className="text-2xl font-black text-slate-900 font-mono">
                        {viewAgent.performance?.assigned ?? viewAgent.assignedApps ?? 0}
                      </strong>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block mb-1">
                        Completed
                      </span>
                      <strong className="text-2xl font-black text-emerald-700 font-mono">
                        {viewAgent.performance?.completed ?? viewAgent.completedApps ?? 0}
                      </strong>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block mb-1">
                        Pending
                      </span>
                      <strong className="text-2xl font-black text-amber-700 font-mono">
                        {viewAgent.performance?.pending ?? (viewAgent.assignedApps ? Math.max(0, viewAgent.assignedApps - (viewAgent.completedApps || 0)) : 0)}
                      </strong>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563EB] block mb-1">
                        Approval Rate
                      </span>
                      <strong className="text-2xl font-black text-[#2563EB] font-mono">
                        {viewAgent.performance?.approvalRate ?? "92.5%"}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Avg Processing Time
                      </span>
                      <strong className="text-2xl font-black text-slate-800 font-mono">
                        {viewAgent.performance?.avgProcessingTime ?? "4.5 Days"}
                      </strong>
                    </div>

                    <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block mb-1">
                        Customer Rating
                      </span>
                      <strong className="text-2xl font-black text-amber-600 font-mono flex items-center justify-center gap-1 mt-0.5">
                        <Star size={20} className="fill-amber-400 text-amber-400" />
                        <span>{(viewAgent as any).performance?.customerRating ?? (viewAgent.rating ? `${viewAgent.rating} / 5` : "4.8 / 5")}</span>
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BLOCK REASON MODAL */}
      {blockingAgent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-red-600 flex items-center gap-2 font-outfit">
                <AlertCircle size={18} />
                <span>Block Agent Account</span>
              </h3>
              <button
                onClick={() => setBlockingAgent(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              You are blocking <strong className="text-slate-900">{blockingAgent.name}</strong> ({blockingAgent.agencyName}). Please enter the reason for blocking this agent:
            </p>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Reason for Blocking <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Document falsification, repeated policy violations..."
                value={blockReasonInput}
                onChange={(e) => setBlockReasonInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs p-3 rounded-xl focus:outline-none focus:border-red-500 focus:bg-white transition"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setBlockingAgent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBlock}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <Lock size={14} /> Confirm Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL EDIT AGENT MODAL (ALL DETAILS EDIT VIEW) */}
      {editingAgent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 text-blue-400 flex items-center justify-center font-bold">
                  <Edit3 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold font-outfit text-white flex items-center gap-2">
                    <span>Edit Agent Profile</span>
                    <span className="text-xs font-mono font-normal bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md border border-blue-400/30">
                      {editingAgent.id}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Update personal, agency, supported visa countries, bank accounts, and status.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingAgent(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer border border-white/20"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="bg-[#EEF2FF] border-b-2 border-blue-200 px-4 flex items-center gap-1.5 overflow-x-auto shrink-0 [scrollbar-width:thin]">
              {[
                { id: "personal", label: "Personal & Contact", icon: User },
                { id: "agency", label: "Agency & Business", icon: Building },
                { id: "visas", label: "Supported Visas", icon: Globe },
                { id: "bank", label: "Bank & Financial", icon: CreditCard },
                { id: "status", label: "Commission & Status", icon: ShieldCheck }
              ].map((tab) => {
                const IconComp = tab.icon;
                const isActive = editActiveTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setEditActiveTab(tab.id as any)}
                    className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all duration-200 whitespace-nowrap cursor-pointer -mb-[2px] ${
                      isActive
                        ? "bg-[#2563EB] text-white font-extrabold rounded-t-xl shadow-md border-[#2563EB]"
                        : "border-transparent text-slate-700 hover:text-[#2563EB] hover:bg-white/80"
                    }`}
                  >
                    <IconComp size={15} className={isActive ? "text-white" : "text-[#2563EB]/70"} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Panel Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/70 space-y-4 text-xs [scrollbar-width:thin]">
              {/* TAB 1: PERSONAL & CONTACT */}
              {editActiveTab === "personal" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2 font-outfit">
                    <User size={15} className="text-[#2563EB]" /> Personal & Contact Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Agent Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Animesh Jain"
                        maxLength={60}
                        value={editForm.name}
                        onChange={(e) => {
                          const sanitized = e.target.value.replace(/[^a-zA-Z\s.-]/g, "").slice(0, 60);
                          setEditForm((prev) => ({ ...prev, name: sanitized }));
                          setEditErrors((prev) => ({ ...prev, name: "" }));
                        }}
                        className={`w-full bg-slate-50 border ${editErrors.name ? 'border-red-500 bg-red-50/40' : 'border-slate-200'} text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold`}
                      />
                      {editErrors.name && <span className="text-[10px] text-red-500 font-bold block mt-1">{editErrors.name}</span>}
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. agent@agency.com"
                        maxLength={100}
                        value={editForm.email}
                        onChange={(e) => {
                          setEditForm((prev) => ({ ...prev, email: e.target.value.slice(0, 100) }));
                          setEditErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        className={`w-full bg-slate-50 border ${editErrors.email ? 'border-red-500 bg-red-50/40' : 'border-slate-200'} text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold`}
                      />
                      {editErrors.email && <span className="text-[10px] text-red-500 font-bold block mt-1">{editErrors.email}</span>}
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Primary Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-1.5 items-center">
                        <select
                          value={editPhoneDialCode}
                          onChange={(e) => handleEditPhoneDialCodeChange(e.target.value)}
                          className="bg-slate-100 border border-slate-200 text-slate-800 text-xs px-2 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-bold cursor-pointer shrink-0"
                        >
                          {COUNTRY_DIAL_CODES.map((c) => (
                            <option key={`${c.code}-${c.dialCode}`} value={c.dialCode}>
                              {c.flag} {c.dialCode} ({c.code})
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder={COUNTRY_DIAL_CODES.find((c) => c.dialCode === editPhoneDialCode)?.examplePhone || "9876543210"}
                          maxLength={COUNTRY_DIAL_CODES.find((c) => c.dialCode === editPhoneDialCode)?.maxPhoneDigits || 15}
                          value={editForm.mobile}
                          onChange={(e) => {
                            const selectedC = COUNTRY_DIAL_CODES.find((c) => c.dialCode === editPhoneDialCode) || COUNTRY_DIAL_CODES[0];
                            const cleanDigits = e.target.value.replace(/\D/g, "").slice(0, selectedC.maxPhoneDigits);
                            setEditForm((prev) => ({ ...prev, mobile: cleanDigits }));
                            const errMsg = validateSinglePhoneField("mobile", cleanDigits, editPhoneDialCode);
                            setEditErrors((prev) => ({ ...prev, mobile: errMsg }));
                          }}
                          className={`w-full bg-slate-50 border ${editErrors.mobile ? 'border-red-500 bg-red-50/40' : 'border-slate-200'} text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold`}
                        />
                      </div>
                      {editErrors.mobile && <span className="text-[10px] text-red-500 font-bold block mt-1">{editErrors.mobile}</span>}
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Alternate Contact Number
                      </label>
                      <div className="flex gap-1.5 items-center">
                        <select
                          value={editAltPhoneDialCode}
                          onChange={(e) => handleEditAltPhoneDialCodeChange(e.target.value)}
                          className="bg-slate-100 border border-slate-200 text-slate-800 text-xs px-2 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-bold cursor-pointer shrink-0"
                        >
                          {COUNTRY_DIAL_CODES.map((c) => (
                            <option key={`${c.code}-alt-${c.dialCode}`} value={c.dialCode}>
                              {c.flag} {c.dialCode} ({c.code})
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder={COUNTRY_DIAL_CODES.find((c) => c.dialCode === editAltPhoneDialCode)?.examplePhone || "9876543210"}
                          maxLength={COUNTRY_DIAL_CODES.find((c) => c.dialCode === editAltPhoneDialCode)?.maxPhoneDigits || 15}
                          value={editForm.altPhone}
                          onChange={(e) => {
                            const selectedC = COUNTRY_DIAL_CODES.find((c) => c.dialCode === editAltPhoneDialCode) || COUNTRY_DIAL_CODES[0];
                            const cleanDigits = e.target.value.replace(/\D/g, "").slice(0, selectedC.maxPhoneDigits);
                            setEditForm((prev) => ({ ...prev, altPhone: cleanDigits }));
                            const errMsg = validateSinglePhoneField("altPhone", cleanDigits, editAltPhoneDialCode);
                            setEditErrors((prev) => ({ ...prev, altPhone: errMsg }));
                          }}
                          className={`w-full bg-slate-50 border ${editErrors.altPhone ? 'border-red-500 bg-red-50/40' : 'border-slate-200'} text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition`}
                        />
                      </div>
                      {editErrors.altPhone && <span className="text-[10px] text-red-500 font-bold block mt-1">{editErrors.altPhone}</span>}
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        maxLength={50}
                        value={editForm.city}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, city: e.target.value.slice(0, 50) }))}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        maxLength={50}
                        value={editForm.country}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, country: e.target.value.slice(0, 50) }))}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: AGENCY & BUSINESS */}
              {editActiveTab === "agency" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2 font-outfit">
                    <Building size={15} className="text-[#2563EB]" /> Agency & Registration Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Agency Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={100}
                        value={editForm.agencyName}
                        onChange={(e) => {
                          setEditForm((prev) => ({ ...prev, agencyName: e.target.value.slice(0, 100) }));
                          setEditErrors((prev) => ({ ...prev, agencyName: "" }));
                        }}
                        className={`w-full bg-slate-50 border ${editErrors.agencyName ? 'border-red-500 bg-red-50/40' : 'border-slate-200'} text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-bold`}
                      />
                      {editErrors.agencyName && <span className="text-[10px] text-red-500 font-bold block mt-1">{editErrors.agencyName}</span>}
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Business License / IATA No
                      </label>
                      <input
                        type="text"
                        maxLength={30}
                        value={editForm.businessLicense}
                        onChange={(e) => {
                          const sanitized = e.target.value.replace(/[^A-Z0-9-/]/gi, "").slice(0, 30);
                          setEditForm((prev) => ({ ...prev, businessLicense: sanitized }));
                        }}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        GST / Tax Registration No
                      </label>
                      <input
                        type="text"
                        maxLength={30}
                        value={editForm.gstTaxNo}
                        onChange={(e) => {
                          const sanitized = e.target.value.replace(/[^A-Z0-9]/gi, "").slice(0, 30);
                          setEditForm((prev) => ({ ...prev, gstTaxNo: sanitized }));
                        }}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Official Website URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://agency.com"
                        maxLength={150}
                        value={editForm.website}
                        onChange={(e) => {
                          setEditForm((prev) => ({ ...prev, website: e.target.value.slice(0, 150) }));
                          setEditErrors((prev) => ({ ...prev, website: "" }));
                        }}
                        className={`w-full bg-slate-50 border ${editErrors.website ? 'border-red-500 bg-red-50/40' : 'border-slate-200'} text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition`}
                      />
                      {editErrors.website && <span className="text-[10px] text-red-500 font-bold block mt-1">{editErrors.website}</span>}
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Monthly Application Capacity
                      </label>
                      <input
                        type="number"
                        max={50000}
                        value={editForm.monthlyCapacity}
                        onChange={(e) => {
                          const val = e.target.value.slice(0, 5);
                          setEditForm((prev) => ({ ...prev, monthlyCapacity: val }));
                          setEditErrors((prev) => ({ ...prev, monthlyCapacity: "" }));
                        }}
                        className={`w-full bg-slate-50 border ${editErrors.monthlyCapacity ? 'border-red-500 bg-red-50/40' : 'border-slate-200'} text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition`}
                      />
                      {editErrors.monthlyCapacity && <span className="text-[10px] text-red-500 font-bold block mt-1">{editErrors.monthlyCapacity}</span>}
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Office Full Address
                      </label>
                      <input
                        type="text"
                        maxLength={150}
                        value={editForm.officeAddress}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, officeAddress: e.target.value.slice(0, 150) }))}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SUPPORTED VISAS (MULTIPLE CHOICE) */}
              {editActiveTab === "visas" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2 font-outfit">
                        <Globe size={15} className="text-[#2563EB]" /> Supported Visa Countries
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Select all countries for which this agent processes visa applications.
                      </p>
                      {editErrors.supportedVisaCountries && (
                        <span className="text-[10px] text-red-500 font-bold block mt-1">{editErrors.supportedVisaCountries}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const dbList = availableDbCountries.length > 0 ? availableDbCountries : ALL_VISA_DESTINATION_COUNTRIES;
                          setEditForm((prev) => ({
                            ...prev,
                            supportedVisaCountries: dbList.slice(0, 10).map((c) => c.name)
                          }));
                          setEditErrors((prev) => ({ ...prev, supportedVisaCountries: "" }));
                        }}
                        className="px-2.5 py-1 text-[10px] font-bold bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-lg border border-blue-200 cursor-pointer"
                      >
                        Top 10 Popular
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const dbList = availableDbCountries.length > 0 ? availableDbCountries : ALL_VISA_DESTINATION_COUNTRIES;
                          setEditForm((prev) => ({
                            ...prev,
                            supportedVisaCountries: dbList.map((c) => c.name)
                          }));
                          setEditErrors((prev) => ({ ...prev, supportedVisaCountries: "" }));
                        }}
                        className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 cursor-pointer"
                      >
                        Select All ({(availableDbCountries.length > 0 ? availableDbCountries : ALL_VISA_DESTINATION_COUNTRIES).length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditForm((prev) => ({ ...prev, supportedVisaCountries: [] }))}
                        className="px-2 py-1 text-[10px] font-bold text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Search Bar & Selected Pill Badges */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search country name to filter..."
                        value={editCountrySearch}
                        onChange={(e) => setEditCountrySearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                      />
                    </div>

                    <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[38px] max-h-24 overflow-y-auto flex flex-wrap gap-1.5 items-center [scrollbar-width:thin]">
                      {(editForm.supportedVisaCountries || []).length === 0 ? (
                        <span className="text-[11px] text-slate-400 italic px-1">No countries selected yet. Click options below to choose.</span>
                      ) : (
                        (editForm.supportedVisaCountries || []).map((cName) => {
                          const dbList = availableDbCountries.length > 0 ? availableDbCountries : ALL_VISA_DESTINATION_COUNTRIES;
                          const cObj = dbList.find((c) => c.name === cName);
                          return (
                            <span
                              key={cName}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white border border-blue-200 text-[#2563EB] text-[11px] font-bold shadow-2xs"
                            >
                              {renderCountryFlag(cObj?.flag)}
                              <span>{cName}</span>
                              <button
                                type="button"
                                onClick={() => handleToggleEditVisaCountry(cName)}
                                className="text-slate-400 hover:text-red-600 transition cursor-pointer ml-0.5"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Countries Choice Grid */}
                  {isLoadingDbCountries ? (
                    <div className="p-6 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
                      <RefreshCw size={14} className="animate-spin text-[#2563EB]" />
                      <span>Loading active destination countries from database...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-52 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-white [scrollbar-width:thin]">
                      {(availableDbCountries.length > 0 ? availableDbCountries : ALL_VISA_DESTINATION_COUNTRIES)
                        .filter(
                          (c) =>
                            c.name &&
                            !c.name.startsWith("http://") &&
                            !c.name.startsWith("https://") &&
                            !c.name.includes("imagekit") &&
                            c.name.toLowerCase().includes(editCountrySearch.toLowerCase().trim())
                        )
                        .map((c) => {
                          const isChecked = (editForm.supportedVisaCountries || []).includes(c.name);
                          return (
                            <div
                              key={c.name}
                              onClick={() => handleToggleEditVisaCountry(c.name)}
                              className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center justify-between cursor-pointer select-none transition ${
                                isChecked
                                  ? "bg-blue-50 border-[#2563EB] text-[#2563EB] font-bold shadow-2xs"
                                  : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                {renderCountryFlag(c.flag)}
                                <span className="truncate">{c.name}</span>
                              </div>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="w-3.5 h-3.5 text-[#2563EB] accent-[#2563EB] rounded cursor-pointer shrink-0 ml-1"
                              />
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: BANK & FINANCIAL */}
              {editActiveTab === "bank" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2 font-outfit">
                    <CreditCard size={15} className="text-[#2563EB]" /> Settlement Bank Account Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        maxLength={60}
                        value={editForm.accountHolderName}
                        onChange={(e) => {
                          const sanitized = e.target.value.replace(/[^a-zA-Z\s.-]/g, "").slice(0, 60);
                          setEditForm((prev) => ({ ...prev, accountHolderName: sanitized }));
                        }}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        maxLength={60}
                        value={editForm.bankName}
                        onChange={(e) => {
                          const sanitized = e.target.value.replace(/[^a-zA-Z\s.-]/g, "").slice(0, 60);
                          setEditForm((prev) => ({ ...prev, bankName: sanitized }));
                        }}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Bank Account Number (Max 18 Digits)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 9876543210123"
                        maxLength={18}
                        value={editForm.accountNumber}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 18);
                          setEditForm((prev) => ({ ...prev, accountNumber: digitsOnly }));
                          setEditErrors((prev) => ({ ...prev, accountNumber: "" }));
                        }}
                        className={`w-full bg-slate-50 border ${editErrors.accountNumber ? 'border-red-500 bg-red-50/40' : 'border-slate-200'} text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-mono`}
                      />
                      {editErrors.accountNumber && <span className="text-[10px] text-red-500 font-bold block mt-1">{editErrors.accountNumber}</span>}
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        IFSC / SWIFT Code (Max 11 Characters)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. SBIN0001234"
                        maxLength={11}
                        value={editForm.ifscSwiftCode}
                        onChange={(e) => {
                          const alphaNumOnly = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11);
                          setEditForm((prev) => ({ ...prev, ifscSwiftCode: alphaNumOnly }));
                          setEditErrors((prev) => ({ ...prev, ifscSwiftCode: "" }));
                        }}
                        className={`w-full bg-slate-50 border ${editErrors.ifscSwiftCode ? 'border-red-500 bg-red-50/40' : 'border-slate-200'} text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-mono uppercase`}
                      />
                      {editErrors.ifscSwiftCode && <span className="text-[10px] text-red-500 font-bold block mt-1">{editErrors.ifscSwiftCode}</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: COMMISSION & STATUS */}
              {editActiveTab === "status" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2 font-outfit">
                    <ShieldCheck size={15} className="text-[#2563EB]" /> Commission & Account Status
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Account Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-bold"
                      >
                        <option value="Active">Active</option>
                        <option value="Pending Approval">Pending Approval</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Blocked">Blocked</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Commission Type
                      </label>
                      <select
                        value={editForm.commissionType}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, commissionType: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
                      >
                        <option value="Percentage">Percentage (%)</option>
                        <option value="Fixed Amount">Fixed Amount per Visa</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Commission Value ({editForm.commissionType === "Percentage" ? "%" : "₹"})
                      </label>
                      <input
                        type="number"
                        max={editForm.commissionType === "Percentage" ? 100 : 1000000}
                        value={editForm.commissionRate}
                        onChange={(e) => {
                          setEditForm((prev) => ({ ...prev, commissionRate: e.target.value }));
                          setEditErrors((prev) => ({ ...prev, commissionRate: "" }));
                        }}
                        className={`w-full bg-slate-50 border ${editErrors.commissionRate ? 'border-red-500 bg-red-50/40' : 'border-slate-200'} text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-bold`}
                      />
                      {editErrors.commissionRate && <span className="text-[10px] text-red-500 font-bold block mt-1">{editErrors.commissionRate}</span>}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Internal Admin Notes & Remarks
                    </label>
                    <textarea
                      rows={3}
                      maxLength={500}
                      placeholder="Add administrative notes regarding this agent..."
                      value={editForm.adminNotes}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, adminNotes: e.target.value.slice(0, 500) }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs p-3 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500 font-medium">
                Editing Agent: <strong className="text-slate-900">{editingAgent.name}</strong> ({editingAgent.agencyName})
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAgent(null)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditAgent}
                  className="px-5 py-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <Save size={15} />
                  <span>Save & Update Agent Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
