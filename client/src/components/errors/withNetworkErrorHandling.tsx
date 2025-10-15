import React, { ComponentType, useEffect } from 'react';
import { useNetworkErrorHandler } from '../../hooks/useNetworkErrorHandler';
import NetworkErrorBoundary from './NetworkErrorBoundary';

/**
 * Higher-Order Component for Network Error Handling
 * Wraps components with network error detection and boundary
 * Provides better UX when network errors occur
 */

interface WithNetworkErrorHandlingOptions {
  fallback?: React.ComponentType<any>;
}

/**
 * HOC that adds network error handling to any component
 * @param WrappedComponent - Component to wrap
 * @param options - Configuration options
 * @returns Enhanced component with network error handling
 */
function withNetworkErrorHandling<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithNetworkErrorHandlingOptions = {}
) {
  const WithNetworkErrorHandlingComponent = (props: P) => {
    // This component will be used inside NetworkErrorBoundary
    return <WrappedComponent {...props} />;
  };

  // Wrap with NetworkErrorBoundary
  const NetworkErrorWrappedComponent = (props: P) => {
    return (
      <NetworkErrorBoundary fallback={options.fallback ? <options.fallback /> : undefined}>
        <WithNetworkErrorHandlingComponent {...props} />
      </NetworkErrorBoundary>
    );
  };

  // Set display name for debugging
  NetworkErrorWrappedComponent.displayName = `withNetworkErrorHandling(${WrappedComponent.displayName || WrappedComponent.name})`;

  return NetworkErrorWrappedComponent;
}

/**
 * Hook-based network error handling for functional components
 * Use this when you need more control over error handling
 */
export const useNetworkErrorBoundary = () => {
  const { hasNetworkError, error, retry } = useNetworkErrorHandler();

  useEffect(() => {
    if (hasNetworkError && error) {
      // Throw error to trigger error boundary
      throw error;
    }
  }, [hasNetworkError, error]);

  return { retry };
};

export default withNetworkErrorHandling;
