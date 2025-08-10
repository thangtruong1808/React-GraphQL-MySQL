/**
 * Error Logs GraphQL Resolver
 * Exposes server error logs to the client for UI display
 * Provides structured error logging for better debugging and user experience
 */

import { ErrorLogger, ErrorLogLevel } from '../../utils/errorLogger';

/**
 * Error Log GraphQL Type
 * Defines the structure of error log entries for GraphQL
 */
export interface ErrorLogType {
  id: string;
  timestamp: string;
  level: string;
  category: string;
  message: string;
  details?: any;
  userId?: string;
  operation?: string;
  requestId?: string;
}

/**
 * Error Logs Query Resolver
 * Provides access to server error logs
 */
export const errorLogsResolvers = {
  Query: {
    /**
     * Get all error logs
     * @param _ - Parent resolver
     * @param args - Query arguments
     * @param context - GraphQL context
     * @returns Array of error log entries
     */
    errorLogs: async (_: any, args: {
      category?: string;
      level?: string;
      userId?: string;
      limit?: number;
      offset?: number;
    }, context: any): Promise<ErrorLogType[]> => {
      try {
        // Get all logs
        let logs = ErrorLogger.getAllLogs();

        // Filter by category if specified
        if (args.category) {
          logs = logs.filter(log => log.category === args.category);
        }

        // Filter by level if specified
        if (args.level) {
          logs = logs.filter(log => log.level === args.level);
        }

        // Filter by user ID if specified
        if (args.userId) {
          logs = logs.filter(log => log.userId === args.userId);
        }

        // Apply pagination
        const offset = args.offset || 0;
        const limit = args.limit || 100;
        const paginatedLogs = logs.slice(offset, offset + limit);

        // Convert to GraphQL type
        return paginatedLogs.map((log, index) => ({
          id: `${log.timestamp}-${index}`,
          timestamp: log.timestamp,
          level: log.level,
          category: log.category,
          message: log.message,
          details: log.details,
          userId: log.userId,
          operation: log.operation,
          requestId: log.requestId,
        }));
      } catch (error) {
        ErrorLogger.error('GRAPHQL', 'Failed to fetch error logs', error);
        return [];
      }
    },

    /**
     * Get error logs by category
     * @param _ - Parent resolver
     * @param args - Query arguments
     * @param context - GraphQL context
     * @returns Array of error log entries for the specified category
     */
    errorLogsByCategory: async (_: any, args: {
      category: string;
      limit?: number;
      offset?: number;
    }, context: any): Promise<ErrorLogType[]> => {
      try {
        const logs = ErrorLogger.getLogsByCategory(args.category);
        
        // Apply pagination
        const offset = args.offset || 0;
        const limit = args.limit || 100;
        const paginatedLogs = logs.slice(offset, offset + limit);

        // Convert to GraphQL type
        return paginatedLogs.map((log, index) => ({
          id: `${log.timestamp}-${index}`,
          timestamp: log.timestamp,
          level: log.level,
          category: log.category,
          message: log.message,
          details: log.details,
          userId: log.userId,
          operation: log.operation,
          requestId: log.requestId,
        }));
      } catch (error) {
        ErrorLogger.error('GRAPHQL', 'Failed to fetch error logs by category', error);
        return [];
      }
    },

    /**
     * Get error logs by user
     * @param _ - Parent resolver
     * @param args - Query arguments
     * @param context - GraphQL context
     * @returns Array of error log entries for the specified user
     */
    errorLogsByUser: async (_: any, args: {
      userId: string;
      limit?: number;
      offset?: number;
    }, context: any): Promise<ErrorLogType[]> => {
      try {
        const logs = ErrorLogger.getLogsByUser(args.userId);
        
        // Apply pagination
        const offset = args.offset || 0;
        const limit = args.limit || 100;
        const paginatedLogs = logs.slice(offset, offset + limit);

        // Convert to GraphQL type
        return paginatedLogs.map((log, index) => ({
          id: `${log.timestamp}-${index}`,
          timestamp: log.timestamp,
          level: log.level,
          category: log.category,
          message: log.message,
          details: log.details,
          userId: log.userId,
          operation: log.operation,
          requestId: log.requestId,
        }));
      } catch (error) {
        ErrorLogger.error('GRAPHQL', 'Failed to fetch error logs by user', error);
        return [];
      }
    },

    /**
     * Get error logs by level
     * @param _ - Parent resolver
     * @param args - Query arguments
     * @param context - GraphQL context
     * @returns Array of error log entries for the specified level
     */
    errorLogsByLevel: async (_: any, args: {
      level: string;
      limit?: number;
      offset?: number;
    }, context: any): Promise<ErrorLogType[]> => {
      try {
        const logs = ErrorLogger.getLogsByLevel(args.level as ErrorLogLevel);
        
        // Apply pagination
        const offset = args.offset || 0;
        const limit = args.limit || 100;
        const paginatedLogs = logs.slice(offset, offset + limit);

        // Convert to GraphQL type
        return paginatedLogs.map((log, index) => ({
          id: `${log.timestamp}-${index}`,
          timestamp: log.timestamp,
          level: log.level,
          category: log.category,
          message: log.message,
          details: log.details,
          userId: log.userId,
          operation: log.operation,
          requestId: log.requestId,
        }));
      } catch (error) {
        ErrorLogger.error('GRAPHQL', 'Failed to fetch error logs by level', error);
        return [];
      }
    },

    /**
     * Get error log statistics
     * @param _ - Parent resolver
     * @param args - Query arguments
     * @param context - GraphQL context
     * @returns Error log statistics
     */
    errorLogStats: async (_: any, args: any, context: any): Promise<{
      totalLogs: number;
      logsByCategory: { [key: string]: number };
      logsByLevel: { [key: string]: number };
      recentErrors: number;
    }> => {
      try {
        const logs = ErrorLogger.getAllLogs();
        
        // Calculate statistics
        const logsByCategory: { [key: string]: number } = {};
        const logsByLevel: { [key: string]: number } = {};
        
        logs.forEach(log => {
          // Count by category
          logsByCategory[log.category] = (logsByCategory[log.category] || 0) + 1;
          
          // Count by level
          logsByLevel[log.level] = (logsByLevel[log.level] || 0) + 1;
        });

        // Count recent errors (last 24 hours)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentErrors = logs.filter(log => 
          new Date(log.timestamp) > oneDayAgo && 
          (log.level === ErrorLogLevel.ERROR || log.level === ErrorLogLevel.CRITICAL)
        ).length;

        return {
          totalLogs: logs.length,
          logsByCategory,
          logsByLevel,
          recentErrors,
        };
      } catch (error) {
        ErrorLogger.error('GRAPHQL', 'Failed to fetch error log statistics', error);
        return {
          totalLogs: 0,
          logsByCategory: {},
          logsByLevel: {},
          recentErrors: 0,
        };
      }
    },
  },

  Mutation: {
    /**
     * Clear all error logs
     * @param _ - Parent resolver
     * @param args - Mutation arguments
     * @param context - GraphQL context
     * @returns Success status
     */
    clearErrorLogs: async (_: any, args: any, context: any): Promise<{
      success: boolean;
      message: string;
    }> => {
      try {
        ErrorLogger.clearLogs();
        return {
          success: true,
          message: 'Error logs cleared successfully',
        };
      } catch (error) {
        ErrorLogger.error('GRAPHQL', 'Failed to clear error logs', error);
        return {
          success: false,
          message: 'Failed to clear error logs',
        };
      }
    },
  },
};
