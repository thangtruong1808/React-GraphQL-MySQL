import { useApolloClient, useMutation } from '@apollo/client';
import { useCallback } from 'react';
import { clearCSRFToken as clearApolloCSRFToken, setCSRFToken as setApolloCSRFToken } from '../../services/graphql/apollo-client';
import { LOGIN, LOGOUT, REFRESH_TOKEN } from '../../services/graphql/mutations';
import { LoginInput, User } from '../../types/graphql';
import { clearTokens, saveTokens, TokenManager } from '../../utils/tokenManager';
import { useError } from '../ErrorContext';

/**
 * Authentication Actions Interface
 * Defines the structure of authentication actions
 */
export interface AuthActions {
  // Core actions
  login: (input: LoginInput) => Promise<{ success: boolean; user?: User; error?: string }>;
  performLogout: (options?: { showToast?: boolean; fromModal?: boolean; immediate?: boolean }) => Promise<void>;
  refreshSession: () => Promise<boolean>; // User clicks "Continue to Work" button
  
  // Token management
  refreshUserSession: (isSessionRestoration?: boolean) => Promise<boolean>; // Unified function for all refresh scenarios
  
  // Utilities
  performCompleteLogout: (showToast: boolean, reason?: string) => Promise<void>;
}

/**
 * Authentication Actions Hook
 * Manages all authentication-related actions
 */
