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
      <div className="bg-gray-100 rounded-xl p-6 shadow-md border border-gray-300 hover:shadow-xl hover:shadow-fuchsia-500/50 transition-shadow duration-500">

        <div className="text-3xl font-bold text-purple-600 ">{stats.totalProjects}</div>
        <div className="text-sm text-gray-600 font-medium">Total Projects</div>
      </div>

      {/* Tasks Managed Card */}
      <div className="bg-gray-100 rounded-xl p-6 shadow-md border border-gray-300 hover:shadow-xl hover:shadow-fuchsia-500/50 transition-shadow duration-500">
        <div className="text-3xl font-bold text-pink-600">{stats.totalTasks}</div>
        <div className="text-sm text-gray-600 font-medium">Tasks Managed</div>
      </div>

      {/* Team Members Card */}
      <div className="bg-gray-100 rounded-xl p-6 shadow-md border border-gray-300 hover:shadow-xl hover:shadow-fuchsia-500/50 transition-shadow duration-500">
        <div className="text-3xl font-bold text-indigo-600">{stats.totalUsers}</div>
        <div className="text-sm text-gray-600 font-medium">Team Members</div>
      </div>

      {/* Success Rate Card */}
      <div className="bg-gray-100 rounded-xl p-6 shadow-md border border-gray-300 hover:shadow-xl hover:shadow-fuchsia-500/50 transition-shadow duration-500">
        <div className="text-3xl font-bold text-orange-600">{stats.averageProjectCompletion}%</div>
        <div className="text-sm text-gray-600 font-medium">Success Rate</div>
      </div>
    </div>
  );
};

export default PublicStatsDisplay;
