import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Calendar,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Check,
  Send,
  Briefcase,
} from "lucide-react";
import { Modal } from "../../components/common/Modal";
import { useAuth } from "../../hooks/useAuth";
import { getInternshipById } from "../../services/internshipService";
import { applyInternship } from "../../services/applicationService";

export function InternshipDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    fetchInternship();
  }, []);

  const fetchInternship = async () => {
    try {
      const data = await getInternshipById(id);

      setInternship(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="page-container flex justify-center items-center">
        <h2>Loading...</h2>
      </div>
    );
  }
  if (!internship) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Internship not found
          </h2>
          <button
            onClick={() => navigate("/internships")}
            className="btn-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Internships
          </button>
        </div>
      </div>
    );
  }

  const handleApply = async () => {
  try {

    await applyInternship(internship.id);

    setApplySuccess(true);

    setTimeout(() => {
      setShowApplyModal(false);
      setApplySuccess(false);
    }, 2000);

  } catch (error) {

    console.error(error);

    alert(error.response?.data?.detail || "Failed to apply for internship");

  }
};

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/internships")}
          className="btn-outline mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Internships
        </button>

        <div className="card overflow-hidden">
          <div className="p-6 lg:p-8">
            <div className="flex items-start gap-4 mb-6">
              <img
                src={internship.companyLogo}
                alt={internship.companyName}
                className="w-16 h-16 rounded-xl object-cover bg-[var(--bg-elevated)]"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                  {internship.title}
                </h1>
                <p className="text-[var(--text-muted)] flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {internship.companyName}
                </p>
              </div>
              {user?.role === "student" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className="p-2.5 rounded-lg border border-[var(--border-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-5 h-5 text-primary-500" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-[var(--text-muted)]" />
                    )}
                  </button>
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="btn-primary"
                  >
                    <Send className="w-4 h-4" />
                    Apply Now
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-[var(--text-secondary)]">
                  {internship.location}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-[var(--text-secondary)]">
                  {internship.duration}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-[var(--text-secondary)]">
                  {internship.stipend}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-[var(--text-secondary)]">
                  Deadline: {internship.deadline}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                  About the Role
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {internship.description}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {internship.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                  Internship Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between py-3 border-b border-[var(--border-primary)]">
                    <span className="text-[var(--text-muted)] text-sm">
                      Type
                    </span>
                    <span className="text-[var(--text-primary)] text-sm font-medium">
                      {internship.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[var(--border-primary)]">
                    <span className="text-[var(--text-muted)] text-sm">
                      Duration
                    </span>
                    <span className="text-[var(--text-primary)] text-sm font-medium">
                      {internship.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[var(--border-primary)]">
                    <span className="text-[var(--text-muted)] text-sm">
                      Stipend
                    </span>
                    <span className="text-[var(--text-primary)] text-sm font-medium">
                      {internship.stipend}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[var(--border-primary)]">
                    <span className="text-[var(--text-muted)] text-sm">
                      Posted
                    </span>
                    <span className="text-[var(--text-primary)] text-sm font-medium">
                      {internship.postedDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[var(--border-primary)]">
                    <span className="text-[var(--text-muted)] text-sm">
                      Deadline
                    </span>
                    <span className="text-[var(--text-primary)] text-sm font-medium">
                      {internship.deadline}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[var(--border-primary)]">
                    <span className="text-[var(--text-muted)] text-sm">
                      Applications
                    </span>
                    <span className="text-[var(--text-primary)] text-sm font-medium">
                      {internship.applications}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Apply for Internship"
      >
        {applySuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-success-50 dark:bg-success-900/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-success-500" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Application Submitted!
            </h3>
            <p className="text-sm text-[var(--text-muted)]">
              Your application has been successfully submitted. Good luck!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[var(--text-secondary)]">
              You are applying for{" "}
              <strong className="text-[var(--text-primary)]">
                {internship.title}
              </strong>{" "}
              at{" "}
              <strong className="text-[var(--text-primary)]">
                {internship.companyName}
              </strong>
              .
            </p>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Resume
              </label>
              <div className="flex items-center gap-3 p-3 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-elevated)]">
                <Briefcase className="w-5 h-5 text-[var(--text-muted)]" />
                <span className="text-sm text-[var(--text-primary)]">
                  {user?.name}-resume.pdf
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Cover Letter (Optional)
              </label>
              <textarea
                className="input-field min-h-[100px] resize-none"
                placeholder="Tell us why you are a great fit for this role..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowApplyModal(false)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button onClick={handleApply} className="btn-primary flex-1">
                Submit Application
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
