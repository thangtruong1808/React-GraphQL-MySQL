import React from 'react';

/**
 * Projects Header Component
 * Displays the main header section with project statistics
 */

interface ProjectsHeaderProps {
  totalProjects: number;
}

/**
 * Header component for projects page displaying title and statistics
 */
const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({ totalProjects }) => {
  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto rounded-2xl shadow-lg p-8 border theme-border" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Explore Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Projects
            </span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            Discover {totalProjects} innovative projects managed through TaskFlow. From cutting-edge technology solutions to business-critical applications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectsHeader;
