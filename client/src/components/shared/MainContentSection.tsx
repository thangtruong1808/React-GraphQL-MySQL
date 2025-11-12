import React from 'react';
import ProjectStatusOverview from './ProjectStatusOverview';
import TaskCompletionProgress from './TaskCompletionProgress';
import CommentActivityOverview from './CommentActivityOverview';

/**
 * Description: Organises the public dashboard body content, charting project status, task progress, and comment insights.
 * Data created: Passes received statistics to subsection components without introducing new local state.
 * Author: thangtruong
 */

// Props interface for MainContentSection component
interface MainContentSectionProps {
  stats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    planningProjects: number;
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
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div
        className="max-w-7xl mx-auto rounded-2xl shadow-lg p-8 border theme-border"
        style={{
          backgroundColor: 'var(--card-bg)',
          backgroundImage: 'var(--card-surface-overlay)',
          borderColor: 'var(--border-color)',
          boxShadow: '0 24px 48px var(--shadow-color)'
        }}
      >
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
