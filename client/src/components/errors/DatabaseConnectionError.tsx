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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900 mb-6">
            <FaDatabase className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>

          {/* Error Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Database Connection Limit Reached
          </h1>

          {/* Error Description */}
          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <p className="text-lg">
              We're experiencing high traffic right now, and our database has reached its connection limit.
            </p>

            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <div className="flex items-start">
                <FaExclamationTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                    What's happening?
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Our database allows 500 connections per hour per user. This limit helps ensure
                    fair usage and system stability for all users.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <div className="flex items-start">
                <FaClock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                    When will this be resolved?
                  </p>
                  <p className="text-blue-700 dark:text-blue-300">
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
              className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
            >
              Go to Homepage
            </button>
          </div>

          {/* Technical Details (Collapsible) */}
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Technical Details
            </summary>
            <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400 font-mono">
              {error || 'Database connection limit exceeded (max_connections_per_hour: 500)'}
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default DatabaseConnectionError;
