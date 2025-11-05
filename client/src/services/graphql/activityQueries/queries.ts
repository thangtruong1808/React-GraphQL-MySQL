import { gql } from '@apollo/client';
import { ACTIVITY_FRAGMENT, PAGINATION_INFO_FRAGMENT } from './fragments';

/**
 * GraphQL Queries for Activity Management
 * Provides queries for fetching activities and dropdown data
 */

/**
 * Query to get dashboard activities with pagination, search, and sorting
 * Supports filtering and sorting activities
 */
export const GET_DASHBOARD_ACTIVITIES_QUERY = gql`
  ${ACTIVITY_FRAGMENT}
  ${PAGINATION_INFO_FRAGMENT}
  query GetDashboardActivities(
    $limit: Int
    $offset: Int
    $search: String
    $sortBy: String
    $sortOrder: String
  ) {
    dashboardActivities(
      limit: $limit
      offset: $offset
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      activities {
        ...ActivityFragment
      }
      paginationInfo {
        ...PaginationInfoFragment
      }
    }
  }
`;

/**
 * Query to fetch users for dropdown selection
 * Returns list of users for activity creation/editing
 */
export const GET_USERS_FOR_DROPDOWN_QUERY = gql`
  query GetUsersForDropdown {
    users(limit: 100, offset: 0, sortBy: "firstName", sortOrder: "ASC") {
      users {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

/**
 * Query to fetch projects for dropdown selection
 * Returns list of projects for activity creation/editing
 */
export const GET_PROJECTS_FOR_DROPDOWN_QUERY = gql`
  query GetProjectsForDropdown {
    dashboardProjects(limit: 100, offset: 0, sortBy: "name", sortOrder: "ASC") {
      projects {
        id
        name
        description
        status
      }
    }
  }
`;

/**
 * Query to fetch tasks for dropdown selection
 * Returns list of tasks for activity creation/editing
 */
export const GET_TASKS_FOR_DROPDOWN_QUERY = gql`
  query GetTasksForDropdown {
    dashboardTasks(limit: 100, offset: 0, sortBy: "title", sortOrder: "ASC") {
      tasks {
        id
        title
        status
        project {
          id
          name
        }
      }
    }
  }
`;

