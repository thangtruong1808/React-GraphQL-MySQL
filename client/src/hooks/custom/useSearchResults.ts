import { useState, useEffect, useMemo } from 'react';
import { useSearchQueries } from './useSearchResults/queries';
import { processSearchResults } from './useSearchResults/processors';
import { getSearchType } from './useSearchResults/utils';
import { UseSearchResultsProps, UseSearchResultsReturn, SearchResults } from './useSearchResults/types';

/**
 * Custom hook for search results management
 * Combines all search-related modules into a unified interface
 * Handles GraphQL queries, result processing, and search type determination
 */
export const useSearchResults = ({
  searchQuery,
  projectStatusFilter,
  taskStatusFilter,
  roleFilter,
}: UseSearchResultsProps): UseSearchResultsReturn => {
  // State for search results
  const [searchResults, setSearchResults] = useState<SearchResults>({
    members: [],
    projects: [],
    tasks: [],
  });

  // Execute GraphQL queries for search functionality
  const { membersData, projectsData, tasksData, membersLoading, projectsLoading, tasksLoading } = useSearchQueries({
    searchQuery,
    projectStatusFilter,
    taskStatusFilter,
    roleFilter,
  });

  // Memoize search parameters to prevent infinite loops
  const memoizedSearchQuery = useMemo(() => searchQuery, [searchQuery]);
  const memoizedProjectStatusFilter = useMemo(() => projectStatusFilter, [projectStatusFilter.join(',')]);
  const memoizedTaskStatusFilter = useMemo(() => taskStatusFilter, [taskStatusFilter.join(',')]);

  // Update search results when GraphQL data changes
  // Search behavior:
  // - q=th: Searches users by firstname, lastname, or email containing "th"
  // - projectStatus=IN_PROGRESS: Searches projects with status "IN_PROGRESS"
  // - taskStatus=TODO: Searches tasks with status "TODO"
  // - Combined: Filters results to show only matching combinations
  useEffect(() => {
    const processedResults = processSearchResults({
      membersData,
      projectsData,
      tasksData,
      memoizedSearchQuery,
      memoizedProjectStatusFilter,
      memoizedTaskStatusFilter,
    });

    setSearchResults(processedResults);
  }, [membersData, projectsData, tasksData, memoizedSearchQuery, memoizedProjectStatusFilter, memoizedTaskStatusFilter]);

  // Determine search type and criteria
  const { isUserSearch, isProjectStatusSearch, isTaskStatusSearch, isRoleSearch, hasSearchCriteria } = getSearchType({
    searchQuery,
    projectStatusFilter,
    taskStatusFilter,
    roleFilter,
  });

  return {
    searchResults,
    loading: {
      members: membersLoading,
      projects: projectsLoading,
      tasks: tasksLoading,
    },
    hasSearchCriteria,
    searchType: {
      isUserSearch,
      isProjectStatusSearch,
      isTaskStatusSearch,
      isRoleSearch,
    },
  };
};

export type { UseSearchResultsProps, UseSearchResultsReturn, SearchResults } from './useSearchResults/types';
