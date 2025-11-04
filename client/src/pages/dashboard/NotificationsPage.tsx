import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { useAuthDataReady } from '../../hooks/useAuthDataReady';
import AccessDenied from '../../components/auth/AccessDenied';
import { DashboardLayout } from '../../components/layout';
import { DashboardSkeleton } from '../../components/ui';
import {
  NotificationSearchInput,
  NotificationsTable,
  CreateNotificationModal,
  EditNotificationModal,
  DeleteNotificationModal,
} from '../../components/notificationManagement';
import {
  GET_DASHBOARD_NOTIFICATIONS_QUERY,
  CREATE_NOTIFICATION_MUTATION,
  UPDATE_NOTIFICATION_MUTATION,
  DELETE_NOTIFICATION_MUTATION,
  MARK_NOTIFICATION_READ_MUTATION,
  MARK_NOTIFICATION_UNREAD_MUTATION,
} from '../../services/graphql/notificationQueries';
import {
  DEFAULT_NOTIFICATION_PAGINATION,
  NOTIFICATION_SUCCESS_MESSAGES,
  NOTIFICATION_ERROR_MESSAGES,
} from '../../constants/notificationManagement';
import {
  Notification,
  NotificationInput,
  NotificationUpdateInput,
  PaginationInfo,
} from '../../types/notificationManagement';

/**
 * Notifications Management Page
 * Mirrors UsersPage pattern for predictable loading and skeleton behavior
 * Features responsive design with improved mobile UX when sidebar is collapsed
 */
