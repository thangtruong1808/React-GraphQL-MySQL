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
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 [data-theme='brand']:bg-gradient-to-br [data-theme='brand']:from-purple-50 [data-theme='brand']:to-pink-50 rounded-2xl shadow-lg dark:shadow-gray-900/20 [data-theme='brand']:shadow-purple-200/20 p-8 border border-gray-200 dark:border-gray-700 [data-theme='brand']:border-purple-200">
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
        </div>
      </div>
    </div>
  );
};

export default ProjectsHeader;
