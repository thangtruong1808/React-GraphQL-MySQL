import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { FaPlus } from 'react-icons/fa';
import { DashboardLayout } from '../../components/layout';
import { useAuth } from '../../contexts/AuthContext';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import AccessDenied from '../../components/auth/AccessDenied';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import { DashboardSkeleton } from '../../components/ui';
import {
  ActivitySearchInput,
  ActivitiesTable,
  CreateActivityModal,
  EditActivityModal,
  DeleteActivityModal
} from '../../components/activityManagement';
import {
  GET_DASHBOARD_ACTIVITIES_QUERY,
  CREATE_ACTIVITY_MUTATION,
  UPDATE_ACTIVITY_MUTATION,
  DELETE_ACTIVITY_MUTATION
} from '../../services/graphql/activityQueries';
import {
  Activity,
  ActivityInput,
  ActivityUpdateInput,
  ActivityManagementState
} from '../../types/activityManagement';
import {
  DEFAULT_ACTIVITY_PAGINATION,
  ACTIVITY_SUCCESS_MESSAGES,
  ACTIVITY_ERROR_MESSAGES
} from '../../constants/activityManagement';
import { InlineError } from '../../components/ui';
import { useError } from '../../contexts/ErrorContext';

/**
 * Activities Dashboard Page
 * Complete activity management interface with search, table, and CRUD operations
 * Features modern, professional layout with pagination and real-time search
 * 
 * CALLED BY: AppRoutes component via ProtectedRoute
 * SCENARIOS: Activity management for administrators and project managers
 */
