import { gql } from '@apollo/client';

/**
 * Project Management GraphQL Queries and Mutations
 * Contains all GraphQL operations for project management functionality
 */

// Fragment for project data
export const PROJECT_FRAGMENT = gql`
  fragment ProjectFragment on Project {
    id
    uuid
    name
    description
    status
    owner {
      id
      firstName
      lastName
      email
    }
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

// Query to fetch paginated projects with search and sorting
export const GET_DASHBOARD_PROJECTS_QUERY = gql`
  query GetDashboardProjects($limit: Int!, $offset: Int!, $search: String, $sortBy: String, $sortOrder: String) {
    dashboardProjects(limit: $limit, offset: $offset, search: $search, sortBy: $sortBy, sortOrder: $sortOrder) {
      projects {
        ...ProjectFragment
      }
      paginationInfo {
        ...PaginationInfoFragment
      }
    }
  }
  ${PROJECT_FRAGMENT}
  ${PAGINATION_INFO_FRAGMENT}
`;

// Mutation to create a new project
export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($input: ProjectInput!) {
    createProject(input: $input) {
      ...ProjectFragment
    }
  }
  ${PROJECT_FRAGMENT}
`;

// Mutation to update an existing project
export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($id: ID!, $input: ProjectUpdateInput!) {
    updateProject(id: $id, input: $input) {
      ...ProjectFragment
    }
  }
  ${PROJECT_FRAGMENT}
`;

// Mutation to delete a project
export const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;

// Query to get a single project by ID (for editing)
export const GET_PROJECT_QUERY = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      ...ProjectFragment
    }
  }
  ${PROJECT_FRAGMENT}
`;

// Query to fetch all users for dropdown selection
export const GET_USERS_FOR_DROPDOWN_QUERY = gql`
  query GetUsersForDropdown {
    users(limit: 100, offset: 0, sortBy: "id", sortOrder: "ASC") {
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

// Type definitions for the queries and mutations
export interface GetDashboardProjectsQueryVariables {
  limit: number;
  offset: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface GetDashboardProjectsQueryResponse {
  dashboardProjects: {
    projects: Array<{
      id: string;
      uuid: string;
      name: string;
      description: string;
      status: string;
      owner: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
      } | null;
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

export interface CreateProjectMutationVariables {
  input: {
    name: string;
    description: string;
    status: string;
    ownerId?: string;
  };
}

export interface CreateProjectMutationResponse {
  createProject: {
    id: string;
    uuid: string;
    name: string;
    description: string;
    status: string;
    owner: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
    isDeleted: boolean;
    version: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdateProjectMutationVariables {
  id: string;
  input: {
    name?: string;
    description?: string;
    status?: string;
    ownerId?: string;
  };
}

export interface UpdateProjectMutationResponse {
  updateProject: {
    id: string;
    uuid: string;
    name: string;
    description: string;
    status: string;
    owner: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
    isDeleted: boolean;
    version: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface DeleteProjectMutationVariables {
  id: string;
}

export interface DeleteProjectMutationResponse {
  deleteProject: boolean;
}

export interface GetUsersForDropdownQueryResponse {
  users: {
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
