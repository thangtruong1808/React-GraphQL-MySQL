import React from 'react';
import {
  CreateNotificationModal,
  DeleteNotificationModal,
  EditNotificationModal,
} from '../../components/notificationManagement';
import AccessDenied from '../../components/auth/AccessDenied';
import { DashboardLayout } from '../../components/layout';
import { DashboardSkeleton } from '../../components/ui';
import { DEFAULT_NOTIFICATION_PAGINATION } from '../../constants/notificationManagement';
import { useAuth } from '../../contexts/AuthContext';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { useAuthDataReady } from '../../hooks/useAuthDataReady';
import {
  useNotificationsState,
  useNotificationsQueries,
  useNotificationsMutations,
  useNotificationsHandlers,
} from './NotificationsPage/hooks';
import { NotificationsHeader, NotificationsContent } from './NotificationsPage/components';

/**
 * Notifications Management Page
 * Mirrors UsersPage pattern for predictable loading and skeleton behavior
 * Features responsive design with improved mobile UX when sidebar is collapsed
 */
const NotificationsPage: React.FC = () => {
  const { showNotification, isInitializing, user } = useAuth();
  const { hasDashboardAccess } = useRolePermissions();
  const isAuthDataReady = useAuthDataReady();

  // State management
  const { state, setState, sortBy, setSortBy, sortOrder, setSortOrder } = useNotificationsState({
    initialPageSize: DEFAULT_NOTIFICATION_PAGINATION.limit,
  });

  // GraphQL queries
  const { data, queryLoading, refetch } = useNotificationsQueries({
    pageSize: state.pageSize,
    currentPage: state.currentPage,
    searchQuery: state.searchQuery,
    sortBy,
    sortOrder,
    isInitializing,
    hasDashboardAccess,
    user,
    isAuthDataReady,
    setState,
  });

  // GraphQL mutations
  const {
    createNotificationMutation,
    updateNotificationMutation,
    deleteNotificationMutation,
    markNotificationReadMutation,
    markNotificationUnreadMutation,
  } = useNotificationsMutations();

  // Event handlers
  const {
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
  } = useNotificationsHandlers({
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
  });

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
        <NotificationsHeader onCreateClick={handleCreateClick} />

        {/* Main Content */}
        <NotificationsContent
          state={state}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSearch={handleSearchChange}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSort={handleSort}
          onEdit={handleEditNotification}
          onDelete={handleDeleteNotificationClick}
          onMarkRead={handleMarkRead}
          onMarkUnread={handleMarkUnread}
        />

        {/* Modals */}
        <CreateNotificationModal
          isOpen={state.createModalOpen}
          onClose={() => handleCloseModals('create')}
          onCreate={handleCreateNotification}
          loading={state.loading}
        />

        <EditNotificationModal
          isOpen={state.editModalOpen}
          onClose={() => handleCloseModals('edit')}
          onUpdate={handleUpdateNotification}
          notification={state.selectedNotification}
          loading={state.loading}
        />

        <DeleteNotificationModal
          isOpen={state.deleteModalOpen}
          onClose={() => handleCloseModals('delete')}
          onDelete={handleDeleteNotification}
          notification={state.selectedNotification}
          loading={state.loading}
        />
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;