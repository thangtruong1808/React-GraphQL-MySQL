import { useState, useCallback } from 'react';
import { ApolloError } from '@apollo/client';
import { shouldShowDatabaseErrorPage, getGraphQLErrorMessage } from '../utils/graphqlErrorHandler';

/**
 * Database Error Handler Hook
 * Provides state and functions to handle database connection errors
 */
export const useDatabaseErrorHandler = () => {
  const [showDatabaseError, setShowDatabaseError] = useState(false);
  const [databaseErrorMessage, setDatabaseErrorMessage] = useState<string>('');

  /**
   * Handle GraphQL error and determine if database error page should be shown
   * @param error - Apollo GraphQL error
   */
  const handleError = useCallback((error: ApolloError) => {
    if (shouldShowDatabaseErrorPage(error)) {
      setDatabaseErrorMessage(getGraphQLErrorMessage(error));
      setShowDatabaseError(true);
      return true; // Error was handled
    }
    return false; // Error was not handled
  }, []);

  /**
   * Handle generic error (string or Error object)
   * @param error - Error string or Error object
   */
  const handleGenericError = useCallback((error: any) => {
    const errorMessage = typeof error === 'string' ? error : error.message || '';
    
    if (errorMessage.includes('max_connections_per_hour') ||
        errorMessage.includes('Too many connections') ||
        errorMessage.includes('Connection limit exceeded')) {
      setDatabaseErrorMessage('Database connection limit exceeded. Please try again in a few minutes.');
      setShowDatabaseError(true);
      return true; // Error was handled
    }
    
    return false; // Error was not handled
  }, []);

  /**
   * Clear database error state
   */
  const clearError = useCallback(() => {
    setShowDatabaseError(false);
    setDatabaseErrorMessage('');
  }, []);

  /**
   * Retry action - clears error and allows retry
   */
  const handleRetry = useCallback(() => {
    clearError();
    // Optionally refresh the page or retry the operation
    window.location.reload();
  }, [clearError]);

  return {
    showDatabaseError,
    databaseErrorMessage,
    handleError,
    handleGenericError,
    clearError,
    handleRetry,
  };
};
