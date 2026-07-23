import { useState } from 'react';
import { Building2, Globe, MapPin, Users, Calendar, Edit2, Check, X } from 'lucide-react';
import { companyProfiles } from '../../data/dummyData';
import { useAuth } from '../../hooks/useAuth';

export function CompanyProfile() {
  const { user } = useAuth();
  const profile = companyProfiles.find((p) => p.userId === user?.id);
  const [isEditing, setIsEditing] = useState(false);

  if (!profile || !user) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Profile not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="section-title">Company Profile</h1>
          <p className="section-subtitle">Manage your company information and public profile</p>
        </div>

        <div className="card overflow-hidden mb-6">
          <div className="h-32 bg-primary-600" />
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 mb-4">
              <img
                src={profile.logo}
                alt={profile.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-[var(--bg-surface)] bg-[var(--bg-surface)]"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{profile.name}</h2>
                <p className="text-sm text-[var(--text-muted)]">{profile.industry} - {profile.size} employees</p>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button onClick={() => setIsEditing(false)} className="btn-primary text-sm">
                      <Check className="w-4 h-4" />Save
                    </button>
                    <button onClick={() => setIsEditing(false)} className="btn-outline text-sm">
                      <X className="w-4 h-4" />Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="btn-outline text-sm">
                    <Edit2 className="w-4 h-4" />Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4">Company Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[var(--text-muted)]" />
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Website</p>
                    <p className="text-sm text-[var(--text-primary)]">{profile.website}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Location</p>
                    <p className="text-sm text-[var(--text-primary)]">{profile.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-[var(--text-muted)]" />
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Size</p>
                    <p className="text-sm text-[var(--text-primary)]">{profile.size} employees</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Founded</p>
                    <p className="text-sm text-[var(--text-primary)]">{profile.founded}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4">About</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{profile.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4">Company Logo</h3>
              <div className="flex items-center gap-3 p-3 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-elevated)]">
                <img src={profile.logo} alt={profile.name} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{profile.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">Logo</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">Active Internships</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">Total Applications</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">Selected Candidates</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
