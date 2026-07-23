import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowRight, Building2, Calendar } from "lucide-react";
import { StatusBadge } from "../../components/common/StatusBadge";
import { getStudentApplications } from "../../services/applicationService";

export function MyApplications() {
  const [applications, setApplications] = useState([]);
  const statusFilter = [
    "All",
    "Applied",
    "Under Review",
    "Shortlisted",
    "Rejected",
    "Selected",
  ];
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    if (filter === "All") return applications;
    return applications.filter((app) => app.status === filter);
  }, [filter, applications]);
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getStudentApplications();

      setApplications(data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="page-container">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="section-title">My Applications</h1>
          <p className="section-subtitle">
            Track all your internship applications
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {statusFilter.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === s
                  ? "bg-primary-600 text-white"
                  : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                  {app.internship_title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {app.company_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Applied {new Date(app.applied_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={app.status} />
                <Link
                  to={`/internship/${app.internship_id}`}
                  className="btn-outline text-sm py-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
              No applications found
            </h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Start applying to internships to see them here.
            </p>
            <Link to="/internships" className="btn-primary">
              Browse Internships
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
