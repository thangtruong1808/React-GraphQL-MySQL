import { useQuery } from '@apollo/client';
import { SEARCH_MEMBERS, SEARCH_PROJECTS, SEARCH_TASKS } from '../../../services/graphql/queries';
import { SearchQueriesDependencies, SearchQueriesResult } from './types';

/**
 * Custom hook for GraphQL search queries
 * Handles all search-related GraphQL queries with proper skip conditions
 */
export const useSearchQueries = ({
  searchQuery,
  projectStatusFilter,
  taskStatusFilter,
  roleFilter,
}: SearchQueriesDependencies): SearchQueriesResult => {
  // Query for searching members by name/email and role filter
  const { data: membersData, loading: membersLoading } = useQuery(SEARCH_MEMBERS, {
    variables: {
      query: searchQuery || undefined,
      roleFilter: roleFilter.length > 0 ? roleFilter : undefined,
    },
    skip: (!searchQuery || searchQuery.length < 1) && roleFilter.length === 0, // Only run when there's a search query or role filter
    errorPolicy: 'all',
    fetchPolicy: 'network-only', // Always fetch fresh data from network
  });

  // Query for searching projects by status filter
  const { data: projectsData, loading: projectsLoading } = useQuery(SEARCH_PROJECTS, {
    variables: {
      statusFilter: projectStatusFilter.length > 0 ? projectStatusFilter : undefined,
    },
    skip: projectStatusFilter.length === 0, // Only run when there are project status filters
    errorPolicy: 'all',
    fetchPolicy: 'network-only', // Always fetch fresh data from network
  });

  // Query for searching tasks by status filter
  const { data: tasksData, loading: tasksLoading } = useQuery(SEARCH_TASKS, {
    variables: {
      taskStatusFilter: taskStatusFilter.length > 0 ? taskStatusFilter : undefined,
    },
    skip: taskStatusFilter.length === 0, // Only run when there are task status filters
    errorPolicy: 'all',
    fetchPolicy: 'network-only', // Always fetch fresh data from network
  });

  return {
    membersData,
    projectsData,
    tasksData,
    membersLoading,
    projectsLoading,
    tasksLoading,
  };
};

