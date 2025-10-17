import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { FaTimes, FaBell, FaCheck, FaEnvelope } from 'react-icons/fa';
import { formatDate } from '../../utils/helpers/dateFormatter';
import {
  GET_USER_UNREAD_NOTIFICATIONS_QUERY,
  MARK_NOTIFICATION_READ_MUTATION,
  GetUserUnreadNotificationsQueryResponse,
  MarkNotificationReadMutationVariables
} from '../../services/graphql/notificationQueries';
import { Notification } from '../../types/notificationManagement';

/**
 * Notification Drawer Component
 * Displays user's unread notifications in a right-side drawer
 * Allows users to mark notifications as read
 */
interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose
}) => {
  // Fetch user's notifications (will be filtered client-side for unread)
  const { data, loading, refetch } = useQuery<GetUserUnreadNotificationsQueryResponse>(
    GET_USER_UNREAD_NOTIFICATIONS_QUERY,
    {
      variables: { limit: 20 },
      skip: !isOpen,
      errorPolicy: 'all'
    }
  );

  // Mutation to mark notification as read
  const [markAsRead] = useMutation(MARK_NOTIFICATION_READ_MUTATION);

  /**
   * Handle marking a notification as read
   * Updates the notification status and refetches the list
   */
  const handleMarkAsRead = async (notification: Notification) => {
    try {
      await markAsRead({
        variables: { id: notification.id } as MarkNotificationReadMutationVariables
      });
      // Refetch to update the list
      refetch();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  /**
   * Handle marking all notifications as read
   * Marks all visible notifications as read
   */
  const handleMarkAllAsRead = async () => {
    if (!data?.userUnreadNotifications) return;

    try {
      await Promise.all(
        data.userUnreadNotifications.map(notification =>
          markAsRead({
            variables: { id: notification.id } as MarkNotificationReadMutationVariables
          })
        )
      );
      // Refetch to update the list
      refetch();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Filter unread notifications from the dashboard notifications
  const notifications = data?.dashboardNotifications?.notifications?.filter(
    (notification) => !notification.isRead
  ) || [];

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
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <FaBell className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Close notifications"
          >
            <FaTimes className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            // Loading state
            <div className="p-4">
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : notifications.length === 0 ? (
            // Empty state
            <div className="p-8 text-center">
              <FaBell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up!</p>
            </div>
          ) : (
            // Notifications list
            <div className="p-4">
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 mb-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <FaEnvelope className="h-3 w-3" />
                          <span>
                            {notification.user.firstName} {notification.user.lastName}
                          </span>
                          <span>•</span>
                          <span>{formatDate(notification.createdAt)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleMarkAsRead(notification)}
                        className="ml-2 p-1 hover:bg-white rounded transition-colors"
                        title="Mark as read"
                      >
                        <FaCheck className="h-3 w-3 text-green-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDrawer;
