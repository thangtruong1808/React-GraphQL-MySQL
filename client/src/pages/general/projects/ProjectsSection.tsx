import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PAGINATED_PROJECTS, GET_PROJECT_STATUS_DISTRIBUTION } from '../../../services/graphql/queries';
import { FilterType, SortOption, Project, ProjectCounts } from './types';
import ProjectsFilters from './ProjectsFilters';
import ProjectsGrid from './ProjectsGrid';

/**
 * Projects Section Component
 * Combines filters and grid to manage filter state locally and isolate re-renders
 * Only this component re-renders when filters change, not the entire page
 */
interface ProjectsSectionProps {
  sortOption: SortOption;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ sortOption }) => {
  // Local state for filtering and pagination
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [currentOffset, setCurrentOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch projects from GraphQL API with server-side status filtering
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_PAGINATED_PROJECTS, {
    variables: {
      limit: 12,
      offset: 0,
      statusFilter: filter === 'ALL' ? null : filter
    },
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true
  });

  // Fetch project statistics from entire database for statistics section
  const { data: statsData } = useQuery(GET_PROJECT_STATUS_DISTRIBUTION, {
    fetchPolicy: 'cache-first',
    errorPolicy: 'all'
  });

  // Handle filter changes - refetch data with new status filter
  useEffect(() => {
    setCurrentOffset(0);
    refetch({
      limit: 12,
      offset: 0,
      statusFilter: filter === 'ALL' ? null : filter
    });
  }, [filter, refetch]);

  // Load more projects function for infinite scroll
  const loadMoreProjects = useCallback(async () => {
    if (loadingMore) return;

    setLoadingMore(true);
    try {
      const result = await fetchMore({
        variables: {
          limit: 12,
          offset: currentOffset + 12,
          statusFilter: filter === 'ALL' ? null : filter
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          const newProjects = fetchMoreResult.paginatedProjects.projects;
          const newPaginationInfo = fetchMoreResult.paginatedProjects.paginationInfo;

          return {
            paginatedProjects: {
              ...fetchMoreResult.paginatedProjects,
              projects: [...prev.paginatedProjects.projects, ...newProjects],
              paginationInfo: newPaginationInfo
            }
          };
        }
      });

      if (result.data?.paginatedProjects) {
        setCurrentOffset(prev => prev + 12);
      }
    } catch (err) {
      // Handle error silently
    } finally {
      setLoadingMore(false);
    }
  }, [fetchMore, currentOffset, filter, loadingMore]);

  // Scroll event handler for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreProjects();
      }
    };

    // Only add scroll listener if we have projects and more to load
    if (data?.paginatedProjects?.projects.length > 0 && data?.paginatedProjects?.paginationInfo.hasNextPage && !loadingMore) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMoreProjects, data?.paginatedProjects?.projects.length, data?.paginatedProjects?.paginationInfo.hasNextPage, loadingMore]);

  // Get projects and pagination info from GraphQL data
  const projects = data?.paginatedProjects?.projects || [];
  const hasMore = data?.paginatedProjects?.paginationInfo?.hasNextPage || false;


  // Client-side sorting of projects
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortOption.field) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case 'taskCount':
          aVal = a.taskCount;
          bVal = b.taskCount;
          break;
        case 'memberCount':
          aVal = a.memberCount;
          bVal = b.memberCount;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOption.direction === 'ASC' ? -1 : 1;
      if (aVal > bVal) return sortOption.direction === 'ASC' ? 1 : -1;
      return 0;
    });
  }, [projects, sortOption.field, sortOption.direction]);

  // Get project statistics from database-wide query
  const projectCounts: ProjectCounts = {
    total: statsData?.projectStatusDistribution ?
      (statsData.projectStatusDistribution.planning + statsData.projectStatusDistribution.inProgress + statsData.projectStatusDistribution.completed) : 0,
    planning: statsData?.projectStatusDistribution?.planning || 0,
    inProgress: statsData?.projectStatusDistribution?.inProgress || 0,
    completed: statsData?.projectStatusDistribution?.completed || 0
  };

  // No loading skeleton here - handled by parent ProjectsPage

  return (
    <>
      {/* Projects Filters - Server-side filtering */}
      <ProjectsFilters
        filter={filter}
        setFilter={setFilter}
        projectCounts={projectCounts}
      />

      {/* Projects Grid */}
      <ProjectsGrid
        projects={sortedProjects}
        sortOption={sortOption}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
      />
    </>
  );
};

export default ProjectsSection;
