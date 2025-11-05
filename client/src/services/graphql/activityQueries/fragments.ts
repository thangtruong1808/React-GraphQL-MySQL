import { gql } from '@apollo/client';

/**
 * GraphQL Fragments for Activity Management
 * Reusable fragments for activity queries and mutations
 */

/**
 * Fragment for activity data
 * Includes all fields needed for activity display
 */
export const ACTIVITY_FRAGMENT = gql`
  fragment ActivityFragment on Activity {
    id
    uuid
    user {
      id
      uuid
      firstName
      lastName
      email
      role
    }
    targetUser {
      id
      uuid
      firstName
      lastName
      email
      role
    }
    project {
      id
      uuid
      name
    }
    task {
      id
      uuid
      title
      project {
        id
        uuid
        name
      }
    }
    action
    type
    metadata
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

