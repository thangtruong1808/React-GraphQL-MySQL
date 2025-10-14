import React from 'react';
import { FaDatabase, FaExclamationTriangle, FaClock, FaRedo } from 'react-icons/fa';

/**
 * Database Connection Error Component
 * Displays a friendly error page when database connection limits are exceeded
 * Provides clear explanation and helpful actions for users
 */
interface DatabaseConnectionErrorProps {
  error?: string;
  onRetry?: () => void;
}

const DatabaseConnectionError: React.FC<DatabaseConnectionErrorProps> = ({
  error,
  onRetry
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
            <FaDatabase className="h-10 w-10 text-red-600" />
          </div>

          {/* Error Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Database Connection Limit Reached
          </h1>

          {/* Error Description */}
          <div className="space-y-4 text-gray-600">
            <p className="text-lg">
              We're experiencing high traffic right now, and our database has reached its connection limit.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <FaExclamationTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 mb-1">
                    What's happening?
                  </p>
                  <p className="text-yellow-700">
                    Our database allows 500 connections per hour per user. This limit helps ensure
                    fair usage and system stability for all users.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <FaClock className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 mb-1">
                    When will this be resolved?
                  </p>
                  <p className="text-blue-700">
                    The connection limit resets every hour. You can try again in a few minutes,
                    or contact support if you need immediate assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            {onRetry && (
              <button
                onClick={onRetry}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
              >
                <FaRedo className="h-4 w-4 mr-2" />
                Try Again
              </button>
            )}

            <button
              onClick={() => window.location.href = '/'}
              className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
            >
              Go to Homepage
            </button>
          </div>

          {/* Technical Details (Collapsible) */}
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Technical Details
            </summary>
            <div className="mt-2 p-3 bg-gray-100 rounded-lg text-xs text-gray-600 font-mono">
              {error || 'Database connection limit exceeded (max_connections_per_hour: 500)'}
            </div>
          </details>

          {/* Support Information */}
          <div className="mt-8 text-sm text-gray-500">
            <p>
              Need help? Contact our support team at{' '}
              <a
                href="mailto:support@example.com"
                className="text-purple-600 hover:text-purple-700 transition-colors"
              >
                support@example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseConnectionError;
