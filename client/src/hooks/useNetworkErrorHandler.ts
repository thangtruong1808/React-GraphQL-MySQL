import { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

/**
 * Network Error Handler Hook
 * Detects network errors and provides state management for error boundaries
 * Integrates with Apollo Client error handling
 */

interface NetworkErrorState {
  hasNetworkError: boolean;
  error: ApolloError | null;
  retry: () => void;
}

/**
 * Hook to handle network errors from Apollo Client
 * @param error - Apollo Client error object
 * @returns Network error state and retry function
 */
export const useNetworkErrorHandler = (error?: ApolloError | null): NetworkErrorState => {
  const [hasNetworkError, setHasNetworkError] = useState(false);
  const [networkError, setNetworkError] = useState<ApolloError | null>(null);

  // Check if error is network-related
  const isNetworkError = (error: ApolloError): boolean => {
    // Check for network error in error message
    const networkErrorMessages = [
      'NetworkError when attempting to fetch resource',
      'Failed to fetch',
      'Network request failed',
      'Connection refused',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ENOTFOUND',
      'Network Error',
      'fetch is not defined',
      'The network connection was lost'
    ];

    const errorMessage = error.message.toLowerCase();
    const isNetwork = networkErrorMessages.some(msg => errorMessage.includes(msg.toLowerCase()));

    // Also check for network error in networkError property
    return isNetwork || !!error.networkError;
  };

  // Handle error changes
  useEffect(() => {
    if (error && isNetworkError(error)) {
      setHasNetworkError(true);
      setNetworkError(error);
    } else if (!error) {
      setHasNetworkError(false);
      setNetworkError(null);
    }
  }, [error]);

  // Retry function
  const retry = () => {
    setHasNetworkError(false);
    setNetworkError(null);
  };

  return {
    hasNetworkError,
    error: networkError,
    retry
  };
};

/**
 * Hook to detect if the application is online/offline
 * @returns Online status and network change handler
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
};
