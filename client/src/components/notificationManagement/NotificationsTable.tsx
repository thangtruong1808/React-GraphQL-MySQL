import React from 'react';
import { FaEdit, FaTrash, FaCheck, FaEnvelope } from 'react-icons/fa';
import {
  NOTIFICATION_TABLE_COLUMNS,
  NOTIFICATION_STATUS_BADGES,
  PAGE_SIZE_OPTIONS,
} from '../../constants/notificationManagement';
import { NotificationsTableProps } from '../../types/notificationManagement';

/**
 * Notifications Table Component
 * Displays notifications in a paginated table with sorting and CRUD actions
 * Features responsive design and loading states
 */
const NotificationsTable: React.FC<NotificationsTableProps> = ({
  notifications,
  loading,
  paginationInfo,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSort,
  currentSortBy,
  currentSortOrder,
  onEdit,
  onDelete,
  onMarkRead,
  onMarkUnread,
}) => {
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
      'status': 'isRead',
      'created': 'createdAt',
      'message': 'message'
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
      'status': 'isRead',
      'created': 'createdAt',
      'message': 'message'
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
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${NOTIFICATION_TABLE_COLUMNS.ID.width}`}>
          <div className="h-4 bg-gray-200 rounded w-8"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${NOTIFICATION_TABLE_COLUMNS.USER.width}`}>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </td>
        <td className={`px-4 py-4 text-sm text-gray-900 text-left ${NOTIFICATION_TABLE_COLUMNS.MESSAGE.width}`}>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-left ${NOTIFICATION_TABLE_COLUMNS.STATUS.width}`}>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${NOTIFICATION_TABLE_COLUMNS.CREATED.width}`}>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${NOTIFICATION_TABLE_COLUMNS.UPDATED.width}`}>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-left ${NOTIFICATION_TABLE_COLUMNS.ACTIONS.width}`}>
          <div className="flex justify-start space-x-2">
            <div className="h-6 bg-gray-200 rounded w-12"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </td>
      </tr>
    ));
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full theme-table-divide table-fixed">
            <thead className="theme-table-header-bg">
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.ID.width}`}>
                  ID
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.USER.width}`}>
                  User
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.MESSAGE.width}`}>
                  Message
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.STATUS.width}`}>
                  Status
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.CREATED.width}`}>
                  Created
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.UPDATED.width}`}>
                  Updated
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.ACTIONS.width}`}>
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
    <div className="bg-white shadow-sm rounded-lg theme-border">
      <div className="overflow-x-auto">
        <table className="min-w-full theme-table-divide table-fixed">
          <thead className="theme-table-header-bg">
            <tr>
              {/* ID Column - Hidden on mobile */}
              <th
                className="hidden lg:table-cell w-16 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <span>ID</span>
                  {getSortIcon('id')}
                </div>
              </th>
              {/* User Column - Hidden on small screens */}
              <th
                className="hidden sm:table-cell w-32 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
                onClick={() => handleSort('user')}
              >
                <div className="flex items-center space-x-1">
                  <span>User</span>
                  {getSortIcon('user')}
                </div>
              </th>
              {/* Message Column - Always visible */}
              <th className="w-48 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
                Message
              </th>
              {/* Status Column - Always visible */}
              <th
                className="w-24 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>
              {/* Created Date Column - Hidden on extra small screens */}
              <th
                className="hidden xs:table-cell w-24 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Created</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              {/* Updated Date Column - Hidden on mobile and tablet */}
              <th
                className="hidden lg:table-cell w-24 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
                onClick={() => handleSort('updatedAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Updated</span>
                  {getSortIcon('updatedAt')}
                </div>
              </th>
              {/* Actions Column - Always visible */}
              <th className="w-32 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="theme-table-row-bg theme-table-divide">
            {loading ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${NOTIFICATION_TABLE_COLUMNS.ID.width}`}>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${NOTIFICATION_TABLE_COLUMNS.USER.width}`}>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className={`px-4 py-4 text-sm text-gray-900 text-left ${NOTIFICATION_TABLE_COLUMNS.MESSAGE.width}`}>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${NOTIFICATION_TABLE_COLUMNS.STATUS.width}`}>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${NOTIFICATION_TABLE_COLUMNS.CREATED.width}`}>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${NOTIFICATION_TABLE_COLUMNS.UPDATED.width}`}>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-left ${NOTIFICATION_TABLE_COLUMNS.ACTIONS.width}`}>
                    <div className="flex space-x-2">
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : notifications.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center theme-table-text-secondary">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 theme-table-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z" />
                    </svg>
                    <p className="text-lg font-medium theme-table-text-primary mb-1">No notifications found</p>
                    <p className="theme-table-text-secondary">Try adjusting your search criteria or create a new notification.</p>
                  </div>
                </td>
              </tr>
            ) : (
              notifications.map((notification) => (
                <tr key={notification.id} className="table-row-hover">
                  {/* ID Column - Hidden on mobile */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left">
                    {notification.id}
                  </td>

                  {/* User Column - Hidden on small screens */}
                  <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left">
                    <div className="flex items-center space-x-2">
                      <FaEnvelope className="theme-table-text-muted" />
                      <span>{notification.user.firstName} {notification.user.lastName}</span>
                    </div>
                  </td>

                  {/* Message Column - Always visible */}
                  <td className="px-4 py-4 text-sm theme-table-text-primary text-left">
                    <p className="truncate" title={notification.message}>
                      {notification.message}
                    </p>
                  </td>

                  {/* Status Column - Always visible */}
                  <td className="px-4 py-4 whitespace-nowrap text-left">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${NOTIFICATION_STATUS_BADGES[notification.isRead ? 'read' : 'unread']}`}>
                      {notification.isRead ? 'Read' : 'Unread'}
                    </span>
                  </td>

                  {/* Created Date Column - Hidden on extra small screens */}
                  <td className="hidden xs:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-secondary text-left">
                    {formatDate(notification.createdAt)}
                  </td>

                  {/* Updated Date Column - Hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-secondary text-left">
                    {formatDate(notification.updatedAt)}
                  </td>

                  {/* Actions Column - Always visible */}
                  <td className="px-4 py-4 whitespace-nowrap text-left">
                    <div className="flex justify-start space-x-2">
                      <button
                        onClick={() => onEdit(notification)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                        title="Edit notification"
                      >
                        <FaEdit className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      {notification.isRead ? (
                        <button
                          onClick={() => onMarkUnread(notification)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-150"
                          title="Mark as unread"
                        >
                          <FaEnvelope className="w-3 h-3 mr-1" />
                          Unread
                        </button>
                      ) : (
                        <button
                          onClick={() => onMarkRead(notification)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
                          title="Mark as read"
                        >
                          <FaCheck className="w-3 h-3 mr-1" />
                          Read
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(notification)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                        title="Delete notification"
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
      <div className="bg-white px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between theme-border-medium">
        {/* Mobile pagination - show on small screens */}
        <div className="flex-1 flex justify-between sm:hidden">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange(paginationInfo.currentPage - 1)}
              disabled={!paginationInfo.hasPreviousPage || loading}
              className="px-2 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden xs:inline">Previous</span>
            </button>
            <span className="px-2 py-1.5 text-xs text-gray-700 bg-gray-50 border border-gray-300 rounded">
              {paginationInfo.currentPage} / {paginationInfo.totalPages}
            </span>
            <button
              onClick={() => onPageChange(paginationInfo.currentPage + 1)}
              disabled={!paginationInfo.hasNextPage || loading}
              className="px-2 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
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
            <p className="text-xs lg:text-sm text-gray-600">
              <span className="hidden md:inline">Showing </span>
              <span className="font-medium">{paginationInfo.totalCount === 0 ? 0 : (paginationInfo.currentPage - 1) * pageSize + 1}</span>
              <span className="hidden md:inline"> to </span>
              <span className="md:hidden">-</span>
              <span className="font-medium">{Math.min(paginationInfo.currentPage * pageSize, paginationInfo.totalCount)}</span>
              <span className="hidden md:inline"> of </span>
              <span className="md:hidden">/</span>
              <span className="font-medium">{paginationInfo.totalCount}</span>
            </p>

            {/* Page size selector */}
            <div className="flex items-center space-x-1">
              <span className="text-xs lg:text-sm text-gray-600">Show</span>
              <select
                id="page-size"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                disabled={loading}
                className="px-2 py-1 text-xs lg:text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="text-xs lg:text-sm text-gray-600">entries</span>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center space-x-1">
            {/* First page button - hidden on small screens */}
            <button
              onClick={() => onPageChange(1)}
              disabled={paginationInfo.currentPage === 1 || loading}
              className="hidden md:flex px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors items-center space-x-1"
              title="Go to first page"
            >
              <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              <span className="hidden lg:inline">First</span>
            </button>

            {/* Previous button */}
            <button
              onClick={() => onPageChange(paginationInfo.currentPage - 1)}
              disabled={!paginationInfo.hasPreviousPage || loading}
              className="px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              title="Go to previous page"
            >
              <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden lg:inline">Previous</span>
            </button>

            {/* Page numbers - responsive spacing */}
            <div className="flex items-center space-x-1 mx-1 lg:mx-2">
              {Array.from({ length: Math.min(3, paginationInfo.totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(paginationInfo.totalPages - 2, paginationInfo.currentPage - 1)) + i;
                if (pageNum > paginationInfo.totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    disabled={loading}
                    className={`px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-lg transition-colors min-w-[2rem] lg:min-w-[2.5rem] ${pageNum === paginationInfo.currentPage
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'theme-table-text-primary bg-white theme-border hover:bg-gray-50 hover:border-purple-300'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={`Go to page ${pageNum}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <button
              onClick={() => onPageChange(paginationInfo.currentPage + 1)}
              disabled={!paginationInfo.hasNextPage || loading}
              className="px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              title="Go to next page"
            >
              <span className="hidden lg:inline">Next</span>
              <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Last page button - hidden on small screens */}
            <button
              onClick={() => onPageChange(paginationInfo.totalPages)}
              disabled={paginationInfo.currentPage === paginationInfo.totalPages || loading}
              className="hidden md:flex px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors items-center space-x-1"
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

export default NotificationsTable;
