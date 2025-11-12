import React from 'react';
import { SimpleChart } from '../charts';

/**
 * Description: Visualises project status distribution on the public dashboard using themed chart colours.
 * Data created: Relays provided status counts into the chart component without additional state.
 * Author: thangtruong
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
    <div
      className="shadow-lg border theme-border rounded-2xl p-4"
      style={{
        backgroundColor: 'var(--card-bg)',
        backgroundImage: 'var(--card-surface-overlay)',
        borderColor: 'var(--border-color)'
      }}
    >
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Project Status Overview</h3>

      {/* Description */}
      <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
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
