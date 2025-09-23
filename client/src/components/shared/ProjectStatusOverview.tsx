import React from 'react';
import { SimpleChart } from '../charts';
import ProjectLikesDisplay from './ProjectLikesDisplay';

/**
 * Project Status Overview Component
 * Displays project status distribution with charts and project likes information
 * Shows completed, active, and planning projects with their individual like counts
 */

// Props interface for ProjectStatusOverview component
interface ProjectStatusOverviewProps {
  stats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    likesOnCompletedProjects: number;
    likesOnActiveProjects: number;
    likesOnPlanningProjects: number;
    projectsWithLikesCompleted: Array<{ projectName: string; likeCount: number }>;
    projectsWithLikesActive: Array<{ projectName: string; likeCount: number }>;
    projectsWithLikesPlanning: Array<{ projectName: string; likeCount: number }>;
  };
}

/**
 * ProjectStatusOverview Component
 * Renders project status distribution chart and project likes information
 * Uses pie chart to visualize project status distribution
 */
const ProjectStatusOverview: React.FC<ProjectStatusOverviewProps> = ({ stats }) => {
  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-2xl p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Status Overview</h3>

      {/* Chart */}
      <SimpleChart
        title=""
        type="pie"
        data={[
          { label: 'Completed', value: stats.completedProjects, color: '#8b5cf6' },
          { label: 'In Progress', value: stats.activeProjects, color: '#f97316' },
          { label: 'Planning', value: stats.totalProjects - stats.activeProjects - stats.completedProjects, color: '#6366f1' },
        ]}
        className="mb-4"
      />

      {/* Project Likes Information */}
      <div className="space-y-2 ">
        {/* Completed Projects Likes */}
        <ProjectLikesDisplay
          projectStatus="Completed"
          likeCount={stats.likesOnCompletedProjects}
          projectsWithLikes={stats.projectsWithLikesCompleted}
          colorScheme={{
            text: "text-purple-600",
            bg: "bg-purple-100 text-purple-800",
            icon: "text-purple-600"
          }}
        />

        {/* Active Projects Likes */}
        <ProjectLikesDisplay
          projectStatus="Active"
          likeCount={stats.likesOnActiveProjects}
          projectsWithLikes={stats.projectsWithLikesActive}
          colorScheme={{
            text: "text-orange-600",
            bg: "bg-orange-100 text-orange-800",
            icon: "text-orange-600"
          }}
        />

        {/* Planning Projects Likes */}
        <ProjectLikesDisplay
          projectStatus="Planning"
          likeCount={stats.likesOnPlanningProjects}
          projectsWithLikes={stats.projectsWithLikesPlanning}
          colorScheme={{
            text: "text-indigo-600",
            bg: "bg-indigo-100 text-indigo-800",
            icon: "text-indigo-600"
          }}
        />
      </div>
    </div>
  );
};

export default ProjectStatusOverview;
