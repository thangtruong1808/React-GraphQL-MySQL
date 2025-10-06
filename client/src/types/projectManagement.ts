/**
 * Project Management Types
 * TypeScript interfaces and types for project management functionality
 * Follows the pattern of other type files in the project
 */

// Project status type from GraphQL schema
export type ProjectStatus = 
  | 'PLANNING'
  | 'IN_PROGRESS'
  | 'COMPLETED';

// Project interface matching GraphQL Project type
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

// Pagination info interface
export interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// Paginated projects response interface
export interface PaginatedProjectsResponse {
  projects: Project[];
  paginationInfo: PaginationInfo;
}

// Project input for creating new projects
export interface ProjectInput {
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId?: string;
}

// Project update input for updating existing projects
export interface ProjectUpdateInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  ownerId?: string;
}

// Projects table props interface
export interface ProjectsTableProps {
  projects: Project[];
  paginationInfo: PaginationInfo;
  loading: boolean;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  currentPageSize: number;
  onSort: (sortBy: string, sortOrder: string) => void;
  currentSortBy: string;
  currentSortOrder: string;
}

// Project search input props interface
export interface ProjectSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
}

// Create project modal props interface
export interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: ProjectInput) => Promise<void>;
  loading?: boolean;
}

// Edit project modal props interface
export interface EditProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onSubmit: (projectId: string, projectData: ProjectUpdateInput) => Promise<void>;
  loading?: boolean;
}

// Delete project modal props interface
export interface DeleteProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onConfirm: (projectId: string) => Promise<void>;
  loading?: boolean;
}

// Project form data interface
export interface ProjectFormData {
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId?: string;
}

// Project management state interface
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

// Project management actions interface
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

// GraphQL query variables interface
export interface ProjectsQueryVariables {
  limit: number;
  offset: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

// GraphQL mutation variables interfaces
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

// Table column interface
export interface TableColumn {
  key: string;
  label: string;
  sortable: boolean;
}

// Pagination option interface
export interface PaginationOption {
  value: number;
  label: string;
}

// Project status option interface
export interface ProjectStatusOption {
  value: ProjectStatus;
  label: string;
}
