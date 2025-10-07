/**
 * Constants for Comment Management
 * Defines default values, configurations, and messages for comment management
 */

// Default pagination settings
export const DEFAULT_COMMENTS_PAGINATION = {
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

// Sort options for comments
export const COMMENT_SORT_OPTIONS = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'updatedAt', label: 'Updated Date' },
  { value: 'content', label: 'Content' },
  { value: 'likesCount', label: 'Likes Count' },
];

// Comment priority colors based on likes count
export const COMMENT_PRIORITY_COLORS = {
  low: 'text-gray-500',
  medium: 'text-blue-500',
  high: 'text-red-500',
};

// Comment status colors
export const COMMENT_STATUS_COLORS = {
  active: 'text-green-600',
  deleted: 'text-red-600',
};

// Success messages for comment operations
export const COMMENT_SUCCESS_MESSAGES = {
  CREATE: 'Comment created successfully',
  UPDATE: 'Comment updated successfully',
  DELETE: 'Comment deleted successfully',
  LIKE: 'Comment liked successfully',
  UNLIKE: 'Comment unliked successfully',
};

// Error messages for comment operations
export const COMMENT_ERROR_MESSAGES = {
  CREATE: 'Failed to create comment',
  UPDATE: 'Failed to update comment',
  DELETE: 'Failed to delete comment',
  FETCH: 'Failed to fetch comments',
  LIKE: 'Failed to like comment',
  UNLIKE: 'Failed to unlike comment',
  VALIDATION: {
    CONTENT_REQUIRED: 'Comment content is required',
    CONTENT_TOO_SHORT: 'Comment content must be at least 3 characters',
    CONTENT_TOO_LONG: 'Comment content must be less than 1000 characters',
    TASK_REQUIRED: 'Task selection is required',
  },
};

// Comment content limits
export const COMMENT_LIMITS = {
  MIN_CONTENT_LENGTH: 3,
  MAX_CONTENT_LENGTH: 1000,
  MAX_DISPLAY_LENGTH: 100,
};

// Comment priority thresholds based on likes count
export const COMMENT_PRIORITY_THRESHOLDS = {
  LOW: 0,
  MEDIUM: 5,
  HIGH: 10,
};

// Comment display settings
export const COMMENT_DISPLAY_SETTINGS = {
  TRUNCATE_LENGTH: 100,
  SHOW_FULL_CONTENT_THRESHOLD: 200,
  MAX_LINES_IN_TABLE: 3,
};

// Comment moderation settings
export const COMMENT_MODERATION_SETTINGS = {
  AUTO_DELETE_THRESHOLD: -10, // Auto-delete if likes go below this
  FLAG_THRESHOLD: 5, // Flag for review if reports exceed this
  MAX_REPORTS_PER_USER: 3, // Max reports a user can make
};

// Comment search settings
export const COMMENT_SEARCH_SETTINGS = {
  DEBOUNCE_DELAY: 1000, // ms
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_RESULTS: 100,
};

// Comment table column configurations
export const COMMENT_TABLE_COLUMNS = {
  ID: { width: 'w-16', sortable: true },
  CONTENT: { width: 'w-64', sortable: false },
  AUTHOR: { width: 'w-32', sortable: true },
  TASK: { width: 'w-40', sortable: true },
  PROJECT: { width: 'w-32', sortable: true },
  LIKES: { width: 'w-20', sortable: true },
  CREATED: { width: 'w-32', sortable: true },
  UPDATED: { width: 'w-32', sortable: true },
  ACTIONS: { width: 'w-24', sortable: false },
};

// Comment form validation rules
export const COMMENT_FORM_VALIDATION = {
  content: {
    required: true,
    minLength: COMMENT_LIMITS.MIN_CONTENT_LENGTH,
    maxLength: COMMENT_LIMITS.MAX_CONTENT_LENGTH,
  },
  taskId: {
    required: true,
  },
};

// Comment cache keys for Apollo Client
export const COMMENT_CACHE_KEYS = {
  DASHBOARD_COMMENTS: 'dashboardComments',
  COMMENT_DETAILS: 'commentDetails',
  USER_COMMENTS: 'userComments',
  TASK_COMMENTS: 'taskComments',
};

// Comment notification types
export const COMMENT_NOTIFICATION_TYPES = {
  CREATED: 'comment_created',
  UPDATED: 'comment_updated',
  DELETED: 'comment_deleted',
  LIKED: 'comment_liked',
  MENTIONED: 'comment_mentioned',
};

// Comment export formats
export const COMMENT_EXPORT_FORMATS = {
  CSV: 'csv',
  JSON: 'json',
  PDF: 'pdf',
};

// Comment analytics metrics
export const COMMENT_ANALYTICS_METRICS = {
  TOTAL_COMMENTS: 'total_comments',
  COMMENTS_PER_DAY: 'comments_per_day',
  AVERAGE_LIKES: 'average_likes',
  MOST_ACTIVE_USERS: 'most_active_users',
  MOST_DISCUSSED_TASKS: 'most_discussed_tasks',
};
