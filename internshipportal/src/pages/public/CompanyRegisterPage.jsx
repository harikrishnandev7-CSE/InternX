import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Mail,
  Phone,
  Lock,
  Globe,
  MapPin,
  FileText,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export function CompanyRegisterPage() {
  const navigate = useNavigate();

  // State management for form inputs
  const [company_name, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  // Visibility toggles for passwords
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status and error states
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validate form fields on the frontend
  const validateForm = () => {
    const tempErrors = {};

    // Company Name Validation
    if (!company_name.trim()) {
      tempErrors.company_name = "Company name is required.";
    }

    // Email Validation
    if (!email.trim()) {
      tempErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = "Please enter a valid email address.";
    }

    // Phone Validation
    if (!phone.trim()) {
      tempErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(phone)) {
      tempErrors.phone = "Phone number must be exactly 10 digits.";
    }

    // Location Validation
    if (!location.trim()) {
      tempErrors.location = "Location is required.";
    }

    // Password Validation
    if (!password) {
      tempErrors.password = "Password is required.";
    } else if (password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters.";
    }

    // Confirm Password Validation
    if (!confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match.";
    }

    // Website Validation (Optional but must be valid URL format if provided)
    if (website.trim()) {
      const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
      if (!urlPattern.test(website)) {
        tempErrors.website = "Please enter a valid website URL.";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Input change helper to clear field-specific errors dynamically
  const handleInputChange = (field, value, setter) => {
    setter(value);
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepared payload for future FastAPI backend integration
      const companyPayload = {
        company_name: company_name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        website: website.trim(),
        location: location.trim(),
        description: description.trim(),
        password: password,
      };

      // Logs payload internally to verify correct structure/preparation
      console.log("Prepared Company Registration Payload:", companyPayload);

      // Simulating API response delay for clean UX and loading spinner
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess("Company account registered successfully.");

      // Resetting form states
      setCompanyName("");
      setEmail("");
      setPhone("");
      setWebsite("");
      setLocation("");
      setDescription("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});

      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-600 mb-4 shadow-md">
            <Building2 className="w-6 h-6 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Create Company Account
          </h1>

          <p className="text-sm text-[var(--text-muted)]">
            Register your company on InternX and start posting internships.
          </p>
        </div>

        {/* Registration Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Company Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={company_name}
                  onChange={(e) =>
                    handleInputChange("company_name", e.target.value, setCompanyName)
                  }
                  placeholder="Enter your company name"
                  className={`input-field pl-10 transition-colors ${errors.company_name
                      ? "border-error-500 focus:ring-error-500/50 focus:border-error-500"
                      : "hover:border-[var(--text-muted)]"
                    }`}
                />
              </div>
              {errors.company_name && (
                <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1 animate-scale-in">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.company_name}</span>
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    handleInputChange("email", e.target.value, setEmail)
                  }
                  placeholder="Enter your email address"
                  className={`input-field pl-10 transition-colors ${errors.email
                      ? "border-error-500 focus:ring-error-500/50 focus:border-error-500"
                      : "hover:border-[var(--text-muted)]"
                    }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1 animate-scale-in">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    handleInputChange("phone", e.target.value, setPhone)
                  }
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                  className={`input-field pl-10 transition-colors ${errors.phone
                      ? "border-error-500 focus:ring-error-500/50 focus:border-error-500"
                      : "hover:border-[var(--text-muted)]"
                    }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1 animate-scale-in">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            {/* Website (Optional) */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Website (Optional)
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={website}
                  onChange={(e) =>
                    handleInputChange("website", e.target.value, setWebsite)
                  }
                  placeholder="Enter website (e.g., https://company.com)"
                  className={`input-field pl-10 transition-colors ${errors.website
                      ? "border-error-500 focus:ring-error-500/50 focus:border-error-500"
                      : "hover:border-[var(--text-muted)]"
                    }`}
                />
              </div>
              {errors.website && (
                <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1 animate-scale-in">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.website}</span>
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value, setLocation)
                  }
                  placeholder="Enter city, country"
                  className={`input-field pl-10 transition-colors ${errors.location
                      ? "border-error-500 focus:ring-error-500/50 focus:border-error-500"
                      : "hover:border-[var(--text-muted)]"
                    }`}
                />
              </div>
              {errors.location && (
                <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1 animate-scale-in">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.location}</span>
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value, setPassword)
                  }
                  placeholder="Create your password"
                  className={`input-field pl-10 pr-10 transition-colors ${errors.password
                      ? "border-error-500 focus:ring-error-500/50 focus:border-error-500"
                      : "hover:border-[var(--text-muted)]"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1 animate-scale-in">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) =>
                    handleInputChange(
                      "confirmPassword",
                      e.target.value,
                      setConfirmPassword
                    )
                  }
                  placeholder="Confirm your password"
                  className={`input-field pl-10 pr-10 transition-colors ${errors.confirmPassword
                      ? "border-error-500 focus:ring-error-500/50 focus:border-error-500"
                      : "hover:border-[var(--text-muted)]"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1 animate-scale-in">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>

            {/* Description (Textarea) */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Description (Optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-[var(--text-muted)]" />
                <textarea
                  value={description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value, setDescription)
                  }
                  placeholder="Tell us about your company..."
                  rows={4}
                  className={`input-field pl-10 pt-2.5 resize-none transition-colors ${errors.description
                      ? "border-error-500 focus:ring-error-500/50 focus:border-error-500"
                      : "hover:border-[var(--text-muted)]"
                    }`}
                />
              </div>
              {errors.description && (
                <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1 animate-scale-in">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.description}</span>
                </p>
              )}
            </div>

            {/* Form-level Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-error-500 bg-error-50 dark:bg-error-900/20 p-3 rounded-lg animate-scale-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="text-sm text-green-600 bg-green-100 dark:bg-green-900/20 p-3 rounded-lg animate-scale-in">
                {success}
              </div>
            )}

            {/* Primary Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Company Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Navigation */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
