import React from 'react';
import { ProjectDetails } from '../types';

/**
 * Project Header Props
 */
export interface ProjectHeaderProps {
  project: ProjectDetails;
  totalTasks: number;
  totalMembers: number;
  completedTasks: number;
  inProgressTasks: number;
  getStatusColor: (status: string) => React.CSSProperties;
}

/**
 * Project Header Component
 * Displays project name, description, status, and statistics
 */
export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  totalTasks,
  totalMembers,
  completedTasks,
  inProgressTasks,
  getStatusColor,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/20 p-8 mb-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{project.name}</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">{project.description}</p>
        </div>
        <span className="px-4 py-2 text-sm font-medium rounded-full" style={getStatusColor(project.status)}>
          {project.status.replace('_', ' ')}
        </span>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalTasks}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalMembers}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Team Members</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completedTasks}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed Tasks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{inProgressTasks}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
        </div>
      </div>
    </div>
  );
};

