import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../../../../constants/routingConstants';
import { ProjectDetails } from '../types';

/**
 * Comment Permissions Props
 */
export interface CommentPermissionsProps {
  project: ProjectDetails;
  isAuthenticated: boolean;
  canPostComments: () => boolean;
}

/**
 * Comment Permissions Component
 * Displays permission messages based on project status and user authentication
 */
export const CommentPermissions: React.FC<CommentPermissionsProps> = ({ project, isAuthenticated, canPostComments }) => {
  // For completed projects - show only project completed message
  if (project.status === 'COMPLETED') {
    return (
      <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: 'var(--table-row-bg)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 mt-0.5" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              Project Completed
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              This project has been completed. Comments are no longer available as the project is finished.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // For authenticated users on non-completed projects
  if (isAuthenticated) {
    if (canPostComments()) {
      // Team members and admins - show permission info
      return (
        <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: 'var(--badge-secondary-bg)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 mt-0.5"
                style={{ color: 'var(--badge-secondary-text)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--badge-secondary-text)' }}>
                Comment and View Permission
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--badge-secondary-text)' }}>
                Only <span className="font-semibold">team members</span> are authorized to view or post comments.
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      // Non-team members - show access restricted message
      return (
        <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: 'var(--badge-warning-bg)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 mt-0.5"
                style={{ color: 'var(--badge-warning-text)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--badge-warning-text)' }}>
                Comment Access Restricted
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--badge-warning-text)' }}>
                Sorry, only <span className="font-semibold">team members</span> can view or post comments.
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  // For unauthenticated users on non-completed projects - show login required
  return (
    <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: 'var(--table-row-bg)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 mt-0.5" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            Login Required
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Please{' '}
            <Link
              to={ROUTE_PATHS.LOGIN}
              className="font-medium"
              style={{ color: 'var(--button-primary-bg)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--button-primary-hover-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--button-primary-bg)';
              }}
            >
              log in
            </Link>{' '}
            to view and add comments.
          </p>
        </div>
      </div>
    </div>
  );
};

