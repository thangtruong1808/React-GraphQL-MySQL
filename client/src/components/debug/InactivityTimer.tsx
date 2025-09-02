import React, { useState, useEffect, useCallback } from 'react';
import { TokenManager } from '../../utils/tokenManager';
import { AUTH_CONFIG } from '../../constants/auth';
import { ACTIVITY_CONFIG } from '../../constants/activity';
import { DEBUG_CONFIG } from '../../constants/debug';

/**
 * Timer State Interface
 * Simplified structure for inactivity timer
 */
interface TimerState {
  accessToken: {
    expiry: number | null;
    timeRemaining: number | null;
    isExpired: boolean;
  };
  activity: {
    expiry: number | null;
    timeRemaining: number | null;
    isExpired: boolean;
  };
  lastActivity: number | null;
  isUserInactive: boolean;
}

/**
 * Inactivity Timer Component
 * Displays inactivity timer information for debugging
 * Simplified to work with new TokenManager structure
 */
export const InactivityTimer: React.FC = () => {
  const [timerState, setTimerState] = useState<TimerState>({
    accessToken: { expiry: null, timeRemaining: null, isExpired: false },
    activity: { expiry: null, timeRemaining: null, isExpired: false },
    lastActivity: null,
    isUserInactive: false
  });

  // Update timer state periodically
  const updateTimerState = useCallback(async () => {
    try {
      // Get current tokens and activity status
      const tokens = TokenManager.getAccessToken();
      const lastActivityTime = TokenManager.getLastActivityTime();
      const isUserInactive = TokenManager.isUserInactive(ACTIVITY_CONFIG.INACTIVITY_THRESHOLD);

      // Calculate access token expiry (if available)
      let accessTokenExpiry: number | null = null;
      let accessTokenTimeRemaining: number | null = null;

      if (tokens) {
        accessTokenExpiry = TokenManager.getTokenExpiration(tokens);
        if (accessTokenExpiry) {
          accessTokenTimeRemaining = Math.max(0, accessTokenExpiry - Date.now());
        }
      }

      // Calculate activity-based token expiry
      const activityExpiry = TokenManager.getActivityBasedTokenExpiry();
      const activityTimeRemaining = activityExpiry ? Math.max(0, activityExpiry - Date.now()) : null;

      // Update state with calculated values
      setTimerState({
        accessToken: {
          expiry: accessTokenExpiry,
          timeRemaining: accessTokenTimeRemaining,
          isExpired: accessTokenTimeRemaining !== null && accessTokenTimeRemaining <= 0
        },
        activity: {
          expiry: activityExpiry,
          timeRemaining: activityTimeRemaining,
          isExpired: activityTimeRemaining !== null && activityTimeRemaining <= 0
        },
        lastActivity: lastActivityTime,
        isUserInactive
      });
    } catch (error) {
      // Error calculating timer state - log for debugging
      if (DEBUG_CONFIG.ENABLE_ERROR_LOGGING) {
        console.error('InactivityTimer: Error calculating timer state', error);
      }
    }
  }, []);

  // Update timer state periodically
  useEffect(() => {
    const interval = setInterval(updateTimerState, 1000); // Update every second
    return () => clearInterval(interval);
  }, [updateTimerState]);

  // Initial calculation
  useEffect(() => {
    updateTimerState();
  }, [updateTimerState]);

  // Format time remaining for display
  const formatTimeRemaining = (timeRemaining: number | null): string => {
    if (timeRemaining === null) return 'N/A';
    if (timeRemaining <= 0) return 'Expired';

    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: number | null): string => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Inactivity Timer</h3>

      {/* Access Token Timer */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Access Token</h4>
        <div className="space-y-1 text-sm">
          <div>Expiry: {formatTimestamp(timerState.accessToken.expiry)}</div>
          <div>Time Remaining: {formatTimeRemaining(timerState.accessToken.timeRemaining)}</div>
          <div>Status: {timerState.accessToken.isExpired ? 'Expired' : 'Valid'}</div>
        </div>
      </div>

      {/* Activity Timer */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Activity Timer</h4>
        <div className="space-y-1 text-sm">
          <div>Expiry: {formatTimestamp(timerState.activity.expiry)}</div>
          <div>Time Remaining: {formatTimeRemaining(timerState.activity.timeRemaining)}</div>
          <div>Status: {timerState.activity.isExpired ? 'Expired' : 'Valid'}</div>
        </div>
      </div>

      {/* Activity Status */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Activity Status</h4>
        <div className="space-y-1 text-sm">
          <div>Last Activity: {formatTimestamp(timerState.lastActivity)}</div>
          <div>User Inactive: {timerState.isUserInactive ? 'Yes' : 'No'}</div>
        </div>
      </div>

      {/* Configuration Info */}
      <div className="text-xs text-gray-500">
        <div>Access Token Expiry: {AUTH_CONFIG.ACCESS_TOKEN_EXPIRY / 1000}s</div>
        <div>Activity Token Expiry: {ACTIVITY_CONFIG.ACTIVITY_TOKEN_EXPIRY / 1000}s</div>
        <div>Inactivity Threshold: {ACTIVITY_CONFIG.INACTIVITY_THRESHOLD / 1000}s</div>
      </div>
    </div>
  );
};

