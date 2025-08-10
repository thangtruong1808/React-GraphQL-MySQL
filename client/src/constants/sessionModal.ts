/**
 * Session Modal Constants
 * Centralized configuration for session expiry modal behavior
 * Follows best practices for maintainability and consistency
 */

/**
 * Session Modal Configuration
 * Main configuration object for session modal settings
 */
export const SESSION_MODAL_CONFIG = {
  // Modal timing
  MIN_TIME_BETWEEN_SHOWS: 3000, // 3 seconds minimum between modal shows
  AUTO_LOGOUT_DELAY: 4 * 60 * 1000, // 4 minutes after modal appears
  
  // Modal messages
  DEFAULT_MESSAGE: 'Your session has expired. Click "Continue to Work" to refresh your session or "Logout" to sign in again.',
  REFRESH_SUCCESS_MESSAGE: 'Session refreshed successfully',
  REFRESH_FAILED_MESSAGE: 'Failed to refresh session. Please try again or logout.',
  
  // Modal behavior
  ENABLE_AUTO_LOGOUT: true, // Enable automatic logout after delay
  ENABLE_MODAL_PREVENTION: true, // Prevent modal from auto-hiding during user activity
  
  // Debug settings
  ENABLE_DEBUG_LOGGING: process.env.NODE_ENV === 'development', // Enable debug logging in development
} as const;

/**
 * Session Modal UI Constants
 * Defines UI-related settings for the session modal
 */
export const SESSION_MODAL_UI = {
  // Z-index
  MODAL_Z_INDEX: 1050, // Higher than other modals
  
  // Animation
  FADE_IN_DURATION: 200, // milliseconds
  FADE_OUT_DURATION: 150, // milliseconds
  
  // Colors
  PRIMARY_BUTTON_COLOR: 'bg-green-600 hover:bg-green-700',
  SECONDARY_BUTTON_COLOR: 'bg-red-600 hover:bg-red-700',
  WARNING_ICON_COLOR: 'text-yellow-600',
  ERROR_BACKGROUND_COLOR: 'bg-red-50 border-red-200',
  ERROR_TEXT_COLOR: 'text-red-800',
  
  // Sizing
  MAX_WIDTH: 'max-w-md',
  MIN_WIDTH: 'w-full',
  PADDING: 'p-6',
  MARGIN: 'mx-4',
  
  // Spacing
  BUTTON_SPACING: 'space-y-3 sm:space-y-0 sm:space-x-3',
  CONTENT_SPACING: 'mb-6',
  HEADER_SPACING: 'mb-4',
} as const;

/**
 * Session Modal States
 * Defines different states the modal can be in
 */
export const SESSION_MODAL_STATES = {
  HIDDEN: 'hidden',
  VISIBLE: 'visible',
  REFRESHING: 'refreshing',
  LOGGING_OUT: 'logging_out',
  ERROR: 'error',
} as const;

/**
 * Session Modal Events
 * Defines events that can be triggered by the modal
 */
export const SESSION_MODAL_EVENTS = {
  SHOW: 'show',
  HIDE: 'hide',
  REFRESH: 'refresh',
  LOGOUT: 'logout',
  ERROR: 'error',
} as const;

/**
 * Session Modal Validation Rules
 * Defines validation patterns and rules for session modal
 */
export const SESSION_MODAL_VALIDATION = {
  // Minimum time between modal shows
  MIN_TIME_BETWEEN_SHOWS: 1000, // 1 second minimum
  
  // Maximum time between modal shows
  MAX_TIME_BETWEEN_SHOWS: 60000, // 60 seconds maximum
  
  // Valid modal states
  VALID_STATES: Object.values(SESSION_MODAL_STATES),
  
  // Valid modal events
  VALID_EVENTS: Object.values(SESSION_MODAL_EVENTS),
} as const;
