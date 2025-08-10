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
  ACCESS_TOKEN_EXPIRY: '2m', // 2 minutes
  
  // Refresh token configuration - shorter-lived for testing timeline (3 minutes to achieve 5 minutes total)
  REFRESH_TOKEN_EXPIRY: '4m', // 4 minutes (2m access + 4m refresh = 6m total)
  REFRESH_TOKEN_EXPIRY_MS: 4 * 60 * 1000, // 4 minutes in milliseconds

  // Token limits
  MAX_REFRESH_TOKENS_PER_USER: 3, // Maximum refresh tokens per user (increased for multiple sessions)
  
  // JWT issuer and audience
  ISSUER: 'Thang-Truong',
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
  
  // Logging configuration
  ENABLE_SERVER_LOGGING: process.env.NODE_ENV === 'development',
  ENABLE_ERROR_LOGGING: true,
  ENABLE_DEBUG_LOGGING: process.env.NODE_ENV === 'development',
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