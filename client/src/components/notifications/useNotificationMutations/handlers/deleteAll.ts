/**
 * Delete all notifications mutation handlers
 * Description: Handles delete all read/unread operations with proper async/await
 * Date: 2024-12-19
 * Author: thangtruong
 */

import { useCallback } from 'react';
import { Notification } from '../../../../types/notificationManagement';
import {
  DeleteNotificationMutationVariables
} from '../../../../services/graphql/notificationQueries';
import { useAuth } from '../../../../contexts/AuthContext';
import { refreshTokenAutomatically, ensureTokensReady } from '../../../../services/graphql/apollo-client/tokens';

/**
 * Dependencies for delete all handlers
 */
export interface DeleteAllHandlersDependencies {
  deleteAllReadMutation: (variables?: any) => Promise<any>;
  deleteAllUnreadMutation: (variables?: any) => Promise<any>;
  deleteNotificationMutation: (variables: DeleteNotificationMutationVariables) => Promise<any>;
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
  const { isAuthenticated } = useAuth();

  return useCallback(async (readNotifications: Notification[]): Promise<void> => {
    // Synchronous check: Verify AuthContext state first (source of truth)
    if (!isAuthenticated) {
      return;
    }

    // Check ref immediately for synchronous guard against race conditions
    if (readNotifications.length === 0 || isBulkProcessingRef.current) {
      return;
    }

    // Set ref and state immediately to prevent race conditions
    // Note: useAuthenticatedMutation handles token verification internally
    isBulkProcessingRef.current = true;
    setIsBulkProcessing(true);
    // Add all notifications to processing set (batched update)
    addProcessingBatch(readNotifications.map(n => n.id));

    try {
      // Execute bulk mutation with proper async/await
      // useAuthenticatedMutation expects variables directly, not wrapped in options
      const result = await deleteAllReadMutation({});

      if (result.data?.deleteAllReadNotifications?.success) {
        // Proactively refresh tokens after bulk operation to ensure they're fresh for subsequent mutations
        // This prevents race conditions where tokens expire or become invalid after bulk operations
        try {
          await refreshTokenAutomatically();
          // Wait for tokens to be fully available after refresh
          await ensureTokensReady(10);
        } catch (refreshError) {
          // Token refresh failed - tokens might still be valid, continue anyway
        }
        // Additional delay to ensure tokens are fully persisted and available
        await new Promise(resolve => setTimeout(resolve, 300));
        debouncedRefetch();
      } else {
        // Fallback to individual deletes if bulk delete fails
        try {
          await Promise.all(
            readNotifications.map(notification =>
              deleteNotificationMutation({ id: notification.id } as DeleteNotificationMutationVariables)
            )
          );
          // Small delay after fallback operations
          await new Promise(resolve => setTimeout(resolve, 100));
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
            deleteNotificationMutation({ id: notification.id } as DeleteNotificationMutationVariables)
          )
        );
        // Small delay after fallback operations
        await new Promise(resolve => setTimeout(resolve, 100));
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
  const { isAuthenticated } = useAuth();

  return useCallback(async (unreadNotifications: Notification[]): Promise<void> => {
    // Synchronous check: Verify AuthContext state first (source of truth)
    if (!isAuthenticated) {
      return;
    }

    // Check ref immediately for synchronous guard against race conditions
    if (unreadNotifications.length === 0 || isBulkProcessingRef.current) {
      return;
    }

    // Set ref and state immediately to prevent race conditions
    // Note: useAuthenticatedMutation handles token verification internally
    isBulkProcessingRef.current = true;
    setIsBulkProcessing(true);
    // Add all notifications to processing set (batched update)
    addProcessingBatch(unreadNotifications.map(n => n.id));

    try {
      // Execute bulk mutation with proper async/await
      // useAuthenticatedMutation expects variables directly, not wrapped in options
      const result = await deleteAllUnreadMutation({});

      if (result.data?.deleteAllUnreadNotifications?.success) {
        // Proactively refresh tokens after bulk operation to ensure they're fresh for subsequent mutations
        // This prevents race conditions where tokens expire or become invalid after bulk operations
        try {
          await refreshTokenAutomatically();
          // Wait for tokens to be fully available after refresh
          await ensureTokensReady(10);
        } catch (refreshError) {
          // Token refresh failed - tokens might still be valid, continue anyway
        }
        // Additional delay to ensure tokens are fully persisted and available
        await new Promise(resolve => setTimeout(resolve, 300));
        debouncedRefetch();
      } else {
        // Fallback to individual deletes if bulk delete fails
        try {
          await Promise.all(
            unreadNotifications.map(notification =>
              deleteNotificationMutation({ id: notification.id } as DeleteNotificationMutationVariables)
            )
          );
          // Small delay after fallback operations
          await new Promise(resolve => setTimeout(resolve, 100));
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
            deleteNotificationMutation({ id: notification.id } as DeleteNotificationMutationVariables)
          )
        );
        // Small delay after fallback operations
        await new Promise(resolve => setTimeout(resolve, 100));
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

