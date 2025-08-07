import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTokens, getLastActivityTime, getActivityBasedTokenExpiry } from '../../utils/tokenManager';

/**
 * Authentication Debugger Component
 * Shows current authentication state for debugging purposes
 * Only visible in development mode
 * 
 * CALLED BY: App.tsx in development mode
 * SCENARIOS: Debugging authentication issues
 */
const AuthDebugger: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitializing,
    showLoadingSpinner,
    showSessionExpiryModal
  } = useAuth();

  const tokens = getTokens();
  const lastActivity = getLastActivityTime();
  const activityExpiry = getActivityBasedTokenExpiry();

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <div className="font-bold mb-2">🔍 Auth Debugger</div>

      <div className="space-y-1">
        <div>User: {user ? `${user.firstName} ${user.lastName}` : 'None'}</div>
        <div>Email: {user?.email || 'None'}</div>
        <div>Role: {user?.role || 'None'}</div>
        <div>Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}</div>
        <div>Loading: {isLoading ? '🔄 Yes' : '✅ No'}</div>
        <div>Initializing: {isInitializing ? '🔄 Yes' : '✅ No'}</div>
        <div>Show Spinner: {showLoadingSpinner ? '🔄 Yes' : '✅ No'}</div>
        <div>Session Modal: {showSessionExpiryModal ? '⚠️ Yes' : '✅ No'}</div>
        <div>Access Token: {tokens.accessToken ? '✅ Present' : '❌ Missing'}</div>
        <div>Refresh Token: {tokens.refreshToken ? '✅ Present' : '❌ Missing'}</div>
        <div>Last Activity: {lastActivity ? new Date(lastActivity).toLocaleTimeString() : 'None'}</div>
        <div>Activity Expiry: {activityExpiry ? new Date(activityExpiry).toLocaleTimeString() : 'None'}</div>
      </div>
    </div>
  );
};

export default AuthDebugger; 