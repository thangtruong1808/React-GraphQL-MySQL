import React from 'react';
import { FaWifi, FaSync, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../../constants/routingConstants';

/**
 * Dashboard Network Error Component
 * Specific error display for dashboard pages when network issues occur
 * Provides navigation options and retry functionality
 */

interface DashboardNetworkErrorProps {
  onRetry?: () => void;
}

const DashboardNetworkError: React.FC<DashboardNetworkErrorProps> = ({ onRetry }) => {
  const navigate = useNavigate();

  // Handle retry action
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  // Handle navigation to home
  const handleGoHome = () => {
    navigate(ROUTE_PATHS.HOME);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          {/* Network Error Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <FaWifi className="h-8 w-8 text-red-600" />
          </div>

          {/* Error Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Dashboard Unavailable
          </h2>

          {/* Error Message */}
          <div className="text-gray-600 mb-8">
            <p className="text-lg mb-4">
              We can't connect to our servers right now.
            </p>
            <p className="text-sm text-gray-500">
              This might be due to server maintenance or a temporary network issue.
              Please try again in a few moments.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRetry}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <FaSync className="w-4 h-4 mr-2" />
              Try Again
            </button>

            <button
              onClick={handleGoHome}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <FaHome className="w-4 h-4 mr-2" />
              Go to Home
            </button>
          </div>

          {/* Status Information */}
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="text-sm font-medium text-yellow-900 mb-2">
              What's happening?
            </h3>
            <ul className="text-sm text-yellow-700 text-left space-y-1">
              <li>• Our servers might be temporarily down</li>
              <li>• Network connectivity issues</li>
              <li>• Server maintenance in progress</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="mt-6 text-sm text-gray-500">
            <p>
              If this problem continues, please contact our support team or check our status page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNetworkError;
