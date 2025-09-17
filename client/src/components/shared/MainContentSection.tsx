import React from 'react';
import ProjectStatusOverview from './ProjectStatusOverview';
import TaskCompletionProgress from './TaskCompletionProgress';
import CommentActivityOverview from './CommentActivityOverview';

/**
 * Main Content Section Component
 * Displays the main content area with project status, task progress, and comment statistics
 * Contains charts, likes displays, and detailed statistics for the public dashboard
 */

// Props interface for MainContentSection component
interface MainContentSectionProps {
  stats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    totalComments: number;
    commentsOnCompletedTasks: number;
    commentsOnInProgressTasks: number;
    commentsOnTodoTasks: number;
    totalUsers: number;
    recentActivity: number;
    averageProjectCompletion: number;
    likesOnCompletedTasks: number;
    likesOnInProgressTasks: number;
    likesOnTodoTasks: number;
    tasksWithLikesCompleted: Array<{ taskName: string; likeCount: number }>;
    tasksWithLikesInProgress: Array<{ taskName: string; likeCount: number }>;
    tasksWithLikesTodo: Array<{ taskName: string; likeCount: number }>;
    // Project likes data by status
    likesOnCompletedProjects: number;
    likesOnActiveProjects: number;
    likesOnPlanningProjects: number;
    projectsWithLikesCompleted: Array<{ projectName: string; likeCount: number }>;
    projectsWithLikesActive: Array<{ projectName: string; likeCount: number }>;
    projectsWithLikesPlanning: Array<{ projectName: string; likeCount: number }>;
    // Comment likes data by task status
    likesOnCommentsOnCompletedTasks: number;
    likesOnCommentsOnInProgressTasks: number;
    likesOnCommentsOnTodoTasks: number;
    commentsWithLikesOnCompletedTasks: Array<{ commentContent: string; likeCount: number }>;
    commentsWithLikesOnInProgressTasks: Array<{ commentContent: string; likeCount: number }>;
    commentsWithLikesOnTodoTasks: Array<{ commentContent: string; likeCount: number }>;
  };
}

/**
 * MainContentSection Component
 * Renders the main content area with statistics, charts, and detailed information
 * Includes project status overview, task progress, and comment activity sections
 */
const MainContentSection: React.FC<MainContentSectionProps> = ({ stats }) => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Statistics and Charts - Enhanced with likes data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Project Status Overview - Real data from database */}
          <ProjectStatusOverview stats={stats} />

          {/* Task Completion Progress - Real data from database */}
          <TaskCompletionProgress stats={stats} />
        </div>

        {/* Comment Activity Overview - Real data from database */}
        <CommentActivityOverview stats={stats} />
      </div>
    </div>
  );
};

export default MainContentSection;
