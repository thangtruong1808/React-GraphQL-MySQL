import React from 'react';

/**
 * Project Filters Component
 * Handles project status filtering with checkboxes
 * Displays planning, in progress, and completed project status options
 */

// Props interface for ProjectFilters component
interface ProjectFiltersProps {
  projectFilters: {
    planning: boolean;
    inProgress: boolean;
    completed: boolean;
  };
  onProjectFilterChange: (status: keyof ProjectFiltersProps['projectFilters']) => void;
  onClearProjectFilters: () => void;
}

/**
 * ProjectFilters Component
 * Renders project status filter checkboxes with icons and color-coded indicators
 * Enhanced with meaningful icons for better user experience
 */
const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  projectFilters,
  onProjectFilterChange,
  onClearProjectFilters
}) => {
  // Check if any project filters are selected
  const hasSelectedFilters = Object.values(projectFilters).some(Boolean);

  return (
    <div className="p-4 border-b border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Filter by Project Status</h3>
        {hasSelectedFilters && (
          <button
            onClick={onClearProjectFilters}
            className="text-xs text-purple-600 hover:text-purple-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Project Status Filters */}
      <div className="space-y-3">
        {/* Planning Status */}
        <label className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={projectFilters.planning}
            onChange={() => onProjectFilterChange('planning')}
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
          />
          <div className="flex items-center space-x-2 flex-1">
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
              Planning
            </span>
          </div>
        </label>

        {/* In Progress Status */}
        <label className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={projectFilters.inProgress}
            onChange={() => onProjectFilterChange('inProgress')}
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
          />
          <div className="flex items-center space-x-2 flex-1">
            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
              In Progress
            </span>
          </div>
        </label>

        {/* Completed Status */}
        <label className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={projectFilters.completed}
            onChange={() => onProjectFilterChange('completed')}
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
          />
          <div className="flex items-center space-x-2 flex-1">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
              Completed
            </span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default ProjectFilters;
