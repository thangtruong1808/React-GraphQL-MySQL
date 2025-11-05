import { Project, ProjectInput, ProjectUpdateInput, ProjectDeletionCheck, ProjectStatus } from './project';
import { ProjectMember, ProjectMemberInput, ProjectMemberRole } from './member';
import { PaginationInfo } from './common';

/**
 * Component Props Interfaces
 * Props interfaces for project and member management components
 */

/**
 * Projects table props interface
 */
export interface ProjectsTableProps {
  projects: Project[];
  paginationInfo: PaginationInfo;
  loading: boolean;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onViewMembers?: (project: Project) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  currentPageSize: number;
  onSort: (sortBy: string, sortOrder: string) => void;
  currentSortBy: string;
  currentSortOrder: string;
}

/**
 * Project search input props interface
 */
export interface ProjectSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
}

/**
 * Create project modal props interface
 */
export interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: ProjectInput) => Promise<void>;
  loading?: boolean;
}

/**
 * Edit project modal props interface
 */
export interface EditProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onSubmit: (projectId: string, projectData: ProjectUpdateInput) => Promise<void>;
  loading?: boolean;
}

/**
 * Delete project modal props interface
 */
export interface DeleteProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onConfirm: (projectId: string) => Promise<void>;
  loading?: boolean;
  deletionCheck?: ProjectDeletionCheck | null;
}

/**
 * Project members table props interface
 */
export interface ProjectMembersTableProps {
  members: ProjectMember[];
  paginationInfo: PaginationInfo;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  currentPageSize: number;
  onSort: (sortBy: string, sortOrder: string) => void;
  currentSortBy: string;
  currentSortOrder: string;
  onAddMember: () => void;
  onRemoveMember: (member: ProjectMember) => void;
  onUpdateRole: (member: ProjectMember) => void;
}

/**
 * Add member modal props interface
 */
export interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (variables: ProjectMemberInput) => Promise<void>;
  projectId: string;
  projectName: string;
  loading?: boolean;
}

/**
 * Remove member modal props interface
 */
export interface RemoveMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  member: ProjectMember | null;
  loading?: boolean;
}

/**
 * Update member role modal props interface
 */
export interface UpdateMemberRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectId: string, userId: string, role: ProjectMemberRole) => Promise<void>;
  member: ProjectMember | null;
  loading?: boolean;
}

