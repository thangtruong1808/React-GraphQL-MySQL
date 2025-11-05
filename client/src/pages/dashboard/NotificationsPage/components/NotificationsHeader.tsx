import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { NotificationsHeaderProps } from '../types';

/**
 * Notifications Page Header Component
 * Displays page title, description, and create button
 */
export const NotificationsHeader: React.FC<NotificationsHeaderProps> = ({ onCreateClick }) => {
  return (
    <div className="w-full" style={{ backgroundColor: 'var(--bg-base)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Notifications Management
            </h1>
            <p className="text-sm sm:text-base mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage and monitor all notifications in the system
            </p>
          </div>
          {/* Create Button - Centered icon and text for better mobile UX when sidebar is collapsed */}
          <button
            type="button"
            onClick={onCreateClick}
            className="inline-flex items-center justify-center px-4 py-2 shadow-sm text-sm font-medium rounded-md w-full sm:w-auto sm:flex-shrink-0"
            style={{ backgroundColor: 'var(--button-primary-bg)', color: 'var(--button-primary-text)', border: '1px solid var(--button-primary-border, transparent)' }}
          >
            <FaPlus className="h-5 w-5" aria-hidden="true" />
            <span className="hidden xs:inline ml-2">Create Notification</span>
            <span className="xs:hidden ml-2">Create</span>
          </button>
        </div>
      </div>
    </div>
  );
};

