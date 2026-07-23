import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Mail, Lock, Eye, EyeOff, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function RegisterPage() {
  const navigate = useNavigate();
  return (
  <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
    <div className="w-full max-w-md">

      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-600 mb-4">
          <Briefcase className="w-6 h-6 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Create Account
        </h1>

        <p className="text-sm text-[var(--text-muted)]">
          Choose your account type
        </p>
      </div>

      {/* Selection Card */}
      <div className="card p-8 space-y-5">

        <button
          onClick={() => navigate("/register/student")}
          className="btn-primary w-full"
        >
          Student Registration
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigate("/register/company")}
          className="btn-outline w-full"
        >
          Company Registration
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
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