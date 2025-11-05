/**
 * GraphQL Queries Module
 * Central export point for all GraphQL queries and mutations
 */

// Export dashboard queries
export {
  GET_DASHBOARD_STATS,
  GET_RECENT_PROJECTS,
  GET_UPCOMING_TASKS,
  GET_PROJECT_STATUS_DISTRIBUTION,
  GET_TASK_PROGRESS_OVERVIEW,
} from './dashboard';

// Export public queries
export {
  GET_PUBLIC_STATS,
  GET_FEATURED_PROJECTS,
  GET_PUBLIC_RECENT_TASKS,
} from './public';

// Export search queries
export {
  SEARCH_MEMBERS,
  SEARCH_PROJECTS,
  SEARCH_TASKS,
} from './search';

// Export team queries
export {
  GET_TEAM_MEMBERS,
  GET_PAGINATED_TEAM_MEMBERS,
  GET_TEAM_STATS,
} from './team';

// Export project queries
export {
  GET_PROJECTS,
  GET_PAGINATED_PROJECTS,
  GET_PROJECT_DETAILS,
} from './projects';

// Export comment mutations
export {
  CREATE_COMMENT,
  TOGGLE_COMMENT_LIKE,
} from './mutations';

