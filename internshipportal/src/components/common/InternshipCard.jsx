import { MapPin, Clock, DollarSign, Building2, Bookmark, BookmarkCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function InternshipCard({ internship, isSaved, onToggleSave, showActions = true }) {
  const navigate = useNavigate();

  return (
    <div className="card card-hover p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <img
          src={internship.companyLogo}
          alt={internship.companyName}
          className="w-12 h-12 rounded-lg object-cover bg-[var(--bg-elevated)]"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--text-primary)] text-base leading-snug truncate">
            {internship.title}
          </h3>
          <p className="text-sm text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
            <Building2 className="w-3.5 h-3.5" />
            {internship.companyName}
          </p>
        </div>
        {showActions && onToggleSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
            className="p-1.5 rounded-md transition-colors hover:bg-[var(--bg-hover)]"
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-primary-500" />
            ) : (
              <Bookmark className="w-5 h-5 text-[var(--text-muted)]" />
            )}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 text-sm text-[var(--text-muted)]">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {internship.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {internship.duration}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5" />
          {internship.stipend}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {internship.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="px-2 py-0.5 text-xs rounded-md bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
          >
            {skill}
          </span>
        ))}
        {internship.skills.length > 4 && (
          <span className="px-2 py-0.5 text-xs rounded-md bg-[var(--bg-elevated)] text-[var(--text-muted)]">
            +{internship.skills.length - 4}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-xs text-[var(--text-muted)]">
          {internship.applications} applications
        </span>
        <button
          onClick={() => navigate(`/internship/${internship.id}`)}
          className="btn-primary text-sm px-4 py-2"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
