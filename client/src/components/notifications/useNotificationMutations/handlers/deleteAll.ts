/**
 * Delete all notifications mutation handlers
 * Handles delete all read/unread operations
 */

import { useCallback } from 'react';
import { Notification } from '../../../../types/notificationManagement';
import {
  DeleteNotificationMutationVariables
} from '../../../../services/graphql/notificationQueries';

/**
 * Dependencies for delete all handlers
 */
export interface DeleteAllHandlersDependencies {
  deleteAllReadMutation: () => Promise<any>;
  deleteAllUnreadMutation: () => Promise<any>;
  deleteNotificationMutation: (options: { variables: DeleteNotificationMutationVariables }) => Promise<any>;
  addProcessingBatch: (notificationIds: string[]) => void;
  removeProcessingBatch: (notificationIds: string[]) => void;
  debouncedRefetch: () => void;
  isBulkProcessingRef: React.MutableRefObject<boolean>;
  setIsBulkProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Handle deleting all read notifications
 */
export const useDeleteAllReadHandler = (deps: DeleteAllHandlersDependencies) => {
  const {
    deleteAllReadMutation,
    deleteNotificationMutation,
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
      const result = await deleteAllReadMutation();

      if (result.data?.deleteAllReadNotifications?.success) {
        debouncedRefetch();
      } else {
        // Fallback to individual deletes if bulk delete fails
        try {
          await Promise.all(
            readNotifications.map(notification =>
              deleteNotificationMutation({
                variables: { id: notification.id } as DeleteNotificationMutationVariables
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
      // Fallback to individual deletes if bulk delete fails
      try {
        await Promise.all(
          readNotifications.map(notification =>
            deleteNotificationMutation({
              variables: { id: notification.id } as DeleteNotificationMutationVariables
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
  }, [deleteAllReadMutation, deleteNotificationMutation, addProcessingBatch, removeProcessingBatch, debouncedRefetch, isBulkProcessingRef, setIsBulkProcessing]);
};

/**
 * Handle deleting all unread notifications
 */
export const useDeleteAllUnreadHandler = (deps: DeleteAllHandlersDependencies) => {
  const {
    deleteAllUnreadMutation,
    deleteNotificationMutation,
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
      const result = await deleteAllUnreadMutation();

      if (result.data?.deleteAllUnreadNotifications?.success) {
        debouncedRefetch();
      } else {
        // Fallback to individual deletes if bulk delete fails
        try {
          await Promise.all(
            unreadNotifications.map(notification =>
              deleteNotificationMutation({
                variables: { id: notification.id } as DeleteNotificationMutationVariables
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
      // Fallback to individual deletes if bulk delete fails
      try {
        await Promise.all(
          unreadNotifications.map(notification =>
            deleteNotificationMutation({
              variables: { id: notification.id } as DeleteNotificationMutationVariables
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
  }, [deleteAllUnreadMutation, deleteNotificationMutation, addProcessingBatch, removeProcessingBatch, debouncedRefetch, isBulkProcessingRef, setIsBulkProcessing]);
};

