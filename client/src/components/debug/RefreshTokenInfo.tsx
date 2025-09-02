import React from 'react';

/**
 * Timer State Interface
 * Simplified structure for timer information
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
 * Refresh Token Info Component
 * Displays refresh token information for debugging
 * Note: Refresh tokens are now handled server-side via httpOnly cookies
 */
interface RefreshTokenInfoProps {
  timerState: TimerState;
}

export const RefreshTokenInfo: React.FC<RefreshTokenInfoProps> = ({ timerState }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
      <h4 className="text-lg font-medium text-yellow-800 mb-2">Refresh Token Info</h4>
      <div className="text-sm text-yellow-700">
        <p className="mb-2">
          <strong>Note:</strong> Refresh tokens are now handled server-side via httpOnly cookies for enhanced security.
        </p>
        <div className="space-y-1">
          <div>Access Token Status: {timerState.accessToken.isExpired ? 'Expired' : 'Valid'}</div>
          <div>Activity Token Status: {timerState.activity.isExpired ? 'Expired' : 'Valid'}</div>
          <div>User Inactive: {timerState.isUserInactive ? 'Yes' : 'No'}</div>
        </div>
        <p className="mt-2 text-xs">
          Client-side refresh token management has been simplified since the server automatically validates
          refresh tokens from httpOnly cookies on every request.
        </p>
      </div>
    </div>
  );
};
