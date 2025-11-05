import { gql } from '@apollo/client';

/**
 * Search GraphQL Queries
 * Queries for searching members, projects, and tasks
 * All parameters are optional - search works independently
 */

/**
 * Search members query
 * Searches users with optional role filtering
 */
export const SEARCH_MEMBERS = gql`
  query SearchMembers($query: String, $roleFilter: [String!]) {
    searchMembers(query: $query, roleFilter: $roleFilter) {
      id
      uuid
      firstName
      lastName
      email
      role
      ownedProjects {
        id
        uuid
        name
        description
        status
        isDeleted
        tasks {
          id
          uuid
          title
          description
          status
          priority
          isDeleted
          assignedUser {
            id
            uuid
            firstName
            lastName
            email
            role
          }
        }
      }
      assignedTasks {
        id
        uuid
        title
        description
        status
        priority
        isDeleted
        project {
          id
          uuid
          name
          description
          status
          isDeleted
        }
      }
    }
  }
`;

/**
 * Search projects query
 * Searches projects with optional status filtering
 */
export const SEARCH_PROJECTS = gql`
  query SearchProjects($statusFilter: [ProjectStatus!]) {
    searchProjects(statusFilter: $statusFilter) {
      id
      uuid
      name
      description
      status
      owner {
        id
        uuid
        firstName
        lastName
        email
        role
      }
      tasks {
        id
        uuid
        title
        description
        status
        priority
        isDeleted
        assignedUser {
          id
          uuid
          firstName
          lastName
          email
          role
        }
      }
    }
  }
`;

/**
 * Search tasks query
 * Searches tasks with optional status filtering
 */
export const SEARCH_TASKS = gql`
  query SearchTasks($taskStatusFilter: [TaskStatus!]) {
    searchTasks(taskStatusFilter: $taskStatusFilter) {
      id
      uuid
      title
      description
      status
      priority
      project {
        id
        uuid
        name
        description
        status
        isDeleted
        owner {
          id
          uuid
          firstName
          lastName
          email
          role
        }
      }
      assignedUser {
        id
        uuid
        firstName
        lastName
        email
        role
      }
    }
  }
`;

