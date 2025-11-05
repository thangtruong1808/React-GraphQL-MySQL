import { gql } from '@apollo/client';

/**
 * Team GraphQL Queries
 * Queries for team members and statistics
 */

/**
 * Team members query for public team page
 * Returns all team members with basic information
 */
export const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers {
    teamMembers {
      id
      uuid
      firstName
      lastName
      role
      projectCount
      taskCount
      joinDate
      createdAt
    }
  }
`;

/**
 * Paginated team members query for load more functionality with role filtering
 * Supports pagination and role-based filtering
 */
export const GET_PAGINATED_TEAM_MEMBERS = gql`
  query GetPaginatedTeamMembers($limit: Int = 12, $offset: Int = 0, $roleFilter: String) {
    paginatedTeamMembers(limit: $limit, offset: $offset, roleFilter: $roleFilter) {
      teamMembers {
        id
        uuid
        firstName
        lastName
        role
        projectCount
        taskCount
        joinDate
        createdAt
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
 * Team statistics query for database-wide role counts
 * Returns comprehensive role distribution statistics
 */
export const GET_TEAM_STATS = gql`
  query GetTeamStats {
    teamStats {
      totalMembers
      administrators
      projectManagers
      developers
      architects
      specialists
      frontendDevelopers
      backendDevelopers
      fullStackDevelopers
      softwareArchitects
      devopsEngineers
      databaseAdministrators
      qaEngineers
      qcEngineers
      uxUiDesigners
      businessAnalysts
      technicalWriters
      supportEngineers
    }
  }
`;

