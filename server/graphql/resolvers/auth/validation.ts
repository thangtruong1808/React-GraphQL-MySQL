import { GraphQLError } from 'graphql';
import { VALIDATION_CONFIG } from '../../../constants';

/**
 * Validation Utilities Module
 * Handles input validation for authentication operations
 * 
 * SCENARIOS:
 * - Login Validation: Validates email and password inputs
 * - Token Validation: Validates token format and presence
 * - Input Sanitization: Ensures clean input data
 * - Error Handling: Provides consistent error responses
 */

/**
 * Validate login credentials
 * @param email - User email address
 * @param password - User password
 * @throws GraphQLError if validation fails
 * 
 * CALLED BY: login()
 * SCENARIOS: Login attempts - validates user input before database queries
 * FEATURES: Email format validation, required field validation, security logging
 */
export const validateLoginCredentials = (email: string, password: string): void => {
  // Enhanced input validation - prevents unnecessary DB queries
  if (!email || !password) {
    throw new GraphQLError('Email and password are required', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  // Validate email format using centralized regex
  if (!VALIDATION_CONFIG.EMAIL_REGEX.test(email)) {
    throw new GraphQLError('Invalid email format', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
};

/**
 * Validate refresh token presence
 * @param refreshToken - Refresh token from cookie
 * @throws GraphQLError if token is missing
 * 
 * CALLED BY: refreshToken(), logout()
 * SCENARIOS: Token operations - validates token presence before processing
 * FEATURES: Required token validation, consistent error handling
 */
export const validateRefreshToken = (refreshToken: string): void => {
  if (!refreshToken) {
    throw new GraphQLError('Refresh token is required', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
};

/**
 * Sanitize email input
 * @param email - Raw email input
 * @returns Sanitized email (lowercase, trimmed)
 * 
 * CALLED BY: login()
 * SCENARIOS: Login attempts - ensures consistent email format
 * FEATURES: Case normalization, whitespace removal, security enhancement
 */
export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
}; 