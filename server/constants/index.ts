/**
 * Application Constants
 * Centralized configuration values for the GraphQL application
 * Follows best practices for maintainability and consistency
 */

/**
 * JWT Configuration Constants
 * Defines token expiry times and security settings
 */
export const JWT_CONFIG = {
  // Access token configuration
  ACCESS_TOKEN_EXPIRY: '1m', // 5 minutes
  
  // Refresh token configuration
  // For production purposes, we'll use 1 day
  // REFRESH_TOKEN_EXPIRY: '1d', // 1 day
  // REFRESH_TOKEN_EXPIRY_MS: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds

  // For development purposes, we'll use 10 minutes
  REFRESH_TOKEN_EXPIRY: '2m', // 2 minutes
  REFRESH_TOKEN_EXPIRY_MS: 2 * 60 * 1000, // 10 minutes in milliseconds

  // Token limits
  MAX_REFRESH_TOKENS_PER_USER: 5, // Maximum refresh tokens per user (increased for multiple sessions)
  
  // JWT issuer and audience
  ISSUER: 'graphql-app',
  AUDIENCE: 'graphql-app-users',
} as const;

/**
 * Authentication Configuration Constants
 * Defines authentication-related settings
 */
export const AUTH_CONFIG = {
  // Password hashing
  BCRYPT_ROUNDS: 12,
  
  // Token generation
  REFRESH_TOKEN_BYTES: 64, // Number of bytes for refresh token generation
  
  // Password validation
  MIN_PASSWORD_LENGTH: 8,
  
  // Cookie configuration
  REFRESH_TOKEN_COOKIE_NAME: 'jid',
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
  },
} as const;

/**
 * Server Configuration Constants
 * Defines server-related settings
 */
export const SERVER_CONFIG = {
  // Port configuration
  DEFAULT_PORT: 4000,
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // CORS configuration
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
} as const;

/**
 * Database Configuration Constants
 * Defines database-related settings
 */
export const DB_CONFIG = {
  // Connection settings
  HOST: process.env.DB_HOST || 'localhost',
  PORT: parseInt(process.env.DB_PORT || '3306'),
  NAME: process.env.DB_NAME || 'graphql_app',
  USER: process.env.DB_USER || 'root',
  
  // Connection pool
  POOL_MAX: 15,
  POOL_MIN: 0,
  POOL_ACQUIRE: 30000,
  POOL_IDLE: 10000,
} as const;

/**
 * Validation Configuration Constants
 * Defines validation rules and patterns
 */
export const VALIDATION_CONFIG = {
  // Email validation
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Password validation
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  
  // Name validation
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  
  // Email length
  EMAIL_MAX_LENGTH: 254,
} as const;

/**
 * Authorization Configuration Constants
 * Simplified role-based access control
 */
export const AUTHZ_CONFIG = {
  // User roles hierarchy (higher number = more permissions)
  ROLES: {
    DEVELOPER: 1,
    MANAGER: 2,
    ADMIN: 3,
  },
  
  // Project member roles
  PROJECT_ROLES: {
    VIEWER: 'VIEWER',
    EDITOR: 'EDITOR',
    OWNER: 'OWNER',
  },
} as const;

/**
 * Error Messages Constants
 * Centralized error messages for consistency
 */
export const ERROR_MESSAGES = {
  // Authentication errors
  AUTHENTICATION_REQUIRED: 'Authentication required',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  
  // Authorization errors
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  ACCESS_DENIED: 'Access denied',
  RESOURCE_NOT_FOUND: 'Resource not found',
  UNAUTHORIZED_OPERATION: 'Unauthorized operation',
  
  // Validation errors
  ALL_FIELDS_REQUIRED: 'All fields are required',
  INVALID_EMAIL_FORMAT: 'Invalid email format',
  PASSWORD_TOO_WEAK: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  NAME_TOO_SHORT: 'Name must be at least 2 characters',
  NAME_TOO_LONG: 'Name must be less than 100 characters',
  
  // Server errors
  INTERNAL_SERVER_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database operation failed',
  
  // Environment errors
  JWT_SECRET_MISSING: 'JWT_SECRET environment variable is required',
} as const;

/**
 * Success Messages Constants
 * Centralized success messages for consistency
 */
export const SUCCESS_MESSAGES = {
  // Authentication
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTRATION_SUCCESS: 'Registration successful',
  TOKEN_REFRESH_SUCCESS: 'Token refreshed successfully',
  
  // User operations
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
} as const; 