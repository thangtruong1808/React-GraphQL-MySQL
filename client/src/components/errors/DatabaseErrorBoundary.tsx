import React, { Component, ErrorInfo, ReactNode } from 'react';
import { DatabaseConnectionError } from './index';
import { isDatabaseConnectionError } from '../../utils/errorDetection';

/**
 * Database Error Boundary Props
 */
interface DatabaseErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * Database Error Boundary State
 */
interface DatabaseErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  isDatabaseError: boolean;
}

/**
 * Database Error Boundary Component
 * Catches database connection errors and displays a friendly error page
 * Falls back to default error handling for other types of errors
 */
class DatabaseErrorBoundary extends Component<
  DatabaseErrorBoundaryProps,
  DatabaseErrorBoundaryState
> {
  constructor(props: DatabaseErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isDatabaseError: false,
    };
  }

  /**
   * Handle component errors
   * Determines if the error is database-related
   */
  static getDerivedStateFromError(error: Error): DatabaseErrorBoundaryState {
    return {
      hasError: true,
      error,
      isDatabaseError: isDatabaseConnectionError(error),
    };
  }

  /**
   * Log error information
   * Called after an error has been thrown by a descendant component
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Handle retry action
   * Resets the error boundary state
   */
  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      isDatabaseError: false,
    });
  };

  /**
   * Render error UI or children
   */
  render() {
    if (this.state.hasError) {
      // If it's a database error, show the database error page
      if (this.state.isDatabaseError) {
        return (
          <DatabaseConnectionError
            error={this.state.error?.message}
            onRetry={this.handleRetry}
          />
        );
      }

      // For other errors, show custom fallback or default error
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error fallback
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={this.handleRetry}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DatabaseErrorBoundary;
