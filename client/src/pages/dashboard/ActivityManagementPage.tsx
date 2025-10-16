import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { FaPlus, FaSync } from 'react-icons/fa';
import { DashboardLayout } from '../../components/layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import { DashboardSkeleton } from '../../components/ui';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import AccessDenied from '../../components/auth/AccessDenied';
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

/**
 * Activity Management Dashboard Page
 * Complete activity management interface with search, table, and CRUD operations
 * Features modern, professional layout with pagination and real-time search
 * 
 * CALLED BY: AppRoutes component via ProtectedRoute
 * SCENARIOS: Activity management for administrators and project managers
 */
const ActivityManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { isInitializing, showNotification } = useAuth();
  const { canCreate, canEdit, canDelete, hasDashboardAccess } = useRolePermissions();

  // State management
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

  // Request cancellation ref to prevent race conditions
  const abortControllerRef = useRef<AbortController | null>(null);
  // Timeout ref for debouncing pagination
  const paginationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // GraphQL queries and mutations
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
    skip: isInitializing || !hasDashboardAccess
  });

  const [createActivityMutation] = useMutation(CREATE_ACTIVITY_MUTATION);
  const [updateActivityMutation] = useMutation(UPDATE_ACTIVITY_MUTATION);
  const [deleteActivityMutation] = useMutation(DELETE_ACTIVITY_MUTATION);

  /**
   * Update state when GraphQL data changes
   * Handles loading states and data updates
   */
  useEffect(() => {
    if (data?.dashboardActivities) {
      setState(prev => ({
        ...prev,
        activities: data.dashboardActivities.activities || [],
        paginationInfo: data.dashboardActivities.paginationInfo || prev.paginationInfo,
        loading: false,
        error: null
      }));
    }
  }, [data]);

  /**
   * Handle loading state changes
   * Updates loading state based on query status
   */
  useEffect(() => {
    setState(prev => ({
      ...prev,
      loading: queryLoading
    }));
  }, [queryLoading]);

  /**
   * Handle search input changes with debouncing
   * Debounces search to prevent excessive API calls
   */
  const handleSearchChange = useCallback((query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query,
      currentPage: 1 // Reset to first page on search
    }));
  }, []);

  /**
   * Handle page changes with debouncing
   * Debounces pagination to prevent excessive API calls
   */
  const handlePageChange = useCallback((page: number) => {
    // Clear existing timeout
    if (paginationTimeoutRef.current) {
      clearTimeout(paginationTimeoutRef.current);
    }

    // Set new timeout for debounced pagination
    paginationTimeoutRef.current = setTimeout(() => {
      setState(prev => ({
        ...prev,
        currentPage: page
      }));
    }, 100);
  }, []);

  /**
   * Handle page size changes
   * Updates page size and resets to first page
   */
  const handlePageSizeChange = useCallback((pageSize: number) => {
    setState(prev => ({
      ...prev,
      pageSize,
      currentPage: 1
    }));
  }, []);

  /**
   * Handle sorting changes
   * Updates sort parameters and resets to first page
   */
  const handleSort = useCallback((field: string, order: string) => {
    setSortBy(field);
    setSortOrder(order);
    setState(prev => ({
      ...prev,
      currentPage: 1
    }));
  }, []);

  /**
   * Handle create activity
   * Creates new activity and shows success notification
   */
  const handleCreateActivity = useCallback(async (input: ActivityInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await createActivityMutation({
        variables: { input },
        refetchQueries: [GET_DASHBOARD_ACTIVITIES_QUERY],
        awaitRefetchQueries: true
      });

      showNotification(ACTIVITY_SUCCESS_MESSAGES.CREATE, 'success');
      setState(prev => ({ ...prev, createModalOpen: false }));
    } catch (error: any) {
      const errorMessage = error?.message || ACTIVITY_ERROR_MESSAGES.CREATE;
      setState(prev => ({ ...prev, error: errorMessage }));
      showNotification(errorMessage, 'error');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [createActivityMutation, showNotification]);

  /**
   * Handle update activity
   * Updates existing activity and shows success notification
   */
  const handleUpdateActivity = useCallback(async (id: string, input: ActivityUpdateInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await updateActivityMutation({
        variables: { id, input },
        refetchQueries: [GET_DASHBOARD_ACTIVITIES_QUERY],
        awaitRefetchQueries: true
      });

      showNotification(ACTIVITY_SUCCESS_MESSAGES.UPDATE, 'success');
      setState(prev => ({ ...prev, editModalOpen: false, selectedActivity: null }));
    } catch (error: any) {
      const errorMessage = error?.message || ACTIVITY_ERROR_MESSAGES.UPDATE;
      setState(prev => ({ ...prev, error: errorMessage }));
      showNotification(errorMessage, 'error');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [updateActivityMutation, showNotification]);

  /**
   * Handle delete activity
   * Deletes activity and shows success notification
   */
  const handleDeleteActivity = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await deleteActivityMutation({
        variables: { id },
        refetchQueries: [GET_DASHBOARD_ACTIVITIES_QUERY],
        awaitRefetchQueries: true
      });

      showNotification(ACTIVITY_SUCCESS_MESSAGES.DELETE, 'success');
      setState(prev => ({ ...prev, deleteModalOpen: false, selectedActivity: null }));
    } catch (error: any) {
      const errorMessage = error?.message || ACTIVITY_ERROR_MESSAGES.DELETE;
      setState(prev => ({ ...prev, error: errorMessage }));
      showNotification(errorMessage, 'error');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [deleteActivityMutation, showNotification]);

  /**
   * Handle manual refresh
   * Refreshes the activity data manually
   */
  const handleRefresh = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await refetch();
      showNotification('Activity data refreshed successfully', 'success');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to refresh activity data';
      setState(prev => ({ ...prev, error: errorMessage }));
      showNotification(errorMessage, 'error');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [refetch, showNotification]);

  /**
   * Handle edit activity
   * Opens edit modal with selected activity
   */
  const handleEditActivity = useCallback((activity: Activity) => {
    setState(prev => ({
      ...prev,
      selectedActivity: activity,
      editModalOpen: true
    }));
  }, []);

  /**
   * Handle delete activity
   * Opens delete modal with selected activity
   */
  const handleDeleteActivityClick = useCallback((activity: Activity) => {
    setState(prev => ({
      ...prev,
      selectedActivity: activity,
      deleteModalOpen: true
    }));
  }, []);

  /**
   * Handle modal close
   * Closes modal and clears selected activity
   */
  const handleCloseModal = useCallback((modalType: 'create' | 'edit' | 'delete') => {
    setState(prev => ({
      ...prev,
      [`${modalType}ModalOpen`]: false,
      selectedActivity: null
    }));
  }, []);

  // Show access denied if user doesn't have dashboard access
  if (!hasDashboardAccess) {
    return <AccessDenied />;
  }

  // Show loading skeleton during initialization
  if (isInitializing) {
    return <DashboardSkeleton />;
  }

  return (
    <DashboardLayout>
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
                  Manage and track user activities across the system
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleRefresh}
                  disabled={state.loading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSync className={`h-4 w-4 mr-2 ${state.loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                {canCreate && (
                  <button
                    onClick={() => setState(prev => ({ ...prev, createModalOpen: true }))}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                  >
                    <FaPlus className="h-4 w-4 mr-2" />
                    Create Activity
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <div className="px-8 py-8 w-full">
            {/* Error Display */}
            {state.error && (
              <div className="mb-6">
                <InlineError message={state.error} />
              </div>
            )}

            {/* Search Input */}
            <div className="mb-6">
              <ActivitySearchInput
                value={state.searchQuery}
                onChange={handleSearchChange}
                placeholder="Search activities by action, type, or user..."
                loading={state.loading}
              />
            </div>

            {/* Activities Table */}
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
              onEdit={canEdit ? handleEditActivity : undefined}
              onDelete={canDelete ? handleDeleteActivityClick : undefined}
            />
          </div>
        </div>

        {/* Create Activity Modal */}
        <CreateActivityModal
          isOpen={state.createModalOpen}
          onClose={() => handleCloseModal('create')}
          onCreate={handleCreateActivity}
          loading={state.loading}
        />

        {/* Edit Activity Modal */}
        <EditActivityModal
          isOpen={state.editModalOpen}
          onClose={() => handleCloseModal('edit')}
          onUpdate={handleUpdateActivity}
          activity={state.selectedActivity}
          loading={state.loading}
        />

        {/* Delete Activity Modal */}
        <DeleteActivityModal
          isOpen={state.deleteModalOpen}
          onClose={() => handleCloseModal('delete')}
          onDelete={handleDeleteActivity}
          activity={state.selectedActivity}
          loading={state.loading}
        />
      </div>
    </DashboardLayout>
  );
};

export default ActivityManagementPage;
