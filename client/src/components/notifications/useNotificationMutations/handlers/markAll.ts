/**
 * Mark all notifications mutation handlers
 * Description: Handles mark all as read/unread operations with proper async/await
 * Date: 2024-12-19
 * Author: thangtruong
 */

import { useCallback } from 'react';
import { Notification } from '../../../../types/notificationManagement';
import {
  MarkNotificationReadMutationVariables,
  MarkNotificationUnreadMutationVariables
} from '../../../../services/graphql/notificationQueries';
import { useAuth } from '../../../../contexts/AuthContext';
import { refreshTokenAutomatically, ensureTokensReady } from '../../../../services/graphql/apollo-client/tokens';

/**
 * Dependencies for mark all handlers
 */
export interface MarkAllHandlersDependencies {
  markAllAsReadMutation: (variables?: any) => Promise<any>;
  markAllAsUnreadMutation: (variables?: any) => Promise<any>;
  markAsReadMutation: (variables: MarkNotificationReadMutationVariables) => Promise<any>;
  markAsUnreadMutation: (variables: MarkNotificationUnreadMutationVariables) => Promise<any>;
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
      const result = await markAllAsReadMutation({});

      if (result.data?.markAllNotificationsAsRead?.success) {
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
        // Fallback to individual updates if bulk update fails
        try {
          await Promise.all(
            unreadNotifications.map(notification =>
              markAsReadMutation({ id: notification.id } as MarkNotificationReadMutationVariables)
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
      // Fallback to individual updates if bulk update fails
      try {
        await Promise.all(
          unreadNotifications.map(notification =>
            markAsReadMutation({ id: notification.id } as MarkNotificationReadMutationVariables)
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
      const result = await markAllAsUnreadMutation({});

      if (result.data?.markAllNotificationsAsUnread?.success) {
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
        // Fallback to individual updates if bulk update fails
        try {
          await Promise.all(
            readNotifications.map(notification =>
              markAsUnreadMutation({ id: notification.id } as MarkNotificationUnreadMutationVariables)
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
      // Fallback to individual updates if bulk update fails
      try {
        await Promise.all(
          readNotifications.map(notification =>
            markAsUnreadMutation({ id: notification.id } as MarkNotificationUnreadMutationVariables)
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
  }, [markAllAsUnreadMutation, markAsUnreadMutation, addProcessingBatch, removeProcessingBatch, debouncedRefetch, isBulkProcessingRef, setIsBulkProcessing]);
};

