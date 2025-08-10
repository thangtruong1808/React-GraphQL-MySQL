/**
 * Error Logs GraphQL Operations
 * Queries and mutations for server error logging
 * Provides client-side access to server error logs for UI display
 */

import { gql } from '@apollo/client';

/**
 * Error Log Type Definition
 * Matches the server-side ErrorLog type
 */
export interface ErrorLog {
  id: string;
  timestamp: string;
  level: string;
  category: string;
  message: string;
  details?: string;
  userId?: string;
  operation?: string;
  requestId?: string;
}

/**
 * Error Log Statistics Type Definition
 * Matches the server-side ErrorLogStats type
 */
export interface ErrorLogStats {
  totalLogs: number;
  logsByCategory: { [key: string]: number };
  logsByLevel: { [key: string]: number };
  recentErrors: number;
}

/**
 * Error Log Response Type Definition
 * Matches the server-side ErrorLogResponse type
 */
export interface ErrorLogResponse {
  success: boolean;
  message: string;
}

/**
 * Get all error logs with optional filtering
 */
export const GET_ERROR_LOGS = gql`
  query GetErrorLogs($category: String, $level: String, $userId: String, $limit: Int, $offset: Int) {
    errorLogs(category: $category, level: $level, userId: $userId, limit: $limit, offset: $offset) {
      id
      timestamp
      level
      category
      message
      details
      userId
      operation
      requestId
    }
  }
`;

/**
 * Get error logs by category
 */
export const GET_ERROR_LOGS_BY_CATEGORY = gql`
  query GetErrorLogsByCategory($category: String!, $limit: Int, $offset: Int) {
    errorLogsByCategory(category: $category, limit: $limit, offset: $offset) {
      id
      timestamp
      level
      category
      message
      details
      userId
      operation
      requestId
    }
  }
`;

/**
 * Get error logs by user
 */
export const GET_ERROR_LOGS_BY_USER = gql`
  query GetErrorLogsByUser($userId: String!, $limit: Int, $offset: Int) {
    errorLogsByUser(userId: $userId, limit: $limit, offset: $offset) {
      id
      timestamp
      level
      category
      message
      details
      userId
      operation
      requestId
    }
  }
`;

/**
 * Get error logs by level
 */
export const GET_ERROR_LOGS_BY_LEVEL = gql`
  query GetErrorLogsByLevel($level: String!, $limit: Int, $offset: Int) {
    errorLogsByLevel(level: $level, limit: $limit, offset: $offset) {
      id
      timestamp
      level
      category
      message
      details
      userId
      operation
      requestId
    }
  }
`;

/**
 * Get error log statistics
 */
export const GET_ERROR_LOG_STATS = gql`
  query GetErrorLogStats {
    errorLogStats {
      totalLogs
      logsByCategory
      logsByLevel
      recentErrors
    }
  }
`;

/**
 * Clear all error logs
 */
export const CLEAR_ERROR_LOGS = gql`
  mutation ClearErrorLogs {
    clearErrorLogs {
      success
      message
    }
  }
`;

/**
 * Error Log Level Enum
 * Defines the different levels of error logging
 */
export enum ErrorLogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

/**
 * Error Log Category Enum
 * Defines the different categories of error logging
 */
export enum ErrorLogCategory {
  AUTH = 'AUTH',
  DB = 'DB',
  GRAPHQL = 'GRAPHQL',
  CSRF = 'CSRF',
  SERVER = 'SERVER'
}

/**
 * Error Log Filter Options
 * Defines filter options for error log queries
 */
export interface ErrorLogFilters {
  category?: ErrorLogCategory;
  level?: ErrorLogLevel;
  userId?: string;
  limit?: number;
  offset?: number;
}

/**
 * Error Log Query Variables
 * Defines variables for error log queries
 */
export interface ErrorLogQueryVariables {
  category?: string;
  level?: string;
  userId?: string;
  limit?: number;
  offset?: number;
}
