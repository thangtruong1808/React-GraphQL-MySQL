/**
 * GraphQL Error Handler Utilities
 * Provides functions to handle GraphQL errors, especially database connection errors
 */

import { ApolloError } from '@apollo/client';
import { isDatabaseConnectionError, getDatabaseErrorMessage } from './errorDetection';

/**
 * Check if a GraphQL error is a database connection error
 * @param error - Apollo GraphQL error
 * @returns boolean indicating if it's a database connection error
 */
export const isGraphQLDatabaseError = (error: ApolloError): boolean => {
  if (!error) return false;
  
  // Check network error
  if (error.networkError) {
    return isDatabaseConnectionError(error.networkError);
  }
  
  // Check GraphQL errors
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    return error.graphQLErrors.some(graphQLError => 
      isDatabaseConnectionError(graphQLError.message)
    );
  }
  
  return false;
};

/**
 * Get user-friendly error message from GraphQL error
 * @param error - Apollo GraphQL error
 * @returns string with user-friendly error message
 */
export const getGraphQLErrorMessage = (error: ApolloError): string => {
  if (!error) return 'An unexpected error occurred';
  
  // Handle database connection errors
  if (isGraphQLDatabaseError(error)) {
    return getDatabaseErrorMessage(error);
  }
  
  // Handle network errors
  if (error.networkError) {
    return 'Network error. Please check your connection and try again.';
  }
  
  // Handle GraphQL errors
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    const firstError = error.graphQLErrors[0];
    return firstError.message || 'A server error occurred';
  }
  
  return error.message || 'An unexpected error occurred';
};

/**
 * Check if error should trigger database error page
 * @param error - Apollo GraphQL error
 * @returns boolean indicating if database error page should be shown
 */
export const shouldShowDatabaseErrorPage = (error: ApolloError): boolean => {
  return isGraphQLDatabaseError(error);
};
