import React from 'react';
import { FaEdit, FaTag, FaCalendarAlt, FaCog, FaHashtag, FaFolder, FaAlignLeft } from 'react-icons/fa';
import { getSortIcon } from './tagsUtils';

interface TagsTableHeaderProps {
  currentSortBy: string;
  currentSortOrder: string;
  onSort: (column: string) => void;
}

/**
 * Tags Table Header Component
 * Displays sortable table headers with icons
 */
const TagsTableHeader: React.FC<TagsTableHeaderProps> = ({ currentSortBy, currentSortOrder, onSort }) => {
  // Handle sort click
  const handleSort = (column: string) => {
    onSort(column);
  };

  // Handle mouse enter for sortable header
  const handleMouseEnter = (e: React.MouseEvent<HTMLTableCellElement>) => {
    e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
  };

  // Handle mouse leave for sortable header
  const handleMouseLeave = (e: React.MouseEvent<HTMLTableCellElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  return (
    <thead style={{ backgroundColor: 'var(--table-header-bg)' }}>
      <tr>
        {/* ID Column - Hidden on mobile */}
        <th
          className="hidden lg:table-cell w-16 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors duration-200"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('id')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center space-x-2">
            <FaHashtag className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>ID</span>
            {getSortIcon('id', currentSortBy, currentSortOrder)}
          </div>
        </th>

        {/* Name Column */}
        <th
          className="w-32 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors duration-200"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('name')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center space-x-2">
            <FaTag className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Name</span>
            {getSortIcon('name', currentSortBy, currentSortOrder)}
          </div>
        </th>

        {/* Description Column - Hidden on small screens */}
        <th className="hidden sm:table-cell w-48 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--table-text-secondary)' }}>
          <div className="flex items-center space-x-2">
            <FaAlignLeft className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Description</span>
          </div>
        </th>

        {/* Type Column - Hidden on extra small screens */}
        <th
          className="hidden xs:table-cell w-24 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors duration-200"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('type')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center space-x-2">
            <FaTag className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Type</span>
            {getSortIcon('type', currentSortBy, currentSortOrder)}
          </div>
        </th>

        {/* Category Column - Hidden on mobile and tablet */}
        <th
          className="hidden lg:table-cell w-24 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors duration-200"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('category')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center space-x-2">
            <FaFolder className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Category</span>
            {getSortIcon('category', currentSortBy, currentSortOrder)}
          </div>
        </th>

        {/* Created Column - Hidden on extra small screens */}
        <th
          className="hidden xs:table-cell w-24 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors duration-200"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('createdAt')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Created</span>
            {getSortIcon('createdAt', currentSortBy, currentSortOrder)}
          </div>
        </th>

        {/* Updated Column - Hidden on mobile and tablet */}
        <th
          className="hidden lg:table-cell w-24 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors duration-200"
          style={{ color: 'var(--table-text-secondary)' }}
          onClick={() => handleSort('updatedAt')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Updated</span>
            {getSortIcon('updatedAt', currentSortBy, currentSortOrder)}
          </div>
        </th>

        {/* Actions Column */}
        <th className="w-32 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--table-text-secondary)' }}>
          <div className="flex items-center space-x-2">
            <FaCog className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Actions</span>
          </div>
        </th>
      </tr>
    </thead>
  );
};

export default TagsTableHeader;

