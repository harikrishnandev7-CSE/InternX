import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Edit2,
  Eye,
  Plus,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  Trash2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { 
  getCompanyInternships, 
  deleteInternship, 
  updateInternshipStatus 
} from "../../services/internshipService";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { Modal } from "../../components/common/Modal";

export function ManageInternships() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Deletion state
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      setError("");
      const internships = await getCompanyInternships();
      setList(internships);
    } catch (err) {
      console.error(err);
      setError("Failed to load internships. Please check your connection and try again.");
      showToast("Error fetching internships", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const updated = await updateInternshipStatus(id);
      setList((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      showToast(`Internship status changed to ${updated.is_active ? "Active" : "Closed"}.`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to toggle status. Please try again.", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      await deleteInternship(deletingId);
      setList((prev) => prev.filter((item) => item.id !== deletingId));
      showToast("Internship deleted successfully", "success");
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      showToast("Failed to delete internship", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="section-title">Manage Internships</h1>
            <p className="section-subtitle">
              View and manage your internship postings
            </p>
          </div>
          <Link to="/company/internships/create" className="btn-primary">
            <Plus className="w-4 h-4" />
            Post Internship
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="card p-5 animate-pulse flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-[var(--bg-elevated)] rounded w-1/3" />
                  <div className="flex gap-4">
                    <div className="h-4 bg-[var(--bg-elevated)] rounded w-1/4" />
                    <div className="h-4 bg-[var(--bg-elevated)] rounded w-1/4" />
                    <div className="h-4 bg-[var(--bg-elevated)] rounded w-1/4" />
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-9 h-9 bg-[var(--bg-elevated)] rounded-lg" />
                  <div className="w-9 h-9 bg-[var(--bg-elevated)] rounded-lg" />
                  <div className="w-9 h-9 bg-[var(--bg-elevated)] rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="card p-8 text-center max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-error-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">Error loading listings</h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">{error}</p>
            <button onClick={fetchInternships} className="btn-primary mx-auto">
              Retry
            </button>
          </div>
        )}

        {/* Data List */}
        {!loading && !error && (
          <div className="space-y-3">
            {Array.isArray(list) && list.map((internship) => (
              <div
                key={internship.id}
                className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[var(--text-primary)]">
                      {internship.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        internship.is_active 
                          ? "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400" 
                          : "bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400"
                      }`}
                    >
                      {internship.is_active ? "Active" : "Closed"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {internship.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {internship.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      {internship.stipend}
                    </span>
                    <span>Deadline: {internship.deadline}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(internship.id)}
                    className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                    title={internship.is_active ? "Close Listing" : "Open Listing"}
                  >
                    <CheckCircle
                      className={`w-4 h-4 ${internship.is_active ? "text-success-500" : "text-[var(--text-muted)]"}`}
                    />
                  </button>
                  <Link
                    to={`/internship/${internship.id}`}
                    className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4 text-[var(--text-muted)]" />
                  </Link>
                  <button
                    onClick={() => navigate(`/company/internships/edit/${internship.id}`)}
                    className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                    title="Edit Listing"
                  >
                    <Edit2 className="w-4 h-4 text-[var(--text-muted)]" />
                  </button>
                  <button
                    onClick={() => setDeletingId(internship.id)}
                    className="p-2 rounded-lg hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-4 h-4 text-error-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && list.length === 0 && (
          <div className="text-center py-16 card">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
              No internships posted
            </h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Create your first internship listing to attract applicants.
            </p>
            <Link to="/company/internships/create" className="btn-primary mx-auto">
              <Plus className="w-4 h-4" />
              Post Internship
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deletingId !== null}
        onClose={() => !isDeleting && setDeletingId(null)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-[var(--text-secondary)]">
            Are you sure you want to delete this internship posting? This action is permanent and cannot be undone.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setDeletingId(null)}
              className="btn-outline flex-1"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="btn-primary bg-error-600 hover:bg-error-700 border-error-600 hover:border-error-700 text-white flex-1 flex justify-center items-center gap-2"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
