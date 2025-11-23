/**
 * GraphQL mutations for notification operations
 * Description: Encapsulates all useMutation hooks for notification management with authentication
 * Date: 2024-12-19
 * Author: thangtruong
 */

import { useAuthenticatedMutation } from '../../../hooks/custom/useAuthenticatedMutation';
import {
  MARK_NOTIFICATION_READ_MUTATION,
  MARK_NOTIFICATION_UNREAD_MUTATION,
  MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION,
  MARK_ALL_NOTIFICATIONS_AS_UNREAD_MUTATION,
  DELETE_NOTIFICATION_MUTATION,
  DELETE_ALL_READ_NOTIFICATIONS_MUTATION,
  DELETE_ALL_UNREAD_NOTIFICATIONS_MUTATION
} from '../../../services/graphql/notificationQueries';

/**
 * All mutation hooks for notification operations
 * Description: Provides authenticated GraphQL mutation hooks for all notification operations
 * Date: 2024-12-19
 * Author: thangtruong
 */
export const useNotificationMutationsHooks = () => {
  // Mutation to mark notification as read - uses authenticated wrapper
  const [markAsReadMutation, { loading: markAsReadLoading }] = useAuthenticatedMutation(MARK_NOTIFICATION_READ_MUTATION);

  // Mutation to mark notification as unread - uses authenticated wrapper
  const [markAsUnreadMutation, { loading: markAsUnreadLoading }] = useAuthenticatedMutation(MARK_NOTIFICATION_UNREAD_MUTATION);

  // Mutation to mark all notifications as read - uses authenticated wrapper
  const [markAllAsReadMutation, { loading: markAllAsReadLoading }] = useAuthenticatedMutation(MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION);

  // Mutation to mark all notifications as unread - uses authenticated wrapper
  const [markAllAsUnreadMutation, { loading: markAllAsUnreadLoading }] = useAuthenticatedMutation(MARK_ALL_NOTIFICATIONS_AS_UNREAD_MUTATION);

  // Mutation to delete individual notification - uses authenticated wrapper
  const [deleteNotificationMutation, { loading: deleteNotificationLoading }] = useAuthenticatedMutation(DELETE_NOTIFICATION_MUTATION);

  // Mutation to delete all read notifications - uses authenticated wrapper
  const [deleteAllReadMutation, { loading: deleteAllReadLoading }] = useAuthenticatedMutation(DELETE_ALL_READ_NOTIFICATIONS_MUTATION);

  // Mutation to delete all unread notifications - uses authenticated wrapper
  const [deleteAllUnreadMutation, { loading: deleteAllUnreadLoading }] = useAuthenticatedMutation(DELETE_ALL_UNREAD_NOTIFICATIONS_MUTATION);

  return {
    markAsReadMutation,
    markAsUnreadMutation,
    markAllAsReadMutation,
    markAllAsUnreadMutation,
    deleteNotificationMutation,
    deleteAllReadMutation,
    deleteAllUnreadMutation,
    markAsReadLoading,
    markAsUnreadLoading,
    markAllAsReadLoading,
    markAllAsUnreadLoading,
    deleteNotificationLoading,
    deleteAllReadLoading,
    deleteAllUnreadLoading
  };
};

