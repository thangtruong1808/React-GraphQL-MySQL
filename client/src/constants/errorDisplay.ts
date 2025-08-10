/**
 * Error Display Constants
 * Centralized configuration for error display behavior and styling
 */

/**
 * Error Display Configuration
 * Controls how errors are displayed throughout the application
 */
export const ERROR_DISPLAY_CONFIG = {
  // Global error display settings
  GLOBAL_ERROR_DISPLAY: {
    /** Whether to show global error notifications */
    ENABLED: true,
    /** Default duration for auto-dismissing errors (ms) */
    AUTO_DISMISS_DURATION: 5000,
    /** Maximum number of errors to display simultaneously */
    MAX_ERRORS: 5,
    /** Position of global error display */
    POSITION: 'top-right' as const,
  },

  // Inline error display settings
  INLINE_ERROR_DISPLAY: {
    /** Whether to show inline error messages */
    ENABLED: true,
    /** Default animation duration for error appearance */
    ANIMATION_DURATION: 300,
    /** Whether to show error icons by default */
    SHOW_ICONS: true,
  },

  // Field error display settings
  FIELD_ERROR_DISPLAY: {
    /** Whether to show field-level error messages */
    ENABLED: true,
    /** Whether to animate field errors */
    ANIMATED: true,
    /** Default size for field error messages */
    DEFAULT_SIZE: 'md' as const,
  },

  // Form error display settings
  FORM_ERROR_DISPLAY: {
    /** Whether to show form-level error summaries */
    ENABLED: true,
    /** Maximum number of errors to show in summary */
    MAX_ERRORS_IN_SUMMARY: 5,
    /** Whether form error summaries are dismissible */
    DISMISSIBLE: true,
  },

  // Error types and their display settings
  ERROR_TYPES: {
    ERROR: {
      /** Color scheme for error type */
      COLOR: 'red',
      /** Icon for error type */
      ICON: 'error',
      /** Auto-dismiss duration for errors (ms) */
      AUTO_DISMISS_DURATION: 5000,
    },
    WARNING: {
      /** Color scheme for warning type */
      COLOR: 'yellow',
      /** Icon for warning type */
      ICON: 'warning',
      /** Auto-dismiss duration for warnings (ms) */
      AUTO_DISMISS_DURATION: 4000,
    },
    INFO: {
      /** Color scheme for info type */
      COLOR: 'blue',
      /** Icon for info type */
      ICON: 'info',
      /** Auto-dismiss duration for info messages (ms) */
      AUTO_DISMISS_DURATION: 3000,
    },
  },

  // Error sources and their display settings
  ERROR_SOURCES: {
    AUTHENTICATION: {
      /** Whether to show authentication errors */
      ENABLED: true,
      /** Priority level for authentication errors */
      PRIORITY: 'high' as const,
    },
    GRAPHQL: {
      /** Whether to show GraphQL errors */
      ENABLED: true,
      /** Priority level for GraphQL errors */
      PRIORITY: 'high' as const,
    },
    NETWORK: {
      /** Whether to show network errors */
      ENABLED: true,
      /** Priority level for network errors */
      PRIORITY: 'medium' as const,
    },
    VALIDATION: {
      /** Whether to show validation errors */
      ENABLED: true,
      /** Priority level for validation errors */
      PRIORITY: 'low' as const,
    },
  },
} as const;

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
