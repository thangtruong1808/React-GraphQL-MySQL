import { useMutation } from '@apollo/client';
import { useState, useCallback, useRef, useEffect } from 'react';
import {
  MARK_NOTIFICATION_READ_MUTATION,
  MARK_NOTIFICATION_UNREAD_MUTATION,
  MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION,
  MARK_ALL_NOTIFICATIONS_AS_UNREAD_MUTATION,
  DELETE_NOTIFICATION_MUTATION,
  DELETE_ALL_READ_NOTIFICATIONS_MUTATION,
  DELETE_ALL_UNREAD_NOTIFICATIONS_MUTATION,
  MarkNotificationReadMutationVariables,
  MarkNotificationUnreadMutationVariables,
  DeleteNotificationMutationVariables
} from '../../services/graphql/notificationQueries';
import { Notification } from '../../types/notificationManagement';

interface UseNotificationMutationsReturn {
  markAsRead: (notification: Notification) => Promise<void>;
  markAsUnread: (notification: Notification) => Promise<void>;
  markAllAsRead: (unreadNotifications: Notification[]) => Promise<void>;        
  markAllAsUnread: (readNotifications: Notification[]) => Promise<void>;        
  deleteNotification: (notification: Notification) => Promise<void>;
  deleteAllRead: (readNotifications: Notification[]) => Promise<void>;
  deleteAllUnread: (unreadNotifications: Notification[]) => Promise<void>;      
  isProcessing: (notificationId: string) => boolean;
  isProcessingBulk: () => boolean;
  reset: () => void;
}

/**
 * Custom hook for notification mutations
 * Provides all mutation handlers with error handling, race condition prevention, and loading states
 */
export const useNotificationMutations = (refetch: () => void): UseNotificationMutationsReturn => {                                                              
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

  // Debounced refetch - prevents multiple simultaneous refetches
  const debouncedRefetch = useCallback(() => {
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
  }, [refetch]);

  // Mutation to mark notification as read
  const [markAsReadMutation, { loading: markAsReadLoading }] = useMutation(MARK_NOTIFICATION_READ_MUTATION);                                                    

  // Mutation to mark notification as unread
  const [markAsUnreadMutation, { loading: markAsUnreadLoading }] = useMutation(MARK_NOTIFICATION_UNREAD_MUTATION);                                              

  // Mutation to mark all notifications as read
  const [markAllAsReadMutation, { loading: markAllAsReadLoading }] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION);                                      

  // Mutation to mark all notifications as unread
  const [markAllAsUnreadMutation, { loading: markAllAsUnreadLoading }] = useMutation(MARK_ALL_NOTIFICATIONS_AS_UNREAD_MUTATION);                                

  // Mutation to delete individual notification
  const [deleteNotificationMutation, { loading: deleteNotificationLoading }] = useMutation(DELETE_NOTIFICATION_MUTATION);                                       

  // Mutation to delete all read notifications
  const [deleteAllReadMutation, { loading: deleteAllReadLoading }] = useMutation(DELETE_ALL_READ_NOTIFICATIONS_MUTATION);                                       

  // Mutation to delete all unread notifications
  const [deleteAllUnreadMutation, { loading: deleteAllUnreadLoading }] = useMutation(DELETE_ALL_UNREAD_NOTIFICATIONS_MUTATION);                                 

  // Check if a specific notification is being processed
  const isProcessing = useCallback((notificationId: string): boolean => {       
    return processingNotifications.has(notificationId);
  }, [processingNotifications]);

  // Check if any bulk operation is in progress
  const isProcessingBulk = useCallback((): boolean => {
    return isBulkProcessing ||
           markAllAsReadLoading ||
           markAllAsUnreadLoading ||
           deleteAllReadLoading ||
           deleteAllUnreadLoading;
  }, [isBulkProcessing, markAllAsReadLoading, markAllAsUnreadLoading, deleteAllReadLoading, deleteAllUnreadLoading]);                                                             

  // Add notification to processing set
  const addProcessing = useCallback((notificationId: string) => {
    setProcessingNotifications(prev => {
      if (prev.has(notificationId)) return prev;
      const next = new Set(prev);
      next.add(notificationId);
      processingNotificationsRef.current = next; // Sync ref immediately
      return next;
    });
  }, []);

  // Remove notification from processing set
  const removeProcessing = useCallback((notificationId: string) => {
    setProcessingNotifications(prev => {
      if (!prev.has(notificationId)) return prev;
      const next = new Set(prev);
      next.delete(notificationId);
      processingNotificationsRef.current = next; // Sync ref immediately
      return next;
    });
  }, []);

  // Add multiple notifications to processing set (batched update)
  const addProcessingBatch = useCallback((notificationIds: string[]) => {
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
  }, []);

  // Remove multiple notifications from processing set (batched update)
  const removeProcessingBatch = useCallback((notificationIds: string[]) => {
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
  }, []);

  // Handle marking a notification as read
  const markAsRead = useCallback(async (notification: Notification): Promise<void> => {                                                                         
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
  }, [addProcessing, removeProcessing, markAsReadMutation, debouncedRefetch]);

  // Handle marking a notification as unread
  const markAsUnread = useCallback(async (notification: Notification): Promise<void> => {                                                                       
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
  }, [addProcessing, removeProcessing, markAsUnreadMutation, debouncedRefetch]);

  // Handle marking all notifications as read
  const markAllAsRead = useCallback(async (unreadNotifications: Notification[]): Promise<void> => {                                                             
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
  }, [addProcessingBatch, removeProcessingBatch, markAllAsReadMutation, markAsReadMutation, debouncedRefetch]);

  // Handle marking all notifications as unread
  const markAllAsUnread = useCallback(async (readNotifications: Notification[]): Promise<void> => {                                                             
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
  }, [addProcessingBatch, removeProcessingBatch, markAllAsUnreadMutation, markAsUnreadMutation, debouncedRefetch]);        

  // Handle deleting a single notification
  const deleteNotification = useCallback(async (notification: Notification): Promise<void> => {                                                                 
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
  }, [addProcessing, removeProcessing, deleteNotificationMutation, debouncedRefetch]);

  // Handle deleting all read notifications
  const deleteAllRead = useCallback(async (readNotifications: Notification[]): Promise<void> => {                                                               
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
  }, [addProcessingBatch, removeProcessingBatch, deleteAllReadMutation, deleteNotificationMutation, debouncedRefetch]);    

  // Handle deleting all unread notifications
  const deleteAllUnread = useCallback(async (unreadNotifications: Notification[]): Promise<void> => {                                                           
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
  }, [addProcessingBatch, removeProcessingBatch, deleteAllUnreadMutation, deleteNotificationMutation, debouncedRefetch]);  

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
    reset
  };
};

