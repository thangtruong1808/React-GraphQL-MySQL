/**
 * State management for useNotificationMutations hook
 * Handles processing state, refs, and reset functionality
 */

import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * State and refs for tracking processing notifications
 */
export interface NotificationMutationsState {
  processingNotifications: Set<string>;
  setProcessingNotifications: React.Dispatch<React.SetStateAction<Set<string>>>;
  isBulkProcessing: boolean;
  setIsBulkProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  isBulkProcessingRef: React.MutableRefObject<boolean>;
  processingNotificationsRef: React.MutableRefObject<Set<string>>;
  refetchTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  isRefetching: React.MutableRefObject<boolean>;
}

/**
 * Initialize state and refs for notification mutations
 */
export const useNotificationMutationsState = (): NotificationMutationsState & { reset: () => void } => {
  // Track notifications being processed to prevent duplicate mutations (reactive state for UI updates)
  const [processingNotifications, setProcessingNotifications] = useState<Set<string>>(new Set());
  
  // Track if bulk operations are in progress (reactive state for UI updates)
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  
  // Ref for immediate synchronous checking to prevent race conditions (checked before async operations)
  const isBulkProcessingRef = useRef(false);
  
  // Ref for immediate synchronous checking of individual notifications
  const processingNotificationsRef = useRef<Set<string>>(new Set());
  
  // Debounce refetch to prevent multiple simultaneous refetches
  const refetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track if refetch is in progress
  const isRefetching = useRef(false);

  // Reset function to clear all state and refs (called when drawer closes)
  const reset = useCallback(() => {
    // Clear all state
    setProcessingNotifications(new Set());
    setIsBulkProcessing(false);
    // Clear all refs
    isBulkProcessingRef.current = false;
    processingNotificationsRef.current = new Set();
    // Clear refetch timeout
    if (refetchTimeoutRef.current) {
      clearTimeout(refetchTimeoutRef.current);
      refetchTimeoutRef.current = null;
    }
    isRefetching.current = false;
  }, []);

  // Sync ref with state for immediate checks
  useEffect(() => {
    isBulkProcessingRef.current = isBulkProcessing;
  }, [isBulkProcessing]);

  // Sync ref with state for immediate checks
  useEffect(() => {
    processingNotificationsRef.current = processingNotifications;
  }, [processingNotifications]);

  return {
    processingNotifications,
    setProcessingNotifications,
    isBulkProcessing,
    setIsBulkProcessing,
    isBulkProcessingRef,
    processingNotificationsRef,
    refetchTimeoutRef,
    isRefetching,
    reset
  };
};

