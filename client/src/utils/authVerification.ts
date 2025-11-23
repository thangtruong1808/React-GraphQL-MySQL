/**
 * Authentication Verification Utility
 * Description: Centralized authentication verification for mutations
 * Date: 2024-12-19
 * Author: thangtruong
 * 
 * Ensures authentication is verified before mutations execute
 * Checks both AuthContext state and token availability
 */

import { ensureAuthDataReady, collectAuthData } from '../services/graphql/apollo-client';
import { ensureTokensReady } from '../services/graphql/apollo-client/tokens';

/**
 * Authentication verification result
 */
export interface AuthVerificationResult {
  isValid: boolean;
  accessToken: string | null;
  error?: string;
}

/**
 * Verify authentication before mutation execution
 * Description: Checks AuthContext state and ensures valid tokens are available
 * Date: 2024-12-19
 * Author: thangtruong
 * 
 * @param isAuthenticated - Authentication state from AuthContext
 * @returns Promise with verification result
 */
export const verifyAuthenticationBeforeMutation = async (
  isAuthenticated: boolean
): Promise<AuthVerificationResult> => {
  // Step 1: Check AuthContext state first (source of truth)
  if (!isAuthenticated) {
    return {
      isValid: false,
      accessToken: null,
      error: 'User not authenticated'
    };
  }

  // Step 2: Ensure auth data is ready
  try {
    const authDataReady = await ensureAuthDataReady();
    if (!authDataReady) {
      return {
        isValid: false,
        accessToken: null,
        error: 'Authentication data not ready'
      };
    }
  } catch (error) {
    return {
      isValid: false,
      accessToken: null,
      error: 'Failed to verify authentication data'
    };
  }

  // Step 3: Ensure tokens are ready (waits and refreshes if needed)
  // Use more retries to ensure tokens are available, especially after bulk operations
  let accessToken = await ensureTokensReady(10);
  
  // If still no token after initial retries, try a few more times with delays
  if (!accessToken) {
    for (let attempt = 0; attempt < 5 && !accessToken; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
      accessToken = await ensureTokensReady(5);
      if (accessToken) break;
    }
  }
  
  if (!accessToken) {
    return {
      isValid: false,
      accessToken: null,
      error: 'Authentication token not available and refresh failed'
    };
  }

  // Step 4: Final verification - ensure token is still valid right before mutation
  const finalAuthData = await collectAuthData();
  if (!finalAuthData.accessToken) {
    // Token might have expired between checks, try one more time
    const finalToken = await ensureTokensReady(3);
    if (!finalToken) {
      return {
        isValid: false,
        accessToken: null,
        error: 'Authentication token not available'
      };
    }
    return {
      isValid: true,
      accessToken: finalToken
    };
  }

  // Step 5: Longer delay to ensure tokens are fully persisted and available
  // This helps prevent race conditions where tokens are verified but not yet available in authLink
  // Increased delay especially important after bulk operations
  await new Promise(resolve => setTimeout(resolve, 200));

  return {
    isValid: true,
    accessToken
  };
};

