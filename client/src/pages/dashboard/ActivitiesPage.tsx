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

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(DEFAULT_ACTIVITY_PAGINATION.sortBy);
  const [sortOrder, setSortOrder] = useState(DEFAULT_ACTIVITY_PAGINATION.sortOrder);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_ACTIVITY_PAGINATION.limit);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Calculate offset for pagination
  const offset = (currentPage - 1) * pageSize;

  // GraphQL query variables
  const queryVariables = {
    limit: pageSize,
    offset,
    search: searchTerm || undefined,
    sortBy,
    sortOrder,
  };

  // Fetch activities
  const { data, loading, error, refetch } = useQuery(GET_DASHBOARD_ACTIVITIES_QUERY, {
    variables: queryVariables,
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    skip: isInitializing || !hasDashboardAccess || !user,
  });
  const activities = data?.dashboardActivities?.activities || [];

  // Extract data from query response
  const paginationInfo = data?.dashboardActivities?.paginationInfo || {
    hasNextPage: false,
    hasPreviousPage: false,
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
  };

  // Mutations
  const [createActivityMutation] = useMutation(CREATE_ACTIVITY_MUTATION);
  const [updateActivityMutation] = useMutation(UPDATE_ACTIVITY_MUTATION);
  const [deleteActivityMutation] = useMutation(DELETE_ACTIVITY_MUTATION);

  // Handle search with debouncing
  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Handle sort
  const handleSort = useCallback((newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1); // Reset to first page when sorting
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Handle page size change
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  // Handle create activity
  const handleCreate = async (activityData: ActivityInput) => {
    try {
      await createActivityMutation({
        variables: { input: activityData },
        refetchQueries: [{ query: GET_DASHBOARD_ACTIVITIES_QUERY, variables: queryVariables }],
      });
      showSuccess(ACTIVITY_SUCCESS_MESSAGES.CREATE);
    } catch (error: any) {
      showError(ACTIVITY_ERROR_MESSAGES.CREATE);
    }
  };

  // Handle edit activity
  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setEditModalOpen(true);
  };

  // Handle update activity
  const handleUpdate = async (id: string, activityData: ActivityUpdateInput) => {
    try {
      await updateActivityMutation({
        variables: { id, input: activityData },
        refetchQueries: [{ query: GET_DASHBOARD_ACTIVITIES_QUERY, variables: queryVariables }],
      });
      showSuccess(ACTIVITY_SUCCESS_MESSAGES.UPDATE);
    } catch (error: any) {
      showError(ACTIVITY_ERROR_MESSAGES.UPDATE);
    }
  };

  // Handle delete activity
  const handleDelete = (activity: Activity) => {
    setSelectedActivity(activity);
    setDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async (id: string) => {
    try {
      await deleteActivityMutation({
        variables: { id },
        refetchQueries: [{ query: GET_DASHBOARD_ACTIVITIES_QUERY, variables: queryVariables }],
      });
      showSuccess(ACTIVITY_SUCCESS_MESSAGES.DELETE);
    } catch (error: any) {
      showError(ACTIVITY_ERROR_MESSAGES.DELETE);
    }
  };

  // Close modals
  const closeModals = () => {
    setCreateModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedActivity(null);
  };

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
  if (loading && activities.length === 0) {
    return <DashboardSkeleton />;
  }

  return (
    <DashboardLayout showSidebarSkeleton={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Activity Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage and monitor system activities and user actions
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Create Activity
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <InlineError
            message={error.message || ACTIVITY_ERROR_MESSAGES.FETCH}
            onRetry={() => refetch()}
          />
        )}

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <ActivitySearchInput
                onSearch={handleSearch}
                placeholder="Search activities by user, action, type, or content..."
                loading={loading}
              />
            </div>
          </div>
        </div>

        {/* Activities Table */}
        <div className="bg-white shadow rounded-lg">
          <ActivitiesTable
            activities={activities}
            loading={loading}
            paginationInfo={paginationInfo}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onSort={handleSort}
            currentSortBy={sortBy}
            currentSortOrder={sortOrder}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Modals */}
        <CreateActivityModal
          isOpen={createModalOpen}
          onClose={closeModals}
          onCreate={handleCreate}
          loading={loading}
        />

        <EditActivityModal
          isOpen={editModalOpen}
          onClose={closeModals}
          onUpdate={handleUpdate}
          activity={selectedActivity}
          loading={loading}
        />

        <DeleteActivityModal
          isOpen={deleteModalOpen}
          onClose={closeModals}
          onDelete={handleConfirmDelete}
          activity={selectedActivity}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
};

export default ActivitiesPage;
