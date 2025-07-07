import { gql } from '@apollo/client';

// User Queries
export const GET_USERS = gql`
  query GetUsers($limit: Int, $offset: Int) {
    users(limit: $limit, offset: $offset) {
      id
      email
      username
      firstName
      lastName
      role
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      id
      email
      username
      firstName
      lastName
      role
      createdAt
      updatedAt
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      email
      username
      firstName
      lastName
      role
      createdAt
      updatedAt
    }
  }
`;

// Project Queries
export const GET_PROJECTS = gql`
  query GetProjects($limit: Int, $offset: Int, $status: ProjectStatus) {
    projects(limit: $limit, offset: $offset, status: $status) {
      id
      name
      description
      status
      owner {
        id
        username
        email
      }
      members {
        id
        user {
          id
          username
          email
        }
        role
        joinedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROJECT_BY_ID = gql`
  query GetProjectById($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      owner {
        id
        username
        email
      }
      members {
        id
        user {
          id
          username
          email
        }
        role
        joinedAt
      }
      tasks {
        id
        title
        description
        status
        priority
        assignee {
          id
          username
        }
        dueDate
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_PROJECTS = gql`
  query GetUserProjects($userId: ID!) {
    userProjects(userId: $userId) {
      id
      name
      description
      status
      owner {
        id
        username
        email
      }
      createdAt
      updatedAt
    }
  }
`;

// Task Queries
export const GET_TASKS = gql`
  query GetTasks($limit: Int, $offset: Int, $status: TaskStatus, $projectId: ID) {
    tasks(limit: $limit, offset: $offset, status: $status, projectId: $projectId) {
      id
      title
      description
      status
      priority
      assignee {
        id
        username
        email
      }
      project {
        id
        name
      }
      dueDate
      createdAt
      updatedAt
    }
  }
`;

export const GET_TASK_BY_ID = gql`
  query GetTaskById($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      priority
      assignee {
        id
        username
        email
      }
      project {
        id
        name
        description
      }
      comments {
        id
        content
        author {
          id
          username
        }
        createdAt
        updatedAt
      }
      dueDate
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_TASKS = gql`
  query GetUserTasks($userId: ID!, $status: TaskStatus) {
    userTasks(userId: $userId, status: $status) {
      id
      title
      description
      status
      priority
      project {
        id
        name
      }
      dueDate
      createdAt
      updatedAt
    }
  }
`;

// Comment Queries
export const GET_TASK_COMMENTS = gql`
  query GetTaskComments($taskId: ID!) {
    taskComments(taskId: $taskId) {
      id
      content
      author {
        id
        username
        email
      }
      createdAt
      updatedAt
    }
  }
`; 