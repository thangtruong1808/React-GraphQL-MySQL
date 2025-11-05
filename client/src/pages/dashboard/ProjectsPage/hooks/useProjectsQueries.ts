import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_PROJECTS_QUERY } from '../../../../services/graphql/projectQueries';
import { UseProjectsQueriesDependencies } from '../types';

/**
 * Custom hook for managing GraphQL queries for projects
 * Handles data fetching and state updates with error handling
 */
export const useProjectsQueries = ({
  pageSize,
  currentPage,
  searchQuery,
  sortBy,
  sortOrder,
  isInitializing,
  hasDashboardAccess,
  isAuthDataReady,
  setState,
}: UseProjectsQueriesDependencies) => {
  // Wait for auth data to be ready to prevent race conditions during fast navigation
  const shouldSkip = isInitializing || !hasDashboardAccess || !isAuthDataReady;

  // Fetch projects
  const { data, loading: queryLoading, refetch } = useQuery(GET_DASHBOARD_PROJECTS_QUERY, {
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
    if (data?.dashboardProjects) {
      setState(prev => ({
        ...prev,
        projects: data.dashboardProjects.projects,
        paginationInfo: data.dashboardProjects.paginationInfo,
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
  };
};

