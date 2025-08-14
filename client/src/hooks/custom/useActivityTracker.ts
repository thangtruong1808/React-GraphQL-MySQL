import { useLocation } from 'react-router-dom';
import { useCallback, useEffect, useRef } from 'react';
import { updateActivity } from '../../utils/tokenManager';
import { TokenManager } from '../../utils/tokenManager/TokenManager';
import { getTokens, isActivityBasedTokenExpired, isTokenExpired } from '../../utils/tokenManager/legacyWrappers';
import { AUTH_CONFIG } from '../../constants/auth';
import { ACTIVITY_CONFIG, ACTIVITY_EVENTS, ACTIVITY_FEATURES } from '../../constants/activity';

/**
 * Custom hook for tracking user activity across the application
 * Monitors comprehensive user interactions and navigation
 * 
 * FEATURES:
 * - Tracks navigation between routes
 * - Monitors mouse, keyboard, touch, and scroll events
 * - Throttles high-frequency events for performance
 * - Filters out system-generated events
 * - Uses passive event listeners for better performance
 * - Only tracks activity when user is actually interacting with the app
 * 
 * USAGE:
 * - Automatically tracks all user interactions within the application
 * - Updates activity timestamp for authentication system
 * - Helps prevent premature logout for active users
 */
export const useActivityTracker = () => {
  const location = useLocation();
  const listenersSetupRef = useRef(false);
  const isAppFocusedRef = useRef(true);

  // Handle user activity - called when any user interaction is detected
  const handleUserActivity = useCallback(async () => {
    try {
      console.log('🔄 Activity tracker: handleUserActivity called');
      
      // Only update activity if the app is focused and user is interacting with it
      if (!isAppFocusedRef.current) {
        console.log('🔄 Activity tracker: App not focused, skipping');
        return;
      }

      // Step 1: Get refresh token status asynchronously to avoid race conditions
      const refreshTokenStatus = await TokenManager.getRefreshTokenStatus();
      
      // Step 2: Check if refresh token timer is actively counting down
      // If refresh token timer is actively counting down, access token has already expired
      // User activity should NOT reset access token timer in this case
      const isRefreshTokenActive = refreshTokenStatus.expiry && 
                                  refreshTokenStatus.timeRemaining && 
                                  refreshTokenStatus.timeRemaining > 0;
      
      const isInTransition = refreshTokenStatus.isContinueToWorkTransition;
      
      // Step 3: Determine if activity update should be skipped
      // Only skip if refresh token timer is actively counting down AND not in transition
      // This prevents activity updates from interfering with the refresh token flow
      if (isRefreshTokenActive && !isInTransition) {
        // Refresh token timer is actively counting down and not in transition - skip activity update
        // This prevents access token timer from being reset when it has already expired
        console.log('🔄 Activity tracker: Skipping activity update - refresh token timer active');
        console.log('🔄 Activity tracker: Refresh token status:', {
          expiry: refreshTokenStatus.expiry,
          timeRemaining: refreshTokenStatus.timeRemaining,
          isExpired: refreshTokenStatus.isExpired,
          isContinueToWorkTransition: refreshTokenStatus.isContinueToWorkTransition
        });
        return;
      }
      
      // Step 3.5: Additional check - if refresh token timer hasn't started yet, allow activity updates
      // This ensures normal activity tracking continues until the modal appears
      if (!refreshTokenStatus.expiry) {
        console.log('🔄 Activity tracker: No refresh token timer active - allowing activity update');
      }
      
      // Step 3.6: Additional safety check - only allow activity updates if access token is still valid
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
          console.log('🔄 Activity tracker: Access token expired - skipping activity update');
          return;
        }
      }
      
      console.log('🔄 Activity tracker: Updating activity timestamp');
      console.log('🔄 Activity tracker: Refresh token status before update:', {
        expiry: refreshTokenStatus.expiry,
        timeRemaining: refreshTokenStatus.timeRemaining,
        isExpired: refreshTokenStatus.isExpired,
        isContinueToWorkTransition: refreshTokenStatus.isContinueToWorkTransition
      });
      
      // Step 4: Debug - Check refresh token cookie before updating activity
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      console.log('🔄 Activity tracker: Refresh token cookie exists before update:', !!cookies.jid);
      console.log('🔄 Activity tracker: All cookies before update:', cookies);
      
      // Step 5: Update activity for access token timer asynchronously
      // This includes:
      // 1. No refresh token timer active (normal operation)
      // 2. Refresh token timer cleared (after "Continue to Work")
      // 3. Refresh token timer expired (should allow activity updates)
      // 4. User is in "Continue to Work" transition (allow activity to resume)
      await updateActivity();
      
      // Step 6: Debug - Check refresh token cookie after updating activity
      const cookiesAfter = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      console.log('🔄 Activity tracker: Refresh token cookie exists after update:', !!cookiesAfter.jid);
      console.log('🔄 Activity tracker: All cookies after update:', cookiesAfter);
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
    let lastActivityUpdate = 0;

    const throttledActivityUpdate = async () => {
      const now = Date.now();
      if (now - lastActivityUpdate >= ACTIVITY_CONFIG.ACTIVITY_THROTTLE_DELAY) {
        await handleUserActivity();
        lastActivityUpdate = now;
      }
    };

    // User interaction events that indicate active usage
    const userInteractionEvents = ACTIVITY_EVENTS.ALL_USER_INTERACTIONS;

    // Activity handler for user interaction events
    const handleUserInteraction = async (event: Event) => {
      // Skip system-generated events if filtering is enabled
      if (ACTIVITY_FEATURES.ENABLE_SYSTEM_EVENT_FILTERING && event.isTrusted === false) {
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
    };

    // Handle focus/blur events to track when app loses focus
    const handleFocusChange = () => {
      isAppFocusedRef.current = document.hasFocus();
    };

    // Add event listeners for user interaction events
    userInteractionEvents.forEach(eventType => {
      window.addEventListener(eventType, handleUserInteraction, { 
        passive: true,  // Improve performance
        capture: false  // Listen in bubbling phase
      });
    });

    // Add focus/blur event listeners to track app focus state
    window.addEventListener('focus', handleFocusChange);
    window.addEventListener('blur', handleFocusChange);

    // Cleanup function to remove event listeners
    return () => {
      userInteractionEvents.forEach(eventType => {
        window.removeEventListener(eventType, handleUserInteraction);
      });
      window.removeEventListener('focus', handleFocusChange);
      window.removeEventListener('blur', handleFocusChange);
      listenersSetupRef.current = false;
    };
  }, [handleUserActivity]); // Dependency on handleUserActivity
}; 