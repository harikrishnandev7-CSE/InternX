import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, Bookmark, CheckCircle, XCircle, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { getStudentApplications } from '../../services/applicationService';
import { getAllInternships } from '../../services/internshipService';
import { InternshipCard } from '../../components/common/InternshipCard';
import { useAuth } from '../../hooks/useAuth';

export function StudentDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch applications
        const apps = await getStudentApplications();
        setApplications(apps);

        // Fetch all active internships for recommendations
        const allInternships = await getAllInternships();
        const activeListings = allInternships.filter(item => item.is_active === true);
        setRecommended(activeListings.slice(0, 3));

        // Read saved bookmarks count from localStorage
        try {
          const localSaved = localStorage.getItem(`saved_internships_${user?.id}`);
          const savedList = localSaved ? JSON.parse(localSaved) : [];
          setSavedCount(savedList.length);
        } catch {
          setSavedCount(0);
        }

      } catch (err) {
        console.error("Student dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      loadDashboardData();
    }
  }, [user]);

  const stats = {
    total: applications.length,
    shortlisted: applications.filter((a) => a.status === 'Shortlisted').length,
    rejected: applications.filter((a) => a.status === 'Rejected').length,
    selected: applications.filter((a) => a.status === 'Selected').length,
  };

  const recentActivity = useMemo(() => {
    return [...applications]
      .sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at))
      .slice(0, 5);
  }, [applications]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="section-title">Student Dashboard</h1>
          <p className="section-subtitle">Welcome back, {user?.name}! Here is your overview.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stat-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-600" />
              </div>
              <span className="stat-label">Total Applications</span>
            </div>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-secondary-50 dark:bg-secondary-900/20 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-secondary-600" />
              </div>
              <span className="stat-label">Shortlisted</span>
            </div>
            <span className="stat-value">{stats.shortlisted}</span>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-error-50 dark:bg-error-900/20 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-error-600" />
              </div>
              <span className="stat-label">Rejected</span>
            </div>
            <span className="stat-value">{stats.rejected}</span>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-success-50 dark:bg-success-900/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-success-600" />
              </div>
              <span className="stat-label">Selected</span>
            </div>
            <span className="stat-value">{stats.selected}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--text-primary)]">Recent Activity</h2>
              <Link to="/student/applications" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivity.map((app) => (
                <div key={app.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    app.status === 'Selected' ? 'bg-success-500' :
                    app.status === 'Shortlisted' ? 'bg-secondary-500' :
                    app.status === 'Rejected' ? 'bg-error-500' :
                    app.status === 'Under Review' ? 'bg-warning-500' : 'bg-primary-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{app.internship_title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{app.company_name} - {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : 'Recent'}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    app.status === 'Selected' ? 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400' :
                    app.status === 'Shortlisted' ? 'bg-secondary-50 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-400' :
                    app.status === 'Rejected' ? 'bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400' :
                    app.status === 'Under Review' ? 'bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400' :
                    'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <p className="text-sm text-[var(--text-muted)] text-center py-4">No applications submitted yet.</p>
              )}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--text-primary)]">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <Link to="/internships" className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors">
                <Briefcase className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Browse Internships</p>
                  <p className="text-xs text-[var(--text-muted)]">Find new opportunities</p>
                </div>
              </Link>
              <Link to="/student/applications" className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors">
                <FileText className="w-5 h-5 text-secondary-600" />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">My Applications</p>
                  <p className="text-xs text-[var(--text-muted)]">Track your progress</p>
                </div>
              </Link>
              <Link to="/student/saved" className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors">
                <Bookmark className="w-5 h-5 text-accent-600" />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Saved Internships</p>
                  <p className="text-xs text-[var(--text-muted)]">{savedCount} saved</p>
                </div>
              </Link>
              <Link to="/student/profile" className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors">
                <Clock className="w-5 h-5 text-warning-600" />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Update Profile</p>
                  <p className="text-xs text-[var(--text-muted)]">Keep your info current</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--text-primary)]">Recommended for You</h2>
            <Link to="/internships" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommended.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} showActions={false} />
            ))}
            {recommended.length === 0 && (
              <p className="text-sm text-[var(--text-muted)] text-center py-4 col-span-full">No active internships available at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

