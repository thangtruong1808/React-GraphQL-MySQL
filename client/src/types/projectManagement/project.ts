import { PaginationInfo } from './common';

/**
 * Project Types
 * Types and interfaces for project management
 */

/**
 * Project status type from GraphQL schema
 */
export type ProjectStatus = 
  | 'PLANNING'
  | 'IN_PROGRESS'
  | 'COMPLETED';

/**
 * Project interface matching GraphQL Project type
 */
export interface Project {
  id: string;
  uuid: string;
  name: string;
  description: string;
  status: ProjectStatus;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  isDeleted: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Paginated projects response interface
 */
export interface PaginatedProjectsResponse {
  projects: Project[];
  paginationInfo: PaginationInfo;
}

/**
 * Project input for creating new projects
 */
export interface ProjectInput {
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId?: string;
}

/**
 * Project update input for updating existing projects
 */
export interface ProjectUpdateInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  ownerId?: string;
}

/**
 * Project form data interface
 */
export interface ProjectFormData {
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId?: string;
}

/**
 * Project deletion check interface
 */
export interface ProjectDeletionCheck {
  projectName: string;
  tasksCount: number;
  commentsCount: number;
  assignedUsersCount: number;
  assignedUsersList: string;
  message: string;
}

/**
 * Project status option interface
 */
export interface ProjectStatusOption {
  value: ProjectStatus;
  label: string;
}

