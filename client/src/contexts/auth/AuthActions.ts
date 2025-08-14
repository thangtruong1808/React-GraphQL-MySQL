import { useCallback } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { LOGIN, LOGOUT, REFRESH_TOKEN, REFRESH_TOKEN_RENEWAL } from '../../services/graphql/mutations';
import { GET_CURRENT_USER } from '../../services/graphql/queries';
import { LoginInput, User } from '../../types/graphql';
import { clearCSRFToken as clearApolloCSRFToken, setCSRFToken as setApolloCSRFToken } from '../../services/graphql/apollo-client';
import { clearTokens, saveTokens, TokenManager } from '../../utils/tokenManager';
import { RefreshTokenManager } from '../../utils/tokenManager/refreshTokenManager';
import { useApolloClient } from '@apollo/client';
import { DEBUG_CONFIG, AUTH_CONFIG } from '../../constants';
import { useError } from '../ErrorContext';
import { logTokenRefreshTiming, logSessionState } from '../../utils/debugLogger';

/**
 * Authentication Actions Interface
 * Defines the structure of authentication actions
 */
export interface AuthActions {
  // Core actions
  login: (input: LoginInput) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  logoutFromModal: () => Promise<void>; // NEW: Logout from modal with transition state
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

    // Clear all authentication data (preserves token creation time for dynamic buffer)
    clearTokens();
    
    // Clear token creation time specifically for complete logout
    // This ensures new tokens will have fresh creation time for dynamic buffer calculation
    TokenManager.clearTokenCreationTime();
    
    // Clear refresh token expiry timer
    await TokenManager.clearRefreshTokenExpiry();
    

    
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
      // Get refresh token status for logging (async)
      const refreshTokenStatus = await TokenManager.getRefreshTokenStatus();
      
      // For session restoration, use original expiry check
      // For manual refresh (Continue to Work), use operational expiry only if dual token system is active
      let shouldProceed = true;
      let expiryCheckReason = '';
      
      if (!isSessionRestoration) {
        const originalTimeRemaining = refreshTokenStatus.timeRemaining;
        
        // Check if refresh token has sufficient time remaining
        if (originalTimeRemaining && originalTimeRemaining <= 0) {
          // Refresh token is already expired
          shouldProceed = false;
          expiryCheckReason = 'refresh_token_expired';
        } else {
          // Allow refresh as long as token is not expired
          // The server-side validation will handle any timing issues
          expiryCheckReason = 'refresh_token_sufficient_time';
        }
      } else {
        expiryCheckReason = 'session_restoration';
      }
      
      if (!shouldProceed) {
        logTokenRefreshTiming('refresh_access_token', null, { 
          error: expiryCheckReason,
          isSessionRestoration,
          originalTimeRemaining: refreshTokenStatus.timeRemaining
        });
        return false;
      }
      logTokenRefreshTiming('refresh_access_token_start', refreshTokenStatus.timeRemaining, { 
        isSessionRestoration,
        isExpired: refreshTokenStatus.isExpired,
        needsRenewal: refreshTokenStatus.needsRenewal
      });



      // Calculate dynamic buffer time based on token creation time
      // This enables the server to set appropriate cookie expiry based on session duration
      const dynamicBuffer = TokenManager.calculateDynamicBuffer();
      console.log('🔄 Dynamic buffer time:', dynamicBuffer, 'ms (', dynamicBuffer ? Math.round(dynamicBuffer / 1000) : 'null', 'seconds)');
      
      // Debug: Check if refresh token cookie exists
      console.log('🔄 Checking refresh token cookie before mutation...');
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      console.log('🔄 Available cookies:', Object.keys(cookies));
      console.log('🔄 Refresh token cookie exists:', !!cookies.jid);
      
      const result = await refreshTokenMutation({
        variables: {
          dynamicBuffer: dynamicBuffer || 0
        }
      });
      
      // Log any GraphQL errors
      if (result.errors) {
        console.log('🔄 GraphQL errors:', result.errors);
      }

