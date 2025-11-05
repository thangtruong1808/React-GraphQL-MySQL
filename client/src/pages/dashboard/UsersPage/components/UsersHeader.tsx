import React from 'react';
import { FaPlus } from 'react-icons/fa';

/**
 * Users Header Props
 */
export interface UsersHeaderProps {
  canCreate: boolean;
  onCreateClick: () => void;
}

/**
 * Users Page Header Component
 * Displays page title, description, and create button
 */
export const UsersHeader: React.FC<UsersHeaderProps> = ({ canCreate, onCreateClick }) => {
  return (
    <div className="w-full" style={{ backgroundColor: 'var(--bg-base)', borderBottomColor: 'var(--border-color)', borderBottomWidth: 1 }}>
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Users Management
            </h1>
            <p className="text-sm sm:text-base mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage and track your users
            </p>
          </div>
          {canCreate && (
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md w-full sm:w-auto sm:flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                color: 'var(--button-primary-text)',
                backgroundColor: 'var(--button-primary-bg)',
                borderColor: 'var(--button-primary-bg)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--button-primary-hover-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--button-primary-bg)';
              }}
              onClick={onCreateClick}
            >
              <FaPlus className="h-5 w-5" aria-hidden="true" />
              <span className="hidden xs:inline ml-2">Create User</span>
              <span className="xs:hidden ml-2">Create</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

