import React, { useState } from "react";
import {
  HardDrive,
  Database,
  Cloud,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
  RotateCcw,
  RefreshCw,
  Eye,
  Download,
  Trash2,
  Clock,
  Sparkles,
  Zap,
  Sliders,
  Lock,
  Globe,
  FileText,
  Layers,
  Search,
  Filter,
  CheckSquare,
  AlertTriangle,
  Server,
  CloudUpload,
  X
} from "lucide-react";

export interface BackupArchive {
  backupId: string;
  fileName: string;
  size: string;
  createdTime: string;
  status: "Completed" | "In Progress" | "Failed";
  location: string;
}

export const BACKUP_WORKFLOW = [
  "Backup Schedule Defined",
  "Scope & Compression Selected",
  "Encryption Key Generated",
  "Automated Backup Executed",
  "Cloud Storage Synced",
  "Integrity Check Verified"
];

export const BACKUP_FEATURES = [
  "Automated Daily Backups",
  "AES-256 Encryption",
  "Multi-Cloud Sync (AWS / GCP / Azure)",
  "Point-in-Time Database Restore",
  "SHA-256 Integrity Verification",
  "Automated Retention Pruning",
  "Instant Manual Snapshots",
  "WORM Compliance Locks",
  "Full & Incremental Backups",
  "Real-time Disaster Recovery"
];

export const LAYOUT_CATALOG = [
  "Backup & Restore",
  "Statistics Cards",
  "Backup Config",
  "Cloud Destinations",
  "Disaster Recovery",
  "Backup History Table",
  "Quick Actions"
];

const MOCK_BACKUPS: BackupArchive[] = [
  { backupId: "BK-9001", fileName: "phantom_db_20260806_020000.gzip", size: "2.4 GB", createdTime: "Today, 02:00 AM", status: "Completed", location: "AWS S3" },
  { backupId: "BK-9002", fileName: "phantom_db_20260805_020000.gzip", size: "2.3 GB", createdTime: "Yesterday, 02:00 AM", status: "Completed", location: "AWS S3" },
  { backupId: "BK-9003", fileName: "phantom_db_20260804_020000.gzip", size: "2.3 GB", createdTime: "04 Aug 2026, 02:00 AM", status: "Completed", location: "AWS S3" },
  { backupId: "BK-9004", fileName: "phantom_db_20260803_020000.gzip", size: "2.2 GB", createdTime: "03 Aug 2026, 02:00 AM", status: "Completed", location: "Local Disk" }
];

