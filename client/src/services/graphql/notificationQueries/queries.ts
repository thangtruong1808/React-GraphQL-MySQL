import { gql } from '@apollo/client';
import { NOTIFICATION_FRAGMENT, PAGINATION_INFO_FRAGMENT } from './fragments';

/**
 * GraphQL Queries for Notification Management
 * Provides queries for fetching notifications and dropdown data
 */

/**
 * Query to get dashboard notifications with pagination, search, and sorting
 * Supports filtering and sorting notifications
 */
export const GET_DASHBOARD_NOTIFICATIONS_QUERY = gql`
  ${NOTIFICATION_FRAGMENT}
  ${PAGINATION_INFO_FRAGMENT}
  query GetDashboardNotifications(
    $limit: Int
    $offset: Int
    $search: String
    $sortBy: String
    $sortOrder: String
  ) {
    dashboardNotifications(
      limit: $limit
      offset: $offset
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      notifications {
        ...NotificationFragment
      }
      paginationInfo {
        ...PaginationInfoFragment
      }
    }
  }
`;

/**
 * Query to get user's unread notifications for navbar
 * Returns unread notifications for the current user
 */
export const GET_USER_UNREAD_NOTIFICATIONS_QUERY = gql`
  ${NOTIFICATION_FRAGMENT}
  ${PAGINATION_INFO_FRAGMENT}
  query GetUserUnreadNotifications($limit: Int = 50) {
    dashboardNotifications(limit: $limit, offset: 0, sortBy: "createdAt", sortOrder: "DESC") {
      notifications {
        ...NotificationFragment
      }
      paginationInfo {
        ...PaginationInfoFragment
      }
    }
  }
`;

/**
 * Query to get user's unread notification count
 * Returns unread notification count for the current user
 */
export const GET_USER_UNREAD_NOTIFICATION_COUNT_QUERY = gql`
  ${NOTIFICATION_FRAGMENT}
  query GetUserUnreadNotificationCount {
    dashboardNotifications(limit: 100, offset: 0, sortBy: "createdAt", sortOrder: "DESC") {
      notifications {
        ...NotificationFragment
      }
    }
  }
`;

/**
 * Query to fetch users for dropdown selection
 * Returns list of users for notification creation/editing
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

