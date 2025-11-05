/**
 * Individual notification mutation handlers
 * Handles mark as read/unread and delete operations for single notifications
 */

import { useCallback } from 'react';
import { Notification } from '../../../../types/notificationManagement';
import {
  MarkNotificationReadMutationVariables,
  MarkNotificationUnreadMutationVariables,
  DeleteNotificationMutationVariables
} from '../../../../services/graphql/notificationQueries';

/**
 * Dependencies for individual notification handlers
 */
export interface IndividualHandlersDependencies {
  markAsReadMutation: (options: { variables: MarkNotificationReadMutationVariables }) => Promise<any>;
  markAsUnreadMutation: (options: { variables: MarkNotificationUnreadMutationVariables }) => Promise<any>;
  deleteNotificationMutation: (options: { variables: DeleteNotificationMutationVariables }) => Promise<any>;
  addProcessing: (notificationId: string) => void;
  removeProcessing: (notificationId: string) => void;
  debouncedRefetch: () => void;
  processingNotificationsRef: React.MutableRefObject<Set<string>>;
}

/**
 * Handle marking a notification as read
 */
export const useMarkAsReadHandler = (deps: IndividualHandlersDependencies) => {
  const { markAsReadMutation, addProcessing, removeProcessing, debouncedRefetch, processingNotificationsRef } = deps;

  return useCallback(async (notification: Notification): Promise<void> => {
    // Prevent duplicate mutations using ref for immediate synchronous check
    if (processingNotificationsRef.current.has(notification.id)) {
      return;
    }

    addProcessing(notification.id);
    try {
      await markAsReadMutation({
        variables: { id: notification.id } as MarkNotificationReadMutationVariables
      });
      debouncedRefetch();
    } catch (error) {
      // Error handling - refetch to ensure UI is in sync
      debouncedRefetch();
    } finally {
      removeProcessing(notification.id);
    }
  }, [markAsReadMutation, addProcessing, removeProcessing, debouncedRefetch, processingNotificationsRef]);
};

/**
 * Handle marking a notification as unread
 */
export const useMarkAsUnreadHandler = (deps: IndividualHandlersDependencies) => {
  const { markAsUnreadMutation, addProcessing, removeProcessing, debouncedRefetch, processingNotificationsRef } = deps;

  return useCallback(async (notification: Notification): Promise<void> => {
    // Prevent duplicate mutations using ref for immediate synchronous check
    if (processingNotificationsRef.current.has(notification.id)) {
      return;
    }

    addProcessing(notification.id);
    try {
      await markAsUnreadMutation({
        variables: { id: notification.id } as MarkNotificationUnreadMutationVariables
      });
      debouncedRefetch();
    } catch (error) {
      // Error handling - refetch to ensure UI is in sync
      debouncedRefetch();
    } finally {
      removeProcessing(notification.id);
    }
  }, [markAsUnreadMutation, addProcessing, removeProcessing, debouncedRefetch, processingNotificationsRef]);
};

/**
 * Handle deleting a single notification
 */
export const useDeleteNotificationHandler = (deps: IndividualHandlersDependencies) => {
  const { deleteNotificationMutation, addProcessing, removeProcessing, debouncedRefetch, processingNotificationsRef } = deps;

  return useCallback(async (notification: Notification): Promise<void> => {
    // Prevent duplicate mutations using ref for immediate synchronous check
    if (processingNotificationsRef.current.has(notification.id)) {
      return;
    }

    addProcessing(notification.id);
    try {
      await deleteNotificationMutation({
        variables: { id: notification.id } as DeleteNotificationMutationVariables
      });
      debouncedRefetch();
    } catch (error) {
      // Error handling - refetch to ensure UI is in sync
      debouncedRefetch();
    } finally {
      removeProcessing(notification.id);
    }
  }, [deleteNotificationMutation, addProcessing, removeProcessing, debouncedRefetch, processingNotificationsRef]);
};

