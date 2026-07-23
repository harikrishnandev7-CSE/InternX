import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowRight, Building2, XCircle } from 'lucide-react';
import { getAllInternships } from '../../services/internshipService';
import { useAuth } from '../../hooks/useAuth';

export function SavedInternships() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(() => {
    try {
      const local = localStorage.getItem(`saved_internships_${user?.id}`);
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });
  
  const [internshipsList, setInternshipsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAllInternships();
        setInternshipsList(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load internships. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  const savedList = useMemo(() => {
    return saved
      .map((id) => internshipsList.find((i) => i.id === id))
      .filter(Boolean);
  }, [saved, internshipsList]);

  const removeSaved = (id) => {
    const updated = saved.filter((sid) => sid !== id);
    setSaved(updated);
    localStorage.setItem(`saved_internships_${user?.id}`, JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-error-50 dark:bg-error-900/20 flex items-center justify-center mb-4">
          <XCircle className="w-8 h-8 text-error-600" />
        </div>
        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">{error}</h3>
        <button onClick={() => window.location.reload()} className="btn-primary mt-4">Retry</button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="section-title">Saved Internships</h1>
          <p className="section-subtitle">Internships you have bookmarked for later</p>
        </div>

        <div className="space-y-3">
          {savedList.map((internship) => (
            <div key={internship.id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <img
                src={internship.companyLogo}
                alt={internship.companyName}
                className="w-12 h-12 rounded-lg object-cover bg-[var(--bg-elevated)] flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">{internship.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {internship.companyName}
                  </span>
                  <span>{internship.location}</span>
                  <span>{internship.duration}</span>
                  <span>{internship.stipend}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => removeSaved(internship.id)}
                  className="p-2 rounded-lg hover:bg-error-50 dark:hover:bg-error-900/20 text-[var(--text-muted)] hover:text-error-500 transition-colors"
                >
                  <Bookmark className="w-5 h-5 text-primary-600" />
                </button>
                <Link to={`/internship/${internship.id}`} className="btn-primary text-sm py-2">
                  <ArrowRight className="w-4 h-4" />
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>

        {savedList.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No saved internships</h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">Save internships to review them later.</p>
            <Link to="/internships" className="btn-primary">
              Browse Internships
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

