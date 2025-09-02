import React, { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { updateActivity } from '../../utils/tokenManager';
import { AUTH_CONFIG } from '../../constants/auth';
import { ACTIVITY_CONFIG, ACTIVITY_EVENTS, ACTIVITY_FEATURES } from '../../constants/activity';
import { DEBUG_CONFIG } from '../../constants/debug';

/**
 * Activity Tracker Hook
 * Monitors user activity and updates activity timestamps
 * Simplified to focus on basic activity tracking since server handles refresh tokens
 */
export const useActivityTracker = () => {
  const location = useLocation();
  const lastActivityUpdate = useRef(0);
  const listenersSetupRef = useRef(false);
  const isAppFocusedRef = useRef(true);

  // Handle user activity - called when any user interaction is detected
  const handleUserActivity = useCallback(async () => {
    try {
      // Check if app is focused
      if (!isAppFocusedRef.current) {
        return;
      }

      // Update activity timestamp
      await updateActivity();
      
      // Debug logging for activity updates
      if (DEBUG_CONFIG.ENABLE_ACTIVITY_DEBUG_LOGGING) {
        console.log('ActivityTracker: User activity updated', {
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      // Error in handleUserActivity
      if (DEBUG_CONFIG.ENABLE_ERROR_LOGGING) {
        console.error('ActivityTracker: Error updating user activity', error);
      }
    }
  }, []);

  // Track navigation changes
  useEffect(() => {
    handleUserActivity();
  }, [location, handleUserActivity]);

  // Track comprehensive user interactions (mouse, keyboard, touch, scroll)
  useEffect(() => {
    if (listenersSetupRef.current) return;

    const handleEvent = async (event: Event) => {
      // Skip system-generated events
      if (ACTIVITY_FEATURES.ENABLE_SYSTEM_EVENT_FILTERING) {
        const target = event.target as HTMLElement;
        if (target && target.tagName === 'HTML') return;
      }

      // Throttle high-frequency events
      if (ACTIVITY_FEATURES.ENABLE_EVENT_THROTTLING) {
        const now = Date.now();
        if (now - lastActivityUpdate.current >= ACTIVITY_CONFIG.ACTIVITY_THROTTLE_DELAY) {
          await handleUserActivity();
          lastActivityUpdate.current = now;
        }
      } else {
        // Immediate update for other user interactions
        await handleUserActivity();
      }
    };

    // Add event listeners for all user interaction types
    ACTIVITY_EVENTS.ALL_USER_INTERACTIONS.forEach(eventType => {
      document.addEventListener(eventType, handleEvent, { passive: true });
    });

    // Focus/blur tracking
    const handleFocus = () => {
      isAppFocusedRef.current = true;
      if (ACTIVITY_FEATURES.ENABLE_FOCUS_BASED_TRACKING) {
        handleUserActivity();
      }
    };

    const handleBlur = () => {
      isAppFocusedRef.current = false;
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    listenersSetupRef.current = true;

    // Cleanup function
    return () => {
      ACTIVITY_EVENTS.ALL_USER_INTERACTIONS.forEach(eventType => {
        document.removeEventListener(eventType, handleEvent);
      });
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      listenersSetupRef.current = false;
    };
  }, [handleUserActivity]);
}; 