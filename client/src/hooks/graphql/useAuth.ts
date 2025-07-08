import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOGIN, REGISTER, LOGOUT, REFRESH_TOKEN } from '../../services/graphql/mutations';
import { GET_CURRENT_USER } from '../../services/graphql/queries';
import { LoginInput, RegisterInput, AuthResponse, User, RefreshTokenInput } from '../../types/graphql';
import TokenManager from '../../utils/tokenManager';

/**
 * Authentication Hook
 * Manages user authentication state and operations using JWT with refresh tokens
 */
export const useAuth = () => {
  const navigate = useNavigate();

  // Login mutation - handles user authentication with JWT refresh tokens
  const [login, { loading: loginLoading, error: loginError }] = useMutation(LOGIN, {
    onCompleted: (data: { login: AuthResponse }) => {
      // Store both access and refresh tokens using TokenManager
      TokenManager.storeTokens(
        data.login.accessToken,
        data.login.refreshToken,
        data.login.user
      );
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  // Register mutation - handles user registration with JWT refresh tokens
  const [register, { loading: registerLoading, error: registerError }] = useMutation(REGISTER, {
    onCompleted: (data: { register: AuthResponse }) => {
      // Store both access and refresh tokens using TokenManager
      TokenManager.storeTokens(
        data.register.accessToken,
        data.register.refreshToken,
        data.register.user
      );
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Register error:', error);
    },
  });

  // Refresh token mutation - handles token refresh
  const [refreshToken] = useMutation(REFRESH_TOKEN, {
    onCompleted: (data: { refreshToken: { accessToken: string; refreshToken: string } }) => {
      // Update tokens with new ones (token rotation)
      TokenManager.updateTokens(data.refreshToken.accessToken, data.refreshToken.refreshToken);
    },
    onError: (error) => {
      console.error('Token refresh error:', error);
      // Clear tokens on refresh failure
      TokenManager.clearTokens();
      navigate('/login');
    },
  });

  // Logout mutation - clears authentication data
  const [logout] = useMutation(LOGOUT, {
    onCompleted: () => {
      // Clear all tokens and user data using TokenManager
      TokenManager.clearTokens();
      navigate('/login');
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Clear tokens even if server logout fails
      TokenManager.clearTokens();
      navigate('/login');
    },
  });

  // Get current user query - skips if no access token is present
  const { data: currentUserData, loading: currentUserLoading, error: currentUserError } = useQuery(GET_CURRENT_USER, {
    skip: !TokenManager.isAuthenticated(),
  });

  /**
   * Handle login form submission
   * @param input - Login credentials (email and password)
   */
  const handleLogin = async (input: LoginInput) => {
    try {
      await login({ variables: { input } });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  /**
   * Handle register form submission
   * @param input - Registration data (email, username, password, etc.)
   */
  const handleRegister = async (input: RegisterInput) => {
    try {
      await register({ variables: { input } });
    } catch (error) {
      console.error('Register failed:', error);
    }
  };

  /**
   * Handle manual token refresh
   * @param refreshTokenValue - Refresh token to use
   */
  const handleRefreshToken = async (refreshTokenValue: string) => {
    try {
      const input: RefreshTokenInput = { refreshToken: refreshTokenValue };
      await refreshToken({ variables: { input } });
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear tokens on refresh failure
      TokenManager.clearTokens();
      navigate('/login');
    }
  };

  /**
   * Handle logout action
   * Clears authentication data and redirects to login
   */
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  /**
   * Check if access token needs refresh
   * @returns True if token should be refreshed
   */
  const shouldRefreshToken = (): boolean => {
    return TokenManager.shouldRefreshToken();
  };

  /**
   * Get current authentication status
   * @returns True if user is authenticated
   */
  const isAuthenticated = (): boolean => {
    return TokenManager.isAuthenticated();
  };

  // Check authentication status based on TokenManager
  const authStatus = isAuthenticated();
  
  // Get current user from query result or TokenManager fallback
  const currentUser = currentUserData?.currentUser || TokenManager.getUser();

  return {
    // Authentication state
    isAuthenticated: authStatus,
    currentUser,
    currentUserLoading,
    currentUserError,
    
    // Authentication actions
    handleLogin,
    handleRegister,
    handleRefreshToken,
    handleLogout,
    
    // Token management
    shouldRefreshToken,
    
    // Loading states
    loginLoading,
    registerLoading,
    
    // Error states
    loginError,
    registerError,
  };
}; 