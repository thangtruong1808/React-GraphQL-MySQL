import { useCallback, useRef } from 'react';
import { AUTH_CONFIG } from '../../../constants';
import {
  getTokens,
  isActivityBasedTokenExpired,
  isRefreshTokenExpired,
  isTokenExpired,
  TokenManager,
} from '../../../utils/tokenManager';
import { SessionManagerDependencies } from './types';

/**
 * Session Checking Hook
 * Handles periodic session checks and expiry management
 */
export const useSessionChecking = (deps: SessionManagerDependencies) => {
  const {
    isAuthenticated,
    showSessionExpiryModal,
    lastModalShowTime,
    performCompleteLogout,
    setShowSessionExpiryModal,
    setSessionExpiryMessage,
    setLastModalShowTime,
    setModalAutoLogoutTimer,
  } = deps;

  // Add ref to track if session check is running
  const isSessionCheckRunningRef = useRef(false);

  /**
   * Check session and user activity
   * Runs periodically to manage session based on activity and timeouts
   */
  const checkSessionAndActivity = useCallback(async () => {
    // Prevent multiple simultaneous session checks
    if (isSessionCheckRunningRef.current) {
      // Session check already running, skipping...
      return;
    }
    // Session check started
    isSessionCheckRunningRef.current = true;
    
    try {
      // Don't run session checks if user is not authenticated (prevents interference during logout)
      if (!isAuthenticated) {
        return;
      }
      
      // Check if user is in "Continue to Work" transition or refresh operation is in progress
      // This prevents session checks from interfering with refresh operations
      if (TokenManager.getContinueToWorkTransition() || TokenManager.getRefreshOperationInProgress()) {
        // User is in transition or refresh operation is in progress - skip session checks
        return;
      }

      // Check if session expiry modal was recently closed, skip checks for a longer period
      // This prevents immediate session expiry detection after successful refresh (reset to first-time login state)
      const now = Date.now();
      const timeSinceLastModalClose = lastModalShowTime ? now - lastModalShowTime : Infinity;
      const modalCloseCooldown = 5000; // 5 seconds cooldown after modal closes (increased for reset state)
      
      if (timeSinceLastModalClose < modalCloseCooldown && !showSessionExpiryModal) {
        // Modal was recently closed - skip session checks to prevent immediate re-triggering
        return;
      }

      // Check if access token is expired first - this is the primary check
      const tokens = getTokens();
      if (tokens.accessToken) {
        let isAccessTokenExpired = false;
        if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
          isAccessTokenExpired = isActivityBasedTokenExpired();
        } else {
          isAccessTokenExpired = isTokenExpired(tokens.accessToken);
        }

        // If access token is still valid, no need to check refresh token
        if (!isAccessTokenExpired) {
          // Access token is still valid - no session expiry issues
          return;
        }

        // Access token just expired – immediately mark modal showing in memory to block activity resets
        TokenManager.setSessionExpiryModalShowing(true);

        // Access token is expired - now check refresh token status
        const refreshTokenExpired = await isRefreshTokenExpired();

        // Show modal only if access token is expired, refresh token is valid, modal is not already showing, and enough time has passed since last show
        // RESET TO FIRST-TIME LOGIN STATE: When refresh token timer shows, access token is reset and all components are notified
        const timeSinceLastShow = lastModalShowTime ? now - lastModalShowTime : Infinity;
        const minTimeBetweenShows = 5000; // 5 seconds minimum between modal shows

        if (!refreshTokenExpired && !showSessionExpiryModal && timeSinceLastShow > minTimeBetweenShows) {
          setSessionExpiryMessage('Your session has expired. Click "Continue to Work" to refresh your session, "Logout" to terminate your session temporarily');
          setShowSessionExpiryModal(true);
          setLastModalShowTime(now);

          // Start the refresh token expiry timer when access token expires
          await TokenManager.startRefreshTokenExpiryTimer();

          // Start automatic logout timer based on modal countdown duration
          // This ensures auto-logout is based on the 1-minute modal countdown
          const autoLogoutDelay = AUTH_CONFIG.MODAL_AUTO_LOGOUT_DELAY;
          
          const autoLogoutTimer = setTimeout(async () => {
            // Check if "Continue to Work" has been clicked or refresh operation is in progress
            // This prevents race conditions where auto-logout fires while refresh is processing
            if (TokenManager.getContinueToWorkTransition() || TokenManager.getRefreshOperationInProgress()) {
              // User clicked "Continue to Work" or refresh is in progress - cancel auto-logout
              setModalAutoLogoutTimer(null);
              return;
            } else {
              // No transition in progress - proceed with auto-logout
              setModalAutoLogoutTimer(null);
              setShowSessionExpiryModal(false);
              await performCompleteLogout(true, 'Session expired due to inactivity. Please log in again.');
            }
          }, autoLogoutDelay);

          setModalAutoLogoutTimer(autoLogoutTimer);

          // Return early to prevent other checks from hiding the modal
          return;
        }

        // If modal is already showing, don't run additional checks that could hide it
        if (showSessionExpiryModal) {
          return;
        }

        // If refresh token is also expired, show session expiry message
        if (refreshTokenExpired) {
          setShowSessionExpiryModal(false);
          await performCompleteLogout(true, 'Your session has expired due to inactivity. Please log in again.');
          return;
        }
      }

      // Only run proactive renewal if modal is not showing and access token is still valid
      if (!showSessionExpiryModal && tokens.accessToken) {
        // Check if access token is still valid before running proactive renewal
        let isAccessTokenStillValid = false;
        if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
          isAccessTokenStillValid = !isActivityBasedTokenExpired();
        } 
        else {
          isAccessTokenStillValid = !isTokenExpired(tokens.accessToken);
        }
      }

      // User session is still valid and active - NO TOKEN REFRESH HERE
      // Token refresh is handled by handleUserActivity when actual user activity is detected
    } catch (error) {
      await performCompleteLogout(true, 'Session check failed');
    } finally {
      // Reset the running flag
      isSessionCheckRunningRef.current = false;
    }
  }, [performCompleteLogout, showSessionExpiryModal, lastModalShowTime, setShowSessionExpiryModal, setSessionExpiryMessage, setLastModalShowTime, setModalAutoLogoutTimer, isAuthenticated]);

  return { checkSessionAndActivity };
};

