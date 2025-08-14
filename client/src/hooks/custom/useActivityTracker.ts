import { useLocation } from 'react-router-dom';
import { useCallback, useEffect, useRef } from 'react';
import { updateActivity } from '../../utils/tokenManager';
import { TokenManager } from '../../utils/tokenManager/TokenManager';
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
    // Only update activity if the app is focused and user is interacting with it
    if (isAppFocusedRef.current) {
      // Check if refresh token timer is actively counting down
      // If refresh token timer is actively counting down, access token has already expired
      // User activity should NOT reset access token timer in this case
      const refreshTokenStatus = await TokenManager.getRefreshTokenStatus();
      
      // Allow activity updates if:
      // 1. No refresh token timer active (normal operation)
      // 2. Refresh token timer cleared (after "Continue to Work")
      // 3. Refresh token timer expired (should allow activity updates)
      // 4. User is in "Continue to Work" transition (allow activity to resume)
      // 5. Refresh token timer is being cleared (allow activity to resume)
      if (refreshTokenStatus.expiry && 
          refreshTokenStatus.timeRemaining && 
          refreshTokenStatus.timeRemaining > 0 && 
          !refreshTokenStatus.isContinueToWorkTransition) {
        // Refresh token timer is actively counting down and not in transition - don't update activity
        // This prevents access token timer from being reset when it has already expired
        console.log('🔄 Activity tracker: Skipping activity update - refresh token timer active');
        return;
      }
      
      console.log('🔄 Activity tracker: Updating activity timestamp');
      
      // Debug: Check refresh token cookie before updating activity
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      console.log('🔄 Activity tracker: Refresh token cookie exists before update:', !!cookies.jid);
      
      // Normal case: Update activity for access token timer
      // This includes:
      // 1. No refresh token timer active (normal operation)
      // 2. Refresh token timer cleared (after "Continue to Work")
      // 3. Refresh token timer expired (should allow activity updates)
      updateActivity();
      
      // Debug: Check refresh token cookie after updating activity
      const cookiesAfter = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      console.log('🔄 Activity tracker: Refresh token cookie exists after update:', !!cookiesAfter.jid);
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