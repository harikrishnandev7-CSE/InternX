import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Bookmark,
  Building2,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  List,
  BarChart3,
  Settings,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const studentNavItems = [
  { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/student/profile', label: 'My Profile', icon: User },
  { path: '/internships', label: 'Browse Internships', icon: Briefcase },
  { path: '/student/applications', label: 'My Applications', icon: FileText },
  { path: '/student/saved', label: 'Saved Internships', icon: Bookmark },
];

const companyNavItems = [
  { path: '/company/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/company/profile', label: 'Company Profile', icon: Building2 },
  { path: '/company/internships/create', label: 'Post Internship', icon: Plus },
  { path: '/company/internships', label: 'Manage Internships', icon: List },
  { path: '/company/applicants', label: 'Applicants', icon: Users },
];

const adminNavItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/approvals', label: 'Company Approvals', icon: UserCheck },
  { path: '/admin/students', label: 'Manage Students', icon: Users },
  { path: '/admin/companies', label: 'Manage Companies', icon: Building2 },
  { path: '/admin/internships', label: 'Manage Internships', icon: Briefcase },
  { path: '/admin/applications', label: 'Applications', icon: FileText },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) return null;

  const navItems = user.role === 'student' 
    ? studentNavItems 
    : user.role === 'company' 
      ? companyNavItems 
      : adminNavItems;

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-[var(--border-primary)] bg-[var(--bg-surface)] transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-[var(--border-primary)]">
        {!isCollapsed && (
          <span className="font-semibold text-[var(--text-primary)] text-sm">
            {user.role === 'student' 
              ? 'Student Portal' 
              : user.role === 'company' 
                ? 'Company Portal' 
                : 'Admin Portal'}
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-[var(--text-muted)]" />
          )}
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-500' : ''}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
