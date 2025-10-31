import React from 'react';
import { FaHashtag, FaCommentDots, FaUser, FaTasks, FaFolder, FaHeart, FaCalendarAlt, FaCog } from 'react-icons/fa';
import { COMMENT_TABLE_COLUMNS } from '../../../constants/commentManagement';
import SortIcon from './SortIcon';
import { getDbField, getNewSortOrder } from './utils';

interface CommentTableHeaderProps {
  currentSortBy: string;
  currentSortOrder: string;
  onSort: (field: string, order: string) => void;
}

/**
 * Comment Table Header Component
 * Displays sortable table column headers
 */
const CommentTableHeader: React.FC<CommentTableHeaderProps> = ({
  currentSortBy,
  currentSortOrder,
  onSort
}) => {
  // Handle sort click
  const handleSort = (column: string) => {
    const dbField = getDbField(column);
    const newSortOrder = getNewSortOrder(currentSortBy, currentSortOrder as 'ASC' | 'DESC', column);
    onSort(dbField, newSortOrder);
  };

  return (
    <thead style={{ backgroundColor: 'var(--table-header-bg)', borderBottomColor: 'var(--border-color)', borderBottomWidth: 1 }}>
      <tr>
        {/* ID Column - Hidden on mobile */}
        <th
          className={`hidden lg:table-cell px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors ${COMMENT_TABLE_COLUMNS.ID.width}`}
          onClick={() => handleSort('id')}
        >
          <div className="flex items-center space-x-1">
            <FaHashtag className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>ID</span>
            <SortIcon column="id" currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} getDbField={getDbField} />
          </div>
        </th>

        {/* Content Column - Always visible */}
        <th className={`px-4 py-4 text-left text-xs font-medium uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.CONTENT.width}`} style={{ color: 'var(--table-text-secondary)' }}>
          <div className="flex items-center space-x-1">
            <FaCommentDots className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Content</span>
          </div>
        </th>

        {/* Author Column - Hidden on small screens */}
        <th
          className={`hidden sm:table-cell px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors duration-200 ${COMMENT_TABLE_COLUMNS.AUTHOR.width}`}
          onClick={() => handleSort('createdAt')}
        >
          <div className="flex items-center space-x-1">
            <FaUser className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Author</span>
            <SortIcon column="createdAt" currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} getDbField={getDbField} />
          </div>
        </th>

        {/* Task Column - Hidden on extra small screens */}
        <th
          className={`hidden xs:table-cell px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors duration-200 ${COMMENT_TABLE_COLUMNS.TASK.width}`}
          onClick={() => handleSort('createdAt')}
        >
          <div className="flex items-center space-x-1">
            <FaTasks className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Task</span>
            <SortIcon column="createdAt" currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} getDbField={getDbField} />
          </div>
        </th>

        {/* Project Column - Hidden on mobile and tablet */}
        <th
          className={`hidden lg:table-cell px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors duration-200 ${COMMENT_TABLE_COLUMNS.PROJECT.width}`}
          onClick={() => handleSort('createdAt')}
        >
          <div className="flex items-center space-x-1">
            <FaFolder className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Project</span>
            <SortIcon column="createdAt" currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} getDbField={getDbField} />
          </div>
        </th>

        {/* Likes Column - Hidden on small screens */}
        <th
          className={`hidden sm:table-cell px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors duration-200 ${COMMENT_TABLE_COLUMNS.LIKES.width}`}
          onClick={() => handleSort('createdAt')}
        >
          <div className="flex items-center space-x-1">
            <FaHeart className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Likes</span>
            <SortIcon column="createdAt" currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} getDbField={getDbField} />
          </div>
        </th>

        {/* Created Column - Hidden on extra small screens */}
        <th
          className={`hidden xs:table-cell px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors duration-200 ${COMMENT_TABLE_COLUMNS.CREATED.width}`}
          onClick={() => handleSort('createdAt')}
        >
          <div className="flex items-center space-x-1">
            <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Created</span>
            <SortIcon column="createdAt" currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} getDbField={getDbField} />
          </div>
        </th>

        {/* Updated Column - Hidden on mobile and tablet */}
        <th
          className={`hidden lg:table-cell px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors duration-200 ${COMMENT_TABLE_COLUMNS.UPDATED.width}`}
          onClick={() => handleSort('updatedAt')}
        >
          <div className="flex items-center space-x-1">
            <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Updated</span>
            <SortIcon column="updatedAt" currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} getDbField={getDbField} />
          </div>
        </th>

        {/* Actions Column - Always visible */}
        <th className={`px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.ACTIONS.width}`}>
          <div className="flex items-center space-x-1">
            <FaCog className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Actions</span>
          </div>
        </th>
      </tr>
    </thead>
  );
};

export default CommentTableHeader;

