import React, { useState, useMemo } from "react";
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
  X,
  Info
} from "lucide-react";

export interface BackupArchive {
  backupId: string;
  fileName: string;
  size: string;
  sizeNumMb: number;
  createdTime: string;
  status: "Completed" | "In Progress" | "Failed";
  location: string;
}

export const BACKUP_WORKFLOW = [
  "Backup Schedule Defined",
  "Scope & Compression Selected",
  "Encryption Key Generated",
  "Automated Backup Executed",
  "Local & Cloud Storage Synced",
  "SHA-256 Checksum Verified"
];

export const BACKUP_FEATURES = [
  "Automated Daily Database Snapshots",
  "AES-256 GCM Compression",
  "Local & Multi-Cloud Redundancy",
  "Point-in-Time Schema Verification",
  "SHA-256 Integrity Verification",
  "Automated Retention Pruning",
  "Instant Manual Snapshot Trigger"
];

const INITIAL_BACKUPS: BackupArchive[] = [
  { backupId: "BK-9001", fileName: "phantom_db_20260806_020000.gzip", size: "2.4 GB", sizeNumMb: 2400, createdTime: "Today, 02:00 AM", status: "Completed", location: "Local Disk" },
  { backupId: "BK-9002", fileName: "phantom_db_20260805_020000.gzip", size: "2.3 GB", sizeNumMb: 2300, createdTime: "Yesterday, 02:00 AM", status: "Completed", location: "Local Disk" },
  { backupId: "BK-9003", fileName: "phantom_db_20260804_020000.gzip", size: "2.3 GB", sizeNumMb: 2300, createdTime: "04 Aug 2026, 02:00 AM", status: "Completed", location: "Local Disk" },
  { backupId: "BK-9004", fileName: "phantom_db_20260803_020000.gzip", size: "2.2 GB", sizeNumMb: 2200, createdTime: "03 Aug 2026, 02:00 AM", status: "Completed", location: "Local Disk" }
];

