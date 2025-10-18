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
  // Fetch user's notifications when drawer is opened
  const { data, loading, error, refetch } = useQuery<GetUserUnreadNotificationsQueryResponse>(
    GET_USER_UNREAD_NOTIFICATIONS_QUERY,
    {
      variables: { limit: 50 },
      skip: !isOpen,
      errorPolicy: 'all'
    }
  );


  // Mutation to mark notification as read
  const [markAsRead] = useMutation(MARK_NOTIFICATION_READ_MUTATION);

  // Refetch notifications when drawer opens for immediate updates
  React.useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

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

  // Get all notifications (both read and unread) for better UX
  const allNotifications = data?.dashboardNotifications?.notifications || [];

  // Separate read and unread notifications for display
  const unreadNotifications = allNotifications.filter(notification => !notification.isRead);
  const readNotifications = allNotifications.filter(notification => notification.isRead);

  // Show unread first, then read notifications
  const notifications = [...unreadNotifications, ...readNotifications];

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
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
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
        {unreadNotifications.length > 0 && (
          <div className="p-4 border-b border-gray-200 bg-blue-50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700 font-medium">
                {unreadNotifications.length} unread notification{unreadNotifications.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Mark all as read
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {loading ? (
            // Loading state
            <div className="p-4">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-gray-200 rounded"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : notifications.length === 0 ? (
            // Empty state
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <FaBell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-500">You're all caught up!</p>
              </div>
            </div>
          ) : (
            // Notifications list
            <div className="p-4">
              {/* Unread notifications section */}
              {unreadNotifications.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-blue-700 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Unread ({unreadNotifications.length})
                  </h3>
                  <div className="space-y-3">
                    {unreadNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 rounded-lg border border-blue-200 bg-blue-50 shadow-sm transition-all duration-200 hover:shadow-md"
                      >
                        <div className="flex items-start space-x-3">
                          {/* Checkbox for mark as read */}
                          <div className="flex-shrink-0 pt-1">
                            <button
                              onClick={() => handleMarkAsRead(notification)}
                              className="w-5 h-5 rounded border-2 border-gray-300 bg-white hover:border-green-400 hover:bg-green-50 flex items-center justify-center transition-all duration-200"
                              title="Mark as read"
                            >
                            </button>
                          </div>

                          {/* Notification content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 font-medium mb-2">
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Read notifications section */}
              {readNotifications.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    Read ({readNotifications.length})
                  </h3>
                  <div className="space-y-3">
                    {readNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:bg-gray-100"
                      >
                        <div className="flex items-start space-x-3">
                          {/* Checkbox for mark as read */}
                          <div className="flex-shrink-0 pt-1">
                            <button
                              onClick={() => handleMarkAsRead(notification)}
                              className="w-5 h-5 rounded border-2 border-green-300 bg-green-100 text-green-600 flex items-center justify-center transition-all duration-200"
                              title="Mark as unread"
                            >
                              <FaCheck className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Notification content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 mb-2">
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDrawer;
