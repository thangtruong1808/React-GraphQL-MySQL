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
      className="group bg-white dark:bg-gray-700 [data-theme='brand']:bg-gradient-to-br [data-theme='brand']:from-white [data-theme='brand']:to-purple-50 rounded-lg shadow-md border border-gray-100 dark:border-gray-600 [data-theme='brand']:border-purple-200 p-6 hover:shadow-lg dark:hover:shadow-gray-900/30 [data-theme='brand']:hover:shadow-purple-200/30 transition-shadow duration-200 cursor-pointer"
      onClick={() => handleProjectClick(project)}
    >
      <div className="space-y-4">
        {/* Project title */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-800 uppercase tracking-wide mb-1">
            Project Name
          </label>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white [data-theme='brand']:text-purple-900 group-hover:text-green-700 dark:group-hover:text-green-400 [data-theme='brand']:group-hover:text-purple-700 transition-colors duration-200">{project.name}</h3>
        </div>

        {/* Project description */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-800 uppercase tracking-wide mb-1">
            Description
          </label>
          <p className="text-gray-700 dark:text-gray-300 [data-theme='brand']:text-purple-800 leading-relaxed group-hover:text-green-600 dark:group-hover:text-green-400 [data-theme='brand']:group-hover:text-purple-700 transition-colors duration-200">{project.description}</p>
        </div>

        {/* Project metadata with enhanced layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-600">
          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-800 uppercase tracking-wide mb-2">
              Status
            </label>
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4 text-gray-400 dark:text-gray-500 [data-theme='brand']:text-purple-600 group-hover:text-purple-500 dark:group-hover:text-purple-400 [data-theme='brand']:group-hover:text-purple-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-600 uppercase tracking-wide mb-2">
                Project Owner
              </label>
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-gray-400 dark:text-gray-500 [data-theme='brand']:text-purple-500 group-hover:text-green-500 dark:group-hover:text-green-400 [data-theme='brand']:group-hover:text-emerald-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 [data-theme='brand']:text-purple-700 group-hover:text-green-600 dark:group-hover:text-green-400 [data-theme='brand']:group-hover:text-emerald-600 transition-colors duration-200">
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
