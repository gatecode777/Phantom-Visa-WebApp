import React from "react";

interface MRZStripProps {
  passportNumber?: string;
  travelerName?: string;
  nationality?: string;
  dob?: string;
  expiry?: string;
}

export default function MRZStrip({
  passportNumber = "PV9928371",
  travelerName = "JOHN DOE",
  nationality = "USA",
  dob = "850101",
  expiry = "351231",
}: MRZStripProps) {
  // Format the name: "LASTNAME<<FIRSTNAME"
  const cleanName = travelerName.toUpperCase().replace(/[^A-Z]/g, "<");
  const padName = (cleanName + "<".repeat(39)).slice(0, 39);

  // Format passport and country
  const countryCode = (nationality.slice(0, 3).toUpperCase() + "XXX").slice(0, 3);
  const padPassport = (passportNumber.toUpperCase() + "<".repeat(9)).slice(0, 9);
  
  // Format DOB (YYMMDD) and Expiry (YYMMDD)
  const cleanDob = dob.replace(/[^0-9]/g, "").slice(2, 8) || "900101";
  const cleanExpiry = expiry.replace(/[^0-9]/g, "").slice(2, 8) || "301231";

  const row1 = `P<${countryCode}${padName}`;
  const row2 = `${padPassport}<${countryCode}${cleanDob}M${cleanExpiry}<<<<<<<<<<<<<<<`;

  return (
    <div className="bg-brand-midnight/40 border border-brand-gold/10 p-3 rounded font-mono text-xs tracking-widest text-brand-gold/60 select-none overflow-x-auto whitespace-nowrap">
      <div className="leading-tight">{row1.slice(0, 44)}</div>
      <div className="leading-tight">{row2.slice(0, 44)}</div>
    </div>
  );
}
