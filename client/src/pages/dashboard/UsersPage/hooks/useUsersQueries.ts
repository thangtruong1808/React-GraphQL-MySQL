import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USERS_QUERY } from '../../../../services/graphql/userQueries';
import { UseUsersQueriesDependencies } from '../types';

/**
 * Custom hook for managing GraphQL queries for users
 * Handles data fetching and state updates with error handling
 */
export const useUsersQueries = ({
  pageSize,
  currentPage,
  searchQuery,
  sortBy,
  sortOrder,
  isInitializing,
  hasDashboardAccess,
  isAuthDataReady,
  setState,
}: UseUsersQueriesDependencies) => {
  // Wait for auth data to be ready to prevent race conditions during fast navigation
  const shouldSkip = isInitializing || !hasDashboardAccess || !isAuthDataReady;

  // Fetch users
  const { data, loading: queryLoading, refetch } = useQuery(GET_USERS_QUERY, {
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
    if (data?.users) {
      setState(prev => ({
        ...prev,
        users: data.users.users,
        paginationInfo: data.users.paginationInfo,
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

