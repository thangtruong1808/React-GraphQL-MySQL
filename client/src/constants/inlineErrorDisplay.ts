/**
 * Inline Error Display Constants
 * Configuration for inline error display component
 * 
 * USED BY: InlineErrorDisplay component
 * PURPOSE: Centralize error display configuration
 */

export const INLINE_ERROR_CONFIG = {
  // Auto-hide duration for temporary errors (in milliseconds)
  AUTO_HIDE_DURATION: 5000,
  
  // Retry button configuration
  SHOW_RETRY_BUTTON: true,
  
  // Default error type
  DEFAULT_ERROR_TYPE: 'error' as const,
  
  // CSS classes for different error types
  STYLES: {
    ERROR: 'bg-red-50 border-red-200 text-red-800',
    WARNING: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    INFO: 'bg-blue-50 border-blue-200 text-blue-800'
  },
  
  // Icon sizes
  ICON_SIZE: 'w-4 h-4',
  
  // Spacing and layout
  SPACING: {
    PADDING: 'p-3',
    MARGIN_RIGHT: 'mr-2',
    MARGIN_LEFT: 'ml-3'
  },
  
  // Border and rounded corners
  BORDER: 'border rounded-md',
  
  // Text styling
  TEXT_SIZE: 'text-sm'
} as const;

/**
 * Activity tracking error messages
 * Specific error messages for activity tracking failures
 */
export const INLINE_ACTIVITY_ERROR_MESSAGES = {
  TRACKING_FAILED: 'Unable to track your activity. Please refresh the page.',
  INITIALIZATION_FAILED: 'Activity tracking could not be initialized.',
  PERMISSION_DENIED: 'Activity tracking requires page permissions.',
  NETWORK_ERROR: 'Network error prevented activity tracking.',
  UNKNOWN_ERROR: 'An unexpected error occurred with activity tracking.'
} as const;

/**
 * Error display types
 */
export type ErrorType = 'error' | 'warning' | 'info';
