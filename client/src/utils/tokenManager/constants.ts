/**
 * Token Manager Constants
 * Centralized configuration for token management operations
 * Follows best practices for maintainability and consistency
 */

/**
 * Token Validation Constants
 * Defines validation patterns and rules for tokens
 */
export const TOKEN_VALIDATION = {
  // JWT format validation
  JWT_PARTS_COUNT: 3, // JWT has 3 parts: header.payload.signature
  
  // Hex format validation
  HEX_REGEX: /^[0-9a-fA-F]+$/,
  
  // Token length validation
  MIN_TOKEN_LENGTH: 10,
  MAX_TOKEN_LENGTH: 10000,
} as const;

/**
 * Token Storage Constants
 * Defines memory storage keys and configuration
 */
export const TOKEN_STORAGE = {
  // Memory storage keys
  ACCESS_TOKEN_KEY: 'memoryAccessToken',
  USER_DATA_KEY: 'memoryUserData',
  TOKEN_EXPIRY_KEY: 'memoryTokenExpiry',
  REFRESH_TOKEN_EXPIRY_KEY: 'memoryRefreshTokenExpiry',
  LAST_ACTIVITY_KEY: 'memoryLastActivity',
  ACTIVITY_BASED_EXPIRY_KEY: 'memoryActivityBasedExpiry',
} as const;

/**
 * Token Operation Constants
 * Defines operation types and status codes
 */
export const TOKEN_OPERATIONS = {
  // Operation types
  STORE: 'STORE_TOKENS',
  GET: 'GET_TOKENS',
  UPDATE: 'UPDATE_TOKENS',
  CLEAR: 'CLEAR_TOKENS',
  VALIDATE: 'VALIDATE_TOKENS',
  
  // Status codes
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  INVALID: 'INVALID',
  EXPIRED: 'EXPIRED',
  NOT_FOUND: 'NOT_FOUND',
} as const;

/**
 * Token Error Messages
 * Centralized error messages for token operations
 */
export const TOKEN_ERROR_MESSAGES = {
  // Validation errors
  INVALID_JWT_FORMAT: 'Invalid JWT token format',
  INVALID_HEX_FORMAT: 'Invalid hex token format',
  INVALID_TOKEN_LENGTH: 'Invalid token length',
  
  // Storage errors
  STORAGE_FAILED: 'Failed to store tokens',
  RETRIEVAL_FAILED: 'Failed to retrieve tokens',
  CLEAR_FAILED: 'Failed to clear tokens',
  
  // Expiry errors
  EXPIRY_CALCULATION_FAILED: 'Failed to calculate token expiry',
  EXPIRY_CHECK_FAILED: 'Failed to check token expiry',
  
  // General errors
  UNKNOWN_ERROR: 'Unknown token operation error',
  DECODE_FAILED: 'Failed to decode token',
} as const;

/**
 * Token Success Messages
 * Centralized success messages for token operations
 */
export const TOKEN_SUCCESS_MESSAGES = {
  // Storage operations
  TOKENS_STORED: 'Tokens stored successfully',
  TOKENS_RETRIEVED: 'Tokens retrieved successfully',
  TOKENS_CLEARED: 'Tokens cleared successfully',
  TOKENS_UPDATED: 'Tokens updated successfully',
  
  // Validation operations
  TOKENS_VALID: 'Tokens are valid',
  TOKENS_REFRESHED: 'Tokens refreshed successfully',
  
  // Activity operations
  ACTIVITY_UPDATED: 'Activity updated successfully',
  EXPIRY_UPDATED: 'Expiry updated successfully',
} as const;

/**
 * Token Debug Constants
 * Defines debug logging configuration
 */
export const TOKEN_DEBUG = {
  // Debug prefixes
  STORE_PREFIX: '🔐 STORE TOKENS',
  GET_PREFIX: '🔍 GET ACCESS TOKEN',
  UPDATE_PREFIX: '🔄 UPDATE TOKENS',
  CLEAR_PREFIX: '🧹 CLEAR TOKENS',
  VALIDATE_PREFIX: '✅ VALIDATE TOKENS',
  
  // Debug messages
  STARTING_OPERATION: 'Starting operation...',
  OPERATION_COMPLETED: 'Operation completed successfully',
  OPERATION_FAILED: 'Operation failed',
  
  // Debug levels
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
} as const;
