import { GraphQLError } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User, RefreshToken } from '../../db';
import { GraphQLContext } from '../context';

/**
 * Authentication Resolvers
 * Handles login, logout, and token refresh operations
 */

// JWT configuration - required environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '1d'; // 1 day expiry

// Validate required environment variables
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

/**
 * Generate JWT access token
 * @param userId - User ID to encode in token
 * @returns JWT access token
 */
const generateAccessToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

/**
 * Generate refresh token (random string, not JWT)
 * @param userId - User ID for the token
 * @returns Random refresh token string
 */
const generateRefreshToken = (userId: number): string => {
  // Generate a random token instead of JWT for better security
  return require('crypto').randomBytes(64).toString('hex');
};

/**
 * Hash refresh token for storage
 * @param token - Raw refresh token
 * @returns Hashed token
 */
const hashRefreshToken = async (token: string): Promise<string> => {
  return bcrypt.hash(token, 12);
};

/**
 * Verify refresh token hash
 * @param token - Raw refresh token
 * @param hash - Stored hash
 * @returns Boolean indicating if token matches hash
 */
const verifyRefreshTokenHash = async (token: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(token, hash);
};

/**
 * Authentication Resolvers
 */
export const authResolvers = {
  Query: {
    /**
     * Get current authenticated user
     * Requires valid JWT token in Authorization header
     */
    currentUser: async (_: any, __: any, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      return context.user;
    },
  },

  Mutation: {
    /**
     * User registration with email, password, and name
     * Returns access token and refresh token
     */
    register: async (_: any, { input }: { input: { email: string; password: string; firstName: string; lastName: string } }) => {
      try {
        const { email, password, firstName, lastName } = input;

        // Validate input
        if (!email || !password || !firstName || !lastName) {
          throw new GraphQLError('All fields are required', {
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

        // Create new user
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

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Hash refresh token for storage
        const tokenHash = await hashRefreshToken(refreshToken);

        // Store refresh token in database
        await RefreshToken.create({
          id: uuidv4(),
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          isRevoked: false,
        });

        return {
          accessToken,
          refreshToken,
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
        console.error('Registration error:', error);
        throw new GraphQLError('Registration failed', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    /**
     * User login with email and password
     * Returns access token and refresh token
     */
    login: async (_: any, { input }: { input: { email: string; password: string } }) => {
      try {
        const { email, password } = input;

        // Validate input
        if (!email || !password) {
          throw new GraphQLError('Email and password are required', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        // Find user by email (case-insensitive)
        const user = await User.findOne({
          where: {
            email: email.toLowerCase().trim(),
            isDeleted: false,
          },
        });

        if (!user) {
          throw new GraphQLError('Invalid email or password', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        // Verify password
        if (!user.password) {
          throw new GraphQLError('Invalid email or password', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        
        // Verify password
        const isValidPassword = await user.comparePassword(password);
        
        if (!isValidPassword) {
          throw new GraphQLError('Invalid email or password', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Hash refresh token for storage
        const tokenHash = await hashRefreshToken(refreshToken);

        // Store refresh token in database
        await RefreshToken.create({
          id: uuidv4(),
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          isRevoked: false,
        });

        return {
          accessToken,
          refreshToken,
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
        console.error('Login error:', error);
        throw new GraphQLError('Login failed', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    /**
     * Refresh access token using refresh token
     * Returns new access token and refresh token
     */
    refreshToken: async (_: any, { input }: { input: { refreshToken: string } }) => {
      try {
        const { refreshToken } = input;

        if (!refreshToken) {
          throw new GraphQLError('Refresh token is required', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        // Hash the provided refresh token to find it in database
        const tokenHash = await hashRefreshToken(refreshToken);

        // Find refresh token in database by hash
        const storedToken = await RefreshToken.findOne({
          where: {
            tokenHash,
            isRevoked: false,
            expiresAt: {
              [require('sequelize').Op.gt]: new Date(),
            },
          },
          include: [{ model: User, as: 'user' }],
        });

        if (!storedToken || !storedToken.user) {
          throw new GraphQLError('Invalid refresh token', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        // Verify token hash
        const isValidHash = await verifyRefreshTokenHash(refreshToken, storedToken.tokenHash);
        if (!isValidHash) {
          throw new GraphQLError('Invalid refresh token', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        // Generate new tokens
        const newAccessToken = generateAccessToken(storedToken.user.id);
        const newRefreshToken = generateRefreshToken(storedToken.user.id);

        // Hash new refresh token
        const newTokenHash = await hashRefreshToken(newRefreshToken);

        // Revoke old token and store new one
        await storedToken.update({ isRevoked: true });
        await RefreshToken.create({
          id: uuidv4(),
          userId: storedToken.user.id,
          tokenHash: newTokenHash,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          isRevoked: false,
        });

        return {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        };
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        console.error('Token refresh error:', error);
        throw new GraphQLError('Token refresh failed', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    /**
     * User logout - revokes refresh tokens
     * Requires authentication
     */
    logout: async (_: any, __: any, context: GraphQLContext) => {
      try {
        if (!context.user) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        // Revoke all refresh tokens for the user
        await RefreshToken.update(
          { isRevoked: true },
          {
            where: {
              userId: context.user.id,
              isRevoked: false,
            },
          }
        );

        return {
          success: true,
          message: 'Successfully logged out',
        };
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        console.error('Logout error:', error);
        throw new GraphQLError('Logout failed', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
  },
}; 