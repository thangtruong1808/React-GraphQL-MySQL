import { GraphQLError } from 'graphql';
import { v4 as uuidv4 } from 'uuid';
import { JWT_CONFIG } from '../../../constants';
import { RefreshToken, User } from '../../../db';
import { setCSRFToken, clearCSRFToken } from '../../../auth/csrf';
import { generateAccessToken, generateRefreshToken, hashRefreshToken, verifyRefreshTokenHash } from './tokenManager';
import { cleanupRefreshTokens, limitRefreshTokens } from './tokenCleanup';
import { validateLoginCredentials, validateRefreshToken, sanitizeEmail } from './validation';

/**
 * Authentication Operations Module
 * Handles core authentication operations: login, logout, token refresh
 * 
 * SCENARIOS:
 * - Login: Validates credentials, generates tokens, stores in DB
 * - Logout: Clears tokens from DB and cookies
 * - Token Refresh: Validates refresh token, generates new tokens
 * - Session Management: Handles multiple active sessions
 */

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
export const login = async (input: { email: string; password: string }, res: any) => {
  try {
    const { email, password } = input;

    // Validate input credentials
    validateLoginCredentials(email, password);

    // Find user by email (case-insensitive) with enhanced security
    // Single DB query for user lookup
    const user = await User.findOne({
      where: {
        email: sanitizeEmail(email),
        isDeleted: false,
      },
    });

    if (!user) {
      console.log(`❌ Login attempt with non-existent email: ${email}`);
      throw new GraphQLError('Invalid email or password', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    // Verify password with enhanced security
    if (!user.password) {
      console.log(`❌ User ${user.id} has no password set`);
      throw new GraphQLError('Invalid email or password', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }
    
    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      console.log(`❌ Invalid password for user ID: ${user.id}`);
      throw new GraphQLError('Invalid email or password', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    // Clean up expired tokens only (not all tokens) - performance optimization
    await cleanupRefreshTokens(user.id);

    // Check token count BEFORE creating new token
    const currentTokenCount = await RefreshToken.count({
      where: {
        userId: user.id,
        isRevoked: false,
        expiresAt: {
          [require('sequelize').Op.gt]: new Date(),
        },
      },
    });

    console.log(`🔍 Pre-login token check for user ID: ${user.id} - Current tokens: ${currentTokenCount}, Max allowed: ${JWT_CONFIG.MAX_REFRESH_TOKENS_PER_USER}`);

    // Reject login if user has reached the maximum number of active sessions
    if (currentTokenCount >= JWT_CONFIG.MAX_REFRESH_TOKENS_PER_USER) {
      console.log(`❌ User ID: ${user.id} has reached maximum active sessions (${currentTokenCount}/${JWT_CONFIG.MAX_REFRESH_TOKENS_PER_USER})`);
      throw new GraphQLError(`Maximum active sessions reached (${JWT_CONFIG.MAX_REFRESH_TOKENS_PER_USER}). Please log out from another device to continue.`, {
        extensions: { code: 'TOO_MANY_SESSIONS' },
      });
    }

    // Generate tokens with enhanced security
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Hash refresh token for storage
    const tokenHash = await hashRefreshToken(refreshToken);

    console.log(`🔐 Login: Storing refresh token for user ID: ${user.id}`);

    // Store refresh token in database
    await RefreshToken.create({
      id: uuidv4(),
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + JWT_CONFIG.REFRESH_TOKEN_EXPIRY_MS), // 3 days
      isRevoked: false,
    });

    console.log(`✅ Login successful for user ID: ${user.id}`);

    // Set refresh token as httpOnly cookie
    res.cookie('jid', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/', // Use root path to ensure cookie is available for all routes
      maxAge: JWT_CONFIG.REFRESH_TOKEN_EXPIRY_MS, 
    });

    // Set CSRF token for future mutations
    const csrfToken = setCSRFToken(res);
    
    // Prepare response data
    const responseData = {
      accessToken,
      refreshToken, // Include refresh token in response
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
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };

    // Debug: Log the response data
    console.log('🔍 Login response data:', {
      hasAccessToken: !!responseData.accessToken,
      hasRefreshToken: !!responseData.refreshToken,
      hasCSRFToken: !!responseData.csrfToken,
      hasUser: !!responseData.user,
      userId: responseData.user.id,
      userEmail: responseData.user.email
    });
    
    // Return accessToken, refreshToken, CSRF token, and user as required by GraphQL schema
    return responseData;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    console.error('❌ Login error:', error);
    throw new GraphQLError('Login failed', {
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    });
  }
};

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
export const refreshToken = async (req: any, res: any) => {
  // Get refresh token from httpOnly cookie
  const refreshToken = req.cookies.jid;
  validateRefreshToken(refreshToken);

  console.log('🔍 Attempting to refresh token...');

  // First, try to find the specific token that matches the provided refresh token
  // This is more efficient and secure than checking all tokens
  let validToken: any = null;
  let validUser: any = null;

  // Get all valid refresh tokens for all users to find the matching one
  const storedTokens = await RefreshToken.findAll({
    where: {
      isRevoked: false,
      expiresAt: {
        [require('sequelize').Op.gt]: new Date(),
      },
    },
    include: [{ model: User, as: 'refreshTokenUser' }],
  });

  console.log(`📊 Found ${storedTokens.length} valid refresh tokens in database`);

  // Check each token to find a match with enhanced security
  for (const storedToken of storedTokens) {
    try {
      const isValidHash = await verifyRefreshTokenHash(refreshToken, storedToken.tokenHash);
      if (isValidHash) {
        validToken = storedToken;
        validUser = storedToken.refreshTokenUser;
        console.log(`✅ Found matching refresh token for user ID: ${validUser.id}`);
        break;
      }
    } catch (hashError) {
      console.error('❌ Hash verification error:', hashError);
      continue;
    }
  }

  if (!validToken || !validUser) {
    console.log('❌ No valid refresh token found');
    throw new GraphQLError('Invalid refresh token', {
      extensions: { code: 'UNAUTHENTICATED' },
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

  // Store new refresh token
  await RefreshToken.create({
    id: uuidv4(),
    userId: user.id,
    tokenHash: newTokenHash,
    expiresAt: new Date(Date.now() + JWT_CONFIG.REFRESH_TOKEN_EXPIRY_MS), // 7 days
    isRevoked: false,
  });

  // Clean up old tokens and limit new ones
  await cleanupRefreshTokens(user.id);
  await limitRefreshTokens(user.id);

  console.log(`🔄 Successfully refreshed tokens for user ID: ${user.id}`);

  // Set new refresh token as httpOnly cookie
  res.cookie('jid', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/', // Use root path to ensure cookie is available for all routes
    maxAge: JWT_CONFIG.REFRESH_TOKEN_EXPIRY_MS, // 7 days
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
export const logout = async (req: any, res: any) => {
  try {
    // Get refresh token from httpOnly cookie
    const refreshToken = req.cookies.jid;
    
    if (refreshToken) {
      console.log('🔍 Logout: Found refresh token in cookie, attempting to delete from database');
      
      // Find and delete the specific refresh token from database
      const storedTokens = await RefreshToken.findAll({
        where: {
          isRevoked: false,
          expiresAt: {
            [require('sequelize').Op.gt]: new Date(),
          },
        },
        include: [{ model: User, as: 'refreshTokenUser' }],
      });

      // Find the matching token and delete it
      for (const storedToken of storedTokens) {
        try {
          const isValidHash = await verifyRefreshTokenHash(refreshToken, storedToken.tokenHash);
          if (isValidHash) {
            console.log(`🗑️ Logout: Deleting refresh token ID: ${storedToken.id} for user ID: ${storedToken.userId}`);
            await storedToken.destroy();
            break;
          }
        } catch (hashError) {
          console.error('❌ Hash verification error during logout:', hashError);
          continue;
        }
      }
    } else {
      console.log('🔍 Logout: No refresh token found in cookie');
    }

    // Note: Access tokens are short-lived (5 minutes) and will expire automatically
    // No need to blacklist them in this simplified approach

    // Clear the refresh token cookie
    res.clearCookie('jid', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/', // Use root path to match the cookie setting
    });

    // Clear CSRF token
    clearCSRFToken(res);

    console.log('✅ Logout successful - refresh token deleted and cookies cleared');

    return {
      success: true,
      message: 'Logout successful',
    };
  } catch (error) {
    console.error('❌ Logout error:', error);
    
    // Even if there's an error, try to clear the cookie
    res.clearCookie('jid', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return {
      success: false,
      message: 'Logout completed with errors',
    };
  }
}; 