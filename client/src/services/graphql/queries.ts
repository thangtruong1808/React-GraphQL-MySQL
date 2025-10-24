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
// All parameters are optional - search works independently
export const SEARCH_MEMBERS = gql`
  query SearchMembers($query: String, $roleFilter: [UserRole!]) {
    searchMembers(query: $query, roleFilter: $roleFilter) {
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
        tasks {
          id
          uuid
          title
          description
          status
          priority
          isDeleted
          assignedUser {
            id
            uuid
            firstName
            lastName
            email
            role
          }
        }
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
  query SearchProjects($statusFilter: [ProjectStatus!]) {
    searchProjects(statusFilter: $statusFilter) {
      id
      uuid
      name
      description
      status
      owner {
        id
        uuid
        firstName
        lastName
        email
        role
      }
      tasks {
        id
        uuid
        title
        description
        status
        priority
        isDeleted
        assignedUser {
          id
          uuid
          firstName
          lastName
          email
          role
        }
      }
    }
  }
`;

export const SEARCH_TASKS = gql`
  query SearchTasks($taskStatusFilter: [TaskStatus!]) {
    searchTasks(taskStatusFilter: $taskStatusFilter) {
      id
      uuid
      title
      description
      status
      priority
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
    }
  }
`;

// Team members query for public team page
export const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers {
    teamMembers {
      id
      uuid
      firstName
      lastName
      role
      projectCount
      taskCount
      joinDate
      createdAt
    }
  }
`;

// Paginated team members query for load more functionality with role filtering
export const GET_PAGINATED_TEAM_MEMBERS = gql`
  query GetPaginatedTeamMembers($limit: Int = 12, $offset: Int = 0, $roleFilter: String) {
    paginatedTeamMembers(limit: $limit, offset: $offset, roleFilter: $roleFilter) {
      teamMembers {
        id
        uuid
        firstName
        lastName
        role
        projectCount
        taskCount
        joinDate
        createdAt
      }
      paginationInfo {
        hasNextPage
        hasPreviousPage
        totalCount
        currentPage
        totalPages
      }
    }
  }
`;

// Team statistics query for database-wide role counts
export const GET_TEAM_STATS = gql`
  query GetTeamStats {
    teamStats {
      totalMembers
      administrators
      projectManagers
      developers
      architects
      specialists
      frontendDevelopers
      backendDevelopers
      fullStackDevelopers
      softwareArchitects
      devopsEngineers
      databaseAdministrators
      qaEngineers
      qcEngineers
      uxUiDesigners
      businessAnalysts
      technicalWriters
      supportEngineers
    }
  }
`;

// Public projects query for public projects page (legacy - loads all projects)
export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      description
      status
      taskCount
      memberCount
      createdAt
      owner {
        firstName
        lastName
      }
    }
  }
`;

// Paginated projects query for infinite scroll support
export const GET_PAGINATED_PROJECTS = gql`
  query GetPaginatedProjects($limit: Int = 12, $offset: Int = 0, $statusFilter: ProjectStatus) {
    paginatedProjects(limit: $limit, offset: $offset, statusFilter: $statusFilter) {
      projects {
        id
        name
        description
        status
        taskCount
        memberCount
        createdAt
        owner {
          firstName
          lastName
        }
      }
      paginationInfo {
        hasNextPage
        hasPreviousPage
        totalCount
        currentPage
        totalPages
      }
    }
  }
`;

// Project details query for individual project page
export const GET_PROJECT_DETAILS = gql`
  query GetProjectDetails($projectId: ID!) {
    project(id: $projectId) {
      id
      uuid
      name
      description
      status
      createdAt
      updatedAt
      owner {
        id
        firstName
        lastName
        email
        role
      }
      tasks {
        id
        title
        description
        status
        priority
        dueDate
        createdAt
        assignedUser {
          firstName
          lastName
        }
        tags {
          id
          name
          description
          title
          type
          category
        }
      }
      members {
        id
        firstName
        lastName
        email
        role
        memberRole
      }
      comments {
        id
        uuid
        content
        author {
          id
          firstName
          lastName
          email
          role
        }
        createdAt
        updatedAt
        likesCount
        isLikedByUser
        likers {
          id
          uuid
          firstName
          lastName
          email
          role
          isDeleted
          version
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
      id
      uuid
      content
      author {
        id
        firstName
        lastName
        email
        role
      }
      projectId
      taskId
      createdAt
      updatedAt
      likesCount
      isLikedByUser
    }
  }
`;

export const TOGGLE_COMMENT_LIKE = gql`
  mutation ToggleCommentLike($commentId: ID!) {
    toggleCommentLike(commentId: $commentId) {
      id
      likesCount
      isLikedByUser
      likers {
        id
        uuid
        firstName
        lastName
        email
        role
        isDeleted
        version
        createdAt
        updatedAt
      }
    }
  }
`;