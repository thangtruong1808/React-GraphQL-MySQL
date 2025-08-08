/**
 * Authentication Operations Helpers
 * Common utility functions for authentication operations
 * Follows GraphQL and Apollo Server best practices
 */

import { AUTH_OPERATIONS_CONFIG } from './constants';

/**
 * Format user data for GraphQL response
 * Ensures consistent user object structure across all operations
 * 
 * @param user - User object from database
 * @returns Formatted user object for GraphQL response
 */
export const formatUserForResponse = (user: any) => {
  return {
    id: user.id.toString(),
    uuid: user.uuid,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isDeleted: user.isDeleted,
    version: user.version,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

/**
 * Log debug information for authentication operations
 * Only logs when debug mode is enabled
 * 
 * @param operation - Operation type (login, logout, refresh, renewal)
 * @param message - Debug message
 * @param data - Optional data to log
 */
export const logDebug = (operation: string, message: string, data?: any) => {
  if (AUTH_OPERATIONS_CONFIG.DEBUG.ENABLE_LOGGING) {
    const prefix = AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES[operation.toUpperCase() as keyof typeof AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES] || AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.INFO;
    console.log(`${prefix} ${message}`, data || '');
  }
};

/**
 * Log error information for authentication operations
 * Always logs errors regardless of debug mode
 * 
 * @param operation - Operation type (login, logout, refresh, renewal)
 * @param message - Error message
 * @param error - Error object
 */
export const logError = (operation: string, message: string, error?: any) => {
  const prefix = AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.ERROR;
  console.error(`${prefix} ${operation}: ${message}`, error || '');
};

/**
 * Log success information for authentication operations
 * 
 * @param operation - Operation type (login, logout, refresh, renewal)
 * @param message - Success message
 * @param data - Optional data to log
 */
export const logSuccess = (operation: string, message: string, data?: any) => {
  const prefix = AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.SUCCESS;
  console.log(`${prefix} ${operation}: ${message}`, data || '');
};

/**
 * Validate cookie presence and format
 * Checks if cookies exist and contain required refresh token
 * 
 * @param req - Express request object
 * @returns Object with validation results
 */
export const validateCookies = (req: any) => {
  const hasCookies = !!req.cookies;
  const cookieKeys = req.cookies ? Object.keys(req.cookies) : [];
  const refreshToken = req.cookies[AUTH_OPERATIONS_CONFIG.REFRESH_TOKEN_COOKIE_NAME];
  const hasRefreshToken = !!refreshToken;

  return {
    hasCookies,
    cookieKeys,
    refreshToken,
    hasRefreshToken,
    userAgent: req.headers['user-agent'],
    origin: req.headers.origin,
  };
};

/**
 * Create cookie options for setting refresh token
 * Ensures consistent cookie configuration across operations
 * 
 * @param maxAge - Cookie max age in milliseconds
 * @returns Cookie options object
 */
export const createCookieOptions = (maxAge: number) => {
  return {
    httpOnly: true,
    secure: AUTH_OPERATIONS_CONFIG.COOKIE_SECURE,
    sameSite: AUTH_OPERATIONS_CONFIG.COOKIE_SAME_SITE,
    path: AUTH_OPERATIONS_CONFIG.COOKIE_PATH,
    maxAge,
  };
};

/**
 * Create cookie options for clearing refresh token
 * Ensures consistent cookie clearing configuration
 * 
 * @returns Cookie options object for clearing
 */
export const createClearCookieOptions = () => {
  return {
    httpOnly: true,
    secure: AUTH_OPERATIONS_CONFIG.COOKIE_SECURE,
    sameSite: AUTH_OPERATIONS_CONFIG.COOKIE_SAME_SITE,
    path: AUTH_OPERATIONS_CONFIG.COOKIE_PATH,
  };
};

/**
 * Check if token is expired
 * Compares token expiry date with current time
 * 
 * @param expiresAt - Token expiry date
 * @returns True if token is expired, false otherwise
 */
export const isTokenExpired = (expiresAt: Date): boolean => {
  return new Date() > expiresAt;
};

/**
 * Calculate time remaining until token expiry
 * Returns time in milliseconds
 * 
 * @param expiresAt - Token expiry date
 * @returns Time remaining in milliseconds, or 0 if expired
 */
export const getTimeRemaining = (expiresAt: Date): number => {
  const now = new Date();
  const remaining = expiresAt.getTime() - now.getTime();
  return Math.max(0, remaining);
};

/**
 * Format time remaining in human-readable format
 * 
 * @param milliseconds - Time in milliseconds
 * @returns Human-readable time string
 */
export const formatTimeRemaining = (milliseconds: number): string => {
  if (milliseconds <= 0) return 'expired';
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day(s)`;
  if (hours > 0) return `${hours} hour(s)`;
  if (minutes > 0) return `${minutes} minute(s)`;
  return `${seconds} second(s)`;
};
