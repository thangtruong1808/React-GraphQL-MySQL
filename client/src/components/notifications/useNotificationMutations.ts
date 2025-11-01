import { useMutation } from '@apollo/client';
import {
  MARK_NOTIFICATION_READ_MUTATION,
  MARK_NOTIFICATION_UNREAD_MUTATION,
  MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION,
  MARK_ALL_NOTIFICATIONS_AS_UNREAD_MUTATION,
  DELETE_NOTIFICATION_MUTATION,
  DELETE_ALL_READ_NOTIFICATIONS_MUTATION,
  DELETE_ALL_UNREAD_NOTIFICATIONS_MUTATION,
  MarkNotificationReadMutationVariables,
  MarkNotificationUnreadMutationVariables,
  DeleteNotificationMutationVariables
} from '../../services/graphql/notificationQueries';
import { Notification } from '../../types/notificationManagement';

interface UseNotificationMutationsReturn {
  markAsRead: (notification: Notification) => Promise<void>;
  markAsUnread: (notification: Notification) => Promise<void>;
  markAllAsRead: (unreadNotifications: Notification[]) => Promise<void>;
  markAllAsUnread: (readNotifications: Notification[]) => Promise<void>;
  deleteNotification: (notification: Notification) => Promise<void>;
  deleteAllRead: (readNotifications: Notification[]) => Promise<void>;
  deleteAllUnread: (unreadNotifications: Notification[]) => Promise<void>;
  refetch: () => void;
}

/**
 * Custom hook for notification mutations
 * Provides all mutation handlers with error handling and fallback logic
 */
export const useNotificationMutations = (refetch: () => void): UseNotificationMutationsReturn => {
  // Mutation to mark notification as read
  const [markAsReadMutation] = useMutation(MARK_NOTIFICATION_READ_MUTATION);

  // Mutation to mark notification as unread
  const [markAsUnreadMutation] = useMutation(MARK_NOTIFICATION_UNREAD_MUTATION);

  // Mutation to mark all notifications as read
  const [markAllAsReadMutation] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION);

  // Mutation to mark all notifications as unread
  const [markAllAsUnreadMutation] = useMutation(MARK_ALL_NOTIFICATIONS_AS_UNREAD_MUTATION);

  // Mutation to delete individual notification
  const [deleteNotificationMutation] = useMutation(DELETE_NOTIFICATION_MUTATION);

  // Mutation to delete all read notifications
  const [deleteAllReadMutation] = useMutation(DELETE_ALL_READ_NOTIFICATIONS_MUTATION);

  // Mutation to delete all unread notifications
  const [deleteAllUnreadMutation] = useMutation(DELETE_ALL_UNREAD_NOTIFICATIONS_MUTATION);

  // Handle marking a notification as read
  const markAsRead = async (notification: Notification): Promise<void> => {
    try {
      await markAsReadMutation({
        variables: { id: notification.id } as MarkNotificationReadMutationVariables
      });
      refetch();
    } catch (error) {
      // Error handling without console.log for production
    }
  };

  // Handle marking a notification as unread
  const markAsUnread = async (notification: Notification): Promise<void> => {
    try {
      await markAsUnreadMutation({
        variables: { id: notification.id } as MarkNotificationUnreadMutationVariables
      });
      refetch();
    } catch (error) {
      // Error handling without console.log for production
    }
  };

  // Handle marking all notifications as read
  const markAllAsRead = async (unreadNotifications: Notification[]): Promise<void> => {
    if (unreadNotifications.length === 0) return;

    try {
      const result = await markAllAsReadMutation();

      if (result.data?.markAllNotificationsAsRead?.success) {
        refetch();
      }
    } catch (error) {
      // Fallback to individual updates if bulk update fails
      try {
        await Promise.all(
          unreadNotifications.map(notification =>
            markAsReadMutation({
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

  // Handle marking all notifications as unread
  const markAllAsUnread = async (readNotifications: Notification[]): Promise<void> => {
    if (readNotifications.length === 0) return;

    try {
      const result = await markAllAsUnreadMutation();

      if (result.data?.markAllNotificationsAsUnread?.success) {
        refetch();
      }
    } catch (error) {
      // Fallback to individual updates if bulk update fails
      try {
        await Promise.all(
          readNotifications.map(notification =>
            markAsUnreadMutation({
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

  // Handle deleting a single notification
  const deleteNotification = async (notification: Notification): Promise<void> => {
    try {
      await deleteNotificationMutation({
        variables: { id: notification.id } as DeleteNotificationMutationVariables
      });
      refetch();
    } catch (error) {
      // Error handling without console.log for production
    }
  };

  // Handle deleting all read notifications
  const deleteAllRead = async (readNotifications: Notification[]): Promise<void> => {
    if (readNotifications.length === 0) return;

    try {
      const result = await deleteAllReadMutation();

      if (result.data?.deleteAllReadNotifications?.success) {
        refetch();
      }
    } catch (error) {
      // Fallback to individual deletes if bulk delete fails
      try {
        await Promise.all(
          readNotifications.map(notification =>
            deleteNotificationMutation({
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

  // Handle deleting all unread notifications
  const deleteAllUnread = async (unreadNotifications: Notification[]): Promise<void> => {
    if (unreadNotifications.length === 0) return;

    try {
      const result = await deleteAllUnreadMutation();

      if (result.data?.deleteAllUnreadNotifications?.success) {
        refetch();
      }
    } catch (error) {
      // Fallback to individual deletes if bulk delete fails
      try {
        await Promise.all(
          unreadNotifications.map(notification =>
            deleteNotificationMutation({
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

  return {
    markAsRead,
    markAsUnread,
    markAllAsRead,
    markAllAsUnread,
    deleteNotification,
    deleteAllRead,
    deleteAllUnread,
    refetch
  };
};

