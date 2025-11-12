import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../../../constants/routingConstants';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * Description: Presents themed call-to-action messaging that encourages visitors to explore projects.
 * Data created: None; relies on authentication context state.
 * Author: thangtruong
 */
const ProjectsCallToAction: React.FC = () => {
  // Get authentication state to conditionally show login button
  const { isAuthenticated } = useAuth();

  // Don't render the CTA section for authenticated users
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div
        className="max-w-7xl mx-auto rounded-2xl shadow-lg p-8 border theme-border"
        style={{
          backgroundColor: 'var(--card-bg)',
          backgroundImage: 'var(--card-surface-overlay)',
          borderColor: 'var(--border-color)',
          boxShadow: '0 24px 48px var(--shadow-color)'
        }}
      >
        <div
          className="text-center rounded-2xl p-8 border theme-border transition-all duration-500 transform hover:-translate-y-1"
          style={{
            backgroundColor: 'var(--card-bg)',
            backgroundImage: 'var(--card-surface-overlay)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 24px 48px var(--shadow-color)'
          }}
          onMouseEnter={(event) => {
            const target = event.currentTarget as HTMLDivElement;
            target.style.backgroundColor = 'var(--card-hover-bg)';
            target.style.boxShadow = '0 28px 56px var(--shadow-color)';
          }}
          onMouseLeave={(event) => {
            const target = event.currentTarget as HTMLDivElement;
            target.style.backgroundColor = 'var(--card-bg)';
            target.style.boxShadow = '0 24px 48px var(--shadow-color)';
          }}
        >
          <div className="flex items-center justify-center mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent-from)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Ready to Start Your Project?
          </h2>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            Join our community and start managing your projects with TaskFlow today.
          </p>
          <Link
            to={ROUTE_PATHS.LOGIN}
            className="inline-flex items-center px-6 py-3 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundImage: 'linear-gradient(120deg, var(--accent-from), var(--accent-to))',
              color: 'var(--button-primary-text)',
              boxShadow: '0 16px 32px rgba(124, 58, 237, 0.22)'
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.boxShadow = '0 20px 40px rgba(124, 58, 237, 0.3)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.boxShadow = '0 16px 32px rgba(124, 58, 237, 0.22)';
            }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Get Started with TaskFlow
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectsCallToAction;