const ActivitiesPage: React.FC = () => {
  const { isInitializing, user } = useAuth();
  const { hasDashboardAccess } = useRolePermissions();
  const { showError, showSuccess } = useError();

  // State management - single state object like UsersPage
  const [state, setState] = useState<ActivityManagementState>({
    activities: [],
    paginationInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      totalCount: 0,
      currentPage: 1,
      totalPages: 0
    },
    loading: false,
    searchQuery: '',
    currentPage: 1,
    pageSize: DEFAULT_ACTIVITY_PAGINATION.limit,
    createModalOpen: false,
    editModalOpen: false,
    deleteModalOpen: false,
    selectedActivity: null,
    error: null
  });

  // Sorting state
  const [sortBy, setSortBy] = useState<string>(DEFAULT_ACTIVITY_PAGINATION.sortBy);
  const [sortOrder, setSortOrder] = useState<string>(DEFAULT_ACTIVITY_PAGINATION.sortOrder);

  // GraphQL query - simple approach like UsersPage
  const { data, loading: queryLoading, refetch } = useQuery(GET_DASHBOARD_ACTIVITIES_QUERY, {
    variables: {
      limit: state.pageSize,
      offset: (state.currentPage - 1) * state.pageSize,
      search: state.searchQuery || undefined,
      sortBy,
      sortOrder
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    skip: isInitializing || !hasDashboardAccess || !user
  });

  /**
   * Update state when GraphQL data changes
   * Handles loading states and data updates
   */
  useEffect(() => {
    if (data?.dashboardActivities) {
      setState(prev => ({
        ...prev,
        activities: data.dashboardActivities.activities,
        paginationInfo: data.dashboardActivities.paginationInfo,
        loading: queryLoading
      }));
    } else {
      setState(prev => ({
        ...prev,
        loading: queryLoading
      }));
    }
  }, [data, queryLoading]);

  // Mutations
  const [createActivityMutation] = useMutation(CREATE_ACTIVITY_MUTATION);
  const [updateActivityMutation] = useMutation(UPDATE_ACTIVITY_MUTATION);
  const [deleteActivityMutation] = useMutation(DELETE_ACTIVITY_MUTATION);

  /**
   * Fetch activities with current parameters
   * Refetches data when pagination or search changes
   */
  const fetchActivities = useCallback(async (page: number, pageSize: number, search: string) => {
    try {
      await refetch({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        search: search || undefined,
        sortBy,
        sortOrder
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: ACTIVITY_ERROR_MESSAGES.FETCH
      }));
    }
  }, [refetch, sortBy, sortOrder]);

  /**
   * Handle search query change
   * Debounced search with pagination reset
   */
  const handleSearch = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query, currentPage: 1 }));
  }, []);

  /**
   * Handle page size change
   * Resets to first page when changing page size
   */
  const handlePageSizeChange = useCallback((pageSize: number) => {
    setState(prev => ({ ...prev, pageSize, currentPage: 1 }));
    fetchActivities(1, pageSize, state.searchQuery);
  }, [fetchActivities, state.searchQuery]);

  /**
   * Handle column sorting
   * Updates sort parameters and resets to first page
   */
  const handleSort = useCallback((newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setState(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  /**
   * Handle page change
   * Navigates to specified page
   */
  const handlePageChange = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
    fetchActivities(page, state.pageSize, state.searchQuery);
  }, [fetchActivities, state.pageSize, state.searchQuery]);

  /**
   * Handle create activity click
   * Opens create modal
   */
  const handleCreateClick = useCallback(() => {
    setState(prev => ({ ...prev, createModalOpen: true }));
  }, []);

  /**
   * Create a new activity
   * Handles form submission and success/error states
   */
  const handleCreate = useCallback(async (activityData: ActivityInput) => {
    try {
      await createActivityMutation({
        variables: { input: activityData }
      });
      setState(prev => ({ ...prev, createModalOpen: false }));
      showSuccess(ACTIVITY_SUCCESS_MESSAGES.CREATE);
      fetchActivities(state.currentPage, state.pageSize, state.searchQuery);
    } catch (error: any) {
      showError(ACTIVITY_ERROR_MESSAGES.CREATE);
    }
  }, [createActivityMutation, showSuccess, showError, fetchActivities, state.currentPage, state.pageSize, state.searchQuery]);

  /**
   * Handle edit activity click
   * Opens edit modal with selected activity
   */
  const handleEdit = useCallback((activity: Activity) => {
    setState(prev => ({ ...prev, selectedActivity: activity, editModalOpen: true }));
  }, []);

  /**
   * Update an existing activity
   * Handles form submission and success/error states
   */
  const handleUpdate = useCallback(async (id: string, activityData: ActivityUpdateInput) => {
    try {
      await updateActivityMutation({
        variables: { id, input: activityData }
      });
      setState(prev => ({ ...prev, editModalOpen: false, selectedActivity: null }));
      showSuccess(ACTIVITY_SUCCESS_MESSAGES.UPDATE);
      fetchActivities(state.currentPage, state.pageSize, state.searchQuery);
    } catch (error: any) {
      showError(ACTIVITY_ERROR_MESSAGES.UPDATE);
    }
  }, [updateActivityMutation, showSuccess, showError, fetchActivities, state.currentPage, state.pageSize, state.searchQuery]);

  /**
   * Handle delete activity click
   * Opens delete confirmation modal
   */
  const handleDelete = useCallback((activity: Activity) => {
    setState(prev => ({ ...prev, selectedActivity: activity, deleteModalOpen: true }));
  }, []);

  /**
   * Delete an activity
   * Handles confirmation and success/error states
   */
  const handleConfirmDelete = useCallback(async (id: string) => {
    try {
      await deleteActivityMutation({
        variables: { id }
      });
      setState(prev => ({ ...prev, deleteModalOpen: false, selectedActivity: null }));
      showSuccess(ACTIVITY_SUCCESS_MESSAGES.DELETE);
      fetchActivities(state.currentPage, state.pageSize, state.searchQuery);
    } catch (error: any) {
      showError(ACTIVITY_ERROR_MESSAGES.DELETE);
    }
  }, [deleteActivityMutation, showSuccess, showError, fetchActivities, state.currentPage, state.pageSize, state.searchQuery]);

  /**
   * Close all modals
   * Resets modal states and selected activity
   */
  const closeModals = useCallback(() => {
    setState(prev => ({
      ...prev,
      createModalOpen: false,
      editModalOpen: false,
      deleteModalOpen: false,
      selectedActivity: null
    }));
  }, []);

  // Note: Activity page is accessible to all authenticated users
  // Role-based restrictions can be implemented at the component level if needed

  // During auth initialization, show skeleton
  if (isInitializing) {
    return <DashboardSkeleton />;
  }

  // Access control after initialization
  if (!hasDashboardAccess) {
    return <AccessDenied feature="Activity Management" />;
  }

  // Show unified skeleton during loading (both sidebar and content)
  if (state.loading && state.activities.length === 0) {
    return <DashboardSkeleton />;
  }

  return (
    <DashboardLayout showSidebarSkeleton={false}>
      <div className="w-full h-full dashboard-content">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 w-full">
          <div className="px-8 py-8 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Activity Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and monitor system activities and user actions
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                onClick={handleCreateClick}
              >
                <FaPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Create Activity
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <div className="px-8 py-8 w-full">
            <div className="space-y-6">
              {/* Error Display */}
              {state.error && (
                <InlineError
                  message={state.error}
                  onRetry={() => fetchActivities(state.currentPage, state.pageSize, state.searchQuery)}
                />
              )}

              {/* Search and Filters */}
              <div>
                <ActivitySearchInput
                  onSearch={handleSearch}
                  placeholder="Search activities by user, action, type, or content..."
                  loading={state.loading}
                />
              </div>

              {/* Activities Table */}
              <div className="bg-white shadow rounded-lg">
                <ActivitiesTable
                  activities={state.activities}
                  loading={state.loading}
                  paginationInfo={state.paginationInfo}
                  currentPage={state.currentPage}
                  currentPageSize={state.pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  onSort={handleSort}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <CreateActivityModal
          isOpen={state.createModalOpen}
          onClose={closeModals}
          onCreate={handleCreate}
          loading={state.loading}
        />

        <EditActivityModal
          isOpen={state.editModalOpen}
          onClose={closeModals}
          onUpdate={handleUpdate}
          activity={state.selectedActivity}
          loading={state.loading}
        />

        <DeleteActivityModal
          isOpen={state.deleteModalOpen}
          onClose={closeModals}
          onDelete={handleConfirmDelete}
          activity={state.selectedActivity}
          loading={state.loading}
        />
      </div>
    </DashboardLayout>
  );
};

export default ActivitiesPage;
