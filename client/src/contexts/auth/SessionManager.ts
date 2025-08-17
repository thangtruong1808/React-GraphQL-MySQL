import { useCallback, useEffect, useRef } from 'react';
import { AUTH_CONFIG } from '../../constants';
import {
  getActivityBasedTokenExpiry,
  getTokens,
  isActivityBasedTokenExpired,
  isRefreshTokenExpired,
  isRefreshTokenNeedsRenewal,
  isTokenExpired,
  isUserInactive,
  TokenManager,
  updateActivity,
} from '../../utils/tokenManager';
import { RefreshTokenManager } from '../../utils/tokenManager/refreshTokenManager';

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
  refreshAccessToken: (isSessionRestoration?: boolean) => Promise<boolean>,
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
  // Add ref to track if session check is running
  const isSessionCheckRunningRef = useRef(false);
  
  const checkSessionAndActivity = useCallback(async () => {
    // Prevent multiple simultaneous session checks
    if (isSessionCheckRunningRef.current) {
      // SessionManager: Session check already running, skipping...
      return;
    }
    
    // SessionManager: checkSessionAndActivity called
    isSessionCheckRunningRef.current = true;
    
    try {
      // Don't run session checks if user is not authenticated (prevents interference during logout)
      if (!isAuthenticated) {
        return;
      }
      
      // NEW: Check if user is in "Continue to Work" transition or refresh operation is in progress
      // This prevents session checks from interfering with refresh operations
      if (TokenManager.getContinueToWorkTransition() || TokenManager.getRefreshOperationInProgress()) {
        // User is in transition or refresh operation is in progress - skip session checks
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

        // Access token is expired - now check refresh token status
        console.log('🔍 SessionManager - Access token expired, checking refresh token status');
        const refreshTokenExpired = await isRefreshTokenExpired();

        // Show modal only if access token is expired, refresh token is valid, modal is not already showing, and enough time has passed since last show
        const now = Date.now();
        const timeSinceLastShow = lastModalShowTime ? now - lastModalShowTime : Infinity;
        const minTimeBetweenShows = 5000; // 5 seconds minimum between modal shows

        if (!refreshTokenExpired && !showSessionExpiryModal && timeSinceLastShow > minTimeBetweenShows) {
          // Debug logging to understand session expiry detection
          console.log('🔍 SessionManager - Access token expired, showing modal:', {
            isAccessTokenExpired,
            refreshTokenExpired,
            showSessionExpiryModal,
            timeSinceLastShow,
            minTimeBetweenShows
          });
          
          setSessionExpiryMessage('Your session has expired. Click "Continue to Work" to refresh your session or "Logout" to sign in again.');
          setShowSessionExpiryModal(true);
          setLastModalShowTime(now);

          // Start the refresh token expiry timer when access token expires
          // SessionManager: Starting refresh token expiry timer
          await TokenManager.startRefreshTokenExpiryTimer();
          // SessionManager: Refresh token expiry timer started

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
              showNotification('Session expired due to inactivity. Please log in again.', 'info');
              await performCompleteLogout();
            }
          }, autoLogoutDelay);

          setModalAutoLogoutTimer(autoLogoutTimer);

          // Return early to prevent other checks from hiding the modal
          return;
        }

        // If modal is already showing, don't run additional checks that could hide it
        if (showSessionExpiryModal) {
          // Debug logging disabled for better user experience
          return;
        }

        // If refresh token is also expired, show session expiry message
        if (refreshTokenExpired) {
          setShowSessionExpiryModal(false);
          showNotification('Your session has expired due to inactivity. Please log in again.', 'info');
          await performCompleteLogout();
          return;
        }
      }

      // Only run proactive renewal if modal is not showing and access token is still valid
      if (!showSessionExpiryModal && tokens.accessToken) {
        // Check if access token is still valid before running proactive renewal
        let isAccessTokenStillValid = false;
        if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
          isAccessTokenStillValid = !isActivityBasedTokenExpired();
        } else {
          isAccessTokenStillValid = !isTokenExpired(tokens.accessToken);
        }
        
        if (isAccessTokenStillValid) {
          // Access token is still valid - no need for any renewal operations
          // Refresh token renewal should ONLY happen when user clicks "Continue to Work"
          // This prevents interference with manual refresh operations
        }
      }

      // User session is still valid and active - NO TOKEN REFRESH HERE
      // Token refresh is handled by handleUserActivity when actual user activity is detected
    } catch (error) {
      await performCompleteLogout();
    } finally {
      // Reset the running flag
      isSessionCheckRunningRef.current = false;
    }
  }, [performCompleteLogout, refreshAccessToken, renewRefreshToken, showNotification, showSessionExpiryModal, lastModalShowTime, setShowSessionExpiryModal, setSessionExpiryMessage, setLastModalShowTime, setModalAutoLogoutTimer, isAuthenticated]);

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
        // No access token found in memory - this could be:
        // 1. A new user (no refresh token in cookie)
        // 2. A returning user after browser refresh (has refresh token in cookie)
        
        // Always attempt session restoration - let server handle HttpOnly cookie validation
        // HttpOnly cookies are not accessible via JavaScript, so we can't check them client-side
        const refreshSuccess = await refreshAccessToken(true); // true = session restoration (browser refresh)
        return refreshSuccess;
      }

      // Use activity-based token validation if enabled
      if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
        const isExpired = isActivityBasedTokenExpired();
        if (isExpired) {
          const refreshSuccess = await refreshAccessToken(false); // false = token refresh (expired token)
          return refreshSuccess;
        }
        return true;
      }

      // Fallback to fixed token expiry check
      const isExpired = isTokenExpired(tokens.accessToken);
      if (isExpired) {
        const refreshSuccess = await refreshAccessToken(false); // false = token refresh (expired token)
        return refreshSuccess;
      }
      return true;
    } catch (error) {
      // Error in validateSession
      return false;
    }
  }, [refreshAccessToken]);

  /**
   * Handle user activity (mouse, keyboard, scroll, etc.)
   * Updates activity timestamp and proactively refreshes tokens for active users
   */
  const handleUserActivity = useCallback(async () => {
    try {
      // Step 1: Don't update activity if session expiry modal is showing
      // This prevents the modal from auto-closing and preserves the refresh token timer
      if (showSessionExpiryModal) {
        return;
      }

      // Step 2: Update activity timestamp asynchronously
      await updateActivity();

      // Step 3: Check if access token needs refresh (proactive for active users)
      const tokens = getTokens();
      if (tokens.accessToken) {
        // Use activity-based token expiry if enabled
        const activityBasedExpiry = getActivityBasedTokenExpiry();
        if (activityBasedExpiry && AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
          const timeUntilExpiry = activityBasedExpiry - Date.now();
          // Refresh token if it's more than halfway through its lifetime (30 seconds for 1-minute token)
          const shouldRefresh = timeUntilExpiry < AUTH_CONFIG.ACTIVITY_TOKEN_REFRESH_THRESHOLD;

          if (shouldRefresh) {
            // Step 4: Proactive token refresh for active users
            await refreshAccessToken(false); // false = token refresh (proactive refresh)
          }
        } else {
          // Fallback to original token expiry check
          const expiry = TokenManager.getTokenExpiration(tokens.accessToken);
          if (expiry) {
            const timeUntilExpiry = expiry - Date.now();
            const shouldRefresh = timeUntilExpiry < AUTH_CONFIG.ACTIVITY_TOKEN_REFRESH_THRESHOLD;

            if (shouldRefresh) {
              // Step 4: Proactive token refresh for active users
              await refreshAccessToken(false); // false = token refresh (proactive refresh)
            }
          }
        }
      }
    } catch (error) {
      // Error handling user activity
    }
  }, [refreshAccessToken, showSessionExpiryModal]);

  /**
   * Check if user has specific role
   * Simple role-based access control
   */
  const hasRole = useCallback((role: string): boolean => {
    return user?.role === role;
  }, [user]);

  /**
   * Pause auto-logout timer during refresh operations
   * Prevents auto-logout from interfering with refresh operations
   */
  const pauseAutoLogoutForRefresh = useCallback(() => {
    TokenManager.setRefreshOperationInProgress(true);
  }, []);

  /**
   * Resume auto-logout timer after refresh operations
   * Allows auto-logout to continue after refresh completes
   */
  const resumeAutoLogoutAfterRefresh = useCallback(() => {
    TokenManager.setRefreshOperationInProgress(false);
  }, []);

  // Set up activity tracking when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setupActivityTracking();
    } else {
      // Clear activity timer when user is not authenticated (logout)
      if (activityTimerRef.current) {
        clearInterval(activityTimerRef.current);
        activityTimerRef.current = null;
      }
    }
  }, [isAuthenticated, user, setupActivityTracking]);

  return {
    validateSession,
    handleUserActivity,
    checkSessionAndActivity,
    setupActivityTracking,
    hasRole,
    pauseAutoLogoutForRefresh,
    resumeAutoLogoutAfterRefresh,
  };
}; 