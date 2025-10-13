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
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return currentSortOrder === 'ASC' ? (
      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.ID.width}`}>
                  ID
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.USER.width}`}>
                  User
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.MESSAGE.width}`}>
                  Message
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.STATUS.width}`}>
                  Status
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.CREATED.width}`}>
                  Created
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.UPDATED.width}`}>
                  Updated
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.ACTIONS.width}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {renderLoadingRows()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ${NOTIFICATION_TABLE_COLUMNS.ID.width}`}
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <span>ID</span>
                  {getSortIcon('id')}
                </div>
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${NOTIFICATION_TABLE_COLUMNS.USER.width}`}
                onClick={() => handleSort('user')}
              >
                <div className="flex items-center space-x-1">
                  <span>User</span>
                  {getSortIcon('user')}
                </div>
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.MESSAGE.width}`}>
                Message
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${NOTIFICATION_TABLE_COLUMNS.STATUS.width}`}
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${NOTIFICATION_TABLE_COLUMNS.CREATED.width}`}
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Created</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${NOTIFICATION_TABLE_COLUMNS.UPDATED.width}`}
                onClick={() => handleSort('updatedAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Updated</span>
                  {getSortIcon('updatedAt')}
                </div>
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.ACTIONS.width}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
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
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-900 mb-1">No notifications found</p>
                    <p className="text-gray-500">Try adjusting your search criteria or create a new notification.</p>
                  </div>
                </td>
              </tr>
            ) : (
              notifications.map((notification) => (
                <tr key={notification.id} className="hover:bg-gray-50 transition-colors duration-200">
                  {/* ID */}
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${NOTIFICATION_TABLE_COLUMNS.ID.width}`}>
                    {notification.id}
                  </td>

                  {/* User */}
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${NOTIFICATION_TABLE_COLUMNS.USER.width}`}>
                    <div className="flex items-center space-x-2">
                      <FaEnvelope className="text-gray-400" />
                      <span>{notification.user.firstName} {notification.user.lastName}</span>
                    </div>
                  </td>

                  {/* Message */}
                  <td className={`px-4 py-4 text-sm text-gray-900 text-left ${NOTIFICATION_TABLE_COLUMNS.MESSAGE.width}`}>
                    <p className="truncate" title={notification.message}>
                      {notification.message}
                    </p>
                  </td>

                  {/* Status */}
                  <td className={`px-4 py-4 whitespace-nowrap text-left ${NOTIFICATION_TABLE_COLUMNS.STATUS.width}`}>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${NOTIFICATION_STATUS_BADGES[notification.isRead ? 'read' : 'unread']}`}>
                      {notification.isRead ? 'Read' : 'Unread'}
                    </span>
                  </td>

                  {/* Created */}
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${NOTIFICATION_TABLE_COLUMNS.CREATED.width}`}>
                    {formatDate(notification.createdAt)}
                  </td>

                  {/* Updated */}
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${NOTIFICATION_TABLE_COLUMNS.UPDATED.width}`}>
                    {formatDate(notification.updatedAt)}
                  </td>

                  {/* Actions */}
                  <td className={`px-4 py-4 whitespace-nowrap text-left ${NOTIFICATION_TABLE_COLUMNS.ACTIONS.width}`}>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(notification)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-150"
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
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          {/* Mobile pagination */}
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(paginationInfo.currentPage - 1)}
              disabled={!paginationInfo.hasPreviousPage || loading}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>
            <button
              onClick={() => onPageChange(paginationInfo.currentPage + 1)}
              disabled={!paginationInfo.hasNextPage || loading}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
            >
              <span>Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            {/* Results info - moved to appear first */}
            <div className="text-sm text-gray-700">
              {paginationInfo.totalCount > 0 ? (
                <>
                  Showing {((paginationInfo.currentPage - 1) * pageSize) + 1} to{' '}
                  {Math.min(paginationInfo.currentPage * pageSize, paginationInfo.totalCount)} of {paginationInfo.totalCount}
                </>
              ) : (
                'Showing 0 to 0 of 0'
              )}
            </div>

            {/* Show entries dropdown */}
            <div className="flex items-center space-x-2">
              <label htmlFor="page-size" className="text-sm text-gray-700">
                Show
              </label>
              <select
                id="page-size"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="block w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                disabled={loading}
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-700">entries</span>
            </div>
          </div>

          {/* Desktop pagination */}
          <div className="flex items-center space-x-2">
            {/* First page */}
            <button
              onClick={() => onPageChange(1)}
              disabled={paginationInfo.currentPage === 1 || loading}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              title="First"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">First</span>
            </button>

            {/* Previous page */}
            <button
              onClick={() => onPageChange(paginationInfo.currentPage - 1)}
              disabled={!paginationInfo.hasPreviousPage || loading}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              title="Previous"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, paginationInfo.totalPages) }, (_, i) => {
              const startPage = Math.max(1, paginationInfo.currentPage - 2);
              const pageNumber = startPage + i;
              if (pageNumber > paginationInfo.totalPages) return null;

              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  disabled={loading}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${pageNumber === paginationInfo.currentPage
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* Next page */}
            <button
              onClick={() => onPageChange(paginationInfo.currentPage + 1)}
              disabled={!paginationInfo.hasNextPage || loading}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              title="Next"
            >
              <span className="hidden sm:inline">Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Last page */}
            <button
              onClick={() => onPageChange(paginationInfo.totalPages)}
              disabled={paginationInfo.currentPage === paginationInfo.totalPages || loading}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              title="Last"
            >
              <span className="hidden sm:inline">Last</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
