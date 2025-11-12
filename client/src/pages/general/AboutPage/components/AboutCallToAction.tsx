import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../../../../constants/routingConstants';

/**
 * Description: Encourages visitors to sign up or explore projects using themed CTA buttons.
 * Data created: None; renders static content only.
 * Author: thangtruong
 */
export const AboutCallToAction: React.FC = () => {
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
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Ready to Transform Your Project Management?
          </h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Join thousands of teams who have already discovered the power of TaskFlow.
            Start your journey towards more efficient project management today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={ROUTE_PATHS.LOGIN}
              className="inline-flex items-center px-8 py-3 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--button-primary-text)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Get Started Now
            </Link>
            <Link
              to={ROUTE_PATHS.PROJECTS}
              className="inline-flex items-center px-8 py-3 font-semibold rounded-lg border theme-border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                backgroundColor: 'var(--card-bg)',
                backgroundImage: 'var(--card-surface-overlay)',
                borderColor: 'var(--border-color)',
                color: 'var(--accent-from)',
                boxShadow: '0 16px 32px var(--shadow-color)'
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor = 'var(--card-hover-bg)';
                event.currentTarget.style.boxShadow = '0 20px 40px var(--shadow-color)';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor = 'var(--card-bg)';
                event.currentTarget.style.boxShadow = '0 16px 32px var(--shadow-color)';
              }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent-from)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              View Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

