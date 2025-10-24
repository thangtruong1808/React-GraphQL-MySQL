import { gql } from '@apollo/client';

/**
 * Task Subscription Queries
 * GraphQL subscriptions for real-time task management
 * Provides real-time updates for task events in projects
 */

// Task Added Subscription
export const TASK_ADDED_SUBSCRIPTION = gql`
  subscription TaskAdded($projectId: ID!) {
    taskAdded(projectId: $projectId) {
      id
      uuid
      title
      description
      status
      priority
      dueDate
      isDeleted
      version
      createdAt
      updatedAt
      project {
        id
        name
      }
      assignedUser {
        id
        firstName
        lastName
        email
        role
      }
      tags {
        id
        name
        description
        title
        type
        category
      }
    }
  }
`;

// Task Updated Subscription
export const TASK_UPDATED_SUBSCRIPTION = gql`
  subscription TaskUpdated($projectId: ID!) {
    taskUpdated(projectId: $projectId) {
      id
      uuid
      title
      description
      status
      priority
      dueDate
      isDeleted
      version
      createdAt
      updatedAt
      project {
        id
        name
      }
      assignedUser {
        id
        firstName
        lastName
        email
        role
      }
      tags {
        id
        name
        description
        title
        type
        category
      }
    }
  }
`;

// Task Deleted Subscription
export const TASK_DELETED_SUBSCRIPTION = gql`
  subscription TaskDeleted($projectId: ID!) {
    taskDeleted(projectId: $projectId) {
      taskId
      projectId
      deletedAt
    }
  }
`;

// Type definitions for task subscription events
export interface TaskAddedEvent {
  taskAdded: Task;
}

export interface TaskUpdatedEvent {
  taskUpdated: Task;
}

export interface TaskDeletedEvent {
  taskDeleted: {
    taskId: string;
    projectId: string;
    deletedAt: string;
  };
}

export interface Task {
  id: string;
  uuid: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate?: string;
  projectId: string;
  assignedTo?: string;
  isDeleted: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    name: string;
  };
  assignedUser?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  tags: Array<{
    id: string;
    name: string;
    description: string;
    title?: string;
    type?: string;
    category?: string;
  }>;
}
