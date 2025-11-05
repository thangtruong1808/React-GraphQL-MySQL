import { useState, useRef } from 'react';
import { ActivityManagementState } from '../../../../types/activityManagement';
import { DEFAULT_ACTIVITY_PAGINATION } from '../../../../constants/activityManagement';
import { UseActivityManagementStateDependencies } from '../types';

/**
 * Custom hook for managing activity management page state
 * Handles all state management including refs for debouncing
 */
export const useActivityManagementState = ({ initialPageSize }: UseActivityManagementStateDependencies) => {
  // Main state management
  const [state, setState] = useState<ActivityManagementState>({
    activities: [],
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
    selectedActivity: null,
    error: null,
  });

  // Sorting state
  const [sortBy, setSortBy] = useState<string>(DEFAULT_ACTIVITY_PAGINATION.sortBy);
  const [sortOrder, setSortOrder] = useState<string>(DEFAULT_ACTIVITY_PAGINATION.sortOrder);

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

