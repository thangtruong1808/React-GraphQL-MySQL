import React from 'react';

/**
 * Active Filters Component
 * Displays currently active project and task status filters
 * Follows React best practices with proper TypeScript interfaces
 */

interface ActiveFiltersProps {
  projectStatusFilter: string[];
  taskStatusFilter: string[];
}

/**
 * ActiveFilters Component
 * Renders active filters with appropriate color coding
 */
const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  projectStatusFilter,
  taskStatusFilter
}) => {
  // Don't render if no filters are active
  if (projectStatusFilter.length === 0 && taskStatusFilter.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Project status filters */}
      {projectStatusFilter.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-2">Filtered by project status:</p>
          <div className="flex flex-wrap gap-2">
            {projectStatusFilter.map((status) => (
              <span
                key={status}
                className={`px-3 py-1 text-xs rounded-full ${status === 'COMPLETED' ? 'bg-purple-100 text-purple-800' :
                    status === 'IN_PROGRESS' ? 'bg-orange-100 text-orange-800' :
                      'bg-indigo-100 text-indigo-800'
                  }`}
              >
                {status.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Task status filters */}
      {taskStatusFilter.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-2">Filtered by task status:</p>
          <div className="flex flex-wrap gap-2">
            {taskStatusFilter.map((status) => (
              <span
                key={status}
                className={`px-3 py-1 text-xs rounded-full ${status === 'DONE' ? 'bg-pink-100 text-pink-800' :
                    status === 'IN_PROGRESS' ? 'bg-cyan-100 text-cyan-800' :
                      'bg-gray-100 text-gray-800'
                  }`}
              >
                {status.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveFilters;
