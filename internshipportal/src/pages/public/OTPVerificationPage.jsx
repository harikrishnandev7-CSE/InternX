import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Briefcase, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { verifyOtp, resendOtp } from "../../services/emailOtpService";

export function OTPVerificationPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  const email = sessionStorage.getItem("reset_email") || "";

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsLoading(true);

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError("Please enter a valid 6-digit numeric code.");
      setIsLoading(false);
      return;
    }

    try {
      await verifyOtp(email, otp);
      sessionStorage.setItem("reset_otp", otp);
      navigate("/reset-password");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || "Verification failed. Please check the code.");
      } else {
        setError("Server is not responding.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError("");
    setSuccessMsg("");
    setIsResending(true);

    try {
      await resendOtp(email);
      setSuccessMsg("Verification code has been resent to your email.");
      setCooldown(60);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || "Failed to resend verification code.");
      } else {
        setError("Server is not responding.");
      }
    } finally {
      setIsResending(false);
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
            Verify OTP
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            We have sent a verification code to <span className="font-semibold text-[var(--text-primary)]">{email}</span>
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Verification Code
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit OTP"
                  className="input-field pl-10 text-center tracking-[0.2em] font-semibold text-lg"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-error-500 bg-error-50 dark:bg-error-900/20 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-center gap-2 text-sm text-success-600 bg-success-50 dark:bg-success-900/20 p-3 rounded-lg">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
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
                  Verify Code
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center flex flex-col gap-3">
            <button
              onClick={handleResend}
              disabled={cooldown > 0 || isResending}
              className={`text-sm font-medium transition-colors ${
                cooldown > 0
                  ? "text-[var(--text-muted)] cursor-not-allowed"
                  : "text-primary-600 hover:text-primary-700"
              }`}
            >
              {isResending ? (
                <div className="w-4 h-4 border-2 border-primary-600/30 border-t-primary-600 rounded-full animate-spin inline-block mr-2" />
              ) : null}
              {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
            </button>

            <p className="text-sm text-[var(--text-muted)]">
              Entered wrong email?{" "}
              <Link
                to="/forgot-password"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Change Email
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
