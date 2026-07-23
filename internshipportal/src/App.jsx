import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { InternshipListPage } from './pages/public/InternshipListPage';
import { InternshipDetailPage } from './pages/public/InternshipDetailPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfile } from './pages/student/StudentProfile';
import { MyApplications } from './pages/student/MyApplications';
import { SavedInternships } from './pages/student/SavedInternships';
import { CompanyDashboard } from './pages/company/CompanyDashboard';
import { CompanyProfile } from './pages/company/CompanyProfile';
import { CreateInternship } from './pages/company/CreateInternship';
import { ManageInternships } from './pages/company/ManageInternships';
import { EditInternship } from './pages/company/EditInternship';
import { ApplicantsPage } from './pages/company/ApplicantsPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleRoute } from './routes/RoleRoute';
import { useAuth } from './hooks/useAuth';
import { RegisterStudentPage } from "./pages/public/RegisterStudentPage";
import { CompanyRegisterPage } from "./pages/public/CompanyRegisterPage";
import { ForgotPasswordPage } from "./pages/public/ForgotPasswordPage";
import { OTPVerificationPage } from "./pages/public/OTPVerificationPage";
import { ResetPasswordPage } from "./pages/public/ResetPasswordPage";


// Admin Page Imports
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageStudentsPage } from './pages/admin/ManageStudentsPage';
import { ManageCompaniesPage } from './pages/admin/ManageCompaniesPage';
import { CompanyApprovalsPage } from './pages/admin/CompanyApprovalsPage';
import { ManageInternshipsPage } from './pages/admin/ManageInternshipsPage';
import { ManageApplicationsPage } from './pages/admin/ManageApplicationsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export default function App() {
  const { user } = useAuth();
  const showSidebar = user?.role === 'student' || user?.role === 'company' || user?.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-body)]">
      <Navbar />
      <div className="flex-1 flex">
        {showSidebar && <Sidebar />}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/student" element={<RegisterStudentPage />} />
            <Route path="/register/company" element={<CompanyRegisterPage />}/>
            <Route path="/internships" element={<InternshipListPage />} />
            <Route path="/internship/:id" element={<InternshipDetailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-otp" element={<OTPVerificationPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            
            <Route element={<ProtectedRoute />}>
              {/* Student Routes */}
              <Route path="/student/dashboard" element={<RoleRoute allowedRole="student"><StudentDashboard /></RoleRoute>} />
              <Route path="/student/profile" element={<RoleRoute allowedRole="student"><StudentProfile /></RoleRoute>} />
              <Route path="/student/applications" element={<RoleRoute allowedRole="student"><MyApplications /></RoleRoute>} />
              <Route path="/student/saved" element={<RoleRoute allowedRole="student"><SavedInternships /></RoleRoute>} />
              
              {/* Company Routes */}
              <Route path="/company/dashboard" element={<RoleRoute allowedRole="company"><CompanyDashboard /></RoleRoute>} />
              <Route path="/company/profile" element={<RoleRoute allowedRole="company"><CompanyProfile /></RoleRoute>} />
              <Route path="/company/internships/create" element={<RoleRoute allowedRole="company"><CreateInternship /></RoleRoute>} />
              <Route path="/company/internships/edit/:id" element={<RoleRoute allowedRole="company"><EditInternship /></RoleRoute>} />
              <Route path="/company/internships" element={<RoleRoute allowedRole="company"><ManageInternships /></RoleRoute>} />
              <Route path="/company/applicants" element={<RoleRoute allowedRole="company"><ApplicantsPage /></RoleRoute>} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<RoleRoute allowedRole="admin"><AdminDashboard /></RoleRoute>} />
              <Route path="/admin/students" element={<RoleRoute allowedRole="admin"><ManageStudentsPage /></RoleRoute>} />
              <Route path="/admin/companies" element={<RoleRoute allowedRole="admin"><ManageCompaniesPage /></RoleRoute>} />
              <Route path="/admin/approvals" element={<RoleRoute allowedRole="admin"><CompanyApprovalsPage /></RoleRoute>} />
              <Route path="/admin/internships" element={<RoleRoute allowedRole="admin"><ManageInternshipsPage /></RoleRoute>} />
              <Route path="/admin/applications" element={<RoleRoute allowedRole="admin"><ManageApplicationsPage /></RoleRoute>} />
              <Route path="/admin/analytics" element={<RoleRoute allowedRole="admin"><AdminAnalyticsPage /></RoleRoute>} />
              <Route path="/admin/settings" element={<RoleRoute allowedRole="admin"><AdminSettingsPage /></RoleRoute>} />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}
