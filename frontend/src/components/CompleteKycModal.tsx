import React, { useState } from "react";
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
  Check
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

export default function CompleteKycModal({ applicant, onClose, onSuccess }: CompleteKycModalProps) {
  const isIndia = applicant.country === "India" || applicant.nationality === "Indian";
  const isUSA = applicant.country === "United States" || applicant.country === "USA";
  const isUK = applicant.country === "United Kingdom" || applicant.country === "UK";
  const isCanada = applicant.country === "Canada";
  const isAustralia = applicant.country === "Australia";

  // Form State
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [panCardNumber, setPanCardNumber] = useState("");
  const [ssnOrNationalId, setSsnOrNationalId] = useState("");

  // File Upload State Mock
  const [idDocFileName, setIdDocFileName] = useState<string | null>(null);
  const [addressProofFileName, setAddressProofFileName] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Validation
  const validateForm = (): boolean => {
    setErrorMsg(null);
    if (isIndia) {
      if (!aadhaarNumber.trim()) {
        setErrorMsg("Aadhaar Card Number is required for India KYC verification.");
        return false;
      }
      const cleanAadhaar = aadhaarNumber.replace(/\D/g, "");
      if (cleanAadhaar.length !== 12) {
        setErrorMsg("Aadhaar Card Number must be exactly 12 digits (e.g. 1234-5678-9012).");
        return false;
      }

      if (!panCardNumber.trim()) {
        setErrorMsg("PAN Card Number is required for India KYC verification.");
        return false;
      }
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(panCardNumber.trim().toUpperCase())) {
        setErrorMsg("PAN Card Number format is invalid (e.g. ABCDE1234F).");
        return false;
      }
    } else if (isUSA) {
      if (!ssnOrNationalId.trim()) {
        setErrorMsg("SSN or State Driver's License Number is required for US KYC verification.");
        return false;
      }
    } else {
      if (!ssnOrNationalId.trim()) {
        setErrorMsg(`National Identification / Passport Number is required for ${applicant.country} KYC verification.`);
        return false;
      }
    }

    if (!idDocFileName) {
      setErrorMsg("Please upload your government-issued Identity Document scan.");
      return false;
    }

    if (!addressProofFileName) {
      setErrorMsg("Please upload your Residential Address Proof document scan.");
      return false;
    }

    return true;
  };

  const handleSubmitKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
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
          userId: applicant.userId,
          govtIdType,
          aadhaarNumber: aadhaarNumber.replace(/\D/g, ""),
          panCardNumber: panCardNumber.toUpperCase().trim(),
          ssnOrNationalId: ssnOrNationalId.trim(),
          idDocScan: idDocFileName,
          addressProofScan: addressProofFileName
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to submit KYC verification documents.");
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
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
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
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono font-bold text-slate-900 focus:outline-none focus:border-[#4848F7]"
                  />
                </div>

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
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono font-bold text-slate-900 uppercase focus:outline-none focus:border-[#4848F7]"
                  />
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
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#4848F7]" /> Upload Verification Document Scans
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* ID Scan Upload Box */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center flex flex-col items-center justify-center gap-2 hover:bg-indigo-50/50 transition">
                  <FileText className="w-7 h-7 text-[#4848F7]" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {isIndia ? "Aadhaar / PAN Card Scan" : "Government ID Scan"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">PNG, JPG, PDF (Max 5MB)</span>
                  </div>

                  {idDocFileName ? (
                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-200 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="truncate max-w-[140px]">{idDocFileName}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIdDocFileName(`${applicant.name.replace(/\s+/g, "_")}_ID_Scan.pdf`)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg transition cursor-pointer shadow-2xs"
                    >
                      Browse & Select File
                    </button>
                  )}
                </div>

                {/* Address Proof Upload Box */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center flex flex-col items-center justify-center gap-2 hover:bg-indigo-50/50 transition">
                  <Building className="w-7 h-7 text-[#4848F7]" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Residential Address Proof</span>
                    <span className="text-[10px] text-slate-400 font-medium">Utility Bill, Passport, Rent Agreement</span>
                  </div>

                  {addressProofFileName ? (
                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-200 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="truncate max-w-[140px]">{addressProofFileName}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAddressProofFileName(`${applicant.name.replace(/\s+/g, "_")}_AddressProof.pdf`)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg transition cursor-pointer shadow-2xs"
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
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#4848F7] hover:bg-[#3737d6] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-[#4848F7]/25 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting Verification...</span>
                </>
              ) : (
                <>
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
