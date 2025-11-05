/**
 * GraphQL mutations for notification operations
 * Encapsulates all useMutation hooks
 */

import { useMutation } from '@apollo/client';
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
 */
export const useNotificationMutationsHooks = () => {
  // Mutation to mark notification as read
  const [markAsReadMutation, { loading: markAsReadLoading }] = useMutation(MARK_NOTIFICATION_READ_MUTATION);

  // Mutation to mark notification as unread
  const [markAsUnreadMutation, { loading: markAsUnreadLoading }] = useMutation(MARK_NOTIFICATION_UNREAD_MUTATION);

  // Mutation to mark all notifications as read
  const [markAllAsReadMutation, { loading: markAllAsReadLoading }] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION);

  // Mutation to mark all notifications as unread
  const [markAllAsUnreadMutation, { loading: markAllAsUnreadLoading }] = useMutation(MARK_ALL_NOTIFICATIONS_AS_UNREAD_MUTATION);

  // Mutation to delete individual notification
  const [deleteNotificationMutation, { loading: deleteNotificationLoading }] = useMutation(DELETE_NOTIFICATION_MUTATION);

  // Mutation to delete all read notifications
  const [deleteAllReadMutation, { loading: deleteAllReadLoading }] = useMutation(DELETE_ALL_READ_NOTIFICATIONS_MUTATION);

  // Mutation to delete all unread notifications
  const [deleteAllUnreadMutation, { loading: deleteAllUnreadLoading }] = useMutation(DELETE_ALL_UNREAD_NOTIFICATIONS_MUTATION);

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

