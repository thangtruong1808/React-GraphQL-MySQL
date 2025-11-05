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
  useActivityManagementState,
  useActivityManagementQueries,
  useActivityManagementMutations,
  useActivityManagementHandlers,
} from './ActivityManagementPage/hooks';
import { ActivityManagementHeader, ActivityManagementContent } from './ActivityManagementPage/components';

/**
 * Activity Management Dashboard Page
 * Complete activity management interface with search, table, and CRUD operations
 * Features modern, professional layout with pagination and real-time search
 *
 * CALLED BY: AppRoutes component via ProtectedRoute
 * SCENARIOS: Activity management for administrators and project managers
 */
const ActivityManagementPage: React.FC = () => {
  const { isInitializing, showNotification } = useAuth();
  const { canCreate, canEdit, canDelete, hasDashboardAccess } = useRolePermissions();
  const isAuthDataReady = useAuthDataReady();

  // State management
  const { state, setState, sortBy, setSortBy, sortOrder, setSortOrder, paginationTimeoutRef } =
    useActivityManagementState({
      initialPageSize: DEFAULT_ACTIVITY_PAGINATION.limit,
    });

  // GraphQL queries
  const { refetch } = useActivityManagementQueries({
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
  const { createActivityMutation, updateActivityMutation, deleteActivityMutation } =
    useActivityManagementMutations();

  // Event handlers
  const {
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    handleCreateActivity,
    handleUpdateActivity,
    handleDeleteActivity,
    handleRefresh,
    handleEditActivity,
    handleDeleteActivityClick,
    handleCloseModal,
    handleCreateClick,
  } = useActivityManagementHandlers({
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
    paginationTimeoutRef,
  });

  // Show access denied if user doesn't have dashboard access
  if (!hasDashboardAccess) {
    return <AccessDenied />;
  }

  // Show loading skeleton during initialization
  if (isInitializing) {
    return <DashboardSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="w-full h-full dashboard-content">
        {/* Header Section */}
        <ActivityManagementHeader
          canCreate={canCreate}
          isLoading={state.loading}
          onCreateClick={handleCreateClick}
          onRefresh={handleRefresh}
        />

        {/* Main Content */}
        <ActivityManagementContent
          state={state}
          sortBy={sortBy}
          sortOrder={sortOrder}
          canEdit={canEdit}
          canDelete={canDelete}
          onSearch={handleSearchChange}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSort={handleSort}
          onEdit={handleEditActivity}
          onDelete={handleDeleteActivityClick}
        />

        {/* Create Activity Modal */}
        <CreateActivityModal
          isOpen={state.createModalOpen}
          onClose={() => handleCloseModal('create')}
          onCreate={handleCreateActivity}
          loading={state.loading}
        />

        {/* Edit Activity Modal */}
        <EditActivityModal
          isOpen={state.editModalOpen}
          onClose={() => handleCloseModal('edit')}
          onUpdate={handleUpdateActivity}
          activity={state.selectedActivity}
          loading={state.loading}
        />

        {/* Delete Activity Modal */}
        <DeleteActivityModal
          isOpen={state.deleteModalOpen}
          onClose={() => handleCloseModal('delete')}
          onDelete={handleDeleteActivity}
          activity={state.selectedActivity}
          loading={state.loading}
        />
      </div>
    </DashboardLayout>
  );
};

export default ActivityManagementPage;
