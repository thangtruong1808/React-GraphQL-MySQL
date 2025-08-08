import { useCallback } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { LOGIN, LOGOUT, REFRESH_TOKEN, REFRESH_TOKEN_RENEWAL } from '../../services/graphql/mutations';
import { GET_CURRENT_USER } from '../../services/graphql/queries';
import { LoginInput, User } from '../../types/graphql';
import { clearCSRFToken as clearApolloCSRFToken, setCSRFToken as setApolloCSRFToken } from '../../services/graphql/apollo-client';
import { clearTokens, saveTokens, TokenManager } from '../../utils/tokenManager';
import { useApolloClient } from '@apollo/client';

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
   */
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🔄 Attempting to refresh access token...');

      const result = await refreshTokenMutation();

      if (!result.data || !result.data.refreshToken) {
        console.log('❌ Invalid refresh token response structure:', result);
        return false;
      }

      const { accessToken, refreshToken, csrfToken, user: refreshedUser } = result.data.refreshToken;

      if (accessToken && refreshedUser) {
        console.log('✅ Access token refreshed successfully');

        // Store the new access token and user data in memory
        TokenManager.updateTokens(accessToken, refreshToken || '', refreshedUser);

        // Set CSRF token in Apollo Client for future mutations
        if (csrfToken) {
          setApolloCSRFToken(csrfToken);
        }

        // Update authentication state
        setUser(refreshedUser);
        setIsAuthenticated(true);

        return true;
      } else {
        console.log('❌ Access token refresh failed: Missing accessToken or user data');
        return false;
      }
    } catch (error: any) {
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const graphQLError = error.graphQLErrors[0];
        if (graphQLError.message === 'Refresh token is required') {
          console.log('🔍 No refresh token available - user must login');
          return false;
        }
        console.log('❌ GraphQL error during token refresh:', graphQLError.message);
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
      console.log('🔄 Attempting to renew refresh token...');

      const result = await refreshTokenRenewalMutation();
      const { success, user: renewedUser } = result.data.refreshTokenRenewal;

      if (success && renewedUser) {
        console.log('✅ Refresh token renewed successfully');

        // Update user data and extend refresh token expiry
        setUser(renewedUser);
        TokenManager.updateRefreshTokenExpiry();

        return true;
      } else {
        console.log('❌ Refresh token renewal failed:', result.data.refreshTokenRenewal.message);
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
        console.log('🔐 User authentication failed, performing logout...');
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
        return { success: false, error: response.errors[0]?.message || 'Login failed' };
      }

      const { login: loginData } = response.data || {};
      if (!loginData?.accessToken || !loginData?.refreshToken || !loginData?.user) {
        return { success: false, error: 'Invalid login response' };
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
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setLoginLoading(false);
    }
  }, [loginMutation, setUser, setIsAuthenticated, setLoginLoading]);

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
      console.log('🔄 Attempting to refresh session manually...');
      
      // Clear auto logout timer when user chooses to continue working
      if (modalAutoLogoutTimer) {
        clearTimeout(modalAutoLogoutTimer);
        setModalAutoLogoutTimer(null);
        console.log('✅ Modal auto logout timer cleared (user continuing to work)');
      }
      
      const refreshSuccess = await refreshAccessToken();
      if (refreshSuccess) {
        console.log('✅ Session refreshed successfully.');
        setShowSessionExpiryModal(false);
        setLastModalShowTime(null);
        showNotification('You can continue working now!', 'success');
        return true;
      } else {
        console.log('❌ Failed to refresh session manually.');
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