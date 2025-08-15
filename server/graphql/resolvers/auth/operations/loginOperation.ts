/**
 * Login Operation Module
 * Handles user authentication and login operations
 * Follows GraphQL and Apollo Server best practices
 */

import { GraphQLError } from 'graphql';
import { v4 as uuidv4 } from 'uuid';
import { JWT_CONFIG, AUTH_CONFIG } from '../../../../constants';
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
export const login = async (input: { email: string; password: string }, res: any, req: any) => {
  // Server: Login operation called
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
      throw new GraphQLError(AUTH_OPERATIONS_CONFIG.ERROR_MESSAGES.INVALID_CREDENTIALS, {
        extensions: { code: AUTH_OPERATIONS_TYPES.ERROR_CODES.UNAUTHENTICATED },
      });
    }

    // Verify password with enhanced security
    if (!user.password) {
      throw new GraphQLError(AUTH_OPERATIONS_CONFIG.ERROR_MESSAGES.INVALID_CREDENTIALS, {
        extensions: { code: AUTH_OPERATIONS_TYPES.ERROR_CODES.UNAUTHENTICATED },
      });
    }
    
    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
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



    // Reject login if user has reached the maximum number of active sessions
    if (currentTokenCount >= JWT_CONFIG.MAX_REFRESH_TOKENS_PER_USER) {
      throw new GraphQLError(`${AUTH_OPERATIONS_CONFIG.ERROR_MESSAGES.TOO_MANY_SESSIONS} (${JWT_CONFIG.MAX_REFRESH_TOKENS_PER_USER}). Please log out from another device to continue.`, {
        extensions: { code: AUTH_OPERATIONS_TYPES.ERROR_CODES.TOO_MANY_SESSIONS },
      });
    }

    // Generate tokens with enhanced security
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Hash refresh token for storage
    const tokenHash = await hashRefreshToken(refreshToken);



    // Store refresh token in database with 8-hour expiry
    await RefreshToken.create({
      id: uuidv4(),
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + JWT_CONFIG.REFRESH_TOKEN_EXPIRY_MS), // 8 hours for database
      isRevoked: false,
    });



    // Set refresh token as httpOnly cookie
    // Cookie expiry should match database expiry (8 hours) to ensure session persistence across browser refreshes
    // The client-side timer (1 minute) is for UI countdown, not cookie expiry
    const cookieMaxAge = JWT_CONFIG.REFRESH_TOKEN_EXPIRY_MS; // 8 hours to match database expiry
    
    // Use consistent cookie configuration from constants
    const cookieConfig = {
      ...AUTH_CONFIG.COOKIE_OPTIONS,
      maxAge: cookieMaxAge, // 8 hours to ensure session persistence
    };
    
    // Setting refresh token cookie with config
    res.cookie(AUTH_OPERATIONS_CONFIG.REFRESH_TOKEN_COOKIE_NAME, refreshToken, cookieConfig);
    
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


    
    // Return accessToken, refreshToken, CSRF token, and user as required by GraphQL schema
    return responseData;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError(AUTH_OPERATIONS_CONFIG.ERROR_MESSAGES.LOGIN_FAILED, {
      extensions: { code: AUTH_OPERATIONS_TYPES.ERROR_CODES.INTERNAL_SERVER_ERROR },
    });
  }
};
