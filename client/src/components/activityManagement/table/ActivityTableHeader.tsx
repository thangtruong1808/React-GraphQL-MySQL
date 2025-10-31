import React from 'react';
import { FaHashtag, FaUser, FaTag, FaBolt, FaFolder, FaTasks, FaCalendarAlt, FaCog } from 'react-icons/fa';
import { ACTIVITY_TABLE_COLUMNS } from '../../../constants/activityManagement';
import SortIcon from './SortIcon';
import { getDbField, getNewSortOrder } from './utils';

interface ActivityTableHeaderProps {
  currentSortBy: string;
  currentSortOrder: string;
  onSort: (field: string, order: string) => void;
}

/**
 * Activity Table Header Component
 * Displays sortable table column headers
 */
const ActivityTableHeader: React.FC<ActivityTableHeaderProps> = ({
  currentSortBy,
  currentSortOrder,
  onSort
}) => {
  // Handle sort click
  const handleSort = (column: string) => {
    const dbField = getDbField(column);
    const newSortOrder = getNewSortOrder(currentSortBy, currentSortOrder, column);
    onSort(dbField, newSortOrder);
  };

  return (
    <thead className="theme-table-header-bg">
      <tr>
        {/* ID Column - Hidden on mobile and tablet */}
        <th
          className={`hidden lg:table-cell px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors ${ACTIVITY_TABLE_COLUMNS.ID.width}`}
          onClick={() => handleSort('id')}
        >
          <div className="flex items-center space-x-1">
            <FaHashtag className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>ID</span>
            <SortIcon column="id" currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} getDbField={getDbField} />
          </div>
        </th>

        {/* User Column - Always visible */}
        <th
          className={`px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors duration-200 ${ACTIVITY_TABLE_COLUMNS.USER.width}`}
          onClick={() => handleSort('user')}
        >
          <div className="flex items-center space-x-1">
            <FaUser className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>User</span>
            <SortIcon column="user" currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} getDbField={getDbField} />
          </div>
        </th>

        {/* Type Column - Always visible */}
        <th
          className={`px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors duration-200 ${ACTIVITY_TABLE_COLUMNS.TYPE.width}`}
          onClick={() => handleSort('type')}
        >
          <div className="flex items-center space-x-1">
            <FaTag className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Type</span>
            <SortIcon column="type" currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} getDbField={getDbField} />
          </div>
        </th>

        {/* Action Column - Hidden on mobile */}
        <th className={`hidden sm:table-cell px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.ACTION.width}`}>
          <div className="flex items-center space-x-1">
            <FaBolt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Action</span>
          </div>
        </th>

        {/* Target User Column - Hidden on mobile and tablet */}
        <th
          className={`hidden lg:table-cell px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors duration-200 ${ACTIVITY_TABLE_COLUMNS.TARGET_USER.width}`}
          onClick={() => handleSort('targetUser')}
        >
          <div className="flex items-center space-x-1">
            <FaUser className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Target User</span>
            <SortIcon column="targetUser" currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} getDbField={getDbField} />
          </div>
        </th>

        {/* Project Column - Hidden on mobile */}
        <th
          className={`hidden sm:table-cell px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors duration-200 ${ACTIVITY_TABLE_COLUMNS.PROJECT.width}`}
          onClick={() => handleSort('project')}
        >
          <div className="flex items-center space-x-1">
            <FaFolder className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Project</span>
            <SortIcon column="project" currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} getDbField={getDbField} />
          </div>
        </th>

        {/* Task Column - Hidden on mobile */}
        <th
          className={`hidden sm:table-cell px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors duration-200 ${ACTIVITY_TABLE_COLUMNS.TASK.width}`}
          onClick={() => handleSort('task')}
        >
          <div className="flex items-center space-x-1">
            <FaTasks className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Task</span>
            <SortIcon column="task" currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} getDbField={getDbField} />
          </div>
        </th>

        {/* Created Column - Hidden on mobile */}
        <th
          className={`hidden xs:table-cell px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors duration-200 ${ACTIVITY_TABLE_COLUMNS.CREATED.width}`}
          onClick={() => handleSort('created')}
        >
          <div className="flex items-center space-x-1">
            <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Created</span>
            <SortIcon column="created" currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} getDbField={getDbField} />
          </div>
        </th>

        {/* Updated Column - Hidden on mobile and tablet */}
        <th
          className={`hidden lg:table-cell px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors duration-200 ${ACTIVITY_TABLE_COLUMNS.UPDATED.width}`}
          onClick={() => handleSort('updated')}
        >
          <div className="flex items-center space-x-1">
            <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Updated</span>
            <SortIcon column="updated" currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} getDbField={getDbField} />
          </div>
        </th>

        {/* Actions Column - Always visible */}
        <th className={`px-4 py-4 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.ACTIONS.width}`}>
          <div className="flex items-center space-x-1">
            <FaCog className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>Actions</span>
          </div>
        </th>
      </tr>
    </thead>
  );
};

export default ActivityTableHeader;

