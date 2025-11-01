/**
 * Constants for Notification Management
 * Defines default values, configurations, and messages for notification management
 */

// Default pagination settings
export const DEFAULT_NOTIFICATION_PAGINATION = {
  limit: 10,
  offset: 0,
  sortBy: 'id',
  sortOrder: 'ASC' as const,
};

// Page size options for pagination
export const PAGE_SIZE_OPTIONS = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
];

// Notification status options
export const NOTIFICATION_STATUS_OPTIONS = [
  { value: 'all', label: 'All Notifications' },
  { value: 'unread', label: 'Unread Only' },
  { value: 'read', label: 'Read Only' },
];

// Notification status colors for display using theme variables
export const NOTIFICATION_STATUS_COLORS = {
  unread: 'var(--notification-status-unread-text)',
  read: 'var(--notification-status-read-text)',
};

// Notification status badges using theme variables
export const NOTIFICATION_STATUS_BADGES = {
  unread: {
    backgroundColor: 'var(--badge-primary-bg)',
    color: 'var(--badge-primary-text)',
  },
  read: {
    backgroundColor: 'var(--badge-neutral-bg)',
    color: 'var(--badge-neutral-text)',
  },
};

// Notification table column configuration
export const NOTIFICATION_TABLE_COLUMNS = {
  ID: { width: 'w-16', sortable: true },
  USER: { width: 'w-32', sortable: true },
  MESSAGE: { width: 'w-96', sortable: false },
  STATUS: { width: 'w-24', sortable: true },
  CREATED: { width: 'w-32', sortable: true },
  UPDATED: { width: 'w-32', sortable: true },
  ACTIONS: { width: 'w-24', sortable: false },
};

// Notification form validation rules
export const NOTIFICATION_FORM_VALIDATION = {
  message: {
    required: true,
    minLength: 1,
    maxLength: 1000,
  },
  userId: {
    required: true,
  },
};

// Notification limits
export const NOTIFICATION_LIMITS = {
  MIN_MESSAGE_LENGTH: 1,
  MAX_MESSAGE_LENGTH: 1000,
};

// Search debounce delay in milliseconds
export const NOTIFICATION_SEARCH_DEBOUNCE_DELAY = 1000;

// Success messages for notification operations
export const NOTIFICATION_SUCCESS_MESSAGES = {
  CREATE: 'Notification created successfully',
  UPDATE: 'Notification updated successfully',
  DELETE: 'Notification deleted successfully',
  MARK_READ: 'Notification marked as read',
  MARK_UNREAD: 'Notification marked as unread',
  FETCH: 'Notifications loaded successfully',
};

// Error messages for notification operations
export const NOTIFICATION_ERROR_MESSAGES = {
  CREATE: 'Failed to create notification',
  UPDATE: 'Failed to update notification',
  DELETE: 'Failed to delete notification',
  MARK_READ: 'Failed to mark notification as read',
  MARK_UNREAD: 'Failed to mark notification as unread',
  FETCH: 'Failed to fetch notifications',
  NOT_FOUND: 'Notification not found',
  VALIDATION: 'Please check your input and try again',
  NETWORK: 'Network error. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
};
