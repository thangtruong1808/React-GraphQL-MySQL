import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AUTH_CONFIG } from '../../constants/auth';

interface SessionExpiryModalProps {
  isOpen: boolean;
  message: string;
  onRefresh: () => Promise<boolean>;
  onLogout: () => Promise<void>;
}

/**
 * Session Expiry Modal Component
 * Displays when access token expires but refresh token is still valid
 * Gives users options to continue working or logout
 * Enhanced with progress bar for better user experience
 * 
 * CALLED BY: AuthContext when access token expires
 * SCENARIOS: Access token expiry with valid refresh token
 */
const SessionExpiryModal: React.FC<SessionExpiryModalProps> = ({
  isOpen,
  message,
  onRefresh,
  onLogout,
}) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  // Progress bar animation during refresh
  React.useEffect(() => {
    if (isRefreshing) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev; // Stop at 90% until operation completes
          // Use progress bar duration for animation (reduced buffer time for better UX)
          const progressDuration = AUTH_CONFIG.PROGRESS_BAR_DURATION + 2000; // 2 seconds buffer for animation
          return prev + (90 / (progressDuration / 100)); // Animate over buffer time + progress duration
        });
      }, 100);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isRefreshing]);

  // Handle continue working button click
  const handleContinueWorking = async () => {
    setIsRefreshing(true);
    try {
      // Immediately show loading state to prevent user confusion
      const success = await onRefresh();
      if (success) {
        setProgress(100); // Complete the progress bar
        // Small delay to show completion
        await new Promise(resolve => setTimeout(resolve, 200));
      } else {
        // If refresh fails, logout
        await handleLogout();
      }
    } catch (error) {
      // Error refreshing session - show error and logout
      await handleLogout();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle logout button click
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await onLogout();
    } catch (error) {
      console.error('❌ Error during logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">Session Expired</h3>
          </div>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        {/* Progress Bar (only show during refresh) */}
        {isRefreshing && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Refreshing session... {Math.round(progress)}%
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          {/* Continue Working Button */}
          <button
            onClick={handleContinueWorking}
            disabled={isRefreshing || isLoggingOut}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isRefreshing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Refreshing...
              </div>
            ) : (
              'Continue to Work'
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isRefreshing || isLoggingOut}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoggingOut ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Logging out...
              </div>
            ) : (
              'Logout'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiryModal; 