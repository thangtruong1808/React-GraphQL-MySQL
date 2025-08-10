/**
 * Server Error Logging Service
 * Centralized error logging for server-side operations
 * Replaces console.log with structured error logging
 */

import { SERVER_CONFIG } from '../constants';

/**
 * Error Log Levels
 * Defines different levels of error logging
 */
export enum ErrorLogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

/**
 * Error Log Entry Interface
 * Defines the structure of error log entries
 */
export interface ErrorLogEntry {
  timestamp: string;
  level: ErrorLogLevel;
  category: string;
  message: string;
  details?: any;
  userId?: string;
  operation?: string;
  requestId?: string;
}

/**
 * Error Logger Class
 * Handles structured error logging for server operations
 */
export class ErrorLogger {
  private static logs: ErrorLogEntry[] = [];
  private static maxLogs = 1000; // Keep last 1000 logs in memory

  /**
   * Log an error entry
   * @param level - Error log level
   * @param category - Category of the error (e.g., 'AUTH', 'DB', 'GRAPHQL')
   * @param message - Error message
   * @param details - Additional error details
   * @param userId - User ID if applicable
   * @param operation - Operation name if applicable
   * @param requestId - Request ID if applicable
   */
  static log(
    level: ErrorLogLevel,
    category: string,
    message: string,
    details?: any,
    userId?: string,
    operation?: string,
    requestId?: string
  ): void {
    const logEntry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      details,
      userId,
      operation,
      requestId
    };

    // Add to logs array
    this.logs.push(logEntry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log to console only in development or when explicitly enabled
    if (SERVER_CONFIG.ENABLE_SERVER_LOGGING) {
      const prefix = this.getLogPrefix(level);
      console.log(`${prefix} [${category}] ${message}`, details || '');
    }
  }

  /**
   * Log debug information
   */
  static debug(category: string, message: string, details?: any, userId?: string, operation?: string, requestId?: string): void {
    this.log(ErrorLogLevel.DEBUG, category, message, details, userId, operation, requestId);
  }

  /**
   * Log informational messages
   */
  static info(category: string, message: string, details?: any, userId?: string, operation?: string, requestId?: string): void {
    this.log(ErrorLogLevel.INFO, category, message, details, userId, operation, requestId);
  }

  /**
   * Log warning messages
   */
  static warn(category: string, message: string, details?: any, userId?: string, operation?: string, requestId?: string): void {
    this.log(ErrorLogLevel.WARN, category, message, details, userId, operation, requestId);
  }

  /**
   * Log error messages
   */
  static error(category: string, message: string, details?: any, userId?: string, operation?: string, requestId?: string): void {
    this.log(ErrorLogLevel.ERROR, category, message, details, userId, operation, requestId);
  }

  /**
   * Log critical errors
   */
  static critical(category: string, message: string, details?: any, userId?: string, operation?: string, requestId?: string): void {
    this.log(ErrorLogLevel.CRITICAL, category, message, details, userId, operation, requestId);
  }

  /**
   * Get logs for a specific category
   */
  static getLogsByCategory(category: string): ErrorLogEntry[] {
    return this.logs.filter(log => log.category === category);
  }

  /**
   * Get logs for a specific user
   */
  static getLogsByUser(userId: string): ErrorLogEntry[] {
    return this.logs.filter(log => log.userId === userId);
  }

  /**
   * Get logs for a specific level
   */
  static getLogsByLevel(level: ErrorLogLevel): ErrorLogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get all logs
   */
  static getAllLogs(): ErrorLogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear all logs
   */
  static clearLogs(): void {
    this.logs = [];
  }

  /**
   * Get log prefix for console output
   */
  private static getLogPrefix(level: ErrorLogLevel): string {
    switch (level) {
      case ErrorLogLevel.DEBUG:
        return '🔍';
      case ErrorLogLevel.INFO:
        return 'ℹ️';
      case ErrorLogLevel.WARN:
        return '⚠️';
      case ErrorLogLevel.ERROR:
        return '❌';
      case ErrorLogLevel.CRITICAL:
        return '🚨';
      default:
        return '📝';
    }
  }
}

/**
 * Convenience functions for common logging scenarios
 */
export const ServerLogger = {
  // Authentication logging
  auth: {
    debug: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.debug('AUTH', message, details, userId, operation, requestId),
    info: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.info('AUTH', message, details, userId, operation, requestId),
    warn: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.warn('AUTH', message, details, userId, operation, requestId),
    error: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.error('AUTH', message, details, userId, operation, requestId),
    critical: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.critical('AUTH', message, details, userId, operation, requestId)
  },

  // Database logging
  db: {
    debug: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.debug('DB', message, details, userId, operation, requestId),
    info: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.info('DB', message, details, userId, operation, requestId),
    warn: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.warn('DB', message, details, userId, operation, requestId),
    error: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.error('DB', message, details, userId, operation, requestId),
    critical: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.critical('DB', message, details, userId, operation, requestId)
  },

  // GraphQL logging
  graphql: {
    debug: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.debug('GRAPHQL', message, details, userId, operation, requestId),
    info: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.info('GRAPHQL', message, details, userId, operation, requestId),
    warn: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.warn('GRAPHQL', message, details, userId, operation, requestId),
    error: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.error('GRAPHQL', message, details, userId, operation, requestId),
    critical: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.critical('GRAPHQL', message, details, userId, operation, requestId)
  },

  // CSRF logging
  csrf: {
    debug: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.debug('CSRF', message, details, userId, operation, requestId),
    info: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.info('CSRF', message, details, userId, operation, requestId),
    warn: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.warn('CSRF', message, details, userId, operation, requestId),
    error: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.error('CSRF', message, details, userId, operation, requestId),
    critical: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.critical('CSRF', message, details, userId, operation, requestId)
  },

  // Server logging
  server: {
    debug: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.debug('SERVER', message, details, userId, operation, requestId),
    info: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.info('SERVER', message, details, userId, operation, requestId),
    warn: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.warn('SERVER', message, details, userId, operation, requestId),
    error: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.error('SERVER', message, details, userId, operation, requestId),
    critical: (message: string, details?: any, userId?: string, operation?: string, requestId?: string) => 
      ErrorLogger.critical('SERVER', message, details, userId, operation, requestId)
  }
};
