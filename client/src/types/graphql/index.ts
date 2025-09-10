/**
 * GraphQL Types for Login Feature
 * Defines TypeScript interfaces for GraphQL operations
 */

// User Role Enum
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  DEVELOPER = 'DEVELOPER',
}

// User Type
export interface User {
  id: string;
  uuid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isDeleted: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

// Authentication Response Type
export interface AuthResponse {
  accessToken: string | null;
  refreshToken: string | null;
  csrfToken: string | null;
  user: User | null;
}

// Logout Response Type
export interface LogoutResponse {
  success: boolean;
  message: string;
}

// Refresh Token Renewal Response Type
export interface RefreshTokenRenewalResponse {
  success: boolean;
  message: string;
  user: User | null;
}

// Login Input Type
export interface LoginInput {
  email: string;
  password: string;
}



// User Session Info Type
export interface UserSessionInfo {
  userId: string;
  userEmail: string;
  activeTokens: number;
  maxAllowed: number;
  isAtLimit: boolean;
}

export interface UsersWithSessionsQuery {
  usersWithSessions: UserSessionInfo[];
}

// GraphQL Mutation Response Types
export interface LoginMutation {
  login: AuthResponse;
}

export interface LogoutMutation {
  logout: LogoutResponse;
}

export interface RefreshTokenRenewalMutation {
  refreshTokenRenewal: RefreshTokenRenewalResponse;
}

export interface ForceLogoutUserMutation {
  forceLogoutUser: boolean;
}

// Dashboard Types
export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

// Dashboard Statistics Type
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  totalUsers: number;
  recentActivity: number;
}

// Project Type for Dashboard
export interface Project {
  id: string;
  uuid: string;
  name: string;
  status: ProjectStatus;
  taskCount: number;
  memberCount: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

// Task Type for Dashboard
export interface Task {
  id: string;
  uuid: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  project: {
    id: string;
    name: string;
  };
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

// Project Status Distribution Type
export interface ProjectStatusDistribution {
  planning: number;
  inProgress: number;
  completed: number;
}

// Task Progress Overview Type
export interface TaskProgressOverview {
  todo: number;
  inProgress: number;
  done: number;
}

// Dashboard Query Response Types
export interface DashboardStatsQuery {
  dashboardStats: DashboardStats;
}

export interface RecentProjectsQuery {
  recentProjects: Project[];
}

export interface UpcomingTasksQuery {
  upcomingTasks: Task[];
}

export interface ProjectStatusDistributionQuery {
  projectStatusDistribution: ProjectStatusDistribution;
}

export interface TaskProgressOverviewQuery {
  taskProgressOverview: TaskProgressOverview;
}

// Public Dashboard Types
export interface PublicStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  totalUsers: number;
  recentActivity: number;
  averageProjectCompletion: number;
}

export interface PublicProject {
  id: string;
  uuid: string;
  name: string;
  status: ProjectStatus;
  taskCount: number;
  memberCount: number;
  createdAt: string;
}

export interface PublicTask {
  id: string;
  uuid: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  project: {
    name: string;
  };
}

// Public Query Response Types
export interface PublicStatsQuery {
  publicStats: PublicStats;
}

export interface FeaturedProjectsQuery {
  featuredProjects: PublicProject[];
}

export interface PublicRecentTasksQuery {
  publicRecentTasks: PublicTask[];
} 