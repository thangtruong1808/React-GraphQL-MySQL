import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AUTH_CONFIG } from '../../constants';

/**
 * Custom hook to track user activity
 * Monitors comprehensive user interactions and triggers token refresh when needed
 * 
 * CALLED BY: App component and other components that need activity tracking
 * SCENARIOS: Application navigation and user interactions - extends session when user is active
 */
export const useActivityTracker = () => {
  const location = useLocation();
  const { handleUserActivity } = useAuth();
  
  // Ref to track if we've already set up global event listeners
  const listenersSetupRef = useRef(false);

  // Track route changes (navigation activity)
  useEffect(() => {
    // Handle user activity when user navigates to different routes
    handleUserActivity();
    console.log('✅ Navigation activity detected:', location.pathname);
  }, [location.pathname, handleUserActivity]);

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
    const THROTTLE_DELAY = AUTH_CONFIG.ACTIVITY_THROTTLE_DELAY; // Update activity at most once per second

    const throttledActivityUpdate = () => {
      const now = Date.now();
      if (now - lastActivityUpdate >= THROTTLE_DELAY) {
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