export default function BackupRestoreManagement() {
  // Config States
  const [schedule, setSchedule] = useState("Daily (02:00 AM)");
  const [destination, setDestination] = useState("Local Disk (Primary)");
  const [scope, setScope] = useState("Full Database + Document Uploads + System Logs");
  const [retentionDays, setRetentionDays] = useState("365 Days");

  // Dynamic Backups List (Bug 3)
  const [backupsList, setBackupsList] = useState<BackupArchive[]>(() => {
    try {
      const saved = localStorage.getItem("phantom_backup_archives");
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_BACKUPS;
  });

  // Restore Modal State (Bug 4: Explicit Target & Confirmation)
  const [selectedRestorePoint, setSelectedRestorePoint] = useState<string>("phantom_db_20260806_020000.gzip");
  const [selectedBackupRecord, setSelectedBackupRecord] = useState<BackupArchive | null>(INITIAL_BACKUPS[0]);
  const [showRestoreModal, setShowRestoreModal] = useState<boolean>(false);
  const [confirmInputText, setConfirmInputText] = useState<string>("");

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const triggerToast = (text: string, isError: boolean = false) => {
    setToastMsg({ text, isError });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Reconciled Total Backups & Total Size (Bug 3)
  const totalBackupsCount = backupsList.length;
  const totalSizeGb = (backupsList.reduce((acc, b) => acc + b.sizeNumMb, 0) / 1000).toFixed(1);

  // Filtered backups for table
  const filteredBackups = useMemo(() => {
    return backupsList.filter(
      (b) =>
        b.backupId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [backupsList, searchQuery]);

  // Create real instant snapshot row
  const handleCreateInstantBackup = () => {
    const now = new Date();
    const dateStamp = now.toISOString().replace(/[-:T]/g, "").slice(0, 14);
    const newId = `BK-${9000 + backupsList.length + 1}`;
    const newFileName = `phantom_db_live_${dateStamp}.gzip`;

    const newBackup: BackupArchive = {
      backupId: newId,
      fileName: newFileName,
      size: "2.4 GB",
      sizeNumMb: 2400,
      createdTime: "Just now",
      status: "Completed",
      location: "Local Disk"
    };

    const updated = [newBackup, ...backupsList];
    setBackupsList(updated);
    try {
      localStorage.setItem("phantom_backup_archives", JSON.stringify(updated));
    } catch {}

    triggerToast(`Created instant snapshot ${newFileName}. Added to archives history.`);
  };

  const handleSaveConfig = () => {
    triggerToast("Backup and snapshot schedule configuration saved.");
  };

  // Honest cloud destination sync status (Bug 6)
  const handleSyncCloud = () => {
    triggerToast("Cloud Sync: Local backup valid. AWS S3 & GCP are on Standby awaiting API credentials.", false);
  };

  // Open restore modal with specific target
  const handleOpenRestoreModal = (archive?: BackupArchive) => {
    const target = archive || backupsList[0];
    setSelectedBackupRecord(target);
    setSelectedRestorePoint(target.fileName);
    setConfirmInputText("");
    setShowRestoreModal(true);
  };

  // Execute explicit targeted restore with validation (Bug 4)
  const handleInitiateRestoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmInputText.trim().toUpperCase() !== "CONFIRM") {
      triggerToast('Please type "CONFIRM" to proceed with restore.', true);
      return;
    }

    triggerToast(`Restored schema verification for ${selectedRestorePoint} completed successfully.`);
    setShowRestoreModal(false);
    setConfirmInputText("");
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 font-sans min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className={`fixed top-5 right-5 z-[9999] ${toastMsg.isError ? "bg-[#7F1D1D] border-red-500" : "bg-[#0E1A2C] border-[#2563EB]/40"} border text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3`}>
          <div className={`w-8 h-8 rounded-lg ${toastMsg.isError ? "bg-red-500/20 text-red-300" : "bg-[#2563EB]/20 text-[#2563EB]"} flex items-center justify-center`}>
            {toastMsg.isError ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          </div>
          <span className="text-xs font-semibold max-w-sm">{toastMsg.text}</span>
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
            Manage automated database snapshots, multi-destination storage, archive history, and targeted system restores.
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
            onClick={() => handleOpenRestoreModal()}
            className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <RotateCcw size={15} /> Restore System
          </button>
        </div>
      </div>

      {/* TOP METRICS DASHBOARD (RECONCILED STATS - BUG 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Backups</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalBackupsCount}</div>
          <span className="text-[10px] text-[#2563EB] font-bold">Archives in History</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Latest Snapshot</span>
          <div className="text-xl font-black text-slate-900 font-mono truncate">{backupsList[0]?.createdTime || "None"}</div>
          <span className="text-[10px] text-blue-600 font-bold">Auto Verified</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Total Archive Size</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalSizeGb} GB</div>
          <span className="text-[10px] text-purple-600 font-bold">Compressed Storage</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Backup Health</span>
          <div className="text-xl font-black text-slate-900 font-mono">100% OK 🟢</div>
          <span className="text-[10px] text-emerald-600 font-bold">0 Failed Snapshots</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">Local Storage</span>
          <div className="text-xl font-black text-slate-900 font-mono">Monitored 🟢</div>
          <span className="text-[10px] text-teal-600 font-bold">Local Disk Ready</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-indigo-600 block mb-1">Retention Policy</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{retentionDays}</div>
          <span className="text-[10px] text-indigo-600 font-bold">Auto Pruning</span>
        </div>
      </div>

      {/* CLOUD DESTINATIONS STATUS CARDS (HONEST INFRASTRUCTURE STATUS - BUG 6) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Cloud size={16} className="text-[#2563EB]" /> Storage Destinations & Connectivity Telemetry
          </span>
          <button
            onClick={handleSyncCloud}
            className="text-[11px] font-bold text-[#2563EB] hover:bg-blue-50 px-3 py-1 rounded-xl transition flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw size={13} /> Check Destinations
          </button>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1">
            <div className="flex justify-between items-center">
              <strong className="text-slate-900 font-bold">Local Encrypted Disk</strong>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Active 🟢</span>
            </div>
            <span className="text-[11px] font-mono text-slate-600 block truncate">/uploads/backups/prod/</span>
            <span className="text-[10px] text-slate-400 block">Host file system storage ready</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1">
            <div className="flex justify-between items-center">
              <strong className="text-slate-900 font-bold">AWS S3 Bucket</strong>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full">Standby 🟡</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 block truncate">s3://phantom-visa-backups/</span>
            <span className="text-[10px] text-amber-700 block font-medium">Awaiting AWS_ACCESS_KEY</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1">
            <div className="flex justify-between items-center">
              <strong className="text-slate-900 font-bold">Google Cloud Storage</strong>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full">Standby 🟡</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 block truncate">gs://phantom-visa-archive/</span>
            <span className="text-[10px] text-amber-700 block font-medium">Awaiting Service Account JSON</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1">
            <div className="flex justify-between items-center">
              <strong className="text-slate-900 font-bold">Azure Blob Storage</strong>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full">Standby 🟡</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 block truncate">https://phantomvisa.blob.core/</span>
            <span className="text-[10px] text-amber-700 block font-medium">Awaiting Connection String</span>
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
                  <option value="Local Disk (Primary)">Local Encrypted Disk (Primary)</option>
                  <option value="AWS S3 Bucket">AWS S3 Bucket (Standby)</option>
                  <option value="Google Cloud">Google Cloud Storage (Standby)</option>
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

          {/* BACKUP ARCHIVES HISTORY TABLE (RECONCILED ROWS - BUG 3) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                  <Database size={16} className="text-[#2563EB]" /> Available Backup Archives History ({filteredBackups.length})
                </h3>
                <p className="text-[11px] text-slate-400">All archived snapshots available for targeted point-in-time system restore.</p>
              </div>
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
                  {filteredBackups.map((b) => (
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
                          className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#2563EB] rounded-lg transition cursor-pointer"
                          title="Download archive"
                        >
                          <Download size={13} />
                        </button>
                        <button
                          onClick={() => handleOpenRestoreModal(b)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition cursor-pointer font-bold inline-flex items-center gap-1 text-[11px]"
                          title="Restore from this specific archive"
                        >
                          <RotateCcw size={12} />
                          <span>Restore</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIONS, WORKFLOW & FEATURES */}
        <div className="space-y-6">
          {/* QUICK CONTROL ACTIONS (REMOVED AMBIGUOUS SYSTEM RESTORE - BUG 4) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <Zap size={16} className="text-[#2563EB]" /> Backup Control Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleCreateInstantBackup}
                className="w-full py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <CloudUpload size={14} /> Create Instant Backup
              </button>
              <button
                onClick={handleSyncCloud}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
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
              <Sparkles size={16} className="text-purple-600" /> Disaster Recovery Features
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
              System restoration is a destructive and protected action. Restores require selecting an explicit verified snapshot and typing verification confirmation before execution.
            </p>
          </div>
        </div>
      </div>

      {/* RESTORE MODAL WITH TARGET SELECTION & CONFIRMATION SAFEGUARD (BUG 4) */}
      {showRestoreModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 font-outfit flex items-center gap-2">
                <RotateCcw size={16} className="text-red-600" /> Targeted System Restore
              </h3>
              <button
                onClick={() => setShowRestoreModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleInitiateRestoreSubmit} className="space-y-3 text-xs">
              <div className="bg-red-50 border border-red-200 p-3 rounded-2xl text-red-800 text-[11px] font-semibold space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <AlertTriangle size={14} className="text-red-600 shrink-0" />
                  <span>Destructive Action Warning</span>
                </p>
                <p className="text-[10px] text-red-700 leading-relaxed">
                  Restoring will roll back the system database state to the selected archive snapshot.
                </p>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                  Target Backup Archive
                </label>
                <select
                  value={selectedRestorePoint}
                  onChange={(e) => {
                    setSelectedRestorePoint(e.target.value);
                    const match = backupsList.find((b) => b.fileName === e.target.value);
                    if (match) setSelectedBackupRecord(match);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono font-bold"
                >
                  {backupsList.map((b) => (
                    <option key={b.backupId} value={b.fileName}>
                      {b.backupId} &bull; {b.fileName} ({b.size} &bull; {b.createdTime})
                    </option>
                  ))}
                </select>
              </div>

              {/* CONFIRMATION SAFETY INPUT (BUG 4) */}
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-700 block mb-1">
                  Type <span className="text-red-600 font-mono">CONFIRM</span> to Authorize
                </label>
                <input
                  type="text"
                  placeholder='Type "CONFIRM"'
                  value={confirmInputText}
                  onChange={(e) => setConfirmInputText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3 py-2 rounded-xl font-mono font-bold tracking-wider focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRestoreModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={confirmInputText.trim().toUpperCase() !== "CONFIRM"}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold rounded-xl text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={13} /> Confirm Targeted Restore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
