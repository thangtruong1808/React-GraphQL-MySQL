import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_PROJECT_MEMBERS_QUERY } from '../../../../services/graphql/projectMemberQueries';
import { UseMembersQueriesDependencies } from '../types';

/**
 * Custom hook for managing GraphQL queries for members
 * Handles data fetching and state updates with error handling
 */
export const useMembersQueries = ({
  projectId,
  pageSize,
  currentPage,
  searchQuery,
  sortBy,
  sortOrder,
  isInitializing,
  hasDashboardAccess,
  isAuthDataReady,
  setState,
}: UseMembersQueriesDependencies) => {
  // Project members query - use lazy query to fetch when needed
  const [getProjectMembers, { data: memberData, loading: memberQueryLoading, refetch: refetchMembers }] = useLazyQuery(GET_PROJECT_MEMBERS_QUERY, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  /**
   * Update member state when GraphQL member data changes
   * Handles loading states and member data updates
   */
  useEffect(() => {
    if (memberData?.projectMembers) {
      setState(prev => ({
        ...prev,
        members: memberData.projectMembers.members,
        paginationInfo: memberData.projectMembers.paginationInfo,
        loading: memberQueryLoading,
      }));
    } else {
      setState(prev => ({
        ...prev,
        loading: memberQueryLoading,
      }));
    }
  }, [memberData, memberQueryLoading, setState]);

  return {
    getProjectMembers,
    memberQueryLoading,
    refetchMembers,
  };
};

