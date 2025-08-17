import { useCallback, useEffect, useRef } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { LOGIN, LOGOUT, REFRESH_TOKEN, REFRESH_TOKEN_RENEWAL } from '../../services/graphql/mutations';
import { GET_CURRENT_USER } from '../../services/graphql/queries';
import { LoginInput, User } from '../../types/graphql';
import { clearCSRFToken as clearApolloCSRFToken, setCSRFToken as setApolloCSRFToken } from '../../services/graphql/apollo-client';
import { getTokens, clearTokens, saveTokens, TokenManager } from '../../utils/tokenManager';
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
  pauseAutoLogoutForRefresh?: () => void,
  resumeAutoLogoutAfterRefresh?: () => void,
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
   * Perform complete logout - Clears all authentication data
   * Used for both manual logout and automatic logout scenarios
   */
  const performCompleteLogout = useCallback(async () => {
    console.log('🧹 Perform Complete Logout - Starting cleanup...');
    
    // Clear modal auto-logout timer using ref for immediate access
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
    console.log('🧹 Perform Complete Logout - Tokens cleared');
    
    // Clear token creation time specifically for complete logout
    // This ensures new tokens will have fresh creation time for dynamic buffer calculation
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
    console.log('🧹 Perform Complete Logout - User state cleared');
    
    // Clear CSRF token from Apollo Client
    clearApolloCSRFToken();

    // Clear Apollo cache to ensure clean state
    try {
      await client.clearStore();
      console.log('🧹 Perform Complete Logout - Apollo cache cleared');
    } catch (cacheError) {
      // Cache clearing failed - this is not critical for logout
    }

    // Force a small delay to ensure all state changes are processed
    // This prevents race conditions during logout
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('🧹 Perform Complete Logout - Cleanup completed');
  }, [client, modalAutoLogoutTimer, setModalAutoLogoutTimer, setShowSessionExpiryModal, setSessionExpiryMessage, setLastModalShowTime, setUser, setIsAuthenticated]);

  /**
   * Refresh access token using refresh token
   * Attempts to get a new access token using the httpOnly refresh token
   * @param isSessionRestoration - Whether this is for session restoration (browser refresh) or token refresh (expired token)
   */
  const refreshAccessToken = useCallback(async (isSessionRestoration: boolean = false): Promise<boolean> => {
    try {
      console.log('🔄 Refresh Access Token - Starting refresh, isSessionRestoration:', isSessionRestoration);
      
      // Get refresh token status to check timing
      const refreshTokenStatus = await TokenManager.getRefreshTokenStatus();
      const timeRemaining = refreshTokenStatus.timeRemaining;
      
      console.log('🔄 Refresh Access Token - Token status:', { timeRemaining, isExpired: refreshTokenStatus.isExpired });
      
      // Log timing information for debugging
      logTokenRefreshTiming('refresh_access_token_start', timeRemaining, { 
        isSessionRestoration,
        isExpired: refreshTokenStatus.isExpired
      });
      
      // Check if refresh token has sufficient time remaining
      // Allow refresh even with 0 time remaining - server will validate
      // This prevents the client-side timer from blocking legitimate refresh attempts
      if (timeRemaining === null) {
        // No refresh token timer set - this is unusual but allow the attempt
        console.log('🔄 Refresh Access Token - No refresh timer set, allowing attempt');
        logTokenRefreshTiming('refresh_access_token', timeRemaining, { 
          info: 'no_refresh_timer_set_allowing_attempt',
          isSessionRestoration 
        });
      } else if (timeRemaining <= 0) {
        // Time remaining is 0 or negative, but still allow the attempt
        // The server-side validation will be the authority on whether the refresh token is still valid
        console.log('🔄 Refresh Access Token - Time remaining <= 0, allowing attempt');
        logTokenRefreshTiming('refresh_access_token', timeRemaining, { 
          info: 'time_remaining_zero_allowing_attempt',
          isSessionRestoration 
        });
      }
      
      // Calculate dynamic buffer time for server-side cookie expiry
      const dynamicBuffer = TokenManager.calculateDynamicBuffer();
      console.log('🔄 Refresh Access Token - Dynamic buffer:', dynamicBuffer);
      
      // Call refresh token mutation with dynamic buffer
      console.log('🔄 Refresh Access Token - Calling refresh token mutation...');
      const result = await refreshTokenMutation({
        variables: {
          dynamicBuffer: dynamicBuffer || undefined
        }
      });
      
      console.log('🔄 Refresh Access Token - Mutation result:', { 
        hasErrors: !!result.errors, 
        hasData: !!result.data,
        errors: result.errors?.map(e => e.message)
      });
      
      if (result.errors && result.errors.length > 0) {
        // GraphQL errors
        console.error('🔄 Refresh Access Token - GraphQL errors:', result.errors);
        logTokenRefreshTiming('refresh_access_token', timeRemaining, { 
          error: 'graphql_errors',
          isSessionRestoration,
          errors: result.errors.map(e => e.message)
        });
        return false;
      }
      
      const { refreshToken: refreshData } = result.data || {};
      console.log('🔄 Refresh Access Token - Refresh data:', { 
        hasAccessToken: !!refreshData?.accessToken,
        hasRefreshToken: !!refreshData?.refreshToken,
        hasUser: !!refreshData?.user
      });
      
      // Validate response data
      if (!refreshData || !refreshData.accessToken || !refreshData.refreshToken || !refreshData.user) {
        // No valid tokens or user data returned - user is not authenticated
        console.log('🔄 Refresh Access Token - No valid tokens or user data returned');
        setUser(null);
        setIsAuthenticated(false);
        
        logTokenRefreshTiming('refresh_access_token', timeRemaining, { 
          error: 'missing_tokens_or_user',
          isSessionRestoration,
          hasAccessToken: !!refreshData?.accessToken,
          hasRefreshToken: !!refreshData?.refreshToken,
          hasUser: !!refreshData?.user 
        });
        return false;
      }
      
      // Store new tokens and update authentication state
      const { accessToken, refreshToken, csrfToken, user: refreshedUser } = refreshData;
      
      console.log('🔄 Refresh Access Token - Storing tokens and updating state...');
      
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
      
      console.log('🔄 Refresh Access Token - Refresh successful, user authenticated (first-time login state)');
      
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
    } catch (error: any) {
      console.error('🔄 Refresh Access Token - Error:', error);
      
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const graphQLError = error.graphQLErrors[0];
        
        if (graphQLError.message === 'Refresh token is required') {
          console.log('🔄 Refresh Access Token - Refresh token is required error');
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
        console.log('🔄 Refresh Access Token - Refresh token is required error (from message)');
        logTokenRefreshTiming('refresh_access_token', null, { 
          error: 'refresh_token_required_from_message',
          isSessionRestoration 
        });
        return false;
      } else if (error.networkError) {
        // Handle network errors
        console.error('🔄 Refresh Access Token - Network error:', error.networkError);
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
      // Check if we have tokens before making the GraphQL call
      const tokens = getTokens();
      if (!tokens.accessToken) {
        // No access token - don't make GraphQL call
        setUser(null);
        setIsAuthenticated(false);
        return;
      }
      
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
   * Ensures refresh token is properly deleted from database
   */
  const logout = useCallback(async () => {
    try {
      console.log('🚪 Logout - Starting logout process...');
      setLogoutLoading(true);
      
      // Call server logout first to clear refresh token from database
      // This is critical for proper session termination
      try {
        console.log('🚪 Logout - Calling server logout mutation...');
        const result = await logoutMutation();
        console.log('🚪 Logout - Server logout successful:', result);
      } catch (serverError: any) {
        // Server logout failed - this could be due to:
        // 1. Expired access token (403 Forbidden) - this is expected during logout
        // 2. Network issues
        // 3. Server errors
        console.log('🚪 Logout - Server logout failed:', serverError);
        
        // Check if it's a 403 error (Forbidden) - this usually means expired tokens
        // This is expected behavior during logout, so we continue with local cleanup
        if (serverError.networkError?.statusCode === 403 || 
            serverError.message?.includes('403') ||
            serverError.message?.includes('Forbidden')) {
          console.log('🚪 Logout - Server logout failed with 403 - tokens likely expired, continuing with local cleanup');
        } else {
          // For other errors, log them but continue with local cleanup
          console.error('🚪 Logout - Server logout failed with unexpected error:', serverError);
        }
        
        // Continue with local cleanup regardless of server error
        // This ensures the user is logged out locally even if server logout fails
      }
    } catch (error) {
      // Any other unexpected errors during logout
      console.error('🚪 Logout - Unexpected logout error:', error);
      // Don't show errors to user during logout process
    } finally {
      // Always perform local cleanup to ensure user is logged out
      console.log('🚪 Logout - Performing local cleanup...');
      await performCompleteLogout();
      console.log('🚪 Logout - Logout process completed');
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
      
      // Clear refresh token flag
      
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
      // Clear logout transition state on error
      TokenManager.setLogoutTransition(false);
      
      // Don't throw error to prevent error messages during logout
      // Logout should always succeed from user perspective
    }
  }, [modalAutoLogoutTimer, setModalAutoLogoutTimer, setShowSessionExpiryModal, setSessionExpiryMessage, setLastModalShowTime, setUser, setIsAuthenticated, client]);

  /**
   * Wrapper function for refresh session with auto-logout pause/resume
   * Prevents auto-logout from interfering with refresh operations
   */
  const refreshSessionWithAutoLogoutControl = useCallback(async (): Promise<boolean> => {
    // Prevent multiple simultaneous refresh attempts
    if (TokenManager.getContinueToWorkTransition()) {
      // Refresh already in progress, skipping duplicate call
      return false;
    }
    
    try {
      // Get refresh token status to check timing
      const refreshTokenStatus = await TokenManager.getRefreshTokenStatus();
      const timeRemaining = refreshTokenStatus.timeRemaining;
      
      // Debug logging to understand refresh token timer behavior
      console.log('🔄 Refresh Session - Refresh token status:', {
        timeRemaining,
        isExpired: refreshTokenStatus.isExpired,
        hasMoreThan5Seconds: timeRemaining && timeRemaining > 5000
      });
      
      // For manual refresh (Continue to Work), allow refresh even with 0 time remaining
      // The server-side validation will be the authority on whether the refresh token is still valid
      // This prevents the client-side timer from blocking legitimate refresh attempts
      let shouldProceed = true;
      let expiryCheckReason = '';
      
      const originalTimeRemaining = refreshTokenStatus.timeRemaining;
      
      // Allow refresh as long as refresh token exists (even with 0 time remaining)
      // The server will handle the actual validation and timing
      if (originalTimeRemaining === null) {
        // No refresh token timer set - this is unusual but allow the attempt
        shouldProceed = true;
        expiryCheckReason = 'no_refresh_timer_set';
      } else {
        // Allow refresh even with 0 time remaining - server will validate
        shouldProceed = true;
        expiryCheckReason = 'allow_refresh_attempt';
      }
      
      // Log timing information for debugging
      logTokenRefreshTiming('refresh_session_start', timeRemaining, { 
        isExpired: refreshTokenStatus.isExpired,
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
      
      // Set refresh operation in progress to prevent auto-logout
      TokenManager.setRefreshOperationInProgress(true);
      
      // IMPROVED LOGIC: Use direct access token refresh with better error handling
      logTokenRefreshTiming('refresh_access_token_direct', timeRemaining, { 
        reason: 'improved_refresh_logic' 
      });
      
      // Starting refresh access token...
      const refreshSuccess = await refreshAccessToken(false);
      // Refresh access token result
      
      // Clear transition state
      TokenManager.setContinueToWorkTransition(false);
      
      // Clear refresh operation state
      TokenManager.setRefreshOperationInProgress(false);
      
      if (refreshSuccess) {
        // Refresh success - proceeding with success flow
        
        logTokenRefreshTiming('refresh_session', timeRemaining, { 
          success: true,
          operation: 'direct_refresh_success' 
        });
        
        try {
          console.log('🔄 Refresh Session - Refresh successful, resetting to first-time login state...');
          
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
          
          console.log('🔄 Refresh Session - Reset to first-time login state completed');
          return true;
        } catch (successError) {
          console.error('🔄 Refresh Session - Error in success flow:', successError);
          throw successError; // Re-throw to be caught by outer catch block
        }
      } else {
        // Refresh failed - proceeding with error flow
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
    refreshSession: refreshSessionWithAutoLogoutControl,
    refreshAccessToken,
    renewRefreshToken,
    fetchCurrentUser,
    performCompleteLogout,
    loginLoading,
    logoutLoading,
  };
}; 