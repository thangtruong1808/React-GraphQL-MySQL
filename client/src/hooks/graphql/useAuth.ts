import { useState, useEffect, useCallback } from 'react';
import { useLazyQuery, useMutation, useApolloClient } from '@apollo/client';
import { GET_CURRENT_USER } from '../../services/graphql/queries';
import { LOGIN, LOGOUT, REFRESH_TOKEN } from '../../services/graphql/mutations';
import { User, LoginInput, RefreshTokenInput } from '../../types/graphql';
import { saveTokens, getTokens, clearTokens, isTokenExpired } from '../../utils/tokenManager';

/**
 * Authentication Hook
 * Manages user authentication state, login, logout, and token refresh
 */
export const useAuth = () => {
  // State for authentication
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Apollo client for cache operations
  const client = useApolloClient();

  // GraphQL operations
  const [getCurrentUser, { loading: currentUserLoading }] = useLazyQuery(GET_CURRENT_USER);
  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN);
  const [logoutMutation, { loading: logoutLoading }] = useMutation(LOGOUT);
  const [refreshTokenMutation, { loading: refreshLoading }] = useMutation(REFRESH_TOKEN);

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
  }, []);

  /**
   * Fetch current user data from GraphQL
   */
  const fetchCurrentUser = useCallback(async () => {
    try {
      const { data } = await getCurrentUser();
      if (data?.currentUser) {
        setUser(data.currentUser);
        setIsAuthenticated(true);
        
        // Update Apollo cache with current user data
        client.writeQuery({
          query: GET_CURRENT_USER,
          data: {
            currentUser: data.currentUser,
          },
        });
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Fetch current user error:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [getCurrentUser, client]);

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
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.graphQLErrors?.[0]?.message || 'Login failed',
      };
    }
  }, [loginMutation, client]);

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

  return {
    // State
    user,
    isAuthenticated,
    isLoading: isLoading || currentUserLoading,
    
    // Loading states
    loginLoading,
    logoutLoading,
    refreshLoading,
    currentUserLoading,
    
    // Actions
    login,
    logout,
    refreshTokens,
    fetchCurrentUser,
    
    // Utilities
    hasRole,
    isAdmin,
  };
}; 