"use client";

import React, { useState } from "react";
import { useVisa, Application, VisaStatus } from "../context/VisaContext";
import {
  ShieldCheck,
  FileText,
  Check,
  X,
  AlertCircle,
  Clock,
  Eye,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function StaffPortal() {
  const {
    applications,
    updateApplicationStatus,
    updateApplicationDocs
  } = useVisa();

  // Selected application inside the review queue
  const [selectedAppId, setSelectedAppId] = useState<string>("PV-2026-0044"); // Defaults to the Submitted one for easy review

  // Get applications that need review (Submitted, Docs Pending, Embassy Processing)
  const queueApps = applications.filter(
    (app) => app.status === "Submitted" || app.status === "Docs Pending" || app.status === "Embassy Processing"
  );

  const selectedApp = applications.find((app) => app.id === selectedAppId);

  // Reject dialog states
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectDocKey, setRejectDocKey] = useState<"passport" | "photo" | "nocLetter" | "sponsorLetter" | null>(null);
  const [rejectReasonCode, setRejectReasonCode] = useState("DOC_BLURRED");
  const [customRejectText, setCustomRejectText] = useState("");

  const reasonCodesMap: Record<string, string> = {
    DOC_BLURRED: "Document scan is blurry and illegible.",
    SEAL_MISSING: "Notary stamp or official signature is missing.",
    EXPIRED_CREDENTIAL: "Uploaded credential has expired prior to travel date.",
    ITINERARY_FAIL: "Flight layover does not align with transit rules."
  };

  const handleDocumentApprove = (docKey: "passport" | "photo" | "nocLetter" | "sponsorLetter") => {
    if (!selectedApp) return;
    updateApplicationDocs(selectedApp.id, docKey, "verified");
  };

  const handleDocumentRejectTrigger = (docKey: "passport" | "photo" | "nocLetter" | "sponsorLetter") => {
    setRejectDocKey(docKey);
    setShowRejectDialog(true);
    setCustomRejectText("");
  };

  const submitRejectDocument = () => {
    if (!selectedApp || !rejectDocKey) return;
    
    const reasonText = customRejectText.trim() || reasonCodesMap[rejectReasonCode];
    
    // Update the document to needs_review in global state
    updateApplicationDocs(selectedApp.id, rejectDocKey, "needs_review");
    
    // Force general status back to Docs Pending and attach rejection explanation
    updateApplicationStatus(selectedApp.id, "Docs Pending", reasonText);

    setShowRejectDialog(false);
    setRejectDocKey(null);
  };

  // Final actions on application
  const handleDispatchToEmbassy = () => {
    if (!selectedApp) return;
    updateApplicationStatus(selectedApp.id, "Embassy Processing");
  };

  const handleFinalApprove = () => {
    if (!selectedApp) return;
    updateApplicationStatus(selectedApp.id, "Approved");
  };

  const handleFinalReject = () => {
    if (!selectedApp) return;
    updateApplicationStatus(
      selectedApp.id,
      "Rejected",
      "Consular review concluded: Application refused due to mismatch in submitted travel declarations."
    );
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6 overflow-hidden">
      
      {/* Left side: Queue Navigation */}
      <div className="w-full lg:w-[320px] bg-brand-slate border border-brand-gold/15 rounded-lg flex flex-col">
        <div className="p-4 border-b border-brand-gold/15 bg-brand-midnight/60">
          <h3 className="font-outfit font-semibold text-sm text-brand-gold flex items-center gap-1.5">
            <ShieldCheck size={16} />
            <span>Embassy Review Queue</span>
          </h3>
          <p className="text-[10px] text-brand-paper/50 mt-0.5">
            KYC audits & biometric scan clearances
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[300px] lg:max-h-none">
          {/* Bulk Staff Actions Bar */}
          <div className="flex items-center justify-between bg-brand-midnight border border-brand-gold/20 p-2 rounded text-[10px] text-brand-gold mb-2">
            <span className="font-semibold">Bulk Queue Tools:</span>
            <div className="flex gap-1">
              <button
                onClick={() => alert("Bulk Assign: 3 applications assigned to Senior Auditor.")}
                className="bg-brand-gold/20 hover:bg-brand-gold/30 px-2 py-0.5 rounded"
              >
                Bulk Assign
              </button>
              <button
                onClick={() => alert("Bulk Status Update: Transitioned selected apps to 'Embassy Processing'.")}
                className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded"
              >
                Bulk Advance
              </button>
            </div>
          </div>

          {queueApps.map((app, idx) => {
            const isSlaBreached = idx === 0; // Mock SLA flag
            return (
              <button
                key={app.id}
                onClick={() => setSelectedAppId(app.id)}
                className={`w-full text-left p-3 rounded-lg border text-xs transition flex flex-col space-y-1.5 ${
                  selectedAppId === app.id
                    ? "bg-brand-gold/10 border-brand-gold text-brand-gold font-semibold shadow-lg shadow-brand-gold/5"
                    : "bg-brand-midnight/40 border-brand-gold/5 text-brand-paper/60 hover:text-brand-paper"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-mono text-[9px] text-brand-paper/40">{app.id}</span>
                  <div className="flex items-center gap-1">
                    {isSlaBreached && (
                      <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-1 py-0.2 rounded flex items-center gap-0.5 font-bold">
                        <Clock size={10} /> SLA 80%
                      </span>
                    )}
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      app.status === "Submitted"
                        ? "bg-brand-teal/20 text-brand-teal"
                        : app.status === "Docs Pending"
                        ? "bg-brand-red/20 text-brand-red"
                        : "bg-amber-500/20 text-amber-500"
                    }`}>
                      {app.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="font-semibold truncate">{app.travelerName}</p>
                <p className="text-[10px] text-brand-paper/50">
                  {app.destination} ({app.visaType})
                </p>
              </button>
            );
          })}

          {queueApps.length === 0 && (
            <div className="py-8 text-center text-xs text-brand-paper/30 italic">
              Queue clear. No applications pending.
            </div>
          )}
        </div>
      </div>

      {/* Right side: Inspection Details */}
      <div className="flex-1 bg-brand-slate border border-brand-gold/15 rounded-lg flex flex-col p-6 overflow-y-auto">
        {selectedApp ? (
          <div className="space-y-6">
            
            {/* Applicant Summary */}
            <div className="flex justify-between items-start flex-wrap gap-4 border-b border-brand-gold/15 pb-4">
              <div>
                <span className="text-xs text-brand-gold font-mono uppercase tracking-wider">Reviewing Application Profile</span>
                <h2 className="font-outfit text-2xl font-bold text-brand-paper mt-1">{selectedApp.travelerName}</h2>
                <p className="text-xs text-brand-paper/60">
                  Nationality: {selectedApp.nationality} | Destination: {selectedApp.destination} | Route: {selectedApp.visaType}
                </p>
              </div>

              <div className="text-right text-xs">
                <span className="text-brand-paper/40 block">Submitted On</span>
                <span className="font-mono text-brand-paper font-semibold">{selectedApp.submissionDate}</span>
              </div>
            </div>

            {/* Passport Detail fields */}
            <div className="bg-brand-midnight/40 p-4 rounded-lg border border-brand-gold/5 space-y-3">
              <h4 className="text-xs uppercase text-brand-gold font-bold tracking-wider">Passport Bio Details</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-brand-paper/40 block">Passport Number</span>
                  <span className="font-mono font-bold">{selectedApp.passportNumber}</span>
                </div>
                <div>
                  <span className="text-brand-paper/40 block">Passport Expiry</span>
                  <span className="font-mono font-semibold">{selectedApp.passportExpiry}</span>
                </div>
                <div>
                  <span className="text-brand-paper/40 block">Date of Birth</span>
                  <span>{selectedApp.dob}</span>
                </div>
                <div>
                  <span className="text-brand-paper/40 block">Travel Dates</span>
                  <span>{selectedApp.travelDates}</span>
                </div>
              </div>
            </div>

            {/* Credentials Queue Checklist */}
            <div className="space-y-4">
              <h3 className="font-outfit font-semibold text-lg text-brand-gold">Verify Document Credentials</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(selectedApp.verifiedDocs).map(([key, val]) => {
                  const docLabel = key === "passport" ? "Passport Scan" : key === "photo" ? "White Photo" : key === "nocLetter" ? "Employer NOC Letter" : "Sponsor statement";
                  return (
                    <div
                      key={key}
                      className="bg-brand-midnight/40 border border-brand-gold/10 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-sm font-semibold capitalize">{docLabel}</span>
                        <div className="text-[10px] text-brand-paper/40 flex items-center gap-1.5">
                          <span>Verification State:</span>
                          <span className={`font-mono font-semibold ${
                            val === "verified"
                              ? "text-brand-teal"
                              : val === "needs_review"
                              ? "text-brand-red"
                              : "text-amber-500"
                          }`}>
                            {val.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Simulate view doc */}
                        <button
                          onClick={() => alert(`Reviewing image preview for ${docLabel}. AI check passed with 94.2% confidence.`)}
                          className="bg-brand-midnight hover:bg-brand-slate border border-brand-gold/25 text-brand-paper text-xs px-2.5 py-1.5 rounded transition flex items-center gap-1"
                        >
                          <Eye size={12} />
                          <span>View Scan</span>
                        </button>

                        <button
                          onClick={() => handleDocumentRejectTrigger(key as any)}
                          className="bg-brand-red/10 hover:bg-brand-red hover:text-brand-paper text-brand-red border border-brand-red/35 text-xs px-2.5 py-1.5 rounded transition flex items-center gap-1"
                        >
                          <X size={12} />
                          <span>Reject</span>
                        </button>

                        <button
                          onClick={() => handleDocumentApprove(key as any)}
                          className="bg-brand-teal/15 hover:bg-brand-teal hover:text-brand-paper text-brand-teal border border-brand-teal/35 text-xs px-2.5 py-1.5 rounded transition flex items-center gap-1"
                        >
                          <Check size={12} />
                          <span>Verify</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Final Dispatch Operations */}
            <div className="border-t border-brand-gold/15 pt-6 flex flex-col sm:flex-row gap-3 sm:justify-between items-center bg-brand-midnight/20 p-4 rounded-lg">
              <div className="text-xs text-brand-paper/60 space-y-1">
                <p className="font-semibold text-brand-paper">Final Consular Disposition</p>
                <p>Verify all files before dispatching to the official Schengen/UK visa ledger.</p>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleFinalReject}
                  className="flex-1 bg-brand-red hover:bg-red-600 text-brand-paper font-semibold text-xs px-4 py-2 rounded transition"
                >
                  Refuse Visa
                </button>
                <button
                  onClick={handleDispatchToEmbassy}
                  className="flex-1 bg-brand-midnight border border-brand-gold/20 hover:bg-brand-slate text-brand-gold font-semibold text-xs px-4 py-2 rounded transition"
                >
                  Send to Embassy
                </button>
                <button
                  onClick={handleFinalApprove}
                  className="flex-1 bg-brand-teal hover:bg-emerald-600 text-brand-paper font-semibold text-xs px-4 py-2 rounded transition"
                >
                  Approve Visa
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
            <CheckCircle2 size={48} className="text-brand-teal/40" />
            <h3 className="font-outfit text-lg font-semibold">Review Queue Clean</h3>
            <p className="text-sm text-brand-paper/50 max-w-sm">
              All applications are either successfully dispatched, refused, or approved. Use the Agent portal to submit new visa files.
            </p>
          </div>
        )}
      </div>

      {/* Reject dialog overlay */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-midnight/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-brand-slate border border-brand-gold/30 rounded-lg p-6 space-y-5 shadow-2xl">
            <div>
              <h3 className="font-outfit font-semibold text-lg text-brand-gold">Reject Credential</h3>
              <p className="text-xs text-brand-paper/60 mt-1">
                Select a reason code. This will flag the file for rectification on the Customer & Agent dashboards.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-brand-paper/50 mb-1">Standard Reason Code</label>
                <select
                  value={rejectReasonCode}
                  onChange={(e) => setRejectReasonCode(e.target.value)}
                  className="w-full bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-sm text-brand-paper outline-none focus:border-brand-gold"
                >
                  <option value="DOC_BLURRED">DOC_BLURRED: Document scan is blurry</option>
                  <option value="SEAL_MISSING">SEAL_MISSING: Missing stamp or seal</option>
                  <option value="EXPIRED_CREDENTIAL">EXPIRED_CREDENTIAL: Credential expired</option>
                  <option value="ITINERARY_FAIL">ITINERARY_FAIL: layover limits exceeded</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-brand-paper/50 mb-1">Custom Overwrite Remarks (Optional)</label>
                <textarea
                  value={customRejectText}
                  onChange={(e) => setCustomRejectText(e.target.value)}
                  placeholder="Specify exact review criteria failure..."
                  className="w-full h-20 bg-brand-midnight border border-brand-gold/20 rounded px-3 py-2 text-xs text-brand-paper outline-none focus:border-brand-gold resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end text-xs">
              <button
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectDocKey(null);
                }}
                className="text-brand-paper/60 hover:text-brand-paper py-2 px-3"
              >
                Cancel
              </button>
              <button
                onClick={submitRejectDocument}
                className="bg-brand-red hover:bg-red-600 text-brand-paper font-semibold px-4 py-2 rounded transition"
              >
                Reject & Dispatch Alert
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
