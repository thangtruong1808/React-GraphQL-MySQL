/**
 * Activity Debugger Constants
 * Centralized configuration for activity debugger component
 * Follows best practices for maintainability and consistency
 */

/**
 * Activity Debugger UI Constants
 * Defines UI-related constants for the activity debugger
 */
export const ACTIVITY_DEBUGGER_UI = {
  // Update intervals
  UPDATE_INTERVAL: 1000, // Update debug info every second
  
  // Progress bar thresholds (percentage)
  PROGRESS_WARNING_THRESHOLD: 80, // Show yellow at 80%
  PROGRESS_DANGER_THRESHOLD: 100, // Show red at 100%
  
  // Modal timing constraints
  MIN_TIME_BETWEEN_MODAL_SHOWS: 5000, // 5 seconds minimum between modal shows
  
  // Countdown display
  COUNTDOWN_TOTAL_SECONDS: 4 * 60, // 4 minutes countdown
  
  // Component sizing
  DEBUG_PANEL_WIDTH: 'w-80', // Panel width class
  DEBUG_PANEL_MAX_HEIGHT: 'max-h-full', // Panel max height class
  
  // Timer priority rules
  REFRESH_TIMER_PRIORITY: true, // Refresh timer takes priority over activity status
} as const;

/**
 * Activity Debugger Messages
 * Centralized messages for the activity debugger component
 */
export const ACTIVITY_DEBUGGER_MESSAGES = {
  // Component title
  TITLE: '🔍 Activity Management',
  
  // Toggle button
  SHOW_DEBUG: 'Show Activity Debug',
  HIDE_DEBUG: 'Hide Activity Debug',
  
  // Section headers
  USER_INFO_HEADER: '👤 USER INFO',
  INACTIVITY_TIMER_HEADER: '🕐 TOKEN EXPIRIES IN',
  
  // Status messages
  AUTHENTICATED: 'Authenticated',
  NOT_AUTHENTICATED: 'Not Authenticated',
  LOADING: 'Loading...',
  ACTIVE_STATUS: '🟢 ACTIVE',
  INACTIVE_STATUS: '🔴 INACTIVE',
  
  // Timer states
  ACCESS_TOKEN_VALID: 'Access token is valid',
  ACCESS_TOKEN_EXPIRED: 'Access token expired',
  COUNTDOWN_WARNING: 'Logout countdown active',
  TRANSITION_STATE: 'Waiting for session modal...',
  REFRESH_TOKEN_COUNTDOWN: 'Refresh token countdown',
  REFRESH_TIMER_FIXED: 'Fixed countdown - not affected by activity',
  
  // Help text
  HELP_TEXT: '💡 Move your mouse, type, or click to see activity tracking in action.',
  
  // Placeholder values
  NOT_AVAILABLE: 'N/A',
} as const;

/**
 * Activity Debugger Colors
 * Color classes for different states and indicators
 */
export const ACTIVITY_DEBUGGER_COLORS = {
  // Status colors
  SUCCESS: 'text-green-600',
  WARNING: 'text-yellow-600', 
  DANGER: 'text-red-600',
  INFO: 'text-blue-600',
  NEUTRAL: 'text-gray-600',
  
  // Progress bar colors
  PROGRESS_SUCCESS: 'bg-green-500',
  PROGRESS_WARNING: 'bg-yellow-500',
  PROGRESS_DANGER: 'bg-red-500',
  PROGRESS_BACKGROUND: 'bg-gray-200',
  
  // Button colors
  PRIMARY_BUTTON: 'bg-blue-600 hover:bg-blue-700',
  BUTTON_TEXT: 'text-white',
} as const;

/**
 * Activity Debugger Layout
 * Layout and positioning constants
 */
export const ACTIVITY_DEBUGGER_LAYOUT = {
  // Panel positioning
  PANEL_POSITION: 'fixed bottom-16 right-4 z-50',
  TOGGLE_BUTTON_POSITION: 'fixed bottom-4 right-4 z-50',
  
  // Panel styling
  PANEL_BACKGROUND: 'bg-white',
  PANEL_BORDER: 'border border-gray-300',
  PANEL_SHADOW: 'shadow-xl',
  PANEL_ROUNDED: 'rounded-lg',
  PANEL_PADDING: 'p-4',
  
  // Section spacing
  SECTION_SPACING: 'space-y-3',
  SECTION_BORDER: 'border-b border-gray-200 pb-2',
  
  // Text sizing
  HEADER_TEXT: 'text-xs font-semibold text-gray-700',
  CONTENT_TEXT: 'text-sm',
  LARGE_TIMER_TEXT: 'text-2xl font-bold',
  SMALL_TEXT: 'text-xs',
} as const;