export const useAuthActions = (
  setUser: (user: User | null) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void,
  setLoginLoading: (loading: boolean) => void,
  setLogoutLoading: (loading: boolean) => void,
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void,
  setShowSessionExpiryModal: (show: boolean) => void,
  setSessionExpiryMessage: (message: string) => void,
  setLastModalShowTime: (time: number | null) => void,
  setModalAutoLogoutTimer: (timer: NodeJS.Timeout | null) => void,
  modalAutoLogoutTimer: NodeJS.Timeout | null,
  pauseAutoLogoutForRefresh?: () => void,
  resumeAutoLogoutAfterRefresh?: () => void,
) => {
  const client = useApolloClient();
  const { showError } = useError();
  
  // GraphQL operations
  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN);
  const [logoutMutation, { loading: logoutLoading }] = useMutation(LOGOUT);
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN);

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
   * Unified function to refresh user session
   * Handles both browser refresh and manual session refresh
   * @param isSessionRestoration - Whether this is for session restoration (browser refresh) or manual refresh
   */
  const refreshUserSession = useCallback(async (isSessionRestoration: boolean = false): Promise<boolean> => {
    try {
      // Call refresh token mutation - server handles validation via httpOnly cookie
      const result = await refreshTokenMutation({
        variables: {
          dynamicBuffer: undefined // Server calculates buffer internally
        }
      });
      
      if (result.errors && result.errors.length > 0) {
        // GraphQL errors - user is not authenticated
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
      
      const { refreshToken: refreshData } = result.data || {};
      
      // Validate response data
      if (!refreshData || !refreshData.accessToken || !refreshData.refreshToken || !refreshData.user) {
        // No valid tokens or user data returned - user is not authenticated
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
      
      // Store new tokens and update authentication state
      const { accessToken, refreshToken, csrfToken, user: refreshedUser } = refreshData;
      
      // Store tokens and verify they're stored before updating authentication state
      // This ensures tokens are available before setIsAuthenticated(true) triggers queries
      await saveTokens(accessToken, refreshToken);
      
      // Clear auth data promise cache to force fresh token collection on next request
      // This ensures collectAuthData() will create a new promise with the refreshed tokens
      const { clearAuthDataPromise } = await import('../../services/graphql/apollo-client');
      clearAuthDataPromise();
      
      // Verify tokens are available before proceeding
      const { getTokens } = await import('../../utils/tokenManager');
      const storedTokens = getTokens();
      if (!storedTokens.accessToken) {
        throw new Error('Failed to save authentication tokens');
      }
      
      // Update authentication state only after tokens are confirmed to be in storage
      setUser(refreshedUser);
      setIsAuthenticated(true);
      
      // Update CSRF token in Apollo Client for future mutations
      if (csrfToken) {
        setApolloCSRFToken(csrfToken);
      }
      
      // Reset activity timer to ensure proper synchronization (like first-time login)
      await TokenManager.updateActivity();
      
      // Reset Auth state to first-time login state
      setShowSessionExpiryModal(false);
      setLastModalShowTime(null);
      setSessionExpiryMessage('');
      
      // Handle session restoration vs manual refresh differently
      if (isSessionRestoration) {
        // For browser refresh: DO NOT set refresh token timer
        // This allows the access token timer to work normally and reset on user activity
        // The refresh token timer should only start when access token expires due to inactivity
      } else {
        // For manual refresh (Continue to Work): Clear refresh token timer (like first-time login)
        await TokenManager.clearRefreshTokenExpiry();
      }

      return true;
    } catch (error: any) {
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const graphQLError = error.graphQLErrors[0];
        
        if (graphQLError.message === 'Refresh token is required') {
          return false;
        }
      } else if (error.message && error.message.includes('Refresh token is required')) {
        return false;
      }
      return false;
    }
  }, [refreshTokenMutation, setUser, setIsAuthenticated, setShowSessionExpiryModal, setLastModalShowTime, setSessionExpiryMessage]);

  /**
   * Login function - Main authentication entry point
   * Handles the complete flow: LoginForm → AuthContext → GraphQL → Server → DB
   */
  const login = useCallback(async (input: LoginInput) => {
    try {
      setLoginLoading(true);

      const response = await loginMutation({ variables: { input } });
      
      // Handle server response and client-side processing
      if (response.errors && response.errors.length > 0) {
        const errorMessage = response.errors[0]?.message || 'Login failed';
        showError(errorMessage, 'Authentication');
        return { success: false, error: errorMessage };
      }
      // GraphQL automatically wraps it as: { login: { accessToken, refreshToken, csrfToken, user } }
      // because GraphQL creates the login field based on the mutation name defined in the schema.
      // It's equivalent to: const loginData = response.data?.login;
      const { login: loginData } = response.data || {};
      if (!loginData?.accessToken || !loginData?.refreshToken || !loginData?.user) {
        const errorMessage = 'Invalid login response';
        showError(errorMessage, 'Authentication');
        return { success: false, error: errorMessage };
      }

      // Save tokens and verify they're stored before updating authentication state
      // This ensures tokens are available before setIsAuthenticated(true) triggers queries
      await saveTokens(loginData.accessToken, loginData.refreshToken);
      
      // Clear auth data promise cache to force fresh token collection on next request
      // This ensures collectAuthData() will create a new promise with the new tokens instead of reusing old one
      const { clearAuthDataPromise } = await import('../../services/graphql/apollo-client');
      clearAuthDataPromise();
      
      // Verify tokens are available before proceeding
      const { getTokens } = await import('../../utils/tokenManager');
      const storedTokens = getTokens();
      if (!storedTokens.accessToken) {
        throw new Error('Failed to save authentication tokens');
      }
      
      // Update authentication state only after tokens are confirmed to be in storage
      setUser(loginData.user);
      setIsAuthenticated(true);

      // Reset session expiry modal state on login to ensure fresh start
      setShowSessionExpiryModal(false);
      setSessionExpiryMessage('');
      setLastModalShowTime(null);

      // Set CSRF token in Apollo Client for future mutations
      if (loginData.csrfToken) {
        setApolloCSRFToken(loginData.csrfToken);
      }

      return { success: true, user: loginData.user };
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      showError(errorMessage, 'Authentication');
      return { success: false, error: errorMessage };
    } finally {
      setLoginLoading(false);
    }
  }, [loginMutation, setUser, setIsAuthenticated, setLoginLoading, showError, setShowSessionExpiryModal, setSessionExpiryMessage, setLastModalShowTime]);

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

  /**
   * Wrapper function for refresh session with auto-logout pause/resume
   * Prevents auto-logout from interfering with refresh operations
   */
  const refreshSession = useCallback(async (): Promise<boolean> => {
    // Prevent multiple simultaneous refresh attempts
    if (TokenManager.getContinueToWorkTransition()) {
      // Refresh already in progress, skipping duplicate call
      return false;
    }
    
    try {
      // Set transition state for visual feedback
      TokenManager.setContinueToWorkTransition(true);
      
      // Set refresh operation in progress to prevent auto-logout
      TokenManager.setRefreshOperationInProgress(true);
      
      // Call unified refresh function for manual refresh
      const refreshSuccess = await refreshUserSession(false);
      
      // Clear transition state
      TokenManager.setContinueToWorkTransition(false);
      
      // Clear refresh operation state
      TokenManager.setRefreshOperationInProgress(false);
      
      if (refreshSuccess) {
        // Refresh success - proceed with success flow
        try {
          // STEP 1: Reset activity timer to 1 minute (like first-time login)
          await TokenManager.updateActivity();
          
          // STEP 2: Clear refresh token timer (like first-time login)
          await TokenManager.clearRefreshTokenExpiry();
          
          // STEP 3: Reset Auth state to first-time login state
          setShowSessionExpiryModal(false);
          setLastModalShowTime(null);
          setSessionExpiryMessage('');
          
          // STEP 4: Clear any auto-logout timer (like first-time login)
          if (modalAutoLogoutTimer) {
            clearTimeout(modalAutoLogoutTimer);
            setModalAutoLogoutTimer(null);
          }
          
          // STEP 5: Show success message
          showNotification('You can continue working now!', 'success');
          
          return true;
        } catch (successError) {
          throw successError; // Re-throw to be caught by outer catch block
        }
      } else {
        // Refresh failed - show error message
        setShowSessionExpiryModal(false);
        showNotification('Failed to refresh session. Please log in again.', 'error');
        return false;
      }
    } catch (error) {
      // Handle any errors during refresh
      setShowSessionExpiryModal(false);
      showNotification('Failed to refresh session. Please log in again.', 'error');
      return false;
    }
  }, [refreshUserSession, setShowSessionExpiryModal, setLastModalShowTime, setSessionExpiryMessage, showNotification, modalAutoLogoutTimer, setModalAutoLogoutTimer]);

  return {
    login,
    performLogout,
    refreshSession,
    refreshUserSession,
    performCompleteLogout,
    loginLoading,
    logoutLoading,
  };
}; 