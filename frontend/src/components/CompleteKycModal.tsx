import React, { useState, useRef } from "react";
import { API_V1_URL } from "../config/api";
import {
  ShieldCheck,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  Building,
  User,
  Info,
  ArrowRight,
  Globe,
  Check,
  RefreshCw,
  Sparkles,
  Lock
} from "lucide-react";

export interface CompleteKycModalProps {
  applicant: {
    id: string;
    _id?: string;
    userId?: string;
    name: string;
    email: string;
    mobile?: string;
    country: string;
    flag?: string;
    nationality?: string;
    kycStatus?: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export interface SlotVerificationState {
  file: File | null;
  fileName: string | null;
  isVerifying: boolean;
  isVerified: boolean;
  verifiedType: string | null;
  error: string | null;
}

export default function CompleteKycModal({ applicant, onClose, onSuccess }: CompleteKycModalProps) {
  const isIndia = applicant.country === "India" || applicant.nationality === "Indian" || !applicant.country;
  const isUSA = applicant.country === "United States" || applicant.country === "USA";
  const isUK = applicant.country === "United Kingdom" || applicant.country === "UK";
  const isCanada = applicant.country === "Canada";

  // Form Field State
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [panCardNumber, setPanCardNumber] = useState("");
  const [ssnOrNationalId, setSsnOrNationalId] = useState("");

  // File Upload Slot States
  const [idDocState, setIdDocState] = useState<SlotVerificationState>({
    file: null,
    fileName: null,
    isVerifying: false,
    isVerified: false,
    verifiedType: null,
    error: null
  });

  const [addressProofState, setAddressProofState] = useState<SlotVerificationState>({
    file: null,
    fileName: null,
    isVerifying: false,
    isVerified: false,
    verifiedType: null,
    error: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // File Input Refs
  const idFileInputRef = useRef<HTMLInputElement>(null);
  const addressFileInputRef = useRef<HTMLInputElement>(null);

  // Format Validations for India
  const cleanAadhaar = aadhaarNumber.replace(/\D/g, "");
  const isAadhaarValid = cleanAadhaar.length === 12;
  const cleanPan = panCardNumber.toUpperCase().trim();
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const isPanValid = panRegex.test(cleanPan);

  // Overall Form Validation Guard
  const isFormValid = isIndia
    ? isAadhaarValid && isPanValid && idDocState.isVerified && addressProofState.isVerified
    : ssnOrNationalId.trim().length > 0 && idDocState.isVerified && addressProofState.isVerified;

  // Handle ID Card File Selection & Gemini AI Verification
  const handleIdDocFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);

    // Pre-check format validation for India before calling Gemini API
    if (isIndia) {
      if (!isAadhaarValid) {
        setIdDocState({
          file: null,
          fileName: null,
          isVerifying: false,
          isVerified: false,
          verifiedType: null,
          error: "Please enter a valid 12-digit Aadhaar Card Number before selecting document file."
        });
        return;
      }
      if (!isPanValid) {
        setIdDocState({
          file: null,
          fileName: null,
          isVerifying: false,
          isVerified: false,
          verifiedType: null,
          error: "Please enter a valid 10-character PAN Card Number (e.g. ABCDE1234F) before selecting document file."
        });
        return;
      }
    }

    // Set Loading/Verifying State
    setIdDocState({
      file,
      fileName: file.name,
      isVerifying: true,
      isVerified: false,
      verifiedType: null,
      error: null
    });

    let completed = false;
    let clientAttempts = 0;

    while (!completed && clientAttempts < 15) {
      clientAttempts++;
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("slotType", "idCard");
        formData.append("typedAadhaarNumber", cleanAadhaar);
        formData.append("typedPanCardNumber", cleanPan);
        formData.append("typedSsnOrNationalId", ssnOrNationalId.trim());
        formData.append("country", applicant.country || "India");

        const res = await fetch(`${API_V1_URL}/applicant/verify-kyc-document`, {
          method: "POST",
          body: formData
        });

        let json: any = null;
        try {
          json = await res.json();
        } catch (e) {}

        if (res.ok && json) {
          if (json.success && json.verificationStatus === "verified") {
            setIdDocState({
              file,
              fileName: file.name,
              isVerifying: false,
              isVerified: true,
              verifiedType: json.documentType || "Government ID",
              error: null
            });
            completed = true;
            break;
          } else if (json.verificationStatus === "error" || json.verificationStatus === "busy") {
            // Service busy — keep loading and retrying silently in background!
            await new Promise((resolve) => setTimeout(resolve, 2000));
            continue;
          } else {
            // Real document rejection (unreadable, wrong_type, number_mismatch, format_error)
            setIdDocState({
              file: null,
              fileName: null,
              isVerifying: false,
              isVerified: false,
              verifiedType: null,
              error: json.message || "Gemini AI could not confirm this document is a valid Aadhaar/PAN Card."
            });
            completed = true;
            break;
          }
        } else {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } catch (err) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    if (!completed) {
      setIdDocState({
        file: null,
        fileName: null,
        isVerifying: false,
        isVerified: false,
        verifiedType: null,
        error: "Verification scan timed out. Please select the file again to retry."
      });
    }

    if (idFileInputRef.current) idFileInputRef.current.value = "";
  };

  // Handle Address Proof File Selection & Gemini AI Verification
  const handleAddressProofFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);

    setAddressProofState({
      file,
      fileName: file.name,
      isVerifying: true,
      isVerified: false,
      verifiedType: null,
      error: null
    });

    let completed = false;
    let clientAttempts = 0;

    while (!completed && clientAttempts < 15) {
      clientAttempts++;
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("slotType", "addressProof");
        formData.append("country", applicant.country || "India");

        const res = await fetch(`${API_V1_URL}/applicant/verify-kyc-document`, {
          method: "POST",
          body: formData
        });

        let json: any = null;
        try {
          json = await res.json();
        } catch (e) {}

        if (res.ok && json) {
          if (json.success && json.verificationStatus === "verified") {
            setAddressProofState({
              file,
              fileName: file.name,
              isVerifying: false,
              isVerified: true,
              verifiedType: json.documentType || "Address Proof",
              error: null
            });
            completed = true;
            break;
          } else if (json.verificationStatus === "error" || json.verificationStatus === "busy") {
            // Service busy — keep loading and retrying silently in background!
            await new Promise((resolve) => setTimeout(resolve, 2000));
            continue;
          } else {
            // Real document rejection (unreadable, wrong_type)
            setAddressProofState({
              file: null,
              fileName: null,
              isVerifying: false,
              isVerified: false,
              verifiedType: null,
              error: json.message || "Gemini AI could not confirm this is an accepted Residential Address Proof."
            });
            completed = true;
            break;
          }
        } else {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } catch (err) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    if (!completed) {
      setAddressProofState({
        file: null,
        fileName: null,
        isVerifying: false,
        isVerified: false,
        verifiedType: null,
        error: "Verification scan timed out. Please select the file again to retry."
      });
    }

    if (addressFileInputRef.current) addressFileInputRef.current.value = "";
  };

  // Final Form Submission Handler
  const handleSubmitKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setErrorMsg("Please complete all format validations and verify both document scans with Gemini AI before submitting.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      let govtIdType = "National Identity & Address Proof";
      if (isIndia) govtIdType = "Aadhaar & PAN Card";
      else if (isUSA) govtIdType = "SSN & State ID";
      else if (isUK) govtIdType = "NINO & UK Driving Licence";
      else if (isCanada) govtIdType = "SIN & Canadian License";

      const res = await fetch(`${API_V1_URL}/applicant/submit-kyc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantId: applicant.id,
          userId: applicant.userId || applicant.id,
          name: applicant.name,
          email: applicant.email,
          country: applicant.country || "India",
          govtIdType,
          aadhaarNumber: cleanAadhaar,
          panCardNumber: cleanPan,
          ssnOrNationalId: ssnOrNationalId.trim(),
          idDocScan: idDocState.fileName || "Verified_ID_Scan.pdf",
          addressProofScan: addressProofState.fileName || "Verified_Address_Proof.pdf"
        })
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch (e) {}

      if (!res.ok || (json && json.success === false)) {
        throw new Error(json?.message || json?.error?.message || "Failed to submit KYC verification documents.");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("phantom_customer_kyc_status", "Under Audit");
      }
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while submitting KYC details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={idFileInputRef}
        onChange={handleIdDocFileSelect}
        accept="image/*,application/pdf"
        className="hidden"
      />
      <input
        type="file"
        ref={addressFileInputRef}
        onChange={handleAddressProofFileSelect}
        accept="image/*,application/pdf"
        className="hidden"
      />

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 text-slate-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4848F7] to-indigo-700 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20 text-indigo-100 font-mono">
                  Identity Audit • {applicant.country}
                </span>
                <h2 className="text-xl font-black tracking-tight mt-0.5">Complete KYC Verification</h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer border border-white/20"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitKyc} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* User Meta Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Applicant</span>
              <strong className="text-slate-900 text-sm font-extrabold">{applicant.name}</strong>
              <p className="text-slate-500 font-mono">{applicant.id} • {applicant.email}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Residency Jurisdiction</span>
              <span className="font-bold text-slate-800 bg-white px-3 py-1 rounded-lg border border-slate-200 inline-block font-sans">
                {applicant.flag || "🌐"} {applicant.country}
              </span>
            </div>
          </div>

          {/* Dynamic Country Identification Fields */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#4848F7]" />
              {isIndia
                ? "Government Identity Numbers (India)"
                : isUSA
                ? "Government Identification (United States)"
                : isUK
                ? "Government Identification (United Kingdom)"
                : isCanada
                ? "Government Identification (Canada)"
                : `Government Identification (${applicant.country})`}
            </h3>

            {isIndia ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Aadhaar Number Field with Format Validation */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Aadhaar Card Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="12-digit Aadhaar (e.g. 1234 5678 9012)"
                    maxLength={14}
                    value={aadhaarNumber}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, "");
                      const formatted = clean.replace(/(\d{4})(?=\d)/g, "$1 ");
                      setAadhaarNumber(formatted);
                    }}
                    className={`w-full text-xs px-3.5 py-2.5 rounded-xl border font-mono font-bold text-slate-900 focus:outline-none transition ${
                      aadhaarNumber && !isAadhaarValid
                        ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                        : isAadhaarValid
                        ? "border-emerald-400 bg-emerald-50/20 focus:border-emerald-500"
                        : "border-slate-200 bg-white focus:border-[#4848F7]"
                    }`}
                  />
                  {aadhaarNumber && !isAadhaarValid && (
                    <p className="text-[10px] text-rose-600 font-bold mt-1 flex items-center gap-1">
                      <AlertCircle size={10} /> Aadhaar must be exactly 12 digits (e.g. 1234 5678 9012).
                    </p>
                  )}
                  {isAadhaarValid && (
                    <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                      <CheckCircle2 size={10} /> Valid 12-digit Aadhaar Card format.
                    </p>
                  )}
                </div>

                {/* PAN Card Number Field with Format Validation */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    PAN Card Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="10-character PAN (e.g. ABCDE1234F)"
                    maxLength={10}
                    value={panCardNumber}
                    onChange={(e) => setPanCardNumber(e.target.value.toUpperCase())}
                    className={`w-full text-xs px-3.5 py-2.5 rounded-xl border font-mono font-bold text-slate-900 uppercase focus:outline-none transition ${
                      panCardNumber && !isPanValid
                        ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                        : isPanValid
                        ? "border-emerald-400 bg-emerald-50/20 focus:border-emerald-500"
                        : "border-slate-200 bg-white focus:border-[#4848F7]"
                    }`}
                  />
                  {panCardNumber && !isPanValid && (
                    <p className="text-[10px] text-rose-600 font-bold mt-1 flex items-center gap-1">
                      <AlertCircle size={10} /> PAN must be 5 letters, 4 numbers, 1 letter (e.g. ABCDE1234F).
                    </p>
                  )}
                  {isPanValid && (
                    <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                      <CheckCircle2 size={10} /> Valid 10-character PAN format.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  {isUSA
                    ? "Social Security Number (SSN) / Driver's License No."
                    : isUK
                    ? "National Insurance Number (NINO) / Passport No."
                    : isCanada
                    ? "Social Insurance Number (SIN) / Driver's License"
                    : "National Identity / Passport / Tax Registration ID"}{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={
                    isUSA
                      ? "XXX-XX-XXXX or Driver's License No."
                      : isUK
                      ? "QQ123456C or UK Passport No."
                      : "Enter National Identity Number"
                  }
                  value={ssnOrNationalId}
                  onChange={(e) => setSsnOrNationalId(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono font-bold text-slate-900 focus:outline-none focus:border-[#4848F7]"
                />
              </div>
            )}

            {/* Document Scans Upload Section */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#4848F7]" /> Real-Time Gemini AI Verification Scans
                </span>
                <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 font-bold flex items-center gap-1">
                  <Sparkles size={11} /> Gemini 2.0 AI Guard
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ID Scan Upload Box */}
                <div
                  className={`p-4 rounded-2xl border-2 border-dashed text-center flex flex-col items-center justify-center gap-2 transition relative ${
                    idDocState.isVerifying
                      ? "border-indigo-400 bg-indigo-50/40"
                      : idDocState.isVerified
                      ? "border-emerald-400 bg-emerald-50/30"
                      : idDocState.error
                      ? "border-rose-400 bg-rose-50/30"
                      : "border-slate-300 bg-slate-50 hover:bg-indigo-50/40"
                  }`}
                >
                  <FileText className={`w-7 h-7 ${idDocState.isVerified ? "text-emerald-600" : idDocState.error ? "text-rose-500" : "text-[#4848F7]"}`} />

                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {isIndia ? "Aadhaar / PAN Card Scan" : "Government ID Scan"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">PNG, JPG, PDF (Max 5MB)</span>
                  </div>

                  {/* Slot States */}
                  {idDocState.isVerifying && (
                    <div className="flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-xl font-bold text-[11px] animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                      <span>Gemini AI Verifying...</span>
                    </div>
                  )}

                  {idDocState.isVerified && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-300 font-extrabold text-[11px] mx-auto">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified: {idDocState.verifiedType}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono truncate max-w-[180px]">{idDocState.fileName}</p>
                      <button
                        type="button"
                        onClick={() => idFileInputRef.current?.click()}
                        className="text-[10px] text-indigo-600 underline font-bold cursor-pointer"
                      >
                        Change File
                      </button>
                    </div>
                  )}

                  {idDocState.error && (
                    <div className="space-y-2">
                      <div className="p-2 bg-rose-100/80 border border-rose-300 rounded-xl text-rose-800 text-[11px] font-bold text-left space-y-1">
                        <div className="flex items-center gap-1 text-rose-700 font-extrabold">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Verification Rejected</span>
                        </div>
                        <p className="text-[10px] text-rose-700 leading-tight">{idDocState.error}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => idFileInputRef.current?.click()}
                        className="px-3 py-1 bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 text-[11px] font-extrabold rounded-lg shadow-2xs transition cursor-pointer"
                      >
                        Try Different File
                      </button>
                    </div>
                  )}

                  {!idDocState.isVerifying && !idDocState.isVerified && !idDocState.error && (
                    <button
                      type="button"
                      onClick={() => idFileInputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-[11px] font-bold rounded-xl transition cursor-pointer shadow-2xs"
                    >
                      Browse & Select File
                    </button>
                  )}
                </div>

                {/* Address Proof Upload Box */}
                <div
                  className={`p-4 rounded-2xl border-2 border-dashed text-center flex flex-col items-center justify-center gap-2 transition relative ${
                    addressProofState.isVerifying
                      ? "border-indigo-400 bg-indigo-50/40"
                      : addressProofState.isVerified
                      ? "border-emerald-400 bg-emerald-50/30"
                      : addressProofState.error
                      ? "border-rose-400 bg-rose-50/30"
                      : "border-slate-300 bg-slate-50 hover:bg-indigo-50/40"
                  }`}
                >
                  <Building className={`w-7 h-7 ${addressProofState.isVerified ? "text-emerald-600" : addressProofState.error ? "text-rose-500" : "text-[#4848F7]"}`} />

                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Residential Address Proof</span>
                    <span className="text-[10px] text-slate-400 font-medium">Utility Bill, Passport, Rent Agreement</span>
                  </div>

                  {/* Slot States */}
                  {addressProofState.isVerifying && (
                    <div className="flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-xl font-bold text-[11px] animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                      <span>Gemini AI Verifying...</span>
                    </div>
                  )}

                  {addressProofState.isVerified && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-300 font-extrabold text-[11px] mx-auto">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified: {addressProofState.verifiedType}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono truncate max-w-[180px]">{addressProofState.fileName}</p>
                      <button
                        type="button"
                        onClick={() => addressFileInputRef.current?.click()}
                        className="text-[10px] text-indigo-600 underline font-bold cursor-pointer"
                      >
                        Change File
                      </button>
                    </div>
                  )}

                  {addressProofState.error && (
                    <div className="space-y-2">
                      <div className="p-2 bg-rose-100/80 border border-rose-300 rounded-xl text-rose-800 text-[11px] font-bold text-left space-y-1">
                        <div className="flex items-center gap-1 text-rose-700 font-extrabold">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Verification Rejected</span>
                        </div>
                        <p className="text-[10px] text-rose-700 leading-tight">{addressProofState.error}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addressFileInputRef.current?.click()}
                        className="px-3 py-1 bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 text-[11px] font-extrabold rounded-lg shadow-2xs transition cursor-pointer"
                      >
                        Try Different File
                      </button>
                    </div>
                  )}

                  {!addressProofState.isVerifying && !addressProofState.isVerified && !addressProofState.error && (
                    <button
                      type="button"
                      onClick={() => addressFileInputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-[11px] font-bold rounded-xl transition cursor-pointer shadow-2xs"
                    >
                      Browse & Select File
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`px-6 py-2.5 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer ${
                isFormValid
                  ? "bg-[#4848F7] hover:bg-[#3737d6] shadow-[#4848F7]/25"
                  : "bg-slate-300 cursor-not-allowed opacity-60 shadow-none"
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting Verification...</span>
                </>
              ) : (
                <>
                  {!isFormValid && <Lock className="w-3.5 h-3.5 opacity-70" />}
                  <span>Submit KYC Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
