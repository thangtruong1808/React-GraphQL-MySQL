import { useCallback, useRef, useEffect } from 'react';
import { AUTH_CONFIG } from '../../constants';
import {
  getTokens,
  isTokenExpired,
  updateActivity,
  isRefreshTokenExpired,
  isUserInactive,
  getActivityBasedTokenExpiry,
  isActivityBasedTokenExpired,
  TokenManager,
  isRefreshTokenNeedsRenewal,
} from '../../utils/tokenManager';

/**
 * Session Manager Interface
 * Defines the structure of session management functions
 */
export interface SessionManager {
  // Session validation
  validateSession: () => Promise<boolean>;
  handleUserActivity: () => Promise<void>;
  
  // Session checking
  checkSessionAndActivity: () => Promise<void>;
  setupActivityTracking: () => void;
  
  // Utilities
  hasRole: (role: string) => boolean;
}

/**
 * Session Manager Hook
 * Manages session validation, activity tracking, and session expiry
 */
export const useSessionManager = (
  user: any,
  isAuthenticated: boolean,
  showSessionExpiryModal: boolean,
  lastModalShowTime: number | null,
  refreshAccessToken: () => Promise<boolean>,
  renewRefreshToken: () => Promise<boolean>,
  performCompleteLogout: () => Promise<void>,
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void,
  setShowSessionExpiryModal: (show: boolean) => void,
  setSessionExpiryMessage: (message: string) => void,
  setLastModalShowTime: (time: number | null) => void,
  setModalAutoLogoutTimer: (timer: NodeJS.Timeout | null) => void,
) => {
  // Timer ref for activity and session checking
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Check session and user activity
   * Runs periodically to manage session based on activity and timeouts
   */
  const checkSessionAndActivity = useCallback(async () => {
    try {
      // Check if refresh token is expired (absolute timeout) - ALWAYS CHECK FIRST
      const refreshTokenExpired = isRefreshTokenExpired();
      console.log('🔍 SESSION CHECK - Refresh token expired:', refreshTokenExpired);

      if (refreshTokenExpired) {
        console.log('🔐 Refresh token expired (absolute timeout), performing logout...');
        setShowSessionExpiryModal(false);
        showNotification('Your session has expired due to inactivity. Please log in again.', 'info');
        await performCompleteLogout();
        return;
      }

      // Check if access token is expired but refresh token is still valid
      const tokens = getTokens();
      if (tokens.accessToken) {
        let isAccessTokenExpired = false;
        if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
          isAccessTokenExpired = isActivityBasedTokenExpired();
        } else {
          isAccessTokenExpired = isTokenExpired(tokens.accessToken);
        }

        console.log('🔍 SESSION CHECK - Access token expired:', isAccessTokenExpired);
        console.log('🔍 SESSION CHECK - Modal currently showing:', showSessionExpiryModal);

        // Show modal only if access token is expired, refresh token is valid, modal is not already showing, and enough time has passed since last show
        const now = Date.now();
        const timeSinceLastShow = lastModalShowTime ? now - lastModalShowTime : Infinity;
        const minTimeBetweenShows = 5000; // 5 seconds minimum between modal shows

        if (isAccessTokenExpired && !refreshTokenExpired && !showSessionExpiryModal && timeSinceLastShow > minTimeBetweenShows) {
          console.log('🔐 Access token expired but refresh token still valid - showing session expiry modal');
          setSessionExpiryMessage('Your session has expired. Click "Continue to Work" to refresh your session or "Logout" to sign in again.');
          setShowSessionExpiryModal(true);
          setLastModalShowTime(now);

          // Start the refresh token expiry timer when access token expires
          TokenManager.startRefreshTokenExpiryTimer();

          // Start automatic logout timer (3 minutes after modal appears)
          const autoLogoutTimer = setTimeout(async () => {
            console.log('🔐 Automatic logout after modal timeout - performing logout...');
            setShowSessionExpiryModal(false);
            showNotification('Session expired due to inactivity. Please log in again.', 'info');
            await performCompleteLogout();
          }, AUTH_CONFIG.MODAL_AUTO_LOGOUT_DELAY);

          setModalAutoLogoutTimer(autoLogoutTimer);

          // Return early to prevent other checks from hiding the modal
          return;
        }

        // If modal is already showing, don't run additional checks that could hide it
        if (showSessionExpiryModal) {
          console.log('🔐 Session expiry modal is already showing - skipping additional checks');
          return;
        }
      }

      // Only run these checks if modal is not showing to prevent auto-hiding
      if (!showSessionExpiryModal) {
        // Check if refresh token needs renewal (proactive renewal for active users)
        if (AUTH_CONFIG.REFRESH_TOKEN_AUTO_RENEWAL_ENABLED && isRefreshTokenNeedsRenewal()) {
          console.log('🔄 Refresh token needs renewal, attempting renewal...');
          const renewalSuccess = await renewRefreshToken();
          if (!renewalSuccess) {
            console.log('❌ Refresh token renewal failed, but continuing session...');
          }
        }

        // Check if activity-based token is expired (when user stops being active)
        if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED && isActivityBasedTokenExpired()) {
          console.log('🔐 Activity-based token expired (user stopped being active), attempting token refresh...');
          const refreshSuccess = await refreshAccessToken();
          if (!refreshSuccess) {
            console.log('🔐 Token refresh failed, performing logout...');
            await performCompleteLogout();
            return;
          }
        }

        // Check if user has been inactive for too long (application-level inactivity)
        if (isUserInactive(AUTH_CONFIG.INACTIVITY_THRESHOLD)) {
          console.log('🔐 User inactive for too long (no application actions), attempting token refresh...');
          const refreshSuccess = await refreshAccessToken();
          if (!refreshSuccess) {
            console.log('🔐 Token refresh failed, performing logout...');
            await performCompleteLogout();
            return;
          }
        }
      }

      // User session is still valid and active - NO TOKEN REFRESH HERE
      // Token refresh is handled by handleUserActivity when actual user activity is detected
    } catch (error) {
      console.error('❌ Error checking session and activity:', error);
      await performCompleteLogout();
    }
  }, [performCompleteLogout, refreshAccessToken, renewRefreshToken, showNotification, showSessionExpiryModal, lastModalShowTime, setShowSessionExpiryModal, setSessionExpiryMessage, setLastModalShowTime, setModalAutoLogoutTimer]);

  /**
   * Set up activity tracking
   * Starts timer to monitor user activity and session timeouts
   */
  const setupActivityTracking = useCallback(() => {
    // Clear existing timer
    if (activityTimerRef.current) {
      clearInterval(activityTimerRef.current);
      activityTimerRef.current = null;
    }

    // Start activity checking timer
    activityTimerRef.current = setInterval(checkSessionAndActivity, AUTH_CONFIG.ACTIVITY_CHECK_INTERVAL);
  }, [checkSessionAndActivity]);

  /**
   * Validate current session
   * Checks if user has valid tokens and is authenticated
   */
  const validateSession = useCallback(async (): Promise<boolean> => {
    try {
      const tokens = getTokens();
      if (!tokens.accessToken) {
        console.log('🔍 No access token found in validateSession, attempting token refresh...');
        const refreshSuccess = await refreshAccessToken();
        return refreshSuccess;
      }

      // Use activity-based token validation if enabled
      if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
        const isExpired = isActivityBasedTokenExpired();
        if (isExpired) {
          console.log('🔍 Activity-based token expired in validateSession, attempting token refresh...');
          const refreshSuccess = await refreshAccessToken();
          return refreshSuccess;
        }
        return true;
      }

      // Fallback to fixed token expiry check
      const isExpired = isTokenExpired(tokens.accessToken);
      if (isExpired) {
        console.log('🔍 Fixed token expired in validateSession, attempting token refresh...');
        const refreshSuccess = await refreshAccessToken();
        return refreshSuccess;
      }
      return true;
    } catch (error) {
      console.error('❌ Error in validateSession:', error);
      return false;
    }
  }, [refreshAccessToken]);

  /**
   * Handle user activity (mouse, keyboard, scroll, etc.)
   * Updates activity timestamp and proactively refreshes tokens for active users
   */
  const handleUserActivity = useCallback(async () => {
    try {
      // Update activity timestamp
      updateActivity();

      // Don't refresh tokens if session expiry modal is showing
      // This prevents the modal from auto-closing when user moves mouse
      if (showSessionExpiryModal) {
        console.log('🔐 Session expiry modal is showing - skipping token refresh to prevent auto-close');
        return;
      }

      // Check if access token needs refresh (proactive for active users)
      const tokens = getTokens();
      if (tokens.accessToken) {
        // Use activity-based token expiry if enabled
        const activityBasedExpiry = getActivityBasedTokenExpiry();
        if (activityBasedExpiry && AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
          const timeUntilExpiry = activityBasedExpiry - Date.now();
          // Refresh token if it's more than halfway through its lifetime (30 seconds for 1-minute token)
          const shouldRefresh = timeUntilExpiry < AUTH_CONFIG.ACTIVITY_TOKEN_REFRESH_THRESHOLD;

          if (shouldRefresh) {
            console.log('🔄 Activity-based token more than halfway through lifetime, refreshing due to user activity...');
            await refreshAccessToken();
          }
        } else {
          // Fallback to original token expiry check
          const expiry = TokenManager.getTokenExpiration(tokens.accessToken);
          if (expiry) {
            const timeUntilExpiry = expiry - Date.now();
            const shouldRefresh = timeUntilExpiry < AUTH_CONFIG.ACTIVITY_TOKEN_REFRESH_THRESHOLD;

            if (shouldRefresh) {
              console.log('🔄 Fixed token more than halfway through lifetime, refreshing due to user activity...');
              await refreshAccessToken();
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Error handling user activity:', error);
    }
  }, [refreshAccessToken, showSessionExpiryModal]);

  /**
   * Check if user has specific role
   * Simple role-based access control
   */
  const hasRole = useCallback((role: string): boolean => {
    return user?.role === role;
  }, [user]);

  // Set up activity tracking when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setupActivityTracking();
    }
  }, [isAuthenticated, user, setupActivityTracking]);

  return {
    validateSession,
    handleUserActivity,
    checkSessionAndActivity,
    setupActivityTracking,
    hasRole,
  };
}; 