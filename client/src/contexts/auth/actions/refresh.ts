import { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { setCSRFToken as setApolloCSRFToken } from '../../../services/graphql/apollo-client';
import { REFRESH_TOKEN } from '../../../services/graphql/mutations';
import { saveTokens, TokenManager } from '../../../utils/tokenManager';
import { AuthActionsDependencies } from '../types';

/**
 * Refresh Actions Hook
 * Handles user session refresh and token refresh operations
 */
export const useRefreshActions = (deps: AuthActionsDependencies) => {
  const {
    setUser,
    setIsAuthenticated,
    showNotification,
    setShowSessionExpiryModal,
    setSessionExpiryMessage,
    setLastModalShowTime,
    setModalAutoLogoutTimer,
    modalAutoLogoutTimer,
  } = deps;
  
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN);

  /**
   * Unified function to refresh user session
   * Handles both browser refresh and manual session refresh
   * @param isSessionRestoration - Whether this is for session restoration (browser refresh) or manual refresh
   */
  const refreshUserSession = useCallback(async (isSessionRestoration: boolean = false): Promise<boolean> => {
    try {
      // Call refresh token mutation - server handles validation via httpOnly cookie
      const result = await refreshTokenMutation({
        variables: {
          dynamicBuffer: undefined // Server calculates buffer internally
        }
      });
      
      if (result.errors && result.errors.length > 0) {
        // GraphQL errors - user is not authenticated
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
      
      const { refreshToken: refreshData } = result.data || {};
      
      // Validate response data
      if (!refreshData || !refreshData.accessToken || !refreshData.refreshToken || !refreshData.user) {
        // No valid tokens or user data returned - user is not authenticated
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
      
      // Store new tokens and update authentication state
      const { accessToken, refreshToken, csrfToken, user: refreshedUser } = refreshData;
      
      // Store tokens and verify they're stored before updating authentication state
      // This ensures tokens are available before setIsAuthenticated(true) triggers queries
      await saveTokens(accessToken, refreshToken);
      
      // Clear auth data promise cache to force fresh token collection on next request
      // This ensures collectAuthData() will create a new promise with the refreshed tokens
      const { clearAuthDataPromise } = await import('../../../services/graphql/apollo-client');
      clearAuthDataPromise();
      
      // Verify tokens are available before proceeding
      const { getTokens } = await import('../../../utils/tokenManager');
      const storedTokens = getTokens();
      if (!storedTokens.accessToken) {
        throw new Error('Failed to save authentication tokens');
      }
      
      // Update authentication state only after tokens are confirmed to be in storage
      setUser(refreshedUser);
      setIsAuthenticated(true);
      
      // Update CSRF token in Apollo Client for future mutations
      if (csrfToken) {
        setApolloCSRFToken(csrfToken);
      }
      
      // Reset activity timer to ensure proper synchronization (like first-time login)
      await TokenManager.updateActivity();
      
      // Reset Auth state to first-time login state
      setShowSessionExpiryModal(false);
      setLastModalShowTime(null);
      setSessionExpiryMessage('');
      
      // Handle session restoration vs manual refresh differently
      if (isSessionRestoration) {
        // For browser refresh: DO NOT set refresh token timer
        // This allows the access token timer to work normally and reset on user activity
        // The refresh token timer should only start when access token expires due to inactivity
      } else {
        // For manual refresh (Continue to Work): Clear refresh token timer (like first-time login)
        await TokenManager.clearRefreshTokenExpiry();
      }

      return true;
    } catch (error: any) {
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const graphQLError = error.graphQLErrors[0];
        
        if (graphQLError.message === 'Refresh token is required') {
          return false;
        }
      } else if (error.message && error.message.includes('Refresh token is required')) {
        return false;
      }
      return false;
    }
  }, [refreshTokenMutation, setUser, setIsAuthenticated, setShowSessionExpiryModal, setLastModalShowTime, setSessionExpiryMessage]);

  /**
   * Wrapper function for refresh session with auto-logout pause/resume
   * Prevents auto-logout from interfering with refresh operations
   */
  const refreshSession = useCallback(async (): Promise<boolean> => {
    // Prevent multiple simultaneous refresh attempts
    if (TokenManager.getContinueToWorkTransition()) {
      // Refresh already in progress, skipping duplicate call
      return false;
    }
    
    try {
      // Set transition state for visual feedback
      TokenManager.setContinueToWorkTransition(true);
      
      // Set refresh operation in progress to prevent auto-logout
      TokenManager.setRefreshOperationInProgress(true);
      
      // Call unified refresh function for manual refresh
      const refreshSuccess = await refreshUserSession(false);
      
      // Clear transition state
      TokenManager.setContinueToWorkTransition(false);
      
      // Clear refresh operation state
      TokenManager.setRefreshOperationInProgress(false);
      
      if (refreshSuccess) {
        // Refresh success - proceed with success flow
        try {
          // STEP 1: Reset activity timer to 1 minute (like first-time login)
          await TokenManager.updateActivity();
          
          // STEP 2: Clear refresh token timer (like first-time login)
          await TokenManager.clearRefreshTokenExpiry();
          
          // STEP 3: Reset Auth state to first-time login state
          setShowSessionExpiryModal(false);
          setLastModalShowTime(null);
          setSessionExpiryMessage('');
          
          // STEP 4: Clear any auto-logout timer (like first-time login)
          if (modalAutoLogoutTimer) {
            clearTimeout(modalAutoLogoutTimer);
            setModalAutoLogoutTimer(null);
          }
          
          // STEP 5: Show success message
          showNotification('You can continue working now!', 'success');
          
          return true;
        } catch (successError) {
          throw successError; // Re-throw to be caught by outer catch block
        }
      } else {
        // Refresh failed - show error message
        setShowSessionExpiryModal(false);
        showNotification('Failed to refresh session. Please log in again.', 'error');
        return false;
      }
    } catch (error) {
      // Handle any errors during refresh
      setShowSessionExpiryModal(false);
      showNotification('Failed to refresh session. Please log in again.', 'error');
      return false;
    }
  }, [refreshUserSession, setShowSessionExpiryModal, setLastModalShowTime, setSessionExpiryMessage, showNotification, modalAutoLogoutTimer, setModalAutoLogoutTimer]);

  return { refreshUserSession, refreshSession };
};

