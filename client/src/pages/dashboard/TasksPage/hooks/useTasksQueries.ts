import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_TASKS_QUERY, CHECK_TASK_DELETION_QUERY } from '../../../../services/graphql/taskQueries';
import { UseTasksQueriesDependencies } from '../types';

/**
 * Custom hook for managing GraphQL queries for tasks
 * Handles data fetching and state updates with error handling
 */
export const useTasksQueries = ({
  pageSize,
  currentPage,
  searchQuery,
  sortBy,
  sortOrder,
  isInitializing,
  hasDashboardAccess,
  isAuthDataReady,
  setState,
}: UseTasksQueriesDependencies) => {
  // Wait for auth data to be ready to prevent race conditions during fast navigation
  const shouldSkip = isInitializing || !hasDashboardAccess || !isAuthDataReady;

  // Fetch tasks
  const { data, loading: queryLoading, refetch } = useQuery(GET_DASHBOARD_TASKS_QUERY, {
    variables: {
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      search: searchQuery || undefined,
      sortBy,
      sortOrder,
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    skip: shouldSkip,
  });

  /**
   * Update state when GraphQL data changes
   * Handles loading states and data updates
   */
  useEffect(() => {
    if (data?.dashboardTasks) {
      setState(prev => ({
        ...prev,
        tasks: data.dashboardTasks.tasks,
        paginationInfo: data.dashboardTasks.paginationInfo,
        loading: queryLoading,
      }));
    } else {
      setState(prev => ({
        ...prev,
        loading: queryLoading,
      }));
    }
  }, [data, queryLoading, setState]);

  return {
    queryLoading,
    refetch,
    shouldSkip,
  };
};

/**
 * Custom hook for managing task deletion check query
 * Handles deletion validation before confirming deletion
 */
export const useTaskDeletionCheck = (deleteModalOpen: boolean, selectedTaskId: string | null) => {
  const { data: deletionData, refetch: refetchDeletion } = useQuery(CHECK_TASK_DELETION_QUERY, {
    variables: { taskId: selectedTaskId || '' },
    skip: !deleteModalOpen || !selectedTaskId,
    fetchPolicy: 'network-only',
  });

  return {
    deletionData,
    refetchDeletion,
  };
};

