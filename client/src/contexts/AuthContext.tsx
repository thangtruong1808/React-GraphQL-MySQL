import { useApolloClient, useLazyQuery, useMutation } from '@apollo/client';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState, useRef } from 'react';
import { AUTH_CONFIG, ERROR_MESSAGES } from '../constants';
import { LOGIN, LOGOUT, REGISTER, REFRESH_TOKEN } from '../services/graphql/mutations';
import { GET_CURRENT_USER } from '../services/graphql/queries';
import { LoginInput, RegisterInput, User } from '../types/graphql';
import {
  clearTokens,
  getTokens,
  isTokenExpired,
  resetRefreshAttempts,
  saveTokens
} from '../utils/tokenManager';

/**
 * Enhanced Authentication Context Interface
 * Defines the shape of the authentication context with security features
 */
interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Loading states
  loginLoading: boolean;
  registerLoading: boolean;
  logoutLoading: boolean;
  currentUserLoading: boolean;

  // Actions
  login: (input: LoginInput) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (input: RegisterInput) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;

  // Security utilities
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  validateSession: () => boolean;
}

/**
 * Enhanced AuthContext
 * Provides shared authentication state across the application with security features
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Enhanced AuthProvider Component
 * Wraps the application and provides authentication context with security measures
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State for authentication
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Apollo client for cache operations
  const client = useApolloClient();

  // Ref to track if auth has been initialized (prevent duplicate calls)
  const isInitializedRef = useRef(false);

  // Ref to track if refresh is in progress (prevent duplicate refresh calls)
  const isRefreshingRef = useRef(false);

  // Ref to track the access token expiry check timer
  const accessTokenCheckTimerRef = useRef<NodeJS.Timeout | null>(null);

  // GraphQL operations
  const [getCurrentUser, { loading: currentUserLoading }] = useLazyQuery(GET_CURRENT_USER);
  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN);
  const [registerMutation, { loading: registerLoading }] = useMutation(REGISTER);
  const [logoutMutation, { loading: logoutLoading }] = useMutation(LOGOUT);
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN);

  /**
   * Check access token expiry and update authentication state immediately
   * This provides immediate UI feedback when access token expires
   * Security enhancement: No automatic refresh - user must manually log in again
   */
  const checkAccessTokenExpiry = useCallback(() => {
    try {
      const tokens = getTokens();

      // If no access token, user is not authenticated
      if (!tokens.accessToken) {
        if (isAuthenticated) {
          console.log('🔐 Access token missing - updating authentication state');
          setIsAuthenticated(false);
          setUser(null);
        }
        return;
      }

      // Check if access token is expired
      if (isTokenExpired(tokens.accessToken)) {
        console.log('🔐 Access token expired - immediately hiding authenticated UI (security enhancement)');
        setIsAuthenticated(false);
        setUser(null);

        // Security enhancement: Do NOT attempt automatic refresh
        // User must manually log in again for enhanced security
        console.log('🔐 Security: No automatic refresh - user must manually authenticate');
        return;
      }

      // Token is valid, ensure user is authenticated
      if (!isAuthenticated && tokens.accessToken) {
        console.log('🔐 Access token valid - restoring authentication state');
        setIsAuthenticated(true);
        // User data will be fetched by the refresh mechanism
      }
    } catch (error) {
      console.error('❌ Error checking access token expiry:', error);
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [isAuthenticated]);

  /**
   * Start the access token expiry check timer
   * This provides immediate UI feedback when access token expires
   */
  const startAccessTokenCheckTimer = useCallback(() => {
    // Clear existing timer
    if (accessTokenCheckTimerRef.current) {
      clearInterval(accessTokenCheckTimerRef.current);
    }

    // Start new timer to check access token expiry
    accessTokenCheckTimerRef.current = setInterval(() => {
      checkAccessTokenExpiry();
    }, AUTH_CONFIG.ACCESS_TOKEN_CHECK_INTERVAL);

    console.log('🔐 Started access token expiry check timer');
  }, [checkAccessTokenExpiry]);

  /**
   * Stop the access token expiry check timer
   */
  const stopAccessTokenCheckTimer = useCallback(() => {
    if (accessTokenCheckTimerRef.current) {
      clearInterval(accessTokenCheckTimerRef.current);
      accessTokenCheckTimerRef.current = null;
      console.log('🔐 Stopped access token expiry check timer');
    }
  }, []);

  /**
   * Validate current session and tokens
   * @returns truef session is valid
   */
  const validateSession = useCallback((): boolean => {
    try {
      const tokens = getTokens();

      // Check if access token exists
      if (!tokens.accessToken) {
        console.log('❌ No access token found');
        return false;
      }

      // Check if access token is expired
      if (isTokenExpired(tokens.accessToken)) {
        console.log('❌ Access token expired');
        return false;
      }

      return true;
    } catch (error: any) {
      console.error('❌ Error validating session:', error);
      return false;
    }
  }, []);

  /**
   * Attempt to refresh access token using refresh token cookie
   * Called automatically if access token is missing/expired
   */
  const tryRefreshToken = useCallback(async () => {
    // Prevent duplicate refresh calls
    if (isRefreshingRef.current) {
      console.log('🔄 Refresh already in progress, skipping...');
      return false;
    }

    try {
      isRefreshingRef.current = true;
      console.log('🔄 Attempting to refresh access token...');

      // Call refreshToken mutation (no variables needed)
      const { data } = await refreshTokenMutation();
      console.log('🔄 Refresh token response:', {
        hasData: !!data,
        hasRefreshToken: !!data?.refreshToken,
        hasAccessToken: !!data?.refreshToken?.accessToken,
        hasUser: !!data?.refreshToken?.user,
      });

      if (data?.refreshToken?.accessToken) {
        console.log('✅ Refresh successful, saving new tokens...');
        // Save new tokens
        saveTokens(data.refreshToken.accessToken, data.refreshToken.refreshToken);
        setUser(data.refreshToken.user);
        setIsAuthenticated(true);
        console.log('✅ Token refresh completed successfully');
        return true;
      }

      console.log('❌ No access token in refresh response');
      return false;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      // Refresh failed, clear tokens and redirect
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  }, [refreshTokenMutation]);

  /**
   * Fetch current user data from GraphQL with error handling
   */
  const fetchCurrentUser = useCallback(async () => {
    try {
      console.log('🔍 Fetching current user...');

      const { data } = await getCurrentUser();
      if (data?.currentUser) {
        setUser(data.currentUser);
        setIsAuthenticated(true);
        console.log('✅ Current user fetched successfully');
      } else {
        console.log('❌ No current user data received');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error: any) {
      console.error('❌ Fetch current user error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        extensions: error.graphQLErrors?.[0]?.extensions,
      });

      // Handle authentication errors - try to refresh token first
      if (error.graphQLErrors?.[0]?.extensions?.code === 'UNAUTHENTICATED') {
        console.log('🔐 UNAUTHENTICATED error detected - attempting token refresh...');

        // Try to refresh the token instead of immediately clearing
        const refreshSuccess = await tryRefreshToken();
        if (refreshSuccess) {
          console.log('✅ Token refresh successful - retrying current user fetch');
          // Retry fetching current user with new token
          try {
            const { data: retryData } = await getCurrentUser();
            if (retryData?.currentUser) {
              setUser(retryData.currentUser);
              setIsAuthenticated(true);
              console.log('✅ Current user fetched successfully after token refresh');
              return;
            }
          } catch (retryError) {
            console.error('❌ Retry fetch current user failed:', retryError);
          }
        }

        // If refresh failed or retry failed, clear tokens and redirect
        console.log('🔐 Token refresh failed - clearing tokens and redirecting to login');
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);

        // Show specific message for force logout
        const errorMessage = error.graphQLErrors[0].message;
        if (errorMessage.includes('logged out by an administrator')) {
          alert('You have been logged out by an administrator. Please log in again.');
        }

        // Force redirect to login page
        window.location.href = '/login';
        return;
      }

      // Handle other errors
      setUser(null);
      setIsAuthenticated(false);

      // Handle too many sessions error
      if (error.graphQLErrors?.[0]?.extensions?.code === 'TOO_MANY_SESSIONS') {
        console.log('🔐 Too many sessions error detected');
        // Don't clear tokens, just show error message
        alert(error.graphQLErrors[0].message || 'Maximum active sessions reached. Please log out from another device to continue.');
      }
    }
  }, [getCurrentUser, tryRefreshToken]);

  /**
   * Initialize authentication state on app load with security checks
   * Checks for existing tokens and validates them, attempts refresh if needed
   */
  const initializeAuth = useCallback(async () => {
    try {
      console.log('🚀 Initializing authentication...');
      const tokens = getTokens();
      if (!tokens.accessToken || isTokenExpired(tokens.accessToken)) {
        // No access token or expired: try to refresh
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          await fetchCurrentUser();
        } else {
          setIsLoading(false);
          return;
        }
      } else {
        // Access token is valid, get current user
        await fetchCurrentUser();
      }
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      clearTokens();
    } finally {
      setIsLoading(false);
    }
  }, [fetchCurrentUser, tryRefreshToken]);

  /**
   * Login function with enhanced security
   */
  const login = useCallback(async (input: LoginInput) => {
    try {
      console.log('🔐 LOGIN - Starting login process...');
      console.log('🔐 LOGIN - Email:', input.email);
      console.log('🔐 LOGIN - Password length:', input.password.length);

      setIsLoading(true);
      // setError(null); // This state variable is not defined in the original file

      console.log('🔐 LOGIN - Calling login mutation...');
      const response = await loginMutation({
        variables: { input },
      });

      console.log('🔐 LOGIN - Mutation response received');
      console.log('🔐 LOGIN - Response data:', response.data);
      console.log('🔐 LOGIN - Response errors:', response.errors);

      if (response.errors && response.errors.length > 0) {
        console.error('❌ LOGIN - GraphQL errors:', response.errors);
        const errorMessage = response.errors[0]?.message || 'Login failed';
        // setError(errorMessage); // This state variable is not defined in the original file
        return { success: false, error: errorMessage };
      }

      const { login: loginData } = response.data || {};

      console.log('🔐 LOGIN - Login data extracted:', {
        hasAccessToken: !!loginData?.accessToken,
        hasRefreshToken: !!loginData?.refreshToken,
        hasUser: !!loginData?.user,
        accessTokenLength: loginData?.accessToken?.length,
        refreshTokenLength: loginData?.refreshToken?.length,
      });

      if (!loginData?.accessToken || !loginData?.refreshToken || !loginData?.user) {
        console.error('❌ LOGIN - Missing required data:', {
          accessToken: !!loginData?.accessToken,
          refreshToken: !!loginData?.refreshToken,
          user: !!loginData?.user,
        });
        const errorMessage = 'Invalid login response';
        // setError(errorMessage); // This state variable is not defined in the original file
        return { success: false, error: errorMessage };
      }

      console.log('🔐 LOGIN - Storing tokens...');
      saveTokens(loginData.accessToken, loginData.refreshToken);

      console.log('🔐 LOGIN - Setting user state...');
      setUser(loginData.user);
      setIsAuthenticated(true);

      console.log('🔐 LOGIN - Login successful!');
      return { success: true, user: loginData.user };
    } catch (error: any) {
      console.error('❌ LOGIN - Login error:', error);
      console.error('❌ LOGIN - Error message:', error.message);
      console.error('❌ LOGIN - Error stack:', error.stack);

      const errorMessage = error.message || 'Login failed';
      // setError(errorMessage); // This state variable is not defined in the original file
      return { success: false, error: errorMessage };
    } finally {
      console.log('🔐 LOGIN - Setting loading to false');
      setIsLoading(false);
    }
  }, [loginMutation]);

  /**
   * Register function with enhanced security
   */
  const register = useCallback(async (input: RegisterInput) => {
    try {
      console.log('📝 Attempting registration...');

      const { data, errors } = await registerMutation({
        variables: { input },
      });

      if (data?.register) {
        const { accessToken, refreshToken, user: userData } = data.register;

        // Store tokens securely
        saveTokens(accessToken, refreshToken);

        // Update state
        setUser(userData);
        setIsAuthenticated(true);

        // Clear Apollo cache to ensure fresh data
        await client.clearStore();

        console.log('✅ Registration successful');
        return { success: true, user: userData };
      } else {
        console.log('❌ No registration data received');
        return { success: false, error: ERROR_MESSAGES.REGISTRATION_FAILED };
      }
    } catch (error: any) {
      console.error('❌ Registration error:', error);

      // Handle specific GraphQL errors
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const graphQLError = error.graphQLErrors[0];
        return { success: false, error: graphQLError.message };
      }

      // Handle network errors
      if (error.networkError) {
        return { success: false, error: ERROR_MESSAGES.NETWORK_ERROR };
      }

      return { success: false, error: ERROR_MESSAGES.REGISTRATION_FAILED };
    }
  }, [registerMutation, client]);

  /**
   * Logout function with cleanup
   */
  const logout = useCallback(async () => {
    try {
      console.log('🚪 Attempting logout...');

      // Stop access token expiry check timer
      stopAccessTokenCheckTimer();

      // Call logout mutation to invalidate tokens server-side
      await logoutMutation();

      // Clear client-side tokens and state
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);

      // Clear Apollo cache
      await client.clearStore();

      // Reset refresh attempts
      resetRefreshAttempts();

      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);

      // Even if server logout fails, clear client-side data
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      await client.clearStore();
      resetRefreshAttempts();
    }
  }, [logoutMutation, client, stopAccessTokenCheckTimer]);

  /**
   * Check if user has specific role
   * @param role - Role to check
   * @returns True if user has the role
   */
  const hasRole = useCallback((role: string): boolean => {
    return user?.role === role;
  }, [user]);

  /**
   * Check if user is admin
   * @returns True if user is admin
   */
  const isAdmin = useCallback((): boolean => {
    return user?.role === 'ADMIN';
  }, [user]);

  /**
 * Check if user has been force logged out by admin
 * Validates session and redirects to login if tokens are invalid
 */
  const checkForceLogout = useCallback(async () => {
    if (!isAuthenticated || !user) {
      return;
    }

    try {
      console.log('🔍 Checking for force logout...');

      // Try to fetch current user - if this fails, user was force logged out
      const { data } = await getCurrentUser();

      if (!data?.currentUser) {
        console.log('🔐 User force logged out detected - redirecting to login');
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);
        await client.clearStore();
        window.location.href = '/login';
      }
    } catch (error: any) {
      console.log('🔐 Force logout check failed - user may have been logged out:', error.message);

      // If we get an authentication error, user was force logged out
      if (error.graphQLErrors?.[0]?.extensions?.code === 'UNAUTHENTICATED') {
        console.log('🔐 UNAUTHENTICATED error - user force logged out');

        // Show specific message for force logout
        const errorMessage = error.graphQLErrors[0].message;
        if (errorMessage.includes('logged out by an administrator') ||
          errorMessage.includes('force') ||
          errorMessage.includes('revoked')) {
          alert('You have been logged out by an administrator. Please log in again.');
        }

        clearTokens();
        setUser(null);
        setIsAuthenticated(false);
        await client.clearStore();
        window.location.href = '/login';
      }
    }
  }, [isAuthenticated, user, getCurrentUser, client]);

  // Initialize authentication on mount (only once)
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      initializeAuth();
    }
  }, []); // Empty dependency array to run only once

  // Start access token expiry check timer when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      startAccessTokenCheckTimer();
    } else {
      stopAccessTokenCheckTimer();
    }
  }, [isAuthenticated, startAccessTokenCheckTimer, stopAccessTokenCheckTimer]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      stopAccessTokenCheckTimer();
    };
  }, [stopAccessTokenCheckTimer]);

  // Set up periodic force logout check when user is authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    // Check every 10 seconds if user has been force logged out
    const interval = setInterval(checkForceLogout, 10000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user, checkForceLogout]);

  // Check for force logout when user returns to the tab
  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    /**
     * Handle visibility change - check for force logout when user returns to tab
     */
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Tab became visible - checking for force logout');
        checkForceLogout();
      }
    };

    /**
     * Handle focus event - check for force logout when window gains focus
     */
    const handleFocus = () => {
      console.log('🎯 Window focused - checking for force logout');
      checkForceLogout();
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated, user, checkForceLogout]);

  // Handle page visibility changes for security
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Page became visible, check access token immediately
        checkAccessTokenExpiry();
      }
    };

    const handleFocus = () => {
      // Window gained focus, check access token immediately
      checkAccessTokenExpiry();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkAccessTokenExpiry]);

  // Context value
  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    loginLoading,
    registerLoading,
    logoutLoading,
    currentUserLoading,
    login,
    register,
    logout,
    fetchCurrentUser,
    hasRole,
    isAdmin,
    validateSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use authentication context
 * @returns Authentication context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 