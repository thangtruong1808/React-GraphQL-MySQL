/**
 * Refresh Token Operation Module
 * Handles token refresh and renewal operations
 * Follows GraphQL and Apollo Server best practices
 */

import { GraphQLError } from 'graphql';
import { v4 as uuidv4 } from 'uuid';
import { JWT_CONFIG, AUTH_CONFIG } from '../../../../constants';
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
  
  // Check if refresh token exists - if not, return unauthenticated state gracefully
  if (!validateRefreshToken(refreshToken)) {
    // No refresh token present - this is normal for new users or logged out users
    // Return successful response with no user data instead of throwing an error
    return {
      accessToken: null,
      refreshToken: null,
      csrfToken: null,
      user: null,
    };
  }

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
      // Check expiresAt to ensure token is still valid
      expiresAt: {
        [require('sequelize').Op.gt]: new Date(),
      },
    },
    include: [{ model: User, as: 'user' }],
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
        validUser = storedToken.user;
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
  // Cookie expiry should match database expiry (8 hours) to ensure session persistence across browser refreshes
  // The client-side timer (1 minute) is for UI countdown, not cookie expiry
  const cookieMaxAge = JWT_CONFIG.REFRESH_TOKEN_EXPIRY_MS; // 8 hours to match database expiry
  
  res.cookie(AUTH_OPERATIONS_CONFIG.REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, {
    ...AUTH_CONFIG.COOKIE_OPTIONS,
    maxAge: cookieMaxAge, // 8 hours to ensure session persistence
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
  
  // Check if refresh token exists - if not, return unauthenticated state gracefully
  if (!validateRefreshToken(refreshToken)) {
    // No refresh token present - this is normal for new users or logged out users
    // Return successful response with no user data instead of throwing an error
    return {
      success: false,
      message: AUTH_OPERATIONS_CONFIG.ERROR_MESSAGES.INVALID_REFRESH_TOKEN,
      user: null,
    };
  }

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
      // Check expiresAt to ensure token is still valid
      expiresAt: {
        [require('sequelize').Op.gt]: new Date(),
      },
    },
    include: [{ model: User, as: 'user' }],
  });



  // Check each token to find a match
  for (const storedToken of storedTokens) {
    try {
      const isValidHash = await verifyRefreshTokenHash(refreshToken, storedToken.tokenHash);
      if (isValidHash) {
        validToken = storedToken;
        validUser = storedToken.user;

        break;
      }
    } catch (hashError) {
      // Hash verification error - continue to next token
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
