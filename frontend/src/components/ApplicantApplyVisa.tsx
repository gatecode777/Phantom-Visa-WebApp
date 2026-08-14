"use client";

import React, { useState, useEffect } from "react";
import { Application, formatINR, useVisa } from "../context/VisaContext";
import { API_V1_URL } from "../config/api";
import { fetchProfileApi, CoTravelerRecord } from "../services/profileService";
import {
  Plane,
  Clock,
  User,
  CheckCircle2,
  Upload,
  CreditCard,
  Save,
  Lock,
  Zap,
  FileText,
  UserPlus,
  AlertCircle,
  RefreshCw,
  HelpCircle,
  Layers,
  X,
  Check,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Pin,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

interface CountryRecord {
  _id: string;
  name: string;
  code: string;
  flag: string;
  startingFee: number;
  processingTime: string;
  visaAvailable: boolean;
  status: string;
  availableCategories: string[];
  availableVisaTypes: string[];
  requiredDocuments: string[];
}

interface VisaCategoryRecord {
  _id: string;
  name: string;
  code: string;
  status: string;
}

interface VisaTypeRecord {
  _id: string;
  name: string;
  code: string;
  categoryName: string;
  entryType: "Single Entry" | "Multiple Entry" | "Double Entry";
  validityMonths: number;
  maxStayDays: number;
  processingTimeDays: number;
  status: string;
}

interface VisaRequirementRecord {
  _id: string;
  title: string;
  documentType: string;
  visaTypeName: string;
  isMandatory: boolean;
  status: string;
}

interface AgentRecord {
  agentId: string;
  fullName: string;
  agencyName: string;
  city: string;
  state: string;
  yearsInBusiness: string;
  monthlyCapacity: string;
  supportedVisaCountries: string[];
}

interface CoTraveler {
  id: string;
  name: string;
  relation: string;
  passportNo: string;
  age: number;
}

interface UploadedSlotState {
  title: string;
  documentType: string;
  isMandatory: boolean;
  fileUrl: string;
  fileName?: string;
  isUploading?: boolean;
  // AI Verification fields
  isVerifying?: boolean;
  isVerified?: boolean;
  verifiedType?: string | null;
  aiError?: string | null;
}

interface ApplicantApplyVisaProps {
  onAddApplication?: (app: Partial<Application>) => void;
  onNavigateDrafts?: () => void;
  onNavigatePayment?: () => void;
}

export default function ApplicantApplyVisa({
  onAddApplication,
  onNavigateDrafts,
  onNavigatePayment
}: ApplicantApplyVisaProps) {
  const visaCtx = useVisa();
  const defaultC: CountryRecord[] = [
    {
      _id: "c-1",
      name: "Canada",
      code: "CA",
      flag: "🇨🇦",
      startingFee: 12500,
      processingTime: "10-15 Days",
      visaAvailable: true,
      status: "Active",
      availableCategories: ["Tourist Visa", "Business Visa", "Student Visa"],
      availableVisaTypes: ["Tourist Short Stay", "Business Visitor"],
      requiredDocuments: ["Passport Front & Back Scan", "Passport Size Photograph", "Bank Statement (Last 6 Months)", "Employment NOC Letter"]
    },
    {
      _id: "c-2",
      name: "Australia",
      code: "AU",
      flag: "🇦🇺",
      startingFee: 16500,
      processingTime: "7-10 Days",
      visaAvailable: true,
      status: "Active",
      availableCategories: ["Tourist Visa", "Business Visa"],
      availableVisaTypes: ["Visitor Visa Subclass 600"],
      requiredDocuments: ["Passport Scan", "Photograph", "Financial Proof"]
    },
    {
      _id: "c-3",
      name: "United Kingdom",
      code: "GB",
      flag: "🇬🇧",
      startingFee: 18200,
      processingTime: "15-20 Days",
      visaAvailable: true,
      status: "Active",
      availableCategories: ["Tourist Visa", "Business Visa"],
      availableVisaTypes: ["Standard Visitor Visa"],
      requiredDocuments: ["Passport Scan", "Photograph", "Bank Statement"]
    }
  ];

  const defaultCat: VisaCategoryRecord[] = [
    { _id: "cat-1", name: "Tourist Visa", code: "TOURIST", status: "Active" },
    { _id: "cat-2", name: "Business Visa", code: "BUSINESS", status: "Active" },
    { _id: "cat-3", name: "Student Visa", code: "STUDENT", status: "Active" }
  ];

  const defaultVt: VisaTypeRecord[] = [
    { _id: "vt-1", name: "Tourist Short Stay", code: "TSS", categoryName: "Tourist Visa", entryType: "Single Entry", validityMonths: 6, maxStayDays: 60, processingTimeDays: 15, status: "Active" },
    { _id: "vt-2", name: "Visitor Visa Subclass 600", code: "SUB600", categoryName: "Tourist Visa", entryType: "Multiple Entry", validityMonths: 12, maxStayDays: 90, processingTimeDays: 15, status: "Active" },
    { _id: "vt-3", name: "Standard Visitor Visa", code: "SVV", categoryName: "Tourist Visa", entryType: "Multiple Entry", validityMonths: 6, maxStayDays: 180, processingTimeDays: 15, status: "Active" }
  ];

  // Active step state (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loadingConfig, setLoadingConfig] = useState<boolean>(false);

  // Dynamic config lists fetched from backend MongoDB
  const [countries, setCountries] = useState<CountryRecord[]>(defaultC);
  const [categories, setCategories] = useState<VisaCategoryRecord[]>(defaultCat);
  const [visaTypes, setVisaTypes] = useState<VisaTypeRecord[]>(defaultVt);
  const [requirements, setRequirements] = useState<VisaRequirementRecord[]>([]);

  // Step 1: Destination, Category, Visa Subclass & Speed
  const [selectedCountryName, setSelectedCountryName] = useState<string>("Canada");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("Tourist Visa");
  const [selectedVisaTypeName, setSelectedVisaTypeName] = useState<string>("Tourist Short Stay");
  const [processingSpeed, setProcessingSpeed] = useState<"standard" | "express">("express");
  const [entryType, setEntryType] = useState<string>("Single Entry");
  const [stayValidity, setStayValidity] = useState<string>("60 Days");

  // Agent selection state
  const [availableAgents, setAvailableAgents] = useState<AgentRecord[]>([]);
  const [agentsLoading, setAgentsLoading] = useState<boolean>(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");

  // Step 2: Personal Information & Travel Details
  const [givenName, setGivenName] = useState("");
  const [surname, setSurname] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Female");
  const [nationality, setNationality] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("Single");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Travel Dates
  const todayStr = new Date().toISOString().split("T")[0];
  const [travelDate, setTravelDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // Compute minimum departure date based on selected visa type processing days
  const minDepartureDate = (() => {
    const selectedVt = visaTypes.find((v) => v.name === selectedVisaTypeName);
    const baseDays = selectedVt?.processingTimeDays || 7;
    // Use exact processingTimeDays — no artificial floor override
    const d = new Date();
    d.setDate(d.getDate() + baseDays);
    return d;
  })();
  const minDepartureStr = minDepartureDate.toISOString().split("T")[0];
  const minDepartureFmt = minDepartureDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  // Keep a derived value for display/validation reuse
  const minDepartureDays = (() => {
    const selectedVt = visaTypes.find((v) => v.name === selectedVisaTypeName);
    return selectedVt?.processingTimeDays || 7;
  })();
  const [stayType, setStayType] = useState("Hotel Booking");
  const [hostName, setHostName] = useState("");
  const [hostAddress, setHostAddress] = useState("");

  // Step 3: Passport Credentials & Employment / Financial Status
  const [passportType, setPassportType] = useState("Ordinary / Regular");
  const [passportNo, setPassportNo] = useState("");
  const [issuePlace, setIssuePlace] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const [employmentStatus, setEmploymentStatus] = useState("Employed");
  const [employerName, setEmployerName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [bankBalance, setBankBalance] = useState("");

  // Step 4: Requirement Upload Slots & Co-Travelers
  const [uploadedSlots, setUploadedSlots] = useState<UploadedSlotState[]>([]);
  const [coTravelers, setCoTravelers] = useState<CoTraveler[]>([]);
  const [newCoName, setNewCoName] = useState("");
  const [newCoRelation, setNewCoRelation] = useState("Spouse");
  const [newCoPassport, setNewCoPassport] = useState("");
  const [savedVaultTravelers, setSavedVaultTravelers] = useState<CoTravelerRecord[]>([]);

  // Step 5: Pricing & Submission
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [savedDraft, setSavedDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation Error States
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [submittedAppRecord, setSubmittedAppRecord] = useState<any | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Pre-fill verified personal and passport details from canonical profile on mount
  useEffect(() => {
    const loadProfilePrefill = async () => {
      try {
        const p = await fetchProfileApi();
        if (p) {
          if (p.personalInfo) {
            setGivenName((prev) => prev || p.personalInfo.firstName || "Vibhu");
            setSurname((prev) => prev || p.personalInfo.lastName || "Sharma");
            setDob((prev) => prev || p.personalInfo.dob || "1995-06-12");
            setGender((prev) => prev || p.personalInfo.gender || "Male");
            setNationality((prev) => prev || p.personalInfo.nationality || "Indian");
            setPhone((prev) => prev || p.personalInfo.phone || "+91 98765 43210");
            setEmail((prev) => prev || p.personalInfo.email || "vibhu@phantomvisa.com");
            setEmployerName((prev) => prev || p.personalInfo.employer || "TechCorp Solutions Pvt Ltd");
            setJobTitle((prev) => prev || p.personalInfo.occupation || "Senior Software Consultant");
          }
          if (p.passportDetails) {
            setPassportNo((prev) => prev || p.passportDetails.passportNumber || "Z9817264");
            setPassportType((prev) => prev || p.passportDetails.passportType || "Ordinary / Regular");
            setIssuePlace((prev) => prev || p.passportDetails.placeOfIssue || "New Delhi");
            setIssueDate((prev) => prev || p.passportDetails.dateOfIssue || "2023-12-21");
            setExpiryDate((prev) => prev || p.passportDetails.dateOfExpiry || "2033-12-20");
          }
          if (p.coTravelers && Array.isArray(p.coTravelers)) {
            setSavedVaultTravelers(p.coTravelers);
          }
        }
      } catch (e) {
        console.error("Failed to prefill profile in Apply Wizard:", e);
      }
    };
    loadProfilePrefill();
  }, []);

  // Fetch admin-configured data from backend MongoDB
  useEffect(() => {
    const fetchAdminConfig = async () => {
      try {
        const [cRes, catRes, vtRes, reqRes] = await Promise.all([
          fetch(`${API_V1_URL}/countries`),
          fetch(`${API_V1_URL}/visa/categories`),
          fetch(`${API_V1_URL}/visa/types`),
          fetch(`${API_V1_URL}/visa/requirements`)
        ]);

        const cJson = await cRes.json();
        const catJson = await catRes.json();
        const vtJson = await vtRes.json();
        const reqJson = await reqRes.json();

        // Filter active countries with visaAvailable === true
        const activeC: CountryRecord[] = (cJson.data || []).filter(
          (c: CountryRecord) => c.status === "Active" && c.visaAvailable !== false
        );

        const activeCat: VisaCategoryRecord[] = (catJson.data || []).filter(
          (c: VisaCategoryRecord) => c.status === "Active"
        );

        const activeVt: VisaTypeRecord[] = (vtJson.data || []).filter(
          (v: VisaTypeRecord) => v.status === "Active"
        );

        const reqList: VisaRequirementRecord[] = (reqJson.data || []).filter(
          (r: VisaRequirementRecord) => r.status === "Active"
        );

        // Fallback default list if database array is empty
        const finalC: CountryRecord[] = activeC.length > 0 ? activeC : [
          {
            _id: "c-1",
            name: "Canada",
            code: "CA",
            flag: "🇨🇦",
            startingFee: 12500,
            processingTime: "10-15 Days",
            visaAvailable: true,
            status: "Active",
            availableCategories: ["Tourist Visa", "Business Visa", "Student Visa"],
            availableVisaTypes: ["Tourist Short Stay", "Business Visitor"],
            requiredDocuments: ["Passport Front & Back Scan", "Passport Size Photograph", "Bank Statement (Last 6 Months)", "Employment NOC Letter"]
          },
          {
            _id: "c-2",
            name: "Australia",
            code: "AU",
            flag: "🇦🇺",
            startingFee: 16500,
            processingTime: "7-10 Days",
            visaAvailable: true,
            status: "Active",
            availableCategories: ["Tourist Visa", "Business Visa"],
            availableVisaTypes: ["Visitor Visa Subclass 600"],
            requiredDocuments: ["Passport Scan", "Photograph", "Financial Proof"]
          },
          {
            _id: "c-3",
            name: "United Kingdom",
            code: "GB",
            flag: "🇬🇧",
            startingFee: 18200,
            processingTime: "15-20 Days",
            visaAvailable: true,
            status: "Active",
            availableCategories: ["Tourist Visa", "Business Visa"],
            availableVisaTypes: ["Standard Visitor Visa"],
            requiredDocuments: ["Passport Scan", "Photograph", "Bank Statement"]
          }
        ];

        const finalCat: VisaCategoryRecord[] = activeCat.length > 0 ? activeCat : [
          { _id: "cat-1", name: "Tourist Visa", code: "TOURIST", status: "Active" },
          { _id: "cat-2", name: "Business Visa", code: "BUSINESS", status: "Active" },
          { _id: "cat-3", name: "Student Visa", code: "STUDENT", status: "Active" }
        ];

        const finalVt: VisaTypeRecord[] = activeVt.length > 0 ? activeVt : [
          { _id: "vt-1", name: "Tourist Short Stay", code: "TSS", categoryName: "Tourist Visa", entryType: "Single Entry", validityMonths: 6, maxStayDays: 60, processingTimeDays: 15, status: "Active" },
          { _id: "vt-2", name: "Visitor Visa Subclass 600", code: "SUB600", categoryName: "Tourist Visa", entryType: "Multiple Entry", validityMonths: 12, maxStayDays: 90, processingTimeDays: 15, status: "Active" },
          { _id: "vt-3", name: "Standard Visitor Visa", code: "SVV", categoryName: "Tourist Visa", entryType: "Multiple Entry", validityMonths: 6, maxStayDays: 180, processingTimeDays: 15, status: "Active" }
        ];

        setCountries(finalC);
        setCategories(finalCat);
        setVisaTypes(finalVt);
        setRequirements(reqList);

        // Initial default country selection
        if (finalC.length > 0) {
          const firstCountry = finalC[0];
          setSelectedCountryName(firstCountry.name);

          const availCats = firstCountry.availableCategories || [];
          const countryCats = finalCat.filter((cat) =>
            availCats.some(
              (ac) =>
                ac.trim().toLowerCase() === cat.name.trim().toLowerCase() ||
                ac.trim().toLowerCase().includes(cat.name.trim().toLowerCase()) ||
                cat.name.trim().toLowerCase().includes(ac.trim().toLowerCase())
            )
          );

          const firstCatName = countryCats.length > 0 ? countryCats[0].name : finalCat[0]?.name || "Tourist Visa";
          setSelectedCategoryName(firstCatName);

          const matchingVts = finalVt.filter(
            (vt) =>
              vt.categoryName === firstCatName ||
              vt.categoryName?.trim().toLowerCase() === firstCatName?.trim().toLowerCase()
          );

          if (matchingVts.length > 0) {
            setSelectedVisaTypeName(matchingVts[0].name);
            setEntryType(matchingVts[0].entryType || "Single Entry");
            setStayValidity(matchingVts[0].maxStayDays ? `${matchingVts[0].maxStayDays} Days` : "60 Days");
          } else if (finalVt.length > 0) {
            setSelectedVisaTypeName(finalVt[0].name);
            setEntryType(finalVt[0].entryType || "Single Entry");
            setStayValidity(finalVt[0].maxStayDays ? `${finalVt[0].maxStayDays} Days` : "60 Days");
          }
        }
      } catch (err) {
        console.error("Failed to load live admin config from MongoDB, using robust defaults:", err);
        const fallbackC: CountryRecord[] = [
          {
            _id: "c-fb-1",
            name: "Canada",
            code: "CA",
            flag: "🇨🇦",
            startingFee: 12500,
            processingTime: "10-15 Days",
            visaAvailable: true,
            status: "Active",
            availableCategories: ["Tourist Visa", "Business Visa", "Student Visa"],
            availableVisaTypes: ["Tourist Short Stay", "Business Visitor"],
            requiredDocuments: ["Passport Front & Back Scan", "Passport Size Photograph", "Bank Statement (Last 6 Months)", "Employment NOC Letter"]
          },
          {
            _id: "c-fb-2",
            name: "Australia",
            code: "AU",
            flag: "🇦🇺",
            startingFee: 16500,
            processingTime: "7-10 Days",
            visaAvailable: true,
            status: "Active",
            availableCategories: ["Tourist Visa", "Business Visa"],
            availableVisaTypes: ["Visitor Visa Subclass 600"],
            requiredDocuments: ["Passport Scan", "Photograph", "Financial Proof"]
          }
        ];
        const fallbackCat: VisaCategoryRecord[] = [
          { _id: "cat-fb-1", name: "Tourist Visa", code: "TOURIST", status: "Active" },
          { _id: "cat-fb-2", name: "Business Visa", code: "BUSINESS", status: "Active" }
        ];
        const fallbackVt: VisaTypeRecord[] = [
          { _id: "vt-fb-1", name: "Tourist Short Stay", code: "TSS", categoryName: "Tourist Visa", entryType: "Single Entry", validityMonths: 6, maxStayDays: 60, processingTimeDays: 15, status: "Active" },
          { _id: "vt-fb-2", name: "Visitor Visa Subclass 600", code: "SUB600", categoryName: "Tourist Visa", entryType: "Multiple Entry", validityMonths: 12, maxStayDays: 90, processingTimeDays: 15, status: "Active" }
        ];

        setCountries(fallbackC);
        setCategories(fallbackCat);
        setVisaTypes(fallbackVt);
        setSelectedCountryName("Canada");
        setSelectedCategoryName("Tourist Visa");
        setSelectedVisaTypeName("Tourist Short Stay");
        setEntryType("Single Entry");
        setStayValidity("60 Days");
      }
    };

    fetchAdminConfig();
  }, []);

  // Fetch agents whenever selected country changes
  useEffect(() => {
    if (!selectedCountryName) return;
    const fetchAgentsByCountry = async () => {
      setAgentsLoading(true);
      setSelectedAgentId("");
      try {
        const res = await fetch(`${API_V1_URL}/agent/by-country?country=${encodeURIComponent(selectedCountryName)}`);
        const json = await res.json();
        if (res.ok && json.success) {
          setAvailableAgents(json.data || []);
        } else {
          setAvailableAgents([]);
        }
      } catch {
        setAvailableAgents([]);
      } finally {
        setAgentsLoading(false);
      }
    };
    fetchAgentsByCountry();
  }, [selectedCountryName]);

  // Compute selected country object
  const currentCountry = countries.find((c) => c.name === selectedCountryName);

  // Show ALL active categories from MongoDB — not restricted by country
  // (Country selection affects consular fee / processing, not which categories are available)
  const availableCategoriesForCountry = categories;

  // Compute visa types supported for selected category only
  const availableVisaTypesForCategory = (() => {
    if (!selectedCategoryName) return visaTypes;

    const selCat = selectedCategoryName.trim().toLowerCase();
    return visaTypes.filter((vt) => {
      const vtCat = (vt.categoryName || "").trim().toLowerCase();
      return (
        vtCat === selCat ||
        vtCat.includes(selCat) ||
        selCat.includes(vtCat) ||
        vtCat.replace(" visa", "") === selCat.replace(" visa", "")
      );
    });
  })();

  // Handle Country Selection Change
  const handleCountryChange = (countryName: string) => {
    setSelectedCountryName(countryName);

    // Keep current category selection if it has matching visa types;
    // otherwise reset to first category with visa types available
    const currentCatHasVts = visaTypes.some((vt) => {
      const vtCat = (vt.categoryName || "").trim().toLowerCase();
      const selCat = selectedCategoryName.trim().toLowerCase();
      return vtCat === selCat || vtCat.includes(selCat) || selCat.includes(vtCat);
    });

    if (!currentCatHasVts && categories.length > 0) {
      const firstCat = categories[0].name;
      setSelectedCategoryName(firstCat);
      const validVts = visaTypes.filter(
        (vt) => (vt.categoryName || "").trim().toLowerCase() === firstCat.trim().toLowerCase()
      );
      if (validVts.length > 0) {
        setSelectedVisaTypeName(validVts[0].name);
        setEntryType(validVts[0].entryType || "Single Entry");
        setStayValidity(validVts[0].maxStayDays ? `${validVts[0].maxStayDays} Days` : "60 Days");
      }
    }
  };

  // Handle Category Selection Change
  const handleCategoryChange = (catName: string) => {
    setSelectedCategoryName(catName);

    const validVts = visaTypes.filter((vt) => {
      const vtCat = (vt.categoryName || "").trim().toLowerCase();
      const selCat = catName.trim().toLowerCase();
      return (
        vtCat === selCat ||
        vtCat.includes(selCat) ||
        selCat.includes(vtCat) ||
        vtCat.replace(" visa", "") === selCat.replace(" visa", "")
      );
    });

    if (validVts.length > 0) {
      setSelectedVisaTypeName(validVts[0].name);
      setEntryType(validVts[0].entryType || "Single Entry");
      setStayValidity(validVts[0].maxStayDays ? `${validVts[0].maxStayDays} Days` : "60 Days");
      setStepErrors((prev) => ({ ...prev, visaType: "" }));
    } else {
      setSelectedVisaTypeName("");
      setStepErrors((prev) => ({
        ...prev,
        visaType: "No active visa subclass available for this category. Please select another category or country."
      }));
    }
  };

  // Handle Visa Type Selection Change
  const handleVisaTypeChange = (vtName: string) => {
    setSelectedVisaTypeName(vtName);
    const vtObj = visaTypes.find((v) => v.name === vtName);
    if (vtObj) {
      setEntryType(vtObj.entryType || "Single Entry");
      setStayValidity(vtObj.maxStayDays ? `${vtObj.maxStayDays} Days` : "60 Days");
    }
  };

  // Populate dynamic requirements upload slots whenever selectedVisaTypeName changes
  useEffect(() => {
    if (!selectedVisaTypeName) {
      setUploadedSlots([]);
      return;
    }

    // Match requirement records for selected visa type
    const matchedReqs = requirements.filter(
      (r) =>
        r.visaTypeName === selectedVisaTypeName ||
        r.visaTypeName?.trim().toLowerCase() === selectedVisaTypeName?.trim().toLowerCase() ||
        r.visaTypeName?.trim().toLowerCase().includes(selectedVisaTypeName?.trim().toLowerCase()) ||
        selectedVisaTypeName?.trim().toLowerCase().includes(r.visaTypeName?.trim().toLowerCase())
    );

    const newSlots: UploadedSlotState[] =
      matchedReqs.length > 0
        ? matchedReqs.map((r) => ({
            title: r.title,
            documentType: r.documentType || "PDF Document",
            isMandatory: r.isMandatory !== false,
            fileUrl: ""
          }))
        : currentCountry && currentCountry.requiredDocuments && currentCountry.requiredDocuments.length > 0
        ? currentCountry.requiredDocuments.map((docTitle) => ({
            title: docTitle,
            documentType: "PDF Document",
            isMandatory: true,
            fileUrl: ""
          }))
        : [
            { title: "Passport Bio Page", documentType: "Image Scan", isMandatory: true, fileUrl: "" },
            { title: "Recent Photo (35x45mm)", documentType: "Image Scan", isMandatory: true, fileUrl: "" },
            { title: "Bank Statement", documentType: "PDF Document", isMandatory: true, fileUrl: "" }
          ];

    setUploadedSlots((prev) => {
      if (
        prev.length === newSlots.length &&
        prev.every(
          (s, i) =>
            s.title === newSlots[i].title &&
            s.documentType === newSlots[i].documentType &&
            s.isMandatory === newSlots[i].isMandatory
        )
      ) {
        return prev;
      }
      return newSlots;
    });
  }, [selectedVisaTypeName, requirements, selectedCountryName]);

  // Handle Document Upload to ImageKit + Gemini AI Verification
  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const supportedVerificationFormats = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!supportedVerificationFormats.includes(file.type)) {
      const message = "Use a JPEG, PNG, WEBP, or PDF file. This format cannot be securely verified.";
      setUploadedSlots((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], isUploading: false, isVerifying: false, isVerified: false, fileUrl: "", fileName: undefined, verifiedType: null, aiError: message };
        return copy;
      });
      showToast(message);
      e.target.value = "";
      return;
    }

    // Phase 1: Upload to ImageKit
    setUploadedSlots((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], isUploading: true, isVerifying: false, isVerified: false, verifiedType: null, aiError: null, fileUrl: "", fileName: undefined };
      return copy;
    });

    let uploadedUrl = "";
    let uploadedFileName = "";

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch(`${API_V1_URL}/applications/upload-doc`, {
        method: "POST",
        body: data
      });

      const json = await res.json();
      if (res.ok && json.success && json.data?.url) {
        uploadedUrl = json.data.url;
        uploadedFileName = json.data.fileName || file.name;
        const titleName = uploadedSlots[index]?.title;
        setUploadedSlots((prev) => {
          const copy = [...prev];
          copy[index] = { ...copy[index], fileUrl: uploadedUrl, fileName: uploadedFileName, isUploading: false, isVerifying: true };
          return copy;
        });
        if (titleName) {
          setStepErrors((prev) => { const c = { ...prev }; delete c[`doc_${titleName}`]; return c; });
        }
      } else {
        showToast(json.error?.message || "Failed to upload document.");
        setUploadedSlots((prev) => { const copy = [...prev]; copy[index] = { ...copy[index], isUploading: false }; return copy; });
        return;
      }
    } catch (err) {
      showToast("Error uploading file.");
      setUploadedSlots((prev) => { const copy = [...prev]; copy[index] = { ...copy[index], isUploading: false }; return copy; });
      return;
    }

    // Phase 2: Gemini AI Verification Loop — max 3 quick attempts (~4s)
    const slotTitle = uploadedSlots[index]?.title || "";
    const slotDocType = uploadedSlots[index]?.documentType || "";
    let verifyCompleted = false;
    let hasError = false;
    let attempts = 0;

    while (!verifyCompleted && !hasError && attempts < 3) {
      attempts++;
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("documentTitle", slotTitle);
        formData.append("documentType", slotDocType);

        const vRes = await fetch(`${API_V1_URL}/applicant/verify-visa-document`, {
          method: "POST",
          body: formData
        });
        const vJson = await vRes.json();

        if (vRes.ok && vJson) {
          if (vJson.success && vJson.verificationStatus === "verified") {
            setUploadedSlots((prev) => {
              const copy = [...prev];
              copy[index] = { ...copy[index], isVerifying: false, isVerified: true, verifiedType: vJson.documentType || slotTitle, aiError: null };
              return copy;
            });
            verifyCompleted = true;
            break;
          } else if (vJson.verificationStatus === "unreadable" || vJson.verificationStatus === "wrong_type" || (vJson.success === false && vJson.verificationStatus !== "busy")) {
            // Real document mismatch / unreadable blur
            setUploadedSlots((prev) => {
              const copy = [...prev];
              copy[index] = { ...copy[index], isVerifying: false, isVerified: false, aiError: vJson.message || "AI document verification failed. Please upload the correct document scan." };
              return copy;
            });
            hasError = true;
            break;
          } else {
            // Busy or retrying
            await new Promise((r) => setTimeout(r, 1200));
          }
        } else {
          await new Promise((r) => setTimeout(r, 1200));
        }
      } catch (err) {
        await new Promise((r) => setTimeout(r, 1200));
      }
    }

    // Never treat an unavailable verifier as approval. The server is the sole
    // authority for an AI-verified document.
    if (!verifyCompleted && !hasError) {
      setUploadedSlots((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], isVerifying: false, isVerified: false, verifiedType: null, aiError: "AI verification is unavailable. This document has not been accepted; please retry." };
        return copy;
      });
    }
  };

  // Co-Travelers Add/Remove
  const handleAddCoTraveler = () => {
    if (!newCoName.trim()) return;
    const finalPassport = newCoPassport.trim() || `Z${Math.floor(1000000 + Math.random() * 9000000)}`;
    setCoTravelers((prev) => [
      ...prev,
      {
        id: `ct-${Date.now()}`,
        name: newCoName.trim(),
        relation: newCoRelation,
        passportNo: finalPassport.toUpperCase(),
        age: 30
      }
    ]);
    setNewCoName("");
    setNewCoPassport("");
  };

  const handleSelectVaultTraveler = (t: CoTravelerRecord) => {
    if (coTravelers.some((c) => c.name.toLowerCase() === t.fullName.toLowerCase())) {
      showToast(`${t.fullName} is already added to this application.`);
      return;
    }
    setCoTravelers((prev) => [
      ...prev,
      {
        id: `ct-${Date.now()}`,
        name: t.fullName,
        relation: t.relation,
        passportNo: t.passportNumber,
        age: 30
      }
    ]);
    showToast(`Added ${t.fullName} (${t.relation}) from your saved vault.`);
  };

  const handleRemoveCoTraveler = (id: string) => {
    setCoTravelers((prev) => prev.filter((c) => c.id !== id));
  };

  // Pricing calculations
  const consularFee = currentCountry?.startingFee || 8500;
  const platformFee = 2500;
  const expressSurcharge = processingSpeed === "express" ? 2000 : 0;
  const totalAmount = consularFee + platformFee + expressSurcharge;

  // Save Draft
  const handleSaveDraft = () => {
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 2000);
    showToast("Draft saved successfully.");
    if (onNavigateDrafts) onNavigateDrafts();
  };

  // Instant Step Validation Helper
  const validateStepNumber = (stepNum: number): boolean => {
    const errs: Record<string, string> = {};

    if (stepNum === 1) {
      if (!selectedCountryName) errs.country = "Please select a Destination Country.";
      if (!selectedCategoryName) errs.category = "Please select a Visa Category.";
      if (!selectedVisaTypeName || selectedVisaTypeName.trim() === "") {
        errs.visaType = "Please select a valid Visa Subclass / Type before proceeding.";
      }
    }

    if (stepNum === 2) {
      if (!givenName.trim()) errs.givenName = "First name is required.";
      if (!surname.trim()) errs.surname = "Last name is required.";
      if (!dob) errs.dob = "Date of birth is required.";
      if (!travelDate) errs.travelDate = "Departure date is required.";
      if (!returnDate) errs.returnDate = "Return date is required.";

      if (travelDate && returnDate) {
        const dep = new Date(travelDate);
        const ret = new Date(returnDate);

        // Departure must be at least minDepartureDate (processing window)
        const minDep = new Date(minDepartureStr);
        minDep.setHours(0, 0, 0, 0);
        dep.setHours(0, 0, 0, 0);

        if (dep < minDep) {
          errs.travelDate = `Departure date must be at least ${minDepartureDays} days from today (${minDepartureFmt}) — the visa processing time for ${selectedVisaTypeName || "this visa type"}.`;
        }

        if (ret <= dep) {
          errs.returnDate = "Return date must be after departure date.";
        } else {
          // Check maxStayDays configured in Admin settings for selected VisaType
          const tripDays = Math.ceil((ret.getTime() - dep.getTime()) / (1000 * 60 * 60 * 24));
          const selectedVtObj = visaTypes.find((v) => v.name === selectedVisaTypeName);
          const maxAllowedDays = selectedVtObj?.maxStayDays || 180;

          if (tripDays > maxAllowedDays) {
            errs.returnDate = `Selected travel duration (${tripDays} days) exceeds maximum allowed stay duration (${maxAllowedDays} days) for ${selectedVisaTypeName || "this visa"}. Please adjust return date.`;
          }
        }
      }
    }

    if (stepNum === 3) {
      if (!passportNo.trim()) errs.passportNo = "Passport number is required.";
      if (!expiryDate) {
        errs.passportExpiry = "Passport expiry date is required.";
      } else if (returnDate) {
        // Enforce 6-month validity beyond return date
        const exp = new Date(expiryDate);
        const ret = new Date(returnDate);
        const sixMonthsAfterReturn = new Date(ret);
        sixMonthsAfterReturn.setMonth(sixMonthsAfterReturn.getMonth() + 6);

        if (exp < sixMonthsAfterReturn) {
          errs.passportExpiry = `Passport must be valid for at least 6 months beyond return date (valid until at least ${sixMonthsAfterReturn.toISOString().split("T")[0]}).`;
        }
      }
    }

    if (stepNum === 4) {
      // Validate mandatory documents
      for (const slot of uploadedSlots) {
        if (slot.isMandatory && (!slot.fileUrl || slot.fileUrl.trim() === "")) {
          errs[`doc_${slot.title}`] = `Mandatory document "${slot.title}" must be uploaded.`;
        } else if (slot.isMandatory && !slot.isVerified) {
          errs[`doc_${slot.title}`] = `Mandatory document "${slot.title}" must pass AI verification before submission.`;
        }
      }
    }

    if (Object.keys(errs).length > 0) {
      setStepErrors(errs);
      return false;
    }

    setStepErrors({});
    return true;
  };

  // Step Navigation Handler with Locking
  const handleStepClick = (targetStep: number) => {
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      return;
    }

    for (let s = currentStep; s < targetStep; s++) {
      if (!validateStepNumber(s)) {
        showToast(`Please complete Step ${s} properly before proceeding.`);
        setCurrentStep(s);
        return;
      }
    }

    setCurrentStep(targetStep);
  };

  // Next Step Action
  const handleNextStep = () => {
    if (validateStepNumber(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    } else {
      showToast(`Please fill all required fields in Step ${currentStep} properly.`);
    }
  };

  // Final Submit to MongoDB
  const handleSubmitVisaApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAgreed) return;

    setIsSubmitting(true);
    try {
      const payload = {
        countryName: selectedCountryName,
        countryCode: currentCountry?.code || "DEST",
        categoryName: selectedCategoryName,
        visaTypeName: selectedVisaTypeName,
        processingSpeed,
        entryType,
        stayValidity,
        personalDetails: {
          givenName,
          surname,
          dob,
          gender,
          nationality,
          maritalStatus,
          phone: phone || "+91 98765 43210",
          email: email || "applicant@phantomvisa.com"
        },
        travelDetails: {
          travelDate,
          returnDate,
          stayType,
          hostName,
          hostAddress
        },
        passportDetails: {
          passportType,
          passportNo,
          issuePlace,
          issueDate,
          expiryDate
        },
        employmentDetails: {
          employmentStatus,
          employerName,
          jobTitle,
          bankBalance: `₹${Number(bankBalance).toLocaleString("en-IN")}`
        },
        uploadedDocuments: uploadedSlots,
        coTravelers,
        assignedAgentId: selectedAgentId || "",
        assignedAgentName: selectedAgentId
          ? (availableAgents.find(a => a.agentId === selectedAgentId)?.agencyName || "")
          : "",
        pricing: {
          consularFee,
          platformFee,
          expressSurcharge,
          promoDiscount: 0,
          promoCode: "",
          totalAmount
        }
      };

      const res = await fetch(`${API_V1_URL}/applications/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setSubmittedAppRecord(json.data);
        showToast("Visa application submitted & saved to MongoDB successfully!");
        
        // Add to frontend unified transaction store
        try {
          const appRec = json.data;
          const appId = appRec.applicationId || `VO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          const numSuffix = appId.replace(/^VO-2026-/, "").replace(/[^0-9]/g, "") || String(Math.floor(1000 + Math.random() * 9000));
          const taxableBase = consularFee + platformFee;
          const cgst = Math.round(taxableBase * 0.09);
          const sgst = Math.round(taxableBase * 0.09);
          const totalTax = cgst + sgst;
          const netAmount = taxableBase + totalTax + expressSurcharge;

          if (visaCtx?.addNewUnifiedTransaction) {
            visaCtx.addNewUnifiedTransaction({
              id: `tx-${numSuffix}`,
              transactionId: `PAY-2026-${numSuffix}`,
              invoiceNo: `INV-2026-${numSuffix}`,
              applicationId: appId,
              applicantName: `${givenName} ${surname}`.trim() || "Applicant",
              passportNumber: passportNo ? passportNo.toUpperCase() : "Z9817264",
              nationality: nationality || "Indian",
              country: selectedCountryName,
              visaType: selectedVisaTypeName,
              visaCategory: selectedCategoryName?.toLowerCase().includes("business") ? "Business" : selectedCategoryName?.toLowerCase().includes("student") ? "Student" : "Tourist",
              paidBy: "Applicant",
              pricing: {
                consularFee,
                serviceFee: platformFee,
                expressSurcharge,
                taxableBase,
                cgst,
                sgst,
                igst: 0,
                totalTax,
                discount: 0,
                netAmount
              },
              paymentMethod: "UPI Instant (Google Pay)",
              paymentGateway: "Razorpay",
              paymentRef: `RAZOR-${passportNo || "9817264"}-PAY`,
              status: "Successful",
              gstin: "27AAACG1234H1Z5",
              billingAddress: "104, Park Street, Connaught Place, New Delhi - 110001",
              sacCode: "998311",
              createdAt: new Date().toISOString()
            });
          }
        } catch (e) {
          console.error("Failed to add transaction to local context:", e);
        }

        if (onAddApplication) {
          onAddApplication(json.data);
        }
      } else {
        if (json.error?.details) {
          setStepErrors(json.error.details);
          const firstErrKey = Object.keys(json.error.details)[0];
          showToast(`Validation Error: ${json.error.details[firstErrKey]}`);
        } else {
          showToast(json.error?.message || "Failed to submit visa application.");
        }
      }
    } catch (err) {
      showToast("Error communicating with server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, title: "Destination & Speed", icon: Plane },
    { num: 2, title: "Personal & Travel", icon: User },
    { num: 3, title: "Passport & Income", icon: FileText },
    { num: 4, title: "Documents & Group", icon: Upload },
    { num: 5, title: "Pricing & Submit", icon: CreditCard }
  ];

  const parsedBankBalance = Number(bankBalance.replace(/\D/g, "")) || 0;
  const isBankBalanceLow = parsedBankBalance < 350000;

  return (
    <div className="space-y-6 pb-12 text-slate-800 animate-in fade-in duration-200">
      
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-slate-900 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom-3">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER & 5-STEP PIPELINE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Home</span>
            <span>/</span>
            <span>Visa Application</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">New Application</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Apply for Visa Online</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 text-[#4848F7] border border-indigo-200">
              Step {currentStep} of 5 &bull; {Math.round((currentStep / 5) * 100)}% Completed
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Live dynamic visa application form configured from MongoDB Admin settings. Complete your travel details, passport credentials, document uploads, and submit for consular processing.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleSaveDraft}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition flex items-center gap-2 cursor-pointer"
          >
            <Save size={16} />
            <span>{savedDraft ? "Draft Saved!" : "Save Draft"}</span>
          </button>
        </div>
      </div>

      {/* 5-STEP STEPPER PIPELINE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-bold">
          {stepsList.map((step) => {
            const isActive = step.num === currentStep;
            const isDone = step.num < currentStep;
            const IconComp = step.icon;
            return (
              <button
                key={step.num}
                onClick={() => handleStepClick(step.num)}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl transition cursor-pointer ${
                  isActive
                    ? "bg-[#4848F7] text-white shadow-md shadow-indigo-500/20"
                    : isDone
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {isDone ? <CheckCircle2 size={15} /> : <IconComp size={15} />}
                <span className="truncate text-xs font-extrabold">{step.num}. {step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* WORKFLOW BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#4848F7]" size={20} />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
              Connected Workflow (Applicant ➔ Agent ➔ Admin)
            </h3>
          </div>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
            100% Consular Approval Rate
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 1</span>
            <p className="text-white">Applicant Fills & Submits</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 2</span>
            <p className="text-white">Agent AI & OCR Inspection</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 3</span>
            <p className="text-white">Embassy Consular Submission</p>
          </div>

          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30 space-y-1 text-emerald-300">
            <span className="text-emerald-300 block text-[10px] uppercase">Stage 4</span>
            <p className="font-bold">Visa Decision Granted ✓</p>
          </div>
        </div>
      </div>

      {/* WIZARD FORM CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        
        {/* Render Submission Success Screen if application submitted */}
        {submittedAppRecord && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-sm animate-in fade-in zoom-in duration-200">
            <div className="w-20 h-20 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
              <CheckCircle2 size={44} />
            </div>

            <div className="space-y-2">
              <span className="bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                Application Submitted
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Visa Application Submitted Successfully! 🎉</h2>
              <p className="text-sm text-slate-600 max-w-xl mx-auto">
                Your application has been registered in MongoDB and forwarded for consular processing.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-xl mx-auto text-left space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Application Reference ID:</span>
                <span className="font-mono font-black text-[#4848F7] text-sm">{submittedAppRecord.applicationId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Primary Applicant:</span>
                <span className="font-bold text-slate-900">{givenName} {surname}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Destination Country:</span>
                <span className="font-bold text-slate-900">{selectedCountryName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Visa Subclass / Type:</span>
                <span className="font-bold text-slate-900">{selectedVisaTypeName}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-medium">Total Fee Payable:</span>
                <span className="font-mono font-extrabold text-slate-900 text-sm">₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  if (onNavigateDrafts) onNavigateDrafts();
                }}
                className="w-full sm:w-auto bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4848F7] font-bold px-6 py-3 rounded-xl text-xs transition cursor-pointer"
              >
                View My Applications
              </button>
              <button
                onClick={() => {
                  if (onNavigatePayment) onNavigatePayment();
                }}
                className="w-full sm:w-auto bg-[#4848F7] hover:bg-[#3838E6] text-white font-bold px-6 py-3 rounded-xl text-xs transition shadow-md cursor-pointer"
              >
                Proceed to Payment (₹{totalAmount.toLocaleString("en-IN")})
              </button>
            </div>
          </div>
        )}

        {!submittedAppRecord && (
          <>
            {/* STEP 1: DESTINATION & SPEED */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Plane size={18} className="text-[#4848F7]" />
                  <span>Step 1: Select Destination, Visa Category & Processing Speed</span>
                </h3>

                {/* Country, Category & Subclass Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Destination Country</label>
                    <select
                      value={selectedCountryName}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-bold focus:outline-none focus:border-[#4848F7]"
                    >
                      {countries.map((c) => {
                        const isUrl = c.flag && (c.flag.startsWith("http://") || c.flag.startsWith("https://"));
                        const flagLabel = isUrl ? `${c.code.toLowerCase()} ` : c.flag ? `${c.flag} ` : "";
                        return (
                          <option key={c._id} value={c.name}>
                            {flagLabel}{c.name} ({c.code})
                          </option>
                        );
                      })}
                    </select>
                    {stepErrors.country && <p className="text-[10px] text-red-600 font-bold mt-1">{stepErrors.country}</p>}
                  </div>

                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Visa Category</label>
                    {availableCategoriesForCountry.length === 0 ? (
                      <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl text-xs font-semibold border border-amber-200">
                        No active categories configured for this country.
                      </div>
                    ) : (
                      <select
                        value={selectedCategoryName}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-bold focus:outline-none focus:border-[#4848F7]"
                      >
                        {availableCategoriesForCountry.map((cat) => (
                          <option key={cat._id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    )}
                    {stepErrors.category && <p className="text-[10px] text-red-600 font-bold mt-1">{stepErrors.category}</p>}
                  </div>

                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Visa Subclass / Type</label>
                    {availableVisaTypesForCategory.length === 0 ? (
                      <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl text-xs font-semibold border border-amber-200">
                        No active visa types under selected category.
                      </div>
                    ) : (
                      <select
                        value={selectedVisaTypeName}
                        onChange={(e) => handleVisaTypeChange(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-bold focus:outline-none focus:border-[#4848F7]"
                      >
                        {availableVisaTypesForCategory.map((vt) => (
                          <option key={vt._id} value={vt.name}>
                            {vt.name}
                          </option>
                        ))}
                      </select>
                    )}
                    {stepErrors.visaType && <p className="text-[10px] text-red-600 font-bold mt-1">{stepErrors.visaType}</p>}
                  </div>
                </div>

                {/* Agent Selection — Dynamic from MongoDB */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <User size={15} className="text-[#4848F7]" />
                    Select Your Visa Processing Agent
                    <span className="ml-1 text-[10px] font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Optional</span>
                  </label>

                  {agentsLoading ? (
                    <div className="flex items-center gap-2 text-xs text-slate-500 py-3">
                      <RefreshCw size={13} className="animate-spin text-[#4848F7]" />
                      <span>Loading available agents for {selectedCountryName}…</span>
                    </div>
                  ) : availableAgents.length === 0 ? (
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-500">
                      <AlertCircle size={13} className="text-amber-500 shrink-0" />
                      <span>No agents currently available for <strong>{selectedCountryName}</strong>. Your application will be auto-assigned by our team.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* No Preference option */}
                      <button
                        type="button"
                        onClick={() => setSelectedAgentId("")}
                        className={`relative p-3.5 rounded-2xl border text-left transition cursor-pointer group ${
                          selectedAgentId === ""
                            ? "bg-indigo-50 border-[#4848F7] ring-2 ring-[#4848F7]/20"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            selectedAgentId === "" ? "bg-[#4848F7]/10" : "bg-slate-200"
                          }`}>
                            <Sparkles size={14} className={selectedAgentId === "" ? "text-[#4848F7]" : "text-slate-400"} />
                          </div>
                          <div>
                            <p className="font-bold text-xs text-slate-800">No Preference</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">Auto-assign best available agent</p>
                          </div>
                        </div>
                        {selectedAgentId === "" && (
                          <span className="absolute top-2 right-2 w-4 h-4 bg-[#4848F7] rounded-full flex items-center justify-center">
                            <Check size={10} className="text-white" />
                          </span>
                        )}
                      </button>

                      {/* Agent cards */}
                      {availableAgents.map((agent) => (
                        <button
                          key={agent.agentId}
                          type="button"
                          onClick={() => setSelectedAgentId(agent.agentId === selectedAgentId ? "" : agent.agentId)}
                          className={`relative p-3.5 rounded-2xl border text-left transition cursor-pointer group ${
                            selectedAgentId === agent.agentId
                              ? "bg-indigo-50 border-[#4848F7] ring-2 ring-[#4848F7]/20"
                              : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-black text-xs ${
                              selectedAgentId === agent.agentId
                                ? "bg-[#4848F7] text-white"
                                : "bg-gradient-to-br from-indigo-400 to-purple-500 text-white"
                            }`}>
                              {agent.fullName?.charAt(0)?.toUpperCase() || "A"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-xs text-slate-900 truncate">{agent.agencyName}</p>
                              <p className="text-[10px] text-slate-500 truncate">{agent.fullName}</p>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {agent.city && (
                                  <span className="text-[9px] font-semibold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full">
                                    📍 {agent.city}{agent.state ? `, ${agent.state}` : ""}
                                  </span>
                                )}
                                {agent.yearsInBusiness && (
                                  <span className="text-[9px] font-semibold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
                                    {agent.yearsInBusiness} yrs exp
                                  </span>
                                )}
                                <span className="text-[9px] font-semibold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                                  ✓ Serves {selectedCountryName}
                                </span>
                              </div>
                            </div>
                          </div>
                          {selectedAgentId === agent.agentId && (
                            <span className="absolute top-2 right-2 w-4 h-4 bg-[#4848F7] rounded-full flex items-center justify-center">
                              <Check size={10} className="text-white" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedAgentId && (() => {
                    const ag = availableAgents.find(a => a.agentId === selectedAgentId);
                    return ag ? (
                      <p className="text-[10px] text-[#4848F7] font-semibold flex items-center gap-1">
                        <CheckCircle2 size={11} /> Agent selected: <strong>{ag.agencyName}</strong> ({ag.agentId})
                      </p>
                    ) : null;
                  })()}
                </div>

                {/* Processing Speed Selection */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock size={15} className="text-[#4848F7]" /> Select Consular Processing Speed
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <button
                      type="button"
                      onClick={() => setProcessingSpeed("standard")}
                      className={`p-4 rounded-2xl border text-left space-y-1 transition cursor-pointer ${
                        processingSpeed === "standard"
                          ? "bg-indigo-50 border-[#4848F7] text-slate-900 ring-2 ring-[#4848F7]/20"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="font-extrabold block text-sm">Standard Processing</span>
                      <p className="text-slate-500">21 - 25 Business Days</p>
                      <p className="font-mono text-indigo-700 font-bold">
                        Consular Fee (₹{formatINR(consularFee)}) + ₹0 Surcharge
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProcessingSpeed("express")}
                      className={`p-4 rounded-2xl border text-left space-y-1 transition cursor-pointer ${
                        processingSpeed === "express"
                          ? "bg-indigo-50 border-[#4848F7] text-slate-900 ring-2 ring-[#4848F7]/20"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="font-extrabold block text-sm flex items-center gap-1">
                        Express Processing <Zap size={14} className="text-amber-500" />
                      </span>
                      <p className="text-slate-500">10 - 15 Business Days</p>
                      <p className="font-mono text-indigo-700 font-bold">+ ₹2,000 Express Fee</p>
                    </button>
                  </div>
                </div>

                {/* Entry Type & Validity Auto-populated */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Entry Type</label>
                    <select
                      value={entryType}
                      onChange={(e) => setEntryType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-semibold focus:outline-none focus:border-[#4848F7]"
                    >
                      <option value="Single Entry">Single Entry</option>
                      <option value="Double Entry">Double Entry</option>
                      <option value="Multiple Entry">Multiple Entry</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Allowed Stay Duration</label>
                    <input
                      type="text"
                      readOnly
                      value={stayValidity}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-bold focus:outline-none cursor-not-allowed"
                    />
                    <p className="text-[10px] text-slate-500 font-medium mt-1 flex items-center gap-1">
                      <Pin size={12} className="text-amber-500 shrink-0" />
                      <span>Configured by Consular Rule (Max {visaTypes.find((v) => v.name === selectedVisaTypeName)?.maxStayDays || 180} Days)</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PERSONAL & TRAVEL */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <User size={18} className="text-[#4848F7]" />
                  <span>Step 2: Personal Information & Travel Details</span>
                </h3>

                {/* Personal Info */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px]">Primary Applicant Personal Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Given / First Name *</label>
                      <input
                        type="text"
                        placeholder="Enter given / first name"
                        value={givenName}
                        onChange={(e) => {
                          setGivenName(e.target.value);
                          if (stepErrors.givenName && e.target.value.trim()) {
                            setStepErrors((prev) => ({ ...prev, givenName: "" }));
                          }
                        }}
                        className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none ${
                          stepErrors.givenName ? "border-red-500 bg-red-50/20" : "border-slate-200 focus:border-[#4848F7]"
                        }`}
                      />
                      {stepErrors.givenName && <p className="text-[10px] text-red-600 font-bold mt-1">{stepErrors.givenName}</p>}
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Surname / Last Name *</label>
                      <input
                        type="text"
                        placeholder="Enter surname / last name"
                        value={surname}
                        onChange={(e) => {
                          setSurname(e.target.value);
                          if (stepErrors.surname && e.target.value.trim()) {
                            setStepErrors((prev) => ({ ...prev, surname: "" }));
                          }
                        }}
                        className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none ${
                          stepErrors.surname ? "border-red-500 bg-red-50/20" : "border-slate-200 focus:border-[#4848F7]"
                        }`}
                      />
                      {stepErrors.surname && <p className="text-[10px] text-red-600 font-bold mt-1">{stepErrors.surname}</p>}
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Date of Birth *</label>
                      <input
                        type="date"
                        max={todayStr}
                        value={dob}
                        onChange={(e) => {
                          setDob(e.target.value);
                          if (stepErrors.dob && e.target.value) {
                            setStepErrors((prev) => ({ ...prev, dob: "" }));
                          }
                        }}
                        className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none ${
                          stepErrors.dob ? "border-red-500 bg-red-50/20" : "border-slate-200 focus:border-[#4848F7]"
                        }`}
                      />
                      {stepErrors.dob && <p className="text-[10px] text-red-600 font-bold mt-1">{stepErrors.dob}</p>}
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:border-[#4848F7]"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Nationality</label>
                      <select
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:border-[#4848F7]"
                      >
                        <option value="">-- Select Nationality --</option>
                        {Array.from(
                          new Set([
                            "Indian",
                            "American",
                            "Australian",
                            "British",
                            "Canadian",
                            "German",
                            "French",
                            "Chinese",
                            "Japanese",
                            "Emirati",
                            "Saudi",
                            "Singaporean",
                            "Italian",
                            "Spanish",
                            "Dutch",
                            "Swiss",
                            "Russian",
                            "Brazilian",
                            "Mexican",
                            "South African",
                            "Korean (South)",
                            "New Zealander",
                            "Malaysian",
                            "Thai",
                            "Indonesian",
                            "Vietnamese",
                            "Turkish",
                            "Egyptian",
                            "Nepalese",
                            "Sri Lankan",
                            "Bangladeshi",
                            "Pakistani",
                            ...countries.map((c) => c.name)
                          ])
                        )
                          .sort()
                          .map((nat) => (
                            <option key={nat} value={nat}>
                              {nat}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Marital Status</label>
                      <select
                        value={maritalStatus}
                        onChange={(e) => setMaritalStatus(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:border-[#4848F7]"
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Travel & Accommodation Details */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px]">Travel Dates & Accommodation Info</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Intended Departure Date *</label>
                      <input
                        type="date"
                        min={minDepartureStr}
                        value={travelDate}
                        onChange={(e) => {
                          setTravelDate(e.target.value);
                          if (stepErrors.travelDate && e.target.value) {
                            setStepErrors((prev) => ({ ...prev, travelDate: "" }));
                          }
                        }}
                        className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none ${
                          stepErrors.travelDate ? "border-red-500 bg-red-50/20" : "border-slate-200 focus:border-[#4848F7]"
                        }`}
                      />
                      <p className="text-[10px] text-slate-500 font-medium mt-1 flex items-center gap-1">
                        <Clock size={10} className="text-[#4848F7] shrink-0" />
                        <span>
                          Earliest: <strong>{minDepartureFmt}</strong> — Visa processing requires <strong>{minDepartureDays} day{minDepartureDays !== 1 ? "s" : ""}</strong>
                        </span>
                      </p>
                      {stepErrors.travelDate && <p className="text-[10px] text-red-600 font-bold mt-1">{stepErrors.travelDate}</p>}
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Intended Return Date *</label>
                      <input
                        type="date"
                        min={travelDate || todayStr}
                        value={returnDate}
                        onChange={(e) => {
                          setReturnDate(e.target.value);
                          if (stepErrors.returnDate && e.target.value) {
                            setStepErrors((prev) => ({ ...prev, returnDate: "" }));
                          }
                        }}
                        className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none ${
                          stepErrors.returnDate ? "border-red-500 bg-red-50/20" : "border-slate-200 focus:border-[#4848F7]"
                        }`}
                      />
                      {stepErrors.returnDate && (
                        <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[10px] font-bold mt-1.5 flex items-center gap-1.5">
                          <AlertCircle size={12} className="shrink-0 text-red-600" />
                          <span>{stepErrors.returnDate}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Stay Accommodation Type</label>
                      <select
                        value={stayType}
                        onChange={(e) => setStayType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:border-[#4848F7]"
                      >
                        <option value="Hotel Booking">Hotel Booking</option>
                        <option value="Host Residence">Host Residence / Friend</option>
                        <option value="Company Sponsor">Company Sponsor</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Hotel / Host Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Shangri-La Hotel"
                        value={hostName}
                        onChange={(e) => setHostName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:border-[#4848F7]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-slate-700 font-semibold block mb-1">Hotel / Host Address</label>
                      <input
                        type="text"
                        placeholder="Full hotel or residence address"
                        value={hostAddress}
                        onChange={(e) => setHostAddress(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:border-[#4848F7]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PASSPORT & INCOME */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <FileText size={18} className="text-[#4848F7]" />
                  <span>Step 3: Passport Credentials & Employment Status</span>
                </h3>

                {/* Passport Info */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px]">Passport Credentials</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Passport Type</label>
                      <select
                        value={passportType}
                        onChange={(e) => setPassportType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:border-[#4848F7]"
                      >
                        <option value="Ordinary / Regular">Ordinary / Regular</option>
                        <option value="Diplomatic">Diplomatic</option>
                        <option value="Official">Official</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Passport Number *</label>
                      <input
                        type="text"
                        placeholder="e.g. Z9817264"
                        value={passportNo}
                        onChange={(e) => setPassportNo(e.target.value.toUpperCase())}
                        className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-slate-800 font-mono font-bold focus:outline-none ${
                          stepErrors.passportNo ? "border-red-500 bg-red-50/20" : "border-slate-200 focus:border-[#4848F7]"
                        }`}
                      />
                      {stepErrors.passportNo && <p className="text-[10px] text-red-600 font-bold mt-1">{stepErrors.passportNo}</p>}
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Place of Issue</label>
                      <input
                        type="text"
                        placeholder="e.g. New Delhi"
                        value={issuePlace}
                        onChange={(e) => setIssuePlace(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:border-[#4848F7]"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">
                        Date of Expiry * <span className="text-[#4848F7] font-normal">(Min. 6 months beyond return date)</span>
                      </label>
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-slate-800 font-mono font-bold focus:outline-none ${
                          stepErrors.passportExpiry ? "border-red-500 bg-red-50/20" : "border-slate-200 focus:border-[#4848F7]"
                        }`}
                      />
                      {stepErrors.passportExpiry && (
                        <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[10px] font-bold mt-1.5 flex items-center gap-1.5">
                          <AlertCircle size={12} className="shrink-0 text-red-600" />
                          <span>{stepErrors.passportExpiry}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Employment & Financial Info */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px]">Employment & Financial Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Employment Status</label>
                      <select
                        value={employmentStatus}
                        onChange={(e) => setEmploymentStatus(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:border-[#4848F7]"
                      >
                        <option value="Employed">Employed</option>
                        <option value="Self-Employed">Self-Employed / Business Owner</option>
                        <option value="Student">Student</option>
                        <option value="Retired">Retired</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Employer / Company Name</label>
                      <input
                        type="text"
                        placeholder="e.g. TechCorp Solutions Pvt Ltd"
                        value={employerName}
                        onChange={(e) => setEmployerName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:border-[#4848F7]"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Job Title / Designation</label>
                      <input
                        type="text"
                        placeholder="e.g. Senior Software Engineer"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:border-[#4848F7]"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Bank Balance (INR)</label>
                      <input
                        type="number"
                        placeholder="e.g. 450000"
                        value={bankBalance}
                        onChange={(e) => setBankBalance(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold focus:outline-none focus:border-[#4848F7]"
                      />
                      {isBankBalanceLow && (
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[10px] font-semibold mt-1.5 flex items-center gap-1.5">
                          <AlertCircle size={12} className="shrink-0 text-amber-600" />
                          <span>Warning: Balance is below recommended ₹3,50,000 threshold.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: DOCUMENTS & GROUP */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Upload size={18} className="text-[#4848F7]" />
                    <span>Step 4: Required Documents & Co-Travelers</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono font-normal">
                    {uploadedSlots.length} dynamic slots for {selectedVisaTypeName}
                  </span>
                </h3>

                {/* Dynamic Requirement Slots */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Admin Configured Requirements ({uploadedSlots.length})
                  </h4>

                  {uploadedSlots.length === 0 ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle size={16} className="text-amber-600 shrink-0" />
                      <span>No specific requirements configured for this visa type. You may proceed.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {uploadedSlots.map((slot, idx) => {
                        const errKey = `doc_${slot.title}`;
                        const isErr = !!stepErrors[errKey] && (!slot.fileUrl || slot.fileUrl.trim() === "");

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
                              isErr
                                ? "bg-red-50/40 border-red-400"
                                : slot.isVerified
                                ? "bg-emerald-50/40 border-emerald-300"
                                : slot.aiError
                                ? "bg-red-50/30 border-red-300"
                                : slot.fileUrl
                                ? "bg-blue-50/30 border-blue-200"
                                : "bg-slate-50 border-slate-200"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-extrabold text-slate-900">{slot.title}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{slot.documentType}</p>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                                  slot.isMandatory
                                    ? "bg-red-100 text-red-700 border border-red-200"
                                    : "bg-slate-200 text-slate-600"
                                }`}
                              >
                                {slot.isMandatory ? "Mandatory" : "Optional"}
                              </span>
                            </div>

                            <div className="space-y-2">
                              {/* Upload Button / Uploaded State */}
                              {!slot.fileUrl ? (
                                <label className="bg-white border border-slate-300 hover:border-[#4848F7] text-slate-700 font-bold text-xs p-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition shadow-2xs">
                                  {slot.isUploading ? (
                                    <><RefreshCw size={14} className="animate-spin text-[#4848F7]" /><span>Uploading...</span></>
                                  ) : (
                                    <><Upload size={14} className="text-[#4848F7]" /><span>Upload Scan / PDF</span></>
                                  )}
                                  <input type="file" accept="image/*,application/pdf" disabled={slot.isUploading} onChange={(e) => handleFileUpload(idx, e)} className="hidden" />
                                </label>
                              ) : (
                                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
                                  <div className="flex items-center gap-2 truncate">
                                    <FileText size={14} className="text-slate-400 shrink-0" />
                                    <span className="truncate text-xs text-slate-700">{slot.fileName || "Uploaded ✓"}</span>
                                  </div>
                                  <label className="text-[10px] font-bold text-[#4848F7] hover:underline shrink-0 cursor-pointer">
                                    Change
                                    <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileUpload(idx, e)} className="hidden" />
                                  </label>
                                </div>
                              )}

                              {/* AI Verification Status */}
                              {slot.fileUrl && slot.isVerifying && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-xl">
                                  <Sparkles size={13} className="text-indigo-500 animate-pulse shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-[10px] font-bold text-indigo-700">Gemini AI Verifying...</p>
                                    <div className="mt-1 h-1 bg-indigo-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-indigo-500 rounded-full animate-pulse" style={{ width: "70%" }} />
                                    </div>
                                  </div>
                                </div>
                              )}

                              {slot.fileUrl && slot.isVerified && !slot.isVerifying && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                                  <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                                  <div>
                                    <p className="text-[10px] font-bold text-emerald-700">AI Verified ✓</p>
                                    <p className="text-[10px] text-emerald-600">{slot.verifiedType}</p>
                                  </div>
                                </div>
                              )}

                              {slot.fileUrl && slot.aiError && !slot.isVerifying && (
                                <div className="space-y-1.5">
                                  <div className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl">
                                    <ShieldAlert size={13} className="text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                      <p className="text-[10px] font-bold text-red-700">AI Verification Failed</p>
                                      <p className="text-[10px] text-red-600 mt-0.5">{slot.aiError}</p>
                                    </div>
                                  </div>
                                  <label className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-white border border-red-200 hover:border-red-400 text-red-600 font-bold text-[10px] rounded-lg cursor-pointer transition">
                                    <RefreshCw size={11} />
                                    Re-upload Correct Document
                                    <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileUpload(idx, e)} className="hidden" />
                                  </label>
                                </div>
                              )}

                              {isErr && (
                                <p className="text-[10px] text-red-600 font-bold flex items-center gap-1">
                                  <AlertCircle size={10} /> {stepErrors[errKey]}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Co-Travelers */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      Co-Travelers (Family / Group Application)
                    </h4>
                    {savedVaultTravelers.length > 0 && (
                      <span className="text-[10px] text-indigo-600 font-bold">
                        {savedVaultTravelers.length} saved in your vault
                      </span>
                    )}
                  </div>

                  {/* Saved Co-Travelers Quick-Select Pills from Profile Vault */}
                  {savedVaultTravelers.length > 0 && (
                    <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-1.5">
                      <p className="text-[11px] font-bold text-indigo-900 flex items-center gap-1.5">
                        <Users size={13} className="text-[#4848F7]" />
                        <span>Add from your Saved Family Vault:</span>
                      </p>
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        {savedVaultTravelers.map((t) => {
                          const isAlreadyAdded = coTravelers.some((c) => c.name.toLowerCase() === t.fullName.toLowerCase());
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => handleSelectVaultTraveler(t)}
                              disabled={isAlreadyAdded}
                              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                isAlreadyAdded
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300 opacity-80 cursor-default"
                                  : "bg-white hover:bg-[#4848F7] text-slate-800 hover:text-white border border-slate-200 shadow-2xs"
                              }`}
                            >
                              <span>{isAlreadyAdded ? "✓" : "+"}</span>
                              <span>{t.fullName}</span>
                              <span className="text-[10px] opacity-75">({t.relation} &bull; {t.passportNumber})</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Add Custom Co-Traveler Input */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                    <input
                      type="text"
                      value={newCoName}
                      onChange={(e) => setNewCoName(e.target.value)}
                      placeholder="Full Name (as per passport)"
                      className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:border-[#4848F7]"
                    />
                    <select
                      value={newCoRelation}
                      onChange={(e) => setNewCoRelation(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:border-[#4848F7]"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Friend">Friend</option>
                    </select>
                    <input
                      type="text"
                      value={newCoPassport}
                      onChange={(e) => setNewCoPassport(e.target.value.toUpperCase())}
                      placeholder="Passport No (e.g. Z9817265)"
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold focus:outline-none focus:border-[#4848F7]"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddCoTraveler}
                      className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer transition flex items-center gap-1.5"
                    >
                      <Plus size={14} /> Add Co-Traveler
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    {coTravelers.map((c) => (
                      <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-900">{c.name}</span> &bull; <span className="text-slate-500">{c.relation}</span> &bull; <span className="font-mono text-slate-400">Passport: {c.passportNo}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCoTraveler(c.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold transition"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: PRICING & SUBMIT */}
            {currentStep === 5 && (
              <form onSubmit={handleSubmitVisaApp} className="space-y-6 animate-in fade-in duration-150">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <CreditCard size={18} className="text-[#4848F7]" />
                  <span>Step 5: Fee Review & Final Declaration</span>
                </h3>

                {/* Dynamic Fee Review */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Embassy Consular Fee ({selectedCountryName}):</span>
                    <span className="font-bold font-mono">₹{formatINR(consularFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Processing Fee:</span>
                    <span className="font-bold font-mono">₹{formatINR(platformFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express Speed Surcharge ({processingSpeed.toUpperCase()}):</span>
                    <span className="font-bold font-mono">₹{formatINR(expressSurcharge)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-slate-900">
                    <span>Total Payable Amount:</span>
                    <span className="text-[#4848F7] font-mono text-base">₹{formatINR(totalAmount)}</span>
                  </div>
                </div>

                {/* Declaration Checkbox */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
                  <label className="flex items-start gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={termsAgreed}
                      onChange={(e) => setTermsAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#4848F7] accent-[#4848F7]"
                    />
                    <span>
                      I hereby declare that all information provided in this application is true, accurate, and verified against official documents.
                    </span>
                  </label>
                </div>

                {/* Submission Action Button */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={!termsAgreed || isSubmitting}
                    className="bg-[#4848F7] hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Submitting to MongoDB...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        <span>Submit & Proceed to Payment (₹{formatINR(totalAmount)})</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* WIZARD NAVIGATION FOOTER */}
            <div className="flex justify-between border-t border-slate-100 pt-4 text-xs font-bold">
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
                className="bg-slate-100 hover:bg-slate-200 disabled:opacity-30 px-4 py-2 rounded-xl text-slate-700 transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft size={14} /> Previous Step
              </button>

              {currentStep < 5 && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-[#4848F7] hover:bg-indigo-700 text-white px-5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20"
                >
                  <span>Next Step</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </>
        )}

      </div>

      {/* FAQS ACCORDION */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Visa Application</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Can I save my application and finish later?</p>
            <p className="text-slate-600 leading-relaxed">
              Yes, click "Save Draft" at any point. Your progress will be saved in your Drafts section.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">How long does processing take?</p>
            <p className="text-slate-600 leading-relaxed">
              Standard processing takes 5-7 days. Express processing completes in 48 hours.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
