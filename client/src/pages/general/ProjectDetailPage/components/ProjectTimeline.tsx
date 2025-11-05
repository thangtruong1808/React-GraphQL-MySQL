import React from 'react';
import { ProjectDetails } from '../types';

/**
 * Project Timeline Props
 */
export interface ProjectTimelineProps {
  project: ProjectDetails;
  formatDate: (dateString: string) => string;
}

/**
 * Project Timeline Component
 * Displays project creation and update dates
 */
export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ project, formatDate }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/20 p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Project Timeline</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Created:</span>
          <span className="text-gray-700 dark:text-gray-300 text-sm">{formatDate(project.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
          <span className="text-gray-700 dark:text-gray-300 text-sm">{formatDate(project.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

