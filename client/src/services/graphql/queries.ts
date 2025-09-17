import { gql } from '@apollo/client';

/**
 * GraphQL Queries for TaskFlow Dashboard
 * Defines queries for project management data
 */

// Query for dashboard statistics
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

// Query for recent projects
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

// Query for upcoming tasks
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

// Query for project status distribution
export const GET_PROJECT_STATUS_DISTRIBUTION = gql`
  query GetProjectStatusDistribution {
    projectStatusDistribution {
      planning
      inProgress
      completed
    }
  }
`;

// Query for task progress overview
export const GET_TASK_PROGRESS_OVERVIEW = gql`
  query GetTaskProgressOverview {
    taskProgressOverview {
      todo
      inProgress
      done
    }
  }
`;

// Public queries for unauthenticated users
export const GET_PUBLIC_STATS = gql`
  query GetPublicStats {
    publicStats {
      totalProjects
      activeProjects
      completedProjects
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

// Search queries for members, projects, and tasks
export const SEARCH_MEMBERS = gql`
  query SearchMembers($query: String!) {
    searchMembers(query: $query) {
      id
      uuid
      firstName
      lastName
      email
      role
      ownedProjects {
        id
        uuid
        name
        description
        status
        isDeleted
      }
      assignedTasks {
        id
        uuid
        title
        description
        status
        priority
        isDeleted
        project {
          id
          uuid
          name
          description
          status
          isDeleted
        }
      }
    }
  }
`;

export const SEARCH_PROJECTS = gql`
  query SearchProjects($query: String!, $statusFilter: [String!]) {
    searchProjects(query: $query, statusFilter: $statusFilter) {
      id
      uuid
      name
      description
      status
      owner {
        id
        firstName
        lastName
      }
    }
  }
`;

export const SEARCH_TASKS = gql`
  query SearchTasks($query: String!, $taskStatusFilter: [String!]) {
    searchTasks(query: $query, taskStatusFilter: $taskStatusFilter) {
      id
      uuid
      title
      description
      status
      priority
      projectId
      assignedUserId
      project {
        id
        uuid
        name
        description
        status
        isDeleted
        owner {
          id
          uuid
          firstName
          lastName
          email
          role
        }
      }
      assignedUser {
        id
        uuid
        firstName
        lastName
        email
        role
      }
      comments {
        id
        uuid
        content
        isDeleted
        user {
          id
          uuid
          firstName
          lastName
          email
        }
      }
    }
  }
`;
