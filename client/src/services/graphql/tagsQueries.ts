import { gql } from '@apollo/client';

/**
 * GraphQL Queries and Mutations for Tags Management
 * Provides CRUD operations for tags in the dashboard
 */

// Fragment for tag data
export const TAG_FRAGMENT = gql`
  fragment TagFragment on Tag {
    id
    name
    description
    title
    type
    category
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

// Query to get dashboard tags with pagination, search, and sorting
export const GET_DASHBOARD_TAGS_QUERY = gql`
  ${TAG_FRAGMENT}
  ${PAGINATION_INFO_FRAGMENT}
  query GetDashboardTags(
    $limit: Int
    $offset: Int
    $search: String
    $sortBy: String
    $sortOrder: String
  ) {
    dashboardTags(
      limit: $limit
      offset: $offset
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      tags {
        ...TagFragment
      }
      paginationInfo {
        ...PaginationInfoFragment
      }
    }
  }
`;

// Mutation to create a new tag
export const CREATE_TAG_MUTATION = gql`
  ${TAG_FRAGMENT}
  mutation CreateTag($input: TagInput!) {
    createTag(input: $input) {
      ...TagFragment
    }
  }
`;

// Mutation to update an existing tag
export const UPDATE_TAG_MUTATION = gql`
  ${TAG_FRAGMENT}
  mutation UpdateTag($id: ID!, $input: TagUpdateInput!) {
    updateTag(id: $id, input: $input) {
      ...TagFragment
    }
  }
`;

// Mutation to delete a tag
export const DELETE_TAG_MUTATION = gql`
  mutation DeleteTag($id: ID!) {
    deleteTag(id: $id)
  }
`;

// TypeScript interfaces for GraphQL operations
export interface GetDashboardTagsQueryVariables {
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface GetDashboardTagsQueryResponse {
  dashboardTags: {
    tags: Array<{
      id: string;
      name: string;
      description: string;
      title?: string;
      type?: string;
      category?: string;
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

export interface CreateTagMutationVariables {
  input: {
    name: string;
    description: string;
    title?: string;
    type?: string;
    category?: string;
  };
}

export interface CreateTagMutationResponse {
  createTag: {
    id: string;
    name: string;
    description: string;
    title?: string;
    type?: string;
    category?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdateTagMutationVariables {
  id: string;
  input: {
    name?: string;
    description?: string;
    title?: string;
    type?: string;
    category?: string;
  };
}

export interface UpdateTagMutationResponse {
  updateTag: {
    id: string;
    name: string;
    description: string;
    title?: string;
    type?: string;
    category?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface DeleteTagMutationVariables {
  id: string;
}

export interface DeleteTagMutationResponse {
  deleteTag: boolean;
}
