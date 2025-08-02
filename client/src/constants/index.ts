/**
 * Frontend Application Constants
 * Centralized configuration values for the React GraphQL application
 * Follows best practices for maintainability and consistency
 */

/**
 * API Configuration Constants
 * Defines API endpoints and connection settings
 */
// Lazy validation function for API environment variables
const getAPIConfig = () => {
  // Try to get environment variables with fallbacks for development
  const requestTimeout = import.meta.env.VITE_REQUEST_TIMEOUT || '10000';
  const maxRetries = import.meta.env.VITE_MAX_RETRIES || '3';
  const retryDelay = import.meta.env.VITE_RETRY_DELAY || '1000';

  // Validate numeric values
  const requestTimeoutNum = parseInt(requestTimeout);
  const maxRetriesNum = parseInt(maxRetries);
  const retryDelayNum = parseInt(retryDelay);

  if (isNaN(requestTimeoutNum) || isNaN(maxRetriesNum) || isNaN(retryDelayNum)) {
    throw new Error('Invalid API environment variables. VITE_REQUEST_TIMEOUT, VITE_MAX_RETRIES, and VITE_RETRY_DELAY must be valid numbers.');
  }

  // Log warning if using fallbacks (development only)
  if (!import.meta.env.VITE_REQUEST_TIMEOUT || !import.meta.env.VITE_MAX_RETRIES || !import.meta.env.VITE_RETRY_DELAY) {
    console.warn('⚠️ Using fallback values for API configuration. For production, set VITE_REQUEST_TIMEOUT, VITE_MAX_RETRIES, and VITE_RETRY_DELAY in your .env file.');
  }

  return {
    REQUEST_TIMEOUT: requestTimeoutNum,
    MAX_RETRIES: maxRetriesNum,
    RETRY_DELAY: retryDelayNum,
  };
};

// Lazy API configuration that validates when first accessed
let apiConfigCache: ReturnType<typeof getAPIConfig> | null = null;

export const API_CONFIG = {
  // GraphQL endpoint
  GRAPHQL_URL: import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql',
  
  // Request timeout - uses environment variable
  get REQUEST_TIMEOUT() {
    if (!apiConfigCache) apiConfigCache = getAPIConfig();
    return apiConfigCache.REQUEST_TIMEOUT;
  },
  
  // Retry configuration - uses environment variables
  get MAX_RETRIES() {
    if (!apiConfigCache) apiConfigCache = getAPIConfig();
    return apiConfigCache.MAX_RETRIES;
  },
  
  get RETRY_DELAY() {
    if (!apiConfigCache) apiConfigCache = getAPIConfig();
    return apiConfigCache.RETRY_DELAY;
  },
} as const;

/**
 * Authentication Configuration Constants
 * Defines authentication-related settings and validation rules
 */
// Lazy validation function for AUTH environment variables
const getAuthConfig = () => {
  // Try to get environment variables with fallbacks for development
  const sessionDuration = import.meta.env.VITE_SESSION_DURATION || '3600000';
  const activityCheckInterval = import.meta.env.VITE_ACTIVITY_CHECK_INTERVAL || '2000';
  const inactivityThreshold = import.meta.env.VITE_INACTIVITY_THRESHOLD || '60000';
  const tokenRefreshThreshold = import.meta.env.VITE_TOKEN_REFRESH_THRESHOLD || '30000';
  const activityThrottleDelay = import.meta.env.VITE_ACTIVITY_THROTTLE_DELAY || '1000';

  // Validate numeric values
  const sessionDurationNum = parseInt(sessionDuration);
  const activityCheckIntervalNum = parseInt(activityCheckInterval);
  const inactivityThresholdNum = parseInt(inactivityThreshold);
  const tokenRefreshThresholdNum = parseInt(tokenRefreshThreshold);
  const activityThrottleDelayNum = parseInt(activityThrottleDelay);

  if (isNaN(sessionDurationNum) || isNaN(activityCheckIntervalNum) || isNaN(inactivityThresholdNum) || 
      isNaN(tokenRefreshThresholdNum) || isNaN(activityThrottleDelayNum)) {
    throw new Error('Invalid AUTH environment variables. All AUTH variables must be valid numbers.');
  }

  // Log warning if using fallbacks (development only)
  if (!import.meta.env.VITE_SESSION_DURATION || !import.meta.env.VITE_ACTIVITY_CHECK_INTERVAL || 
      !import.meta.env.VITE_INACTIVITY_THRESHOLD || !import.meta.env.VITE_TOKEN_REFRESH_THRESHOLD || 
      !import.meta.env.VITE_ACTIVITY_THROTTLE_DELAY) {
    console.warn('⚠️ Using fallback values for AUTH configuration. For production, set all VITE_* variables in your .env file.');
  }

  return {
    SESSION_DURATION: sessionDurationNum,
    ACTIVITY_CHECK_INTERVAL: activityCheckIntervalNum,
    INACTIVITY_THRESHOLD: inactivityThresholdNum,
    TOKEN_REFRESH_THRESHOLD: tokenRefreshThresholdNum,
    ACTIVITY_THROTTLE_DELAY: activityThrottleDelayNum,
  };
};

