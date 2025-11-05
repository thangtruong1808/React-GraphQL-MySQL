import { onError } from '@apollo/client/link/error';
import { ROUTE_PATHS } from '../../../../constants/routingConstants';
import { AUTH_CONFIG } from '../../../../constants';
import { clearTokens, getTokens, TokenManager } from '../../../../utils/tokenManager';
import { getGlobalErrorHandler, getIsAuthInitializing, getIsAppInitializing } from '../state';
import { refreshTokenAutomatically } from '../tokens';

/**
 * Error Link for Apollo Client
 * Handles GraphQL and network errors with comprehensive authentication handling
 */

/**
 * Enhanced error link with comprehensive authentication handling
 * Runs AFTER every GraphQL response to handle authentication errors
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
    // Check if this is a notification-related operation first (before processing errors)
    const isNotificationOperation = operation.operationName === 'GetUserUnreadNotifications' ||
                                     operation.operationName === 'GetDashboardNotifications';
    
    // ALWAYS suppress errors from notification operations - they're non-critical
    const hasNotificationError = isNotificationOperation || graphQLErrors.some(({ message }) => {
      const isNotificationMessage = message.toLowerCase().includes('notification') || 
                                   message.toLowerCase().includes('notifications') ||
                                   message.includes('Failed to fetch notifications') ||
                                   message.includes('must be logged in to view notifications');
      
      if (isNotificationOperation) {
        return true;
      }
      
      return isNotificationMessage;
    });
    
    // ALWAYS suppress notification errors - they're non-critical and shouldn't interrupt user flow
    if (hasNotificationError) {
      return; // Suppress notification errors completely - no toast shown
    }
    
    graphQLErrors.forEach(async ({ message, extensions }) => {
      // Handle GraphQL errors
      if (extensions?.code === 'UNAUTHENTICATED') {
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

        const isCommentOperation = operation.operationName === 'CreateComment' ||
                                  operation.operationName === 'ToggleCommentLike' ||
                                  operation.operationName === 'GetDashboardComments';

        const isCommentQuery = operation.operationName === 'GetDashboardComments';
        const isTagsQuery = operation.operationName === 'GetDashboardTags';
        
        const isTagsOrCommentsAuthError = message.includes('must be logged in to view tags') ||
                                         message.includes('must be logged in to view comments') ||
                                         message.includes('Failed to fetch tags') ||
                                         message.includes('Failed to fetch comments');

        // For comment and tags queries, always suppress UNAUTHENTICATED errors if tokens exist
        if (((isCommentQuery || isTagsQuery) && hasTokens) || 
            (isTagsOrCommentsAuthError && hasTokens && (isCommentQuery || isTagsQuery))) {
          return;
        }
        
        const isAuthInitializing = getIsAuthInitializing();
        const isAppInitializing = getIsAppInitializing();
        
        // Suppress authentication errors during initialization, app initialization, or when tokens don't exist yet
        if (isAuthOperation || isRefreshTokenRequiredError || isAuthInitializing || isAppInitializing || !hasTokens) {
          return;
        }
        
        // For comment mutations, try to refresh token automatically
        if (isCommentOperation && !isCommentQuery) {
          const newToken = await refreshTokenAutomatically();
          if (newToken) {
            forward(operation);
            return;
          } else {
            const globalErrorHandler = getGlobalErrorHandler();
            if (globalErrorHandler) {
              globalErrorHandler('Session expired. Please try again.', 'GraphQL');
            }
            return;
          }
        }
        
        // Clear tokens on authentication error for other operations (outside modal flow)
        clearTokens();
        
        // Only show other authentication errors
        const globalErrorHandler = getGlobalErrorHandler();
        if (globalErrorHandler) {
          globalErrorHandler('Authentication error. Please log in again.', 'GraphQL');
        }
      } else if (extensions?.code === 'CSRF_TOKEN_INVALID' || message.includes('CSRF')) {
        // Handle CSRF errors gracefully - don't show to user during logout
        const isLogoutOperation = operation.operationName === 'Logout';
        const isTaskOperation = ['CreateTask', 'UpdateTask', 'DeleteTask'].includes(operation.operationName);
        if (!isLogoutOperation && !isTaskOperation) {
          throw new Error(message);
        }
      } else {
        // Check if this is a comment or tags query that might be failing due to race condition
        const isCommentQuery = operation.operationName === 'GetDashboardComments';
        const isTagsQuery = operation.operationName === 'GetDashboardTags';
        const tokens = getTokens();
        const hasTokens = !!(tokens.accessToken || tokens.refreshToken);
        const isTagsOrCommentsAuthError = message.includes('must be logged in to view tags') ||
                                         message.includes('must be logged in to view comments') ||
                                         message.includes('Failed to fetch tags') ||
                                         message.includes('Failed to fetch comments');

        // For comment and tags queries, suppress auth errors if tokens exist
        if ((isCommentQuery || isTagsQuery) && hasTokens) {
          if (isTagsOrCommentsAuthError || extensions?.code === 'UNAUTHENTICATED') {
            return;
          }
        }

        // Show other GraphQL errors to user
        const globalErrorHandler = getGlobalErrorHandler();
        if (globalErrorHandler) {
          globalErrorHandler(message, 'GraphQL');
        }
      }
    });
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

