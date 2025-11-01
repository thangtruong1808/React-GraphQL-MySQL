import React from 'react';

interface NotificationDrawerActionsProps {
  unreadCount: number;
  readCount: number;
  onMarkAllAsRead: () => void;
  onMarkAllAsUnread: () => void;
  onDeleteAllUnread: () => void;
  onDeleteAllRead: () => void;
}

/**
 * Notification Drawer Actions Component
 * Displays bulk action buttons for notifications
 */
const NotificationDrawerActions: React.FC<NotificationDrawerActionsProps> = ({
  unreadCount,
  readCount,
  onMarkAllAsRead,
  onMarkAllAsUnread,
  onDeleteAllUnread,
  onDeleteAllRead
}) => {
  // Handle mark all as read click
  const handleMarkAllAsRead = () => {
    onMarkAllAsRead();
  };

  // Handle mark all as unread click
  const handleMarkAllAsUnread = () => {
    onMarkAllAsUnread();
  };

  // Handle delete all unread click
  const handleDeleteAllUnread = () => {
    onDeleteAllUnread();
  };

  // Handle delete all read click
  const handleDeleteAllRead = () => {
    onDeleteAllRead();
  };

  return (
    <div className="p-4 theme-notification-drawer-border border-b theme-notification-drawer-header-bg">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {unreadCount} unread, {readCount} read
          </span>
        </div>
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              Mark all as read
            </button>
          )}
          {readCount > 0 && (
            <button
              onClick={handleMarkAllAsUnread}
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              Mark all as unread
            </button>
          )}
          {unreadCount > 0 && (
            <button
              onClick={handleDeleteAllUnread}
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              Delete all unread
            </button>
          )}
          {readCount > 0 && (
            <button
              onClick={handleDeleteAllRead}
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              Delete all read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawerActions;

