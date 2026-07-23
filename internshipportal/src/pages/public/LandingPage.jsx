import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, Users, Zap, Send, Building2, FileText, MessageSquare, TrendingUp, Star } from 'lucide-react';
import { features, statistics, testimonials } from '../../data/dummyData';
import { useAuth } from '../../hooks/useAuth';

const iconMap = {
  Zap: <Zap className="w-6 h-6" />,
  Send: <Send className="w-6 h-6" />,
  Building2: <Building2 className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
  MessageSquare: <MessageSquare className="w-6 h-6" />,
  TrendingUp: <TrendingUp className="w-6 h-6" />,
};

const statIconMap = {
  Briefcase: <Briefcase className="w-6 h-6" />,
  Building2: <Building2 className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  TrendingUp: <TrendingUp className="w-6 h-6" />,
};

export function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="bg-[var(--bg-body)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-primary-600/5 dark:bg-primary-900/10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-sm font-medium mb-8">
              <Star className="w-4 h-4" />
              Trusted by 10,000+ students and 500+ companies
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-tight mb-6">
              Find Your Dream{' '}
              <span className="text-primary-600">Internship</span>
              <br />
              With InternX
            </h1>
            <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
              Connect with top companies, discover exciting opportunities, and launch your career with the most trusted internship management platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  to={user.role === 'student' ? '/student/dashboard' : '/company/dashboard'}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary text-lg px-8 py-4">
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/internships" className="btn-outline text-lg px-8 py-4">
                    Browse Internships
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 border-y border-[var(--border-primary)] bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 mb-4">
                  {statIconMap[stat.icon]}
                </div>
                <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">{stat.value}</div>
                <div className="text-sm text-[var(--text-muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Powerful features designed to help students and companies find the perfect match.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.id} className="card card-hover p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 mb-4">
                  {iconMap[feature.icon]}
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-28 bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">How It Works</h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Get started in minutes and find your perfect match.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Sign up and build your profile with your skills, experience, and preferences.',
              },
              {
                step: '02',
                title: 'Discover Opportunities',
                description: 'Browse through curated internships and filter based on your interests.',
              },
              {
                step: '03',
                title: 'Apply & Track',
                description: 'Submit applications with one click and track your progress in real-time.',
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 text-white text-xl font-bold mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">What People Say</h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Hear from students and companies who have found success with InternX.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="card card-hover p-6 flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < testimonial.rating ? 'text-warning-400 fill-warning-400' : 'text-[var(--border-secondary)]'}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-6 flex-1">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-medium text-[var(--text-primary)] text-sm">{testimonial.name}</div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-primary-600 px-8 py-16 lg:px-16 lg:py-20 text-center">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-700 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
                Join thousands of students and companies already using InternX to find their perfect match.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="bg-white text-primary-700 hover:bg-primary-50 font-medium px-8 py-3 rounded-lg transition-colors flex items-center gap-2">
                  Sign Up Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/internships" className="border border-primary-400 text-white hover:bg-primary-700 font-medium px-8 py-3 rounded-lg transition-colors">
                  Explore Internships
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-primary)] bg-[var(--bg-surface)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-[var(--text-primary)]">InternX</span>
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                Connecting students with companies for the best internship opportunities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--text-primary)] mb-4">For Students</h4>
              <ul className="space-y-2">
                <li><Link to="/internships" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Browse Internships</Link></li>
                <li><Link to="/register" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Create Profile</Link></li>
                <li><Link to="/login" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Student Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--text-primary)] mb-4">For Companies</h4>
              <ul className="space-y-2">
                <li><Link to="/register" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Post Internships</Link></li>
                <li><Link to="/login" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Company Login</Link></li>
                <li><Link to="/register" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--text-primary)] mb-4">Support</h4>
              <ul className="space-y-2">
                <li><span className="text-sm text-[var(--text-muted)]">Help Center</span></li>
                <li><span className="text-sm text-[var(--text-muted)]">Contact Us</span></li>
                <li><span className="text-sm text-[var(--text-muted)]">Privacy Policy</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[var(--border-primary)] text-center">
            <p className="text-sm text-[var(--text-muted)]">2024 InternX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
