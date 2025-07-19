import bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {
  AUTH_CONFIG,
  ERROR_MESSAGES,
  JWT_CONFIG,
  VALIDATION_CONFIG
} from '../../constants';
import { RefreshToken, User } from '../../db';
import { GraphQLContext } from '../context';
import { setCSRFToken, clearCSRFToken } from '../../auth/csrf';

/**
 * Enhanced Authentication Resolvers
 * Handles login, logout, and token refresh operations with security measures
 * Optimized for performance: minimal DB queries, efficient token management
 * 
 * EXECUTION FLOW FOR DIFFERENT SCENARIOS:
 * 
 * 1. FIRST TIME LOGIN (No tokens):
 *    - login() → validates credentials → generates tokens → stores in DB → sets httpOnly cookie
 *    - generateAccessToken() → creates JWT with user ID and expiry
 *    - generateRefreshToken() → creates random hex string
 *    - hashRefreshToken() → bcrypt hashes refresh token for DB storage
 *    - RefreshToken.create() → stores hashed token in database
 *    - res.cookie() → sets refresh token as httpOnly cookie
 * 
 * 2. EXPIRED ACCESS TOKEN + VALID REFRESH TOKEN:
 *    - refreshToken() → reads refresh token from httpOnly cookie
 *    - verifyRefreshTokenHash() → validates token against DB hash
 *    - generateAccessToken() → creates new JWT access token
 *    - generateRefreshToken() → creates new refresh token (token rotation)
 *    - RefreshToken.create() → stores new hashed token in database
 *    - res.cookie() → sets new refresh token as httpOnly cookie
 * 
 * 3. EXPIRED ACCESS TOKEN + EXPIRED REFRESH TOKEN:
 *    - refreshToken() → reads refresh token from httpOnly cookie
 *    - verifyRefreshTokenHash() → fails validation (token expired/not found)
 *    - Returns UNAUTHENTICATED error → client clears tokens
 */

// JWT configuration - required environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Validate required environment variables
if (!JWT_SECRET) {
  throw new Error(ERROR_MESSAGES.JWT_SECRET_MISSING);
}

/**
 * Generate JWT access token with enhanced security
 * @param userId - User ID to encode in token
 * @returns JWT access token
 * 
 * CALLED BY: login(), refreshToken()
 * SCENARIOS: All scenarios - creates JWT tokens for client authentication
 * FEATURES: User ID, token type, issued timestamp, expiry, issuer, audience
 */
const generateAccessToken = (userId: number): string => {
  return jwt.sign(
    { 
      userId,
      type: 'access',
      iat: Math.floor(Date.now() / 1000),
    }, 
    JWT_SECRET, 
    { 
      expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE,
    }
  );
};

/**
 * Generate refresh token (random string, not JWT) with enhanced security
 * @param userId - User ID for the token
 * @returns Random refresh token string
 * 
 * CALLED BY: login(), refreshToken()
 * SCENARIOS: All scenarios - creates cryptographically secure random tokens
 * FEATURES: 64 bytes (128 characters), hex format, cryptographically secure
 */
const generateRefreshToken = (userId: number): string => {
  // Generate a cryptographically secure random token
  return require('crypto').randomBytes(AUTH_CONFIG.REFRESH_TOKEN_BYTES).toString('hex');
};

/**
 * Hash refresh token for storage with enhanced security
 * @param token - Raw refresh token
 * @returns Hashed token
 * 
 * CALLED BY: login(), refreshToken()
 * SCENARIOS: All scenarios - secures refresh tokens before DB storage
 * FEATURES: Bcrypt hashing, salt rounds, one-way encryption
 */
const hashRefreshToken = async (token: string): Promise<string> => {
  return bcrypt.hash(token, AUTH_CONFIG.BCRYPT_ROUNDS);
};

/**
 * Verify refresh token hash with enhanced security
 * @param token - Raw refresh token
 * @param hash - Stored hash
 * @returns Boolean indicating if token matches hash
 * 
 * CALLED BY: refreshToken(), logout()
 * SCENARIOS: Token validation - compares client token with stored hash
 * FEATURES: Bcrypt comparison, timing attack protection
 */
const verifyRefreshTokenHash = async (token: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(token, hash);
};

