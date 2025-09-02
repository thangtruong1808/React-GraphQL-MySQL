import React, { useState, useEffect, useCallback } from 'react';
import { TokenManager, getTokens } from '../../../utils/tokenManager';
import { AUTH_CONFIG } from '../../../constants/auth';
import { ACTIVITY_CONFIG } from '../../../constants/activity';
import { DEBUG_CONFIG } from '../../../constants/debug';

/**
 * Timer State Interface
 * Simplified structure focusing on access token and activity timers
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
  transitions: {
    isContinueToWorkTransition: boolean;
    isLogoutTransition: boolean;
    isRefreshOperationInProgress: boolean;
  };
}

/**
 * Timer Calculator Component
 * Displays simplified timer information for debugging
 * Focuses on access token and activity-based timers
 */
export const TimerCalculator: React.FC = () => {
  const [timerInfo, setTimerInfo] = useState<TimerState>({
    accessToken: { expiry: null, timeRemaining: null, isExpired: false },
    activity: { expiry: null, timeRemaining: null, isExpired: false },
    lastActivity: null,
    isUserInactive: false,
    transitions: {
      isContinueToWorkTransition: false,
      isLogoutTransition: false,
      isRefreshOperationInProgress: false
    }
  });

  // Calculate and display timer information
  const calculateTimers = useCallback(async () => {
    try {
      // Get current tokens and activity status
      const tokens = getTokens();
      const lastActivityTime = TokenManager.getLastActivityTime();
      const isUserInactive = TokenManager.isUserInactive(ACTIVITY_CONFIG.INACTIVITY_THRESHOLD);

      // Calculate access token expiry (if available)
      let accessTokenExpiry: number | null = null;
      let accessTokenTimeRemaining: number | null = null;

      if (tokens.accessToken) {
        accessTokenExpiry = TokenManager.getTokenExpiration(tokens.accessToken);
        if (accessTokenExpiry) {
          accessTokenTimeRemaining = Math.max(0, accessTokenExpiry - Date.now());
        }
      }

      // Calculate activity-based token expiry
      const activityExpiry = TokenManager.getActivityBasedTokenExpiry();
      const activityTimeRemaining = activityExpiry ? Math.max(0, activityExpiry - Date.now()) : null;

      // Get transition states
      const isContinueToWorkTransition = TokenManager.getContinueToWorkTransition();
      const isLogoutTransition = TokenManager.getLogoutTransition();
      const isRefreshOperationInProgress = TokenManager.getRefreshOperationInProgress();

      // Update state with calculated values
      setTimerInfo({
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
        isUserInactive,
        transitions: {
          isContinueToWorkTransition,
          isLogoutTransition,
          isRefreshOperationInProgress
        }
      });
    } catch (error) {
      // Error calculating timers - log for debugging
      if (DEBUG_CONFIG.ENABLE_ERROR_LOGGING) {
        console.error('TimerCalculator: Error calculating timers', error);
      }
    }
  }, []);

  // Update timers periodically
  useEffect(() => {
    const interval = setInterval(calculateTimers, 1000); // Update every second
    return () => clearInterval(interval);
  }, [calculateTimers]);

  // Initial calculation
  useEffect(() => {
    calculateTimers();
  }, [calculateTimers]);

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
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Timer Calculator</h3>

      {/* Access Token Timer */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Access Token</h4>
        <div className="space-y-1 text-sm">
          <div>Expiry: {formatTimestamp(timerInfo.accessToken.expiry)}</div>
          <div>Time Remaining: {formatTimeRemaining(timerInfo.accessToken.timeRemaining)}</div>
          <div>Status: {timerInfo.accessToken.isExpired ? 'Expired' : 'Valid'}</div>
        </div>
      </div>

      {/* Activity Timer */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Activity Timer</h4>
        <div className="space-y-1 text-sm">
          <div>Expiry: {formatTimestamp(timerInfo.activity.expiry)}</div>
          <div>Time Remaining: {formatTimeRemaining(timerInfo.activity.timeRemaining)}</div>
          <div>Status: {timerInfo.activity.isExpired ? 'Expired' : 'Valid'}</div>
        </div>
      </div>

      {/* Activity Status */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Activity Status</h4>
        <div className="space-y-1 text-sm">
          <div>Last Activity: {formatTimestamp(timerInfo.lastActivity)}</div>
          <div>User Inactive: {timerInfo.isUserInactive ? 'Yes' : 'No'}</div>
        </div>
      </div>

      {/* Transition States */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Transition States</h4>
        <div className="space-y-1 text-sm">
          <div>Continue to Work: {timerInfo.transitions.isContinueToWorkTransition ? 'Active' : 'Inactive'}</div>
          <div>Logout: {timerInfo.transitions.isLogoutTransition ? 'Active' : 'Inactive'}</div>
          <div>Refresh Operation: {timerInfo.transitions.isRefreshOperationInProgress ? 'Active' : 'Inactive'}</div>
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
