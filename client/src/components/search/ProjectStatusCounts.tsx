import React from 'react';
import { getProjectStatusColor } from '../../constants/projectManagement';

/**
 * Project Status Counts Component
 * Displays the total count of projects for each status
 * Provides better user experience by showing status breakdown
 */

interface ProjectStatusCountsProps {
  projects: any[]; // Current page projects for status breakdown
  totalProjects: number; // Total count of all projects for percentage calculation
}

/**
 * ProjectStatusCounts Component
 * Shows count breakdown by project status
 */
const ProjectStatusCounts: React.FC<ProjectStatusCountsProps> = ({ projects, totalProjects }) => {
  // Calculate counts for each status
  const statusCounts = projects.reduce((acc, project) => {
    const status = project.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get all unique statuses and sort them
  const statuses = Object.keys(statusCounts).sort();

  // Don't render if no projects
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 [data-theme='brand']:from-green-50 [data-theme='brand']:to-emerald-50 rounded-lg border border-green-200 dark:border-green-700 [data-theme='brand']:border-green-200">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-green-300 [data-theme='brand']:text-gray-900 mb-3 flex items-center">
        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Project Status Breakdown
      </h3>
      <div className="flex flex-wrap gap-3">
        {statuses.map((status) => {
          const count = statusCounts[status];
          const percentage = totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0;

          // Get status-specific styling with theme-aware colors
          const getStatusStyle = (status: string) => {
            // Check if we're in brand theme by looking for data-theme attribute
            const isBrandTheme = document.documentElement.getAttribute('data-theme') === 'brand';
            const isDarkTheme = document.documentElement.classList.contains('dark');

            const theme = isBrandTheme ? 'brand' : isDarkTheme ? 'dark' : 'light';
            const colorClasses = getProjectStatusColor(status, theme);

            // Extract background and text colors from the returned classes
            const [bgClass, textClass] = colorClasses.split(' ');

            // Map to border colors based on the background
            let borderClass = 'border-gray-200';
            if (bgClass.includes('blue')) borderClass = 'border-blue-200';
            else if (bgClass.includes('orange')) borderClass = 'border-orange-200';
            else if (bgClass.includes('emerald') || bgClass.includes('green')) borderClass = 'border-emerald-200';

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
      <div className="mt-3 text-xs text-gray-900 dark:text-green-400 [data-theme='brand']:text-gray-900">
        Total: {totalProjects} project{totalProjects !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default ProjectStatusCounts;
