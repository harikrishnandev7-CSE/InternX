import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  ListRestart
} from "lucide-react";
import { getAdminStats, getAdminRecentActivity } from "../../services/adminService";

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [statsRes, activityRes] = await Promise.all([
        getAdminStats(),
        getAdminRecentActivity()
      ]);
      
      setStats(statsRes.data);
      setRecentActivity(activityRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-error-500 mb-4" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Error Loading Dashboard</h3>
        <p className="text-sm text-[var(--text-muted)] mb-6">{error}</p>
        <button onClick={loadDashboardData} className="btn-primary">
          <ListRestart className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="page-container max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Dashboard</h1>
        <p className="text-sm text-[var(--text-muted)]">Real-time platform oversight and analytics overview</p>
      </div>

      {/* Main Aggregation Stats Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Total Students Card */}
        <motion.div variants={itemVariants} className="stat-card border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <span className="stat-label">Total Students</span>
              <h3 className="stat-value mt-1">{stats?.total_students}</h3>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-[var(--text-muted)]">
            Registered and browsing student accounts
          </div>
        </motion.div>

        {/* Total Companies Card */}
        <motion.div variants={itemVariants} className="stat-card border-l-4 border-l-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <span className="stat-label">Total Companies</span>
              <h3 className="stat-value mt-1">{stats?.total_companies}</h3>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-500">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="badge bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
              {stats?.approved_companies} Approved
            </span>
            <span className="badge bg-yellow-50 text-yellow-750 dark:bg-yellow-900/20 dark:text-yellow-400">
              {stats?.pending_companies} Pending
            </span>
            <span className="badge bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {stats?.rejected_companies} Rejected
            </span>
          </div>
        </motion.div>

        {/* Total Internships Card */}
        <motion.div variants={itemVariants} className="stat-card border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start">
            <div>
              <span className="stat-label">Total Internships</span>
              <h3 className="stat-value mt-1">{stats?.total_internships}</h3>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-500">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex gap-2 text-xs text-[var(--text-muted)]">
            <span className="text-green-600 font-semibold">{stats?.active_internships} Active</span>
            <span>•</span>
            <span>{stats?.inactive_internships} Inactive</span>
          </div>
        </motion.div>

        {/* Total Applications Card */}
        <motion.div variants={itemVariants} className="stat-card border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <span className="stat-label">Total Applications</span>
              <h3 className="stat-value mt-1">{stats?.total_applications}</h3>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-500">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5 text-[10px]">
            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {stats?.under_review_applications} Review
            </span>
            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {stats?.shortlisted_applications} Shortlist
            </span>
            <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {stats?.selected_applications} Select
            </span>
            <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {stats?.rejected_applications} Reject
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Admin Quick Action Shortcuts */}
      <div className="card p-6 bg-gradient-to-r from-primary-900/5 to-transparent border-primary-500/20">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Quick Navigation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/approvals" className="btn-outline flex items-center justify-between p-3.5 hover:bg-[var(--bg-elevated)] transition-all">
            <span className="text-xs font-semibold">Review Pending Companies</span>
            <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
          </Link>
          <Link to="/admin/students" className="btn-outline flex items-center justify-between p-3.5 hover:bg-[var(--bg-elevated)] transition-all">
            <span className="text-xs font-semibold">Browse All Students</span>
            <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
          </Link>
          <Link to="/admin/companies" className="btn-outline flex items-center justify-between p-3.5 hover:bg-[var(--bg-elevated)] transition-all">
            <span className="text-xs font-semibold">Manage Companies</span>
            <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
          </Link>
          <Link to="/admin/analytics" className="btn-outline flex items-center justify-between p-3.5 hover:bg-[var(--bg-elevated)] transition-all">
            <span className="text-xs font-semibold">Detailed Analytics</span>
            <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
          </Link>
        </div>
      </div>

      {/* Recent Activities Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Companies and Students Signups */}
        <div className="space-y-6">
          {/* Recent Company Registrations */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-primary-500" />
                Recent Company Signups
              </h3>
              <Link to="/admin/companies" className="text-xs text-primary-600 font-semibold hover:underline">
                View All
              </Link>
            </div>
            <div className="divide-y divide-[var(--border-primary)]">
              {recentActivity?.recent_companies.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] py-4 text-center">No company signups yet.</p>
              ) : (
                recentActivity?.recent_companies.map((company) => (
                  <div key={company.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">{company.name}</p>
                      <p className="text-[var(--text-muted)] mt-0.5">{company.email}</p>
                    </div>
                    <div>
                      <span className={`badge ${
                        company.status === "Approved"
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : company.status === "Rejected"
                            ? "bg-red-50 text-red-750 dark:bg-red-900/20 dark:text-red-400"
                            : "bg-yellow-50 text-yellow-750 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }`}>
                        {company.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Student Registrations */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-blue-500" />
                Recent Student Registrations
              </h3>
              <Link to="/admin/students" className="text-xs text-primary-600 font-semibold hover:underline">
                View All
              </Link>
            </div>
            <div className="divide-y divide-[var(--border-primary)]">
              {recentActivity?.recent_students.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] py-4 text-center">No students registered yet.</p>
              ) : (
                recentActivity?.recent_students.map((student) => (
                  <div key={student.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">{student.name}</p>
                      <p className="text-[var(--text-muted)] mt-0.5">{student.email}</p>
                    </div>
                    <span className="text-[var(--text-secondary)] font-medium bg-[var(--bg-elevated)] px-2.5 py-1 rounded">
                      {student.department}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Internships and Applications */}
        <div className="space-y-6">
          {/* Recent Internship Posts */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Briefcase className="w-4.5 h-4.5 text-emerald-500" />
                Recent Internship Posts
              </h3>
              <Link to="/admin/internships" className="text-xs text-primary-600 font-semibold hover:underline">
                View All
              </Link>
            </div>
            <div className="divide-y divide-[var(--border-primary)]">
              {recentActivity?.recent_internships.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] py-4 text-center">No internships posted yet.</p>
              ) : (
                recentActivity?.recent_internships.map((internship) => (
                  <div key={internship.id} className="py-3 flex justify-between items-start text-xs">
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">{internship.title}</p>
                      <p className="text-[var(--text-muted)] mt-0.5">{internship.company}</p>
                    </div>
                    <span className="text-[var(--text-muted)] text-[10px]">
                      {new Date(internship.date).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Application Actions */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-amber-500" />
                Recent Applications
              </h3>
              <Link to="/admin/applications" className="text-xs text-primary-600 font-semibold hover:underline">
                View All
              </Link>
            </div>
            <div className="divide-y divide-[var(--border-primary)]">
              {recentActivity?.recent_applications.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] py-4 text-center">No applications submitted yet.</p>
              ) : (
                recentActivity?.recent_applications.map((app) => (
                  <div key={app.id} className="py-3 flex justify-between items-start text-xs">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-[var(--text-primary)]">
                        {app.student}
                      </p>
                      <p className="text-[var(--text-muted)]">
                        applied for <span className="font-medium text-[var(--text-secondary)]">{app.title}</span> at <span className="font-medium text-[var(--text-secondary)]">{app.company}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`badge ${
                        app.status === "Selected"
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : app.status === "Rejected"
                            ? "bg-red-50 text-red-750 dark:bg-red-900/20 dark:text-red-400"
                            : app.status === "Shortlisted"
                              ? "bg-blue-50 text-blue-750 dark:bg-blue-900/20 dark:text-blue-400"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
