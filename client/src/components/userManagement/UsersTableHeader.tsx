import React from 'react';
import { FaCalendarAlt, FaCog, FaEnvelope, FaHashtag, FaUser, FaUserShield } from 'react-icons/fa';
import { getSortIcon } from './usersUtils';

interface UsersTableHeaderProps {
  currentSortBy: string;
  currentSortOrder: string;
  onSort: (column: string) => void;
}

/**
 * Users Table Header Component
 * Displays table headers with sorting functionality
 */
const UsersTableHeader: React.FC<UsersTableHeaderProps> = ({
  currentSortBy,
  currentSortOrder,
  onSort
}) => {
  // Handle sort click
  const handleSort = (column: string) => {
    onSort(column);
  };

  return (
    <thead style={{ backgroundColor: 'var(--table-header-bg)', borderBottomColor: 'var(--border-color)', borderBottomWidth: 1 }}>
      <tr>
        {/* ID Column - Hidden on mobile */}
        <th
          className="hidden lg:table-cell w-16 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('id')}
        >
          <div className="flex items-center space-x-1">
            <FaHashtag className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>ID</span>
            {getSortIcon('id', currentSortBy, currentSortOrder)}
          </div>
        </th>
        <th
          className="w-32 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('firstName')}
        >
          <div className="flex items-center space-x-1">
            <FaUser className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>First Name</span>
            {getSortIcon('firstName', currentSortBy, currentSortOrder)}
          </div>
        </th>
        {/* Last Name Column - Hidden on small screens */}
        <th
          className="hidden sm:table-cell w-32 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('lastName')}
        >
          <div className="flex items-center space-x-1">
            <FaUser className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Last Name</span>
            {getSortIcon('lastName', currentSortBy, currentSortOrder)}
          </div>
        </th>
        <th
          className="w-48 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('email')}
        >
          <div className="flex items-center space-x-1">
            <FaEnvelope className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Email</span>
            {getSortIcon('email', currentSortBy, currentSortOrder)}
          </div>
        </th>
        <th
          className="w-40 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('role')}
        >
          <div className="flex items-center space-x-1">
            <FaUserShield className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Role</span>
            {getSortIcon('role', currentSortBy, currentSortOrder)}
          </div>
        </th>
        {/* Created Date Column - Hidden on extra small screens */}
        <th
          className="hidden xs:table-cell w-24 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('createdAt')}
        >
          <div className="flex items-center space-x-1">
            <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Created</span>
            {getSortIcon('createdAt', currentSortBy, currentSortOrder)}
          </div>
        </th>
        {/* Updated Date Column - Hidden on mobile and tablet */}
        <th
          className="hidden lg:table-cell w-24 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('updatedAt')}
        >
          <div className="flex items-center space-x-1">
            <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Updated</span>
            {getSortIcon('updatedAt', currentSortBy, currentSortOrder)}
          </div>
        </th>
        <th className="w-32 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--table-text-secondary)' }}>
          <div className="flex items-center space-x-1">
            <FaCog className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Actions</span>
          </div>
        </th>
      </tr>
    </thead>
  );
};

export default UsersTableHeader;

