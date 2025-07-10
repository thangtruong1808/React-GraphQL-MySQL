import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useLazyQuery, useMutation, useApolloClient } from '@apollo/client';
import { GET_CURRENT_USER } from '../services/graphql/queries';
import { LOGIN, LOGOUT, REGISTER } from '../services/graphql/mutations';
import { User, LoginInput, RegisterInput } from '../types/graphql';
import {
  saveTokens,
  getTokens,
  clearTokens,
  isTokenExpired,
  canAttemptRefresh,
  incrementRefreshAttempts,
  resetRefreshAttempts
} from '../utils/tokenManager';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, ROUTES } from '../constants';

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

  // GraphQL operations
  const [getCurrentUser, { loading: currentUserLoading }] = useLazyQuery(GET_CURRENT_USER);
  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN);
  const [registerMutation, { loading: registerLoading }] = useMutation(REGISTER);
  const [logoutMutation, { loading: logoutLoading }] = useMutation(LOGOUT);

  /**
   * Validate current session and tokens
   * @returns True if session is valid
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
      setUser(null);
      setIsAuthenticated(false);

      // Clear tokens if there's an authentication error
      if (error.graphQLErrors?.[0]?.extensions?.code === 'UNAUTHENTICATED') {
        clearTokens();
      }
    }
  }, [getCurrentUser]);

  /**
   * Initialize authentication state on app load with security checks
   * Checks for existing tokens and validates them
   */
  const initializeAuth = useCallback(async () => {
    try {
      console.log('🚀 Initializing authentication...');

      const tokens = getTokens();

      if (!tokens.accessToken) {
        console.log('❌ No access token found during initialization');
        setIsLoading(false);
        return;
      }

      // Validate session before proceeding
      if (!validateSession()) {
        console.log('❌ Invalid session during initialization');
        clearTokens();
        setIsLoading(false);
        return;
      }

      // Check if access token is expired
      if (isTokenExpired(tokens.accessToken)) {
        console.log('❌ Access token expired during initialization');
        clearTokens();
        setIsLoading(false);
        return;
      }

      console.log('✅ Access token valid, fetching current user...');
      // Access token is valid, get current user
      await fetchCurrentUser();
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      clearTokens();
    } finally {
      setIsLoading(false);
    }
  }, [fetchCurrentUser, validateSession]);

  /**
   * Enhanced login user with email and password and security measures
   */
  const login = useCallback(async (input: LoginInput) => {
    try {
      console.log('🔐 Attempting login...');

      // Reset refresh attempts on new login
      resetRefreshAttempts();

      const { data, errors } = await loginMutation({
        variables: { input },
      });

      // Debug: Log the full response
      console.log('🔍 Login response:', { data, errors });

      if (data?.login) {
        const { accessToken, refreshToken, user: userData } = data.login;

        // Debug: Log the extracted data with token format info
        console.log('🔍 Extracted login data:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasUser: !!userData,
          accessTokenLength: accessToken?.length,
          refreshTokenLength: refreshToken?.length,
          accessTokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : 'null',
          refreshTokenPreview: refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null',
          userData
        });

        // Validate tokens before storing
        if (!accessToken) {
          console.error('❌ No access token received from server');
          return { success: false, error: ERROR_MESSAGES.LOGIN_FAILED };
        }

        if (!refreshToken) {
          console.error('❌ No refresh token received from server');
          return { success: false, error: ERROR_MESSAGES.LOGIN_FAILED };
        }

        // Store tokens securely
        saveTokens(accessToken, refreshToken);

        // Update state
        setUser(userData);
        setIsAuthenticated(true);

        // Clear Apollo cache to ensure fresh data
        await client.clearStore();

        console.log('✅ Login successful');
        return { success: true, user: userData };
      } else {
        console.log('❌ No login data received');
        return { success: false, error: ERROR_MESSAGES.LOGIN_FAILED };
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);

      // Handle specific GraphQL errors
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const graphQLError = error.graphQLErrors[0];
        return { success: false, error: graphQLError.message };
      }

      // Handle network errors
      if (error.networkError) {
        return { success: false, error: ERROR_MESSAGES.NETWORK_ERROR };
      }

      return { success: false, error: ERROR_MESSAGES.LOGIN_FAILED };
    }
  }, [loginMutation, client]);

  /**
   * Enhanced register user with security measures
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
   * Enhanced logout with security cleanup
   */
  const logout = useCallback(async () => {
    try {
      console.log('🚪 Attempting logout...');

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
  }, [logoutMutation, client]);

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
    return hasRole('ADMIN');
  }, [hasRole]);

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

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