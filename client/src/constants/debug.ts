/**
 * Debug Configuration Constants
 * Centralized configuration for debug logging and development features
 * Follows best practices for maintainability and consistency
 */

/**
 * Debug Feature Flags
 * Controls debug logging and development-only features
 */
export const DEBUG_CONFIG = {
  // Debug logging settings
  ENABLE_DEBUG_LOGGING: false, // Disabled for production - set to true only in development
  ENABLE_ACTIVITY_DEBUG_LOGGING: false, // Disabled for production
  ENABLE_TOKEN_DEBUG_LOGGING: false, // Disabled for production
  ENABLE_SESSION_DEBUG_LOGGING: false, // Disabled for production
  ENABLE_AUTH_DEBUG_LOGGING: false, // Disabled for production
  
  // Development-only features
  ENABLE_ACTIVITY_DEBUGGER: process.env.NODE_ENV === 'development',
  ENABLE_PERFORMANCE_LOGGING: false,
  
  // Error logging (always enabled for production debugging)
  ENABLE_ERROR_LOGGING: true,
  
  // Client-side error logging
  ENABLE_CLIENT_DEBUG_LOGGING: process.env.NODE_ENV === 'development',
} as const;

/**
 * Debug Message Prefixes
 * Consistent prefixes for different types of debug messages
 */
export const DEBUG_PREFIXES = {
  // Authentication
  AUTH: '🔐',
  SESSION: '🔍',
  TOKEN: '🔄',
  
  // Activity tracking
  ACTIVITY: '🔍',
  FOCUS: '🔍',
  
  // Errors
  ERROR: '❌',
  WARNING: '⚠️',
  
  // Success
  SUCCESS: '✅',
  INFO: 'ℹ️',
} as const;

/**
 * Debug Message Categories
 * Categories for organizing debug messages
 */
export const DEBUG_CATEGORIES = {
  // Authentication flow
  AUTH_INIT: 'Authentication Initialization',
  AUTH_LOGIN: 'Login Process',
  AUTH_LOGOUT: 'Logout Process',
  AUTH_REFRESH: 'Token Refresh',
  
  // Session management
  SESSION_CHECK: 'Session Validation',
  SESSION_ACTIVITY: 'Activity Tracking',
  SESSION_EXPIRY: 'Session Expiry',
  
  // Token management
  TOKEN_STORE: 'Token Storage',
  TOKEN_VALIDATE: 'Token Validation',
  TOKEN_REFRESH: 'Token Refresh',
  
  // Activity tracking
  ACTIVITY_TRACK: 'Activity Tracking',
  FOCUS_TRACK: 'Focus Tracking',
  
  // Routing
  ROUTING: 'Route Protection',
  
  // GraphQL
  GRAPHQL: 'GraphQL Operations',
} as const;
