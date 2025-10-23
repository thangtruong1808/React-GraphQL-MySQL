/**
 * Task Management TypeScript Types
 * Defines interfaces and types for task management functionality
 */

// Task Status Enum
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

// Task Priority Enum
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

// Project Status Enum (for task project reference)
export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED';

// Tag Interface - matches GraphQL Tag type
export interface Tag {
  id: string;
  name: string;
  description: string;
  title?: string;
  type?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

// Task Interface - matches GraphQL Task type
export interface Task {
  id: string;
  uuid: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  project: {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
  };
  assignedUser?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  tags: Tag[];
  isDeleted: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

// Task Input Interface - for creating new tasks
export interface TaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  projectId: string;
  assignedUserId?: string;
  tagIds?: string[];
}

// Task Update Input Interface - for updating existing tasks
export interface TaskUpdateInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  projectId?: string;
  assignedUserId?: string;
  tagIds?: string[];
}

// Pagination Info Interface
export interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// Task Management State Interface - for TasksPage component
export interface TaskManagementState {
  tasks: Task[];
  paginationInfo: PaginationInfo;
  loading: boolean;
  searchQuery: string;
  currentPage: number;
  pageSize: number;
  createModalOpen: boolean;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  selectedTask: Task | null;
  error: string | null;
}

// Tasks Table Props Interface
export interface TasksTableProps {
  tasks: Task[];
  paginationInfo: PaginationInfo;
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  currentPageSize: number;
  onSort: (sortBy: string, sortOrder: string) => void;
  currentSortBy: string;
  currentSortOrder: string;
}

// Task Search Input Props Interface
export interface TaskSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
}

// Create Task Modal Props Interface
export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskInput) => Promise<void>;
  loading: boolean;
}

// Edit Task Modal Props Interface
export interface EditTaskModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onSubmit: (taskId: string, taskData: TaskUpdateInput) => Promise<void>;
  loading: boolean;
}

// Delete Task Modal Props Interface
export interface DeleteTaskModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onConfirm: (taskId: string) => Promise<void>;
  loading: boolean;
  deletionCheck?: {
    taskTitle: string;
    projectName: string;
    commentsCount: number;
    assignedUserName?: string | null;
    assignedUserEmail?: string | null;
    message: string;
  } | null;
}
