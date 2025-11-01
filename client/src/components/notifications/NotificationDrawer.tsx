import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_UNREAD_NOTIFICATIONS_QUERY, GetUserUnreadNotificationsQueryResponse } from '../../services/graphql/notificationQueries';
import NotificationDrawerHeader from './NotificationDrawerHeader';
import NotificationDrawerActions from './NotificationDrawerActions';
import NotificationDrawerContent from './NotificationDrawerContent';
import { useNotificationMutations } from './useNotificationMutations';

/**
 * Notification Drawer Component
 * Displays user's notifications in a right-side drawer
 * Allows users to manage notifications (mark as read/unread, delete)
 */
interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  // Fetch user's notifications when drawer is opened
  const { data, loading, refetch } = useQuery<GetUserUnreadNotificationsQueryResponse>(
    GET_USER_UNREAD_NOTIFICATIONS_QUERY,
    {
      variables: { limit: 100 },
      skip: !isOpen,
      errorPolicy: 'all'
    }
  );

  // Get all mutation handlers from custom hook
  const {
    markAsRead,
    markAsUnread,
    markAllAsRead,
    markAllAsUnread,
    deleteNotification,
    deleteAllRead,
    deleteAllUnread
  } = useNotificationMutations(refetch);

  // Refetch notifications when drawer opens for immediate updates
  React.useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  // Get all notifications (both read and unread) for better UX
  const allNotifications = data?.dashboardNotifications?.notifications || [];

  // Separate read and unread notifications for display
  const unreadNotifications = allNotifications.filter(notification => !notification.isRead);
  const readNotifications = allNotifications.filter(notification => notification.isRead);

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    await markAllAsRead(unreadNotifications);
  };

  // Handle mark all as unread
  const handleMarkAllAsUnread = async () => {
    await markAllAsUnread(readNotifications);
  };

  // Handle delete all unread
  const handleDeleteAllUnread = async () => {
    await deleteAllUnread(unreadNotifications);
  };

  // Handle delete all read
  const handleDeleteAllRead = async () => {
    await deleteAllRead(readNotifications);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-96 theme-notification-drawer-bg shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <NotificationDrawerHeader onClose={onClose} />

        <NotificationDrawerActions
          unreadCount={unreadNotifications.length}
          readCount={readNotifications.length}
          onMarkAllAsRead={handleMarkAllAsRead}
          onMarkAllAsUnread={handleMarkAllAsUnread}
          onDeleteAllUnread={handleDeleteAllUnread}
          onDeleteAllRead={handleDeleteAllRead}
        />

        <NotificationDrawerContent
          loading={loading}
          unreadNotifications={unreadNotifications}
          readNotifications={readNotifications}
          onMarkAsRead={markAsRead}
          onMarkAsUnread={markAsUnread}
          onDelete={deleteNotification}
        />
      </div>
    </>
  );
};

export default NotificationDrawer;
