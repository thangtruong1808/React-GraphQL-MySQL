import { useState } from 'react';
import { DEFAULT_TAGS_PAGINATION } from '../../../../constants/tagsManagement';
import { UseTagsStateDependencies, TagsPageState } from '../types';

/**
 * Custom hook for managing tags page state
 * Handles all state management for tags tab
 */
export const useTagsState = ({ initialPageSize }: UseTagsStateDependencies) => {
  // Main state management
  const [state, setState] = useState<TagsPageState>({
    tags: [],
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
    selectedTag: null,
    error: null,
  });

  // Sorting state
  const [sortBy, setSortBy] = useState(DEFAULT_TAGS_PAGINATION.sortBy);
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>(DEFAULT_TAGS_PAGINATION.sortOrder);

  return {
    state,
    setState,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  };
};

