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
 * Description: Displays project name, description, status, and statistics
 * Date: 2024-12-19
 * Author: thangtruong
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
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        {/* Project Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{project.name}</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">{project.description}</p>
        </div>
        {/* Project Status */}
        <span className="px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap" style={getStatusColor(project.status)}>
          {project.status.replace('_', ' ')}
        </span>
      </div>

      {/* Project Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Tasks Stat */}
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalTasks}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
        </div>
        {/* Team Members Stat */}
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalMembers}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Team Members</div>
        </div>
        {/* Completed Tasks Stat */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completedTasks}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed Tasks</div>
        </div>
        {/* In Progress Tasks Stat */}
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{inProgressTasks}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
        </div>
      </div>
    </div>
  );
};

