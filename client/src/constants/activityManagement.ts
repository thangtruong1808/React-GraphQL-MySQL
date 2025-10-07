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
  { value: 'TASK_CREATED', label: 'Task Created' },
  { value: 'TASK_UPDATED', label: 'Task Updated' },
  { value: 'TASK_ASSIGNED', label: 'Task Assigned' },
  { value: 'COMMENT_ADDED', label: 'Comment Added' },
  { value: 'PROJECT_CREATED', label: 'Project Created' },
  { value: 'PROJECT_COMPLETED', label: 'Project Completed' },
  { value: 'USER_MENTIONED', label: 'User Mentioned' },
];

// Activity type colors for display
export const ACTIVITY_TYPE_COLORS = {
  TASK_CREATED: 'text-green-600',
  TASK_UPDATED: 'text-blue-600',
  TASK_ASSIGNED: 'text-purple-600',
  COMMENT_ADDED: 'text-yellow-600',
  PROJECT_CREATED: 'text-indigo-600',
  PROJECT_COMPLETED: 'text-emerald-600',
  USER_MENTIONED: 'text-pink-600',
};

// Activity type badges
export const ACTIVITY_TYPE_BADGES = {
  TASK_CREATED: 'bg-green-100 text-green-800',
  TASK_UPDATED: 'bg-blue-100 text-blue-800',
  TASK_ASSIGNED: 'bg-purple-100 text-purple-800',
  COMMENT_ADDED: 'bg-yellow-100 text-yellow-800',
  PROJECT_CREATED: 'bg-indigo-100 text-indigo-800',
  PROJECT_COMPLETED: 'bg-emerald-100 text-emerald-800',
  USER_MENTIONED: 'bg-pink-100 text-pink-800',
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
