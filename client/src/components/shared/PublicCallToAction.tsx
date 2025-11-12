import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Description: Provides the public dashboard call-to-action area with live metrics, feature highlights, and login entry point.
 * Data created: Utilises supplied statistics and authentication state without generating new stateful data.
 * Author: thangtruong
 */

interface PublicStats {
  totalProjects: number;
  totalUsers: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  totalComments: number;
  recentActivity: number;
}

interface PublicCallToActionProps {
  stats: PublicStats;
}

const PublicCallToAction: React.FC<PublicCallToActionProps> = ({ stats }) => {
  // Get authentication state to conditionally show login button
  const { isAuthenticated } = useAuth();

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
          {/* Header Section */}
          <div className="mb-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                backgroundImage: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))'
              }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              {isAuthenticated ? 'Welcome to Our Community!' : 'Ready to Join Our Community?'}
            </h2>
            <p className="text-xl mb-6" style={{ color: 'var(--text-secondary)' }}>
              {isAuthenticated
                ? `You're part of ${stats.totalUsers} team members managing ${stats.totalProjects} projects with ${stats.totalTasks} tasks across our platform.`
                : `Join ${stats.totalUsers} team members managing ${stats.totalProjects} projects with ${stats.totalTasks} tasks across our platform.`
              }
            </p>

            {/* Enhanced Statistics Display */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div
                className="text-center p-3 rounded-lg border theme-border"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  backgroundImage: 'var(--card-surface-overlay)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalProjects}</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Active Projects</div>
              </div>
              <div
                className="text-center p-3 rounded-lg border theme-border"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  backgroundImage: 'var(--card-surface-overlay)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalTasks}</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Tasks</div>
              </div>
              <div
                className="text-center p-3 rounded-lg border theme-border"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  backgroundImage: 'var(--card-surface-overlay)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalComments}</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Comments</div>
              </div>
              <div
                className="text-center p-3 rounded-lg border theme-border"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  backgroundImage: 'var(--card-surface-overlay)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.recentActivity}</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Recent Activity</div>
              </div>
            </div>
          </div>

          {/* Login Button - Only show for non-authenticated users */}
          {!isAuthenticated && (
            <div className="mb-8">
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  backgroundImage: 'linear-gradient(90deg, var(--accent-from), var(--accent-to))',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                  '--tw-ring-color': 'var(--accent-ring)'
                } as React.CSSProperties}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Get Started with TaskFlow
              </Link>
            </div>
          )}

          {/* Features List */}
          <div className="pt-8 border-t theme-border">
            <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              Why Choose TaskFlow?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center p-3 rounded-xl border theme-border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--accent-from)' }}>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Comprehensive Project Management</span>
              </div>
              <div className="flex items-center p-3 rounded-xl border theme-border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--accent-to)' }}>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Team Collaboration & Communication</span>
              </div>
              <div className="flex items-center p-3 rounded-xl border theme-border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--badge-secondary-text)' }}>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Real-time Analytics & Insights</span>
              </div>
              <div className="flex items-center p-3 rounded-xl border theme-border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--badge-warning-text)' }}>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Advanced Progress Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicCallToAction;
