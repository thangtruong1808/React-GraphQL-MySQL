import React from 'react';
import { getDbField } from './utils';
import NotificationTableHeader from './NotificationTableHeader';
import NotificationTableStaticHeader from './NotificationTableStaticHeader';
import NotificationTableRow from './NotificationTableRow';
import NotificationLoadingRows from './NotificationLoadingRows';
import NotificationEmptyState from './NotificationEmptyState';
import NotificationTablePagination from './NotificationTablePagination';
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
  // Handle sort click
  const handleSort = (column: string) => {
    const dbField = getDbField(column);
    let newSortOrder = 'ASC';

    if (currentSortBy === dbField) {
      // If already sorting by this field, toggle order
      newSortOrder = currentSortOrder === 'ASC' ? 'DESC' : 'ASC';
    }

    onSort(dbField, newSortOrder);
  };

  // Render loading state with empty notifications
  if (loading && notifications.length === 0) {
    return (
      <div
        className="rounded-lg shadow overflow-hidden"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)',
          borderStyle: 'solid',
          borderWidth: 1,
          overflow: 'hidden'
        }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full theme-table-divide table-fixed">
            <NotificationTableStaticHeader />
            <tbody className="theme-table-row-bg theme-table-divide">
              <NotificationLoadingRows />
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div
      className="shadow-sm rounded-lg theme-border"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
        borderStyle: 'solid',
        borderWidth: 1,
        overflow: 'hidden'
      }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full theme-table-divide table-fixed">
          <NotificationTableHeader
            currentSortBy={currentSortBy}
            currentSortOrder={currentSortOrder}
            onSort={handleSort}
          />
          <tbody className="theme-table-row-bg theme-table-divide">
            {loading ? (
              <NotificationLoadingRows />
            ) : notifications.length === 0 ? (
              <NotificationEmptyState />
            ) : (
              notifications.map((notification) => (
                <NotificationTableRow
                  key={notification.id}
                  notification={notification}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onMarkRead={onMarkRead}
                  onMarkUnread={onMarkUnread}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <NotificationTablePagination
        paginationInfo={paginationInfo}
        pageSize={pageSize}
        loading={loading}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default NotificationsTable;
