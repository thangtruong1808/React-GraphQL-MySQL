/**
 * TypeScript Interfaces for Activity Management
 * Defines types for GraphQL queries and mutations
 */

/**
 * Activity user interface
 * Represents user information in activities
 */
export interface ActivityUser {
  id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

/**
 * Activity target user interface
 * Represents target user information in activities
 */
export interface ActivityTargetUser {
  id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

/**
 * Activity project interface
 * Represents project information in activities
 */
export interface ActivityProject {
  id: string;
  uuid: string;
  name: string;
}

/**
 * Activity task interface
 * Represents task information in activities
 */
export interface ActivityTask {
  id: string;
  uuid: string;
  title: string;
  project: ActivityProject;
}

/**
 * Activity interface
 * Represents a complete activity log entry
 */
export interface Activity {
  id: string;
  uuid: string;
  user: ActivityUser;
  targetUser?: ActivityTargetUser;
  project?: ActivityProject;
  task?: ActivityTask;
  action: string;
  type: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

/**
 * Pagination info interface
 * Represents pagination information for queries
 */
export interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Get dashboard activities query variables
 */
export interface GetDashboardActivitiesQueryVariables {
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

/**
 * Get dashboard activities query response
 */
export interface GetDashboardActivitiesQueryResponse {
  dashboardActivities: {
    activities: Activity[];
    paginationInfo: PaginationInfo;
  };
}

/**
 * Create activity mutation variables
 */
export interface CreateActivityMutationVariables {
  input: {
    action: string;
    type: string;
    targetUserId?: string;
    projectId?: string;
    taskId?: string;
    metadata?: any;
  };
}

/**
 * Create activity mutation response
 */
export interface CreateActivityMutationResponse {
  createActivity: Activity;
}

/**
 * Update activity mutation variables
 */
export interface UpdateActivityMutationVariables {
  id: string;
  input: {
    action?: string;
    type?: string;
    metadata?: any;
  };
}

/**
 * Update activity mutation response
 */
export interface UpdateActivityMutationResponse {
  updateActivity: Activity;
}

/**
 * Delete activity mutation variables
 */
export interface DeleteActivityMutationVariables {
  id: string;
}

/**
 * Delete activity mutation response
 */
export interface DeleteActivityMutationResponse {
  deleteActivity: boolean;
}

/**
 * User interface for dropdown queries
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

/**
 * Project interface for dropdown queries
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
}

/**
 * Task interface for dropdown queries
 */
export interface Task {
  id: string;
  title: string;
  status: string;
  project: {
    id: string;
    name: string;
  };
}

/**
 * Get users for dropdown response
 */
export interface GetUsersForDropdownResponse {
  users: {
    users: User[];
  };
}

/**
 * Get projects for dropdown response
 */
export interface GetProjectsForDropdownResponse {
  dashboardProjects: {
    projects: Project[];
  };
}

/**
 * Get tasks for dropdown response
 */
export interface GetTasksForDropdownResponse {
  dashboardTasks: {
    tasks: Task[];
  };
}

