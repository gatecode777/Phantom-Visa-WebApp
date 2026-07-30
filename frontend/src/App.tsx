import React, { useState } from "react";
import { useVisa, formatINR } from "./context/VisaContext";
import AgentPortal from "./components/AgentPortal";
import CustomerPortal from "./components/CustomerPortal";
import StaffPortal from "./components/StaffPortal";
import AdminPortal from "./components/AdminPortal";
import ImpersonationBanner from "./components/ImpersonationBanner";
import Logo from "./components/Logo";
import LoginPage from "./components/LoginPage";
import { getDashboardPath } from "./lib/authService";
import {
  Menu,
  X,
  User,
  Shield,
  Briefcase,
  Users,
  LayoutDashboard,
  Search,
  FilePlus2,
  Wallet,
  GitBranch,
  Activity,
  UserCheck,
  Building,
  HelpCircle,
  FolderLock,
  FileText,
  ClipboardList,
  CreditCard,
  Calendar,
  MessageSquare,
  Bell,
  Globe,
  LifeBuoy,
  Settings,
  BarChart3,
  FileCheck,
  LogOut,
  ShieldAlert
} from "lucide-react";

export function App() {
  const {
    authSession,
    loginSession,
    logoutSession,
    currentRole,
    setRole,
    agentTab,
    setAgentTab,
    adminTab,
    setAdminTab,
    customerTab,
    setCustomerTab,
    walletBalance
  } = useVisa();

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accessDeniedMsg, setAccessDeniedMsg] = useState<string | null>(null);

  // Unauthenticated -> Render Phone + OTP Passwordless Login Page
  if (!authSession) {
    return <LoginPage onSuccess={(session) => loginSession(session)} />;
  }

  // Define sidebar navigation items dynamically based on the current role
  const getSidebarNavItems = () => {
    switch (currentRole) {
      case "Agent":
        return [
          {
            id: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            action: () => setAgentTab("dashboard")
          },
          {
            id: "applications",
            label: "Visa Applications",
            icon: ClipboardList,
            action: () => setAgentTab("applications")
          },
          {
            id: "applicants",
            label: "Applicants",
            icon: Users,
            action: () => setAgentTab("applicants")
          },
          {
            id: "doc_verification",
            label: "Document Verification",
            icon: FileCheck,
            action: () => setAgentTab("doc_verification")
          },
          {
            id: "payments",
            label: "Payments",
            icon: CreditCard,
            action: () => setAgentTab("payments")
          },
          {
            id: "appointments",
            label: "Appointments",
            icon: Calendar,
            action: () => setAgentTab("appointments")
          },
          {
            id: "messages",
            label: "Messages",
            icon: MessageSquare,
            action: () => setAgentTab("messages")
          },
          {
            id: "notifications",
            label: "Notifications",
            icon: Bell,
            action: () => setAgentTab("notifications")
          },
          {
            id: "reports",
            label: "Reports",
            icon: BarChart3,
            action: () => setAgentTab("reports")
          },
          {
            id: "support",
            label: "Support",
            icon: LifeBuoy,
            action: () => setAgentTab("support")
          },
          {
            id: "profile",
            label: "My Profile",
            icon: User,
            action: () => setAgentTab("profile")
          },
          {
            id: "settings",
            label: "Settings",
            icon: Settings,
            action: () => setAgentTab("settings")
          }
        ];
      case "Staff":
        return [
          {
            id: "review",
            label: "Review Queue",
            icon: UserCheck,
            action: () => {}
          }
        ];
      case "Customer":
        return [
          {
            id: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            action: () => setCustomerTab("dashboard")
          },
          {
            id: "apply",
            label: "Apply for Visa",
            icon: FilePlus2,
            action: () => setCustomerTab("apply")
          },
          {
            id: "applications",
            label: "My Applications",
            icon: ClipboardList,
            action: () => setCustomerTab("applications")
          },
          {
            id: "documents",
            label: "Documents",
            icon: FileText,
            action: () => setCustomerTab("documents")
          },
          {
            id: "payments",
            label: "Payments",
            icon: CreditCard,
            action: () => setCustomerTab("payments")
          },
          {
            id: "appointments",
            label: "Appointments",
            icon: Calendar,
            action: () => setCustomerTab("appointments")
          },
          {
            id: "messages",
            label: "Messages",
            icon: MessageSquare,
            action: () => setCustomerTab("messages")
          },
          {
            id: "notifications",
            label: "Notifications",
            icon: Bell,
            action: () => setCustomerTab("notifications")
          },
          {
            id: "explore",
            label: "Explore Visas",
            icon: Globe,
            action: () => setCustomerTab("explore")
          },
          {
            id: "support",
            label: "Support",
            icon: LifeBuoy,
            action: () => setCustomerTab("support")
          },
          {
            id: "profile",
            label: "My Profile",
            icon: User,
            action: () => setCustomerTab("profile")
          },
          {
            id: "settings",
            label: "Settings",
            icon: Settings,
            action: () => setCustomerTab("settings")
          }
        ];
      case "Super Admin":
        return [
          {
            id: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            action: () => setAdminTab("dashboard")
          },
          {
            id: "user_management",
            label: "User Management",
            icon: Users,
            action: () => setAdminTab("user_management")
          },
          {
            id: "agent_management",
            label: "Agent Management",
            icon: Briefcase,
            action: () => setAdminTab("agent_management")
          },
          {
            id: "visa_management",
            label: "Visa Management",
            icon: Globe,
            action: () => setAdminTab("visa_management")
          },
          {
            id: "applications",
            label: "Applications",
            icon: ClipboardList,
            action: () => setAdminTab("applications")
          },
          {
            id: "documents",
            label: "Documents",
            icon: FileText,
            action: () => setAdminTab("documents")
          },
          {
            id: "payments",
            label: "Payments",
            icon: CreditCard,
            action: () => setAdminTab("payments")
          },
          {
            id: "appointments",
            label: "Appointments",
            icon: Calendar,
            action: () => setAdminTab("appointments")
          },
          {
            id: "messages",
            label: "Messages",
            icon: MessageSquare,
            action: () => setAdminTab("messages")
          },
          {
            id: "notifications",
            label: "Notifications",
            icon: Bell,
            action: () => setAdminTab("notifications")
          },
          {
            id: "reports",
            label: "Reports & Analytics",
            icon: BarChart3,
            action: () => setAdminTab("reports")
          },
          {
            id: "system_settings",
            label: "System Settings",
            icon: Settings,
            action: () => setAdminTab("system_settings")
          },
          {
            id: "support",
            label: "Support",
            icon: LifeBuoy,
            action: () => setAdminTab("support")
          },
          {
            id: "profile",
            label: "Profile",
            icon: User,
            action: () => setAdminTab("profile")
          }
        ];
      default:
        return [];
    }
  };

  const navItems = getSidebarNavItems();

  // Check if an item is active
  const isItemActive = (itemId: string) => {
    if (currentRole === "Agent") return agentTab === itemId;
    if (currentRole === "Super Admin") return adminTab === itemId;
    if (currentRole === "Customer") return customerTab === itemId;
    return true;
  };

  // Role Security Check
  const handleRoleSwitchAttempt = (targetRole: "Agent" | "Staff" | "Customer" | "Super Admin") => {
    const userRole = authSession.user.role;
    const roleMap: Record<string, string> = {
      Admin: "Super Admin",
      Applicant: "Customer",
      Staff: "Staff",
      Agent: "Agent"
    };

    if (roleMap[userRole] !== targetRole) {
      setAccessDeniedMsg(
        `Server-side RBAC Enforcement: Your session token role (${userRole}) cannot access ${getDashboardPath(
          targetRole as any
        )}. Access Rejected.`
      );
      setTimeout(() => setAccessDeniedMsg(null), 4000);
      return;
    }

    setRole(targetRole);
  };

  // Helper for rendering the active portal
  const renderActivePortal = () => {
    switch (currentRole) {
      case "Agent":
        return <AgentPortal />;
      case "Customer":
        return <CustomerPortal />;
      case "Staff":
        return <StaffPortal />;
      case "Super Admin":
        return <AdminPortal />;
      default:
        return <AgentPortal />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-brand-midnight text-brand-paper font-sans">
      <ImpersonationBanner />

      {/* ACCESS DENIED BANNER */}
      {accessDeniedMsg && (
        <div className="bg-red-500 text-white text-xs font-bold px-4 py-2 flex items-center justify-between z-50 animate-in slide-in-from-top">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} />
            <span>{accessDeniedMsg}</span>
          </div>
          <button onClick={() => setAccessDeniedMsg(null)} className="hover:opacity-80">
            <X size={16} />
          </button>
        </div>
      )}

      {currentRole === "Customer" ? (
        <CustomerPortal />
      ) : currentRole === "Super Admin" ? (
        <AdminPortal />
      ) : (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* LEFT SIDEBAR (Desktop) */}
          <aside className="hidden md:flex md:w-64 bg-brand-slate border-r border-brand-gold/15 flex-col justify-between z-30">
          <div className="flex flex-col">
            {/* Logo wordmark */}
            <div className="p-4 border-b border-brand-gold/15">
              <Logo variant="sidebar" />
            </div>

            {/* Navigation Links */}
            <nav className="p-4 space-y-1">
              <span className="text-[10px] text-brand-paper/40 uppercase tracking-widest font-bold px-3 block mb-3">
                {currentRole} Access Nodes
              </span>
              {navItems.map((item) => {
                const IconComp = item.icon;
                const active = isItemActive(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      item.action();
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded text-xs font-semibold flex items-center gap-2.5 transition-all ${
                      active
                        ? "bg-brand-gold/10 border-l-2 border-brand-gold text-brand-gold shadow-md shadow-brand-gold/5"
                        : "text-brand-paper/60 hover:text-brand-paper hover:bg-brand-midnight/40"
                    }`}
                  >
                    <IconComp size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Monospace Sidebar footer */}
          <div className="p-4 border-t border-brand-gold/10 bg-brand-midnight/20">
            <div className="font-mono text-[9px] text-brand-gold/45 space-y-1">
              <div className="truncate">P&lt;OS&lt;&lt;PHANTOM&lt;VISA&lt;B2B&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
              <div className="flex justify-between">
                <span>SYS_VER: 4.8.2</span>
                <span className="text-brand-teal">CONNECTED ✓</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MOBILE HEADER & DRAWER */}
        <header className="md:hidden bg-brand-slate border-b border-brand-gold/15 px-4 py-3 flex items-center justify-between z-40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-brand-gold hover:text-brand-paper focus:outline-none"
            >
              <Menu size={24} />
            </button>
            <Logo variant="header" />
          </div>

          <button
            onClick={logoutSession}
            className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg"
          >
            <LogOut size={13} /> Exit
          </button>
        </header>

        {/* Mobile Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-brand-midnight/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="relative flex flex-col w-64 bg-brand-slate border-r border-brand-gold/20 h-full p-6 space-y-6 z-50">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 text-brand-gold hover:text-brand-paper"
              >
                <X size={20} />
              </button>

              <div className="border-b border-brand-gold/15 pb-4">
                <Logo variant="sidebar" />
              </div>

              <nav className="space-y-1.5">
                <span className="text-[10px] text-brand-paper/40 uppercase tracking-widest font-bold block mb-2">
                  {currentRole} Access Nodes
                </span>
                {navItems.map((item) => {
                  const IconComp = item.icon;
                  const active = isItemActive(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.action();
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded text-xs font-semibold flex items-center gap-2.5 transition-all ${
                        active
                          ? "bg-brand-gold/10 border-l-2 border-brand-gold text-brand-gold shadow-md"
                          : "text-brand-paper/60 hover:text-brand-paper hover:bg-brand-midnight/40"
                      }`}
                    >
                      <IconComp size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="flex-1" />
              
              <div className="font-mono text-[9px] text-brand-gold/40 border-t border-brand-gold/10 pt-4 space-y-2">
                <div>User: {authSession.user.phone}</div>
                <button
                  onClick={logoutSession}
                  className="w-full bg-red-500/10 text-red-400 border border-red-500/30 py-1.5 rounded text-xs flex items-center justify-center gap-1 font-bold"
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* RIGHT MAIN CONTAINER */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar Navigation */}
          <div className="bg-brand-slate border-b border-brand-gold/15 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-20">
            {/* Left stats info */}
            <div className="flex items-center gap-3 text-xs">
              <span className="font-outfit font-semibold text-brand-paper uppercase tracking-wider text-[11px]">
                Authenticated User: <span className="text-brand-gold font-mono">{authSession.user.phone}</span>
              </span>
              <span className="text-brand-gold/30">|</span>
              <span className="font-mono text-[10px] bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-0.5 rounded font-bold">
                {getDashboardPath(authSession.user.role)}
              </span>
              {currentRole === "Agent" && (
                <>
                  <span className="text-brand-gold/30">|</span>
                  <span className="font-mono text-brand-gold font-bold bg-brand-gold/10 border border-brand-gold/20 px-2.5 py-1 rounded">
                    Ledger: ₹{formatINR(walletBalance)}
                  </span>
                </>
              )}
            </div>

            {/* Read-only Assigned Role & Logout */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-2 bg-brand-midnight border border-brand-gold/20 px-3 py-1.5 rounded-lg text-xs font-mono">
                <span className="text-[10px] text-brand-paper/40 font-bold uppercase">
                  Role:
                </span>
                <span className="font-bold text-brand-gold">
                  {currentRole}
                </span>
                <span className="text-[9px] text-brand-teal font-bold bg-brand-teal/10 px-1.5 py-0.5 rounded border border-brand-teal/20">
                  JWT Verified ✓
                </span>
              </div>

              <button
                onClick={logoutSession}
                className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg transition font-semibold text-xs shrink-0 cursor-pointer"
                title="Log Out Session"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          </div>

          {/* Dynamic Inner Portal Area */}
          <main className="flex-1 overflow-y-auto bg-brand-midnight">
            {renderActivePortal()}
          </main>
        </div>
      </div>
      )}
    </div>
  );
}

export default App;

