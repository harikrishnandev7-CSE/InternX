import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

import {
  loginStudent,
  getStudentProfile,
  loginCompany,
  getCompanyProfile,
} from "../../services/authService";

import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      showToast(location.state.message, "success");
      // Clear location state to prevent repeating the toast on page reload
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, showToast, navigate]);

  // Calls the backend login API and stores the JWT token after successful authentication.
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("login started");
    setError("");
    setIsLoading(true);

    try {
      let response;

      if (role === "student") {
        response = await loginStudent({
          email,
          password,
        });
      } else {
        response = await loginCompany({
          email,
          password,
        });
      }

      // Save JWT token
      localStorage.setItem("token", response.data.access_token);
      let profileResponse;

      if (role === "student") {
        profileResponse = await getStudentProfile();
      } else {
        profileResponse = await getCompanyProfile();
      }

      // Store user inside AuthContext
      setUser({ ...profileResponse.data, role: role });

      // Save user role
      localStorage.setItem("role", role);

      // Navigate to dashboard
      if (role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/company/dashboard");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || "Invalid Email or Password");
      } else {
        setError("Server is not responding.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-600 mb-4">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Sign in to your InternX account
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-3 p-1 bg-[var(--bg-elevated)] rounded-lg">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`py-2 text-sm font-medium rounded-md transition-colors ${
                  role === "student"
                    ? "bg-primary-600 text-white"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("company")}
                className={`py-2 text-sm font-medium rounded-md transition-colors ${
                  role === "company"
                    ? "bg-primary-600 text-white"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                Company
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-[var(--text-secondary)]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-error-500 bg-error-50 dark:bg-error-900/20 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              Do not have an account?{" "}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-[var(--text-muted)]">
          <p>Demo Credentials:</p>
          <p>Student: student@demo.com / password123</p>
          <p>Company: company@demo.com / password123</p>
        </div>
      </div>
    </div>
  );
}
