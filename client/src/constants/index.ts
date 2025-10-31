/**
 * Frontend Application Constants
 * Centralized configuration values for the React GraphQL application
 * Follows best practices for maintainability and consistency
 */

// Export authentication constants
export * from './auth';

// Export routing constants
export * from './routingConstants';

// Export activity tracking constants
export * from './activity';

// Export activity debugger constants
export * from './activityDebugger';

// Export debug constants
export * from './debug';
export * from './errorDisplay';

// Export navbar constants
export * from './navbar';

/**
 * API Configuration Constants
 * Defines API endpoints and connection settings
 */
export const API_CONFIG = {
  // GraphQL endpoint (uses VITE_API_URL env var if available, otherwise defaults)
  GRAPHQL_URL: import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql',
  
  // Request timeout
  REQUEST_TIMEOUT: 10000, // 10 seconds
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

/**
 * Validation Configuration Constants
 * Defines validation rules and patterns for form inputs
 */
export const VALIDATION_CONFIG = {
  // Email validation
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  EMAIL_MAX_LENGTH: 254,
  
  // Password validation
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  PASSWORD_REQUIREMENTS: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },
  
  // Name validation
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  
  // Username validation
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  USERNAME_REGEX: /^[a-zA-Z0-9_-]+$/,
  
  // Project/Task validation
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 150,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 1000,
} as const;

/**
 * Error Messages Constants
 * Centralized error messages for consistency across the application
 */
export const ERROR_MESSAGES = {
  // Authentication errors
  AUTHENTICATION_REQUIRED: 'Authentication required',
  INVALID_CREDENTIALS: 'Invalid email or password',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  
  // Validation errors
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_WEAK: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  PASSWORD_MISMATCH: 'Passwords do not match',
  NAME_REQUIRED: 'Name is required',
  NAME_TOO_SHORT: 'Name must be at least 2 characters',
  NAME_TOO_LONG: 'Name must be less than 100 characters',
  FIELD_REQUIRED: 'This field is required',
  
  // Form errors
  FORM_INVALID: 'Please fix the errors in the form',
  SUBMISSION_FAILED: 'Failed to submit form. Please try again.',
  
  // Network errors
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  
  // Permission errors
  ACCESS_DENIED: 'You do not have permission to access this resource',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions for this action',
  
  // General errors
  UNKNOWN_ERROR: 'An unexpected error occurred',
  NOT_FOUND: 'The requested resource was not found',
  UNAUTHORIZED: 'You are not authorized to perform this action',
} as const;

/**
 * Success Messages Constants
 * Centralized success messages for consistency
 */
export const SUCCESS_MESSAGES = {
  // Authentication
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PASSWORD_CHANGED: 'Password changed successfully',
  
  // User operations
  PROFILE_UPDATED: 'Profile updated successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
  
  // Data operations
  DATA_SAVED: 'Data saved successfully',
  DATA_DELETED: 'Data deleted successfully',
  DATA_UPDATED: 'Data updated successfully',
  
  // Form submissions
  FORM_SUBMITTED: 'Form submitted successfully',
  
  // General
  OPERATION_SUCCESS: 'Operation completed successfully',
} as const;
