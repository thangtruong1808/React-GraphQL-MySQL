import { useApolloClient, useLazyQuery, useMutation } from '@apollo/client';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AUTH_CONFIG } from '../constants';
import { clearCSRFToken as clearApolloCSRFToken, setCSRFToken as setApolloCSRFToken } from '../services/graphql/apollo-client';
import { LOGIN, LOGOUT, REFRESH_TOKEN } from '../services/graphql/mutations';
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
  TokenManager
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

  // Loading states
  loginLoading: boolean;
  logoutLoading: boolean;

  // Actions
  login: (input: LoginInput) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;

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

  // Apollo client for cache operations
  const client = useApolloClient();

  // Ref to track if auth has been initialized (prevents duplicate initialization)
  const isInitializedRef = useRef(false);

  // Timer ref for activity and session checking
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // GraphQL operations - only essential mutations and queries
  const [getCurrentUser] = useLazyQuery(GET_CURRENT_USER);
  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN);
  const [logoutMutation, { loading: logoutLoading }] = useMutation(LOGOUT);
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN);



  /**
   * Perform complete logout process
   * Centralized logout function for consistent behavior
   * 
   * CALLED BY: checkSessionAndActivity(), fetchCurrentUser() when authentication fails
   * SCENARIOS: All logout scenarios - ensures consistent cleanup
   */
  const performCompleteLogout = useCallback(async () => {
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
   * Called when user is active to extend session
   * 
   * CALLED BY: checkSessionAndActivity() when user is active
   * SCENARIOS: User activity detected - extends access token lifetime
   */
  const refreshAccessToken = useCallback(async () => {
    try {
      console.log('🔄 Refreshing access token due to user activity...');

      const response = await refreshTokenMutation();

      if (response.errors && response.errors.length > 0) {
        console.error('❌ Refresh token failed:', response.errors[0]?.message);
        await performCompleteLogout();
        return false;
      }

      const { refreshToken: refreshData } = response.data || {};
      if (!refreshData?.accessToken || !refreshData?.refreshToken) {
        console.error('❌ Invalid refresh response');
        await performCompleteLogout();
        return false;
      }

      // Save new tokens and update state
      saveTokens(refreshData.accessToken, refreshData.refreshToken);

      // Set new CSRF token if provided
      if (refreshData.csrfToken) {
        setApolloCSRFToken(refreshData.csrfToken);
      }

      console.log('✅ Access token refreshed successfully');
      return true;
    } catch (error: any) {
      console.error('❌ Error refreshing access token:', error);
      await performCompleteLogout();
      return false;
    }
  }, [refreshTokenMutation, performCompleteLogout]);

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
      console.log('⏰ checkSessionAndActivity called - checking session status...');

      // Check if refresh token is expired (absolute timeout)
      if (isRefreshTokenExpired()) {
        console.log('🔐 Refresh token expired (absolute timeout), performing logout...');
        await performCompleteLogout();
        return;
      }

      // Check if activity-based token is expired (when user stops being active)
      if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED && isActivityBasedTokenExpired()) {
        console.log('🔐 Activity-based token expired (user stopped being active), attempting token refresh...');
        const refreshSuccess = await refreshAccessToken();
        if (!refreshSuccess) {
          console.log('🔐 Token refresh failed, performing logout...');
          await performCompleteLogout();
        }
        return;
      }

      // Check if user has been inactive for too long (application-level inactivity)
      if (isUserInactive(AUTH_CONFIG.INACTIVITY_THRESHOLD)) {
        console.log('🔐 User inactive for too long (no application actions), attempting token refresh...');
        const refreshSuccess = await refreshAccessToken();
        if (!refreshSuccess) {
          console.log('🔐 Token refresh failed, performing logout...');
          await performCompleteLogout();
        }
        return;
      }

      // User session is still valid and active - NO TOKEN REFRESH HERE
      // Token refresh is handled by handleUserActivity when actual user activity is detected
      console.log('✅ User session active (no action needed - activity handled separately)');
    } catch (error) {
      console.error('❌ Error checking session and activity:', error);
      await performCompleteLogout();
    }
  }, [performCompleteLogout, refreshAccessToken]);

  /**
   * Handle user activity and potentially refresh tokens
   * Called when user performs meaningful actions
   * 
   * CALLED BY: Activity tracking hooks when user activity is detected
   * SCENARIOS: User navigation, form submissions, API calls, etc.
   */
  const handleUserActivity = useCallback(async () => {
    try {
      console.log('🎯 handleUserActivity called - updating activity timestamp');

      // Update activity timestamp
      updateActivity();

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

          console.log('🔍 Activity-based token expiry check - Time until expiry:', timeUntilExpiry, 'ms, Should refresh:', shouldRefresh);

          if (shouldRefresh) {
            console.log('🔄 Activity-based token more than halfway through lifetime, refreshing due to user activity...');
            await refreshAccessToken();
          } else {
            console.log('✅ User activity detected, activity-based token still has plenty of time');
          }
        } else {
          // Fallback to original token expiry check
          const expiry = TokenManager.getTokenExpiration(tokens.accessToken);
          if (expiry) {
            const timeUntilExpiry = expiry - Date.now();
            const shouldRefresh = timeUntilExpiry < AUTH_CONFIG.ACTIVITY_TOKEN_REFRESH_THRESHOLD;

            console.log('🔍 Fixed token expiry check - Time until expiry:', timeUntilExpiry, 'ms, Should refresh:', shouldRefresh);

            if (shouldRefresh) {
              console.log('🔄 Fixed token more than halfway through lifetime, refreshing due to user activity...');
              await refreshAccessToken();
            } else {
              console.log('✅ User activity detected, fixed token still has plenty of time');
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Error handling user activity:', error);
    }
  }, [refreshAccessToken]);

  /**
   * Set up activity tracking
   * Starts timer to monitor user activity and session timeouts
   * 
   * CALLED BY: useEffect when user becomes authenticated
   * SCENARIOS: All scenarios - monitors user activity and session
   */
  const setupActivityTracking = useCallback(() => {
    console.log('🔧 Setting up activity tracking...');

    // Clear existing timer
    if (activityTimerRef.current) {
      console.log('🔄 Clearing existing activity timer');
      clearInterval(activityTimerRef.current);
      activityTimerRef.current = null;
    }

    // Start activity checking timer
    activityTimerRef.current = setInterval(checkSessionAndActivity, AUTH_CONFIG.ACTIVITY_CHECK_INTERVAL);
    console.log('✅ Activity tracking started with interval:', AUTH_CONFIG.ACTIVITY_CHECK_INTERVAL, 'ms');
  }, [checkSessionAndActivity]);

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

        // Optimistic state restoration: if we have tokens, assume user is authenticated
        // This provides immediate UI feedback while background refresh happens
        if (tokens.accessToken) {
          console.log('🔍 Access token found in memory, optimistically restoring session...');
          setIsAuthenticated(true);
          // Don't set user yet - wait for fetchCurrentUser to get fresh user data
        }

        if (!tokens.accessToken) {
          console.log('🔍 No access token found, attempting token refresh...');
          // Try to refresh the access token using the refresh token from httpOnly cookie
          const refreshSuccess = await refreshAccessToken();
          if (!refreshSuccess) {
            console.log('🔍 Token refresh failed, user must login...');
            await performCompleteLogout();
            return;
          }
        } else {
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
              console.log('🔍 Token refresh failed, user must login...');
              await performCompleteLogout();
              return;
            }
          }
        }

        console.log('✅ Valid access token found, fetching user data...');
        // Fetch user data if we have valid tokens
        await fetchCurrentUser();

        // Set up activity tracking if user was successfully fetched
        // Note: fetchCurrentUser will set isAuthenticated state if successful
        // We'll set up activity tracking after the state is updated
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
  }, [fetchCurrentUser, performCompleteLogout, setupActivityTracking, refreshAccessToken]);

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
  }, [loginMutation, setupActivityTracking]);

  /**
   * Logout function
   * Clears all authentication data and resets state
   * 
   * CALLED BY: User logout action, force logout scenarios
   * SCENARIOS:
   * - User-initiated logout: Calls server logout, clears local state
   * - Force logout: Clears local state only
   * - Token expiration: Clears local state only
   */
  const logout = useCallback(async () => {
    try {
      // Call server logout mutation
      await logoutMutation();
    } catch (error) {
      // Ignore logout errors - always clear local state
    } finally {
      // Clear all authentication data
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);

      // Clear CSRF token from Apollo Client
      clearApolloCSRFToken();

      // Clear activity timer
      if (activityTimerRef.current) {
        clearInterval(activityTimerRef.current);
        activityTimerRef.current = null;
      }

      // Clear Apollo cache
      await client.clearStore();
    }
  }, [logoutMutation, client]);

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
    console.log('🔍 Activity tracking useEffect - isAuthenticated:', isAuthenticated, 'user:', !!user);
    if (isAuthenticated && user) {
      console.log('✅ User authenticated, setting up activity tracking');
      setupActivityTracking();
    } else {
      console.log('🔍 User not authenticated or no user data, skipping activity tracking setup');
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

    // Loading states
    loginLoading,
    logoutLoading,

    // Actions
    login,
    logout,

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