import React from 'react';
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
  // Get status color classes - matching ProjectStatusCounts breakdown colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={() => handleProjectClick(project)}

    >
      <div className="space-y-4">
        {/* Project title */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Project Name
          </label>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors duration-200">{project.name}</h3>
        </div>

        {/* Project description */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Description
          </label>
          <p className="text-gray-700 leading-relaxed group-hover:text-green-600 transition-colors duration-200">{project.description}</p>
        </div>

        {/* Project metadata with enhanced layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Status
            </label>
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Project Owner
              </label>
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors duration-200">
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
