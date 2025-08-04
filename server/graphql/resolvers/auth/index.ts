/**
 * Authentication Resolvers Index
 * Main entry point for all authentication-related GraphQL resolvers
 * 
 * SCENARIOS:
 * - Module Organization: Centralizes all auth-related functionality
 * - Clean Architecture: Separates concerns into logical modules
 * - Maintainability: Easy to locate and modify specific functionality
 * - Testing: Enables isolated testing of individual modules
 */

// Export individual modules for direct access
export * from './tokenManager';
export * from './tokenCleanup';
export * from './validation';
export * from './operations';

// Import operations for resolver creation
import { login, refreshToken, logout, refreshTokenRenewal } from './operations';

// Import guards for authentication and authorization
import { withAuth, authGuard } from '../../../auth/guard';

/**
 * Get current authenticated user
 * Returns the user object from GraphQL context
 * Protected by authentication guard
 * 
 * CALLED BY: Client currentUser query
 * SCENARIOS:
 * - Valid authentication: Returns user data
 * - No authentication: Throws UNAUTHENTICATED error
 * - Expired token: Throws UNAUTHENTICATED error (handled by middleware)
 * 
 * FLOW: Guard check → Return user from context
 */
const getCurrentUser = (_: any, __: any, context: any) => {
  // User is already validated by authGuard, just return it
  return context.user;
};

/**
 * Authentication Resolvers Object
 * Contains all GraphQL resolvers for authentication operations
 * 
 * SCENARIOS:
 * - GraphQL Integration: Provides resolver functions for schema
 * - Request Handling: Processes authentication mutations
 * - Response Formatting: Returns properly structured GraphQL responses
 * - Error Handling: Manages authentication-specific errors
 */
export const authResolvers = {
  Query: {
    /**
     * Get current authenticated user - protected by authentication guard
     * Returns user data for authenticated requests only
     * 
     * CALLED BY: Client currentUser query
     * SCENARIOS:
     * - Valid authentication: Returns user data
     * - No authentication: Throws UNAUTHENTICATED error
     * - Expired token: Throws UNAUTHENTICATED error
     * 
     * FLOW: Authentication guard → Return user data
     */
    currentUser: withAuth(getCurrentUser, authGuard),
  },

  Mutation: {
    /**
     * Enhanced user login with email and password
     * Main authentication entry point: validates credentials, generates tokens, stores in DB
     * Performance optimization: minimal DB queries, efficient token management
     * 
     * CALLED BY: Client login mutation
     * SCENARIOS:
     * - First time login: Validates credentials, generates new tokens
     * - Re-login after logout: Same as first time login
     * - Invalid credentials: Returns UNAUTHENTICATED error
     * - Too many sessions: Returns TOO_MANY_SESSIONS error
     * 
     * FLOW: Input validation → User lookup → Password verification → Token generation → DB storage → Cookie setting → Response
     */
    login: async (_: any, { input }: { input: { email: string; password: string } }, { res }: { res: any }) => {
      return await login(input, res);
    },

    /**
     * Enhanced refresh access token using refresh token from httpOnly cookie
     * Performance optimization: efficient token lookup, minimal DB queries
     * Returns new access token and sets new refresh token as httpOnly cookie
     * 
     * CALLED BY: Client refresh token mutation
     * SCENARIOS:
     * - Valid refresh token: Generates new access token, rotates refresh token
     * - Expired refresh token: Returns UNAUTHENTICATED error
     * - Invalid refresh token: Returns UNAUTHENTICATED error
     * - Revoked refresh token: Returns UNAUTHENTICATED error
     * 
     * FLOW: Read cookie → Find token in DB → Verify hash → Generate new tokens → Store new token → Set cookie → Response
     */
    refreshToken: async (_: any, __: any, { req, res }: { req: any; res: any }) => {
      return await refreshToken(req, res);
    },

    /**
     * Renew refresh token to extend session
     * Used when user is active but refresh token is about to expire
     * Does NOT generate new access token - only extends refresh token expiry
     * 
     * CALLED BY: Client refreshTokenRenewal mutation
     * SCENARIOS:
     * - Active user with expiring refresh token: Extends refresh token expiry
     * - Expired refresh token: Returns UNAUTHENTICATED error
     * - Invalid refresh token: Returns UNAUTHENTICATED error
     * 
     * FLOW: Read cookie → Find token in DB → Verify hash → Extend expiry → Response
     */
    refreshTokenRenewal: async (_: any, __: any, { req, res }: { req: any; res: any }) => {
      return await refreshTokenRenewal(req, res);
    },

    /**
     * Enhanced user logout - clears refresh token cookie and deletes from database
     * Performance optimization: efficient token lookup and deletion
     * 
     * CALLED BY: Client logout mutation
     * SCENARIOS:
     * - User logout: Finds and deletes refresh token from DB, clears cookie
     * - No refresh token: Just clears cookie (already logged out)
     * - Invalid refresh token: Just clears cookie (token already invalid)
     * 
     * FLOW: Read cookie → Find token in DB → Delete token → Clear cookie → Response
     */
    logout: async (_: any, __: any, { req, res }: { req: any; res: any }) => {
      return await logout(req, res);
    },
  },
}; 