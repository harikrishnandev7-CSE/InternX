import { useState, useEffect } from "react";
import {
  Search,
  Building2,
  Trash2,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Globe,
  X,
  Briefcase,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Lock,
  Unlock
} from "lucide-react";
import { 
  getAdminCompanies, 
  updateCompanyStatus, 
  toggleCompanyActive, 
  deleteCompany 
} from "../../services/adminService";

export function ManageCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal State
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Toggling/Deleting flags
  const [processingId, setProcessingId] = useState(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAdminCompanies(search, statusFilter, page, limit);
      setCompanies(response.data.items);
      setTotal(response.data.total);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch companies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page, search, statusFilter]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleToggleActive = async (id, currentActive, name) => {
    const action = currentActive ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} company "${name}"?`)) {
      return;
    }

    try {
      setProcessingId(id);
      await toggleCompanyActive(id, !currentActive);
      alert(`Company ${currentActive ? "deactivated" : "activated"} successfully.`);
      fetchCompanies();
    } catch (err) {
      console.error(err);
      alert("Failed to toggle company active status. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete company "${name}"? This will delete all their posted internships and applications.`)) {
      return;
    }

    try {
      setProcessingId(id);
      await deleteCompany(id);
      alert("Company deleted successfully.");
      if (companies.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchCompanies();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete company. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const openProfileModal = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
  };

  const closeProfileModal = () => {
    setSelectedCompany(null);
    setShowModal(false);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="page-container max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Manage Companies</h1>
        <p className="text-sm text-[var(--text-muted)]">View profiles, toggle access (activate/deactivate), and delete company portals</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="card p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search companies by name, email, location..."
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
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Companies Table Card */}
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
        ) : companies.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-sm text-[var(--text-muted)]">No companies found matching your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Company Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Approval Status</th>
                  <th className="p-4">Portal Access</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-primary)]">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-[var(--bg-hover)]/30 transition-colors">
                    <td className="p-4 text-[var(--text-secondary)]">#{company.id}</td>
                    <td className="p-4 font-semibold text-[var(--text-primary)]">{company.company_name}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{company.email}</td>
                    <td className="p-4 text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        {company.location}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${
                        company.approval_status === "Approved"
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : company.approval_status === "Rejected"
                            ? "bg-red-50 text-red-750 dark:bg-red-900/20 dark:text-red-400"
                            : "bg-yellow-50 text-yellow-750 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }`}>
                        {company.approval_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(company.id, company.is_approved, company.company_name)}
                        disabled={processingId === company.id || company.approval_status !== "Approved"}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-semibold transition-all ${
                          company.is_approved
                            ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400 hover:bg-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400 hover:bg-red-200"
                        } disabled:opacity-40`}
                        title={company.approval_status !== "Approved" ? "Must approve company registration before toggling portal access" : "Click to toggle access"}
                      >
                        {company.is_approved ? (
                          <>
                            <Unlock className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" />
                            Suspended
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openProfileModal(company)}
                          className="btn-outline py-1 px-2.5 text-[10px] hover:bg-primary-50 hover:text-primary-600"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDelete(company.id, company.company_name)}
                          disabled={processingId === company.id}
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
            <span className="font-semibold text-[var(--text-primary)]">{total}</span> companies
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

      {/* Details Profile Modal */}
      {showModal && selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-primary)] rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-thin shadow-xl animate-scale-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-[var(--border-primary)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 font-bold text-lg">
                  {selectedCompany.company_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">{selectedCompany.company_name}</h3>
                  <p className="text-[10px] text-[var(--text-muted)]">Company ID: #{selectedCompany.id}</p>
                </div>
              </div>
              <button onClick={closeProfileModal} className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
                <X className="w-4.5 h-4.5 text-[var(--text-muted)]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Profile Details Block */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">About Company</h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-elevated)] p-4 rounded-lg">
                  {selectedCompany.description || "No description provided."}
                </p>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Contact Details</h4>
                  <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>{selectedCompany.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>{selectedCompany.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Locations & Web</h4>
                  <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>{selectedCompany.location}</span>
                    </div>
                    {selectedCompany.website ? (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[var(--text-muted)]" />
                        <a
                          href={selectedCompany.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline flex items-center gap-1"
                        >
                          {selectedCompany.website}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-[var(--text-muted)] italic">No website listed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Approval status */}
              <div className="border-t border-[var(--border-primary)] pt-4 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[10px] text-[var(--text-muted)] mb-1">Approval Status</h4>
                  <span className={`badge ${
                    selectedCompany.approval_status === "Approved"
                      ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : selectedCompany.approval_status === "Rejected"
                        ? "bg-red-50 text-red-750 dark:bg-red-900/20 dark:text-red-400"
                        : "bg-yellow-50 text-yellow-750 dark:bg-yellow-900/20 dark:text-yellow-400"
                  }`}>
                    {selectedCompany.approval_status}
                  </span>
                </div>
                <div className="text-right">
                  <h4 className="font-bold uppercase tracking-wider text-[10px] text-[var(--text-muted)] mb-1">Portal Access</h4>
                  <span className={`badge ${
                    selectedCompany.is_approved
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}>
                    {selectedCompany.is_approved ? "Active Access" : "Suspended"}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 border-t border-[var(--border-primary)] bg-[var(--bg-elevated)] rounded-b-xl">
              <button onClick={closeProfileModal} className="btn-outline py-1.5 px-4 text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
