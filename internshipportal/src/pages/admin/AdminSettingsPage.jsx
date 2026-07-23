import { useState, useEffect } from "react";
import {
  User,
  Lock,
  History,
  Mail,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle,
  Clock
} from "lucide-react";
import { 
  getAdminProfile, 
  updateAdminProfile, 
  changeAdminPassword, 
  getAdminLogs 
} from "../../services/adminService";
import { useAuth } from "../../hooks/useAuth";

export function AdminSettingsPage() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile"); // profile or logs

  // Profile Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password Form State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPwd, setShowPwd] = useState({ old: false, new: false, conf: false });

  // Logs state
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const loadLogs = async () => {
    try {
      setLogsLoading(true);
      setLogsError("");
      const response = await getAdminLogs();
      setLogs(response.data);
    } catch (err) {
      console.error(err);
      setLogsError("Failed to fetch system activity logs.");
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "logs") {
      loadLogs();
    }
  }, [activeTab]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");
    setProfileLoading(true);

    try {
      const response = await updateAdminProfile({ full_name: fullName, email });
      setUser({ ...user, ...response.data });
      setProfileSuccess("Profile updated successfully.");
    } catch (err) {
      if (err.response) {
        setProfileError(err.response.data.detail || "Failed to update profile.");
      } else {
        setProfileError("Server connection lost.");
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordLoading(true);

    try {
      await changeAdminPassword({ old_password: oldPassword, new_password: newPassword });
      setPasswordSuccess("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err.response) {
        setPasswordError(err.response.data.detail || "Failed to change password.");
      } else {
        setPasswordError("Server connection error.");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="page-container max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Settings</h1>
        <p className="text-sm text-[var(--text-muted)]">Configure admin profiles, modify password keys, and browse system audit logs</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border-primary)] gap-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === "profile"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          <User className="w-4 h-4" />
          Profile & Security
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`pb-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === "logs"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          <History className="w-4 h-4" />
          System Activity Logs
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "profile" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Profile Form */}
          <div className="card p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <User className="w-4.5 h-4.5 text-primary-500" />
                Profile Information
              </h3>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Edit credentials and settings</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input-field pl-10 py-2.5 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10 py-2.5 text-xs"
                    required
                  />
                </div>
              </div>

              {profileSuccess && (
                <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="flex items-center gap-2 text-xs text-error-500 bg-error-50 dark:bg-error-900/20 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={profileLoading}
                className="btn-primary w-full py-2.5 text-xs"
              >
                {profileLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="card p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Lock className="w-4.5 h-4.5 text-primary-500" />
                Security Keys
              </h3>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Update access passwords</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">Old Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type={showPwd.old ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10 py-2.5 text-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd({ ...showPwd, old: !showPwd.old })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {showPwd.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type={showPwd.new ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10 py-2.5 text-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd({ ...showPwd, new: !showPwd.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {showPwd.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type={showPwd.conf ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10 py-2.5 text-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd({ ...showPwd, conf: !showPwd.conf })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {showPwd.conf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {passwordSuccess && (
                <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="flex items-center gap-2 text-xs text-error-500 bg-error-50 dark:bg-error-900/20 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={passwordLoading}
                className="btn-primary w-full py-2.5 text-xs"
              >
                {passwordLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Change Password"
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Logs Panel */
        <div className="card p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <History className="w-4.5 h-4.5 text-primary-500" />
              Platform Activity Logs
            </h3>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Audit log tracks company approvals, toggles, deletions, and administrative overrides</p>
          </div>

          <div className="border border-[var(--border-primary)] rounded-lg overflow-hidden">
            {logsLoading ? (
              <div className="py-20 flex justify-center">
                <div className="w-8 h-8 border-4 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
              </div>
            ) : logsError ? (
              <div className="p-8 text-center text-xs text-error-500 flex items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{logsError}</span>
              </div>
            ) : logs.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] p-12 text-center italic">No system logs recorded yet.</p>
            ) : (
              <div className="divide-y divide-[var(--border-primary)] max-h-[60vh] overflow-y-auto scrollbar-thin">
                {logs.map((log) => (
                  <div key={log.id} className="p-4 flex items-start justify-between text-xs hover:bg-[var(--bg-hover)]/20 transition-colors">
                    <div className="space-y-1 pr-4">
                      <span className="badge bg-primary-50 text-primary-750 border border-primary-200/20 font-bold">
                        {log.action}
                      </span>
                      <p className="text-[var(--text-secondary)] font-medium">{log.details}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[var(--text-muted)] whitespace-nowrap text-[10px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
