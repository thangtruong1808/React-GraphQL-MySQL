import { useCallback, useEffect } from 'react';
import { Comment } from '../../../../services/graphql/commentQueries';
import { CommentFormData } from '../../../../types/commentManagement';
import { UseCommentsHandlersDependencies } from '../types';

/**
 * Custom hook for managing event handlers
 * Handles all user interactions and CRUD operations
 */
export const useCommentsHandlers = ({
  state,
  sortBy,
  sortOrder,
  isSorting,
  setState,
  setSortBy,
  setSortOrder,
  setIsSorting,
  setCreateLoading,
  setUpdateLoading,
  setDeleteLoading,
  refetch,
  createCommentMutation,
  updateCommentMutation,
  deleteCommentMutation,
  showNotification,
  user,
  hasDashboardAccess,
  isInitializing,
}: UseCommentsHandlersDependencies) => {
  /**
   * Fetch comments with current parameters
   * Refetches data when pagination or search changes
   */
  const fetchComments = useCallback(
    async (page: number, pageSize: number, search: string) => {
      // Only fetch if user is authenticated and has access
      if (!user || !hasDashboardAccess || isInitializing) {
        return;
      }

      try {
        await refetch({
          limit: pageSize,
          offset: (page - 1) * pageSize,
          search: search || undefined,
          sortBy,
          sortOrder,
        });
      } catch (error) {
        // Only show error if not during auth initialization
        if (!isInitializing) {
          setState((prev) => ({
            ...prev,
            error: 'Failed to fetch comments',
          }));
        }
      }
    },
    [refetch, sortBy, sortOrder, user, hasDashboardAccess, isInitializing, setState]
  );

  /**
   * Handle search and pagination changes
   * Triggers refetch when search term or page changes
   */
  useEffect(() => {
    if (isSorting) return; // avoid duplicate refetch when sorting already refetched
    fetchComments(state.currentPage, state.pageSize, state.searchTerm);
  }, [state.currentPage, state.searchTerm, fetchComments, isSorting]);

  /**
   * Handle search
   * Updates search term and resets to first page
   */
  const handleSearch = useCallback(
    (search: string) => {
      setState((prev) => ({ ...prev, searchTerm: search, currentPage: 1 }));
    },
    [setState]
  );

  /**
   * Handle sort - optimized to prevent unnecessary re-renders
   * Updates sort parameters and refetches data
   */
  const handleSort = useCallback(
    async (newSortBy: string, newSortOrder: string) => {
      setIsSorting(true);
      setSortBy(newSortBy);
      // Cast to 'ASC' | 'DESC' to match state type - values are validated by CommentsTable component
      setSortOrder(newSortOrder as 'ASC' | 'DESC');
      setState((prev) => ({ ...prev, currentPage: 1 }));

      try {
        await refetch({
          limit: state.pageSize,
          offset: 0,
          search: state.searchTerm || undefined,
          sortBy: newSortBy,
          sortOrder: newSortOrder,
        });
      } catch {
        // errors handled by error effect
      } finally {
        setIsSorting(false);
      }
    },
    [refetch, state.pageSize, state.searchTerm, setState, setSortBy, setSortOrder, setIsSorting]
  );

  /**
   * Handle page change
   * Updates current page
   */
  const handlePageChange = useCallback(
    (page: number) => {
      setState((prev) => ({ ...prev, currentPage: page }));
    },
    [setState]
  );

  /**
   * Handle page size change
   * Updates page size and resets to first page
   */
  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setState((prev) => ({ ...prev, pageSize: newPageSize, currentPage: 1 }));
      fetchComments(1, newPageSize, state.searchTerm);
    },
    [fetchComments, setState, state.searchTerm]
  );

  /**
   * Handle edit comment
   * Opens edit modal with selected comment
   */
  const handleEdit = useCallback(
    (comment: Comment) => {
      setState((prev) => ({
        ...prev,
        selectedComment: comment,
        editModalOpen: true,
      }));
    },
    [setState]
  );

  /**
   * Handle delete comment
   * Opens delete modal with selected comment
   */
  const handleDelete = useCallback(
    (comment: Comment) => {
      setState((prev) => ({
        ...prev,
        selectedComment: comment,
        deleteModalOpen: true,
      }));
    },
    [setState]
  );

  /**
   * Handle create comment
   * Creates new comment and shows success notification
   */
  const handleCreateComment = useCallback(
    async (formData: CommentFormData) => {
      setCreateLoading(true);
      try {
        await createCommentMutation({
          variables: {
            input: {
              content: formData.content,
              projectId: formData.projectId,
            },
          },
        });

        showNotification('Comment created successfully', 'success');
        setState((prev) => ({ ...prev, createModalOpen: false }));
        refetch();
      } catch (error: any) {
        showNotification(error.message || 'Failed to create comment', 'error');
      } finally {
        setCreateLoading(false);
      }
    },
    [createCommentMutation, showNotification, refetch, setState, setCreateLoading]
  );

  /**
   * Handle update comment
   * Updates existing comment and shows success notification
   */
  const handleUpdateComment = useCallback(
    async (formData: CommentFormData) => {
      if (!state.selectedComment) return;

      setUpdateLoading(true);
      try {
        await updateCommentMutation({
          variables: {
            id: state.selectedComment.id,
            input: {
              content: formData.content,
            },
          },
        });

        showNotification('Comment updated successfully', 'success');
        setState((prev) => ({ ...prev, editModalOpen: false, selectedComment: null }));
        refetch();
      } catch (error: any) {
        showNotification(error.message || 'Failed to update comment', 'error');
      } finally {
        setUpdateLoading(false);
      }
    },
    [state.selectedComment, updateCommentMutation, showNotification, refetch, setState, setUpdateLoading]
  );

  /**
   * Handle delete comment
   * Deletes comment and shows success notification
   */
  const handleDeleteComment = useCallback(
    async () => {
      if (!state.selectedComment) return;

      setDeleteLoading(true);
      try {
        await deleteCommentMutation({
          variables: {
            id: state.selectedComment.id,
          },
        });

        showNotification('Comment deleted successfully', 'success');
        setState((prev) => ({ ...prev, deleteModalOpen: false, selectedComment: null }));
        refetch();
      } catch (error: any) {
        showNotification(error.message || 'Failed to delete comment', 'error');
      } finally {
        setDeleteLoading(false);
      }
    },
    [state.selectedComment, deleteCommentMutation, showNotification, refetch, setState, setDeleteLoading]
  );

  /**
   * Handle modal close
   * Closes all modals and clears selected comment
   */
  const handleCloseModals = useCallback(() => {
    setState((prev) => ({
      ...prev,
      createModalOpen: false,
      editModalOpen: false,
      deleteModalOpen: false,
      selectedComment: null,
    }));
  }, [setState]);

  /**
   * Handle create modal open
   * Opens create modal
   */
  const handleCreateClick = useCallback(() => {
    setState((prev) => ({ ...prev, createModalOpen: true }));
  }, [setState]);

  return {
    handleSearch,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    handleEdit,
    handleDelete,
    handleCreateComment,
    handleUpdateComment,
    handleDeleteComment,
    handleCloseModals,
    handleCreateClick,
  };
};

