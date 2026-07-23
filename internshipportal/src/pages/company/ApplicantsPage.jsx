import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CheckCircle,
  XCircle,
  Star,
  ArrowRight,
  Search,
  Filter,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  FileText
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { getCompanyApplications, updateApplicationStatus } from '../../services/applicationService';
import { ResumeViewerModal } from '../../components/common/ResumeViewerModal';

const formatBytes = (bytes, decimals = 1) => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};


export function ApplicantsPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [applicantList, setApplicantList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResume, setSelectedResume] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleViewResume = (applicant) => {
    setSelectedResume({
      url: applicant.resume_url,
      studentName: applicant.student_name,
      fileName: applicant.resume_filename,
      uploadedAt: applicant.resume_uploaded_at,
      fileSize: applicant.resume_file_size
    });
    setIsViewerOpen(true);
  };

  const statusOptions = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected'];

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getCompanyApplications();
      setApplicantList(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load applicants. Please check your connection and try again.");
      showToast("Error fetching applicants", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateApplicationStatus(id, newStatus);
      showToast(`Applicant status updated to "${newStatus}"`, "success");
      // Refresh list to pull fresh data
      fetchApplicants();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.detail || "Failed to update status", "error");
    }
  };

  const filtered = applicantList.filter((a) => {
    const nameMatch = a.student_name ? a.student_name.toLowerCase().includes(search.toLowerCase()) : false;
    const deptMatch = a.department ? a.department.toLowerCase().includes(search.toLowerCase()) : false;
    const skillsMatch = a.skills ? a.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())) : false;
    const matchesSearch = search === '' || nameMatch || deptMatch || skillsMatch;
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <button onClick={fetchApplicants} className="btn-primary mt-4">Retry</button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="section-title">Applicants</h1>
          <p className="section-subtitle">Review and manage all applicants for your internships</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, department, or skills..."
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field pl-10 pr-8"
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((applicant) => (
            <div key={applicant.id} className="card p-5">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-semibold text-[var(--text-primary)] text-lg">{applicant.student_name}</h3>
                    <span className="text-xs text-[var(--text-muted)] font-normal">applied for</span>
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{applicant.internship_title}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${applicant.status === 'Selected' ? 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400' :
                      applicant.status === 'Shortlisted' ? 'bg-secondary-50 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-400' :
                        applicant.status === 'Rejected' ? 'bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400' :
                          applicant.status === 'Under Review' ? 'bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400' :
                            'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                      }`}>
                      {applicant.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)] mb-2">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" />
                      {applicant.department}
                    </span>
                    <span>Year {applicant.year}</span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      Applied {applicant.applied_at ? new Date(applicant.applied_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[var(--text-secondary)] mb-2">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      {applicant.student_email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      {applicant.student_phone}
                    </span>
                  </div>

                  {(applicant.linkedin || applicant.github || applicant.portfolio) && (
                    <div className="flex flex-wrap gap-3 text-xs mb-3">
                      {applicant.linkedin && (
                        <a
                          href={applicant.linkedin.startsWith('http') ? applicant.linkedin : `https://${applicant.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary-600 hover:text-primary-700 hover:underline"
                        >
                          <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                        </a>
                      )}
                      {applicant.github && (
                        <a
                          href={applicant.github.startsWith('http') ? applicant.github : `https://${applicant.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary-600 hover:text-primary-700 hover:underline"
                        >
                          <Github className="w-3.5 h-3.5" /> GitHub
                        </a>
                      )}
                      {applicant.portfolio && (
                        <a
                          href={applicant.portfolio.startsWith('http') ? applicant.portfolio : `https://${applicant.portfolio}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary-600 hover:text-primary-700 hover:underline"
                        >
                          <Globe className="w-3.5 h-3.5" /> Portfolio
                        </a>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {applicant.skills.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] text-[var(--text-secondary)] text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Resume Section */}
                  <div className="mt-4 pt-3 border-t border-[var(--border-primary)]">
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Resume Status</p>
                    {applicant.resume_url ? (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-xl gap-3">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-xs" title={applicant.resume_filename}>
                              {applicant.resume_filename}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-2 text-xs text-[var(--text-muted)] mt-0.5">
                              <span>Size: {formatBytes(applicant.resume_file_size)}</span>
                              {applicant.resume_uploaded_at && (
                                <>
                                  <span className="hidden sm:inline">•</span>
                                  <span>Uploaded: {new Date(applicant.resume_uploaded_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => handleViewResume(applicant)}
                            className="flex-1 sm:flex-initial text-center px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                          >
                            View Resume
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-error-500 font-semibold bg-error-500/10 w-fit px-2.5 py-1 rounded-md">
                        No Resume Uploaded
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(applicant.id, 'Shortlisted')}
                      className={`p-2 rounded-lg transition-colors ${applicant.status === 'Shortlisted'
                        ? 'bg-secondary-50 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-400'
                        : 'hover:bg-[var(--bg-hover)] text-[var(--text-muted)]'
                        }`}
                      title="Shortlist"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(applicant.id, 'Selected')}
                      className={`p-2 rounded-lg transition-colors ${applicant.status === 'Selected'
                        ? 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400'
                        : 'hover:bg-[var(--bg-hover)] text-[var(--text-muted)]'
                        }`}
                      title="Select"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(applicant.id, 'Rejected')}
                      className={`p-2 rounded-lg transition-colors ${applicant.status === 'Rejected'
                        ? 'bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400'
                        : 'hover:bg-[var(--bg-hover)] text-[var(--text-muted)]'
                        }`}
                      title="Reject"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No applicants found</h3>
            <p className="text-sm text-[var(--text-muted)]">
              {search || statusFilter !== 'All'
                ? 'Try adjusting your search or filters.'
                : 'Applicants will appear here when students apply to your internships.'}
            </p>
          </div>
        )}
      </div>

      {/* ATS Resume Viewer Modal */}
      <ResumeViewerModal
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedResume(null);
        }}
        resumeUrl={selectedResume?.url}
        studentName={selectedResume?.studentName}
        fileName={selectedResume?.fileName}
        uploadedAt={selectedResume?.uploadedAt}
        fileSize={selectedResume?.fileSize}
      />
    </div>
  );
}

