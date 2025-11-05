/**
 * Activity Queries Module
 * Central export point for all activity-related GraphQL operations
 */

// Export fragments
export { ACTIVITY_FRAGMENT, PAGINATION_INFO_FRAGMENT } from './fragments';

// Export queries
export {
  GET_DASHBOARD_ACTIVITIES_QUERY,
  GET_USERS_FOR_DROPDOWN_QUERY,
  GET_PROJECTS_FOR_DROPDOWN_QUERY,
  GET_TASKS_FOR_DROPDOWN_QUERY,
} from './queries';

// Export mutations
export { CREATE_ACTIVITY_MUTATION, UPDATE_ACTIVITY_MUTATION, DELETE_ACTIVITY_MUTATION } from './mutations';

// Export types
export type {
  ActivityUser,
  ActivityTargetUser,
  ActivityProject,
  ActivityTask,
  Activity,
  PaginationInfo,
  GetDashboardActivitiesQueryVariables,
  GetDashboardActivitiesQueryResponse,
  CreateActivityMutationVariables,
  CreateActivityMutationResponse,
  UpdateActivityMutationVariables,
  UpdateActivityMutationResponse,
  DeleteActivityMutationVariables,
  DeleteActivityMutationResponse,
  User,
  Project,
  Task,
  GetUsersForDropdownResponse,
  GetProjectsForDropdownResponse,
  GetTasksForDropdownResponse,
} from './types';