/**
 * Clean up expired and revoked refresh tokens
 * Performance optimization: only removes expired/revoked tokens
 * @param userId - User ID to clean tokens for
 * 
 * CALLED BY: login(), refreshToken()
 * SCENARIOS: All scenarios - maintains clean token database
 * FEATURES: Removes expired tokens, removes revoked tokens, performance logging
 */
const cleanupRefreshTokens = async (userId: number): Promise<void> => {
  try {
    // Count tokens before cleanup for logging
    const beforeCount = await RefreshToken.count({
      where: { userId }
    });

    // Remove expired tokens
    const expiredDeleted = await RefreshToken.destroy({
      where: {
        userId,
        expiresAt: {
          [require('sequelize').Op.lt]: new Date(),
        },
      },
    });

    // Remove revoked tokens
    const revokedDeleted = await RefreshToken.destroy({
      where: {
        userId,
        isRevoked: true,
      },
    });

    // Only log if tokens were actually cleaned up
    if (expiredDeleted > 0 || revokedDeleted > 0) {
      console.log(`🧹 Cleaned up ${expiredDeleted} expired and ${revokedDeleted} revoked tokens for user ID: ${userId}`);
    }
  } catch (error) {
    console.error('❌ Error cleaning up refresh tokens:', error);
  }
};

/**
 * Limit refresh tokens per user for security
 * Performance optimization: only limits when necessary
 * @param userId - User ID to check
 * 
 * CALLED BY: refreshToken()
 * SCENARIOS: Token refresh - prevents excessive active sessions
 * FEATURES: Enforces token limits, deletes oldest tokens, security logging
 */
const limitRefreshTokens = async (userId: number): Promise<void> => {
  try {
    const tokenCount = await RefreshToken.count({
      where: {
        userId,
        isRevoked: false,
        expiresAt: {
          [require('sequelize').Op.gt]: new Date(),
        },
      },
    });

    console.log(`🔍 Token limit check for user ID: ${userId} - Current tokens: ${tokenCount}, Max allowed: ${JWT_CONFIG.MAX_REFRESH_TOKENS_PER_USER}`);

    // Only limit if we exceed the maximum
    if (tokenCount > JWT_CONFIG.MAX_REFRESH_TOKENS_PER_USER) {
      // Find oldest tokens to delete
      const oldestTokens = await RefreshToken.findAll({
        where: {
          userId,
          isRevoked: false,
          expiresAt: {
            [require('sequelize').Op.gt]: new Date(),
          },
        },
        order: [['createdAt', 'ASC']],
        limit: tokenCount - JWT_CONFIG.MAX_REFRESH_TOKENS_PER_USER + 1,
      });

      console.log(`🔍 Found ${oldestTokens.length} oldest tokens to delete for user ID: ${userId}`);

      // Actually delete the oldest tokens (not just mark as revoked)
      for (const token of oldestTokens) {
        await token.destroy();
        console.log(`🗑️ Deleted token ID: ${token.id} for user ID: ${userId}`);
      }

      console.log(`🔒 Limited refresh tokens for user ID: ${userId} (deleted ${oldestTokens.length} oldest tokens)`);
    } else {
      console.log(`✅ Token count within limit for user ID: ${userId}`);
    }
  } catch (error) {
    console.error('❌ Error limiting refresh tokens:', error);
  }
};

/**
 * Authentication Resolvers Object
 * Contains all GraphQL resolvers for authentication operations
 */
export const authResolvers = {

  Query: {
    // Query resolvers would go here if needed
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
      try {
        const { email, password } = input;

        // Enhanced input validation - prevents unnecessary DB queries
        if (!email || !password) {
          throw new GraphQLError('Email and password are required', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        // Validate email format using centralized regex
        if (!VALIDATION_CONFIG.EMAIL_REGEX.test(email)) {
          throw new GraphQLError('Invalid email format', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        // Find user by email (case-insensitive) with enhanced security
        // Single DB query for user lookup
        const user = await User.findOne({
          where: {
            email: email.toLowerCase().trim(),
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
          maxAge: JWT_CONFIG.REFRESH_TOKEN_EXPIRY_MS, // 7 days
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
      // Get refresh token from httpOnly cookie
      const refreshToken = req.cookies.jid;
      if (!refreshToken) {
        throw new GraphQLError('Refresh token is required', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

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
    },
  },
}; 