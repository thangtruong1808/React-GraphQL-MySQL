import { PaginationInfo } from './common';

/**
 * Project Member Types
 * Types and interfaces for project member management
 */

/**
 * Project member role type
 */
export type ProjectMemberRole = 'VIEWER' | 'EDITOR' | 'OWNER';

/**
 * Project member type for different types of project involvement
 */
export type ProjectMemberType = 'OWNER' | 'EDITOR' | 'VIEWER' | 'ASSIGNEE';

/**
 * Project member interface matching GraphQL ProjectMember type
 * Now includes Owner, Project Members, and Task Assignees for consistency
 */
export interface ProjectMember {
  projectId: string;
  userId: string;
  role: ProjectMemberRole;
  memberType: ProjectMemberType;
  createdAt: string | null;
  updatedAt: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  project: {
    id: string;
    name: string;
  };
}

/**
 * Paginated project members response interface
 */
export interface PaginatedProjectMembersResponse {
  members: ProjectMember[];
  paginationInfo: PaginationInfo;
}

/**
 * Available users response interface
 */
export interface AvailableUsersResponse {
  users: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }>;
  paginationInfo: {
    totalCount: number;
  };
}

/**
 * Project member input for adding new members
 */
export interface ProjectMemberInput {
  projectId: string;
  userId: string;
  role: ProjectMemberRole;
}

/**
 * Project member role option interface
 */
export interface ProjectMemberRoleOption {
  value: ProjectMemberRole;
  label: string;
  description: string;
}

