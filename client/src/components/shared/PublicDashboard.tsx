import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { SimpleChart } from '../charts';
import { GET_PUBLIC_STATS } from '../../services/graphql/queries';
import PublicStatsDisplay from './PublicStatsDisplay';
import PublicCallToAction from './PublicCallToAction';
import TaskLikesDisplay from './TaskLikesDisplay';
import ProjectLikesDisplay from './ProjectLikesDisplay';
import CommentLikesDisplay from './CommentLikesDisplay';
import { InlineError } from '../ui';

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
  usersWhoLikedCompletedTasks: string[];
  usersWhoLikedInProgressTasks: string[];
  usersWhoLikedTodoTasks: string[];
  // Project likes data by status
  likesOnCompletedProjects: number;
  likesOnActiveProjects: number;
  likesOnPlanningProjects: number;
  usersWhoLikedCompletedProjects: string[];
  usersWhoLikedActiveProjects: string[];
  usersWhoLikedPlanningProjects: string[];
  // Comment likes data by task status
  likesOnCommentsOnCompletedTasks: number;
  likesOnCommentsOnInProgressTasks: number;
  likesOnCommentsOnTodoTasks: number;
  usersWhoLikedCommentsOnCompletedTasks: string[];
  usersWhoLikedCommentsOnInProgressTasks: string[];
  usersWhoLikedCommentsOnTodoTasks: string[];
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
    usersWhoLikedCompletedTasks: [],
    usersWhoLikedInProgressTasks: [],
    usersWhoLikedTodoTasks: [],
    // Project likes data by status
    likesOnCompletedProjects: 0,
    likesOnActiveProjects: 0,
    likesOnPlanningProjects: 0,
    usersWhoLikedCompletedProjects: [],
    usersWhoLikedActiveProjects: [],
    usersWhoLikedPlanningProjects: [],
    // Comment likes data by task status
    likesOnCommentsOnCompletedTasks: 0,
    likesOnCommentsOnInProgressTasks: 0,
    likesOnCommentsOnTodoTasks: 0,
    usersWhoLikedCommentsOnCompletedTasks: [],
    usersWhoLikedCommentsOnInProgressTasks: [],
    usersWhoLikedCommentsOnTodoTasks: [],
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Show error state if GraphQL query fails
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Different color scheme */}
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Discover{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                TaskFlow
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              Explore our comprehensive project management platform with real-time insights and team collaboration
            </p>

            {/* Public Statistics Overview - Real data from database */}
            <PublicStatsDisplay stats={stats} />
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Statistics and Charts - Enhanced with likes data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Project Status Distribution with Likes - Real data from database */}
            <div className="shadow-lg border border-purple-100 bg-white rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status Overview</h3>

              {/* Chart */}
              <SimpleChart
                title=""
                type="pie"
                data={[
                  { label: 'Completed', value: stats.completedProjects, color: '#8b5cf6' },
                  { label: 'In Progress', value: stats.activeProjects, color: '#f97316' },
                  { label: 'Planning', value: stats.totalProjects - stats.activeProjects - stats.completedProjects, color: '#6366f1' },
                ]}
                className="mb-6"
              />

              {/* Project Likes Information */}
              <div className="space-y-4">
                {/* Completed Projects Likes */}
                <ProjectLikesDisplay
                  projectStatus="Completed"
                  likeCount={stats.likesOnCompletedProjects}
                  userNames={stats.usersWhoLikedCompletedProjects}
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
                  userNames={stats.usersWhoLikedActiveProjects}
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
                  userNames={stats.usersWhoLikedPlanningProjects}
                  colorScheme={{
                    text: "text-indigo-600",
                    bg: "bg-indigo-100 text-indigo-800",
                    icon: "text-indigo-600"
                  }}
                />
              </div>
            </div>

            {/* Task Progress Overview - Enhanced with likes and user information */}
            <div className="shadow-lg border border-pink-100 bg-white rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Completion Progress</h3>

              {/* Chart */}
              <SimpleChart
                title=""
                type="bar"
                data={[
                  { label: 'Completed', value: stats.completedTasks, color: '#ec4899' },
                  { label: 'In Progress', value: stats.inProgressTasks, color: '#06b6d4' },
                  { label: 'Todo', value: stats.todoTasks, color: '#6b7280' },
                ]}
                maxValue={stats.totalTasks}
                className="mb-6"
              />

              {/* Likes and User Information */}
              <div className="space-y-4">
                {/* Completed Tasks Likes */}
                <TaskLikesDisplay
                  taskStatus="Completed"
                  likeCount={stats.likesOnCompletedTasks}
                  userNames={stats.usersWhoLikedCompletedTasks}
                  colorScheme={{
                    text: "text-green-600",
                    bg: "bg-green-100 text-green-800",
                    icon: "text-green-600"
                  }}
                />

                {/* In Progress Tasks Likes */}
                <TaskLikesDisplay
                  taskStatus="In Progress"
                  likeCount={stats.likesOnInProgressTasks}
                  userNames={stats.usersWhoLikedInProgressTasks}
                  colorScheme={{
                    text: "text-blue-600",
                    bg: "bg-blue-100 text-blue-800",
                    icon: "text-blue-600"
                  }}
                />

                {/* Todo Tasks Likes */}
                <TaskLikesDisplay
                  taskStatus="Todo"
                  likeCount={stats.likesOnTodoTasks}
                  userNames={stats.usersWhoLikedTodoTasks}
                  colorScheme={{
                    text: "text-gray-600",
                    bg: "bg-gray-100 text-gray-800",
                    icon: "text-gray-600"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Comment Statistics Section with Likes - Real data from database */}
          <div className="mb-12">
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 max-w-6xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Comment Activity Overview</h3>
              <div className="space-y-6">
                {/* Total Comments Display */}
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-lg">Total Comments</span>
                  <span className="text-3xl font-bold text-green-600">{stats.totalComments}</span>
                </div>

                {/* Comments by Task Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-2">{stats.commentsOnCompletedTasks}</div>
                    <div className="text-sm text-gray-600">Comments on Completed Tasks</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-2">{stats.commentsOnInProgressTasks}</div>
                    <div className="text-sm text-gray-600">Comments on In Progress Tasks</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-2">{stats.commentsOnTodoTasks}</div>
                    <div className="text-sm text-gray-600">Comments on Todo Tasks</div>
                  </div>
                </div>

                {/* Comment Likes Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 text-center">Comment Likes by Task Status</h4>

                  {/* Comments on Completed Tasks Likes */}
                  <CommentLikesDisplay
                    taskStatus="Completed"
                    likeCount={stats.likesOnCommentsOnCompletedTasks}
                    userNames={stats.usersWhoLikedCommentsOnCompletedTasks}
                    colorScheme={{
                      text: "text-green-600",
                      bg: "bg-green-100 text-green-800",
                      icon: "text-green-600"
                    }}
                  />

                  {/* Comments on In Progress Tasks Likes */}
                  <CommentLikesDisplay
                    taskStatus="In Progress"
                    likeCount={stats.likesOnCommentsOnInProgressTasks}
                    userNames={stats.usersWhoLikedCommentsOnInProgressTasks}
                    colorScheme={{
                      text: "text-blue-600",
                      bg: "bg-blue-100 text-blue-800",
                      icon: "text-blue-600"
                    }}
                  />

                  {/* Comments on Todo Tasks Likes */}
                  <CommentLikesDisplay
                    taskStatus="Todo"
                    likeCount={stats.likesOnCommentsOnTodoTasks}
                    userNames={stats.usersWhoLikedCommentsOnTodoTasks}
                    colorScheme={{
                      text: "text-gray-600",
                      bg: "bg-gray-100 text-gray-800",
                      icon: "text-gray-600"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action - Real data from database */}
          <PublicCallToAction stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;
