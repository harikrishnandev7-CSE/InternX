import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  CheckCircle,
  ArrowRight,
  Plus,
  FileText,
  Activity,
  XCircle,
  Star,
  Clock,
  TrendingUp,
  MinusCircle
} from 'lucide-react';
import { getCompanyInternships } from '../../services/internshipService';
import { getCompanyApplications, getCompanyDashboardStats } from '../../services/applicationService';
import { useToast } from '../../hooks/useToast';

export function CompanyDashboard() {
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    total_internships: 0,
    active_internships: 0,
    inactive_internships: 0,
    total_applicants: 0,
    under_review: 0,
    shortlisted: 0,
    selected: 0,
    rejected: 0
  });
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [recentInternships, setRecentInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch company internships, applications and stats
      const internshipsList = await getCompanyInternships();
      const applicationsList = await getCompanyApplications();
      const statsData = await getCompanyDashboardStats();

      setStats(statsData);

      // Enrich internships with application count
      const enrichedInternships = internshipsList.map(internship => {
        const count = applicationsList.filter(app => app.internship_id === internship.id).length;
        return {
          ...internship,
          applications: count
        };
      });

      setRecentInternships(enrichedInternships.slice(0, 3));

      // Recent applicants (first 5)
      const formattedApplicants = applicationsList.map(app => ({
        id: app.id,
        name: app.student_name,
        college: app.department,
        degree: `Year ${app.year}`,
        status: app.status
      })).slice(0, 5);

      setRecentApplicants(formattedApplicants);

    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data. Please check your connection and try again.");
      showToast("Error loading dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-error-50 dark:bg-error-900/20 flex items-center justify-center mb-4">
          <XCircle className="w-8 h-8 text-error-600" />
        </div>
        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">{error}</h3>
        <button onClick={fetchDashboardData} className="btn-primary mt-4">Retry</button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="section-title">Company Dashboard</h1>
          <p className="section-subtitle">Overview of your internship postings and applicants</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stat-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-primary-600" />
              </div>
              <span className="stat-label">Total Internships</span>
            </div>
            <span className="stat-value">{stats.total_internships}</span>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-success-50 dark:bg-success-900/20 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-success-600" />
              </div>
              <span className="stat-label">Active Internships</span>
            </div>
            <span className="stat-value">{stats.active_internships}</span>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-error-50 dark:bg-error-900/20 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-error-600" />
              </div>
              <span className="stat-label">Inactive Internships</span>
            </div>
            <span className="stat-value">{stats.inactive_internships}</span>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-secondary-50 dark:bg-secondary-900/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-secondary-600" />
              </div>
              <span className="stat-label">Total Applicants</span>
            </div>
            <span className="stat-value">{stats.total_applicants}</span>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-warning-50 dark:bg-warning-900/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-warning-600" />
              </div>
              <span className="stat-label">Under Review</span>
            </div>
            <span className="stat-value">{stats.under_review}</span>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                <Star className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="stat-label">Shortlisted</span>
            </div>
            <span className="stat-value">{stats.shortlisted}</span>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="stat-label">Selected</span>
            </div>
            <span className="stat-value">{stats.selected}</span>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
                <MinusCircle className="w-4 h-4 text-rose-600" />
              </div>
              <span className="stat-label">Rejected</span>
            </div>
            <span className="stat-value">{stats.rejected}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--text-primary)]">Recent Applicants</h2>
              <Link to="/company/applicants" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentApplicants.map((applicant) => (
                <div key={applicant.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{applicant.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{applicant.college} - {applicant.degree}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    applicant.status === 'Selected' ? 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400' :
                    applicant.status === 'Shortlisted' ? 'bg-secondary-50 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-400' :
                    applicant.status === 'Rejected' ? 'bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400' :
                    applicant.status === 'Under Review' ? 'bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400' :
                    'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  }`}>
                    {applicant.status}
                  </span>
                </div>
              ))}
              {recentApplicants.length === 0 && (
                <p className="text-sm text-[var(--text-muted)] text-center py-4">No applications received yet.</p>
              )}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--text-primary)]">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <Link to="/company/internships/create" className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors">
                <Plus className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Post New Internship</p>
                  <p className="text-xs text-[var(--text-muted)]">Create a new listing</p>
                </div>
              </Link>
              <Link to="/company/internships" className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors">
                <Briefcase className="w-5 h-5 text-secondary-600" />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Manage Internships</p>
                  <p className="text-xs text-[var(--text-muted)]">Edit or close listings</p>
                </div>
              </Link>
              <Link to="/company/applicants" className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors">
                <FileText className="w-5 h-5 text-accent-600" />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Review Applicants</p>
                  <p className="text-xs text-[var(--text-muted)]">Manage candidates</p>
                </div>
              </Link>
              <Link to="/company/profile" className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors">
                <Activity className="w-5 h-5 text-warning-600" />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Company Profile</p>
                  <p className="text-xs text-[var(--text-muted)]">Update company info</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--text-primary)]">Recent Internships</h2>
            <Link to="/company/internships" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentInternships.map((internship) => (
              <div key={internship.id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1">{internship.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
                    <span>{internship.location}</span>
                    <span>{internship.duration}</span>
                    <span>{internship.stipend}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${internship.is_active ? 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400' : 'bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400'}`}>
                      {internship.is_active ? 'Active' : 'Closed'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[var(--text-muted)]">{internship.applications} applications</span>
                  <Link to={`/internship/${internship.id}`} className="btn-outline text-sm py-2">
                    <ArrowRight className="w-4 h-4" />
                    View
                  </Link>
                </div>
              </div>
            ))}
            {recentInternships.length === 0 && (
              <p className="text-sm text-[var(--text-muted)] text-center py-4">No internships posted yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


