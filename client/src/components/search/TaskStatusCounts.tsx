import React from 'react';

/**
 * Task Status Counts Component
 * Displays the total count of tasks for each status
 * Provides better user experience by showing status breakdown
 */

interface TaskStatusCountsProps {
  tasks: any[]; // Current page tasks for status breakdown
  totalTasks: number; // Total count of all tasks for percentage calculation
}

/**
 * TaskStatusCounts Component
 * Shows count breakdown by task status
 */
const TaskStatusCounts: React.FC<TaskStatusCountsProps> = ({ tasks, totalTasks }) => {
  // Calculate counts for each status
  const statusCounts = tasks.reduce((acc, task) => {
    const status = task.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get all unique statuses and sort them
  const statuses = Object.keys(statusCounts).sort();

  // Don't render if no tasks
  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
      <h3 className="text-sm font-semibold text-orange-800 mb-3 flex items-center">
        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Task Status Breakdown
      </h3>
      <div className="flex flex-wrap gap-3">
        {statuses.map((status) => {
          const count = statusCounts[status];
          const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;

          // Get status-specific styling
          const getStatusStyle = (status: string) => {
            switch (status) {
              case 'TODO':
                return {
                  bg: 'bg-gray-100',
                  text: 'text-gray-800',
                  border: 'border-gray-200'
                };
              case 'IN_PROGRESS':
                return {
                  bg: 'bg-yellow-100',
                  text: 'text-yellow-800',
                  border: 'border-yellow-200'
                };
              case 'COMPLETED':
                return {
                  bg: 'bg-green-100',
                  text: 'text-green-800',
                  border: 'border-green-200'
                };
              case 'CANCELLED':
                return {
                  bg: 'bg-red-100',
                  text: 'text-red-800',
                  border: 'border-red-200'
                };
              default:
                return {
                  bg: 'bg-gray-100',
                  text: 'text-gray-800',
                  border: 'border-gray-200'
                };
            }
          };

          const style = getStatusStyle(status);

          return (
            <div
              key={status}
              className={`px-3 py-2 rounded-lg border ${style.bg} ${style.border} ${style.text} flex items-center space-x-2`}
            >
              <span className="font-medium capitalize">
                {status.replace('_', ' ')}
              </span>
              <span className="text-sm font-bold">
                {count}
              </span>
              <span className="text-xs opacity-75">
                ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 text-xs text-orange-700">
        Total: {totalTasks} task{totalTasks !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default TaskStatusCounts;
