/**
 * Types for ActivityManagementPage component
 * Defines all interfaces and types used in activity management page
 */

import { Activity, ActivityInput, ActivityUpdateInput, ActivityManagementState } from '../../../types/activityManagement';

export interface UseActivityManagementStateDependencies {
  initialPageSize: number;
}

export interface UseActivityManagementQueriesDependencies {
  pageSize: number;
  currentPage: number;
  searchQuery: string;
  sortBy: string;
  sortOrder: string;
  isInitializing: boolean;
  hasDashboardAccess: boolean;
  isAuthDataReady: boolean;
}

export interface UseActivityManagementMutationsDependencies {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export interface UseActivityManagementHandlersDependencies {
  state: ActivityManagementState;
  sortBy: string;
  sortOrder: string;
  setState: React.Dispatch<React.SetStateAction<ActivityManagementState>>;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: string) => void;
  refetch: (variables?: any) => Promise<any>;
  createActivityMutation: (options: { variables: { input: ActivityInput }; refetchQueries?: any[]; awaitRefetchQueries?: boolean }) => Promise<any>;
  updateActivityMutation: (options: { variables: { id: string; input: ActivityUpdateInput }; refetchQueries?: any[]; awaitRefetchQueries?: boolean }) => Promise<any>;
  deleteActivityMutation: (options: { variables: { id: string }; refetchQueries?: any[]; awaitRefetchQueries?: boolean }) => Promise<any>;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  paginationTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

export interface ActivityManagementHeaderProps {
  canCreate: boolean;
  isLoading: boolean;
  onCreateClick: () => void;
  onRefresh: () => void;
}

export interface ActivityManagementContentProps {
  state: ActivityManagementState;
  sortBy: string;
  sortOrder: string;
  canEdit: boolean;
  canDelete: boolean;
  onSearch: (query: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSort: (field: string, order: string) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
}

export type { Activity, ActivityInput, ActivityUpdateInput, ActivityManagementState };

