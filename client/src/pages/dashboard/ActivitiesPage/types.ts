/**
 * Types for ActivitiesPage component
 * Defines all interfaces and types used in activities page management
 */

import { Activity, ActivityInput, ActivityUpdateInput, ActivityManagementState } from '../../../types/activityManagement';

export interface UseActivitiesStateDependencies {
  initialPageSize: number;
}

export interface UseActivitiesQueriesDependencies {
  pageSize: number;
  currentPage: number;
  searchQuery: string;
  sortBy: string;
  sortOrder: string;
  isInitializing: boolean;
  hasDashboardAccess: boolean;
  isAuthDataReady: boolean;
}

export interface UseActivitiesMutationsDependencies {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export interface UseActivitiesHandlersDependencies {
  state: ActivityManagementState;
  sortBy: string;
  sortOrder: string;
  setState: React.Dispatch<React.SetStateAction<ActivityManagementState>>;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: string) => void;
  refetch: (variables?: any) => Promise<any>;
  createActivityMutation: (options: { variables: { input: ActivityInput } }) => Promise<any>;
  updateActivityMutation: (options: { variables: { id: string; input: ActivityUpdateInput } }) => Promise<any>;
  deleteActivityMutation: (options: { variables: { id: string } }) => Promise<any>;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export interface ActivitiesHeaderProps {
  canCreate: boolean;
  onCreateClick: () => void;
}

export interface ActivitiesContentProps {
  state: ActivityManagementState;
  sortBy: string;
  sortOrder: string;
  onSearch: (query: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSort: (newSortBy: string, newSortOrder: string) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
}

export type { Activity, ActivityInput, ActivityUpdateInput, ActivityManagementState };

