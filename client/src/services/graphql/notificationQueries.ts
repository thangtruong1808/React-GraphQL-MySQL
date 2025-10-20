import { gql } from '@apollo/client';

/**
 * GraphQL Queries and Mutations for Notification Management
 * Provides CRUD operations for notifications in the dashboard
 */

// Fragment for notification data
export const NOTIFICATION_FRAGMENT = gql`
  fragment NotificationFragment on Notification {
    id
    user {
      id
      uuid
      firstName
      lastName
      email
      role
    }
    message
    isRead
    createdAt
    updatedAt
  }
`;

// Fragment for pagination info
export const PAGINATION_INFO_FRAGMENT = gql`
  fragment PaginationInfoFragment on PaginationInfo {
    hasNextPage
    hasPreviousPage
    totalCount
    currentPage
    totalPages
  }
`;

// Query to get dashboard notifications with pagination, search, and sorting
export const GET_DASHBOARD_NOTIFICATIONS_QUERY = gql`
  ${NOTIFICATION_FRAGMENT}
  ${PAGINATION_INFO_FRAGMENT}
  query GetDashboardNotifications(
    $limit: Int
    $offset: Int
    $search: String
    $sortBy: String
    $sortOrder: String
  ) {
    dashboardNotifications(
      limit: $limit
      offset: $offset
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      notifications {
        ...NotificationFragment
      }
      paginationInfo {
        ...PaginationInfoFragment
      }
    }
  }
`;

// Mutation to create a new notification
export const CREATE_NOTIFICATION_MUTATION = gql`
  ${NOTIFICATION_FRAGMENT}
  mutation CreateNotification($input: NotificationInput!) {
    createNotification(input: $input) {
      ...NotificationFragment
    }
  }
`;

// Mutation to update an existing notification
export const UPDATE_NOTIFICATION_MUTATION = gql`
  ${NOTIFICATION_FRAGMENT}
  mutation UpdateNotification($id: ID!, $input: NotificationUpdateInput!) {
    updateNotification(id: $id, input: $input) {
      ...NotificationFragment
    }
  }
`;

// Mutation to delete a notification
export const DELETE_NOTIFICATION_MUTATION = gql`
  mutation DeleteNotification($id: ID!) {
    deleteNotification(id: $id)
  }
`;

// Mutation to mark notification as read
export const MARK_NOTIFICATION_READ_MUTATION = gql`
  ${NOTIFICATION_FRAGMENT}
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) {
      ...NotificationFragment
    }
  }
`;

// Mutation to mark notification as unread
export const MARK_NOTIFICATION_UNREAD_MUTATION = gql`
  ${NOTIFICATION_FRAGMENT}
  mutation MarkNotificationUnread($id: ID!) {
    markNotificationUnread(id: $id) {
      ...NotificationFragment
    }
  }
`;

// Mutation to mark all notifications as read
export const MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead {
      success
      updatedCount
    }
  }
`;

// Mutation to mark all notifications as unread
export const MARK_ALL_NOTIFICATIONS_AS_UNREAD_MUTATION = gql`
  mutation MarkAllNotificationsAsUnread {
    markAllNotificationsAsUnread {
      success
      updatedCount
    }
  }
`;

// Query to fetch users for dropdown selection
export const GET_USERS_FOR_DROPDOWN_QUERY = gql`
  query GetUsersForDropdown {
    users(limit: 100, offset: 0, sortBy: "firstName", sortOrder: "ASC") {
      users {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

// Query to get user's unread notifications for navbar
export const GET_USER_UNREAD_NOTIFICATIONS_QUERY = gql`
  ${NOTIFICATION_FRAGMENT}
  ${PAGINATION_INFO_FRAGMENT}
  query GetUserUnreadNotifications($limit: Int = 50) {
    dashboardNotifications(limit: $limit, offset: 0, sortBy: "createdAt", sortOrder: "DESC") {
      notifications {
        ...NotificationFragment
      }
      paginationInfo {
        ...PaginationInfoFragment
      }
    }
  }
`;

// Query to get user's unread notification count
export const GET_USER_UNREAD_NOTIFICATION_COUNT_QUERY = gql`
  ${NOTIFICATION_FRAGMENT}
  query GetUserUnreadNotificationCount {
    dashboardNotifications(limit: 100, offset: 0, sortBy: "createdAt", sortOrder: "DESC") {
      notifications {
        ...NotificationFragment
      }
    }
  }
`;

// TypeScript interfaces for GraphQL operations
export interface GetDashboardNotificationsQueryVariables {
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface GetDashboardNotificationsQueryResponse {
  dashboardNotifications: {
    notifications: Array<{
      id: string;
      user: {
        id: string;
        uuid: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
      };
      message: string;
      isRead: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
    paginationInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      totalCount: number;
      currentPage: number;
      totalPages: number;
    };
  };
}

export interface CreateNotificationMutationVariables {
  input: {
    message: string;
    userId: string;
  };
}

export interface CreateNotificationMutationResponse {
  createNotification: {
    id: string;
    user: {
      id: string;
      uuid: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
    message: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdateNotificationMutationVariables {
  id: string;
  input: {
    message?: string;
    isRead?: boolean;
  };
}

export interface UpdateNotificationMutationResponse {
  updateNotification: {
    id: string;
    user: {
      id: string;
      uuid: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
    message: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface DeleteNotificationMutationVariables {
  id: string;
}

export interface DeleteNotificationMutationResponse {
  deleteNotification: boolean;
}

export interface MarkNotificationReadMutationVariables {
  id: string;
}

export interface MarkNotificationReadMutationResponse {
  markNotificationRead: {
    id: string;
    user: {
      id: string;
      uuid: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
    message: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface MarkNotificationUnreadMutationVariables {
  id: string;
}

export interface MarkNotificationUnreadMutationResponse {
  markNotificationUnread: {
    id: string;
    user: {
      id: string;
      uuid: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
    message: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface GetUsersForDropdownResponse {
  users: {
    users: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    }>;
  };
}

export interface GetUserUnreadNotificationsQueryVariables {
  limit?: number;
}

export interface GetUserUnreadNotificationsQueryResponse {
  dashboardNotifications: {
    notifications: Array<{
      id: string;
      user: {
        id: string;
        uuid: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
      };
      message: string;
      isRead: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
    paginationInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      totalCount: number;
      currentPage: number;
      totalPages: number;
    };
  };
}

export interface GetUserUnreadNotificationCountQueryResponse {
  dashboardNotifications: {
    notifications: Array<{
      id: string;
      user: {
        id: string;
        uuid: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
      };
      message: string;
      isRead: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
  };
}
