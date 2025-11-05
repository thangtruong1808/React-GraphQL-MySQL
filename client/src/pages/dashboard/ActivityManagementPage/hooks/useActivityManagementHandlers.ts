import { useCallback } from 'react';
import {
  ACTIVITY_ERROR_MESSAGES,
  ACTIVITY_SUCCESS_MESSAGES,
} from '../../../../constants/activityManagement';
import { Activity, ActivityInput, ActivityUpdateInput } from '../../../../types/activityManagement';
import { GET_DASHBOARD_ACTIVITIES_QUERY } from '../../../../services/graphql/activityQueries';
import { UseActivityManagementHandlersDependencies } from '../types';

/**
 * Custom hook for managing event handlers
 * Handles all user interactions and CRUD operations with debouncing
 */
export const useActivityManagementHandlers = ({
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
  paginationTimeoutRef,
}: UseActivityManagementHandlersDependencies) => {
  /**
   * Handle search input changes with debouncing
   * Debounces search to prevent excessive API calls
   */
  const handleSearchChange = useCallback(
    (query: string) => {
      setState((prev) => ({
        ...prev,
        searchQuery: query,
        currentPage: 1, // Reset to first page on search
      }));
    },
    [setState]
  );

  /**
   * Handle page changes with debouncing
   * Debounces pagination to prevent excessive API calls
   */
  const handlePageChange = useCallback(
    (page: number) => {
      // Clear existing timeout
      if (paginationTimeoutRef.current) {
        clearTimeout(paginationTimeoutRef.current);
      }

      // Set new timeout for debounced pagination
      paginationTimeoutRef.current = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          currentPage: page,
        }));
      }, 100);
    },
    [setState, paginationTimeoutRef]
  );

  /**
   * Handle page size changes
   * Updates page size and resets to first page
   */
  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setState((prev) => ({
        ...prev,
        pageSize,
        currentPage: 1,
      }));
    },
    [setState]
  );

  /**
   * Handle sorting changes
   * Updates sort parameters and resets to first page
   */
  const handleSort = useCallback(
    (field: string, order: string) => {
      setSortBy(field);
      setSortOrder(order);
      setState((prev) => ({
        ...prev,
        currentPage: 1,
      }));
    },
    [setSortBy, setSortOrder, setState]
  );

  /**
   * Handle create activity
   * Creates new activity and shows success notification
   */
  const handleCreateActivity = useCallback(
    async (input: ActivityInput) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        await createActivityMutation({
          variables: { input },
          refetchQueries: [GET_DASHBOARD_ACTIVITIES_QUERY],
          awaitRefetchQueries: true,
        });

        showNotification(ACTIVITY_SUCCESS_MESSAGES.CREATE, 'success');
        setState((prev) => ({ ...prev, createModalOpen: false }));
      } catch (error: any) {
        const errorMessage = error?.message || ACTIVITY_ERROR_MESSAGES.CREATE;
        setState((prev) => ({ ...prev, error: errorMessage }));
        showNotification(errorMessage, 'error');
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [createActivityMutation, showNotification, setState]
  );

  /**
   * Handle update activity
   * Updates existing activity and shows success notification
   */
  const handleUpdateActivity = useCallback(
    async (id: string, input: ActivityUpdateInput) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        await updateActivityMutation({
          variables: { id, input },
          refetchQueries: [GET_DASHBOARD_ACTIVITIES_QUERY],
          awaitRefetchQueries: true,
        });

        showNotification(ACTIVITY_SUCCESS_MESSAGES.UPDATE, 'success');
        setState((prev) => ({ ...prev, editModalOpen: false, selectedActivity: null }));
      } catch (error: any) {
        const errorMessage = error?.message || ACTIVITY_ERROR_MESSAGES.UPDATE;
        setState((prev) => ({ ...prev, error: errorMessage }));
        showNotification(errorMessage, 'error');
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [updateActivityMutation, showNotification, setState]
  );

  /**
   * Handle delete activity
   * Deletes activity and shows success notification
   */
  const handleDeleteActivity = useCallback(
    async (id: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        await deleteActivityMutation({
          variables: { id },
          refetchQueries: [GET_DASHBOARD_ACTIVITIES_QUERY],
          awaitRefetchQueries: true,
        });

        showNotification(ACTIVITY_SUCCESS_MESSAGES.DELETE, 'success');
        setState((prev) => ({ ...prev, deleteModalOpen: false, selectedActivity: null }));
      } catch (error: any) {
        const errorMessage = error?.message || ACTIVITY_ERROR_MESSAGES.DELETE;
        setState((prev) => ({ ...prev, error: errorMessage }));
        showNotification(errorMessage, 'error');
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [deleteActivityMutation, showNotification, setState]
  );

  /**
   * Handle manual refresh
   * Refreshes the activity data manually
   */
  const handleRefresh = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await refetch();
      showNotification('Activity data refreshed successfully', 'success');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to refresh activity data';
      setState((prev) => ({ ...prev, error: errorMessage }));
      showNotification(errorMessage, 'error');
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [refetch, showNotification, setState]);

  /**
   * Handle edit activity
   * Opens edit modal with selected activity
   */
  const handleEditActivity = useCallback(
    (activity: Activity) => {
      setState((prev) => ({
        ...prev,
        selectedActivity: activity,
        editModalOpen: true,
      }));
    },
    [setState]
  );

  /**
   * Handle delete activity click
   * Opens delete modal with selected activity
   */
  const handleDeleteActivityClick = useCallback(
    (activity: Activity) => {
      setState((prev) => ({
        ...prev,
        selectedActivity: activity,
        deleteModalOpen: true,
      }));
    },
    [setState]
  );

  /**
   * Handle modal close
   * Closes modal and clears selected activity
   */
  const handleCloseModal = useCallback(
    (modalType: 'create' | 'edit' | 'delete') => {
      setState((prev) => ({
        ...prev,
        [`${modalType}ModalOpen`]: false,
        selectedActivity: null,
      }));
    },
    [setState]
  );

  /**
   * Handle create modal open
   * Opens create modal
   */
  const handleCreateClick = useCallback(() => {
    setState((prev) => ({ ...prev, createModalOpen: true }));
  }, [setState]);

  return {
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    handleCreateActivity,
    handleUpdateActivity,
    handleDeleteActivity,
    handleRefresh,
    handleEditActivity,
    handleDeleteActivityClick,
    handleCloseModal,
    handleCreateClick,
  };
};

