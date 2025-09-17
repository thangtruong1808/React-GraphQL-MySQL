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
 * Renders task status filter checkboxes with color-coded indicators
 * Matches chart colors for visual consistency
 */
const TaskFilters: React.FC<TaskFiltersProps> = ({
  taskFilters,
  onTaskFilterChange,
  onClearTaskFilters
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Filter by Task Status
        </h3>
        {Object.values(taskFilters).some(Boolean) && (
          <button
            onClick={onClearTaskFilters}
            className="text-xs text-purple-600 hover:text-purple-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Todo Status */}
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={taskFilters.todo}
            onChange={() => onTaskFilterChange('todo')}
            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
          />
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Todo</span>
          </div>
        </label>

        {/* In Progress Status */}
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={taskFilters.inProgress}
            onChange={() => onTaskFilterChange('inProgress')}
            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
          />
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
            <span className="text-sm text-gray-700">In Progress</span>
          </div>
        </label>

        {/* Completed Status */}
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={taskFilters.completed}
            onChange={() => onTaskFilterChange('completed')}
            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
          />
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Completed</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default TaskFilters;
