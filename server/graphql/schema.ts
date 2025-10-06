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
    PROJECT_MANAGER_PM
    SOFTWARE_ARCHITECT
    FRONTEND_DEVELOPER
    BACKEND_DEVELOPER
    FULL_STACK_DEVELOPER
    DEVOPS_ENGINEER
    QA_ENGINEER
    QC_ENGINEER
    UX_UI_DESIGNER
    BUSINESS_ANALYST
    DATABASE_ADMINISTRATOR
    TECHNICAL_WRITER
    SUPPORT_ENGINEER
  }

  # User Type - matches database users table structure
  type User {
    id: ID!
    uuid: String
    email: String!
    firstName: String!
    lastName: String!
    role: UserRole!
    isDeleted: Boolean!
    version: Int!
    createdAt: String
    updatedAt: String
    # Associated projects and tasks for member search
    ownedProjects: [Project!]!
    assignedTasks: [Task!]!
    # Member role in project (when used as project member)
    memberRole: String
  }

  # Team Member Type - for public team display with aggregated stats
  type TeamMember {
    id: ID!
    uuid: String!
    firstName: String!
    lastName: String!
    role: UserRole!
    projectCount: Int!
    taskCount: Int!
    joinDate: String!
    createdAt: String!
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
    uuid: String
    name: String!
    description: String!
    status: ProjectStatus!
    owner: User
    isDeleted: Boolean!
    version: Int!
    createdAt: String
    updatedAt: String
    # Tasks belonging to this project
    tasks: [Task!]!
    # Members of this project
    members: [User!]!
    # Comments on this project
    comments: [Comment!]!
  }

  # Task Type - for task management
  type Task {
    id: ID!
    uuid: String
    title: String!
    description: String!
    status: TaskStatus!
    priority: TaskPriority!
    dueDate: String
    project: Project!
    assignedUser: User
    isDeleted: Boolean!
    version: Int!
    createdAt: String
    updatedAt: String
  }

  # Comment Type - for project and task comments
  type Comment {
    id: ID!
    uuid: String
    content: String!
    author: User!
    projectId: ID
    taskId: ID
    isDeleted: Boolean!
    version: Int!
    createdAt: String
    updatedAt: String
    # Comment likes count and user's like status
    likesCount: Int!
    isLikedByUser: Boolean!
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

  # Comment Input Type - for creating new comments
  input CommentInput {
    content: String!
    projectId: ID
    taskId: ID
  }

  # User Input Type - for creating new users
  input UserInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    role: UserRole!
  }

  # User Update Input Type - for updating existing users
  input UserUpdateInput {
    email: String
    firstName: String
    lastName: String
    role: UserRole
  }

  # Paginated Users Response Type - for user management with pagination
  type PaginatedUsersResponse {
    users: [User!]!
    paginationInfo: PaginationInfo!
  }

  # Project Input Type - for creating new projects
  input ProjectInput {
    name: String!
    description: String!
    status: ProjectStatus!
    ownerId: ID
  }

  # Project Update Input Type - for updating existing projects
  input ProjectUpdateInput {
    name: String
    description: String
    status: ProjectStatus
    ownerId: ID
  }

  # Paginated Dashboard Projects Response Type - for project management with pagination
  type PaginatedDashboardProjectsResponse {
    projects: [Project!]!
    paginationInfo: PaginationInfo!
  }

  # Task Input Type - for creating new tasks
  input TaskInput {
    title: String!
    description: String!
    status: TaskStatus!
    priority: TaskPriority!
    dueDate: String
    projectId: ID!
    assignedUserId: ID
  }

  # Task Update Input Type - for updating existing tasks
  input TaskUpdateInput {
    title: String
    description: String
    status: TaskStatus
    priority: TaskPriority
    dueDate: String
    projectId: ID
    assignedUserId: ID
  }

  # Paginated Dashboard Tasks Response Type - for task management with pagination
  type PaginatedDashboardTasksResponse {
    tasks: [Task!]!
    paginationInfo: PaginationInfo!
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

  # Public Project Type - for public projects page with aggregated stats
  type PublicProject {
    id: ID!
    name: String!
    description: String!
    status: ProjectStatus!
    taskCount: Int!
    memberCount: Int!
    createdAt: String!
    owner: PublicProjectOwner!
  }

  # Pagination Info Type - for infinite scroll support
  type PaginationInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    totalCount: Int!
    currentPage: Int!
    totalPages: Int!
  }

  # Paginated Projects Response Type - for infinite scroll
  type PaginatedProjectsResponse {
    projects: [PublicProject!]!
    paginationInfo: PaginationInfo!
  }

  # Paginated Team Members Response Type - for load more functionality
  type PaginatedTeamMembersResponse {
    teamMembers: [TeamMember!]!
    paginationInfo: PaginationInfo!
  }

  # Team Statistics Type - for database-wide team role counts
  type TeamStats {
    totalMembers: Int!
    administrators: Int!
    projectManagers: Int!
    developers: Int!
    architects: Int!
    specialists: Int!
    # Individual role counts for detailed filtering
    frontendDevelopers: Int!
    backendDevelopers: Int!
    fullStackDevelopers: Int!
    softwareArchitects: Int!
    devopsEngineers: Int!
    databaseAdministrators: Int!
    qaEngineers: Int!
    qcEngineers: Int!
    uxUiDesigners: Int!
    businessAnalysts: Int!
    technicalWriters: Int!
    supportEngineers: Int!
  }

  # Project Status Distribution Type - for project statistics
  type ProjectStatusDistribution {
    planning: Int!
    inProgress: Int!
    completed: Int!
  }

  # Public Project Owner Type - simplified owner info for public display
  type PublicProjectOwner {
    firstName: String!
    lastName: String!
  }

  # Query Type - includes public statistics and search functionality
  type Query {
    _placeholder: String
    publicStats: PublicStats!
    # Team functionality - for public team page
    teamMembers: [TeamMember!]! # Legacy - loads all team members
    # Paginated team members - for load more support with role filtering
    paginatedTeamMembers(limit: Int = 12, offset: Int = 0, roleFilter: UserRole): PaginatedTeamMembersResponse!
    # Team statistics - for database-wide role counts
    teamStats: TeamStats!
    # Project statistics - for database-wide status counts
    projectStatusDistribution: ProjectStatusDistribution!
    # Public projects - for public projects page (legacy, loads all)
    projects: [PublicProject!]!
    # Single project - for project details page
    project(id: ID!): Project
    # Paginated projects - for infinite scroll support
    paginatedProjects(limit: Int = 12, offset: Int = 0, statusFilter: ProjectStatus): PaginatedProjectsResponse!
    # Search functionality - all parameters are optional
    searchMembers(query: String, roleFilter: [UserRole!]): [User!]!
    searchProjects(statusFilter: [ProjectStatus!]): [Project!]!
    searchTasks(taskStatusFilter: [TaskStatus!]): [Task!]!
    # User management - for dashboard users page
    users(limit: Int = 10, offset: Int = 0, search: String, sortBy: String = "createdAt", sortOrder: String = "DESC"): PaginatedUsersResponse!
    # Projects management - for dashboard projects page
    dashboardProjects(limit: Int = 10, offset: Int = 0, search: String, sortBy: String = "createdAt", sortOrder: String = "DESC"): PaginatedDashboardProjectsResponse!
    # Tasks management - for dashboard tasks page
    dashboardTasks(limit: Int = 10, offset: Int = 0, search: String, sortBy: String = "createdAt", sortOrder: String = "DESC"): PaginatedDashboardTasksResponse!
  }

  # Mutation Type - includes authentication and comment mutations
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
    
    # Create a new comment on a project or task - requires authentication
    createComment(input: CommentInput!): Comment!
    
    # Like/unlike a comment - requires authentication
    toggleCommentLike(commentId: ID!): Comment!
    
    # User management mutations - require authentication
    createUser(input: UserInput!): User!
    updateUser(id: ID!, input: UserUpdateInput!): User!
    deleteUser(id: ID!): Boolean!
    # Project management mutations - require authentication
    createProject(input: ProjectInput!): Project!
    updateProject(id: ID!, input: ProjectUpdateInput!): Project!
    deleteProject(id: ID!): Boolean!
    # Task management mutations - require authentication
    createTask(input: TaskInput!): Task!
    updateTask(id: ID!, input: TaskUpdateInput!): Task!
    deleteTask(id: ID!): Boolean!
  }
`;
