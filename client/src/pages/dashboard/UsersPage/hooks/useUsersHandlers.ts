import { useCallback } from 'react';
import { UserInput, UserUpdateInput } from '../../../../types/userManagement';
import { USER_SUCCESS_MESSAGES, USER_ERROR_MESSAGES } from '../../../../constants/userManagement';
import { UseUsersHandlersDependencies } from '../types';

/**
 * Custom hook for managing event handlers for users
 * Handles all user interactions and CRUD operations
 */
export const useUsersHandlers = ({
  state,
  sortBy,
  sortOrder,
  setState,
  setSortBy,
  setSortOrder,
  refetch,
  createUserMutation,
  updateUserMutation,
  deleteUserMutation,
  checkUserDeletion,
  showNotification,
  setDeletionCheck,
}: UseUsersHandlersDependencies) => {
  /**
   * Fetch users with current parameters
   * Refetches data when pagination or search changes
   */
  const fetchUsers = useCallback(async (page: number, pageSize: number, search: string) => {
    try {
      await refetch({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        search: search || undefined,
        sortBy,
        sortOrder,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: USER_ERROR_MESSAGES.FETCH,
      }));
    }
  }, [refetch, sortBy, sortOrder, setState]);

  /**
   * Handle search query change
   * Debounced search with pagination reset
   */
  const handleSearchChange = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query, currentPage: 1 }));
  }, [setState]);

  /**
   * Handle page size change
   * Resets to first page when changing page size
   */
  const handlePageSizeChange = useCallback((pageSize: number) => {
    setState(prev => ({ ...prev, pageSize, currentPage: 1 }));
    fetchUsers(1, pageSize, state.searchQuery);
  }, [fetchUsers, state.searchQuery, setState]);

  /**
   * Handle column sorting
   * Updates sort parameters and resets to first page
   */
  const handleSort = useCallback((newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setState(prev => ({ ...prev, currentPage: 1 }));
  }, [setSortBy, setSortOrder, setState]);

  /**
   * Handle page change
   * Navigates to specified page
   */
  const handlePageChange = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
    fetchUsers(page, state.pageSize, state.searchQuery);
  }, [fetchUsers, state.pageSize, state.searchQuery, setState]);

  /**
   * Create a new user
   * Handles form submission and success/error states
   */
  const handleCreateUser = useCallback(async (userData: UserInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await createUserMutation({
        variables: { input: userData },
      });

      setState(prev => ({ ...prev, createModalOpen: false, loading: false }));
      await refetch();
      showNotification(USER_SUCCESS_MESSAGES.CREATE, 'success');
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: USER_ERROR_MESSAGES.CREATE,
      }));
      showNotification(error.message || USER_ERROR_MESSAGES.CREATE, 'error');
    }
  }, [createUserMutation, refetch, showNotification, setState]);

  /**
   * Update an existing user
   * Handles form submission and success/error states
   */
  const handleUpdateUser = useCallback(async (userId: string, userData: UserUpdateInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await updateUserMutation({
        variables: { id: userId, input: userData },
      });

      setState(prev => ({ ...prev, editModalOpen: false, loading: false, selectedUser: null }));
      await refetch();
      showNotification(USER_SUCCESS_MESSAGES.UPDATE, 'success');
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: USER_ERROR_MESSAGES.UPDATE,
      }));
      showNotification(error.message || USER_ERROR_MESSAGES.UPDATE, 'error');
    }
  }, [updateUserMutation, refetch, showNotification, setState]);

  /**
   * Delete a user
   * Handles confirmation and success/error states
   * Preserves search query and current page for better user experience
   */
  const handleDeleteUser = useCallback(async (userId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await deleteUserMutation({
        variables: { id: userId },
      });

      // Close modal and stop loading, preserve search and pagination state
      setState(prev => ({
        ...prev,
        deleteModalOpen: false,
        loading: false,
      }));

      // Refetch current page with same search query to maintain filtered view
      await refetch({
        limit: state.pageSize,
        offset: (state.currentPage - 1) * state.pageSize,
        search: state.searchQuery || undefined,
        sortBy,
        sortOrder,
      });

      showNotification(USER_SUCCESS_MESSAGES.DELETE, 'success');
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: USER_ERROR_MESSAGES.DELETE,
      }));
      showNotification(error.message || USER_ERROR_MESSAGES.DELETE, 'error');
    }
  }, [deleteUserMutation, refetch, state.pageSize, state.currentPage, state.searchQuery, sortBy, sortOrder, showNotification, setState]);

  /**
   * Handle edit user click
   * Opens edit modal with selected user
   */
  const handleEditUser = useCallback((user: any) => {
    setState(prev => ({
      ...prev,
      editModalOpen: true,
      selectedUser: user,
    }));
  }, [setState]);

  /**
   * Handle delete user click
   * Opens delete modal with selected user and fetches deletion check
   */
  const handleDeleteUserClick = useCallback(async (user: any) => {
    try {
      // Check user deletion eligibility first
      const { data } = await checkUserDeletion({
        variables: { userId: user.id },
      });

      setDeletionCheck(data?.checkUserDeletion || null);
      setState(prev => ({
        ...prev,
        deleteModalOpen: true,
        selectedUser: user,
      }));
    } catch (error) {
      // If check fails, still show modal but without validation
      setDeletionCheck(null);
      setState(prev => ({
        ...prev,
        deleteModalOpen: true,
        selectedUser: user,
      }));
    }
  }, [setState, setDeletionCheck, checkUserDeletion]);

  /**
   * Clear error message
   * Removes error state from UI
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, [setState]);

  /**
   * Handle create user click
   * Opens create modal
   */
  const handleCreateClick = useCallback(() => {
    setState(prev => ({ ...prev, createModalOpen: true }));
  }, [setState]);

  /**
   * Close modals
   * Resets modal states
   */
  const closeModals = useCallback((modalType?: 'create' | 'edit' | 'delete') => {
    if (modalType === 'create') {
      setState(prev => ({ ...prev, createModalOpen: false }));
    } else if (modalType === 'edit') {
      setState(prev => ({ ...prev, editModalOpen: false, selectedUser: null }));
    } else if (modalType === 'delete') {
      setState(prev => ({ ...prev, deleteModalOpen: false, selectedUser: null }));
      setDeletionCheck(null);
    } else {
      setState(prev => ({
        ...prev,
        createModalOpen: false,
        editModalOpen: false,
        deleteModalOpen: false,
        selectedUser: null,
      }));
      setDeletionCheck(null);
    }
  }, [setState, setDeletionCheck]);

  return {
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleEditUser,
    handleDeleteUserClick,
    clearError,
    handleCreateClick,
    closeModals,
  };
};

