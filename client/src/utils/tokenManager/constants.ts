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
 * Token Error Messages
 * Centralized error messages for token operations
 */
export const TOKEN_ERROR_MESSAGES = {
  // Validation errors
  INVALID_JWT_FORMAT: 'Invalid JWT token format',
  INVALID_HEX_FORMAT: 'Invalid hex token format',
  INVALID_TOKEN_LENGTH: 'Invalid token length',
  
  // General errors
  UNKNOWN_ERROR: 'Unknown token operation error',
} as const;
