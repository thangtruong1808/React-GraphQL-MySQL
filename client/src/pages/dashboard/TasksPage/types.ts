import { Task, TaskManagementState } from '../../../types/taskManagement';

/**
 * Use Tasks State Dependencies
 * Dependencies for tasks state hook
 */
export interface UseTasksStateDependencies {
  initialPageSize: number;
}

/**
 * Use Tasks Queries Dependencies
 * Dependencies for tasks queries hook
 */
export interface UseTasksQueriesDependencies {
  pageSize: number;
  currentPage: number;
  searchQuery: string;
  sortBy: string;
  sortOrder: string;
  isInitializing: boolean;
  hasDashboardAccess: boolean;
  isAuthDataReady: boolean;
  setState: React.Dispatch<React.SetStateAction<TaskManagementState>>;
}

/**
 * Use Tasks Handlers Dependencies
 * Dependencies for tasks handlers hook
 */
export interface UseTasksHandlersDependencies {
  state: TaskManagementState;
  sortBy: string;
  sortOrder: string;
  setState: React.Dispatch<React.SetStateAction<TaskManagementState>>;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: string) => void;
  refetch: () => Promise<any>;
  createTaskMutation: any;
  updateTaskMutation: any;
  deleteTaskMutation: any;
  refetchDeletion: (variables: { taskId: string }) => Promise<any>;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  paginationTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

