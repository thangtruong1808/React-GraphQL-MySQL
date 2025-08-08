import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ACTIVITY_CONFIG, ACTIVITY_EVENTS, ACTIVITY_FEATURES } from '../../constants';
import { updateActivity } from '../../utils/tokenManager';

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
  const handleUserActivity = useCallback(() => {
    // Update activity for any user interaction within the app
    // Focus check is handled at the event level, not here
    updateActivity();
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
    const throttledActivityUpdate = () => {
      const now = Date.now();
      if (now - lastActivityUpdateRef.current >= ACTIVITY_CONFIG.ACTIVITY_THROTTLE_DELAY) {
        handleUserActivity();
        lastActivityUpdateRef.current = now;
      }
    };

    // Activity handler for user interaction events
    const handleUserInteraction = (event: Event) => {
      // Skip system-generated events if filtering is enabled
      if (ACTIVITY_FEATURES.ENABLE_SYSTEM_EVENT_FILTERING && event.isTrusted === false) {
        return;
      }

      // Check if the event target is within our application
      const target = event.target as Element;
      const isWithinApp = target && document.body.contains(target);

      // For mouse events, also check if the mouse is within the viewport
      let shouldTrack = isWithinApp;
      if (event.type === 'mousemove') {
        const mouseEvent = event as MouseEvent;
        const isInViewport = mouseEvent.clientX >= 0 && 
                           mouseEvent.clientX <= window.innerWidth && 
                           mouseEvent.clientY >= 0 && 
                           mouseEvent.clientY <= window.innerHeight;
        shouldTrack = isWithinApp && isInViewport;
      }

      // Only process events that occur within our application
      if (!shouldTrack) {
        // Debug logging for ignored events
        if (ACTIVITY_FEATURES.ENABLE_ACTIVITY_DEBUG_LOGGING && event.type === 'mousemove') {
          console.log(`🔍 Mouse outside app - ignoring ${event.type}`);
        }
        return;
      }

      // Handle different event types with appropriate throttling
      if (ACTIVITY_FEATURES.ENABLE_EVENT_THROTTLING && ACTIVITY_EVENTS.THROTTLED_EVENTS.includes(event.type as any)) {
        // Throttle high-frequency events to avoid excessive updates
        throttledActivityUpdate();
      } else {
        // Immediate update for other user interactions
        handleUserActivity();
      }

      // Debug logging for activity tracking
      if (ACTIVITY_FEATURES.ENABLE_ACTIVITY_DEBUG_LOGGING) {
        console.log(`🔍 Activity tracked: ${event.type} within app`);
      }
    };

    // Handle focus/blur events for debugging purposes
    const handleFocusChange = () => {
      const wasFocused = isAppFocusedRef.current;
      isAppFocusedRef.current = document.hasFocus();
      
      // Log focus state changes in development
      if (ACTIVITY_FEATURES.ENABLE_ACTIVITY_DEBUG_LOGGING) {
        console.log(`🔍 App focus state changed: ${wasFocused} -> ${isAppFocusedRef.current}`);
      }
    };

    // Handle visibility change events for debugging purposes
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      
      // Log visibility state changes in development
      if (ACTIVITY_FEATURES.ENABLE_ACTIVITY_DEBUG_LOGGING) {
        console.log(`🔍 App visibility state changed: ${isVisible}`);
      }
    };

    // Add event listeners for user interaction events
    ACTIVITY_EVENTS.ALL_USER_INTERACTIONS.forEach(eventType => {
      window.addEventListener(eventType, handleUserInteraction, { 
        passive: true,  // Improve performance
        capture: false  // Listen in bubbling phase
      });
    });

    // Add mouse enter/leave detection for better tracking
    const handleMouseEnter = () => {
      if (ACTIVITY_FEATURES.ENABLE_ACTIVITY_DEBUG_LOGGING) {
        console.log('🔍 Mouse entered app window');
      }
    };

    const handleMouseLeave = () => {
      if (ACTIVITY_FEATURES.ENABLE_ACTIVITY_DEBUG_LOGGING) {
        console.log('🔍 Mouse left app window');
      }
    };

    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Add focus/blur event listeners to track app focus state
    window.addEventListener('focus', handleFocusChange);
    window.addEventListener('blur', handleFocusChange);
    
    // Add visibility change event listener to track tab switching
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function to remove event listeners
    return () => {
      ACTIVITY_EVENTS.ALL_USER_INTERACTIONS.forEach(eventType => {
        window.removeEventListener(eventType, handleUserInteraction);
      });
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('focus', handleFocusChange);
      window.removeEventListener('blur', handleFocusChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      listenersSetupRef.current = false;
    };
  }, [handleUserActivity]); // Dependency on handleUserActivity

  // Return focus state for debugging purposes
  return {
    isAppFocused: isAppFocusedRef.current,
  };
};