export default function BackupRestoreManagement() {
  // Config States
  const [schedule, setSchedule] = useState("Daily (02:00 AM)");
  const [frequency, setFrequency] = useState("Every 24 Hours");
  const [destination, setDestination] = useState("AWS S3 Bucket");
  const [scope, setScope] = useState("Full Database + Document Uploads + System Logs");
  const [compression, setCompression] = useState(".gzip (High Compression)");
  const [encryption, setEncryption] = useState("AES-256 GCM");
  const [retentionDays, setRetentionDays] = useState("365 Days");

  // Restore Modal State
  const [selectedRestorePoint, setSelectedRestorePoint] = useState("phantom_db_20260806_020000.gzip");
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateInstantBackup = () => {
    triggerToast("Initiated instant snapshot backup. Generating phantom_db_live.gzip...");
  };

  const handleSaveConfig = () => {
    triggerToast("Backup & Cloud Sync configuration saved successfully.");
  };

  const handleSyncCloud = () => {
    triggerToast("Triggered cloud storage sync to AWS S3 & Google Cloud.");
  };

  const handleInitiateRestoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast(`Initiating point-in-time restore from ${selectedRestorePoint}... System will reboot in maintenance mode.`);
    setShowRestoreModal(false);
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
            <HardDrive size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Settings &bull; Database Backups & Disaster Recovery
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Backup & Restore
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Manage automated database backups, cloud storage sync, disaster recovery, and point-in-time system restores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateInstantBackup}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs backdrop-blur-md transition cursor-pointer flex items-center gap-1.5 border border-white/20"
          >
            <CloudUpload size={15} /> Instant Backup
          </button>
          <button
            onClick={() => setShowRestoreModal(true)}
            className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <RotateCcw size={15} /> Restore System
          </button>
        </div>
      </div>

      {/* TOP METRICS DASHBOARD (6 CARDS MATCHING WIREFRAME) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Backups</span>
          <div className="text-2xl font-black text-slate-900 font-mono">48</div>
          <span className="text-[10px] text-[#2563EB] font-bold">Archives Retained</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Last Backup Date</span>
          <div className="text-xl font-black text-slate-900 font-mono">Today 02:00 AM</div>
          <span className="text-[10px] text-blue-600 font-bold">Auto Snapshot</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Total Backup Size</span>
          <div className="text-2xl font-black text-slate-900 font-mono">14.2 GB</div>
          <span className="text-[10px] text-purple-600 font-bold">Compressed Storage</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Backup Status</span>
          <div className="text-xl font-black text-slate-900 font-mono">Successful 🟢</div>
          <span className="text-[10px] text-emerald-600 font-bold">0 Errors</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">Cloud Free Space</span>
          <div className="text-xl font-black text-slate-900 font-mono">450 GB Free</div>
          <span className="text-[10px] text-teal-600 font-bold">1 TB Total Capacity</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-indigo-600 block mb-1">Retention Policy</span>
          <div className="text-2xl font-black text-slate-900 font-mono">365 Days</div>
          <span className="text-[10px] text-indigo-600 font-bold">Auto Pruning</span>
        </div>
      </div>

      {/* CLOUD DESTINATIONS STATUS CARDS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Cloud size={16} className="text-[#2563EB]" /> Automated Multi-Cloud Storage Destinations
          </span>
          <button
            onClick={handleSyncCloud}
            className="text-[11px] font-bold text-[#2563EB] hover:bg-blue-50 px-3 py-1 rounded-xl transition flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw size={13} /> Sync Cloud Destinations
          </button>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1">
            <div className="flex justify-between items-center">
              <strong className="text-slate-900 font-bold">AWS S3 Bucket</strong>
              <span className="text-[10px] text-emerald-700 font-bold">Active 🟢</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 block truncate">s3://phantom-visa-backups/prod/</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1">
            <div className="flex justify-between items-center">
              <strong className="text-slate-900 font-bold">Google Cloud Storage</strong>
              <span className="text-[10px] text-emerald-700 font-bold">Active 🟢</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 block truncate">gs://phantom-visa-archive/</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1">
            <div className="flex justify-between items-center">
              <strong className="text-slate-900 font-bold">Local Storage</strong>
              <span className="text-[10px] text-emerald-700 font-bold">Active 🟢</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 block truncate">/var/backups/phantomvisa/</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1">
            <div className="flex justify-between items-center">
              <strong className="text-slate-900 font-bold">Azure Blob Storage</strong>
              <span className="text-[10px] text-amber-700 font-bold">Standby 🟡</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 block truncate">https://phantomvisa.blob.core/</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT 2 COLUMNS: CONFIG FORM & BACKUP ARCHIVES TABLE */}
        <div className="lg:col-span-2 space-y-6">
          {/* BACKUP CONFIGURATION FORM */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sliders size={16} className="text-[#2563EB]" /> Backup Configuration & Automation Schedule
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Backup Schedule</label>
                <select
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold text-emerald-700"
                >
                  <option value="Daily (02:00 AM)">Daily (Every Night at 02:00 AM)</option>
                  <option value="Weekly (Sunday)">Weekly (Every Sunday 02:00 AM)</option>
                  <option value="Monthly">Monthly First Day</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Primary Storage Destination</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                >
                  <option value="AWS S3 Bucket">AWS S3 Bucket (Primary)</option>
                  <option value="Google Cloud">Google Cloud Storage</option>
                  <option value="Local Disk">Local Encrypted Disk</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Backup Scope</label>
                <input
                  type="text"
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Retention Period</label>
                <select
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                >
                  <option value="365 Days">365 Days (1 Year Archive)</option>
                  <option value="180 Days">180 Days</option>
                  <option value="90 Days">90 Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* BACKUP ARCHIVES HISTORY TABLE */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                <Database size={16} className="text-[#2563EB]" /> Available Backup Archives History
              </h3>
              <div className="relative w-44">
                <Search size={13} className="absolute left-2.5 top-2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search backups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[11px] pl-8 pr-2 py-1 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                    <th className="pb-2">Backup ID</th>
                    <th className="pb-2">File Name</th>
                    <th className="pb-2 text-center">Size</th>
                    <th className="pb-2 text-center">Created Time</th>
                    <th className="pb-2 text-center">Status</th>
                    <th className="pb-2 text-center">Location</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {MOCK_BACKUPS.map((b) => (
                    <tr key={b.backupId} className="hover:bg-slate-50">
                      <td className="py-2.5 font-mono font-bold text-slate-900">{b.backupId}</td>
                      <td className="py-2.5 font-mono text-[11px] text-slate-800 font-bold">{b.fileName}</td>
                      <td className="py-2.5 text-center font-mono font-bold text-slate-900">{b.size}</td>
                      <td className="py-2.5 text-center font-mono text-[11px] text-slate-500">{b.createdTime}</td>
                      <td className="py-2.5 text-center">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">🟢 {b.status}</span>
                      </td>
                      <td className="py-2.5 text-center font-mono text-[11px] text-blue-700">{b.location}</td>
                      <td className="py-2.5 text-right space-x-1">
                        <button
                          onClick={() => triggerToast(`Downloading ${b.fileName}`)}
                          className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#2563EB] rounded-lg transition"
                        >
                          <Download size={13} />
                        </button>
                        <button
                          onClick={() => { setSelectedRestorePoint(b.fileName); setShowRestoreModal(true); }}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition"
                        >
                          <RotateCcw size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIONS, CATALOG & WORKFLOW */}
        <div className="space-y-6">
          {/* QUICK CONTROL ACTIONS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <Zap size={16} className="text-[#2563EB]" /> Backup Control Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleCreateInstantBackup}
                className="w-full py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <CloudUpload size={14} /> Create Instant Backup
              </button>
              <button
                onClick={() => setShowRestoreModal(true)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw size={14} /> Initiate System Restore
              </button>
              <button
                onClick={handleSyncCloud}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Cloud size={14} /> Sync Cloud Destinations
              </button>
              <button
                onClick={handleSaveConfig}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Save size={14} /> Save Backup Config
              </button>
            </div>
          </div>

          {/* DASHBOARD LAYOUT CATALOG */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <Layers size={16} className="text-[#2563EB]" /> Dashboard Layout Catalog
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {LAYOUT_CATALOG.map((item, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* BACKUP WORKFLOW */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <Clock size={16} className="text-emerald-600" /> Backup Setup Workflow
            </h3>
            <div className="space-y-2">
              {BACKUP_WORKFLOW.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PROFESSIONAL FEATURES CATALOG */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <Sparkles size={16} className="text-purple-600" /> Professional Features Catalog
            </h3>
            <div className="space-y-1.5 text-xs">
              {BACKUP_FEATURES.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RECOMMENDATION BOX */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-blue-100 pb-2">
              <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Recommendation
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              The Backup & Restore page manages automated database snapshots, cloud storage synchronization (AWS S3, Google Cloud, Azure), point-in-time system restoration, and disaster recovery policies. Ensure backups are stored across multiple cloud regions and verified with SHA-256 checksums.
            </p>
          </div>
        </div>
      </div>

      {/* RESTORE MODAL */}
      {showRestoreModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 font-outfit flex items-center gap-2">
                <RotateCcw size={16} className="text-red-600" /> Point-in-Time System Restore
              </h3>
              <button
                onClick={() => setShowRestoreModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleInitiateRestoreSubmit} className="space-y-3 text-xs">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-amber-800 text-[11px] font-semibold">
                ⚠️ Warning: Initiating a restore will roll back system database state to the selected snapshot. Current active sessions will be temporarily suspended.
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Target Restore Archive</label>
                <select
                  value={selectedRestorePoint}
                  onChange={(e) => setSelectedRestorePoint(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono font-bold"
                >
                  {MOCK_BACKUPS.map((b) => (
                    <option key={b.backupId} value={b.fileName}>
                      {b.fileName} ({b.size})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRestoreModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs transition shadow-md flex items-center gap-1.5"
                >
                  <RotateCcw size={13} /> Confirm Restore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
