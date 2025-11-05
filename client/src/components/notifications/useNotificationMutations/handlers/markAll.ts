/**
 * Mark all notifications mutation handlers
 * Handles mark all as read/unread operations
 */

import { useCallback } from 'react';
import { Notification } from '../../../../types/notificationManagement';
import {
  MarkNotificationReadMutationVariables,
  MarkNotificationUnreadMutationVariables
} from '../../../../services/graphql/notificationQueries';

/**
 * Dependencies for mark all handlers
 */
export interface MarkAllHandlersDependencies {
  markAllAsReadMutation: () => Promise<any>;
  markAllAsUnreadMutation: () => Promise<any>;
  markAsReadMutation: (options: { variables: MarkNotificationReadMutationVariables }) => Promise<any>;
  markAsUnreadMutation: (options: { variables: MarkNotificationUnreadMutationVariables }) => Promise<any>;
  addProcessingBatch: (notificationIds: string[]) => void;
  removeProcessingBatch: (notificationIds: string[]) => void;
  debouncedRefetch: () => void;
  isBulkProcessingRef: React.MutableRefObject<boolean>;
  setIsBulkProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Handle marking all notifications as read
 */
export const useMarkAllAsReadHandler = (deps: MarkAllHandlersDependencies) => {
  const {
    markAllAsReadMutation,
    markAsReadMutation,
    addProcessingBatch,
    removeProcessingBatch,
    debouncedRefetch,
    isBulkProcessingRef,
    setIsBulkProcessing
  } = deps;

  return useCallback(async (unreadNotifications: Notification[]): Promise<void> => {
    // Check ref immediately for synchronous guard against race conditions
    if (unreadNotifications.length === 0 || isBulkProcessingRef.current) {
      return;
    }

    // Set ref and state immediately to prevent race conditions
    isBulkProcessingRef.current = true;
    setIsBulkProcessing(true);
    // Add all notifications to processing set (batched update)
    addProcessingBatch(unreadNotifications.map(n => n.id));

    try {
      const result = await markAllAsReadMutation();

      if (result.data?.markAllNotificationsAsRead?.success) {
        debouncedRefetch();
      } else {
        // Fallback to individual updates if bulk update fails
        try {
          await Promise.all(
            unreadNotifications.map(notification =>
              markAsReadMutation({
                variables: { id: notification.id } as MarkNotificationReadMutationVariables
              })
            )
          );
          debouncedRefetch();
        } catch (fallbackError) {
          // Error handling - refetch to ensure UI is in sync
          debouncedRefetch();
        }
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
        debouncedRefetch();
      } catch (fallbackError) {
        // Error handling - refetch to ensure UI is in sync
        debouncedRefetch();
      }
    } finally {
      // Remove all notifications from processing set (batched update)
      removeProcessingBatch(unreadNotifications.map(n => n.id));
      isBulkProcessingRef.current = false;
      setIsBulkProcessing(false);
    }
  }, [markAllAsReadMutation, markAsReadMutation, addProcessingBatch, removeProcessingBatch, debouncedRefetch, isBulkProcessingRef, setIsBulkProcessing]);
};

/**
 * Handle marking all notifications as unread
 */
export const useMarkAllAsUnreadHandler = (deps: MarkAllHandlersDependencies) => {
  const {
    markAllAsUnreadMutation,
    markAsUnreadMutation,
    addProcessingBatch,
    removeProcessingBatch,
    debouncedRefetch,
    isBulkProcessingRef,
    setIsBulkProcessing
  } = deps;

  return useCallback(async (readNotifications: Notification[]): Promise<void> => {
    // Check ref immediately for synchronous guard against race conditions
    if (readNotifications.length === 0 || isBulkProcessingRef.current) {
      return;
    }

    // Set ref and state immediately to prevent race conditions
    isBulkProcessingRef.current = true;
    setIsBulkProcessing(true);
    // Add all notifications to processing set (batched update)
    addProcessingBatch(readNotifications.map(n => n.id));

    try {
      const result = await markAllAsUnreadMutation();

      if (result.data?.markAllNotificationsAsUnread?.success) {
        debouncedRefetch();
      } else {
        // Fallback to individual updates if bulk update fails
        try {
          await Promise.all(
            readNotifications.map(notification =>
              markAsUnreadMutation({
                variables: { id: notification.id } as MarkNotificationUnreadMutationVariables
              })
            )
          );
          debouncedRefetch();
        } catch (fallbackError) {
          // Error handling - refetch to ensure UI is in sync
          debouncedRefetch();
        }
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
        debouncedRefetch();
      } catch (fallbackError) {
        // Error handling - refetch to ensure UI is in sync
        debouncedRefetch();
      }
    } finally {
      // Remove all notifications from processing set (batched update)
      removeProcessingBatch(readNotifications.map(n => n.id));
      isBulkProcessingRef.current = false;
      setIsBulkProcessing(false);
    }
  }, [markAllAsUnreadMutation, markAsUnreadMutation, addProcessingBatch, removeProcessingBatch, debouncedRefetch, isBulkProcessingRef, setIsBulkProcessing]);
};

