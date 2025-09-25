import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PAGINATED_PROJECTS, GET_PROJECTS } from '../../services/graphql/queries';

/**
 * Project interface for infinite scroll
 * Matches the GraphQL schema structure
 */
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED';
  taskCount: number;
  memberCount: number;
  createdAt: string;
  owner: {
    firstName: string;
    lastName: string;
  };
}

/**
 * Pagination info interface
 * Contains metadata for infinite scroll navigation
 */
interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

/**
 * GraphQL response interface for paginated projects
 */
interface PaginatedProjectsResponse {
  paginatedProjects: {
    projects: Project[];
    paginationInfo: PaginationInfo;
  };
}

/**
 * Custom hook for infinite scroll projects functionality
 * Manages pagination state and provides methods for loading more projects
 * Uses Apollo Client for GraphQL data fetching with automatic caching
 */
export const useInfiniteScrollProjects = (itemsPerPage: number = 6) => {
  // State for accumulated projects from all loaded pages
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  
  // State for current pagination info
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    hasNextPage: false,
    hasPreviousPage: false,
    totalCount: 0,
    currentPage: 1,
    totalPages: 0
  });
  
  // State for loading more projects
  const [loadingMore, setLoadingMore] = useState(false);
  
  // State for error handling
  const [error, setError] = useState<string | null>(null);
  
  // Ref to track if we're currently fetching to prevent duplicate requests
  const fetchingRef = useRef(false);
  
  // Ref to track retry count to prevent infinite loops
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;
  
  // Ref to track current pagination info to avoid stale closures
  const paginationInfoRef = useRef<PaginationInfo>({
    hasNextPage: false,
    hasPreviousPage: false,
    totalCount: 0,
    currentPage: 1,
    totalPages: 0
  });
  
  // Current offset for pagination
  const [currentOffset, setCurrentOffset] = useState(0);
  const currentOffsetRef = useRef(0);

  // Ref to store the fetchMore function to avoid dependency issues
  const fetchMoreRef = useRef<any>(null);

  // Initial query to load first page of projects
  const { data, loading, error: queryError, fetchMore } = useQuery<PaginatedProjectsResponse>(
    GET_PAGINATED_PROJECTS,
    {
      variables: {
        limit: itemsPerPage,
        offset: 0
      },
      fetchPolicy: 'network-only', // Always fetch from network
      errorPolicy: 'all', // Continue even if there are errors
      onCompleted: (data) => {
        // Initialize projects and pagination info on first load
        if (data?.paginatedProjects) {
          setAllProjects(data.paginatedProjects.projects);
          setPaginationInfo(data.paginatedProjects.paginationInfo);
          paginationInfoRef.current = data.paginatedProjects.paginationInfo;
          setCurrentOffset(itemsPerPage); // Set offset for next page
          currentOffsetRef.current = itemsPerPage;
        }
      },
      onError: (error) => {
        setError(error.message);
      }
    }
  );

  // Update fetchMore ref whenever it changes
  useEffect(() => {
    fetchMoreRef.current = fetchMore;
  }, [fetchMore]);

  /**
   * Load more projects for infinite scroll
   * Fetches next page and appends to existing projects
   */
  const loadMoreProjects = useCallback(async () => {
    // Prevent duplicate requests and check retry limit
    if (fetchingRef.current || loadingMore || retryCountRef.current >= MAX_RETRIES) {
      return;
    }

    // Check if there are more pages to load using ref to avoid stale closure
    if (!paginationInfoRef.current.hasNextPage) {
      return;
    }

    fetchingRef.current = true;
    setLoadingMore(true);
    setError(null);
    retryCountRef.current += 1;

    try {
      // Fetch next page using fetchMore with new offset
      const result = await fetchMoreRef.current({
        variables: {
          limit: itemsPerPage,
          offset: currentOffsetRef.current
        }
      });

      if (result.data?.paginatedProjects) {
        const newProjects = result.data.paginatedProjects.projects;
        const newPaginationInfo = result.data.paginatedProjects.paginationInfo;
        
        // Append new projects to existing ones, avoiding duplicates
        setAllProjects(prevProjects => {
          const existingIds = new Set(prevProjects.map(p => p.id));
          const uniqueNewProjects = newProjects.filter(p => !existingIds.has(p.id));
          return [...prevProjects, ...uniqueNewProjects];
        });
        setPaginationInfo(newPaginationInfo);
        paginationInfoRef.current = newPaginationInfo;
        setCurrentOffset(prevOffset => prevOffset + itemsPerPage);
        currentOffsetRef.current = currentOffsetRef.current + itemsPerPage;
        
        // Reset retry count on successful load
        retryCountRef.current = 0;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more projects');
    } finally {
      setLoadingMore(false);
      fetchingRef.current = false;
    }
  }, [itemsPerPage]);

  /**
   * Reset to initial state
   * Clears all projects and reloads first page
   */
  const resetProjects = useCallback(async () => {
    setAllProjects([]);
    setCurrentOffset(0);
    currentOffsetRef.current = 0;
    setError(null);
    setLoadingMore(false);
    fetchingRef.current = false;
    retryCountRef.current = 0;
    
    // Reset pagination info ref
    paginationInfoRef.current = {
      hasNextPage: false,
      hasPreviousPage: false,
      totalCount: 0,
      currentPage: 1,
      totalPages: 0
    };
    
    // Refetch first page
    await fetchMoreRef.current({
      variables: {
        limit: itemsPerPage,
        offset: 0
      }
    });
  }, [itemsPerPage]);

  /**
   * Check if we should load more projects
   * Returns true if there are more pages and we're not currently loading
   */
  const hasMoreProjects = paginationInfo.hasNextPage && !loadingMore;

  /**
   * Get loading state
   * Returns true if initial loading or loading more projects
   */
  const isLoading = loading || loadingMore;

  return {
    // Data
    projects: allProjects,
    paginationInfo,
    
    // Loading states
    loading: isLoading,
    loadingMore,
    
    // Error handling
    error: error || (queryError?.message || null),
    
    // Actions
    loadMoreProjects,
    resetProjects,
    
    // Computed values
    hasMoreProjects,
    totalProjects: paginationInfo.totalCount
  };
};
