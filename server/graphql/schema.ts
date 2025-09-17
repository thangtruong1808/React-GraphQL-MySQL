import { gql } from 'graphql-tag';

/**
 * Cleaned GraphQL Schema for Authentication
 * Contains only the types and operations actually used by the client
 * Follows GraphQL best practices for schema design
 */

export const typeDefs = gql`
  # Custom JSON Scalar Type for flexible data structures
  scalar JSON

  # Authorization directive for schema-level security
  directive @auth(
    role: String
  ) on FIELD_DEFINITION

  # User Role Enum - matches database schema
  enum UserRole {
    ADMIN
    MANAGER
    DEVELOPER
  }

  # User Type - matches database users table structure
  type User {
    id: ID!
    uuid: String!
    email: String!
    firstName: String!
    lastName: String!
    role: UserRole!
    isDeleted: Boolean!
    version: Int!
    createdAt: String!
    updatedAt: String!
    # Associated projects and tasks for member search
    ownedProjects: [Project!]!
    assignedTasks: [Task!]!
  }

  # Project Status Enum - matches database enum values
  enum ProjectStatus {
    PLANNING
    IN_PROGRESS
    COMPLETED
  }

  # Task Status Enum - matches database enum values
  enum TaskStatus {
    TODO
    IN_PROGRESS
    DONE
  }

  # Task Priority Enum - matches database enum values
  enum TaskPriority {
    LOW
    MEDIUM
    HIGH
  }

  # Project Type - for project management
  type Project {
    id: ID!
    uuid: String!
    name: String!
    description: String!
    status: ProjectStatus!
    owner: User
    isDeleted: Boolean!
    version: Int!
    createdAt: String!
    updatedAt: String!
  }

  # Task Type - for task management
  type Task {
    id: ID!
    uuid: String!
    title: String!
    description: String!
    status: TaskStatus!
    priority: TaskPriority!
    project: Project!
    assignedUser: User
    isDeleted: Boolean!
    version: Int!
    createdAt: String!
    updatedAt: String!
  }

  # Project Like Info Type - for displaying project names with like counts
  type ProjectLikeInfo {
    projectName: String!
    likeCount: Int!
  }

  # Task Like Info Type - for displaying task names with like counts
  type TaskLikeInfo {
    taskName: String!
    likeCount: Int!
  }

  # Comment Like Info Type - for displaying comment content with like counts
  type CommentLikeInfo {
    commentContent: String!
    likeCount: Int!
  }

  # Authentication Response Type - includes all tokens returned by login/refresh
  type AuthResponse {
    accessToken: String
    refreshToken: String
    csrfToken: String
    user: User
  }

  # Logout Response Type - simple success/error response
  type LogoutResponse {
    success: Boolean!
    message: String!
  }

  # Refresh Token Renewal Response Type - for extending refresh token expiry
  type RefreshTokenRenewalResponse {
    success: Boolean!
    message: String!
    user: User
  }

  # Login Input Type - email and password for authentication
  input LoginInput {
    email: String!
    password: String!
  }

  # Public Statistics Type - for unauthenticated dashboard
  type PublicStats {
    totalProjects: Int!
    activeProjects: Int!
    completedProjects: Int!
    totalTasks: Int!
    completedTasks: Int!
    inProgressTasks: Int!
    todoTasks: Int!
    totalComments: Int!
    commentsOnCompletedTasks: Int!
    commentsOnInProgressTasks: Int!
    commentsOnTodoTasks: Int!
    totalUsers: Int!
    recentActivity: Int!
    averageProjectCompletion: Float!
    likesOnCompletedTasks: Int!
    likesOnInProgressTasks: Int!
    likesOnTodoTasks: Int!
    tasksWithLikesCompleted: [TaskLikeInfo!]!
    tasksWithLikesInProgress: [TaskLikeInfo!]!
    tasksWithLikesTodo: [TaskLikeInfo!]!
    # Project likes data by status
    likesOnCompletedProjects: Int!
    likesOnActiveProjects: Int!
    likesOnPlanningProjects: Int!
    projectsWithLikesCompleted: [ProjectLikeInfo!]!
    projectsWithLikesActive: [ProjectLikeInfo!]!
    projectsWithLikesPlanning: [ProjectLikeInfo!]!
    # Comment likes data by task status
    likesOnCommentsOnCompletedTasks: Int!
    likesOnCommentsOnInProgressTasks: Int!
    likesOnCommentsOnTodoTasks: Int!
    commentsWithLikesOnCompletedTasks: [CommentLikeInfo!]!
    commentsWithLikesOnInProgressTasks: [CommentLikeInfo!]!
    commentsWithLikesOnTodoTasks: [CommentLikeInfo!]!
  }

  # Query Type - includes public statistics and search functionality
  type Query {
    _placeholder: String
    publicStats: PublicStats!
    searchMembers(query: String!): [User!]!
    searchProjects(query: String!, statusFilter: [String!]): [Project!]!
    searchTasks(query: String!, taskStatusFilter: [String!]): [Task!]!
  }

  # Mutation Type - only includes authentication mutations that are actually used
  type Mutation {
    # User login with email/password - returns tokens and user data
    login(input: LoginInput!): AuthResponse!
    
    # User logout - clears refresh token cookie and database entry
    logout: LogoutResponse!
    
    # Refresh access token using refresh token from httpOnly cookie
    # dynamicBuffer: Optional buffer time in milliseconds for cookie expiry calculation
    refreshToken(dynamicBuffer: Int): AuthResponse!
    
    # Renew refresh token to extend session - for active users
    refreshTokenRenewal: RefreshTokenRenewalResponse!
  }
`;
