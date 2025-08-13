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
  // Access token configuration - short-lived for security
  ACCESS_TOKEN_EXPIRY: '1m', // 1 minute
  
  // Refresh token configuration - 1 minutes total from login (1m access + 1m refresh)
  REFRESH_TOKEN_EXPIRY: '2m', // 1 minutes total from login (1m access + 1m refresh = 1m total)
  REFRESH_TOKEN_EXPIRY_MS: 2 * 60 * 1000, // 2 minutes in milliseconds

  // Token limits
  MAX_REFRESH_TOKENS_PER_USER: 3, // Maximum refresh tokens per user (increased for multiple sessions)
  
  // JWT issuer and audience
  ISSUER: 'Thang-Truong',
  AUDIENCE: 'graphql-app-users',
  
  // Token refresh timeout configuration
  MINIMUM_REFRESH_TIME: 10 * 1000, // 10 seconds minimum time for refresh operations
  MINIMUM_RENEWAL_TIME: 10 * 1000, // 10 seconds minimum time for renewal operations
  REFRESH_OPERATION_TIMEOUT: 15000, // 15 seconds timeout for refresh operations
  RENEWAL_OPERATION_TIMEOUT: 15000, // 15 seconds timeout for renewal operations
  DB_OPERATION_TIMEOUT: 10000, // 10 seconds timeout for database operations
  CLOCK_SYNC_BUFFER: 10000, // 10 seconds buffer for clock synchronization (reduced from 30 seconds)
  
  // Buffer time for server operations (improves reliability)
  SERVER_OPERATION_BUFFER: 5000, // 5 seconds buffer for server operations
  REQUEST_PROCESSING_BUFFER: 3000, // 3 seconds buffer for request processing
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
 * CSRF Protection Configuration Constants
 * Defines CSRF protection settings
 */
export const CSRF_CONFIG = {
  // CSRF token cookie name
  CSRF_COOKIE_NAME: 'csrf-token',
  
  // CSRF token header name
  CSRF_HEADER_NAME: 'x-csrf-token',
  
  // CSRF token expiry (24 hours)
  CSRF_TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  
  // CSRF token length (32 characters)
  CSRF_TOKEN_LENGTH: 32,
  
  // Cookie options for CSRF token
  CSRF_COOKIE_OPTIONS: {
    httpOnly: false, // Must be accessible by JavaScript
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
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
  
  // Request timeout configuration
  REQUEST_TIMEOUT: 30000, // 30 seconds for server requests
  GRAPHQL_TIMEOUT: 15000, // 15 seconds for GraphQL operations
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
  
  // CSRF errors
  CSRF_TOKEN_MISSING: 'CSRF token missing',
  CSRF_TOKEN_INVALID: 'CSRF token invalid',
  CSRF_TOKEN_EXPIRED: 'CSRF token expired',
  
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
  TOKEN_REFRESH_SUCCESS: 'Token refreshed successfully',
  
  // User operations
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
} as const;

// Error constants are defined inline above 