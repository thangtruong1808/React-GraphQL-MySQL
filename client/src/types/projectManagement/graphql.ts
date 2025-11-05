import { ProjectInput, ProjectUpdateInput } from './project';

/**
 * GraphQL Types
 * Types for GraphQL query and mutation variables
 */

/**
 * GraphQL query variables interface
 */
export interface ProjectsQueryVariables {
  limit: number;
  offset: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

/**
 * GraphQL mutation variables interfaces
 */
export interface CreateProjectMutationVariables {
  input: ProjectInput;
}

export interface UpdateProjectMutationVariables {
  id: string;
  input: ProjectUpdateInput;
}

export interface DeleteProjectMutationVariables {
  id: string;
}

