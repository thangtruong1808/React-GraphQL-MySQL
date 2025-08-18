/**
 * Error Display Constants
 * Centralized configuration for error display behavior and styling
 */

/**
 * Error Display Messages
 * Centralized error messages for consistency
 */
export const ERROR_DISPLAY_MESSAGES = {
  // Generic error messages
  GENERIC: {
    UNKNOWN_ERROR: 'An unexpected error occurred',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    TIMEOUT_ERROR: 'Request timed out. Please try again.',
  },

  // Authentication error messages
  AUTHENTICATION: {
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    SESSION_EXPIRED: 'Your session has expired. Please login again.',
    TOO_MANY_SESSIONS: 'Maximum active sessions reached. Please log out from another device to continue.',
    ACCESS_DENIED: 'You do not have permission to access this resource.',
  },

  // Form validation error messages
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_TOO_WEAK: 'Password must be at least 8 characters with uppercase, lowercase, and number',
    FIELD_TOO_SHORT: 'This field is too short',
    FIELD_TOO_LONG: 'This field is too long',
  },
} as const;

/**
 * Error Display Styles
 * CSS classes and styling for different error types
 */
export const ERROR_DISPLAY_STYLES = {
  // Color schemes for different error types
  COLORS: {
    ERROR: {
      BACKGROUND: 'bg-red-50',
      BORDER: 'border-red-200',
      TEXT: 'text-red-800',
      ICON: 'text-red-400',
    },
    WARNING: {
      BACKGROUND: 'bg-yellow-50',
      BORDER: 'border-yellow-200',
      TEXT: 'text-yellow-800',
      ICON: 'text-yellow-400',
    },
    INFO: {
      BACKGROUND: 'bg-blue-50',
      BORDER: 'border-blue-200',
      TEXT: 'text-blue-800',
      ICON: 'text-blue-400',
    },
  },

  // Size classes for error messages
  SIZES: {
    SM: {
      TEXT: 'text-xs',
      PADDING: 'px-2 py-1',
      MARGIN: 'mt-1',
    },
    MD: {
      TEXT: 'text-sm',
      PADDING: 'px-3 py-2',
      MARGIN: 'mt-1',
    },
    LG: {
      TEXT: 'text-base',
      PADDING: 'px-4 py-3',
      MARGIN: 'mt-2',
    },
  },

  // Animation classes
  ANIMATIONS: {
    PULSE: 'animate-pulse',
    FADE_IN: 'animate-fade-in',
    SLIDE_IN: 'animate-slide-in',
  },
} as const;
