/**
 * useNotificationMutations Hook
 * Main entry point that combines all mutation handlers
 * Provides all mutation handlers with error handling, race condition prevention, and loading states
 */

import { useCallback } from 'react';
import { useNotificationMutationsState } from './state';
import { useNotificationMutationsHooks } from './mutations';
import {
  useDebouncedRefetch,
  useAddProcessing,
  useRemoveProcessing,
  useAddProcessingBatch,
  useRemoveProcessingBatch
} from './utils';
import {
  useMarkAsReadHandler,
  useMarkAsUnreadHandler,
  useDeleteNotificationHandler
} from './handlers/individual';
import {
  useMarkAllAsReadHandler,
  useMarkAllAsUnreadHandler
} from './handlers/markAll';
import {
  useDeleteAllReadHandler,
  useDeleteAllUnreadHandler
} from './handlers/deleteAll';
import { UseNotificationMutationsReturn } from './types';

/**
 * Custom hook for notification mutations
 * Provides all mutation handlers with error handling, race condition prevention, and loading states
 */
export const useNotificationMutations = (refetch: () => void): UseNotificationMutationsReturn => {
  // Initialize state and refs
  const state = useNotificationMutationsState();

  // Initialize GraphQL mutations
  const mutations = useNotificationMutationsHooks();

  // Initialize debounced refetch
  const debouncedRefetch = useDebouncedRefetch(
    refetch,
    state.refetchTimeoutRef,
    state.isRefetching
  );

  // Initialize processing state management
  const addProcessing = useAddProcessing(
    state.setProcessingNotifications,
    state.processingNotificationsRef
  );

  const removeProcessing = useRemoveProcessing(
    state.setProcessingNotifications,
    state.processingNotificationsRef
  );

  const addProcessingBatch = useAddProcessingBatch(
    state.setProcessingNotifications,
    state.processingNotificationsRef
  );

  const removeProcessingBatch = useRemoveProcessingBatch(
    state.setProcessingNotifications,
    state.processingNotificationsRef
  );

  // Initialize individual notification handlers
  const markAsRead = useMarkAsReadHandler({
    markAsReadMutation: mutations.markAsReadMutation,
    markAsUnreadMutation: mutations.markAsUnreadMutation,
    deleteNotificationMutation: mutations.deleteNotificationMutation,
    addProcessing,
    removeProcessing,
    debouncedRefetch,
    processingNotificationsRef: state.processingNotificationsRef
  });

  const markAsUnread = useMarkAsUnreadHandler({
    markAsReadMutation: mutations.markAsReadMutation,
    markAsUnreadMutation: mutations.markAsUnreadMutation,
    deleteNotificationMutation: mutations.deleteNotificationMutation,
    addProcessing,
    removeProcessing,
    debouncedRefetch,
    processingNotificationsRef: state.processingNotificationsRef
  });

  const deleteNotification = useDeleteNotificationHandler({
    markAsReadMutation: mutations.markAsReadMutation,
    markAsUnreadMutation: mutations.markAsUnreadMutation,
    deleteNotificationMutation: mutations.deleteNotificationMutation,
    addProcessing,
    removeProcessing,
    debouncedRefetch,
    processingNotificationsRef: state.processingNotificationsRef
  });

  // Initialize bulk operation handlers - mark all
  const markAllAsRead = useMarkAllAsReadHandler({
    markAllAsReadMutation: mutations.markAllAsReadMutation,
    markAllAsUnreadMutation: mutations.markAllAsUnreadMutation,
    markAsReadMutation: mutations.markAsReadMutation,
    markAsUnreadMutation: mutations.markAsUnreadMutation,
    addProcessingBatch,
    removeProcessingBatch,
    debouncedRefetch,
    isBulkProcessingRef: state.isBulkProcessingRef,
    setIsBulkProcessing: state.setIsBulkProcessing
  });

  const markAllAsUnread = useMarkAllAsUnreadHandler({
    markAllAsReadMutation: mutations.markAllAsReadMutation,
    markAllAsUnreadMutation: mutations.markAllAsUnreadMutation,
    markAsReadMutation: mutations.markAsReadMutation,
    markAsUnreadMutation: mutations.markAsUnreadMutation,
    addProcessingBatch,
    removeProcessingBatch,
    debouncedRefetch,
    isBulkProcessingRef: state.isBulkProcessingRef,
    setIsBulkProcessing: state.setIsBulkProcessing
  });

  // Initialize bulk operation handlers - delete all
  const deleteAllRead = useDeleteAllReadHandler({
    deleteAllReadMutation: mutations.deleteAllReadMutation,
    deleteAllUnreadMutation: mutations.deleteAllUnreadMutation,
    deleteNotificationMutation: mutations.deleteNotificationMutation,
    addProcessingBatch,
    removeProcessingBatch,
    debouncedRefetch,
    isBulkProcessingRef: state.isBulkProcessingRef,
    setIsBulkProcessing: state.setIsBulkProcessing
  });

  const deleteAllUnread = useDeleteAllUnreadHandler({
    deleteAllReadMutation: mutations.deleteAllReadMutation,
    deleteAllUnreadMutation: mutations.deleteAllUnreadMutation,
    deleteNotificationMutation: mutations.deleteNotificationMutation,
    addProcessingBatch,
    removeProcessingBatch,
    debouncedRefetch,
    isBulkProcessingRef: state.isBulkProcessingRef,
    setIsBulkProcessing: state.setIsBulkProcessing
  });

  // Check if a specific notification is being processed
  const isProcessing = useCallback((notificationId: string): boolean => {
    return state.processingNotifications.has(notificationId);
  }, [state.processingNotifications]);

  // Check if any bulk operation is in progress
  const isProcessingBulk = useCallback((): boolean => {
    return state.isBulkProcessing ||
           mutations.markAllAsReadLoading ||
           mutations.markAllAsUnreadLoading ||
           mutations.deleteAllReadLoading ||
           mutations.deleteAllUnreadLoading;
  }, [state.isBulkProcessing, mutations.markAllAsReadLoading, mutations.markAllAsUnreadLoading, mutations.deleteAllReadLoading, mutations.deleteAllUnreadLoading]);

  return {
    markAsRead,
    markAsUnread,
    markAllAsRead,
    markAllAsUnread,
    deleteNotification,
    deleteAllRead,
    deleteAllUnread,
    isProcessing,
    isProcessingBulk,
    reset: state.reset
  };
};

