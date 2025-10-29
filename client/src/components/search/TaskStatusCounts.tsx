import React from 'react';
import { getProjectStatusColor } from '../../constants/projectManagement';

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
    <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 [data-theme='brand']:from-orange-50 [data-theme='brand']:to-amber-50 rounded-lg border border-orange-200 dark:border-orange-700 [data-theme='brand']:border-orange-200">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-orange-300 [data-theme='brand']:text-gray-900 mb-3 flex items-center">
        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Task Status Breakdown
      </h3>
      <div className="flex flex-wrap gap-3">
        {statuses.map((status) => {
          const count = statusCounts[status];
          const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;

          // Get status-specific styling with theme awareness
          const getStatusStyle = (status: string) => {
            const isBrandTheme = document.documentElement.getAttribute('data-theme') === 'brand';
            const isDarkTheme = document.documentElement.classList.contains('dark');
            const theme = isBrandTheme ? 'brand' : isDarkTheme ? 'dark' : 'light';

            // Map task statuses to project statuses for consistency
            const statusMap: { [key: string]: string } = {
              'IN_PROGRESS': 'IN_PROGRESS',
              'DONE': 'COMPLETED',
              'TODO': 'PLANNING'
            };

            const mappedStatus = statusMap[status] || 'PLANNING';
            const colorClasses = getProjectStatusColor(mappedStatus, theme);

            // Extract background and text colors from the returned classes
            const [bgClass, textClass] = colorClasses.split(' ');

            // Map to border colors based on the background
            let borderClass = 'border-gray-200';
            if (bgClass.includes('blue')) borderClass = 'border-blue-200 dark:border-blue-600 [data-theme="brand"]:border-blue-200';
            else if (bgClass.includes('orange')) borderClass = 'border-orange-200 dark:border-orange-600 [data-theme="brand"]:border-orange-200';
            else if (bgClass.includes('emerald') || bgClass.includes('green')) borderClass = 'border-emerald-200 dark:border-emerald-600 [data-theme="brand"]:border-emerald-200';

            return {
              bg: bgClass,
              text: textClass,
              border: borderClass
            };
          };

          const style = getStatusStyle(status);

          return (
            <div
              key={status}
              className={`px-3 py-2 rounded-full border shadow-sm ${style.bg} ${style.border} ${style.text} flex items-center space-x-2`}
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
      <div className="mt-3 text-xs text-gray-900 dark:text-orange-400 [data-theme='brand']:text-gray-900">
        Total: {totalTasks} task{totalTasks !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default TaskStatusCounts;
