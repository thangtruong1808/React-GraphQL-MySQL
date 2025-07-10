import { GraphQLError } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User, RefreshToken } from '../../db';
import { GraphQLContext } from '../context';
import { 
  JWT_CONFIG, 
  AUTH_CONFIG, 
  VALIDATION_CONFIG, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES 
} from '../../constants';

/**
 * Enhanced Authentication Resolvers
 * Handles login, logout, and token refresh operations with security measures
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
 */
const generateRefreshToken = (userId: number): string => {
  // Generate a cryptographically secure random token
  return require('crypto').randomBytes(AUTH_CONFIG.REFRESH_TOKEN_BYTES).toString('hex');
};

/**
 * Hash refresh token for storage with enhanced security
 * @param token - Raw refresh token
 * @returns Hashed token
 */
const hashRefreshToken = async (token: string): Promise<string> => {
  return bcrypt.hash(token, AUTH_CONFIG.BCRYPT_ROUNDS);
};

/**
 * Verify refresh token hash with enhanced security
 * @param token - Raw refresh token
 * @param hash - Stored hash
 * @returns Boolean indicating if token matches hash
 */
const verifyRefreshTokenHash = async (token: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(token, hash);
};

/**
 * Clean up expired and revoked refresh tokens
 * @param userId - User ID to clean tokens for
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
 * @param userId - User ID to check
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

    // Only limit if we exceed the maximum
    if (tokenCount > JWT_CONFIG.MAX_REFRESH_TOKENS_PER_USER) {
      // Remove oldest tokens
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

      for (const token of oldestTokens) {
        await token.update({ isRevoked: true });
      }

      console.log(`🔒 Limited refresh tokens for user ID: ${userId} (removed ${oldestTokens.length} oldest tokens)`);
    }
  } catch (error) {
    console.error('❌ Error limiting refresh tokens:', error);
  }
};

/**
 * Enhanced Authentication Resolvers
 */
