import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_TAGS_QUERY } from '../../../../services/graphql/tagsQueries';
import { TAGS_ERROR_MESSAGES } from '../../../../constants/tagsManagement';
import { UseTagsQueriesDependencies } from '../types';

/**
 * Custom hook for managing GraphQL queries for tags
 * Handles data fetching and state updates with error handling
 */
export const useTagsQueries = ({
  pageSize,
  currentPage,
  searchQuery,
  sortBy,
  sortOrder,
  isInitializing,
  hasDashboardAccess,
  user,
  isAuthDataReady,
  setState,
}: UseTagsQueriesDependencies) => {
  // Wait for auth data to be ready to prevent race conditions during fast navigation
  const shouldSkip = isInitializing || !hasDashboardAccess || !user || !isAuthDataReady;

  // Fetch tags
  const { data, loading: queryLoading, error, refetch } = useQuery(GET_DASHBOARD_TAGS_QUERY, {
    variables: {
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      search: searchQuery || undefined,
      sortBy,
      sortOrder,
    },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    skip: shouldSkip,
  });

  /**
   * Update state when GraphQL data changes
   * Handles loading states and data updates
   */
  useEffect(() => {
    if (data?.dashboardTags) {
      setState(prev => ({
        ...prev,
        tags: data.dashboardTags.tags,
        paginationInfo: data.dashboardTags.paginationInfo,
        loading: queryLoading,
      }));
    } else {
      setState(prev => ({ ...prev, loading: queryLoading }));
    }
  }, [data, queryLoading, setState]);

  /**
   * Clear error state when skip condition changes to prevent showing stale errors
   * This prevents cached errors from showing when navigating fast
   */
  useEffect(() => {
    if (shouldSkip) {
      setState(prev => ({
        ...prev,
        error: null
      }));
    }
  }, [shouldSkip, setState]);

  /**
   * Handle GraphQL errors gracefully
   * Only show errors if not during auth initialization, when auth data is ready, and query has completed
   * This prevents stale cached errors from showing during fast navigation
   */
  useEffect(() => {
    // Only show errors if not skipping, not loading, and we have an error
    // This prevents stale cached errors from showing during fast navigation
    if (error && !shouldSkip && !queryLoading) {
      setState(prev => ({
        ...prev,
        error: error.message || TAGS_ERROR_MESSAGES.FETCH
      }));
    }
  }, [error, shouldSkip, queryLoading, setState]);

  return {
    queryLoading,
    refetch,
    shouldSkip,
  };
};

