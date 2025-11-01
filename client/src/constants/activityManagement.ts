/**
 * Constants for Activity Management
 * Defines default values, configurations, and messages for activity management
 */

// Default pagination settings
export const DEFAULT_ACTIVITY_PAGINATION = {
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

// Activity type options for forms
export const ACTIVITY_TYPE_OPTIONS = [
  { value: 'USER_CREATED', label: 'User Created' },
  { value: 'USER_UPDATED', label: 'User Updated' },
  { value: 'USER_DELETED', label: 'User Deleted' },
  { value: 'PROJECT_CREATED', label: 'Project Created' },
  { value: 'PROJECT_UPDATED', label: 'Project Updated' },
  { value: 'PROJECT_DELETED', label: 'Project Deleted' },
  { value: 'TASK_CREATED', label: 'Task Created' },
  { value: 'TASK_UPDATED', label: 'Task Updated' },
  { value: 'TASK_DELETED', label: 'Task Deleted' },
];

// Activity type colors for display (using activity-specific theme variables for better dark theme readability)
export const ACTIVITY_TYPE_COLORS = {
  USER_CREATED: { color: 'var(--activity-created-text)' },
  USER_UPDATED: { color: 'var(--activity-updated-text)' },
  USER_DELETED: { color: 'var(--activity-deleted-text)' },
  PROJECT_CREATED: { color: 'var(--activity-primary-text)' },
  PROJECT_UPDATED: { color: 'var(--activity-updated-text)' },
  PROJECT_DELETED: { color: 'var(--activity-deleted-text)' },
  TASK_CREATED: { color: 'var(--activity-created-text)' },
  TASK_UPDATED: { color: 'var(--activity-updated-text)' },
  TASK_DELETED: { color: 'var(--activity-deleted-text)' },
};

// Activity type badges (using activity-specific theme variables for better dark theme readability)
export const ACTIVITY_TYPE_BADGES = {
  USER_CREATED: { backgroundColor: 'var(--activity-created-bg)', color: 'var(--activity-created-text)' },
  USER_UPDATED: { backgroundColor: 'var(--activity-updated-bg)', color: 'var(--activity-updated-text)' },
  USER_DELETED: { backgroundColor: 'var(--activity-deleted-bg)', color: 'var(--activity-deleted-text)' },
  PROJECT_CREATED: { backgroundColor: 'var(--activity-primary-bg)', color: 'var(--activity-primary-text)' },
  PROJECT_UPDATED: { backgroundColor: 'var(--activity-updated-bg)', color: 'var(--activity-updated-text)' },
  PROJECT_DELETED: { backgroundColor: 'var(--activity-deleted-bg)', color: 'var(--activity-deleted-text)' },
  TASK_CREATED: { backgroundColor: 'var(--activity-created-bg)', color: 'var(--activity-created-text)' },
  TASK_UPDATED: { backgroundColor: 'var(--activity-updated-bg)', color: 'var(--activity-updated-text)' },
  TASK_DELETED: { backgroundColor: 'var(--activity-deleted-bg)', color: 'var(--activity-deleted-text)' },
};

// Activity table column configuration
export const ACTIVITY_TABLE_COLUMNS = {
  ID: { width: 'w-16', sortable: true },
  USER: { width: 'w-32', sortable: true },
  TYPE: { width: 'w-32', sortable: true },
  ACTION: { width: 'w-48', sortable: false },
  TARGET_USER: { width: 'w-32', sortable: true },
  PROJECT: { width: 'w-32', sortable: true },
  TASK: { width: 'w-40', sortable: true },
  CREATED: { width: 'w-32', sortable: true },
  UPDATED: { width: 'w-32', sortable: true },
  ACTIONS: { width: 'w-24', sortable: false },
};

// Activity form validation rules
export const ACTIVITY_FORM_VALIDATION = {
  action: {
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  type: {
    required: true,
  },
  metadata: {
    required: false,
  },
};

// Activity limits
export const ACTIVITY_LIMITS = {
  MIN_ACTION_LENGTH: 1,
  MAX_ACTION_LENGTH: 255,
  MAX_METADATA_SIZE: 10000,
};

// Search debounce delay in milliseconds
export const ACTIVITY_SEARCH_DEBOUNCE_DELAY = 1000;

// Success messages for activity operations
export const ACTIVITY_SUCCESS_MESSAGES = {
  CREATE: 'Activity created successfully',
  UPDATE: 'Activity updated successfully',
  DELETE: 'Activity deleted successfully',
  FETCH: 'Activities loaded successfully',
};

// Error messages for activity operations
export const ACTIVITY_ERROR_MESSAGES = {
  CREATE: 'Failed to create activity',
  UPDATE: 'Failed to update activity',
  DELETE: 'Failed to delete activity',
  FETCH: 'Failed to fetch activities',
  NOT_FOUND: 'Activity not found',
  VALIDATION: 'Please check your input and try again',
  NETWORK: 'Network error. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
};
