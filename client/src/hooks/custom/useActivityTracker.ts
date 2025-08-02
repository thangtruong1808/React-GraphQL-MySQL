import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AUTH_CONFIG } from '../../constants';
import { updateActivity } from '../../utils/tokenManager';

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
 * 
 * USAGE:
 * - Automatically tracks all user interactions
 * - Updates activity timestamp for authentication system
 * - Helps prevent premature logout for active users
 */
export const useActivityTracker = () => {
  const location = useLocation();
  const listenersSetupRef = useRef(false);

  // Handle user activity - called when any user interaction is detected
  const handleUserActivity = useCallback(() => {
    console.log('🎯 User activity detected - updating activity timestamp');
    updateActivity();
  }, []);

  // Track navigation changes
  useEffect(() => {
    console.log('🔧 Navigation detected - updating activity timestamp');
    handleUserActivity();
  }, [location, handleUserActivity]);

  // Track comprehensive user interactions (mouse, keyboard, touch, scroll)
  useEffect(() => {
    // Prevent setting up listeners multiple times
    if (listenersSetupRef.current) {
      return;
    }
    
    listenersSetupRef.current = true;
    console.log('🔧 Setting up comprehensive user activity tracking...');

    // Throttle function to limit activity updates frequency
    let lastActivityUpdate = 0;

    const throttledActivityUpdate = () => {
      const now = Date.now();
      if (now - lastActivityUpdate >= AUTH_CONFIG.ACTIVITY_THROTTLE_DELAY) {
        handleUserActivity();
        lastActivityUpdate = now;
      }
    };

    // User interaction events that indicate active usage
    const userInteractionEvents = [
      'mousedown',    // Mouse clicks
      'mouseup',      // Mouse clicks
      'click',        // Mouse clicks
      'dblclick',     // Double clicks
      'mousemove',    // Mouse movements (throttled)
      'keydown',      // Keyboard input
      'keyup',        // Keyboard input
      'keypress',     // Keyboard input
      'touchstart',   // Touch interactions
      'touchend',     // Touch interactions
      'touchmove',    // Touch interactions
      'scroll',       // Scrolling (throttled)
      'wheel',        // Mouse wheel
      'focus',        // Form focus
      'blur',         // Form blur
      'input',        // Form input
      'change',       // Form changes
      'submit',       // Form submissions
      'beforeunload', // Page unload/refresh (user action)
    ];

    // Activity handler for user interaction events
    const handleUserInteraction = (event: Event) => {
      // Skip system-generated events
      if (event.isTrusted === false) {
        return;
      }

      // Handle different event types with appropriate throttling
      switch (event.type) {
        case 'mousemove':
        case 'scroll':
          // Throttle mouse movements and scroll events to avoid excessive updates
          throttledActivityUpdate();
          break;
        default:
          // Immediate update for other user interactions
          handleUserActivity();
          break;
      }
      
      console.log('✅ User interaction detected:', event.type);
    };

    // Add event listeners for user interaction events
    userInteractionEvents.forEach(eventType => {
      window.addEventListener(eventType, handleUserInteraction, { 
        passive: true,  // Improve performance
        capture: false  // Listen in bubbling phase
      });
    });

    // Cleanup function to remove event listeners
    return () => {
      console.log('🧹 Cleaning up user activity tracking...');
      userInteractionEvents.forEach(eventType => {
        window.removeEventListener(eventType, handleUserInteraction);
      });
      listenersSetupRef.current = false;
    };
  }, [handleUserActivity]); // Dependency on handleUserActivity
}; 