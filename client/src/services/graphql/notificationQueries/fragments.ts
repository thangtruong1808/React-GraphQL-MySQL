import { gql } from '@apollo/client';

/**
 * GraphQL Fragments for Notification Management
 * Reusable fragments for notification queries and mutations
 */

/**
 * Fragment for notification data
 * Includes all fields needed for notification display
 */
export const NOTIFICATION_FRAGMENT = gql`
  fragment NotificationFragment on Notification {
    id
    user {
      id
      uuid
      firstName
      lastName
      email
      role
    }
    message
    isRead
    createdAt
    updatedAt
  }
`;

/**
 * Fragment for pagination info
 * Reusable pagination information for queries
 */
export const PAGINATION_INFO_FRAGMENT = gql`
  fragment PaginationInfoFragment on PaginationInfo {
    hasNextPage
    hasPreviousPage
    totalCount
    currentPage
    totalPages
  }
`;

