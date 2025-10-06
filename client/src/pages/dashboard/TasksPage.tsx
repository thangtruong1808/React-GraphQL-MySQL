import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { FaPlus } from 'react-icons/fa';
import { DashboardLayout } from '../../components/layout';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../../constants/routingConstants';
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
  DELETE_TASK_MUTATION
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
 * 
 * CALLED BY: AppRoutes component via ProtectedRoute
 * SCENARIOS: Task management for administrators and project managers
 */
const TasksPage: React.FC = () => {
  const navigate = useNavigate();

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
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('DESC');

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
    notifyOnNetworkStatusChange: true
  });

  const [createTaskMutation] = useMutation(CREATE_TASK_MUTATION);
  const [updateTaskMutation] = useMutation(UPDATE_TASK_MUTATION);
  const [deleteTaskMutation] = useMutation(DELETE_TASK_MUTATION);

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
   * Fetch tasks with current parameters
   * Refetches data when pagination or search changes
   */
  const fetchTasks = useCallback(async (page: number, pageSize: number, search: string) => {
    try {
      await refetch({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        search: search || undefined,
        sortBy,
        sortOrder
      });
    } catch (error) {
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
   * Navigates to specified page
   */
  const handlePageChange = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
    fetchTasks(page, state.pageSize, state.searchQuery);
  }, [fetchTasks, state.pageSize, state.searchQuery]);

  /**
   * Create a new task
   * Handles form submission and success/error states
   */
  const handleCreateTask = useCallback(async (taskData: TaskInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await createTaskMutation({
        variables: { input: taskData }
      });

      setState(prev => ({ ...prev, createModalOpen: false, loading: false }));
      await refetch();
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: TASK_ERROR_MESSAGES.CREATE
      }));
    }
  }, [createTaskMutation, refetch]);

  /**
   * Update an existing task
   * Handles form submission and success/error states
   */
  const handleUpdateTask = useCallback(async (taskId: string, taskData: TaskUpdateInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await updateTaskMutation({
        variables: { id: taskId, input: taskData }
      });

      setState(prev => ({ ...prev, editModalOpen: false, loading: false }));
      await refetch();
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: TASK_ERROR_MESSAGES.UPDATE
      }));
    }
  }, [updateTaskMutation, refetch]);

  /**
   * Delete a task
   * Handles confirmation and success/error states
   */
  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await deleteTaskMutation({
        variables: { id: taskId }
      });

      setState(prev => ({ ...prev, deleteModalOpen: false, loading: false }));
      await refetch();
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: TASK_ERROR_MESSAGES.DELETE
      }));
    }
  }, [deleteTaskMutation, refetch]);

  /**
   * Clear error message
   * Removes error state from UI
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return (
    <DashboardLayout>
      <div className="w-full h-full dashboard-content">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 w-full">
          <div className="px-8 py-8 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Tasks Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and track your tasks
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                onClick={() => setState(prev => ({ ...prev, createModalOpen: true }))}
              >
                <FaPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Create Task
              </button>
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
                onEdit={(task) => setState(prev => ({
                  ...prev,
                  editModalOpen: true,
                  selectedTask: task
                }))}
                onDelete={(task) => setState(prev => ({
                  ...prev,
                  deleteModalOpen: true,
                  selectedTask: task
                }))}
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

        {/* Modals */}
        <CreateTaskModal
          isOpen={state.createModalOpen}
          onClose={() => setState(prev => ({ ...prev, createModalOpen: false }))}
          onSubmit={handleCreateTask}
          loading={state.loading}
        />

        <EditTaskModal
          isOpen={state.editModalOpen}
          task={state.selectedTask}
          onClose={() => setState(prev => ({ ...prev, editModalOpen: false, selectedTask: null }))}
          onSubmit={handleUpdateTask}
          loading={state.loading}
        />

        <DeleteTaskModal
          isOpen={state.deleteModalOpen}
          task={state.selectedTask}
          onClose={() => setState(prev => ({ ...prev, deleteModalOpen: false, selectedTask: null }))}
          onConfirm={handleDeleteTask}
          loading={state.loading}
        />
      </div>
    </DashboardLayout>
  );
};

export default TasksPage;