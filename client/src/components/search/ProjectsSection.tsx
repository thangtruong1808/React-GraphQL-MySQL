import React from 'react';
import { getProjectStatusColor } from '../../constants/projectManagement';
import SearchSection from './SearchSection';
import ProjectStatusCounts from './ProjectStatusCounts';

/**
 * Projects Section Component
 * Displays search results for projects with pagination
 * Follows React best practices with proper TypeScript interfaces
 */

interface ProjectOwner {
  id: string;
  firstName: string;
  lastName: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  owner?: ProjectOwner;
}

interface ProjectsSectionProps {
  projects: Project[]; // Current page projects for display
  allProjects: Project[]; // All filtered projects for status breakdown calculation
  loading: boolean;
  hasQuery: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  onProjectClick?: (project: Project) => void;
}

/**
 * ProjectsSection Component
 * Renders project search results with pagination
 */
const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  allProjects,
  loading,
  hasQuery,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  onProjectClick
}) => {
  // Get status color classes with theme-aware styling
  const getStatusColor = (status: string) => {
    // Check if we're in brand theme by looking for data-theme attribute
    const isBrandTheme = document.documentElement.getAttribute('data-theme') === 'brand';
    const isDarkTheme = document.documentElement.classList.contains('dark');

    const theme = isBrandTheme ? 'brand' : isDarkTheme ? 'dark' : 'light';
    return getProjectStatusColor(status, theme);
  };

  // Handle project card click
  const handleProjectClick = (project: Project) => {
    if (onProjectClick) {
      onProjectClick(project);
    }
  };

  // Render individual project item with enhanced styling and labels
  const renderProject = (project: Project) => (
    <div
      key={project.id}
      className="group rounded-lg shadow-md border p-6 transition-shadow duration-200 cursor-pointer"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
        boxShadow: '0 4px 6px -1px var(--shadow-color)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 15px -3px var(--shadow-color)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px -1px var(--shadow-color)';
      }}
      onClick={() => handleProjectClick(project)}
    >
      <div className="space-y-4">
        {/* Project title */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>
            Project Name
          </label>
          <h3 className="text-lg font-semibold transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>{project.name}</h3>
        </div>

        {/* Project description */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>
            Description
          </label>
          <p className="leading-relaxed transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>{project.description}</p>
        </div>

        {/* Project metadata with enhanced layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
          {/* Status */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide mb-2" style={{ color: 'var(--text-secondary)' }}>
              Status
            </label>
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4 transition-colors duration-200" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(project.status)} group-hover:shadow-md transition-shadow duration-200`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Owner information */}
          {project.owner && (
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide mb-2" style={{ color: 'var(--text-secondary)' }}>
                Project Owner
              </label>
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 transition-colors duration-200" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>
                  {project.owner.firstName} {project.owner.lastName}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <SearchSection
      title="Projects"
      results={projects}
      loading={loading}
      hasQuery={hasQuery}
      emptyMessage="No projects found"
      renderItem={renderProject}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      headerContent={<ProjectStatusCounts projects={allProjects} totalProjects={totalItems} />}
    />
  );
};

export default ProjectsSection;
