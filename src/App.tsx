import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { EmployeeDashboard } from "./components/employee/Dashboard";
import { History } from "./components/employee/History";
import { Justifications } from "./components/employee/Justifications";
import { AdminDashboard } from "./components/admin/Dashboard";
import { EmployeeManagement } from "./components/admin/EmployeeManagement";
import { Reports } from "./components/admin/Reports";
import { Settings } from "./components/admin/Settings";
import { Approvals } from "./components/admin/Approvals";
import { SidebarProvider } from "./contexts/SideBarContext";

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          {user.role === "ADMIN" ? (
            <>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/admin/employees" element={<EmployeeManagement />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/settings" element={<Settings />} />
              <Route path="/admin/approvals" element={<Approvals />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<EmployeeDashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="/justifications" element={<Justifications />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppContent />
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;
