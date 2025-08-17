/**
 * Authentication Constants
 * Centralized configuration for authentication-related settings
 * Follows best practices for maintainability and consistency
 */

/**
 * Authentication Configuration
 * Main configuration object for authentication settings
 */
export const AUTH_CONFIG = {
  // Activity tracking intervals
  ACTIVITY_CHECK_INTERVAL: 3000, // Check user activity every 3 seconds (increased to prevent race conditions)
  ACTIVITY_THROTTLE_DELAY: 1000, // Throttle high-frequency events to 1 second
  
  // Session management
  SESSION_DURATION: 2 * 60 * 1000, // 2 minutes session duration
  INACTIVITY_THRESHOLD: 1 * 60 * 1000, // 1 minute of inactivity before logout
  
  // Token configuration
  ACCESS_TOKEN_EXPIRY: 1 * 60 * 1000, // 1 minute access token expiry
  REFRESH_TOKEN_EXPIRY_MS: 8 * 60 * 60 * 1000, // 8 hours refresh token expiry (for database expires_at field)
  MODAL_COUNTDOWN_DURATION: 1 * 60 * 1000, // 1 minute modal countdown timer (separate from DB expiry)
  ACTIVITY_TOKEN_EXPIRY: 1 * 60 * 1000, // 1 minute activity-based token expiry
  
  // Activity-based token management
  ACTIVITY_BASED_TOKEN_ENABLED: true, // Enable activity-based token expiry
  
  // Token refresh thresholds
  TOKEN_REFRESH_WARNING_THRESHOLD: 15 * 1000, // 15 seconds warning threshold
  TOKEN_REFRESH_CAUTION_THRESHOLD: 30 * 1000, // 30 seconds caution threshold
  ACTIVITY_TOKEN_REFRESH_THRESHOLD: 15 * 1000, // 15 seconds activity refresh threshold
  
  // Refresh token management
  REFRESH_TOKEN_AUTO_RENEWAL_ENABLED: false, // Disabled - refresh token renewal should be user-driven only
  
  // Session expiry modal
  MODAL_AUTO_LOGOUT_DELAY: 1 * 60 * 1000, // 1 minute after modal appears (matches modal countdown duration)
  
  // Loading states
  AUTH_INITIALIZATION_TIMEOUT: 5000, // 5 seconds auth initialization timeout (increased for better UX)
  SHOW_LOADING_AFTER_DELAY: 1000, // Show loading spinner after 1 second (increased for better UX)
  
  // First-time user experience
  FIRST_TIME_USER_DELAY: 500, // 500ms delay for first-time users to avoid flash
  
  // Token refresh timeout configuration
  MINIMUM_REFRESH_TIME: 10 * 1000, // 10 seconds minimum time for refresh operations
  MINIMUM_RENEWAL_TIME: 10 * 1000, // 10 seconds minimum time for renewal operations
  REFRESH_OPERATION_TIMEOUT: 15000, // 15 seconds timeout for refresh operations
  RENEWAL_OPERATION_TIMEOUT: 15000, // 15 seconds timeout for renewal operations
  REFRESH_RETRY_DELAY: 2000, // 2 seconds delay between retries
  MAX_REFRESH_RETRIES: 2, // Maximum 2 retries for refresh operations
  
  // Buffer time for server operations (improves reliability)
  SERVER_OPERATION_BUFFER: 15000, // 15 seconds buffer for server operations (increased from 5 seconds for better "Continue to Work" reliability)
  CLOCK_SYNC_BUFFER: 10000, // 10 seconds buffer for clock synchronization (reduced from 30 seconds)
  
  // Loading state configuration
  LOADING_STATE_DELAY: 1000, // 1 second delay before showing loading state
  PROGRESS_BAR_DURATION: 3000, // 3 seconds for progress bar animation
} as const;

/**
 * Authentication Timing Constants
 * Defines timing-related settings for authentication flow
 */
