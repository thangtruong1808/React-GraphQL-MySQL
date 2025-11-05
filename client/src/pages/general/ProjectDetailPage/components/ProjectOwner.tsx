import React from 'react';
import { formatRoleForDisplay } from '../../../../utils/roleFormatter';
import { ProjectDetails } from '../types';

/**
 * Project Owner Component
 * Displays project owner information
 */
export const ProjectOwner: React.FC<{ project: ProjectDetails }> = ({ project }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/20 p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Project Owner</h2>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">
            {project.owner.firstName.charAt(0)}
            {project.owner.lastName.charAt(0)}
          </span>
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {project.owner.firstName} {project.owner.lastName}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{project.owner.email}</div>
          <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
            {formatRoleForDisplay(project.owner.role)}
          </div>
        </div>
      </div>
    </div>
  );
};

