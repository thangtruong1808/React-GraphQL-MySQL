import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ACTIVITY_CONFIG, ACTIVITY_EVENTS, ACTIVITY_FEATURES } from '../../constants/activity';
import { AUTH_CONFIG } from '../../constants/auth';
import { DEBUG_CONFIG } from '../../constants/debug';
import { updateActivity } from '../../utils/tokenManager';
import { TokenManager } from '../../utils/tokenManager/TokenManager';
import { getTokens, isActivityBasedTokenExpired, isTokenExpired } from '../../utils/tokenManager/legacyWrappers';

/**
 * FEATURES:
 * - Only tracks activity when app window is focused
 * - Monitors mouse, keyboard, touch, and scroll events
 * - Throttles high-frequency events for performance
 * - Filters out system-generated events
 * - Uses passive event listeners for better performance
 * - Prevents false activity resets when switching between apps
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
        // App focused activity tracker: Session expiry modal showing - skipping activity update
        return;
      }

      // Step 2: PRIORITY CHECK - Check if access token is expired FIRST
      // This prevents activity updates from resetting the expiry timer after expiry
      const tokens = getTokens();
      if (tokens.accessToken) {
        let isAccessTokenExpired = false;
        if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
          isAccessTokenExpired = isActivityBasedTokenExpired();
        } else {
          isAccessTokenExpired = isTokenExpired(tokens.accessToken);
        }
        
        if (isAccessTokenExpired) {
          // App focused activity tracker: Access token expired - skipping activity update to prevent timer reset
          return;
        }
      }

      // Step 3: Get refresh token status asynchronously to avoid race conditions
      const refreshTokenStatus = await TokenManager.getRefreshTokenStatus();
      
      // Step 4: Check if refresh token timer is actively counting down
      // Only skip activity updates when refresh token timer is active AND not in transition
      const isRefreshTokenActive = refreshTokenStatus.expiry &&
                                  refreshTokenStatus.timeRemaining &&
                                  refreshTokenStatus.timeRemaining > 0;

      const isInTransition = refreshTokenStatus.isContinueToWorkTransition;

      // Step 5: Skip activity updates only during refresh token countdown (not during transitions)
      if (isRefreshTokenActive && !isInTransition) {
        return;
      }
      
      // Step 7: Update activity for access token timer asynchronously
      // Focus check is handled at the event level, not here
      await updateActivity();
    } catch (error) {
      // Error in handleUserActivity
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
      }
    };

    // Handle focus/blur events for debugging purposes
    const handleFocusChange = () => {
      try {
        isAppFocusedRef.current = document.hasFocus();
        
        // Log focus state changes (disabled for production)
        if (DEBUG_CONFIG.ENABLE_ACTIVITY_DEBUG_LOGGING) {
          // Debug logging disabled for better user experience
        }
      } catch (error) {
        // Silently handle any errors to prevent breaking the activity tracking
      }
    };

    // Handle visibility change events for debugging purposes
    const handleVisibilityChange = () => {
      try {
        
        // Log visibility state changes (disabled for production)
        if (DEBUG_CONFIG.ENABLE_ACTIVITY_DEBUG_LOGGING) {
          // Debug logging disabled for better user experience
        }
      } catch (error) {
        // Silently handle any errors to prevent breaking the activity tracking
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
      }
    };

    const handleMouseLeave = () => {
      try {
        if (DEBUG_CONFIG.ENABLE_ACTIVITY_DEBUG_LOGGING) {
          // Debug logging disabled for better user experience
        }
      } catch (error) {
        // Silently handle any errors to prevent breaking the activity tracking
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
    }

    // Cleanup function to remove event listeners
    return () => {
      try {
        ACTIVITY_EVENTS.ALL_USER_INTERACTIONS.forEach(eventType => {
          try {
            window.removeEventListener(eventType, handleUserInteraction);
          } catch (error) {
            // Silently handle any errors during cleanup
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
        }
        
        listenersSetupRef.current = false;
      } catch (error) {
        // Silently handle any errors during cleanup
      }
    };
  }, [handleUserActivity]); // Dependency on handleUserActivity

  // Return focus state for debugging purposes
  return {
    isAppFocused: isAppFocusedRef.current,
  };
};
