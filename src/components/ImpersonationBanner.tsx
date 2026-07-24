"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, LogOut, Clock } from "lucide-react";
import { useVisa } from "../context/VisaContext";

export default function ImpersonationBanner() {
  const { impersonationState, stopImpersonation } = useVisa();
  const [remainingSeconds, setRemainingSeconds] = useState(1800); // 30 mins

  useEffect(() => {
    if (!impersonationState.isActive) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          stopImpersonation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [impersonationState.isActive, stopImpersonation]);

  if (!impersonationState.isActive) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return (
    <div className="w-full bg-amber-600/90 text-white px-4 py-2 flex items-center justify-between shadow-lg text-xs font-medium z-50 animate-pulse">
      <div className="flex items-center gap-2">
        <AlertTriangle size={16} className="text-amber-200" />
        <span>
          <strong>SUPER ADMIN IMPERSONATION ACTIVE:</strong> Viewing platform as tenant{" "}
          <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-200">{impersonationState.targetCompanyName}</code> (ID: {impersonationState.targetCompanyId})
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-mono text-amber-100">
          <Clock size={14} />
          <span>Auto-Expire in {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
        </div>
        <button
          onClick={stopImpersonation}
          className="bg-black/40 hover:bg-black/60 px-2.5 py-1 rounded flex items-center gap-1 transition text-amber-100"
        >
          <LogOut size={12} />
          <span>Exit Impersonation</span>
        </button>
      </div>
    </div>
  );
}
