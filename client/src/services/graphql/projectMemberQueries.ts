import { gql } from '@apollo/client';

/**
 * Project Members Management GraphQL Queries and Mutations
 * Contains all GraphQL operations for project members management functionality
 */

// Fragment for project member data
export const PROJECT_MEMBER_FRAGMENT = gql`
  fragment ProjectMemberFragment on ProjectMember {
    projectId
    userId
    role
    createdAt
    updatedAt
    user {
      id
      firstName
      lastName
      email
      role
    }
    project {
      id
      name
    }
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

// Query to fetch project members for a specific project
export const GET_PROJECT_MEMBERS_QUERY = gql`
  query GetProjectMembers($projectId: ID!, $limit: Int!, $offset: Int!, $search: String, $sortBy: String, $sortOrder: String) {
    projectMembers(projectId: $projectId, limit: $limit, offset: $offset, search: $search, sortBy: $sortBy, sortOrder: $sortOrder) {
      members {
        ...ProjectMemberFragment
      }
      paginationInfo {
        ...PaginationInfoFragment
      }
    }
  }
  ${PROJECT_MEMBER_FRAGMENT}
  ${PAGINATION_INFO_FRAGMENT}
`;

// Query to fetch all users not in a specific project (for adding members)
export const GET_AVAILABLE_USERS_QUERY = gql`
  query GetAvailableUsers($projectId: ID!, $limit: Int!, $offset: Int!, $search: String) {
    availableUsers(projectId: $projectId, limit: $limit, offset: $offset, search: $search) {
      users {
        id
        firstName
        lastName
        email
        role
      }
      paginationInfo {
        totalCount
      }
    }
  }
`;

// Mutation to add a member to a project
export const ADD_PROJECT_MEMBER_MUTATION = gql`
  mutation AddProjectMember($projectId: ID!, $userId: ID!, $role: String!) {
    addProjectMember(projectId: $projectId, userId: $userId, role: $role) {
      ...ProjectMemberFragment
    }
  }
  ${PROJECT_MEMBER_FRAGMENT}
`;

// Mutation to update a project member's role
export const UPDATE_PROJECT_MEMBER_ROLE_MUTATION = gql`
  mutation UpdateProjectMemberRole($projectId: ID!, $userId: ID!, $role: String!) {
    updateProjectMemberRole(projectId: $projectId, userId: $userId, role: $role) {
      ...ProjectMemberFragment
    }
  }
  ${PROJECT_MEMBER_FRAGMENT}
`;

// Mutation to remove a member from a project
export const REMOVE_PROJECT_MEMBER_MUTATION = gql`
  mutation RemoveProjectMember($projectId: ID!, $userId: ID!) {
    removeProjectMember(projectId: $projectId, userId: $userId)
  }
`;

// Type definitions for the queries and mutations
export interface GetProjectMembersQueryVariables {
  projectId: string;
  limit: number;
  offset: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface GetProjectMembersQueryResponse {
  projectMembers: {
    members: Array<{
      projectId: string;
      userId: string;
      role: string;
      createdAt: string;
      updatedAt: string;
      user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
      };
      project: {
        id: string;
        name: string;
      };
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

export interface GetAvailableUsersQueryVariables {
  projectId: string;
  limit: number;
  offset: number;
  search?: string;
}

export interface GetAvailableUsersQueryResponse {
  availableUsers: {
    users: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    }>;
    paginationInfo: {
      totalCount: number;
    };
  };
}

export interface AddProjectMemberMutationVariables {
  projectId: string;
  userId: string;
  role: string;
}

export interface AddProjectMemberMutationResponse {
  addProjectMember: {
    projectId: string;
    userId: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
    project: {
      id: string;
      name: string;
    };
  };
}

export interface UpdateProjectMemberRoleMutationVariables {
  projectId: string;
  userId: string;
  role: string;
}

export interface UpdateProjectMemberRoleMutationResponse {
  updateProjectMemberRole: {
    projectId: string;
    userId: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
    project: {
      id: string;
      name: string;
    };
  };
}

export interface RemoveProjectMemberMutationVariables {
  projectId: string;
  userId: string;
}

export interface RemoveProjectMemberMutationResponse {
  removeProjectMember: boolean;
}

// Project member role options
export const PROJECT_MEMBER_ROLES = [
  { value: 'VIEWER', label: 'Viewer' },
  { value: 'EDITOR', label: 'Editor' },
  { value: 'OWNER', label: 'Owner' }
] as const;

export type ProjectMemberRole = typeof PROJECT_MEMBER_ROLES[number]['value'];
