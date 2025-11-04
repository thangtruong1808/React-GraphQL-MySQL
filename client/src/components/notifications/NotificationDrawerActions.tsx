import React from 'react';

interface NotificationDrawerActionsProps {
  unreadCount: number;
  readCount: number;
  onMarkAllAsRead: () => void;
  onMarkAllAsUnread: () => void;
  onDeleteAllUnread: () => void;
  onDeleteAllRead: () => void;
  isProcessingBulk: boolean;
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
  onDeleteAllRead,
  isProcessingBulk
}) => {
  // Handle mark all as read click
  const handleMarkAllAsRead = () => {
    if (!isProcessingBulk) {
      onMarkAllAsRead();
    }
  };

  // Handle mark all as unread click
  const handleMarkAllAsUnread = () => {
    if (!isProcessingBulk) {
      onMarkAllAsUnread();
    }
  };

  // Handle delete all unread click
  const handleDeleteAllUnread = () => {
    if (!isProcessingBulk) {
      onDeleteAllUnread();
    }
  };

  // Handle delete all read click
  const handleDeleteAllRead = () => {
    if (!isProcessingBulk) {
      onDeleteAllRead();
    }
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
              disabled={isProcessingBulk}
              className="text-sm font-medium px-3 py-1 rounded-md transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                color: 'var(--text-primary)',
                backgroundColor: 'var(--notification-action-button-bg)',
                borderColor: 'var(--border-color)',
                boxShadow: 'none'
              }}
              onMouseEnter={(e) => {
                if (!isProcessingBulk) {
                  e.currentTarget.style.backgroundColor = 'var(--notification-action-button-hover-bg)';
                  e.currentTarget.style.borderColor = 'var(--notification-action-button-hover-border)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--notification-action-button-bg)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Mark all as read
            </button>
          )}
          {readCount > 0 && (
            <button
              onClick={handleMarkAllAsUnread}
              disabled={isProcessingBulk}
              className="text-sm font-medium px-3 py-1 rounded-md transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                color: 'var(--text-primary)',
                backgroundColor: 'var(--notification-action-button-bg)',
                borderColor: 'var(--border-color)',
                boxShadow: 'none'
              }}
              onMouseEnter={(e) => {
                if (!isProcessingBulk) {
                  e.currentTarget.style.backgroundColor = 'var(--notification-action-button-hover-bg)';
                  e.currentTarget.style.borderColor = 'var(--notification-action-button-hover-border)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--notification-action-button-bg)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Mark all as unread
            </button>
          )}
          {unreadCount > 0 && (
            <button
              onClick={handleDeleteAllUnread}
              disabled={isProcessingBulk}
              className="text-sm font-medium px-3 py-1 rounded-md transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                color: 'var(--notification-delete-action-text)',
                backgroundColor: 'var(--notification-action-button-bg)',
                borderColor: 'var(--border-color)',
                boxShadow: 'none'
              }}
              onMouseEnter={(e) => {
                if (!isProcessingBulk) {
                  e.currentTarget.style.backgroundColor = 'var(--notification-delete-action-bg)';
                  e.currentTarget.style.color = 'var(--notification-delete-action-hover-text)';
                  e.currentTarget.style.borderColor = 'var(--notification-delete-action-bg)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--notification-action-button-bg)';
                e.currentTarget.style.color = 'var(--notification-delete-action-text)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Delete all unread
            </button>
          )}
          {readCount > 0 && (
            <button
              onClick={handleDeleteAllRead}
              disabled={isProcessingBulk}
              className="text-sm font-medium px-3 py-1 rounded-md transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                color: 'var(--notification-delete-action-text)',
                backgroundColor: 'var(--notification-action-button-bg)',
                borderColor: 'var(--border-color)',
                boxShadow: 'none'
              }}
              onMouseEnter={(e) => {
                if (!isProcessingBulk) {
                  e.currentTarget.style.backgroundColor = 'var(--notification-delete-action-bg)';
                  e.currentTarget.style.color = 'var(--notification-delete-action-hover-text)';
                  e.currentTarget.style.borderColor = 'var(--notification-delete-action-bg)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--notification-action-button-bg)';
                e.currentTarget.style.color = 'var(--notification-delete-action-text)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
              }}
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

