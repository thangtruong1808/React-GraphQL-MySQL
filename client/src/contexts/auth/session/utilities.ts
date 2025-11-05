import { useCallback } from 'react';
import { TokenManager } from '../../../utils/tokenManager';
import { SessionManagerDependencies } from './types';

/**
 * Session Utilities Hook
 * Provides utility functions for session management
 */
export const useSessionUtilities = (deps: SessionManagerDependencies) => {
  const { user } = deps;

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

  return { hasRole, pauseAutoLogoutForRefresh, resumeAutoLogoutAfterRefresh };
};

