import React from 'react';
import { Notification } from '../../types/notificationManagement';
import NotificationLoadingState from './NotificationLoadingState';
import NotificationEmptyState from './NotificationEmptyState';
import NotificationSection from './NotificationSection';
import NotificationItem from './NotificationItem';

interface NotificationDrawerContentProps {
  loading: boolean;
  unreadNotifications: Notification[];
  readNotifications: Notification[];
  onMarkAsRead: (notification: Notification) => void;
  onMarkAsUnread: (notification: Notification) => void;
  onDelete: (notification: Notification) => void;
}

/**
 * Notification Drawer Content Component
 * Displays notifications list with loading and empty states
 */
const NotificationDrawerContent: React.FC<NotificationDrawerContentProps> = ({
  loading,
  unreadNotifications,
  readNotifications,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete
}) => {
  const allNotifications = [...unreadNotifications, ...readNotifications];

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {loading ? (
        <NotificationLoadingState />
      ) : allNotifications.length === 0 ? (
        <NotificationEmptyState />
      ) : (
        <div className="p-4">
          {/* Unread notifications section */}
          {unreadNotifications.length > 0 && (
            <div className="mb-6">
              <NotificationSection title="Unread" count={unreadNotifications.length} isUnread={true} />
              <div className="space-y-3">
                {unreadNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    isRead={false}
                    onMarkAsRead={onMarkAsRead}
                    onMarkAsUnread={onMarkAsUnread}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Read notifications section */}
          {readNotifications.length > 0 && (
            <div>
              <NotificationSection title="Read" count={readNotifications.length} isUnread={false} />
              <div className="space-y-3">
                {readNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    isRead={true}
                    onMarkAsRead={onMarkAsRead}
                    onMarkAsUnread={onMarkAsUnread}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDrawerContent;

