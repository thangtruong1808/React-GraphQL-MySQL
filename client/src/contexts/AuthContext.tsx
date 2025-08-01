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
 * 2. EXPIRED ACCESS TOKEN + VALID REFRESH TOKEN:
 *    - validateSession() → returns false (expired access token)
 *    - tryRefreshToken() → calls refreshTokenMutation → apollo-client.ts → server auth.ts
 *    - Server validates refresh token from httpOnly cookie → DB
 *    - saveTokens() → stores new tokens in tokenManager.ts
 *    - setUser() + setIsAuthenticated(true) → updates state
 * 
 * 3. EXPIRED ACCESS TOKEN + EXPIRED REFRESH TOKEN:
 *    - validateSession() → returns false (expired access token)
 *    - tryRefreshToken() → calls refreshTokenMutation → apollo-client.ts → server auth.ts
 *    - Server rejects expired refresh token → returns error
 *    - clearTokens() → clears all tokens from tokenManager.ts
 *    - setUser(null) + setIsAuthenticated(false) → updates state
 *    - User redirected to login
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
   * 
   * CALLED BY: initializeAuth(), checkAccessTokenExpiry()
   * SCENARIOS: All scenarios - checks if user has valid tokens
   * RETURNS: true if valid access token exists, false otherwise
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
   * 
   * CALLED BY: Timer interval after successful login
   * SCENARIOS: 
   * - Valid tokens: No action
   * - Expired access token: Updates state to unauthenticated
   * - Invalid tokens: Updates state to unauthenticated
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
   * 
   * CALLED BY: initializeAuth(), fetchCurrentUser()
   * SCENARIOS:
   * - Valid refresh token: Generates new access token, returns true
   * - Expired refresh token: Clears tokens, returns false
   * - No refresh token: Clears tokens, returns false
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
   * 
   * CALLED BY: initializeAuth()
   * SCENARIOS:
   * - Valid access token: Fetches user data, updates state
   * - Expired access token: Triggers token refresh, retries fetch
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
   * 
   * CALLED BY: useEffect on component mount
   * SCENARIOS:
   * - No tokens: Tries refresh, fails, sets unauthenticated
   * - Expired access token + valid refresh token: Refreshes successfully
   * - Valid tokens: Fetches user data
   * - Invalid tokens: Clears tokens, sets unauthenticated
   */
  const initializeAuth = useCallback(async () => {
    try {
      const tokens = getTokens();
      if (!tokens.accessToken || isTokenExpired(tokens.accessToken)) {
        // Try to refresh token if current one is invalid
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          // Only fetch user data if refresh succeeded
          await fetchCurrentUser();
        }
        // If refresh failed, user remains unauthenticated (no need to fetch user data)
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

  // Context value with all authentication state and functions
  const contextValue: AuthContextType = {
    // State
    user,
    isAuthenticated,
    isLoading,

    // Loading states
    loginLoading,
    logoutLoading,

    // Actions
    login,
    logout,

    // Utilities
    hasRole,
    validateSession,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 