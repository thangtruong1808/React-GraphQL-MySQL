import React from 'react';
import {
  CreateActivityModal,
  DeleteActivityModal,
  EditActivityModal,
} from '../../components/activityManagement';
import AccessDenied from '../../components/auth/AccessDenied';
import { DashboardLayout } from '../../components/layout';
import { DashboardSkeleton } from '../../components/ui';
import { DEFAULT_ACTIVITY_PAGINATION } from '../../constants/activityManagement';
import { useAuth } from '../../contexts/AuthContext';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { useAuthDataReady } from '../../hooks/useAuthDataReady';
import {
  useActivitiesState,
  useActivitiesQueries,
  useActivitiesMutations,
  useActivitiesHandlers,
} from './ActivitiesPage/hooks';
import { ActivitiesHeader, ActivitiesContent } from './ActivitiesPage/components';

/**
 * Activities Dashboard Page
 * Complete activity management interface with search, table, and CRUD operations
 * Features modern, professional layout with pagination and real-time search
 * Includes skeleton loading states for better UX during data fetching
 *
 * CALLED BY: AppRoutes component via ProtectedRoute
 * SCENARIOS: Activity management for administrators and project managers
 */
const ActivitiesPage: React.FC = () => {
  const { isInitializing, showNotification } = useAuth();
  const { canCreate, hasDashboardAccess } = useRolePermissions();
  const isAuthDataReady = useAuthDataReady();

  // State management
  const { state, setState, sortBy, setSortBy, sortOrder, setSortOrder } = useActivitiesState({
    initialPageSize: DEFAULT_ACTIVITY_PAGINATION.limit,
  });

  // GraphQL queries
  const { queryLoading, refetch } = useActivitiesQueries({
    pageSize: state.pageSize,
    currentPage: state.currentPage,
    searchQuery: state.searchQuery,
    sortBy,
    sortOrder,
    isInitializing,
    hasDashboardAccess,
    isAuthDataReady,
    setState,
  });

  // GraphQL mutations
  const { createActivityMutation, updateActivityMutation, deleteActivityMutation } = useActivitiesMutations();

  // Event handlers
  const {
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    handleCreateClick,
    handleCreate,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleConfirmDelete,
    closeModals,
  } = useActivitiesHandlers({
    state,
    sortBy,
    sortOrder,
    setState,
    setSortBy,
    setSortOrder,
    refetch,
    createActivityMutation,
    updateActivityMutation,
    deleteActivityMutation,
    showNotification,
  });

  // During auth initialization, show skeleton to avoid Access Denied flash
  if (isInitializing) {
    return <DashboardSkeleton />;
  }

  // Check if user has dashboard access
  if (!hasDashboardAccess) {
    return <AccessDenied feature="Activity Management" />;
  }

  // Show skeleton only during initial data loading (not during auth init)
  if (queryLoading && (!state.activities || state.activities.length === 0)) {
    return <DashboardSkeleton />;
  }

  return (
    <DashboardLayout showSidebarSkeleton={false}>
      <div className="w-full h-full dashboard-content">
        {/* Header Section */}
        <ActivitiesHeader canCreate={canCreate} onCreateClick={handleCreateClick} />

        {/* Main Content */}
        <ActivitiesContent
          state={state}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSearch={handleSearch}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Modals */}
        <CreateActivityModal
          isOpen={state.createModalOpen}
          onClose={closeModals}
          onCreate={handleCreate}
          loading={state.loading}
        />

        <EditActivityModal
          isOpen={state.editModalOpen}
          onClose={closeModals}
          onUpdate={handleUpdate}
          activity={state.selectedActivity}
          loading={state.loading}
        />

        <DeleteActivityModal
          isOpen={state.deleteModalOpen}
          onClose={closeModals}
          onDelete={handleConfirmDelete}
          activity={state.selectedActivity}
          loading={state.loading}
        />
      </div>
    </DashboardLayout>
  );
};

export default ActivitiesPage;
