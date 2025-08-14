import { useLocation } from 'react-router-dom';
import { useCallback, useEffect, useRef } from 'react';
import { updateActivity } from '../../utils/tokenManager';
import { TokenManager } from '../../utils/tokenManager/TokenManager';
import { getTokens, isActivityBasedTokenExpired, isTokenExpired } from '../../utils/tokenManager/legacyWrappers';
import { AUTH_CONFIG } from '../../constants/auth';
import { ACTIVITY_CONFIG, ACTIVITY_EVENTS, ACTIVITY_FEATURES } from '../../constants/activity';
import { DEBUG_CONFIG } from '../../constants/debug';

/**
 * App-Focused Activity Tracker Hook
 * Tracks user activity only when the application window is focused
 * Prevents false activity updates when user moves mouse outside the app
 * 
 * FEATURES:
 * - Only tracks activity when app window is focused
 * - Monitors mouse, keyboard, touch, and scroll events
 * - Throttles high-frequency events for performance
 * - Filters out system-generated events
 * - Uses passive event listeners for better performance
 * - Prevents false activity resets when switching between apps
 * 
 * USAGE:
 * - Automatically tracks all user interactions within the focused application
 * - Updates activity timestamp for authentication system
 * - Helps prevent premature logout for active users
 * - Prevents false activity detection when app is not focused
 */
