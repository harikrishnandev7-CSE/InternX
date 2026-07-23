import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line
} from "recharts";
import { AlertCircle, TrendingUp, Users, Briefcase, FileText } from "lucide-react";
import { getAdminAnalytics, getAdminStats } from "../../services/adminService";

export function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [analyticsRes, statsRes] = await Promise.all([
        getAdminAnalytics(),
        getAdminStats()
      ]);
      
      setAnalyticsData(analyticsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch analytics data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-error-500 mb-4" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Error Loading Analytics</h3>
        <p className="text-sm text-[var(--text-muted)] mb-6">{error}</p>
        <button onClick={fetchAnalytics} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  // Merge datasets for charts
  const registrationChartData = analyticsData?.student_registrations.map((s, idx) => {
    const c = analyticsData?.company_registrations[idx] || { count: 0 };
    return {
      date: new Date(s.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      Students: s.count,
      Companies: c.count
    };
  }) || [];

  const activityChartData = analyticsData?.internship_postings.map((i, idx) => {
    const a = analyticsData?.applications_submitted[idx] || { count: 0 };
    return {
      date: new Date(i.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      Internships: i.count,
      Applications: a.count
    };
  }) || [];

  const outcomesChartData = analyticsData?.selections_count.map((s, idx) => {
    const r = analyticsData?.rejections_count[idx] || { count: 0 };
    return {
      date: new Date(s.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      Selected: s.count,
      Rejected: r.count
    };
  }) || [];

  return (
    <div className="page-container max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Platform Analytics</h1>
        <p className="text-sm text-[var(--text-muted)]">Inspect student registrations, company growth, postings, and selection ratios</p>
      </div>

      {/* Mini Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">Total Platform Users</span>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mt-0.5">
              {(stats?.total_students || 0) + (stats?.total_companies || 0)}
            </h3>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-lg">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">Postings Activity</span>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mt-0.5">{stats?.total_internships}</h3>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">Success selections ratio</span>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mt-0.5">
              {stats?.total_applications > 0 
                ? `${Math.round((stats?.selected_applications / stats?.total_applications) * 100)}%` 
                : "0%"}
            </h3>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Registrations Growth (Area Chart) */}
        <div className="card p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Registrations Growth</h3>
            <p className="text-[10px] text-[var(--text-muted)]">Cumulative signups over the last 7 days</p>
          </div>
          <div className="h-72 w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={registrationChartData}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompanies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
                <Legend />
                <Area type="monotone" dataKey="Students" stroke="#3b82f6" fillOpacity={1} fill="url(#colorStudents)" strokeWidth={2} />
                <Area type="monotone" dataKey="Companies" stroke="#a855f7" fillOpacity={1} fill="url(#colorCompanies)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Internship Postings vs Applications (Bar Chart) */}
        <div className="card p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Activity Trends</h3>
            <p className="text-[10px] text-[var(--text-muted)]">Comparing published internships against application submissions</p>
          </div>
          <div className="h-72 w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
                <Legend />
                <Bar dataKey="Internships" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Applications" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Selection Ratio Analysis (Line Chart) */}
        <div className="card p-6 lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Application Outcome Trends</h3>
            <p className="text-[10px] text-[var(--text-muted)]">Selections and rejections ratio charts</p>
          </div>
          <div className="h-72 w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={outcomesChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
                <Legend />
                <Line type="monotone" dataKey="Selected" stroke="#10b981" strokeWidth={2} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Rejected" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
