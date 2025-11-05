import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_NOTIFICATIONS_QUERY } from '../../../../services/graphql/notificationQueries';
import { UseNotificationsQueriesDependencies } from '../types';

/**
 * Custom hook for managing GraphQL queries
 * Handles data fetching and state updates
 */
export const useNotificationsQueries = ({
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
}: UseNotificationsQueriesDependencies & { setState: React.Dispatch<React.SetStateAction<any>> }) => {
  // GraphQL query for notifications
  // Wait for auth data to be ready to prevent race conditions during fast navigation
  const { data, loading: queryLoading, refetch } = useQuery(GET_DASHBOARD_NOTIFICATIONS_QUERY, {
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
    skip: isInitializing || !hasDashboardAccess || !user || !isAuthDataReady,
  });

  /**
   * Sync state with GraphQL results
   * Handles loading states and data updates
   */
  useEffect(() => {
    if (data?.dashboardNotifications) {
      setState((prev: any) => ({
        ...prev,
        notifications: data.dashboardNotifications.notifications,
        paginationInfo: data.dashboardNotifications.paginationInfo,
        loading: queryLoading,
      }));
    } else {
      setState((prev: any) => ({
        ...prev,
        loading: queryLoading,
      }));
    }
  }, [data, queryLoading, setState]);

  return {
    data,
    queryLoading,
    refetch,
  };
};

