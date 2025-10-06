import { gql } from '@apollo/client';

/**
 * User Management GraphQL Queries and Mutations
 * Contains all GraphQL operations for user management functionality
 */

// Fragment for user data
export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
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
`;

// Fragment for pagination info
export const PAGINATION_INFO_FRAGMENT = gql`
  fragment PaginationInfoFragment on PaginationInfo {
    hasNextPage
    hasPreviousPage
    totalCount
    currentPage
    totalPages
  }
`;

// Query to fetch paginated users with search and sorting
export const GET_USERS_QUERY = gql`
  query GetUsers($limit: Int!, $offset: Int!, $search: String, $sortBy: String, $sortOrder: String) {
    users(limit: $limit, offset: $offset, search: $search, sortBy: $sortBy, sortOrder: $sortOrder) {
      users {
        ...UserFragment
      }
      paginationInfo {
        ...PaginationInfoFragment
      }
    }
  }
  ${USER_FRAGMENT}
  ${PAGINATION_INFO_FRAGMENT}
`;

// Mutation to create a new user
export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

// Mutation to update an existing user
export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $input: UserUpdateInput!) {
    updateUser(id: $id, input: $input) {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

// Mutation to delete a user
export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

// Query to get a single user by ID (for editing)
export const GET_USER_QUERY = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

// Type definitions for the queries and mutations
export interface GetUsersQueryVariables {
  limit: number;
  offset: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface GetUsersQueryResponse {
  users: {
    users: Array<{
      id: string;
      uuid: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      isDeleted: boolean;
      version: number;
      createdAt: string;
      updatedAt: string;
    }>;
    paginationInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      totalCount: number;
      currentPage: number;
      totalPages: number;
    };
  };
}

export interface CreateUserMutationVariables {
  input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface CreateUserMutationResponse {
  createUser: {
    id: string;
    uuid: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isDeleted: boolean;
    version: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdateUserMutationVariables {
  id: string;
  input: {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  };
}

export interface UpdateUserMutationResponse {
  updateUser: {
    id: string;
    uuid: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isDeleted: boolean;
    version: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface DeleteUserMutationVariables {
  id: string;
}

export interface DeleteUserMutationResponse {
  deleteUser: boolean;
}
