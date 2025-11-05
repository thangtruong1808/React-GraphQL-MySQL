import { gql } from '@apollo/client';
import { NOTIFICATION_FRAGMENT } from './fragments';

/**
 * GraphQL Mutations for Notification Management
 * Provides CRUD operations and status updates for notifications
 */

/**
 * Mutation to create a new notification
 * Creates a notification for a user
 */
export const CREATE_NOTIFICATION_MUTATION = gql`
  ${NOTIFICATION_FRAGMENT}
  mutation CreateNotification($input: NotificationInput!) {
    createNotification(input: $input) {
      ...NotificationFragment
    }
  }
`;

/**
 * Mutation to update an existing notification
 * Updates notification message and read status
 */
export const UPDATE_NOTIFICATION_MUTATION = gql`
  ${NOTIFICATION_FRAGMENT}
  mutation UpdateNotification($id: ID!, $input: NotificationUpdateInput!) {
    updateNotification(id: $id, input: $input) {
      ...NotificationFragment
    }
  }
`;

/**
 * Mutation to delete a notification
 * Removes a notification
 */
export const DELETE_NOTIFICATION_MUTATION = gql`
  mutation DeleteNotification($id: ID!) {
    deleteNotification(id: $id)
  }
`;

/**
 * Mutation to mark notification as read
 * Marks a single notification as read
 */
export const MARK_NOTIFICATION_READ_MUTATION = gql`
  ${NOTIFICATION_FRAGMENT}
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) {
      ...NotificationFragment
    }
  }
`;

/**
 * Mutation to mark notification as unread
 * Marks a single notification as unread
 */
export const MARK_NOTIFICATION_UNREAD_MUTATION = gql`
  ${NOTIFICATION_FRAGMENT}
  mutation MarkNotificationUnread($id: ID!) {
    markNotificationUnread(id: $id) {
      ...NotificationFragment
    }
  }
`;

/**
 * Mutation to mark all notifications as read
 * Marks all user notifications as read
 */
export const MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead {
      success
      updatedCount
    }
  }
`;

/**
 * Mutation to mark all notifications as unread
 * Marks all user notifications as unread
 */
export const MARK_ALL_NOTIFICATIONS_AS_UNREAD_MUTATION = gql`
  mutation MarkAllNotificationsAsUnread {
    markAllNotificationsAsUnread {
      success
      updatedCount
    }
  }
`;

/**
 * Mutation to delete all read notifications
 * Removes all read notifications for the user
 */
export const DELETE_ALL_READ_NOTIFICATIONS_MUTATION = gql`
  mutation DeleteAllReadNotifications {
    deleteAllReadNotifications {
      success
      deletedCount
    }
  }
`;

/**
 * Mutation to delete all unread notifications
 * Removes all unread notifications for the user
 */
export const DELETE_ALL_UNREAD_NOTIFICATIONS_MUTATION = gql`
  mutation DeleteAllUnreadNotifications {
    deleteAllUnreadNotifications {
      success
      deletedCount
    }
  }
`;

