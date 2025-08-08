/**
 * Login Operation Module
 * Handles user authentication and login operations
 * Follows GraphQL and Apollo Server best practices
 */

import { GraphQLError } from 'graphql';
import { v4 as uuidv4 } from 'uuid';
import { JWT_CONFIG } from '../../../../constants';
import { RefreshToken, User } from '../../../../db';
import { setCSRFToken } from '../../../../auth/csrf';
import { generateAccessToken, generateRefreshToken, hashRefreshToken } from '../tokenManager';
import { cleanupRefreshTokens } from '../tokenCleanup';
import { validateLoginCredentials, sanitizeEmail } from '../validation';
import { AUTH_OPERATIONS_CONFIG, AUTH_OPERATIONS_TYPES } from './constants';

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
      console.log(`${AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.ERROR} Login attempt with non-existent email: ${email}`);
      throw new GraphQLError(AUTH_OPERATIONS_CONFIG.ERROR_MESSAGES.INVALID_CREDENTIALS, {
        extensions: { code: AUTH_OPERATIONS_TYPES.ERROR_CODES.UNAUTHENTICATED },
      });
    }

    // Verify password with enhanced security
    if (!user.password) {
      console.log(`${AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.ERROR} User ${user.id} has no password set`);
      throw new GraphQLError(AUTH_OPERATIONS_CONFIG.ERROR_MESSAGES.INVALID_CREDENTIALS, {
        extensions: { code: AUTH_OPERATIONS_TYPES.ERROR_CODES.UNAUTHENTICATED },
      });
    }
    
    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      console.log(`${AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.ERROR} Invalid password for user ID: ${user.id}`);
      throw new GraphQLError(AUTH_OPERATIONS_CONFIG.ERROR_MESSAGES.INVALID_CREDENTIALS, {
        extensions: { code: AUTH_OPERATIONS_TYPES.ERROR_CODES.UNAUTHENTICATED },
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

    console.log(`${AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.INFO} Pre-login token check for user ID: ${user.id} - Current tokens: ${currentTokenCount}, Max allowed: ${JWT_CONFIG.MAX_REFRESH_TOKENS_PER_USER}`);

    // Reject login if user has reached the maximum number of active sessions
    if (currentTokenCount >= JWT_CONFIG.MAX_REFRESH_TOKENS_PER_USER) {
      console.log(`${AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.ERROR} User ID: ${user.id} has reached maximum active sessions (${currentTokenCount}/${JWT_CONFIG.MAX_REFRESH_TOKENS_PER_USER})`);
      throw new GraphQLError(`${AUTH_OPERATIONS_CONFIG.ERROR_MESSAGES.TOO_MANY_SESSIONS} (${JWT_CONFIG.MAX_REFRESH_TOKENS_PER_USER}). Please log out from another device to continue.`, {
        extensions: { code: AUTH_OPERATIONS_TYPES.ERROR_CODES.TOO_MANY_SESSIONS },
      });
    }

    // Generate tokens with enhanced security
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Hash refresh token for storage
    const tokenHash = await hashRefreshToken(refreshToken);

    console.log(`${AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.LOGIN} Storing refresh token for user ID: ${user.id}`);

    // Store refresh token in database
    await RefreshToken.create({
      id: uuidv4(),
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + JWT_CONFIG.REFRESH_TOKEN_EXPIRY_MS),
      isRevoked: false,
    });

    console.log(`${AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.SUCCESS} Login successful for user ID: ${user.id}`);

    // Set refresh token as httpOnly cookie
    res.cookie(AUTH_OPERATIONS_CONFIG.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: AUTH_OPERATIONS_CONFIG.COOKIE_SECURE,
      sameSite: AUTH_OPERATIONS_CONFIG.COOKIE_SAME_SITE,
      path: AUTH_OPERATIONS_CONFIG.COOKIE_PATH,
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
    if (AUTH_OPERATIONS_CONFIG.DEBUG.ENABLE_LOGGING) {
      console.log(`${AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.INFO} Login response data:`, {
        hasAccessToken: !!responseData.accessToken,
        hasRefreshToken: !!responseData.refreshToken,
        hasCSRFToken: !!responseData.csrfToken,
        hasUser: !!responseData.user,
        userId: responseData.user.id,
        userEmail: responseData.user.email
      });
    }
    
    // Return accessToken, refreshToken, CSRF token, and user as required by GraphQL schema
    return responseData;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    console.error(`${AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.ERROR} Login error:`, error);
    throw new GraphQLError(AUTH_OPERATIONS_CONFIG.ERROR_MESSAGES.LOGIN_FAILED, {
      extensions: { code: AUTH_OPERATIONS_TYPES.ERROR_CODES.INTERNAL_SERVER_ERROR },
    });
  }
};
