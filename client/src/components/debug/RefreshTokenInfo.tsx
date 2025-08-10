import React from 'react';
import {
  ACTIVITY_DEBUGGER_LAYOUT,
  ACTIVITY_DEBUGGER_MESSAGES,
  ACTIVITY_DEBUGGER_COLORS
} from '../../constants/activityDebugger';
import { TimerState } from './TimerCalculator';

/**
 * Refresh Token Info Props Interface
 * Defines props for the RefreshTokenInfo component
 */
interface RefreshTokenInfoProps {
  timerState: TimerState;
  className?: string;
}

/**
 * Refresh Token Information Component
 * Displays refresh token expiry information unaffected by user activity
 * Shows fixed countdown timer when refresh token is active
 * 
 * Features:
 * - Fixed refresh token expiry display
 * - Not affected by user activity
 * - Shows time remaining until auto-logout
 * - Color-coded status indicators
 */
const RefreshTokenInfo: React.FC<RefreshTokenInfoProps> = ({
  timerState,
  className = ''
}) => {
  // Format refresh token time remaining
  const formatRefreshTokenTime = (timeRemaining: number | null): string => {
    if (!timeRemaining || timeRemaining <= 0) {
      return 'Expired';
    }

    const seconds = Math.ceil(timeRemaining / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${seconds}s`;
  };

  // Get refresh token status color
  const getRefreshTokenColor = (): string => {
    if (!timerState.refreshTokenTimeRemaining || timerState.refreshTokenTimeRemaining <= 0) {
      return ACTIVITY_DEBUGGER_COLORS.DANGER;
    }

    const seconds = Math.ceil(timerState.refreshTokenTimeRemaining / 1000);
    if (seconds <= 60) { // Last minute
      return ACTIVITY_DEBUGGER_COLORS.DANGER;
    } else if (seconds <= 120) { // Last 2 minutes
      return ACTIVITY_DEBUGGER_COLORS.WARNING;
    }

    return ACTIVITY_DEBUGGER_COLORS.NEUTRAL;
  };

  // Only show if we have refresh token information
  if (!timerState.refreshTokenExpiry && !timerState.refreshTokenTimeRemaining) {
    return null;
  }

  return (
    <div className={`${ACTIVITY_DEBUGGER_LAYOUT.SECTION_BORDER} ${className}`}>
      <div className={`${ACTIVITY_DEBUGGER_LAYOUT.HEADER_TEXT} mb-1`}>
        🔄 REFRESH TOKEN INFO
      </div>

      <div className={`space-y-1 ${ACTIVITY_DEBUGGER_LAYOUT.SMALL_TEXT}`}>
        <div className="flex justify-between">
          <span>Refresh Token Status:</span>
          <span className={`font-mono ${getRefreshTokenColor()}`}>
            {timerState.refreshTokenExpiry ? 'Active' : 'Not Set'}
          </span>
        </div>

        {timerState.refreshTokenExpiry && (
          <div className="flex justify-between">
            <span>Expires At:</span>
            <span className="font-mono text-gray-600">
              {new Date(timerState.refreshTokenExpiry).toLocaleTimeString()}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Time Remaining:</span>
          <span className={`font-mono ${getRefreshTokenColor()}`}>
            {formatRefreshTokenTime(timerState.refreshTokenTimeRemaining || null)}
          </span>
        </div>

        <div className={`mt-2 ${ACTIVITY_DEBUGGER_LAYOUT.SMALL_TEXT} ${ACTIVITY_DEBUGGER_COLORS.NEUTRAL}`}>
          <div>⚠️ Not affected by user activity</div>
          <div>Fixed countdown until auto-logout</div>
        </div>
      </div>
    </div>
  );
};

export default RefreshTokenInfo;