const NotificationsPage: React.FC = () => {
  const { showNotification, isInitializing, user } = useAuth();
  const { hasDashboardAccess } = useRolePermissions();
  const isAuthDataReady = useAuthDataReady();

  // Centralized state management (UsersPage pattern)
  const [state, setState] = useState({
    notifications: [] as Notification[],
    paginationInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
    } as PaginationInfo,
    loading: false,
    searchQuery: '',
    currentPage: 1,
    pageSize: DEFAULT_NOTIFICATION_PAGINATION.limit,
    createModalOpen: false,
    editModalOpen: false,
    deleteModalOpen: false,
    selectedNotification: null as Notification | null,
    error: null as string | null,
  });

  // Sorting state
  const [sortBy, setSortBy] = useState(DEFAULT_NOTIFICATION_PAGINATION.sortBy);
  const [sortOrder, setSortOrder] = useState(DEFAULT_NOTIFICATION_PAGINATION.sortOrder);

  // GraphQL query
  // Wait for auth data to be ready to prevent race conditions during fast navigation
  const { data, loading: queryLoading, refetch } = useQuery(GET_DASHBOARD_NOTIFICATIONS_QUERY, {
    variables: {
      limit: state.pageSize,
      offset: (state.currentPage - 1) * state.pageSize,
      search: state.searchQuery || undefined,
      sortBy,
      sortOrder,
    },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    skip: isInitializing || !hasDashboardAccess || !user || !isAuthDataReady,
  });

  // Sync state with GraphQL results
  useEffect(() => {
    if (data?.dashboardNotifications) {
      setState(prev => ({
        ...prev,
        notifications: data.dashboardNotifications.notifications,
        paginationInfo: data.dashboardNotifications.paginationInfo,
        loading: queryLoading,
      }));
    } else {
      setState(prev => ({
        ...prev,
        loading: queryLoading,
      }));
    }
  }, [data, queryLoading]);

  // Explicit refetch helper (UsersPage pattern)
  const fetchNotifications = useCallback(async (page: number, pageSize: number, search: string) => {
    try {
      await refetch({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        search: search || undefined,
        sortBy,
        sortOrder,
      });
    } catch (error) {
      setState(prev => ({ ...prev, error: NOTIFICATION_ERROR_MESSAGES.FETCH }));
    }
  }, [refetch, sortBy, sortOrder]);

  // Handle search
  const handleSearchChange = useCallback((q: string) => {
    setState(prev => ({ ...prev, searchQuery: q, currentPage: 1 }));
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
    fetchNotifications(page, state.pageSize, state.searchQuery);
  }, [fetchNotifications, state.pageSize, state.searchQuery]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setState(prev => ({ ...prev, pageSize: newPageSize, currentPage: 1 }));
    fetchNotifications(1, newPageSize, state.searchQuery);
  }, [fetchNotifications, state.searchQuery]);

  // Handle sorting
  const handleSort = useCallback((newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setState(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  // Mutations
  const [createNotificationMutation] = useMutation(CREATE_NOTIFICATION_MUTATION);
  const [updateNotificationMutation] = useMutation(UPDATE_NOTIFICATION_MUTATION);
  const [deleteNotificationMutation] = useMutation(DELETE_NOTIFICATION_MUTATION);
  const [markNotificationReadMutation] = useMutation(MARK_NOTIFICATION_READ_MUTATION);
  const [markNotificationUnreadMutation] = useMutation(MARK_NOTIFICATION_UNREAD_MUTATION);

  // Create
  const handleCreateNotification = useCallback(async (input: NotificationInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await createNotificationMutation({ variables: { input } });
      setState(prev => ({ ...prev, createModalOpen: false, loading: false }));
      await refetch();
      showNotification(NOTIFICATION_SUCCESS_MESSAGES.CREATE, 'success');
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: NOTIFICATION_ERROR_MESSAGES.CREATE }));
      showNotification(error.message || NOTIFICATION_ERROR_MESSAGES.CREATE, 'error');
    }
  }, [createNotificationMutation, refetch, showNotification]);

  // Update
  const handleUpdateNotification = useCallback(async (id: string, input: NotificationUpdateInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await updateNotificationMutation({ variables: { id, input } });
      setState(prev => ({ ...prev, editModalOpen: false, loading: false, selectedNotification: null }));
      await refetch();
      showNotification(NOTIFICATION_SUCCESS_MESSAGES.UPDATE, 'success');
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: NOTIFICATION_ERROR_MESSAGES.UPDATE }));
      showNotification(error.message || NOTIFICATION_ERROR_MESSAGES.UPDATE, 'error');
    }
  }, [updateNotificationMutation, refetch, showNotification]);

  // Delete
  const handleDeleteNotification = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await deleteNotificationMutation({ variables: { id } });
      setState(prev => ({ ...prev, deleteModalOpen: false, loading: false, selectedNotification: null }));
      await refetch();
      showNotification(NOTIFICATION_SUCCESS_MESSAGES.DELETE, 'success');
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: NOTIFICATION_ERROR_MESSAGES.DELETE }));
      showNotification(error.message || NOTIFICATION_ERROR_MESSAGES.DELETE, 'error');
    }
  }, [deleteNotificationMutation, refetch, showNotification]);

  // Mark read
  const handleMarkRead = useCallback(async (notification: Notification) => {
    try {
      await markNotificationReadMutation({ variables: { id: notification.id } });
      await refetch();
      showNotification(NOTIFICATION_SUCCESS_MESSAGES.MARK_READ, 'success');
    } catch (error: any) {
      showNotification(error.message || NOTIFICATION_ERROR_MESSAGES.MARK_READ, 'error');
    }
  }, [markNotificationReadMutation, refetch, showNotification]);

  // Mark unread
  const handleMarkUnread = useCallback(async (notification: Notification) => {
    try {
      await markNotificationUnreadMutation({ variables: { id: notification.id } });
      await refetch();
      showNotification(NOTIFICATION_SUCCESS_MESSAGES.MARK_UNREAD, 'success');
    } catch (error: any) {
      showNotification(error.message || NOTIFICATION_ERROR_MESSAGES.MARK_UNREAD, 'error');
    }
  }, [markNotificationUnreadMutation, refetch, showNotification]);

  // Edit/Delete modal open helpers
  const handleEditNotification = useCallback((notification: Notification) => {
    // Use the notification passed from the row which reflects the current UI state
    // This ensures we have the most up-to-date information displayed in the table
    setState(prev => ({ ...prev, selectedNotification: notification, editModalOpen: true }));
  }, []);

  const handleDeleteNotificationClick = useCallback((notification: Notification) => {
    // Find the latest notification from Apollo data or state, preferring Apollo data which is more up-to-date
    // This ensures we have the most recent information, especially after mutations that update the cache
    setState(prev => {
      // First check Apollo data (cache might be updated even if refetch hasn't completed)
      let latestNotification = data?.dashboardNotifications?.notifications?.find(n => n.id === notification.id);
      // Fallback to state notifications
      if (!latestNotification) {
        latestNotification = prev.notifications.find(n => n.id === notification.id);
      }
      // Final fallback to notification passed from row
      latestNotification = latestNotification || notification;
      return { ...prev, selectedNotification: latestNotification, deleteModalOpen: true };
    });
  }, [data]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // During auth initialization, show skeleton
  if (isInitializing) {
    return <DashboardSkeleton />;
  }

  // Access control
  if (!hasDashboardAccess) {
    return <AccessDenied feature="Notifications Management" />;
  }

  // Initial data load skeleton (avoid double sidebar like UsersPage)
  if (queryLoading && (!state.notifications || state.notifications.length === 0)) {
    return <DashboardSkeleton />;
  }

  return (
    <DashboardLayout showSidebarSkeleton={false}>
      <div className="w-full h-full dashboard-content">
        {/* Header Section */}
        <div className="w-full" style={{ backgroundColor: 'var(--bg-base)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Notifications Management
                </h1>
                <p className="text-sm sm:text-base mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Manage and monitor all notifications in the system
                </p>
              </div>
              {/* Create Button - Centered icon and text for better mobile UX when sidebar is collapsed */}
              <button
                type="button"
                onClick={() => setState(prev => ({ ...prev, createModalOpen: true }))}
                className="inline-flex items-center justify-center px-4 py-2 shadow-sm text-sm font-medium rounded-md w-full sm:w-auto sm:flex-shrink-0"
                style={{ backgroundColor: 'var(--button-primary-bg)', color: 'var(--button-primary-text)', border: '1px solid var(--button-primary-border, transparent)' }}
              >
                <FaPlus className="h-5 w-5" aria-hidden="true" />
                <span className="hidden xs:inline ml-2">Create Notification</span>
                <span className="xs:hidden ml-2">Create</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
            {/* Search and Table */}
            <div className="space-y-6">
              {/* Search Input */}
              <NotificationSearchInput
                onSearch={handleSearchChange}
                placeholder="Search notifications..."
                loading={state.loading}
              />

              {/* Notifications Table */}
              <NotificationsTable
                notifications={state.notifications}
                loading={state.loading}
                paginationInfo={state.paginationInfo}
                pageSize={state.pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onSort={handleSort}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onEdit={handleEditNotification}
                onDelete={handleDeleteNotificationClick}
                onMarkRead={handleMarkRead}
                onMarkUnread={handleMarkUnread}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        <CreateNotificationModal
          isOpen={state.createModalOpen}
          onClose={() => setState(prev => ({ ...prev, createModalOpen: false }))}
          onCreate={handleCreateNotification}
          loading={state.loading}
        />

        <EditNotificationModal
          isOpen={state.editModalOpen}
          onClose={() => setState(prev => ({ ...prev, editModalOpen: false, selectedNotification: null }))}
          onUpdate={handleUpdateNotification}
          notification={state.selectedNotification}
          loading={state.loading}
        />

        <DeleteNotificationModal
          isOpen={state.deleteModalOpen}
          onClose={() => setState(prev => ({ ...prev, deleteModalOpen: false, selectedNotification: null }))}
          onDelete={() => state.selectedNotification && handleDeleteNotification(state.selectedNotification.id)}
          notification={state.selectedNotification}
          loading={state.loading}
        />
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;