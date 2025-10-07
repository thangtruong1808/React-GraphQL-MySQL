import { gql } from '@apollo/client';

/**
 * Task Management GraphQL Queries and Mutations
 * Handles all task-related GraphQL operations for the dashboard
 */

// Task Fragment - reusable task data structure
export const TASK_FRAGMENT = gql`
  fragment TaskFragment on Task {
    id
    uuid
    title
    description
    status
    priority
    dueDate
    project {
      id
      name
      description
      status
    }
    assignedUser {
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

// Pagination Info Fragment - reusable pagination data structure
export const PAGINATION_INFO_FRAGMENT = gql`
  fragment PaginationInfoFragment on PaginationInfo {
    hasNextPage
    hasPreviousPage
    totalCount
    currentPage
    totalPages
  }
`;

// Get Dashboard Tasks Query - with pagination, search, and sorting
export const GET_DASHBOARD_TASKS_QUERY = gql`
  query GetDashboardTasks($limit: Int!, $offset: Int!, $search: String, $sortBy: String, $sortOrder: String) {
    dashboardTasks(limit: $limit, offset: $offset, search: $search, sortBy: $sortBy, sortOrder: $sortOrder) {
      tasks {
        ...TaskFragment
      }
      paginationInfo {
        ...PaginationInfoFragment
      }
    }
  }
  ${TASK_FRAGMENT}
  ${PAGINATION_INFO_FRAGMENT}
`;

// Create Task Mutation
export const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($input: TaskInput!) {
    createTask(input: $input) {
      ...TaskFragment
    }
  }
  ${TASK_FRAGMENT}
`;

// Update Task Mutation
export const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask($id: ID!, $input: TaskUpdateInput!) {
    updateTask(id: $id, input: $input) {
      ...TaskFragment
    }
  }
  ${TASK_FRAGMENT}
`;

// Delete Task Mutation
export const DELETE_TASK_MUTATION = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

// Query to fetch all projects for dropdown selection
export const GET_PROJECTS_FOR_DROPDOWN_QUERY = gql`
  query GetProjectsForDropdown {
    dashboardProjects(limit: 100, offset: 0, sortBy: "id", sortOrder: "ASC") {
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

// Query to fetch all users for dropdown selection
export const GET_USERS_FOR_DROPDOWN_QUERY = gql`
  query GetUsersForDropdown {
    users(limit: 100, offset: 0, sortBy: "id", sortOrder: "ASC") {
      users {
        id
        firstName
        lastName
        email
      }
      paginationInfo {
        totalCount
      }
    }
  }
`;

// TypeScript interfaces for query variables and responses
export interface GetDashboardTasksQueryVariables {
  limit: number;
  offset: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface Task {
  id: string;
  uuid: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  project: {
    id: string;
    name: string;
    description: string;
    status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED';
  };
  assignedUser?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  isDeleted: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface GetDashboardTasksQueryResponse {
  dashboardTasks: {
    tasks: Task[];
    paginationInfo: PaginationInfo;
  };
}

export interface TaskInput {
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  projectId: string;
  assignedUserId?: string;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  projectId?: string;
  assignedUserId?: string;
}

export interface CreateTaskMutationVariables {
  input: TaskInput;
}

export interface UpdateTaskMutationVariables {
  id: string;
  input: TaskUpdateInput;
}

export interface DeleteTaskMutationVariables {
  id: string;
}

export interface CreateTaskMutationResponse {
  createTask: Task;
}

export interface UpdateTaskMutationResponse {
  updateTask: Task;
}

export interface DeleteTaskMutationResponse {
  deleteTask: boolean;
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

export interface GetUsersForDropdownQueryResponse {
  users: {
    users: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    }>;
    paginationInfo: {
      totalCount: number;
    };
  };
}