export const AUTH_TIMING = {
  // Activity tracking intervals
  ACTIVITY_CHECK_INTERVAL: 3000, // Check user activity every 3 seconds
  ACTIVITY_THROTTLE_DELAY: 1000, // Throttle high-frequency events to 1 second
  
  // Session management
  SESSION_DURATION: 2 * 60 * 1000, // 2 minutes session duration
  INACTIVITY_THRESHOLD: 1 * 60 * 1000, // 1 minute of inactivity before logout
  
  // Token configuration
  ACCESS_TOKEN_EXPIRY: 1 * 60 * 1000, // 1 minute access token expiry
  REFRESH_TOKEN_EXPIRY: 8 * 60 * 60 * 1000, // 8 hours refresh token expiry (for database)
  MODAL_COUNTDOWN_DURATION: 1 * 60 * 1000, // 1 minute modal countdown timer
  ACTIVITY_TOKEN_EXPIRY: 1 * 60 * 1000, // 1 minute activity-based token expiry
  
  // Token refresh thresholds
  TOKEN_REFRESH_WARNING_THRESHOLD: 15 * 1000, // 15 seconds warning threshold
  TOKEN_REFRESH_CAUTION_THRESHOLD: 30 * 1000, // 30 seconds caution threshold
  ACTIVITY_TOKEN_REFRESH_THRESHOLD: 15 * 1000, // 15 seconds activity refresh threshold
  
  // Refresh token management
  REFRESH_TOKEN_AUTO_RENEWAL_ENABLED: false, // Disabled - refresh token renewal should be user-driven only
  
  // Session expiry modal
  MODAL_AUTO_LOGOUT_DELAY: 1 * 60 * 1000, // 1 minute after modal appears (matches modal countdown duration)
  
  // Loading states
  AUTH_INITIALIZATION_TIMEOUT: 5000, // 5 seconds auth initialization timeout (increased for better UX)
  SHOW_LOADING_AFTER_DELAY: 1000, // Show loading spinner after 1 second (increased for better UX)
  
  // First-time user experience
  FIRST_TIME_USER_DELAY: 500, // 500ms delay for first-time users to avoid flash
} as const;

/**
 * Authentication Feature Flags
 * Defines feature toggles for authentication functionality
 */
export const AUTH_FEATURES = {
  // Activity-based token management
  ACTIVITY_BASED_TOKEN_ENABLED: true, // Enable activity-based token expiry
  
  // Refresh token auto-renewal
  REFRESH_TOKEN_AUTO_RENEWAL_ENABLED: false, // Disabled - refresh token renewal should be user-driven only
  
  // First-time user experience
  ENABLE_FIRST_TIME_USER_OPTIMIZATION: true, // Enable optimizations for first-time users
  
  // Debug mode
  ENABLE_AUTH_DEBUG_LOGGING: false, // Disabled for better user experience
} as const;

/**
 * Authentication Error Messages
 * Centralized error messages for authentication scenarios
 */
export const AUTH_ERROR_MESSAGES = {
  // Authentication errors
  AUTHENTICATION_REQUIRED: 'Authentication required',
  INVALID_CREDENTIALS: 'Invalid email or password',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  
  // Session management errors
  SESSION_TIMEOUT: 'Session expired due to inactivity. Please log in again.',
  REFRESH_FAILED: 'Failed to refresh session. Please log in again.',
  
  // Initialization errors
  INITIALIZATION_TIMEOUT: 'Authentication initialization timed out. Please refresh the page.',
  INITIALIZATION_FAILED: 'Failed to initialize authentication. Please refresh the page.',
  
  // General errors
  UNKNOWN_ERROR: 'An unexpected error occurred',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
} as const;

/**
 * Authentication Success Messages
 * Centralized success messages for authentication scenarios
 */
export const AUTH_SUCCESS_MESSAGES = {
  // Authentication
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  SESSION_REFRESHED: 'You can continue working now!',
  
  // Session management
  SESSION_CONTINUED: 'Session refreshed successfully',
  
  // Initialization
  INITIALIZATION_SUCCESS: 'Authentication initialized successfully',
} as const;

/**
 * Authentication Validation Rules
 * Defines validation patterns and rules for authentication
 */
export const AUTH_VALIDATION = {
  // Email validation
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  EMAIL_MAX_LENGTH: 254,
  
  // Password validation
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  
  // Name validation
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
} as const;

/**
 * Authentication Storage Keys
 * Defines consistent keys for localStorage and sessionStorage
 */
export const AUTH_STORAGE_KEYS = {
  // Authentication
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  
  // Session management
  LAST_ACTIVITY: 'last_activity',
  SESSION_EXPIRY: 'session_expiry',
  
  // First-time user
  FIRST_TIME_USER: 'first_time_user',
} as const;

/**
 * Authentication HTTP Status Codes
 * Defines common HTTP status codes for authentication
 */
export const AUTH_HTTP_STATUS = {
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
} as const; 