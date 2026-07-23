import { useState, useEffect, useMemo } from 'react';
import { SlidersHorizontal, X, MapPin, Clock, Building2, AlertCircle } from 'lucide-react';
import { InternshipCard } from '../../components/common/InternshipCard';
import { SearchBar } from '../../components/common/SearchBar';
import { useAuth } from '../../hooks/useAuth';
import { getAllInternships } from '../../services/internshipService';
import { useToast } from '../../hooks/useToast';

export function InternshipListPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [internshipsList, setInternshipsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    duration: '',
  });

  // Local saved bookmarks
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllInternships();
      // Students should only see active postings
      const activeListings = data.filter(item => item.is_active === true);
      setInternshipsList(activeListings);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch internships. Please check your internet connection.');
      showToast('Error loading internships', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredInternships = useMemo(() => {
    return internshipsList.filter((internship) => {
      const matchesSearch =
        search === '' ||
        internship.title.toLowerCase().includes(search.toLowerCase()) ||
        internship.companyName.toLowerCase().includes(search.toLowerCase()) ||
        internship.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

      const matchesType = !filters.type || internship.type === filters.type;
      const matchesLocation = !filters.location || internship.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesDuration = !filters.duration || internship.duration.toLowerCase().includes(filters.duration.toLowerCase());

      return matchesSearch && matchesType && matchesLocation && matchesDuration;
    });
  }, [search, filters, internshipsList]);
  const toggleSave = (id) => {
    const isAlreadySaved = saved.includes(id);
    if (isAlreadySaved) {
      setSaved(prev => prev.filter(s => s !== id));
      showToast("Removed from saved list", "info");
    } else {
      setSaved(prev => [...prev, id]);
      showToast("Saved successfully!", "success");
    }
  };

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="section-title">Browse Internships</h1>
          <p className="section-subtitle">Find the perfect internship opportunity for your career</p>
        </div>

        <div className="flex gap-3 mb-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by title, company, or skills..."
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-outline px-4 py-3 ${showFilters ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/20 dark:border-primary-700' : ''}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="card p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-[var(--text-primary)]">Filters</h3>
              <button
                onClick={() => setFilters({ type: '', location: '', duration: '' })}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="input-field"
                >
                  <option value="">All Types</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    placeholder="City or state"
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Duration</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={filters.duration}
                    onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                    placeholder="e.g., 3 months"
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="card p-5 animate-pulse flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[var(--bg-elevated)]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[var(--bg-elevated)] rounded w-3/4" />
                    <div className="h-3 bg-[var(--bg-elevated)] rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-[var(--bg-elevated)] rounded w-5/6" />
                  <div className="h-3 bg-[var(--bg-elevated)] rounded w-2/3" />
                </div>
                <div className="flex gap-2">
                  <div className="h-5 bg-[var(--bg-elevated)] rounded w-16" />
                  <div className="h-5 bg-[var(--bg-elevated)] rounded w-16" />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="h-3 bg-[var(--bg-elevated)] rounded w-1/4" />
                  <div className="h-8 bg-[var(--bg-elevated)] rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error Handling */}
        {!loading && error && (
          <div className="text-center py-16 card max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-error-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">Failed to load internships</h3>
            <p className="text-sm text-[var(--text-muted)] mb-6">{error}</p>
            <button onClick={fetchListings} className="btn-primary mx-auto">
              Retry
            </button>
          </div>
        )}

        {/* Data Cards */}
        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredInternships.map((internship) => (
              <InternshipCard
                key={internship.id}
                internship={internship}
                isSaved={saved.includes(internship.id)}
                onToggleSave={user?.role === 'student' ? () => toggleSave(internship.id) : undefined}
                showActions={user?.role === 'student'}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredInternships.length === 0 && (
          <div className="text-center py-16 card">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No internships found</h3>
            <p className="text-sm text-[var(--text-muted)]">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
