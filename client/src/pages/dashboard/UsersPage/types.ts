import { UserManagementState, UserDeletionCheck } from '../../../types/userManagement';

/**
 * Use Users State Dependencies
 * Dependencies for users state hook
 */
export interface UseUsersStateDependencies {
  initialPageSize: number;
}

/**
 * Use Users Queries Dependencies
 * Dependencies for users queries hook
 */
export interface UseUsersQueriesDependencies {
  pageSize: number;
  currentPage: number;
  searchQuery: string;
  sortBy: string;
  sortOrder: string;
  isInitializing: boolean;
  hasDashboardAccess: boolean;
  isAuthDataReady: boolean;
  setState: React.Dispatch<React.SetStateAction<UserManagementState>>;
}

/**
 * Use Users Handlers Dependencies
 * Dependencies for users handlers hook
 */
export interface UseUsersHandlersDependencies {
  state: UserManagementState;
  sortBy: string;
  sortOrder: string;
  setState: React.Dispatch<React.SetStateAction<UserManagementState>>;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: string) => void;
  refetch: () => Promise<any>;
  createUserMutation: any;
  updateUserMutation: any;
  deleteUserMutation: any;
  checkUserDeletion: any;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  setDeletionCheck: (check: UserDeletionCheck | null) => void;
}

