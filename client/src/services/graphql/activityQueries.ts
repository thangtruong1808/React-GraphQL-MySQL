import { gql } from '@apollo/client';

/**
 * GraphQL Queries and Mutations for Activity Management
 * Provides CRUD operations for activities in the dashboard
 */

// Fragment for activity data
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

// Query to get dashboard activities with pagination, search, and sorting
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

// Mutation to create a new activity
export const CREATE_ACTIVITY_MUTATION = gql`
  ${ACTIVITY_FRAGMENT}
  mutation CreateActivity($input: ActivityInput!) {
    createActivity(input: $input) {
      ...ActivityFragment
    }
  }
`;

// Mutation to update an existing activity
export const UPDATE_ACTIVITY_MUTATION = gql`
  ${ACTIVITY_FRAGMENT}
  mutation UpdateActivity($id: ID!, $input: ActivityUpdateInput!) {
    updateActivity(id: $id, input: $input) {
      ...ActivityFragment
    }
  }
`;

// Mutation to delete an activity
export const DELETE_ACTIVITY_MUTATION = gql`
  mutation DeleteActivity($id: ID!) {
    deleteActivity(id: $id)
  }
`;

// TypeScript interfaces for GraphQL operations
export interface GetDashboardActivitiesQueryVariables {
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface GetDashboardActivitiesQueryResponse {
  dashboardActivities: {
    activities: Array<{
      id: string;
      uuid: string;
      user: {
        id: string;
        uuid: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
      };
      targetUser?: {
        id: string;
        uuid: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
      };
      project?: {
        id: string;
        uuid: string;
        name: string;
      };
      task?: {
        id: string;
        uuid: string;
        title: string;
        project: {
          id: string;
          uuid: string;
          name: string;
        };
      };
      action: string;
      type: string;
      metadata?: any;
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

export interface CreateActivityMutationVariables {
  input: {
    action: string;
    type: string;
    targetUserId?: string;
    projectId?: string;
    taskId?: string;
    metadata?: any;
  };
}

export interface CreateActivityMutationResponse {
  createActivity: {
    id: string;
    uuid: string;
    user: {
      id: string;
      uuid: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
    targetUser?: {
      id: string;
      uuid: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
    project?: {
      id: string;
      uuid: string;
      name: string;
    };
    task?: {
      id: string;
      uuid: string;
      title: string;
      project: {
        id: string;
        uuid: string;
        name: string;
      };
    };
    action: string;
    type: string;
    metadata?: any;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdateActivityMutationVariables {
  id: string;
  input: {
    action?: string;
    type?: string;
    metadata?: any;
  };
}

export interface UpdateActivityMutationResponse {
  updateActivity: {
    id: string;
    uuid: string;
    user: {
      id: string;
      uuid: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
    targetUser?: {
      id: string;
      uuid: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
    project?: {
      id: string;
      uuid: string;
      name: string;
    };
    task?: {
      id: string;
      uuid: string;
      title: string;
      project: {
        id: string;
        uuid: string;
        name: string;
      };
    };
    action: string;
    type: string;
    metadata?: any;
    createdAt: string;
    updatedAt: string;
  };
}

export interface DeleteActivityMutationVariables {
  id: string;
}

export interface DeleteActivityMutationResponse {
  deleteActivity: boolean;
}
