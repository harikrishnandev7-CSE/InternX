import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Briefcase,
  Plus,
  X,
  ArrowLeft,
  Check,
  Clock,
  DollarSign,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { getInternshipById, updateInternship } from "../../services/internshipService";
import { useToast } from "../../hooks/useToast";

export function EditInternship() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [duration, setDuration] = useState("");
  const [stipend, setStipend] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Remote");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    fetchInternshipDetails();
  }, [id]);

  const fetchInternshipDetails = async () => {
    try {
      setLoading(true);
      const data = await getInternshipById(id);
      setTitle(data.title);
      setDescription(data.description);
      setSkills(data.skills || []);
      setDuration(data.duration);
      setStipend(data.stipend);
      setLocation(data.location);
      setType(data.type);
      setDeadline(data.deadline);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load internship details. Please try again.");
      setLoading(false);
      showToast("Error loading internship details", "error");
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (skills.length === 0) {
      showToast("Please add at least one required skill", "error");
      return;
    }

    try {
      setError("");
      await updateInternship(id, {
        title,
        description,
        skills: skills.join(", "),
        location,
        duration,
        stipend,
        type,
        deadline,
      });

      setIsSuccess(true);
      showToast("Internship updated successfully!", "success");

      setTimeout(() => {
        navigate("/company/internships");
      }, 1500);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail || "Failed to update internship";
      setError(errMsg);
      showToast(errMsg, "error");
    }
  };

  if (loading) {
    return (
      <div className="page-container flex flex-col justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-[var(--text-muted)]">Loading internship details...</p>
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="page-container flex items-center justify-center py-20">
        <div className="text-center card p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-error-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Error Occurred
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/company/internships")}
              className="btn-outline"
            >
              Back to Internships
            </button>
            <button
              onClick={fetchInternshipDetails}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="page-container flex items-center justify-center py-20">
        <div className="text-center card p-8 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-success-50 dark:bg-success-900/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-success-500" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Internship Updated!
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Your changes have been saved successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/company/internships")}
          className="btn-outline mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Internships
        </button>

        <div className="mb-6">
          <h1 className="section-title">Edit Internship</h1>
          <p className="section-subtitle">
            Update the details of your internship posting
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-error-500 bg-error-50 dark:bg-error-900/20 p-3 rounded-lg mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Title
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Software Engineering Intern"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the internship role, responsibilities, and what the intern will learn..."
              className="input-field min-h-[120px] resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Skills Required
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSkill())
                }
                placeholder="Add a skill and press Enter"
                className="input-field"
              />
              <button
                type="button"
                onClick={addSkill}
                className="btn-outline px-3"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-primary-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Duration
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 3 months"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Stipend
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  placeholder="e.g., $5000/month"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., San Francisco, CA"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="input-field"
                required
              >
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Application Deadline
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/company/internships")}
              className="btn-outline flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
