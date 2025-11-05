import { Project, ProjectInput, ProjectUpdateInput } from './project';
import { ProjectMember, ProjectMemberInput, ProjectMemberRole } from './member';
import { PaginationInfo } from './common';

/**
 * State and Actions Interfaces
 * Interfaces for component state and action handlers
 */

/**
 * Project management state interface
 */
export interface ProjectManagementState {
  projects: Project[];
  paginationInfo: PaginationInfo;
  loading: boolean;
  searchQuery: string;
  currentPage: number;
  pageSize: number;
  createModalOpen: boolean;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  selectedProject: Project | null;
  error: string | null;
}

/**
 * Project management actions interface
 */
export interface ProjectManagementActions {
  fetchProjects: (page?: number, pageSize?: number, search?: string) => Promise<void>;
  createProject: (projectData: ProjectInput) => Promise<void>;
  updateProject: (projectId: string, projectData: ProjectUpdateInput) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setPageSize: (pageSize: number) => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (project: Project) => void;
  closeEditModal: () => void;
  openDeleteModal: (project: Project) => void;
  closeDeleteModal: () => void;
  clearError: () => void;
}

/**
 * Project member management state interface
 */
export interface ProjectMemberManagementState {
  members: ProjectMember[];
  paginationInfo: PaginationInfo;
  loading: boolean;
  searchQuery: string;
  currentPage: number;
  pageSize: number;
  addModalOpen: boolean;
  removeModalOpen: boolean;
  updateRoleModalOpen: boolean;
  selectedMember: ProjectMember | null;
  error: string | null;
}

/**
 * Project member management actions interface
 */
export interface ProjectMemberManagementActions {
  fetchMembers: (projectId: string, page?: number, pageSize?: number, search?: string) => Promise<void>;
  addMember: (input: ProjectMemberInput) => Promise<void>;
  updateMemberRole: (projectId: string, userId: string, role: ProjectMemberRole) => Promise<void>;
  removeMember: (projectId: string, userId: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setPageSize: (pageSize: number) => void;
  openAddModal: () => void;
  closeAddModal: () => void;
  openRemoveModal: (member: ProjectMember) => void;
  closeRemoveModal: () => void;
  openUpdateRoleModal: (member: ProjectMember) => void;
  closeUpdateRoleModal: () => void;
  clearError: () => void;
}

