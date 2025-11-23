import { onError } from '@apollo/client/link/error';
import { ROUTE_PATHS } from '../../../../constants/routingConstants';
import { AUTH_CONFIG } from '../../../../constants';
import { clearTokens, getTokens, TokenManager } from '../../../../utils/tokenManager';
import { getGlobalErrorHandler, getIsAuthInitializing, getIsAppInitializing } from '../state';
import { refreshTokenAutomatically, ensureTokensReady } from '../tokens';

/**
 * Error Link for Apollo Client
 * Description: Handles GraphQL and network errors with comprehensive authentication handling
 * Date: 2024-12-19
 * Author: thangtruong
 */

/**
 * Enhanced error link with comprehensive authentication handling
 * Description: Runs AFTER every GraphQL response to handle authentication errors
 * Date: 2024-12-19
 * Author: thangtruong
 * 
 * CALLED BY: Every GraphQL response (success or error)
 * SCENARIOS:
 * - UNAUTHENTICATED error: Triggers token refresh or logout
 * - TOO_MANY_SESSIONS error: Shows error message to user
 * - Network errors: Handles 401/Unauthorized responses
 * - Other errors: Logs error details
 */
export const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    // Check if this is a navbar notification query (not dashboard management query)
    // Only suppress errors for navbar notification queries, not dashboard management queries
    const isNavbarNotificationQuery = operation.operationName === 'GetUserUnreadNotifications';
    
    // ALWAYS suppress errors from navbar notification queries - they're non-critical
    // Dashboard notification queries should trigger token refresh, not be suppressed
    if (isNavbarNotificationQuery) {
      return; // Suppress navbar notification errors completely - no toast shown
    }
    
    // Check for UNAUTHENTICATED errors that need token refresh
    const unauthenticatedError = graphQLErrors.find(({ extensions }) => extensions?.code === 'UNAUTHENTICATED');
    
    if (unauthenticatedError) {
      const { message, extensions } = unauthenticatedError;
      
      // Check authentication state more reliably - check if tokens exist
      const tokens = getTokens();
      const hasTokens = !!(tokens.accessToken || tokens.refreshToken);
      
      // During session-expiry window, suppress auth errors (no toast, no token clear)
      try {
        const isModalShowing = TokenManager.isSessionExpiryModalShowing();
        const activityModeEnabled = AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED;
        const isAccessExpired = activityModeEnabled ? TokenManager.isActivityBasedTokenExpired() : false;
        const isAuthWindow = isModalShowing || isAccessExpired;
        
        if (isAuthWindow) {
          return; // Let SessionManager handle the flow
        }
      } catch (_) {}

      const isAuthOperation = operation.operationName === 'RefreshToken' ||
                             operation.operationName === 'RefreshTokenRenewal';

      const isRefreshTokenRequiredError = message === 'Refresh token is required' ||
                                        message === 'Invalid refresh token' ||
                                        message.includes('Refresh token') ||
                                        message.includes('refresh token');

      // Dashboard queries that should trigger token refresh on auth errors
      const isDashboardQuery = operation.operationName === 'GetDashboardComments' ||
                              operation.operationName === 'GetDashboardTags' ||
                              operation.operationName === 'GetDashboardActivities' ||
                              operation.operationName === 'GetDashboardNotifications' ||
                              operation.operationName === 'GetDashboardStats';

      const isCommentOperation = operation.operationName === 'CreateComment' ||
                                operation.operationName === 'ToggleCommentLike';
      
      // Notification mutations that should try token refresh instead of clearing tokens
      const isNotificationMutation = operation.operationName === 'MarkAllNotificationsAsRead' ||
                                    operation.operationName === 'MarkAllNotificationsAsUnread' ||
                                    operation.operationName === 'MarkNotificationRead' ||
                                    operation.operationName === 'MarkNotificationUnread' ||
                                    operation.operationName === 'DeleteNotification' ||
                                    operation.operationName === 'DeleteAllReadNotifications' ||
                                    operation.operationName === 'DeleteAllUnreadNotifications';
      
      const isAuthInitializing = getIsAuthInitializing();
      const isAppInitializing = getIsAppInitializing();
      
      // Suppress authentication errors during initialization, app initialization, or when tokens don't exist yet
      if (isAuthOperation || isRefreshTokenRequiredError || isAuthInitializing || isAppInitializing || !hasTokens) {
        return;
      }
      
      // For dashboard queries, comment mutations, and notification mutations, try to refresh token automatically
      // This prevents clearing tokens when they might still be valid
      if (isDashboardQuery || isCommentOperation || isNotificationMutation) {
        // Use async IIFE to handle token refresh and return Observable properly
        // Apollo Client errorLink can return Promise<Observable> for retry
        // IMPORTANT: Must return Promise that resolves to Observable or undefined
        return (async () => {
          try {
            // Wait a bit before attempting refresh to ensure any ongoing operations complete
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const newToken = await refreshTokenAutomatically();
            if (newToken) {
              // Wait longer for tokens to be fully available before retrying operation
              // Increased delay especially important after bulk operations like "mark all as read"
              await new Promise(resolve => setTimeout(resolve, 500));
              
              // Verify tokens are actually available before forwarding
              const verifiedToken = await ensureTokensReady(10);
              if (verifiedToken) {
                // Return the forwarded operation Observable for retry
                // Apollo Client will retry the operation with fresh tokens
                return forward(operation);
              } else {
                // Tokens not available after refresh - try one more time
                await new Promise(resolve => setTimeout(resolve, 300));
                const finalToken = await ensureTokensReady(5);
                if (finalToken) {
                  return forward(operation);
                }
                
                // Still no token - show error but don't clear tokens
                const globalErrorHandler = getGlobalErrorHandler();
                if (globalErrorHandler) {
                  globalErrorHandler('Session expired. Please try again.', 'GraphQL');
                }
                return undefined;
              }
            } else {
              // Refresh failed - don't clear tokens immediately, they might still be valid
              // Try one more time with a longer delay
              await new Promise(resolve => setTimeout(resolve, 300));
              const retryToken = await refreshTokenAutomatically();
              if (retryToken) {
                await new Promise(resolve => setTimeout(resolve, 500));
                const verifiedToken = await ensureTokensReady(10);
                if (verifiedToken) {
                  return forward(operation);
                }
              }
              
              // Still failed - show error but don't clear tokens
              const globalErrorHandler = getGlobalErrorHandler();
              if (globalErrorHandler) {
                globalErrorHandler('Session expired. Please try again.', 'GraphQL');
              }
              return undefined;
            }
          } catch (error) {
            // Error during refresh - show error but don't clear tokens
            const globalErrorHandler = getGlobalErrorHandler();
            if (globalErrorHandler) {
              globalErrorHandler('Session expired. Please try again.', 'GraphQL');
            }
            return undefined;
          }
        })();
      }
      
      // Clear tokens on authentication error for other operations (outside modal flow)
      clearTokens();
      
      // Only show other authentication errors
      const globalErrorHandler = getGlobalErrorHandler();
      if (globalErrorHandler) {
        globalErrorHandler('Authentication error. Please log in again.', 'GraphQL');
      }
      return;
    }
    
    // Process other errors sequentially
    for (const { message, extensions } of graphQLErrors) {
      if (extensions?.code === 'CSRF_TOKEN_INVALID' || message.includes('CSRF')) {
        // Handle CSRF errors gracefully - don't show to user during logout
        const isLogoutOperation = operation.operationName === 'Logout';
        const isTaskOperation = ['CreateTask', 'UpdateTask', 'DeleteTask'].includes(operation.operationName);
        if (!isLogoutOperation && !isTaskOperation) {
          throw new Error(message);
        }
        continue;
      }
      
      // Show other GraphQL errors to user
      getGlobalErrorHandler()?.(message, 'GraphQL');
    }
  }

  if (networkError) {
    // Handle network errors that might be related to authentication
    if (networkError.message.includes('401') || networkError.message.includes('Unauthorized')) {
      clearTokens();
      
      const isAuthOperation = operation.operationName === 'RefreshToken' || 
                             operation.operationName === 'RefreshTokenRenewal';
      
      const isAuthInitializing = getIsAuthInitializing();
      const isAppInitializing = getIsAppInitializing();
      
      if (!isAuthOperation && !isAuthInitializing && !isAppInitializing) {
        window.location.href = ROUTE_PATHS.LOGIN;
      }
    } else if (networkError.message.includes('403') || networkError.message.includes('Forbidden')) {
      const isLogoutOperation = operation.operationName === 'Logout';
      if (isLogoutOperation) {
        return;
      }
      
      const tokens = getTokens();
      if (tokens.refreshToken) {
        return;
      }
    } else {
      const isAuthInitializing = getIsAuthInitializing();
      const isAppInitializing = getIsAppInitializing();
      const globalErrorHandler = getGlobalErrorHandler();
      
      if (globalErrorHandler && !isAuthInitializing && !isAppInitializing) {
        globalErrorHandler(`Network error: ${networkError.message}`, 'Network');
      }
    }
  }
});

