import { useState, useEffect } from "react";
import {
  Search,
  FileText,
  User,
  Building2,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { getAdminApplications } from "../../services/adminService";

export function ManageApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAdminApplications(search, statusFilter, page, limit);
      
      // format response lists
      // Since the crud return joins, we extract raw data or items
      setApplications(response.data.items || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, search, statusFilter]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="page-container max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Student Applications</h1>
        <p className="text-sm text-[var(--text-muted)]">Track and audit internship applications and statuses across the platform</p>
      </div>

      {/* Search & Filter */}
      <div className="card p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by student name, email, or internship title..."
            className="input-field pl-10 py-2.5"
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={handleFilterChange}
            className="input-field py-2.5 text-xs focus:ring-primary-500"
          >
            <option value="">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table grid */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-10 h-10 text-error-500 mx-auto mb-3" />
            <p className="text-sm text-[var(--text-muted)]">{error}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-sm text-[var(--text-muted)]">No applications found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Internship Post</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4 text-center">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-primary)]">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-[var(--bg-hover)]/30 transition-colors">
                    <td className="p-4 text-[var(--text-secondary)]">#{app.id}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-[var(--text-primary)] flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                          {app.student ? `${app.student.first_name} ${app.student.last_name}` : `ID: #${app.student_id}`}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{app.student?.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                        <Building2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        {app.internship?.company?.company_name || "Company Portal"}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-[var(--text-primary)]">
                      {app.internship?.title || `ID: #${app.internship_id}`}
                    </td>
                    <td className="p-4 text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1 text-[10px]">
                        <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        {new Date(app.applied_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`badge ${
                        app.status === "Selected"
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : app.status === "Rejected"
                            ? "bg-red-50 text-red-750 dark:bg-red-900/20 dark:text-red-400"
                            : app.status === "Shortlisted"
                              ? "bg-blue-50 text-blue-750 dark:bg-blue-900/20 dark:text-blue-400"
                              : app.status === "Under Review"
                                ? "bg-purple-50 text-purple-755 dark:bg-purple-900/20 dark:text-purple-400"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      } font-semibold`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-[var(--text-muted)]">
            Showing <span className="font-semibold text-[var(--text-primary)]">{(page - 1) * limit + 1}</span> to{" "}
            <span className="font-semibold text-[var(--text-primary)]">{Math.min(page * limit, total)}</span> of{" "}
            <span className="font-semibold text-[var(--text-primary)]">{total}</span> applications
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-1.5 border rounded border-[var(--border-secondary)] disabled:opacity-40 hover:bg-[var(--bg-hover)] text-[var(--text-primary)]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="p-1.5 border rounded border-[var(--border-secondary)] disabled:opacity-40 hover:bg-[var(--bg-hover)] text-[var(--text-primary)]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
