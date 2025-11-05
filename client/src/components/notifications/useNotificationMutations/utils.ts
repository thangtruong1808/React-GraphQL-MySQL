/**
 * Utility functions for useNotificationMutations hook
 * Handles debounced refetch and processing state management
 */

import { useCallback } from 'react';
import { NotificationMutationsState } from './state';

/**
 * Create debounced refetch function to prevent multiple simultaneous refetches
 */
export const useDebouncedRefetch = (
  refetch: () => void,
  refetchTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
  isRefetching: React.MutableRefObject<boolean>
) => {
  return useCallback(() => {
    if (refetchTimeoutRef.current) {
      clearTimeout(refetchTimeoutRef.current);
    }
    if (!isRefetching.current) {
      isRefetching.current = true;
      refetchTimeoutRef.current = setTimeout(() => {
        refetch();
        isRefetching.current = false;
        if (refetchTimeoutRef.current) {
          clearTimeout(refetchTimeoutRef.current);
          refetchTimeoutRef.current = null;
        }
      }, 300); // 300ms debounce
    }
  }, [refetch, refetchTimeoutRef, isRefetching]);
};

/**
 * Add notification to processing set
 */
export const useAddProcessing = (
  setProcessingNotifications: React.Dispatch<React.SetStateAction<Set<string>>>,
  processingNotificationsRef: React.MutableRefObject<Set<string>>
) => {
  return useCallback((notificationId: string) => {
    setProcessingNotifications(prev => {
      if (prev.has(notificationId)) return prev;
      const next = new Set(prev);
      next.add(notificationId);
      processingNotificationsRef.current = next; // Sync ref immediately
      return next;
    });
  }, [setProcessingNotifications, processingNotificationsRef]);
};

/**
 * Remove notification from processing set
 */
export const useRemoveProcessing = (
  setProcessingNotifications: React.Dispatch<React.SetStateAction<Set<string>>>,
  processingNotificationsRef: React.MutableRefObject<Set<string>>
) => {
  return useCallback((notificationId: string) => {
    setProcessingNotifications(prev => {
      if (!prev.has(notificationId)) return prev;
      const next = new Set(prev);
      next.delete(notificationId);
      processingNotificationsRef.current = next; // Sync ref immediately
      return next;
    });
  }, [setProcessingNotifications, processingNotificationsRef]);
};

/**
 * Add multiple notifications to processing set (batched update)
 */
export const useAddProcessingBatch = (
  setProcessingNotifications: React.Dispatch<React.SetStateAction<Set<string>>>,
  processingNotificationsRef: React.MutableRefObject<Set<string>>
) => {
  return useCallback((notificationIds: string[]) => {
    setProcessingNotifications(prev => {
      const next = new Set(prev);
      let changed = false;
      notificationIds.forEach(id => {
        if (!next.has(id)) {
          next.add(id);
          changed = true;
        }
      });
      if (changed) {
        processingNotificationsRef.current = next; // Sync ref immediately
        return next;
      }
      return prev;
    });
  }, [setProcessingNotifications, processingNotificationsRef]);
};

/**
 * Remove multiple notifications from processing set (batched update)
 */
export const useRemoveProcessingBatch = (
  setProcessingNotifications: React.Dispatch<React.SetStateAction<Set<string>>>,
  processingNotificationsRef: React.MutableRefObject<Set<string>>
) => {
  return useCallback((notificationIds: string[]) => {
    setProcessingNotifications(prev => {
      const next = new Set(prev);
      let changed = false;
      notificationIds.forEach(id => {
        if (next.has(id)) {
          next.delete(id);
          changed = true;
        }
      });
      if (changed) {
        processingNotificationsRef.current = next; // Sync ref immediately
        return next;
      }
      return prev;
    });
  }, [setProcessingNotifications, processingNotificationsRef]);
};

