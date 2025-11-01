import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../../../constants/routingConstants';
import { getProjectStatusColor } from '../../../constants/projectManagement';
import { ProjectsGridSkeleton } from '../../../components/ui';
import { Project } from './types';

/**
 * Projects Grid Component
 * Displays projects in a grid layout with client-side sorting
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

interface SortOption {
  field: 'name' | 'createdAt' | 'taskCount' | 'memberCount';
  direction: 'ASC' | 'DESC';
}

interface ProjectsGridProps {
  projects: Project[];
  sortOption: SortOption;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
}

/**
 * Projects grid component displaying filtered and sorted projects
 * Simple component that only handles rendering, data management is in parent
 */
const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  projects,
  sortOption,
  loading,
  loadingMore,
  hasMore
}) => {
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

  // Get status color for projects using theme variables
  const getStatusColor = (status: string) => {
    return getProjectStatusColor(status);
  };

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

  // Show skeleton when loading and no projects (during filter changes)
  if (loading && projects.length === 0) {
    return <ProjectsGridSkeleton />;
  }

  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto rounded-2xl shadow-lg p-8 border theme-border" style={{ backgroundColor: 'var(--card-bg)' }}>
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map((project: Project, index: number) => (
            <div key={`${project.id}-${index}`} className="rounded-lg shadow-md border theme-border hover:shadow-lg transition-shadow duration-200" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-lg leading-tight" style={{ color: 'var(--text-primary)' }}>{project.name}</h3>
                  <span className="px-3 py-1 text-xs font-medium rounded-full" style={getStatusColor(project.status)}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-sm mb-4 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>{project.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center" style={{ color: 'var(--text-secondary)' }}>
                      <svg className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400 [data-theme='brand']:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      {project.taskCount === 1 ? 'Task' : 'Tasks'}
                    </div>
                    <span className="font-semibold px-2 py-1 rounded-full text-xs" style={{ backgroundColor: 'var(--badge-secondary-bg)', color: 'var(--badge-secondary-text)' }}>{project.taskCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center" style={{ color: 'var(--text-secondary)' }}>
                      <svg className="w-4 h-4 mr-2 text-green-500 dark:text-green-400 [data-theme='brand']:text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {project.memberCount === 1 ? 'Team Member' : 'Team Members'}
                    </div>
                    <span className="font-semibold px-2 py-1 rounded-full text-xs" style={{ backgroundColor: 'var(--badge-success-bg)', color: 'var(--badge-success-text)' }}>{project.memberCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center" style={{ color: 'var(--text-secondary)' }}>
                      <svg className="w-4 h-4 mr-2 text-purple-500 dark:text-purple-400 [data-theme='brand']:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Project Owner
                    </div>
                    <span className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{project.owner.firstName} {project.owner.lastName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center" style={{ color: 'var(--text-secondary)' }}>
                      <svg className="w-4 h-4 mr-2 text-orange-500 dark:text-orange-400 [data-theme='brand']:text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Created
                    </div>
                    <span className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{formatCreatedDate(project.createdAt)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t theme-border">
                  <Link
                    to={`/projects/${project.id}`}
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

        {/* Loading skeleton for infinite scroll */}
        {loadingMore && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[...Array(6)].map((_, index) => (
                <div key={`skeleton-${index}`} className="bg-white dark:bg-gray-700 [data-theme='brand']:bg-gradient-to-br [data-theme='brand']:from-white [data-theme='brand']:to-purple-50 rounded-lg shadow-md border border-gray-100 dark:border-gray-600 [data-theme='brand']:border-purple-200 p-6 animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-600 [data-theme='brand']:bg-purple-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-600 [data-theme='brand']:bg-purple-200 rounded w-16"></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 [data-theme='brand']:bg-purple-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 [data-theme='brand']:bg-purple-200 rounded w-5/6"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 [data-theme='brand']:bg-purple-200 rounded w-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 [data-theme='brand']:bg-purple-200 rounded w-20"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 [data-theme='brand']:bg-purple-200 rounded w-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 [data-theme='brand']:bg-purple-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center py-3">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 dark:border-purple-400 [data-theme='brand']:border-purple-600"></div>
                <span className="text-gray-600 dark:text-gray-400 [data-theme='brand']:text-purple-700 text-sm">Loading more projects...</span>
              </div>
            </div>
          </>
        )}

        {/* End of results indicator */}
        {!hasMore && projects.length > 0 && (
          <div className="flex justify-center items-center py-3">
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-600 text-sm">
                <svg className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-500 [data-theme='brand']:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                You've reached the end of the projects list
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsGrid;
