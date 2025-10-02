import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PUBLIC_STATS } from '../../services/graphql/queries';
import HeroSection from './HeroSection';
import MainContentSection from './MainContentSection';
import PublicCallToAction from './PublicCallToAction';
import { InlineError, PublicDashboardSkeleton } from '../ui';

/**
 * Public Dashboard Component
 * Displays comprehensive public statistics and overview to attract users before login
 * Showcases TaskFlow capabilities with key metrics and call-to-action
 * Uses real GraphQL queries to fetch accurate database statistics
 */

// Public statistics interface based on database schema
interface PublicStats {
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
}

const PublicDashboard: React.FC = () => {
  // Fetch public statistics from GraphQL API
  const { data, loading, error } = useQuery(GET_PUBLIC_STATS, {
    errorPolicy: 'all', // Continue rendering even if there's an error
  });

  // Extract stats from GraphQL response or use defaults
  const stats: PublicStats = data?.publicStats || {
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    totalComments: 0,
    commentsOnCompletedTasks: 0,
    commentsOnInProgressTasks: 0,
    commentsOnTodoTasks: 0,
    totalUsers: 0,
    recentActivity: 0,
    averageProjectCompletion: 0,
    likesOnCompletedTasks: 0,
    likesOnInProgressTasks: 0,
    likesOnTodoTasks: 0,
    tasksWithLikesCompleted: [],
    tasksWithLikesInProgress: [],
    tasksWithLikesTodo: [],
    // Project likes data by status
    likesOnCompletedProjects: 0,
    likesOnActiveProjects: 0,
    likesOnPlanningProjects: 0,
    projectsWithLikesCompleted: [],
    projectsWithLikesActive: [],
    projectsWithLikesPlanning: [],
    // Comment likes data by task status
    likesOnCommentsOnCompletedTasks: 0,
    likesOnCommentsOnInProgressTasks: 0,
    likesOnCommentsOnTodoTasks: 0,
    commentsWithLikesOnCompletedTasks: [],
    commentsWithLikesOnInProgressTasks: [],
    commentsWithLikesOnTodoTasks: [],
  };

  // Show loading state while fetching data
  if (loading) {
    return <PublicDashboardSkeleton />;
  }

  // Show error state if GraphQL query fails
  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 public-dashboard flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <InlineError
            message="Unable to load dashboard statistics. Please try again later."
            type="error"
            size="lg"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full public-dashboard bg-gray-50">
      <div className="min-h-screen bg-gray-50 mt-16">
        {/* Hero Section - Main title and public statistics overview */}
        <HeroSection stats={stats} />

        {/* Main Content Section - Detailed statistics, charts, and likes information */}
        <MainContentSection stats={stats} />

        {/* Call to Action - Real data from database */}
        <PublicCallToAction stats={stats} />
      </div>
    </div>
  );
};

export default PublicDashboard;
