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
 * Renders project status filter checkboxes with color-coded indicators
 * Matches chart colors for visual consistency
 */
const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  projectFilters,
  onProjectFilterChange,
  onClearProjectFilters
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Filter by Project Status
        </h3>
        {Object.values(projectFilters).some(Boolean) && (
          <button
            onClick={onClearProjectFilters}
            className="text-xs text-purple-600 hover:text-purple-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Planning Status */}
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={projectFilters.planning}
            onChange={() => onProjectFilterChange('planning')}
            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
          />
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Planning</span>
          </div>
        </label>

        {/* In Progress Status */}
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={projectFilters.inProgress}
            onChange={() => onProjectFilterChange('inProgress')}
            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
          />
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-700">In Progress</span>
          </div>
        </label>

        {/* Completed Status */}
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={projectFilters.completed}
            onChange={() => onProjectFilterChange('completed')}
            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
          />
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Completed</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default ProjectFilters;
