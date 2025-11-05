import { useState } from 'react';
import { DEFAULT_PROJECTS_PAGINATION } from '../../../../constants/projectManagement';
import { UseProjectsStateDependencies, ProjectsPageState } from '../types';

/**
 * Custom hook for managing projects page state
 * Handles all state management for projects tab
 */
export const useProjectsState = ({ initialPageSize }: UseProjectsStateDependencies) => {
  // Main state management
  const [state, setState] = useState<ProjectsPageState>({
    projects: [],
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
    selectedProject: null,
    error: null,
  });

  // Sorting state - Sort by ID ASC so new projects appear at bottom
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