      if (!result.data || !result.data.refreshToken) {
        console.log('🔄 Refresh failed: No data or refresh token in response');
        logTokenRefreshTiming('refresh_access_token', refreshTokenStatus.timeRemaining, { 
          error: 'no_data_response',
          isSessionRestoration,
          hasResult: !!result,
          hasData: !!(result && result.data),
          hasRefreshToken: !!(result && result.data && result.data.refreshToken)
        });
        return false;
      }

      const { accessToken, refreshToken, csrfToken, user: refreshedUser } = result.data.refreshToken;

      if (accessToken && refreshedUser) {
        logTokenRefreshTiming('refresh_access_token', refreshTokenStatus.timeRemaining, { 
          success: true,
          isSessionRestoration,
          hasAccessToken: !!accessToken,
          hasUser: !!refreshedUser,
          hasCSRFToken: !!csrfToken 
        });

        // Store the new access token and user data in memory
        TokenManager.updateAccessToken(accessToken);
        if (refreshedUser) {
          TokenManager.updateUser(refreshedUser);
        }

        // Store token creation time for dynamic buffer calculation
        // This enables the "Continue to Work" functionality with dynamic buffer based on session duration
        TokenManager.setTokenCreationTime(Date.now());

        // Set CSRF token in Apollo Client for future mutations
        if (csrfToken) {
          setApolloCSRFToken(csrfToken);
        }

        // Update authentication state
        setUser(refreshedUser);
        setIsAuthenticated(true);

        // Reset activity timer
        TokenManager.updateActivity();
        
        // Handle session restoration vs manual refresh differently
        if (isSessionRestoration) {
          // For browser refresh: DO NOT set refresh token timer
          // This allows the access token timer to work normally and reset on user activity
          // The refresh token timer should only start when access token expires due to inactivity
          logTokenRefreshTiming('refresh_access_token', refreshTokenStatus.timeRemaining, { 
            action: 'session_restoration_no_refresh_timer' 
          });
        } else {
          // For manual refresh (Continue to Work): Keep refresh token countdown visible
          // This shows users the actual remaining time on their refresh token
          logTokenRefreshTiming('refresh_access_token', refreshTokenStatus.timeRemaining, { 
            action: 'manual_refresh_keep_refresh_timer' 
          });
        }

        return true;
      } else {
        logTokenRefreshTiming('refresh_access_token', refreshTokenStatus.timeRemaining, { 
          error: 'missing_tokens_or_user',
          isSessionRestoration,
          hasAccessToken: !!accessToken,
          hasUser: !!refreshedUser 
        });
        return false;
      }
    } catch (error: any) {
      console.error('❌ Error refreshing access token:', error);
      
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const graphQLError = error.graphQLErrors[0];
        console.error('❌ GraphQL Error during token refresh:', {
          message: graphQLError.message,
          code: graphQLError.extensions?.code,
          path: graphQLError.path
        });
        
        if (graphQLError.message === 'Refresh token is required') {
          logTokenRefreshTiming('refresh_access_token', null, { 
            error: 'refresh_token_required',
            isSessionRestoration 
          });
          return false;
        }
        
        logTokenRefreshTiming('refresh_access_token', null, { 
          error: 'graphql_error',
          isSessionRestoration,
          graphQLError: graphQLError.message 
        });
      } else if (error.message && error.message.includes('Refresh token is required')) {
        // Handle case where error is not in graphQLErrors but in error.message
        logTokenRefreshTiming('refresh_access_token', null, { 
          error: 'refresh_token_required_from_message',
          isSessionRestoration 
        });
        return false;
      } else if (error.networkError) {
        // Handle network errors
        console.error('❌ Network Error during token refresh:', error.networkError);
        logTokenRefreshTiming('refresh_access_token', null, { 
          error: 'network_error',
          isSessionRestoration,
          networkError: error.networkError.message 
        });
      } else {
        logTokenRefreshTiming('refresh_access_token', null, { 
          error: 'unknown_error',
          isSessionRestoration,
          errorMessage: error.message 
        });
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
      // Check if refresh token is too close to expiry before attempting renewal
      const refreshTokenStatus = await TokenManager.getRefreshTokenStatus();
      const timeRemaining = refreshTokenStatus.timeRemaining;
      
      // Log timing information for debugging
      logTokenRefreshTiming('renew_refresh_token_start', timeRemaining, { 
        isExpired: refreshTokenStatus.isExpired,
        needsRenewal: refreshTokenStatus.needsRenewal 
      });
      
      // Allow renewal as long as refresh token is valid (even with 1 second remaining)
      // Server-side safety buffers will handle race conditions
      if (refreshTokenStatus.isExpired) {
        logTokenRefreshTiming('renew_refresh_token', timeRemaining, { 
          error: 'refresh_token_expired',
          timeRemaining: timeRemaining 
        });
        return false;
      }

      // Debug logging disabled for better user experience

      const result = await refreshTokenRenewalMutation();
      
      // Check if the mutation result is null or undefined
      if (!result || !result.data) {
        logTokenRefreshTiming('renew_refresh_token', timeRemaining, { 
          error: 'no_mutation_result',
          hasResult: !!result,
          hasData: !!(result && result.data)
        });
        return false;
      }

      const { success, user: renewedUser } = result.data.refreshTokenRenewal;

      if (success && renewedUser) {
        // Debug logging disabled for better user experience
        logTokenRefreshTiming('renew_refresh_token', timeRemaining, { 
          success: true,
          userUpdated: !!renewedUser 
        });

        // Update user data
        setUser(renewedUser);
        
        // Reset refresh token expiry timer to reflect the renewed token
        // This ensures the client-side timer matches the server-side renewal
        await TokenManager.updateRefreshTokenExpiry();

        return true;
      } else {
        logTokenRefreshTiming('renew_refresh_token', timeRemaining, { 
          error: 'server_response_failed',
          success: success,
          hasUser: !!renewedUser 
        });
        return false;
      }
    } catch (error) {
      console.error('❌ Error renewing refresh token:', error);
      logTokenRefreshTiming('renew_refresh_token', null, { 
        error: 'exception',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.constructor.name : typeof error
      });
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
        console.warn('⚠️ Error clearing Apollo cache:', cacheError);
      });
      
      // Small delay to ensure state changes are processed
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Clear logout transition state
      TokenManager.setLogoutTransition(false);
    } catch (error) {
      console.error('❌ Error during logout from modal:', error);
      // Clear logout transition state on error
      TokenManager.setLogoutTransition(false);
      throw error;
    }
  }, [modalAutoLogoutTimer, setModalAutoLogoutTimer, setShowSessionExpiryModal, setSessionExpiryMessage, setLastModalShowTime, setUser, setIsAuthenticated, client]);

  /**
   * Refresh session when user clicks "Continue to Work"
   * Handles both access token refresh and refresh token renewal
   * Enhanced with improved timing logic for better reliability
   */
  const refreshSession = useCallback(async (): Promise<boolean> => {
    // Prevent multiple simultaneous refresh attempts
    if (TokenManager.getContinueToWorkTransition()) {
      console.log('🔄 Refresh already in progress, skipping duplicate call');
      return false;
    }
    
    try {
      // Clear auto logout timer when user chooses to continue working
      if (modalAutoLogoutTimer) {
        clearTimeout(modalAutoLogoutTimer);
        setModalAutoLogoutTimer(null);
      }
      
      // Get refresh token status to check timing
      const refreshTokenStatus = await TokenManager.getRefreshTokenStatus();
      const timeRemaining = refreshTokenStatus.timeRemaining;
      
      // For manual refresh (Continue to Work), use improved timing logic with async/await
      let shouldProceed = true;
      let expiryCheckReason = '';
      
      const originalTimeRemaining = refreshTokenStatus.timeRemaining;
      
      // Check if refresh token has sufficient time remaining
      if (originalTimeRemaining && originalTimeRemaining <= 0) {
        // Refresh token is already expired
        shouldProceed = false;
        expiryCheckReason = 'refresh_token_expired';
      } else {
        // Allow refresh as long as token is not expired
        // The server-side validation will handle any timing issues
        expiryCheckReason = 'refresh_token_sufficient_time';
      }
      
      // Log timing information for debugging
      logTokenRefreshTiming('refresh_session_start', timeRemaining, { 
        isExpired: refreshTokenStatus.isExpired,
        needsRenewal: refreshTokenStatus.needsRenewal,
        originalTimeRemaining: originalTimeRemaining,
        expiryCheckReason: expiryCheckReason,
        shouldProceed: shouldProceed
      });
      
      if (!shouldProceed) {
        logTokenRefreshTiming('refresh_session', timeRemaining, { 
          error: expiryCheckReason,
          originalTimeRemaining: refreshTokenStatus.timeRemaining
        });
        setShowSessionExpiryModal(false);
        showNotification('Session has expired. Please log in again.', 'error');
        return false;
      }
      
      // Set transition state for visual feedback
      TokenManager.setContinueToWorkTransition(true);
      
      // IMPROVED LOGIC: Use direct access token refresh with better error handling
      logTokenRefreshTiming('refresh_access_token_direct', timeRemaining, { 
        reason: 'improved_refresh_logic' 
      });
      
      console.log('🔄 Starting refresh access token...');
      const refreshSuccess = await refreshAccessToken(false);
      console.log('🔄 Refresh access token result:', refreshSuccess);
      
      // Clear transition state
      TokenManager.setContinueToWorkTransition(false);
      
      if (refreshSuccess) {
        console.log('🔄 Refresh success - proceeding with success flow');
        
        // Success - clear modal and show success message
        // Clear refresh token timer after successful refresh to allow normal activity tracking
        // This prevents the activity tracker from being blocked by the refresh token timer
        
        logTokenRefreshTiming('refresh_session', timeRemaining, { 
          success: true,
          operation: 'direct_refresh_clear_refresh_timer' 
        });
        
        try {
          // Clear refresh token timer to allow normal activity tracking
          await TokenManager.clearRefreshTokenExpiry();
          console.log('🔄 Refresh token expiry cleared successfully');
          
          // Don't update user state immediately to prevent SessionManager from triggering another refresh
          // The SessionManager will naturally detect the refreshed tokens on its next check
          console.log('🔄 Skipping user state update to prevent duplicate refresh');
          
          setShowSessionExpiryModal(false);
          setLastModalShowTime(null);
          showNotification('You can continue working now!', 'success');
          console.log('🔄 Success flow completed - returning true');
          return true;
        } catch (successError) {
          console.error('❌ Error in success flow:', successError);
          throw successError; // Re-throw to be caught by outer catch block
        }
      } else {
        console.log('🔄 Refresh failed - proceeding with error flow');
        // Refresh failed - show error message with detailed logging
        logTokenRefreshTiming('refresh_session', timeRemaining, { 
          error: 'refresh_failed',
          operation: 'direct_refresh',
          originalTimeRemaining: originalTimeRemaining,
          expiryCheckReason: expiryCheckReason
        });
        setShowSessionExpiryModal(false);
        showNotification('Failed to refresh session. Please log in again.', 'error');
        return false;
      }
    } catch (error) {
      console.error('❌ Error in refreshSession:', error);
      logTokenRefreshTiming('refresh_session', null, { 
        error: 'exception',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      setShowSessionExpiryModal(false);
      showNotification('Failed to refresh session. Please log in again.', 'error');
      return false;
    }
  }, [refreshAccessToken, setShowSessionExpiryModal, setLastModalShowTime, showNotification, modalAutoLogoutTimer, setModalAutoLogoutTimer]);

  return {
    login,
    logout,
    logoutFromModal, // NEW: Logout from modal with transition state
    refreshSession,
    refreshAccessToken,
    renewRefreshToken,
    fetchCurrentUser,
    performCompleteLogout,
    loginLoading,
    logoutLoading,
  };
}; 