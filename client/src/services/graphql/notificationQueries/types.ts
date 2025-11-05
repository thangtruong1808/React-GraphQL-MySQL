/**
 * TypeScript Interfaces for Notification Management
 * Defines types for GraphQL queries and mutations
 */

/**
 * Notification user interface
 * Represents user information in notifications
 */
export interface NotificationUser {
  id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

/**
 * Notification interface
 * Represents a complete notification entry
 */
export interface Notification {
  id: string;
  user: NotificationUser;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Pagination info interface
 * Represents pagination information for queries
 */
export interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Get dashboard notifications query variables
 */
export interface GetDashboardNotificationsQueryVariables {
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

/**
 * Get dashboard notifications query response
 */
export interface GetDashboardNotificationsQueryResponse {
  dashboardNotifications: {
    notifications: Notification[];
    paginationInfo: PaginationInfo;
  };
}

/**
 * Create notification mutation variables
 */
export interface CreateNotificationMutationVariables {
  input: {
    message: string;
    userId: string;
  };
}

/**
 * Create notification mutation response
 */
export interface CreateNotificationMutationResponse {
  createNotification: Notification;
}

/**
 * Update notification mutation variables
 */
export interface UpdateNotificationMutationVariables {
  id: string;
  input: {
    message?: string;
    isRead?: boolean;
  };
}

/**
 * Update notification mutation response
 */
export interface UpdateNotificationMutationResponse {
  updateNotification: Notification;
}

/**
 * Delete notification mutation variables
 */
export interface DeleteNotificationMutationVariables {
  id: string;
}

/**
 * Delete notification mutation response
 */
export interface DeleteNotificationMutationResponse {
  deleteNotification: boolean;
}

/**
 * Mark notification read mutation variables
 */
export interface MarkNotificationReadMutationVariables {
  id: string;
}

/**
 * Mark notification read mutation response
 */
export interface MarkNotificationReadMutationResponse {
  markNotificationRead: Notification;
}

/**
 * Mark notification unread mutation variables
 */
export interface MarkNotificationUnreadMutationVariables {
  id: string;
}

/**
 * Mark notification unread mutation response
 */
export interface MarkNotificationUnreadMutationResponse {
  markNotificationUnread: Notification;
}

/**
 * User interface for dropdown queries
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

/**
 * Get users for dropdown response
 */
export interface GetUsersForDropdownResponse {
  users: {
    users: User[];
  };
}

/**
 * Get user unread notifications query variables
 */
export interface GetUserUnreadNotificationsQueryVariables {
  limit?: number;
}

/**
 * Get user unread notifications query response
 */
export interface GetUserUnreadNotificationsQueryResponse {
  dashboardNotifications: {
    notifications: Notification[];
    paginationInfo: PaginationInfo;
  };
}

/**
 * Get user unread notification count query response
 */
export interface GetUserUnreadNotificationCountQueryResponse {
  dashboardNotifications: {
    notifications: Notification[];
  };
}

