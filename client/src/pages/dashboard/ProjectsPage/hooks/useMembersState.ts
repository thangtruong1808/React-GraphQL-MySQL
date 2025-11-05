import { useState } from 'react';
import { UseMembersStateDependencies, MembersPageState } from '../types';

/**
 * Custom hook for managing members page state
 * Handles all state management for members tab
 */
export const useMembersState = ({ initialPageSize }: UseMembersStateDependencies) => {
  // Main state management
  const [state, setState] = useState<MembersPageState>({
    members: [],
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
    addModalOpen: false,
    removeModalOpen: false,
    updateRoleModalOpen: false,
    selectedMember: null,
    error: null,
  });

  // Member sorting state
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('DESC');

  return {
    state,
    setState,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  };
};

