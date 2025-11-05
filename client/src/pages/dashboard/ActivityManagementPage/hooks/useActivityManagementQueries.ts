import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_ACTIVITIES_QUERY } from '../../../../services/graphql/activityQueries';
import { UseActivityManagementQueriesDependencies } from '../types';

/**
 * Custom hook for managing GraphQL queries
 * Handles data fetching and state updates
 */
export const useActivityManagementQueries = ({
  pageSize,
  currentPage,
  searchQuery,
  sortBy,
  sortOrder,
  isInitializing,
  hasDashboardAccess,
  isAuthDataReady,
  setState,
}: UseActivityManagementQueriesDependencies & { setState: React.Dispatch<React.SetStateAction<any>> }) => {
  // GraphQL query for activities
  const { data, loading: queryLoading, refetch } = useQuery(GET_DASHBOARD_ACTIVITIES_QUERY, {
    variables: {
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      search: searchQuery || undefined,
      sortBy,
      sortOrder,
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    skip: isInitializing || !hasDashboardAccess || !isAuthDataReady,
  });

  /**
   * Update state when GraphQL data changes
   * Handles loading states and data updates
   */
  useEffect(() => {
    if (data?.dashboardActivities) {
      setState((prev: any) => ({
        ...prev,
        activities: data.dashboardActivities.activities || [],
        paginationInfo: data.dashboardActivities.paginationInfo || prev.paginationInfo,
        loading: false,
        error: null,
      }));
    }
  }, [data, setState]);

  /**
   * Handle loading state changes
   * Updates loading state based on query status
   */
  useEffect(() => {
    setState((prev: any) => ({
      ...prev,
      loading: queryLoading,
    }));
  }, [queryLoading, setState]);

  return {
    data,
    queryLoading,
    refetch,
  };
};

