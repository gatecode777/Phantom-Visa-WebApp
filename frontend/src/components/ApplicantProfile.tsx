"use client";

import React, { useState } from "react";
import {
  User,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Globe,
  FileText,
  Lock,
  Camera,
  Edit3,
  Plus,
  Trash2,
  Save,
  Bell,
  Key,
  Layers,
  Award,
  Users,
  Plane,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Briefcase
} from "lucide-react";

export interface CoTravelerRecord {
  id: string;
  fullName: string;
  relation: "Spouse" | "Child" | "Parent" | "Sibling" | "Friend";
  passportNumber: string;
  dob: string;
  kycStatus: "Verified" | "Pending";
}

interface ApplicantProfileProps {
  userSession?: any;
  onNavigateDocuments?: () => void;
  onNavigateApply?: () => void;
}

export default function ApplicantProfile({
  userSession,
  onNavigateDocuments,
  onNavigateApply
}: ApplicantProfileProps) {
  // Editable Personal Profile Form State
  const [profileForm, setProfileForm] = useState({
    firstName: "Vibhu",
    lastName: "Sharma",
    email: userSession?.user?.email || "vibhu@phantomvisa.com",
    phone: "+91 98765 43210",
    dob: "1992-06-15",
    gender: "Male",
    nationality: "Indian",
    address: "B-402, Highstreet Towers, MG Road",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    occupation: "Senior Software Consultant",
    employer: "TechCorp Solutions Pvt Ltd",
    memberId: "#APP-884920",
    membershipTier: "Gold Premium Applicant"
  });

  // Passport Vault State
  const [passportForm, setPassportForm] = useState({
    passportNumber: "Z9840281",
    passportType: "Regular Ordinary (Type P)",
    dateOfIssue: "2020-04-12",
    dateOfExpiry: "2030-04-11",
    placeOfIssue: "Regional Passport Office, Delhi",
    scannedStatus: "Verified & OCR Scanned"
  });

  // Saved Co-Travelers Dataset
  const [coTravelers, setCoTravelers] = useState<CoTravelerRecord[]>([
    {
      id: "TRAVELER-1",
      fullName: "Ananya Sharma",
      relation: "Spouse",
      passportNumber: "Z9840282",
      dob: "1994-05-14",
      kycStatus: "Verified"
    },
    {
      id: "TRAVELER-2",
      fullName: "Aarav Sharma",
      relation: "Child",
      passportNumber: "X1029481",
      dob: "2018-08-02",
      kycStatus: "Verified"
    }
  ]);

  // Security Preferences State
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [passportReminder, setPassportReminder] = useState(true);

  // Edit Mode Toggle
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Add Family Member Modal / Form State
  const [showAddTravelerModal, setShowAddTravelerModal] = useState(false);
  const [newTravelerForm, setNewTravelerForm] = useState({
    fullName: "",
    relation: "Spouse" as any,
    passportNumber: "",
    dob: ""
  });

  const handleAddTravelerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTravelerForm.fullName || !newTravelerForm.passportNumber) return;

    const newRec: CoTravelerRecord = {
      id: `TRAVELER-${Date.now()}`,
      fullName: newTravelerForm.fullName,
      relation: newTravelerForm.relation,
      passportNumber: newTravelerForm.passportNumber,
      dob: newTravelerForm.dob || "2000-01-01",
      kycStatus: "Verified"
    };

    setCoTravelers([...coTravelers, newRec]);
    setShowAddTravelerModal(false);
    setNewTravelerForm({ fullName: "", relation: "Spouse", passportNumber: "", dob: "" });
  };

  const handleRemoveTraveler = (id: string) => {
    setCoTravelers(coTravelers.filter((t) => t.id !== id));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & PROFILE SUMMARY BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Applicant Portal</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">My Profile</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Applicant Profile & Travel Identity Vault</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck size={12} className="text-emerald-600" /> 95% Profile Completeness
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Manage your personal travel identity, verified passport details, contact info, emergency contacts, travel history, and security preferences.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Edit3 size={16} />
            <span>{isEditing ? "Cancel Editing" : "Edit Profile Info"}</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: DASHBOARD STATISTICS CARDS GRID (6 CARDS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: KYC Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">KYC Verification</p>
          <p className="text-xl font-black text-emerald-600 mt-1 flex items-center gap-1">
            <CheckCircle2 size={16} /> Verified
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">Government ID checked</span>
        </div>

        {/* Card 2: Passport Validity */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-[#4848F7]">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Passport Validity</p>
          <p className="text-2xl font-black text-[#4848F7] mt-1">4 Years</p>
          <span className="text-[10px] text-[#4848F7] font-semibold">Valid until Apr 2030</span>
        </div>

        {/* Card 3: Total Visas Issued */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-indigo-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Visas Issued</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">04 Visas</p>
          <span className="text-[10px] text-indigo-600 font-medium">Schengen, UK, UAE, SG</span>
        </div>

        {/* Card 4: Travel History */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Travel History</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">12 Trips</p>
          <span className="text-[10px] text-slate-400 font-medium">International journeys</span>
        </div>

        {/* Card 5: Saved Co-Travelers */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Co-Travelers</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{coTravelers.length} Members</p>
          <span className="text-[10px] text-amber-600 font-medium">Family auto-fill saved</span>
        </div>

        {/* Card 6: Profile Completeness */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-600">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Profile Score</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">95%</p>
          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
            <Award size={10} /> Consular Ready
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: USER AVATAR & HERO IDENTITY CARD */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#4848F7] to-indigo-400 text-white flex items-center justify-center font-black text-3xl shadow-md border-4 border-white">
              {profileForm.firstName[0]}
              {profileForm.lastName[0]}
            </div>
            <button
              onClick={() => alert("Upload new avatar picture...")}
              className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-full hover:bg-[#4848F7] transition shadow-xs"
              title="Upload Avatar Photo"
            >
              <Camera size={14} />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-black text-slate-900">{profileForm.firstName} {profileForm.lastName}</h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                ⭐ {profileForm.membershipTier}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className="flex items-center gap-1"><Mail size={13} className="text-[#4848F7]" /> {profileForm.email}</span>
              <span className="flex items-center gap-1"><Phone size={13} className="text-[#4848F7]" /> {profileForm.phone}</span>
            </p>

            <p className="text-[11px] text-slate-400 font-mono">
              Applicant Member ID: <span className="font-bold text-slate-700">{profileForm.memberId}</span> &bull; Occupation: <span className="font-bold text-slate-700">{profileForm.occupation}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onNavigateApply && (
            <button
              onClick={onNavigateApply}
              className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plane size={15} /> Apply for New Visa
            </button>
          )}
        </div>
      </div>

      {/* Save Success Alert */}
      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Profile changes saved successfully to your travel identity vault!</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 4: PERSONAL & CONTACT DETAILS SUBFORM */}
      {/* ============================================================ */}
      <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <User size={16} className="text-[#4848F7]" />
            <span>Personal & Contact Information</span>
          </h3>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xs font-bold text-[#4848F7] hover:underline flex items-center gap-1"
            >
              <Edit3 size={13} /> Edit Fields
            </button>
          ) : (
            <button
              type="submit"
              className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
            >
              <Save size={13} /> Save Changes
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">First Name</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profileForm.firstName}
              onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
              className="w-full bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profileForm.lastName}
              onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
              className="w-full bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
            <input
              type="date"
              disabled={!isEditing}
              value={profileForm.dob}
              onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
              className="w-full bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Gender</label>
            <select
              disabled={!isEditing}
              value={profileForm.gender}
              onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
              className="w-full bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-medium"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nationality</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profileForm.nationality}
              onChange={(e) => setProfileForm({ ...profileForm, nationality: e.target.value })}
              className="w-full bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mobile Phone Number</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              className="w-full bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-medium"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Residential Street Address</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profileForm.address}
              onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
              className="w-full bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">City, State & Pincode</label>
            <input
              type="text"
              disabled={!isEditing}
              value={`${profileForm.city}, ${profileForm.state} - ${profileForm.pincode}`}
              onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
              className="w-full bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Occupation / Profession</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profileForm.occupation}
              onChange={(e) => setProfileForm({ ...profileForm, occupation: e.target.value })}
              className="w-full bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-medium"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Employer / Organization Name</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profileForm.employer}
              onChange={(e) => setProfileForm({ ...profileForm, employer: e.target.value })}
              className="w-full bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-medium"
            />
          </div>
        </div>
      </form>

      {/* ============================================================ */}
      {/* SECTION 5: VERIFIED PASSPORT INFORMATION VAULT CARD */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileText size={16} className="text-[#4848F7]" />
              <span>Verified Passport Information Vault</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Primary travel identity document used for consular auto-fill applications.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 size={12} /> {passportForm.scannedStatus}
            </span>

            {onNavigateDocuments && (
              <button
                onClick={onNavigateDocuments}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-lg transition border border-slate-200 cursor-pointer"
              >
                Update Passport Scans
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-500 block">Passport Number:</span>
            <span className="font-mono font-extrabold text-slate-900 text-base">{passportForm.passportNumber}</span>
          </div>

          <div>
            <span className="text-slate-500 block">Passport Booklet Type:</span>
            <span className="font-bold text-slate-800">{passportForm.passportType}</span>
          </div>

          <div>
            <span className="text-slate-500 block">Issuing Authority:</span>
            <span className="font-bold text-slate-800">{passportForm.placeOfIssue}</span>
          </div>

          <div>
            <span className="text-slate-500 block">Date of Issue:</span>
            <span className="font-semibold text-slate-800">{passportForm.dateOfIssue}</span>
          </div>

          <div>
            <span className="text-slate-500 block">Date of Expiry:</span>
            <span className="font-extrabold text-emerald-700">{passportForm.dateOfExpiry} (Valid)</span>
          </div>

          <div>
            <span className="text-slate-500 block">OCR Verification Audit:</span>
            <span className="font-bold text-[#4848F7]">100% Machine Readable</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 6: SAVED CO-TRAVELERS & FAMILY MEMBERS DIRECTORY TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Users size={16} className="text-[#4848F7]" />
            <span>Saved Co-Travelers & Family Members Vault ({coTravelers.length})</span>
          </h3>

          <button
            onClick={() => setShowAddTravelerModal(true)}
            className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg transition text-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus size={14} /> Add Family Member
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Traveler Name</th>
                <th className="py-3 px-4">Relation</th>
                <th className="py-3 px-4">Passport Number</th>
                <th className="py-3 px-4">Date of Birth</th>
                <th className="py-3 px-4">KYC Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {coTravelers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{t.fullName}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{t.relation}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{t.passportNumber}</td>
                  <td className="py-3.5 px-4 text-slate-700">{t.dob}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 size={10} /> {t.kycStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleRemoveTraveler(t.id)}
                      className="text-rose-600 hover:text-rose-800 p-1 rounded transition"
                      title="Remove Member"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Family Member Modal */}
      {showAddTravelerModal && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Plus size={16} className="text-[#4848F7]" /> Add Co-Traveler / Family Member
            </h4>
            <button
              onClick={() => setShowAddTravelerModal(false)}
              className="text-xs text-slate-400 font-bold hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleAddTravelerSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Full passport name..."
                value={newTravelerForm.fullName}
                onChange={(e) => setNewTravelerForm({ ...newTravelerForm, fullName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Relation</label>
              <select
                value={newTravelerForm.relation}
                onChange={(e) => setNewTravelerForm({ ...newTravelerForm, relation: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
              >
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Friend">Friend</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Passport Number</label>
              <input
                type="text"
                required
                placeholder="e.g. Z9840282"
                value={newTravelerForm.passportNumber}
                onChange={(e) => setNewTravelerForm({ ...newTravelerForm, passportNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-mono"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="w-full bg-[#4848F7] hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition"
              >
                Save Member
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 7: CONCEPTUAL WORKFLOW BANNER (CONNECTED TRAVEL IDENTITY PIPELINE) */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#4848F7]" size={20} />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
              Connected Travel Identity Pipeline (Complete Profile ➔ Passport OCR Verification ➔ Auto-Fill Visa Applications ➔ Fast-Track Dispatch)
            </h3>
          </div>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
            256-Bit Encrypted Vault
          </span>
        </div>

        {/* Pipeline Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 1</span>
            <p className="text-white">Complete Profile & Address</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 2</span>
            <p className="text-white">Passport Scan OCR Verification</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 3</span>
            <p className="text-white">Auto-Fill Group Visa Applications</p>
          </div>

          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30 space-y-1 text-emerald-300">
            <span className="text-emerald-300 block text-[10px] uppercase">Stage 4</span>
            <p className="font-bold">Fast-Track Consular Dispatch ✓</p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl text-xs space-y-1 text-slate-300">
          <p className="font-bold text-white">Security & Privacy Assurance:</p>
          <ul className="list-disc pl-4 space-y-1 leading-relaxed text-[11px]">
            <li>All personal details and passport MRZ data are encrypted at rest with AES-256 military standards.</li>
            <li>Passport scans are strictly transmitted to accredited consulates and VFS centers.</li>
          </ul>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 8: SECURITY & PREFERENCES PANEL */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Lock size={16} className="text-[#4848F7]" />
          <span>Security & Communication Preferences</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <p className="font-bold text-slate-900">Two-Factor Authentication (2FA)</p>
              <p className="text-[11px] text-slate-500">Require SMS OTP for sensitive account changes</p>
            </div>
            <input
              type="checkbox"
              checked={twoFactorAuth}
              onChange={(e) => setTwoFactorAuth(e.target.checked)}
              className="w-4 h-4 rounded text-[#4848F7]"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <p className="font-bold text-slate-900">Email & SMS Application Status Alerts</p>
              <p className="text-[11px] text-slate-500">Instant updates when visa status changes</p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-4 h-4 rounded text-[#4848F7]"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <p className="font-bold text-slate-900">Passport Expiry Reminders</p>
              <p className="text-[11px] text-slate-500">Get notified 9 months before passport expires</p>
            </div>
            <input
              type="checkbox"
              checked={passportReminder}
              onChange={(e) => setPassportReminder(e.target.checked)}
              className="w-4 h-4 rounded text-[#4848F7]"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <p className="font-bold text-slate-900">Account Password Security</p>
              <p className="text-[11px] text-slate-500">Last updated 45 days ago</p>
            </div>
            <button
              onClick={() => alert("Password reset link sent to your registered email!")}
              className="text-xs font-bold text-[#4848F7] hover:underline"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 9: PROFILE FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Profile & Passport Vault</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">How do I update my passport details after renewal?</p>
            <p className="text-slate-600 leading-relaxed">
              Navigate to your My Documents section or click "Update Passport Scans" to upload your new passport pages. Our AI OCR will automatically update your profile.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Can I add family members to auto-fill group visa applications?</p>
            <p className="text-slate-600 leading-relaxed">
              Yes, saved co-travelers in your family vault are automatically selectable during the Visa Application Wizard to eliminate repetitive data entry.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
