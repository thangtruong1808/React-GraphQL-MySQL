/**
 * Activity Tracking Constants
 * Centralized configuration for activity tracking and monitoring
 * Follows best practices for maintainability and consistency
 */

/**
 * Activity Tracking Configuration
 * Main configuration object for activity tracking settings
 */
export const ACTIVITY_CONFIG = {
  // Activity tracking intervals
  ACTIVITY_CHECK_INTERVAL: 3000, // Check user activity every 3 seconds
  ACTIVITY_THROTTLE_DELAY: 1000, // Throttle high-frequency events to 1 second
  
  // Session management
  SESSION_DURATION: 2 * 60 * 1000, // 2 minutes session duration
  INACTIVITY_THRESHOLD: 1 * 60 * 1000, // 1 minute of inactivity before logout
  
  // Token configuration
  ACCESS_TOKEN_EXPIRY: 1 * 60 * 1000, // 1 minute access token expiry
  REFRESH_TOKEN_EXPIRY_MS: 2 * 60 * 1000, // 2 minutes refresh token expiry (matches server-side)
  ACTIVITY_TOKEN_EXPIRY: 1 * 60 * 1000, // 1 minute activity-based token expiry
  
  // Activity-based token management
  ACTIVITY_BASED_TOKEN_ENABLED: true, // Enable activity-based token expiry
  
  // Token refresh thresholds
  TOKEN_REFRESH_WARNING_THRESHOLD: 15 * 1000, // 15 seconds warning threshold
  TOKEN_REFRESH_CAUTION_THRESHOLD: 30 * 1000, // 30 seconds caution threshold
  ACTIVITY_TOKEN_REFRESH_THRESHOLD: 15 * 1000, // 15 seconds activity refresh threshold
  
  // Refresh token management
  REFRESH_TOKEN_RENEWAL_THRESHOLD: 15 * 1000, // 15 seconds renewal threshold
  REFRESH_TOKEN_AUTO_RENEWAL_ENABLED: true, // Enable automatic renewal
  
  // Session expiry modal
  MODAL_AUTO_LOGOUT_DELAY: 2 * 60 * 1000, // 2 minutes after modal appears
  
  // Loading states
  AUTH_INITIALIZATION_TIMEOUT: 5000, // 5 seconds auth initialization timeout (increased for better UX)
  SHOW_LOADING_AFTER_DELAY: 1000, // Show loading spinner after 1 second (increased for better UX)
  
  // First-time user experience
  FIRST_TIME_USER_DELAY: 500, // 500ms delay for first-time users to avoid flash
} as const;

/**
 * Activity Event Types
 * Defines the types of events that should trigger activity updates
 */
export const ACTIVITY_EVENTS = {
  // Mouse events
  MOUSE_CLICK: ['mousedown', 'mouseup', 'click', 'dblclick'],
  
  // Keyboard events
  KEYBOARD_INPUT: ['keydown', 'keyup', 'keypress'],
  
  // Touch events
  TOUCH_INTERACTION: ['touchstart', 'touchend', 'touchmove'],
  
  // Scroll events
  SCROLL_EVENTS: ['scroll', 'wheel'],
  
  // Form events
  FORM_EVENTS: ['focus', 'blur', 'input', 'change', 'submit'],
  
  // Navigation events
  NAVIGATION_EVENTS: ['beforeunload'],
  
  // All user interaction events
  ALL_USER_INTERACTIONS: [
    'mousedown', 'mouseup', 'click', 'dblclick', 'mousemove',
    'keydown', 'keyup', 'keypress',
    'touchstart', 'touchend', 'touchmove',
    'scroll', 'wheel',
    'focus', 'blur', 'input', 'change', 'submit',
    'beforeunload'
  ],
  
  // Events that should be throttled
  THROTTLED_EVENTS: ['scroll', 'mousemove'],
} as const;

/**
 * Activity Tracking Feature Flags
 * Defines feature toggles for activity tracking functionality
 */
export const ACTIVITY_FEATURES = {
  // Focus-based activity tracking
  ENABLE_FOCUS_BASED_TRACKING: true, // Only track activity when app is focused
  
  // Throttling for high-frequency events
  ENABLE_EVENT_THROTTLING: true, // Throttle high-frequency events
  
  // System event filtering
  ENABLE_SYSTEM_EVENT_FILTERING: true, // Filter out system-generated events
  
  // Debug mode
  ENABLE_ACTIVITY_DEBUG_LOGGING: false, // Disabled for better user experience
} as const;

/**
 * Activity Tracking Error Messages
 * Centralized error messages for activity tracking scenarios
 */
export const ACTIVITY_ERROR_MESSAGES = {
  // Activity tracking errors
  ACTIVITY_UPDATE_FAILED: 'Failed to update activity timestamp',
  ACTIVITY_CHECK_FAILED: 'Failed to check user activity',
  FOCUS_TRACKING_FAILED: 'Failed to track application focus state',
  
  // Session management errors
  SESSION_TIMEOUT: 'Session expired due to inactivity. Please log in again.',
  INACTIVITY_DETECTED: 'User inactivity detected',
  
  // General errors
  UNKNOWN_ERROR: 'An unexpected error occurred during activity tracking',
} as const;

/**
 * Activity Tracking Success Messages
 * Centralized success messages for activity tracking scenarios
 */
export const ACTIVITY_SUCCESS_MESSAGES = {
  // Activity tracking
  ACTIVITY_UPDATED: 'Activity timestamp updated successfully',
  FOCUS_STATE_UPDATED: 'Application focus state updated',
  
  // Session management
  SESSION_ACTIVE: 'User session is active',
  ACTIVITY_DETECTED: 'User activity detected',
} as const;

/**
 * Activity Tracking Validation Rules
 * Defines validation patterns and rules for activity tracking
 */
export const ACTIVITY_VALIDATION = {
  // Minimum activity interval
  MIN_ACTIVITY_INTERVAL: 100, // 100ms minimum between activity updates
  
  // Maximum activity interval
  MAX_ACTIVITY_INTERVAL: 30000, // 30 seconds maximum between activity updates
  
  // Valid event types
  VALID_EVENT_TYPES: ACTIVITY_EVENTS.ALL_USER_INTERACTIONS,
} as const;

/**
 * Activity Tracking Storage Keys
 * Defines consistent keys for activity-related storage
 */
export const ACTIVITY_STORAGE_KEYS = {
  // Activity tracking
  LAST_ACTIVITY: 'last_activity',
  ACTIVITY_EXPIRY: 'activity_expiry',
  APP_FOCUS_STATE: 'app_focus_state',
  
  // Session management
  SESSION_EXPIRY: 'session_expiry',
  INACTIVITY_START: 'inactivity_start',
} as const;
