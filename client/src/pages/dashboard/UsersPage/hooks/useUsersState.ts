import { useState } from 'react';
import { DEFAULT_USERS_PAGINATION } from '../../../../constants/userManagement';
import { UserManagementState } from '../../../../types/userManagement';
import { UseUsersStateDependencies } from '../types';

/**
 * Custom hook for managing users page state
 * Handles all state management for users tab
 */
export const useUsersState = ({ initialPageSize }: UseUsersStateDependencies) => {
  // Main state management
  const [state, setState] = useState<UserManagementState>({
    users: [],
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
    selectedUser: null,
    error: null,
  });

  // Sorting state
  const [sortBy, setSortBy] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<string>('ASC');

  return {
    state,
    setState,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  };
};

