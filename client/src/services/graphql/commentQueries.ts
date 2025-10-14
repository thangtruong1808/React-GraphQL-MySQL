import { gql } from '@apollo/client';

/**
 * GraphQL Queries and Mutations for Comment Management
 * Provides CRUD operations for comments in the dashboard
 */

// Fragment for comment data
export const COMMENT_FRAGMENT = gql`
  fragment CommentFragment on Comment {
    id
    uuid
    content
    author {
      id
      uuid
      firstName
      lastName
      email
      role
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
    isDeleted
    version
    createdAt
    updatedAt
    likesCount
    isLikedByUser
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

// Query to get dashboard comments with pagination, search, and sorting
export const GET_DASHBOARD_COMMENTS_QUERY = gql`
  ${COMMENT_FRAGMENT}
  ${PAGINATION_INFO_FRAGMENT}
  query GetDashboardComments(
    $limit: Int
    $offset: Int
    $search: String
    $sortBy: String
    $sortOrder: String
  ) {
    dashboardComments(
      limit: $limit
      offset: $offset
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      comments {
        ...CommentFragment
      }
      paginationInfo {
        ...PaginationInfoFragment
      }
    }
  }
`;

// Mutation to create a new comment (uses existing project-based comment creation)
export const CREATE_COMMENT_MUTATION = gql`
  ${COMMENT_FRAGMENT}
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
      ...CommentFragment
    }
  }
`;

// Mutation to update an existing comment
export const UPDATE_COMMENT_MUTATION = gql`
  ${COMMENT_FRAGMENT}
  mutation UpdateComment($id: ID!, $input: CommentUpdateInput!) {
    updateComment(id: $id, input: $input) {
      ...CommentFragment
    }
  }
`;

// Mutation to delete a comment
export const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`;

// Query to fetch all projects for dropdown selection
export const GET_PROJECTS_FOR_DROPDOWN_QUERY = gql`
  query GetProjectsForDropdown {
    dashboardProjects(limit: 100, offset: 0, sortBy: "name", sortOrder: "ASC") {
      projects {
        id
        name
        description
        status
      }
      paginationInfo {
        totalCount
      }
    }
  }
`;

// TypeScript interfaces for the queries and mutations
export interface Comment {
  id: string;
  uuid: string;
  content: string;
  author: {
    id: string;
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  task: {
    id: string;
    uuid: string;
    title: string;
    project: {
      id: string;
      uuid: string;
      name: string;
    };
  };
  isDeleted: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  isLikedByUser: boolean;
}

export interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface PaginatedCommentsResponse {
  comments: Comment[];
  paginationInfo: PaginationInfo;
}

export interface GetDashboardCommentsQueryData {
  dashboardComments: PaginatedCommentsResponse;
}

export interface GetDashboardCommentsQueryVariables {
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface CommentInput {
  content: string;
  projectId?: string;
  taskId?: string;
}

export interface CommentUpdateInput {
  content?: string;
}

export interface CreateCommentMutationData {
  createComment: Comment;
}

export interface CreateCommentMutationVariables {
  input: CommentInput;
}

export interface UpdateCommentMutationData {
  updateComment: Comment;
}

export interface UpdateCommentMutationVariables {
  id: string;
  input: CommentUpdateInput;
}

export interface DeleteCommentMutationData {
  deleteComment: boolean;
}

export interface DeleteCommentMutationVariables {
  id: string;
}

export interface GetProjectsForDropdownQueryResponse {
  dashboardProjects: {
    projects: Array<{
      id: string;
      name: string;
      description: string;
      status: string;
    }>;
    paginationInfo: {
      totalCount: number;
    };
  };
}
