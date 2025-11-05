import { useCallback } from 'react';
import {
  ACTIVITY_ERROR_MESSAGES,
  ACTIVITY_SUCCESS_MESSAGES,
} from '../../../../constants/activityManagement';
import { Activity, ActivityInput, ActivityUpdateInput } from '../../../../types/activityManagement';
import { UseActivitiesHandlersDependencies } from '../types';

/**
 * Custom hook for managing event handlers
 * Handles all user interactions and CRUD operations
 */
export const useActivitiesHandlers = ({
  state,
  sortBy,
  sortOrder,
  setState,
  setSortBy,
  setSortOrder,
  refetch,
  createActivityMutation,
  updateActivityMutation,
  deleteActivityMutation,
  showNotification,
}: UseActivitiesHandlersDependencies) => {
  /**
   * Fetch activities with current parameters
   * Refetches data when pagination or search changes
   */
  const fetchActivities = useCallback(
    async (page: number, pageSize: number, search: string) => {
      try {
        await refetch({
          limit: pageSize,
          offset: (page - 1) * pageSize,
          search: search || undefined,
          sortBy,
          sortOrder,
        });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: ACTIVITY_ERROR_MESSAGES.FETCH,
        }));
      }
    },
    [refetch, sortBy, sortOrder, setState]
  );

  /**
   * Handle search query change
   * Debounced search with pagination reset
   */
  const handleSearch = useCallback(
    (query: string) => {
      setState((prev) => ({ ...prev, searchQuery: query, currentPage: 1 }));
    },
    [setState]
  );

  /**
   * Handle page size change
   * Resets to first page when changing page size
   */
  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setState((prev) => ({ ...prev, pageSize, currentPage: 1 }));
      fetchActivities(1, pageSize, state.searchQuery);
    },
    [fetchActivities, setState, state.searchQuery]
  );

  /**
   * Handle column sorting
   * Updates sort parameters and resets to first page
   */
  const handleSort = useCallback(
    (newSortBy: string, newSortOrder: string) => {
      setSortBy(newSortBy);
      setSortOrder(newSortOrder);
      setState((prev) => ({ ...prev, currentPage: 1 }));
    },
    [setSortBy, setSortOrder, setState]
  );

  /**
   * Handle page change
   * Navigates to specified page
   */
  const handlePageChange = useCallback(
    (page: number) => {
      setState((prev) => ({ ...prev, currentPage: page }));
      fetchActivities(page, state.pageSize, state.searchQuery);
    },
    [fetchActivities, setState, state.pageSize, state.searchQuery]
  );

  /**
   * Handle create activity click
   * Opens create modal
   */
  const handleCreateClick = useCallback(() => {
    setState((prev) => ({ ...prev, createModalOpen: true }));
  }, [setState]);

  /**
   * Create a new activity
   * Handles form submission and success/error states
   */
  const handleCreate = useCallback(
    async (activityData: ActivityInput) => {
      try {
        await createActivityMutation({
          variables: { input: activityData },
        });
        setState((prev) => ({ ...prev, createModalOpen: false }));
        showNotification(ACTIVITY_SUCCESS_MESSAGES.CREATE, 'success');
        fetchActivities(state.currentPage, state.pageSize, state.searchQuery);
      } catch (error: any) {
        showNotification(ACTIVITY_ERROR_MESSAGES.CREATE, 'error');
      }
    },
    [
      createActivityMutation,
      showNotification,
      fetchActivities,
      setState,
      state.currentPage,
      state.pageSize,
      state.searchQuery,
    ]
  );

  /**
   * Handle edit activity click
   * Opens edit modal with selected activity
   */
  const handleEdit = useCallback(
    (activity: Activity) => {
      setState((prev) => ({ ...prev, selectedActivity: activity, editModalOpen: true }));
    },
    [setState]
  );

  /**
   * Update an existing activity
   * Handles form submission and success/error states
   */
  const handleUpdate = useCallback(
    async (id: string, activityData: ActivityUpdateInput) => {
      try {
        await updateActivityMutation({
          variables: { id, input: activityData },
        });
        setState((prev) => ({ ...prev, editModalOpen: false, selectedActivity: null }));
        showNotification(ACTIVITY_SUCCESS_MESSAGES.UPDATE, 'success');
        fetchActivities(state.currentPage, state.pageSize, state.searchQuery);
      } catch (error: any) {
        showNotification(ACTIVITY_ERROR_MESSAGES.UPDATE, 'error');
      }
    },
    [
      updateActivityMutation,
      showNotification,
      fetchActivities,
      setState,
      state.currentPage,
      state.pageSize,
      state.searchQuery,
    ]
  );

  /**
   * Handle delete activity click
   * Opens delete confirmation modal
   */
  const handleDelete = useCallback(
    (activity: Activity) => {
      setState((prev) => ({ ...prev, selectedActivity: activity, deleteModalOpen: true }));
    },
    [setState]
  );

  /**
   * Delete an activity
   * Handles confirmation and success/error states
   */
  const handleConfirmDelete = useCallback(
    async (id: string) => {
      try {
        await deleteActivityMutation({
          variables: { id },
        });
        setState((prev) => ({ ...prev, deleteModalOpen: false, selectedActivity: null }));
        showNotification(ACTIVITY_SUCCESS_MESSAGES.DELETE, 'success');
        fetchActivities(state.currentPage, state.pageSize, state.searchQuery);
      } catch (error: any) {
        showNotification(ACTIVITY_ERROR_MESSAGES.DELETE, 'error');
      }
    },
    [
      deleteActivityMutation,
      showNotification,
      fetchActivities,
      setState,
      state.currentPage,
      state.pageSize,
      state.searchQuery,
    ]
  );

  /**
   * Close all modals
   * Resets modal states and selected activity
   */
  const closeModals = useCallback(() => {
    setState((prev) => ({
      ...prev,
      createModalOpen: false,
      editModalOpen: false,
      deleteModalOpen: false,
      selectedActivity: null,
    }));
  }, [setState]);

  return {
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    handleCreateClick,
    handleCreate,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleConfirmDelete,
    closeModals,
  };
};

