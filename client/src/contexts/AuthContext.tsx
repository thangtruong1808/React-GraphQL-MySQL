import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useLazyQuery, useMutation, useApolloClient } from '@apollo/client';
import { GET_CURRENT_USER } from '../services/graphql/queries';
import { LOGIN, LOGOUT, REFRESH_TOKEN, REGISTER } from '../services/graphql/mutations';
import { User, LoginInput, RegisterInput } from '../types/graphql';
import { saveTokens, getTokens, clearTokens, isTokenExpired } from '../utils/tokenManager';

/**
 * Authentication Context Interface
 * Defines the shape of the authentication context
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
  refreshLoading: boolean;
  currentUserLoading: boolean;

  // Actions
  login: (input: LoginInput) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (input: RegisterInput) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  refreshTokens: (refreshToken: string) => Promise<boolean>;
  fetchCurrentUser: () => Promise<void>;

  // Utilities
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
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
  const [refreshTokenMutation, { loading: refreshLoading }] = useMutation(REFRESH_TOKEN);

  /**
   * Fetch current user data from GraphQL
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
    } catch (error) {
      console.error('Fetch current user error:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [getCurrentUser]);

  /**
   * Initialize authentication state on app load
   * Checks for existing tokens and validates them
   */
  const initializeAuth = useCallback(async () => {
    try {
      const tokens = getTokens();

      if (!tokens.accessToken || !tokens.refreshToken) {
        setIsLoading(false);
        return;
      }

      // Check if access token is expired
      if (isTokenExpired(tokens.accessToken)) {
        // Try to refresh the token
        await refreshTokens(tokens.refreshToken);
      } else {
        // Access token is valid, get current user
        await fetchCurrentUser();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      clearTokens();
    } finally {
      setIsLoading(false);
    }
  }, [fetchCurrentUser]);

  /**
   * Refresh access token using refresh token
   */
  const refreshTokens = useCallback(async (refreshToken: string) => {
    try {
      const { data } = await refreshTokenMutation({
        variables: { input: { refreshToken } },
      });

      if (data?.refreshToken) {
        const { accessToken, refreshToken: newRefreshToken } = data.refreshToken;
        saveTokens(accessToken, newRefreshToken);
        await fetchCurrentUser();
        return true;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
    return false;
  }, [refreshTokenMutation, fetchCurrentUser]);

  /**
 * Login user with email and password
 */
  const login = useCallback(async (input: LoginInput) => {
    try {
      const { data } = await loginMutation({
        variables: { input },
      });

      if (data?.login) {
        const { accessToken, refreshToken, user: userData } = data.login;
        saveTokens(accessToken, refreshToken);
        setUser(userData);
        setIsAuthenticated(true);

        return { success: true, user: userData };
      }

      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.graphQLErrors?.[0]?.message || 'Login failed',
      };
    }
  }, [loginMutation]);

  /**
   * Register new user with email, password, and name
   */
  const register = useCallback(async (input: RegisterInput) => {
    try {
      const { data } = await registerMutation({
        variables: { input },
      });

      if (data?.register) {
        const { accessToken, refreshToken, user: userData } = data.register;
        saveTokens(accessToken, refreshToken);
        setUser(userData);
        setIsAuthenticated(true);

        return { success: true, user: userData };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.graphQLErrors?.[0]?.message || 'Registration failed',
      };
    }
  }, [registerMutation]);

  /**
   * Logout user and clear tokens
   */
  const logout = useCallback(async () => {
    try {
      // Call logout mutation to revoke tokens on server
      await logoutMutation();
    } catch (error) {
      console.error('Logout mutation error:', error);
    } finally {
      // Clear tokens and user state regardless of server response
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);

      // Clear Apollo cache
      client.clearStore();
    }
  }, [logoutMutation, client]);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback((role: string) => {
    return user?.role === role;
  }, [user]);

  /**
   * Check if user is admin
   */
  const isAdmin = useCallback(() => {
    return hasRole('ADMIN');
  }, [hasRole]);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const value: AuthContextType = {
    // State
    user,
    isAuthenticated,
    isLoading: isLoading || currentUserLoading,

    // Loading states
    loginLoading,
    registerLoading,
    logoutLoading,
    refreshLoading,
    currentUserLoading,

    // Actions
    login,
    register,
    logout,
    refreshTokens,
    fetchCurrentUser,

    // Utilities
    hasRole,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook
 * Custom hook to access authentication context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 