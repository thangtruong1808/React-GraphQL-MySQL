import { useCallback, useEffect, useRef } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { LOGIN, LOGOUT, REFRESH_TOKEN } from '../../services/graphql/mutations';
import { LoginInput, User } from '../../types/graphql';
import { clearCSRFToken as clearApolloCSRFToken, setCSRFToken as setApolloCSRFToken } from '../../services/graphql/apollo-client';
import { getTokens, clearTokens, saveTokens, TokenManager } from '../../utils/tokenManager';
import { useApolloClient } from '@apollo/client';
import { useError } from '../ErrorContext';

/**
 * Authentication Actions Interface
 * Defines the structure of authentication actions
 */
export interface AuthActions {
  // Core actions
  login: (input: LoginInput) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  logoutFromModal: () => Promise<void>;
  refreshSession: () => Promise<boolean>; // User clicks "Continue to Work" button
  
  // Token management
  refreshUserSession: (isSessionRestoration?: boolean) => Promise<boolean>; // Unified function for all refresh scenarios
  
  // Utilities
  performCompleteLogout: () => Promise<void>;
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
  const performCompleteLogout = useCallback(async () => {
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

    // Force a small delay to ensure all state changes are processed
    await new Promise(resolve => setTimeout(resolve, 100));
  }, [client, modalAutoLogoutTimer, setModalAutoLogoutTimer, setShowSessionExpiryModal, setSessionExpiryMessage, setLastModalShowTime, setUser, setIsAuthenticated]);

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
      
      // Store tokens (this resets access token to 1 minute like first-time login)
      saveTokens(accessToken, refreshToken);
      setUser(refreshedUser);
      setIsAuthenticated(true);
      
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

      const { login: loginData } = response.data || {};
      if (!loginData?.accessToken || !loginData?.refreshToken || !loginData?.user) {
        const errorMessage = 'Invalid login response';
        showError(errorMessage, 'Authentication');
        return { success: false, error: errorMessage };
      }

      // Save tokens and update authentication state
      saveTokens(loginData.accessToken, loginData.refreshToken);
      setUser(loginData.user);
      setIsAuthenticated(true);

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
  }, [loginMutation, setUser, setIsAuthenticated, setLoginLoading, showError]);

  /**
   * Logout function - Main logout entry point
   * Handles server logout and local state cleanup
   * Ensures refresh token is properly deleted from database
   */
  const logout = useCallback(async () => {
    try {
      setLogoutLoading(true);
      
      // Call server logout first to clear refresh token from database
      try {
        const result = await logoutMutation();
      } catch (serverError: any) {
        // Server logout failed - continue with local cleanup
        // This ensures the user is logged out locally even if server logout fails
      }
    } catch (error) {
      // Any other unexpected errors during logout
      // Don't show errors to user during logout process
    } finally {
      // Always perform local cleanup to ensure user is logged out
      await performCompleteLogout();
      setLogoutLoading(false);
    }
  }, [logoutMutation, performCompleteLogout, setLogoutLoading]);

  /**
   * Logout from modal with transition state
   * Provides better user experience by showing transition state during logout
   */
  const logoutFromModal = useCallback(async () => {
    try {
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
      
      // Clear authentication state immediately for instant logout
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear tokens and timers immediately
      clearTokens();
      TokenManager.clearTokenCreationTime();
      await TokenManager.clearRefreshTokenExpiry();
      
      // Clear CSRF token immediately
      clearApolloCSRFToken();
      
      // Clear Apollo cache in background (non-blocking)
      client.clearStore().catch(cacheError => {
        // Cache clearing failed - this is not critical for logout
      });
      
      // Force a delay to ensure state changes are processed and prevent session restoration
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Clear logout transition state
      TokenManager.setLogoutTransition(false);
    } catch (error) {
      // Error during logout from modal - ensure cleanup still happens
      TokenManager.setLogoutTransition(false);
      
      // Don't throw error to prevent error messages during logout
      // Logout should always succeed from user perspective
    }
  }, [modalAutoLogoutTimer, setModalAutoLogoutTimer, setShowSessionExpiryModal, setSessionExpiryMessage, setLastModalShowTime, setUser, setIsAuthenticated, client]);

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
        // Refresh success - show success message
        showNotification('You can continue working now!', 'success');
        return true;
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
  }, [refreshUserSession, setShowSessionExpiryModal, showNotification]);

  return {
    login,
    logout,
    logoutFromModal,
    refreshSession,
    refreshUserSession,
    performCompleteLogout,
    loginLoading,
    logoutLoading,
  };
}; 