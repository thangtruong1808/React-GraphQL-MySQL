import React from 'react';
import { FaHashtag, FaHeading, FaAlignLeft, FaTag, FaExclamationTriangle, FaProjectDiagram, FaUser, FaCalendarAlt, FaCog } from 'react-icons/fa';
import { getSortIcon } from './tasksUtils';

interface TasksTableHeaderProps {
  currentSortBy: string;
  currentSortOrder: string;
  onSort: (sortBy: string) => void;
}

/**
 * Tasks Table Header Component
 * Displays table column headers with sorting functionality
 */
const TasksTableHeader: React.FC<TasksTableHeaderProps> = ({ currentSortBy, currentSortOrder, onSort }) => {
  // Handle column sort click
  const handleSort = (sortBy: string) => {
    onSort(sortBy);
  };

  return (
    <thead style={{ backgroundColor: 'var(--table-header-bg)', borderBottomColor: 'var(--border-color)', borderBottomWidth: 1 }}>
      <tr>
        {/* ID Column - Hidden on mobile and tablet */}
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
        {/* Title Column - Always visible */}
        <th
          className="w-48 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('title')}
        >
          <div className="flex items-center space-x-1">
            <FaHeading className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Title</span>
            {getSortIcon('title', currentSortBy, currentSortOrder)}
          </div>
        </th>
        {/* Description Column - Hidden on mobile */}
        <th className="hidden sm:table-cell w-64 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--table-text-secondary)' }}>
          <div className="flex items-center space-x-1">
            <FaAlignLeft className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Description</span>
          </div>
        </th>
        {/* Status Column - Always visible */}
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
        {/* Priority Column - Hidden on mobile */}
        <th
          className="hidden sm:table-cell w-24 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('priority')}
        >
          <div className="flex items-center space-x-1">
            <FaExclamationTriangle className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Priority</span>
            {getSortIcon('priority', currentSortBy, currentSortOrder)}
          </div>
        </th>
        {/* Project Column - Hidden on mobile and tablet */}
        <th className="hidden lg:table-cell w-40 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--table-text-secondary)' }}>
          <div className="flex items-center space-x-1">
            <FaProjectDiagram className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Project</span>
          </div>
        </th>
        {/* Assigned To Column - Hidden on mobile and tablet */}
        <th className="hidden lg:table-cell w-40 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--table-text-secondary)' }}>
          <div className="flex items-center space-x-1">
            <FaUser className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Assigned To</span>
          </div>
        </th>
        {/* Tags Column - Hidden on mobile and tablet */}
        <th className="hidden lg:table-cell w-48 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--table-text-secondary)' }}>
          <div className="flex items-center space-x-1">
            <FaTag className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Tags</span>
          </div>
        </th>
        {/* Due Date Column - Hidden on mobile and tablet */}
        <th
          className="hidden lg:table-cell w-32 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('dueDate')}
        >
          <div className="flex items-center space-x-1">
            <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Due Date</span>
            {getSortIcon('dueDate', currentSortBy, currentSortOrder)}
          </div>
        </th>
        {/* Created Date Column - Hidden on mobile and tablet */}
        <th
          className="hidden lg:table-cell w-32 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
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
          className="hidden lg:table-cell w-32 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('updatedAt')}
        >
          <div className="flex items-center space-x-1">
            <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Updated</span>
            {getSortIcon('updatedAt', currentSortBy, currentSortOrder)}
          </div>
        </th>
        {/* Actions Column - Always visible */}
        <th className="w-40 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--table-text-secondary)' }}>
          <div className="flex items-center space-x-1">
            <FaCog className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Actions</span>
          </div>
        </th>
      </tr>
    </thead>
  );
};

export default TasksTableHeader;

