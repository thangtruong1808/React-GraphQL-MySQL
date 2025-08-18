/**
 * Inline Error Display Constants
 * Configuration for inline error display component
 * 
 * USED BY: InlineErrorDisplay component
 * PURPOSE: Centralize error display configuration
 */

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
