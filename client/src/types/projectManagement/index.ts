/**
 * Project Management Types Module
 * Central export point for all project management types
 */

// Export common types
export type { PaginationInfo, TableColumn, PaginationOption } from './common';

// Export project types
export type {
  ProjectStatus,
  Project,
  PaginatedProjectsResponse,
  ProjectInput,
  ProjectUpdateInput,
  ProjectFormData,
  ProjectDeletionCheck,
  ProjectStatusOption,
} from './project';

// Export member types
export type {
  ProjectMemberRole,
  ProjectMemberType,
  ProjectMember,
  PaginatedProjectMembersResponse,
  AvailableUsersResponse,
  ProjectMemberInput,
  ProjectMemberRoleOption,
} from './member';

// Export component props
export type {
  ProjectsTableProps,
  ProjectSearchInputProps,
  CreateProjectModalProps,
  EditProjectModalProps,
  DeleteProjectModalProps,
  ProjectMembersTableProps,
  AddMemberModalProps,
  RemoveMemberModalProps,
  UpdateMemberRoleModalProps,
} from './props';

// Export state and actions
export type {
  ProjectManagementState,
  ProjectManagementActions,
  ProjectMemberManagementState,
  ProjectMemberManagementActions,
} from './state';

// Export GraphQL types
export type {
  ProjectsQueryVariables,
  CreateProjectMutationVariables,
  UpdateProjectMutationVariables,
  DeleteProjectMutationVariables,
} from './graphql';

