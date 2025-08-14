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
export const login = async (input: { email: string; password: string }, res: any, req: any) => {
  console.log('🔄 Server: Login operation called with email:', input.email);
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
    // Cookie expiry remains at 2 minutes for client-side functionality
    // The database expires_at field is 8 hours for long-term session management
    const cookieMaxAge = 2 * 60 * 1000; // 2 minutes in milliseconds for cookie
    
    // Debug: Log request details to understand cookie domain/path issues
    console.log('🔄 Server: Request details for cookie setting:', {
      host: req.headers.host,
      origin: req.headers.origin,
      referer: req.headers.referer,
      userAgent: req.headers['user-agent']
    });
    
    // Use consistent cookie configuration from constants
    const cookieConfig = {
      httpOnly: true,
      secure: false, // Must be false for localhost development
      sameSite: 'lax' as const, // Use 'lax' for cross-port development
      path: '/',
      maxAge: cookieMaxAge, // Extended expiry to allow "Continue to Work"
      // No domain setting - allows cross-port cookie sharing in development
    };
    
    console.log('🔄 Server: Setting refresh token cookie with config:', {
      name: AUTH_OPERATIONS_CONFIG.REFRESH_TOKEN_COOKIE_NAME,
      ...cookieConfig
    });
    
    res.cookie(AUTH_OPERATIONS_CONFIG.REFRESH_TOKEN_COOKIE_NAME, refreshToken, cookieConfig);
    
    console.log('🔄 Server: Refresh token cookie set successfully');
    
    // Debug: Check if cookie was actually set in response headers
    console.log('🔄 Server: Response headers after setting cookie:', {
      'set-cookie': res.getHeaders()['set-cookie']
    });
    
    // Debug: Check if cookie was actually set in response
    const setCookieHeader = res.getHeaders()['set-cookie'];
    console.log('🔄 Server: Set-Cookie header value:', setCookieHeader);
    console.log('🔄 Server: Set-Cookie header type:', typeof setCookieHeader);
    console.log('🔄 Server: Set-Cookie header length:', Array.isArray(setCookieHeader) ? setCookieHeader.length : 'not array');
    
    // Debug: Log the actual cookie that was set
    console.log('🔄 Server: Cookie details set:', {
      name: AUTH_OPERATIONS_CONFIG.REFRESH_TOKEN_COOKIE_NAME,
      value: refreshToken ? `${refreshToken.substring(0, 10)}...` : 'null',
      maxAge: cookieMaxAge,
      path: cookieConfig.path,
      httpOnly: cookieConfig.httpOnly,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite
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
