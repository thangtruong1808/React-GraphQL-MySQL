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
 * Theme variables for different error types to improve readability across themes
 */
export const ERROR_DISPLAY_STYLES = {
  // Color schemes for different error types using theme variables
  COLORS: {
    ERROR: {
      backgroundColor: 'var(--error-display-bg)',
      borderColor: 'var(--error-display-border)',
      color: 'var(--error-display-text)',
      iconColor: 'var(--error-display-icon)',
    },
    WARNING: {
      backgroundColor: 'var(--warning-display-bg)',
      borderColor: 'var(--warning-display-border)',
      color: 'var(--warning-display-text)',
      iconColor: 'var(--warning-display-icon)',
    },
    INFO: {
      backgroundColor: 'var(--info-display-bg)',
      borderColor: 'var(--info-display-border)',
      color: 'var(--info-display-text)',
      iconColor: 'var(--info-display-icon)',
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
