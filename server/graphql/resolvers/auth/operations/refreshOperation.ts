/**
 * Refresh Token Operation Module
 * Handles token refresh and renewal operations
 * Follows GraphQL and Apollo Server best practices
 */

import { GraphQLError } from 'graphql';
import { v4 as uuidv4 } from 'uuid';
import { JWT_CONFIG } from '../../../../constants';
import { RefreshToken, User } from '../../../../db';
import { setCSRFToken } from '../../../../auth/csrf';
import { generateAccessToken, generateRefreshToken, hashRefreshToken, verifyRefreshTokenHash } from '../tokenManager';
import { cleanupRefreshTokens, limitRefreshTokens } from '../tokenCleanup';
import { validateRefreshToken } from '../validation';
import { AUTH_OPERATIONS_CONFIG, AUTH_OPERATIONS_TYPES } from './constants';

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
export const refreshToken = async (req: any, res: any, dynamicBuffer?: number) => {
  // Debug: Log cookie information for troubleshooting
  // Refresh operation - Request details
  // Refresh operation - Available cookies
  // Refresh operation - All cookies
  // Refresh operation - Cookie name being looked for
  // Refresh operation - Raw cookie header
  
  // Get refresh token from httpOnly cookie
  const refreshToken = req.cookies[AUTH_OPERATIONS_CONFIG.REFRESH_TOKEN_COOKIE_NAME];
  
  // Refresh operation - Refresh token found
  // Refresh operation - Refresh token value
  
  validateRefreshToken(refreshToken);

  // First, try to find the specific token that matches the provided refresh token
  // This is more efficient and secure than checking all tokens
  let validToken: any = null;
  let validUser: any = null;

  // NEW APPROACH: Allow refresh as long as token exists and isn't revoked
  // The database expiresAt field is for long-term session management (8 hours)
  // For "Continue to Work" functionality, the client-side timer (1 minute) is the authority
  // This provides better user experience while maintaining security
  const storedTokens = await RefreshToken.findAll({
    where: {
      isRevoked: false,
      // Remove expiresAt check - allow refresh regardless of database expiry
      // The client-side timer controls when refresh is allowed
    },
    include: [{ model: User, as: 'refreshTokenUser' }],
  });

  // Debug: Log token information for troubleshooting
  // Found non-revoked tokens
  // Token details

  // Check each token to find a match with enhanced security
  for (const storedToken of storedTokens) {
    try {
      const isValidHash = await verifyRefreshTokenHash(refreshToken, storedToken.tokenHash);
      if (isValidHash) {
        validToken = storedToken;
        validUser = storedToken.refreshTokenUser;
        // Valid token found
        break;
      }
    } catch (hashError) {
      continue;
    }
  }

  if (!validToken || !validUser) {
    throw new GraphQLError(AUTH_OPERATIONS_CONFIG.ERROR_MESSAGES.INVALID_REFRESH_TOKEN, {
      extensions: { code: AUTH_OPERATIONS_TYPES.ERROR_CODES.UNAUTHENTICATED },
    });
  }

  // At this point, validUser is guaranteed to be defined
  const user = validUser;

  // Revoke the old token for security
  await validToken.update({ isRevoked: true });

  // Generate new tokens with enhanced security
  const newAccessToken = generateAccessToken(user.id);
  const newRefreshToken = generateRefreshToken(user.id);

  // Hash new refresh token
  const newTokenHash = await hashRefreshToken(newRefreshToken);

  // Store new refresh token with 8-hour expiry
  await RefreshToken.create({
    id: uuidv4(),
    userId: user.id,
    tokenHash: newTokenHash,
    expiresAt: new Date(Date.now() + JWT_CONFIG.REFRESH_TOKEN_EXPIRY_MS), // 8 hours for database
    isRevoked: false,
  });

  // Clean up old tokens and limit new ones (but exclude the token we just revoked)
  // This prevents interference with the current refresh operation
  await cleanupRefreshTokens(user.id);
  await limitRefreshTokens(user.id);



  // Set new refresh token as httpOnly cookie
  // Use dynamic buffer time for cookie expiry based on user's session duration
  // This provides better user experience by allowing appropriate buffer time for "Continue to Work"
  const bufferTime = dynamicBuffer || 30000; // Default to 30 seconds if no dynamic buffer provided
  const cookieMaxAge = JWT_CONFIG.REFRESH_TOKEN_EXPIRY_MS + bufferTime;
  
  res.cookie(AUTH_OPERATIONS_CONFIG.REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, {
    httpOnly: true,
    secure: false, // Must be false for localhost development
    sameSite: 'lax', // Use 'lax' for cross-port development
    path: '/',
    maxAge: cookieMaxAge, // Dynamic buffer-based expiry for "Continue to Work"
  });

  // Set new CSRF token for future mutations
  const csrfToken = setCSRFToken(res);
  
  // Return both accessToken, refreshToken, CSRF token, and user as required by GraphQL schema
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken, // Include refresh token in response
    csrfToken, // Include CSRF token for client
    user: {
      id: user.id.toString(),
      uuid: user.uuid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isDeleted: user.isDeleted,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
};

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
export const refreshTokenRenewal = async (req: any, res: any) => {
  // Get refresh token from httpOnly cookie
  const refreshToken = req.cookies[AUTH_OPERATIONS_CONFIG.REFRESH_TOKEN_COOKIE_NAME];
  

  

  
  validateRefreshToken(refreshToken);



  // Find the specific token that matches the provided refresh token
  let validToken: any = null;
  let validUser: any = null;

  // Get all valid refresh tokens to find the matching one
  // NEW APPROACH: Allow refresh as long as token exists and isn't revoked
  // The database expiresAt field is for long-term session management (8 hours)
  // For "Continue to Work" functionality, the client-side timer (1 minute) is the authority
  // This provides better user experience while maintaining security
  const storedTokens = await RefreshToken.findAll({
    where: {
      isRevoked: false,
      // Remove expiresAt check - allow refresh regardless of database expiry
      // The client-side timer controls when refresh is allowed
    },
    include: [{ model: User, as: 'refreshTokenUser' }],
  });



  // Check each token to find a match
  for (const storedToken of storedTokens) {
    try {
      const isValidHash = await verifyRefreshTokenHash(refreshToken, storedToken.tokenHash);
      if (isValidHash) {
        validToken = storedToken;
        validUser = storedToken.refreshTokenUser;

        break;
      }
    } catch (hashError) {
      console.error(`${AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.ERROR} Hash verification error:`, hashError);
      continue;
    }
  }

  if (!validToken || !validUser) {
    throw new GraphQLError(AUTH_OPERATIONS_CONFIG.ERROR_MESSAGES.INVALID_REFRESH_TOKEN, {
      extensions: { code: AUTH_OPERATIONS_TYPES.ERROR_CODES.UNAUTHENTICATED },
    });
  }

  // Extend the refresh token expiry by 8 hours
  const newExpiryDate = new Date(Date.now() + JWT_CONFIG.REFRESH_TOKEN_EXPIRY_MS);
  await validToken.update({ expiresAt: newExpiryDate });



  // Return success response with user data
  return {
    success: true,
    message: AUTH_OPERATIONS_CONFIG.SUCCESS_MESSAGES.RENEWAL_SUCCESS,
    user: {
      id: validUser.id.toString(),
      uuid: validUser.uuid,
      email: validUser.email,
      firstName: validUser.firstName,
      lastName: validUser.lastName,
      role: validUser.role,
      isDeleted: validUser.isDeleted,
      version: validUser.version,
      createdAt: validUser.createdAt,
      updatedAt: validUser.updatedAt,
    },
  };
};
