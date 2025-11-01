import React from 'react';
import { FaCheck, FaEnvelope, FaTrash } from 'react-icons/fa';
import { formatDate } from '../../utils/helpers/dateFormatter';
import { Notification } from '../../types/notificationManagement';

interface NotificationItemProps {
  notification: Notification;
  isRead: boolean;
  onMarkAsRead: (notification: Notification) => void;
  onMarkAsUnread: (notification: Notification) => void;
  onDelete: (notification: Notification) => void;
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
  onDelete
}) => {
  // Handle mark as read click
  const handleMarkAsRead = () => {
    onMarkAsRead(notification);
  };

  // Handle mark as unread click
  const handleMarkAsUnread = () => {
    onMarkAsUnread(notification);
  };

  // Handle delete click
  const handleDelete = () => {
    onDelete(notification);
  };

  return (
    <div
      className={`p-4 rounded-lg transition-all duration-200 ${
        isRead
          ? 'theme-notification-read-border border theme-notification-read-bg theme-notification-read-hover-bg'
          : 'theme-notification-unread-border border theme-notification-unread-bg shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox for mark as read/unread */}
        <div className="flex-shrink-0 pt-1">
          <button
            onClick={isRead ? handleMarkAsUnread : handleMarkAsRead}
            className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
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
          <p className={`text-sm mb-2 ${isRead ? '' : 'font-medium'}`} style={{ color: isRead ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
            {notification.message}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <FaEnvelope className="h-3 w-3" />
              <span>
                {notification.user.firstName} {notification.user.lastName}
              </span>
              <span>•</span>
              <span>{formatDate(notification.createdAt)}</span>
            </div>
            {/* Delete button */}
            <button
              onClick={handleDelete}
              className="p-1 rounded transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              title="Delete notification"
            >
              <FaTrash className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;