export const authResolvers = {
  Query: {
    /**
     * Get current authenticated user with enhanced security
     * Requires valid JWT token in Authorization header
     */
    currentUser: async (_: any, __: any, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Return user data without sensitive information
      return {
        id: context.user.id.toString(),
        uuid: context.user.uuid,
        email: context.user.email,
        firstName: context.user.firstName,
        lastName: context.user.lastName,
        role: context.user.role,
        isDeleted: context.user.isDeleted,
        version: context.user.version,
        createdAt: context.user.createdAt.toISOString(),
        updatedAt: context.user.updatedAt.toISOString(),
      };
    },
  },

  Mutation: {
    /**
     * Enhanced user registration with email, password, and name
     * Returns access token and sets refresh token as httpOnly cookie
     */
    register: async (_: any, { input }: { input: { email: string; password: string; firstName: string; lastName: string } }, { res }: { res: any }) => {
      try {
        const { email, password, firstName, lastName } = input;

        // Enhanced input validation
        if (!email || !password || !firstName || !lastName) {
          throw new GraphQLError(ERROR_MESSAGES.ALL_FIELDS_REQUIRED, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        // Validate email format
        if (!VALIDATION_CONFIG.EMAIL_REGEX.test(email)) {
          throw new GraphQLError(ERROR_MESSAGES.INVALID_EMAIL_FORMAT, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        // Validate password strength
        if (password.length < AUTH_CONFIG.MIN_PASSWORD_LENGTH) {
          throw new GraphQLError(ERROR_MESSAGES.PASSWORD_TOO_WEAK, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        // Validate name length
        if (firstName.length < VALIDATION_CONFIG.NAME_MIN_LENGTH || firstName.length > VALIDATION_CONFIG.NAME_MAX_LENGTH) {
          throw new GraphQLError(ERROR_MESSAGES.NAME_TOO_SHORT, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        if (lastName.length < VALIDATION_CONFIG.NAME_MIN_LENGTH || lastName.length > VALIDATION_CONFIG.NAME_MAX_LENGTH) {
          throw new GraphQLError(ERROR_MESSAGES.NAME_TOO_LONG, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
          where: {
            email: email.toLowerCase().trim(),
          },
        });

        if (existingUser) {
          throw new GraphQLError('Email already registered', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        // Create new user with enhanced security
        const user = await User.create({
          uuid: uuidv4(),
          email: email.toLowerCase().trim(),
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role: 'DEVELOPER', // Default role
          isDeleted: false,
          version: 1,
        });

        // Generate tokens with enhanced security
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Hash refresh token for storage
        const tokenHash = await hashRefreshToken(refreshToken);

        // Store refresh token in database with cleanup
        await RefreshToken.create({
          id: uuidv4(),
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + JWT_CONFIG.REFRESH_TOKEN_EXPIRY_MS), // 7 days
          isRevoked: false,
        });

        // Clean up expired tokens only
        await cleanupRefreshTokens(user.id);

        // Limit refresh tokens per user only if needed
        await limitRefreshTokens(user.id);

        console.log(`✅ Registration successful for user ID: ${user.id}`);

        // Set refresh token as httpOnly cookie
        res.cookie('jid', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/graphql',
          maxAge: JWT_CONFIG.REFRESH_TOKEN_EXPIRY_MS, // 7 days
        });
        
        // Return accessToken, refreshToken, and user as required by GraphQL schema
        return {
          accessToken,
          refreshToken, // Include refresh token in response
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
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        console.error('❌ Registration error:', error);
        throw new GraphQLError('Registration failed', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    /**
     * Enhanced user login with email and password
     * Returns access token and sets refresh token as httpOnly cookie
     */
    login: async (_: any, { input }: { input: { email: string; password: string } }, { res }: { res: any }) => {
      try {
        const { email, password } = input;

        // Enhanced input validation
        if (!email || !password) {
          throw new GraphQLError('Email and password are required', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new GraphQLError('Invalid email format', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        // Find user by email (case-insensitive) with enhanced security
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

        // Clean up expired tokens only (not all tokens)
        await cleanupRefreshTokens(user.id);

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
          expiresAt: new Date(Date.now() + JWT_CONFIG.REFRESH_TOKEN_EXPIRY_MS), // 7 days
          isRevoked: false,
        });

        // Limit refresh tokens per user only if needed
        await limitRefreshTokens(user.id);

        console.log(`✅ Login successful for user ID: ${user.id}`);

        // Set refresh token as httpOnly cookie
        res.cookie('jid', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/graphql',
          maxAge: JWT_CONFIG.REFRESH_TOKEN_EXPIRY_MS, // 7 days
        });
        
        // Prepare response data
        const responseData = {
          accessToken,
          refreshToken, // Include refresh token in response
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
          hasUser: !!responseData.user,
          userId: responseData.user.id,
          userEmail: responseData.user.email
        });
        
        // Return accessToken, refreshToken, and user as required by GraphQL schema
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
     * Returns new access token and sets new refresh token as httpOnly cookie
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

      // Find all valid refresh tokens and verify each one with enhanced security
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

      let validToken: any = null;
      let validUser: any = null;

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
        path: '/graphql',
        maxAge: JWT_CONFIG.REFRESH_TOKEN_EXPIRY_MS, // 7 days
      });
      // Return only new accessToken
      return {
        accessToken: newAccessToken,
      };
    },

    /**
     * Enhanced user logout - clears refresh token cookie
     */
    logout: async (_: any, __: any, context: GraphQLContext) => {
      try {
        if (!context.user) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        console.log(`🚪 Logging out user ID: ${context.user.id}`);

        // Clear the refresh token cookie
        context.res.clearCookie('jid', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/graphql',
        });
        return {
          success: true,
          message: 'Successfully logged out',
        };
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        console.error('❌ Logout error:', error);
        throw new GraphQLError('Logout failed', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
  },
}; 