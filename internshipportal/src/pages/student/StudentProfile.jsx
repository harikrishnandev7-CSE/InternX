import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Edit2,
  Check,
  X,
  Plus,
  Trash2,
  Linkedin,
  Github,
  Globe,
  FileText,
  Paperclip,
  ExternalLink,
} from "lucide-react";

import {
  getStudentProfile,
  updateStudentProfile,
  addStudentSkill,
  deleteStudentSkill,
} from "../../services/authService";
import { uploadResume, deleteResume } from "../../services/resumeService";

const formatBytes = (bytes, decimals = 1) => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    department: "",
    year: "",
    linkedin: "",
    github: "",
    portfolio: "",
  });
  
  // Local state placeholders for Skills, Resume, Social Links
  const [skills, setSkills] = useState([]);
  const [tempSkills, setTempSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [resume, setResume] = useState({
    name: "john_doe_resume.pdf",
    size: "1.2 MB",
  });

  const[socials,setSocials] = useState({
    linkedin:"",
    github:"",
    portfolio:"",
  })

  const [tempSocials, setTempSocials] = useState({
    linkedin:"",
    github:"",
    portfolio:"",
   });

  // Page load aana profile fetch pannrom
  useEffect(() => {
    fetchProfile();
  }, []);

  // Backend-la irundhu student profile edukkrom
  const fetchProfile = async () => {
    try {
      const response = await getStudentProfile();
      console.log("profile response", response.data);
      setProfile(response.data);

      setFormData({
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        phone: response.data.phone,
        department: response.data.department,
        year: response.data.year,
        linkedin:response.data.linkedin || "",
        github: response.data.github || "",
        portfolio: response.data.portfolio || "",
      });
      setSkills(response.data.skills || []);
      setTempSkills(response.data.skills || []);
      setSocials({
        linkedin: response.data.linkedin || "",
        github: response.data.github || "",
        portfolio: response.data.portfolio || "",
      });

      setTempSocials({
        linkedin: response.data.linkedin || "",
        github: response.data.github || "",
        portfolio: response.data.portfolio || "",
      });

      if (response.data.resume_url) {
        setResume({
          name: response.data.resume_filename,
          size: formatBytes(response.data.resume_file_size),
          url: response.data.resume_url,
          uploadedAt: response.data.resume_uploaded_at,
        });
      } else {
        setResume(null);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Backend-la profile update pannrom
      await updateStudentProfile({
        ...formData,

        linkedin: tempSocials.linkedin,
        github: tempSocials.github,
        portfolio: tempSocials.portfolio,
      });

      // Latest profile data fetch pannrom
      await fetchProfile();

      // Commit temporary frontend states
      setSkills([...tempSkills]);
      setSocials({ ...tempSocials });

      // Edit mode close pannrom
      setIsEditing(false);

      alert("Profile Updated Successfully");
    } catch (err) {
      alert(err.response?.data?.detail || "Unable to update profile");
    }
  };

  // Helper functions for Skills local state
 const handleAddSkill = async (e) => {
  e.preventDefault();

  const skillName = skillInput.trim();

  if (!skillName) return;

  try {
    // Save skill to database
    await addStudentSkill({
      skill_name: skillName,
    });

    // Reload profile (including skills)
    await fetchProfile();

    // Clear input
    setSkillInput("");
  } catch (err) {
    alert(err.response?.data?.detail ||err.message|| "Unable to add skill");
  }
};

 const handleRemoveSkill = async (skillToRemove) => {
  try {
    // Delete skill from database
    await deleteStudentSkill(skillToRemove.id);

    // Reload profile (includes updated skills)
    await fetchProfile();
  } catch (err) {
    alert(
      err.response?.data?.detail ||
      "Unable to delete skill"
    );
  }
};
  // Helper function for Resume file change
  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate only PDF allowed
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      alert("Only PDF files are allowed.");
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must not exceed 5 MB.");
      return;
    }

    setIsUploading(true);
    try {
      await uploadResume(file);
      alert("Resume uploaded successfully.");
      await fetchProfile();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveResume = async () => {
    if (!window.confirm("Are you sure you want to delete your resume?")) {
      return;
    }

    setIsUploading(true);
    try {
      await deleteResume();
      alert("Resume deleted successfully.");
      await fetchProfile();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to delete resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Profile Completion Percentage Calculation
  const completionPercentage = (() => {
    let score = 0;
    if (profile?.first_name) score += 15;
    if (profile?.email) score += 15;
    if (formData.phone || profile?.phone) score += 10;
    if (profile?.department) score += 10;
    if (profile?.year) score += 10;
    if (skills.length > 0) score += 15;
    if (resume) score += 15;
    if (socials.linkedin) score += 4;
    if (socials.github) score += 3;
    if (socials.portfolio) score += 3;
    return Math.min(100, score);
  })();

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center text-[var(--text-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Loading Profile...
          </h2>
        </div>
      </div>
    );
  }

  // Error Screen
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center p-4">
        <div className="card p-6 max-w-md w-full text-center shadow-md">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Error Loading Profile</h2>
          <p className="text-[var(--text-secondary)] mb-4">{error}</p>
          <button 
            onClick={fetchProfile} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-body)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full mx-auto">
        
        {/* Page Heading */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">My Profile</h1>
            <p className="text-[var(--text-muted)] mt-1 text-sm">Manage your personal, academic, and professional information</p>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="card overflow-hidden mb-8">
          {/* Banner with gradient */}
          <div className="h-40 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 relative">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]"></div>
          </div>

          <div className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-12 mb-4">
              {/* Avatar overlapping banner */}
              <div className="w-28 h-28 rounded-2xl bg-[var(--bg-surface)] border-4 border-[var(--bg-surface)] shadow-md flex items-center justify-center relative z-10 overflow-hidden">
                <div className="w-full h-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <User className="w-14 h-14" />
                </div>
              </div>

              {/* Student Details */}
              <div className="flex-1 text-center sm:text-left pt-2">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-1 flex items-center justify-center sm:justify-start gap-2">
                  <GraduationCap className="w-4 h-4" />
                  {profile.department} • Year {profile.year}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                {!isEditing ? (
                  <button
                    onClick={() => {
                      setTempSkills([...skills]);
                      setTempSocials({ ...socials });
                      setIsEditing(true);
                    }}
                    className="inline-flex items-center justify-center px-4 py-2 border border-indigo-600 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          first_name: profile.first_name,
                          last_name: profile.last_name,
                          phone: profile.phone,
                          department: profile.department,
                          year: profile.year,
                          linkedin: profile.linkedin || "",
                          github: profile.github || "",
                          portfolio: profile.portfolio || "",
                        });
                        setTempSkills([...skills]);
                        setTempSocials({ ...socials });
                      }}
                      className="inline-flex items-center justify-center px-4 py-2 border border-[var(--border-secondary)] rounded-xl text-sm font-semibold text-[var(--text-secondary)] bg-transparent hover:bg-[var(--bg-hover)] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Columns - Student details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personal Information */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-primary)]">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">
                  Personal Information
                </h3>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* First Name & Last Name */}
                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl text-indigo-600 dark:text-indigo-400 mt-0.5">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">First Name</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.first_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              first_name: e.target.value,
                            })
                          }
                          className="mt-2 border border-[var(--border-secondary)] rounded-xl p-2.5 w-full text-[var(--text-primary)] bg-[var(--bg-surface)] focus:bg-[var(--bg-surface)] focus:border-indigo-500 focus:outline-none transition-colors text-sm"
                        />
                      ) : (
                        <p className="font-semibold text-[var(--text-secondary)] mt-1 text-sm">
                          {profile.first_name}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Last Name</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.last_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              last_name: e.target.value,
                            })
                          }
                          className="mt-2 border border-[var(--border-secondary)] rounded-xl p-2.5 w-full text-[var(--text-primary)] bg-[var(--bg-surface)] focus:bg-[var(--bg-surface)] focus:border-indigo-500 focus:outline-none transition-colors text-sm"
                        />
                      ) : (
                        <p className="font-semibold text-[var(--text-secondary)] mt-1 text-sm">
                          {profile.last_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl text-indigo-600 dark:text-indigo-400 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Email</p>
                    <p className="font-semibold text-[var(--text-secondary)] mt-1 text-sm">
                      {profile.email}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl text-indigo-600 dark:text-indigo-400 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Phone</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value,
                          })
                        }
                        className="mt-2 border border-[var(--border-secondary)] rounded-xl p-2.5 w-full text-[var(--text-primary)] bg-[var(--bg-surface)] focus:bg-[var(--bg-surface)] focus:border-indigo-500 focus:outline-none transition-colors text-sm"
                      />
                    ) : (
                      <p className="font-semibold text-[var(--text-secondary)] mt-1 text-sm">
                        {profile.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-primary)]">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">
                  Academic Information
                </h3>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Department */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl text-indigo-600 dark:text-indigo-400 mt-0.5">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Department</p>
                    <p className="font-semibold text-[var(--text-secondary)] mt-1 text-sm">
                      {profile.department}
                    </p>
                  </div>
                </div>

                {/* Year */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl text-indigo-600 dark:text-indigo-400 mt-0.5">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Year</p>
                    <p className="font-semibold text-[var(--text-secondary)] mt-1 text-sm">
                      {profile.year}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-primary)]">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">
                  Professional Information
                </h3>
              </div>

              <div className="space-y-6">
                
                {/* Resume UI */}
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-secondary)] mb-3">Resume</h4>
                  {isUploading && (
                    <div className="flex items-center justify-center p-6 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-xl mb-3 gap-2">
                      <div className="w-5 h-5 border-2 border-primary-600/30 border-t-primary-600 rounded-full animate-spin"></div>
                      <span className="text-sm text-[var(--text-secondary)]">Processing Resume...</span>
                    </div>
                  )}
                  
                  {!isUploading && resume ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-xl gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-lg">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-xs">{resume.name}</p>
                          <div className="flex flex-col gap-0.5 mt-0.5">
                            <p className="text-xs text-[var(--text-muted)]">Size: {resume.size}</p>
                            {resume.uploadedAt && (
                              <p className="text-xs text-[var(--text-muted)]">
                                Uploaded on: {new Date(resume.uploadedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <a
                          href={resume.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-1"
                        >
                          View
                        </a>
                        <a
                          href={resume.url ? resume.url.replace("/upload/", "/upload/fl_attachment/") : "#"}
                          download={resume.name}
                          className="px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-secondary)] text-[var(--text-secondary)] rounded-lg text-xs font-semibold hover:bg-[var(--bg-hover)] transition-colors shadow-sm flex items-center gap-1"
                        >
                          Download
                        </a>
                        <label className="text-center px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-secondary)] text-[var(--text-secondary)] rounded-lg text-xs font-semibold hover:bg-[var(--bg-hover)] cursor-pointer transition-colors shadow-sm">
                          Replace
                          <input type="file" onChange={handleResumeChange} className="hidden" />
                        </label>
                        <button
                          onClick={handleRemoveResume}
                          className="p-1.5 border border-[var(--border-secondary)] text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shadow-sm"
                          title="Delete Resume"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (!isUploading && (
                    <div className="border-2 border-dashed border-[var(--border-secondary)] hover:border-indigo-400 rounded-xl p-6 text-center transition-colors cursor-pointer relative bg-[var(--bg-elevated)]">
                      <input type="file" onChange={handleResumeChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <Paperclip className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 font-semibold">Upload your Resume</p>
                      <p className="text-xs text-slate-400 mt-1">PDF format (Max 5MB)</p>
                    </div>
                  ))}
                </div>

                {/* Skills Section */}
                <div className="pt-4 border-t border-[var(--border-primary)]">
                  <h4 className="text-sm font-bold text-[var(--text-secondary)] mb-3">Skills</h4>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      {/* Skill Inputs */}
                      <form onSubmit={handleAddSkill} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type a skill (e.g. Docker, Figma)"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          className="flex-1 border border-[var(--border-secondary)] rounded-xl p-2 text-sm text-[var(--text-primary)] focus:border-indigo-500 focus:outline-none bg-[var(--bg-elevated)] focus:bg-[var(--bg-surface)] transition-colors"
                        />
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </form>

                      {/* Editing chips */}
                      <div className="flex flex-wrap gap-2">
                        {tempSkills.map((skill) => (
                          <span
                            key={skill.id}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30"
                          >
                            {skill.skill_name}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-1.5 text-indigo-400 hover:text-indigo-600 focus:outline-none"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Displaying chips */
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:text-indigo-700 dark:hover:text-indigo-400 hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-colors"
                        >
                          {skill.skill_name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Social Links Section */}
                <div className="pt-4 border-t border-[var(--border-primary)]">
                  <h4 className="text-sm font-bold text-[var(--text-secondary)] mb-3">Professional Links</h4>
                  
                  {isEditing ? (
                    <div className="space-y-3">
                      {/* LinkedIn input */}
                      <div className="flex items-center gap-2">
                        <div className="p-2.5 bg-[var(--bg-elevated)] text-[var(--text-muted)] rounded-xl">
                          <Linkedin className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          placeholder="LinkedIn URL"
                          value={tempSocials.linkedin}
                          onChange={(e) =>
                            setTempSocials({ ...tempSocials, linkedin: e.target.value })
                          }
                          className="flex-1 border border-[var(--border-secondary)] rounded-xl p-2 text-sm text-[var(--text-primary)] focus:border-indigo-500 focus:outline-none bg-[var(--bg-elevated)] focus:bg-[var(--bg-surface)] transition-colors"
                        />
                      </div>

                      {/* GitHub input */}
                      <div className="flex items-center gap-2">
                        <div className="p-2.5 bg-[var(--bg-elevated)] text-[var(--text-muted)] rounded-xl">
                          <Github className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          placeholder="GitHub URL"
                          value={tempSocials.github}
                          onChange={(e) =>
                            setTempSocials({ ...tempSocials, github: e.target.value })
                          }
                          className="flex-1 border border-[var(--border-secondary)] rounded-xl p-2 text-sm text-[var(--text-primary)] focus:border-indigo-500 focus:outline-none bg-[var(--bg-elevated)] focus:bg-[var(--bg-surface)] transition-colors"
                        />
                      </div>

                      {/* Portfolio input */}
                      <div className="flex items-center gap-2">
                        <div className="p-2.5 bg-[var(--bg-elevated)] text-[var(--text-muted)] rounded-xl">
                          <Globe className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          placeholder="Portfolio URL"
                          value={tempSocials.portfolio}
                          onChange={(e) =>
                            setTempSocials({ ...tempSocials, portfolio: e.target.value })
                          }
                          className="flex-1 border border-[var(--border-secondary)] rounded-xl p-2 text-sm text-[var(--text-primary)] focus:border-indigo-500 focus:outline-none bg-[var(--bg-elevated)] focus:bg-[var(--bg-surface)] transition-colors"
                        />
                      </div>
                    </div>
                  ) : (
                    /* Displaying social links */
                    <div className="grid gap-3 sm:grid-cols-3">
                      {/* LinkedIn Link */}
                      {socials.linkedin ? (
                        <a
                          href={socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 border border-[var(--border-secondary)] hover:border-indigo-200 dark:hover:border-indigo-900/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 rounded-xl text-[var(--text-secondary)] hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-semibold transition-all group shadow-sm"
                        >
                          <span className="flex items-center gap-2">
                            <Linkedin className="w-4 h-4 text-indigo-500" />
                            LinkedIn
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 p-3 border border-[var(--border-primary)] rounded-xl text-[var(--text-muted)] text-sm">
                          <Linkedin className="w-4 h-4" />
                          LinkedIn Not Linked
                        </div>
                      )}

                      {/* GitHub Link */}
                      {socials.github ? (
                        <a
                          href={socials.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 border border-[var(--border-secondary)] hover:border-indigo-200 dark:hover:border-indigo-900/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 rounded-xl text-[var(--text-secondary)] hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-semibold transition-all group shadow-sm"
                        >
                          <span className="flex items-center gap-2">
                            <Github className="w-4 h-4 text-indigo-500" />
                            GitHub
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 p-3 border border-[var(--border-primary)] rounded-xl text-[var(--text-muted)] text-sm">
                          <Github className="w-4 h-4" />
                          GitHub Not Linked
                        </div>
                      )}

                      {/* Portfolio Link */}
                      {socials.portfolio ? (
                        <a
                          href={socials.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 border border-[var(--border-secondary)] hover:border-indigo-200 dark:hover:border-indigo-900/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 rounded-xl text-[var(--text-secondary)] hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-semibold transition-all group shadow-sm"
                        >
                          <span className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-indigo-500" />
                            Portfolio
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 p-3 border border-[var(--border-primary)] rounded-xl text-[var(--text-muted)] text-sm">
                          <Globe className="w-4 h-4" />
                          Portfolio Not Linked
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            
            {/* Profile Completion Card */}
            <div className="card p-6">
              <h3 className="font-bold text-[var(--text-primary)] text-lg mb-4">
                Profile Completion
              </h3>
              
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-extrabold text-indigo-600">{completionPercentage}%</span>
                <span className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">Completed</span>
              </div>

              {/* Progress bar container */}
              <div className="w-full bg-[var(--bg-elevated)] rounded-full h-2.5 mb-4">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Complete your profile details to increase your visibility to top companies hiring for internships.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
