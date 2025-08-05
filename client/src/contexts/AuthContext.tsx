import { useApolloClient, useLazyQuery, useMutation } from '@apollo/client';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AUTH_CONFIG } from '../constants';
import { clearCSRFToken as clearApolloCSRFToken, setCSRFToken as setApolloCSRFToken } from '../services/graphql/apollo-client';
import { LOGIN, LOGOUT, REFRESH_TOKEN, REFRESH_TOKEN_RENEWAL } from '../services/graphql/mutations';
import { GET_CURRENT_USER } from '../services/graphql/queries';
import { LoginInput, User } from '../types/graphql';
import {
  clearTokens,
  getTokens,
  isTokenExpired,
  saveTokens,
  updateActivity,
  isRefreshTokenExpired,
  isUserInactive,
  getActivityBasedTokenExpiry,
  isActivityBasedTokenExpired,
  TokenManager,
  isRefreshTokenNeedsRenewal,
} from '../utils/tokenManager';

/**
 * Authentication Context Interface
 * Defines the shape of the authentication context for login functionality
 */
interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean; // New: indicates if auth is being initialized
  showLoadingSpinner: boolean; // New: indicates if loading spinner should be shown

  // Session expiry state
  showSessionExpiryModal: boolean; // New: shows session expiry modal
  sessionExpiryMessage: string; // New: message to display in modal

  // Notification state
  notification: {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  };

  // Loading states
  loginLoading: boolean;
  logoutLoading: boolean;

  // Actions
  login: (input: LoginInput) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;

  // Session management
  refreshSession: () => Promise<boolean>; // New: manually refresh session

  // Notification management
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void; // New: show notification
  hideNotification: () => void; // New: hide notification

  // Utilities
  hasRole: (role: string) => boolean;
  validateSession: () => Promise<boolean>;
  handleUserActivity: () => Promise<void>;
}

