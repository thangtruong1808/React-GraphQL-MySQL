import React from 'react';
import AccessDenied from '../../components/auth/AccessDenied';
import { DashboardLayout } from '../../components/layout';
import { DashboardSkeleton, InlineError } from '../../components/ui';
import { DEFAULT_TASKS_PAGINATION } from '../../constants/taskManagement';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthDataReady } from '../../hooks/useAuthDataReady';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { TasksHeader, TasksContent, TasksModals } from './TasksPage/components';
import {
  useTasksState,
  useTasksQueries,
  useTaskDeletionCheck,
  useTasksMutations,
  useTasksHandlers,
} from './TasksPage/hooks';

/**
 * Tasks Dashboard Page
 * Complete task management interface with search, table, and CRUD operations
 * Features modern, professional layout with pagination and real-time search
 * Features responsive design with improved mobile UX when sidebar is collapsed
 *
 * CALLED BY: AppRoutes component via ProtectedRoute
 * SCENARIOS: Task management for administrators and project managers
 */
const TasksPage: React.FC = () => {
  const { isInitializing, showNotification } = useAuth();
  const { canCreate, canEdit, canDelete, hasDashboardAccess } = useRolePermissions();
  const isAuthDataReady = useAuthDataReady();

  // State management
  const {
    state,
    setState,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    abortControllerRef,
    paginationTimeoutRef,
  } = useTasksState({
    initialPageSize: DEFAULT_TASKS_PAGINATION.limit,
  });

  // GraphQL queries
  const { queryLoading, refetch } = useTasksQueries({
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

  // Task deletion check query
  const { deletionData, refetchDeletion } = useTaskDeletionCheck(
    state.deleteModalOpen,
    state.selectedTask?.id || null
  );

  // GraphQL mutations
  const { createTaskMutation, updateTaskMutation, deleteTaskMutation } = useTasksMutations();

  // Event handlers
  const {
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleEditTask,
    handleDeleteTaskClick,
    clearError,
    handleCreateClick,
    closeModals,
  } = useTasksHandlers({
    state,
    sortBy,
    sortOrder,
    setState,
    setSortBy,
    setSortOrder,
    refetch,
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    refetchDeletion,
    showNotification,
    abortControllerRef,
    paginationTimeoutRef,
  });

  // During auth initialization, show skeleton to avoid Access Denied flash
  if (isInitializing) {
    return <DashboardSkeleton />;
  }

  // Check if user has dashboard access
  if (!hasDashboardAccess) {
    return <AccessDenied feature="Tasks Management" />;
  }

  // Show unified skeleton during loading (both sidebar and content)
  if (queryLoading && (!state.tasks || state.tasks.length === 0)) {
    return <DashboardSkeleton />;
  }

  return (
    <DashboardLayout showSidebarSkeleton={false}>
      <div className="w-full h-full dashboard-content">
        {/* Header Section */}
        <TasksHeader canCreate={canCreate} onCreateClick={handleCreateClick} />

        {/* Main Content */}
        <TasksContent
          state={state}
          sortBy={sortBy}
          sortOrder={sortOrder}
          canEdit={canEdit}
          canDelete={canDelete}
          onSearchChange={handleSearchChange}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSort={handleSort}
          onEdit={handleEditTask}
          onDelete={handleDeleteTaskClick}
        />

        {/* Error Display */}
        {state.error && (
          <div className="px-4 sm:px-6 lg:px-8 pb-6">
            <InlineError message={state.error} onDismiss={clearError} />
          </div>
        )}

        {/* Modals */}
        <TasksModals
          state={state}
          canCreate={canCreate}
          canEdit={canEdit}
          canDelete={canDelete}
          deletionCheck={deletionData?.checkTaskDeletion || null}
          onCreateTask={handleCreateTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onCloseModals={closeModals}
        />
      </div>
    </DashboardLayout>
  );
};

export default TasksPage;
