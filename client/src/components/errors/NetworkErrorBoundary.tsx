import React, { Component, ReactNode } from 'react';
import { FaWifi, FaExclamationTriangle, FaSync } from 'react-icons/fa';

/**
 * Network Error Boundary Component
 * Catches network errors and displays a friendly message instead of toast errors
 * Provides better UX when server is down or network issues occur
 */

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isNetworkError: boolean;
}

class NetworkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isNetworkError: false
    };
  }

  // Handle component errors and network issues
  static getDerivedStateFromError(error: Error): State {
    // Check if it's a network-related error
    const isNetworkError = NetworkErrorBoundary.isNetworkError(error);

    return {
      hasError: true,
      error,
      isNetworkError
    };
  }

  // Check if error is network-related
  static isNetworkError(error: Error): boolean {
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
    return networkErrorMessages.some(msg => errorMessage.includes(msg.toLowerCase()));
  }

  // Handle retry button click
  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      isNetworkError: false
    });
  };

  // Handle page refresh
  handleRefresh = () => {
    window.location.reload();
  };

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('NetworkErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // If custom fallback provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Render friendly network error message
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              {/* Network Error Icon */}
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                {this.state.isNetworkError ? (
                  <FaWifi className="h-10 w-10 text-red-600" />
                ) : (
                  <FaExclamationTriangle className="h-10 w-10 text-red-600" />
                )}
              </div>

              {/* Error Title */}
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {this.state.isNetworkError ? 'Connection Problem' : 'Something Went Wrong'}
              </h2>

              {/* Error Message */}
              <div className="text-gray-600 mb-8">
                {this.state.isNetworkError ? (
                  <div className="space-y-3">
                    <p className="text-lg">
                      We're having trouble connecting to our servers.
                    </p>
                    <p className="text-sm">
                      This might be because:
                    </p>
                    <ul className="text-sm text-left max-w-xs mx-auto space-y-1">
                      <li>• The server is temporarily down</li>
                      <li>• Your internet connection is unstable</li>
                      <li>• There's a network configuration issue</li>
                    </ul>
                  </div>
                ) : (
                  <p className="text-lg">
                    An unexpected error occurred. Please try again or contact support if the problem persists.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <FaSync className="w-4 h-4 mr-2" />
                  Try Again
                </button>

                <button
                  onClick={this.handleRefresh}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <FaSync className="w-4 h-4 mr-2" />
                  Refresh Page
                </button>
              </div>

              {/* Additional Help */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  Need Help?
                </h3>
                <p className="text-sm text-blue-700">
                  If this problem continues, please check your internet connection and try again.
                  You can also contact our support team for assistance.
                </p>
              </div>

              {/* Technical Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                    Technical Details (Development)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-800 overflow-auto">
                    <div><strong>Error:</strong> {this.state.error.message}</div>
                    <div><strong>Type:</strong> {this.state.error.name}</div>
                    {this.state.error.stack && (
                      <div className="mt-2">
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default NetworkErrorBoundary;
