import React from 'react';

/**
 * Task Filters Component
 * Handles task status filtering with checkboxes
 * Displays todo, in progress, and completed task status options
 */

// Props interface for TaskFilters component
interface TaskFiltersProps {
  taskFilters: {
    todo: boolean;
    inProgress: boolean;
    completed: boolean;
  };
  onTaskFilterChange: (status: keyof TaskFiltersProps['taskFilters']) => void;
  onClearTaskFilters: () => void;
}

/**
 * TaskFilters Component
 * Renders task status filter checkboxes with icons and color-coded indicators
 * Enhanced with meaningful icons for better user experience
 */
const TaskFilters: React.FC<TaskFiltersProps> = ({
  taskFilters,
  onTaskFilterChange,
  onClearTaskFilters
}) => {
  // Check if any task filters are selected
  const hasSelectedFilters = Object.values(taskFilters).some(Boolean);

  return (
    <div className="p-4 border-b border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Filter by Task Status</h3>
        {hasSelectedFilters && (
          <button
            onClick={onClearTaskFilters}
            className="text-xs text-purple-600 hover:text-purple-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Task Status Filters */}
      <div className="space-y-3">
        {/* Todo Status */}
        <label className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={taskFilters.todo}
            onChange={() => onTaskFilterChange('todo')}
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
          />
          <div className="flex items-center space-x-2 flex-1">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
              Todo
            </span>
          </div>
        </label>

        {/* In Progress Status */}
        <label className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={taskFilters.inProgress}
            onChange={() => onTaskFilterChange('inProgress')}
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
          />
          <div className="flex items-center space-x-2 flex-1">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            checked={taskFilters.completed}
            onChange={() => onTaskFilterChange('completed')}
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

export default TaskFilters;
