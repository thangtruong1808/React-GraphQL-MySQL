import React from 'react';
import { TimerState } from './TimerCalculator';
import {
  ACTIVITY_DEBUGGER_MESSAGES,
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
  const {
    refreshTokenExpiry,
    refreshTokenTimeRemaining
  } = timerState;

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

  // Determine status color based on time remaining using theme variables
  const getStatusColor = (timeRemaining: number | null): React.CSSProperties => {
    if (!timeRemaining || timeRemaining <= 0) {
      return { color: 'var(--error-text, #991b1b)' };
    }
    if (timeRemaining < 10 * 1000) { // Less than 10 seconds
      return { color: 'var(--error-text, #991b1b)' };
    }
    if (timeRemaining < 30 * 1000) { // Less than 30 seconds
      return { color: '#ca8a04' }; // yellow-600 equivalent
    }
    return { color: 'var(--success-text, #166534)' };
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



  const statusColor = getStatusColor(refreshTokenTimeRemaining);

  return (
    <div 
      className="mt-4"
      style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}
    >
      <div 
        className="text-xs font-semibold mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        Refresh Token Debug Info (1min countdown)
      </div>

      <div className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
        {/* Status */}
        <div className="flex justify-between">
          <span style={{ color: 'var(--text-primary)' }}>Status:</span>
          <span className="font-mono" style={statusColor}>
            {getStatusMessage(refreshTokenTimeRemaining)}
          </span>
        </div>

        {/* Expiry Time */}
        <div className="flex justify-between">
          <span style={{ color: 'var(--text-primary)' }}>Expires At:</span>
          <span className="font-mono">
            {formatExpiryTime(refreshTokenExpiry)}
          </span>
        </div>

        {/* Current Time */}
        <div className="flex justify-between">
          <span style={{ color: 'var(--text-primary)' }}>Current Time:</span>
          <span className="font-mono">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RefreshTokenInfo;
