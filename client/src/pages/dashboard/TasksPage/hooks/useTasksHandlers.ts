import { useCallback, useEffect } from 'react';
import { TaskInput, TaskUpdateInput } from '../../../../types/taskManagement';
import { TASK_SUCCESS_MESSAGES, TASK_ERROR_MESSAGES } from '../../../../constants/taskManagement';
import { UseTasksHandlersDependencies } from '../types';

/**
 * Custom hook for managing event handlers for tasks
 * Handles all user interactions and CRUD operations
 */
export const useTasksHandlers = ({
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
}: UseTasksHandlersDependencies) => {
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
  }, [abortControllerRef, paginationTimeoutRef]);

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
        sortOrder,
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
        error: TASK_ERROR_MESSAGES.FETCH,
      }));
    }
  }, [refetch, sortBy, sortOrder, setState, abortControllerRef]);

  /**
   * Handle search query change
   * Debounced search with pagination reset
   */
  const handleSearchChange = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query, currentPage: 1 }));
  }, [setState]);

  /**
   * Handle page size change
   * Resets to first page when changing page size
   */
  const handlePageSizeChange = useCallback((pageSize: number) => {
    setState(prev => ({ ...prev, pageSize, currentPage: 1 }));
    fetchTasks(1, pageSize, state.searchQuery);
  }, [fetchTasks, state.searchQuery, setState]);

  /**
   * Handle column sorting
   * Updates sort parameters and resets to first page
   */
  const handleSort = useCallback((newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setState(prev => ({ ...prev, currentPage: 1 }));
  }, [setSortBy, setSortOrder, setState]);

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
  }, [fetchTasks, state.pageSize, state.searchQuery, setState, paginationTimeoutRef]);

  /**
   * Refetch tasks after mutation
   * Helper function to refetch tasks list after CRUD operations
   */
  const refetchTasks = useCallback(async () => {
    await refetch({
      limit: state.pageSize,
      offset: (state.currentPage - 1) * state.pageSize,
      search: state.searchQuery || undefined,
      sortBy,
      sortOrder,
    });
  }, [refetch, state.pageSize, state.currentPage, state.searchQuery, sortBy, sortOrder]);

  /**
   * Create a new task
   * Handles form submission and success/error states
   */
  const handleCreateTask = useCallback(async (taskData: TaskInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const result = await createTaskMutation({
        variables: { input: taskData },
      });

      // Only show success if we actually got data back
      if (result.data?.createTask) {
        setState(prev => ({ ...prev, createModalOpen: false, loading: false }));
        showNotification(TASK_SUCCESS_MESSAGES.CREATE, 'success');
        await refetchTasks();
      } else {
        throw new Error('Task creation failed - no data returned');
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: TASK_ERROR_MESSAGES.CREATE,
      }));
      showNotification(error.message || TASK_ERROR_MESSAGES.CREATE, 'error');
    }
  }, [createTaskMutation, showNotification, refetchTasks, setState]);

  /**
   * Update an existing task
   * Handles form submission and success/error states
   */
  const handleUpdateTask = useCallback(async (taskId: string, taskData: TaskUpdateInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const result = await updateTaskMutation({
        variables: { id: taskId, input: taskData },
      });

      // Only show success if we actually got data back
      if (result.data?.updateTask) {
        setState(prev => ({ ...prev, editModalOpen: false, loading: false, selectedTask: null }));
        showNotification(TASK_SUCCESS_MESSAGES.UPDATE, 'success');
        await refetchTasks();
      } else {
        throw new Error('Task update failed - no data returned');
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: TASK_ERROR_MESSAGES.UPDATE,
      }));
      showNotification(error.message || TASK_ERROR_MESSAGES.UPDATE, 'error');
    }
  }, [updateTaskMutation, showNotification, refetchTasks, setState]);

  /**
   * Delete a task
   * Handles confirmation and success/error states
   */
  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const result = await deleteTaskMutation({
        variables: { id: taskId },
      });

      // Only show success if we actually got data back
      if (result.data?.deleteTask !== undefined) {
        setState(prev => ({ ...prev, deleteModalOpen: false, loading: false, selectedTask: null }));
        showNotification(TASK_SUCCESS_MESSAGES.DELETE, 'success');
        await refetchTasks();
      } else {
        throw new Error('Task deletion failed - no data returned');
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: TASK_ERROR_MESSAGES.DELETE,
      }));
      showNotification(error.message || TASK_ERROR_MESSAGES.DELETE, 'error');
    }
  }, [deleteTaskMutation, showNotification, refetchTasks, setState]);

  /**
   * Handle edit task click
   * Opens edit modal with selected task
   */
  const handleEditTask = useCallback((task: any) => {
    setState(prev => ({
      ...prev,
      editModalOpen: true,
      selectedTask: task,
    }));
  }, [setState]);

  /**
   * Handle delete task click
   * Opens delete modal with selected task and fetches deletion check
   */
  const handleDeleteTaskClick = useCallback(async (task: any) => {
    setState(prev => ({ ...prev, deleteModalOpen: true, selectedTask: task }));
    try {
      await refetchDeletion({ taskId: task.id });
    } catch {
      // Error handling is done in parent component
    }
  }, [setState, refetchDeletion]);

  /**
   * Clear error message
   * Removes error state from UI
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, [setState]);

  /**
   * Handle create task click
   * Opens create modal
   */
  const handleCreateClick = useCallback(() => {
    setState(prev => ({ ...prev, createModalOpen: true }));
  }, [setState]);

  /**
   * Close modals
   * Resets modal states
   */
  const closeModals = useCallback((modalType?: 'create' | 'edit' | 'delete') => {
    if (modalType === 'create') {
      setState(prev => ({ ...prev, createModalOpen: false }));
    } else if (modalType === 'edit') {
      setState(prev => ({ ...prev, editModalOpen: false, selectedTask: null }));
    } else if (modalType === 'delete') {
      setState(prev => ({ ...prev, deleteModalOpen: false, selectedTask: null }));
    } else {
      setState(prev => ({
        ...prev,
        createModalOpen: false,
        editModalOpen: false,
        deleteModalOpen: false,
        selectedTask: null,
      }));
    }
  }, [setState]);

  return {
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
  };
};
