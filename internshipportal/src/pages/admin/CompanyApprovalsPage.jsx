import { useState, useEffect } from "react";
import {
  Search,
  Building2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Globe,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  X
} from "lucide-react";
import { getAdminCompanies, updateCompanyStatus } from "../../services/adminService";

export function CompanyApprovalsPage() {
  const [companies, setCompanies] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal State
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Action processing state
  const [actionId, setActionId] = useState(null);

  const fetchPendingCompanies = async () => {
    try {
      setLoading(true);
      setError("");
      // Filter strictly by "Pending" status
      const response = await getAdminCompanies(search, "Pending", page, limit);
      setCompanies(response.data.items);
      setTotal(response.data.total);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch pending approvals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCompanies();
  }, [page, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleApprovalAction = async (id, status, name) => {
    const verb = status === "Approved" ? "approve" : "reject";
    if (!window.confirm(`Are you sure you want to ${verb} company "${name}"?`)) {
      return;
    }

    try {
      setActionId(id);
      await updateCompanyStatus(id, status);
      alert(`Company "${name}" has been ${status.toLowerCase()} successfully.`);
      if (companies.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchPendingCompanies();
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to ${verb} company. Please try again.`);
    } finally {
      setActionId(null);
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
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Company Approvals</h1>
        <p className="text-sm text-[var(--text-muted)]">Review and authorize new company registrations to grant platform access</p>
      </div>

      {/* Warning Callout */}
      <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-400 border border-yellow-250/20 rounded-xl text-xs">
        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
        <div>
          <span className="font-bold">Pending Registrations:</span> Pending companies cannot login, create internships, or review applicants until you review and click <strong>Approve</strong>.
        </div>
      </div>

      {/* Search Bar */}
      <div className="card p-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search pending companies by name or email..."
            className="input-field pl-10 py-2.5"
          />
        </div>
      </div>

      {/* Table Card */}
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
          <div className="p-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-950/20 flex items-center justify-center text-green-500 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">All Caught Up!</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">No company registrations are currently pending approval.</p>
            </div>
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
                  <th className="p-4 text-center">Review Details</th>
                  <th className="p-4 text-center">Authorize Actions</th>
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
                    <td className="p-4 text-center">
                      <button
                        onClick={() => openProfileModal(company)}
                        className="btn-outline py-1 px-3 text-[10px] mx-auto"
                      >
                        Inspect profile
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleApprovalAction(company.id, "Approved", company.company_name)}
                          disabled={actionId === company.id}
                          className="btn-primary py-1 px-3 text-[10px] bg-green-600 hover:bg-green-700 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleApprovalAction(company.id, "Rejected", company.company_name)}
                          disabled={actionId === company.id}
                          className="btn-secondary py-1 px-3 text-[10px] bg-red-650 hover:bg-red-750 flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
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
            <span className="font-semibold text-[var(--text-primary)]">{total}</span> pending companies
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

      {/* Detailed Inspection Modal */}
      {showModal && selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-primary)] rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-thin shadow-xl animate-scale-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-[var(--border-primary)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 font-bold text-lg">
                  {selectedCompany.company_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">{selectedCompany.company_name}</h3>
                  <p className="text-[10px] text-[var(--text-muted)]">Pending Verification</p>
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
                <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Company Description</h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-elevated)] p-4 rounded-lg">
                  {selectedCompany.description || "No description provided."}
                </p>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Contact Info</h4>
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
                  <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Location & Website</h4>
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
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-[var(--text-muted)] italic">No website provided</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer with quick approvals */}
            <div className="flex justify-between items-center p-4 border-t border-[var(--border-primary)] bg-[var(--bg-elevated)] rounded-b-xl">
              <button onClick={closeProfileModal} className="btn-outline py-1.5 px-4 text-xs">
                Close
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    closeProfileModal();
                    handleApprovalAction(selectedCompany.id, "Rejected", selectedCompany.company_name);
                  }}
                  className="btn-secondary py-1.5 px-4 text-xs bg-red-650 hover:bg-red-750"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    closeProfileModal();
                    handleApprovalAction(selectedCompany.id, "Approved", selectedCompany.company_name);
                  }}
                  className="btn-primary py-1.5 px-4 text-xs bg-green-600 hover:bg-green-700"
                >
                  Approve Company
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
