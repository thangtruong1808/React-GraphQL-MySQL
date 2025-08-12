import React from 'react';
import { TimerState } from './TimerCalculator';
import {
  ACTIVITY_DEBUGGER_LAYOUT,
  ACTIVITY_DEBUGGER_MESSAGES,
  ACTIVITY_DEBUGGER_COLORS,
} from '../../constants/activityDebugger';

/**
 * Refresh Token Info Props Interface
 * Defines props for the RefreshTokenInfo component
 */
interface RefreshTokenInfoProps {
  timerState: TimerState;
}

/**
 * Refresh Token Info Component
 * Displays detailed refresh token information for debugging
 * Shows timing information and status for refresh token operations
 */
const RefreshTokenInfo: React.FC<RefreshTokenInfoProps> = ({ timerState }) => {
  const { refreshTokenExpiry, refreshTokenTimeRemaining } = timerState;

  // Format time remaining for display
  const formatTimeRemaining = (timeRemaining: number | null): string => {
    if (!timeRemaining || timeRemaining <= 0) {
      return '0m 0s';
    }
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  // Format expiry timestamp for display
  const formatExpiryTime = (expiry: number | null): string => {
    if (!expiry) {
      return ACTIVITY_DEBUGGER_MESSAGES.NOT_AVAILABLE;
    }
    return new Date(expiry).toLocaleTimeString();
  };

  // Determine status color based on time remaining
  const getStatusColor = (timeRemaining: number | null): string => {
    if (!timeRemaining || timeRemaining <= 0) {
      return ACTIVITY_DEBUGGER_COLORS.DANGER;
    }
    if (timeRemaining < 10 * 1000) { // Less than 10 seconds
      return ACTIVITY_DEBUGGER_COLORS.DANGER;
    }
    if (timeRemaining < 30 * 1000) { // Less than 30 seconds
      return ACTIVITY_DEBUGGER_COLORS.WARNING;
    }
    return ACTIVITY_DEBUGGER_COLORS.SUCCESS;
  };

  // Get status message based on time remaining
  const getStatusMessage = (timeRemaining: number | null): string => {
    if (!timeRemaining || timeRemaining <= 0) {
      return 'Expired';
    }
    if (timeRemaining < 10 * 1000) {
      return 'Critical - Too close to expiry';
    }
    if (timeRemaining < 30 * 1000) {
      return 'Warning - Close to expiry';
    }
    return 'Valid';
  };

  // Only show refresh token info if there's actually a refresh token timer active
  if (!refreshTokenExpiry || !refreshTokenTimeRemaining || refreshTokenTimeRemaining <= 0) {
    return null;
  }

  return (
    <div className={`${ACTIVITY_DEBUGGER_LAYOUT.SECTION_BORDER} mt-4`}>
      <div className={`${ACTIVITY_DEBUGGER_LAYOUT.HEADER_TEXT} mb-2`}>
        Refresh Token Debug Info (2min countdown)
      </div>

      <div className={`space-y-2 ${ACTIVITY_DEBUGGER_LAYOUT.SMALL_TEXT}`}>
        {/* Time Remaining */}
        <div className="flex justify-between">
          <span>Time Remaining:</span>
          <span className={`font-mono ${getStatusColor(refreshTokenTimeRemaining)}`}>
            {formatTimeRemaining(refreshTokenTimeRemaining)}
          </span>
        </div>

        {/* Status */}
        <div className="flex justify-between">
          <span>Status:</span>
          <span className={`font-mono ${getStatusColor(refreshTokenTimeRemaining)}`}>
            {getStatusMessage(refreshTokenTimeRemaining)}
          </span>
        </div>

        {/* Expiry Time */}
        <div className="flex justify-between">
          <span>Expires At:</span>
          <span className="font-mono">
            {formatExpiryTime(refreshTokenExpiry)}
          </span>
        </div>

        {/* Current Time */}
        <div className="flex justify-between">
          <span>Current Time:</span>
          <span className="font-mono">
            {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Debug Information */}
        {refreshTokenTimeRemaining && refreshTokenTimeRemaining < 30 * 1000 && (
          <div className={`mt-3 p-2 rounded ${ACTIVITY_DEBUGGER_COLORS.WARNING_BACKGROUND} ${ACTIVITY_DEBUGGER_COLORS.WARNING_TEXT}`}>
            <div className="text-xs font-medium mb-1">⚠️ Debug Info:</div>
            <div className="text-xs space-y-1">
              <div>• Time remaining: {Math.ceil(refreshTokenTimeRemaining / 1000)}s</div>
              <div>• Minimum refresh time: 10s</div>
              <div>• Can refresh: {refreshTokenTimeRemaining >= 10 * 1000 ? 'Yes' : 'No'}</div>
              <div>• Status: {getStatusMessage(refreshTokenTimeRemaining)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RefreshTokenInfo;
