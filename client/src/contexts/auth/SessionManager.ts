import { useEffect, useRef, useCallback } from 'react';
import { AUTH_CONFIG } from '../../constants';
import {
  useSessionValidation,
  useActivityHandling,
  useSessionChecking,
  useSessionUtilities,
  type SessionManager,
  type SessionManagerDependencies,
} from './session';

/**
 * Session Manager Hook
 * Manages session validation, activity tracking, and session expiry
 * Combines all session management modules into a unified interface
 */
export const useSessionManager = (
  user: any,
  isAuthenticated: boolean,
  showSessionExpiryModal: boolean,
  lastModalShowTime: number | null,
  refreshUserSession: (isSessionRestoration?: boolean) => Promise<boolean>,
  performCompleteLogout: (showToast: boolean, reason?: string) => Promise<void>,
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void,
  setShowSessionExpiryModal: (show: boolean) => void,
  setSessionExpiryMessage: (message: string) => void,
  setLastModalShowTime: (time: number | null) => void,
  setModalAutoLogoutTimer: (timer: NodeJS.Timeout | null) => void,
): SessionManager => {
  // Prepare dependencies object for all session hooks
  const deps: SessionManagerDependencies = {
    user,
    isAuthenticated,
    showSessionExpiryModal,
    lastModalShowTime,
    refreshUserSession,
    performCompleteLogout,
    showNotification,
    setShowSessionExpiryModal,
    setSessionExpiryMessage,
    setLastModalShowTime,
    setModalAutoLogoutTimer,
  };

  // Initialize all session hooks
  const { validateSession } = useSessionValidation(deps);
  const { handleUserActivity } = useActivityHandling(deps);
  const { checkSessionAndActivity } = useSessionChecking(deps);
  const { hasRole, pauseAutoLogoutForRefresh, resumeAutoLogoutAfterRefresh } = useSessionUtilities(deps);

  // Timer ref for activity and session checking
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Set up activity tracking
   * Starts timer to monitor user activity and session timeouts
   */
  const setupActivityTrackingWithTimer = useCallback(() => {
    // Clear existing timer
    if (activityTimerRef.current) {
      clearInterval(activityTimerRef.current);
      activityTimerRef.current = null;
    }

    // Start activity checking timer
    activityTimerRef.current = setInterval(checkSessionAndActivity, AUTH_CONFIG.ACTIVITY_CHECK_INTERVAL);
  }, [checkSessionAndActivity]);

  // Set up activity tracking when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setupActivityTrackingWithTimer();
    } else {
      // Clear activity timer when user is not authenticated (logout)
      if (activityTimerRef.current) {
        clearInterval(activityTimerRef.current);
        activityTimerRef.current = null;
      }
    }
  }, [isAuthenticated, user, setupActivityTrackingWithTimer]);

  return {
    validateSession,
    handleUserActivity,
    checkSessionAndActivity,
    setupActivityTracking: setupActivityTrackingWithTimer,
    hasRole,
    pauseAutoLogoutForRefresh,
    resumeAutoLogoutAfterRefresh,
  };
};

// Re-export types for convenience
export type { SessionManager } from './session'; 