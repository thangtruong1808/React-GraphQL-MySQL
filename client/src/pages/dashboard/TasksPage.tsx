import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { FaPlus } from 'react-icons/fa';
import { DashboardLayout } from '../../components/layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import { DashboardSkeleton } from '../../components/ui';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import AccessDenied from '../../components/auth/AccessDenied';
import {
  TaskSearchInput,
  TasksTable,
  CreateTaskModal,
  EditTaskModal,
  DeleteTaskModal
} from '../../components/taskManagement';
import {
  GET_DASHBOARD_TASKS_QUERY,
  CREATE_TASK_MUTATION,
  UPDATE_TASK_MUTATION,
  DELETE_TASK_MUTATION,
  CHECK_TASK_DELETION_QUERY
} from '../../services/graphql/taskQueries';
import {
  Task,
  TaskInput,
  TaskUpdateInput,
  TaskManagementState
} from '../../types/taskManagement';
import {
  DEFAULT_TASKS_PAGINATION,
  TASK_SUCCESS_MESSAGES,
  TASK_ERROR_MESSAGES
} from '../../constants/taskManagement';
import { InlineError } from '../../components/ui';

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
  const navigate = useNavigate();
  const { isInitializing, showNotification } = useAuth();
  const { canCreate, canEdit, canDelete, hasDashboardAccess } = useRolePermissions();

  // State management
  const [state, setState] = useState<TaskManagementState>({
    tasks: [],
    paginationInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      totalCount: 0,
      currentPage: 1,
      totalPages: 0
    },
    loading: false,
    searchQuery: '',
    currentPage: 1,
    pageSize: DEFAULT_TASKS_PAGINATION.limit,
    createModalOpen: false,
    editModalOpen: false,
    deleteModalOpen: false,
    selectedTask: null,
    error: null
  });

  // Sorting state
  const [sortBy, setSortBy] = useState<string>(DEFAULT_TASKS_PAGINATION.sortBy);
  const [sortOrder, setSortOrder] = useState<string>(DEFAULT_TASKS_PAGINATION.sortOrder);

  // Request cancellation ref to prevent race conditions
  const abortControllerRef = useRef<AbortController | null>(null);
  // Timeout ref for debouncing pagination
  const paginationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // GraphQL queries and mutations
  const { data, loading: queryLoading, refetch } = useQuery(GET_DASHBOARD_TASKS_QUERY, {
    variables: {
      limit: state.pageSize,
      offset: (state.currentPage - 1) * state.pageSize,
      search: state.searchQuery || undefined,
      sortBy,
      sortOrder
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    skip: isInitializing || !hasDashboardAccess
  });

  const [createTaskMutation] = useMutation(CREATE_TASK_MUTATION);
  const [updateTaskMutation] = useMutation(UPDATE_TASK_MUTATION);
  const [deleteTaskMutation] = useMutation(DELETE_TASK_MUTATION);
  const { data: deletionData, refetch: refetchDeletion } = useQuery(CHECK_TASK_DELETION_QUERY, {
    variables: { taskId: state.selectedTask?.id || '' },
    skip: !state.deleteModalOpen || !state.selectedTask,
    fetchPolicy: 'network-only'
  });

  /**
   * Update state when GraphQL data changes
   * Handles loading states and data updates
   */
  useEffect(() => {
    if (data?.dashboardTasks) {
      setState(prev => ({
        ...prev,
        tasks: data.dashboardTasks.tasks,
        paginationInfo: data.dashboardTasks.paginationInfo,
        loading: queryLoading
      }));
    } else {
      setState(prev => ({
        ...prev,
        loading: queryLoading
      }));
    }
  }, [data, queryLoading]);

  /**
   * Cleanup effect to cancel pending requests and timeouts on unmount
   */
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (paginationTimeoutRef.current) {
        clearTimeout(paginationTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Fetch tasks with current parameters
   * Refetches data when pagination or search changes
   * Includes request cancellation to prevent race conditions
   */
  const fetchTasks = useCallback(async (page: number, pageSize: number, search: string) => {
    try {
      // Cancel any previous request to prevent race conditions
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      await refetch({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        search: search || undefined,
        sortBy,
        sortOrder
      });

      // Clear the abort controller if request completed successfully
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    } catch (error: any) {
      // Don't show error if request was aborted (user navigated away quickly)
      if (error.name === 'AbortError') {
        return;
      }

      setState(prev => ({
        ...prev,
        error: TASK_ERROR_MESSAGES.FETCH
      }));
    }
  }, [refetch, sortBy, sortOrder]);

  /**
   * Handle search query change
   * Debounced search with pagination reset
   */
  const handleSearchChange = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query, currentPage: 1 }));
  }, []);

  /**
   * Handle page size change
   * Resets to first page when changing page size
   */
  const handlePageSizeChange = useCallback((pageSize: number) => {
    setState(prev => ({ ...prev, pageSize, currentPage: 1 }));
    fetchTasks(1, pageSize, state.searchQuery);
  }, [fetchTasks, state.searchQuery]);

  /**
   * Handle column sorting
   * Updates sort parameters and resets to first page
   */
  const handleSort = useCallback((newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setState(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  /**
   * Handle page change
   * Navigates to specified page with debouncing to prevent rapid requests
   */
  const handlePageChange = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));

    // Clear any existing timeout
    if (paginationTimeoutRef.current) {
      clearTimeout(paginationTimeoutRef.current);
    }

    // Set new timeout to debounce rapid page changes
    paginationTimeoutRef.current = setTimeout(() => {
      fetchTasks(page, state.pageSize, state.searchQuery);
    }, 100); // 100ms debounce
  }, [fetchTasks, state.pageSize, state.searchQuery]);

  /**
   * Create a new task
   * Handles form submission and success/error states
   */
  const handleCreateTask = useCallback(async (taskData: TaskInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const result = await createTaskMutation({
        variables: { input: taskData }
      });

      // Only show success if we actually got data back
      if (result.data?.createTask) {
        setState(prev => ({ ...prev, createModalOpen: false, loading: false }));
        showNotification(TASK_SUCCESS_MESSAGES.CREATE, 'success');
        await refetch({
          limit: state.pageSize,
          offset: (state.currentPage - 1) * state.pageSize,
          search: state.searchQuery || undefined,
          sortBy,
          sortOrder
        });
      } else {
        throw new Error('Task creation failed - no data returned');
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: TASK_ERROR_MESSAGES.CREATE
      }));
      showNotification(error.message || TASK_ERROR_MESSAGES.CREATE, 'error');
    }
  }, [createTaskMutation, refetch, showNotification]);

  /**
   * Update an existing task
   * Handles form submission and success/error states
   */
  const handleUpdateTask = useCallback(async (taskId: string, taskData: TaskUpdateInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const result = await updateTaskMutation({
        variables: { id: taskId, input: taskData }
      });

      // Only show success if we actually got data back
      if (result.data?.updateTask) {
        setState(prev => ({ ...prev, editModalOpen: false, loading: false }));
        showNotification(TASK_SUCCESS_MESSAGES.UPDATE, 'success');
        await refetch({
          limit: state.pageSize,
          offset: (state.currentPage - 1) * state.pageSize,
          search: state.searchQuery || undefined,
          sortBy,
          sortOrder
        });
      } else {
        throw new Error('Task update failed - no data returned');
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: TASK_ERROR_MESSAGES.UPDATE
      }));
      showNotification(error.message || TASK_ERROR_MESSAGES.UPDATE, 'error');
    }
  }, [updateTaskMutation, refetch, showNotification]);

  /**
   * Delete a task
   * Handles confirmation and success/error states
   */
  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const result = await deleteTaskMutation({
        variables: { id: taskId }
      });

      // Only show success if we actually got data back
      if (result.data?.deleteTask !== undefined) {
        setState(prev => ({ ...prev, deleteModalOpen: false, loading: false }));
        showNotification(TASK_SUCCESS_MESSAGES.DELETE, 'success');
        await refetch({
          limit: state.pageSize,
          offset: (state.currentPage - 1) * state.pageSize,
          search: state.searchQuery || undefined,
          sortBy,
          sortOrder
        });
      } else {
        throw new Error('Task deletion failed - no data returned');
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: TASK_ERROR_MESSAGES.DELETE
      }));
      showNotification(error.message || TASK_ERROR_MESSAGES.DELETE, 'error');
    }
  }, [deleteTaskMutation, refetch, showNotification]);

  /**
   * Clear error message
   * Removes error state from UI
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

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
        <div className="bg-white border-b border-gray-200 w-full">
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Tasks Management
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Manage and track your tasks
                </p>
              </div>
              {canCreate && (
                /* Create Button - Centered icon and text for better mobile UX when sidebar is collapsed */
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 w-full sm:w-auto sm:flex-shrink-0"
                  onClick={() => setState(prev => ({ ...prev, createModalOpen: true }))}
                >
                  <FaPlus className="h-5 w-5" aria-hidden="true" />
                  <span className="hidden xs:inline ml-2">Create Task</span>
                  <span className="xs:hidden ml-2">Create</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <div className="px-8 py-8 w-full">
            {/* Error Display */}
            {state.error && (
              <div className="mb-6">
                <InlineError message={state.error} onDismiss={clearError} />
              </div>
            )}

            {/* Search and Table */}
            <div className="space-y-6">
              {/* Search Input */}
              <TaskSearchInput
                value={state.searchQuery}
                onChange={handleSearchChange}
                loading={state.loading}
              />

              {/* Tasks Table */}
              <TasksTable
                tasks={state.tasks}
                paginationInfo={state.paginationInfo}
                loading={state.loading}
                onEdit={canEdit ? (task) => setState(prev => ({
                  ...prev,
                  editModalOpen: true,
                  selectedTask: task
                })) : undefined}
                onDelete={canDelete ? async (task) => {
                  setState(prev => ({ ...prev, deleteModalOpen: true, selectedTask: task }));
                  try {
                    await refetchDeletion({ taskId: task.id });
                  } catch { }
                } : undefined}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                currentPageSize={state.pageSize}
                onSort={handleSort}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
              />
            </div>
          </div>
        </div>

        {/* Modals - Only show for users with CRUD permissions */}
        {canCreate && (
          <CreateTaskModal
            isOpen={state.createModalOpen}
            onClose={() => setState(prev => ({ ...prev, createModalOpen: false }))}
            onSubmit={handleCreateTask}
            loading={state.loading}
          />
        )}

        {canEdit && (
          <EditTaskModal
            isOpen={state.editModalOpen}
            task={state.selectedTask}
            onClose={() => setState(prev => ({ ...prev, editModalOpen: false, selectedTask: null }))}
            onSubmit={handleUpdateTask}
            loading={state.loading}
          />
        )}

        {canDelete && (
          <DeleteTaskModal
            isOpen={state.deleteModalOpen}
            task={state.selectedTask}
            onClose={() => setState(prev => ({ ...prev, deleteModalOpen: false, selectedTask: null }))}
            onConfirm={handleDeleteTask}
            loading={state.loading}
            deletionCheck={deletionData?.checkTaskDeletion || null}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default TasksPage;