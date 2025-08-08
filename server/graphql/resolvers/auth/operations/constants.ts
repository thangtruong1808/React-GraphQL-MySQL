/**
 * Authentication Operations Constants
 * Centralized configuration for authentication operations
 * Follows best practices for maintainability and consistency
 */

/**
 * Authentication Operations Configuration
 * Main configuration object for authentication operations
 */
export const AUTH_OPERATIONS_CONFIG = {
  // Cookie configuration
  REFRESH_TOKEN_COOKIE_NAME: 'jid',
  COOKIE_PATH: '/',
  COOKIE_SECURE: process.env.NODE_ENV === 'production',
  COOKIE_SAME_SITE: 'lax' as const,
  
  // Response messages
  SUCCESS_MESSAGES: {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REFRESH_SUCCESS: 'Token refreshed successfully',
    RENEWAL_SUCCESS: 'Refresh token renewed successfully',
  },
  
  // Error messages
  ERROR_MESSAGES: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    INVALID_REFRESH_TOKEN: 'Invalid refresh token',
    TOO_MANY_SESSIONS: 'Maximum active sessions reached',
    LOGIN_FAILED: 'Login failed',
    REFRESH_FAILED: 'Token refresh failed',
    RENEWAL_FAILED: 'Token renewal failed',
    LOGOUT_FAILED: 'Logout failed',
  },
  
  // Debug logging
  DEBUG: {
    ENABLE_LOGGING: process.env.NODE_ENV === 'development',
    LOG_PREFIXES: {
      LOGIN: '🔐',
      LOGOUT: '🚪',
      REFRESH: '🔄',
      RENEWAL: '⏰',
      ERROR: '❌',
      SUCCESS: '✅',
      INFO: '🔍',
      TOKEN: '🎫',
    },
  },
  
  // Database operations
  DB: {
    BATCH_SIZE: 100,
    CLEANUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
  },
} as const;

/**
 * Authentication Operations Types
 * Type definitions for authentication operations
 */
export const AUTH_OPERATIONS_TYPES = {
  // GraphQL error codes
  ERROR_CODES: {
    UNAUTHENTICATED: 'UNAUTHENTICATED',
    TOO_MANY_SESSIONS: 'TOO_MANY_SESSIONS',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  },
  
  // Operation types
  OPERATIONS: {
    LOGIN: 'login',
    LOGOUT: 'logout',
    REFRESH: 'refresh',
    RENEWAL: 'renewal',
  },
} as const;

/**
 * Authentication Operations Validation
 * Validation rules and patterns for authentication operations
 */
export const AUTH_OPERATIONS_VALIDATION = {
  // Input validation
  INPUT: {
    EMAIL_MIN_LENGTH: 3,
    EMAIL_MAX_LENGTH: 254,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
  },
  
  // Token validation
  TOKEN: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000,
  },
} as const;

/**
 * Authentication Operations HTTP Status
 * HTTP status codes for authentication operations
 */
export const AUTH_OPERATIONS_HTTP_STATUS = {
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
