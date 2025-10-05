import { useMutation } from '@apollo/client';
import { useAuth } from '../../contexts/AuthContext';
import { REFRESH_TOKEN } from '../../services/graphql/mutations';

// Global token refresh promise to prevent race conditions
let tokenRefreshPromise: Promise<any> | null = null;

/**
 * Custom hook for authenticated mutations with automatic token refresh
 * Ensures mutations are made with valid tokens by refreshing when needed
 * 
 * CALLED BY: Components that need to make authenticated mutations
 * SCENARIOS: Comment creation, liking, and other authenticated operations
 */
export const useAuthenticatedMutation = (mutation: any, options: any = {}) => {
  const { isAuthenticated } = useAuth();
  const [refreshToken] = useMutation(REFRESH_TOKEN);
  const [mutationFn, mutationResult] = useMutation(mutation, options);

  const executeMutation = async (variables: any) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      // First attempt with current token
      return await mutationFn({ variables });
    } catch (error: any) {
      // If authentication error, try to refresh token and retry
      if (error.message?.includes('You must be logged in') || 
          error.message?.includes('UNAUTHENTICATED') ||
          error.message?.includes('403')) {
        
        try {
          // Prevent race conditions by using singleton token refresh
          if (!tokenRefreshPromise) {
            tokenRefreshPromise = refreshToken({
              variables: {
                dynamicBuffer: Date.now()
              }
            }).finally(() => {
              // Clear the promise after completion
              tokenRefreshPromise = null;
            });
          }
          
          // Wait for token refresh (whether it's ongoing or just completed)
          await tokenRefreshPromise;
          
          // Small delay to ensure token is properly set in Apollo client
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Retry the mutation with fresh token
          return await mutationFn({ variables });
        } catch (refreshError) {
          // Clear the promise on error so next request can try again
          tokenRefreshPromise = null;
          throw refreshError;
        }
      }
      
      throw error;
    }
  };

  return [executeMutation, mutationResult];
};
