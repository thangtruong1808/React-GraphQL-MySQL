import { gql } from '@apollo/client';

/**
 * Public GraphQL Queries
 * Queries accessible to unauthenticated users
 */

/**
 * Public statistics query for unauthenticated users
 * Returns comprehensive platform statistics including likes and engagement data
 */
export const GET_PUBLIC_STATS = gql`
  query GetPublicStats {
    publicStats {
      totalProjects
      activeProjects
      completedProjects
      planningProjects
      totalTasks
      completedTasks
      inProgressTasks
      todoTasks
      totalComments
      commentsOnCompletedTasks
      commentsOnInProgressTasks
      commentsOnTodoTasks
      totalUsers
      recentActivity
      averageProjectCompletion
      likesOnCompletedTasks
      likesOnInProgressTasks
      likesOnTodoTasks
      tasksWithLikesCompleted {
        taskName
        likeCount
      }
      tasksWithLikesInProgress {
        taskName
        likeCount
      }
      tasksWithLikesTodo {
        taskName
        likeCount
      }
      # Project likes data by status
      likesOnCompletedProjects
      likesOnActiveProjects
      likesOnPlanningProjects
      projectsWithLikesCompleted {
        projectName
        likeCount
      }
      projectsWithLikesActive {
        projectName
        likeCount
      }
      projectsWithLikesPlanning {
        projectName
        likeCount
      }
      # Comment likes data by task status
      likesOnCommentsOnCompletedTasks
      likesOnCommentsOnInProgressTasks
      likesOnCommentsOnTodoTasks
      commentsWithLikesOnCompletedTasks {
        commentContent
        likeCount
      }
      commentsWithLikesOnInProgressTasks {
        commentContent
        likeCount
      }
      commentsWithLikesOnTodoTasks {
        commentContent
        likeCount
      }
    }
  }
`;

/**
 * Featured projects query for public display
 * Returns featured projects for public pages
 */
export const GET_FEATURED_PROJECTS = gql`
  query GetFeaturedProjects($limit: Int = 4) {
    featuredProjects(limit: $limit) {
      id
      uuid
      name
      status
      taskCount
      memberCount
      createdAt
    }
  }
`;

/**
 * Public recent tasks query
 * Returns recent tasks for public display
 */
export const GET_PUBLIC_RECENT_TASKS = gql`
  query GetPublicRecentTasks($limit: Int = 4) {
    publicRecentTasks(limit: $limit) {
      id
      uuid
      title
      status
      priority
      project {
        name
      }
    }
  }
`;

