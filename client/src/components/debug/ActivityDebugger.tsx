import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTokens, TokenManager, isUserInactive, getLastActivityTime, getActivityBasedTokenExpiry } from '../../utils/tokenManager';
import { AUTH_CONFIG, UI_CONFIG } from '../../constants';

/**
 * Activity Debugger Component
 * Displays real-time information about authentication status and activity tracking
 * Useful for debugging and verifying the activity tracking system
 * 
 * NOTE: This component should only be used in development mode
 */
const ActivityDebugger: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  // Update debug information every second
  useEffect(() => {
    const updateDebugInfo = () => {
      try {
        const tokens = getTokens();
        const accessTokenExpiry = tokens.accessToken ? TokenManager.getTokenExpiration(tokens.accessToken) : null;
        const now = Date.now();

        // Get last activity time from TokenManager (stored in memory)
        const lastActivityTime = getLastActivityTime();
        const timeSinceLastActivity = lastActivityTime ? now - lastActivityTime : null;
        const isUserCurrentlyInactive = isUserInactive(AUTH_CONFIG.INACTIVITY_THRESHOLD);

        // Get activity-based token expiry information
        const activityBasedTokenExpiry = getActivityBasedTokenExpiry();
        const timeUntilActivityBasedExpiry = activityBasedTokenExpiry ? Math.max(0, activityBasedTokenExpiry - now) : 'N/A';

        // Calculate activity status
        let activityStatus = 'Unknown';
        let activityStatusColor = 'text-gray-600';

        if (lastActivityTime) {
          if (isUserCurrentlyInactive) {
            activityStatus = 'Inactive';
            activityStatusColor = 'text-red-600';
          } else {
            activityStatus = 'Active';
            activityStatusColor = 'text-green-600';
          }
        } else {
          activityStatus = 'No Activity';
          activityStatusColor = 'text-yellow-600';
        }

        setDebugInfo({
          isAuthenticated,
          isLoading,
          hasAccessToken: !!tokens.accessToken,
          hasRefreshToken: !!tokens.refreshToken,
          accessTokenExpiry: accessTokenExpiry ? new Date(accessTokenExpiry).toLocaleTimeString() : 'N/A',
          timeUntilAccessTokenExpiry: accessTokenExpiry ? Math.max(0, accessTokenExpiry - now) : 'N/A',
          activityBasedTokenExpiry: activityBasedTokenExpiry ? new Date(activityBasedTokenExpiry).toLocaleTimeString() : 'N/A',
          timeUntilActivityBasedExpiry: timeUntilActivityBasedExpiry,
          currentTime: new Date().toLocaleTimeString(),
          userEmail: user?.email || 'N/A',
          userRole: user?.role || 'N/A',
          lastActivityTime: lastActivityTime ? new Date(lastActivityTime).toLocaleTimeString() : 'N/A',
          timeSinceLastActivity: timeSinceLastActivity ? Math.floor(timeSinceLastActivity / 1000) : 'N/A',
          activityStatus,
          activityStatusColor,
          isUserCurrentlyInactive,
        });
      } catch (error) {
        console.error('Error updating debug info:', error);
      }
    };

    // Update immediately
    updateDebugInfo();

    // Update every second
    const interval = setInterval(updateDebugInfo, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, isLoading, user]);

  // Only show in development mode
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        {isVisible ? 'Hide' : 'Show'} Debug
      </button>

      {/* Debug Panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Activity Debugger</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className={`font-mono ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                {isLoading ? 'Loading...' : isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">User:</span>
              <span className="font-mono text-gray-600">{debugInfo.userEmail}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Role:</span>
              <span className="font-mono text-gray-600">{debugInfo.userRole}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Activity Status:</span>
              <span className={`font-mono ${debugInfo.activityStatusColor}`}>
                {debugInfo.activityStatus}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Last Activity:</span>
              <span className="font-mono text-gray-600">{debugInfo.lastActivityTime}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Time Since Activity:</span>
              <span className={`font-mono ${typeof debugInfo.timeSinceLastActivity === 'number'
                ? debugInfo.timeSinceLastActivity >= AUTH_CONFIG.INACTIVITY_THRESHOLD / 1000
                  ? 'text-red-600'
                  : debugInfo.timeSinceLastActivity >= (AUTH_CONFIG.INACTIVITY_THRESHOLD / 1000) * 0.8
                    ? 'text-yellow-600'
                    : 'text-green-600'
                : 'text-gray-600'
                }`}>
                {typeof debugInfo.timeSinceLastActivity === 'number'
                  ? `${debugInfo.timeSinceLastActivity}s`
                  : debugInfo.timeSinceLastActivity
                }
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Access Token:</span>
              <span className={`font-mono ${debugInfo.hasAccessToken ? 'text-green-600' : 'text-red-600'}`}>
                {debugInfo.hasAccessToken ? 'Present' : 'Missing'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Refresh Token:</span>
              <span className={`font-mono ${debugInfo.hasRefreshToken ? 'text-green-600' : 'text-red-600'}`}>
                {debugInfo.hasRefreshToken ? 'Present' : 'Missing'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Token Expires:</span>
              <span className="font-mono text-gray-600">{debugInfo.accessTokenExpiry}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Time Until Expiry:</span>
              <span className={`font-mono ${typeof debugInfo.timeUntilAccessTokenExpiry === 'number'
                ? debugInfo.timeUntilAccessTokenExpiry < AUTH_CONFIG.TOKEN_REFRESH_WARNING_THRESHOLD
                  ? 'text-red-600'
                  : debugInfo.timeUntilAccessTokenExpiry < AUTH_CONFIG.TOKEN_REFRESH_CAUTION_THRESHOLD
                    ? 'text-yellow-600'
                    : 'text-green-600'
                : 'text-gray-600'
                }`}>
                {typeof debugInfo.timeUntilAccessTokenExpiry === 'number'
                  ? `${Math.floor(debugInfo.timeUntilAccessTokenExpiry / 1000)}s`
                  : debugInfo.timeUntilAccessTokenExpiry
                }
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Activity-Based Token Expires:</span>
              <span className="font-mono text-gray-600">{debugInfo.activityBasedTokenExpiry}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Time Until Activity-Based Expiry:</span>
              <span className={`font-mono ${typeof debugInfo.timeUntilActivityBasedExpiry === 'number'
                ? debugInfo.timeUntilActivityBasedExpiry < AUTH_CONFIG.TOKEN_REFRESH_WARNING_THRESHOLD
                  ? 'text-red-600'
                  : debugInfo.timeUntilActivityBasedExpiry < AUTH_CONFIG.TOKEN_REFRESH_CAUTION_THRESHOLD
                    ? 'text-yellow-600'
                    : 'text-green-600'
                : 'text-gray-600'
                }`}>
                {typeof debugInfo.timeUntilActivityBasedExpiry === 'number'
                  ? `${Math.floor(debugInfo.timeUntilActivityBasedExpiry / 1000)}s`
                  : debugInfo.timeUntilActivityBasedExpiry
                }
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Current Time:</span>
              <span className="font-mono text-gray-600">{debugInfo.currentTime}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              💡 Move your mouse, type, or click to see activity tracking in action.
              <br />
              🔄 Activity check interval: {AUTH_CONFIG.ACTIVITY_CHECK_INTERVAL / 1000} seconds
              <br />
              ⏰ Inactivity threshold: {AUTH_CONFIG.INACTIVITY_THRESHOLD / 1000 / 60} minute{AUTH_CONFIG.INACTIVITY_THRESHOLD / 1000 / 60 !== 1 ? 's' : ''}
              <br />
              🎯 Activity-based token: {AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED ? 'Enabled' : 'Disabled'}
              <br />
              ⏱️ Activity token expiry: {AUTH_CONFIG.ACTIVITY_TOKEN_EXPIRY / 1000 / 60} minute{AUTH_CONFIG.ACTIVITY_TOKEN_EXPIRY / 1000 / 60 !== 1 ? 's' : ''} from last activity
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ActivityDebugger; 