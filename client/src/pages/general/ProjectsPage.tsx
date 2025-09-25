import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import { GET_PAGINATED_PROJECTS } from '../../services/graphql/queries';
import { InlineError } from '../../components/ui/InlineError';

/**
 * Projects Page Component
 * Displays all projects for public exploration
 * Allows users to browse projects without authentication
 */

// Project interface based on database schema
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

// Sort options interface
interface SortOption {
  field: 'name' | 'createdAt' | 'taskCount' | 'memberCount';
  direction: 'ASC' | 'DESC';
}

const ProjectsPage: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'createdAt', direction: 'DESC' });
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);
  const loadingRef = useRef(false);

  // Reset scroll position to top when component mounts for better UX
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  // Reset state when component mounts to prevent stale state issues
  useEffect(() => {
    // Only reset if we don't have any projects loaded
    if (allProjects.length === 0) {
      setAllProjects([]);
      setLoadingMore(false);
      setHasMore(true);
      setCurrentOffset(0);
      loadingRef.current = false;
    }

    // Cleanup function to reset state when component unmounts
    return () => {
      // Don't reset state on unmount to preserve cache
      loadingRef.current = false;
    };
  }, []);

  // Initial GraphQL query for projects
  const { data, loading, error, fetchMore } = useQuery(GET_PAGINATED_PROJECTS, {
    variables: { limit: 12, offset: 0 },
    fetchPolicy: 'cache-first', // Use cache to prevent flashing
    errorPolicy: 'all',
    onCompleted: (data) => {
      if (data?.paginatedProjects && allProjects.length === 0) {
        setAllProjects(data.paginatedProjects.projects);
        setHasMore(data.paginatedProjects.paginationInfo.hasNextPage);
        setCurrentOffset(data.paginatedProjects.projects.length);
      }
    }
  });

  // Restore pagination state from cached data if available
  useEffect(() => {
    if (data?.paginatedProjects && allProjects.length === 0) {
      const projects = data.paginatedProjects.projects;
      const paginationInfo = data.paginatedProjects.paginationInfo;

      setAllProjects(projects);
      setHasMore(paginationInfo.hasNextPage);
      // Set offset based on actual number of projects loaded from cache
      setCurrentOffset(projects.length);
    }
  }, [data, allProjects.length]);

  // Update hasMore state when data changes to ensure end message shows correctly
  useEffect(() => {
    if (data?.paginatedProjects?.paginationInfo) {
      const paginationInfo = data.paginatedProjects.paginationInfo;
      setHasMore(paginationInfo.hasNextPage);
    }
  }, [data]);

  // Load more projects function
  const loadMoreProjects = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (loadingRef.current || !hasMore || loadingMore) return;

    loadingRef.current = true;
    setLoadingMore(true);

    try {
      const result = await fetchMore({
        variables: {
          limit: 12,
          offset: currentOffset
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          // Merge the new projects with existing ones
          return {
            paginatedProjects: {
              ...fetchMoreResult.paginatedProjects,
              projects: [...prev.paginatedProjects.projects, ...fetchMoreResult.paginatedProjects.projects]
            }
          };
        }
      });

      if (result.data?.paginatedProjects) {
        const newProjects = result.data.paginatedProjects.projects;
        const paginationInfo = result.data.paginatedProjects.paginationInfo;

        setAllProjects(prev => [...prev, ...newProjects]);
        setHasMore(paginationInfo.hasNextPage);
        setCurrentOffset(prev => prev + 12);
      }
    } catch (err) {
      // Handle error silently to avoid console logs
    } finally {
      setLoadingMore(false);
      loadingRef.current = false;
    }
  }, [fetchMore, currentOffset, hasMore, loadingMore]);

  // Scroll event handler for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreProjects();
      }
    };

    // Only add scroll listener if we have projects and more to load
    if (allProjects.length > 0 && hasMore && !loadingMore) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMoreProjects, allProjects.length, hasMore, loadingMore]);

  // Use allProjects for filtering and display
  const projects = allProjects;
  const totalProjects = data?.paginatedProjects?.paginationInfo?.totalCount || 0;

  // Helper function to safely format creation date
  const formatCreatedDate = (createdAt: string): string => {
    try {
      const date = new Date(createdAt);
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Get status color for projects
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-purple-100 text-purple-800';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800';
      case 'PLANNING': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter projects based on selected status using useMemo for performance
  // Handle sort option changes
  const handleSortChange = useCallback((field: SortOption['field']) => {
    setSortOption(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'DESC' ? 'ASC' : 'DESC'
    }));
  }, []);

  // Sort and filter projects
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter((project: Project) =>
      filter === 'ALL' || project.status === filter
    );

    // Sort the filtered projects
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortOption.field) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'taskCount':
          aValue = a.taskCount;
          bValue = b.taskCount;
          break;
        case 'memberCount':
          aValue = a.memberCount;
          bValue = b.memberCount;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOption.direction === 'ASC' ? -1 : 1;
      if (aValue > bValue) return sortOption.direction === 'ASC' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [projects, filter, sortOption]);

  // Calculate filtered project counts for statistics - optimized single pass
  const projectCounts = useMemo(() => {
    let planning = 0;
    let inProgress = 0;
    let completed = 0;

    // Single pass through projects for better performance
    for (const project of projects) {
      switch ((project as Project).status) {
        case 'PLANNING':
          planning++;
          break;
        case 'IN_PROGRESS':
          inProgress++;
          break;
        case 'COMPLETED':
          completed++;
          break;
      }
    }

    return {
      total: projects.length,
      planning,
      inProgress,
      completed
    };
  }, [projects]);

  // Handle initial loading state - show simple spinner only if no cached data
  if (loading && allProjects.length === 0 && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <InlineError message={error.message || 'An error occurred'} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full public-dashboard bg-gray-50">
      <div className="w-full min-h-screen mt-10">
        {/* Header Section */}
        <div className=" py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Explore Our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Projects
                </span>
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
                Discover {totalProjects} innovative projects managed through TaskFlow. From cutting-edge technology solutions to business-critical applications.
              </p>

              {/* Project Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <div className="bg-gray-100 rounded-xl p-6 shadow-lg border border-gray-300 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-1">
                  <div className="flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 text-center">{projectCounts.total}</div>
                  <div className="text-sm text-gray-600 text-center">Total Projects</div>
                </div>
                <div className="bg-gray-100 rounded-xl p-6 shadow-lg border border-gray-300 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-500 transform hover:-translate-y-1">
                  <div className="flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-orange-600 text-center">{projectCounts.inProgress}</div>
                  <div className="text-sm text-gray-600 text-center">Active</div>
                </div>
                <div className="bg-gray-100 rounded-xl p-6 shadow-lg border border-gray-300 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-500 transform hover:-translate-y-1">
                  <div className="flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-indigo-600 text-center">{projectCounts.planning}</div>
                  <div className="text-sm text-gray-600 text-center">Planning</div>
                </div>
                <div className="bg-gray-100 rounded-xl p-6 shadow-lg border border-gray-300 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-500 transform hover:-translate-y-1">
                  <div className="flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-green-600 text-center">{projectCounts.completed}</div>
                  <div className="text-sm text-gray-600 text-center">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Filter Section */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  { key: 'ALL', label: 'All Projects', count: projectCounts.total, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                  { key: 'PLANNING', label: 'Planning', count: projectCounts.planning, icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
                  { key: 'IN_PROGRESS', label: 'In Progress', count: projectCounts.inProgress, icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                  { key: 'COMPLETED', label: 'Completed', count: projectCounts.completed, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                ].map((filterOption) => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key as any)}
                    className={`flex items-center px-6 py-3 rounded-lg text-sm font-medium transition-all duration-500 ${filter === filterOption.key
                      ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600 border border-gray-200 hover:border-purple-500 transition-all duration-500 transform hover:scale-105 hover:shadow-lg'
                      }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={filterOption.icon} />
                    </svg>
                    {filterOption.label} ({filterOption.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Section */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3 justify-center items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">Sort by:</span>
                {[
                  { field: 'name' as const, label: 'Name', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14' },
                  { field: 'createdAt' as const, label: 'Date Created', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                  { field: 'taskCount' as const, label: 'Tasks', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
                  { field: 'memberCount' as const, label: 'Members', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                ].map((sortButton) => (
                  <button
                    key={sortButton.field}
                    onClick={() => handleSortChange(sortButton.field)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${sortButton.field === sortOption.field
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 hover:border-indigo-500'
                      }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortButton.icon} />
                    </svg>
                    {sortButton.label}
                    {sortButton.field === sortOption.field && (
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOption.direction === 'ASC' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project: Project, index: number) => (
                <div key={`${project.id}-${index}`} className="bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight">{project.name}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                          Tasks
                        </div>
                        <span className="font-semibold text-gray-900 bg-indigo-50 px-2 py-1 rounded-full text-xs">{project.taskCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Team Members
                        </div>
                        <span className="font-semibold text-gray-900 bg-green-50 px-2 py-1 rounded-full text-xs">{project.memberCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Project Owner
                        </div>
                        <span className="font-medium text-gray-900 text-xs">{project.owner.firstName} {project.owner.lastName}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Created
                        </div>
                        <span className="font-medium text-gray-900 text-xs">{formatCreatedDate(project.createdAt)}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <Link
                        to={ROUTE_PATHS.LOGIN}
                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading skeleton for infinite scroll - shows below existing projects */}
            {loadingMore && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={`skeleton-${index}`} className="bg-white rounded-lg shadow-md border border-gray-100 p-6 animate-pulse">
                      <div className="flex items-start justify-between mb-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <div className="h-4 bg-gray-200 rounded w-4"></div>
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-4 bg-gray-200 rounded w-4"></div>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center items-center py-4">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                    <span className="text-gray-600 text-sm">Loading more projects...</span>
                  </div>
                </div>
              </>
            )}

            {/* End of results indicator */}
            {!hasMore && !loadingMore && allProjects.length > 0 && (
              <div className="flex justify-center items-center py-8">
                <div className="text-center">
                  <div className="text-gray-500 text-sm">
                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    You've reached the end of the projects list
                  </div>
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-12 text-center">
              <div className="rounded-2xl p-8 border border-gray-100 bg-white shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Start Your Project?
                </h2>
                <p className="text-gray-700 mb-6">
                  Join our community and start managing your projects with TaskFlow today.
                </p>
                <Link
                  to={ROUTE_PATHS.LOGIN}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Get Started with TaskFlow
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
