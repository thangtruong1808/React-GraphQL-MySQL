import { gql } from '@apollo/client';

/**
 * Project GraphQL Queries
 * Queries for project data and details
 */

/**
 * Public projects query for public projects page (legacy - loads all projects)
 * Returns all projects with basic information
 */
export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      description
      status
      taskCount
      memberCount
      createdAt
      owner {
        firstName
        lastName
      }
    }
  }
`;

/**
 * Paginated projects query for infinite scroll support
 * Supports pagination and status filtering
 */
export const GET_PAGINATED_PROJECTS = gql`
  query GetPaginatedProjects($limit: Int = 12, $offset: Int = 0, $statusFilter: ProjectStatus) {
    paginatedProjects(limit: $limit, offset: $offset, statusFilter: $statusFilter) {
      projects {
        id
        name
        description
        status
        taskCount
        memberCount
        createdAt
        owner {
          firstName
          lastName
        }
      }
      paginationInfo {
        hasNextPage
        hasPreviousPage
        totalCount
        currentPage
        totalPages
      }
    }
  }
`;

/**
 * Project details query for individual project page
 * Returns comprehensive project information including tasks, members, and comments
 */
export const GET_PROJECT_DETAILS = gql`
  query GetProjectDetails($projectId: ID!) {
    project(id: $projectId) {
      id
      uuid
      name
      description
      status
      createdAt
      updatedAt
      owner {
        id
        firstName
        lastName
        email
        role
      }
      tasks {
        id
        title
        description
        status
        priority
        dueDate
        createdAt
        assignedUser {
          firstName
          lastName
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
      members {
        id
        firstName
        lastName
        email
        role
        memberRole
      }
      comments {
        id
        uuid
        content
        author {
          id
          firstName
          lastName
          email
          role
        }
        createdAt
        updatedAt
        likesCount
        isLikedByUser
        likers {
          id
          uuid
          firstName
          lastName
          email
          role
          isDeleted
          version
          createdAt
          updatedAt
        }
      }
    }
  }
`;

