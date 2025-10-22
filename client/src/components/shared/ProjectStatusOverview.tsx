import React from 'react';
import { SimpleChart } from '../charts';

/**
 * Project Status Overview Component
 * Displays project status distribution with charts
 * Shows completed, active, and planning projects counts from database
 */

// Props interface for ProjectStatusOverview component
interface ProjectStatusOverviewProps {
  stats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    planningProjects: number;
  };
}

/**
 * ProjectStatusOverview Component
 * Renders project status distribution chart
 * Uses pie chart to visualize project status distribution
 */
const ProjectStatusOverview: React.FC<ProjectStatusOverviewProps> = ({ stats }) => {
  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-2xl p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Status Overview</h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        Track the distribution of projects across different stages. Monitor your project portfolio to ensure balanced progress and identify areas that need attention.
      </p>

      {/* Chart */}
      <SimpleChart
        title=""
        type="pie"
        data={[
          { label: 'Completed', value: stats.completedProjects, color: '#8b5cf6' },
          { label: 'In Progress', value: stats.activeProjects, color: '#f97316' },
          { label: 'Planning', value: stats.planningProjects, color: '#6366f1' },
        ]}
        className="mb-4"
      />
    </div>
  );
};

export default ProjectStatusOverview;
