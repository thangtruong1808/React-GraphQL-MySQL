import { useState } from 'react';
import { ActivityManagementState } from '../../../../types/activityManagement';
import { DEFAULT_ACTIVITY_PAGINATION } from '../../../../constants/activityManagement';
import { UseActivitiesStateDependencies } from '../types';

/**
 * Custom hook for managing activities page state
 * Handles all state management for activities page
 */
export const useActivitiesState = ({ initialPageSize }: UseActivitiesStateDependencies) => {
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

  return {
    state,
    setState,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  };
};

