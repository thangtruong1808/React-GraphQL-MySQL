import React from 'react';

/**
 * Public Statistics Display Component
 * Displays key statistics in a grid layout for the public dashboard
 * Shows total projects, tasks, users, and success rate
 */

interface PublicStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  totalUsers: number;
  recentActivity: number;
  averageProjectCompletion: number;
}

interface PublicStatsDisplayProps {
  stats: PublicStats;
}

const PublicStatsDisplay: React.FC<PublicStatsDisplayProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {/* Total Projects Card */}
      <div className="rounded-xl p-6 shadow-md border theme-border hover:shadow-xl transition-shadow duration-500" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalProjects}</div>
        <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total Projects</div>
      </div>

      {/* Tasks Managed Card */}
      <div className="rounded-xl p-6 shadow-md border theme-border hover:shadow-xl transition-shadow duration-500" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalTasks}</div>
        <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Tasks Managed</div>
      </div>

      {/* Team Members Card */}
      <div className="rounded-xl p-6 shadow-md border theme-border hover:shadow-xl transition-shadow duration-500" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalUsers}</div>
        <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Team Members</div>
      </div>

      {/* Success Rate Card */}
      <div className="rounded-xl p-6 shadow-md border theme-border hover:shadow-xl transition-shadow duration-500" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.averageProjectCompletion}%</div>
        <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Success Rate</div>
      </div>
    </div>
  );
};

export default PublicStatsDisplay;
