import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_COMMENTS_QUERY, GetDashboardCommentsQueryVariables } from '../../../../services/graphql/commentQueries';
import { UseCommentsQueriesDependencies } from '../types';

/**
 * Custom hook for managing GraphQL queries
 * Handles data fetching and state updates with error handling
 */
export const useCommentsQueries = ({
  pageSize,
  currentPage,
  searchTerm,
  sortBy,
  sortOrder,
  isInitializing,
  hasDashboardAccess,
  user,
  isAuthDataReady,
  setState,
}: UseCommentsQueriesDependencies & { setState: React.Dispatch<React.SetStateAction<any>> }) => {
  // GraphQL query variables
  const queryVariables: GetDashboardCommentsQueryVariables = {
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: searchTerm || undefined,
    sortBy,
    sortOrder,
  };

  // Wait for auth data to be ready to prevent race conditions during fast navigation
  const shouldSkip = isInitializing || !hasDashboardAccess || !user || !isAuthDataReady;

  // Fetch comments
  const { data, loading: queryLoading, error, refetch } = useQuery(GET_DASHBOARD_COMMENTS_QUERY, {
    variables: queryVariables,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    skip: shouldSkip,
  });

  /**
   * Update state when GraphQL data changes
   * Handles loading states and data updates
   * Always updates loading state to prevent race conditions during fast navigation
   */
  useEffect(() => {
    if (data?.dashboardComments) {
      setState((prev: any) => ({
        ...prev,
        comments: data.dashboardComments.comments,
        paginationInfo: data.dashboardComments.paginationInfo,
        loading: queryLoading,
      }));
    } else {
      setState((prev: any) => ({
        ...prev,
        loading: queryLoading,
      }));
    }
  }, [data, queryLoading, setState]);

  /**
   * Clear error state when skip condition changes to prevent showing stale errors
   * This prevents cached errors from showing when navigating fast
   */
  useEffect(() => {
    if (shouldSkip) {
      setState((prev: any) => ({
        ...prev,
        error: null,
      }));
    }
  }, [shouldSkip, setState]);

  /**
   * Handle GraphQL errors gracefully
   * Only show errors if not during auth initialization or when auth data is not ready
   */
  useEffect(() => {
    if (error && !shouldSkip) {
      setState((prev: any) => ({
        ...prev,
        error: error.message || 'Failed to load comments',
      }));
    }
  }, [error, shouldSkip, setState]);

  return {
    queryLoading,
    refetch,
    shouldSkip,
  };
};

