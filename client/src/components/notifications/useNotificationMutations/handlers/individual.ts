/**
 * Individual notification mutation handlers
 * Description: Handles mark as read/unread and delete operations for single notifications
 * Date: 2024-12-19
 * Author: thangtruong
 */

import { useCallback } from 'react';
import { Notification } from '../../../../types/notificationManagement';
import {
  MarkNotificationReadMutationVariables,
  MarkNotificationUnreadMutationVariables,
  DeleteNotificationMutationVariables
} from '../../../../services/graphql/notificationQueries';
import { useAuth } from '../../../../contexts/AuthContext';

/**
 * Dependencies for individual notification handlers
 */
export interface IndividualHandlersDependencies {
  markAsReadMutation: (variables: MarkNotificationReadMutationVariables) => Promise<any>;
  markAsUnreadMutation: (variables: MarkNotificationUnreadMutationVariables) => Promise<any>;
  deleteNotificationMutation: (variables: DeleteNotificationMutationVariables) => Promise<any>;
  addProcessing: (notificationId: string) => void;
  removeProcessing: (notificationId: string) => void;
  debouncedRefetch: () => void;
  processingNotificationsRef: React.MutableRefObject<Set<string>>;
}

/**
 * Handle marking a notification as read
 * Description: Marks a single notification as read with authentication verification
 * Date: 2024-12-19
 * Author: thangtruong
 */
export const useMarkAsReadHandler = (deps: IndividualHandlersDependencies) => {
  const { markAsReadMutation, addProcessing, removeProcessing, debouncedRefetch, processingNotificationsRef } = deps;
  const { isAuthenticated } = useAuth();

  return useCallback(async (notification: Notification): Promise<void> => {
    // Synchronous check: Verify AuthContext state first (source of truth)
    if (!isAuthenticated) {
      return;
    }

    // Prevent duplicate mutations using ref for immediate synchronous check
    if (processingNotificationsRef.current.has(notification.id)) {
      return;
    }

    // Note: useAuthenticatedMutation handles token verification internally
    addProcessing(notification.id);
    try {
      // useAuthenticatedMutation expects variables directly, not wrapped in options
      await markAsReadMutation({ id: notification.id } as MarkNotificationReadMutationVariables);
      debouncedRefetch();
    } catch (error) {
      // Error handling - refetch to ensure UI is in sync
      debouncedRefetch();
    } finally {
      removeProcessing(notification.id);
    }
  }, [markAsReadMutation, addProcessing, removeProcessing, debouncedRefetch, processingNotificationsRef, isAuthenticated]);
};

/**
 * Handle marking a notification as unread
 * Description: Marks a single notification as unread with authentication verification
 * Date: 2024-12-19
 * Author: thangtruong
 */
export const useMarkAsUnreadHandler = (deps: IndividualHandlersDependencies) => {
  const { markAsUnreadMutation, addProcessing, removeProcessing, debouncedRefetch, processingNotificationsRef } = deps;
  const { isAuthenticated } = useAuth();

  return useCallback(async (notification: Notification): Promise<void> => {
    // Synchronous check: Verify AuthContext state first (source of truth)
    if (!isAuthenticated) {
      return;
    }

    // Prevent duplicate mutations using ref for immediate synchronous check
    if (processingNotificationsRef.current.has(notification.id)) {
      return;
    }

    // Note: useAuthenticatedMutation handles token verification internally
    addProcessing(notification.id);
    try {
      // useAuthenticatedMutation expects variables directly, not wrapped in options
      await markAsUnreadMutation({ id: notification.id } as MarkNotificationUnreadMutationVariables);
      debouncedRefetch();
    } catch (error) {
      // Error handling - refetch to ensure UI is in sync
      debouncedRefetch();
    } finally {
      removeProcessing(notification.id);
    }
  }, [markAsUnreadMutation, addProcessing, removeProcessing, debouncedRefetch, processingNotificationsRef, isAuthenticated]);
};

/**
 * Handle deleting a single notification
 * Description: Deletes a single notification with authentication verification
 * Date: 2024-12-19
 * Author: thangtruong
 */
export const useDeleteNotificationHandler = (deps: IndividualHandlersDependencies) => {
  const { deleteNotificationMutation, addProcessing, removeProcessing, debouncedRefetch, processingNotificationsRef } = deps;
  const { isAuthenticated } = useAuth();

  return useCallback(async (notification: Notification): Promise<void> => {
    // Synchronous check: Verify AuthContext state first (source of truth)
    if (!isAuthenticated) {
      return;
    }

    // Prevent duplicate mutations using ref for immediate synchronous check
    if (processingNotificationsRef.current.has(notification.id)) {
      return;
    }

    // Note: useAuthenticatedMutation handles token verification internally
    addProcessing(notification.id);
    try {
      // useAuthenticatedMutation expects variables directly, not wrapped in options
      await deleteNotificationMutation({ id: notification.id } as DeleteNotificationMutationVariables);
      debouncedRefetch();
    } catch (error) {
      // Error handling - refetch to ensure UI is in sync
      debouncedRefetch();
    } finally {
      removeProcessing(notification.id);
    }
  }, [deleteNotificationMutation, addProcessing, removeProcessing, debouncedRefetch, processingNotificationsRef, isAuthenticated]);
};

