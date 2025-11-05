import { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { setCSRFToken as setApolloCSRFToken } from '../../../services/graphql/apollo-client';
import { LOGIN } from '../../../services/graphql/mutations';
import { LoginInput, User } from '../../../types/graphql';
import { saveTokens } from '../../../utils/tokenManager';
import { useError } from '../../ErrorContext';
import { AuthActionsDependencies } from '../types';

/**
 * Login Action Hook
 * Handles user login authentication flow
 */
export const useLoginAction = (deps: AuthActionsDependencies) => {
  const { 
    setUser, 
    setIsAuthenticated, 
    setLoginLoading, 
    setShowSessionExpiryModal, 
    setSessionExpiryMessage, 
    setLastModalShowTime 
  } = deps;
  
  const { showError } = useError();
  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN);

  /**
   * Login function - Main authentication entry point
   * Handles the complete flow: LoginForm → AuthContext → GraphQL → Server → DB
   */
  const login = useCallback(async (input: LoginInput) => {
    try {
      setLoginLoading(true);

      const response = await loginMutation({ variables: { input } });
      
      // Handle server response and client-side processing
      if (response.errors && response.errors.length > 0) {
        const errorMessage = response.errors[0]?.message || 'Login failed';
        showError(errorMessage, 'Authentication');
        return { success: false, error: errorMessage };
      }
      
      // GraphQL automatically wraps it as: { login: { accessToken, refreshToken, csrfToken, user } }
      // because GraphQL creates the login field based on the mutation name defined in the schema.
      const { login: loginData } = response.data || {};
      if (!loginData?.accessToken || !loginData?.refreshToken || !loginData?.user) {
        const errorMessage = 'Invalid login response';
        showError(errorMessage, 'Authentication');
        return { success: false, error: errorMessage };
      }

      // Save tokens and verify they're stored before updating authentication state
      // This ensures tokens are available before setIsAuthenticated(true) triggers queries
      await saveTokens(loginData.accessToken, loginData.refreshToken);
      
      // Clear auth data promise cache to force fresh token collection on next request
      // This ensures collectAuthData() will create a new promise with the new tokens instead of reusing old one
      const { clearAuthDataPromise } = await import('../../../services/graphql/apollo-client');
      clearAuthDataPromise();
      
      // Verify tokens are available before proceeding
      const { getTokens } = await import('../../../utils/tokenManager');
      const storedTokens = getTokens();
      if (!storedTokens.accessToken) {
        throw new Error('Failed to save authentication tokens');
      }
      
      // Update authentication state only after tokens are confirmed to be in storage
      setUser(loginData.user);
      setIsAuthenticated(true);

      // Reset session expiry modal state on login to ensure fresh start
      setShowSessionExpiryModal(false);
      setSessionExpiryMessage('');
      setLastModalShowTime(null);

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
  }, [loginMutation, setUser, setIsAuthenticated, setLoginLoading, showError, setShowSessionExpiryModal, setSessionExpiryMessage, setLastModalShowTime]);

  return { login, loginLoading };
};

