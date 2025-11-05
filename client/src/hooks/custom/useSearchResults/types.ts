/**
 * Types for useSearchResults hook
 * Defines all interfaces and types used in search results management
 */

export interface SearchResults {
  members: any[];
  projects: any[];
  tasks: any[];
}

export interface UseSearchResultsProps {
  searchQuery: string;
  projectStatusFilter: string[];
  taskStatusFilter: string[];
  roleFilter: string[];
}

export interface UseSearchResultsReturn {
  searchResults: SearchResults;
  loading: {
    members: boolean;
    projects: boolean;
    tasks: boolean;
  };
  hasSearchCriteria: boolean;
  searchType: {
    isUserSearch: boolean;
    isProjectStatusSearch: boolean;
    isTaskStatusSearch: boolean;
    isRoleSearch: boolean;
  };
}

export interface SearchQueriesDependencies {
  searchQuery: string;
  projectStatusFilter: string[];
  taskStatusFilter: string[];
  roleFilter: string[];
}

export interface SearchQueriesResult {
  membersData: any;
  projectsData: any;
  tasksData: any;
  membersLoading: boolean;
  projectsLoading: boolean;
  tasksLoading: boolean;
}

export interface SearchProcessorsDependencies {
  membersData: any;
  projectsData: any;
  tasksData: any;
  memoizedSearchQuery: string;
  memoizedProjectStatusFilter: string[];
  memoizedTaskStatusFilter: string[];
}

export interface SearchTypeDependencies {
  searchQuery: string;
  projectStatusFilter: string[];
  taskStatusFilter: string[];
  roleFilter: string[];
}

