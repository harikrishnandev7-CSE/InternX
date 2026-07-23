import { useState, useEffect } from "react";
import {
  Search,
  User,
  Trash2,
  ExternalLink,
  Mail,
  Phone,
  Bookmark,
  Briefcase,
  X,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { getAdminStudents, deleteStudent, deleteAdminStudentResume } from "../../services/adminService";

const formatBytes = (bytes, decimals = 1) => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};


export function ManageStudentsPage() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Selected Student Modal State
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Deleting State
  const [deletingId, setDeletingId] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAdminStudents(search, page, limit);
      setStudents(response.data.items);
      setTotal(response.data.total);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on new search
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete student "${name}"? This will delete all their skills and applications.`)) {
      return;
    }
    
    try {
      setDeletingId(id);
      await deleteStudent(id);
      alert("Student deleted successfully.");
      // Refresh list
      if (students.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchStudents();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete student. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const openProfileModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const closeProfileModal = () => {
    setSelectedStudent(null);
    setShowModal(false);
  };

  const handleDeleteResume = async (studentId, name) => {
    if (!window.confirm(`Are you sure you want to delete the resume for student "${name}"?`)) {
      return;
    }
    try {
      await deleteAdminStudentResume(studentId);
      alert("Resume deleted successfully.");
      
      // Update local modal view state so it reflects the deleted resume
      setSelectedStudent(prev => {
        if (prev && prev.id === studentId) {
          return {
            ...prev,
            resume_url: null,
            resume_filename: null,
            resume_file_size: null,
            resume_uploaded_at: null
          };
        }
        return prev;
      });
      
      // Refresh backend list
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to delete student resume. Please try again.");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="page-container max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Manage Students</h1>
          <p className="text-sm text-[var(--text-muted)]">View, search, inspect profiles, and delete student accounts</p>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="card p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search students by name, email, department..."
            className="input-field pl-10 py-2.5"
          />
        </div>
      </div>

      {/* Main Table Card */}
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
        ) : students.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-sm text-[var(--text-muted)]">No students found matching your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
                  <th className="p-4">Student ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Year</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-primary)]">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-[var(--bg-hover)]/30 transition-colors">
                    <td className="p-4 text-[var(--text-secondary)] font-medium">#{student.id}</td>
                    <td className="p-4 font-semibold text-[var(--text-primary)]">{student.first_name} {student.last_name}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{student.email}</td>
                    <td className="p-4">
                      <span className="bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 px-2 py-0.5 rounded font-medium">
                        {student.department}
                      </span>
                    </td>
                    <td className="p-4 text-[var(--text-secondary)]">Year {student.year}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openProfileModal(student)}
                          className="btn-outline py-1 px-2.5 text-[10px] hover:bg-primary-50 hover:text-primary-600"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => handleDelete(student.id, `${student.first_name} ${student.last_name}`)}
                          disabled={deletingId === student.id}
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
            <span className="font-semibold text-[var(--text-primary)]">{total}</span> students
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
      {showModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-primary)] rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-thin shadow-xl animate-scale-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-[var(--border-primary)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-bold text-lg">
                  {selectedStudent.first_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">{selectedStudent.first_name} {selectedStudent.last_name}</h3>
                  <p className="text-[10px] text-[var(--text-muted)]">Student ID: #{selectedStudent.id}</p>
                </div>
              </div>
              <button onClick={closeProfileModal} className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
                <X className="w-4.5 h-4.5 text-[var(--text-muted)]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Profile Details Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Contact Info</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <Mail className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>{selectedStudent.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <Phone className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>{selectedStudent.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Academics</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <Bookmark className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>Dept: {selectedStudent.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <Bookmark className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>Academic Year: {selectedStudent.year}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Links Grid */}
              <div className="border-t border-[var(--border-primary)] pt-4 space-y-3">
                <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Professional Profiles</h4>
                <div className="flex flex-wrap gap-3 text-xs">
                  {selectedStudent.linkedin ? (
                    <a
                      href={selectedStudent.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline py-1 px-3 flex items-center gap-1.5 hover:text-blue-500 hover:border-blue-500"
                    >
                      LinkedIn
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-[var(--text-muted)] italic">No LinkedIn profile provided</span>
                  )}

                  {selectedStudent.github ? (
                    <a
                      href={selectedStudent.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline py-1 px-3 flex items-center gap-1.5 hover:text-purple-500 hover:border-purple-500"
                    >
                      GitHub
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-[var(--text-muted)] italic">No GitHub profile provided</span>
                  )}

                  {selectedStudent.portfolio ? (
                    <a
                      href={selectedStudent.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline py-1 px-3 flex items-center gap-1.5 hover:text-emerald-500 hover:border-emerald-500"
                    >
                      Portfolio
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : null}
                </div>
              </div>

              {/* Resume section */}
              <div className="border-t border-[var(--border-primary)] pt-4 space-y-3">
                <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Resume</h4>
                {selectedStudent.resume_url ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-xl gap-4">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-xs" title={selectedStudent.resume_filename}>
                          {selectedStudent.resume_filename}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-[var(--text-muted)] mt-0.5">
                          <span>Size: {formatBytes(selectedStudent.resume_file_size)}</span>
                          {selectedStudent.resume_uploaded_at && (
                            <>
                              <span>•</span>
                              <span>Uploaded: {new Date(selectedStudent.resume_uploaded_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <a
                        href={selectedStudent.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-semibold hover:bg-indigo-700 transition-colors shadow-sm text-center flex-1 sm:flex-initial"
                      >
                        View Resume
                      </a>
                      <a
                        href={selectedStudent.resume_url.replace("/upload/", "/upload/fl_attachment/")}
                        download={selectedStudent.resume_filename}
                        className="px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-secondary)] text-[var(--text-secondary)] rounded-lg text-[10px] font-semibold hover:bg-[var(--bg-hover)] transition-colors shadow-sm text-center flex-1 sm:flex-initial"
                      >
                        Download Resume
                      </a>
                      <button
                        onClick={() => handleDeleteResume(selectedStudent.id, `${selectedStudent.first_name} ${selectedStudent.last_name}`)}
                        className="p-1.5 border border-[var(--border-secondary)] text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shadow-sm"
                        title="Delete Resume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-[var(--text-muted)] italic bg-[var(--bg-elevated)] px-3 py-2 border border-[var(--border-primary)] rounded-xl block">
                    No resume uploaded
                  </span>
                )}
              </div>

              {/* Skills section */}
              <div className="border-t border-[var(--border-primary)] pt-4 space-y-3">
                <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.skills && selectedStudent.skills.length > 0 ? (
                    selectedStudent.skills.map((skill) => (
                      <span key={skill.id} className="badge bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-secondary)]">
                        {skill.skill_name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[var(--text-muted)] italic">No skills listed yet</span>
                  )}
                </div>
              </div>

              {/* Applications section */}
              <div className="border-t border-[var(--border-primary)] pt-4 space-y-3">
                <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[var(--text-muted)]" />
                  Applications History ({selectedStudent.applications?.length || 0})
                </h4>
                <div className="divide-y divide-[var(--border-primary)] border border-[var(--border-primary)] rounded-lg overflow-hidden bg-[var(--bg-surface)] max-h-48 overflow-y-auto scrollbar-thin">
                  {!selectedStudent.applications || selectedStudent.applications.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)] p-4 text-center italic">This student has not applied to any internships yet.</p>
                  ) : (
                    selectedStudent.applications.map((app) => (
                      <div key={app.id} className="p-3 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-semibold text-[var(--text-primary)]">
                            {app.internship_title || `Internship ID: #${app.internship_id}`}
                          </p>
                          <p className="text-[var(--text-muted)] text-[10px] mt-0.5">
                            Applied: {new Date(app.applied_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className={`badge ${
                            app.status === "Selected"
                              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : app.status === "Rejected"
                                ? "bg-red-50 text-red-750 dark:bg-red-900/20 dark:text-red-400"
                                : app.status === "Shortlisted"
                                  ? "bg-blue-50 text-blue-750 dark:bg-blue-900/20 dark:text-blue-400"
                                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
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
