import React from 'react';
import PublicStatsDisplay from './PublicStatsDisplay';

/**
 * Hero Section Component
 * Displays the main hero section with title, description, and public statistics
 * Provides the first impression and key statistics for the public dashboard
 */

// Props interface for HeroSection component
interface HeroSectionProps {
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
 * HeroSection Component
 * Renders the hero section with title, description, and public statistics overview
 * Uses responsive design and gradient text for visual appeal
 */
const HeroSection: React.FC<HeroSectionProps> = ({ stats }) => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 rounded-2xl mt-10">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="text-center">
          {/* Main title with gradient text */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Discover{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              TaskFlow
            </span>
          </h1>
          {/* Description text */}
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
            Explore our comprehensive project management platform with real-time insights and team collaboration
          </p>

          {/* Public Statistics Overview - Real data from database */}
          <PublicStatsDisplay stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
