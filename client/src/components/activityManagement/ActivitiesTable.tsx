import React from 'react';
import { FaEdit, FaTrash, FaHashtag, FaUser, FaTag, FaBolt, FaFolder, FaTasks, FaCalendarAlt, FaCog } from 'react-icons/fa';
import {
  ACTIVITY_TABLE_COLUMNS,
  ACTIVITY_TYPE_BADGES,
  PAGE_SIZE_OPTIONS,
} from '../../constants/activityManagement';
import { ActivitiesTableProps } from '../../types/activityManagement';
import { formatRoleForDisplay } from '../../utils/roleFormatter';

/**
 * Activities Table Component
 * Displays activities in a paginated table with sorting and CRUD actions
 * Features responsive design and loading states
 */
const ActivitiesTable: React.FC<ActivitiesTableProps> = ({
  activities,
  loading,
  paginationInfo,
  currentPage,
  currentPageSize,
  onPageChange,
  onPageSizeChange,
  onSort,
  currentSortBy,
  currentSortOrder,
  onEdit,
  onDelete,
}) => {
  // Ensure all values are valid numbers to prevent NaN errors
  const safeCurrentPage = Math.max(1, Number(currentPage) || 1);
  const safePageSize = Math.max(1, Number(currentPageSize) || 10);
  const safeTotalCount = Math.max(0, Number(paginationInfo.totalCount) || 0);
  const safeTotalPages = Math.max(1, Number(paginationInfo.totalPages) || 1);
  // Format date with error handling
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Get sort icon for column headers
  const getSortIcon = (column: string) => {
    // Map UI column names to database field names for icon display
    const fieldMapping: { [key: string]: string } = {
      'id': 'id',
      'user': 'createdAt',
      'type': 'type',
      'targetUser': 'createdAt',
      'project': 'createdAt',
      'task': 'createdAt',
      'created': 'createdAt',
      'updated': 'updatedAt',
      'action': 'action'
    };

    const dbField = fieldMapping[column] || column;

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

  // Handle sort click
  const handleSort = (column: string) => {
    // Map UI column names to database field names
    const fieldMapping: { [key: string]: string } = {
      'id': 'id',
      'user': 'createdAt',
      'type': 'type',
      'targetUser': 'createdAt',
      'project': 'createdAt',
      'task': 'createdAt',
      'created': 'createdAt',
      'updated': 'updatedAt',
      'action': 'action'
    };

    const dbField = fieldMapping[column] || column;
    let newSortOrder = 'ASC';

    if (currentSortBy === dbField) {
      // If already sorting by this field, toggle order
      newSortOrder = currentSortOrder === 'ASC' ? 'DESC' : 'ASC';
    }

    onSort(dbField, newSortOrder);
  };

  // Loading skeleton rows
  const renderLoadingRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <tr key={index} className="animate-pulse">
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${ACTIVITY_TABLE_COLUMNS.ID.width}`}>
          <div className="h-4 bg-gray-200 rounded w-8"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${ACTIVITY_TABLE_COLUMNS.USER.width}`}>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${ACTIVITY_TABLE_COLUMNS.TYPE.width}`}>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </td>
        <td className={`px-4 py-4 text-sm text-gray-900 text-left ${ACTIVITY_TABLE_COLUMNS.ACTION.width}`}>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${ACTIVITY_TABLE_COLUMNS.TARGET_USER.width}`}>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${ACTIVITY_TABLE_COLUMNS.PROJECT.width}`}>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${ACTIVITY_TABLE_COLUMNS.TASK.width}`}>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${ACTIVITY_TABLE_COLUMNS.CREATED.width}`}>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${ACTIVITY_TABLE_COLUMNS.UPDATED.width}`}>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-left ${ACTIVITY_TABLE_COLUMNS.ACTIONS.width}`}>
          <div className="flex justify-start space-x-2">
            <div className="h-6 bg-gray-200 rounded w-12"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </td>
      </tr>
    ));
  };

  if (loading && activities.length === 0) {
    return (
      <div className="rounded-lg shadow overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
        <div className="overflow-x-auto">
          <table className="min-w-full theme-table-divide table-fixed">
            <thead className="theme-table-header-bg">
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.ID.width}`}>
                  ID
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.USER.width}`}>
                  User
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.TYPE.width}`}>
                  Type
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.ACTION.width}`}>
                  Action
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.TARGET_USER.width}`}>
                  Target User
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.PROJECT.width}`}>
                  Project
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.TASK.width}`}>
                  Task
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.CREATED.width}`}>
                  Created
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.UPDATED.width}`}>
                  Updated
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.ACTIONS.width}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="theme-table-row-bg theme-table-divide">
              {renderLoadingRows()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
      <div className="overflow-x-auto">
        <table className="min-w-full theme-table-divide table-fixed">
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
                  {getSortIcon('id')}
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
                  {getSortIcon('user')}
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
                  {getSortIcon('type')}
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
                  {getSortIcon('targetUser')}
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
                  {getSortIcon('project')}
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
                  {getSortIcon('task')}
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
                  {getSortIcon('created')}
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
                  {getSortIcon('updated')}
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
          <tbody className="theme-table-row-bg theme-table-divide">
            {activities.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center theme-table-text-secondary">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 theme-table-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-lg font-medium theme-table-text-primary mb-1">No activities found</p>
                    <p className="theme-table-text-secondary">Try adjusting your search criteria or create a new activity.</p>
                  </div>
                </td>
              </tr>
            ) : (
              activities.map((activity) => (
                <tr
                  key={activity.id}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--table-row-bg)')}
                  style={{ backgroundColor: 'var(--table-row-bg)' }}
                >
                  {/* ID Column - Hidden on mobile and tablet */}
                  <td className={`hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left ${ACTIVITY_TABLE_COLUMNS.ID.width}`}>
                    {activity.id}
                  </td>

                  {/* User Column - Always visible */}
                  <td className={`px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left ${ACTIVITY_TABLE_COLUMNS.USER.width}`}>
                    <div className="flex flex-col">
                      <p className="font-medium flex items-center space-x-2">
                        <FaUser className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                        <span>{activity.user.firstName} {activity.user.lastName}</span>
                      </p>
                      <p className="text-xs theme-table-text-secondary">{formatRoleForDisplay(activity.user.role)}</p>
                    </div>
                  </td>

                  {/* Type Column - Always visible */}
                  <td className={`px-4 py-4 whitespace-nowrap text-left ${ACTIVITY_TABLE_COLUMNS.TYPE.width}`}>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--badge-secondary-bg)', color: 'var(--badge-secondary-text)' }}>
                      {activity.type.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Action Column - Hidden on mobile */}
                  <td className={`hidden sm:table-cell px-4 py-4 text-sm theme-table-text-primary text-left ${ACTIVITY_TABLE_COLUMNS.ACTION.width}`}>
                    <p className="truncate flex items-center space-x-2" title={activity.action}>
                      <FaBolt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      <span>{activity.action}</span>
                    </p>
                  </td>

                  {/* Target User Column - Hidden on mobile and tablet */}
                  <td className={`hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left ${ACTIVITY_TABLE_COLUMNS.TARGET_USER.width}`}>
                    {activity.targetUser ? (
                      <div className="flex flex-col">
                        <p className="font-medium flex items-center space-x-2">
                          <FaUser className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                          <span>{activity.targetUser.firstName} {activity.targetUser.lastName}</span>
                        </p>
                        <p className="text-xs theme-table-text-secondary">{formatRoleForDisplay(activity.targetUser.role)}</p>
                      </div>
                    ) : (
                      <span className="theme-table-text-muted">-</span>
                    )}
                  </td>

                  {/* Project Column - Hidden on mobile */}
                  <td className={`hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left ${ACTIVITY_TABLE_COLUMNS.PROJECT.width}`}>
                    {activity.project ? (
                      <p className="truncate flex items-center space-x-2" title={activity.project.name}>
                        <FaFolder className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                        <span>{activity.project.name}</span>
                      </p>
                    ) : (
                      <span className="theme-table-text-muted">-</span>
                    )}
                  </td>

                  {/* Task Column - Hidden on mobile */}
                  <td className={`hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left ${ACTIVITY_TABLE_COLUMNS.TASK.width}`}>
                    {activity.task ? (
                      <p className="truncate flex items-center space-x-2" title={activity.task.title}>
                        <FaTasks className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                        <span>{activity.task.title}</span>
                      </p>
                    ) : (
                      <span className="theme-table-text-muted">-</span>
                    )}
                  </td>

                  {/* Created Column - Hidden on mobile */}
                  <td className={`hidden xs:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-secondary text-left ${ACTIVITY_TABLE_COLUMNS.CREATED.width}`}>
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      <span>{formatDate(activity.createdAt)}</span>
                    </div>
                  </td>

                  {/* Updated Column - Hidden on mobile and tablet */}
                  <td className={`hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-secondary text-left ${ACTIVITY_TABLE_COLUMNS.UPDATED.width}`}>
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      <span>{formatDate(activity.updatedAt)}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className={`px-4 py-4 whitespace-nowrap text-left ${ACTIVITY_TABLE_COLUMNS.ACTIONS.width}`}>
                    <div className="flex justify-start space-x-2">
                      <button
                        onClick={() => onEdit(activity)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150"
                        style={{ backgroundColor: 'var(--button-secondary-bg)', color: 'var(--button-primary-text)' }}
                        title="Edit activity"
                      >
                        <FaEdit className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(activity)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150"
                        style={{ backgroundColor: 'var(--button-danger-bg)', color: 'var(--button-primary-text)' }}
                        title="Delete activity"
                      >
                        <FaTrash className="w-3 h-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between theme-border-medium" style={{ backgroundColor: 'var(--card-bg)', borderTop: '1px solid var(--border-color)' }}>
        {/* Mobile pagination - show on small screens */}
        <div className="flex-1 flex justify-between sm:hidden">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange(safeCurrentPage - 1)}
              disabled={!paginationInfo.hasPreviousPage || loading || safeCurrentPage <= 1}
              className="px-3 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden xs:inline">Previous</span>
            </button>
            <span className="px-2 py-1.5 text-xs rounded" style={{ color: 'var(--text-primary)', backgroundColor: 'var(--table-header-bg)', border: '1px solid var(--border-color)' }}>
              {safeCurrentPage} / {safeTotalPages}
            </span>
            <button
              onClick={() => onPageChange(safeCurrentPage + 1)}
              disabled={!paginationInfo.hasNextPage || loading || safeCurrentPage >= safeTotalPages}
              className="px-3 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            >
              <span className="hidden xs:inline">Next</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop pagination - show on sm and larger screens */}
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          {/* Page info and size selector */}
          <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
            {/* Compact page info */}
            <p className="text-xs lg:text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span className="hidden md:inline">Showing </span>
              <span className="font-medium">{safeTotalCount === 0 ? 0 : (safeCurrentPage - 1) * safePageSize + 1}</span>
              <span className="hidden md:inline"> to </span>
              <span className="md:hidden">-</span>
              <span className="font-medium">{Math.min(safeCurrentPage * safePageSize, safeTotalCount)}</span>
              <span className="hidden md:inline"> of </span>
              <span className="md:hidden">/</span>
              <span className="font-medium">{safeTotalCount}</span>
            </p>

            {/* Page size selector */}
            <div className="flex items-center space-x-1">
              <span className="text-xs lg:text-sm" style={{ color: 'var(--text-secondary)' }}>Show</span>
              <select
                id="page-size"
                value={safePageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                disabled={loading}
                className="px-2 py-1 text-xs lg:text-sm rounded focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="text-xs lg:text-sm" style={{ color: 'var(--text-secondary)' }}>entries</span>
            </div>
          </div>

          {/* Desktop pagination */}
          <div className="flex items-center space-x-1">
            {/* First page button - hidden on small screens */}
            <button
              onClick={() => onPageChange(1)}
              disabled={safeCurrentPage === 1 || loading}
              className="hidden md:flex px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors items-center space-x-1"
              style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
              title="Go to first page"
            >
              <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              <span className="hidden lg:inline">First</span>
            </button>

            {/* Previous button */}
            <button
              onClick={() => onPageChange(safeCurrentPage - 1)}
              disabled={!paginationInfo.hasPreviousPage || loading}
              className="px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
              title="Go to previous page"
            >
              <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden lg:inline">Previous</span>
            </button>

            {/* Page numbers - responsive spacing */}
            <div className="flex items-center space-x-1 mx-1 lg:mx-2">
              {Array.from({ length: Math.min(3, safeTotalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(safeTotalPages - 2, safeCurrentPage - 1)) + i;
                if (pageNum > safeTotalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    disabled={loading}
                    className={`px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-lg transition-colors min-w-[2rem] lg:min-w-[2.5rem] disabled:opacity-50 disabled:cursor-not-allowed`}
                    style={pageNum === safeCurrentPage
                      ? { backgroundColor: 'var(--button-primary-bg)', color: 'var(--button-primary-text)' }
                      : { backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <button
              onClick={() => onPageChange(safeCurrentPage + 1)}
              disabled={!paginationInfo.hasNextPage || loading}
              className="px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
              title="Go to next page"
            >
              <span className="hidden lg:inline">Next</span>
              <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Last page button - hidden on small screens */}
            <button
              onClick={() => onPageChange(safeTotalPages)}
              disabled={safeCurrentPage === safeTotalPages || loading}
              className="hidden md:flex px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors items-center space-x-1"
              style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
              title="Go to last page"
            >
              <span className="hidden lg:inline">Last</span>
              <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesTable;
