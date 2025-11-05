import { useCallback } from 'react';
import { useApolloClient, useMutation } from '@apollo/client';
import { clearCSRFToken as clearApolloCSRFToken } from '../../../services/graphql/apollo-client';
import { LOGOUT } from '../../../services/graphql/mutations';
import { clearTokens, TokenManager } from '../../../utils/tokenManager';
import { AuthActionsDependencies } from '../types';

/**
 * Logout Actions Hook
 * Handles user logout and complete logout cleanup
 */
export const useLogoutActions = (deps: AuthActionsDependencies) => {
  const {
    setUser,
    setIsAuthenticated,
    setLogoutLoading,
    showNotification,
    setShowSessionExpiryModal,
    setSessionExpiryMessage,
    setLastModalShowTime,
    setModalAutoLogoutTimer,
    modalAutoLogoutTimer,
  } = deps;
  
  const client = useApolloClient();
  const [logoutMutation, { loading: logoutLoading }] = useMutation(LOGOUT);

  /**
   * Perform complete logout - Clears all authentication data
   * Used for both manual logout and automatic logout scenarios
   */
  const performCompleteLogout = useCallback(async (showToast: boolean, reason?: string) => {
    // Clear modal auto-logout timer using ref for immediate access
    if (modalAutoLogoutTimer) {
      clearTimeout(modalAutoLogoutTimer);
      setModalAutoLogoutTimer(null);
    }

    // Close session expiry modal if it's open
    setShowSessionExpiryModal(false);
    setSessionExpiryMessage('');
    setLastModalShowTime(null);

    // Clear all authentication data
    clearTokens();
    
    // Clear token creation time specifically for complete logout
    TokenManager.clearTokenCreationTime();
    
    // Clear refresh token expiry timer
    try {
      await TokenManager.clearRefreshTokenExpiry();
    } catch (error) {
      // Refresh token expiry clearing failed - not critical for logout
    }
    
    // Clear user data and authentication state immediately
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear CSRF token from Apollo Client
    clearApolloCSRFToken();

    // Clear Apollo cache to ensure clean state
    try {
      await client.clearStore();
    } catch (cacheError) {
      // Cache clearing failed - this is not critical for logout
    }

    // Show appropriate toast notification based on logout scenario
    if (showToast) {
      if (reason?.includes('inactivity') || reason?.includes('expired') || reason?.includes('failed')) {
        // Automatic logout scenarios (session expiry, inactivity, errors)
        const message = reason || 'Your session has ended due to inactivity';
        showNotification(message, 'info');
      } else if (reason?.includes('Session ended')) {
        // Immediate logout scenarios (from modal, etc.)
        showNotification('Session ended. You can refresh the browser to reload if your session is still valid.', 'info');
      } else if (reason?.includes('Successfully logged out')) {
        // Manual logout scenarios (user initiated)
        showNotification(reason || 'Successfully logged out', 'success');
      } else {
        // Default case for any other logout scenarios
        showNotification(reason || 'Successfully logged out', 'success');
      }
    }

    // Force a small delay to ensure all state changes are processed
    await new Promise(resolve => setTimeout(resolve, 100));
  }, [client, modalAutoLogoutTimer, setModalAutoLogoutTimer, setShowSessionExpiryModal, setSessionExpiryMessage, setLastModalShowTime, setUser, setIsAuthenticated, showNotification]);

  /**
   * Comprehensive logout function - Unified logout entry point
   * Handles all logout scenarios with server communication and local cleanup
   * Provides toast notifications for better user experience
   * @param options - Configuration options for logout behavior
   */
  const performLogout = useCallback(async (options: {
    showToast?: boolean;
    fromModal?: boolean;
    immediate?: boolean;
  } = {}) => {
    const { showToast = true, fromModal = false, immediate = false } = options;
    
    try {
      setLogoutLoading(true);
      
      // Set logout transition state for visual feedback
      TokenManager.setLogoutTransition(true);
      
      // Clear modal auto-logout timer immediately
      if (modalAutoLogoutTimer) {
        clearTimeout(modalAutoLogoutTimer);
        setModalAutoLogoutTimer(null);
      }
      
      // Close session expiry modal immediately for instant feedback
      setShowSessionExpiryModal(false);
      setSessionExpiryMessage('');
      setLastModalShowTime(null);
      
      // Call server logout first (unless immediate mode) to clear refresh token from database
      if (!immediate) {
        try {
          await logoutMutation();
          // Toast notification will be handled by performCompleteLogout
        } catch (serverError: any) {
          // Server logout failed - continue with local cleanup
          // This ensures the user is logged out locally even if server logout fails
          // Toast notification will be handled by performCompleteLogout
        }
      }
      
      // Determine the appropriate reason message for toast notification
      let logoutReason: string;
      if (immediate) {
        logoutReason = 'Session ended from modal';
      } else if (fromModal) {
        logoutReason = 'Successfully logged out';
      } else {
        logoutReason = 'Successfully logged out';
      }
      
      // Perform comprehensive local cleanup with appropriate toast options
      await performCompleteLogout(showToast, logoutReason);
      
      // Clear logout transition state
      TokenManager.setLogoutTransition(false);
      
    } catch (error) {
      // Error during logout - ensure cleanup still happens
      TokenManager.setLogoutTransition(false);
      
      // Don't show error to user during logout process
      // Logout should always succeed from user perspective
    } finally {
      setLogoutLoading(false);
    }
  }, [logoutMutation, performCompleteLogout, setLogoutLoading, modalAutoLogoutTimer, setModalAutoLogoutTimer, setShowSessionExpiryModal, setSessionExpiryMessage, setLastModalShowTime]);

  return { performLogout, performCompleteLogout, logoutLoading };
};

