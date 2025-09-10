import { gql } from '@apollo/client';

/**
 * GraphQL Mutations for Login Feature
 * Defines mutations for authentication operations
 */

// Mutation for user login
export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      csrfToken
      user {
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
  }
`;

// Mutation for refreshing access token
export const REFRESH_TOKEN = gql`
  mutation RefreshToken($dynamicBuffer: Int) {
    refreshToken(dynamicBuffer: $dynamicBuffer) {
      accessToken
      refreshToken
      csrfToken
      user {
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
  }
`;

// Mutation for user logout
export const LOGOUT = gql`
  mutation Logout {
    logout {
      success
      message
    }
  }
`;