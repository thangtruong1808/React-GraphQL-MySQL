import { gql } from '@apollo/client';

/**
 * GraphQL Queries for Login Feature
 * Defines queries for authentication operations
 */

// Query to get current authenticated user
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      uuid
      email
      firstName
      lastName
      role
      isDeleted
      version
      createdAt
      updatedAt
    }
  }
`; 