// Lazy AUTH configuration that validates when first accessed
let authConfigCache: ReturnType<typeof getAuthConfig> | null = null;

export const AUTH_CONFIG = {
  // Session management - uses environment variable
  get SESSION_DURATION() {
    if (!authConfigCache) authConfigCache = getAuthConfig();
    return authConfigCache.SESSION_DURATION;
  },
  
  // Activity tracking for session management - uses environment variables
  get ACTIVITY_CHECK_INTERVAL() {
    if (!authConfigCache) authConfigCache = getAuthConfig();
    return authConfigCache.ACTIVITY_CHECK_INTERVAL;
  },
  
  get INACTIVITY_THRESHOLD() {
    if (!authConfigCache) authConfigCache = getAuthConfig();
    return authConfigCache.INACTIVITY_THRESHOLD;
  },
  
  // Token refresh settings - uses environment variable
  get TOKEN_REFRESH_THRESHOLD() {
    if (!authConfigCache) authConfigCache = getAuthConfig();
    return authConfigCache.TOKEN_REFRESH_THRESHOLD;
  },
  
  // Activity tracking settings - uses environment variable
  get ACTIVITY_THROTTLE_DELAY() {
    if (!authConfigCache) authConfigCache = getAuthConfig();
    return authConfigCache.ACTIVITY_THROTTLE_DELAY;
  },
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
 * UI Configuration Constants
 * Defines UI-related settings and styling constants
 */
export const UI_CONFIG = {
  // Colors (Australian theme)
  COLORS: {
    PRIMARY: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Primary green
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    SECONDARY: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Secondary blue
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    ACCENT: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308', // Accent yellow
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
    },
    NEUTRAL: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    INFO: '#3b82f6',
  },
  
  // Spacing
  SPACING: {
    XS: '0.25rem',
    SM: '0.5rem',
    MD: '1rem',
    LG: '1.5rem',
    XL: '2rem',
    XXL: '3rem',
  },
  
  // Border radius
  BORDER_RADIUS: {
    SM: '0.25rem',
    MD: '0.375rem',
    LG: '0.5rem',
    XL: '0.75rem',
    FULL: '9999px',
  },
  
  // Shadows
  SHADOWS: {
    SM: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    MD: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    LG: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    XL: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  
  // Transitions
  TRANSITIONS: {
    FAST: '150ms ease-in-out',
    NORMAL: '250ms ease-in-out',
    SLOW: '350ms ease-in-out',
  },
  
  // Z-index
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
  },
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

/**
 * Route Configuration Constants
 * Defines application routes and navigation settings
 */
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  TASKS: '/tasks',
  TEAM: '/team',
  REPORTS: '/reports',
  ACTIVITY: '/activity',
  NOTIFICATIONS: '/notifications',
  ADMIN: '/admin',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // API routes
  GRAPHQL: '/graphql',
  HEALTH: '/health',
} as const;

/**
 * User Role Constants
 * Defines user roles and permissions
 */
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  DEVELOPER: 'DEVELOPER',
} as const;

/**
 * Feature Flags Constants
 * Defines feature flags for enabling/disabling features
 */
export const FEATURE_FLAGS = {
  // Development features
  DEBUG_MODE: import.meta.env.DEV,
  
  // Feature toggles
  ENABLE_NOTIFICATIONS: true,
  ENABLE_REAL_TIME_UPDATES: true,
  ENABLE_ANALYTICS: false,
  ENABLE_EXPERIMENTAL_FEATURES: false,
} as const;

/**
 * Local Storage Keys Constants
 * Defines consistent keys for localStorage and sessionStorage
 */
export const STORAGE_KEYS = {
  // Authentication
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  
  // Settings
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  
  // Cache
  API_CACHE: 'api_cache',
  FORM_CACHE: 'form_cache',
} as const;

/**
 * HTTP Status Codes Constants
 * Defines common HTTP status codes for error handling
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const; 