/**
 * User Management Types
 * TypeScript interfaces and types for user management functionality
 * Follows the pattern of other type files in the project
 */

// User role type from GraphQL schema
export type UserRole = 
  | 'ADMIN'
  | 'Project Manager'
  | 'Software Architect'
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Full-Stack Developer'
  | 'DevOps Engineer'
  | 'QA Engineer'
  | 'QC Engineer'
  | 'UX/UI Designer'
  | 'Business Analyst'
  | 'Database Administrator'
  | 'Technical Writer'
  | 'Support Engineer';

// User interface matching GraphQL User type
export interface User {
  id: string;
  uuid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
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

// Paginated users response interface
export interface PaginatedUsersResponse {
  users: User[];
  paginationInfo: PaginationInfo;
}

// User input for creating new users
export interface UserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// User update input for updating existing users
export interface UserUpdateInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

// Users table props interface
export interface UsersTableProps {
  users: User[];
  paginationInfo: PaginationInfo;
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  currentPageSize: number;
  onSort: (sortBy: string, sortOrder: string) => void;
  currentSortBy: string;
  currentSortOrder: string;
}

// User search input props interface
export interface UserSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
}

// Create user modal props interface
export interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: UserInput) => Promise<void>;
  loading?: boolean;
}

// Edit user modal props interface
export interface EditUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSubmit: (userId: string, userData: UserUpdateInput) => Promise<void>;
  loading?: boolean;
}

// User deletion check response interface
export interface UserDeletionCheck {
  canDelete: boolean;
  ownedProjectsCount: number;
  assignedTasksCount: number;
  message: string | null;
}

// Delete user modal props interface
export interface DeleteUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: (userId: string) => Promise<void>;
  loading?: boolean;
  deletionCheck?: UserDeletionCheck | null;
}

// User form data interface
export interface UserFormData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// User management state interface
export interface UserManagementState {
  users: User[];
  paginationInfo: PaginationInfo;
  loading: boolean;
  searchQuery: string;
  currentPage: number;
  pageSize: number;
  createModalOpen: boolean;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  selectedUser: User | null;
  error: string | null;
}

// User management actions interface
export interface UserManagementActions {
  fetchUsers: (page?: number, pageSize?: number, search?: string) => Promise<void>;
  createUser: (userData: UserInput) => Promise<void>;
  updateUser: (userId: string, userData: UserUpdateInput) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setPageSize: (pageSize: number) => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (user: User) => void;
  closeEditModal: () => void;
  openDeleteModal: (user: User) => void;
  closeDeleteModal: () => void;
  clearError: () => void;
}

// GraphQL query variables interface
export interface UsersQueryVariables {
  limit: number;
  offset: number;
  search?: string;
}

// GraphQL mutation variables interfaces
export interface CreateUserMutationVariables {
  input: UserInput;
}

export interface UpdateUserMutationVariables {
  id: string;
  input: UserUpdateInput;
}

export interface DeleteUserMutationVariables {
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

// User role option interface
export interface UserRoleOption {
  value: UserRole;
  label: string;
}
