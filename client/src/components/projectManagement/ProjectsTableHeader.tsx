import React from 'react';
import { FaFolder, FaAlignLeft, FaTag, FaUser, FaCalendarAlt, FaCog, FaHashtag } from 'react-icons/fa';
import { getSortIcon } from './projectsUtils';

interface ProjectsTableHeaderProps {
  currentSortBy: string;
  currentSortOrder: string;
  onSort: (column: string) => void;
}

/**
 * Projects Table Header Component
 * Displays table headers with sorting functionality
 */
const ProjectsTableHeader: React.FC<ProjectsTableHeaderProps> = ({
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
        <th
          className="w-16 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors hidden lg:table-cell"
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
          className="w-48 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('name')}
        >
          <div className="flex items-center space-x-1">
            <FaFolder className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Name</span>
            {getSortIcon('name', currentSortBy, currentSortOrder)}
          </div>
        </th>
        <th className="w-64 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--table-text-secondary)' }}>
          <div className="flex items-center space-x-1">
            <FaAlignLeft className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Description</span>
          </div>
        </th>
        <th
          className="w-32 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('status')}
        >
          <div className="flex items-center space-x-1">
            <FaTag className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Status</span>
            {getSortIcon('status', currentSortBy, currentSortOrder)}
          </div>
        </th>
        <th className="w-40 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--table-text-secondary)' }}>
          <div className="flex items-center space-x-1">
            <FaUser className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Owner</span>
          </div>
        </th>
        <th
          className="w-24 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors hidden xs:table-cell"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('createdAt')}
        >
          <div className="flex items-center space-x-1">
            <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Created</span>
            {getSortIcon('createdAt', currentSortBy, currentSortOrder)}
          </div>
        </th>
        <th
          className="w-24 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors hidden lg:table-cell"
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

export default ProjectsTableHeader;

