/**
 * Client Error Log Constants
 * Centralized constants for client-side error logging system
 */

/**
 * Client Error Log Configuration
 * Defines settings for client error logging
 */
export const ClientErrorLogConstants = {
  // Pagination settings
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  
  // Refresh settings
  DEFAULT_REFRESH_INTERVAL: 3000, // 3 seconds
  MIN_REFRESH_INTERVAL: 1000, // 1 second
  MAX_REFRESH_INTERVAL: 30000, // 30 seconds
  
  // UI settings
  MAX_LOG_ENTRIES: 100,
  EXPANDED_VIEW_HEIGHT: '24rem', // 384px
  COLLAPSED_VIEW_WIDTH: '20rem', // 320px
  
  // Categories
  CATEGORIES: {
    APOLLO: 'APOLLO',
    AUTH: 'AUTH',
    NETWORK: 'NETWORK',
    CSRF: 'CSRF',
    CLIENT: 'CLIENT',
  } as const,
  
  // Levels
  LEVELS: {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    CRITICAL: 'CRITICAL',
  } as const,
  
  // Messages
  MESSAGES: {
    NO_LOGS: 'No logs found matching the current filters.',
    CLEAR_CONFIRMATION: 'Are you sure you want to clear all logs?',
    REFRESH_SUCCESS: 'Logs refreshed successfully.',
    CLEAR_SUCCESS: 'All logs cleared successfully.',
  } as const,
  
  // Date formats
  DATE_FORMATS: {
    DISPLAY: 'MMM dd, yyyy HH:mm:ss',
    COMPACT: 'HH:mm:ss',
    ISO: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx',
  } as const,
  
  // Table configuration
  TABLE_CONFIG: {
    COLUMNS: {
      TIME: 'Time',
      LEVEL: 'Level',
      CATEGORY: 'Category',
      MESSAGE: 'Message',
      OPERATION: 'Operation',
      ACTIONS: 'Actions',
    } as const,
    SORTABLE_COLUMNS: ['time', 'level', 'category', 'message'] as const,
  } as const,
} as const;

/**
 * Client Error Log Level Colors
 * Defines colors for different error log levels
 */
export const ClientErrorLogLevelColors = {
  DEBUG: {
    text: 'text-blue-600',
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    icon: '🔍',
  },
  INFO: {
    text: 'text-green-600',
    bg: 'bg-green-100',
    border: 'border-green-200',
    icon: 'ℹ️',
  },
  WARN: {
    text: 'text-yellow-600',
    bg: 'bg-yellow-100',
    border: 'border-yellow-200',
    icon: '⚠️',
  },
  ERROR: {
    text: 'text-red-600',
    bg: 'bg-red-100',
    border: 'border-red-200',
    icon: '❌',
  },
  CRITICAL: {
    text: 'text-purple-600',
    bg: 'bg-purple-100',
    border: 'border-purple-200',
    icon: '🚨',
  },
} as const;

/**
 * Client Error Log Category Colors
 * Defines colors for different error log categories
 */
export const ClientErrorLogCategoryColors = {
  APOLLO: {
    text: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  AUTH: {
    text: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  NETWORK: {
    text: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  CSRF: {
    text: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
  CLIENT: {
    text: 'text-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
  },
} as const;

/**
 * Client Error Log Icons
 * Defines icons for different error log levels and categories
 */
export const ClientErrorLogIcons = {
  // Level icons
  DEBUG: '🔍',
  INFO: 'ℹ️',
  WARN: '⚠️',
  ERROR: '❌',
  CRITICAL: '🚨',
  
  // Category icons
  APOLLO: '🔗',
  AUTH: '🔐',
  NETWORK: '🌐',
  CSRF: '🛡️',
  CLIENT: '💻',
  
  // Action icons
  EXPAND: '📖',
  COLLAPSE: '📕',
  REFRESH: '🔄',
  CLEAR: '🗑️',
  CLOSE: '✕',
} as const;

/**
 * Client Error Log Messages
 * Defines user-facing messages for the error logging system
 */
export const ClientErrorLogMessages = {
  // UI messages
  TITLE: 'Client Error Logger',
  SUBTITLE: 'Real-time client-side error monitoring',
  NO_LOGS: 'No logs available',
  LOADING: 'Loading logs...',
  ERROR_LOADING: 'Error loading logs',
  
  // Action messages
  CLEAR_CONFIRMATION: 'Are you sure you want to clear all logs? This action cannot be undone.',
  REFRESH_SUCCESS: 'Logs refreshed successfully',
  CLEAR_SUCCESS: 'All logs cleared successfully',
  
  // Filter messages
  FILTER_ALL_CATEGORIES: 'All Categories',
  FILTER_ALL_LEVELS: 'All Levels',
  CLEAR_FILTERS: 'Clear All Filters',
  
  // Pagination messages
  SHOWING: 'Showing',
  TO: 'to',
  OF: 'of',
  LOGS: 'logs',
  PREVIOUS: 'Previous',
  NEXT: 'Next',
  PAGE: 'Page',
  
  // Statistics messages
  TOTAL_LOGS: 'Total Logs',
  RECENT_ERRORS: 'Recent Errors',
  CATEGORIES: 'Categories',
  LEVELS: 'Levels',
  LOGS_BY_LEVEL: 'Logs by Level',
  LOGS_BY_CATEGORY: 'Logs by Category',
} as const;

/**
 * Client Error Log Date Formats
 * Defines date formatting options
 */
export const ClientErrorLogDateFormats = {
  DISPLAY: 'MMM dd, yyyy HH:mm:ss',
  COMPACT: 'HH:mm:ss',
  ISO: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx',
  RELATIVE: 'relative',
} as const;

/**
 * Client Error Log Table Configuration
 * Defines table display settings
 */
export const ClientErrorLogTableConfig = {
  // Column widths
  COLUMN_WIDTHS: {
    TIME: 'w-32',
    LEVEL: 'w-20',
    CATEGORY: 'w-24',
    MESSAGE: 'flex-1',
    OPERATION: 'w-28',
    ACTIONS: 'w-24',
  } as const,
  
  // Row heights
  ROW_HEIGHT: 'h-12',
  EXPANDED_ROW_HEIGHT: 'h-auto',
  
  // Pagination
  ITEMS_PER_PAGE: [10, 20, 50, 100] as const,
  DEFAULT_ITEMS_PER_PAGE: 20,
  
  // Sorting
  DEFAULT_SORT: 'time' as const,
  DEFAULT_SORT_DIRECTION: 'desc' as const,
} as const;
