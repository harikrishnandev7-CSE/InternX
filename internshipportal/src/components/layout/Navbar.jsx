import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Briefcase, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from '../common/ThemeToggle';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    return user.role === 'student' ? '/student/dashboard' : '/company/dashboard';
  };

  const getDashboardLabel = () => {
    if (!user) return '';
    if (user.role === 'admin') return 'Admin Dashboard';
    return user.role === 'student' ? 'Student Dashboard' : 'Company Dashboard';
  };

  return (
    <nav className="sticky top-0 z-40 bg-[var(--bg-surface)]/80 backdrop-blur-md border-b border-[var(--border-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[var(--text-primary)]">InternX</span>
          </Link>
 
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
              Home
            </Link>
            <Link to="/internships" className="px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
              Internships
            </Link>
            {user && (
              <Link to={getDashboardPath()} className="px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors flex items-center gap-1.5">
                <LayoutDashboard className="w-4 h-4" />
                {getDashboardLabel()}
              </Link>
            )}
          </div>
 
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--text-secondary)]">
                  {user.full_name || (user.first_name ? `${user.first_name} ${user.last_name}` : "") || user.company_name}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-[var(--text-muted)] hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-outline text-sm py-2">
                  <User className="w-4 h-4" />
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-[var(--border-primary)] bg-[var(--bg-surface)]">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/internships" className="block px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]" onClick={() => setIsMenuOpen(false)}>
              Internships
            </Link>
            {user && (
              <Link to={getDashboardPath()} className="block px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]" onClick={() => setIsMenuOpen(false)}>
                {getDashboardLabel()}
              </Link>
            )}
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20"
              >
                Logout
              </button>
            ) : (
              <div className="space-y-2 pt-2">
                <Link to="/login" className="block btn-outline text-sm py-2 text-center" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="block btn-primary text-sm py-2 text-center" onClick={() => setIsMenuOpen(false)}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
