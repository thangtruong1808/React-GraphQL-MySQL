import React from 'react';
import { getSortIcon } from './projectMembersUtils';

interface ProjectMembersTableHeaderProps {
  currentSortBy: string;
  currentSortOrder: string;
  onSort: (column: string) => void;
}

/**
 * Project Members Table Header Component
 * Displays table headers with sorting functionality
 */
const ProjectMembersTableHeader: React.FC<ProjectMembersTableHeaderProps> = ({
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
        {/* ID Column - Hidden on large screens */}
        <th
          className="hidden lg:table-cell px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('userId')}
        >
          <div className="flex items-center space-x-1">
            <span>ID</span>
            {getSortIcon('userId', currentSortBy, currentSortOrder)}
          </div>
        </th>
        {/* User Column */}
        <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--table-text-secondary)' }}>
          User
        </th>
        {/* Member Type Column */}
        <th
          className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('memberRole')}
        >
          <div className="flex items-center space-x-1">
            <span>Type</span>
            {getSortIcon('memberRole', currentSortBy, currentSortOrder)}
          </div>
        </th>
        {/* Role Column */}
        <th
          className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('role')}
        >
          <div className="flex items-center space-x-1">
            <span>Role</span>
            {getSortIcon('role', currentSortBy, currentSortOrder)}
          </div>
        </th>
        {/* User Role Column - Hidden on small screens */}
        <th className="hidden sm:table-cell px-4 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--table-text-secondary)' }}>
          User Role
        </th>
        {/* Joined Column - Hidden on extra small screens */}
        <th
          className="hidden xs:table-cell px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('createdAt')}
        >
          <div className="flex items-center space-x-1">
            <span>Joined</span>
            {getSortIcon('createdAt', currentSortBy, currentSortOrder)}
          </div>
        </th>
        <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--table-text-secondary)' }}>
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default ProjectMembersTableHeader;

