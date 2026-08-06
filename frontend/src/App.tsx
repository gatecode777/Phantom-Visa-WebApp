import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useVisa } from "./context/VisaContext";
import AgentPortal from "./components/AgentPortal";
import CustomerPortal from "./components/CustomerPortal";
import StaffPortal from "./components/StaffPortal";
import AdminPortal from "./components/AdminPortal";
import RegisterApplicant from "./components/RegisterApplicant";
import RegisterAgent from "./components/RegisterAgent";
import LoginPage from "./components/LoginPage";

export function App() {
  const navigate = useNavigate();
  const { authSession, loginSession, currentRole } = useVisa();

  // Helper to map role to default path
  const getRoleDefaultRoute = (role: string) => {
    switch (role) {
      case "Super Admin":
      case "Admin":
        return "/admin";
      case "Agent":
        return "/agent";
      case "Staff":
        return "/staff";
      case "Customer":
      case "Applicant":
      default:
        return "/dashboard";
    }
  };

  // Protected Route wrapper component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!authSession) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Routes>
      {/* LOGIN ROUTE */}
      <Route
        path="/login"
        element={
          authSession ? (
            <Navigate to={getRoleDefaultRoute(currentRole)} replace />
          ) : (
            <LoginPage
              onSuccess={(session) => {
                loginSession(session);
                const defaultPath = getRoleDefaultRoute(session.user?.role === "Applicant" ? "Customer" : session.user?.role || "Customer");
                navigate(defaultPath);
              }}
            />
          )
        }
      />

      {/* APPLICANT REGISTRATION WIZARD ROUTE */}
      <Route
        path="/register"
        element={
          <RegisterApplicant
            onClose={() => navigate("/login")}
            onSuccessSubmit={() => navigate("/login")}
          />
        }
      />

      {/* AGENT REGISTRATION WIZARD ROUTE */}
      <Route
        path="/register-agent"
        element={
          <RegisterAgent
            onClose={() => navigate("/login")}
            onSuccessSubmit={() => navigate("/login")}
          />
        }
      />

      {/* PROTECTED PORTAL ROUTES (SINGLE CLEAN SIDEBAR & HEADER) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <CustomerPortal />
          </ProtectedRoute>
        }
      />

      <Route
        path="/agent"
        element={
          <ProtectedRoute>
            <AgentPortal />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <StaffPortal />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPortal />
          </ProtectedRoute>
        }
      />

      {/* ROOT FALLBACK ROUTE */}
      <Route
        path="*"
        element={
          authSession ? (
            <Navigate to={getRoleDefaultRoute(currentRole)} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
