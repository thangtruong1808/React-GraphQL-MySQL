import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ProjectsGridSkeleton } from '../../../components/ui';
import { getProjectStatusColor } from '../../../constants/projectManagement';
import { Project, SortOption } from './types';

/**
 * Description: Presents projects in a responsive grid with client-side sorting and states.
 * Data created: Derived sorted project list for rendering.
 * Author: thangtruong
 */

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
      <div
        className="max-w-7xl mx-auto rounded-2xl shadow-lg p-8 border theme-border"
        style={{
          backgroundColor: 'var(--card-bg)',
          backgroundImage: 'var(--card-surface-overlay)',
          borderColor: 'var(--border-color)',
          boxShadow: '0 24px 48px var(--shadow-color)'
        }}
      >
        {/* Projects Grid */}
        {sortedProjects.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>No projects to display</h3>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Projects will appear here as soon as your team creates them.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProjects.map((project: Project, index: number) => (
              <div
                key={`${project.id}-${index}`}
                className="rounded-lg shadow-md border theme-border hover:shadow-lg transition-transform duration-200 hover:-translate-y-1"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  backgroundImage: 'var(--card-surface-overlay)',
                  borderColor: 'var(--border-color)',
                  boxShadow: '0 20px 40px var(--shadow-color)'
                }}
                onMouseEnter={(event) => {
                  const target = event.currentTarget as HTMLDivElement;
                  target.style.backgroundColor = 'var(--card-hover-bg)';
                  target.style.boxShadow = '0 24px 52px var(--shadow-color)';
                }}
                onMouseLeave={(event) => {
                  const target = event.currentTarget as HTMLDivElement;
                  target.style.backgroundColor = 'var(--card-bg)';
                  target.style.boxShadow = '0 20px 40px var(--shadow-color)';
                }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-lg leading-tight" style={{ color: 'var(--text-primary)' }}>{project.name}</h3>
                    <span className="px-3 py-0.5 text-[0.625rem] font-medium rounded-full whitespace-nowrap" style={getStatusColor(project.status)}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-sm mb-4 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>{project.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center" style={{ color: 'var(--text-secondary)' }}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--icon-tasks-fg)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        {project.taskCount === 1 ? 'Task' : 'Tasks'}
                      </div>
                      <span className="font-semibold px-2 py-1 rounded-full text-xs" style={{ backgroundColor: 'var(--badge-secondary-bg)', color: 'var(--badge-secondary-text)' }}>{project.taskCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center" style={{ color: 'var(--text-secondary)' }}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--icon-users-fg)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {project.memberCount === 1 ? 'Team Member' : 'Team Members'}
                      </div>
                      <span className="font-semibold px-2 py-1 rounded-full text-xs" style={{ backgroundColor: 'var(--badge-success-bg)', color: 'var(--badge-success-text)' }}>{project.memberCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center" style={{ color: 'var(--text-secondary)' }}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--icon-activity-fg)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Project Owner
                      </div>
                      <span className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{project.owner.firstName} {project.owner.lastName}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center" style={{ color: 'var(--text-secondary)' }}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--icon-projects-fg)' }}>
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
                      className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      style={{
                        backgroundImage: 'linear-gradient(120deg, var(--accent-from), var(--accent-to))',
                        color: 'var(--button-primary-text)',
                        boxShadow: '0 16px 32px rgba(124, 58, 237, 0.22)'
                      }}
                      onMouseEnter={(event) => {
                        event.currentTarget.style.boxShadow = '0 20px 40px rgba(124, 58, 237, 0.3)';
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.boxShadow = '0 16px 32px rgba(124, 58, 237, 0.22)';
                      }}
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
        )}

        {/* Loading skeleton for infinite scroll */}
        {loadingMore && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="rounded-lg border theme-border p-6 animate-pulse"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    backgroundImage: 'var(--card-surface-overlay)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-6 rounded w-3/4" style={{ backgroundColor: 'var(--border-light)' }}></div>
                    <div className="h-6 rounded w-16" style={{ backgroundColor: 'var(--border-light)' }}></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 rounded w-full" style={{ backgroundColor: 'var(--border-light)' }}></div>
                    <div className="h-4 rounded w-5/6" style={{ backgroundColor: 'var(--border-light)' }}></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 rounded w-4" style={{ backgroundColor: 'var(--border-light)' }}></div>
                      <div className="h-4 rounded w-20" style={{ backgroundColor: 'var(--border-light)' }}></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-4 rounded w-4" style={{ backgroundColor: 'var(--border-light)' }}></div>
                      <div className="h-4 rounded w-16" style={{ backgroundColor: 'var(--border-light)' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center py-3">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ borderColor: 'var(--accent-from)' }}></div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading more projects...</span>
              </div>
            </div>
          </>
        )}

        {/* End of results indicator */}
        {!hasMore && projects.length > 0 && (
          <div className="flex justify-center items-center py-3">
            <div className="text-center">
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--icon-activity-fg)' }}>
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