export const useAppFocusedActivityTracker = () => {
  const location = useLocation();
  const listenersSetupRef = useRef(false);
  const isAppFocusedRef = useRef(true);
  const lastActivityUpdateRef = useRef(0);

  // Handle user activity - called when any user interaction is detected
  const handleUserActivity = useCallback(async () => {
    try {
      // Step 1: Check if session expiry modal is showing
      // If modal is showing, skip activity updates to prevent interference
      const isModalShowing = TokenManager.isSessionExpiryModalShowing();
      if (isModalShowing) {
        console.log('🔄 App focused activity tracker: Session expiry modal showing - skipping activity update');
        return;
      }

      // Step 2: Get refresh token status asynchronously to avoid race conditions
      const refreshTokenStatus = await TokenManager.getRefreshTokenStatus();
      
      // Step 3: Check if refresh token timer is actively counting down
      // If refresh token timer is actively counting down, access token has already expired
      // User activity should NOT reset access token timer in this case
      const isRefreshTokenActive = refreshTokenStatus.expiry &&
                                  refreshTokenStatus.timeRemaining &&
                                  refreshTokenStatus.timeRemaining > 0;

      const isInTransition = refreshTokenStatus.isContinueToWorkTransition;

      // Step 4: Determine if activity update should be skipped
      // Skip activity update if:
      // 1. Refresh token timer is actively counting down AND not in transition, OR
      // 2. User is in "Continue to Work" transition, OR
      // 3. User is in logout transition
      // This prevents activity updates from interfering with the refresh token flow
      if ((isRefreshTokenActive && !isInTransition) || 
          isInTransition || 
          refreshTokenStatus.isLogoutTransition) {
        // Skip activity update to preserve refresh token timer and prevent interference
        return;
      }
      
      // Step 5: Additional check - if refresh token timer hasn't started yet, allow activity updates
      // This ensures normal activity tracking continues until the modal appears
      if (!refreshTokenStatus.expiry) {
        console.log('🔄 App focused activity tracker: No refresh token timer active - allowing activity update');
      }
      
      // Step 6: Additional safety check - only allow activity updates if access token is still valid
      // This prevents activity updates from interfering with expired tokens
      const tokens = getTokens();
      if (tokens.accessToken) {
        let isAccessTokenStillValid = false;
        if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
          isAccessTokenStillValid = !isActivityBasedTokenExpired();
        } else {
          isAccessTokenStillValid = !isTokenExpired(tokens.accessToken);
        }
        
        if (!isAccessTokenStillValid) {
          console.log('🔄 App focused activity tracker: Access token expired - skipping activity update');
          return;
        }
      }
      
      // Step 7: Update activity for access token timer asynchronously
      // Focus check is handled at the event level, not here
      await updateActivity();
    } catch (error) {
      console.error('❌ Error in handleUserActivity:', error);
    }
  }, []);

  // Track navigation changes
  useEffect(() => {
    handleUserActivity();
  }, [location, handleUserActivity]);

  // Track comprehensive user interactions (mouse, keyboard, touch, scroll)
  useEffect(() => {
    // Prevent setting up listeners multiple times
    if (listenersSetupRef.current) {
      return;
    }
    
    listenersSetupRef.current = true;

    // Throttle function to limit activity updates frequency
    const throttledActivityUpdate = async () => {
      const now = Date.now();
      if (now - lastActivityUpdateRef.current >= ACTIVITY_CONFIG.ACTIVITY_THROTTLE_DELAY) {
        await handleUserActivity();
        lastActivityUpdateRef.current = now;
      }
    };

    // Activity handler for user interaction events
    const handleUserInteraction = async (event: Event) => {
      try {
        // Skip system-generated events if filtering is enabled
        if (ACTIVITY_FEATURES.ENABLE_SYSTEM_EVENT_FILTERING && event.isTrusted === false) {
          return;
        }

        // Check if the event target is within our application
        const target = event.target;
        
        // Validate that target is a valid DOM Node before using contains
        const isWithinApp = target && 
                           target instanceof Node && 
                           document.body && 
                           document.body.contains(target);

        // For mouse events, also check if the mouse is within the viewport
        let shouldTrack = isWithinApp;
        if (event.type === 'mousemove' && event instanceof MouseEvent) {
          const mouseEvent = event as MouseEvent;
          const isInViewport = mouseEvent.clientX >= 0 && 
                             mouseEvent.clientX <= window.innerWidth && 
                             mouseEvent.clientY >= 0 && 
                             mouseEvent.clientY <= window.innerHeight;
          shouldTrack = isWithinApp && isInViewport;
        }

        // Only process events that occur within our application
        if (!shouldTrack) {
          // Debug logging for ignored events (disabled for production)
          if (DEBUG_CONFIG.ENABLE_ACTIVITY_DEBUG_LOGGING && event.type === 'mousemove') {
            // Debug logging disabled for better user experience
          }
          return;
        }

        // Handle different event types with appropriate throttling
        if (ACTIVITY_FEATURES.ENABLE_EVENT_THROTTLING && ACTIVITY_EVENTS.THROTTLED_EVENTS.includes(event.type as any)) {
          // Throttle high-frequency events to avoid excessive updates
          await throttledActivityUpdate();
        } else {
          // Immediate update for other user interactions
          await handleUserActivity();
        }

        // Debug logging for activity tracking (disabled for production)
        if (DEBUG_CONFIG.ENABLE_ACTIVITY_DEBUG_LOGGING) {
          // Debug logging disabled for better user experience
        }
      } catch (error) {
        // Silently handle any errors to prevent breaking the activity tracking
        // This ensures the app continues to function even if there are DOM-related issues
        if (DEBUG_CONFIG.ENABLE_ERROR_LOGGING) {
          console.warn('Activity tracking error:', error);
        }
      }
    };

    // Handle focus/blur events for debugging purposes
    const handleFocusChange = () => {
      try {
        const wasFocused = isAppFocusedRef.current;
        isAppFocusedRef.current = document.hasFocus();
        
        // Log focus state changes (disabled for production)
        if (DEBUG_CONFIG.ENABLE_ACTIVITY_DEBUG_LOGGING) {
          // Debug logging disabled for better user experience
        }
      } catch (error) {
        // Silently handle any errors to prevent breaking the activity tracking
        if (DEBUG_CONFIG.ENABLE_ERROR_LOGGING) {
          console.warn('Focus change error:', error);
        }
      }
    };

    // Handle visibility change events for debugging purposes
    const handleVisibilityChange = () => {
      try {
        const isVisible = !document.hidden;
        
        // Log visibility state changes (disabled for production)
        if (DEBUG_CONFIG.ENABLE_ACTIVITY_DEBUG_LOGGING) {
          // Debug logging disabled for better user experience
        }
      } catch (error) {
        // Silently handle any errors to prevent breaking the activity tracking
        if (DEBUG_CONFIG.ENABLE_ERROR_LOGGING) {
          console.warn('Visibility change error:', error);
        }
      }
    };

    // Add event listeners for user interaction events
    ACTIVITY_EVENTS.ALL_USER_INTERACTIONS.forEach(eventType => {
      try {
        window.addEventListener(eventType, handleUserInteraction, { 
          passive: true,  // Improve performance
          capture: false  // Listen in bubbling phase
        });
      } catch (error) {
        // Silently handle any errors to prevent breaking the activity tracking
        if (DEBUG_CONFIG.ENABLE_ERROR_LOGGING) {
          console.warn(`Failed to add event listener for ${eventType}:`, error);
        }
      }
    });

    // Add mouse enter/leave detection for better tracking
    const handleMouseEnter = () => {
      try {
        if (DEBUG_CONFIG.ENABLE_ACTIVITY_DEBUG_LOGGING) {
          // Debug logging disabled for better user experience
        }
      } catch (error) {
        // Silently handle any errors to prevent breaking the activity tracking
        if (DEBUG_CONFIG.ENABLE_ERROR_LOGGING) {
          console.warn('Mouse enter error:', error);
        }
      }
    };

    const handleMouseLeave = () => {
      try {
        if (DEBUG_CONFIG.ENABLE_ACTIVITY_DEBUG_LOGGING) {
          // Debug logging disabled for better user experience
        }
      } catch (error) {
        // Silently handle any errors to prevent breaking the activity tracking
        if (DEBUG_CONFIG.ENABLE_ERROR_LOGGING) {
          console.warn('Mouse leave error:', error);
        }
      }
    };

    // Add event listeners with error handling
    try {
      document.addEventListener('mouseenter', handleMouseEnter);
      document.addEventListener('mouseleave', handleMouseLeave);

      // Add focus/blur event listeners to track app focus state
      window.addEventListener('focus', handleFocusChange);
      window.addEventListener('blur', handleFocusChange);
      
      // Add visibility change event listener to track tab switching
      document.addEventListener('visibilitychange', handleVisibilityChange);
    } catch (error) {
      // Silently handle any errors to prevent breaking the activity tracking
      if (DEBUG_CONFIG.ENABLE_ERROR_LOGGING) {
        console.warn('Failed to add event listeners:', error);
      }
    }

    // Cleanup function to remove event listeners
    return () => {
      try {
        ACTIVITY_EVENTS.ALL_USER_INTERACTIONS.forEach(eventType => {
          try {
            window.removeEventListener(eventType, handleUserInteraction);
          } catch (error) {
            // Silently handle any errors during cleanup
            if (DEBUG_CONFIG.ENABLE_ERROR_LOGGING) {
              console.warn(`Failed to remove event listener for ${eventType}:`, error);
            }
          }
        });
        
        try {
          document.removeEventListener('mouseenter', handleMouseEnter);
          document.removeEventListener('mouseleave', handleMouseLeave);
          window.removeEventListener('focus', handleFocusChange);
          window.removeEventListener('blur', handleFocusChange);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        } catch (error) {
          // Silently handle any errors during cleanup
          if (DEBUG_CONFIG.ENABLE_ERROR_LOGGING) {
            console.warn('Failed to remove event listeners:', error);
          }
        }
        
        listenersSetupRef.current = false;
      } catch (error) {
        // Silently handle any errors during cleanup
        if (DEBUG_CONFIG.ENABLE_ERROR_LOGGING) {
          console.warn('Cleanup error:', error);
        }
      }
    };
  }, [handleUserActivity]); // Dependency on handleUserActivity

  // Return focus state for debugging purposes
  return {
    isAppFocused: isAppFocusedRef.current,
  };
};
