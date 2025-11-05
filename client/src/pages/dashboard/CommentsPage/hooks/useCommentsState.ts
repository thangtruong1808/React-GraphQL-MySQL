import { useState } from 'react';
import { Comment } from '../../../../services/graphql/commentQueries';
import { DEFAULT_COMMENTS_PAGINATION } from '../../../../constants/commentManagement';
import { UseCommentsStateDependencies, CommentsPageState } from '../types';

/**
 * Custom hook for managing comments page state
 * Handles all state management including loading states for mutations
 */
export const useCommentsState = ({ initialPageSize }: UseCommentsStateDependencies) => {
  // Main state management
  const [state, setState] = useState<CommentsPageState>({
    comments: [],
    paginationInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
    },
    loading: false,
    searchTerm: '',
    currentPage: 1,
    pageSize: initialPageSize,
    createModalOpen: false,
    editModalOpen: false,
    deleteModalOpen: false,
    selectedComment: null,
    error: null,
  });

  // Sorting state - separate to prevent unnecessary re-renders
  const [sortBy, setSortBy] = useState(DEFAULT_COMMENTS_PAGINATION.sortBy);
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>(DEFAULT_COMMENTS_PAGINATION.sortOrder);
  const [isSorting, setIsSorting] = useState(false);

  // Loading states for mutations
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  return {
    state,
    setState,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    isSorting,
    setIsSorting,
    createLoading,
    setCreateLoading,
    updateLoading,
    setUpdateLoading,
    deleteLoading,
    setDeleteLoading,
  };
};

