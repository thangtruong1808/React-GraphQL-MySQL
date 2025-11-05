import { gql } from '@apollo/client';

/**
 * Dashboard GraphQL Queries
 * Queries for authenticated dashboard statistics and data
 */

/**
 * Query for dashboard statistics
 * Returns overview statistics for the dashboard
 */
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalProjects
      activeProjects
      completedProjects
      totalTasks
      completedTasks
      inProgressTasks
      totalUsers
      recentActivity
    }
  }
`;

/**
 * Query for recent projects
 * Returns recently created or updated projects
 */
export const GET_RECENT_PROJECTS = gql`
  query GetRecentProjects($limit: Int = 5) {
    recentProjects(limit: $limit) {
      id
      uuid
      name
      status
      taskCount
      memberCount
      progress
      createdAt
      updatedAt
    }
  }
`;

/**
 * Query for upcoming tasks
 * Returns tasks with upcoming due dates
 */
export const GET_UPCOMING_TASKS = gql`
  query GetUpcomingTasks($limit: Int = 5) {
    upcomingTasks(limit: $limit) {
      id
      uuid
      title
      status
      priority
      dueDate
      project {
        id
        name
      }
      assignedUser {
        id
        firstName
        lastName
      }
    }
  }
`;

/**
 * Query for project status distribution
 * Returns count of projects by status
 */
export const GET_PROJECT_STATUS_DISTRIBUTION = gql`
  query GetProjectStatusDistribution {
    projectStatusDistribution {
      planning
      inProgress
      completed
    }
  }
`;

/**
 * Query for task progress overview
 * Returns count of tasks by status
 */
export const GET_TASK_PROGRESS_OVERVIEW = gql`
  query GetTaskProgressOverview {
    taskProgressOverview {
      todo
      inProgress
      done
    }
  }
`;

