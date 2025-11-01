import React from 'react';
import { FaAlignLeft, FaCalendarAlt, FaCog, FaEnvelope, FaHashtag, FaUser } from 'react-icons/fa';
import { getDbField } from './utils';

interface NotificationTableHeaderProps {
  currentSortBy: string;
  currentSortOrder: string;
  onSort: (column: string) => void;
}

/**
 * Sort icon component
 * Displays appropriate sort icon based on current sort state
 */
const SortIcon: React.FC<{ currentSortBy: string; currentSortOrder: string; dbField: string }> = ({
  currentSortBy,
  currentSortOrder,
  dbField
}) => {
  if (currentSortBy !== dbField) {
    return (
      <svg className="w-4 h-4 theme-sort-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  }

  return currentSortOrder === 'ASC' ? (
    <svg className="w-4 h-4 theme-sort-icon-active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg className="w-4 h-4 theme-sort-icon-active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
};

/**
 * Notification Table Header Component
 * Displays table headers with sorting functionality
 */
const NotificationTableHeader: React.FC<NotificationTableHeaderProps> = ({
  currentSortBy,
  currentSortOrder,
  onSort
}) => {
  // Handle sort click
  const handleSort = (column: string) => {
    onSort(column);
  };

  return (
    <thead className="theme-table-header-bg">
      <tr>
        {/* ID Column - Hidden on mobile */}
        <th
          className="hidden lg:table-cell w-16 px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
          onClick={() => handleSort('id')}
        >
          <div className="flex items-center space-x-1">
            <FaHashtag className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>ID</span>
            <SortIcon currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} dbField={getDbField('id')} />
          </div>
        </th>
        {/* User Column - Hidden on small screens */}
        <th
          className="hidden sm:table-cell w-32 px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
          onClick={() => handleSort('user')}
        >
          <div className="flex items-center space-x-1">
            <FaUser className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>User</span>
            <SortIcon currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} dbField={getDbField('user')} />
          </div>
        </th>
        {/* Message Column - Always visible */}
        <th className="w-48 px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
          <div className="flex items-center space-x-1">
            <FaAlignLeft className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Message</span>
          </div>
        </th>
        {/* Status Column - Always visible */}
        <th
          className="w-24 px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
          onClick={() => handleSort('status')}
        >
          <div className="flex items-center space-x-1">
            <FaEnvelope className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Status</span>
            <SortIcon currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} dbField={getDbField('status')} />
          </div>
        </th>
        {/* Created Date Column - Hidden on extra small screens */}
        <th
          className="hidden xs:table-cell w-24 px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
          onClick={() => handleSort('createdAt')}
        >
          <div className="flex items-center space-x-1">
            <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Created</span>
            <SortIcon currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} dbField={getDbField('createdAt')} />
          </div>
        </th>
        {/* Updated Date Column - Hidden on mobile and tablet */}
        <th
          className="hidden lg:table-cell w-24 px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
          onClick={() => handleSort('updatedAt')}
        >
          <div className="flex items-center space-x-1">
            <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Updated</span>
            <SortIcon currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} dbField={getDbField('updatedAt')} />
          </div>
        </th>
        {/* Actions Column - Always visible */}
        <th className="w-32 px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
          <div className="flex items-center space-x-1">
            <FaCog className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Actions</span>
          </div>
        </th>
      </tr>
    </thead>
  );
};

export default NotificationTableHeader;

