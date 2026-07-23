import { useState, useEffect } from "react";
import {
  Search,
  Briefcase,
  Trash2,
  MapPin,
  Calendar,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Activity,
  DollarSign
} from "lucide-react";
import { getAdminInternships, toggleInternshipActive, deleteInternship } from "../../services/adminService";

export function ManageInternshipsPage() {
  const [internships, setInternships] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Processing state
  const [actionId, setActionId] = useState(null);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      setError("");
      
      let isActiveVal = null;
      if (activeFilter === "true") isActiveVal = true;
      if (activeFilter === "false") isActiveVal = false;
      
      const response = await getAdminInternships(search, isActiveVal, page, limit);
      setInternships(response.data.items);
      setTotal(response.data.total);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch internships. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [page, search, activeFilter]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (e) => {
    setActiveFilter(e.target.value);
    setPage(1);
  };

  const handleToggleActive = async (id, currentActive, title) => {
    const action = currentActive ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} the internship "${title}"?`)) {
      return;
    }

    try {
      setActionId(id);
      await toggleInternshipActive(id, !currentActive);
      alert(`Internship ${currentActive ? "deactivated" : "activated"} successfully.`);
      fetchInternships();
    } catch (err) {
      console.error(err);
      alert("Failed to toggle internship status. Please try again.");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the internship "${title}"? This will delete all applications submitted for it.`)) {
      return;
    }

    try {
      setActionId(id);
      await deleteInternship(id);
      alert("Internship deleted successfully.");
      if (internships.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchInternships();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete internship. Please try again.");
    } finally {
      setActionId(null);
    }
  };

  const openDetailsModal = (internship) => {
    setSelectedInternship(internship);
    setShowModal(true);
  };

  const closeDetailsModal = () => {
    setSelectedInternship(null);
    setShowModal(false);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="page-container max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Manage Internships</h1>
        <p className="text-sm text-[var(--text-muted)]">Browse all posted internships, toggle visibility, and moderate active listings</p>
      </div>

      {/* Search & Filter */}
      <div className="card p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search internships by title, location, skills..."
            className="input-field pl-10 py-2.5"
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={activeFilter}
            onChange={handleFilterChange}
            className="input-field py-2.5 text-xs focus:ring-primary-500"
          >
            <option value="">All Internships</option>
            <option value="true">Active Posts</option>
            <option value="false">Inactive Posts</option>
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
        ) : internships.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-sm text-[var(--text-muted)]">No internships found matching your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Internship Title</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Stipend</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-primary)]">
                {internships.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--bg-hover)]/30 transition-colors">
                    <td className="p-4 text-[var(--text-secondary)]">#{item.id}</td>
                    <td className="p-4 font-semibold text-[var(--text-primary)]">{item.title}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{item.company?.company_name || `ID: #${item.company_id}`}</td>
                    <td className="p-4 text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        {item.location} ({item.type})
                      </span>
                    </td>
                    <td className="p-4 text-[var(--text-secondary)] font-medium">
                      <span className="flex items-center gap-0.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        {item.stipend}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(item.id, item.is_active, item.title)}
                        disabled={actionId === item.id}
                        className={`badge ${
                          item.is_active
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-100"
                            : "bg-red-50 text-red-750 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100"
                        } font-semibold transition-all cursor-pointer`}
                        title="Click to toggle active status"
                      >
                        {item.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openDetailsModal(item)}
                          className="btn-outline py-1 px-2.5 text-[10px] hover:bg-primary-50 hover:text-primary-600"
                        >
                          Inspect Post
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          disabled={actionId === item.id}
                          className="p-1.5 text-[var(--text-muted)] hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
            <span className="font-semibold text-[var(--text-primary)]">{total}</span> internships
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

      {/* Inspect Modal */}
      {showModal && selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-primary)] rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-thin shadow-xl animate-scale-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-[var(--border-primary)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">{selectedInternship.title}</h3>
                  <p className="text-[10px] text-[var(--text-muted)]">Posted by: {selectedInternship.company?.company_name}</p>
                </div>
              </div>
              <button onClick={closeDetailsModal} className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
                <X className="w-4.5 h-4.5 text-[var(--text-muted)]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs text-[var(--text-secondary)]">
              {/* Description */}
              <div className="space-y-2">
                <h4 className="font-bold text-[var(--text-secondary)] uppercase tracking-wider text-[10px]">Description</h4>
                <p className="leading-relaxed bg-[var(--bg-elevated)] p-4 rounded-lg">
                  {selectedInternship.description}
                </p>
              </div>

              {/* Requirement skills */}
              <div className="space-y-2">
                <h4 className="font-bold text-[var(--text-secondary)] uppercase tracking-wider text-[10px]">Skills Required</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedInternship.skills.split(",").map((skill, index) => (
                    <span key={index} className="badge bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 border border-primary-200/30">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metadata details list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[var(--border-primary)] pt-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-[var(--text-secondary)] uppercase tracking-wider text-[10px]">Position Info</h4>
                  <div className="space-y-1.5">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>{selectedInternship.location} ({selectedInternship.type})</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>Stipend: {selectedInternship.stipend} / month</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-[var(--text-secondary)] uppercase tracking-wider text-[10px]">Deadlines & Dates</h4>
                  <div className="space-y-1.5">
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>Apply Deadline: {selectedInternship.deadline}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>Created At: {new Date(selectedInternship.created_at).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Status details */}
              <div className="flex justify-between items-center bg-[var(--bg-elevated)] p-4 rounded-lg border-t border-[var(--border-primary)] mt-4">
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[10px] text-[var(--text-muted)] mb-1">Internship Status</h4>
                  <span className={`badge ${selectedInternship.is_active ? "bg-green-50 text-green-700 dark:bg-green-900/20" : "bg-red-50 text-red-750 dark:bg-red-900/20"}`}>
                    {selectedInternship.is_active ? "Active" : "Deactivated / Closed"}
                  </span>
                </div>
                <div className="text-right">
                  <h4 className="font-bold uppercase tracking-wider text-[10px] text-[var(--text-muted)] mb-1">Company Status</h4>
                  <span className={`badge ${selectedInternship.company?.approval_status === "Approved" ? "bg-green-50 text-green-700 dark:bg-green-900/20" : "bg-yellow-50 text-yellow-750 dark:bg-yellow-900/20"}`}>
                    {selectedInternship.company?.approval_status || "Unknown"}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center p-4 border-t border-[var(--border-primary)] bg-[var(--bg-elevated)] rounded-b-xl">
              <button onClick={closeDetailsModal} className="btn-outline py-1.5 px-4 text-xs">
                Close
              </button>
              <button
                onClick={() => {
                  closeDetailsModal();
                  handleToggleActive(selectedInternship.id, selectedInternship.is_active, selectedInternship.title);
                }}
                className={`btn-primary py-1.5 px-4 text-xs ${selectedInternship.is_active ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
              >
                {selectedInternship.is_active ? "Deactivate Post" : "Activate Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
