import { onError } from '@apollo/client/link/error';
import { ApolloError } from '@apollo/client';

/**
 * Network Error Link for Apollo Client
 * Handles network errors and triggers error boundary
 * Provides better UX for network-related issues
 */

/**
 * Custom error handler for network errors
 * @param error - Apollo Client error
 */
const handleNetworkError = (error: ApolloError) => {
  // Check if it's a network error
  const isNetworkError = error.networkError || 
    error.message.toLowerCase().includes('networkerror when attempting to fetch resource') ||
    error.message.toLowerCase().includes('failed to fetch') ||
    error.message.toLowerCase().includes('network request failed');

  if (isNetworkError) {
    // Store error in sessionStorage to be picked up by error boundary
    try {
      sessionStorage.setItem('apollo-network-error', JSON.stringify({
        message: error.message,
        networkError: error.networkError,
        timestamp: Date.now()
      }));
    } catch (e) {
      // Ignore sessionStorage errors
    }

    // Throw error to trigger error boundary
    throw error;
  }
};

/**
 * Network error link for Apollo Client
 * Catches network errors and provides custom handling
 */
export const networkErrorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  // Handle GraphQL errors
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  // Handle network errors
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // Create Apollo error object
    const apolloError = new ApolloError({
      graphQLErrors,
      networkError,
      errorMessage: networkError.message || 'Network error occurred'
    });

    // Handle network error
    handleNetworkError(apolloError);
  }
});
