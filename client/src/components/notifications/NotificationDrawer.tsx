import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { FaTimes, FaBell, FaCheck, FaEnvelope, FaTrash } from 'react-icons/fa';
import { formatDate } from '../../utils/helpers/dateFormatter';
import {
  GET_USER_UNREAD_NOTIFICATIONS_QUERY,
  MARK_NOTIFICATION_READ_MUTATION,
  MARK_NOTIFICATION_UNREAD_MUTATION,
  MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION,
  MARK_ALL_NOTIFICATIONS_AS_UNREAD_MUTATION,
  DELETE_NOTIFICATION_MUTATION,
  DELETE_ALL_READ_NOTIFICATIONS_MUTATION,
  DELETE_ALL_UNREAD_NOTIFICATIONS_MUTATION,
  GetUserUnreadNotificationsQueryResponse,
  MarkNotificationReadMutationVariables,
  MarkNotificationUnreadMutationVariables,
  DeleteNotificationMutationVariables
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
      variables: { limit: 100 },
      skip: !isOpen,
      errorPolicy: 'all'
    }
  );


  // Mutation to mark notification as read
  const [markAsRead] = useMutation(MARK_NOTIFICATION_READ_MUTATION);

  // Mutation to mark notification as unread
  const [markAsUnread] = useMutation(MARK_NOTIFICATION_UNREAD_MUTATION);

  // Mutation to mark all notifications as read
  const [markAllAsRead] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION);

  // Mutation to mark all notifications as unread
  const [markAllAsUnread] = useMutation(MARK_ALL_NOTIFICATIONS_AS_UNREAD_MUTATION);

  // Mutation to delete individual notification
  const [deleteNotification] = useMutation(DELETE_NOTIFICATION_MUTATION);

  // Mutation to delete all read notifications
  const [deleteAllRead] = useMutation(DELETE_ALL_READ_NOTIFICATIONS_MUTATION);

  // Mutation to delete all unread notifications
  const [deleteAllUnread] = useMutation(DELETE_ALL_UNREAD_NOTIFICATIONS_MUTATION);

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
      // Error handling without console.log for production
    }
  };

  /**
   * Handle marking a notification as unread
   * Updates the notification status and refetches the list
   */
  const handleMarkAsUnread = async (notification: Notification) => {
    try {
      await markAsUnread({
        variables: { id: notification.id } as MarkNotificationUnreadMutationVariables
      });
      // Refetch to update the list
      refetch();
    } catch (error) {
      // Error handling without console.log for production
    }
  };

  /**
   * Handle marking all notifications as read
   * Uses efficient bulk update mutation
   */
  const handleMarkAllAsRead = async () => {
    const unreadNotifications = data?.dashboardNotifications?.notifications?.filter(notification => !notification.isRead) || [];

    if (unreadNotifications.length === 0) return;

    try {
      const result = await markAllAsRead();

      // Check if the mutation was successful
      if (result.data?.markAllNotificationsAsRead?.success) {
        // Refetch to update the list
        refetch();
      }
    } catch (error) {
      // Error handling without console.log for production
      // If bulk update fails, fallback to individual updates
      try {
        await Promise.all(
          unreadNotifications.map(notification =>
            markAsRead({
              variables: { id: notification.id } as MarkNotificationReadMutationVariables
            })
          )
        );
        refetch();
      } catch (fallbackError) {
        // Error handling without console.log for production
      }
    }
  };

  /**
   * Handle marking all notifications as unread
   * Uses efficient bulk update mutation
   */
  const handleMarkAllAsUnread = async () => {
    const readNotifications = data?.dashboardNotifications?.notifications?.filter(notification => notification.isRead) || [];

    if (readNotifications.length === 0) return;

    try {
      const result = await markAllAsUnread();

      // Check if the mutation was successful
      if (result.data?.markAllNotificationsAsUnread?.success) {
        // Refetch to update the list
        refetch();
      }
    } catch (error) {
      // Error handling without console.log for production
      // If bulk update fails, fallback to individual updates
      try {
        await Promise.all(
          readNotifications.map(notification =>
            markAsUnread({
              variables: { id: notification.id } as MarkNotificationUnreadMutationVariables
            })
          )
        );
        refetch();
      } catch (fallbackError) {
        // Error handling without console.log for production
      }
    }
  };

  /**
   * Handle deleting a single notification
   * Removes the notification and refetches the list
   */
  const handleDeleteNotification = async (notification: Notification) => {
    try {
      await deleteNotification({
        variables: { id: notification.id } as DeleteNotificationMutationVariables
      });
      // Refetch to update the list
      refetch();
    } catch (error) {
      // Error handling without console.log for production
    }
  };

  /**
   * Handle deleting all read notifications
   * Uses efficient bulk delete mutation
   */
  const handleDeleteAllRead = async () => {
    const readNotifications = data?.dashboardNotifications?.notifications?.filter(notification => notification.isRead) || [];

    if (readNotifications.length === 0) return;

    try {
      const result = await deleteAllRead();

      // Check if the mutation was successful
      if (result.data?.deleteAllReadNotifications?.success) {
        // Refetch to update the list
        refetch();
      }
    } catch (error) {
      // Error handling without console.log for production
      // If bulk delete fails, fallback to individual deletes
      try {
        await Promise.all(
          readNotifications.map(notification =>
            deleteNotification({
              variables: { id: notification.id } as DeleteNotificationMutationVariables
            })
          )
        );
        refetch();
      } catch (fallbackError) {
        // Error handling without console.log for production
      }
    }
  };

  /**
   * Handle deleting all unread notifications
   * Uses efficient bulk delete mutation
   */
  const handleDeleteAllUnread = async () => {
    const unreadNotifications = data?.dashboardNotifications?.notifications?.filter(notification => !notification.isRead) || [];

    if (unreadNotifications.length === 0) return;

    try {
      const result = await deleteAllUnread();

      // Check if the mutation was successful
      if (result.data?.deleteAllUnreadNotifications?.success) {
        // Refetch to update the list
        refetch();
      }
    } catch (error) {
      // Error handling without console.log for production
      // If bulk delete fails, fallback to individual deletes
      try {
        await Promise.all(
          unreadNotifications.map(notification =>
            deleteNotification({
              variables: { id: notification.id } as DeleteNotificationMutationVariables
            })
          )
        );
        refetch();
      } catch (fallbackError) {
        // Error handling without console.log for production
      }
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
        className={`fixed right-0 top-0 h-full w-96 theme-notification-drawer-bg shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 theme-notification-drawer-border border-b theme-notification-drawer-header-bg">
          <div className="flex items-center space-x-2">
            <FaBell className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold theme-notification-drawer-text">Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Close notifications"
          >
            <FaTimes className="h-4 w-4 theme-notification-drawer-text-secondary" />
          </button>
        </div>

        {/* Actions */}
        <div className="p-4 theme-notification-drawer-border border-b theme-notification-drawer-header-bg">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
              <span className="text-sm theme-notification-drawer-text-secondary font-medium">
                {unreadNotifications.length} unread, {readNotifications.length} read
              </span>
            </div>
            <div className="flex space-x-2">
              {unreadNotifications.length > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Mark all as read
                </button>
              )}
              {readNotifications.length > 0 && (
                <button
                  onClick={handleMarkAllAsUnread}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  Mark all as unread
                </button>
              )}
              {unreadNotifications.length > 0 && (
                <button
                  onClick={handleDeleteAllUnread}
                  className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Delete all unread
                </button>
              )}
              {readNotifications.length > 0 && (
                <button
                  onClick={handleDeleteAllRead}
                  className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Delete all read
                </button>
              )}
            </div>
          </div>
        </div>

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
                <FaBell className="h-16 w-16 theme-notification-drawer-text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-medium theme-notification-drawer-text mb-2">No notifications</h3>
                <p className="theme-notification-drawer-text-secondary">You're all caught up!</p>
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
                        className="p-4 rounded-lg theme-notification-unread-border border theme-notification-unread-bg shadow-sm transition-all duration-200 hover:shadow-md"
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
                            <p className="text-sm theme-notification-drawer-text font-medium mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-xs theme-notification-drawer-text-secondary">
                                <FaEnvelope className="h-3 w-3" />
                                <span>
                                  {notification.user.firstName} {notification.user.lastName}
                                </span>
                                <span>•</span>
                                <span>{formatDate(notification.createdAt)}</span>
                              </div>
                              {/* Delete button */}
                              <button
                                onClick={() => handleDeleteNotification(notification)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title="Delete notification"
                              >
                                <FaTrash className="h-3 w-3" />
                              </button>
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
                  <h3 className="text-sm font-semibold theme-notification-drawer-text-secondary mb-3 flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    Read ({readNotifications.length})
                  </h3>
                  <div className="space-y-3">
                    {readNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 rounded-lg theme-notification-read-border border theme-notification-read-bg transition-all duration-200 theme-notification-read-hover-bg"
                      >
                        <div className="flex items-start space-x-3">
                          {/* Checkbox for mark as unread */}
                          <div className="flex-shrink-0 pt-1">
                            <button
                              onClick={() => handleMarkAsUnread(notification)}
                              className="w-5 h-5 rounded border-2 border-green-300 bg-green-100 text-green-600 flex items-center justify-center transition-all duration-200 hover:border-orange-400 hover:bg-orange-50"
                              title="Mark as unread"
                            >
                              <FaCheck className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Notification content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm theme-notification-drawer-text-secondary mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-xs theme-notification-drawer-text-secondary">
                                <FaEnvelope className="h-3 w-3" />
                                <span>
                                  {notification.user.firstName} {notification.user.lastName}
                                </span>
                                <span>•</span>
                                <span>{formatDate(notification.createdAt)}</span>
                              </div>
                              {/* Delete button */}
                              <button
                                onClick={() => handleDeleteNotification(notification)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title="Delete notification"
                              >
                                <FaTrash className="h-3 w-3" />
                              </button>
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
