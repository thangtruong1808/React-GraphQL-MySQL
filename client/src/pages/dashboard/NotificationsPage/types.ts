/**
 * Types for NotificationsPage component
 * Defines all interfaces and types used in notifications page management
 */

import { Notification, NotificationInput, NotificationUpdateInput, PaginationInfo } from '../../../types/notificationManagement';

export interface NotificationsPageState {
  notifications: Notification[];
  paginationInfo: PaginationInfo;
  loading: boolean;
  searchQuery: string;
  currentPage: number;
  pageSize: number;
  createModalOpen: boolean;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  selectedNotification: Notification | null;
  error: string | null;
}

export interface UseNotificationsStateDependencies {
  initialPageSize: number;
}

export interface UseNotificationsQueriesDependencies {
  pageSize: number;
  currentPage: number;
  searchQuery: string;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  isInitializing: boolean;
  hasDashboardAccess: boolean;
  user: any;
  isAuthDataReady: boolean;
}

export interface UseNotificationsMutationsDependencies {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export interface UseNotificationsHandlersDependencies {
  state: NotificationsPageState;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  setState: React.Dispatch<React.SetStateAction<NotificationsPageState>>;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: 'ASC' | 'DESC') => void;
  refetch: (variables?: any) => Promise<any>;
  createNotificationMutation: (options: { variables: { input: NotificationInput } }) => Promise<any>;
  updateNotificationMutation: (options: { variables: { id: string; input: NotificationUpdateInput } }) => Promise<any>;
  deleteNotificationMutation: (options: { variables: { id: string } }) => Promise<any>;
  markNotificationReadMutation: (options: { variables: { id: string } }) => Promise<any>;
  markNotificationUnreadMutation: (options: { variables: { id: string } }) => Promise<any>;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  data: any;
}

export interface NotificationsHeaderProps {
  onCreateClick: () => void;
}

export interface NotificationsContentProps {
  state: NotificationsPageState;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  onSearch: (q: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSort: (newSortBy: string, newSortOrder: string) => void;
  onEdit: (notification: Notification) => void;
  onDelete: (notification: Notification) => void;
  onMarkRead: (notification: Notification) => Promise<void>;
  onMarkUnread: (notification: Notification) => Promise<void>;
}

export type { Notification, NotificationInput, NotificationUpdateInput, PaginationInfo };

