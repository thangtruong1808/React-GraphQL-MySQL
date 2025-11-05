import { useCallback } from 'react';
import {
  NOTIFICATION_ERROR_MESSAGES,
  NOTIFICATION_SUCCESS_MESSAGES,
} from '../../../../constants/notificationManagement';
import { Notification, NotificationInput, NotificationUpdateInput } from '../../../../types/notificationManagement';
import { UseNotificationsHandlersDependencies, NotificationsPageState } from '../types';

/**
 * Custom hook for managing event handlers
 * Handles all user interactions and CRUD operations
 */
export const useNotificationsHandlers = ({
  state,
  sortBy,
  sortOrder,
  setState,
  setSortBy,
  setSortOrder,
  refetch,
  createNotificationMutation,
  updateNotificationMutation,
  deleteNotificationMutation,
  markNotificationReadMutation,
  markNotificationUnreadMutation,
  showNotification,
  data,
}: UseNotificationsHandlersDependencies) => {
  /**
   * Explicit refetch helper
   * Refetches notifications with current parameters
   */
  const fetchNotifications = useCallback(
    async (page: number, pageSize: number, search: string) => {
      try {
        await refetch({
          limit: pageSize,
          offset: (page - 1) * pageSize,
          search: search || undefined,
          sortBy,
          sortOrder,
        });
      } catch (error) {
        setState((prev) => ({ ...prev, error: NOTIFICATION_ERROR_MESSAGES.FETCH }));
      }
    },
    [refetch, sortBy, sortOrder, setState]
  );

  /**
   * Handle search
   * Updates search query and resets to first page
   */
  const handleSearchChange = useCallback(
    (q: string) => {
      setState((prev) => ({ ...prev, searchQuery: q, currentPage: 1 }));
    },
    [setState]
  );

  /**
   * Handle pagination - page change
   * Updates current page and refetches data
   */
  const handlePageChange = useCallback(
    (page: number) => {
      setState((prev) => ({ ...prev, currentPage: page }));
      fetchNotifications(page, state.pageSize, state.searchQuery);
    },
    [fetchNotifications, setState, state.pageSize, state.searchQuery]
  );

  /**
   * Handle pagination - page size change
   * Updates page size, resets to first page, and refetches data
   */
  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setState((prev) => ({ ...prev, pageSize: newPageSize, currentPage: 1 }));
      fetchNotifications(1, newPageSize, state.searchQuery);
    },
    [fetchNotifications, setState, state.searchQuery]
  );

  /**
   * Handle sorting
   * Updates sort parameters and resets to first page
   */
  const handleSort = useCallback(
    (newSortBy: string, newSortOrder: string) => {
      setSortBy(newSortBy);
      // Cast to 'ASC' | 'DESC' to match state type - values are validated by NotificationsTable component
      setSortOrder(newSortOrder as 'ASC' | 'DESC');
      setState((prev) => ({ ...prev, currentPage: 1 }));
    },
    [setSortBy, setSortOrder, setState]
  );

  /**
   * Handle create notification
   * Creates new notification and shows success notification
   */
  const handleCreateNotification = useCallback(
    async (input: NotificationInput) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        await createNotificationMutation({ variables: { input } });
        setState((prev) => ({ ...prev, createModalOpen: false, loading: false }));
        await refetch();
        showNotification(NOTIFICATION_SUCCESS_MESSAGES.CREATE, 'success');
      } catch (error: any) {
        setState((prev) => ({ ...prev, loading: false, error: NOTIFICATION_ERROR_MESSAGES.CREATE }));
        showNotification(error.message || NOTIFICATION_ERROR_MESSAGES.CREATE, 'error');
      }
    },
    [createNotificationMutation, refetch, showNotification, setState]
  );

  /**
   * Handle update notification
   * Updates existing notification and shows success notification
   */
  const handleUpdateNotification = useCallback(
    async (id: string, input: NotificationUpdateInput) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        await updateNotificationMutation({ variables: { id, input } });
        setState((prev) => ({ ...prev, editModalOpen: false, loading: false, selectedNotification: null }));
        await refetch();
        showNotification(NOTIFICATION_SUCCESS_MESSAGES.UPDATE, 'success');
      } catch (error: any) {
        setState((prev) => ({ ...prev, loading: false, error: NOTIFICATION_ERROR_MESSAGES.UPDATE }));
        showNotification(error.message || NOTIFICATION_ERROR_MESSAGES.UPDATE, 'error');
      }
    },
    [updateNotificationMutation, refetch, showNotification, setState]
  );

  /**
   * Handle delete notification
   * Deletes notification and shows success notification
   */
  const handleDeleteNotification = useCallback(
    async (id: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        await deleteNotificationMutation({ variables: { id } });
        setState((prev) => ({ ...prev, deleteModalOpen: false, loading: false, selectedNotification: null }));
        await refetch();
        showNotification(NOTIFICATION_SUCCESS_MESSAGES.DELETE, 'success');
      } catch (error: any) {
        setState((prev) => ({ ...prev, loading: false, error: NOTIFICATION_ERROR_MESSAGES.DELETE }));
        showNotification(error.message || NOTIFICATION_ERROR_MESSAGES.DELETE, 'error');
      }
    },
    [deleteNotificationMutation, refetch, showNotification, setState]
  );

  /**
   * Handle mark notification as read
   * Marks notification as read and shows success notification
   */
  const handleMarkRead = useCallback(
    async (notification: Notification) => {
      try {
        await markNotificationReadMutation({ variables: { id: notification.id } });
        await refetch();
        showNotification(NOTIFICATION_SUCCESS_MESSAGES.MARK_READ, 'success');
      } catch (error: any) {
        showNotification(error.message || NOTIFICATION_ERROR_MESSAGES.MARK_READ, 'error');
      }
    },
    [markNotificationReadMutation, refetch, showNotification]
  );

  /**
   * Handle mark notification as unread
   * Marks notification as unread and shows success notification
   */
  const handleMarkUnread = useCallback(
    async (notification: Notification) => {
      try {
        await markNotificationUnreadMutation({ variables: { id: notification.id } });
        await refetch();
        showNotification(NOTIFICATION_SUCCESS_MESSAGES.MARK_UNREAD, 'success');
      } catch (error: any) {
        showNotification(error.message || NOTIFICATION_ERROR_MESSAGES.MARK_UNREAD, 'error');
      }
    },
    [markNotificationUnreadMutation, refetch, showNotification]
  );

  /**
   * Handle edit notification click
   * Opens edit modal with selected notification
   */
  const handleEditNotification = useCallback(
    (notification: Notification) => {
      // Use the notification passed from the row which reflects the current UI state
      // This ensures we have the most up-to-date information displayed in the table
      setState((prev) => ({ ...prev, selectedNotification: notification, editModalOpen: true }));
    },
    [setState]
  );

  /**
   * Handle delete notification click
   * Opens delete modal with selected notification
   */
  const handleDeleteNotificationClick = useCallback(
    (notification: Notification) => {
      // Find the latest notification from Apollo data or state, preferring Apollo data which is more up-to-date
      // This ensures we have the most recent information, especially after mutations that update the cache
      setState((prev) => {
        // First check Apollo data (cache might be updated even if refetch hasn't completed)
        let latestNotification = data?.dashboardNotifications?.notifications?.find((n: Notification) => n.id === notification.id);
        // Fallback to state notifications
        if (!latestNotification) {
          latestNotification = prev.notifications.find((n) => n.id === notification.id);
        }
        // Final fallback to notification passed from row
        latestNotification = latestNotification || notification;
        return { ...prev, selectedNotification: latestNotification, deleteModalOpen: true };
      });
    },
    [data, setState]
  );

  /**
   * Handle modal close
   * Closes specified modal and clears selected notification
   */
  const handleCloseModals = useCallback(
    (modalType: 'create' | 'edit' | 'delete') => {
      setState((prev) => {
        const updates: Partial<NotificationsPageState> = {
          selectedNotification: modalType !== 'create' ? null : prev.selectedNotification,
        };
        if (modalType === 'create') {
          updates.createModalOpen = false;
        } else if (modalType === 'edit') {
          updates.editModalOpen = false;
        } else if (modalType === 'delete') {
          updates.deleteModalOpen = false;
        }
        return { ...prev, ...updates };
      });
    },
    [setState]
  );

  /**
   * Handle create modal open
   * Opens create modal
   */
  const handleCreateClick = useCallback(() => {
    setState((prev) => ({ ...prev, createModalOpen: true }));
  }, [setState]);

  return {
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    handleCreateNotification,
    handleUpdateNotification,
    handleDeleteNotification,
    handleMarkRead,
    handleMarkUnread,
    handleEditNotification,
    handleDeleteNotificationClick,
    handleCloseModals,
    handleCreateClick,
  };
};

