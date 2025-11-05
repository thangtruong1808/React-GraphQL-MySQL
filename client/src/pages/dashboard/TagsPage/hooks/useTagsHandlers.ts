import { useCallback } from 'react';
import { Tag, TagInput, TagUpdateInput } from '../../../../types/tagsManagement';
import { TAGS_SUCCESS_MESSAGES, TAGS_ERROR_MESSAGES } from '../../../../constants/tagsManagement';
import { UseTagsHandlersDependencies } from '../types';

/**
 * Custom hook for managing event handlers for tags
 * Handles all user interactions and CRUD operations
 */
export const useTagsHandlers = ({
  state,
  sortBy,
  sortOrder,
  setState,
  setSortBy,
  setSortOrder,
  refetch,
  createTagMutation,
  updateTagMutation,
  deleteTagMutation,
  showNotification,
}: UseTagsHandlersDependencies) => {
  /**
   * Fetch tags with current parameters
   * Refetches data when pagination or search changes
   */
  const fetchTags = useCallback(async (page: number, pageSize: number, search: string) => {
    try {
      await refetch({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        search: search || undefined,
        sortBy,
        sortOrder,
      });
    } catch (error) {
      setState(prev => ({ ...prev, error: TAGS_ERROR_MESSAGES.FETCH }));
    }
  }, [refetch, sortBy, sortOrder, setState]);

  /**
   * Handle search query change
   * Updates search term and resets to first page
   */
  const handleSearchChange = useCallback((searchTerm: string) => {
    setState(prev => ({ ...prev, searchQuery: searchTerm, currentPage: 1 }));
  }, [setState]);

  /**
   * Handle page change
   * Updates current page and fetches data
   */
  const handlePageChange = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
    fetchTags(page, state.pageSize, state.searchQuery);
  }, [fetchTags, state.pageSize, state.searchQuery, setState]);

  /**
   * Handle page size change
   * Updates page size, resets to first page, and fetches data
   */
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setState(prev => ({ ...prev, pageSize: newPageSize, currentPage: 1 }));
    fetchTags(1, newPageSize, state.searchQuery);
  }, [fetchTags, state.searchQuery, setState]);

  /**
   * Handle column sorting
   * Updates sort parameters and resets to first page
   */
  const handleSort = useCallback((newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder as 'ASC' | 'DESC');
    setState(prev => ({ ...prev, currentPage: 1 }));
  }, [setSortBy, setSortOrder, setState]);

  /**
   * Create a new tag
   * Handles form submission and success/error states
   */
  const handleCreateTag = useCallback(async (input: TagInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await createTagMutation({ variables: { input } });
      setState(prev => ({ ...prev, createModalOpen: false, loading: false }));
      await refetch();
      showNotification(TAGS_SUCCESS_MESSAGES.CREATE, 'success');
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: TAGS_ERROR_MESSAGES.CREATE }));
      showNotification(error.message || TAGS_ERROR_MESSAGES.CREATE, 'error');
    }
  }, [createTagMutation, refetch, showNotification, setState]);

  /**
   * Update an existing tag
   * Handles form submission and success/error states
   */
  const handleUpdateTag = useCallback(async (id: string, input: TagUpdateInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await updateTagMutation({ variables: { id, input } });
      setState(prev => ({ ...prev, editModalOpen: false, loading: false, selectedTag: null }));
      await refetch();
      showNotification(TAGS_SUCCESS_MESSAGES.UPDATE, 'success');
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: TAGS_ERROR_MESSAGES.UPDATE }));
      showNotification(error.message || TAGS_ERROR_MESSAGES.UPDATE, 'error');
    }
  }, [updateTagMutation, refetch, showNotification, setState]);

  /**
   * Delete a tag
   * Handles deletion and success/error states
   */
  const handleDeleteTag = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await deleteTagMutation({ variables: { id } });
      setState(prev => ({ ...prev, deleteModalOpen: false, loading: false, selectedTag: null }));
      await refetch();
      showNotification(TAGS_SUCCESS_MESSAGES.DELETE, 'success');
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: TAGS_ERROR_MESSAGES.DELETE }));
      showNotification(error.message || TAGS_ERROR_MESSAGES.DELETE, 'error');
    }
  }, [deleteTagMutation, refetch, showNotification, setState]);

  /**
   * Handle edit tag click
   * Opens edit modal with selected tag
   */
  const handleEditTag = useCallback((tag: Tag) => {
    setState(prev => ({ ...prev, selectedTag: tag, editModalOpen: true }));
  }, [setState]);

  /**
   * Handle delete tag click
   * Opens delete modal with selected tag
   */
  const handleDeleteTagClick = useCallback((tag: Tag) => {
    setState(prev => ({ ...prev, selectedTag: tag, deleteModalOpen: true }));
  }, [setState]);

  /**
   * Close all modals
   * Resets modal states
   */
  const closeModals = useCallback(() => {
    setState(prev => ({ ...prev, createModalOpen: false, editModalOpen: false, deleteModalOpen: false, selectedTag: null }));
  }, [setState]);

  /**
   * Handle create tag click
   * Opens create modal
   */
  const handleCreateClick = useCallback(() => {
    setState(prev => ({ ...prev, createModalOpen: true }));
  }, [setState]);

  return {
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    handleCreateTag,
    handleUpdateTag,
    handleDeleteTag,
    handleEditTag,
    handleDeleteTagClick,
    closeModals,
    handleCreateClick,
    fetchTags,
  };
};

