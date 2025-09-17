import React from 'react';
import SearchSection from './SearchSection';

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
  projects: Project[];
  loading: boolean;
  hasQuery: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * ProjectsSection Component
 * Renders project search results with pagination
 */
const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  loading,
  hasQuery,
  currentPage,
  totalPages,
  onPageChange
}) => {
  // Get status color classes
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800';
      case 'IN_PROGRESS':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-indigo-100 text-indigo-800';
    }
  };

  // Render individual project item
  const renderProject = (project: Project) => (
    <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Project title */}
          <h3 className="text-lg font-medium text-gray-900 mb-2">{project.name}</h3>

          {/* Project description */}
          <p className="text-gray-600 mb-3">{project.description}</p>

          {/* Project metadata */}
          <div className="flex items-center space-x-4">
            {/* Status badge */}
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
              {project.status.replace('_', ' ')}
            </span>

            {/* Owner information */}
            {project.owner && (
              <span className="text-sm text-gray-500">
                Owner: {project.owner.firstName} {project.owner.lastName}
              </span>
            )}
          </div>
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
    />
  );
};

export default ProjectsSection;
