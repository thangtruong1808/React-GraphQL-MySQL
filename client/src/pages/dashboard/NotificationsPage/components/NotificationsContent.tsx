import React from 'react';
import { NotificationSearchInput, NotificationsTable } from '../../../../components/notificationManagement';
import { NotificationsContentProps } from '../types';

/**
 * Notifications Page Content Component
 * Displays search input and notifications table
 */
export const NotificationsContent: React.FC<NotificationsContentProps> = ({
  state,
  sortBy,
  sortOrder,
  onSearch,
  onPageChange,
  onPageSizeChange,
  onSort,
  onEdit,
  onDelete,
  onMarkRead,
  onMarkUnread,
}) => {
  return (
    <div className="w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        {/* Search and Table */}
        <div className="space-y-6">
          {/* Search Input */}
          <NotificationSearchInput
            onSearch={onSearch}
            placeholder="Search notifications..."
            loading={state.loading}
          />

          {/* Notifications Table */}
          <NotificationsTable
            notifications={state.notifications}
            loading={state.loading}
            paginationInfo={state.paginationInfo}
            pageSize={state.pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            onSort={onSort}
            currentSortBy={sortBy}
            currentSortOrder={sortOrder}
            onEdit={onEdit}
            onDelete={onDelete}
            onMarkRead={onMarkRead}
            onMarkUnread={onMarkUnread}
          />
        </div>
      </div>
    </div>
  );
};

