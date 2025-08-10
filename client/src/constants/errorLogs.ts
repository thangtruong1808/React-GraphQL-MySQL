/**
 * Error Logs Constants
 * Centralized configuration for error logging system
 * Follows best practices for maintainability and consistency
 */

/**
 * Error Log Configuration Constants
 * Defines default settings and limits for error logging
 */
export const ErrorLogConstants = {
  // Pagination settings
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 200,
  MIN_LIMIT: 10,

  // Auto-refresh settings
  DEFAULT_REFRESH_INTERVAL: 5000, // 5 seconds
  MIN_REFRESH_INTERVAL: 1000, // 1 second
  MAX_REFRESH_INTERVAL: 30000, // 30 seconds

  // UI settings
  MAX_EXPANDED_HEIGHT: 400, // pixels
  MAX_COLLAPSED_WIDTH: 400, // pixels
  ANIMATION_DURATION: 300, // milliseconds

  // Log retention settings
  MAX_LOGS_IN_MEMORY: 1000,
  LOG_EXPIRY_HOURS: 24,

  // Filter options
  CATEGORIES: [
    'AUTH',
    'DB', 
    'GRAPHQL',
    'CSRF',
    'SERVER'
  ] as const,

  LEVELS: [
    'DEBUG',
    'INFO', 
    'WARN',
    'ERROR',
    'CRITICAL'
  ] as const,
} as const;

/**
 * Error Log Level Colors
 * Defines color schemes for different error levels
 */
export const ErrorLogLevelColors = {
  DEBUG: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: 'text-blue-500'
  },
  INFO: {
    bg: 'bg-green-50',
    text: 'text-green-800',
    border: 'border-green-200',
    icon: 'text-green-500'
  },
  WARN: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    icon: 'text-yellow-500'
  },
  ERROR: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: 'text-red-500'
  },
  CRITICAL: {
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200',
    icon: 'text-purple-500'
  }
} as const;

/**
 * Error Log Category Colors
 * Defines color schemes for different error categories
 */
export const ErrorLogCategoryColors = {
  AUTH: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-800',
    border: 'border-indigo-200'
  },
  DB: {
    bg: 'bg-orange-50',
    text: 'text-orange-800',
    border: 'border-orange-200'
  },
  GRAPHQL: {
    bg: 'bg-pink-50',
    text: 'text-pink-800',
    border: 'border-pink-200'
  },
  CSRF: {
    bg: 'bg-teal-50',
    text: 'text-teal-800',
    border: 'border-teal-200'
  },
  SERVER: {
    bg: 'bg-gray-50',
    text: 'text-gray-800',
    border: 'border-gray-200'
  }
} as const;

/**
 * Error Log Icons
 * Defines icons for different error levels and categories
 */
export const ErrorLogIcons = {
  // Level icons
  DEBUG: '🔍',
  INFO: 'ℹ️',
  WARN: '⚠️',
  ERROR: '❌',
  CRITICAL: '🚨',

  // Category icons
  AUTH: '🔐',
  DB: '🗄️',
  GRAPHQL: '📊',
  CSRF: '🛡️',
  SERVER: '🖥️',

  // Action icons
  REFRESH: '🔄',
  CLEAR: '🗑️',
  EXPAND: '📈',
  COLLAPSE: '📉',
  CLOSE: '✖️',
  FILTER: '🔍',
  SORT: '↕️'
} as const;

/**
 * Error Log Messages
 * Defines user-friendly messages for different scenarios
 */
export const ErrorLogMessages = {
  // Loading states
  LOADING_LOGS: 'Loading error logs...',
  LOADING_STATS: 'Loading statistics...',
  CLEARING_LOGS: 'Clearing logs...',

  // Empty states
  NO_LOGS: 'No error logs found',
  NO_LOGS_FOR_FILTER: 'No logs match the current filters',
  NO_RECENT_ERRORS: 'No recent errors',

  // Error states
  FAILED_TO_LOAD: 'Failed to load error logs',
  FAILED_TO_CLEAR: 'Failed to clear error logs',
  NETWORK_ERROR: 'Network error occurred',

  // Success states
  LOGS_CLEARED: 'Error logs cleared successfully',
  LOGS_REFRESHED: 'Error logs refreshed',

  // Tooltips
  TOOLTIPS: {
    REFRESH: 'Refresh error logs',
    CLEAR: 'Clear all error logs',
    EXPAND: 'Expand error logger',
    COLLAPSE: 'Collapse error logger',
    CLOSE: 'Close error logger',
    FILTER: 'Filter logs',
    SORT: 'Sort logs'
  }
} as const;

/**
 * Error Log Date Formats
 * Defines date formatting options
 */
export const ErrorLogDateFormats = {
  // Display formats
  TIMESTAMP: 'MMM dd, yyyy HH:mm:ss',
  TIME_ONLY: 'HH:mm:ss',
  DATE_ONLY: 'MMM dd, yyyy',
  RELATIVE: 'relative', // e.g., "2 minutes ago"

  // Locale settings
  LOCALE: 'en-US',
  TIMEZONE: 'UTC'
} as const;

/**
 * Error Log Table Configuration
 * Defines table column settings and behavior
 */
export const ErrorLogTableConfig = {
  // Column definitions
  COLUMNS: [
    {
      key: 'timestamp',
      label: 'Time',
      sortable: true,
      width: 'w-32'
    },
    {
      key: 'level',
      label: 'Level',
      sortable: true,
      width: 'w-20'
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      width: 'w-24'
    },
    {
      key: 'message',
      label: 'Message',
      sortable: false,
      width: 'flex-1'
    },
    {
      key: 'userId',
      label: 'User',
      sortable: true,
      width: 'w-20'
    },
    {
      key: 'operation',
      label: 'Operation',
      sortable: true,
      width: 'w-24'
    }
  ] as const,

  // Sorting options
  DEFAULT_SORT: 'timestamp',
  DEFAULT_ORDER: 'desc' as 'asc' | 'desc',

  // Row settings
  ROW_HEIGHT: 48, // pixels
  MAX_MESSAGE_LENGTH: 100, // characters
  SHOW_DETAILS_BY_DEFAULT: false
} as const;
