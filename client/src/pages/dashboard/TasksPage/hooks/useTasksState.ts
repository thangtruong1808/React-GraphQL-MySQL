import { useState, useRef } from 'react';
import { DEFAULT_TASKS_PAGINATION } from '../../../../constants/taskManagement';
import { TaskManagementState } from '../../../../types/taskManagement';
import { UseTasksStateDependencies } from '../types';

/**
 * Custom hook for managing tasks page state
 * Handles all state management for tasks tab
 */
export const useTasksState = ({ initialPageSize }: UseTasksStateDependencies) => {
  // Main state management
  const [state, setState] = useState<TaskManagementState>({
    tasks: [],
    paginationInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
    },
    loading: false,
    searchQuery: '',
    currentPage: 1,
    pageSize: initialPageSize,
    createModalOpen: false,
    editModalOpen: false,
    deleteModalOpen: false,
    selectedTask: null,
    error: null,
  });

  // Sorting state
  const [sortBy, setSortBy] = useState<string>(DEFAULT_TASKS_PAGINATION.sortBy);
  const [sortOrder, setSortOrder] = useState<string>(DEFAULT_TASKS_PAGINATION.sortOrder);

  // Request cancellation ref to prevent race conditions
  const abortControllerRef = useRef<AbortController | null>(null);
  // Timeout ref for debouncing pagination
  const paginationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  return {
    state,
    setState,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    abortControllerRef,
    paginationTimeoutRef,
  };
};

