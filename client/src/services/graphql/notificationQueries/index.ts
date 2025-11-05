/**
 * Notification Queries Module
 * Central export point for all notification-related GraphQL operations
 */

// Export fragments
export { NOTIFICATION_FRAGMENT, PAGINATION_INFO_FRAGMENT } from './fragments';

// Export queries
export {
  GET_DASHBOARD_NOTIFICATIONS_QUERY,
  GET_USER_UNREAD_NOTIFICATIONS_QUERY,
  GET_USER_UNREAD_NOTIFICATION_COUNT_QUERY,
  GET_USERS_FOR_DROPDOWN_QUERY,
} from './queries';

// Export mutations
export {
  CREATE_NOTIFICATION_MUTATION,
  UPDATE_NOTIFICATION_MUTATION,
  DELETE_NOTIFICATION_MUTATION,
  MARK_NOTIFICATION_READ_MUTATION,
  MARK_NOTIFICATION_UNREAD_MUTATION,
  MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION,
  MARK_ALL_NOTIFICATIONS_AS_UNREAD_MUTATION,
  DELETE_ALL_READ_NOTIFICATIONS_MUTATION,
  DELETE_ALL_UNREAD_NOTIFICATIONS_MUTATION,
} from './mutations';

// Export types
export type {
  NotificationUser,
  Notification,
  PaginationInfo,
  GetDashboardNotificationsQueryVariables,
  GetDashboardNotificationsQueryResponse,
  CreateNotificationMutationVariables,
  CreateNotificationMutationResponse,
  UpdateNotificationMutationVariables,
  UpdateNotificationMutationResponse,
  DeleteNotificationMutationVariables,
  DeleteNotificationMutationResponse,
  MarkNotificationReadMutationVariables,
  MarkNotificationReadMutationResponse,
  MarkNotificationUnreadMutationVariables,
  MarkNotificationUnreadMutationResponse,
  User,
  GetUsersForDropdownResponse,
  GetUserUnreadNotificationsQueryVariables,
  GetUserUnreadNotificationsQueryResponse,
  GetUserUnreadNotificationCountQueryResponse,
} from './types';

