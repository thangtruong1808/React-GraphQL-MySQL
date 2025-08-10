/**
 * Client-side Error Logging Utility
 * Replaces console.log with UI-based error display for better user experience
 * Provides structured error logging for client-side operations
 */

import { DEBUG_CONFIG } from '../constants/debug';

/**
 * Error Log Levels
 * Defines different levels of error logging
 */
export enum ClientErrorLogLevel {
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
export interface ClientErrorLogEntry {
  id: string;
  timestamp: string;
  level: ClientErrorLogLevel;
  category: string;
  message: string;
  details?: any;
  operation?: string;
  source?: string;
}

/**
 * Client Error Logger Class
 * Handles structured error logging for client operations
 */
export class ClientErrorLogger {
  private static logs: ClientErrorLogEntry[] = [];
  private static maxLogs = 100; // Keep last 100 logs in memory
  private static listeners: ((logs: ClientErrorLogEntry[]) => void)[] = [];

  /**
   * Log an error entry
   * @param level - Error log level
   * @param category - Category of the error (e.g., 'APOLLO', 'AUTH', 'NETWORK')
   * @param message - Error message
   * @param details - Additional error details
   * @param operation - Operation name if applicable
   * @param source - Source of the error
   */
  static log(
    level: ClientErrorLogLevel,
    category: string,
    message: string,
    details?: any,
    operation?: string,
    source?: string
  ): void {
    const logEntry: ClientErrorLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      details,
      operation,
      source
    };

    // Add to logs array
    this.logs.push(logEntry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Notify listeners
    this.notifyListeners();

    // Log to console only in development or when explicitly enabled
    if (DEBUG_CONFIG.ENABLE_CLIENT_DEBUG_LOGGING) {
      const prefix = this.getLogPrefix(level);
      console.log(`${prefix} [${category}] ${message}`, details || '');
    }
  }

  /**
   * Log debug information
   */
  static debug(category: string, message: string, details?: any, operation?: string, source?: string): void {
    this.log(ClientErrorLogLevel.DEBUG, category, message, details, operation, source);
  }

  /**
   * Log informational messages
   */
  static info(category: string, message: string, details?: any, operation?: string, source?: string): void {
    this.log(ClientErrorLogLevel.INFO, category, message, details, operation, source);
  }

  /**
   * Log warning messages
   */
  static warn(category: string, message: string, details?: any, operation?: string, source?: string): void {
    this.log(ClientErrorLogLevel.WARN, category, message, details, operation, source);
  }

  /**
   * Log error messages
   */
  static error(category: string, message: string, details?: any, operation?: string, source?: string): void {
    this.log(ClientErrorLogLevel.ERROR, category, message, details, operation, source);
  }

  /**
   * Log critical error messages
   */
  static critical(category: string, message: string, details?: any, operation?: string, source?: string): void {
    this.log(ClientErrorLogLevel.CRITICAL, category, message, details, operation, source);
  }

  /**
   * Get logs by category
   */
  static getLogsByCategory(category: string): ClientErrorLogEntry[] {
    return this.logs.filter(log => log.category === category);
  }

  /**
   * Get logs by level
   */
  static getLogsByLevel(level: ClientErrorLogLevel): ClientErrorLogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get all logs
   */
  static getAllLogs(): ClientErrorLogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear all logs
   */
  static clearLogs(): void {
    this.logs = [];
    this.notifyListeners();
  }

  /**
   * Subscribe to log changes
   */
  static subscribe(listener: (logs: ClientErrorLogEntry[]) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners
   */
  private static notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener([...this.logs]);
      } catch (error) {
        // Prevent listener errors from breaking the logger
        console.error('Error in error logger listener:', error);
      }
    });
  }

  /**
   * Get log prefix for console output
   */
  private static getLogPrefix(level: ClientErrorLogLevel): string {
    switch (level) {
      case ClientErrorLogLevel.DEBUG:
        return '🔍';
      case ClientErrorLogLevel.INFO:
        return 'ℹ️';
      case ClientErrorLogLevel.WARN:
        return '⚠️';
      case ClientErrorLogLevel.ERROR:
        return '❌';
      case ClientErrorLogLevel.CRITICAL:
        return '🚨';
      default:
        return '📝';
    }
  }
}

/**
 * Convenience functions for common logging scenarios
 */
export const ClientLogger = {
  // Apollo Client logging
  apollo: {
    debug: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.debug('APOLLO', message, details, operation, source),
    info: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.info('APOLLO', message, details, operation, source),
    warn: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.warn('APOLLO', message, details, operation, source),
    error: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.error('APOLLO', message, details, operation, source),
    critical: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.critical('APOLLO', message, details, operation, source)
  },

  // Authentication logging
  auth: {
    debug: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.debug('AUTH', message, details, operation, source),
    info: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.info('AUTH', message, details, operation, source),
    warn: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.warn('AUTH', message, details, operation, source),
    error: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.error('AUTH', message, details, operation, source),
    critical: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.critical('AUTH', message, details, operation, source)
  },

  // Network logging
  network: {
    debug: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.debug('NETWORK', message, details, operation, source),
    info: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.info('NETWORK', message, details, operation, source),
    warn: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.warn('NETWORK', message, details, operation, source),
    error: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.error('NETWORK', message, details, operation, source),
    critical: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.critical('NETWORK', message, details, operation, source)
  },

  // CSRF logging
  csrf: {
    debug: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.debug('CSRF', message, details, operation, source),
    info: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.info('CSRF', message, details, operation, source),
    warn: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.warn('CSRF', message, details, operation, source),
    error: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.error('CSRF', message, details, operation, source),
    critical: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.critical('CSRF', message, details, operation, source)
  },

  // General client logging
  client: {
    debug: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.debug('CLIENT', message, details, operation, source),
    info: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.info('CLIENT', message, details, operation, source),
    warn: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.warn('CLIENT', message, details, operation, source),
    error: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.error('CLIENT', message, details, operation, source),
    critical: (message: string, details?: any, operation?: string, source?: string) => 
      ClientErrorLogger.critical('CLIENT', message, details, operation, source)
  }
};
