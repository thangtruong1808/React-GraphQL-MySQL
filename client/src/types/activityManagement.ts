/**
 * TypeScript types for Activity Management
 * Defines interfaces and types for activity management functionality
 */

// Activity type enum
export type ActivityType = 
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_ASSIGNED'
  | 'COMMENT_ADDED'
  | 'PROJECT_CREATED'
  | 'PROJECT_COMPLETED'
  | 'USER_MENTIONED';

// User interface for activity relationships
export interface User {
  id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

// Project interface for activity relationships
export interface Project {
  id: string;
  uuid: string;
  name: string;
}

// Task interface for activity relationships
export interface Task {
  id: string;
  uuid: string;
  title: string;
  project: Project;
}

// Activity interface
export interface Activity {
  id: string;
  uuid: string;
  user: User;
  targetUser?: User;
  project?: Project;
  task?: Task;
  action: string;
  type: ActivityType;
  metadata?: any;
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

// Paginated activities response
export interface PaginatedActivitiesResponse {
  activities: Activity[];
  paginationInfo: PaginationInfo;
}

// Activity input for creating activities
export interface ActivityInput {
  action: string;
  type: ActivityType;
  targetUserId?: string;
  projectId?: string;
  taskId?: string;
  metadata?: any;
}

// Activity update input
export interface ActivityUpdateInput {
  action?: string;
  type?: ActivityType;
  metadata?: any;
}

// Activity table props
export interface ActivitiesTableProps {
  activities: Activity[];
  loading: boolean;
  paginationInfo: PaginationInfo;
  currentPage: number;
  currentPageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSort: (sortBy: string, sortOrder: string) => void;
  currentSortBy: string;
  currentSortOrder: string;
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
}

// Activity search input props
export interface ActivitySearchInputProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  loading?: boolean;
}

// Create activity modal props
export interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (activity: ActivityInput) => Promise<void>;
  loading?: boolean;
}

// Edit activity modal props
export interface EditActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, activity: ActivityUpdateInput) => Promise<void>;
  activity: Activity | null;
  loading?: boolean;
}

// Delete activity modal props
export interface DeleteActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
  activity: Activity | null;
  loading?: boolean;
}

// Activity form data
export interface ActivityFormData {
  action: string;
  type: ActivityType;
  targetUserId?: string;
  projectId?: string;
  taskId?: string;
  metadata?: any;
}

// Activity management state
export interface ActivityManagementState {
  activities: Activity[];
  paginationInfo: PaginationInfo;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  selectedActivity: Activity | null;
}

// Activity management actions
export interface ActivityManagementActions {
  setActivities: (activities: Activity[]) => void;
  setPaginationInfo: (paginationInfo: PaginationInfo) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedActivity: (activity: Activity | null) => void;
}
