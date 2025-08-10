import { useCallback } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { LOGIN, LOGOUT, REFRESH_TOKEN, REFRESH_TOKEN_RENEWAL } from '../../services/graphql/mutations';
import { GET_CURRENT_USER } from '../../services/graphql/queries';
import { LoginInput, User } from '../../types/graphql';
import { clearCSRFToken as clearApolloCSRFToken, setCSRFToken as setApolloCSRFToken } from '../../services/graphql/apollo-client';
import { clearTokens, saveTokens, TokenManager } from '../../utils/tokenManager';
import { useApolloClient } from '@apollo/client';
import { DEBUG_CONFIG } from '../../constants';
import { useError } from '../ErrorContext';

/**
 * Authentication Actions Interface
 * Defines the structure of authentication actions
 */
export interface AuthActions {
  // Core actions
  login: (input: LoginInput) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  
  // Token management
  refreshAccessToken: () => Promise<boolean>;
  renewRefreshToken: () => Promise<boolean>;
  
  // User management
  fetchCurrentUser: () => Promise<void>;
  
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
) => {
  const client = useApolloClient();
  const { showError } = useError();
  
  // GraphQL operations
  const [getCurrentUser] = useLazyQuery(GET_CURRENT_USER);
  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN);
  const [logoutMutation, { loading: logoutLoading }] = useMutation(LOGOUT);
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN);
  const [refreshTokenRenewalMutation] = useMutation(REFRESH_TOKEN_RENEWAL);

  /**
   * Perform complete logout - clears all authentication data
   * Used for both manual logout and automatic logout scenarios
   */
  const performCompleteLogout = useCallback(async () => {
    // Clear modal auto-logout timer
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
    
    // Clear refresh token expiry timer
    TokenManager.clearRefreshTokenExpiry();
    
    setUser(null);
    setIsAuthenticated(false);

    // Clear CSRF token from Apollo Client
    clearApolloCSRFToken();

    // Clear Apollo cache to ensure clean state
    try {
      await client.clearStore();
    } catch (cacheError) {
      console.warn('⚠️ Error clearing Apollo cache:', cacheError);
    }
  }, [client, modalAutoLogoutTimer, setModalAutoLogoutTimer, setShowSessionExpiryModal, setSessionExpiryMessage, setLastModalShowTime, setUser, setIsAuthenticated]);

  /**
   * Refresh access token using refresh token
   * Attempts to get a new access token using the httpOnly refresh token
   * @param isSessionRestoration - Whether this is for session restoration (browser refresh) or token refresh (expired token)
   */
  const refreshAccessToken = useCallback(async (isSessionRestoration: boolean = false): Promise<boolean> => {
    try {
      // Check if refresh token is expired before attempting refresh
      // Only prevent refresh if token is actually expired, not when it's about to expire
      if (TokenManager.isRefreshTokenExpired()) {
        // Debug logging disabled for better user experience
        return false;
      }

      // Debug logging disabled for better user experience

      const result = await refreshTokenMutation();

      if (!result.data || !result.data.refreshToken) {
        return false;
      }

      const { accessToken, refreshToken, csrfToken, user: refreshedUser } = result.data.refreshToken;

      if (accessToken && refreshedUser) {
        // Debug logging disabled for better user experience

        // Store the new access token and user data in memory
        // Use updateAccessToken to avoid clearing the refresh token countdown
        TokenManager.updateAccessToken(accessToken);
        if (refreshedUser) {
          TokenManager.updateUser(refreshedUser);
        }

        // Set CSRF token in Apollo Client for future mutations
        if (csrfToken) {
          setApolloCSRFToken(csrfToken);
        }

        // Update authentication state
        setUser(refreshedUser);
        setIsAuthenticated(true);

        // Reset activity timer when user manually refreshes (e.g., "Continue to Work")
        // This gives the user a fresh 2-minute activity timer
        TokenManager.updateActivity();
        
        // Clear refresh token expiry timer so that the activity timer is shown instead
        // This ensures the user sees the activity timer countdown, not the refresh token countdown
        TokenManager.clearRefreshTokenExpiry();

        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const graphQLError = error.graphQLErrors[0];
        console.error('❌ GraphQL Error during token refresh:', {
          message: graphQLError.message,
          code: graphQLError.extensions?.code,
          path: graphQLError.path
        });
        if (graphQLError.message === 'Refresh token is required') {
          return false;
        }
        // Debug logging disabled for better user experience
      } else {
        console.error('❌ Error refreshing access token:', error);
      }
      return false;
    }
  }, [refreshTokenMutation, setUser, setIsAuthenticated]);

  /**
   * Renew refresh token to extend session
   * Used when user is active but refresh token is about to expire
   */
  const renewRefreshToken = useCallback(async (): Promise<boolean> => {
    try {
      // Debug logging disabled for better user experience

      const result = await refreshTokenRenewalMutation();
      const { success, user: renewedUser } = result.data.refreshTokenRenewal;

      if (success && renewedUser) {
        // Debug logging disabled for better user experience

        // Update user data
        setUser(renewedUser);
        
        // DO NOT update refresh token expiry here!
        // The refresh token timer should remain FIXED and unaffected by user activity
        // Only reset refresh token timer on initial login or complete session reset

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('❌ Error renewing refresh token:', error);
      return false;
    }
  }, [refreshTokenRenewalMutation, setUser]);

  /**
   * Fetch current user data
   * Only called when we have valid tokens
   */
  const fetchCurrentUser = useCallback(async () => {
    try {
      const { data } = await getCurrentUser();
      if (data?.currentUser) {
        setUser(data.currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error: any) {
      if (error.graphQLErrors?.[0]?.extensions?.code === 'UNAUTHENTICATED') {
        await performCompleteLogout();
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  }, [getCurrentUser, performCompleteLogout, setUser, setIsAuthenticated]);

  /**
   * Login function - Main authentication entry point
   * Handles the complete flow: LoginForm → AuthContext → GraphQL → Server → DB
   */
  const login = useCallback(async (input: LoginInput) => {
    try {
      setLoginLoading(true);

      const response = await loginMutation({ variables: { input } });

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
   */
  const logout = useCallback(async () => {
    try {
      setLogoutLoading(true);
      await logoutMutation();
    } catch (error) {
      console.warn('⚠️ Server logout failed, but continuing with local cleanup:', error);
    } finally {
      await performCompleteLogout();
      setLogoutLoading(false);
    }
  }, [logoutMutation, performCompleteLogout, setLogoutLoading]);

  /**
   * Refresh session manually
   * Attempts to refresh the access token using the refresh token
   */
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      // Clear auto logout timer when user chooses to continue working
      if (modalAutoLogoutTimer) {
        clearTimeout(modalAutoLogoutTimer);
        setModalAutoLogoutTimer(null);
        // Debug logging disabled for better user experience
      }
      
      // Check if refresh token is expired before attempting refresh
      // Only prevent refresh if token is actually expired
      if (TokenManager.isRefreshTokenExpired()) {
        // Refresh token is expired - show specific message
        setShowSessionExpiryModal(false);
        showNotification('Session has expired. Please log in again.', 'error');
        return false;
      }
      
      const refreshSuccess = await refreshAccessToken(false); // false = token refresh, not session restoration
      if (refreshSuccess) {
        // Debug logging disabled for better user experience
        setShowSessionExpiryModal(false);
        setLastModalShowTime(null);
        showNotification('You can continue working now!', 'success');
        return true;
      } else {
        // Debug logging disabled for better user experience
        setShowSessionExpiryModal(false);
        showNotification('Failed to refresh session. Please log in again.', 'error');
        return false;
      }
    } catch (error) {
      console.error('❌ Error refreshing session manually:', error);
      setShowSessionExpiryModal(false);
      showNotification('Failed to refresh session. Please log in again.', 'error');
      return false;
    }
  }, [refreshAccessToken, setShowSessionExpiryModal, setLastModalShowTime, showNotification, modalAutoLogoutTimer, setModalAutoLogoutTimer]);

  return {
    login,
    logout,
    refreshSession,
    refreshAccessToken,
    renewRefreshToken,
    fetchCurrentUser,
    performCompleteLogout,
    loginLoading,
    logoutLoading,
  };
}; 