/**
 * AuthProvider Props Interface
 * Defines props for the AuthProvider component
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthContext Creation
 * Creates the authentication context with default values
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to use authentication context
 * Provides type-safe access to authentication state and functions
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider Component
 * Wraps the application and provides authentication context
 * Handles the complete authentication flow: Login → GraphQL → Server → DB → Response
 * 
 * EXECUTION FLOW FOR DIFFERENT SCENARIOS:
 * 
 * 1. FIRST TIME LOGIN (No tokens):
 *    - validateSession() → returns false (no tokens)
 *    - login() → calls loginMutation → apollo-client.ts → server auth.ts → DB
 *    - saveTokens() → stores tokens in tokenManager.ts
 *    - setUser() + setIsAuthenticated(true) → updates state
 * 
 * 2. ACTIVE USER (Within ACCESS_TOKEN_EXPIRY):
 *    - User activity detected → updateActivity() → extends session
 *    - User remains authenticated → no logout
 * 
 * 3. INACTIVE USER (ACCESS_TOKEN_EXPIRY reached):
 *    - User inactive for 1 minute → automatic logout
 *    - User must login again
 * 
 * 4. REFRESH_TOKEN_EXPIRY reached (Absolute timeout):
 *    - Regardless of activity → automatic logout
 *    - User must login again
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Core authentication state
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true); // New state for initialization
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false); // New state for loading spinner

  // Session expiry state
  const [showSessionExpiryModal, setShowSessionExpiryModal] = useState(false); // New: shows session expiry modal
  const [sessionExpiryMessage, setSessionExpiryMessage] = useState(''); // New: message to display in modal
  const [lastModalShowTime, setLastModalShowTime] = useState<number | null>(null); // Track when modal was last shown

  // Notification state
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  // Apollo client for cache operations
  const client = useApolloClient();

  // Ref to track if auth has been initialized (prevents duplicate initialization)
  const isInitializedRef = useRef(false);

  // Timer ref for activity and session checking
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Flag to prevent multiple simultaneous refresh token renewal attempts
  const isRenewingRef = useRef(false);

  // GraphQL operations - only essential mutations and queries
  const [getCurrentUser] = useLazyQuery(GET_CURRENT_USER);
  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN);
  const [logoutMutation, { loading: logoutLoading }] = useMutation(LOGOUT);
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN);
  const [refreshTokenRenewalMutation] = useMutation(REFRESH_TOKEN_RENEWAL);


  /**
   * Perform complete logout - clears all authentication data
   * Used for both manual logout and automatic logout scenarios
   * 
   * CALLED BY: logout(), checkSessionAndActivity()
   * SCENARIOS: All logout scenarios - ensures clean state
   */
  const performCompleteLogout = useCallback(async () => {
    // Close session expiry modal if it's open
    setShowSessionExpiryModal(false);
    setSessionExpiryMessage('');
    setLastModalShowTime(null); // Reset modal show time

    // Clear all authentication data
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);

    // Clear CSRF token from Apollo Client
    clearApolloCSRFToken();

    // Clear activity timer since we're no longer authenticated
    if (activityTimerRef.current) {
      clearInterval(activityTimerRef.current);
      activityTimerRef.current = null;
    }

    // Clear Apollo cache to ensure clean state
    try {
      await client.clearStore();
    } catch (cacheError) {
      console.warn('⚠️ Error clearing Apollo cache:', cacheError);
    }
  }, [client]);

  /**
   * Refresh access token using refresh token
   * Attempts to get a new access token using the httpOnly refresh token
   * 
   * @returns Promise<boolean> - true if refresh was successful
   */
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🔄 Attempting to refresh access token...');

      // Check if we have a refresh token available (it should be in httpOnly cookie)
      // If no refresh token is available, the server will return "Refresh token is required"
      // This is expected behavior when user is not logged in
      const result = await refreshTokenMutation();

      // Check if the response has the expected structure
      if (!result.data || !result.data.refreshToken) {
        console.log('❌ Invalid refresh token response structure:', result);
        return false;
      }

      const { accessToken, refreshToken, csrfToken, user: refreshedUser } = result.data.refreshToken;

      if (accessToken && refreshedUser) {
        console.log('✅ Access token refreshed successfully');

        // Store the new access token and user data in memory
        // Note: refresh token is stored in httpOnly cookie by the server
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
      // Handle specific GraphQL errors
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
  }, [refreshTokenMutation]);

  /**
   * Renew refresh token to extend session
   * Used when user is active but refresh token is about to expire
   * 
   * @returns Promise<boolean> - true if renewal was successful
   */
  const renewRefreshToken = useCallback(async (): Promise<boolean> => {
    // Prevent multiple simultaneous renewal attempts
    if (isRenewingRef.current) {
      console.log('🔄 Refresh token renewal already in progress, skipping...');
      return false;
    }

    try {
      isRenewingRef.current = true;
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
    } finally {
      isRenewingRef.current = false;
    }
  }, [refreshTokenRenewalMutation]);

  /**
   * Show notification
   * 
   * CALLED BY: Components needing to show notifications
   * SCENARIOS: Success, error, or info messages
   */
  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type, isVisible: true });
  }, []);

  /**
   * Hide notification
   * 
   * CALLED BY: Components needing to hide notifications
   * SCENARIOS: Dismissing notifications
   */
  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  }, []);

  /**
   * Check session and user activity
   * Runs periodically to manage session based on activity and timeouts
   * 
   * CALLED BY: Timer interval after successful login
   * SCENARIOS: 
   * - Active user: Continues session (activity tracked by handleUserActivity)
   * - Inactive user: Attempts token refresh, logs out if refresh fails
   * - Activity-based token expired: Attempts token refresh, logs out if refresh fails
   * - Refresh token expired: Performs logout due to absolute timeout
   */
  const checkSessionAndActivity = useCallback(async () => {
    try {
      // Check if refresh token is expired (absolute timeout) - ALWAYS CHECK FIRST
      const refreshTokenExpired = isRefreshTokenExpired();
      console.log('🔍 SESSION CHECK - Refresh token expired:', refreshTokenExpired);

      if (refreshTokenExpired) {
        console.log('🔐 Refresh token expired (absolute timeout), performing logout...');
        setShowSessionExpiryModal(false); // Hide modal if it's showing
        showNotification('Your session has expired due to inactivity. Please log in again.', 'info');
        await performCompleteLogout();
        return;
      }

      // Check if access token is expired but refresh token is still valid
      const tokens = getTokens();
      if (tokens.accessToken) {
        let isAccessTokenExpired = false;
        if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
          isAccessTokenExpired = isActivityBasedTokenExpired();
        } else {
          isAccessTokenExpired = isTokenExpired(tokens.accessToken);
        }

        console.log('🔍 SESSION CHECK - Access token expired:', isAccessTokenExpired);
        console.log('🔍 SESSION CHECK - Modal currently showing:', showSessionExpiryModal);

        // Show modal only if access token is expired, refresh token is valid, modal is not already showing, and enough time has passed since last show
        const now = Date.now();
        const timeSinceLastShow = lastModalShowTime ? now - lastModalShowTime : Infinity;
        const minTimeBetweenShows = 5000; // 5 seconds minimum between modal shows

        if (isAccessTokenExpired && !refreshTokenExpired && !showSessionExpiryModal && timeSinceLastShow > minTimeBetweenShows) {
          console.log('🔐 Access token expired but refresh token still valid - showing session expiry modal');
          setSessionExpiryMessage('Your session has expired. Click "Continue to Work" to refresh your session or "Logout" to sign in again.');
          setShowSessionExpiryModal(true);
          setLastModalShowTime(now);

          // Start the refresh token expiry timer when access token expires
          TokenManager.startRefreshTokenExpiryTimer();

          // Return early to prevent other checks from hiding the modal
          return;
        }

        // If modal is already showing, don't run additional checks that could hide it
        if (showSessionExpiryModal) {
          console.log('🔐 Session expiry modal is already showing - skipping additional checks');
          return;
        }
      }

      // Only run these checks if modal is not showing to prevent auto-hiding
      if (!showSessionExpiryModal) {
        // Check if refresh token needs renewal (proactive renewal for active users)
        if (AUTH_CONFIG.REFRESH_TOKEN_AUTO_RENEWAL_ENABLED && isRefreshTokenNeedsRenewal()) {
          console.log('🔄 Refresh token needs renewal, attempting renewal...');
          const renewalSuccess = await renewRefreshToken();
          if (!renewalSuccess) {
            console.log('❌ Refresh token renewal failed, but continuing session...');
          }
        }

        // Check if activity-based token is expired (when user stops being active)
        if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED && isActivityBasedTokenExpired()) {
          console.log('🔐 Activity-based token expired (user stopped being active), attempting token refresh...');
          const refreshSuccess = await refreshAccessToken();
          if (!refreshSuccess) {
            console.log('🔐 Token refresh failed, performing logout...');
            await performCompleteLogout();
            return;
          }
        }

        // Check if user has been inactive for too long (application-level inactivity)
        if (isUserInactive(AUTH_CONFIG.INACTIVITY_THRESHOLD)) {
          console.log('🔐 User inactive for too long (no application actions), attempting token refresh...');
          const refreshSuccess = await refreshAccessToken();
          if (!refreshSuccess) {
            console.log('🔐 Token refresh failed, performing logout...');
            await performCompleteLogout();
            return;
          }
        }
      }

      // User session is still valid and active - NO TOKEN REFRESH HERE
      // Token refresh is handled by handleUserActivity when actual user activity is detected
    } catch (error) {
      console.error('❌ Error checking session and activity:', error);
      await performCompleteLogout();
    }
  }, [performCompleteLogout, refreshAccessToken, renewRefreshToken, showNotification, showSessionExpiryModal]);

  /**
   * Set up activity tracking
   * Starts timer to monitor user activity and session timeouts
   * 
   * CALLED BY: useEffect when user becomes authenticated
   * SCENARIOS: All scenarios - monitors user activity and session
   */
  const setupActivityTracking = useCallback(() => {
    // Clear existing timer
    if (activityTimerRef.current) {
      clearInterval(activityTimerRef.current);
      activityTimerRef.current = null;
    }

    // Start activity checking timer
    activityTimerRef.current = setInterval(checkSessionAndActivity, AUTH_CONFIG.ACTIVITY_CHECK_INTERVAL);
  }, [checkSessionAndActivity]);

  /**
   * Validate current session
   * Checks if user has valid tokens and is authenticated
   * 
   * CALLED BY: apollo-client.ts authLink, components needing auth status
   * SCENARIOS: All scenarios - validates authentication status
   */
  const validateSession = useCallback(async (): Promise<boolean> => {
    try {
      const tokens = getTokens();
      if (!tokens.accessToken) {
        console.log('🔍 No access token found in validateSession, attempting token refresh...');
        // Try to refresh the access token using the refresh token from httpOnly cookie
        const refreshSuccess = await refreshAccessToken();
        return refreshSuccess;
      }

      // Use activity-based token validation if enabled
      if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
        const isExpired = isActivityBasedTokenExpired();
        if (isExpired) {
          console.log('🔍 Activity-based token expired in validateSession, attempting token refresh...');
          const refreshSuccess = await refreshAccessToken();
          return refreshSuccess;
        }
        return true;
      }

      // Fallback to fixed token expiry check
      const isExpired = isTokenExpired(tokens.accessToken);
      if (isExpired) {
        console.log('🔍 Fixed token expired in validateSession, attempting token refresh...');
        const refreshSuccess = await refreshAccessToken();
        return refreshSuccess;
      }
      return true;
    } catch (error) {
      console.error('❌ Error in validateSession:', error);
      return false;
    }
  }, [refreshAccessToken]);

  /**
   * Handle user activity (mouse, keyboard, scroll, etc.)
   * Updates activity timestamp and proactively refreshes tokens for active users
   * 
   * CALLED BY: useActivityTracker hook on user interactions
   * SCENARIOS: All user activity - keeps session alive for active users
   */
  const handleUserActivity = useCallback(async () => {
    try {
      // Update activity timestamp
      updateActivity();

      // Don't refresh tokens if session expiry modal is showing
      // This prevents the modal from auto-closing when user moves mouse
      if (showSessionExpiryModal) {
        console.log('🔐 Session expiry modal is showing - skipping token refresh to prevent auto-close');
        return;
      }

      // Check if access token needs refresh (proactive for active users)
      const tokens = getTokens();
      if (tokens.accessToken) {
        // Use activity-based token expiry if enabled
        const activityBasedExpiry = getActivityBasedTokenExpiry();
        if (activityBasedExpiry && AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
          const timeUntilExpiry = activityBasedExpiry - Date.now();
          // Refresh token if it's more than halfway through its lifetime (30 seconds for 1-minute token)
          // This ensures active users stay logged in by refreshing proactively
          const shouldRefresh = timeUntilExpiry < AUTH_CONFIG.ACTIVITY_TOKEN_REFRESH_THRESHOLD;

          if (shouldRefresh) {
            console.log('🔄 Activity-based token more than halfway through lifetime, refreshing due to user activity...');
            await refreshAccessToken();
          }
        } else {
          // Fallback to original token expiry check
          const expiry = TokenManager.getTokenExpiration(tokens.accessToken);
          if (expiry) {
            const timeUntilExpiry = expiry - Date.now();
            const shouldRefresh = timeUntilExpiry < AUTH_CONFIG.ACTIVITY_TOKEN_REFRESH_THRESHOLD;

            if (shouldRefresh) {
              console.log('🔄 Fixed token more than halfway through lifetime, refreshing due to user activity...');
              await refreshAccessToken();
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Error handling user activity:', error);
    }
  }, [refreshAccessToken, showSessionExpiryModal]);

  /**
   * Fetch current user data
   * Only called when we have valid tokens
   * 
   * CALLED BY: initializeAuth()
   * SCENARIOS:
   * - Valid access token: Fetches user data, updates state
   * - Expired access token: Performs logout, user must login again
   * - Invalid tokens: Updates state to unauthenticated
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
      // Handle authentication errors by performing logout
      if (error.graphQLErrors?.[0]?.extensions?.code === 'UNAUTHENTICATED') {
        console.log('🔐 User authentication failed, performing logout...');
        await performCompleteLogout();
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  }, [getCurrentUser, performCompleteLogout]);

  /**
   * Initialize authentication state
   * Only runs once on app startup
   * 
   * CALLED BY: useEffect on component mount
   * SCENARIOS:
   * - No tokens: Sets unauthenticated
   * - Expired access token + valid refresh token: Attempts token refresh
   * - Expired access token + expired refresh token: Performs logout
   * - Valid tokens: Fetches user data
   * - Invalid tokens: Clears tokens, sets unauthenticated
   */
  const initializeAuth = useCallback(async () => {
    try {
      console.log('🔍 Initializing authentication...');
      setIsInitializing(true);

      // Start delayed loading spinner timer
      const loadingTimer = setTimeout(() => {
        setShowLoadingSpinner(true);
      }, AUTH_CONFIG.SHOW_LOADING_AFTER_DELAY);

      // Set overall timeout for auth initialization
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Auth initialization timeout')), AUTH_CONFIG.AUTH_INITIALIZATION_TIMEOUT);
      });

      const authPromise = (async () => {
        const tokens = getTokens();

        // Check if we have a valid access token in memory
        if (tokens.accessToken) {
          console.log('🔍 Access token found in memory, checking if valid...');

          // Check if access token is expired (using activity-based validation if enabled)
          let isExpired = false;
          if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
            isExpired = isActivityBasedTokenExpired();
          } else {
            isExpired = isTokenExpired(tokens.accessToken);
          }

          if (isExpired) {
            console.log('🔍 Access token expired, attempting token refresh...');
            // Try to refresh the access token using the refresh token from httpOnly cookie
            const refreshSuccess = await refreshAccessToken();
            if (!refreshSuccess) {
              console.log('🔍 Token refresh failed - user must login (refresh token expired or invalid)');
              await performCompleteLogout();
              return;
            }
            // refreshAccessToken already sets user data, so we're done
            console.log('✅ Authentication restored via token refresh');
            return;
          } else {
            console.log('✅ Valid access token found, fetching user data...');
            // Token is valid, fetch user data
            await fetchCurrentUser();
            return;
          }
        } else {
          console.log('🔍 No access token found, attempting token refresh...');
          // Try to refresh the access token using the refresh token from httpOnly cookie
          const refreshSuccess = await refreshAccessToken();
          if (!refreshSuccess) {
            console.log('🔍 Token refresh failed - user must login (no refresh token available)');
            await performCompleteLogout();
            return;
          }
          // refreshAccessToken already sets user data, so we're done
          console.log('✅ Authentication restored via token refresh');
          return;
        }
      })();

      // Race between auth initialization and timeout
      await Promise.race([authPromise, timeoutPromise]);

      // Clear loading timer if auth completed quickly
      clearTimeout(loadingTimer);
      setShowLoadingSpinner(false);

    } catch (error) {
      console.error('❌ Error during authentication initialization:', error);
      setShowLoadingSpinner(false);
      await performCompleteLogout();
    } finally {
      setIsLoading(false);
      setIsInitializing(false);
    }
  }, [fetchCurrentUser, performCompleteLogout, refreshAccessToken]);

  /**
   * Login function - Main authentication entry point
   * Handles the complete flow: LoginForm → AuthContext → GraphQL → Server → DB
   * Only executes when valid credentials are provided
   * 
   * CALLED BY: LoginForm component on form submission
   * SCENARIOS:
   * - First time login: Validates credentials, generates tokens, stores them
   * - Re-login after logout: Same as first time login
   * - Invalid credentials: Returns error, no tokens generated
   */
  const login = useCallback(async (input: LoginInput) => {
    try {
      setIsLoading(true);

      // Execute GraphQL login mutation
      const response = await loginMutation({ variables: { input } });

      // Handle GraphQL errors
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

      // Activity tracking will be set up by useEffect when user state is updated
      return { success: true, user: loginData.user };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  }, [loginMutation]);

  /**
   * Logout function - Main logout entry point
   * Handles server logout and local state cleanup
   * 
   * CALLED BY: Components, session expiry modal
   * SCENARIOS: Manual logout, session expiry logout
   */
  const logout = useCallback(async () => {
    try {
      // Call server logout mutation
      await logoutMutation();
    } catch (error) {
      // Ignore logout errors - always clear local state
      console.warn('⚠️ Server logout failed, but continuing with local cleanup:', error);
    } finally {
      // Use performCompleteLogout to ensure consistent cleanup including modal closure
      await performCompleteLogout();
    }
  }, [logoutMutation, performCompleteLogout]);

  /**
   * Refresh session manually
   * Attempts to refresh the access token using the refresh token
   * 
   * CALLED BY: Session expiry modal
   * SCENARIOS: User clicks "Continue to Work" in the modal
   */
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🔄 Attempting to refresh session manually...');
      const refreshSuccess = await refreshAccessToken();
      if (refreshSuccess) {
        console.log('✅ Session refreshed successfully.');
        setShowSessionExpiryModal(false);
        setLastModalShowTime(null); // Reset modal show time to allow future shows

        // Note: refreshAccessToken already calls TokenManager.storeTokens() 
        // which clears the refresh token expiry timer

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
  }, [refreshAccessToken, showNotification]);

  /**
   * Check if user has specific role
   * Simple role-based access control
   * 
   * CALLED BY: Components for conditional rendering
   * SCENARIOS: All scenarios - checks user role for authorization
   */
  const hasRole = useCallback((role: string): boolean => {
    return user?.role === role;
  }, [user]);

  // Initialize authentication on mount (only once)
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      initializeAuth();
    }
  }, [initializeAuth]);

  // Set up activity tracking when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setupActivityTracking();
    }
  }, [isAuthenticated, user, setupActivityTracking]);

  // Context value with all authentication state and functions
  const contextValue: AuthContextType = {
    // State
    user,
    isAuthenticated,
    isLoading,
    isInitializing,
    showLoadingSpinner,

    // Session expiry state
    showSessionExpiryModal,
    sessionExpiryMessage,

    // Notification state
    notification,

    // Loading states
    loginLoading,
    logoutLoading,

    // Actions
    login,
    logout,

    // Session management
    refreshSession,

    // Notification management
    showNotification,
    hideNotification,

    // Utilities
    hasRole,
    validateSession,
    handleUserActivity,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 