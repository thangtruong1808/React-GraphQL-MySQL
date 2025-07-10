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

// Mutation for user registration
export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      refreshToken
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

// User Mutations
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      firstName
      lastName
      role
      updatedAt
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

// Project Mutations
export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      description
      status
      owner {
        id
        firstName
        lastName
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      name
      description
      status
      updatedAt
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;

export const ADD_PROJECT_MEMBER = gql`
  mutation AddProjectMember($projectId: ID!, $input: AddProjectMemberInput!) {
    addProjectMember(projectId: $projectId, input: $input) {
      id
      user {
        id
        firstName
        lastName
        email
      }
      role
      joinedAt
    }
  }
`;

export const REMOVE_PROJECT_MEMBER = gql`
  mutation RemoveProjectMember($projectId: ID!, $userId: ID!) {
    removeProjectMember(projectId: $projectId, userId: $userId)
  }
`;

export const UPDATE_PROJECT_MEMBER_ROLE = gql`
  mutation UpdateProjectMemberRole($projectId: ID!, $userId: ID!, $role: ProjectMemberRole!) {
    updateProjectMemberRole(projectId: $projectId, userId: $userId, role: $role) {
      id
      role
    }
  }
`;

// Task Mutations
export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      priority
      assignee {
        id
        firstName
        lastName
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

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      description
      status
      priority
      assignee {
        id
        firstName
        lastName
      }
      dueDate
      updatedAt
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

export const ASSIGN_TASK = gql`
  mutation AssignTask($taskId: ID!, $userId: ID!) {
    assignTask(taskId: $taskId, userId: $userId) {
      id
      assignee {
        id
        firstName
        lastName
      }
    }
  }
`;

export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($taskId: ID!, $status: TaskStatus!) {
    updateTaskStatus(taskId: $taskId, status: $status) {
      id
      status
      updatedAt
    }
  }
`;

// Comment Mutations
export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
      author {
        id
        username
      }
      task {
        id
        title
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: ID!, $input: UpdateCommentInput!) {
    updateComment(id: $id, input: $input) {
      id
      content
      updatedAt
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`; 