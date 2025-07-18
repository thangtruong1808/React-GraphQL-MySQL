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
  saveTokens
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

  // Loading states
  loginLoading: boolean;
  logoutLoading: boolean;

  // Actions
  login: (input: LoginInput) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;

  // Utilities
  hasRole: (role: string) => boolean;
  validateSession: () => boolean;
}

/**
 * AuthContext
 * Provides shared authentication state across the application
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider Component
 * Wraps the application and provides authentication context
 * Handles the complete authentication flow: Login → GraphQL → Server → DB → Response
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Core authentication state
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Apollo client for cache operations
  const client = useApolloClient();

  // Ref to track if auth has been initialized (prevents duplicate initialization)
  const isInitializedRef = useRef(false);

  // Timer ref for access token expiry checking (performance optimization)
  const expiryTimerRef = useRef<NodeJS.Timeout | null>(null);

  // GraphQL operations - only essential mutations and queries
  const [getCurrentUser] = useLazyQuery(GET_CURRENT_USER);
  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN);
  const [logoutMutation, { loading: logoutLoading }] = useMutation(LOGOUT);
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN);

  /**
   * Validate current session and tokens
   * Quick client-side check without server communication
   */
  const validateSession = useCallback((): boolean => {
    try {
      const tokens = getTokens();
      return !!(tokens.accessToken && !isTokenExpired(tokens.accessToken));
    } catch (error) {
      return false;
    }
  }, []);

  /**
   * Check access token expiry and update auth state
   * Performance optimization: runs on timer for immediate UI feedback
   */
  const checkAccessTokenExpiry = useCallback(() => {
    try {
      const tokens = getTokens();
      if (tokens.accessToken && isTokenExpired(tokens.accessToken)) {
        // Access token expired - immediately update auth state
        setUser(null);
        setIsAuthenticated(false);

        // Clear timer since we're no longer authenticated
        if (expiryTimerRef.current) {
          clearInterval(expiryTimerRef.current);
          expiryTimerRef.current = null;
        }
      }
    } catch (error) {
      // If error checking tokens, assume invalid
      setUser(null);
      setIsAuthenticated(false);

      if (expiryTimerRef.current) {
        clearInterval(expiryTimerRef.current);
        expiryTimerRef.current = null;
      }
    }
  }, []);

  /**
   * Attempt to refresh access token
   * Only called when current token is expired or invalid
   */
  const tryRefreshToken = useCallback(async () => {
    try {
      const { data } = await refreshTokenMutation();
      if (data?.refreshToken?.accessToken) {
        // Save new tokens and update state
        saveTokens(data.refreshToken.accessToken, data.refreshToken.refreshToken);
        setUser(data.refreshToken.user);
        setIsAuthenticated(true);

        // Set new CSRF token in Apollo Client
        if (data.refreshToken.csrfToken) {
          setApolloCSRFToken(data.refreshToken.csrfToken);
        }

        return true;
      }
      return false;
    } catch (error) {
      // Clear tokens on refresh failure
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  }, [refreshTokenMutation]);

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
      // Handle authentication errors with token refresh
      if (error.graphQLErrors?.[0]?.extensions?.code === 'UNAUTHENTICATED') {
        const refreshSuccess = await tryRefreshToken();
        if (refreshSuccess) {
          try {
            const { data: retryData } = await getCurrentUser();
            if (retryData?.currentUser) {
              setUser(retryData.currentUser);
              setIsAuthenticated(true);
              return;
            }
          } catch (retryError) {
            // Ignore retry errors
          }
        }
      }
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [getCurrentUser, tryRefreshToken]);

  /**
   * Initialize authentication state
   * Only runs once on app startup
   */
  const initializeAuth = useCallback(async () => {
    try {
      const tokens = getTokens();
      if (!tokens.accessToken || isTokenExpired(tokens.accessToken)) {
        // Try to refresh token if current one is invalid
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          await fetchCurrentUser();
        }
      } else {
        // Fetch user data if we have valid tokens
        await fetchCurrentUser();
      }
    } catch (error) {
      clearTokens();
    } finally {
      setIsLoading(false);
    }
  }, [fetchCurrentUser, tryRefreshToken]);

  /**
   * Login function - Main authentication entry point
   * Handles the complete flow: LoginForm → AuthContext → GraphQL → Server → DB
   * Only executes when valid credentials are provided
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

      // Start access token expiry checking timer
      if (expiryTimerRef.current) {
        clearInterval(expiryTimerRef.current);
      }
      expiryTimerRef.current = setInterval(checkAccessTokenExpiry, AUTH_CONFIG.ACCESS_TOKEN_CHECK_INTERVAL);

      return { success: true, user: loginData.user };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  }, [loginMutation, checkAccessTokenExpiry]);

  /**
   * Logout function
   * Clears all authentication data and resets state
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

      // Clear access token expiry timer
      if (expiryTimerRef.current) {
        clearInterval(expiryTimerRef.current);
        expiryTimerRef.current = null;
      }

      // Clear Apollo cache
      await client.clearStore();
    }
  }, [logoutMutation, client]);

  /**
   * Check if user has specific role
   * Simple role-based access control
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

  // Manage access token expiry checking timer
  useEffect(() => {
    if (isAuthenticated && user) {
      // Clear any existing timer
      if (expiryTimerRef.current) {
        clearInterval(expiryTimerRef.current);
      }

      // Start checking for access token expiry
      expiryTimerRef.current = setInterval(checkAccessTokenExpiry, AUTH_CONFIG.ACCESS_TOKEN_CHECK_INTERVAL);
    } else {
      // Clear timer when not authenticated
      if (expiryTimerRef.current) {
        clearInterval(expiryTimerRef.current);
        expiryTimerRef.current = null;
      }
    }

    // Cleanup timer on unmount
    return () => {
      if (expiryTimerRef.current) {
        clearInterval(expiryTimerRef.current);
        expiryTimerRef.current = null;
      }
    };
  }, [isAuthenticated, user, checkAccessTokenExpiry]);

  // Context value - only essential data for authentication
  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    loginLoading,
    logoutLoading,
    login,
    logout,
    hasRole,
    validateSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use authentication context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 