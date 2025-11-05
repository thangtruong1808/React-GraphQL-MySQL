import React from 'react';
import { FaCheck, FaTrash } from 'react-icons/fa';
import { Notification } from '../../types/notificationManagement';

interface NotificationItemProps {
  notification: Notification;
  isRead: boolean;
  onMarkAsRead: (notification: Notification) => void;
  onMarkAsUnread: (notification: Notification) => void;
  onDelete: (notification: Notification) => void;
  isProcessing: boolean;
}

/**
 * Notification Item Component
 * Displays individual notification with actions
 */
const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  isRead,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  isProcessing
}) => {
  // Handle mark as read click
  const handleMarkAsRead = () => {
    if (!isProcessing) {
      onMarkAsRead(notification);
    }
  };

  // Handle mark as unread click
  const handleMarkAsUnread = () => {
    if (!isProcessing) {
      onMarkAsUnread(notification);
    }
  };

  // Handle delete click
  const handleDelete = () => {
    if (!isProcessing) {
      onDelete(notification);
    }
  };

  return (
    <div
      className="p-4 rounded-lg transition-all duration-200 border"
      style={{
        backgroundColor: isRead ? 'var(--notification-read-bg)' : 'var(--notification-unread-bg)',
        borderColor: isRead ? 'var(--notification-read-border)' : 'var(--notification-unread-border)'
      }}
      onMouseEnter={(e) => {
        if (isRead) {
          e.currentTarget.style.backgroundColor = 'var(--notification-read-hover-bg)';
          e.currentTarget.style.borderColor = 'var(--border-medium)';
        } else {
          e.currentTarget.style.borderColor = 'var(--border-medium)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isRead ? 'var(--notification-read-bg)' : 'var(--notification-unread-bg)';
        e.currentTarget.style.borderColor = isRead ? 'var(--notification-read-border)' : 'var(--notification-unread-border)';
      }}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox for mark as read/unread */}
        <div className="flex-shrink-0 pt-1">
          <button
            onClick={isRead ? handleMarkAsUnread : handleMarkAsRead}
            disabled={isProcessing}
            className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={
              isRead
                ? { borderColor: 'var(--border-color)', backgroundColor: 'var(--badge-success-bg)', color: 'var(--badge-success-text)' }
                : { borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }
            }
            title={isRead ? 'Mark as unread' : 'Mark as read'}
          >
            {isRead && <FaCheck className="h-3 w-3" />}
          </button>
        </div>

        {/* Notification content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
            {notification.message}
          </p>
          {notification.createdAt && (
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          )}
        </div>

        {/* Delete button */}
        <div className="flex-shrink-0">
          <button
            onClick={handleDelete}
            disabled={isProcessing}
            className="w-6 h-6 rounded flex items-center justify-center transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: 'var(--notification-delete-action-text)' }}
            title="Delete notification"
          >
            <FaTrash className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;

